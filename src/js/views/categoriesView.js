import View from './View.js';

class categoriesView extends View {
  _parentElement = document.querySelector('.grid');
  _overlay = document.querySelector('.querry-box');
  _content = document.querySelector('.search');
  _errorMessage = 'We could not find any categories';
  _message = '';

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      if (!(e.target.className === 'small-imgs categ')) return;
      const category = e.target.closest('.item').id;
      handler(category);
    });
  }

  hideWindow() {
    this._overlay.classList.add('hidden');
    this._content.classList.add('hidden');
  }
  openWindow() {
    this._overlay.classList.remove('hidden');
    this._content.classList.remove('hidden');
  }
  _generateMarkup() {
    this._clear();
    this.openWindow();
    return this._data
      .map(recipe => {
        return `
        <i class="item" id="${recipe.strCategory}">
        <img src="${recipe.strCategoryThumb}" class="small-imgs categ"/>
        <h6 class="center">${recipe.strCategory}</h6>
        </i>`;
      })
      .join('');
  }
}
export default new categoriesView();
