const divs = document.querySelectorAll('.my-div');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentIndex = 0;

// Show the initial div
divs[currentIndex].style.display = 'flex';

prevBtn.addEventListener('click', () => {
  divs[currentIndex].style.display = 'none';
  currentIndex = (currentIndex - 1 + divs.length) % divs.length;
  divs[currentIndex].style.display = 'flex';
});

nextBtn.addEventListener('click', () => {
  divs[currentIndex].style.display = 'none';
  currentIndex = (currentIndex + 1) % divs.length;
  divs[currentIndex].style.display = 'flex';
});

const swiper = new Swiper('.swiper', {
  // Optional parameters
  direction: 'vertical',
  loop: true,

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // And if we need scrollbar
  scrollbar: {
    el: '.swiper-scrollbar',
  },
});