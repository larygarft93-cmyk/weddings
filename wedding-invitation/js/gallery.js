(function () {
  if (window.__weddingGalleryFallbackInitialized) {
    return;
  }
  window.__weddingGalleryFallbackInitialized = true;

  const galleryImages = [
    'DSC05912 (2).jpg',
    'DSC05923 (2).jpg',
    'DSC05948 (1).jpg',
    'DSC05971 (3).jpg',
    'DSC06073.jpg',
    'DSC06078 (1).jpg',
    'DSC06166.jpg'
  ].map((fileName) => '../kyrgyz-wedding/assets/photos/' + encodeURI(fileName));

  const gallerySection = document.getElementById('gallery-ribbon');
  const galleryTrack = document.getElementById('gallery-track');

  function showLoading() {
    if (!gallerySection) return;
    gallerySection.classList.add('gallery-section-loading');
    let spinner = document.getElementById('gallery-spinner');
    if (!spinner) {
      spinner = document.createElement('div');
      spinner.id = 'gallery-spinner';
      spinner.className = 'loading-spinner';
      gallerySection.appendChild(spinner);
    }
  }

  function hideLoading() {
    if (!gallerySection) return;
    gallerySection.classList.remove('gallery-section-loading');
    const spinner = document.getElementById('gallery-spinner');
    if (spinner) spinner.remove();
  }

  function renderGallery() {
    if (!galleryTrack) return;

    galleryTrack.innerHTML = galleryImages.map((src, index) => `
      <article class="gallery-card reveal-on-scroll" style="animation-delay:${index * 100}ms">
        <img src="${src}" alt="couple photo ${index + 1}" loading="eager" onerror="this.closest('.gallery-card')?.remove()" />
      </article>
    `).join('');

    document.querySelectorAll('.gallery-card img').forEach((img) => {
      img.addEventListener('error', () => {
        img.closest('.gallery-card')?.remove();
      });
    });
  }

  function preloadImages(images, callback) {
    let loaded = 0;
    if (!images.length) {
      callback();
      return;
    }

    images.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        loaded += 1;
        if (loaded === images.length) callback();
      };
      img.onerror = () => {
        loaded += 1;
        if (loaded === images.length) callback();
      };
      img.src = src;
    });
  }

  function setupHorizontalGallery() {
    if (!gallerySection || !galleryTrack || !window.gsap || !window.ScrollTrigger) return;

    const cards = Array.from(galleryTrack.querySelectorAll('.gallery-card'));
    if (!cards.length) return;

    const siteShell = document.getElementById('siteShell');
    const isVisible = !siteShell || !siteShell.classList.contains('hidden') || document.body?.classList.contains('site-ready');
    if (!isVisible) return;

    const viewportWidth = Math.max(gallerySection.clientWidth || galleryTrack.parentElement?.clientWidth || window.innerWidth || 1, 1);
    const trackWidth = galleryTrack.scrollWidth;
    const paddingRight = 24;
    const maxTranslate = Math.max(0, trackWidth - viewportWidth + paddingRight);
    const sectionHeight = window.innerHeight + maxTranslate + 200;

    gallerySection.style.height = `${sectionHeight}px`;
    gallerySection.style.minHeight = '100vh';

    if (galleryTrack._galleryTween) {
      galleryTrack._galleryTween.kill();
    }

    galleryTrack._galleryTween = gsap.to(galleryTrack, {
      x: () => -maxTranslate,
      ease: 'none',
      scrollTrigger: {
        trigger: gallerySection,
        start: 'top top',
        end: () => `+=${Math.max(maxTranslate, 1)}`,
        scrub: 1.2,
        pin: true,
        pinSpacing: false,
        invalidateOnRefresh: true,
        anticipatePin: 0,
        onUpdate: (self) => {
          if (self.progress >= 0.99) {
            gsap.set(galleryTrack, { x: -maxTranslate });
          }
        }
      }
    });

    cards.forEach((card, index) => {
      gsap.fromTo(card, {
        opacity: 0,
        x: 80,
        filter: 'blur(12px)'
      }, {
        opacity: 1,
        x: 0,
        filter: 'blur(0px)',
        duration: 0.8,
        ease: 'power2.out',
        delay: index * 0.08,
        scrollTrigger: {
          trigger: card,
          start: 'left 85%',
          once: true
        }
      });
    });
  }

  function refreshGalleryLayout() {
    if (window.ScrollTrigger) {
      ScrollTrigger.getAll().forEach((trigger) => {
        const t = trigger && trigger.vars && trigger.vars.trigger;
        if (t && t.id === 'gallery-ribbon') {
          trigger.kill();
        }
      });
    }
    if (window.gsap && galleryTrack) {
      gsap.set(galleryTrack, { x: 0, opacity: 1 });
    }
    if (galleryTrack) {
      galleryTrack.style.opacity = '1';
    }
    setupHorizontalGallery();
    if (window.ScrollTrigger) {
      ScrollTrigger.refresh();
    }
  }

  showLoading();
  renderGallery();

  if (gallerySection) {
    gallerySection.classList.add('gallery-section');
  }

  if (galleryTrack) {
    galleryTrack.style.transform = 'translate3d(0, 0, 0)';
    galleryTrack.style.width = 'max-content';
    galleryTrack.style.maxWidth = 'none';
    galleryTrack.style.opacity = '1';
  }

  if (gallerySection) {
    gallerySection.style.minHeight = '100vh';
  }

  const observeVisibility = () => {
    const siteShell = document.getElementById('siteShell');
    const bodyReady = document.body?.classList.contains('site-ready');
    if (!siteShell || !siteShell.classList.contains('hidden') || bodyReady) {
      requestAnimationFrame(() => {
        refreshGalleryLayout();
      });
    }
  };

  if (document.body) {
    const bodyObserver = new MutationObserver(() => {
      observeVisibility();
    });
    bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  const siteShell = document.getElementById('siteShell');
  if (siteShell) {
    const shellObserver = new MutationObserver(() => {
      observeVisibility();
    });
    shellObserver.observe(siteShell, { attributes: true, attributeFilter: ['class'] });
  }

  document.addEventListener('wedding:language-selected', () => {
    requestAnimationFrame(() => {
      refreshGalleryLayout();
    });
  });

  window.addEventListener('load', () => {
    requestAnimationFrame(() => {
      refreshGalleryLayout();
    });
  });

  window.addEventListener('resize', () => {
    refreshGalleryLayout();
  });

  preloadImages(galleryImages, () => {
    hideLoading();
    requestAnimationFrame(() => {
      refreshGalleryLayout();
    });
  });
})();
