import { displayView } from './display.js';
import { loadLevelView } from './level.js';


document.addEventListener("DOMContentLoaded", function() {
  // Load content view initially
  document.querySelector('#btn-addition').addEventListener('click', () => {
    loadLevelView('Addition');
  });

  document.querySelector('#btn-subtraction').addEventListener('click', () => {
    loadLevelView('Subtraction');
  });

  document.querySelector('#btn-multiplication').addEventListener('click', () => {
    loadLevelView('Multiplication');
  });

  document.querySelector('#btn-division').addEventListener('click', () => {
    loadLevelView('Division');
  });

  document.querySelector('#btn-spelling').addEventListener('click', () => {
    loadLevelView('Spelling');
  });

  document.querySelector('#btn-memory').addEventListener('click', () => {
    loadLevelView('Memory');
  });

  // TODO: Add game_content.js to populate game buttons according to catagory
  displayView('#activities-content-view');
});

