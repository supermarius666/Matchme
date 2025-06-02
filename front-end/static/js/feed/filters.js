const rangeInputMin = document.getElementById('rangeInputMin');
const rangeInputMax = document.getElementById('rangeInputMax');
const filledRangeTrack = document.getElementById('filledRangeTrack');
const subRangeMinDisplay = document.getElementById('subRangeMinDisplay');
const subRangeMaxDisplay = document.getElementById('subRangeMaxDisplay');

const normalSlider = document.getElementById('normalSlider');
const normalSliderValue = document.getElementById('normalSliderValue');

const checkboxes = document.querySelectorAll('.checkbox-input');

// Per modificare il feed
const feedContainer = document.querySelector('.feed-feed-container');
//"feed-post"  "feed-post-header"


let selectedOptions = [];

function myInclude(listOfLists, targetList) {
  const targetListString = JSON.stringify(targetList);
  return listOfLists.some(innerList => JSON.stringify(innerList) === targetListString);
}

function fetchData() {
    //console.log('Selected Checkboxes: ', selectedOptions);
    //console.log('slidebar1 range: ', rangeInputMin.value, " ", rangeInputMax.value);
    //console.log('slidebar2 value: ', normalSlider.value);

    const url = `/feed/feed_action/`;

    const payload = {
        type: "feed",
        genderSelected: selectedOptions,
        ageMin: rangeInputMin.value,
        ageMax: rangeInputMax.value,
        distanceMax: normalSlider.value
    };

    console.log("PER FARE RICHIESTA");
    // fa request POST all'url
    fetch(url, {
        method: 'POST',
        // TODO vedi se headers serve
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        console.log("FATTA RICHIESTA");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data)

        displayFeed(data)
    })
}

function sendLike(user) {
    const url = `/feed/feed_action/`;

    const payload = {
        type: "like",
        likedUser: user
    };

    console.log("PER FARE RICHIESTA");
    // fa request POST all'url
    fetch(url, {
        method: 'POST',
        // TODO vedi se headers serve
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        console.log("FATTA RICHIESTA");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data)

        displayFeed(data)
    })
}

function sendDislike(user) {}

function displayFeed(data) {
    const logged_user = data.logged_user
    const selected_users = data.selected_users
    const pending_users_arrived = data.pending_users_arrived
    const pending_users_sent = data.pending_users_sent
    const matched_users = data.matched_users

    feedContainer.innerHTML = ""

    pending_users_arrived.forEach(user => {
        feedContainer.innerHTML += `
            <div class="feed-post">
                <div class="feed-post-header">
                    <a href="#">
                        <img src="${user[1]}" alt="User Profile Picture" class="feed-profile-pic">
                    </a>
                    <button class="feed-username">${user[0]}</button>
                </div>

                <div class="feed-post-image">
                    <img src="https://picsum.photos/600/400?random=1" alt="Post Image">
                </div>
                
                <div class="feed-post-actions">
                    <button type="button" onclick="sendLike('${user[0]}')" class="feed-action-button feed-like-button"><i class="far fa-heart"></i>Like</button>
                    <button type="button" onclick="sendzDislike('${user[0]}')" class="feed-action-button feed-dislike-button"><i class="far fa-thumbs-down"></i>Dont Like</button>
                </div>
                
            </div>
        `
    })

    selected_users.forEach(user => {
        console.log("matched users", matched_users)
        console.log("user", user)
        if (!myInclude(pending_users_arrived, user) && !myInclude(matched_users, user) &&
            !myInclude(pending_users_sent, user) && user[0] !== logged_user) {
            

            feedContainer.innerHTML += `
                <div class="feed-post">
                    <div class="feed-post-header">
                        <a href="#">
                            <img src="${user[1]}" alt="User Profile Picture" class="feed-profile-pic">
                        </a>
                        <button class="feed-username">${user[0]}</button>
                    </div>

                    <div class="feed-post-image">
                        <img src="https://picsum.photos/600/400?random=1" alt="Post Image">
                    </div>
                    
                    <div class="feed-post-actions">
                        <button type="button" onclick="sendLike('${user[0]}')" class="feed-action-button feed-like-button"><i class="far fa-heart"></i>Like</button>
                        <button type="button" onclick="sendDislike('${user[0]}')" class="feed-action-button feed-dislike-button"><i class="far fa-thumbs-down"></i>Dont Like</button>
                    </div>
                    
                </div>
            `
        }
    })

    fetchSearchOutput()    
}

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
