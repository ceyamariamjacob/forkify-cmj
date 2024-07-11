import * as model from './model.js'; 
import recipeView from './views/recipeview.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_sEC, TIMEOUT_SEC } from './config.js';
import 'core-js/stable';

if(module.hot){
  module.hot.accept();
}
import 'regenerator-runtime/runtime'

// API = https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
//CONTROLLER MODULE -- ROUTING (loads, renders) && NOT EXPORTED && SCRIPTS ENTRY POINT

const controlRecipes=async function(){
  try{
    const id=window.location.hash.slice(1);
    console.log(id);
    
    if(!id)return;

    //load recipe
    recipeView.renderSpinner();

    //update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //update bookmarks view
    bookmarksView.update(model.state.bookmarks);


    await model.loadRecipe(id);
     
    //rendering recipe
    recipeView.render(model.state.recipe);
  }catch(err){
    recipeView.renderError();
  }

}; 

const controlSearchResults=async function(){
  try{
    resultsView.renderSpinner();

    //get query
    const query=searchView.getQuery();
    // if(!query)return;

    //load results
    await model.loadSearchResults(query);

    //render results
    console.log(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //render initial pagination buttons
    paginationView.render(model.state.search);


  }
  catch(err){
    console.log(err);    

  }
}

const controlPagination=function(goToPage){
  //render new search results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //render new pagination buttons
  paginationView.render(model.state.search);
  console.log(model.state.search);

}

const controlServings=function(newServings){
  //update recipe servings (in state)
  model.updateServings(newServings);

  //update recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

const controlAddBookmark=function(){
  //add or remove bookmarks
  if(!model.state.recipe.bookmarked)model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //update recipe view
  recipeView.update(model.state.recipe);

  //render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks=function(){
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe=async function(newRecipe){
  try{

  //upload new recipe
  await model.uploadRecipe(newRecipe);
  console.log(model.state.recipe);

  //render recipeview
  recipeView.render(model.state.recipe);

  //success message
  addRecipeView.renderMessage();

  //render bookmark view
  bookmarksView.render(model.state.bookmarks);

  //change id in url
  window.history.pushState(null,'',`#${model.state.recipe.id}`);
  // window.history.back();


  //close form
  setTimeout(function(){
    addRecipeView.toggleWindow();
  },MODAL_CLOSE_sEC*1000);
  

  }catch(err){
    console.error(err);
    addRecipeView.renderError('Wrong ingredient format! Please use the correct format :)');
    setTimeout(addRecipeView.restoreForm, TIMEOUT_SEC*1000);

  }
}


const init=function(){
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('welcome!!');
}
init();