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
import {getComments, getMostCommentedMovies, getTopRatedMovies, sortByDate, sortByRating} from '../utils/films.js';
import {updateItem} from '../utils/common.js';
import {FilmCardCall, SortType} from '../const.js';

const SHOW_MOVIES_COUNT = 5;
const EXTRA_MOVIES_COUNT = 2;
const HIDE_OVERFLOW_CLASS = 'hide-overflow';

export default class Content {
  constructor(contentParent) {
    this._contentParent = contentParent;
    this._shownMoviesCount = SHOW_MOVIES_COUNT;
    this._currentSortType = SortType.DEFAULT;

    this._contentComponent = new ContentView();
    this._sortComponent = new SortView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._allMoviesSectionComponent = new AllMoviesSectionView();
    this._topRatedSectionComponent = new TopRatedSectionView();
    this._mostCommentedSectionComponent = new MostCommentedSectionView();
    this._noFilmsComponent = new NoFilmsView();

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onFilmChange = this._onFilmChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
  }

  init(movies, comments) {
    this._movies = movies.slice();
    this._comments = comments.slice();
    this._topRatedMovies = getTopRatedMovies(this._movies);
    this._mostCommentedMovies = getMostCommentedMovies(this._movies);
    this._sourcedMovies = movies.slice();
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
    this._renderSort();
    render(this._contentParent, this._contentComponent);
    render(this._contentComponent, this._allMoviesSectionComponent);
    this._renderAllFilms();

    if (this._topRatedMovies.length) {
      this._renderTopRatedFilms();
    }

    if (this._mostCommentedMovies.length) {
      this._renderMostCommentedFilms();
    }
  }

  _renderSort() {
    render(this._contentParent,  this._sortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  _renderShowMoreButton() {
    render(this._allMoviesSectionComponent, this._showMoreButtonComponent, 'after-element');

    this._showMoreButtonComponent.setButtonClickHandler((evt) => {
      this._showMoreMovies(evt);
    });
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._movies.sort(sortByDate);
        break;
      case SortType.RATING:
        this._movies.sort(sortByRating);
        break;
      default:
        this._movies = this._sourcedMovies.slice();
    }

    this._currentSortType = sortType;
  }

  _clearFilms() {
    Object.values(this._movieComponents).forEach((value) => {
      if (value instanceof FilmView) {
        value.getElement().remove();
        value.removeElement();
      }
    });

    this._showMoreButtonComponent.getElement().remove();
  }

  _onSortTypeChange(sortType) {
    if (this._currentSortType !== sortType) {
      this._sortFilms(sortType);
      this._clearFilms();

      this._shownMoviesCount = SHOW_MOVIES_COUNT;

      this._renderAllFilms();
    }
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

  _createMovieComponent(movie) {
    const filmComponent = new FilmView(movie);

    filmComponent.setCardClickHandler((call) => {
      if (call === FilmCardCall.POPUP) {
        this._showPopup(movie);
      } else {
        this._onButtonsClick(movie, call);
      }
    });

    return filmComponent;
  }

  _renderFilm(container, movie, options = {isTopRated: false, isMostCommented: false}) {
    const filmComponent = this._createMovieComponent(movie);

    render(container, filmComponent);

    if (options.isTopRated) {
      this._movieComponents.topRated[movie.id] = filmComponent;
    } else if (options.isMostCommented) {
      this._movieComponents.mostCommented[movie.id] = filmComponent;
    } else {
      this._movieComponents[movie.id] = filmComponent;
    }
  }

  _replaceFilm(movie) {
    if (this._movieComponents[movie.id]) {
      const filmComponent = this._createMovieComponent(movie);

      replace(filmComponent, this._movieComponents[movie.id]);
      this._movieComponents[movie.id] = filmComponent;
    }

    if (this._movieComponents.topRated[movie.id]) {
      const filmComponent = this._createMovieComponent(movie);

      replace(filmComponent, this._movieComponents.topRated[movie.id]);
      this._movieComponents.topRated[movie.id] = filmComponent;
    }

    if (this._movieComponents.mostCommented[movie.id]) {
      const filmComponent = this._createMovieComponent(movie);

      replace(filmComponent, this._movieComponents.mostCommented[movie.id]);
      this._movieComponents.mostCommented[movie.id] = filmComponent;
    }
  }

  _renderAllFilms() {
    for (let i = 0; i < Math.min(this._movies.length, SHOW_MOVIES_COUNT); i++) {
      this._renderFilm(this._allMoviesSectionComponent.getContainer(), this._movies[i]);
    }

    if (this._movies.length > SHOW_MOVIES_COUNT) {
      this._renderShowMoreButton();
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
