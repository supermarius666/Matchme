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
	path('profile/<str:username>/', views.profile_view, name='profile'),
	path('update_profile/', views.update_profile_view, name='update_profile'),
]  
