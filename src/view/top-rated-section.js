import AbstractView from './abstract.js';

const createTopRatedSectionTemplate = () => {
  return `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Top rated</h2>

    <div class="films-list__container"></div>
  </section>`;
};

export default class TopRatedSection extends AbstractView {
  constructor() {
    super();

    this._container = null;
  }

  getTemplate() {
    return createTopRatedSectionTemplate();
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
