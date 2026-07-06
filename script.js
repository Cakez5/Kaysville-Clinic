(function () {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const dropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');

    function closeDropdowns() {
        document.querySelectorAll('.dropdown-menu').forEach((menu) => {
            menu.classList.remove('active');
        });
        dropdownToggles.forEach((toggle) => {
            toggle.setAttribute('aria-expanded', 'false');
        });
    }

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!expanded));
            navLinks.classList.toggle('active');
            if (!expanded) {
                closeDropdowns();
            }
        });
    }

    dropdownToggles.forEach((toggle) => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const dropdown = toggle.parentElement;
            const menu = dropdown.querySelector('.dropdown-menu');
            const isOpen = menu.classList.contains('active');

            closeDropdowns();

            if (!isOpen) {
                menu.classList.add('active');
                toggle.setAttribute('aria-expanded', 'true');
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-dropdown')) {
            closeDropdowns();
        }
    });

    document.querySelectorAll('#main-navigation a').forEach((link) => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 800) {
                navToggle?.setAttribute('aria-expanded', 'false');
                navLinks?.classList.remove('active');
            }
        });
    });

    (function setActiveNav() {
        const links = document.querySelectorAll('#main-navigation a');
        const dropdownToggle = document.querySelector('.nav-dropdown-toggle');
        const currentUrl = new URL(window.location.href);
        const currentPath = currentUrl.pathname.replace(/\/+$/, '') || '/';
        const currentFile = currentPath.split('/').pop() || 'index.html';
        const currentKey = currentFile.toLowerCase();
        const resourcePages = ['patient-education.html', 'pricing.html', 'resources.html'];

        links.forEach((a) => {
            const href = (a.getAttribute('href') || '').trim();
            const linkUrl = new URL(href, window.location.href);
            const linkPath = linkUrl.pathname.replace(/\/+$/, '') || '/';
            const linkFile = linkPath.split('/').pop() || 'index.html';
            const linkKey = linkFile.toLowerCase();
            const isCurrentPage = linkKey === currentKey || (currentKey === 'index.html' && linkKey === '') || (currentKey === '' && linkKey === 'index.html');

            a.classList.toggle('active', isCurrentPage);
            a.setAttribute('aria-current', isCurrentPage ? 'page' : 'false');
        });

        if (dropdownToggle) {
            const isResourcePage = resourcePages.includes(currentKey);
            dropdownToggle.classList.toggle('active', isResourcePage);
            dropdownToggle.setAttribute('aria-current', isResourcePage ? 'page' : 'false');
        }
    })();

    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            form.reset();
        });
    }

    const tabs = document.querySelectorAll('.tabs .tab');
    const panels = document.querySelectorAll('.tab-panel');
    tabs.forEach((tab) => {
        tab.addEventListener('click', (event) => {
            event.preventDefault();
            tabs.forEach((t) => {
                t.setAttribute('aria-selected', 'false');
                t.classList.remove('active');
            });
            tab.setAttribute('aria-selected', 'true');
            tab.classList.add('active');

            const target = tab.getAttribute('data-target');
            panels.forEach((panel) => {
                panel.classList.remove('active');
                panel.style.display = 'none';
            });

            const panel = document.getElementById(target);
            if (panel) {
                panel.classList.add('active');
                panel.style.display = 'block';
            }
        });
    });

    //const reviewsContainer = document.querySelector('.testimonials-grid');
    if (reviewsContainer) {
        const localReviews = [
            //{
                //name: 'Jordan P.',
                //role: 'Primary Care Patient',
                //text: 'The team made me feel comfortable right away. The care was personal, clear, and genuinely compassionate.'
            //,
            {
                //name: 'Melissa R.',
                //role: 'Wellness Visit',
                //text: 'I appreciated how easy it was to get quality care close to home. The staff was attentive and professional.'
            },
            {
                //name: 'David T.',
                //role: 'Weight Management Patient',
                //text: 'From scheduling to treatment, everything felt organized and thoughtful. I would absolutely recommend this clinic.'
            }
        ];

        const googleConfig = window.GOOGLE_REVIEWS_CONFIG || {};
        const googlePlaceId = googleConfig.placeId || '';
        const googleApiKey = googleConfig.apiKey || '';

        function renderReviews(reviews) {
            const fiveStarReviews = reviews
                .filter((review) => Number(review.rating || 0) >= 5)
                .slice(0, 3);

            reviewsContainer.innerHTML = '';
            fiveStarReviews.forEach((review) => {
                const card = document.createElement('article');
                card.className = 'testimonial-card';
                card.innerHTML = `
                    <p class="testimonial-text">“${review.text}”</p>
                    <div class="testimonial-author">
                        <strong>${review.name}</strong>
                        <span>${review.role || 'Google Review'}</span>
                        <span class="testimonial-stars">★★★★★</span>
                    </div>
                `;
                reviewsContainer.appendChild(card);
            });
        }
        

        renderReviews(localReviews.map((review) => ({ ...review, rating: 5 })));

        if (googlePlaceId && googleApiKey) {
            fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(googlePlaceId)}&fields=name,reviews&key=${encodeURIComponent(googleApiKey)}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data && data.result && Array.isArray(data.result.reviews)) {
                        renderReviews(data.result.reviews.map((review) => ({
                            name: review.author_name || 'Google Reviewer',
                            role: 'Google Review',
                            text: review.text || 'Great experience.',
                            rating: review.rating || 5
                        })));
                    } else {
                        renderReviews(localReviews.map((review) => ({ ...review, rating: 5 })));
                    }
                })
                .catch(() => {
                    renderReviews(localReviews.map((review) => ({ ...review, rating: 5 })));
                });
        } else {
            renderReviews(localReviews.map((review) => ({ ...review, rating: 5 })));
        }
    }
})();
