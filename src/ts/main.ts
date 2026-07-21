const PHONE_NUMBER = '27609697561';

type GalleryLoader = () => Promise<string[]>;

const portfolioGalleries: Record<string, GalleryLoader> = {
    largeBackyard: async () => {
        const [a, b, c, d] = await Promise.all([
            import('../assets/images/portfolio/largeBackyard/large backyard a.jpeg'),
            import('../assets/images/portfolio/largeBackyard/large backyard b.jpeg'),
            import('../assets/images/portfolio/largeBackyard/large backyard c.jpeg'),
            import('../assets/images/portfolio/largeBackyard/large backyard d.jpeg'),
        ]);
        return [a.default, b.default, c.default, d.default];
    },
    circularBricks: async () => {
        const [a, b] = await Promise.all([
            import('../assets/images/portfolio/circularBricks/c bricks a.jpeg'),
            import('../assets/images/portfolio/circularBricks/c bricks b.jpeg'),
        ]);
        return [a.default, b.default];
    },
    jungleGym: async () => {
        const [a, b] = await Promise.all([
            import('../assets/images/portfolio/jungleGym/jungle gym.jpeg'),
            import('../assets/images/portfolio/jungleGym/jungle gym ckoseup.jpeg'),
        ]);
        return [a.default, b.default];
    },
    yardVideos: async () => {
        const [a, b] = await Promise.all([
            import('../assets/videos/yardwalk.webp'),
            import('../assets/videos/yardwark reversed.webp'),
        ]);
        return [a.default, b.default];
    },
};

const galleryCache: Record<string, string[]> = {};

let activeGallery: string[] = [];
let activeGalleryIndex = 0;
let activeCaption = '';

interface CarouselButton extends HTMLButtonElement {
    __carouselBound?: boolean;
}

async function loadGallery(galleryId: string): Promise<string[]> {
    if (galleryCache[galleryId]) {
        return galleryCache[galleryId];
    }

    const loader = portfolioGalleries[galleryId];
    if (!loader) {
        return [];
    }

    const images = await loader();
    galleryCache[galleryId] = images;
    return images;
}

function getLightboxElements() {
    return {
        lightbox: document.getElementById('portfolio-lightbox') as HTMLDialogElement | null,
        image: document.getElementById('portfolio-lightbox-img') as HTMLImageElement | null,
        caption: document.getElementById('portfolio-lightbox-caption') as HTMLParagraphElement | null,
        counter: document.getElementById('portfolio-lightbox-counter') as HTMLParagraphElement | null,
        prevBtn: document.getElementById('portfolio-lightbox-prev') as HTMLButtonElement | null,
        nextBtn: document.getElementById('portfolio-lightbox-next') as HTMLButtonElement | null,
    };
}

function updateGalleryControls(): void {
    const { counter, prevBtn, nextBtn } = getLightboxElements();
    const hasMultiple = activeGallery.length > 1;

    if (prevBtn) {
        prevBtn.classList.toggle('hidden', !hasMultiple);
    }

    if (nextBtn) {
        nextBtn.classList.toggle('hidden', !hasMultiple);
    }

    if (counter) {
        if (hasMultiple) {
            counter.textContent = `${activeGalleryIndex + 1} / ${activeGallery.length}`;
            counter.classList.remove('hidden');
        } else {
            counter.classList.add('hidden');
        }
    }
}

function showGallerySlide(index: number): void {
    const { image, caption } = getLightboxElements();

    if (!image || activeGallery.length === 0) {
        return;
    }

    const safeIndex = ((index % activeGallery.length) + activeGallery.length) % activeGallery.length;
    activeGalleryIndex = safeIndex;

    image.classList.remove('hidden');
    image.src = activeGallery[safeIndex];
    image.alt = activeCaption;

    if (caption) {
        caption.textContent = activeCaption;
    }

    updateGalleryControls();
}

function navigateGallery(direction: number): void {
    if (activeGallery.length === 0) {
        return;
    }

    showGallerySlide(activeGalleryIndex + direction);
}

async function openPortfolioGallery(galleryId: string, caption: string): Promise<void> {
    const { lightbox, image } = getLightboxElements();

    if (!lightbox || !image) {
        return;
    }

    const images = await loadGallery(galleryId);
    if (images.length === 0) {
        return;
    }

    activeGallery = images;
    activeGalleryIndex = 0;
    activeCaption = caption;

    showGallerySlide(0);
    document.body.classList.add('overflow-hidden');
    lightbox.showModal();
}

function closePortfolioLightbox(): void {
    const { lightbox, image } = getLightboxElements();

    if (!lightbox) {
        return;
    }

    if (image) {
        image.removeAttribute('src');
        image.classList.add('hidden');
    }

    activeGallery = [];
    activeGalleryIndex = 0;
    activeCaption = '';

    if (lightbox.open) {
        lightbox.close();
    }

    document.body.classList.remove('overflow-hidden');
}

