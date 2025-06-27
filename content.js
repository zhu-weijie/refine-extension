if (window.hasRunRefineScript) {

} else {
    window.hasRunRefineScript = true;

    console.log("Refine: Content script injected and running for the first time.");

    const siteConfigs = {
        "www.mycareersfuture.gov.sg": {
            jobCardSelector: 'div[data-testid="job-card"]',
            companyNameSelector: 'p[data-testid="company-hire-info"]',
        }
    };

    function hideBlockedJobs(config, blockedItems) {
        console.log("Refine: hideBlockedJobs function is running.");
        const jobCards = document.querySelectorAll(config.jobCardSelector);
        
        if (jobCards.length === 0) {
            console.log("Refine: Found 0 job cards. The selector might be wrong or content hasn't loaded.");
        }

        jobCards.forEach(card => {
            if (card.dataset.refineHidden === 'true') return;
            const companyNameElement = card.querySelector(config.companyNameSelector);
            if (companyNameElement) {
                const companyName = companyNameElement.innerText.trim().toUpperCase();
                if (blockedItems.includes(companyName)) {
                    console.log(`Refine: Hiding job from "${companyName}"`);
                    card.style.display = 'none';
                    card.dataset.refineHidden = 'true';
                }
            }
        });
    }

    (() => {
        const currentHostname = window.location.hostname;
        const config = siteConfigs[currentHostname];
        if (!config) return;

        console.log("Refine: Configuration found. Attempting to get block list from storage.");

        chrome.storage.sync.get(['blockedItems'], (result) => {
            if (chrome.runtime.lastError) {
                console.error("Refine Error:", chrome.runtime.lastError);
                return;
            }

            if (!result.blockedItems || result.blockedItems.length === 0) {
                console.log("Refine: Block list is empty or not found in storage.");
                return;
            }
            
            const blockedItems = result.blockedItems.map(item => item.toUpperCase());
            console.log("Refine: Block list loaded:", blockedItems);
            
            hideBlockedJobs(config, blockedItems);
            setInterval(() => {
                hideBlockedJobs(config, blockedItems);
            }, 1000);
        });
    })();
}
