import {createProfileTemplate} from './view/profile.js';
import {createMenuTemplate} from './view/menu.js';
import {createContentTemplate} from './view/content.js';
import {createFilmTemplate} from './view/film.js';
import {createShowMoreButtonTemplate} from './view/show-more-button.js';
import {createStatisticsTemplate} from './view/statistics.js';
import {generateFilm} from './mock/film.js';
import {generateComment} from './mock/comment.js';
import {createPopupTemplate} from './view/popup.js';
import {getComments} from './utils.js';
import {generateFilter} from './mock/filter';
import {generateProfileRating} from './mock/profile-rating';

const ALL_MOVIES_COUNT = 20;
const SHOW_MOVIES_COUNT = 5;
const EXTRA_MOVIES_COUNT = 2;
const MAX_COMMENTS_COUNT = 5;

const movies = new Array(ALL_MOVIES_COUNT).fill().map(generateFilm);
const comments = new Array(MAX_COMMENTS_COUNT).fill().map((value, index) => generateComment(index));
const popupMovie = movies[0];
const popupComments = getComments(popupMovie.comments, comments);
const filters = generateFilter(movies);
const profileRating = generateProfileRating(movies);
const topRatedMovies = [...movies].sort((a, b) => {
  return Number(b.info.rating) - Number(a.info.rating);
});
const mostCommentedMovies = [...movies].sort((a, b) => {
  return b.comments.length - a.comments.length;
});

let shownMoviesCount = SHOW_MOVIES_COUNT;

const render = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

const showMoreMovies = (evt, showMoreButton) => {
  evt.preventDefault();

  movies
    .slice(shownMoviesCount, shownMoviesCount + SHOW_MOVIES_COUNT)
    .forEach((movie) => render(allMoviesContainer, createFilmTemplate(movie)));

  shownMoviesCount += SHOW_MOVIES_COUNT;

  if (shownMoviesCount >= movies.length) {
    showMoreButton.remove();
  }
};

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const statisticsContainer = document.querySelector('.footer__statistics');

render(headerElement, createProfileTemplate(profileRating));
render(mainElement, createMenuTemplate(filters));
render(mainElement, createContentTemplate());

const filmsListElement = mainElement.querySelector('.films-list:not(.films-list--extra)');
const [allMoviesContainer, topRatedContainer, mostCommentedContainer] =
  mainElement.querySelectorAll('.films-list__container');

for (let i = 0; i < Math.min(movies.length, SHOW_MOVIES_COUNT); i++) {
  render(allMoviesContainer, createFilmTemplate(movies[i]));
}

if (movies.length > SHOW_MOVIES_COUNT) {
  render(filmsListElement, createShowMoreButtonTemplate());

  const showMoreButton = filmsListElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    showMoreMovies(evt, showMoreButton);
  });
}

render(document.body, createPopupTemplate(popupMovie, popupComments));

for (let i = 0; i < Math.min(movies.length, EXTRA_MOVIES_COUNT); i++) {
  render(topRatedContainer, createFilmTemplate(topRatedMovies[i]));
}

for (let i = 0; i < Math.min(movies.length, EXTRA_MOVIES_COUNT); i++) {
  render(mostCommentedContainer, createFilmTemplate(mostCommentedMovies[i]));
}

render(statisticsContainer, createStatisticsTemplate(movies.length));
