# SmartPals!
***"SmartPals!"*** is an educational web application designed for young kids to have fun while learning among friends. 

Site URL: <URL http://smartpals.fun>
Video Demo: <URL https://youtu.be/nT0T1VPTT2c>

## Distinctiveness and Complexity
***"SmartPals!"*** is a Django web application that consists of 2 apps, ***"core"*** and ***"games"***. The "core" app mainly handles the users related stuff, while the "games" app handles the games mechanism. Each app has its own models, views, urls routes and static files. 

Apart from the basic registering and authenticating functions, the "core" app facilitates a friend system that allows users to search other users, send friend requests, response to  requests and unfriend other users. Among friends, games performance ranking is presented to create a friendly competitive environment and encourage improvement. 

The "games" app is a single page application with 5 games available. Each game is generated upon selection of game and level and executed by plain javascript. Simple and clear HTML structure,  modular JS design allows easy expansion with additional games. Plenty of css animations and transitions are implemented in response to game actions and results to improve users experience. Game activities are logged for users to access their records and ranking.

## What’s contained in each file
### Models
The "core" app contains 2 model classes: **"User"** and **"FriendRequest"**. The "User" class contains methods to check if a user is a friend, to calculate users' age from their date of birth, serialize data for API and a classmethod to validate the date of birth input. The "FriendRequest" class captures the friend requests created by users. Requests will be removed upon target users' response, either accepted or declined. It contains a method to serialize data for API.

The "games" app contains 2 model classes: **"Game"** and **"Record"**. The "Game" class stores the information of each game such as game instructions, while the "Record" class stores the game results each time a user played a game.

### Urls, Views and Templates 
All pages in the project are extended from "layout.html" which defined the required reference to static files and external resources, as well as the basic structure of the application layout.

The core app defines routes and views to render the **"index.html"**, **"login.html"** and **"register.html"** pages as well as the logout action. It defines also API routes and views for retrieving and editing profile info, user searching, retrieving friends data and carrying out friend actions.

The games app only renders a single page, **"games.html"**. API routes and views are defined for retrieving game info, logging game results, retrieving games records and rankings.

### Javascript 
- core/index.js
  - Main scripts for "index.html". Initializes page.
  - Switches views between "index", "profile" and "friends".
  - Contains function for searching users.
  - Manages states while switching between views.
  - Handles virtual urls.

- core/profile.js
  - Retrieves profile info and update profile view user info section.
  - Switches user info section to edit form and fetch input data to server.
  - Handles friend system actions (add friend / unfriend/ response to request).
  
- core/friends.js
  - Displays user search result.
  - Loads friend request lists with response options.
  - Loads friend list with unfriend option.

- core/game_record.js
  - Retrieves user's recent activities records and update in profile view.
  - Retrieves user's activities record ranking and update in profile view.
  - Retrieves friends' recent activities records and update in friend view.
  - Retrieves friends' activities record ranking and update in friend view.

- core/utils.js 
  - Contains getCookie function for retrieving CSRF token.
  - Contains helper function to create element with class and innerHTML.
  - Contains helper function to create input element with input attributes.
  - Contains helper function to create styled button. Click event handler can be set with callback function.
  - Contains helper function to generate table for displaying game activities.
  - Contains function to handle page transition animation.

- games/games.js
  - Main scripts for "games.html". Initializes page.
  - Retrieves game data from server and populate game selection button accordingly.
  - Handles virtual urls.

- games/level.js
  - Displays view for level selection for selected game.

- games/game_maths.js
  - Defines the layout of maths games.
  - Generates maths quiz.
  - Defines maths game mechanism.

- games/game_memory.js
  - Defines the layout of memory games. 
  - Generates memory quiz.
  - Defines memory game mechanism.

- games/display.js
  - Displays selected views.
  - Displays ending animation according to game result.

- games/utils.js
  - Contains helper function to get random integers.
  - Contains helper function to capitalize string.
  - Contains helper function to shuffle array.
  - Contains helper function to create styled buttons. Click event handler can be set with callback function.
  - Contains helper function to create element with class and innerHTML.
  - Contains helper function to create input element with input attributes.

### CSS
#### core/styles.css
- Contains css classes for styling the theme of the project and components in core app such as tables, lists, search bar, messages...etc.

#### core/animations.css
- Contains css classes and animation keyframes for smooth page-transition.

#### core/sm_btn.css
- A css module of a small size 3D button style for all buttons in the "core" app. 

#### games/games.css
- General styling and effect for all games such as effect on score changes and game result animations.

#### games/game_memory.css
- The grid structure of the card memory game, card styling and also the flipping card effect.

#### games/games_btn.css
- A css module of a bigger size 3D button style for all buttons in the "games" app. 

### Tests
- Test modules are created for unit tests on model and view level, as well as a module for client side tests utilizing selenium. The tests covered all functionality of the "core" app. Test modules are grouped in a "tests" folder containing an empty "\_\_init__.py" file.

## How to run the application
  1. All app function required login. Register a new user or login to access the app.
  2. If login is successful, 
      - users will landed in the index page, where 4 options available: "Games", "Profile", "Friends", "Logout"
      - users will see their first name (if set) in a greeting message at the top of the page. 
  3. Select "Profile" view to 
      - review users' personal info
      - edit user's own personal info 
      - and review activities records.
  4. Select "Friends" view to
      - search other users by username, 
      - head to target user's profile page,
      - friend action options are available at user's profile page.
      - review received friend requests and response options are available.
      - review friends list and unfriend option is available.
      - review the most recent friend activities.
      - review the best game records of each game among friends.
  5. Select "Games" to head to games index page where all available games buttons are displayed for selection.
  6. Select a game and level to start the game.
  7. If the game is completed, a winning animation will be presented and game result will be logged.
  8. If the game is failed, a losing animation will be presented and game result will be logged.
  9. If the game is aborted with the in game "Back" button, user will be directed back to the game index page. Game result will be logged.
  10. If the game is aborted with the browser "Back" button, user will be directed back to the game index page. Game result will not be logged.
  11. The brand logo "SmartPals!" can be used to return to "core" app "index" view.
  12. "Logout" option is available in the "index" view as well as the top of the page in every page.



## Additional information
### External resources
- Bootstrap CSS and JS
- Google Fonts
