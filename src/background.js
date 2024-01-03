

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


// function setupWebSocket() {
//     const socket = io('http://127.0.0.1:5000');

//     socket.on('connect', function() {
//         console.log('WebSocket connection established');
//     });

//     // Handler for receiving pipeline JSON string
//     socket.on('receive_pipeline', function(pipelineJsonStr) {
//         console.log('Received pipeline JSON:', pipelineJsonStr);
//         // Process the received pipeline JSON string as needed
//     });

//     return socket;
// }

// const webSocket = setupWebSocket();
