chrome.runtime.onInstalled.addListener(() => {
    console.log("Type Human Extension installed successfully.");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getTextSelection") {
        // Query the active tab and execute a script to read the selected text
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (!tabs[0]) return;
            
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: () => window.getSelection().toString()
            }, (results) => {
                if (results && results[0]) {
                    sendResponse({ selectedText: results[0].result });
                } else {
                    sendResponse({ selectedText: "" });
                }
            });
        });
        return true; // Required to keep the channel open for async response
    }

    if (request.action === "replaceTextSelection") {
        // Replace the selected text on the active page
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (!tabs[0]) return;

            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: (textToInsert) => {
                    const selection = window.getSelection();
                    if (!selection.rangeCount) return false;
                    const range = selection.getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(document.createTextNode(textToInsert));
                    return true;
                },
                args: [request.transformedText]
            }, (results) => {
                sendResponse({ success: true });
            });
        });
        return true;
    }
});