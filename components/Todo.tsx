'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import Loader from './Loader';
import TodoItem from './TodoItem';

const axiosInstance = axios.create({
	baseURL: 'https://jsonplaceholder.typicode.com',
});

const fetchTodos = async (limit: number) => {
	const response = await axiosInstance.get(`/todos?_limit=${limit}`);
	return response.data;
};

const createTodo = async (newTodo: { title: string; completed: boolean }) => {
	const response = await axiosInstance.post('/todos', newTodo);
	return response.data;
};

const deleteTodo = async (id: number) => {
	await axiosInstance.delete(`/todos/${id}`);
};

interface Todo {
	id: number;
	title: string;
	completed: boolean;
}

const Todo = () => {
	const [limit, setLimit] = useState(10);
	const [newTodoTitle, setNewTodoTitle] = useState('');
	const [totalTodos, setTotalTodos] = useState<number | null>(null);

	const queryClient = useQueryClient();

	useEffect(() => {
		const fetchTotalTodos = async () => {
			const response = await axios.get(
				'https://jsonplaceholder.typicode.com/todos'
			);
			setTotalTodos(response.data.length);
		};

		if (totalTodos === null) {
			fetchTotalTodos();
		}
	}, [totalTodos]);

	const {
		data: todos,
		isLoading,
		isError,
		error,
	} = useQuery<Todo[], Error>(['todos', limit], () => fetchTodos(limit), {
		keepPreviousData: true,
	});

	const { mutate: createNewTodo } = useMutation(createTodo, {
		onSuccess: (newTask) => {
			queryClient.setQueryData<Todo[]>(['todos', limit], (oldTasks) =>
				oldTasks ? [...oldTasks, newTask] : [newTask]
			);
		},
	});

	const { mutate: deleteTask } = useMutation((id: number) => deleteTodo(id), {
		onSuccess: (data, variables) => {
			queryClient.setQueryData<Todo[]>(['todos', limit], (oldTasks) =>
				oldTasks ? oldTasks.filter((task) => task.id !== variables) : []
			);
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newTodoTitle) return;
		createNewTodo({ title: newTodoTitle, completed: false });
		setNewTodoTitle('');
	};

	const loadMoreTasks = () => setLimit((prevLimit) => prevLimit + 10);

	const hasMoreTasks = totalTodos !== null && todos?.length !== totalTodos;

	if (isLoading)
		return (
			<div>
				<Loader />
			</div>
		);

	if (isError) return <div>Error: {error?.message}</div>;

	if (!todos) {
		return null;
	}

	return (
		<div className='flex justify-center items-center flex-col'>
			<form
				onSubmit={handleSubmit}
				className='flex justify-center items-center gap-2.5 mb-6'
			>
				<input
					type='text'
					className='border-b-emerald-700 border-2 p-3 bg-emerald-200 w-56 h-10'
					value={newTodoTitle}
					onChange={(e) => setNewTodoTitle(e.target.value)}
					placeholder='add a new task'
				/>
				<button
					type='submit'
					className='bg-emerald-700 cursor-pointer border-b-emerald-700 border-none h-10 w-10 flex justify-center items-center hover:bg-transparent transition-colors duration-300'
				>
					<IoMdAdd />
				</button>
			</form>

			<ul className='w-full max-w-4xl flex flex-col gap-3.5 mb-10'>
				{todos?.map((todo) => (
					<TodoItem key={todo.id} todo={todo} deleteTask={deleteTask} />
				))}
			</ul>

			{hasMoreTasks && (
				<button
					onClick={loadMoreTasks}
					className='bg-emerald-700 cursor-pointer  border-none py-1.5 px-2.5 text-2xl hover:bg-transparent transition-colors duration-300'
				>
					More Tasks
				</button>
			)}
		</div>
	);
};

export default Todo;
