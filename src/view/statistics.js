import BaseView from './base.js';

const createStatisticsTemplate = (moviesCount) => {
  return `<p>${moviesCount.toLocaleString()} movies inside</p>`;
};

export default class Statistics extends BaseView {
  constructor(moviesCount) {
    super();

    this._moviesCount = moviesCount;
  }

  getTemplate() {
    return createStatisticsTemplate(this._moviesCount);
  }
}
