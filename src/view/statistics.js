import AbstractView from './abstract.js';

const createStatisticsTemplate = (moviesCount) => {
  return `<p>${moviesCount.toLocaleString()} movies inside</p>`;
};

export default class Statistics extends AbstractView {
  constructor(moviesCount) {
    super();

    this._moviesCount = moviesCount;
  }

  getTemplate() {
    return createStatisticsTemplate(this._moviesCount);
  }
}
