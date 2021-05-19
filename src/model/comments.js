export default class Comments {
  constructor() {
    this._comments = null;
  }

  get() {
    return this._comments;
  }

  set(comments) {
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

  static adaptToServer(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
        author: comment.name,
      },
    );

    delete adaptedComment.name;

    return adaptedComment;
  }
}
