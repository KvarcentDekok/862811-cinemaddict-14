import BaseView from './base.js';

const createProfileTemplate = (profileRating) => {
  return `<section class="header__profile profile">
    <p class="profile__rating">${profileRating}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class Profile extends BaseView {
  constructor(profileRating) {
    super();

    this._profileRating = profileRating;
  }

  getTemplate() {
    return createProfileTemplate(this._profileRating);
  }
}
