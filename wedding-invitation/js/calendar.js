(function () {
  const site = window.WeddingSite;

  function renderMiniCalendar() {
    const calendarGrid = document.getElementById('mini-calendar-grid');
    const calendarMonth = document.getElementById('mini-calendar-month');
    if (!calendarGrid || !calendarMonth) return;

    const lang = site.lang || 'kg';
    const monthLabel = lang === 'kg' ? 'Сентябрь 2026' : 'September 2026';
    const weekdays = lang === 'kg'
      ? ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
      : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    const firstDay = new Date(2026, 8, 1).getDay();
    const monthLength = new Date(2026, 9, 0).getDate();
    const offset = (firstDay === 0 ? 6 : firstDay - 1);

    calendarMonth.textContent = monthLabel;

    const dayCells = [
      ...weekdays.map((day) => `<span class="mini-calendar-dow">${day}</span>`),
      ...Array.from({ length: offset }, () => '<span class="mini-calendar-empty"></span>'),
      ...Array.from({ length: monthLength }, (_, index) => {
        const day = index + 1;
        if (day === 19) {
          return `
            <span class="mini-calendar-day heart-day">
                <svg class="heart-shape" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                </svg>
                <span class="heart-day-num">${day}</span>
            </span>
          `;
        }
        return `<span class="mini-calendar-day">${day}</span>`;
      })
    ];

    calendarGrid.innerHTML = dayCells.join('');
  }

  site.renderMiniCalendar = renderMiniCalendar;

  // Первичная отрисовка (независимо от того, какой экран сейчас виден)
  renderMiniCalendar();
})();
