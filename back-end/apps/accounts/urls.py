from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('', views.auth_view, name="authenticate"),
    path("logout/", views.logout_view, name="logout"),
    path("preferences/", views.preferences_view, name="preferences"),
    path("upload_photo/", views.upload_photo, name="upload_photo"),
    path("profile/", views.profile, name="profile"),
]   + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
