// overall ref: https://github.com/TanStack/query/blob/main/examples/react/chat/src/chat.ts
// ========================================================================================
interface StreamPayload {
	answer?: string
}

export interface SearchResult {
	title: string
	// biome-ignore lint/style/useNamingConvention: API spec is defined as `external_link`
	external_link: string
	thumbnail: string
	chunk: string
}

function digest(buffer: string) {
	// SSE events are separated by double newlines (\n\n)
	// ========================================================================
	// Note: there maybe multiple SSE events in a single buffer
	// so we need to split them and process each one in this method separately.
	const eventBlocks = buffer.split('\n\n')

	// The last element in the array is either empty (if the chunk ended perfectly)
	// or a partial event that hasn't finished yet.
	// Keep it in the buffer for the next read() call.
	const [eventBlockRemainer = ''] = eventBlocks.splice(-1)

	const chunks: string[] = []

	for (const eventBlock of eventBlocks) {
		const lines = eventBlock.split('\n')

		for (const line of lines) {
			const trimLine = line.trim()

			// skipping `event:data`
			if (trimLine.startsWith('data:')) {
				// removing `data:` prefix
				const payloadText = trimLine.slice('data:'.length)
				try {
					const payload = JSON.parse(payloadText) as StreamPayload
					const chunk = payload.answer
					if (chunk) {
						chunks.push(chunk)
					}
				} catch (error) {
					// biome-ignore lint/suspicious/noConsole: need to check error in console log, confirmed no data leakage
					console.error('Failed to parse stream event', payloadText)
					// biome-ignore lint/suspicious/noConsole: need to check error in console log, confirmed no data leakage
					console.error(error)
				}
			}
		}
	}

	return {chunks, eventBlockRemainer}
}

export async function fetchSearchResults(
	query: string
): Promise<SearchResult[]> {
	const response = await fetch(import.meta.env.VITE_AI_SEARCH_API_URL, {
		body: JSON.stringify({query}),
		headers: {'Content-Type': 'application/json'},
		method: 'POST'
	})

	if (!response.ok) {
		throw new Error('Failed to fetch search results')
	}

	const data = (await response.json()) as SearchResult[]
	return data
}

export async function searchQuery(query: string) {
	const response = await fetch(import.meta.env.VITE_AI_SUMMARY_API_URL, {
		body: JSON.stringify({query}),
		headers: {'Content-Type': 'application/json'},
		method: 'POST'
	})

	if (!response.ok) {
		throw new Error('Failed to stream response')
	}

	if (!response.body) {
		throw new Error('Streaming is not supported in this browser')
	}

	const responseBody = response.body

	return {
		async *[Symbol.asyncIterator]() {
			const decoder = new TextDecoder()

			let lineBuffer = ''

			for await (const value of responseBody) {
				lineBuffer += decoder.decode(value, {stream: true})

				const {chunks, eventBlockRemainer: remainder} = digest(lineBuffer)

				lineBuffer = remainder
				for (const chunk of chunks) {
					yield chunk
				}
			}
		}
	}
}
