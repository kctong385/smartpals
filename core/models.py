from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
  friend = models.ManyToManyField('self', blank=True, symmetrical=True)
  
  def is_friend(self, user):
      return user in self.friend.all()
    

class FriendRequest(models.Model):
  from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_request")
  to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_request")
  message = models.CharField(max_length=5000)
  is_accepted = models.BooleanField(default=False)
  
  @classmethod
  def request_existence(cls, requester, target):
    return requester in target.received_request.all()