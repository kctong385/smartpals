from django.urls import path

from . import views

urlpatterns = [
  path("", views.games_view, name="games"),
  path("instruction/<str:game_title>", views.get_instruction, name="instruction"),
  path("activity_log", views.activity_log, name="activity_log"),
  path("recent_activities/<int:profile_id>", views.recent_activities, name="recent_activities"),
  path("friends_activities", views.friends_activities, name="friends_activities"),
  path("games_ranking/<int:profile_id>", views.games_ranking, name="games_ranking"),
  path("friends_ranking", views.friends_ranking, name="friends_ranking"),
]
