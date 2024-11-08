import axios from "axios";
import handleHTTPError from "utils/errorHandling.js";

/**
 * Handles any and all geocoding utilies.
 * Technically our API doesn't allow us to store results, so this is the compromise.
 */

const geocodingAPI = axios.create({
	baseURL: "https://www.mapquestapi.com/geocoding/v1/address",
	params: {
		key: process.env.EXPO_PUBLIC_GEOCODING_API_KEY,
	},
});

export const getCityFromZIP = async (zipCode) => {
	try {
		const response = await geocodingAPI.get("", {
			params: { location: zipCode },
		});
		const data = response.data;
		const city = data.results[0].locations[0].adminArea5;
		const state = data.results[0].locations[0].adminArea3;
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
		const response = await geocodingAPI.get("", {
			params: { location: address },
		});
		const data = response.data;
		if (streetPassed) {
			// TODO: make this more robust in terms of matching,
			// right now it just validates there is a street address kind of there
			// api is a little silly
			const street = data.results[0].locations[0].street;
			return [street != "", address];
		} else {
			const city = data.results[0].locations[0].adminArea5;
			const state = data.results[0].locations[0].adminArea3;
			return [city != "", city + " " + state, city];
		}
	} catch (error) {
		handleHTTPError(error);
		return [false, ""];
	}
};

export const getCoordsOfLocation = async (address) => {
	try {
		const response = await geocodingAPI.get("", {
			params: { location: address },
		});
		const data = response.data;
		const lat = data.results[0].locations[0].latLng.lat;
		const long = data.results[0].locations[0].latLng.long;
		return [true, lat, long];
	} catch (error) {
		handleHTTPError(error);
		return [false, null];
	}
};
