document.addEventListener('DOMContentLoaded', function () {
  const videoContainer = document.querySelector('.loader');
  videoContainer.innerHTML = `
      <video loop muted autoplay playsinline>
    <source src="./assets/loader.mp4" type="video/mp4" />
  </video>
    `;
});
