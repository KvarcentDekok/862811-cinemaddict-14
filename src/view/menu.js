import {createElement} from '../utils.js';

const createMenuTemplate = () => {
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class Menu {
  constructor() {
    this._element = null;
    this._navigationContainer = null;
  }

  getTemplate() {
    return createMenuTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  getNavigationContainer() {
    if (!this._navigationContainer) {
      this._navigationContainer = this._element.querySelector('.main-navigation__items');
    }

    return this._navigationContainer;
  }

  removeElement() {
    this._element = null;
  }
}
