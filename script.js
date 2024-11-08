import {
  EnText,
  RUText,
  ENMobileText,
  RUMobileText,
  enLang,
  ruLang,
} from './index.js';

const switchLanguageButton = document.getElementById('language-selector');
const localizedText = {
  russian: {
    mobile: { texts: RUMobileText, images: ruLang },
    default: { texts: RUText, images: ruLang },
  },
  english: {
    mobile: { texts: ENMobileText, images: enLang },
    default: { texts: EnText, images: enLang },
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
  changeLanguage('russian', mqlMobile.matches);
  booksAnimation();
  console.log('DOMContentLoaded');
});

switchLanguageButton.addEventListener('click', () => {
  console.log('Clicked');
  const currentLanguage =
    switchLanguageButton.dataset.language === 'russian' ? 'english' : 'russian';
  loader.style.display = 'flex';

  const currentAssets = changeLanguage(currentLanguage, mqlMobile.matches);
  switchLanguageButton.dataset.language = currentLanguage;
  booksAnimation();

  checkImagesLoaded(currentAssets.imagesLoaded, loader);
});

mqlMobile.addEventListener('change', (event) => {
  if (!event.matches) return;
  loader.style.display = 'flex';

  console.log('Mobile MQL');
  const currentAssets = changeLanguage(
    switchLanguageButton.dataset.language,
    event.matches
  );

  booksAnimation();
  checkImagesLoaded(currentAssets.imagesLoaded, loader);
});

mqlDefault.addEventListener('change', (event) => {
  if (!event.matches) return;
  loader.style.display = 'flex';

  console.log('Default MQL');
  const currentAssets = changeLanguage(
    switchLanguageButton.dataset.language,
    false
  );

  booksAnimation();
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
      ? './assets/klubok_en.png'
      : './assets/klubok_ru.png';

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
  const maxLoadingTime = 3000; // 3 seconds
  const checkInterval = 100; // Interval time in ms
  const startTime = Date.now();

  console.log('Check images laoded');

  const checkLoadStatus = setInterval(() => {
    if (callback()) {
      const elapsedTime = Date.now() - startTime;
      const timeRemaining = maxLoadingTime - elapsedTime;

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
      threshold: 0,
    }
  );

  booksObserver.observe(footer);
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
