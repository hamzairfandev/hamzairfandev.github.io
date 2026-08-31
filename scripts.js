// Scroll Animations
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach(el => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - 80) {
      el.classList.add('active');
    }
  });

  const skillSection = document.getElementById('skills');
  if (skillSection) {
    const top = skillSection.getBoundingClientRect().top;
    if (top < window.innerHeight - 80) {
      document.querySelectorAll('.progress-bar-fill').forEach(bar => {
        bar.style.width = bar.getAttribute('data-progress');
      });
    }
  }
}


// Run immediately as soon as HTML is parsed, without waiting for images/fonts
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', revealOnScroll);
} else {
  revealOnScroll(); // DOM is already ready
}

window.addEventListener('scroll', revealOnScroll, { passive: true });

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  const sections = document.querySelectorAll('section[id]');

  function setActiveLink(id) {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
    drawerLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  }

  // Scrollspy: highlight nav based on which section is in view
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    {
      // Triggers when section is roughly in the upper-middle of viewport
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0
    }
  );

  sections.forEach(section => observer.observe(section));

  // Handle initial load with a hash in the URL (e.g. yoursite.com/#about)
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash) {
    setActiveLink(initialHash);
  } else if (sections.length) {
    //setActiveLink(sections[0].id); // default to first section (e.g. hero/about) if no hash
  }
});

// Testimonials Slider
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("testimonialTrack");
  const slides = document.querySelectorAll(".testimonial-slide");
  const prevBtn = document.getElementById("prevTestimonial");
  const nextBtn = document.getElementById("nextTestimonial");
  const dotsContainer = document.getElementById("testimonialDots");

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let autoplayInterval;

  // Build Pagination Dots
  slides.forEach((_, idx) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (idx === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(idx));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll("#testimonialDots .dot");

  function updateSlider() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = index;
    updateSlider();
    resetAutoplay();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlider();
  }

  if (nextBtn) nextBtn.addEventListener("click", () => { nextSlide(); resetAutoplay(); });
  if (prevBtn) prevBtn.addEventListener("click", () => { prevSlide(); resetAutoplay(); });

  // Touch Swipe Support for Mobile
  let startX = 0;
  let isDragging = false;

  track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  track.addEventListener("touchend", (e) => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;

    if (diffX > 50) {
      nextSlide();
      resetAutoplay();
    } else if (diffX < -50) {
      prevSlide();
      resetAutoplay();
    }
    isDragging = false;
  }, { passive: true });

  // Autoplay functionality
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  startAutoplay();
});

// Contact Form AJAX Handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const result = document.getElementById('form-result');
    result.innerHTML = "Sending...";
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(contactForm)))
    })
    .then(async (res) => {
        if (res.status === 200) {
          result.style.color = "#38bdf8";
          result.innerHTML = "Message sent successfully!";
          contactForm.reset();
        } else {
          result.style.color = "#ef4444";
          result.innerHTML = "Error sending message.";
        }
    })
    .catch(() => {
        result.style.color = "#ef4444";
        result.innerHTML = "Something went wrong!";
    });
  });
}

const phrases = [
  "Custom WordPress Solutions",
  "Advanced WooCommerce Systems",
  "Scalable API Integrations",
  "High-Performance Web Solutions"
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const targetElement = document.getElementById("typewriterText");

function typeEffect() {
  if (!targetElement) return;

  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  targetElement.textContent = currentPhrase.substring(0, charIndex);

  let speed = isDeleting ? 40 : 80;

  if (!isDeleting && charIndex === currentPhrase.length) {
    speed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    speed = 400;
  }

  setTimeout(typeEffect, speed);
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(typeEffect, 500);
});

//<![CDATA[
document.addEventListener("DOMContentLoaded", () => {
  const statsContainer = document.getElementById("statsGrid");
  const statNumbers = document.querySelectorAll(".stat-number");

  if (!statsContainer || statNumbers.length === 0) return;

  function animateCount(el) {
    const target = parseFloat(el.getAttribute("data-target"));
    const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1800; // Total animation time in milliseconds
    const frameRate = 1000 / 60; // 60 FPS
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      // Easing function for smooth deceleration at the end
      const progress = 1 - Math.pow(1 - frame / totalFrames, 3);
      const currentVal = target * progress;

      if (frame >= totalFrames) {
        el.textContent = target.toFixed(decimals) + suffix;
        clearInterval(counter);
      } else {
        el.textContent = currentVal.toFixed(decimals) + suffix;
      }
    }, frameRate);
  }

  // Trigger counting animation when stats scroll into view
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNumbers.forEach(el => animateCount(el));
        obs.unobserve(entry.target); // Runs animation only once
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsContainer);
});



document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const menuClose = document.getElementById('menuClose');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-btn');

  // Open Drawer Function
  const openMenu = () => {
    mobileDrawer.classList.add('active');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevents background body scrolling
  };

  // Close Drawer Function
  const closeMenu = () => {
    mobileDrawer.classList.remove('active');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Event Listeners
  if (menuToggle) menuToggle.addEventListener('click', openMenu);
  if (menuClose) menuClose.addEventListener('click', closeMenu);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeMenu);

  // Close menu automatically when any item inside the drawer is clicked
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
});