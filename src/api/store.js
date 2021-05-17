export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }

  getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setItems(items, category) {
    const store = this.getItems();

    let categoryData = store[category];

    if (!categoryData) {
      this._storage.setItem(
        this._storeKey,
        JSON.stringify(
          Object.assign({}, store, {[category]: items}),
        ),
      );
    } else {
      categoryData = Object.assign({}, categoryData, items);

      this._storage.setItem(
        this._storeKey,
        JSON.stringify(
          Object.assign({}, store, {[category]: categoryData}),
        ),
      );
    }
  }

  setItem(key, value, category) {
    const store = this.getItems();

    let categoryData = store[category];

    categoryData = Object.assign({}, categoryData, {[key]: value});

    this._storage.setItem(
      this._storeKey,
      JSON.stringify(
        Object.assign({}, store, {[category]: categoryData}),
      ),
    );
  }

  removeItem(key, category) {
    const store = this.getItems();

    delete store[category][key];

    this._storage.setItem(
      this._storeKey,
      JSON.stringify(store),
      category,
    );
  }
}
