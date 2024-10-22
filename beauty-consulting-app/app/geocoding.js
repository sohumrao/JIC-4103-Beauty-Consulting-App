import axios from "axios";
import handleHTTPError from "./errorHandling";

/**
 * Handles any and all geocoding utilies.
 * Technically our API doesn't allow us to store results, so this is the compromise.
 */

// this is for lookups
const geocodingAPI_LOOKUP_URL =
	"https://www.mapquestapi.com/geocoding/v1/address?";

export const getCityFromZIP = async (zipCode) => {
	try {
		const requestInfo =
			"key=" +
			process.env.EXPO_PUBLIC_GEOCODING_API_KEY +
			"location=" +
			zipCode;
		const request = geocodingAPI_LOOKUP_URL + requestInfo;
		const response = await axios.get(request);
		const data = response.data;
		city = data.results[0].locations[0].adminArea5;
		state = data.results[0].location[0].adminArea3;

		console.log(city, state); // debugging

		return { city: city, state: state };
	} catch (error) {
		handleHTTPError(error);
	}
};

export const validateAddress = async (address) => {
	try {
		const requestInfo =
			"key=" +
			process.env.EXPO_PUBLIC_GEOCODING_API_KEY +
			"&location=" +
			address;
		const request = geocodingAPI_LOOKUP_URL + requestInfo;
		const response = await axios.get(request);

		console.log(response); // debug

		return true;
	} catch (error) {
		handleHTTPError(error);
		return false;
	}
};
