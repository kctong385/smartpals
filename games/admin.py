from django.contrib import admin
from .models import *

# Register your models here.
class GameAdmin(admin.ModelAdmin):
  list_display = ("id", "title", "category")
  
class RecordAdmin(admin.ModelAdmin):
  list_display = ("id", "player", "game", "end_timestamp")


admin.site.register(Game, GameAdmin)
admin.site.register(Record, RecordAdmin)