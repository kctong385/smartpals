from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import ensure_csrf_cookie
from django.core.exceptions import ObjectDoesNotExist
from datetime import timedelta

import json

from .models import Game, Record, LEVEL
from core.models import User

# Create your views here.
@login_required(login_url="core/login")
def games_view(request):
  return render(request, "games/games.html")


def games_data(request):
  games = Game.objects.all()
  return JsonResponse([game.serialize() for game in games], safe=False)


def game_info(request, game_title):
  game = Game.objects.get(title=game_title)    
  return JsonResponse(game.serialize())


@ensure_csrf_cookie
@login_required(login_url="core/login")
def activity_log (request):
  if request.method != "POST":
    return JsonResponse({"error": "POST request required."}, status=400)
    
  data = json.loads(request.body)
  player = request.user
  game = Game.objects.get(pk=data['game_id'])
    
  game_log = Record(
    player=player,
    game=game,
    level=int(data['level']),
    score=int(data['score']),
    attempts=int(data['attempt']),
    game_time=timedelta(seconds=data['game_time']),
  )
  game_log.save()
  return JsonResponse({"message": "Game record logged."}, status=201)
    
    
@login_required(login_url="core/login")
def recent_activities(request, profile_id):
  user = request.user
  try:
    profile_user = User.objects.get(pk=profile_id)
  except ObjectDoesNotExist:
    profile_user = user
    
  game_records = Record.objects.filter(player=profile_user).order_by('-end_timestamp')[:10]
  return JsonResponse([game_record.serialize() for game_record in game_records], safe=False)
  
  
@login_required(login_url="core/login")
def friends_activities(request):
  user = request.user
  friends = user.friend.all()
  
  game_records = Record.objects.filter(player__in=friends).order_by('-end_timestamp')[:10]
  return JsonResponse([game_record.serialize() for game_record in game_records], safe=False)
  
  
@login_required(login_url="core/login")
def games_ranking(request, profile_id):
    user = request.user
    try:
      profile_user = User.objects.get(pk=profile_id)
    except ObjectDoesNotExist:
      profile_user = user
        
    games = Game.objects.all()
    games_ranking = []
    
    for game in games:
      for level in LEVEL:
        game_records = Record.objects.filter(player=profile_user, game=game, level=level[0])
        
        if len(game_records) > 0:
          game_records = game_records.order_by("-score", "attempts", "game_time", "end_timestamp")[:3]
          games_ranking.append(
            [game_record.serialize() for game_record in game_records]
          )
    
    return JsonResponse(games_ranking, safe=False)


@login_required(login_url="core/login")
def friends_ranking(request):
    user = request.user
    friends = user.friend.all()
    
    player_list = []
    player_list.append(user)
    [player_list.append(friend) for friend in friends]
    
    games = Game.objects.all()
    games_ranking = []
    
    for game in games:
      for level in LEVEL:
        # Retrieve all records of current game
        game_records = Record.objects.filter(player__in=player_list, game=game, level=level[0])
        
        # If any player played this game, retrieve the best record of each player
        if game_records.count() > 0:
          # Retrieve the best record of the user if any and add to sub query set
          sub_qs = game_records.filter(player=user).order_by("-score", "attempts", "game_time", "end_timestamp")[:1]
          
          # Obtain the best record of each of user's friends who has played this game and add to sub query set
          if friends.count() > 0:
            for player in friends:
              sub_qs = sub_qs | game_records.filter(player=player).order_by("-score", "attempts", "game_time", "end_timestamp")[:1]    
              
            # Retrieve the best 3 records from the sub query set
            sub_qs = sub_qs.order_by("-score", "attempts", "game_time", "end_timestamp")[:3]
          
          # Append serialized sub query set best record to games_ranking    
          games_ranking.append(
            [game_record.serialize() for game_record in sub_qs]
          )
        
    return JsonResponse(games_ranking, safe=False)