const rangeInputMin = document.getElementById('rangeInputMin');
const rangeInputMax = document.getElementById('rangeInputMax');
const filledRangeTrack = document.getElementById('filledRangeTrack');
const subRangeMinDisplay = document.getElementById('subRangeMinDisplay');
const subRangeMaxDisplay = document.getElementById('subRangeMaxDisplay');

const normalSlider = document.getElementById('normalSlider');
const normalSliderValue = document.getElementById('normalSliderValue');

const checkboxes = document.querySelectorAll('.checkbox-input');

let selectedOptions = [];

function fetchData() {
    console.log('Selected Checkboxes: ', selectedOptions);
    console.log('slidebar1 range: ', rangeInputMin.value, " ", rangeInputMax.value);
    console.log('slidebar2 value: ', normalSlider.value);

    const url = `/feed/search_chat/?q=${encodeURIComponent(searchInput.value)}`;

    // fa request GET all'url
    fetch(url, {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        displayOutput(data.searched_users)
    })
}

/**
 * Updates the visual representation of the filled range and the displayed values
 * for the dual-thumb slider.
 */
function updateSubRangeDisplay() {
    // Overall min and max are now fixed to 0 and 100
    let minOverall = 0;
    let maxOverall = 100;
    let currentMin = parseInt(rangeInputMin.value);
    let currentMax = parseInt(rangeInputMax.value);

    // Ensure min thumb does not go past max thumb and vice-versa
    if (currentMin > currentMax) {
        // If min attempts to go past max, set min to max's position
        if (event && event.target.id === 'rangeInputMin') {
            rangeInputMax.value = currentMin;
            currentMax = currentMin;
        } else if (event && event.target.id === 'rangeInputMax') {
                rangeInputMin.value = currentMax;
                currentMin = currentMax;
        }
    }

    // Calculate percentages for the filled track
    const totalRange = maxOverall - minOverall;
    const leftPercentage = ((currentMin - minOverall) / totalRange) * 100;
    const widthPercentage = ((currentMax - currentMin) / totalRange) * 100;

    filledRangeTrack.style.left = `${leftPercentage}%`;
    filledRangeTrack.style.width = `${widthPercentage}%`;

    subRangeMinDisplay.textContent = currentMin;
    subRangeMaxDisplay.textContent = currentMax;

    fetchData()
}

function logSelectedCheckboxes() {
    selectedOptions = [];
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            // Get the text content from the sibling span element
            const labelText = checkbox.nextElementSibling.textContent;
            selectedOptions.push(labelText);
        }
    });
    
    fetchData()
}

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', logSelectedCheckboxes);
});

function updateSlidebarRangeDisplay() {
    normalSliderValue.textContent = normalSlider.value;

    let minOverall = 0;
    let maxOverall = 100;

    // Calculate percentages for the filled track
    const totalRange = maxOverall - minOverall;
    const leftPercentage = ((normalSlider.value - minOverall) / totalRange) * 100;

    // mette rosa la parte a sinistra del pallino nella slidebar (la sua larghezza è dinamica)
    normalSlider.style.background = `linear-gradient(to right, #ff4081 ${leftPercentage}%, #d1d5db 30%, #d1d5db 100%)`

    fetchData()
}

/**
 * Event listener for the normal slider to update its displayed value.
 */
normalSlider.addEventListener('input', updateSlidebarRangeDisplay)

// Event listeners for the dual-thumb slider inputs
rangeInputMin.addEventListener('input', updateSubRangeDisplay);
rangeInputMax.addEventListener('input', updateSubRangeDisplay);

// Initial update for all sliders when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateSubRangeDisplay(); // Set initial state for adjustable slider
    normalSliderValue.textContent = normalSlider.value; // Set initial state for normal slider
    updateSlidebarRangeDisplay();
    logSelectedCheckboxes();
});
