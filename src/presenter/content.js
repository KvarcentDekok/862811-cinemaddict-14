import ContentView from '../view/content.js';
import SortView from '../view/sort.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import FilmView from '../view/film.js';
import AllMoviesSectionView from '../view/all-movies-section.js';
import TopRatedSectionView from '../view/top-rated-section.js';
import MostCommentedSectionView from '../view/most-commented-section.js';
import PopupView from '../view/popup.js';
import NoFilmsView from '../view/no-films.js';
import {render, replace} from '../utils/render.js';
import {getComments, getMostCommentedMovies, getTopRatedMovies} from '../utils/films.js';
import {updateItem} from '../utils/common.js';
import {FilmCardCalls} from '../const.js';

const SHOW_MOVIES_COUNT = 5;
const EXTRA_MOVIES_COUNT = 2;
const HIDE_OVERFLOW_CLASS = 'hide-overflow';

export default class Content {
  constructor(contentParent) {
    this._contentParent = contentParent;
    this._shownMoviesCount = SHOW_MOVIES_COUNT;

    this._contentComponent = new ContentView();
    this._sortComponent = new SortView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._allMoviesSectionComponent = new AllMoviesSectionView();
    this._topRatedSectionComponent = new TopRatedSectionView();
    this._mostCommentedSectionComponent = new MostCommentedSectionView();
    this._noFilmsComponent = new NoFilmsView();

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onFilmChange = this._onFilmChange.bind(this);
  }

  init(movies, comments) {
    this._movies = movies.slice();
    this._comments = comments.slice();
    this._topRatedMovies = getTopRatedMovies(this._movies);
    this._mostCommentedMovies = getMostCommentedMovies(this._movies);
    this._movieComponents = {};
    this._movieComponents.topRated = {};
    this._movieComponents.mostCommented = {};

    this._renderContent();
  }

  _renderContent() {
    if (this._movies.length) {
      this._renderContainers();
    } else {
      render(this._contentParent, this._contentComponent);
      render(this._contentComponent, this._noFilmsComponent);
    }
  }

  _renderContainers() {
    render(this._contentParent,  this._sortComponent);
    render(this._contentParent, this._contentComponent);
    render(this._contentComponent, this._allMoviesSectionComponent);
    this._renderAllFilms();

    if (this._movies.length > SHOW_MOVIES_COUNT) {
      this._renderShowMoreButton();
    }

    if (this._topRatedMovies.length) {
      this._renderTopRatedFilms();
    }

    if (this._mostCommentedMovies.length) {
      this._renderMostCommentedFilms();
    }
  }

  _renderShowMoreButton() {
    render(this._contentComponent, this._showMoreButtonComponent);

    this._showMoreButtonComponent.setButtonClickHandler((evt) => {
      this._showMoreMovies(evt);
    });
  }

  _showMoreMovies(evt) {
    const showMoreButton = evt.target;

    evt.preventDefault();

    this._movies
      .slice(this._shownMoviesCount, this._shownMoviesCount + SHOW_MOVIES_COUNT)
      .forEach((movie) => this._renderFilm(this._allMoviesSectionComponent.getContainer(), movie));

    this._shownMoviesCount += SHOW_MOVIES_COUNT;

    if (this._shownMoviesCount >= this._movies.length) {
      showMoreButton.remove();
    }
  }

  _showPopup(movie) {
    const popupComments = getComments(movie.comments, this._comments);

    if (this._popupComponent) {
      this._closePopup();
    }

    this._popupComponent = new PopupView(movie, popupComments);

    this._popupComponent.setCloseButtonClickHandler(() => {
      this._closePopup();
    });

    this._popupComponent.setControlsChangeHandler((call) => {
      this._onButtonsClick(movie, call);
    });

    render(document.body, this._popupComponent);
    document.body.classList.add(HIDE_OVERFLOW_CLASS);
    document.addEventListener('keydown', this._onEscKeyDown);
  }

