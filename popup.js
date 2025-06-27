document.addEventListener('DOMContentLoaded', () => {
    const companyListTextArea = document.getElementById('companyList');
    const keywordListTextArea = document.getElementById('keywordList');
    const saveButton = document.getElementById('saveButton');
    const exportButton = document.getElementById('exportButton');
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

    exportButton.addEventListener('click', () => {
        chrome.storage.sync.get(['blockedCompanies', 'blockedKeywords'], (result) => {
            if (chrome.runtime.lastError) {
                console.error("Error fetching lists for export:", chrome.runtime.lastError);
                statusDiv.textContent = 'Error fetching data!';
                statusDiv.style.color = 'red';
                return;
            }

            const backupData = {
                blockedCompanies: result.blockedCompanies || [],
                blockedKeywords: result.blockedKeywords || []
            };

            const jsonString = JSON.stringify(backupData, null, 2);

            const blob = new Blob([jsonString], { type: 'application/json' });

            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `refine-backup-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            statusDiv.textContent = 'Backup file downloaded!';
            statusDiv.style.color = 'green';
            setTimeout(() => { statusDiv.textContent = ''; }, 2500);
        });
    });
});
