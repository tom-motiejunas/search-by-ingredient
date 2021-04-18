import View from './View.js';

class navView extends View {
  _parentElement = document.querySelector('.nav-bar');
  _errorMessage = 'We could not find any categories';
  _message = '';

  // addHandlerArrow(handler) {
  //   this._UIbtn.addEventListener('click', handler);
  // }

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      if (!e.target.className === 'small-imgs') return;
      if (e.target.className.includes('categ')) handler('categ');
      if (e.target.className.includes('luck')) handler('luck');
      if (e.target.className.includes('bookmark')) handler('bookmark');
      if (e.target.className.includes('about')) handler('about');
    });
  }

  _generateMarkup() {
    this.openWindow();
    return this._data
      .map(recipe => {
        if (recipe.strMeal.length > 24) {
          recipe.strMeal = `${recipe.strMeal.slice(0, 21)}...`;
        }
        return `
        <i class="item" id="${recipe.idMeal}">
        <img src="${recipe.strMealThumb}" class="small-imgs"/>
        <h6>${recipe.strMeal}</h6>
        </i>`;
      })
      .join('');
  }
}
export default new navView();
