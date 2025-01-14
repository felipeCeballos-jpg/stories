import { EnText, RUText, ENMobileText, RUMobileText } from './constant.js';
import { updateImages } from './image.js';
import {
  changeDesignElements,
  checkLoaded,
  initLanguage,
  resetAnimation,
  getLanguage,
  setLanguage,
} from './util.js';

const switchLanguageButton = document.getElementById('language-selector');
const html = document.querySelector('html');
const localizedText = {
  ru: {
    mobile: { texts: RUMobileText },
    default: { texts: RUText },
  },
  en: {
    mobile: { texts: ENMobileText },
    default: { texts: EnText },
  },
};

// Set media queries
const mqlMobile = window.matchMedia('(max-width: 800px)');
const mqlDefault = window.matchMedia('(min-width: 801px)');

// Set the loader element
const loader = document.querySelector('.loader');

// Set Language
/* html.lang = 'ru'; */
initLanguage(html);

const startLoadingTime = Date.now();
window.addEventListener('load', () => {
  checkLoaded(startLoadingTime, loader, true);
});

window.addEventListener('DOMContentLoaded', () => {
  changeDesignElements(html);

  const hasNewDesign = html.dataset.design;
  updateDesign(hasNewDesign, mqlMobile.matches);

  booksAnimation();

  if (hasNewDesign === 'new') {
    sideElementsAnimation();
  }
});

switchLanguageButton.addEventListener('click', () => {
  loader.style.display = 'flex';

  // Change language
  setLanguage(html);

  const newDesign = html.dataset.design;
  const hasNewDesign = html.getAttribute('data-design') === 'new';

  updateDesign(newDesign, mqlMobile.matches).then((result) => {
    checkLoaded(result.timestamp, loader, true);
  });

  if (hasNewDesign) sideElementsAnimation();

  booksAnimation();
});

mqlMobile.addEventListener('change', (event) => {
  if (!event.matches) return;
  loader.style.display = 'flex';

  const hasNewDesign = html.getAttribute('data-design') === 'new';
  const currentLanguage = getLanguage();
  if (hasNewDesign) sideElementsAnimation();

  booksAnimation();

  updateText(event.matches, currentLanguage);
  loader.style.display = 'none';
});

mqlDefault.addEventListener('change', (event) => {
  if (!event.matches) return;
  loader.style.display = 'flex';

  const hasNewDesign = html.getAttribute('data-design') === 'new';
  const currentLanguage = getLanguage();
  if (hasNewDesign) sideElementsAnimation();

  booksAnimation();

  updateText(false, currentLanguage);
  loader.style.display = 'none';
});

/* Update Design */
async function updateDesign(dataDesign, isMobile = false) {
  try {
    // Get current language
    const currentLanguage = getLanguage();
    updateText(isMobile, currentLanguage);

    const result = await updateImages(dataDesign, currentLanguage);

    if (!result.success) {
      console.warn(
        `Some images failed to load (${result.imagesLoaded}/${result.totalImages})`
      );
    }

    return result;
  } catch (error) {
    console.error('Failed to update images:', error);
    throw error;
  }
}

function updateText(isMobile, language) {
  const textElements = document.querySelectorAll('.changeable-txt');
  const deviceType = isMobile ? 'mobile' : 'default';
  const currentResource = localizedText[language][deviceType];

  // Update Text
  textElements.forEach((text, index) => {
    text.innerHTML = currentResource.texts[index];
  });
}

function booksAnimation() {
  resetAnimation([{ selector: '.menu', animationClass: 'menu-active' }]);

  const footer = document.querySelector('.section-navbook');
  const books = document.querySelector('.menu');
  const booksObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          books.classList.add('menu-active');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '0px',
      threshold: 0.6,
    }
  );

  booksObserver.observe(footer);
}

function sideElementsAnimation() {
  resetAnimation([
    { selector: '.scroll-action-left', animationClass: 'scroll-active-left' },
  ]);

  const elementsToAnimate = [{ selector: '.scroll-action-left', side: 'left' }];

  elementsToAnimate.forEach(({ selector, side }) => {
    document.querySelectorAll(selector).forEach((item) => {
      initScrollAnimationObserver(item, side);
    });
  });
}

function initScrollAnimationObserver(item, side) {
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(`scroll-active-${side}`);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '0px',
      threshold: 0, // trigger when 0% of the element is visible
    }
  );

  observer.observe(item);
}
