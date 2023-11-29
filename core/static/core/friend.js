import { getCookie, createNewEle, addWrappingDiv } from './util.js';
import { loadProfileView, loadFriendsView } from './index.js'


// Preceeded by searchUser
function populateSearchResult(users) {
  console.log(users);
  const userUl = document.createElement('ul');
  userUl.className = 'inlineUL';

  users.forEach((user) => {
    const userLi = document.createElement('li');
    userLi.innerHTML = user.name;
    userLi.addEventListener('click', () => {
      loadProfileView(user.id);
    });
    userUl.append(userLi);
  });

  return userUl;
}


// Preceeded by loadFriendsView
// Reload Request List
function populateRequestList(request_direction) {
  console.log('populate requests');

  const friendRequestSection = document.querySelector('#friend-request-section');
  friendRequestSection.innerHTML = '';
  friendRequestSection.append(createNewEle('h3', '', 'Friend request received'))

  fetch(`/received_request`)
  .then(response => response.json())
  .then(data => {
    console.log(data);

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
          loadFriendsView,
        );

        userLi.append(usernameDiv);
        userLi.append(responseDiv);
        userUl.append(userLi);
      })
      friendRequestSection.append(userUl);
    }
  });
}


// Preceeded by loadFriendsView
// Reload Friend List
function populateFriendList() {
  const friendListSection = document.querySelector('#friend-list-section');
  friendListSection.innerHTML = '';
  friendListSection.append(createNewEle('h3', '', 'Friend List'))

  fetch(`/friend_list`)
  .then(response => response.json())
  .then(data => {
    console.log(data);

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

        const interactiveBtn = createUnfriendBtn(
          friend_id, 
          'btn btn-primary btn-sm', 
          () => { populateFriendList(); },
          );

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
// Preceeded by populateFriendList, friendBtnSelection
function createUnfriendBtn(profile_id, clsName, refreshFunction) {
  const btn = createNewEle('button', clsName, '');
  btn.innerHTML = 'Unfriend';
  // Add event handler
  btn.addEventListener('click', () => {
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
    });
    setTimeout(refreshFunction, 100);
  });
  return btn;
}


// Create button to accept/decline friend request
// Preceeded by populateRequestList, friendBtnSelection
function createResponseBtn(request, clsName, refreshFunction) {
  const response = createNewEle('div', clsName, '');
  const acceptBtn = createNewEle('button', 'btn btn-primary btn-sm', 'Accept');
  const declineBtn = createNewEle('button', 'btn btn-primary btn-sm', 'Decline');
  
  // Accept addEventHandler
  acceptBtn.addEventListener('click', () => {
    console.log('accept clicked');
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
    
  });

  // Decline addEventHandler
  declineBtn.addEventListener('click', () => {
    console.log('decline clicked');
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
    
  });
  
  response.append(acceptBtn);
  response.append(declineBtn);
  return response;
}


export { populateSearchResult, populateRequestList, populateFriendList, createUnfriendBtn, createResponseBtn }