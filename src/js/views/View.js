export default class View {
  _data;

  render(data, render = true, isClear = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;

    if (isClear) this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear = function () {
    this._parentElement.innerHTML = '';
  };
}
