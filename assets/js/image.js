import {
  ndEnTranslateImgs,
  ndRuTranslateImgs,
  originalEnTranslateImgs,
  originalRuTranslateImgs,
  footerEnTranslateImgs,
  footerRuTranslateImgs,
  ndImages,
  originalImages,
} from './constant.js';

const LOCALIZEDIMAGES = {
  russian: {
    new: { images: ndRuTranslateImgs },
    original: { images: originalRuTranslateImgs },
  },
  english: {
    new: { images: ndEnTranslateImgs },
    original: { images: originalEnTranslateImgs },
  },
};

// Configuration object for image selectors
const IMAGE_SELECTORS = {
  translate: '.changeable-img',
  design: '.changeable-nd-img',
  footer: '.changeable-footer-img',
};

// Image loading utility that returns a promise and handles errors
const loadImage = (image, src) => {
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

// Image source resolver
const getImageSources = (hasNewDesign, language) => ({
  translate: LOCALIZEDIMAGES[language]?.[hasNewDesign]?.images || [],
  design: hasNewDesign === 'new' ? ndImages : originalImages,
  footer:
    language === 'russian' ? footerRuTranslateImgs : footerEnTranslateImgs,
});

export async function updateImages(hasNewDesign, language) {
  // Input validation
  if (!hasNewDesign || !language) {
    throw new Error('Missing required parameters: hasNewDesign or language');
  }

  // Performance optimization: Get all elements in one pass
  const elements = {};
  const loadingPromises = [];
  let totalImages = 0;
  let imagesLoaded = 0;

  try {
    // Get image sources
    const imageSources = getImageSources(hasNewDesign, language);

    // Collect all elements and prepare loading
    for (const [key, selector] of Object.entries(IMAGE_SELECTORS)) {
      elements[key] = [...document.querySelectorAll(selector)];

      totalImages += elements[key].length;

      // Prepare image loading promises
      elements[key].forEach((image, index) => {
        const src =
          key === 'translate'
            ? imageSources[key]?.[index]
            : imageSources[key]?.[index];

        loadingPromises.push(
          loadImage(image, src).then((success) => {
            if (success) imagesLoaded++;
            return success;
          })
        );
      });
    }

    // Load all images concurrently
    await Promise.allSettled(loadingPromises);

    // Return results
    return {
      imagesLoaded,
      totalImages,
      success: imagesLoaded === totalImages,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error updating images:', error);
    return {
      imagesLoaded,
      totalImages,
      success: false,
      error: error.message,
    };
  }
}
