document.addEventListener('DOMContentLoaded', () => {
    const blockListTextArea = document.getElementById('blockList');
    const saveButton = document.getElementById('saveButton');
    const statusDiv = document.getElementById('status');

    chrome.storage.sync.get(['blockedItems'], (result) => {
        if (result.blockedItems && Array.isArray(result.blockedItems)) {
            blockListTextArea.value = result.blockedItems.join('\n');
        }
    });

    saveButton.addEventListener('click', () => {
        const itemsText = blockListTextArea.value;
        
        const itemsArray = itemsText.split('\n')
                                     .map(item => item.trim())
                                     .filter(item => item.length > 0);

        chrome.storage.sync.set({ blockedItems: itemsArray }, () => {
            statusDiv.textContent = 'List saved!';
            setTimeout(() => {
                statusDiv.textContent = '';
            }, 2500);
        });
    });
});
