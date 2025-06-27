document.addEventListener('DOMContentLoaded', () => {
    const companyListTextArea = document.getElementById('companyList');
    const keywordListTextArea = document.getElementById('keywordList');
    const saveButton = document.getElementById('saveButton');
    const statusDiv = document.getElementById('status');

    const processList = (textArea) => {
        return textArea.value.split('\n')
            .map(item => item.trim())
            .filter(item => item.length > 0)
            .sort((a, b) => a.localeCompare(b));
    };

    chrome.storage.sync.get(['blockedCompanies', 'blockedKeywords'], (result) => {
        if (chrome.runtime.lastError) return;
        
        if (result.blockedCompanies) {
            companyListTextArea.value = result.blockedCompanies.join('\n');
        }
        if (result.blockedKeywords) {
            keywordListTextArea.value = result.blockedKeywords.join('\n');
        }
    });

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
                
                companyListTextArea.value = sortedCompanies.join('\n');
                keywordListTextArea.value = sortedKeywords.join('\n');
            }
            
            setTimeout(() => { statusDiv.textContent = ''; }, 2500);
        });
    });
});
