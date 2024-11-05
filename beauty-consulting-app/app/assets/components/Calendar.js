import React, { useState } from "react";
import { Calendar } from "react-native-calendars";
import moment from "moment";

const MyCalendar = ({ onDaySelect }) => {
	const currentDate = moment().format("YYYY-MM-DD");
	const minDate = currentDate;
	const maxDate = moment()
		.add(1, "month")
		.endOf("month")
		.format("YYYY-MM-DD");

	const [selectedDay, setSelectedDay] = useState("");
	return (
		<Calendar
			minDate={currentDate}
			maxDate={moment()
				.add(1, "month")
				.endOf("month")
				.format("YYYY-MM-DD")}
			onDayPress={(day) => {
				console.log("selected day", day);
				setSelectedDay(day.dateString);
				onDaySelect(day);
			}}
			markedDates={{
				[selectedDay]: {
					selected: true,
					selectedColor: "#FF5252",
					selectedTextColor: "#FFF",
				},
			}}
		/>
	);
};

export default MyCalendar;
