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

    const serviceLinkMap = {
        'Primary Care': 'primary-care',
        'Minor Surgery': 'minor-surgery',
        'Wellness & Prevention': 'wellness',
        'Weight Management': 'weight-management',
        'Hormone Therapy': 'hormone-therapy',
        'Addiction Management': 'addiction-management',
        'Aesthetics': 'aesthetics'
    };

    document.querySelectorAll('.footer-section a[href="services.html"], .footer-section a[href="./services.html"], .footer-section a[href="/services.html"]').forEach((link) => {
        const label = (link.textContent || '').trim();
        const tabTarget = serviceLinkMap[label];

        if (tabTarget) {
            link.setAttribute('href', `patient-education.html?tab=${tabTarget}`);
        }
    });

    document.querySelectorAll('.service-card').forEach((card) => {
        card.addEventListener('click', (e) => {
            const href = card.getAttribute('href');
            if (href) {
                window.location.href = href;
            }
        });
    });

    const tabs = document.querySelectorAll('.tabs .tab');
    const panels = document.querySelectorAll('.tab-panel');
    const tabSelect = document.querySelector('.tabs-dropdown');

    function activateTab(targetId) {
        tabs.forEach((t) => {
            const isActive = t.getAttribute('data-target') === targetId;
            t.setAttribute('aria-selected', String(isActive));
            t.classList.toggle('active', isActive);
        });

        if (tabSelect) {
            tabSelect.value = targetId;
        }

        panels.forEach((panel) => {
            const isActive = panel.id === targetId;
            panel.classList.toggle('active', isActive);
            panel.style.display = isActive ? 'block' : 'none';
        });

        const url = new URL(window.location.href);
        url.searchParams.set('tab', targetId);
        history.replaceState({}, '', `${url.pathname}${url.search}`);
    }

    const requestedTab = new URLSearchParams(window.location.search).get('tab');
    const validRequestedTab = requestedTab && document.getElementById(requestedTab) ? requestedTab : null;
    const initialTab = validRequestedTab || tabs[0]?.getAttribute('data-target') || null;

    if (initialTab) {
        activateTab(initialTab);
    }

    tabs.forEach((tab) => {
        tab.addEventListener('click', (event) => {
            event.preventDefault();
            const target = tab.getAttribute('data-target');
            if (target) {
                activateTab(target);
            }
        });
    });

    if (tabSelect) {
        tabSelect.addEventListener('change', (event) => {
            const target = event.target.value;
            if (target) {
                activateTab(target);
            }
        });
    }

    /* Subsection Dropdown Toggle Functionality */
    const subsectionToggles = document.querySelectorAll('.subsection-toggle');
    
    subsectionToggles.forEach((toggle) => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const content = toggle.nextElementSibling;
            
            if (!content || !content.classList.contains('subsection-content')) {
                return;
            }
            
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', String(!isExpanded));
            
            if (!isExpanded) {
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
            }
        });
    });

    const lightbox = document.querySelector('[data-carousel-lightbox]');
    const lightboxImage = lightbox?.querySelector('[data-carousel-lightbox-image]');
    const lightboxCaption = lightbox?.querySelector('[data-carousel-lightbox-caption]');
    const lightboxClose = lightbox?.querySelector('[data-carousel-lightbox-close]');
    const lightboxPrev = lightbox?.querySelector('[data-carousel-lightbox-prev]');
    const lightboxNext = lightbox?.querySelector('[data-carousel-lightbox-next]');

    let lightboxItems = [];
    let lightboxIndex = 0;

    function updateLightboxView() {
        if (!lightboxImage || !lightboxItems.length) {
            return;
        }

        const item = lightboxItems[lightboxIndex] || lightboxItems[0];
        lightboxImage.src = item.src;
        lightboxImage.alt = item.alt || 'Gallery image';

        if (lightboxCaption) {
            lightboxCaption.textContent = item.alt || '';
        }
    }

    function openLightbox(items, startIndex) {
        if (!lightbox || !Array.isArray(items) || !items.length) {
            return;
        }

        lightboxItems = items;
        lightboxIndex = (startIndex + items.length) % items.length;
        updateLightboxView();
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        lightboxClose?.focus();
    }

    function closeLightbox() {
        if (!lightbox || !lightbox.classList.contains('active')) {
            return;
        }

        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function stepLightbox(direction) {
        if (!lightboxItems.length) {
            return;
        }

        lightboxIndex = (lightboxIndex + direction + lightboxItems.length) % lightboxItems.length;
        updateLightboxView();
    }

    lightboxClose?.addEventListener('click', closeLightbox);
    lightboxPrev?.addEventListener('click', () => stepLightbox(-1));
    lightboxNext?.addEventListener('click', () => stepLightbox(1));

    lightbox?.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (!lightbox?.classList.contains('active')) {
            return;
        }

        if (event.key === 'Escape') {
            closeLightbox();
            return;
        }

        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            stepLightbox(-1);
            return;
        }

        if (event.key === 'ArrowRight') {
            event.preventDefault();
            stepLightbox(1);
        }
    });

    document.querySelectorAll('[data-carousel]').forEach((carousel) => {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
        const slideImages = slides
            .map((slide) => slide.querySelector('img'))
            .filter(Boolean)
            .map((img) => ({
                src: img.currentSrc || img.src,
                alt: img.alt || ''
            }));
        const prevBtn = carousel.querySelector('.carousel-control.prev');
        const nextBtn = carousel.querySelector('.carousel-control.next');
        const dotsWrap = carousel.querySelector('.carousel-dots');

        if (!track || slides.length <= 1) {
            return;
        }

        let currentIndex = 0;
        let autoRotateTimer = null;

        const dots = slides.map((_, index) => {
            if (!dotsWrap) {
                return null;
            }

            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Show gallery image ${index + 1}`);
            dot.addEventListener('click', () => {
                moveTo(index);
                restartAutoRotate();
            });
            dotsWrap.appendChild(dot);
            return dot;
        });

        function updateCarousel() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;

            dots.forEach((dot, index) => {
                if (dot) {
                    dot.classList.toggle('active', index === currentIndex);
                }
            });
        }

        function moveTo(nextIndex) {
            currentIndex = (nextIndex + slides.length) % slides.length;
            updateCarousel();
        }

        function startAutoRotate() {
            autoRotateTimer = setInterval(() => {
                moveTo(currentIndex + 1);
            }, 7000);
        }

        function stopAutoRotate() {
            if (autoRotateTimer) {
                clearInterval(autoRotateTimer);
                autoRotateTimer = null;
            }
        }

        function restartAutoRotate() {
            stopAutoRotate();
            startAutoRotate();
        }

        slides.forEach((slide, index) => {
            const image = slide.querySelector('img');
            if (!image) {
                return;
            }

            image.classList.add('carousel-zoomable');
            image.tabIndex = 0;
            image.setAttribute('aria-label', `Open larger view for gallery image ${index + 1}`);

            image.addEventListener('click', () => {
                openLightbox(slideImages, index);
            });

            image.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openLightbox(slideImages, index);
                }
            });
        });

        prevBtn?.addEventListener('click', () => {
            moveTo(currentIndex - 1);
            restartAutoRotate();
        });

        nextBtn?.addEventListener('click', () => {
            moveTo(currentIndex + 1);
            restartAutoRotate();
        });

        carousel.addEventListener('mouseenter', stopAutoRotate);
        carousel.addEventListener('mouseleave', startAutoRotate);
        carousel.addEventListener('focusin', stopAutoRotate);
        carousel.addEventListener('focusout', startAutoRotate);

        updateCarousel();
        startAutoRotate();
    });

    const testimonialsCarousel = document.querySelector('[data-testimonials-carousel]');
    const reviewsContainer = testimonialsCarousel?.querySelector('.testimonials-track');
    if (testimonialsCarousel && reviewsContainer) {
        const testimonialsPrevBtn = testimonialsCarousel.querySelector('.carousel-control.prev');
        const testimonialsNextBtn = testimonialsCarousel.querySelector('.carousel-control.next');
        const testimonialsDotsWrap = testimonialsCarousel.querySelector('.carousel-dots');
        let testimonialIndex = 0;
        let testimonialsTimer = null;

        function getTestimonialSlides() {
            return Array.from(reviewsContainer.querySelectorAll('.carousel-slide'));
        }

        function updateTestimonialCarousel() {
            const slides = getTestimonialSlides();
            const hasMultiple = slides.length > 1;

            reviewsContainer.style.transform = `translateX(-${testimonialIndex * 100}%)`;

            if (testimonialsDotsWrap) {
                Array.from(testimonialsDotsWrap.children).forEach((dot, index) => {
                    dot.classList.toggle('active', index === testimonialIndex);
                });
            }

            if (testimonialsPrevBtn) {
                testimonialsPrevBtn.style.display = hasMultiple ? 'inline-flex' : 'none';
            }

            if (testimonialsNextBtn) {
                testimonialsNextBtn.style.display = hasMultiple ? 'inline-flex' : 'none';
            }
        }

        function moveTestimonialTo(nextIndex) {
            const slides = getTestimonialSlides();
            if (!slides.length) {
                testimonialIndex = 0;
                return;
            }

            testimonialIndex = (nextIndex + slides.length) % slides.length;
            updateTestimonialCarousel();
        }

        function stopTestimonialsAutoRotate() {
            if (testimonialsTimer) {
                clearInterval(testimonialsTimer);
                testimonialsTimer = null;
            }
        }

        function startTestimonialsAutoRotate() {
            const slides = getTestimonialSlides();
            if (slides.length <= 1) {
                return;
            }

            testimonialsTimer = setInterval(() => {
                moveTestimonialTo(testimonialIndex + 1);
            }, 15000);
        }

        function restartTestimonialsAutoRotate() {
            stopTestimonialsAutoRotate();
            startTestimonialsAutoRotate();
        }

        function rebuildTestimonialDots() {
            if (!testimonialsDotsWrap) {
                return;
            }

            const slides = getTestimonialSlides();
            testimonialsDotsWrap.innerHTML = '';

            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'carousel-dot';
                dot.setAttribute('aria-label', `Show testimonial ${index + 1}`);
                dot.addEventListener('click', () => {
                    moveTestimonialTo(index);
                    restartTestimonialsAutoRotate();
                });
                testimonialsDotsWrap.appendChild(dot);
            });
        }

        function syncTestimonialCarousel(resetToFirst = true) {
            const slides = getTestimonialSlides();

            if (resetToFirst || testimonialIndex >= slides.length) {
                testimonialIndex = 0;
            }

            rebuildTestimonialDots();
            updateTestimonialCarousel();
            restartTestimonialsAutoRotate();
        }

        testimonialsPrevBtn?.addEventListener('click', () => {
            moveTestimonialTo(testimonialIndex - 1);
            restartTestimonialsAutoRotate();
        });

        testimonialsNextBtn?.addEventListener('click', () => {
            moveTestimonialTo(testimonialIndex + 1);
            restartTestimonialsAutoRotate();
        });

        testimonialsCarousel.addEventListener('mouseenter', stopTestimonialsAutoRotate);
        testimonialsCarousel.addEventListener('mouseleave', startTestimonialsAutoRotate);
        testimonialsCarousel.addEventListener('focusin', stopTestimonialsAutoRotate);
        testimonialsCarousel.addEventListener('focusout', startTestimonialsAutoRotate);

        const googleConfig = window.GOOGLE_REVIEWS_CONFIG || {};
        const googlePlaceId = googleConfig.placeId || '';
        const googleApiKey = googleConfig.apiKey || '';
        const endpointUrl = String(googleConfig.reviewsEndpoint || '/api/google-reviews').trim();
        const preferSecureEndpoint = googleConfig.preferSecureEndpoint !== false;
        const testimonialsMode = String(googleConfig.testimonialsMode || 'manual').toLowerCase();
        const fiveStarOnly = googleConfig.fiveStarOnly !== false;
        const maxTestimonials = Math.max(1, Number(googleConfig.maxTestimonials || 3));
        const manualTestimonials = Array.isArray(googleConfig.manualTestimonials)
            ? googleConfig.manualTestimonials
            : [];


        function escapeHtml(value) {
            return String(value || '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        function normalizeReviews(rawReviews, fallbackRole = 'Google Review') {
            const requiredRating = fiveStarOnly ? 5 : 4;

            return (Array.isArray(rawReviews) ? rawReviews : [])
                .map((review) => ({
                    name: review.authorAttribution?.displayName || review.name || 'Google Reviewer',
                    role: review.role || fallbackRole,
                    text: review.text?.text || review.originalText?.text || review.text || '',
                    rating: Number(review.rating || 0)
                }))
                .filter((review) => review.text && review.rating >= requiredRating)
                .slice(0, maxTestimonials);
        }

        function renderEmptyState(message) {
            reviewsContainer.innerHTML = `
                <article class="carousel-slide testimonial-slide">
                    <p class="testimonial-empty">${escapeHtml(message)}</p>
                </article>
            `;
            syncTestimonialCarousel();
        }

        function renderReviews(reviews, fallbackRole = 'Google Review') {
            const visibleReviews = normalizeReviews(reviews, fallbackRole);

            if (!visibleReviews.length) {
                renderEmptyState('No testimonials are available right now. Please check back soon.');
                return;
            }

            reviewsContainer.innerHTML = '';

            visibleReviews.forEach((review) => {
                const starsCount = Math.max(1, Math.min(5, Math.round(review.rating)));
                const stars = `${'★'.repeat(starsCount)}${'☆'.repeat(5 - starsCount)}`;
                const card = document.createElement('article');
                card.className = 'carousel-slide testimonial-slide';
                card.innerHTML = `
                    <article class="testimonial-card">
                        <p class="testimonial-text">"${escapeHtml(review.text)}"</p>
                        <div class="testimonial-author">
                            <strong>${escapeHtml(review.name)}</strong>
                            <span>${escapeHtml(review.role)}</span>
                            <span class="testimonial-stars">${stars}</span>
                        </div>
                    </article>
                `;
                reviewsContainer.appendChild(card);
            });

            syncTestimonialCarousel();
        }

        function tryManualTestimonials() {
            if (!manualTestimonials.length) {
                return false;
            }

            if (normalizeReviews(manualTestimonials, 'Patient Testimonial').length) {
                renderReviews(manualTestimonials, 'Patient Testimonial');
                return true;
            }

            return false;
        }

        async function fetchFromPlacesHttpApi() {
            const placesUrl = `https://places.googleapis.com/v1/places/${encodeURIComponent(googlePlaceId)}?fields=reviews,displayName&key=${encodeURIComponent(googleApiKey)}`;
            const response = await fetch(placesUrl);

            if (!response.ok) {
                throw new Error(`Places API request failed: ${response.status}`);
            }

            const data = await response.json();
            return data?.reviews || [];
        }

        function loadGoogleMapsScript() {
            return new Promise((resolve, reject) => {
                if (window.google?.maps?.places) {
                    resolve();
                    return;
                }

                const existing = document.querySelector('script[data-google-maps="reviews"]');
                if (existing) {
                    existing.addEventListener('load', () => resolve());
                    existing.addEventListener('error', () => reject(new Error('Google Maps script failed to load.')));
                    return;
                }

                const script = document.createElement('script');
                script.async = true;
                script.defer = true;
                script.dataset.googleMaps = 'reviews';
                script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(googleApiKey)}&libraries=places`;
                script.addEventListener('load', () => resolve());
                script.addEventListener('error', () => reject(new Error('Google Maps script failed to load.')));
                document.head.appendChild(script);
            });
        }

        function fetchFromMapsPlacesSdk() {
            return new Promise((resolve, reject) => {
                if (!window.google?.maps?.places) {
                    reject(new Error('Google Places SDK unavailable.'));
                    return;
                }

                const mapEl = document.createElement('div');
                mapEl.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;';
                document.body.appendChild(mapEl);

                const map = new window.google.maps.Map(mapEl, {
                    center: { lat: 41.0356, lng: -111.9386 },
                    zoom: 10
                });

                const service = new window.google.maps.places.PlacesService(map);
                service.getDetails(
                    {
                        placeId: googlePlaceId,
                        fields: ['reviews', 'name']
                    },
                    (place, status) => {
                        mapEl.remove();
                        const ok = status === window.google.maps.places.PlacesServiceStatus.OK;
                        if (!ok) {
                            reject(new Error(`Places SDK request failed: ${status}`));
                            return;
                        }

                        resolve(place?.reviews || []);
                    }
                );
            });
        }

        async function fetchFromConfiguredEndpoint() {
            if (!endpointUrl) {
                throw new Error('No reviews endpoint configured.');
            }

            const response = await fetch(endpointUrl);
            if (!response.ok) {
                throw new Error(`Review endpoint failed: ${response.status}`);
            }

            const data = await response.json();
            return Array.isArray(data?.reviews) ? data.reviews : [];
        }

        async function tryBrowserGoogleSources() {
            if (!googlePlaceId || !googleApiKey) {
                return false;
            }

            try {
                const httpReviews = await fetchFromPlacesHttpApi();
                if (normalizeReviews(httpReviews).length) {
                    renderReviews(httpReviews);
                    return true;
                }
            } catch (error) {
                // Continue to SDK attempt.
            }

            try {
                await loadGoogleMapsScript();
                const sdkReviews = await fetchFromMapsPlacesSdk();
                if (normalizeReviews(sdkReviews).length) {
                    renderReviews(sdkReviews);
                    return true;
                }
            } catch (error) {
                // Browser Google sources failed.
            }

            return false;
        }

        async function tryConfiguredEndpointSource() {
            try {
                const endpointReviews = await fetchFromConfiguredEndpoint();
                if (normalizeReviews(endpointReviews).length) {
                    renderReviews(endpointReviews);
                    return true;
                }
            } catch (error) {
                // Endpoint source failed.
            }

            return false;
        }

        async function initializeTestimonials() {
            renderEmptyState('Loading testimonials...');

            if (testimonialsMode === 'manual') {
                if (tryManualTestimonials()) {
                    return;
                }

                renderEmptyState('Add testimonials in GOOGLE_REVIEWS_CONFIG.manualTestimonials to display them here.');
                return;
            }

            if (testimonialsMode === 'hybrid' && tryManualTestimonials()) {
                return;
            }

            if (preferSecureEndpoint) {
                if (await tryConfiguredEndpointSource()) {
                    return;
                }

                if (await tryBrowserGoogleSources()) {
                    return;
                }
            } else {
                if (await tryBrowserGoogleSources()) {
                    return;
                }

                if (await tryConfiguredEndpointSource()) {
                    return;
                }
            }

            renderEmptyState('We could not load 5-star live testimonials right now. Use the Google Reviews button below for the latest reviews.');
        }

        initializeTestimonials();
    }
})();
