(function () {
  const rsvpForm = document.getElementById('rsvp-form');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const guestName = document.getElementById('guestName')?.value.trim() || 'Белгисиз';
      const guestWith = rsvpForm.querySelector('input[name="guestWith"]:checked')?.value;
      const guestWithText = guestWith === 'erlanbek' ? 'Эрланбек' : guestWith === 'karlygach' ? 'Карлыгач' : 'Белгисиз';
      const attendance = rsvpForm.querySelector('input[name="attendance"]:checked')?.value || 'yes';
      const responseText = attendance === 'yes' ? 'Ооба, сөзсүз барам!' : 'Тилекке каршы, бара албайм';

      const text = 'Рахмат!\n\nАты-жөнү: ' + guestName + '\nЖооп: ' + responseText + '\nКимдин коногусу: ' + guestWithText;
      alert(text);
      rsvpForm.reset();
    });
  }

  // Оставлено для обратной совместимости, если где-то используется
  // как быстрая кнопка "да/нет" через Telegram-шэринг.
  window.handleRSVP = function (isComing) {
    const lang = (window.WeddingSite && window.WeddingSite.lang) || 'kg';
    const msg = isComing
      ? (lang === 'kg' ? 'Саламатсызбы! Мен тойго келем.' : 'Здравствуйте! Я приду на свадьбу.')
      : (lang === 'kg' ? 'Саламатсызбы. Тилекке каршы, тойго келе албайм.' : 'Здравствуйте. К сожалению, не смогу прийти.');
    const encodedMsg = encodeURIComponent(msg);
    window.open(`https://t.me/share/url?url=${encodedMsg}`, '_blank');
  };
})();
