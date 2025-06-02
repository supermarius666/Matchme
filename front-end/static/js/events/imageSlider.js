document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.slider');
    const images = document.querySelectorAll('.slider img');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');

    let currentIndex = 0;
    const totalImages = images.length;

    // Function to update slider position
    function updateSlider() {
        const imageWidth = images[0].clientWidth;
        slider.style.transform = `translateX(-${currentIndex * imageWidth}px)`;
        updateDots();
    }

    // Function to update active dot
    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === currentIndex) {
                dot.classList.add('active');
            }
        });
    }

    // Event Listeners for navigation buttons
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalImages - 1;
        updateSlider();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex < totalImages - 1) ? currentIndex + 1 : 0;
        updateSlider();
    });

    // Event Listeners for dots
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            currentIndex = parseInt(e.target.dataset.slide);
            updateSlider();
        });
    });

    // Handle window resize to adjust slider position
    window.addEventListener('resize', updateSlider);

    // Initial setup
    updateSlider(); // Set initial position and active dot
});