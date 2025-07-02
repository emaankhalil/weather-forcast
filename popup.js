// Weather Extension Popup JavaScript
class WeatherExtension {
    constructor() {
        this.API_KEY = '520ce25406cb47a093970830250207';
        this.API_BASE_URL = 'https://api.weatherapi.com/v1';
        this.currentUnit = 'celsius';
        this.currentLocation = '';
        this.weatherData = null;

        this.initializeElements();
        this.bindEvents();
        this.loadSettings();
        this.initialize();
    }

    initializeElements() {
        // UI Elements
        this.elements = {
            loadingState: document.getElementById('loadingState'),
            errorState: document.getElementById('errorState'),
            weatherContent: document.getElementById('weatherContent'),
            errorMessage: document.getElementById('errorMessage'),
            
            // Input elements
            locationInput: document.getElementById('locationInput'),
            useCurrentLocationBtn: document.getElementById('useCurrentLocation'),
            refreshBtn: document.getElementById('refreshBtn'),
            retryBtn: document.getElementById('retryBtn'),
            
            // Weather display elements
            currentLocation: document.getElementById('currentLocation'),
            currentDate: document.getElementById('currentDate'),
            currentWeatherIcon: document.getElementById('currentWeatherIcon'),
            currentTemp: document.getElementById('currentTemp'),
            weatherCondition: document.getElementById('weatherCondition'),
            humidity: document.getElementById('humidity'),
            windSpeed: document.getElementById('windSpeed'),
            sunrise: document.getElementById('sunrise'),
            sunset: document.getElementById('sunset'),
            forecastContainer: document.getElementById('forecastContainer'),
            
            // Unit buttons
            celsiusBtn: document.getElementById('celsiusBtn'),
            fahrenheitBtn: document.getElementById('fahrenheitBtn')
        };
    }

