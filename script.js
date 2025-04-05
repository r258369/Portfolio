// Orbital System Interactive Functions
function initOrbitalSystem() {
    // Get all project cards
    const workItems = document.querySelectorAll('.work-item');
    // Get all orbital balls
    const orbitalBalls = document.querySelectorAll('.orbital-ball');

    // Add event listeners to project cards
    workItems.forEach(item => {
        const projectId = item.getAttribute('data-project');

        item.addEventListener('mouseenter', () => {
            // Find the corresponding orbital ball and make it glow
            const matchingBall = document.querySelector(`.orbital-ball[data-project="${projectId}"]`);
            if (matchingBall) {
                matchingBall.classList.add('glow');
            }
        });

        item.addEventListener('mouseleave', () => {
            // Remove glow when mouse leaves
            const matchingBall = document.querySelector(`.orbital-ball[data-project="${projectId}"]`);
            if (matchingBall) {
                matchingBall.classList.remove('glow');
            }
        });
    });

    // Also add event listeners to orbital balls
    orbitalBalls.forEach(ball => {
        const projectId = ball.getAttribute('data-project');

        ball.addEventListener('mouseenter', () => {
            // Find the corresponding project card and highlight it
            const matchingItem = document.querySelector(`.work-item[data-project="${projectId}"]`);
            if (matchingItem) {
                matchingItem.style.boxShadow = '0 0 20px rgba(0, 247, 255, 0.8)';
                ball.classList.add('glow');
            }
        });

        ball.addEventListener('mouseleave', () => {
            // Remove highlight when mouse leaves
            const matchingItem = document.querySelector(`.work-item[data-project="${projectId}"]`);
            if (matchingItem) {
                matchingItem.style.boxShadow = '';
                ball.classList.remove('glow');
            }
        });
    });
}

/* --- Magnetic Navigation --- */
function initMagneticNav() {
    const navLinks = document.querySelectorAll('.floating-nav .nav-links li a');

    navLinks.forEach(link => {
        const item = link.parentElement; // Get the <li> element

        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Apply subtle transform based on mouse position within the <li>
            link.style.transform = `translate(${x * 0.1}px, ${y * 0.2}px)`; 
        });

        item.addEventListener('mouseleave', () => {
            link.style.transform = 'translate(0, 0)'; // Reset on mouse leave
        });

        // Smooth Scroll & Highlight
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Smooth scroll
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust offset for fixed nav height
                    behavior: 'smooth'
                });

                // Remove highlight from other sections
                document.querySelectorAll('.section-highlight').forEach(el => {
                    el.classList.remove('section-highlight');
                });

                // Add highlight to target section (with a slight delay for scroll)
                setTimeout(() => {
                    targetElement.classList.add('section-highlight');
                    // Optional: Remove highlight after animation completes
                    // setTimeout(() => targetElement.classList.remove('section-highlight'), 1200);
                }, 600); // Delay matching scroll duration roughly
            }
            
            // Close mobile menu if active
            const mobileNav = document.querySelector('.floating-nav .nav-links');
            if (mobileNav && mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
            }
        });
    });
}

/* --- About Section Image/Avatar Logic --- */
function setupProfileImage() {
    const imgElement = document.getElementById('profilePhoto');
    const fallbackElement = document.getElementById('fallbackAvatar');

    if (imgElement && fallbackElement) {
        // Check if the image src is empty or just a placeholder/invalid
        // You might need a more robust check depending on your placeholder source
        if (!imgElement.getAttribute('src') || imgElement.getAttribute('src').includes('placeholder.com')) {
            imgElement.style.display = 'none'; // Hide the broken image tag
            fallbackElement.style.display = 'flex'; // Show the fallback avatar
        } else {
            // Optional: Check if image loaded successfully, otherwise show fallback
            imgElement.onerror = () => {
                imgElement.style.display = 'none';
                fallbackElement.style.display = 'flex';
            };
             // If src is valid and image loads, it will display by default.
             // Ensure fallback remains hidden.
             fallbackElement.style.display = 'none'; 
             imgElement.style.display = 'block';
        }
    }
}

