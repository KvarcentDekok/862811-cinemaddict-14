import {capitalize, createElement} from '../utils.js';

const createFilterTemplate = (filter) => {
  const {name, count} = filter;

  return `<a href="#${name}" class="main-navigation__item">
    ${capitalize(name)} <span class="main-navigation__item-count">${count}</span>
</a>`;
};

export default class Filter {
  constructor(filter) {
    this._element = null;
    this._filter = filter;
  }

  getTemplate() {
    return createFilterTemplate(this._filter);
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
