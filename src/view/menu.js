import BaseView from './base.js';

const createMenuTemplate = () => {
  return `<nav class="main-navigation">
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class Menu extends BaseView {
  getTemplate() {
    return createMenuTemplate();
  }
}
