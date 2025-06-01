from django.urls import path
from . import views

urlpatterns = [
    path('', views.events_view, name="events"),
    path('<str:placeName>', views.place_view, name="place"),
]
