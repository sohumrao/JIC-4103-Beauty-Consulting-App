import React from "react";
import { Calendar } from "react-native-calendars";
import moment from "moment";

const MyCalendar = () => {
	const currentDate = moment().format("YYYY-MM-DD");
	const minDate = moment()
		.subtract(1, "month")
		.startOf("month")
		.format("YYYY-MM-DD");
	const maxDate = moment()
		.add(1, "month")
		.endOf("month")
		.format("YYYY-MM-DD");

	return (
		<Calendar
			current={currentDate}
			minDate={moment()
				.subtract(1, "month")
				.startOf("month")
				.format("YYYY-MM-DD")}
			maxDate={moment()
				.add(1, "month")
				.endOf("month")
				.format("YYYY-MM-DD")}
			onDayPress={(day) => {
				console.log("selected day", day);
			}}
		/>
	);
};

export default MyCalendar;