function requestQuote(turfName: string): void {
    const message = `Hi Rosh Synthetics, I am interested in getting a quote for the ${turfName} artificial grass. Could you please provide me with more information?`;
    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function sendCustomQuote(): void {
    const turfSelect = document.getElementById('calc-turf') as HTMLSelectElement | null;
    const areaInput = document.getElementById('calc-area') as HTMLInputElement | null;

    if (!turfSelect || !areaInput) {
        return;
    }

    const selectedTurf = turfSelect.value;
    const area = areaInput.value;

    const message = area
        ? `Hi Rosh Synthetics, I would like to request an estimate. I have an area of approximately ${area} square meters and I am interested in: ${selectedTurf}.`
        : `Hi Rosh Synthetics, I would like to request an estimate for: ${selectedTurf}. I'm not sure of the exact measurements yet.`;

    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function initMobileMenu(): void {
    const btn = document.getElementById('mobile-menu-btn') as HTMLButtonElement | null;
    const menu = document.getElementById('mobile-menu') as HTMLElement | null;

    if (!btn || !menu) {
        return;
    }

    btn.addEventListener('click', () => {
        const isHidden = menu.classList.toggle('hidden');
        btn.setAttribute('aria-expanded', String(!isHidden));
        btn.setAttribute('aria-label', isHidden ? 'Open navigation menu' : 'Close navigation menu');
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.add('hidden');
            btn.setAttribute('aria-expanded', 'false');
            btn.setAttribute('aria-label', 'Open navigation menu');
        });
    });
}

function initPortfolioLightbox(): void {
    const { lightbox, closeBtn, prevBtn, nextBtn } = {
        ...getLightboxElements(),
        closeBtn: document.getElementById('portfolio-lightbox-close') as HTMLButtonElement | null,
    };

    if (!lightbox || !closeBtn) {
        return;
    }

    document.querySelectorAll<HTMLElement>('.portfolio-view-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const galleryId = button.getAttribute('data-gallery');
            const caption = button.getAttribute('data-caption') || 'Project preview';

            if (galleryId) {
                await openPortfolioGallery(galleryId, caption);
            }
        });
    });

    closeBtn.addEventListener('click', closePortfolioLightbox);
    prevBtn?.addEventListener('click', () => navigateGallery(-1));
    nextBtn?.addEventListener('click', () => navigateGallery(1));

    lightbox.addEventListener('click', event => {
        if (event.target === lightbox) {
            closePortfolioLightbox();
        }
    });

    lightbox.addEventListener('close', () => {
        document.body.classList.remove('overflow-hidden');
    });

    document.addEventListener('keydown', event => {
        if (!lightbox.open) {
            return;
        }

        if (event.key === 'Escape') {
            closePortfolioLightbox();
        } else if (event.key === 'ArrowLeft') {
            navigateGallery(-1);
        } else if (event.key === 'ArrowRight') {
            navigateGallery(1);
        }
    });
}

function initQuoteButtons(): void {
    document.querySelectorAll<HTMLElement>('.quote-card-btn').forEach(button => {
        button.addEventListener('click', () => {
            const product = button.getAttribute('data-product');
            if (product) {
                requestQuote(product);
            }
        });
    });

    const customQuoteBtn = document.getElementById('custom-quote-btn');
    customQuoteBtn?.addEventListener('click', sendCustomQuote);
}

declare global {
    interface Window {
        scrollCarousel?: (buttonElement: HTMLElement, direction: number) => void;
    }
}

window.scrollCarousel = function (buttonElement: HTMLElement, direction: number): void {
    performCarouselScroll(buttonElement, direction);
};

function getCarouselContainer(element: HTMLElement): HTMLElement | null {
    const carouselRoot = element.closest<HTMLElement>('.group');
    if (!carouselRoot) {
        return null;
    }

    return carouselRoot.querySelector<HTMLElement>('.product-carousel');
}

function getCarouselIndex(container: HTMLElement): number {
    return Math.round(container.scrollLeft / Math.max(1, container.clientWidth));
}

function scrollCarouselToIndex(container: HTMLElement, index: number): void {
    const slides = Array.from(container.children).filter((child): child is HTMLElement => child instanceof HTMLElement);
    if (slides.length === 0) {
        return;
    }

    const safeIndex = Math.max(0, Math.min(index, slides.length - 1));
    const targetSlide = slides[safeIndex];

    if (!targetSlide) {
        return;
    }

    container.scrollTo({ left: targetSlide.offsetLeft, behavior: 'smooth' });
}

