from django.shortcuts import render

# Create your views here.
def games_view(request):
    # load all posts
    return render(request, "games/games.html")