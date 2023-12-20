'use strict'

import { createGameBtn, createElement } from './utils.js';

function displayView(selector) {
  // Define the view to be displayed
  const viewToDisplay = document.querySelector(selector);

  // Find current view and fade out
  const viewContainers = document.querySelectorAll('.view-container');
  viewContainers.forEach(viewContainer => {
    if (viewContainer.style.display === 'block') {
      fadeOut(viewContainer, () => {
        // Then fade in the target view
        fadeIn(viewToDisplay, '');
      })
    }
  })
}


function gameResultView(result) {
  const view = document.querySelector('#activities-result-view');
  view.innerHTML = '';
  var resultContent;

  switch (result) {
    case 'win':
      resultContent = createElement('div', 'game-result win', 'You did it!');
      break;

    case 'lose':
      resultContent = createElement('div', 'game-result lose', 'Try again!!');
      break;
  }
  view.append(resultContent);

  displayView('#activities-result-view');
  
  resultContent.addEventListener('animationend', () => {
    setTimeout(() => {
      // Add Back button
      const btnBack = createGameBtn('Back', function() {
        displayView('#activities-content-view');
      });
      const btnBackDiv = document.createElement('div');
      btnBackDiv.append(btnBack);
      
      view.append(btnBackDiv);
    }, 1000);
  })
}


function fadeOut(targetView, callBack) {
  targetView.classList.add('hide');
  
  let handler;
  targetView.addEventListener('animationend', handler = () => {
    // Hide view
    targetView.style.display = 'none';
    // Remove 'hide' class
    targetView.classList.remove('hide');
    // Callback function
    setTimeout(callBack, 0)
    // Remove handler
    targetView.removeEventListener('animationend', handler);
  })
}

function fadeIn(targetView, callBack) {
  // Display view
  targetView.style.display = 'block';
  // Add animation class
  targetView.classList.add('appear');

  let handler;
  targetView.addEventListener('animationend', handler = () => {
    // Remove 'appear' class
    targetView.classList.remove('appear');
    // Callback function
    setTimeout(callBack, 0)
    // Remove handler
    targetView.removeEventListener('animationend', handler);
  })
}


export { displayView, gameResultView, fadeOut, fadeIn }