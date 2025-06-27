function injectContentScript(tabId) {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js']
    });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes("mycareersfuture.gov.sg/search")) {
        console.log("Refine background: Detected navigation to MyCareersFuture. Injecting script.");
        injectContentScript(tabId);
    }
});

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    if (details.url && details.url.includes("mycareersfuture.gov.sg/search")) {
        console.log("Refine background: Detected history state update. Re-injecting script.");
        injectContentScript(details.tabId);
    }
});
