import ContentView from '../view/content.js';
import SortView from '../view/sort.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import FilmView from '../view/film.js';
import AllMoviesSectionView from '../view/all-movies-section.js';
import TopRatedSectionView from '../view/top-rated-section.js';
import MostCommentedSectionView from '../view/most-commented-section.js';
import PopupView from '../view/popup.js';
import NoFilmsView from '../view/no-films.js';
import LoadingView from '../view/loading.js';
import {render, replace} from '../utils/render.js';
import {getMostCommentedMovies, getTopRatedMovies, sortByDate, sortByRating} from '../utils/films.js';
import {FilmCardCall, SortType, UpdateType, FilterType} from '../const.js';
import {filter} from '../utils/filter.js';
import {getDateNow} from '../utils/common.js';

const SHOW_MOVIES_COUNT = 5;
const EXTRA_MOVIES_COUNT = 2;
const HIDE_OVERFLOW_CLASS = 'hide-overflow';

export default class Content {
  constructor(contentParent, moviesModel, commentsModel, filterModel, statsComponent, api) {
    this._contentParent = contentParent;
    this._shownMoviesCount = SHOW_MOVIES_COUNT;
    this._currentSortType = SortType.DEFAULT;
    this._api = api;

    this.isShown = true;
    this._isLoading = true;

    this._contentComponent = new ContentView();
    this._sortComponent = new SortView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._allMoviesSectionComponent = new AllMoviesSectionView();
    this._topRatedSectionComponent = new TopRatedSectionView();
    this._mostCommentedSectionComponent = new MostCommentedSectionView();
    this._noFilmsComponent = new NoFilmsView();
    this._statsComponent = statsComponent;
    this._loadingComponent = new LoadingView();

    this._moviesModel = moviesModel;
    this._commentsModel = commentsModel;
    this._filterModel = filterModel;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onFilmChange = this._onFilmChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
  }

  init() {
    this._movieComponents = {};
    this._movieComponents.topRated = {};
    this._movieComponents.mostCommented = {};

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderContent();
  }

  show() {
    this._contentComponent.show();
    this._sortComponent.show();

    this.isShown = true;
  }

  hide() {
    this._contentComponent.hide();
    this._sortComponent.hide();

    this.isShown = false;
  }

  _renderContent() {
    if (this._isLoading) {
      render(this._contentParent, this._contentComponent);
      render(this._contentComponent, this._loadingComponent);
      return;
    }

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

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._replaceFilm(data);
        break;
      case UpdateType.MINOR:
        this._movies = this._moviesModel.getMovies();
        this._clearFilms();
        this._renderAllFilms();
        this._renderTopRatedFilms();
        this._renderMostCommentedFilms();
        break;
      case UpdateType.MAJOR:
        this._movies = this._moviesModel.getMovies();
        this._clearFilms({resetShownMoviesCount: true, resetSortType: true});
        this._renderAllFilms();
        this._renderTopRatedFilms();
        this._renderMostCommentedFilms();
        break;
      case UpdateType.INIT:
        this._movies = this._getMovies();
        this._topRatedMovies = getTopRatedMovies(this._movies);
        this._mostCommentedMovies = getMostCommentedMovies(this._movies);
        this._isLoading = false;
        this._loadingComponent.getElement().remove();
        this._loadingComponent.removeElement();
        this._renderContent();
        break;
    }

