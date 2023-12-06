from django.urls import path

from . import views

urlpatterns = [
  path("", views.games_view, name="games"),
  path("games_data", views.games_data, name="games_data"),
  path("info/<str:game_title>", views.game_info, name="game_info"),
  path("activity_log", views.activity_log, name="activity_log"),
  path("recent_activities/<int:profile_id>", views.recent_activities, name="recent_activities"),
  path("friends_activities", views.friends_activities, name="friends_activities"),
  path("games_ranking/<int:profile_id>", views.games_ranking, name="games_ranking"),
  path("friends_ranking", views.friends_ranking, name="friends_ranking"),
]
