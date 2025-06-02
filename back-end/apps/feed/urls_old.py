from django.urls import path
from . import views

urlpatterns = [
    path('', views.feed_view, name="feed"),
    path('search_chat/', views.search_chat_view, name="search_chat"),
]
