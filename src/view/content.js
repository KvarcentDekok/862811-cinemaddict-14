import BaseView from './base.js';

const createContentTemplate = () => {
  return '<section class="films"></section>';
};

export default class Content extends BaseView {
  getTemplate() {
    return createContentTemplate();
  }
}
