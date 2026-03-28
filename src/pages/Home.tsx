import type {UseQueryResult} from '@tanstack/react-query'
import {
	experimental_streamedQuery as streamedQuery,
	useQuery
} from '@tanstack/react-query'
import type {FormEvent} from 'react'
import {useState} from 'react'
import {Streamdown} from 'streamdown'
import type {SearchResult} from '@/api/search'
import {fetchSearchResults, searchQuery} from '@/api/search'
import {Head} from '@/components/Head'

const topNavItems = [
	'產品介紹',
	'健康生活',
	'友邦峻宇',
	'客戶支援',
	'友邦概況',
	'網上投保'
]

export function Home() {
	// What is the difference of AIA SelectWise and AIA Priviledge Ultra
	const [query, setQuery] = useState('')

	const searchResultQuery: UseQueryResult<SearchResult[]> = useQuery({
		enabled: false,
		queryFn: () => fetchSearchResults(query),
		queryKey: ['search-results'],
		retry: false
	})

	const summaryQuery = useQuery({
		enabled: false,
		queryFn: streamedQuery({
			initialValue: '',
			reducer: (accumulator, chunk) => accumulator + chunk,
			streamFn: () => searchQuery(query)
		}),
		queryKey: ['search-summary'],
		retry: false
	})

	function handleSearch(
		event: FormEvent<HTMLFormElement> | FormEvent<HTMLButtonElement>
	) {
		event.preventDefault()
		if (!query.trim() || summaryQuery.isFetching) return
		searchResultQuery.refetch()
		summaryQuery.refetch()
	}

	return (
		<>
			<Head title='Home' />
			<div className='min-h-screen bg-zinc-100 text-zinc-700'>
				<header className='bg-[rgb(211,17,69)]'>
					<div className='mx-auto max-w-[1180px] px-6'>
						<nav className='flex min-h-20 items-center rounded-b-xl bg-white px-6'>
							<img
								alt='AIA'
								className='mr-6 shrink-0 object-contain'
								height={50}
								src='https://www.aia.com.hk/content/dam/group-wise/images/system/icons/aia-logo-red.svg'
								width={50}
							/>
							<ul className='hidden gap-6 font-medium text-sm min-[900px]:flex'>
								{topNavItems.map(item => (
									<li key={item}>{item}</li>
								))}
							</ul>
							<div className='ml-auto flex items-center gap-4 text-sm'>
								<span className='hidden sm:inline'>en</span>
								<button
									className='rounded-md border border-rose-500 px-5 py-2 text-rose-600'
									type='button'
								>
									登入
								</button>
								<button
									className='rounded-md bg-rose-600 px-5 py-2 font-semibold text-white'
									type='button'
								>
									聯絡我們
								</button>
							</div>
						</nav>
					</div>

					<div className='relative overflow-hidden px-6 pt-12 pb-14'>
						<div className='mx-auto max-w-5xl'>
							<h1 className='font-bold text-6xl text-white'>搜索結果</h1>
							<form
								className='mt-6 flex max-w-[640px] items-center rounded-full bg-zinc-100 px-5 py-4'
								onSubmit={handleSearch}
							>
								<svg
									aria-hidden='true'
									className='h-6 w-6 text-zinc-400'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									viewBox='0 0 24 24'
								>
									<circle cx='11' cy='11' r='7' />
									<path d='m20 20-3.5-3.5' />
								</svg>
								<input
									aria-label='Search query'
									className='ml-3 w-full bg-transparent text-lg text-zinc-600 outline-none'
									name='Query input'
									onChange={event => setQuery(event.target.value.trim())}
									type='text'
									value={query}
								/>
							</form>
						</div>
						<div className='pointer-events-none absolute top-0 right-0 hidden h-full w-[420px] lg:block'>
							<div className='absolute top-10 right-4 h-56 w-72 rotate-12 bg-rose-200/70 [clip-path:polygon(12%_18%,95%_8%,65%_62%,14%_81%)]' />
							<div className='absolute top-24 right-10 h-64 w-80 -rotate-6 bg-rose-300/70 [clip-path:polygon(22%_6%,97%_20%,79%_90%,8%_80%)]' />
							<div className='absolute top-24 right-0 h-64 w-80 bg-rose-100/70 [clip-path:polygon(8%_20%,87%_2%,98%_74%,20%_86%)]' />
						</div>
					</div>
				</header>

				<section className='mx-auto max-w-5xl pt-12 pr-6 pb-10'>
					<h2 className='font-semibold text-5xl text-zinc-700'>所有結果</h2>
					<div className='mt-8 rounded-xl bg-white p-6 shadow-sm'>
						<div className='mb-4 flex items-center justify-between'>
							<h3 className='font-semibold text-2xl text-zinc-800'>AI 摘要</h3>
						</div>

						{summaryQuery.data && (
							<Streamdown animated={true} caret='block'>
								{summaryQuery.data}
							</Streamdown>
						)}

						{!(summaryQuery.data || summaryQuery.isFetching) && (
							<p className='text-zinc-500'>
								Search above to stream an AI summary.
							</p>
						)}

						{summaryQuery.isFetching && !summaryQuery.data && (
							<span className='animate-pulse'>▋</span>
						)}

						{/* Error case */}
						{summaryQuery.isError && (
							<p className='text-rose-700'>
								Unable to generate AI summary. Please try again later.
							</p>
						)}
					</div>
					{/* Search results */}
					{(searchResultQuery.data ||
						searchResultQuery.isFetching ||
						searchResultQuery.isError) && (
						<div className='mt-6'>
							{searchResultQuery.isError && (
								<p className='text-rose-700'>
									Unable to load search results. Please try again later.
								</p>
							)}
							{searchResultQuery.isFetching && (
								// Skeleton loader
								<div className='space-y-4'>
									{(['a', 'b', 'c'] as const).map(id => (
										<div
											className='flex animate-pulse gap-4 rounded-xl bg-white p-4 shadow-sm'
											key={id}
										>
											<div className='h-28 w-36 shrink-0 rounded-lg bg-zinc-200' />
											<div className='flex-1 space-y-2 py-1'>
												<div className='h-4 w-1/2 rounded bg-zinc-200' />
												<div className='h-3 w-full rounded bg-zinc-200' />
												<div className='h-3 w-4/5 rounded bg-zinc-200' />
											</div>
										</div>
									))}
								</div>
							)}
							{searchResultQuery.isFetched &&
								searchResultQuery.data &&
								searchResultQuery.data.length === 0 && (
									<p className='text-zinc-500'>No results found.</p>
								)}
							{searchResultQuery.isFetched &&
								searchResultQuery.data &&
								searchResultQuery.data.length > 0 && (
									<ul className='divide-y divide-zinc-100 rounded-xl bg-white shadow-sm'>
										{searchResultQuery.data.map(result => (
											<li className='flex gap-4 p-4' key={result.externalLink}>
												{result.thumbnail && (
													<a
														className='shrink-0'
														href={result.externalLink}
														rel='noreferrer noopener'
														target='_blank'
													>
														<img
															alt={result.title}
															className='h-28 w-40 rounded-lg object-cover'
															height={112}
															src={`data:image/jpeg;base64,${result.thumbnail}`}
															width={160}
														/>
													</a>
												)}
												<div className='min-w-0 flex-1'>
													<a
														className='font-semibold text-xl text-zinc-800 hover:underline cursor-pointer'
														href={result.externalLink}
														rel='noreferrer noopener'
														target='_blank'
													>
														{result.title}
													</a>
													<p className='mt-5 line-clamp-3 text-sm text-zinc-500'>
														{result.chunk}
													</p>
												</div>
											</li>
										))}
									</ul>
								)}
						</div>
					)}
				</section>
			</div>
		</>
	)
}
