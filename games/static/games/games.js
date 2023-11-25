import { displayView } from './display.js';
import { loadLevelView } from './level.js';
import { loadSubtractionView } from './game_subtraction.js';
import { loadMultiplicationView } from './game_multiplication.js';
import { loadDivisionView } from './game_division.js';
import { loadSpellingView } from './game_spelling.js';
import { loadMemoryView } from './game_memory.js';

document.addEventListener("DOMContentLoaded", function() {
  // Load content view initially
  document.querySelector('#btn-addition').addEventListener('click', () => {
    loadLevelView('addition');
    displayView('#activities-view');
  });

  document.querySelector('#btn-subtraction').addEventListener('click', () => {
    loadLevelView('subtraction');
    displayView('#activities-view');
  });

  document.querySelector('#btn-multiplication').addEventListener('click', () => {
    loadLevelView('multiplication');
    displayView('#activities-view');
  });

  document.querySelector('#btn-division').addEventListener('click', () => {
    loadLevelView('division');
    displayView('#activities-view');
  });

  document.querySelector('#btn-spelling').addEventListener('click', () => {
    loadSpellingView();
    displayView('#activities-spelling-view');
  });

  document.querySelector('#btn-memory').addEventListener('click', () => {
    loadMemoryView();
    displayView('#activities-memory-view');
  });

  displayView('#activities-content-view');
});

