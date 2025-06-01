document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.slider');
    const images = document.querySelectorAll('.slider img');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.dots-container');
    const dots = document.querySelectorAll('.dot');

    let currentIndex = 0;
    const totalImages = images.length;

    // Function to update the slider position
    function updateSlider() {
        const imageWidth = images[0].clientWidth;
        slider.style.transform = `translateX(${-currentIndex * imageWidth}px)`;
        updateDots();
    }

    // Function to update active dot
    function updateDots() {
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Next button functionality
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalImages;
        updateSlider();
    });

    // Previous button functionality
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        updateSlider();
    });

    // Dot navigation functionality
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            currentIndex = parseInt(dot.dataset.slide);
            updateSlider();
        });
    });

    // Optional: Auto-play functionality
    // setInterval(() => {
    //     currentIndex = (currentIndex + 1) % totalImages;
    //     updateSlider();
    // }, 3000); // Change image every 3 seconds

    // Initial update
    updateSlider();

    // Handle window resizing
    window.addEventListener('resize', updateSlider);
});