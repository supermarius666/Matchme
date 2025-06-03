const rangeInputMin = document.getElementById('rangeInputMin');
const rangeInputMax = document.getElementById('rangeInputMax');
const filledRangeTrack = document.getElementById('filledRangeTrack');
const subRangeMinDisplay = document.getElementById('subRangeMinDisplay');
const subRangeMaxDisplay = document.getElementById('subRangeMaxDisplay');

const normalSlider = document.getElementById('normalSlider');
const normalSliderValue = document.getElementById('normalSliderValue');

const checkboxes = document.querySelectorAll('.checkbox-input');

const feedContainer = document.querySelector('.feed-feed-container');

let selectedOptions = [];

function myInclude(listOfLists, targetList) {
    const targetListString = JSON.stringify(targetList);
    return listOfLists.some(innerList => JSON.stringify(innerList) === targetListString);
}

function fetchData() {
    const url = `/feed/feed_action/`;

    const payload = {
        type: "feed",
        genderSelected: selectedOptions,
        ageMin: rangeInputMin.value,
        ageMax: rangeInputMax.value,
        distanceMax: normalSlider.value
    };

    console.log("PER FARE RICHIESTA");
    fetch(url, {
        method: 'POST',
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
    fetch(url, {
        method: 'POST',
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

    const post_image = data.post_photo
    const post_text = data.text_photo

    feedContainer.innerHTML = ""

    pending_users_arrived.forEach(user => {
        feedContainer.innerHTML += `
            <div class="feed-post">
                <div class="feed-post-header">
                    <a href="/accounts/profile/${user[0]}">
                        <img src="${user[1]}" alt="User Profile Picture" class="feed-profile-pic">
                    </a>
                    <button class="feed-username">${user[0]}</button>
                </div>

                <div class="feed-post-image">
                    <img src="${user[2]}" alt="Post Image">
                </div>
                
                <div class="feed-post-actions">
                    <button type="button" onclick="sendLike('${user[0]}')" class="feed-action-button like-button"><i class="far fa-heart"></i></button>
                    <button type="button" onclick="sendzDislike('${user[0]}')" class="feed-action-button dislike-button"><i class="fas fa-times"></i></button>

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
                        <a href="/accounts/profile/${user[0]}">
                            <img src="${user[1]}" alt="User Profile Picture" class="feed-profile-pic">
                        </a>
                        <button class="feed-username">${user[0]}</button>
                    </div>

                    <div class="feed-post-image">
                        <img src="${user[2]}" alt="Post Image">
                    </div>
                    
                    <div class="feed-post-actions">
                        <button type="button" onclick="sendLike('${user[0]}')" class="feed-action-button like-button"><i class="far fa-heart"></i></button>
                        <button type="button" onclick="sendzDislike('${user[0]}')" class="feed-action-button dislike-button"><i class="fas fa-times"></i></button>

                    </div>
                    
                </div>
            `
        }
    })

    fetchSearchOutput()
}

function updateSubRangeDisplay() {
    let minOverall = 18;
    let maxOverall = 99;
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
    let maxOverall = 750;

    const totalRange = maxOverall - minOverall;
    const leftPercentage = ((normalSlider.value - minOverall) / totalRange) * 100;

    normalSlider.style.background = `linear-gradient(to right, #ff4081 ${leftPercentage}%, #d1d5db 0%, #d1d5db 100%)`

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