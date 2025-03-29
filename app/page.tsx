'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Header from '@/components/Header';

import Todo from '@/components/Todo';

import './globals.css';

const queryClient = new QueryClient();

export default function Home() {
	return (
		<QueryClientProvider client={queryClient}>
			<Header />
			<main className='flex-grow py-10'>
				<div className='container'>
					<Todo />
				</div>
			</main>
		</QueryClientProvider>
	);
}
