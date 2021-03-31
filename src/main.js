import {createProfileTemplate} from './view/profile.js';
import {createMenuTemplate} from './view/menu.js';
import {createContentTemplate} from './view/content.js';
import {createFilmTemplate} from './view/film.js';
import {createShowMoreButtonTemplate} from './view/show-more-button.js';
import {createStatisticsTemplate} from './view/statistics.js';

const ALL_MOVIES_COUNT = 5;
const EXTRA_MOVIES_COUNT = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const statisticsContainer = document.querySelector('.footer__statistics');

render(headerElement, createProfileTemplate(), 'beforeend');
render(mainElement, createMenuTemplate(), 'beforeend');
render(mainElement, createContentTemplate(), 'beforeend');

const filmsListElement = mainElement.querySelector('.films-list:not(.films-list--extra)');
const allMoviesContainer = filmsListElement.querySelector('#all-movies');
const topRatedContainer = mainElement.querySelector('#top-rated');
const mostCommentedContainer = mainElement.querySelector('#most-commented');

for (let i = 0; i < ALL_MOVIES_COUNT; i++) {
  render(allMoviesContainer, createFilmTemplate(), 'beforeend');
}

render(filmsListElement, createShowMoreButtonTemplate(), 'beforeend');

for (let i = 0; i < EXTRA_MOVIES_COUNT; i++) {
  render(topRatedContainer, createFilmTemplate(), 'beforeend');
}

for (let i = 0; i < EXTRA_MOVIES_COUNT; i++) {
  render(mostCommentedContainer, createFilmTemplate(), 'beforeend');
}

render(statisticsContainer, createStatisticsTemplate(), 'beforeend');
