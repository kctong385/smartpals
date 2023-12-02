'use strict'

function loadActitiviesContentView() {
  fetch(`games_data`)
  .then(response => response.json())
  .then(game_data => {
    const view = document.querySelector('#activities-content-view');
    view.innerHTML = '';

    // Load category list
  
    // Add Game Category Heading
    view.append(
      createElement('h2', 'game-heading', capitalize_str(game_data['title']))
    );
  
    // Load select level button
    const divLevel = document.createElement('div');
    divLevel.className = 'level-btn-container';
  
    // Add Level 1 button
  })


}

export { loadActitiviesContentView }
