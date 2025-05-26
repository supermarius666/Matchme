from django.urls import path
from . import views

urlpatterns = [
    path('', views.auth_view, name="authenticate"),
    path("logout/", views.logout_view, name="logout"),
]
