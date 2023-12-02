from django.test import TestCase, Client, RequestFactory, TransactionTestCase
from django.contrib.auth.models import AnonymousUser, User
from django.contrib.auth import get_user
from django.urls import reverse
from datetime import date
import json

from core.models import *
from core.views import *


class test_views_exception(TransactionTestCase):
  def setUp(self):
    print("\nRun setUp")
    self.client = Client()
    self.factory = RequestFactory()
    
    self.harry = {
      "id": 1,
      "username": "harry", 
      "email": "harry@test.com",
      "password": "1234",
      "first_name": "Harry", 
      "last_name": "Potter", 
      "date_of_birth": date(1980,7,31)
    }
    self.ron = {
      "id": 2,
      "username": "ron", 
      "email": "ron@test.com",
      "password": "1234",
      "first_name": "Ron", 
      "last_name": "Weasley", 
      "date_of_birth": date(1980,3,1)
    }
    self.hermione = {
      "id": 3,
      "username": "hermione", 
      "email": "hermione@test.com",
      "password": "1234",
      "first_name": "Hermione", 
      "last_name": "Granger", 
      "date_of_birth": date(1979,9,10)
    }
    
    self.u1 = User.objects.create_user(**self.harry)
    self.u2 = User.objects.create_user(**self.ron)
    self.u3 = User.objects.create_user(**self.hermione)
    
    # Create a request
    self.u1_u2 = FriendRequest.objects.create(from_user=self.u1, to_user=self.u2)
    self.u1_u2 = FriendRequest.objects.create(from_user=self.u2, to_user=self.u3)
    
    # u1 and u3 are friends
    self.u1.friend.add(self.u3)
    
  def test_register_c4(self):
    print("test_register_c4")
    # Input POST request with existing username
    user = get_user(self.client)
    
    if user.is_authenticated:
      # Logout client
      self.client.logout()
      user = get_user(self.client)
      
    register_data = {
      "username": "test",
      "email": "test@test.com",
      "password": "1234",
      "confirmation": "1234",
      "first_name": "Testy",
      "last_name": "Tester",
      "date_of_birth": date(1985,3,5)
    }
    
    self.client.post("/register", register_data)
    
    # with self.assertRaises(IntegrityError):
    response = self.client.post("/register", register_data)
    
    # Output render "/register" with error message
    # Assert response
    self.assertEqual(response.status_code, 200)
    self.assertTemplateUsed(response, "core/register.html")
    self.assertContains(response, "Username already taken.")
    
  
  
  
