import {delay, HttpResponse, http} from 'msw'
import fruits from './data/fruits.json' with {type: 'json'}

export const handlers = [
	http.get('/fruits', async () => {
		await delay('real')
		return HttpResponse.json(fruits)
	}),
	http.post('/search', () => {
		function makeSseStream(rawChunks: string[]) {
			const encoder = new TextEncoder()
			return new ReadableStream({
				async start(controller) {
					for (const chunk of rawChunks) {
						controller.enqueue(encoder.encode(chunk))
						// biome-ignore lint/performance/noAwaitInLoops: static 180ms delay hence no need to consider performance
						await delay(180)
					}
					controller.close()
				}
			})
		}

		function sseEvent(payload: object) {
			return `event:data\ndata:${JSON.stringify(payload)}\n\n`
		}

		return new HttpResponse(
			makeSseStream([
				sseEvent({event: 'message', answer: '**A'}),
				sseEvent({event: 'message', answer: 'IA'}),
				sseEvent({event: 'message', answer: ' '}),
				sseEvent({event: 'message', answer: 'SelectWise**'}),
				// for readability, we will concat the events together
				sseEvent({
					event: 'message',
					answer:
						' vs **AIA Priviledge Ultra**\n\nBoth **AIA SelectWise** and **AIA Privilege Ultra** are premium VHIS (Voluntary Health Insurance Scheme) plans designed to offer "full cover" (no itemized sub-limits) for major medical expenses.\n\n'
				}),
				sseEvent({
					event: 'message',
					answer:
						'The primary difference lies in their target audience and flexibility: SelectWise is a newer, more "budget-friendly" entry into high-end medical insurance that incentivizes using a specific medical network, while Privilege Ultra is a more traditional high-end plan offering broader geographical choices and higher-tier cancer support.'
				}),
				sseEvent({
					event: 'message',
					answer:
						'For more detail, please refer to the [official site](https://www.aia.com.hk/en).'
				})
			]),
			{
				headers: {
					'Cache-Control': 'no-cache',
					'Content-Type': 'text/event-stream; charset=utf-8'
				},
				status: 200
			}
		)
	})
]
