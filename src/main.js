import ProfileView from './view/profile.js';
import MenuView from './view/menu.js';
import FilterView from './view/filter.js';
import SortView from './view/sort.js';
import ContentView from './view/content.js';
import NoFilmsView from './view/no-films.js';
import AllMoviesSectionView from './view/all-movies-section.js';
import TopRatedSectionView from './view/top-rated-section.js';
import MostCommentedSectionView from './view/most-commented-section.js';
import FilmView from './view/film.js';
import ShowMoreButtonView from './view/show-more-button.js';
import StatisticsView from './view/statistics.js';
import PopupView from './view/popup.js';
import {generateFilm} from './mock/film.js';
import {generateComment} from './mock/comment.js';
import {generateFilter} from './mock/filter';
import {generateProfileRating} from './mock/profile-rating';
import {getComments, render, getMostCommentedMovies, getTopRatedMovies} from './utils.js';

const ALL_MOVIES_COUNT = 20;
const SHOW_MOVIES_COUNT = 5;
const EXTRA_MOVIES_COUNT = 2;
const MAX_COMMENTS_COUNT = 5;
const HIDE_OVERFLOW_CLASS = 'hide-overflow';

const movies = new Array(ALL_MOVIES_COUNT).fill().map(generateFilm);
const comments = new Array(MAX_COMMENTS_COUNT).fill().map((value, index) => generateComment(index));
const filters = generateFilter(movies);
const profileRating = generateProfileRating(movies);
const topRatedMovies = getTopRatedMovies(movies);
const mostCommentedMovies = getMostCommentedMovies(movies);
const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const statisticsContainer = document.querySelector('.footer__statistics');
const profileComponent = new ProfileView(profileRating);
const menuComponent = new MenuView();
const contentComponent = new ContentView();
const allMoviesComponent = new AllMoviesSectionView();
const topRatedComponent = new TopRatedSectionView();
const mostCommentedComponent = new MostCommentedSectionView();
const noFilmsComponent = new NoFilmsView();
const statisticsComponent = new StatisticsView(movies.length);

let shownMoviesCount = SHOW_MOVIES_COUNT;

const renderFilm = (container, movie) => {
  const movieComponent = new FilmView(movie);
  const movieElement = movieComponent.getElement();
  const popupComments = getComments(movie.comments, comments);
  const popupComponent = new PopupView(movie, popupComments);

  const showPopup = () => {
    popupComponent.getCloseButton().addEventListener('click', () => {
      closePopup();
    });

    render(document.body, popupComponent.getElement());
    document.body.classList.add(HIDE_OVERFLOW_CLASS);
    document.addEventListener('keydown', onEscKeyDown);
  };

  const closePopup = () => {
    popupComponent.getElement().remove();
    popupComponent.removeElement();
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
    .forEach((movie) => renderFilm(allMoviesComponent.getContainer(), movie));

  shownMoviesCount += SHOW_MOVIES_COUNT;

  if (shownMoviesCount >= movies.length) {
    showMoreButton.remove();
  }
};

const renderContainers = () => {
  render(headerElement, profileComponent.getElement());
  render(mainElement,  new SortView().getElement());
  render(mainElement, contentComponent.getElement());
  render(contentComponent.getElement(), allMoviesComponent.getElement());

  for (let i = 0; i < Math.min(movies.length, SHOW_MOVIES_COUNT); i++) {
    renderFilm(allMoviesComponent.getContainer(), movies[i]);
  }

  if (movies.length > SHOW_MOVIES_COUNT) {
    const showMoreButton = new ShowMoreButtonView().getElement();

    render(contentComponent.getElement(), showMoreButton);

    showMoreButton.addEventListener('click', (evt) => {
      showMoreMovies(evt);
    });
  }

  if (topRatedMovies.length) {
    render(contentComponent.getElement(), topRatedComponent.getElement());

    for (let i = 0; i < Math.min(topRatedMovies.length, EXTRA_MOVIES_COUNT); i++) {
      renderFilm(topRatedComponent.getContainer(), topRatedMovies[i]);
    }
  }

  if (mostCommentedMovies.length) {
    render(contentComponent.getElement(), mostCommentedComponent.getElement());

    for (let i = 0; i < Math.min(mostCommentedMovies.length, EXTRA_MOVIES_COUNT); i++) {
      renderFilm(mostCommentedComponent.getContainer(), mostCommentedMovies[i]);
    }
  }
};

render(mainElement, menuComponent.getElement());

filters.forEach((filter) => {
  const filterComponent = new FilterView(filter);

  render(menuComponent.getNavigationContainer(), filterComponent.getElement());
});

if (movies.length) {
  renderContainers();
} else {
  render(mainElement, contentComponent.getElement());
  render(contentComponent.getElement(), noFilmsComponent.getElement());
}

render(statisticsContainer, statisticsComponent.getElement());
