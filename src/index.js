// Your API key: 24139890-5ae6ab4edf9c1c1398f9b1185

import refs from './js/Refs';
import cardMarkup from "./tamplates/cardMarkup.hbs"
import * as basicLightbox from 'basiclightbox';
import './sass/basicLightbox.min.css';

import { info, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';


refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
refs.list.addEventListener('click', onPictureClick);
window.addEventListener('scroll', trackScroll);
refs.goTopBtn.addEventListener('click', backToTop);

let page = 1;

function onFormSubmit(e) {
  e.preventDefault();
   const value = e.currentTarget.elements.query.value;
   if (value === '') {
    return info({
      text: 'Enter the value!',
      delay: 1500,
      closerHover: true,
    });
  }
   if (!value) {
    refs.loadMoreBtn.classList.add('is-hidden');
    return refs.list.innerHTML='';
  }
  const BASE_URL = 'https://pixabay.com/api/';
  const queryParam = new URLSearchParams({
    key: '24139890-5ae6ab4edf9c1c1398f9b1185',
    image_type: 'photo',
    q: refs.form.elements.query.value,
    orientation: 'horizontal',
   page: 1,
    per_page: 12,
  });

   fetch(`${BASE_URL}?${queryParam}&page=${page}`)
      .then(res => res.json())
      .then(data => {
         renderCard(data);
        });
  
  

   function renderCard({ hits }) {
      if (hits.length === 0) {
         refs.loadMoreBtn.classList.add('is-hidden');
         error({
        text: 'No matches found!',
        delay: 1500,
        closerHover: true,
      });
        }
     refs.loadMoreBtn.classList.remove('is-hidden');
    refs.list.innerHTML = cardMarkup(hits);
  }
}

function incrementPage () {
  page += 1;
};

function onLoadMoreBtnClick() {
   incrementPage();

  const BASE_URL = 'https://pixabay.com/api/';
  const queryParam = new URLSearchParams({
    key: '24139890-5ae6ab4edf9c1c1398f9b1185',
    image_type: 'photo',
    q: refs.form.elements.query.value,
    orientation: 'horizontal',
    page: 1,
    per_page: 12,
  });

   fetch(`${BASE_URL}?${queryParam}&page=${page}`)
      .then(res => res.json())
      .then(data => {
         renderCard(data);
         refs.loadMoreBtn.classList.remove('is-hidden');
         handleButtonClick()
      });

  function renderCard({ hits }) {
    const markup = cardMarkup(hits);
    refs.list.insertAdjacentHTML('beforeend', markup);
      
}
}
const hiddenElement = refs.loadMoreBtn;


function handleButtonClick() {
  hiddenElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
}

function onPictureClick(e) {
  if (!e.target.classList.contains('card-img')) {
    return;
  }
  
  const instance = basicLightbox.create(`
    <img src="${e.target.dataset.largeImg}" width="800" height="600">
  `);
  instance.show();
}

function trackScroll() {
  const scrolled = window.pageYOffset;
  const coords = document.documentElement.clientHeight;

  if (scrolled > coords) {
    refs.goTopBtn.classList.add('back_to_top-show');
  }
  if (scrolled < coords) {
    refs.goTopBtn.classList.remove('back_to_top-show');
  }
}

function backToTop() {
  if (window.pageYOffset > 0) {
    window.scrollBy(0, -80);
    setTimeout(backToTop, 30);
  }
}