import MoviesModel from '../model/movies.js';
import CommentsModel from '../model/comments.js';
import {isOnline} from '../utils/common.js';
import {StoreCategory} from '../const.js';

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getMovies() {
    if (isOnline()) {
      return this._api.getMovies()
        .then((movies) => {
          const items = createStoreStructure(movies.map(MoviesModel.adaptToServer));
          this._store.setItems(items, StoreCategory.MOVIES);
          return movies;
        });
    }

    const storeMovies = Object.values(this._store.getItems()[StoreCategory.MOVIES]);

    return Promise.resolve(storeMovies.map(MoviesModel.adaptToClient));
  }

  getComments(movieId) {
    if (isOnline()) {
      return this._api.getComments(movieId)
        .then((comments) => {
          const items = createStoreStructure(comments.map(CommentsModel.adaptToServer));
          this._store.setItems(items, StoreCategory.COMMENTS);
          return comments;
        });
    }

    const storeLocal = this._store.getItems()[StoreCategory.COMMENTS];

    let store = [];

    if (storeLocal) {
      store = Object.values(storeLocal);
    }

    return Promise.resolve(store.map(CommentsModel.adaptToClient));
  }

  updateMovie(movie) {
    if (isOnline()) {
      return this._api.updateMovie(movie)
        .then((updatedMovie) => {
          this._store.setItem(updatedMovie.id, MoviesModel.adaptToServer(updatedMovie), StoreCategory.MOVIES);
          return updatedMovie;
        });
    }

    this._store.setItem(movie.id, MoviesModel.adaptToServer(Object.assign({}, movie)), StoreCategory.MOVIES);

    return Promise.resolve(movie);
  }

  addComment(comment, filmId) {
    if (isOnline()) {
      return this._api.addComment(comment, filmId)
        .then((newComment) => {
          this._store.setItem(newComment.id, CommentsModel.adaptToServer(newComment), StoreCategory.COMMENTS);
          return newComment;
        });
    }

    return Promise.reject(new Error('Add comment failed'));
  }

  deleteComment(commentId) {
    if (isOnline()) {
      return this._api.deleteComment(commentId)
        .then(() => this._store.removeItem(commentId, StoreCategory.COMMENTS));
    }

    return Promise.reject(new Error('Delete comment failed'));
  }

  sync() {
    if (isOnline()) {
      const storeMovies = Object.values(this._store.getItems()[StoreCategory.MOVIES]);

      return this._api.sync(storeMovies)
        .then((response) => {
          const updatedMovies = response.updated;

          const items = createStoreStructure([...updatedMovies]);

          this._store.setItems(items, StoreCategory.MOVIES);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
