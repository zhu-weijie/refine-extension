function hideBlockedJobs() {
    chrome.storage.sync.get(['blockedItems'], (result) => {
        if (!result.blockedItems || !Array.isArray(result.blockedItems) || result.blockedItems.length === 0) {
            return; 
        }

        const blockedItems = result.blockedItems.map(item => item.toUpperCase());

        const jobCardSelector = 'div[data-testid="job-card"]';
        const companyNameSelector = 'p[data-testid="company-hire-info"]';

        const jobCards = document.querySelectorAll(jobCardSelector);

        jobCards.forEach(card => {
            if (card.style.display === 'none') {
                return;
            }

            const companyNameElement = card.querySelector(companyNameSelector);

            if (companyNameElement) {
                const companyName = companyNameElement.innerText.trim().toUpperCase();

                if (blockedItems.includes(companyName)) {
                    console.log(`Refine: Hiding job from "${companyNameElement.innerText.trim()}"`);
                    card.style.display = 'none';
                }
            }
        });
    });
}

const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            hideBlockedJobs();
            break;
        }
    }
});

observer.observe(document.body, { 
    childList: true,
    subtree: true
});

hideBlockedJobs();
