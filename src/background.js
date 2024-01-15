

// Define WebSocketClient for managing WebSocket connections
let WebSocketClient = {
    ws: null,
    connected: false,

    open: function(url) {
        this.ws = new WebSocket(url);
        this.ws.onopen = this.onOpen;
        this.ws.onclose = this.onClose;
        this.ws.onmessage = this.onMessage;
        this.ws.onerror = this.onError;
    },

    close: function() {
        if (this.ws) {
            console.log('CLOSING ...');
            this.ws.close();
        }
        this.connected = false;
    },

    send: function(message) {
        if (this.connected) {
            this.ws.send(message);
        }
    },

    onOpen: function() {
        console.log('WebSocket OPENED');
        WebSocketClient.connected = true;
    },

    onClose: function() {
        console.log('WebSocket CLOSED');
        WebSocketClient.ws = null;
        WebSocketClient.connected = false;
    },

    onMessage: function(event) {
        console.log('MESSAGE: ' + event.data);
        // Get the current active tab and send the message to its content script
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs.length > 0) {
                chrome.tabs.sendMessage(tabs[0].id, {action: "fillHTML", data: event.data});
            }
        });
    },

    onError: function(event) {
        console.error('WebSocket ERROR: ' + event.data);
    }
};

// Automatically open WebSocket connection
WebSocketClient.open('ws://localhost:8080');

chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        id: "MagicSync",
        title: "MagicSync Colector",
        contexts: ["all"]
    });

    // New context menu item
    chrome.contextMenus.create({
        id: "MagicSyncFill",  // Unique identifier for the new menu item
        title: "MagicSync Drop",  // The text to be displayed for the new menu item
        contexts: ["all"]  // Contexts where the new menu item will appear
    });
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "fetchHTML") {  // Check if the request contains 'fetchHTML'
        // Acknowledge receipt of the message to content.js
        sendResponse({message: "HTML received in the background.js"});
    
        // Fetch the HTML from the content script
        const html = request.html;
        const action = request.action;

        // Send the HTML to your local server
        fetch('http://127.0.0.1:5000/receive_html', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({action: action, html: html})
        })
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    } else if (request.action === "dropHTML") {  // Check if the request contains 'dropHTML'
        // Acknowledge receipt of the message to content.js
        sendResponse({message: "HTML received in the background.js"});
    
        // Fetch the HTML from the content script
        const html = request.html;
        const action = request.action;

        // Send the HTML to your local server
        fetch('http://127.0.0.1:5000/receive_html', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({action: action, html: html})
        })
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));   
    } else if (request.action === "open") {
        WebSocketClient.open('ws://localhost:8080');

    } else if (request.action === "send") {
        WebSocketClient.send(request.message);

    } else if (request.action === "close") {
        WebSocketClient.close();

    // Add more actions as needed
    } else {
        console.log("No action specified");
    }
});



chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (tab && tab.id >= 0) {
        if (info.menuItemId === "MagicSync") {
            // Send a message for the MagicSync action
            chrome.tabs.sendMessage(tab.id, {action: "fetchHTML"});
        } else if (info.menuItemId === "MagicSyncFill") {
            // Send a different message for the new action
            chrome.tabs.sendMessage(tab.id, {action: "dropHTML"});
        }
    }
});
