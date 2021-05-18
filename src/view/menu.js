import BaseView from './base.js';
import {NAVIGATION_ACTIVE_HTML_CLASS} from '../const.js';

const createMenuTemplate = () => {
  return `<nav class="main-navigation">
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class Menu extends BaseView {
  constructor() {
    super();

    this._onStatsClick = this._onStatsClick.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  removeActiveClass() {
    this.getElement().querySelector('.main-navigation__additional').classList.remove(NAVIGATION_ACTIVE_HTML_CLASS);
  }

  _onStatsClick(evt) {
    evt.preventDefault();
    this._callback.statsClick();
    evt.target.classList.add(NAVIGATION_ACTIVE_HTML_CLASS);
  }

  setStatsClickHandler(callback) {
    this._callback.statsClick = callback;
    this.getElement().querySelector('.main-navigation__additional').addEventListener('click', this._onStatsClick);
  }
}
