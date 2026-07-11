
        const app = (function() {
            
            // --- 1. State & Data Management (Like a React Component State) ---
            const pricingData: Record<string, number> = {
                'Eco 20mm': 340,
                'Augusta 25mm': 380,
                'Turf & Block': 380,
                'Multi Sport 15mm': 440
            };

            const state = {
                turfType: 'Eco 20mm',
                areaSize: 50,
                totalCost: 17000
            };

            // --- 2. DOM Elements Mapping ---
            const DOM = {
                nav: {
                    navbar: document.getElementById('navbar') as HTMLElement | null,
                    mobileBtn: document.getElementById('mobile-menu-btn') as HTMLButtonElement | null,
                    mobileMenu: document.getElementById('mobile-menu') as HTMLElement | null,
                    menuLinks: Array.from(document.querySelectorAll<HTMLElement>('.menu-link'))
                },
                estimator: {
                    turfSelect: document.getElementById('turf-type') as HTMLSelectElement | null,
                    areaSlider: document.getElementById('area-slider') as HTMLInputElement | null,
                    areaDisplay: document.getElementById('area-display') as HTMLElement | null,
                    totalDisplay: document.getElementById('total-cost-display') as HTMLElement | null,
                    whatsappBtn: document.getElementById('whatsapp-quote-btn') as HTMLButtonElement | null
                },
                lightbox: {
                    container: document.getElementById('lightbox') as HTMLElement | null,
                    img: document.getElementById('lightbox-img') as HTMLImageElement | null,
                    caption: document.getElementById('lightbox-caption') as HTMLElement | null,
                    closeBtn: document.getElementById('lightbox-close') as HTMLButtonElement | null,
                    items: Array.from(document.querySelectorAll<HTMLElement>('.gallery-item'))
                },
                revealElements: Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
            };

            // --- 3. UI Component Controllers ---

            const NavbarController = {
                init() {
                    if (!DOM.nav.mobileBtn || !DOM.nav.mobileMenu || !DOM.nav.navbar) {
                        return;
                    }

                    const navbar = DOM.nav.navbar;

                    // Mobile menu toggle
                    DOM.nav.mobileBtn.addEventListener('click', () => {
                        DOM.nav.mobileMenu?.classList.toggle('hidden');
                    });

                    // Close menu on link click
                    DOM.nav.menuLinks.forEach(link => {
                        link.addEventListener('click', () => {
                            DOM.nav.mobileMenu?.classList.add('hidden');
                        });
                    });

                    // Scroll effect
                    window.addEventListener('scroll', () => {
                        if (window.scrollY > 20) {
                            navbar.classList.add('shadow-md');
                            navbar.classList.replace('bg-white/95', 'bg-white');
                        } else {
                            navbar.classList.remove('shadow-md');
                            navbar.classList.replace('bg-white', 'bg-white/95');
                        }
                    });
                }
            };

            const EstimatorController = {
                calculate() {
                    const pricePerSqm = pricingData[state.turfType];
                    state.totalCost = state.areaSize * pricePerSqm;
                    this.render();
                },
                updateStateFromInputs() {
                    if (!DOM.estimator.turfSelect || !DOM.estimator.areaSlider) {
                        return;
                    }

                    state.turfType = DOM.estimator.turfSelect.value;
                    state.areaSize = parseInt(DOM.estimator.areaSlider.value, 10);
                    this.calculate();
                },
                render() {
                    if (!DOM.estimator.turfSelect || !DOM.estimator.areaSlider || !DOM.estimator.areaDisplay || !DOM.estimator.totalDisplay || !DOM.estimator.whatsappBtn) {
                        return;
                    }

                    // Sync DOM with State (React paradigm)
                    DOM.estimator.turfSelect.value = state.turfType;
                    DOM.estimator.areaSlider.value = String(state.areaSize);
                    DOM.estimator.areaDisplay.textContent = String(state.areaSize);
                    
                    // Format currency nicely
                    DOM.estimator.totalDisplay.textContent = 'R ' + state.totalCost.toLocaleString('en-ZA');

                    // Update WhatsApp Payload
                    const waText = `Hi Rosh Synthetics, I used the calculator on your website. I have an area of approximately ${state.areaSize} m² and I am interested in the ${state.turfType} product. The estimated cost showed R${state.totalCost.toLocaleString('en-ZA')}. Can we arrange a site visit for a formal quote?`;
                    DOM.estimator.whatsappBtn.onclick = () => {
                        window.open(`https://wa.me/27609697561?text=${encodeURIComponent(waText)}`, '_blank');
                    };
                },
                init() {
                    if (!DOM.estimator.turfSelect || !DOM.estimator.areaSlider) {
                        return;
                    }

                    // Listeners
                    DOM.estimator.turfSelect.addEventListener('change', () => this.updateStateFromInputs());
                    DOM.estimator.areaSlider.addEventListener('input', () => this.updateStateFromInputs());
                    // Initial Render
                    this.render();
                }
            };

            const LightboxController = {
                open(src: string, caption: string) {
                    if (!DOM.lightbox.img || !DOM.lightbox.caption || !DOM.lightbox.container) {
                        return;
                    }

                    DOM.lightbox.img.src = src;
                    DOM.lightbox.caption.textContent = caption;
                    DOM.lightbox.container.classList.remove('hidden');
                    
                    // Trigger CSS transition
                    requestAnimationFrame(() => {
                        DOM.lightbox.container?.classList.remove('opacity-0');
                        DOM.lightbox.img?.classList.remove('scale-95');
                        DOM.lightbox.img?.classList.add('scale-100');
                    });
                    document.body.style.overflow = 'hidden'; // Lock background scroll
                },
                close() {
                    if (!DOM.lightbox.img || !DOM.lightbox.container) {
                        return;
                    }

                    DOM.lightbox.container.classList.add('opacity-0');
                    DOM.lightbox.img.classList.remove('scale-100');
                    DOM.lightbox.img.classList.add('scale-95');
                    
                    setTimeout(() => {
                        DOM.lightbox.container?.classList.add('hidden');
                        document.body.style.overflow = 'auto'; // Unlock background scroll
                    }, 300); // Matches Tailwind transition duration
                },
                init() {
                    if (!DOM.lightbox.container || !DOM.lightbox.closeBtn) {
                        return;
                    }

                    const container = DOM.lightbox.container;

                    // Bind gallery items
                    DOM.lightbox.items.forEach(item => {
                        item.addEventListener('click', () => {
                            const src = item.getAttribute('data-src') ?? '';
                            const caption = item.getAttribute('data-caption') ?? '';
                            this.open(src, caption);
                        });
                    });

                    // Bind close events
                    DOM.lightbox.closeBtn.addEventListener('click', () => this.close());
                    container.addEventListener('click', (e) => {
                        if (e.target === container) this.close();
                    });
                    document.addEventListener('keydown', (e) => {
                        if (e.key === 'Escape' && !container.classList.contains('hidden')) {
                            this.close();
                        }
                    });
                }
            };

            const AnimationController = {
                init() {
                    // Native Intersection Observer for scroll animations (replaces heavy GSAP/Framer libraries)
                    const observerOptions = {
                        threshold: 0.1,
                        rootMargin: "0px 0px -50px 0px"
                    };

                    const observer = new IntersectionObserver((entries, observer) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                entry.target.classList.add('active');
                                observer.unobserve(entry.target); // Only animate once
                            }
                        });
                    }, observerOptions);

                    DOM.revealElements.forEach(el => observer.observe(el));
                }
            };

            // --- 4. Public API ---
            return {
                init() {
                    NavbarController.init();
                    EstimatorController.init();
                    LightboxController.init();
                    AnimationController.init();
                },
                // Expose method to select product from cards (bypassing normal flow)
                selectProduct(productName: string) {
                    if (pricingData[productName] !== undefined) {
                        state.turfType = productName;
                        EstimatorController.render();
                        EstimatorController.calculate();
                        document.getElementById('estimator')?.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            };

        })();

        // Boot the app when DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
            app.init();
        });