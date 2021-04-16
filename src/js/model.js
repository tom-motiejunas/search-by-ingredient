import regeneratorRuntime from 'regenerator-runtime';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: 9,
  },
  bookmarks: [],
};

export const apiCall = async function (url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) throw new Error(`${data.message} (${response.status})`);
    state.search.results = data;

    state.search.page = 1; // Resetting page count if we got new searches
  } catch (err) {
    console.error(err);
  }
};

export const loadSearchResults = async function (query) {
  try {
    return await apiCall(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${query}`
    );
  } catch (err) {
    console.error(err);
  }
};
export const getSearchResultsPage = function (page = '') {
  // Finding what page to load;
  if (!page) page = 1;
  if (page === 'fa-arrow-right') page = ++state.search.page;
  if (page === 'fa-arrow-left') page = --state.search.page;
  return getPage(page, state.search.results.meals);
};
export const getPage = function (pageNum, arr, RES_PER_PAGE = 9) {
  const lowerLim = (pageNum - 1) * RES_PER_PAGE;
  const upperLim = pageNum * RES_PER_PAGE;
  const pages = Math.ceil(arr.length / RES_PER_PAGE);
  return arr.slice(lowerLim, upperLim);
};

export const loadFoodIng = async function (id) {
  try {
    const data = await apiCall(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    renderFoodIng(data.meals[0]);
  } catch (err) {
    console.error(err);
  }
};

// For button in search tab
export const getButtonsFoodPage = function (pageToSend, pages) {
  // There is only 1 page
  if (pageToSend === 1 && pages === 1) return header;
  // There are other pages
  if (pageToSend > 1 && pageToSend < pages) {
    return leftArrowBtn + rightArrowBtn + header;
  }
  // Last page and there are other pages
  if (pageToSend === pages && pages > 1) return leftArrowBtn + header;
  // First page and there are other pages
  if (pageToSend === 1 && pages > 1) return rightArrowBtn + header;
};

// For button in ingredient tab
export const getButtonIngPage = function (pageToSend, pages) {
  if (pageToSend === 1 && pages === 1) return '';
  // There are other pages
  if (pageToSend > 1 && pageToSend < pages) {
    return leftArrowBtn + rightArrowBtn;
  }
  // Last page and there are other pages
  if (pageToSend === pages && pages > 1) return leftArrowBtn;
  // First page and there are other pages
  if (pageToSend === 1 && pages > 1) return rightArrowBtn;
};

export const getIngAndQuant = function () {
  const allIngredients = Object.keys(data) // Getting all Ingredients
    .filter(param => param.includes('strIngredient') && data[param] !== '')
    .map(str => data[str]);

  const allQuantities = Object.keys(data) // Getting all Ingredient Quantities
    .filter(param => param.includes('strMeasure') && data[param] !== '')
    .map(str => data[str]);

  return allIngredients.map((ing, i) => {
    `<i class="ingredient-item">${ing}</i>
             <i class="ingredient-quantity">${allQuantities[i]}</i>`;
  });
};
