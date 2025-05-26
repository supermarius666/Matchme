from django.shortcuts import render
from .models import ChatRoom
from apps.accounts.models import UserProfile
from django.db.models import Q

def chatroom_view(request, username):
    room = ChatRoom.objects.get(
        Q(user1=UserProfile.objects.get(username=username),
          user2=UserProfile.objects.get(username=request.user.username)) | 
        Q(user1=UserProfile.objects.get(username=request.user.username), 
          user2=UserProfile.objects.get(username=username))
    )

    # TODO aggiungi anche messaggi (per entrare nella room è visualizzare i messaggi scritti prima che entrassi) (i messaggi sono entry di una tabella nel DB)
    # TODO messages = Message.objects.filter(room=room)[0:25]

    context = {"room": room}
    return render(request, "chat/chatroom.html", context)