import { EnText, RUText, ENMobileText, RUMobileText } from './constant.js';
import { updateImages } from './image.js';
import {
  changeDesignElements,
  checkImagesLoaded,
  resetAnimation,
} from './util.js';

const switchLanguageButton = document.getElementById('language-selector');
const html = document.querySelector('html');
const localizedText = {
  russian: {
    mobile: { texts: RUMobileText },
    default: { texts: RUText },
  },
  english: {
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
switchLanguageButton.dataset.language = 'russian';

console.time('Loading time');
window.addEventListener('load', () => {
  console.timeEnd('Loading time');
  loader.style.display = 'none';
});

window.addEventListener('DOMContentLoaded', () => {
  const language = switchLanguageButton.dataset.language;
  changeDesignElements(html);

  const hasNewDesign = html.dataset.design;
  changeLanguage(hasNewDesign, language, mqlMobile.matches);
  booksAnimation();

  if (hasNewDesign === 'new') {
    sideElementsAnimation();
  }
});

switchLanguageButton.addEventListener('click', () => {
  const currentLanguage =
    switchLanguageButton.dataset.language === 'russian' ? 'english' : 'russian';
  const newDesign = html.dataset.design;
  loader.style.display = 'flex';
  const hasNewDesign = html.getAttribute('data-design') === 'new';

  changeLanguage(newDesign, currentLanguage, mqlMobile.matches).then(
    (result) => {
      checkImagesLoaded(result.timestamp, loader, true);
    }
  );

  if (hasNewDesign) sideElementsAnimation();

  booksAnimation();
  switchLanguageButton.dataset.language = currentLanguage;
});

mqlMobile.addEventListener('change', (event) => {
  if (!event.matches) return;
  const hasNewDesign = html.getAttribute('data-design') === 'new';
  loader.style.display = 'flex';

  if (hasNewDesign) sideElementsAnimation();

  booksAnimation();

  updateText(event.matches, switchLanguageButton.dataset.language);
  loader.style.display = 'none';
});

mqlDefault.addEventListener('change', (event) => {
  if (!event.matches) return;
  const hasNewDesign = html.getAttribute('data-design') === 'new';
  loader.style.display = 'flex';

  booksAnimation();
  updateText(false, switchLanguageButton.dataset.language);

  if (hasNewDesign) sideElementsAnimation();

  loader.style.display = 'none';
});

/* ChangeLanguage */
async function changeLanguage(dataDesign, language, isMobile = false) {
  try {
    updateText(isMobile, language);
    const result = await updateImages(dataDesign, language);

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
