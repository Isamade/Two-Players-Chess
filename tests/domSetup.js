import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><head></head><body><div class="save-game exit-game end-game offer-draw new-game join-game game-form footer section-board"></div><div id="title"></div><div id="white"></div><div id="black"></div></body></html>', {
    url: 'http://localhost'
});
  

global.window = dom.window;
global.document = dom.window.document;

//const { window } = dom;
// or even
//const { document } = window;
global.fineGirl = 'Bella';
console.log('first print', global.fineGirl);

export default dom;