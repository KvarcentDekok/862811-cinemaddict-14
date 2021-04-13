import AbstractView from './abstract.js';

const createContentTemplate = () => {
  return '<section class="films"></section>';
};

export default class Content extends AbstractView {
  getTemplate() {
    return createContentTemplate();
  }
}
