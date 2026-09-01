(function () {
  const venueMapQuery = 'Ресторан Аяна, 4J3H+7HJ, Кулунду';
  const venueMapGoogle = 'https://www.google.com/maps/place/Ресторан+аяна/@40.1032182,69.6288901,17z/data=!3m1!4b1!4m6!3m5!1s0x38b1ab00408f16e5:0x70d79238553448fb!8m2!3d40.1032182!4d69.6288901!16s%2Fg%2F11zkg1k3qg?entry=ttu';
  const venueMap2GIS = 'https://2gis.kg/bishkek/firm/70000001105797122';

  const mapChoiceModal = document.getElementById('map-choice-modal');
  const mapOpenButton = document.getElementById('open-venue-map-btn');

  function closeMapChoice() {
    if (mapChoiceModal) {
      mapChoiceModal.classList.add('hidden');
      mapChoiceModal.classList.remove('flex');
    }
  }

  function openVenueMap(provider) {
    const url = provider === 'google' ? venueMapGoogle : venueMap2GIS;
    window.open(url, '_blank', 'noopener,noreferrer');
    closeMapChoice();
  }

  if (mapOpenButton) {
    mapOpenButton.addEventListener('click', () => {
      if (mapChoiceModal) {
        mapChoiceModal.classList.remove('hidden');
        mapChoiceModal.classList.add('flex');
      }
    });
  }

  document.querySelectorAll('[data-map-choice]').forEach((button) => {
    button.addEventListener('click', () => openVenueMap(button.dataset.mapChoice));
  });

  if (mapChoiceModal) {
    mapChoiceModal.addEventListener('click', (event) => {
      if (event.target === mapChoiceModal) closeMapChoice();
    });
  }
})();
