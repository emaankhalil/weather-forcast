// Background service worker for Weather Extension
chrome.runtime.onInstalled.addListener(() => {
    console.log('Weather Extension installed');
});

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
    console.log('Weather Extension started');
});

// Optional: Handle messages from popup if needed in the future
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Handle any background tasks if needed
    console.log('Message received:', request);
    sendResponse({status: 'received'});
});
