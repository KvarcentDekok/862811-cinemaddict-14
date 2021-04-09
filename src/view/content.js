import {createElement} from '../utils.js';

const createContentTemplate = () => {
  return `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container"></div>
    </section>
    
    <section class="films-list films-list--extra">
    <h2 class="films-list__title">Top rated</h2>

    <div class="films-list__container"></div>
  </section>

  <section class="films-list films-list--extra">
    <h2 class="films-list__title">Most commented</h2>

    <div class="films-list__container"></div>
  </section>
  </section>`;
};

export default class Content {
  constructor() {
    this._element = null;
    this._containers = null;
  }

  getTemplate() {
    return createContentTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  getContainers() {
    if (!this._containers) {
      this._containers =  this._element.querySelectorAll('.films-list__container');
    }

    return this._containers;
  }

  removeElement() {
    this._element = null;
  }
}
