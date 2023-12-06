import { getCookie, createNewEle, createSmBtn, addWrappingDiv } from './util.js';
import { loadProfileView, loadFriendsView, refreshFriendsView } from './index.js'


function populateSearchResult(users) {
  const userUl = document.createElement('div');
  userUl.className = 'searchResult';

  users.forEach((user) => {
    const userLi = document.createElement('div');
    userLi.innerHTML = user.username;
    userLi.addEventListener('click', () => {
      loadProfileView(user.id);
    });
    userUl.append(userLi);
  });

  return userUl;
}

// Reload Request List
function populateRequestList(request_direction) {
  const friendRequestSection = document.querySelector('#friend-request-section');
  friendRequestSection.innerHTML = '';
  friendRequestSection.append(createNewEle('h3', '', 'Friend request received'))

  fetch(`/received_request`)
  .then(response => response.json())
  .then(data => {
    const friendRequests = data.friend_requests;
    const userUl = document.createElement('ul');
    userUl.className = 'blockUL';

    if (friendRequests.length <= 0) {
      friendRequestSection.append(createNewEle('p', '', 'No result'));
    } else {
      friendRequests.forEach((friendRequest) => {
        var user_id = '';
        var user_name = '';

        if (request_direction === 'received') {
          user_id = friendRequest.from_user_id;
          user_name = friendRequest.from_user_name;
        }
        if (request_direction === 'sent') {
          user_id = friendRequest.to_user_id;
          user_name = friendRequest.to_user_name;
        }

        const userLi = document.createElement('li');
        
        const usernameDiv = createNewEle('div', 'requestLiUsername', user_name);
        usernameDiv.style.display = 'inline';

        usernameDiv.addEventListener('click', () => {
          loadProfileView(user_id);
        });

        const responseDiv = createResponseBtn(
          friendRequest, 
          'requestLiResponse', 
          refreshFriendsView,
        );

        userLi.append(usernameDiv);
        userLi.append(responseDiv);
        userUl.append(userLi);
      })
      friendRequestSection.append(userUl);
    }
  });
}

// Reload Friend List
function populateFriendList() {
  const friendListSection = document.querySelector('#friend-list-section');
  friendListSection.innerHTML = '';
  friendListSection.append(createNewEle('h3', '', 'Friend List'))

  fetch(`/friend_list`)
  .then(response => response.json())
  .then(data => {
    const userUl = document.createElement('ul');
    userUl.className = 'blockUL';

    if (data.length <= 0) {
      friendListSection.append(createNewEle('p', '', 'No result'));
    } else {
      data.forEach((friend) => {
        const friend_id = friend.id;
        const friend_name = friend.name;
        const userLi = document.createElement('li');
        
        const usernameDiv = createNewEle('div', 'requestLiUsername', friend_name);
        usernameDiv.style.display = 'inline';

        usernameDiv.addEventListener('click', () => {
          loadProfileView(friend_id);
        });

        const interactiveBtn = createUnfriendBtn(friend_id, () => {
          refreshFriendsView();
        });

        const interactiveDiv = addWrappingDiv(interactiveBtn, 'requestLiResponse');

        userLi.append(usernameDiv);
        userLi.append(interactiveDiv);
        userUl.append(userLi);
      })
      friendListSection.append(userUl);
    }
  });
}

// Create button to unfriend a user
function createUnfriendBtn(profile_id, refreshFunction) {
  const btn = createSmBtn('Unfriend', () => {
    fetch(`/toggle_friend`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify({
        friend_id: profile_id,
        action: 'unfriend',
      })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
    }).catch(error => {
      console.log('Error', error)
    });;
    setTimeout(refreshFunction, 100);
  });

  return btn;
}


// Create button to accept/decline friend request
function createResponseBtn(request, clsName, refreshFunction) {
  const response = createNewEle('div', clsName, '');
  
  // Accept addEventHandler
  const acceptEventHandler = () => {
    fetch(`/request_response`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify({
        request_id: request.id,
        action: 'accept',
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json();
    })
    .then(result => {
      console.log(result);
      setTimeout(refreshFunction, 100);
    })
    .catch(error => {
      console.log('Error', error)
    });
    
  };

  // Decline addEventHandler
  const declineEventHandler = () => {
    fetch(`/request_response`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify({
        request_id: request.id,
        action: 'decline',
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      response.json()})
    .then(result => {
      console.log(result);
      setTimeout(refreshFunction, 100);
    })
    .catch(error => {
      console.log('Error', error)
    });
    
  };

  const acceptBtn = createSmBtn('Accept', acceptEventHandler);
  const declineBtn = createSmBtn('Decline', declineEventHandler);
  
  response.append(acceptBtn);
  response.append(declineBtn);
  return response;
}


export { populateSearchResult, populateRequestList, populateFriendList, createUnfriendBtn, createResponseBtn }