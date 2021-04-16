import * as model from './model.js';
import foodsView from './views/foodsView.js';
import navView from './views/navView.js';
import paginationView from './views/paginationView.js';
import searchView from './views/searchView.js';

const controlNavBar = function (e) {
  // Event delegation
  if (e.target.className !== 'nav-text') return; // Guard clause
  console.log('hello');
  //tableName.textContent = e.target.textContent;
};

const controlSearch = async function () {
  // 1) Getting search querry
  const query = searchView.getQuery();

  // 2) Load Search Results
  await model.loadSearchResults(query);

  // 3) Render Results
  foodsView.render(model.getSearchResultsPage());

  // 4) Render Buttons
  paginationView.render(model.state.search);
  // console.log(model.state.search.results);
};

const controlPagination = function (goToPage) {
  // 1) Render New Results
  foodsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render New Pagination Buttons
  paginationView.render(model.state.search);
};

const init = function () {
  navView.addHandlerRender(controlNavBar);
  searchView.addHandlerSearch(controlSearch);
  paginationView.addHandlerClick(controlPagination);
};
init();
