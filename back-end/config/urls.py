from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# per 404.html
from django.conf.urls import handler404
from apps.main.views import custom_404_view

urlpatterns = [
    path('admin/', admin.site.urls),
	path("", include("apps.main.urls")),
	path("accounts/", include("apps.accounts.urls")),
    path("feed/", include("apps.feed.urls")),
    path("chat/", include("apps.chat.urls")),
    path("events/", include("apps.events.urls")),
]  + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) serve per poter salvare le foto profilo nel db, aggiunge anche i media come static 

handler404 = custom_404_view