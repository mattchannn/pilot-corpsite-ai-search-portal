import {HttpResponse, http} from 'msw'
import {vi} from 'vitest'
import {server} from '../../mocks/server'
import {searchQuery} from '../search'

const SEARCH_URL = '/ai-summary'
const QUERY =
	'What is the difference of AIA SelectWise and AIA Priviledge Ultra'

describe('AI Search API simulation', () => {
	it('yields answer chunks from the SSE stream', async () => {
		server.use(
			http.post(
				SEARCH_URL,
				() =>
					new HttpResponse(
						makeSseStream([
							sseEvent({event: 'message', answer: 'A'}),
							sseEvent({event: 'message', answer: 'IA'}),
							sseEvent({event: 'message', answer: ' '}),
							sseEvent({event: 'message', answer: 'SelectWise'})
						]),
						{headers: {'Content-Type': 'text/event-stream'}}
					)
			)
		)

		const result = await searchQuery(
			'What is the difference of AIA SelectWise and AIA Priviledge Ultra'
		)
		const chunks: string[] = []
		for await (const chunk of result) {
			chunks.push(chunk)
		}

		expect(chunks).toEqual(['A', 'IA', ' ', 'SelectWise'])
		expect(chunks.join('')).toBe('AIA SelectWise')
	})

	it('throws when the response is not ok', async () => {
		server.use(
			http.post(SEARCH_URL, () => new HttpResponse(null, {status: 500}))
		)

		await expect(searchQuery(QUERY)).rejects.toThrow(
			'Failed to stream response'
		)
	})

	it('throws when the response body is null (streaming not supported)', async () => {
		server.use(
			http.post(SEARCH_URL, () => new HttpResponse(null, {status: 200}))
		)

		await expect(searchQuery(QUERY)).rejects.toThrow(
			'Streaming is not supported in this browser'
		)
	})

	it('logs both the raw payload text and the error object when a stream event contains invalid JSON', async () => {
		const consoleError = vi.spyOn(console, 'error')

		server.use(
			http.post(
				SEARCH_URL,
				() =>
					new HttpResponse(makeSseStream(['data:not-valid-json\n\n']), {
						headers: {'Content-Type': 'text/event-stream'}
					})
			)
		)

		const result = await searchQuery(QUERY)
		for await (const _ of result) {
			/* noop */
			/* we still need that for loop to make the digest call executed */
		}

		expect(consoleError).toHaveBeenNthCalledWith(
			1,
			'Failed to parse stream event',
			'not-valid-json'
		)
		expect(consoleError).toHaveBeenNthCalledWith(2, expect.any(SyntaxError))

		consoleError.mockRestore()
	})
})

function makeSseStream(rawChunks: string[]) {
	const encoder = new TextEncoder()
	return new ReadableStream({
		start(controller) {
			for (const chunk of rawChunks) {
				controller.enqueue(encoder.encode(chunk))
			}
			controller.close()
		}
	})
}

function sseEvent(payload: object) {
	return `event:data\ndata:${JSON.stringify(payload)}\n\n`
}
