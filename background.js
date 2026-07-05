// background.js

chrome.action.onClicked.addListener((tab) => {
    // Open the game in a new tab when the extension icon is clicked
    chrome.tabs.create({ url: chrome.runtime.getURL("game/index.html") });
});

// Listen for network errors that indicate offline status
chrome.webNavigation.onErrorOccurred.addListener((details) => {
    // Check if it's the main frame that failed to load
    if (details.frameId === 0) {
        // Typical offline errors
        const offlineErrors = ["net::ERR_INTERNET_DISCONNECTED", "net::ERR_NAME_NOT_RESOLVED"];
        if (offlineErrors.includes(details.error)) {
            // Redirect to our game
            chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL("game/index.html") });
        }
    }
});
