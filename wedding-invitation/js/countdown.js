(function () {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  if (!daysEl || !hoursEl || !minsEl) return;

  const countDownDate = new Date('2026-09-19T17:30:00+06:00').getTime();

  const updateCountdown = setInterval(function () {
    const now = new Date().getTime();
    const distance = countDownDate - now;

    if (distance < 0) {
      clearInterval(updateCountdown);
      daysEl.innerText = '00';
      hoursEl.innerText = '00';
      minsEl.innerText = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    daysEl.innerText = days.toString().padStart(2, '0');
    hoursEl.innerText = hours.toString().padStart(2, '0');
    minsEl.innerText = minutes.toString().padStart(2, '0');
  }, 1000);
})();