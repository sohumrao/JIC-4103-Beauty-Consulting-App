import React from "react";
import { Calendar } from "react-native-calendars";
import moment from "moment";

const MyCalendar = ({ onDaySelect }) => {
	const currentDate = moment().format("YYYY-MM-DD");
	const minDate = currentDate;
	const maxDate = moment()
		.add(1, "month")
		.endOf("month")
		.format("YYYY-MM-DD");

	return (
		<Calendar
			minDate={currentDate}
			maxDate={moment()
				.add(1, "month")
				.endOf("month")
				.format("YYYY-MM-DD")}
			onDayPress={(day) => {
				console.log("selected day", day);
				onDaySelect(day);
			}}
		/>
	);
};

export default MyCalendar;
