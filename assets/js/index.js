import { storiesEnText, storiesRUText } from './utils.mjs';
console.log({ storiesEnText, storiesRUText });

const switchLanguageButton = document.getElementById('language-selector');
const localizedText = {
  russian: {
    texts: storiesRUText,
  },
  english: {
    texts: storiesEnText,
  },
};

// Set Language
switchLanguageButton.dataset.language = 'russian';

console.time('Loading time');
window.addEventListener('load', () => {
  console.timeEnd('Loading time');
});

window.addEventListener('DOMContentLoaded', () => {
  changeLanguage('russian');
});

switchLanguageButton.addEventListener('click', () => {
  const currentLanguage =
    switchLanguageButton.dataset.language === 'russian' ? 'english' : 'russian';

  changeLanguage(currentLanguage);
  switchLanguageButton.dataset.language = currentLanguage;
});

/* ChangeLanguage */
function changeLanguage(language) {
  const languageElement = document.querySelector('#language-selector');
  const textElements = document.querySelectorAll('.changeable-txt');
  const currentText = localizedText[language];
  // Update Text
  textElements.forEach((text, index) => {
    text.innerHTML = currentText.texts[index];
  });

  // Update Language Image
  languageElement.src =
    language === 'russian'
      ? './assets/klubok_en.png'
      : './assets/klubok_ru.png';
}
