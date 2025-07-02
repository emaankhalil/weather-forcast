# Weather Forecast Chrome Extension

A Chrome extension that provides quick and easy access to weather forecast information with current conditions and a 5-day forecast.

## Features

- Current weather display with temperature, "feels like" temperature, weather condition, humidity, wind speed, and pressure
- Automatic location detection using geolocation
- Manual location input (city name, zip code, or address)
- 5-day weather forecast
- Temperature unit switching (Celsius/Fahrenheit)
- Persistent settings storage
- Refresh functionality

## Installation and Testing

### Method 1: Load as Unpacked Extension (for testing)

1. **Open Chrome Extensions Page:**
   - Open Google Chrome
   - Navigate to `chrome://extensions/`
   - Or go to Chrome menu → More tools → Extensions

2. **Enable Developer Mode:**
   - Toggle the "Developer mode" switch in the top-right corner

3. **Load the Extension:**
   - Click "Load unpacked" button
   - Navigate to and select the extension folder: `D:\weather loctaion\weather`
   - Click "Select Folder"

4. **Test the Extension:**
   - The extension should appear in your extensions list
   - Click the extension icon in the Chrome toolbar (puzzle piece icon)
   - Pin the Weather Forecast extension for easy access

### Method 2: Package for Distribution

1. **Create Extension Package:**
   - Go to `chrome://extensions/`
   - Click "Pack extension"
   - Select the extension folder as "Extension root directory"
   - Click "Pack Extension"

## Usage

1. **First Use:**
   - Click the Weather Forecast extension icon
   - Allow location permission when prompted (optional)
   - Or manually enter a city name

2. **Features:**
   - **Current Location:** Click the location icon to use GPS
   - **Manual Location:** Type city name and press Enter
   - **Refresh:** Click the refresh icon to update weather data
   - **Units:** Toggle between Celsius and Fahrenheit
   - **Forecast:** View 4-day forecast below current weather

## API Configuration

The extension uses WeatherAPI.com with the following API key (already configured):
- API Key: 520ce25406cb47a093970830250207
- Free tier includes: 1,000,000 calls/month

## File Structure

```
D:\weather loctaion\weather\
├── manifest.json          # Extension configuration
├── popup.html             # Main popup interface
├── popup.css              # Styling
├── popup.js               # Main functionality
├── background.js          # Service worker
├── README.md              # This file
└── icons/                 # Extension icons
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

## Troubleshooting

### Common Issues:

1. **Extension won't load:**
   - Check that all files are present
   - Ensure manifest.json is valid
   - Look for errors in the Extensions page

2. **Weather data not loading:**
   - Check internet connection
   - Verify API key is working
   - Check browser console for errors (F12 → Console)

3. **Location not working:**
   - Allow location permission when prompted
   - Try entering city name manually
   - Check if location services are enabled

4. **Icons not displaying:**
   - Add proper icon files (16x16, 32x32, 48x48, 128x128 pixels)
   - Use PNG format for best compatibility

### Debug Mode:

1. **Open Developer Tools:**
   - Right-click on extension popup → "Inspect"
   - Or F12 when popup is open

2. **Check Service Worker:**
   - Go to `chrome://extensions/`
   - Click "Service worker" under the extension
   - View console logs and errors

## Customization

### Adding New Features:
- Edit `popup.js` for functionality changes
- Modify `popup.html` for UI changes
- Update `popup.css` for styling changes
- Adjust `manifest.json` for permissions or settings

### API Changes:
- Replace API_KEY in `popup.js` if needed
- Modify API_BASE_URL for different weather services
- Update API endpoints in fetch requests

## Browser Compatibility

- Chrome (latest stable versions)
- Chromium-based browsers (Edge, Brave, etc.)
- Requires Manifest V3 support

## Permissions Used

- `storage`: Save user preferences and location
- `geolocation`: Access user's current location
- `host_permissions`: API calls to weather service

## License

This project is for educational/personal use. Weather data provided by WeatherAPI.com.
