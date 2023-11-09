from django.db import models
from core.models import User

# Create your models here.
class Game(models.Model):
  title = models.CharField(max_length=60)
  instruction = models.CharField(max_length=5000)
  category = models.CharField(max_length=60)
  

class GameLevel(models.Model):
  levels = [(1, "One"), (2, "Two"), (3, "Three")]
  
  game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name="levels")
  level = models.PositiveSmallIntegerField(default=1, choices=levels)
    

class Record(models.Model):
  game_level = models.ForeignKey(GameLevel, on_delete=models.CASCADE, related_name="records")
  player = models.ForeignKey(User, on_delete=models.CASCADE, related_name="records")
  score = models.PositiveSmallIntegerField(default=0)
  start_timestamp = models.DateTimeField(auto_now_add=True)
  end_timestamp = models.DateTimeField()