import * as model from './model.js';
import foodsView from './views/foodsView.js';
import navView from './views/navView.js';
import searchView from './views/searchView.js';

const getPageData = function (pageNum, recipies) {
  recipies = getPage(1, recipies);
  clear(tableHeader);
  insertNewHTML(tableHeader, renderButtonsFoodPage(pageNum, pages));
  renderPageData(recipies);
};

const controlNavBar = function (e) {
  // Event delegation
  if (e.target.className !== 'nav-text') return; // Guard clause
  console.log('hello');
  //tableName.textContent = e.target.textContent;
};

const controlSearch = function () {
  const query = searchView.getQuery();

  document.querySelector('.querry-box').classList.remove('.hidden');
  const data = model.getSearchResultsPage(query);
  console.log(data);
};

const init = function () {
  navView.addHandlerRender(controlNavBar);
  navView.addHandlerRenderSearch(controlSearch);
};
init();

window.addEventListener('click', function (e) {
  e.preventDefault();
  if (!e.target.className.includes('fa')) return;
  if (e.target.className.includes('fa-arrow-left')) {
    currentPage--;
  }
  if (e.target.className.includes('fa-arrow-right')) {
    currentPage++;
  }
  if (e.target.className.includes('fa-times')) {
    table.classList.add('hidden');
    currentPage = 1;
    return;
  }
  getPageData(currentPage, data.meals);
  clear(tableHeader);
  insertNewHTML(tableHeader, renderButtonsFoodPage(currentPage, pages));
});
