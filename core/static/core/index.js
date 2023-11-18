document.addEventListener("DOMContentLoaded", function() {
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


function loadProfileView(profile_id) {
  // PROFILE USER INFO SECTION
  generateProfile(profile_id);

  // RECENT GAME ACTIVITIES SECTION

  // BEST RECORD SECTION

  displayView('profile');
}


// Preceeded by loadProfileView
function generateProfile(profile_id) {
  target = document.querySelector('#user-info-section');
  target.innerHTML = '';

  fetch(`/profile/${profile_id}`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    
    // Kid's name
    target.append(createNewEle(
      'div', // tag
      'profile_name',  // class
      `${data.first_name} ${data.last_name}` // innerHTML
      ));

    // Kid's age
    target.append(createNewEle(
      'div', // tag
      'profile_info',  // class
      `${data.age} years old` // innerHTML
      ));

    // Email address
    target.append(createNewEle(
      'div', // tag
      'profile_info',  // class
      data.email // innerHTML
      ));

    // Create Edit info button
    if (data.is_self) {
      const editBtn = createNewEle(
        'button', // tag
        'btn btn-primary btn-sm', // class
        'Edit'); // innerHTML
      editBtn.addEventListener('click', () => {
        generateEditForm(data, target);
      });
      target.append(editBtn);
    } else {
      // Create Friend / Unfriend button
      const friendBtn = createNewEle('button', 'btn btn-outline-primary btn-sm', '');
      if (data.is_friend) {
        friendBtn.innerHTML = 'Add Friend';
      } else {
        friendBtn.innerHTML = 'Unfriend';
      }

      // Add event handler
      friendBtn.addEventListener('click', () => {
        friendBtnHandler();
      })

      target.append(friendBtnSelection(data));
    }
  });
}


function generateEditForm(data, target) {
  // Empty target
  target.innerHTML = '';

  const editForm = document.createElement('form');

  // Create First Name Input
  const firstNameInput = createInput(
    'form-control', // class
    'text', // type
    data.first_name, // value
    'First Name', // placeholder
  );
  editForm.append(
    addWrappingDiv(firstNameInput, 'form-group')
  );

  // Create Last Name Input
  const lastNameInput = createInput(
    'form-control', // class
    'text', // type
    data.last_name, // value
    'Last Name', // placeholder
  );
  editForm.append(
    addWrappingDiv(lastNameInput, 'form-group')
  );

  // Create Date of Birth Input
  const dateOfBirthInput = createInput(
    'form-control', // class
    'date', // type
    data.date_of_birth, // value
    'Date of Birth', // placeholder
  );
  editForm.append(
    addWrappingDiv(dateOfBirthInput, 'form-group')
  );

  // Create save button
  const saveBtn = document.createElement('input');
  saveBtn.className = 'btn btn-primary btn-sm';
  saveBtn.type = 'button';
  saveBtn.value = 'Save';

  // Add event handler
  saveBtn.addEventListener('click', () => {
    console.log('Clicked save!');
    // Fetch data
    fetch(`/profile/edit`, {
      method: 'PUT',
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify({
        first_name: firstNameInput.value,
        last_name: lastNameInput.value,
        date_of_birth: dateOfBirthInput.value,
      })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
    })
    .catch(error => {
      console.log('Error', error);
    })

    // Refresh profile view
    setTimeout(loadProfileView, 100, data.id);

    // Prevent default submission
    return false;
  })

  editForm.append(saveBtn);

  target.append(editForm);
}


// Initialize Friend View
function loadFriendsView() {
  // Populate friend request
  populateRequestList('received');

  // Populate friend list
  populateFriendList();


  // Friends' recent activities

  // Friends' game ranking

  
  displayView('friends');
}


// Create Friend/Unfriend button
// Preceeded by generateProfile
function friendBtnSelection(data) {
  const clsName = 'btn btn-primary btn-sm';

  if (data.is_friend) {
    // Create unfriend button
    return createUnfriendBtn(
      data.id, 
      clsName,
      () => { generateProfile(data.id) },
      );

  } else {
    // No Existing Request: Add friend option
    if (data.friend_request_status === 'none') {
      return createAddFriendBtn(data.id, clsName);
    }

    // Request Sent: Button disable and display 'Pending'
    if (data.friend_request_status === 'sent') {
      const btn = createNewEle('button', clsName, 'Pending');
      btn.disabled = true;
      return btn;
    }

    // Request Received: Accept request option
    if (data.friend_request_status === 'received') {
      return createResponseBtn(
        data.friend_request, // Require request data
        '', 
        function() {loadProfileView(data.id);}
        );
    }
  }
}


function createUnfriendBtn(profile_id, clsName, refreshFunction) {
  const btn = createNewEle('button', clsName, '');
  btn.innerHTML = 'Unfriend';
  // Add event handler
  btn.addEventListener('click', () => {
    fetch(`/toggle_friend`, {
      method: 'PUT',
      headers: {
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


function createAddFriendBtn(profile_id, clsName) {
  const btn = createNewEle('button', clsName, '');
  btn.innerHTML = 'Add Friend';
  // Add event handler
  btn.addEventListener('click', () => {
    fetch(`/toggle_friend`, {
      method: 'PUT',
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify({
        friend_id: profile_id,
        action: 'addfriend',
      })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
    });
    setTimeout(generateProfile, 100, profile_id);
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


// Preceeded by searchUser
function populateSearchResult(users) {
  console.log(users);
  const userUl = document.createElement('ul');
  userUl.className = 'inlineUL';

  users.forEach((user) => {
    const userLi = document.createElement('li');
    userLi.innerHTML = user.username;
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
        const friend_name = friend.username;
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

// FACTORY FUNCTIONS //
function createNewEle(tag, clsName, content) {
  const element = document.createElement(tag);
  element.className = clsName;
  element.innerHTML = content;
  return element;
}


function createInput(clsName, type, value, placeholder) {
  const element = document.createElement('input');
  element.className = clsName;
  element.type = type;
  element.value = value;
  element.placeholder = placeholder;
  return element
}


function addWrappingDiv(inputEle, clsName) {
  const element = document.createElement('div');
  element.className = clsName;
  element.append(inputEle);
  return element;
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