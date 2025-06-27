document.addEventListener('DOMContentLoaded', () => {
    // Correctly reference the new IDs from popup.html
    const companyListTextArea = document.getElementById('companyList');
    const keywordListTextArea = document.getElementById('keywordList');
    const saveButton = document.getElementById('saveButton');
    const statusDiv = document.getElementById('status');

    // Helper function to process and sort a list from a textarea
    const processList = (textArea) => {
        return textArea.value.split('\n')
            .map(item => item.trim())
            .filter(item => item.length > 0)
            .sort((a, b) => a.localeCompare(b));
    };

    // Load both saved lists when the popup opens
    chrome.storage.sync.get(['blockedCompanies', 'blockedKeywords'], (result) => {
        if (chrome.runtime.lastError) return;
        
        // Use the correct variable for the company list textarea
        if (result.blockedCompanies) {
            companyListTextArea.value = result.blockedCompanies.join('\n');
        }
        // Use the correct variable for the keyword list textarea
        if (result.blockedKeywords) {
            keywordListTextArea.value = result.blockedKeywords.join('\n');
        }
    });

    // Save both lists when the button is clicked
    saveButton.addEventListener('click', () => {
        const sortedCompanies = processList(companyListTextArea);
        const sortedKeywords = processList(keywordListTextArea);

        chrome.storage.sync.set({
            blockedCompanies: sortedCompanies,
            blockedKeywords: sortedKeywords
        }, () => {
            if (chrome.runtime.lastError) {
                statusDiv.textContent = 'Error saving lists!';
                statusDiv.style.color = 'red';
            } else {
                statusDiv.textContent = 'Lists saved and sorted!';
                statusDiv.style.color = 'green';
                
                // Update textareas with the sorted lists
                companyListTextArea.value = sortedCompanies.join('\n');
                keywordListTextArea.value = sortedKeywords.join('\n');
            }
            
            setTimeout(() => { statusDiv.textContent = ''; }, 2500);
        });
    });
});
