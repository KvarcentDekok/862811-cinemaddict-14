import ProfileView from './view/profile.js';
import MenuView from './view/menu.js';
import FilterView from './view/filter.js';
import SortView from './view/sort.js';
import ContentView from './view/content.js';
import FilmView from './view/film.js';
import ShowMoreButtonView from './view/show-more-button.js';
import StatisticsView from './view/statistics.js';
import PopupView from './view/popup.js';
import {generateFilm} from './mock/film.js';
import {generateComment} from './mock/comment.js';
import {generateFilter} from './mock/filter';
import {generateProfileRating} from './mock/profile-rating';
import {getComments, render} from './utils.js';

const ALL_MOVIES_COUNT = 20;
const SHOW_MOVIES_COUNT = 5;
const EXTRA_MOVIES_COUNT = 2;
const MAX_COMMENTS_COUNT = 5;
const HIDE_OVERFLOW_CLASS = 'hide-overflow';

const movies = new Array(ALL_MOVIES_COUNT).fill().map(generateFilm);
const comments = new Array(MAX_COMMENTS_COUNT).fill().map((value, index) => generateComment(index));
const filters = generateFilter(movies);
const profileRating = generateProfileRating(movies);
const topRatedMovies = [...movies].sort((a, b) => {
  return Number(b.info.rating) - Number(a.info.rating);
});
const mostCommentedMovies = [...movies].sort((a, b) => {
  return b.comments.length - a.comments.length;
});

let shownMoviesCount = SHOW_MOVIES_COUNT;

const renderFilm = (container, movie) => {
  const movieComponent = new FilmView(movie);
  const movieElement = movieComponent.getElement();
  const popupComments = getComments(movie.comments, comments);
  const popupComponent = new PopupView(movie, popupComments);
  const popupElement = popupComponent.getElement();

  const showPopup = () => {
    popupComponent.getCloseButton().addEventListener('click', () => {
      closePopup();
    });

    render(document.body, popupElement);
    document.body.classList.add(HIDE_OVERFLOW_CLASS);
    document.addEventListener('keydown', onEscKeyDown);
  };

  const closePopup = () => {
    popupComponent.getElement().remove();
    document.body.classList.remove(HIDE_OVERFLOW_CLASS);
    document.removeEventListener('keydown', onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      closePopup();
    }
  };

  movieComponent.getPosterElement().addEventListener('click', () => {
    showPopup();
  });

  movieComponent.getTitleElement().addEventListener('click', () => {
    showPopup();
  });

  movieComponent.getCommentsElement().addEventListener('click', () => {
    showPopup();
  });

  render(container, movieElement);
};

const showMoreMovies = (evt) => {
  const showMoreButton = evt.target;

  evt.preventDefault();

  movies
    .slice(shownMoviesCount, shownMoviesCount + SHOW_MOVIES_COUNT)
    .forEach((movie) => renderFilm(allMoviesContainer, movie));

  shownMoviesCount += SHOW_MOVIES_COUNT;

  if (shownMoviesCount >= movies.length) {
    showMoreButton.remove();
  }
};

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const statisticsContainer = document.querySelector('.footer__statistics');
const profileComponent = new ProfileView(profileRating);
const menuComponent = new MenuView();
const contentComponent = new ContentView();
const statisticsComponent = new StatisticsView(movies.length);

render(headerElement, profileComponent.getElement());
render(mainElement, menuComponent.getElement());

filters.forEach((filter) => {
  const filterComponent = new FilterView(filter);

  render(menuComponent.getNavigationContainer(), filterComponent.getElement());
});

render(mainElement,  new SortView().getElement());
render(mainElement, contentComponent.getElement());

const filmsListElement = mainElement.querySelector('.films-list:not(.films-list--extra)');
const [allMoviesContainer, topRatedContainer, mostCommentedContainer] =
  contentComponent.getContainers();

for (let i = 0; i < Math.min(movies.length, SHOW_MOVIES_COUNT); i++) {
  renderFilm(allMoviesContainer, movies[i]);
}

if (movies.length > SHOW_MOVIES_COUNT) {
  render(filmsListElement, new ShowMoreButtonView().getElement());

  const showMoreButton = filmsListElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    showMoreMovies(evt, showMoreButton);
  });
}

for (let i = 0; i < Math.min(movies.length, EXTRA_MOVIES_COUNT); i++) {
  renderFilm(topRatedContainer, topRatedMovies[i]);
}

for (let i = 0; i < Math.min(movies.length, EXTRA_MOVIES_COUNT); i++) {
  renderFilm(mostCommentedContainer, mostCommentedMovies[i]);
}

render(statisticsContainer, statisticsComponent.getElement());
