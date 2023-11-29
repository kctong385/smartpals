'use strict'

function gameData() {
  // TODO
}

function gameLog(game_id, level, score, attempt, game_time) {
  // TODO: Log game, level, player, start time, score, attemp
  console.log('Log Game!');
  fetch('activity_log', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
    body: JSON.stringify({
      game_id: game_id,
      level: level,
      score: score,
      attempt: attempt,
      game_time: game_time,
    }),
  })
  .then(response => response.json())
  .then(result => {
    console.log('Game logged!');
    console.log(result);
  });
}


function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie != '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
          var cookie = jQuery.trim(cookies[i]);
          if (cookie.substring(0, name.length + 1) == (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}


export { gameData, gameLog }