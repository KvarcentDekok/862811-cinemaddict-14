import {getComponentFromDate, humanizeDuration, limitText} from '../utils/films.js';
import BaseView from './base.js';
import {FilmCardCall} from '../const.js';

const ACTIVE_CONTROL_CLASS = 'film-card__controls-item--active';

const createFilmTemplate = (film) => {
  const {title, rating, releaseDate, runtime, genres, poster, description} = film.info;
  const {comments} = film;
  const {watchlist, watched, favorite} = film.user;

  return `<article class="film-card">
          <h3 class="film-card__title" data-call="${FilmCardCall.POPUP}">${title}</h3>
          <p class="film-card__rating">${rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${getComponentFromDate(releaseDate, 'year')}</span>
            <span class="film-card__duration">${humanizeDuration(runtime)}</span>
            <span class="film-card__genre">${genres[0]}</span>
          </p>
          <img src="./images/posters/${poster}" alt="${title}" class="film-card__poster" data-call="${FilmCardCall.POPUP}">
          <p class="film-card__description">${limitText(description)}</p>
          <a class="film-card__comments" data-call="${FilmCardCall.POPUP}">${comments.length} comments</a>
          <div class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlist ? ACTIVE_CONTROL_CLASS : ''}" 
            type="button" data-call="${FilmCardCall.WATCHLIST}">
            Add to watchlist
            </button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watched ? ACTIVE_CONTROL_CLASS : ''}" 
            type="button" data-call="${FilmCardCall.WATCHED}">
            Mark as watched
            </button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${favorite ? ACTIVE_CONTROL_CLASS : ''}" 
            type="button" data-call="${FilmCardCall.FAVORITE}">
            Mark as favorite
            </button>
          </div>
        </article>`;
};

export default class Film extends BaseView {
  constructor(film) {
    super();

    this._film = film;
    this._cardClickHandler = this._cardClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmTemplate(this._film);
  }

  _cardClickHandler(evt) {
    if (evt.target.dataset.call) {
      evt.preventDefault();
      this._callback.cardClick(evt.target.dataset.call);
    }
  }

  setCardClickHandler(callback) {
    this._callback.cardClick = callback;
    this.getElement().addEventListener('click', this._cardClickHandler);
  }
}
