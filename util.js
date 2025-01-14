import {
  INITIAL_LANGUAGE,
  repeatingClasses,
  uniqueClasses,
} from './constant.js';

export function changeDesignElements(elementHTML) {
  const hasNewDesign = getRandomBoolean();
  const elementNDClasses = new Map();

  initialize(repeatingClasses, uniqueClasses, elementNDClasses);

  elementNDClasses.forEach((data, element) => {
    const { ndClasses } = data;

    if (hasNewDesign) {
      // Add all nd classes for this element
      elementHTML.setAttribute('data-design', 'new');
      ndClasses.forEach((className) => element.classList.add(className));
    } else {
      // Remove all nd classes for this element
      elementHTML.setAttribute('data-design', 'original');
      ndClasses.forEach((className) => element.classList.remove(className));
    }
  });
}

function initialize(repeatingClasses, uniqueClasses, elementNDClasses) {
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

  Object.entries(repeatingClasses).forEach(([baseSelector, ndClasses]) => {
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
  return Math.random() < 0.5;
  /* return Math.random() < 0.2; */
}

export function checkLoaded(
  startTime,
  loaderElement,
  delayLoadingPage = false
) {
  const maxLoadingTime = 2500; // 2.5 seconds
  const elapsedTime = Date.now() - startTime;

  const timeRemaining = maxLoadingTime - elapsedTime;

  if (delayLoadingPage && elapsedTime < maxLoadingTime) {
    setTimeout(() => {
      loaderElement.style.display = 'none';
    }, timeRemaining);
  } else {
    loaderElement.style.display = 'none';
  }
}

export function resetAnimation(elements) {
  if (elements.length === 0) return;

  elements.forEach(({ selector, animationClass }) => {
    const element = document.querySelector(selector);
    if (element.classList.contains(animationClass)) {
      element.classList.remove(animationClass);
    }
  });
}

// Image loading utility that returns a promise and handles errors
export const loadImage = (image, src) => {
  return new Promise((resolve) => {
    if (!src) {
      console.warn(`Missing source for image: `, image);
      resolve(false);
      return;
    }

    image.src = src;
    image.onload = () => resolve(true);
    image.onerror = (error) => {
      console.error('Error loading image: ', { src, error });
      resolve(false);
    };
  });
};

export function initLanguage(html) {
  const language = localStorage.getItem('language');

  if (!language) {
    localStorage.setItem('language', INITIAL_LANGUAGE);
    html.lang = INITIAL_LANGUAGE;
    return;
  }

  html.lang = language;
}

export function getLanguage() {
  const language = localStorage.getItem('language');
  return language || INITIAL_LANGUAGE;
}

export function setLanguage(html) {
  const currentLang = html.lang === 'ru' ? 'en' : 'ru';

  localStorage.setItem('language', currentLang);
  html.lang = currentLang;
}
