import {createElement} from '../utils.js';

const createAllMoviesSectionTemplate = () => {
  return `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container"></div>
    </section>`;
};

export default class AllMoviesSection {
  constructor() {
    this._element = null;
    this._container = null;
  }

  getTemplate() {
    return createAllMoviesSectionTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  getContainer() {
    if (!this._container) {
      if (!this._element) {
        this._container =  this.getElement().querySelector('.films-list__container');
      } else {
        this._container =  this._element.querySelector('.films-list__container');
      }
    }

    return this._container;
  }

  removeElement() {
    this._element = null;
    this._container = null;
  }
}