class test_views(TestCase):
  @classmethod
  def setUpTestData(cls):
    print("\nRun setUpTestData")
    cls.harry = {
      "id": 1,
      "username": "harry", 
      "email": "harry@test.com",
      "password": "1234",
      "first_name": "Harry", 
      "last_name": "Potter", 
      "date_of_birth": date(1980,7,31)
    }
    cls.ron = {
      "id": 2,
      "username": "ron", 
      "email": "ron@test.com",
      "password": "1234",
      "first_name": "Ron", 
      "last_name": "Weasley", 
      "date_of_birth": date(1980,3,1)
    }
    cls.hermione = {
      "id": 3,
      "username": "hermione", 
      "email": "hermione@test.com",
      "password": "1234",
      "first_name": "Hermione", 
      "last_name": "Granger", 
      "date_of_birth": date(1979,9,10)
    }
    
    cls.u1 = User.objects.create_user(**cls.harry)
    cls.u2 = User.objects.create_user(**cls.ron)
    cls.u3 = User.objects.create_user(**cls.hermione)
    
    # Create a request
    cls.u1_u2 = FriendRequest.objects.create(from_user=cls.u1, to_user=cls.u2)
    cls.u2_u3 = FriendRequest.objects.create(from_user=cls.u2, to_user=cls.u3)
    
    # u1 and u3 are friends
    cls.u1.friend.add(cls.u3)
    
  def setUp(self):
    print("\nRun setUp")
    self.client = Client()
    self.factory = RequestFactory()
    
    
  """TEST index"""
  # Case 1 - Unauthenticated
  def test_index_c1(self):
    print("test_index_c1")
    # Create an instance of a GET request.
    request = self.factory.get("/")
    request.user = AnonymousUser()    
    response = index(request)

    # Assert url
    self.assertEqual(response.url, reverse("login") + "?next=/")
    
  # Case 2 - Authenticated
  def test_index_c2(self):
    print("test_index_c2")
    # Login client
    self.client.login(username=self.harry["username"], password=self.harry["password"])

    # Create a instance of the response
    response = self.client.get("/")
    
    # Assert response
    self.assertEqual(response.status_code, 200)
    self.assertTemplateUsed(response, "core/index.html")
    self.assertContains(response, "Games")
    self.assertContains(response, "Profile")
    self.assertContains(response, "Friends")
    self.assertContains(response, "Logout")
    
  
  """TEST login_view"""
  def test_login_view_c1(self):
    print("test_login_view_c1")
    # Input POST request with username and password
    user = get_user(self.client)
    
    if user.is_authenticated:
      # Logout client
      self.client.logout()
      user = get_user(self.client)
    
    response = self.client.post("/login", {"username": "harry", "password": "1234"})
    
    # Output login and redirect to "/"
    # Assert response
    self.assertEqual(response.status_code, 302)
    self.assertEqual(response.url, reverse("index"))

  def test_login_view_c2(self):
    print("test_login_view_c2")
    # Input POST request with username and password
    user = get_user(self.client)
    
    if user.is_authenticated:
      # Logout client
      self.client.logout()
      user = get_user(self.client)
    
    response = self.client.post("/login", {"username": "harry", "password": "123"})
    
    # Output login fail and re-render "/login"
    # Assert response
    self.assertEqual(response.status_code, 200)
    self.assertTemplateUsed(response, "core/login.html")
    self.assertContains(response, "Invalid username and/or password.")
  
  def test_login_view_c3(self):
    print("test_login_view_c3")
    # Input GET request with AnonymousUser
    user = get_user(self.client)
    
    if user.is_authenticated:
      # Logout client
      self.client.logout()
      user = get_user(self.client)
    
    response = self.client.get("/login")
    
    # Output render "/login"
    # Assert response
    self.assertEqual(response.status_code, 200)
    self.assertTemplateUsed(response, "core/login.html")
    
  def test_login_view_c4(self):
    print("test_login_view_c4")
    # Input GET request with authenticated user
    user = get_user(self.client)
    
    if user.is_anonymous:
      # Login client
      self.client.login(username=self.harry["username"], password=self.harry["password"])
      user = get_user(self.client)
    
    response = self.client.get("/login")
    
    # Output redirect to "/"
    # Assert response
    self.assertEqual(response.status_code, 302)
    self.assertEqual(response.url, reverse("index"))


  """TEST logout_view"""
  def test_logout_view(self):
    print("test_logout_view")
    # Input GET request with authenticated user
    user = get_user(self.client)
    
    if user.is_anonymous:
      # Login client
      self.client.login(username=self.harry["username"], password=self.harry["password"])
      user = get_user(self.client)
    
    response = self.client.get("/logout")
    
    # Output logout and redirect to "/login"
    # Assert response
    user = get_user(self.client)
    self.assertTrue(user.is_anonymous)
    self.assertEqual(response.status_code, 302)
    self.assertEqual(response.url, reverse("index"))
    
  
  """TEST register"""
  def test_register_c1(self):
    print("test_register_c1")
    # Input GET request with AnonymousUser
    user = get_user(self.client)
    
    if user.is_authenticated:
      # Logout client
      self.client.logout()
      user = get_user(self.client)
    
    response = self.client.get("/register")
    
    # Output render "/register"
    # Assert response
    self.assertEqual(response.status_code, 200)
    self.assertTemplateUsed(response, "core/register.html")
    self.assertContains(response, "Already have an account?")
  
  def test_register_c2(self):
    print("test_register_c2")
    # Input POST request with valid form
    user = get_user(self.client)
    
    if user.is_authenticated:
      # Logout client
      self.client.logout()
      user = get_user(self.client)
      
    register_data = {
      "username": "test",
      "email": "test@test.com",
      "password": "1234",
      "confirmation": "1234",
      "first_name": "Testy",
      "last_name": "Tester",
      "date_of_birth": date(1985,3,5)
    }
    
    response = self.client.post("/register", register_data)
    
    # Output redirect to "/"
    # Assert response
    user = get_user(self.client)
    self.assertTrue(user.is_authenticated)
    self.assertEqual(user.username, register_data["username"])
    self.assertEqual(response.status_code, 302)
    self.assertEqual(response.url, reverse("index"))
    
  def test_register_c3(self):
    print("test_register_c3")
    # Input POST request with incorrect confirmation
    user = get_user(self.client)
    
    if user.is_authenticated:
      # Logout client
      self.client.logout()
      user = get_user(self.client)
      
    register_data = {
      "username": "test",
      "email": "test@test.com",
      "password": "1234",
      "confirmation": "abcd",
      "first_name": "Testy",
      "last_name": "Tester",
      "date_of_birth": date(1985,3,5)
    }
    
    response = self.client.post("/register", register_data)
    
    # Output render "/register" with error message
    # Assert response
    self.assertEqual(response.status_code, 200)
    self.assertTemplateUsed(response, "core/register.html")
    self.assertContains(response, "Passwords must match.")
    
  
  """TEST profile_info"""
  def test_profile_info(self):
    print("test_profile_info")
    # Input GET request with profile_id
    user = get_user(self.client)
    
    if user.is_anonymous:
      # Login client
      self.client.login(username=self.harry["username"], password=self.harry["password"])
      user = get_user(self.client)
    
    response = self.client.get(f"/profile/{self.ron['id']}")
    
    # Output serialize_for_profile data
    output = {
      "id": self.ron["id"],
      "username": self.ron["username"],
      "first_name": self.ron["first_name"],
      "last_name": self.ron["last_name"],
      "email": self.ron["email"],
      "date_of_birth": date.isoformat(self.ron["date_of_birth"]),
      "age": self.u2.calculateAge(),
      "last_login": self.u2.last_login,
      "is_self": False,
      "is_friend": False,
      "friend_request_status": "sent",
      "friend_request": self.u1_u2.serialize(),
    }
    
    # Assert response
    self.assertEqual(response.status_code, 200)
    self.assertEqual(response.json(), output)
  
  
  """TEST profile_edit"""
  def test_profile_edit(self):
    print("test_profile_edit")
    # Input PUT request with edit data
    user = get_user(self.client)
    
    if user.is_anonymous:
      # Login client
      self.client.login(username=self.harry["username"], password=self.harry["password"])
      user = get_user(self.client)
    
    put_data = {
      "first_name": "test_fn",
      "last_name": "test_ln",
      "date_of_birth": "1985-03-05",
    }
    
    response = self.client.put(
      "/profile/edit", 
      json.dumps(put_data),
      content_type='application/json'
      )
    
    # Output update u1 data
    # Assert response
    self.assertEqual(response.status_code, 201)
    self.assertEqual(json.loads(response.content), {"message": "Info edited."})

    # Assert database
    self.u1.refresh_from_db()
    self.assertEqual(self.u1.first_name, put_data["first_name"])
    self.assertEqual(self.u1.last_name, put_data["last_name"])
    self.assertEqual(self.u1.date_of_birth, date.fromisoformat(put_data["date_of_birth"]))
  
  
  """TEST toggle_friend"""
  def test_toggle_friend_c1(self):
    print("test_toggle_friend_c1")
    # Input PUT request with unfriend data from harry to hermione
    user = get_user(self.client)
    
    if user.is_anonymous:
      # Login client
      self.client.login(username=self.harry["username"], password=self.harry["password"])
      user = get_user(self.client)
    
    put_data = {
      "friend_id": self.u3.id,
      "action": 'unfriend',
    }
    
    response = self.client.put(
      "/toggle_friend", 
      json.dumps(put_data),
      content_type='application/json'
      )
    
    # Output update u1 data
    # Assert response
    self.assertEqual(response.status_code, 201)
    self.assertEqual(json.loads(response.content), {"message": "Unfriend successful."})
    
    # Assert database
    self.u1.refresh_from_db()
    self.u3.refresh_from_db()
    self.assertFalse(self.u3 in self.u1.friend.all())
    self.assertFalse(self.u1 in self.u3.friend.all())
  
  def test_toggle_friend_c2(self):
    print("test_toggle_friend_c2")
    # Input PUT request with add data from test to harry
    user = User.objects.create_user(username="foo", password="1234")
    self.client.login(username="foo", password="1234")
    
    put_data = {
      "friend_id": self.u1.id,
      "action": 'addfriend',
    }
    
    response = self.client.put(
      "/toggle_friend", 
      json.dumps(put_data),
      content_type='application/json'
      )
    
    # Output update u1 data
    # Assert response
    self.assertEqual(response.status_code, 201)
    self.assertEqual(json.loads(response.content), {"message": "Friend request sent."})
    
    # Assert database
    new_request = FriendRequest.objects.latest("id")
    self.assertEqual(new_request.from_user, user)
    self.assertEqual(new_request.to_user, self.u1)
    
    # Repeat request
    response = self.client.put(
      "/toggle_friend", 
      json.dumps(put_data),
      content_type='application/json'
      )
    
    # Assert response
    self.assertEqual(response.status_code, 400)
    self.assertEqual(json.loads(response.content), {"error": "Request already exist."})
    
    # Bad request
    put_data = {
      "friend_id": self.u1.id,
      "action": 'friend',
    }
    
    response = self.client.put(
      "/toggle_friend", 
      json.dumps(put_data),
      content_type='application/json'
      )
    
    # Assert response
    self.assertEqual(response.status_code, 400)
    self.assertEqual(json.loads(response.content), {"error": "Invalid request."})
  
  
  """TEST received_request"""
  def test_received_request(self):
    print("test_received_request")
    # Input GET request with login user
    user = get_user(self.client)
    
    if user.is_anonymous:
      # Login client
      self.client.login(username=self.ron["username"], password=self.ron["password"])
      user = get_user(self.client)
    
    response = self.client.get(f"/received_request")
    
    # Output serialize_for_profile data
    output = {
      "self_id": self.ron["id"],
      "friend_requests": [self.u1_u2.serialize()]
    }
    
    # Assert response
    self.assertEqual(response.status_code, 200)
    self.assertEqual(response.json(), output)
  
  
  """TEST request_response"""
  def test_request_response_c1(self):
    print("test_request_response_c1")
    # Input PUT request from Hermione to accept Ron's friend request
    user = get_user(self.client)
    
    if user.is_anonymous:
      # Login client
      self.client.login(username=self.hermione["username"], password=self.hermione["password"])
      user = get_user(self.client)
    
    friend_request = FriendRequest.objects.get(to_user=user)
    put_data = {
      "request_id": friend_request.id,
      "action": 'accept',
    }
    
    response = self.client.put(
      "/request_response", 
      json.dumps(put_data),
      content_type='application/json'
      )
    
    # Output updated u2, u3 friend list and r2 removed
    # Assert response
    self.assertEqual(response.status_code, 201)
    self.assertEqual(json.loads(response.content), {"message": "Friend request accepted."})
    
    # Assert database
    self.u2.refresh_from_db()
    self.u3.refresh_from_db()
    self.assertTrue(self.u2 in self.u3.friend.all())
    self.assertTrue(self.u3 in self.u2.friend.all())
    
    with self.assertRaises(ObjectDoesNotExist):
      FriendRequest.objects.get(from_user=self.u2, to_user=self.u3)
      
  def test_request_response_c2(self):
    print("test_request_response_c2")
    # Input PUT request from Hermione to decline Ron's friend request
    user = get_user(self.client)
    
    if user.is_anonymous:
      # Login client
      self.client.login(username=self.hermione["username"], password=self.hermione["password"])
      user = get_user(self.client)
    
    friend_request = FriendRequest.objects.get(to_user=user)
    put_data = {
      "request_id": friend_request.id,
      "action": 'decline',
    }
    
    response = self.client.put(
      "/request_response", 
      json.dumps(put_data),
      content_type='application/json'
      )
    
    # Output unchanged u2, u3 friend list and r2 removed
    # Assert response
    self.assertEqual(response.status_code, 201)
    self.assertEqual(json.loads(response.content), {"message": "Friend request declined."})
    
    # Assert database
    self.u2.refresh_from_db()
    self.u3.refresh_from_db()
    self.assertFalse(self.u2 in self.u3.friend.all())
    self.assertFalse(self.u3 in self.u2.friend.all())
    
    with self.assertRaises(ObjectDoesNotExist):
      FriendRequest.objects.get(from_user=self.u2, to_user=self.u3)
  
  
  """TEST friend_list"""
  def test_friend_list(self):
    print("test_friend_list")
    # Input GET request with login user
    user = get_user(self.client)
    
    if user.is_anonymous:
      # Login client
      self.client.login(username=self.harry["username"], password=self.harry["password"])
      user = get_user(self.client)
    
    response = self.client.get(f"/friend_list")
    
    # Output serialize_for_profile data
    output = [{
      "id": self.u3.id,
      "username": self.u3.username,
      "name": f"{self.u3.first_name} {self.u3.last_name}",
    }]
    
    # Assert response
    self.assertEqual(response.status_code, 200)
    self.assertEqual(response.json(), output)
  
  
  """TEST search"""
  def test_search(self):
    print("test_search")
    # Input GET request with search input
    query = "h"
    
    response = self.client.get(f"/search/{query}")
    
    # Output serialize_for_profile data
    output = [
      self.u1.serialize_for_search(),
      self.u3.serialize_for_search(),
    ]
    
    # Assert response
    self.assertEqual(response.status_code, 200)
    self.assertEqual(response.json(), output)
  