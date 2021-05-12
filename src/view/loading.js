import BaseView from './base.js';

const createLoadingTemplate = () => {
  return '<h2 class="films-list__title">Loading...</h2>';
};

export default class Loading extends BaseView {
  getTemplate() {
    return createLoadingTemplate();
  }
}
