import { FillPipeline } from "./pipeline.js";

console.log("Chrome extension go");

function cleanReceivedString(receivedString) {
  // Removing escaped newlines and backslashes

  receivedString = receivedString.replace(/\\"/g, '"').replace(/\\n/g, '');
  // Trim the string to remove any leading or trailing whitespace
  receivedString = receivedString.trim();

  return receivedString
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  (async () => {
    if (request.action === "fetchHTML") {
      // Acknowledge receipt of the message to popup.js
      // sendResponse({message: "Request fetchHTML received"});

      // Then send the HTML data to background.js
      chrome.runtime.sendMessage({action: "fetchHTML", html: document.documentElement.outerHTML}, function(response) {
        if (chrome.runtime.lastError) {
          throw new Error(chrome.runtime.lastError.message);
        }
        console.log(response);
        // Optionally handle any response from background.js
      });
    } else if (request.action === "dropHTML") {
      // Acknowledge receipt of the message to popup.js
      // sendResponse({message: "Request dropHTML received"});

      // Then send the HTML data to background.js
      chrome.runtime.sendMessage({action: "dropHTML", html: document.documentElement.outerHTML}, function(response) {
        if (chrome.runtime.lastError) {
          throw new Error(chrome.runtime.lastError.message);
        }
        console.log(response);
        // Optionally handle any response from background.js
      });
    } else if (request.action === "fillHTML") {
      console.log("Received message from WebSocket:", request.data);
      // Handle the message as needed
      //const cleanedData = cleanReceivedString(request.data);
      //console.log(cleanedData);

      console.log("Processing 'fillForm' request in content.js...");

      // Create and populate the pipeline
      const fillpipeline = new FillPipeline();
      fillpipeline.createPipelineFromJson(request.data);

      // Execute the pipeline
      await fillpipeline.run();
    } else {
      console.log("No specific action");
    }
  })();

  // Return true to indicate that you will send a response asynchronously
  return true;
});
