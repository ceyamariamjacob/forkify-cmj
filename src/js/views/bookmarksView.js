import View from './View.js'
import previewView from './previewView.js';
import icons from '../../img/icons.svg';
class BookmarksView extends View{

    _parentElement =document.querySelector('.bookmarks__list');
    _errorMessage='No Bookmarks yet:( Find a nice recipe and bookmark it!';
    _message='';

    addHandlerRender(handler){
        window.addEventListener('load',handler);
    }
    _generateMarkup(){
        console.log(this._data);
        return this._data.map(res=>previewView.render(res,false)).join('');
    }
}

export default new BookmarksView();