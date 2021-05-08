export default class Comments {
  constructor() {
    this._comments = null;
  }

  getComments() {
    return this._comments;
  }

  setComments(comments) {
    this._comments = comments;
  }

  addComment(comment) {
    this._comments.push(comment);
  }
}
