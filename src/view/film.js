import {getComponentFromDate, humanizeDuration, limitText, createElement} from '../utils.js';

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

export default class Film {
  constructor(film) {
    this._element = null;
    this._film = film;
    this._posterElement = null;
    this._titleElement = null;
    this._commentsElement = null;
  }

  getTemplate() {
    return createFilmTemplate(this._film);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  getPosterElement() {
    if (!this._posterElement) {
      this._posterElement = this._element.querySelector('.film-card__poster');
    }

    return this._posterElement;
  }

  getTitleElement() {
    if (!this._titleElement) {
      this._titleElement = this._element.querySelector('.film-card__title');
    }

    return this._titleElement;
  }

  getCommentsElement() {
    if (!this._commentsElement) {
      this._commentsElement = this._element.querySelector('.film-card__comments');
    }

    return this._commentsElement;
  }

  removeElement() {
    this._element = null;
  }
}
