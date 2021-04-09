import {createElement} from '../utils.js';

const createStatisticsTemplate = (moviesCount) => {
  return `<p>${moviesCount.toLocaleString()} movies inside</p>`;
};

export default class Statistics {
  constructor(moviesCount) {
    this._element = null;
    this._moviesCount = moviesCount;
  }

  getTemplate() {
    return createStatisticsTemplate(this._moviesCount);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
