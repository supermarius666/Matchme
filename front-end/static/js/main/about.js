document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('[data-animate]');

    sections.forEach(section => {
        const text = section.querySelector('.section-text');
        const image = section.querySelector('.section-image');
        const isReversed = section.querySelector('.container').classList.contains('reverse-columns');

        gsap.set(text, { opacity: 0, x: isReversed ? 100 : -100 });
        gsap.set(image, { opacity: 0, x: isReversed ? -100 : 100 });

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const tl = gsap.timeline();

                    tl.to(text, { opacity: 1, x: 0, duration: 0.8, ease: 'bounce.out' })
                      .to(image, { opacity: 1, x: 0, duration: 0.8, ease: 'bounce.out' }, '+=0.1');

                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(section);
    });
});