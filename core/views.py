from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from datetime import date
import json

from .models import User, FriendRequest

# Create your views here.
@login_required(login_url="/login")
def index(request):
  return render(request, "core/index.html")

  
def login_view(request):
  if request.method == "POST":

    # Attempt to sign user in
    username = request.POST["username"]
    password = request.POST["password"]
    user = authenticate(request, username=username, password=password)

    # Check if authentication successful
    if user is not None:
      login(request, user)
      return HttpResponseRedirect(reverse("index"))
    else:
      return render(request, "core/login.html", {
        "message": "Invalid username and/or password."
      })
  else:
    if request.user.is_authenticated:
      return HttpResponseRedirect(reverse("index"))
    else:
      return render(request, "core/login.html")


def logout_view(request):
  logout(request)
  return HttpResponseRedirect(reverse("index"))


def register(request):
  if request.method == "POST":
    username = request.POST["username"]
    email = request.POST["email"]
    date_of_birth = request.POST["date_of_birth"]
    first_name = request.POST["first_name"]
    last_name = request.POST["last_name"]

    # Ensure password matches confirmation
    password = request.POST["password"]
    confirmation = request.POST["confirmation"]
    if password != confirmation:
      return render(request, "core/register.html", {
          "message": "Passwords must match."
      })

    # Attempt to create new user
    try:
      user = User.objects.create_user(username, email, password)
      
      if date_of_birth is not None:
        date_of_birth = date.fromisoformat(date_of_birth)
        try:
          User.validate_date_of_birth(date_of_birth)
        except ValidationError:
          # Render error message if date_of_birth is invalid
          return render(request, "core/register.html", {
          "message": "Invalid date of birth."
      })
        else:
          user.date_of_birth = date_of_birth
        
      if first_name is not None:
        user.first_name = first_name
      
      if last_name is not None:
        user.last_name = last_name
        
      user.save()
    except IntegrityError:
      return render(request, "core/register.html", {
          "message": "Username already taken."
      })
    login(request, user)
    return HttpResponseRedirect(reverse("index"))
  else:
    return render(request, "core/register.html")


@login_required(login_url="/login")
def profile_info(request, profile_id):
  user = request.user
  try:
    profile_user = User.objects.get(pk=profile_id)
  except ObjectDoesNotExist:
    profile_user = user
  
  return JsonResponse(profile_user.serialize_for_profile(user), safe=True)


@login_required(login_url="/login")
def profile_edit(requst):
  if requst.method != "PUT":
    return JsonResponse({"error": "PUT request required."}, status=400)
  
  data = json.loads(requst.body)
  profile_user = requst.user
  is_changed = False
  
  first_name_input = data["first_name"]
  if first_name_input is not None:
    if profile_user.first_name != first_name_input:
      profile_user.first_name = first_name_input
      is_changed = True
    
  last_name_input = data["last_name"]
  if last_name_input is not None:
    if profile_user.last_name != last_name_input:
      profile_user.last_name = last_name_input
      is_changed = True
    
  date_of_birth_input = data["date_of_birth"]
  
  if date_of_birth_input is not None:
    date_of_birth_input = date.fromisoformat(date_of_birth_input)
    if profile_user.date_of_birth != date_of_birth_input:
      try:
        User.validate_date_of_birth(date_of_birth_input)
      except ValidationError:
        # Render error message if date_of_birth is invalid
        return JsonResponse({"error": "Invalid date of birth."}, status=400)
      else:
        profile_user.date_of_birth = date_of_birth_input
        is_changed = True
    
  if is_changed == True:
    profile_user.save()
    return JsonResponse({"message": "Info edited."}, status=201)
  else:
    return JsonResponse({"message": "Change not found."}, status=201)


@login_required(login_url="/login")
def toggle_friend(request):
  if request.method != "PUT":
    return JsonResponse({"error": "PUT request required."}, status=400)
  
  data = json.loads(request.body)
  user = request.user
  
  try:
    target_user = User.objects.get(pk=data["friend_id"])
  except ObjectDoesNotExist:
    return JsonResponse({"error": "Target user not found."}, status=400)
  else:
    if data["action"] == "addfriend":
      # Create friend request if target is not existing friend
      if target_user not in user.friend.all():
        try: 
          FriendRequest.objects.get(from_user=user, to_user=target_user)
        except ObjectDoesNotExist:
          request = FriendRequest(from_user=user, to_user=target_user)
          request.save()
          return JsonResponse({"message": "Friend request sent."}, status=201)
        else:
          return JsonResponse({"error": "Request already exist."}, status=400)
      else:
        return JsonResponse({"message": "Existing friend."}, status=201)
    
    if data["action"] == "unfriend":
      # Unfriend target if it is existing friend
      if target_user in user.friend.all():
        user.friend.remove(target_user)
        return JsonResponse({"message": "Unfriend successful."}, status=201)
      else:
        return JsonResponse({"error": "Friend not found."}, status=201)
    
    return JsonResponse({"error": "Invalid request."}, status=400)


@login_required(login_url="/login")
def received_request(request):
  friend_requests = FriendRequest.objects.filter(to_user=request.user)
  
  serialized_data = {
    "self_id": request.user.id,
    "friend_requests": [friend_req.serialize() for friend_req in friend_requests],
  }
  
  return JsonResponse(serialized_data, safe=False)


@login_required(login_url="/login")
def request_response(request):
  if request.method != "PUT":
    return JsonResponse({"error": "PUT request required."}, status=405)
  
  user = request.user
  data = json.loads(request.body)
  request_id = data["request_id"]
  action = data["action"]
  
  try:
    friendrequest = FriendRequest.objects.get(pk=request_id)
    receiver = friendrequest.to_user
    requester = friendrequest.from_user
  except ObjectDoesNotExist:
    return JsonResponse({"error": "Request does not exist."}, status=400)
  else:
    # Check request receiver is request.user. Return error if not.
    if receiver != user:
      return JsonResponse({"error": "Invalid request."}, status=400)
    
    if action == "accept":
      if requester != user:
        user.friend.add(requester)
        if user in requester.friend.all():
          friendrequest.delete()
          return JsonResponse({"message": "Friend request accepted."}, status=201)
        else:
          return JsonResponse({"error": "Unsuccessful response."}, status=406)
      else:
        return JsonResponse({"error": "Invalid request."}, status=400)
      
    if action == "decline":
      friendrequest.delete()
      try:
        friendrequest = FriendRequest.objects.get(pk=request_id)
      except ObjectDoesNotExist:
        return JsonResponse({"message": "Friend request declined."}, status=201)
      else:
        return JsonResponse({"error": "Unsuccessful response."}, status=406)
  
    return JsonResponse({"error": "Invalid request."}, status=400)


@login_required(login_url="/login")
def friend_list(request):
  user = request.user
  friend_list = user.friend.all()
  
  return JsonResponse([friend.serialize_for_search() for friend in friend_list], safe=False)


def search(request, query):
  filtered_users = User.objects.filter(username__contains=query)
  filtered_users = filtered_users.exclude(username="kctong")
  
  return JsonResponse([user.serialize_for_search() for user in filtered_users], safe=False)


