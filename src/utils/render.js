import Base from '../view/base.js';

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTER_ELEMENT: 'after-element',
};

export const render = (container, element, place) => {
  if (container instanceof Base) {
    container = container.getElement();
  }

  if (element instanceof Base) {
    element = element.getElement();
  }

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.AFTER_ELEMENT:
      container.after(element);
      break;
    default:
      container.append(element);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');

  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const replace = (newChild, oldChild) => {
  if (oldChild instanceof Base) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof Base) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || newChild === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  parent.replaceChild(newChild, oldChild);
};
