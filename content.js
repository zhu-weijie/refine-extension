if (window.hasRunRefineScript) {
} else {
    window.hasRunRefineScript = true;

    const siteConfigs = {
        "www.mycareersfuture.gov.sg": {
            jobCardSelector: 'div[data-testid="job-card"]',
            companyNameSelector: 'p[data-testid="company-hire-info"]',
            jobTitleSelector: '[data-testid="job-card__job-title"]'
        }
    };

    function hideBlockedJobs(config, blockedCompanies, blockedKeywords) {
        const jobCards = document.querySelectorAll(config.jobCardSelector);
        jobCards.forEach(card => {
            if (card.dataset.refineHidden === 'true') return;

            const companyNameElement = card.querySelector(config.companyNameSelector);
            let shouldHide = false;
            let reason = '';

            if (companyNameElement && blockedCompanies.length > 0) {
                const companyName = companyNameElement.innerText.trim().toUpperCase();
                if (blockedCompanies.includes(companyName)) {
                    shouldHide = true;
                    reason = `company match: ${companyNameElement.innerText.trim()}`;
                }
            }

            if (!shouldHide && blockedKeywords.length > 0) {
                const jobTitleElement = card.querySelector(config.jobTitleSelector);
                if (jobTitleElement) {
                    const jobTitle = jobTitleElement.innerText.trim().toUpperCase();
                    for (const keyword of blockedKeywords) {
                        if (jobTitle.includes(keyword)) {
                            shouldHide = true;
                            reason = `keyword match: ${keyword}`;
                            break;
                        }
                    }
                }
            }

            if (shouldHide) {
                console.log(`Refine: Hiding job due to ${reason}`);
                card.style.display = 'none';
                card.dataset.refineHidden = 'true';
            }
        });
    }

    (() => {
        const config = siteConfigs[window.location.hostname];
        if (!config) return;

        chrome.storage.sync.get(['blockedCompanies', 'blockedKeywords'], (result) => {
            if (chrome.runtime.lastError) return;

            const companies = (result.blockedCompanies || []).map(c => c.toUpperCase());
            const keywords = (result.blockedKeywords || []).map(k => k.toUpperCase());
            
            if (companies.length === 0 && keywords.length === 0) return;
            
            const runHide = () => hideBlockedJobs(config, companies, keywords);

            runHide();
            setInterval(runHide, 750);
        });
    })();
}
