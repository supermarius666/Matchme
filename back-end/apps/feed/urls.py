from django.urls import path
from . import views
from .feed_utils import algorithm

urlpatterns = [
    path('', views.feed_view, name="feed"),
    path('search_chat/', views.search_chat_view, name="search_chat"),
    path('feed_action/', views.feed_actions_view, name="feed_action"),
]
