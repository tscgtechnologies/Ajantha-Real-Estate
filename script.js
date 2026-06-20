/**
 * Ajantha Real Estate - script.js
 * Premium, high-performance Vanilla JS script handling layout animations,
 * responsiveness, scroll observers, and mouse-controlled 3D parallax effects.
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. MOBILE DRAWER NAVIGATION MENU
  // ==========================================
  const menuToggle = document.getElementById('menu-toggle');
  const drawerClose = document.getElementById('drawer-close');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('mobile-drawer-overlay');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  const openDrawer = () => {
    mobileDrawer.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop background scrolling
  };

  const closeDrawer = () => {
    mobileDrawer.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = ''; // Resume background scrolling
  };

  if (menuToggle) menuToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  // Close drawer on link clicks
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });


  // ==========================================
  // 2. NAVBAR STICKY EFFECT ON SCROLL
  // ==========================================
  const navbar = document.getElementById('navbar');
  
  const handleNavbarScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll(); // Trigger once on page load


  // ==========================================
  // 3. BACK TO TOP BUTTON
  // ==========================================
  const backToTopBtn = document.getElementById('back-to-top');

  const handleBackToTopVisibility = () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleBackToTopVisibility);
  handleBackToTopVisibility(); // Trigger once on page load

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  // ==========================================
  // 4. ACTIVE NAV LINK STATE HIGHLIGHT ON SCROLL
  // ==========================================
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightNavLink = () => {
    let scrollPosition = window.scrollY + 120; // Offset for navbar height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNavLink);


  // ==========================================
  // 5. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal-fade, .reveal-slide-left, .reveal-slide-right, .timeline-step');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          // Once animated, stop observing this element
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null, // Viewport
      threshold: 0.1, // Trigger when 10% visible
      rootMargin: '0px 0px -40px 0px' // Adjust bottom margin for natural entry
    });

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(element => {
      element.classList.add('reveal-active');
    });
  }


  // ==========================================
  // 6. MOUSE PARALLAX ANTI-GRAVITY FLOATING EFFECTS
  // ==========================================
  const heroSection = document.getElementById('home');
  const parallaxItems = document.querySelectorAll('.parallax-item');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let targetMouseX = 0;
  let targetMouseY = 0;
  let currentMouseX = 0;
  let currentMouseY = 0;
  
  // Checking if device is mobile or has motion reduction preferences
  const isMobileDevice = () => window.innerWidth <= 768;

  const updateParallax = () => {
    // Skip animation loop if on mobile or users prefer reduced motion
    if (isMobileDevice() || prefersReducedMotion.matches) {
      return;
    }

    // Smooth easing/damping calculation (lerp)
    currentMouseX += (targetMouseX - currentMouseX) * 0.08;
    currentMouseY += (targetMouseY - currentMouseY) * 0.08;

    parallaxItems.forEach(item => {
      const depth = parseFloat(item.getAttribute('data-depth')) || 0.1;
      
      // Calculate translations in 3D using translation metrics
      const translateX = currentMouseX * depth * 35;
      const translateY = currentMouseY * depth * 35;
      
      // Keep float animation from CSS active by using translate3d alongside animation properties
      // Note: We use CSS variables to apply dynamic mouse offsets to keep transitions optimized
      item.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
    });

    requestAnimationFrame(updateParallax);
  };

  if (heroSection && !isMobileDevice() && !prefersReducedMotion.matches) {
    heroSection.addEventListener('mousemove', (e) => {
      // Calculate cursor position coordinates relative to center of screen (-1 to 1)
      const width = window.innerWidth;
      const height = window.innerHeight;
      targetMouseX = (e.clientX - width / 2) / (width / 2);
      targetMouseY = (e.clientY - height / 2) / (height / 2);
    });

    // Start requestAnimationFrame loop
    requestAnimationFrame(updateParallax);
  }
});
