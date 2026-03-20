import {useState} from 'react'
import type {FormEvent} from 'react'
import {
	experimental_streamedQuery as streamedQuery,
	useQuery
} from '@tanstack/react-query'
import {searchQuery} from '@/api/search'
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
	const [query, setQuery] = useState('');

	const summaryQuery = useQuery({
		enabled: false,
		queryFn: streamedQuery({
			initialValue: "",
			reducer: (accumulator, chunk) => accumulator + chunk,
			streamFn: () => searchQuery(query)
		}),
		queryKey: ['search-summary'],
		retry: false
	})

	function handleSearch(event: FormEvent<HTMLFormElement> | FormEvent<HTMLButtonElement>) {
		event.preventDefault()
		if (!query.trim() || summaryQuery.isFetching) return
  	void summaryQuery.refetch()
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
								className='mr-6 h-[50px] w-[50px] shrink-0 object-contain'
								src='https://www.aia.com.hk/content/dam/group-wise/images/system/icons/aia-logo-red.svg'
							/>
							<ul className='hidden min-[900px]:flex gap-6 font-medium text-sm'>
								{topNavItems.map(item => (
									<li key={item}>{item}</li>
								))}
							</ul>
							<div className='ml-auto flex items-center gap-4 text-sm'>
								<span className='hidden sm:inline'>en</span>
								<button className='rounded-md border border-rose-500 px-5 py-2 text-rose-600'>
									登入
								</button>
								<button className='rounded-md bg-rose-600 px-5 py-2 font-semibold text-white'>
									聯絡我們
								</button>
							</div>
						</nav>
					</div>

					<div className='relative overflow-hidden px-6 pb-14 pt-12'>
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
									name='Query input'
									aria-label='Search query'
									className='ml-3 w-full bg-transparent text-lg text-zinc-600 outline-none'
									onChange={event => setQuery(event.target.value.trim())}
									value={query}
									type='text'
								/>
							</form>
						</div>
						<div className='pointer-events-none absolute right-0 top-0 hidden h-full w-[420px] lg:block'>
							<div className='absolute right-4 top-10 h-56 w-72 rotate-12 bg-rose-200/70 [clip-path:polygon(12%_18%,95%_8%,65%_62%,14%_81%)]' />
							<div className='absolute right-10 top-24 h-64 w-80 -rotate-6 bg-rose-300/70 [clip-path:polygon(22%_6%,97%_20%,79%_90%,8%_80%)]' />
							<div className='absolute right-0 top-24 h-64 w-80 bg-rose-100/70 [clip-path:polygon(8%_20%,87%_2%,98%_74%,20%_86%)]' />
						</div>
					</div>
				</header>

				<section className='mx-auto max-w-5xl pr-6 pt-12 pb-10'>
					<h2 className='font-semibold text-5xl text-zinc-700'>所有結果</h2>
					<div className='mt-8 rounded-xl bg-white p-6 shadow-sm'>
						<div className='mb-4 flex items-center justify-between'>
							<h3 className='font-semibold text-2xl text-zinc-800'>AI 摘要</h3>
						</div>

						{summaryQuery.data &&(
							<p className='whitespace-pre-wrap text-base text-zinc-700'>
								{summaryQuery.data}
							</p>
						)}

						{!summaryQuery.data && !summaryQuery.isFetching && (
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
				</section>
			</div>
		</>
	)
}