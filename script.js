import {
  EnText,
  RUText,
  ENMobileText,
  RUMobileText,
  enLang,
  ruLang,
  nd_enLang,
  nd_ruLang,
} from './index.js';

const switchLanguageButton = document.getElementById('language-selector');
const localizedText = {
  russian: {
    mobile: { texts: RUMobileText, images: nd_ruLang },
    default: { texts: RUText, images: nd_ruLang },
  },
  english: {
    mobile: { texts: ENMobileText, images: nd_enLang },
    default: { texts: EnText, images: nd_enLang },
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

  changeLanguage(language, mqlMobile.matches);
  sideElementsAnimation();
  booksAnimation();
});

switchLanguageButton.addEventListener('click', () => {
  const currentLanguage =
    switchLanguageButton.dataset.language === 'russian' ? 'english' : 'russian';
  loader.style.display = 'flex';

  const currentAssets = changeLanguage(currentLanguage, mqlMobile.matches);
  sideElementsAnimation();
  booksAnimation();

  checkImagesLoaded(currentAssets.imagesLoaded, loader, true);
  switchLanguageButton.dataset.language = currentLanguage;
});

mqlMobile.addEventListener('change', (event) => {
  if (!event.matches) return;
  loader.style.display = 'flex';

  sideElementsAnimation();
  booksAnimation();
  const currentAssets = changeLanguage(
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
  const currentAssets = changeLanguage(
    switchLanguageButton.dataset.language,
    false
  );

  checkImagesLoaded(currentAssets.imagesLoaded, loader);
});

/* ChangeLanguage */
function changeLanguage(language, isMobile = false) {
  const languageElement = document.querySelector('#language-selector');
  const imageElements = document.querySelectorAll('.changeable-img');
  const textElements = document.querySelectorAll('.changeable-txt');
  const deviceType = isMobile ? 'mobile' : 'default';
  const currentResource = localizedText[language][deviceType];
  let imagesLoaded = 0;
  const totalImages = imageElements.length;

  // Update Text
  textElements.forEach((text, index) => {
    text.innerHTML = currentResource.texts[index];
  });

  // Update Language Image
  languageElement.src =
    language === 'russian'
      ? './assets/klubok-engs.webp'
      : './assets/klubok-rus.webp';

  // Update Footer Images
  imageElements.forEach((image, index) => {
    image.src = currentResource.images[index];
    image.onload = () => imagesLoaded++;
    image.onerror = () => {
      imagesLoaded++;
      console.log('Error loading image: ', image.src);
    };
  });

  return {
    imagesLoaded: () => imagesLoaded === totalImages,
  };
}

function checkImagesLoaded(callback, loaderElement, delayLoadingPage = false) {
  console.log('Check images loaded');
  const maxLoadingTime = 2500; // 2.5 seconds
  const checkInterval = 100; // Interval time in ms
  const startTime = Date.now();

  const checkLoadStatus = setInterval(() => {
    if (callback()) {
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
/* 
function changeDesign() {
  const newDesign = getRandomBoolean();
  const newTexts = document.querySelectorAll('.changeable-txt');

  if (newDesign) {
    newTexts.forEach((txt) => {
      if (txt.classList.contains('nd-txt')) {
        txt.classList.remove('nd-txt');
      }
    });
  } else {
    newTexts.forEach((txt) => {
      if (!txt.classList.contains('nd-txt')) {
        txt.classList.add('nd-txt');
      }
    });
  }
} */

function getRandomBoolean() {
  /*   return Math.random() < 0.5; */
  return Math.random() < 0.2;
}