    bindEvents() {
        // Location input events
        if (this.elements.locationInput) {
            this.elements.locationInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchWeather(this.elements.locationInput.value.trim());
                }
            });
        }

        if (this.elements.useCurrentLocationBtn) {
            this.elements.useCurrentLocationBtn.addEventListener('click', () => {
                this.getCurrentLocation();
            });
        }

        // Control buttons
        if (this.elements.refreshBtn) {
            this.elements.refreshBtn.addEventListener('click', () => {
                this.refreshWeather();
            });
        }

        if (this.elements.retryBtn) {
            this.elements.retryBtn.addEventListener('click', () => {
                this.refreshWeather();
            });
        }

        // Unit toggle buttons
        if (this.elements.celsiusBtn) {
            this.elements.celsiusBtn.addEventListener('click', () => {
                this.setUnit('celsius');
            });
        }

        if (this.elements.fahrenheitBtn) {
            this.elements.fahrenheitBtn.addEventListener('click', () => {
                this.setUnit('fahrenheit');
            });
        }
    }

    async initialize() {
        try {
            // Try to load last known location or get current location
            const savedLocation = await this.getSavedLocation();
            if (savedLocation) {
                this.currentLocation = savedLocation;
                if (this.elements.locationInput) {
                    this.elements.locationInput.value = savedLocation;
                }
                await this.fetchWeather(savedLocation);
            } else {
                this.getCurrentLocation();
            }
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Failed to initialize weather data');
        }
    }

    async getCurrentLocation() {
        this.showLoading();
        
        try {
            const position = await this.getGeolocation();
            const { latitude, longitude } = position.coords;
            const location = `${latitude},${longitude}`;
            
            this.currentLocation = location;
            await this.fetchWeather(location);
        } catch (error) {
            console.error('Geolocation error:', error);
            this.showError('Unable to get your location. Please enter a city name manually.');
        }
    }

    getGeolocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                resolve,
                reject,
                { timeout: 10000, enableHighAccuracy: true }
            );
        });
    }

    async searchWeather(query) {
        if (!query.trim()) {
            this.showError('Please enter a location');
            return;
        }

        this.showLoading();
        this.currentLocation = query.trim();
        await this.fetchWeather(this.currentLocation);
    }

    async fetchWeather(location) {
        try {
            // Fetch current weather and forecast
            const [currentResponse, forecastResponse] = await Promise.all([
                fetch(`${this.API_BASE_URL}/current.json?key=${this.API_KEY}&q=${encodeURIComponent(location)}&aqi=no`),
                fetch(`${this.API_BASE_URL}/forecast.json?key=${this.API_KEY}&q=${encodeURIComponent(location)}&days=5&aqi=no&alerts=no`)
            ]);

            if (!currentResponse.ok || !forecastResponse.ok) {
                throw new Error('Location not found');
            }

            const [currentData, forecastData] = await Promise.all([
                currentResponse.json(),
                forecastResponse.json()
            ]);

            this.weatherData = {
                current: currentData,
                forecast: forecastData
            };

            await this.saveLocation(location);
            this.displayWeather();
            
        } catch (error) {
            console.error('Weather fetch error:', error);
            this.showError('Unable to fetch weather data. Please check the location and try again.');
        }
    }

    displayWeather() {
        if (!this.weatherData) return;

        const { current, forecast } = this.weatherData;
        const currentWeather = current.current;
        const locationInfo = current.location;

        // Update location and date
        if (this.elements.currentLocation) {
            this.elements.currentLocation.textContent = `${locationInfo.name}, ${locationInfo.country}`;
        }
        if (this.elements.currentDate) {
            this.elements.currentDate.textContent = new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric'
            });
        }

        // Update location input with the resolved location name
        if (this.elements.locationInput) {
            this.elements.locationInput.value = `${locationInfo.name}, ${locationInfo.region}`;
        }

        // Update current weather
        this.updateCurrentWeather(currentWeather);
        
        // Update forecast
        if (this.elements.forecastContainer) {
            this.updateForecast(forecast.forecast.forecastday);
        }
        
        this.showWeatherContent();
    }

    updateCurrentWeather(weather) {
        const isMetric = this.currentUnit === 'celsius';
        const temp = isMetric ? weather.temp_c : weather.temp_f;
        const windSpeed = isMetric ? `${weather.wind_kph} km/h` : `${weather.wind_mph} mph`;
        const tempUnit = isMetric ? '°C' : '°F';

        // Update elements that exist in the new HTML structure
        if (this.elements.currentWeatherIcon) {
            this.elements.currentWeatherIcon.src = `https:${weather.condition.icon}`;
        }
        if (this.elements.currentTemp) {
            this.elements.currentTemp.textContent = `${Math.round(temp)}${tempUnit}`;
        }
        if (this.elements.weatherCondition) {
            this.elements.weatherCondition.textContent = weather.condition.text;
        }
        if (this.elements.humidity) {
            this.elements.humidity.textContent = `${weather.humidity}%`;
        }
        if (this.elements.windSpeed) {
            this.elements.windSpeed.textContent = windSpeed;
        }
        
        // Get sunrise/sunset from forecast data if available
        if (this.weatherData && this.weatherData.forecast) {
            const todayForecast = this.weatherData.forecast.forecast.forecastday[0];
            if (todayForecast && todayForecast.astro) {
                if (this.elements.sunrise) {
                    this.elements.sunrise.textContent = todayForecast.astro.sunrise;
                }
                if (this.elements.sunset) {
                    this.elements.sunset.textContent = todayForecast.astro.sunset;
                }
            }
        }
    }

    updateForecast(forecastDays) {
        this.elements.forecastContainer.innerHTML = '';
        
        forecastDays.forEach((day, index) => {
            if (index === 0) return; // Skip today
            
            const forecastItem = this.createForecastItem(day);
            this.elements.forecastContainer.appendChild(forecastItem);
        });
    }

    createForecastItem(dayData) {
        const isMetric = this.currentUnit === 'celsius';
        const maxTemp = isMetric ? dayData.day.maxtemp_c : dayData.day.maxtemp_f;
        const minTemp = isMetric ? dayData.day.mintemp_c : dayData.day.mintemp_f;
        
        const date = new Date(dayData.date);
        const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        
        const item = document.createElement('div');
        item.className = 'forecast-item';
        item.style.cssText = `
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 15px;
            margin: 5px 0;
            text-align: center;
            min-width: 80px;
        `;
        
        item.innerHTML = `
            <div style="font-size: 12px; margin-bottom: 5px;">${time}</div>
            <img src="https:${dayData.day.condition.icon}" alt="${dayData.day.condition.text}" style="width: 30px; height: 30px; margin: 5px auto;">
            <div style="font-weight: bold; margin-bottom: 2px;">${Math.round(maxTemp)}°C</div>
            <div style="font-size: 12px; opacity: 0.8;">${Math.round(minTemp)}°C</div>
        `;
        
        return item;
    }

    async setUnit(unit) {
        this.currentUnit = unit;
        
        // Update UI
        this.elements.celsiusBtn.classList.toggle('active', unit === 'celsius');
        this.elements.fahrenheitBtn.classList.toggle('active', unit === 'fahrenheit');
        
        // Save preference
        await this.saveSettings();
        
        // Update display if we have weather data
        if (this.weatherData) {
            this.displayWeather();
        }
    }

    async refreshWeather() {
        if (this.currentLocation) {
            await this.fetchWeather(this.currentLocation);
        } else {
            this.getCurrentLocation();
        }
    }

    // UI State Management
    showLoading() {
        if (this.elements.loadingState) {
            this.elements.loadingState.classList.remove('hidden');
        }
        if (this.elements.errorState) {
            this.elements.errorState.classList.add('hidden');
        }
        if (this.elements.weatherContent) {
            this.elements.weatherContent.classList.add('hidden');
        }
    }

    showError(message) {
        if (this.elements.errorMessage) {
            this.elements.errorMessage.textContent = message;
        }
        if (this.elements.errorState) {
            this.elements.errorState.classList.remove('hidden');
            // Add shake animation
            this.elements.errorState.classList.add('error-shake');
            setTimeout(() => {
                this.elements.errorState.classList.remove('error-shake');
            }, 500);
        }
        if (this.elements.loadingState) {
            this.elements.loadingState.classList.add('hidden');
        }
        if (this.elements.weatherContent) {
            this.elements.weatherContent.classList.add('hidden');
        }
    }

    showWeatherContent() {
        if (this.elements.weatherContent) {
            this.elements.weatherContent.classList.remove('hidden');
            // Add fade-in animation
            this.elements.weatherContent.classList.add('fade-in');
            setTimeout(() => {
                this.elements.weatherContent.classList.remove('fade-in');
            }, 300);
        }
        if (this.elements.loadingState) {
            this.elements.loadingState.classList.add('hidden');
        }
        if (this.elements.errorState) {
            this.elements.errorState.classList.add('hidden');
        }
    }

    // Storage Management
    async saveSettings() {
        try {
            await chrome.storage.sync.set({
                unit: this.currentUnit
            });
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.sync.get(['unit', 'location']);
            if (result.unit) {
                this.setUnit(result.unit);
            } else {
                this.setUnit('celsius'); // Default to Celsius
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
            this.setUnit('celsius'); // Default fallback
        }
    }

    async saveLocation(location) {
        try {
            await chrome.storage.sync.set({
                location: location
            });
        } catch (error) {
            console.error('Failed to save location:', error);
        }
    }

    async getSavedLocation() {
        try {
            const result = await chrome.storage.sync.get(['location']);
            return result.location;
        } catch (error) {
            console.error('Failed to get saved location:', error);
            return null;
        }
    }
}

// Initialize the extension when the popup loads
document.addEventListener('DOMContentLoaded', () => {
    new WeatherExtension();
});
