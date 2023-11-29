import { createGameBtn, createElement } from './create.js';

function displayView(selector) {
  // Hide all views
  document.querySelector('#activities-content-view').style.display = 'none';
  document.querySelector('#activities-view').style.display = 'none';
  document.querySelector('#activities-english-view').style.display = 'none';
  document.querySelector('#activities-game-view').style.display = 'none';

  // Display selected view
  document.querySelector(selector).style.display = 'block';
  console.log(`display ${selector}`)
}


function gameResultView(view, message) {
  view.innerHTML = '';
  view.append(
    createElement('div', 'game-result', message)
  );
  
  // Add Back button
  const btnBack = createGameBtn('Back', function() {
    displayView('#activities-content-view');
  });
  const btnBackDiv = document.createElement('div');
  btnBackDiv.append(btnBack);
  
  view.append(btnBackDiv);
}


export { displayView, gameResultView }