import {createElement} from '../utils/render.js';

export default class Base {
  constructor() {
    if (new.target === Base) {
      throw new Error('Can\'t instantiate Base, only concrete one.');
    }

    this._element = null;
    this._callback = {};
  }

  getTemplate() {
    throw new Error('Base method not implemented: getTemplate');
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
