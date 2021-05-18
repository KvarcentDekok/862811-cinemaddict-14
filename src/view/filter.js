import {capitalize} from '../utils/common.js';
import BaseView from './base.js';
import {FilterType, NAVIGATION_ACTIVE_HTML_CLASS} from '../const';

const createFilterTemplate = (filters, currentFilterType) => {
  const filterItemsTemplate = filters.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join('');

  return `<div class="main-navigation__items">
        ${filterItemsTemplate}
    </div>`;
};

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return `<a href="#${type}" 
    class="main-navigation__item ${type === currentFilterType ? NAVIGATION_ACTIVE_HTML_CLASS : ''}"
    data-type="${type}">
    ${capitalize(name)} ${type !== FilterType.ALL ? `<span class="main-navigation__item-count">${count}</span>` : ''}
</a>`;
};

export default class Filter extends BaseView {
  constructor(filters, currentFilterType) {
    super();

    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._onFilterTypeChange = this._onFilterTypeChange.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilter);
  }

  removeActiveClass() {
    const filterButtons = this.getElement().querySelectorAll('.main-navigation__item');

    for (let i = 0; i < filterButtons.length; i++) {
      filterButtons[i].classList.remove(NAVIGATION_ACTIVE_HTML_CLASS);
    }
  }

  _onFilterTypeChange(evt) {
    if (evt.target.classList.contains('main-navigation__item')) {
      evt.preventDefault();
      this._callback.filterTypeChange(evt.target.dataset.type);
    }
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._onFilterTypeChange);
  }
}
