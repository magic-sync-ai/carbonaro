// popup.js - handles interaction with the extension's popup, sends requests to the
// service worker (background.js), and updates the popup's UI (popup.html) on completion.

const sendHtmlButton = document.getElementById('fetchHtml');
const dropHtmlButton = document.getElementById('dropHtml');

// Event listener for the button click
sendHtmlButton.addEventListener('click', async () => {
    try {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (chrome.runtime.lastError) {
                throw new Error(chrome.runtime.lastError.message);
            }
            chrome.tabs.sendMessage(tabs[0].id, {action: "fetchHTML"}, function(response) {
                if (chrome.runtime.lastError) {
                    throw new Error(chrome.runtime.lastError.message);
                }
                // Log the response
                console.log('Response received:', response);
            });
        });
        return;
    } catch (error) {
        console.error('An error occurred:', error);
    }
});

// Event listener for the "Fetch Drop HTML" button click
dropHtmlButton.addEventListener('click', async () => {
    try {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (chrome.runtime.lastError) {
                throw new Error(chrome.runtime.lastError.message);
            }
            chrome.tabs.sendMessage(tabs[0].id, {action: "dropHTML"}, function(response) {
                if (chrome.runtime.lastError) {
                    throw new Error(chrome.runtime.lastError.message);
                }
                // Log the response
                console.log('Response received:', response);
            });
        });
        return;
    } catch (error) {
        console.error('An error occurred:', error);
    }
});