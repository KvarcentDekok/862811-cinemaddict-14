import {getComponentFromDate, humanizeDuration, limitText} from '../utils/films.js';
import AbstractView from './abstract.js';

const ACTIVE_CONTROL_CLASS = 'film-card__controls-item--active';

const createFilmTemplate = (film) => {
  const {title, rating, releaseDate, runtime, genres, poster, description} = film.info;
  const {comments} = film;
  const {watchlist, watched, favorite} = film.user;

  return `<article class="film-card">
          <h3 class="film-card__title">${title}</h3>
          <p class="film-card__rating">${rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${getComponentFromDate(releaseDate, 'year')}</span>
            <span class="film-card__duration">${humanizeDuration(runtime)}</span>
            <span class="film-card__genre">${genres[0]}</span>
          </p>
          <img src="./images/posters/${poster}" alt="${title}" class="film-card__poster">
          <p class="film-card__description">${limitText(description)}</p>
          <a class="film-card__comments">${comments.length} comments</a>
          <div class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlist ? ACTIVE_CONTROL_CLASS : ''}" 
            type="button">
            Add to watchlist
            </button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watched ? ACTIVE_CONTROL_CLASS : ''}" 
            type="button">
            Mark as watched
            </button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${favorite ? ACTIVE_CONTROL_CLASS : ''}" 
            type="button">
            Mark as favorite
            </button>
          </div>
        </article>`;
};

export default class Film extends AbstractView {
  constructor(film) {
    super();

    this._film = film;
    this._posterElement = null;
    this._titleElement = null;
    this._commentsElement = null;
    this._posterClickHandler = this._posterClickHandler.bind(this);
    this._titleClickHandler = this._titleClickHandler.bind(this);
    this._commentsClickHandler = this._commentsClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmTemplate(this._film);
  }

  _getPosterElement() {
    if (!this._posterElement) {
      this._posterElement = this.getElement().querySelector('.film-card__poster');
    }

    return this._posterElement;
  }

  _getTitleElement() {
    if (!this._titleElement) {
      this._titleElement = this.getElement().querySelector('.film-card__title');
    }

    return this._titleElement;
  }

  _getCommentsElement() {
    if (!this._commentsElement) {
      this._commentsElement = this.getElement().querySelector('.film-card__comments');
    }

    return this._commentsElement;
  }

  _posterClickHandler(evt) {
    evt.preventDefault();
    this._callback.posterClick();
  }

  setPosterClickHandler(callback) {
    this._callback.posterClick = callback;
    this._getPosterElement().addEventListener('click', this._posterClickHandler);
  }

  _titleClickHandler(evt) {
    evt.preventDefault();
    this._callback.titleClick();
  }

  setTitleClickHandler(callback) {
    this._callback.titleClick = callback;
    this._getTitleElement().addEventListener('click', this._titleClickHandler);
  }

  _commentsClickHandler(evt) {
    evt.preventDefault();
    this._callback.commentsClick();
  }

  setCommentsClickHandler(callback) {
    this._callback.commentsClick = callback;
    this._getCommentsElement().addEventListener('click', this._commentsClickHandler);
  }

  removeElement() {
    super.removeElement();

    this._posterElement = null;
    this._titleElement = null;
    this._commentsElement = null;
  }
}
