import { EnText, RUText, ENMobileText, RUMobileText } from './utils.mjs';

const switchLanguageButton = document.getElementById('language-selector');
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
const mqlMobile = window.matchMedia('(max-width: 1072px)');
const mqlDefault = window.matchMedia('(min-width: 1073px)');

// Set Language
switchLanguageButton.dataset.language = 'russian';

console.time('Loading time');
window.addEventListener('load', () => {
  console.timeEnd('Loading time');
});

window.addEventListener('DOMContentLoaded', () => {
  changeLanguage('russian', mqlMobile.matches);
});

switchLanguageButton.addEventListener('click', () => {
  const currentLanguage =
    switchLanguageButton.dataset.language === 'russian' ? 'english' : 'russian';

  changeLanguage(currentLanguage, mqlMobile.matches);
  switchLanguageButton.dataset.language = currentLanguage;
});

mqlMobile.addEventListener('change', (event) => {
  if (!event.matches) return;
  changeLanguage(switchLanguageButton.dataset.language, event.matches);
});

mqlDefault.addEventListener('change', (event) => {
  if (!event.matches) return;
  changeLanguage(switchLanguageButton.dataset.language);
});

/* ChangeLanguage */
function changeLanguage(language, isMobile = false) {
  const languageElement = document.querySelector('#language-selector');
  const textElements = document.querySelectorAll('.changeable-txt');
  const deviceType = isMobile ? 'mobile' : 'default';
  const currentText = localizedText[language][deviceType];
  console.log({ deviceType });
  console.log({ currentText });
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
