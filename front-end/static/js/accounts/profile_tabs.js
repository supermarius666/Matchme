document.addEventListener('DOMContentLoaded', function() {
    console.log("profile_tabs.js loaded and executing.");

    function switchTab(clickedButton) {
        if (!clickedButton) return;

        const tabContainer = clickedButton.closest('.profile-tabs');
        if (!tabContainer) {
            console.warn("No .profile-tabs container found for the clicked button.", clickedButton);
            return;
        }

        const tabButtons = tabContainer.querySelectorAll('.tab-button');
        const tabContents = tabContainer.querySelectorAll('.tab-content');
        const targetTabId = clickedButton.dataset.tab;

        console.log("Switching tab to:", targetTabId);

        tabButtons.forEach(button => button.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        clickedButton.classList.add('active');

        const targetContent = tabContainer.querySelector(`#${targetTabId}`);
        if (targetContent) {
            targetContent.classList.add('active');
        } else {
            console.error("Target tab content not found for ID:", targetTabId);
        }
    }

    document.querySelectorAll('.profile-tabs .tab-buttons').forEach(tabButtonsContainer => {
        tabButtonsContainer.addEventListener('click', (event) => {
            const clickedButton = event.target.closest('.tab-button');
            if (clickedButton) {
                switchTab(clickedButton);
            }
        });
    });

    document.querySelectorAll('.profile-tabs').forEach(tabSection => {
        if (tabSection.offsetParent !== null) {
            const initialActiveButton = tabSection.querySelector('.tab-button.active');
            if (initialActiveButton) {
                const targetTabId = initialActiveButton.dataset.tab;
                const targetContent = tabSection.querySelector(`#${targetTabId}`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            } else {
                const firstButton = tabSection.querySelector('.tab-button');
                if (firstButton) {
                    firstButton.classList.add('active');
                    const targetContent = tabSection.querySelector(`#${firstButton.dataset.tab}`);
                    if (targetContent) {
                        targetContent.classList.add('active');
                    }
                }
            }
        }
    });
});