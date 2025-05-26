from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
	path("", include("apps.main.urls")),
	path("accounts/", include("apps.accounts.urls")),
    path("feed/", include("apps.feed.urls")),
    path("chat/", include("apps.chat.urls")),
]
