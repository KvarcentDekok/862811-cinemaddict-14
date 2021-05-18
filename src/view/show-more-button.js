import BaseView from './base.js';

const createShowMoreButtonTemplate = () => {
  return '<button class="films-list__show-more">Show more</button>';
};

export default class ShowMoreButton extends BaseView {
  constructor() {
    super();

    this._onButtonClick = this._onButtonClick.bind(this);
  }

  getTemplate() {
    return createShowMoreButtonTemplate();
  }

  _onButtonClick(evt) {
    evt.preventDefault();
    this._callback.buttonClick(evt);
  }

  setButtonClickHandler(callback) {
    this._callback.buttonClick = callback;
    this.getElement().addEventListener('click', this._onButtonClick);
  }
}
