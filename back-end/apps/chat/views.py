from django.shortcuts import render
from .models import ChatRoom, Message
from apps.accounts.models import UserProfile
from django.db.models import Q

def chatroom_view(request, username):
    room = ChatRoom.objects.get(
        Q(user1=UserProfile.objects.get(username=username),
          user2=UserProfile.objects.get(username=request.user.username)) | 
        Q(user1=UserProfile.objects.get(username=request.user.username), 
          user2=UserProfile.objects.get(username=username))
    )

    # prende ultimi 10 messaggi ("-time_stamp") e poi inverte la lista per stamparli in ordine cronologico
    messages = Message.objects.filter(room=room).order_by("-time_stamp")[0:10]
    messages = list(messages)[::-1]

    context = {"room": room, "chat_user": username, "messages": messages}
    return render(request, "chat/chatroom.html", context)