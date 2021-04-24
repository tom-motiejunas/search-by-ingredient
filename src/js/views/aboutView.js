import View from './View.js';

class foodsView extends View {
  _parentElement = document.querySelector('.grid');
  _UIbtn = document.querySelector('.fa');
  _overlay = document.querySelector('.querry-box');
  _content = document.querySelector('.search');
  _message = '';

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      if (!(e.target.className === 'small-imgs-about')) return;
      console.log('clicked');
    });
  }

  openWindow() {
    this._overlay.classList.remove('hidden');
    this._content.classList.remove('hidden');
  }
  hideWindow() {
    this._content.classList.add('hidden');
  }
  _generateMarkup() {
    this.openWindow();
    return `
    <i class="item">
    <img src="http://pngimg.com/uploads/github/github_PNG40.png" class="small-imgs-about" />
    <h4 class="center">GitHub</h4>
    </i>
    <i class="item">
    <img src="https://image.flaticon.com/icons/png/512/61/61109.png" class="small-imgs-about" />
    <h4 class="center">Linkedin</h4>
    </i>`;
  }
}

export default new foodsView();
