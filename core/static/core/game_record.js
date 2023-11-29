'use strict'

import { createNewEle, generateTable } from './util.js';

function populateActivities(profile_id) {
  const section = document.querySelector('#profile-activities-section');
  section.innerHTML = ''
  section.append(createNewEle('h3', '', 'Recent Activities'))

  fetch(`games/recent_activities/${profile_id}`)
  .then(response => response.json())
  .then(records => {
    console.log(records);

    if (records.length <= 0) {
      section.append(createNewEle('p', '', 'No result'));
    } else {
      let tableData = [];
      records.forEach(record => {
        let newEntry = {
          'Time': record.end_timestamp,
          'Game': record.game,
          'Level': record.level,
          'Score': record.score,
          'Attempts': record.attempts,
          'Game_Duration': record.game_time,
        };
        tableData.push(newEntry);
      })

      let table = generateTable(tableData);
      
      section.appendChild(table);
    }
  });
}


function populateFriendActivities() {
  const section = document.querySelector('#friends-activities-section');
  section.innerHTML = ''
  section.append(createNewEle('h3', '', 'Friend\'s Recent Activities'))

  fetch(`games/friends_activities`)
  .then(response => response.json())
  .then(records => {
    console.log(records);

    if (records.length <= 0) {
      section.append(createNewEle('p', '', 'No result'));
    } else {
      let tableData = [];
      records.forEach(record => {
        let newEntry = {
          'Time': record.end_timestamp,
          'Friend': record.player,
          'Game': record.game,
          'Level': record.level,
          'Score': record.score,
          'Attempts': record.attempts,
          'Game_Duration': record.game_time,
        };
        tableData.push(newEntry);
      })

      let table = generateTable(tableData);
      
      section.appendChild(table);
    }
  });
}


function populateGameRanking(profile_id) {
  const section = document.querySelector('#profile-ranking-section');
  section.innerHTML = ''
  section.append(createNewEle('h3', '', 'Best Record'))

  fetch(`games/games_ranking/${profile_id}`)
  .then(response => response.json())
  .then(games_ranking => {
    console.log(games_ranking);

    if (games_ranking.length <= 0) {
      section.append(createNewEle('p', '', 'No result'));
    } else {
      games_ranking.forEach(game_records => {
        // Add heading for ranking table of each game
        section.append(createNewEle('h5', '', `${game_records[0].game} Level ${game_records[0].level}`));
        
        // Generate table data for each game
        let tableData = [];
        game_records.forEach(record => {
          let newEntry = {
            'Time': record.end_timestamp,
            'Score': record.score,
            'Attempts': record.attempts,
            'Game_Duration': record.game_time,
          };
          tableData.push(newEntry);
        })

        // Generate ranking table for each game
        let table = generateTable(tableData);
      
        // Append ranking table for each game
        section.appendChild(table);
      })
    }
  });
}


function populateFriendGameRanking() {
  const section = document.querySelector('#friends-ranking-section');
  section.innerHTML = ''
  section.append(createNewEle('h3', '', 'Friend\'s Game Ranking'))

  fetch(`games/friends_ranking`)
  .then(response => response.json())
  .then(records => {
    console.log(records);

    if (records.length <= 0) {
      section.append(createNewEle('p', '', 'No result'));
    } else {
      records.forEach(game_records => {
        // Add heading for ranking table of each game
        section.append(createNewEle('h5', '', `${game_records[0].game} Level ${game_records[0].level}`));
        
        // Generate table data for each game
        let tableData = [];
        game_records.forEach(record => {
          let newEntry = {
            'Time': record.end_timestamp,
            'Friend': record.player,
            'Score': record.score,
            'Attempts': record.attempts,
            'Game_Duration': record.game_time,
          };
          tableData.push(newEntry);
        })

        // Generate ranking table for each game
        let table = generateTable(tableData);
      
        // Append ranking table for each game
        section.appendChild(table);
      })
    }
  });
}


export { populateActivities, populateFriendActivities, populateGameRanking, populateFriendGameRanking }