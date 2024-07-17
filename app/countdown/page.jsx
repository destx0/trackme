"use client";
import React from "react";
import TimePicker from "./TimePicker";

export default function TimerPage() {
	const handleTimeChange = (time) => {
		console.log("Selected time:", time);
		// Here you can handle the selected time, e.g., start a countdown
	};

	return (
		<div className="flex justify-center items-center h-screen">
			<TimePicker onTimeChange={handleTimeChange} />
		</div>
	);
}
