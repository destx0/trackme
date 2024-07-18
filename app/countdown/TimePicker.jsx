import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TimePicker = ({ onTimeChange }) => {
	const [seconds, setSeconds] = useState(30 * 60);
	const [task, setTask] = useState("");
	const [isCountingDown, setIsCountingDown] = useState(false);
	const [isPaused, setIsPaused] = useState(false);

	const handleTimeChange = useCallback(
		(changeInSeconds) => {
			if (!isCountingDown) {
				setSeconds((prevSeconds) => {
					const newSeconds = Math.max(
						0,
						prevSeconds + changeInSeconds
					);
					return newSeconds <= 24 * 60 * 60
						? newSeconds
						: prevSeconds;
				});
			}
		},
		[isCountingDown]
	);

	useEffect(() => {
		let interval;
		if (isCountingDown && !isPaused && seconds > 0) {
			interval = setInterval(() => {
				setSeconds((prevSeconds) => prevSeconds - 1);
			}, 1000);
		} else if (seconds === 0) {
			setIsCountingDown(false);
		}
		return () => clearInterval(interval);
	}, [isCountingDown, isPaused, seconds]);

	useEffect(() => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		onTimeChange({ hours, minutes, task });
	}, [seconds, task, onTimeChange]);

	const toggleCountdown = () => {
		if (seconds > 0) {
			setIsCountingDown((prev) => !prev);
			setIsPaused(false);
		}
	};

	const togglePause = () => {
		setIsPaused((prev) => !prev);
	};

	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = seconds % 60;

	const TimeButton = ({ children, onClick, disabled }) => (
		<motion.button
			whileTap={{ scale: 0.95 }}
			className={`px-2 py-1 bg-red-500 text-white rounded-full text-xs font-semibold shadow-md ${
				disabled ? "opacity-50 cursor-not-allowed" : ""
			}`}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</motion.button>
	);

	return (
		<div className="flex flex-col items-center">
			<motion.div
				className={`bg-gray-100 p-6 shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center ${
					isCountingDown
						? "rounded-full w-64 h-64"
						: "rounded-3xl w-auto h-auto"
				}`}
				layout
			>
				<AnimatePresence mode="wait">
					{!isCountingDown && (
						<motion.div
							key="picker"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							transition={{ duration: 0.2 }}
							className="flex flex-col items-center"
						>
							<div className="flex space-x-4 mb-4">
								<TimeButton
									onClick={() => handleTimeChange(-3600)}
									disabled={isCountingDown}
								>
									-1h
								</TimeButton>
								<TimeButton
									onClick={() => handleTimeChange(-1800)}
									disabled={isCountingDown}
								>
									-30m
								</TimeButton>
								<TimeButton
									onClick={() => handleTimeChange(-900)}
									disabled={isCountingDown}
								>
									-15m
								</TimeButton>
							</div>
							<div className="flex space-x-8">
								<TimeUnit
									value={hours}
									onChange={(change) =>
										handleTimeChange(change * 3600)
									}
									label="Hours"
									max={23}
									disabled={isCountingDown}
								/>
								<TimeUnit
									value={minutes}
									onChange={(change) =>
										handleTimeChange(change * 60)
									}
									label="Minutes"
									max={59}
									step={5}
									disabled={isCountingDown}
								/>
							</div>
							<div className="flex space-x-4 mt-4">
								<TimeButton
									onClick={() => handleTimeChange(3600)}
									disabled={isCountingDown}
								>
									+1h
								</TimeButton>
								<TimeButton
									onClick={() => handleTimeChange(1800)}
									disabled={isCountingDown}
								>
									+30m
								</TimeButton>
								<TimeButton
									onClick={() => handleTimeChange(900)}
									disabled={isCountingDown}
								>
									+15m
								</TimeButton>
							</div>
						</motion.div>
					)}
					{isCountingDown && (
						<motion.div
							key="countdown"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							transition={{ duration: 0.2 }}
							className="flex flex-col items-center justify-center"
						>
							<div className="text-6xl font-bold">
								{`${hours.toString().padStart(2, "0")}:${minutes
									.toString()
									.padStart(2, "0")}`}
							</div>
							<div className="text-4xl font-bold mt-2">
								{remainingSeconds.toString().padStart(2, "0")}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>
			<div className="mt-4 flex space-x-4">
				<TimeButton onClick={toggleCountdown}>
					{isCountingDown ? "Stop" : "Start"}
				</TimeButton>
				{isCountingDown && (
					<TimeButton onClick={togglePause}>
						{isPaused ? "Resume" : "Pause"}
					</TimeButton>
				)}
			</div>
			<input
				type="text"
				value={task}
				onChange={(e) => setTask(e.target.value)}
				placeholder="Enter task..."
				className="mt-6 p-2 w-64 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
			/>
		</div>
	);
};

const TimeUnit = ({ value, onChange, label, max, step = 1, disabled }) => {
	const handleWheel = (e) => {
		if (!disabled) {
			e.preventDefault();
			onChange(e.deltaY > 0 ? -step : step);
		}
	};

	return (
		<div className="flex flex-col items-center w-24">
			<motion.div
				onWheel={handleWheel}
				className={`select-none ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
			>
				<motion.button
					whileTap={{ scale: 0.95 }}
					className={`text-4xl font-bold text-red-500 focus:outline-none w-full ${
						disabled ? "opacity-50 cursor-not-allowed" : ""
					}`}
					onClick={() => !disabled && onChange(step)}
					disabled={disabled}
				>
					▲
				</motion.button>
				<motion.div
					key={value}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.1 }}
					className="text-6xl font-bold my-2 text-center"
				>
					{value.toString().padStart(2, "0")}
				</motion.div>
				<motion.button
					whileTap={{ scale: 0.95 }}
					className={`text-4xl font-bold text-red-500 focus:outline-none w-full ${
						disabled ? "opacity-50 cursor-not-allowed" : ""
					}`}
					onClick={() => !disabled && onChange(-step)}
					disabled={disabled}
				>
					▼
				</motion.button>
			</motion.div>
			<div className="text-sm text-gray-500 mt-1">{label}</div>
		</div>
	);
};

export default TimePicker;
