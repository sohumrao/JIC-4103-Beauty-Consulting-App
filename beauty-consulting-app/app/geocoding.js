import axios from "axios";
import handleHTTPError from "./errorHandling";

/**
 * Handles any and all geocoding utilies.
 * Technically our API doesn't allow us to store results, so this is the compromise.
 */

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

/*
 * returns [boolean, string] with validity and city if valid
 *
 * returns boolean based on increasingly specificity of address passed
 *
 * two modes:
 * * only zip passed, will return true if it finds a city corresponding
 * * full address passed, will return if it ~roughly~ finds that address
 */
export const validateAddress = async (address, streetPassed) => {
	try {
		const requestInfo =
			"key=" +
			process.env.EXPO_PUBLIC_GEOCODING_API_KEY +
			"&location=" +
			address;
		const request = geocodingAPI_LOOKUP_URL + requestInfo;
		const response = await axios.get(request);
		const data = response.data;
		if (streetPassed) {
			// TODO: make this more robust in terms of matching,
			// right now it just validates there is a street address kind of there
			// api is a little silly
			const street = data.results[0].locations[0].street;
			return [street != "", address];
		} else {
			city = data.results[0].locations[0].adminArea5;
			state = data.results[0].locations[0].adminArea3;
			return [city != "", city + " " + state];
		}
	} catch (error) {
		handleHTTPError(error);
		return [false, ""];
	}
};
