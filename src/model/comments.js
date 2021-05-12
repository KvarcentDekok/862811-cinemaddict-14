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

  static adaptToClient(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
        name: comment.author,
      },
    );

    delete adaptedComment.author;

    return adaptedComment;
  }
}
