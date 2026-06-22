document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       THEME TOGGLE (LIGHT / DARK MODE)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check local storage or system preference for theme
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', initialTheme);
    updateThemeIcon(initialTheme);
    
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fa-solid fa-sun';
            themeToggleBtn.setAttribute('title', 'Switch to Light Theme');
        } else {
            themeIcon.className = 'fa-solid fa-moon';
            themeToggleBtn.setAttribute('title', 'Switch to Dark Theme');
        }
    }
    /* ==========================================================================
       BREED SHOWCASE FILTERS
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const breedCards = document.querySelectorAll('.breed-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            breedCards.forEach(card => {
                const energy = card.getAttribute('data-energy');
                const coat = card.getAttribute('data-coat');
                
                let matches = false;
                
                if (filterValue === 'all') {
                    matches = true;
                } else if (filterValue === 'active' && energy === 'active') {
                    matches = true;
                } else if (filterValue === 'calm' && energy === 'calm') {
                    matches = true;
                } else if (filterValue === 'fluffy' && coat === 'fluffy') {
                    matches = true;
                }
                
                if (matches) {
                    card.style.display = 'flex';
                    // Trigger reflow for animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300); // match transition speed
                }
            });
        });
    });
    /* ==========================================================================
       PUPPY MATCHMAKER QUIZ LOGIC
       ========================================================================== */
    // Quiz Questions Data
    const quizQuestions = [
        {
            question: "What describes your living environment best?",
            options: [
                { text: "An apartment or cozy condo with limited space", scores: { frenchie: 3, corgi: 1 } },
                { text: "A suburban house with a medium, fenced yard", scores: { golden: 2, corgi: 2, samoyed: 1 } },
                { text: "A spacious home with a very large yard or acreage", scores: { samoyed: 3, golden: 2 } }
            ]
        },
        {
            question: "How active is your ideal daily routine?",
            options: [
                { text: "Relaxing indoors (casual walks, couch cuddling)", scores: { frenchie: 3, corgi: 1 } },
                { text: "Moderate activity (brisk neighborhood walks, fetch)", scores: { corgi: 2, golden: 1, samoyed: 1 } },
                { text: "Very active (running, hiking, outdoor exploration)", scores: { samoyed: 3, golden: 2, corgi: 1 } }
            ]
        },
        {
            question: "How do you feel about grooming and shedding?",
            options: [
                { text: "Low maintenance: minimal brushing, light shedding", scores: { frenchie: 3 } },
                { text: "Moderate: weekly brushing, seasonal shedding", scores: { corgi: 2, golden: 1 } },
                { text: "High maintenance: daily brushing, lots of fluffy hair!", scores: { samoyed: 3, golden: 2 } }
            ]
        }
    ];
    // Breeds details database for matching results
    const breedData = {
        golden: {
            name: "Golden Retriever",
            image: "assets/golden_retriever.png",
            desc: "You matched with the Golden Retriever! Loyal, friendly, and eager to please, this puppy is perfect for homes with space to run around and families looking for a playful, loving companion who will join in on all activities."
        },
        frenchie: {
            name: "French Bulldog",
            image: "assets/french_bulldog.png",
            desc: "You matched with the French Bulldog! Adaptable, affectionate, and low-maintenance, this puppy is ideal for apartment living or calmer lifestyles. Their big ears and silly personality will bring endless laughter to your home."
        },
        samoyed: {
            name: "Samoyed",
            image: "assets/samoyed.png",
            desc: "You matched with the Samoyed! If you love fluffy white coats and positive energy, the 'smiley dog' is for you. They thrive in active households with owners who love outdoor adventures and don't mind regular grooming."
        },
        corgi: {
            name: "Pembroke Welsh Corgi",
            image: "assets/corgi.png",
            desc: "You matched with the Pembroke Welsh Corgi! Bold, alert, and full of life, this little herding dog fits active homes looking for a big dog personality in a compact package. They are intelligent and excel at learning new tricks."
        }
    };
    let currentQuestionIndex = 0;
    let quizScores = { golden: 0, frenchie: 0, samoyed: 0, corgi: 0 };
    
    const quizIntro = document.getElementById('quiz-intro');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const quizQuestionContainer = document.getElementById('quiz-question-container');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const prevQuestionBtn = document.getElementById('prev-question-btn');
    const stepIndicator = document.getElementById('step-indicator');
    const quizProgress = document.getElementById('quiz-progress');
    const quizResultContainer = document.getElementById('quiz-result-container');
    
    const resultImageContainer = document.getElementById('result-image-container');
    const resultBreedName = document.getElementById('result-breed-name');
    const resultDescription = document.getElementById('result-description');
    const restartQuizBtn = document.getElementById('restart-quiz-btn');
    startQuizBtn.addEventListener('click', startQuiz);
    restartQuizBtn.addEventListener('click', restartQuiz);
    prevQuestionBtn.addEventListener('click', loadPrevQuestion);
    function startQuiz() {
        quizIntro.classList.add('hidden');
        quizQuestionContainer.classList.remove('hidden');
        currentQuestionIndex = 0;
        quizScores = { golden: 0, frenchie: 0, samoyed: 0, corgi: 0 };
        loadQuestion();
    }
    function loadQuestion() {
        const currentQuestion = quizQuestions[currentQuestionIndex];
        questionText.textContent = currentQuestion.question;
        optionsContainer.innerHTML = '';
        
        // Show/hide Back button
        if (currentQuestionIndex > 0) {
            prevQuestionBtn.classList.remove('hidden');
        } else {
            prevQuestionBtn.classList.add('hidden');
        }
        
        // Update Indicator & Progress Bar
        stepIndicator.textContent = `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;
        const percent = ((currentQuestionIndex) / quizQuestions.length) * 100;
        quizProgress.style.width = `${percent}%`;
        // Render Options
        currentQuestion.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'quiz-option-btn';
            button.innerHTML = `
                <span class="quiz-option-dot"></span>
                <span>${option.text}</span>
            `;
            
            button.addEventListener('click', () => {
                // Highlight choice
                const allOptions = optionsContainer.querySelectorAll('.quiz-option-btn');
                allOptions.forEach(opt => opt.classList.remove('selected'));
                button.classList.add('selected');
                
                // Add scores
                for (const key in option.scores) {
                    quizScores[key] += option.scores[key];
                }
                
                // Delay slightly for visual effect before going to next
                setTimeout(() => {
                    nextQuestion();
                }, 350);
            });
            
            optionsContainer.appendChild(button);
        });
    }
    function nextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizQuestions.length) {
            loadQuestion();
        } else {
            showResult();
        }
    }
    function loadPrevQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            loadQuestion();
        }
    }
    function showResult() {
        quizQuestionContainer.classList.add('hidden');
        quizResultContainer.classList.remove('hidden');
        
        // Complete the progress bar
        quizProgress.style.width = '100%';
        
        // Find highest score
        let winner = 'golden';
        let maxScore = -1;
        for (const key in quizScores) {
            if (quizScores[key] > maxScore) {
                maxScore = quizScores[key];
                winner = key;
            }
        }
        
        // Populate result
        const matchedBreed = breedData[winner];
        resultImageContainer.innerHTML = `<img src="${matchedBreed.image}" alt="${matchedBreed.name} puppy">`;
        resultBreedName.textContent = matchedBreed.name;
        resultDescription.textContent = matchedBreed.desc;
    }
    function restartQuiz() {
        quizResultContainer.classList.add('hidden');
        quizIntro.classList.remove('hidden');
        quizProgress.style.width = '0%';
    }
    /* ==========================================================================
       IMAGE GALLERY LIGHTBOX
       ========================================================================== */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-image-element');
    const lightboxCaption = document.getElementById('lightbox-caption-element');
    const lightboxClose = document.getElementById('lightbox-close-btn');
    const lightboxPrev = document.getElementById('lightbox-prev-btn');
    const lightboxNext = document.getElementById('lightbox-next-btn');
    
    let currentGalleryIndex = 0;
    const imagesList = [];
    
    // Build list of image objects
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('.gallery-img');
        imagesList.push({
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt')
        });
        
        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });
    function openLightbox(index) {
        currentGalleryIndex = index;
        updateLightboxContent();
        lightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Lock scrolling
    }
    function closeLightbox() {
        lightbox.classList.add('hidden');
        document.body.style.overflow = ''; // Unlock scrolling
    }
    function updateLightboxContent() {
        const item = imagesList[currentGalleryIndex];
        lightboxImg.src = item.src;
        lightboxImg.alt = item.alt;
        lightboxCaption.textContent = item.alt;
    }
    function prevImage() {
        currentGalleryIndex = (currentGalleryIndex - 1 + imagesList.length) % imagesList.length;
        updateLightboxContent();
    }
    function nextImage() {
        currentGalleryIndex = (currentGalleryIndex + 1) % imagesList.length;
        updateLightboxContent();
    }
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevImage);
    lightboxNext.addEventListener('click', nextImage);
    
    // Close lightbox on clicking dark backdrop
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    // Keyboard controls for Lightbox
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('hidden')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        }
    });
    /* ==========================================================================
       CARE GUIDE ACCORDION
       ========================================================================== */
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isExpanded = item.classList.contains('expanded');
            
            // Close all items first for clean accordion behavior
            document.querySelectorAll('.accordion-item').forEach(accItem => {
                accItem.classList.remove('expanded');
                accItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
            });
            
            // Toggle clicked item
            if (!isExpanded) {
                item.classList.add('expanded');
                header.setAttribute('aria-expanded', 'true');
            }
        });
    });
});