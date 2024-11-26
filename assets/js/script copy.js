import {
  EnText,
  RUText,
  ENMobileText,
  RUMobileText,
  ndImages,
  originalImages,
  multipleClasses,
  uniqueClasses,
  footerRuTranslateImgs,
  footerEnTranslateImgs,
  ndRuTranslateImgs,
  originalRuTranslateImgs,
  ndEnTranslateImgs,
  originalEnTranslateImgs,
} from './constant.js';

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

const localizedImages = {
  russian: {
    'new-design': { images: ndRuTranslateImgs },
    'original-design': { images: originalRuTranslateImgs },
  },
  english: {
    'new-design': { images: ndEnTranslateImgs },
    'original-design': { images: originalEnTranslateImgs },
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
  changeDesign();

  const newDesign = html.dataset.design;
  changeLanguage(newDesign, language, mqlMobile.matches);
  sideElementsAnimation();
  booksAnimation();
});

switchLanguageButton.addEventListener('click', () => {
  const currentLanguage =
    switchLanguageButton.dataset.language === 'russian' ? 'english' : 'russian';
  const newDesign = html.dataset.design;
  loader.style.display = 'flex';

  console.log({ newDesignButton: newDesign });
  const currentAssets = changeLanguage(
    newDesign,
    currentLanguage,
    mqlMobile.matches
  );
  sideElementsAnimation();
  booksAnimation();

  checkImagesLoaded(currentAssets.imagesLoaded, loader);
  switchLanguageButton.dataset.language = currentLanguage;
});

mqlMobile.addEventListener('change', (event) => {
  if (!event.matches) return;
  loader.style.display = 'flex';

  sideElementsAnimation();
  booksAnimation();
  const newDesign = html.dataset.design;
  const currentAssets = changeLanguage(
    newDesign,
    switchLanguageButton.dataset.language,
    event.matches
  );

  checkImagesLoaded(currentAssets.imagesLoaded, loader);
});

mqlDefault.addEventListener('change', (event) => {
  if (!event.matches) return;
  loader.style.display = 'flex';

  sideElementsAnimation();
  booksAnimation();
  const newDesign = html.dataset.design;
  const currentAssets = changeLanguage(
    newDesign,
    switchLanguageButton.dataset.language,
    false
  );

  checkImagesLoaded(currentAssets.imagesLoaded, loader);
});

/* ChangeLanguage */
function changeLanguage(dataDesign, language, isMobile = false) {
  const textElements = document.querySelectorAll('.changeable-txt');
  const deviceType = isMobile ? 'mobile' : 'default';
  const currentResource = localizedText[language][deviceType];

  // Update Text
  textElements.forEach((text, index) => {
    text.innerHTML = currentResource.texts[index];
  });

  console.log(dataDesign);

  let { imagesLoaded, totalImages } = updateImages(dataDesign, language);
  console.log({ imagesLoaded });
  console.log({ totalImages });

  return {
    imagesLoaded: () => imagesLoaded === totalImages,
  };
}

function updateImages(hasNewDesign, language) {
  // Selector
  const changeableTranslateImages =
    document.querySelectorAll('.changeable-img');
  const changeableNDImages = document.querySelectorAll('.changeable-nd-img');
  const changeableFooterImages = document.querySelectorAll(
    '.changeable-footer-img'
  );

  // Assing Images
  const currentTranslateImages = localizedImages[language][hasNewDesign];
  const currentDesignImages =
    hasNewDesign === 'new-design' ? ndImages : originalImages;
  let currentFooterImages =
    language === 'russian' ? footerRuTranslateImgs : footerEnTranslateImgs;

  console.log({ currentTranslateImages });
  console.log({ currentDesignImages });
  console.log({ currentFooterImages });

  const totalImages =
    changeableTranslateImages.length +
    changeableNDImages.length +
    changeableFooterImages.length;
  let imagesLoaded = 0;

  // Update Footer Images
  changeableFooterImages.forEach((image, index) => {
    image.src = currentFooterImages[index];
    image.onload = () => imagesLoaded++;
    image.onerror = () => {
      imagesLoaded++;
      console.log('Error loading image: ', image.src);
    };
  });

  // Update ND Images
  changeableNDImages.forEach((image, index) => {
    image.src = currentDesignImages[index];
    image.onload = () => imagesLoaded++;
    image.onerror = () => {
      imagesLoaded++;
      console.log('Error loading image: ', image.src);
    };
  });

  // Update Language Image
  changeableTranslateImages.forEach((image, index) => {
    image.src = currentTranslateImages.images[index];
    image.onload = () => imagesLoaded++;
    image.onerror = () => {
      imagesLoaded++;
      console.log('Error loading image: ', image.src);
    };
  });

  return {
    imagesLoaded,
    totalImages,
  };
}

function checkImagesLoaded(callback, loaderElement, delayLoadingPage = false) {
  console.log('Check images loaded');
  const maxLoadingTime = 2500; // 2.5 seconds
  const checkInterval = 100; // Interval time in ms
  const startTime = Date.now();

  const checkLoadStatus = setInterval(() => {
    console.log('Interval');
    if (callback()) {
      console.log('waht');
      const elapsedTime = Date.now() - startTime;
      console.log({ elapsedTime });
      const timeRemaining = maxLoadingTime - elapsedTime;
      console.log({ timeRemaining });

      if (delayLoadingPage && elapsedTime < maxLoadingTime) {
        setTimeout(() => {
          loaderElement.style.display = 'none';
        }, timeRemaining);
      } else {
        loaderElement.style.display = 'none';
      }

      clearInterval(checkLoadStatus);
    }
  }, checkInterval);
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

function resetAnimation(elements) {
  if (elements.length === 0) return;

  elements.forEach(({ selector, animationClass }) => {
    const element = document.querySelector(selector);
    if (element.classList.contains(animationClass)) {
      element.classList.remove(animationClass);
    }
  });
}

/* New Design  */

function changeDesign() {
  const hasNewDesign = getRandomBoolean();
  const elementNDClasses = new Map();

  initialize(multipleClasses, uniqueClasses, elementNDClasses);

  elementNDClasses.forEach((data, element) => {
    const { ndClasses } = data;

    if (hasNewDesign) {
      // Add all nd classes for this element
      html.setAttribute('data-design', 'new-design');
      ndClasses.forEach((className) => element.classList.add(className));
    } else {
      // Remove all nd classes for this element
      html.setAttribute('data-design', 'original-design');
      ndClasses.forEach((className) => element.classList.remove(className));
    }
  });
}

function initialize(multipleClasses, uniqueClasses, elementNDClasses) {
  // Clear any existing mappings
  elementNDClasses.clear();

  Object.entries(uniqueClasses).forEach(([baseSelector, ndClasses]) => {
    const element = document.querySelector(baseSelector);

    if (element) {
      elementNDClasses.set(element, {
        ndClasses: ndClasses,
        baseSelector: baseSelector,
      });
    }
  });

  Object.entries(multipleClasses).forEach(([baseSelector, ndClasses]) => {
    const elements = document.querySelectorAll(baseSelector);

    elements.forEach((element) => {
      elementNDClasses.set(element, {
        ndClasses: ndClasses,
        baseSelector: baseSelector,
      });
    });
  });
}

function getRandomBoolean() {
  /*   return Math.random() < 0.5; */
  return Math.random() < 0.2;
}
