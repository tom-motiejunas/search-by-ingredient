import View from './View.js';

class foodsView extends View {
  _parentElement = document.querySelector('.itemGrid');
  _errorMessage = 'We could not find any ingredient with that recipe';
  _content = document.querySelector('.search');
  _message = '';

  hideWindow() {
    this._content.classList.remove('hidden');
    this._parentElement.classList.add('hidden');
  }
  openWindow() {
    this._content.classList.add('hidden');
    this._parentElement.classList.remove('hidden');
  }

  _generateMarkup() {
    this.openWindow();
    const ingredients = this._data.ingredients
      .map(
        (ing, i) => `
    <i class="ingredient-item">${ing}</i>
    <i class="ingredient-quantity">${this._data.quantities[i]}</i>`
      )
      .join('');
    // const pagedIngredientMarkup = getPage(1, ingredientMarkup, 6).join('');
    // const buttons = renderButtonIngPage(2, 3);
    return `<div class="green-filter">
                  <img
                    src="${this._data.strMealThumb}"
                    class="food-photo"
                    />
                </div>
                <h1 class="ingredient-text">Ingredients</h1>
                <div class="grid ingredient-box">
                ${ingredients}
                </div>
                <div class="center">
                  <button class="goto-recipe">Go to Page
                  </div>`;
  }
}

export default new foodsView();
