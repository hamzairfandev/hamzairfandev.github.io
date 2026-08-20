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