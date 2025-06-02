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

function updateSubRangeDisplay() {
    let minOverall = 0;
    let maxOverall = 100;
    let currentMin = parseInt(rangeInputMin.value);
    let currentMax = parseInt(rangeInputMax.value);

    if (currentMin > currentMax) {
        if (event && event.target.id === 'rangeInputMin') {
            rangeInputMax.value = currentMin;
            currentMax = currentMin;
        } else if (event && event.target.id === 'rangeInputMax') {
            rangeInputMin.value = currentMax;
            currentMin = currentMax;
        }
    }

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

    const totalRange = maxOverall - minOverall;
    const leftPercentage = ((normalSlider.value - minOverall) / totalRange) * 100;

    normalSlider.style.background = `linear-gradient(to right, #ff4081 ${leftPercentage}%, #d1d5db 30%, #d1d5db 100%)`

    fetchData()
}

normalSlider.addEventListener('input', updateSlidebarRangeDisplay)

rangeInputMin.addEventListener('input', updateSubRangeDisplay);
rangeInputMax.addEventListener('input', updateSubRangeDisplay);

document.addEventListener('DOMContentLoaded', () => {
    updateSubRangeDisplay();
    normalSliderValue.textContent = normalSlider.value;
    updateSlidebarRangeDisplay();
    logSelectedCheckboxes();
});