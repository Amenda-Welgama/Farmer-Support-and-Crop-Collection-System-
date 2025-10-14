// Update with your backend server IP or localhost if using emulator.
// This file now supports multiple ways to configure the base URL:
// 1. Set process.env.API_BASE (bundlers / CI)
// 2. For Expo, set extra.API_BASE in app.json / app.config.js and it will be available
//    through expo-constants (Constants.expoConfig.extra.API_BASE or Constants.manifest.extra.API_BASE).
// 3. If none provided, RAW_API_BASE is used if valid.
// 4. Final fallback is platform-aware: Android emulator -> 10.0.2.2, iOS simulator / Node -> localhost.

const RAW_API_BASE = "http://10.37.121.44:5000/api";

function isValidUrl(url) {
	try {
		const u = new URL(url);
		return u.protocol === 'http:' || u.protocol === 'https:';
	} catch (e) {
		return false;
	}
}

// Try to read environment-provided API base (process.env)
const envApiBase = (typeof process !== 'undefined' && process.env && process.env.API_BASE) ? process.env.API_BASE : null;

// Try to read Expo Constants extra if available (works when running under Expo and configured)
let expoApiBase = null;
try {
	// require inside try to avoid crashing Node when expo-constants is not installed
	const Constants = require('expo-constants');
	// expo SDKs expose extra in different places depending on version
	expoApiBase = (Constants.expoConfig && Constants.expoConfig.extra && Constants.expoConfig.extra.API_BASE) ||
							 (Constants.manifest && Constants.manifest.extra && Constants.manifest.extra.API_BASE) ||
							 null;
} catch (e) {
	expoApiBase = null;
}

// Determine platform when possible to choose the correct emulator host
let platform = null;
try {
	const { Platform } = require('react-native');
	platform = Platform && Platform.OS ? Platform.OS : null;
} catch (e) {
	platform = null; // not running in RN environment (e.g., during Node checks)
}

const finalFallback = platform === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api';

// Priority: explicit env -> expo extra -> raw configured -> platform fallback
let resolved = envApiBase || expoApiBase || RAW_API_BASE;
if (!isValidUrl(resolved)) {
	resolved = finalFallback;
}

export const API_BASE = resolved;

export default API_BASE;
