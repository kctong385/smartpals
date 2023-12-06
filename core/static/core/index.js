'use strict'

import { fadeIn, fadeOut } from './util.js';
import { generateProfile } from './profile.js';
import { populateSearchResult, populateRequestList, populateFriendList } from './friend.js';
import { populateActivities, populateFriendActivities, populateGameRanking, populateFriendGameRanking } from './game_record.js';


document.addEventListener("DOMContentLoaded", function() {
  // Handle navigation using the History API
  document.addEventListener('click', function (event) {
    const anchor = event.target.closest('a');
    if (anchor) {
      const href = anchor.getAttribute('href');
      if (href != '/logout' && href != '/games/') {
        event.preventDefault();
        history.pushState(null, null, href);
        handleRoute(href);
      }
    }

    if (event.target.classList.contains('requestLiUsername')) {
      history.pushState(null, null, '/profile');
    }
  });

  // When back arrow is clicked, show previous section
  window.onpopstate = function() {
    handleRoute(window.location.pathname);
  }

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

  // Searchbar
  document.querySelector('#searchInput').addEventListener('keyup', () => {
    searchUser();
  });

  // Load index view initially
  const view = document.querySelector('#index-view-container');
  // history.pushState({view: 'index'}, '', 'index');
  fadeIn(view, '');
});

// Function to handle routes
function handleRoute(route) {
  switch (route) {
      case '/index':
        displayView('index');
        break;
      case '/profile':
        displayView('profile');
        break;
      case '/friends':
        displayView('friends');
        break;
      case '/games':
        window.location.href = '/games';
        break;

      default:
        displayView('index');
  }
}

function displayView(view) {
  var id;
  switch (view) {
    case 'index':
      id = '#index-view-container';
      break;

    case 'profile':
      id = '#profile-view-container';
      break;

    case 'friends':
      id = '#friends-view-container';
      break;
  }
  const viewToDisplay = document.querySelector(id);
  
  const viewContainers = document.querySelectorAll('.view-container');

  viewContainers.forEach(viewContainer => {
    // Find current view
    if (viewContainer.style.display === 'block') {
      fadeOut(viewContainer, () => {
        fadeIn(viewToDisplay, '');
      })
    }
  })

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

function refreshFriendsView() {
  // Populate friend request
  populateRequestList('received');

  // Populate friend list
  populateFriendList();

  // Populate friends' recent activities
  populateFriendActivities();

  // Populate friends' game ranking
  populateFriendGameRanking();
}

// Reload search result display
function searchUser() {
  // Declare var
  const searchInput = document.querySelector('#searchInput').value;
  const target = document.querySelector('#search-result-view');

  if (searchInput.trim() != '') {
    // Fetch searchInput to url and response a filtered user list
    fetch(`/search/${searchInput}`)
    .then(response => response.json())
    .then(users => {
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


export { loadProfileView, loadFriendsView, refreshFriendsView, searchUser }