    this._statsComponent.updateData({films: this._movies.filter((movie) => movie.user.watched)});
  }

  _clearFilms({resetShownMoviesCount = false, resetSortType = false, onlyAllFilmsBlock = false} = {}) {
    Object.values(this._movieComponents).forEach((value) => {
      if (value instanceof FilmView) {
        value.getElement().remove();
        value.removeElement();
      }
    });

    if (!onlyAllFilmsBlock) {
      Object.values(this._movieComponents.mostCommented).forEach((value) => {
        if (value instanceof FilmView) {
          value.getElement().remove();
          value.removeElement();
        }
      });

      Object.values(this._movieComponents.topRated).forEach((value) => {
        if (value instanceof FilmView) {
          value.getElement().remove();
          value.removeElement();
        }
      });

      this._mostCommentedSectionComponent.getElement().remove();
      this._topRatedSectionComponent.getElement().remove();
    }

    if (resetShownMoviesCount) {
      this._shownMoviesCount = SHOW_MOVIES_COUNT;
    }

    if (resetSortType) {
      const previousSorComponent = this._sortComponent;

      this._sortComponent = new SortView();
      this._currentSortType = SortType.DEFAULT;
      replace(this._sortComponent, previousSorComponent);
      this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
      previousSorComponent.getElement().remove();
      previousSorComponent.removeElement();
    }

    this._showMoreButtonComponent.getElement().remove();
  }

  _onSortTypeChange(sortType) {
    if (this._currentSortType !== sortType) {
      this._currentSortType = sortType;
      this._clearFilms({onlyAllFilmsBlock: true});

      this._shownMoviesCount = SHOW_MOVIES_COUNT;

      this._renderAllFilms();
    }
  }

  _showMoreMovies(evt) {
    const showMoreButton = evt.target;
    const movies = this._getMovies();

    evt.preventDefault();

    movies
      .slice(this._shownMoviesCount, this._shownMoviesCount + SHOW_MOVIES_COUNT)
      .forEach((movie) => this._renderFilm(this._allMoviesSectionComponent.getContainer(), movie));

    this._shownMoviesCount += SHOW_MOVIES_COUNT;

    if (this._shownMoviesCount >= movies.length) {
      showMoreButton.remove();
    }
  }

  _showPopup(movie) {
    if (this._popupComponent) {
      this._closePopup();
    }

    this._popupComponent = new PopupView(movie, this._comments);

    this._popupComponent.setCloseButtonClickHandler(() => {
      this._closePopup();
    });

    this._popupComponent.setControlsChangeHandler((call) => {
      this._onButtonsClick(movie, call);
    });

    this._popupComponent.setDeleteCommentClickHandler((commentId) => {
      this._popupComponent.setState({deletingCommentId: commentId});

      return this._api.deleteComment(commentId)
        .then(() => {
          this._onDeleteCommentClick(movie, commentId);
        });
    });

    this._popupComponent.setAddCommentHandler((comment) => {
      this._popupComponent.setState({isAddingComment: true});

      return this._api.addComment(comment, movie.id)
        .then((comment) => {
          this._onAddComment(movie, comment);
        });
    });

    this._popupComponent.setEmojiChangeHandler();

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
        this._api.getComments(movie.id)
          .then((comments) => {
            this._commentsModel.setComments(comments);
            this._comments = this._commentsModel.getComments().slice();
            this._showPopup(movie);
          })
          .catch(() => {
            this._comments = [];
            this._showPopup(movie);
          });
      } else {
        this._onButtonsClick(movie, call);
      }
    });

    return filmComponent;
  }

  _getMovies() {
    const filterType = this._filterModel.getFilter();
    const movies = this._moviesModel.getMovies().slice();
    const filteredMovies = filter[filterType](movies);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filteredMovies.sort(sortByDate);
      case SortType.RATING:
        return filteredMovies.sort(sortByRating);
    }

    return filteredMovies;
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
    const movies = this._getMovies();

    for (let i = 0; i < Math.min(movies.length, this._shownMoviesCount); i++) {
      this._renderFilm(this._allMoviesSectionComponent.getContainer(), movies[i]);
    }

    if (movies.length > this._shownMoviesCount) {
      this._renderShowMoreButton();
    }
  }

  _renderTopRatedFilms() {
    this._topRatedMovies = getTopRatedMovies(this._movies);

    render(this._contentComponent, this._topRatedSectionComponent);

    for (let i = 0; i < Math.min(this._topRatedMovies.length, EXTRA_MOVIES_COUNT); i++) {
      this._renderFilm(this._topRatedSectionComponent.getContainer(), this._topRatedMovies[i], {isTopRated: true});
    }
  }

  _renderMostCommentedFilms() {
    this._mostCommentedMovies = getMostCommentedMovies(this._movies);

    render(this._contentComponent, this._mostCommentedSectionComponent);

    for (let i = 0; i < Math.min(this._mostCommentedMovies.length, EXTRA_MOVIES_COUNT); i++) {
      this._renderFilm(this._mostCommentedSectionComponent.getContainer(), this._mostCommentedMovies[i], {isMostCommented: true});
    }
  }

  _onButtonsClick(movie, call) {
    const userSettings = Object.assign(movie.user);

    userSettings[call] = !userSettings[call];
    if (call === FilmCardCall.WATCHED) {
      userSettings.watchingDate = userSettings.watched ? getDateNow() : null;
    }

    const updatedMovie = Object.assign({}, movie, {user: userSettings});

    if (this._filterModel.getFilter() === FilterType.ALL) {
      this._onFilmChange(UpdateType.PATCH, updatedMovie);
    } else {
      this._onFilmChange(UpdateType.MINOR, updatedMovie);
    }
  }

  _onFilmChange(updateType, updatedFilm) {
    this._api.updateMovie(updatedFilm)
      .then((updatedFilm) => {
        this._moviesModel.updateMovie(updateType, updatedFilm);
        this._movies = this._moviesModel.getMovies();
        this._replaceFilm(updatedFilm);
      });
  }

  _onDeleteCommentClick(movie, commentId) {
    movie = this._movies.find((movieItem) => movieItem.id === movie.id);

    const comments = movie.comments.filter((existedId) => String(existedId) !== String(commentId));
    const updatedMovie = Object.assign(
      {},
      movie,
      {comments});

    this._moviesModel.updateMovie(UpdateType.MINOR, updatedMovie);
    this._movies = this._moviesModel.getMovies();
    this._popupComponent.updateData({comments});
  }

  _onAddComment(movie, comment) {
    movie = this._movies.find((movieItem) => movieItem.id === movie.id);

    const movieComments = movie.comments;

    movieComments.push(comment.id);

    const updatedMovie = Object.assign(
      {},
      movie,
      {movieComments});

    this._commentsModel.addComment(comment);
    this._moviesModel.updateMovie(UpdateType.MINOR, updatedMovie);
    this._movies = this._moviesModel.getMovies();
    this._comments = this._commentsModel.getComments();
    this._popupComponent.updateComments(this._commentsModel.getComments().slice());
    this._popupComponent.updateData({movieComments});
  }
}
