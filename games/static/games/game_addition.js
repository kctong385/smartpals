'use strict'

import { createGameBtn, createElement, createInput } from './create.js';
import { displayView } from './display.js';
import { getRandomArbitrary, capitalize_str } from './content_gen.js';

// Load the structure of Addition game page
function loadMathGamePage(game, level) {
  const view = document.querySelector('#activities-view');
  view.innerHTML = '';
  
  // Add heading
  view.append(
    createElement('h2', 'game-heading', capitalize_str(game))
  );

  // Add instruction
  view.append(
    createElement('div', 'game-instruction', 'Score 10 to level up or win. Lose if the score is below 0.')
  );
  
  // Add level indication
  view.append(
    createElement('div', 'game-indication', `Level ${level}`)
  );
  
  // Add quiz
  view.append(
    createElement('div', 'game-quiz', 'quiz')
  );
  
  // Add input
  view.append(
    createInput('game-input', 'integer', '', 'Answer')
  );

  // Display score
  view.append(
    createElement('div', 'game-score', `Score: `)
  );

  // Add Back button
  const btnBack = createGameBtn('Back', function() {
    displayView('#activities-content-view');
  });
  const btnBackDiv = document.createElement('div');
  btnBackDiv.append(btnBack);
  
  view.append(btnBackDiv);

  const init_score = { '1': 3, '2': 2, '3': 1 };

  // Log game, level, player, start time
  gameMath(game, level, init_score[level], 0);
}

function gameMath(game, level, score, attempt) {
  console.log('In gameMath');
  console.log(score);
  console.log(`Attempt: ${attempt}`);
  const view = document.querySelector('#activities-view');
  const quizView = document.querySelector('.game-quiz');
  const scoreView = document.querySelector('#activities-view > .game-score');
  const gameInput = document.querySelector('#activities-view > .game-input');
  var quiz_num;
  var quiz_num1;
  var quiz_num2;
  var quiz_answer;
  var operator;
  let inputHandler;

  // Clean up input field
  gameInput.value = '';

  // Generate quiz
  switch (game) {
    case 'addition':
      quiz_num = generateAdditionQuiz(level);
      operator = '+';
      break;

    case 'subtraction':
      quiz_num = generateSubtractionQuiz(level);
      operator = '-';
      break;

    case 'multiplication':
      quiz_num = generateMultiplicationQuiz(level);
      operator = 'x';
      break;

    case 'division':
      quiz_num = generateDivisionQuiz(level);
      operator = '÷';
      break;
  }

  // Display quiz
  quiz_num1 = quiz_num[0];
  quiz_num2 = quiz_num[1];
  quiz_answer = quiz_num[2];
  quizView.innerHTML = `${quiz_num1} ${operator} ${quiz_num2}`;
  scoreView.innerHTML = `Score: ${score}`;

  // Define event handler on answer input
  gameInput.addEventListener('keyup', inputHandler = (event) => {
    var answer_input;
    if (event.key === "Enter") {
      answer_input = parseInt(gameInput.value);
      attempt += 1;
      
      if (answer_input === quiz_answer) {
        score += 1;
        scoreView.innerHTML = `Score: ${score}`;
      } else {
        score -= 1;
        scoreView.innerHTML = `Score: ${score}`;
      }
  
      if (score === 10) {
        // Game completed
        // Log end time, score, attemp
        view.innerHTML = '';
        view.append(
          createElement('div', 'game-result', 'You Win!')
        );
        
        // Add Back button
        const btnBack = createGameBtn('Back', function() {
          displayView('#activities-content-view');
        });
        const btnBackDiv = document.createElement('div');
        btnBackDiv.append(btnBack);
        
        view.append(btnBackDiv);
      } else {
        if (score < 0) {
          // Game over
          // Log end time, score, attemp
          view.innerHTML = '';
          view.append(
            createElement('div', 'game-result', 'You Lose!')
          );
          // Add Back button
          const btnBack = createGameBtn('Back', function() {
            displayView('#activities-content-view');
          });
          const btnBackDiv = document.createElement('div');
          btnBackDiv.append(btnBack);
          
          view.append(btnBackDiv);
        } else {
          // Next quiz
          gameInput.removeEventListener('keyup', inputHandler);
          gameMath(game, level, score, attempt);
        }
      }
    }
  });
}

function generateAdditionQuiz(level) {
  let num1, num2, answer;
  if (level === '1') {
    num1 = getRandomArbitrary(1, 5),
    num2 = getRandomArbitrary(1, 5)
  }

  if (level === '2') {
    num1 = getRandomArbitrary(6, 10),
    num2 = getRandomArbitrary(1, 5)
  }

  if (level === '3') {
    num1 = getRandomArbitrary(6, 10),
    num2 = getRandomArbitrary(6, 10)
  }
  answer = num1 + num2;
  return [num1, num2, answer]
}

function generateSubtractionQuiz(level) {
  let num1, num2, answer;
  if (level === '1') {
    answer = getRandomArbitrary(1, 5),
    num2 = getRandomArbitrary(1, 5)
  }

  if (level === '2') {
    answer = getRandomArbitrary(6, 10),
    num2 = getRandomArbitrary(1, 5)
  }

  if (level === '3') {
    answer = getRandomArbitrary(6, 10),
    num2 = getRandomArbitrary(6, 10)
  }
  num1 = answer + num2;
  return [num1, num2, answer]
}

function generateMultiplicationQuiz(level) {
  let num1, num2, answer;
  if (level === '1') {
    num1 = getRandomArbitrary(1, 5),
    num2 = getRandomArbitrary(1, 5)
  }

  if (level === '2') {
    num1 = getRandomArbitrary(6, 10),
    num2 = getRandomArbitrary(1, 5)
  }

  if (level === '3') {
    num1 = getRandomArbitrary(6, 10),
    num2 = getRandomArbitrary(6, 10)
  }
  answer = num1 * num2;
  return [num1, num2, answer]
}

function generateDivisionQuiz(level) {
  let num1, num2, answer;
  if (level === '1') {
    answer = getRandomArbitrary(1, 5),
    num2 = getRandomArbitrary(1, 5)
  }

  if (level === '2') {
    answer = getRandomArbitrary(6, 10),
    num2 = getRandomArbitrary(1, 5)
  }

  if (level === '3') {
    answer = getRandomArbitrary(6, 10),
    num2 = getRandomArbitrary(6, 10)
  }
  num1 = answer * num2;
  return [num1, num2, answer]
}

export { loadMathGamePage }

