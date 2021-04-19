import {capitalize} from '../utils/common.js';
import BaseView from './base.js';

const createFilterTemplate = (filter) => {
  const {name, count} = filter;

  return `<a href="#${name}" class="main-navigation__item">
    ${capitalize(name)} <span class="main-navigation__item-count">${count}</span>
</a>`;
};

export default class Filter extends BaseView {
  constructor(filter) {
    super();

    this._filter = filter;
  }

  getTemplate() {
    return createFilterTemplate(this._filter);
  }
}
