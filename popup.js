document.addEventListener('DOMContentLoaded', () => {
    const blockListTextArea = document.getElementById('blockList');
    const saveButton = document.getElementById('saveButton');
    const statusDiv = document.getElementById('status');

    chrome.storage.sync.get(['blockedItems'], (result) => {
        if (chrome.runtime.lastError) {
            console.error("Error loading blocklist:", chrome.runtime.lastError);
            return;
        }
        if (result.blockedItems && Array.isArray(result.blockedItems)) {
            blockListTextArea.value = result.blockedItems.join('\n');
        }
    });

    saveButton.addEventListener('click', () => {
        const itemsText = blockListTextArea.value;
        
        const itemsArray = itemsText.split('\n')
                                     .map(item => item.trim())
                                     .filter(item => item.length > 0);

        const sortedItems = itemsArray.sort((a, b) => a.localeCompare(b));

        chrome.storage.sync.set({ blockedItems: sortedItems }, () => {
            if (chrome.runtime.lastError) {
                console.error("Error saving blocklist:", chrome.runtime.lastError);
                statusDiv.textContent = 'Error saving!';
                statusDiv.style.color = 'red';
            } else {
                console.log("Blocklist saved and sorted.");
                statusDiv.textContent = 'List saved and sorted!';
                statusDiv.style.color = 'green';
                
                blockListTextArea.value = sortedItems.join('\n');
            }
            
            setTimeout(() => {
                statusDiv.textContent = '';
            }, 2500);
        });
    });
});
