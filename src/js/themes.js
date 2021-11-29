export default class Themes {
  static counter = 0;

  static _themes = [{ prairie: 'prairie' }, { desert: 'desert' }, { arctic: 'arctic' }, { mountain: 'mountain' }];

  static get themes() {
    return this._themes;
  }

  // @return String
  static next() {
    const theme = this._themes[this.counter];
    this.counter += 1;
    if (this.counter === this._themes.length) {
      this.counter = 0;
    }
    return Object.values(theme);
  }
}
