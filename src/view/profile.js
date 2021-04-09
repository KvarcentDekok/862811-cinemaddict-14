import {createElement} from '../utils.js';

const createProfileTemplate = (profileRating) => {
  return `<section class="header__profile profile">
    <p class="profile__rating">${profileRating}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class Profile {
  constructor(profileRating) {
    this._element = null;
    this._profileRating = profileRating;
  }

  getTemplate() {
    return createProfileTemplate(this._profileRating);
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
