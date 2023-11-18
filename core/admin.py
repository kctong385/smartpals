from django.contrib import admin
from .models import *

# Register your models here.
class UserAdmin(admin.ModelAdmin):
  list_display = ("id", "username", "date_of_birth")
  filter_horizontal = ("friend",)
  
  
class FriendRequestAdmin(admin.ModelAdmin):
  list_display = ("id", "from_user", "to_user")
  
  
admin.site.register(User, UserAdmin)
admin.site.register(FriendRequest, FriendRequestAdmin)