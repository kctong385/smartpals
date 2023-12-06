from django.db import models
from core.models import User
from datetime import timedelta

# Create your models here.
CATEGORY = (
  ("maths", "Maths"),
  ("english", "English"),
  ("game", "Game"),
)

LEVEL = (
  (1, "1"),
  (2, "2"),
  (3, "3"),
)


class Game(models.Model):
  title = models.CharField(max_length=60, null=False)
  instruction = models.CharField(max_length=5000)
  category = models.CharField(max_length=60, choices=CATEGORY)
  
  def __str__(self):
    return self.title
  
  def serialize(self):
    return {
      'id': self.id,
      'title': self.title,
      'instruction': self.instruction,
      'category': self.category,
    }
  

class Record(models.Model):
  player = models.ForeignKey(User, on_delete=models.CASCADE, related_name="records")
  game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name="records")
  level = models.PositiveSmallIntegerField(default=1, null=False, choices=LEVEL)
  score = models.PositiveSmallIntegerField(default=0, null=False)
  attempts = models.PositiveSmallIntegerField(default=0, null=False)
  game_time = models.DurationField(default=timedelta(), null=False)
  end_timestamp = models.DateTimeField(auto_now_add=True)
  
  def serialize(self):
    return {
      'id': self.id,
      'player': f"{ self.player.first_name } { self.player.last_name }",
      'game': self.game.title,
      'level': self.level,
      'score': self.score,
      'attempts': self.attempts,
      'game_time': str(self.game_time),
      'end_timestamp': self.end_timestamp.strftime("%d %b %y %I:%M %p"),
    }