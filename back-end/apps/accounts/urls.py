from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

app_name = 'accounts'  #namespace per poter usare questi urls su altre app

urlpatterns = [
    path('', views.auth_view, name="authenticate"),
    path("logout/", views.logout_view, name="logout"),
    path("preferences/", views.preferences_view, name="preferences"),
    path("upload_photo_reg/", views.upload_photo_reg, name="upload_photo_reg"),
    path("upload_photo/", views.upload_photo, name="upload_photo"),
    path("profile/", views.profile, name="profile"),
	path('profile/<str:username>/', views.profile_view, name='profile'),
	path('update_bio/', views.update_bio, name='update_bio'),
]  