  _closePopup() {
    this._popupComponent.getElement().remove();
    this._popupComponent.removeElement();
    document.body.classList.remove(HIDE_OVERFLOW_CLASS);
    document.removeEventListener('keydown', this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closePopup();
    }
  }

  _createMovieComponents(movie) {
    this._movieComponent = new FilmView(movie);
    this._movieComponentTopRated = new FilmView(movie);
    this._movieComponentMostCommented = new FilmView(movie);

    this._movieComponent.setCardClickHandler((call) => {
      if (call === FilmCardCalls.POPUP) {
        this._showPopup(movie);
      } else {
        this._onButtonsClick(movie, call);
      }
    });

    this._movieComponentTopRated.setCardClickHandler((call) => {
      if (call === FilmCardCalls.POPUP) {
        this._showPopup(movie);
      } else {
        this._onButtonsClick(movie, call);
      }
    });

    this._movieComponentMostCommented.setCardClickHandler((call) => {
      if (call === FilmCardCalls.POPUP) {
        this._showPopup(movie);
      } else {
        this._onButtonsClick(movie, call);
      }
    });
  }

  _renderFilm(container, movie, options = {isTopRated: false, isMostCommented: false}) {
    this._createMovieComponents(movie);

    if (options.isTopRated) {
      render(container, this._movieComponentTopRated);
      this._movieComponents.topRated[movie.id] = this._movieComponentTopRated;
    } else if (options.isMostCommented) {
      render(container, this._movieComponentMostCommented);
      this._movieComponents.mostCommented[movie.id] = this._movieComponentMostCommented;
    } else {
      render(container, this._movieComponent);
      this._movieComponents[movie.id] = this._movieComponent;
    }
  }

  _replaceFilm(movie) {
    this._createMovieComponents(movie);

    if (this._movieComponents[movie.id]) {
      replace(this._movieComponent, this._movieComponents[movie.id]);
      this._movieComponents[movie.id] = this._movieComponent;
    }

    if (this._movieComponents.topRated[movie.id]) {
      replace(this._movieComponentTopRated, this._movieComponents.topRated[movie.id]);
      this._movieComponents.topRated[movie.id] = this._movieComponentTopRated;
    }

    if (this._movieComponents.mostCommented[movie.id]) {
      replace(this._movieComponentMostCommented, this._movieComponents.mostCommented[movie.id]);
      this._movieComponents.mostCommented[movie.id] = this._movieComponentMostCommented;
    }
  }

  _renderAllFilms() {
    for (let i = 0; i < Math.min(this._movies.length, SHOW_MOVIES_COUNT); i++) {
      this._renderFilm(this._allMoviesSectionComponent.getContainer(), this._movies[i]);
    }
  }

  _renderTopRatedFilms() {
    render(this._contentComponent, this._topRatedSectionComponent);

    for (let i = 0; i < Math.min(this._topRatedMovies.length, EXTRA_MOVIES_COUNT); i++) {
      this._renderFilm(this._topRatedSectionComponent.getContainer(), this._topRatedMovies[i], {isTopRated: true});
    }
  }

  _renderMostCommentedFilms() {
    render(this._contentComponent, this._mostCommentedSectionComponent);

    for (let i = 0; i < Math.min(this._mostCommentedMovies.length, EXTRA_MOVIES_COUNT); i++) {
      this._renderFilm(this._mostCommentedSectionComponent.getContainer(), this._mostCommentedMovies[i], {isMostCommented: true});
    }
  }

  _onButtonsClick(movie, call) {
    const userSettings = Object.assign(movie.user);

    userSettings[call] = !userSettings[call];

    const updatedMovie = Object.assign({}, movie, {user: userSettings});

    this._onFilmChange(updatedMovie);
  }

  _onFilmChange(updatedFilm) {
    this._movies = updateItem(this._movies, updatedFilm);
    this._replaceFilm(updatedFilm);
  }
}
