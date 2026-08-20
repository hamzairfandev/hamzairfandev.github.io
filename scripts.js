// Fixed Mobile Navigation & Scroll Lock Logic
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function closeMenu() {
  navLinks.classList.remove('open');
  navOverlay.classList.remove('active');
  document.body.classList.remove('nav-active');
  menuToggle.innerHTML = '&#9776;';
}

function openMenu() {
  navLinks.classList.add('open');
  navOverlay.classList.add('active');
  document.body.classList.add('nav-active');
  menuToggle.innerHTML = '&#10005;';
}

if (menuToggle && navLinks && navOverlay) {
  menuToggle.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navOverlay.addEventListener('click', closeMenu);

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

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

// Testimonials Slider
//<![CDATA[
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
//]]>

//<![CDATA[
  // Dynamic Load More
  let startIndex = 8;
  const loadMoreBtn = document.getElementById('loadMoreBtn');

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function() {
      loadMoreBtn.innerText = 'Loading...';
      fetch(`/feeds/posts/default?alt=json&start-index=${startIndex}&max-results=6`)
        .then(res => res.json())
        .then(data => {
          const entries = data.feed.entry;
          if (!entries || entries.length === 0) {
            loadMoreBtn.innerText = 'No More Projects';
            loadMoreBtn.disabled = true;
            return;
          }

          const blogPostsContainer = document.getElementById('Blog1') || document.getElementById('portfolioGrid');
          entries.forEach(entry => {
            let title = entry.title.$t;
            let url = entry.link.find(l => l.rel === 'alternate').href;

            // 1. First, attempt to extract the full original image URL from the post content HTML
            let thumb = '';
            if (entry.content && entry.content.$t) {
              const contentHtml = entry.content.$t;
              const imgMatch = contentHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
              if (imgMatch && imgMatch[1]) {
                thumb = imgMatch[1];
              }
            }

            // 2. Fallback to media$thumbnail with high-resolution parameters if no <img> tag in content
            if (!thumb && entry.media$thumbnail) {
              thumb = entry.media$thumbnail.url
                .replace(/\/s72-c\//, '/s1600/')
                .replace(/\/w\d+-h\d+(-c)?\//, '/w800-h500-c/');
            }

            // 3. Final fallback placeholder
            if (!thumb) {
              thumb = 'https://via.placeholder.com/600x400/f1f5f9/94a3b8?text=Project';
            }

            const card = document.createElement('article');
            card.className = 'portfolio-card';
            card.innerHTML = `
              <img class='portfolio-thumbnail' src='${thumb}' alt='${title}'/>
              <div class='portfolio-content'>
                <div class='portfolio-info'>
                  <h3 class='portfolio-title'><a href='${url}'>${title}</a></h3>
                  <div class='portfolio-snippet'>Web Design, App Design</div>
                </div>
                <a aria-label='View Project' class='circle-arrow-btn' href='${url}'>
                  <svg class="icon-small" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5,17.59L15.59,7H9V5H19V15H17V8.41L6.41,19L5,17.59Z"></path>
                  </svg>
                </a>
              </div>
            `;
            blogPostsContainer.appendChild(card);
          });
          startIndex += entries.length;
          loadMoreBtn.innerText = 'Load More Projects';
        })
        .catch(() => {
          loadMoreBtn.innerText = 'No More Projects';
          loadMoreBtn.disabled = true;
        });
    });
  }
//]]>

// Sidebar Feed
const sidebarContainer = document.getElementById('sidebarProjects');
if (sidebarContainer) {
  fetch('/feeds/posts/default?alt=json&max-results=5')
    .then(res => res.json())
    .then(data => {
      const entries = data.feed.entry;
      sidebarContainer.innerHTML = '';
      if (entries) {
        entries.forEach(entry => {
          let title = entry.title.$t;
          let url = entry.link.find(l => l.rel === 'alternate').href;
          let thumb = entry.media$thumbnail ? entry.media$thumbnail.url : 'https://via.placeholder.com/150/151d30/94a3b8';

          const item = document.createElement('a');
          item.className = 'sidebar-item';
          item.href = url;
          item.innerHTML = `
            <img alt='${title}' class='sidebar-thumb' src='${thumb}'/>
            <div class='sidebar-item-title'>${title}</div>
          `;
          sidebarContainer.appendChild(item);
        });
      }
    });
}

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