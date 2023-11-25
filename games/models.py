from django.db import models
from core.models import User

# Create your models here.
class Game(models.Model):
  title = models.CharField(max_length=60)
  instruction = models.CharField(max_length=5000)
  category = models.CharField(max_length=60)
  

class Record(models.Model):
  player = models.ForeignKey(User, on_delete=models.CASCADE, related_name="records")
  game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name="records")
  level = models.PositiveSmallIntegerField(default=1)
  score = models.PositiveSmallIntegerField(default=0)
  attempts = models.PositiveSmallIntegerField(default=0)
  start_timestamp = models.DateTimeField(auto_now_add=True)
  end_timestamp = models.DateTimeField()