function performCarouselScroll(buttonElement: HTMLElement, direction: number): void {
    const container = getCarouselContainer(buttonElement);
    if (!container) {
        return;
    }

    stopCarouselAutoPlay(container);

    const currentIndex = getCarouselIndex(container);
    const nextIndex = currentIndex + direction;
    scrollCarouselToIndex(container, nextIndex);
}

const carouselAutoPlayState = new WeakMap<HTMLElement, { intervalId?: number }>();

function stopCarouselAutoPlay(carousel: HTMLElement): void {
    const state = carouselAutoPlayState.get(carousel);
    if (!state?.intervalId) {
        return;
    }

    window.clearInterval(state.intervalId);
    state.intervalId = undefined;
}

function setupAutoCarousel(): void {
    const carousels = document.querySelectorAll<HTMLElement>('.product-carousel');

    carousels.forEach(carousel => {
        const slides = Array.from(carousel.children).filter((child): child is HTMLElement => child instanceof HTMLElement);
        if (slides.length < 2) {
            return;
        }

        carouselAutoPlayState.set(carousel, {});

        const intervalId = window.setInterval(() => {
            const state = carouselAutoPlayState.get(carousel);
            if (!state || state.intervalId === undefined) {
                return;
            }

            const index = getCarouselIndex(carousel);
            const nextIndex = (index + 1) % slides.length;
            scrollCarouselToIndex(carousel, nextIndex);
        }, 10000);

        carouselAutoPlayState.get(carousel)!.intervalId = intervalId;
    });
}

function setupCarouselControls(): void {
    const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('button.carousel-arrow'));

    buttons.forEach(btn => {
        const carouselButton = btn as CarouselButton;
        if (carouselButton.__carouselBound) {
            return;
        }

        carouselButton.addEventListener('click', event => {
            event.preventDefault();
            const dataDir = carouselButton.getAttribute('data-direction');
            const direction = dataDir ? parseInt(dataDir, 10) || 0 : 0;

            if (direction !== 0) {
                performCarouselScroll(carouselButton, direction);
            }
        });

        carouselButton.__carouselBound = true;
    });
}

function initYardVideoPreview(): void {
    const preview = document.getElementById('yard-video-preview') as HTMLImageElement | null;
    const tile = preview?.closest<HTMLElement>('[data-video-preview-tile]');

    if (!preview || !tile) {
        return;
    }

    const observer = new IntersectionObserver(async (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) {
            return;
        }

        observer.disconnect();

        // Load the static preview image
        const mod = await import('../assets/videos/thumbnail.webp');
        
        // Directly set the preview source without canvas frame extraction
        preview.src = mod.default;
        
    }, { rootMargin: '120px' });

    observer.observe(tile);
}

function buildCarouselDots(carousel: HTMLElement): HTMLElement | null {
    const parentElement = carousel.parentElement;
    if (!parentElement) {
        return null;
    }

    let dotsContainer = parentElement.querySelector<HTMLElement>('.carousel-dots');
    const slideCount = carousel.children.length;

    if (!dotsContainer) {
        dotsContainer = document.createElement('div');
        dotsContainer.className = 'carousel-dots';
        parentElement.appendChild(dotsContainer);
    }

    dotsContainer.replaceChildren();

    for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement('div');
        dot.className = `w-2 h-2 rounded-full shadow ${i === 0 ? 'bg-white/90' : 'bg-white/50'}`;
        dotsContainer.appendChild(dot);
    }

    return dotsContainer;
}

function setupCarouselDots(): void {
    const carousels = document.querySelectorAll<HTMLElement>('.product-carousel');

    carousels.forEach(carousel => {
        const dotsContainer = buildCarouselDots(carousel);
        if (!dotsContainer) {
            return;
        }

        const dots = Array.from(dotsContainer.children) as HTMLElement[];
        let ticking = false;

        const updateDots = () => {
            const index = getCarouselIndex(carousel);

            dots.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.remove('bg-white/50');
                    dot.classList.add('bg-white/90');
                } else {
                    dot.classList.remove('bg-white/90');
                    dot.classList.add('bg-white/50');
                }
            });

            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(updateDots);
            }
        };

        carousel.addEventListener('scroll', onScroll, { passive: true });
        updateDots();

        let resizeTimer: number | undefined;
        const onResize = () => {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(() => updateDots(), 150);
        };

        window.addEventListener('resize', onResize, { passive: true });
    });
}

function initRevealAnimations(): void {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll<HTMLElement>('.reveal').forEach(el => observer.observe(el));
}

function init(): void {
    initMobileMenu();
    initPortfolioLightbox();
    initQuoteButtons();
    setupCarouselDots();
    setupCarouselControls();
    setupAutoCarousel();
    initYardVideoPreview();
    initRevealAnimations();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
