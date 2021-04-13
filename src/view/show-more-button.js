import AbstractView from './abstract.js';

const createShowMoreButtonTemplate = () => {
  return '<button class="films-list__show-more">Show more</button>';
};

export default class ShowMoreButton extends AbstractView {
  constructor() {
    super();

    this._buttonClickHandler = this._buttonClickHandler.bind(this);
  }

  getTemplate() {
    return createShowMoreButtonTemplate();
  }

  _buttonClickHandler(evt) {
    evt.preventDefault();
    this._callback.buttonClick(evt);
  }

  setButtonClickHandler(callback) {
    this._callback.buttonClick = callback;
    this.getElement().addEventListener('click', this._buttonClickHandler);
  }
}
