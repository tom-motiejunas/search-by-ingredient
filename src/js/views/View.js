export default class View {
  _data;

  render(data, render = true, isClear = true) {
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
