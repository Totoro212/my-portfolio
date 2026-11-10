/**
 * Lightweight, accessible pure vanilla JS Carousel
 * Works in tandem with CSS Scroll Snap (Progressive Enhancement)
 */
(function () {
  'use strict';

  function initCarousel() {
    const track = document.getElementById('projectsTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');

    if (!track || !prevBtn || !nextBtn) {
      return;
    }

    const slides = Array.from(track.querySelectorAll('.carousel__slide'));
    if (!slides.length) return;

    function getSlideWidth() {
      if (slides.length < 2) return track.clientWidth;
      return slides[1].offsetLeft - slides[0].offsetLeft;
    }

    function updateState() {
      const scrollLeft = track.scrollLeft;
      const maxScroll = track.scrollWidth - track.clientWidth;

      // Update button states
      prevBtn.disabled = scrollLeft <= 8;
      nextBtn.disabled = scrollLeft >= maxScroll - 8;
    }

    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -getSlideWidth(), behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: getSlideWidth(), behavior: 'smooth' });
    });

    // Keyboard navigation when track is focused
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        track.scrollBy({ left: getSlideWidth(), behavior: 'smooth' });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        track.scrollBy({ left: -getSlideWidth(), behavior: 'smooth' });
      }
    });

    // Debounced scroll listener
    let ticking = false;
    track.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateState();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Initial state check
    updateState();
    window.addEventListener('resize', updateState, { passive: true });
  }

  function initMockupTabs() {
    const tabs = document.querySelectorAll('.mockup-tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const mockup = tab.closest('.project-card__mockup');
        if (!mockup) return;

        mockup.querySelectorAll('.mockup-tab').forEach((t) => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');

        const img = mockup.querySelector('.mockup-image img');
        const link = mockup.querySelector('a.mockup-image');

        const newSrc = tab.getAttribute('data-src');
        const newAlt = tab.getAttribute('data-alt');

        if (img && newSrc) {
          img.src = newSrc;
          if (newAlt) img.alt = newAlt;
        }
        if (link && newSrc) {
          link.href = newSrc;
        }
      });
    });
  }

  function init() {
    initCarousel();
    initMockupTabs();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

