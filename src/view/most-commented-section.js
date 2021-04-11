import {createElement} from '../utils.js';

const createMostCommentedSectionTemplate = () => {
  return `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Most commented</h2>

    <div class="films-list__container"></div>
  </section>`;
};

export default class MostCommentedSection {
  constructor() {
    this._element = null;
    this._container = null;
  }

  getTemplate() {
    return createMostCommentedSectionTemplate();
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
