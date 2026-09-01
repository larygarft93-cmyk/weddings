(function() {
    (function () {
        const audioBtn = document.getElementById('audio-toggle');
        const bgMusic = document.getElementById('bg-music');
        if (!audioBtn || !bgMusic) return;

        const icon = audioBtn.querySelector('span');
        if (!icon) return;

        let isPlaying = false;

        function updateAudioIcon() {
            if (isPlaying) {
                icon.style.fontVariationSettings = "'FILL' 1";
                icon.classList.add('animate-pulse');
                audioBtn.classList.add('text-secondary');
                audioBtn.setAttribute('aria-label', 'Выключить музыку');
            } else {
                icon.style.fontVariationSettings = "'FILL' 0";
                icon.classList.remove('animate-pulse');
                audioBtn.classList.remove('text-secondary');
                audioBtn.setAttribute('aria-label', 'Включить музыку');
            }
        }

        function setPlaybackState(nextState) {
            isPlaying = nextState;
            updateAudioIcon();
        }

        function refreshAudioSource() {
            const currentSrc = '../kyrgyz-wedding/assets/music/wedding-song.mp3?v=' + Date.now();
            if (bgMusic.getAttribute('src') !== currentSrc) {
                bgMusic.src = currentSrc;
            }
            bgMusic.load();
        }

        function playMusic() {
            refreshAudioSource();
            bgMusic.muted = false;
            bgMusic.volume = 0.55;

            const playPromise = bgMusic.play();
            if (playPromise && typeof playPromise.then === 'function') {
                playPromise.then(function () {
                    setPlaybackState(true);
                }).catch(function () {
                    setPlaybackState(false);
                });
                return;
            }

            setPlaybackState(false);
        }

        function pauseMusic() {
            bgMusic.pause();
            setPlaybackState(false);
        }

        function toggleMusic() {
            if (isPlaying) {
                pauseMusic();
                return;
            }

            playMusic();
        }

        bgMusic.volume = 0.55;
        bgMusic.muted = false;
        // Отключаем автоплей — звук запускается только при клике на конверт или вручную
        bgMusic.autoplay = false;
        bgMusic.loop = true;

        bgMusic.addEventListener('play', function () {
            setPlaybackState(true);
        });

        bgMusic.addEventListener('pause', function () {
            setPlaybackState(false);
        });

        bgMusic.addEventListener('ended', function () {
            setPlaybackState(false);
        });

        audioBtn.addEventListener('click', function () {
            toggleMusic();
        });

        window.WeddingAudio = {
            play: playMusic,
            pause: pauseMusic,
            toggle: toggleMusic,
            isPlaying: function () { return isPlaying; }
        };

        updateAudioIcon();
    })();
})();
