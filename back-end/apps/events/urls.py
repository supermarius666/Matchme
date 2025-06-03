from django.urls import path
from . import views

urlpatterns = [
    path('', views.events_main_view, name="events"),
    path('<str:placeName>', views.place_event_view, name="place_event"),
]
