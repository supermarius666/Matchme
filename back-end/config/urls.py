from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
	path("", include("apps.main.urls")),
	path("accounts/", include("apps.accounts.urls")),
    path("feed/", include("apps.feed.urls")),
    path("chat/", include("apps.chat.urls")),
]  + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) serve per poter salvare le foto profilo nel db, aggiunge anche i media come static 