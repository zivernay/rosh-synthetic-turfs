import portfolioImage1 from '../assets/images/7.webp';
import portfolioImage2 from '../assets/images/4.webp';
import portfolioImage3 from '../assets/images/5.webp';
import portfolioImage4 from '../assets/images/2.webp';

const PHONE_NUMBER = '27609697561';
const portfolioImages: Record<string, string> = {
    '1': portfolioImage1,
    '2': portfolioImage2,
    '3': portfolioImage3,
    '4': portfolioImage4,
};

function openPortfolioLightbox(src: string, caption: string) {
    const lightbox = document.getElementById('portfolio-lightbox');
    const image = document.getElementById('portfolio-lightbox-img') as HTMLImageElement | null;

    if (!lightbox || !image) {
        return;
    }

    image.src = src;
    image.alt = caption;
    lightbox.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
}

function closePortfolioLightbox() {
    const lightbox = document.getElementById('portfolio-lightbox');

    if (!lightbox) {
        return;
    }

    lightbox.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
}

function requestQuote(turfName: string) {
    const message = `Hi Rosh Synthetics, I am interested in getting a quote for the ${turfName} artificial grass. Could you please provide me with more information?`;
    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function sendCustomQuote() {
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

function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn') as HTMLButtonElement | null;
    const menu = document.getElementById('mobile-menu') as HTMLElement | null;

    if (!btn || !menu) {
        return;
    }

    btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.add('hidden');
        });
    });
}

function initPortfolioLightbox() {
    const lightbox = document.getElementById('portfolio-lightbox');
    const closeBtn = document.getElementById('portfolio-lightbox-close');
    const viewButtons = document.querySelectorAll<HTMLElement>('.portfolio-view-btn');

    if (!lightbox || !closeBtn) {
        return;
    }

    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const key = button.getAttribute('data-key');
            const caption = button.getAttribute('data-caption') || 'Project preview';
            const src = key ? portfolioImages[key] : '';
            if (src) {
                openPortfolioLightbox(src, caption);
            }
        });
    });

    closeBtn.addEventListener('click', closePortfolioLightbox);

    lightbox.addEventListener('click', event => {
        if (event.target === lightbox) {
            closePortfolioLightbox();
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closePortfolioLightbox();
        }
    });
}

function initQuoteButtons() {
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

function init() {
    initMobileMenu();
    initPortfolioLightbox();
    initQuoteButtons();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}