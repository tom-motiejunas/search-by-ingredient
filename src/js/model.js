import regeneratorRuntime from 'regenerator-runtime';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: 9,
    context: '',
  },
  ingredient: {
    id: '',
    results: [],
    page: 1,
    resultsPerPage: 6,
  },
  bookmarks: [],
};

export const apiCall = async function (url) {
  try {
    const response = await fetch(url);
    return await response.json();
    if (!response.ok) throw new Error(`${data.message} (${response.status})`);
  } catch (err) {
    console.error(err);
  }
};

export const loadSearchResults = async function (query) {
  try {
    const data = await apiCall(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${query}`
    );
    state.search.results = data;
    state.search.page = 1; // Resetting page count if we got new searches
    state.search.context = 'food'; // Changing context
  } catch (err) {
    console.error(err);
  }
};
export const getNewPageNumber = function (str) {
  if (str === 'fa-arrow-right') return 1;
  if (str === 'fa-arrow-left') return -1;
  else return 0;
};

export const getSearchResultsPage = function (
  page = '',
  arr = state.search.results.meals,
  RES_PER_PAGE = 9
) {
  // Finding what page to load;
  if (!page) page = 1;
  if (arr === state.search.results.meals || arr === state.search.results) {
    state.search.page += getNewPageNumber(page);
    page = state.search.page;
  } else {
    state.recipe.page += getNewPageNumber(page);
    page = state.ingredient.page;
  }
  return getPage(page, arr, RES_PER_PAGE);
};
export const getPage = function (pageNum, arr, RES_PER_PAGE = 9) {
  const lowerLim = (pageNum - 1) * RES_PER_PAGE;
  const upperLim = pageNum * RES_PER_PAGE;
  return arr.slice(lowerLim, upperLim);
};

export const loadFoodIng = async function (id) {
  try {
    const data = await apiCall(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    state.ingredient.page = 1;
    state.ingredient.id = id;
    state.ingredient.results = data.meals[0];
  } catch (err) {
    console.error(err);
  }
};
export const loadCategories = async function () {
  try {
    const data = await apiCall(
      'https://www.themealdb.com/api/json/v1/1/categories.php'
    );
    state.search.results = data.categories;
    state.search.page = 1; // Resetting page count if we got new searches
    state.search.context = 'categ'; // Changing context
  } catch (err) {
    console.error(err);
  }
};
export const loadLucky = async function () {
  try {
    const data = await apiCall(
      'https://www.themealdb.com/api/json/v1/1/random.php'
    );
    state.search.results = data;
    state.search.page = 1; // Resetting page count if we got new searches
    state.search.context = 'luck'; // Changing context
  } catch (err) {
    console.error(err);
  }
};

export const loadCategorySearch = async function (category) {
  try {
    const data = await apiCall(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
    );
    state.search.results = data;
    state.search.page = 1; // Resetting page count if we got new searches
    state.search.context = 'food'; // Changing context
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

export const getKeysArr = function (ingObj, str) {
  const arr = Object.keys(ingObj).filter(
    ing => ing.includes(str) && ingObj[ing]
  );
  return arr.map(str => ingObj[str]);
};
