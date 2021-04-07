import {getComponentFromDate, humanizeDuration, limitText} from '../utils.js';

const ACTIVE_CONTROL_CLASS = 'film-card__controls-item--active';

export const createFilmTemplate = (film) => {
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
