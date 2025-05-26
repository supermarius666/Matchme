from django.urls import path
from . import views

urlpatterns = [
    path('<str:username>', views.chatroom_view, name="chatroom"),
]
