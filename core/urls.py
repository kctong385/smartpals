from django.urls import path

from . import views

urlpatterns = [
  path("", views.index, name="index"),
  path("login", views.login_view, name="login"),
  path("logout", views.logout_view, name="logout"),
  path("register", views.register, name="register"),
  
  # API route
  path("profile/<int:profile_id>", views.profile_info, name="profile_info"),
  path("profile/edit", views.profile_edit, name="profile_edit"),
  path("search/<str:query>", views.search, name="search"),
  path("toggle_friend", views.toggle_friend, name="toggle_friend"),
  path("received_request", views.received_request, name="received_request"),
  path("request_response", views.request_response, name="request_response"),
  path("friend_list", views.friend_list, name="friend_list")
]