/* --- Animate Skill Progress Bars --- */
/*
function animateProgressBars() {
    const skillItems = document.querySelectorAll('.skills-column .skill-category li[data-progress]');

    const observerOptions = {
        root: null, // relative to document viewport 
        rootMargin: '0px',
        threshold: 0.5 // Trigger when 50% of the item is visible
    };

    const progressObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.progress-bar');
                const progressValue = entry.target.getAttribute('data-progress');
                
                if (progressBar && progressValue) {
                    progressBar.style.width = `${progressValue}%`;
                }
                // Optional: Unobserve after animation starts if you only want it once
                // observer.unobserve(entry.target);
            } else {
                 // Optional: Reset width when out of view if reset:true is used
                 // const progressBar = entry.target.querySelector('.progress-bar');
                 // if (progressBar) progressBar.style.width = '0%';
            }
        });
    }, observerOptions);

    skillItems.forEach(item => {
        progressObserver.observe(item);
    });
}
*/

/* --- Project Modal Logic --- */
function initProjectModal() {
    const workItems = document.querySelectorAll('.work-gallery .work-item');
    const modalOverlay = document.getElementById('project-modal-overlay');
    const modalPanel = document.getElementById('project-modal-panel');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalLocation = document.getElementById('modal-location');
    const modalDescription = document.getElementById('modal-description');
    const modalTechList = document.getElementById('modal-tech-list');
    const modalCredits = document.getElementById('modal-credits');
    const closeBtn = document.getElementById('modal-close-btn');
    const galleryPrevBtn = document.querySelector('.modal-gallery .prev');
    const galleryNextBtn = document.querySelector('.modal-gallery .next');
    const galleryDotsContainer = document.querySelector('.modal-gallery .gallery-dots');

    let currentItem = null;
    let projectImages = [];
    let currentImageIndex = 0;

    if (!modalOverlay || !modalPanel || !closeBtn || !galleryPrevBtn || !galleryNextBtn || !galleryDotsContainer || !modalTechList) return;

    const tl = gsap.timeline({ paused: true, defaults: { duration: 0.4, ease: "power3.inOut" } });

    tl.to(modalOverlay, { opacity: 1, visibility: 'visible' })
      .to(modalPanel, { opacity: 1, scale: 1, visibility: 'visible' }, "<0.1");

    function updateGallery() {
        if (projectImages.length === 0) return;

        gsap.to(modalImage, { 
            opacity: 0, 
            duration: 0.2, 
            onComplete: () => {
                modalImage.src = projectImages[currentImageIndex];
                gsap.to(modalImage, { opacity: 1, duration: 0.2 });
            }
        });

        const dots = galleryDotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentImageIndex);
        });

        galleryPrevBtn.style.display = projectImages.length > 1 ? 'block' : 'none';
        galleryNextBtn.style.display = projectImages.length > 1 ? 'block' : 'none';
        galleryDotsContainer.style.display = projectImages.length > 1 ? 'flex' : 'none';
    }

    function setupDots() {
        galleryDotsContainer.innerHTML = '';
        if (projectImages.length > 1) {
            projectImages.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                dot.addEventListener('click', () => {
                    currentImageIndex = index;
                    updateGallery();
                });
                galleryDotsContainer.appendChild(dot);
            });
        }
    }

    function openModal(item) {
        if(currentItem) currentItem.classList.remove('pulsing');
        currentItem = item;
        item.classList.add('pulsing');
        setTimeout(() => item.classList.remove('pulsing'), 800);
        
        const title = item.dataset.title || 'Project Title';
        const location = item.dataset.location || 'Location Unknown';
        const credits = item.dataset.credits || 'Credits Unavailable';
        const description = item.dataset.description || 'No description available.';
        const technologiesAttr = item.dataset.technologies || '';
        const imagesAttr = item.dataset.images || '';
        
        projectImages = imagesAttr ? imagesAttr.split(',').map(s => s.trim()).filter(s => s) : [];
        currentImageIndex = 0;

        modalTitle.textContent = title;
        modalLocation.textContent = location;
        modalCredits.textContent = credits;
        modalDescription.textContent = description;
        
        // Populate Technologies List
        modalTechList.innerHTML = ''; // Clear previous techs
        if (technologiesAttr) {
            const techs = technologiesAttr.split(',').map(s => s.trim()).filter(s => s);
            techs.forEach(tech => {
                const li = document.createElement('li');
                li.textContent = tech;
                modalTechList.appendChild(li);
            });
            // Show the parent container if techs exist
            modalTechList.closest('.modal-technologies').style.display = 'block';
        } else {
             // Hide the parent container if no techs
            modalTechList.closest('.modal-technologies').style.display = 'none';
        }
        
        setupDots();
        updateGallery();

        document.body.style.overflow = 'hidden';
        tl.play();
    }

    function closeModal() {
        document.body.style.overflow = '';
        tl.reverse();
        if(currentItem) currentItem.classList.remove('pulsing');
        currentItem = null;
    }

    workItems.forEach(item => {
        item.addEventListener('click', () => openModal(item));
    });

    closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    galleryPrevBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + projectImages.length) % projectImages.length;
        updateGallery();
    });

    galleryNextBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % projectImages.length;
        updateGallery();
    });
}

