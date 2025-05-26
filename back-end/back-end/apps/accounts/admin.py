from django.contrib import admin
from .models import UserProfile, UserStats, UserPreferences

admin.site.register(UserProfile)
admin.site.register(UserStats)
admin.site.register(UserPreferences)