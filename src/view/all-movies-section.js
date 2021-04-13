import AbstractView from './abstract.js';

const createAllMoviesSectionTemplate = () => {
  return `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container"></div>
    </section>`;
};

export default class AllMoviesSection extends AbstractView {
  constructor() {
    super();

    this._container = null;
  }

  getTemplate() {
    return createAllMoviesSectionTemplate();
  }

  getContainer() {
    if (!this._container) {
      this._container =  this.getElement().querySelector('.films-list__container');
    }

    return this._container;
  }

  removeElement() {
    super.removeElement();

    this._container = null;
  }
}
