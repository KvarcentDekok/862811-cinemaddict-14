import BaseView from './base.js';

const createMostCommentedSectionTemplate = () => {
  return `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Most commented</h2>

    <div class="films-list__container"></div>
  </section>`;
};

export default class MostCommentedSection extends BaseView {
  constructor() {
    super();

    this._container = null;
  }

  getTemplate() {
    return createMostCommentedSectionTemplate();
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