// Add the orbital system initialization to your existing script
document.addEventListener('DOMContentLoaded', function() {
    // --- Cinematic Hero Intro --- 
    function initHeroAnimation() {
        // Split the headline text
        const heroTitle = document.querySelector('h1[data-anim="hero-title"]');
        if (!heroTitle) return; // Exit if title not found

        const split = new SplitType(heroTitle, { types: 'chars' });
        const chars = split.chars;

        // Ensure elements exist before animating
        const subHeadline = document.querySelector('h3[data-anim="hero-sub"]');
        const paragraph = document.querySelector('p[data-anim="hero-text"]');
        const ctaButton = document.querySelector('.cta-btn[data-anim="hero-btn"]');
        const profileImage = document.querySelector('.profile-image[data-anim="hero-image"]'); // Corrected selector

        // GSAP Timeline
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.set(document.body, { overflow: 'hidden' }) // Prevent scroll during intro
          // Animate Headline Chars
          .fromTo(chars, 
              { 
                  y: 100, 
                  opacity: 0
              }, 
              { 
                  y: 0, 
                  opacity: 1,
                  stagger: 0.03, 
                  duration: 1, 
                  visibility: 'visible'
              }, 
              ">0.2" // Start shortly after previous animation
          )
          // Animate Sub-headline
          .fromTo(subHeadline, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, visibility: 'visible' }, "<0.4") // Overlap slightly
          // Animate Paragraph
          .fromTo(paragraph, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, visibility: 'visible' }, "<0.2")
          // Animate Button
          .fromTo(ctaButton, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.8, visibility: 'visible' }, "<0.2")
          // Animate Profile Image
          .fromTo(profileImage, { opacity: 0, scale: 0.8, y: 50 }, { opacity: 1, scale: 1, y: 0, duration: 1.2, visibility: 'visible', clearProps: "transform" }, "<0.1") // Clear transform after animation
          // Re-enable scroll after animation completes
          .set(document.body, { overflow: 'auto' }, ">0.5"); 

    }
    
    // --- Existing Initializations ---
    // animateProgressBars(); // Removed call
    setupProfileImage(); 
    initHeroAnimation(); 
    initOrbitalSystem();
    initMagneticNav();
    initProjectModal(); // Initialize Project Modal
    
    // Initialize Particles.js (if needed here)
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: ['#00f7ff', '#00d4c7']
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    }
                },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#00f7ff',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'repulse'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 400,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 100,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
    } else {
        console.error('particlesJS is not defined. Ensure the library is loaded correctly.');
    }

    // Hamburger Menu Toggle (your existing code)
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Smooth Scrolling (your existing code)
    const navAnchors = document.querySelectorAll('.floating-nav a');
    if (navAnchors.length > 0) {
        navAnchors.forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop,
                        behavior: 'smooth'
                    });
                    // Close the menu on mobile after clicking a link
                    if (window.innerWidth <= 768 && navLinks) {
                        navLinks.classList.remove('active');
                    }
                }
            });
        });
    }

    // Intersection Observer (your existing code)
    const sections = document.querySelectorAll('.section');
    if (sections.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // Initialize the orbital system
    initOrbitalSystem();

    /* --- ScrollReveal Initialization --- */
    // Initialize ScrollReveal
    const sr = ScrollReveal({
        origin: 'bottom',
        distance: '60px',
        duration: 1000,
        delay: 200,
        opacity: 0,
        easing: 'cubic-bezier(0.5, 0, 0, 1)',
        reset: true
    });

    // --- Define Animations ---

    // General Section Titles (already handled by .section.visible? Check CSS)
    // sr.reveal('.section-title', { origin: 'top', delay: 100 });

    // Hero Content (if not animated already)
    sr.reveal('.hero h3', { origin: 'top', delay: 400 });
    // sr.reveal('.hero h1', { delay: 500 }); // Typing animation handles this
    sr.reveal('.hero p', { delay: 600 });
    sr.reveal('.cta-btn', { delay: 700 });

    // About Section
    sr.reveal('.about-text h1', { origin: 'left', delay: 300 });
    sr.reveal('.about-text p', { origin: 'left', delay: 400 });
    sr.reveal('.about-buttons .btn', { origin: 'left', interval: 150, delay: 500 });
    sr.reveal('.about-image img', { origin: 'right', delay: 400 });

    // Skills Section - Target categories within the new layout
    sr.reveal('.skills-layout .skill-category', { interval: 150 }); 

    // Work Section
    sr.reveal('.work-gallery .work-item', { interval: 200 }); // Staggered reveal for project cards
    sr.reveal('.orbit-container', { origin: 'right', delay: 400 }); // Reveal orbit from the right

    // Education Section
    sr.reveal('.education-timeline .education-item:nth-child(odd) .education-content', { origin: 'left' });
    sr.reveal('.education-timeline .education-item:nth-child(even) .education-content', { origin: 'right' });
    sr.reveal('.education-timeline .education-dot', { scale: 0.5, duration: 500 });

    // Contact Section
    sr.reveal('.contact-form', { origin: 'left', delay: 300 });
    sr.reveal('.contact-info', { origin: 'right', delay: 400 });

    // Footer (optional)
    // sr.reveal('footer p', { delay: 100 });

    initMagneticNav(); // Initialize Magnetic Nav

    // Initialize Vanilla-Tilt.js
    const tiltElements = document.querySelectorAll('.skill-category, .work-item'); // Target skill & project cards
    if (typeof VanillaTilt !== 'undefined' && tiltElements.length > 0) {
        VanillaTilt.init(tiltElements, {
            max: 8,         // Max tilt rotation (degrees)
            speed: 400,     // Speed of the enter/exit transition
            glare: true,    // Add a glare effect
            "max-glare": 0.3 // Glare intensity (0 to 1)
        });
    }
});

// --- Preloader Logic --- 
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Add a delay before hiding for smoother transition (optional)
        setTimeout(() => {
             preloader.classList.add('hidden');
        }, 300); // Adjust delay as needed
       
        // Optional: Remove preloader from DOM after transition
        // preloader.addEventListener('transitionend', () => {
        //     preloader.remove();
        // });
    }
});