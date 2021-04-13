import AbstractView from './abstract.js';

const createMenuTemplate = () => {
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class Menu extends AbstractView {
  constructor() {
    super();

    this._navigationContainer = null;
  }

  getTemplate() {
    return createMenuTemplate();
  }

  getNavigationContainer() {
    if (!this._navigationContainer) {
      this._navigationContainer = this.getElement().querySelector('.main-navigation__items');
    }

    return this._navigationContainer;
  }

  removeElement() {
    super.removeElement();

    this._navigationContainer = null;
  }
}
