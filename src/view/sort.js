import BaseView from './base.js';
import {SortType} from '../const.js';

const createSortTemplate = () => {
  return `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
  </ul>`;
};

export default class Sort extends BaseView {
  constructor() {
    super();

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate();
  }

  _getSortElements() {
    return this.getElement().querySelectorAll('.sort__button');
  }

  _changeActiveClass(element) {
    const sortElements = this._getSortElements();

    for (let i = 0; i < sortElements.length; i++) {
      sortElements[i].classList.remove('sort__button--active');
    }

    element.classList.add('sort__button--active');
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.dataset.sortType) {
      evt.preventDefault();
      this._callback.sortTypeChange(evt.target.dataset.sortType);
      this._changeActiveClass(evt.target);
    }
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
