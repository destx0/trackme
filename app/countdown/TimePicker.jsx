import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const TimePicker = ({ onTimeChange }) => {
	const [seconds, setSeconds] = useState(30 * 60); // Default to 30 minutes
	const [task, setTask] = useState("");

	const handleTimeChange = (changeInSeconds) => {
		setSeconds((prevSeconds) => {
			const newSeconds = Math.max(0, prevSeconds + changeInSeconds);
			return newSeconds <= 24 * 60 * 60 ? newSeconds : prevSeconds;
		});
	};

	useEffect(() => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		onTimeChange({ hours, minutes, task });
	}, [seconds, task, onTimeChange]);

	const TimeButton = ({ children, onClick }) => (
		<motion.button
			whileTap={{ scale: 0.95 }}
			className="px-2 py-1 bg-red-500 text-white rounded-full text-xs font-semibold shadow-md"
			onClick={onClick}
		>
			{children}
		</motion.button>
	);

	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);

	return (
		<div className="flex flex-col items-center bg-gray-100 p-6 rounded-3xl shadow-lg transform perspective-1000 rotate-x-5 hover:rotate-x-0 transition-transform duration-300">
			<div className="flex space-x-4 mb-4">
				<TimeButton onClick={() => handleTimeChange(-3600)}>
					-1h
				</TimeButton>
				<TimeButton onClick={() => handleTimeChange(-1800)}>
					-30m
				</TimeButton>
				<TimeButton onClick={() => handleTimeChange(-900)}>
					-15m
				</TimeButton>
			</div>
			<div className="flex space-x-8">
				<TimeUnit
					value={hours}
					onChange={(change) => handleTimeChange(change * 3600)}
					label="Hours"
					max={23}
				/>
				<TimeUnit
					value={minutes}
					onChange={(change) => handleTimeChange(change * 60)}
					label="Minutes"
					max={59}
					step={5}
				/>
			</div>
			<div className="flex space-x-4 mt-4">
				<TimeButton onClick={() => handleTimeChange(3600)}>
					+1h
				</TimeButton>
				<TimeButton onClick={() => handleTimeChange(1800)}>
					+30m
				</TimeButton>
				<TimeButton onClick={() => handleTimeChange(900)}>
					+15m
				</TimeButton>
			</div>
			<input
				type="text"
				value={task}
				onChange={(e) => setTask(e.target.value)}
				placeholder="Enter task..."
				className="mt-6 p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
			/>
		</div>
	);
};

const TimeUnit = ({ value, onChange, label, max, step = 1 }) => {
	const handleWheel = (e) => {
		e.preventDefault();
		onChange(e.deltaY > 0 ? -step : step);
	};

	return (
		<div className="flex flex-col items-center w-24">
			<motion.div
				onWheel={handleWheel}
				className="select-none cursor-pointer"
			>
				<motion.button
					whileTap={{ scale: 0.95 }}
					className="text-4xl font-bold text-red-500 focus:outline-none w-full"
					onClick={() => onChange(step)}
				>
					▲
				</motion.button>
				<motion.div
					key={value}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-6xl font-bold my-2 text-center"
				>
					{value.toString().padStart(2, "0")}
				</motion.div>
				<motion.button
					whileTap={{ scale: 0.95 }}
					className="text-4xl font-bold text-red-500 focus:outline-none w-full"
					onClick={() => onChange(-step)}
				>
					▼
				</motion.button>
			</motion.div>
			<div className="text-sm text-gray-500 mt-1">{label}</div>
		</div>
	);
};

export default TimePicker;
