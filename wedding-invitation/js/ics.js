(function () {
  const btn = document.getElementById('btn-calendar');
  if (!btn) return;

  btn.addEventListener('click', function () {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:20260919T113000Z
DTEND:20260919T180000Z
SUMMARY:Эрланбек & Карлыгач Wedding
LOCATION:Ресторан Аяна, Кулунду, Бишкек
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding.ics';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  });
})();
