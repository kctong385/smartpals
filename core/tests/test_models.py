from django.test import TestCase
from datetime import date

from core.models import *

class coreModelsTestCase(TestCase):
  # Define test data
  harry = {
    "id": 1,
    "username": "harry", 
    "email": "harry@test.com",
    "password": "1234",
    "first_name": "Harry", 
    "last_name": "Potter", 
    "date_of_birth": date(1980,7,31)
  }
  ron = {
    "id": 2,
    "username": "ron", 
    "email": "ron@test.com",
    "password": "1234",
    "first_name": "Ron", 
    "last_name": "Weasley", 
    "date_of_birth": date(1980,3,1)
  }
  hermione = {
    "id": 3,
    "username": "hermione", 
    "email": "hermione@test.com",
    "password": "1234",
    "first_name": "Hermione", 
    "last_name": "Granger", 
    "date_of_birth": date(1979,9,10)
  }
    
  def setUp(self):
    # Create users
    u1 = User.objects.create(**self.harry)
    u2 = User.objects.create(**self.ron)
    u3 = User.objects.create(**self.hermione)
    
    # Create a request
    r1 = FriendRequest.objects.create(from_user=u1, to_user=u2)
    r2 = FriendRequest.objects.create(from_user=u2, to_user=u3)
    
    # u1 and u3 are friends
    u1.friend.add(u3)
    
  
  """TEST 01 User 01 is_friend"""
  def test_0103_user_is_friend(self):
    user = User.objects.get(username=self.harry["username"])
    friend = User.objects.get(username=self.hermione["username"])
    other = User.objects.get(username=self.ron["username"])
    
    self.assertTrue(user.is_friend(friend))
    self.assertFalse(user.is_friend(other))
  
  
  """TEST 01 User 02 calculateAge"""  
  def test_0102_user_calculateAge(self):
    today = date.today()
    test = User.objects.create(username="test", password="1234")
    
    # Case 1
    date_of_birth = date(
      today.year - 5,
      today.month,
      today.day
    )
    test.date_of_birth = date_of_birth
    test.save()
    self.assertEqual(test.calculateAge(), 5)
    
    # Case 2
    date_of_birth = date(
      today.year - 5,
      today.month,
      today.day + 1
    )
    test.date_of_birth = date_of_birth
    test.save()
    self.assertEqual(test.calculateAge(), 4)
    
    # Case 3
    date_of_birth = date(
      today.year,
      today.month,
      today.day + 1
    )
    test.date_of_birth = date_of_birth
    test.save()
    self.assertRaises(ValidationError)
  
  """TEST 01 User 03 serialize_for_search"""
  def test_0103_user_serialize_for_search(self):
    user = User.objects.get(username=self.harry["username"])
    
    output = {
      "id": self.harry["id"],
      "username": self.harry["username"],
      "name": f"{self.harry['first_name']} {self.harry['last_name']}",
    }
    
    self.assertEqual(user.serialize_for_search(), output)
  
  """TEST 01 User 04 serialize_for_profile"""
  def test_0104_user_serialize_for_profile(self):
    # Case 1 - Viewing self profile
    viewer = User.objects.get(username=self.ron["username"])
    
    output = {
      "id": self.ron["id"],
      "username": self.ron["username"],
      "first_name": self.ron["first_name"],
      "last_name": self.ron["last_name"],
      "email": self.ron["email"],
      "date_of_birth": self.ron["date_of_birth"],
      "age": viewer.calculateAge(),
      "last_login": viewer.last_login,
      "is_self": True,
      "is_friend": False,
      "friend_request_status": "none",
      "friend_request": None,
    }
    
    self.assertEqual(viewer.serialize_for_profile(viewer), output)
    
    # Case 2 - Viewing friend requester's profile
    target = User.objects.get(username=self.harry["username"])
    request = FriendRequest.objects.get(from_user=target, to_user=viewer)
    
    output = {
      "id": self.harry["id"],
      "username": self.harry["username"],
      "first_name": self.harry["first_name"],
      "last_name": self.harry["last_name"],
      "email": self.harry["email"],
      "date_of_birth": self.harry["date_of_birth"],
      "age": target.calculateAge(),
      "last_login": target.last_login,
      "is_self": False,
      "is_friend": False,
      "friend_request_status": "received",
      "friend_request": request.serialize(),
    }
    
    self.assertEqual(target.serialize_for_profile(viewer), output)
    
    # Case 3 - Viewing friend request receiver's profile
    target = User.objects.get(username=self.hermione["username"])
    request = FriendRequest.objects.get(from_user=viewer, to_user=target)
    
    output = {
      "id": self.hermione["id"],
      "username": self.hermione["username"],
      "first_name": self.hermione["first_name"],
      "last_name": self.hermione["last_name"],
      "email": self.hermione["email"],
      "date_of_birth": self.hermione["date_of_birth"],
      "age": target.calculateAge(),
      "last_login": target.last_login,
      "is_self": False,
      "is_friend": False,
      "friend_request_status": "sent",
      "friend_request": request.serialize(),
    }
    
    self.assertEqual(target.serialize_for_profile(viewer), output)
    
    # Case 4 - Viewing friend's profile
    viewer = User.objects.get(username=self.harry["username"])
    target = User.objects.get(username=self.hermione["username"])
    
    output = {
      "id": self.hermione["id"],
      "username": self.hermione["username"],
      "first_name": self.hermione["first_name"],
      "last_name": self.hermione["last_name"],
      "email": self.hermione["email"],
      "date_of_birth": self.hermione["date_of_birth"],
      "age": target.calculateAge(),
      "last_login": target.last_login,
      "is_self": False,
      "is_friend": True,
      "friend_request_status": "none",
      "friend_request": None,
    }
    
    self.assertEqual(target.serialize_for_profile(viewer), output)
  
  
  """TEST 02 FriendRequest 01 serialize"""
  def test_0201_FriendRequest_serialize(self):
    requester = User.objects.get(username=self.harry["username"])
    receiver = User.objects.get(username=self.ron["username"])
    
    # Find the request
    request = FriendRequest.objects.create(from_user=requester, to_user=receiver)
    
    output = {
      "id": request.id,
      "from_user_id": self.harry["id"],
      "from_user_name": f'{self.harry["first_name"]} {self.harry["last_name"]}',
      "to_user_id": self.ron["id"],
      "to_user_name": f'{self.ron["first_name"]} {self.ron["last_name"]}',
      "message": "",
    }
    
    self.assertEqual(request.serialize(), output)
    
    
    