import React from 'react';
import { IoMdTrash } from 'react-icons/io';

interface TodoItemProps {
	todo: {
		id: number;
		title: string;
		completed: boolean;
	};
	deleteTask: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, deleteTask }) => {
	return (
		<li
			key={todo.id}
			className='flex items-center justify-between border-r-2 border-l-2 border-b-emerald-700 border-t-2 border-t-transparent border-b-2 p-1.5 shadow-md hover:border-t-emerald-700 transition-colors duration-300'
		>
			<div className='flex items-center gap-3'>
				<input
					type='checkbox'
					checked={todo.completed}
					readOnly
					className='peer hidden'
				/>
				<label
					className='w-5 h-5 flex items-center justify-center border-2 border-gray-400 rounded cursor-pointer 
  peer-checked:bg-green-500 peer-checked:border-green-500 transition-all duration-300'
				>
					{todo.completed === true && '✓'}
				</label>
				<span className={todo.completed ? 'line-through text-gray-500' : ''}>
					{todo.title}
				</span>
			</div>
			<button
				className='text-red-500 cursor-pointer'
				onClick={() => deleteTask(todo.id)}
			>
				<IoMdTrash />
			</button>
		</li>
	);
};

export default TodoItem;
