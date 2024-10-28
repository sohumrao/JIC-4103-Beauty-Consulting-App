import axios from "axios";
import { errorHandler } from "./errors.js";
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

		return { city: city, state: state };
	} catch (error) {
		errorHandler(error);
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
			return [city != "", city + " " + state, city];
		}
	} catch (error) {
		errorHandler(error);
		return [false, ""];
	}
};

export const getCoordsOfLocation = async (address) => {
	try {
		const requestInfo =
			"key=" +
			process.env.EXPO_PUBLIC_GEOCODING_API_KEY +
			"&location=" +
			address;
		const request = geocodingAPI_LOOKUP_URL + requestInfo;
		const response = await axios.get(request);
		const data = response.data;
		const lat = data.results[0].locations[0].latLng.lat;
		const long = data.results[0].locations[0].latLng.lng;
		return [true, lat, long];
	} catch (error) {
		console.error(error);
		errorHandler(error);
		return [false, null];
	}
};

// helper for haversine distance
const toRad = (value) => {
	return (value * Math.PI) / 180;
};

/*
 * given two sets of latitude and longitude, calculates distance between them
 * not fully sure if it works, needs testing
 */
export const haversineDistance = (lat1, long1, lat2, long2) => {
	const FORMULA_TO_KM = 6371;
	const KM_TO_MILES = 0.6213;

	const latDiff = lat2 - lat1;
	const longDiff = long2 - long1;

	const latDiffRad = toRad(latDiff);
	const longDiffRad = toRad(longDiff);

	const lot_o_math =
		Math.sin(latDiffRad / 2) * Math.sin(latDiffRad / 2) +
		Math.cos(toRad(lat1)) *
			Math.cos(toRad(lat2)) *
			Math.sin(longDiffRad / 2) *
			Math.sin(longDiffRad / 2);
	const dist_pre_km =
		2 * Math.atan2(Math.sqrt(lot_o_math), Math.sqrt(1 - lot_o_math));
	const distance_km = FORMULA_TO_KM * dist_pre_km;
	const distance_mile = KM_TO_MILES * distance_km;

	return distance_mile;
};
