import Observer from '../utils/observer.js';

export default class Movies extends Observer {
  constructor() {
    super();

    this._movies = [];
  }

  getMovies() {
    return this._movies;
  }

  setMovies(updateType, movies) {
    this._movies = movies.slice();

    this._notify(updateType);
  }

  updateMovie(updateType, update) {
    const index = this._movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this._movies = [
      ...this._movies.slice(0, index),
      update,
      ...this._movies.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(movie) {
    const adaptedMovie = Object.assign(
      {},
      movie,
      {
        info: {
          title: movie.film_info.title,
          originalTitle: movie.film_info.alternative_title,
          poster: movie.film_info.poster,
          description: movie.film_info.description,
          rating: movie.film_info.total_rating,
          releaseDate: movie.film_info.release.date,
          runtime: movie.film_info.runtime,
          genres: movie.film_info.genre,
          director: movie.film_info.director,
          writers: movie.film_info.writers,
          actors: movie.film_info.actors,
          country: movie.film_info.release.release_country,
          ageRating: movie.film_info.age_rating,
        },
        user: {
          watchlist: movie.user_details.watchlist,
          watched: movie.user_details.already_watched,
          watchingDate: movie.user_details.watching_date,
          favorite: movie.user_details.favorite,
        },
      },
    );

    delete adaptedMovie.film_info;
    delete adaptedMovie.user_details;

    return adaptedMovie;
  }

  static adaptToServer(movie) {
    const adaptedMovie = Object.assign(
      {},
      movie,
      {
        film_info: {
          title: movie.info.title,
          alternative_title: movie.info.originalTitle,
          poster: movie.info.poster,
          description: movie.info.description,
          total_rating: movie.info.rating,
          release: {
            date: movie.info.releaseDate,
            release_country: movie.info.country,
          },
          runtime: movie.info.runtime,
          genre: movie.info.genres,
          director: movie.info.director,
          writers: movie.info.writers,
          actors: movie.info.actors,
          age_rating: movie.info.ageRating,
        },
        user_details: {
          watchlist: movie.user.watchlist,
          already_watched: movie.user.watched,
          watching_date: movie.user.watchingDate,
          favorite: movie.user.favorite,
        },
      },
    );

    delete adaptedMovie.info;
    delete adaptedMovie.user;

    return adaptedMovie;
  }
}
