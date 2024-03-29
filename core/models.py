from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import date
from django.core.exceptions import ObjectDoesNotExist, ValidationError


# Create your models here.
class User(AbstractUser):
  date_of_birth = models.DateField(null=True, blank=True)
  friend = models.ManyToManyField('self', blank=True, symmetrical=True)
  
  def is_friend(self, user):
      return user in self.friend.all()
    
  def calculateAge(self):
    birthDate = self.date_of_birth
    today = date.today()
    age = today.year - birthDate.year - ((today.month, today.day) < (birthDate.month, birthDate.day)) 
    return age
  
  
  def serialize_for_search(self):
    return {
      "id": self.id,
      "username": self.username,
      "name": f"{self.first_name} {self.last_name}",
    }
      
  def serialize_for_profile(self, user):
    # NOTE: self = profile owner
    # NOTE: user = viewer
    friend_request_status = "none"
    friend_request = None
    
    try: 
      friendRequest = FriendRequest.objects.get(from_user=self, to_user=user)
    except ObjectDoesNotExist:
      pass
    else:
      friend_request_status = "received"
      friend_request = friendRequest.serialize()
    
    try: 
      friendRequest = FriendRequest.objects.get(from_user=user, to_user=self)
    except ObjectDoesNotExist:
      pass
    else:
      friend_request_status = "sent"
      friend_request = friendRequest.serialize()
      
    return {
      "id": self.id,
      "username": self.username,
      "first_name": self.first_name,
      "last_name": self.last_name,
      "email": self.email,
      "date_of_birth": self.date_of_birth,
      "age": self.calculateAge(),
      "last_login": self.last_login,
      "is_self": user == self,
      "is_friend": user in self.friend.all(),
      "friend_request_status": friend_request_status,
      "friend_request": friend_request,
    }
        
  """VALIDATOR"""
  @classmethod
  def validate_date_of_birth(cls, dateInput):
    if dateInput > date.today():
      raise ValidationError(
        "DOB must not be in future."
      )

class FriendRequest(models.Model):
  from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_request")
  to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_request")
  message = models.CharField(max_length=5000, blank=True)
  
  def serialize(self):
    return {
      "id": self.id,
      "from_user_id": self.from_user.id,
      "from_user_name": f"{self.from_user.first_name} {self.from_user.last_name}",
      "to_user_id": self.to_user.id,
      "to_user_name": f"{self.to_user.first_name} {self.to_user.last_name}",
      "message": self.message,
    }
    
