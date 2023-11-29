'use strict'

import { generateProfile } from './profile.js';
import { populateSearchResult, populateRequestList, populateFriendList } from './friend.js';
import { populateActivities, populateFriendActivities, populateGameRanking, populateFriendGameRanking } from './game_record.js';


document.addEventListener("DOMContentLoaded", function() {
  // Profile button handler
  let profileBtnHandler;
  document.querySelector('#profileBtn').addEventListener('click', profileBtnHandler = () => {
    loadProfileView();
    this.removeEventListener('click', profileBtnHandler);
  });

  // Friend button handler
  let friendBtnHandler;
  document.querySelector('#friendsBtn').addEventListener('click', friendBtnHandler = () => {
    loadFriendsView();
    this.removeEventListener('click', friendBtnHandler);
  });

  // Load index view initially
  displayView('index');
});

function displayView(view) {
  if (view === 'index') {
    document.querySelector('#index-view-container').style.display = 'block';
    document.querySelector('#profile-view-container').style.display = 'none';
    document.querySelector('#friends-view-container').style.display = 'none';
    console.log('display index')
  }

  if (view === 'profile') {
    document.querySelector('#profile-view-container').style.display = 'block';
    document.querySelector('#index-view-container').style.display = 'none';
    document.querySelector('#friends-view-container').style.display = 'none';
    console.log('display profile')
  }

  if (view === 'friends') {
    document.querySelector('#friends-view-container').style.display = 'block';
    document.querySelector('#profile-view-container').style.display = 'none';
    document.querySelector('#index-view-container').style.display = 'none';
    console.log('display friends')
  }
}

function loadProfileView(profile_id=0) {
  // PROFILE USER INFO SECTION
  generateProfile(profile_id);

  // RECENT GAME ACTIVITIES SECTION
  populateActivities(profile_id);

  // BEST RECORD SECTION
  populateGameRanking(profile_id);

  displayView('profile');
}

// Initialize Friend View
function loadFriendsView() {
  // Populate friend request
  populateRequestList('received');

  // Populate friend list
  populateFriendList();

  // Populate friends' recent activities
  populateFriendActivities();

  // Populate friends' game ranking
  populateFriendGameRanking();
  
  displayView('friends');
}

// Reload search result display
function searchUser() {
  // Declare var
  const searchInput = document.querySelector('#searchInput').value;
  const target = document.querySelector('#search-result-view');

  if (searchInput.trim() != '') {
    // fetch searchInput to url and response a filtered user list
    fetch(`/search/${searchInput}`)
    .then(response => response.json())
    .then(users => {
      console.log(searchInput);
      target.innerHTML = '';

      if (users.length > 0) {
        target.append(populateSearchResult(users));
      } else {
        target.innerHTML = 'No result';
      }
    });
  } else {
    target.innerHTML = '';
  }
}


export { loadProfileView, loadFriendsView, searchUser }