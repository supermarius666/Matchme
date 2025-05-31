// static/js/accounts/profile_tabs.js

document.addEventListener('DOMContentLoaded', function() {
    console.log("profile_tabs.js loaded and executing.");

    // Function to handle tab switching
    function switchTab(clickedButton) {
        if (!clickedButton) return;

        // Find the closest common ancestor for tab buttons and content to handle different sets of tabs
        // (e.g., one set for myProfileView, another for publicPreviewView)
        const tabContainer = clickedButton.closest('.profile-tabs');
        if (!tabContainer) {
            console.warn("No .profile-tabs container found for the clicked button.", clickedButton);
            return;
        }

        const tabButtons = tabContainer.querySelectorAll('.tab-button');
        const tabContents = tabContainer.querySelectorAll('.tab-content');
        const targetTabId = clickedButton.dataset.tab;

        console.log("Switching tab to:", targetTabId);

        // Remove 'active' class from all buttons and contents within this tabContainer
        tabButtons.forEach(button => button.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add 'active' class to the clicked button
        clickedButton.classList.add('active');

        // Add 'active' class to the corresponding content
        const targetContent = tabContainer.querySelector(`#${targetTabId}`);
        if (targetContent) {
            targetContent.classList.add('active');
        } else {
            console.error("Target tab content not found for ID:", targetTabId);
        }
    }

    // Attach event listeners to tab buttons using delegation
    // This handles both sets of tabs (myProfileView and publicPreviewView)
    document.querySelectorAll('.profile-tabs .tab-buttons').forEach(tabButtonsContainer => {
        tabButtonsContainer.addEventListener('click', (event) => {
            const clickedButton = event.target.closest('.tab-button');
            if (clickedButton) {
                switchTab(clickedButton);
            }
        });
    });

    // Initial tab activation for visible tab sections
    // This ensures the correct tab is active when the page loads, regardless of is_owner
    document.querySelectorAll('.profile-tabs').forEach(tabSection => {
        // Only activate if the tab section itself is visible (e.g., not hidden by display:none)
        // This is a basic check; a more robust solution might check computed style or specific classes
        if (tabSection.offsetParent !== null) { // Checks if element is actually rendered (not display: none)
            const initialActiveButton = tabSection.querySelector('.tab-button.active');
            if (initialActiveButton) {
                // Ensure the corresponding content is also active on load
                const targetTabId = initialActiveButton.dataset.tab;
                const targetContent = tabSection.querySelector(`#${targetTabId}`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            } else {
                // If no active button is set, activate the first one
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