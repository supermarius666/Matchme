from django.shortcuts import render
from .models import ChatRoom, Message
from apps.feed.models import Match
from apps.accounts.models import UserProfile
from django.db.models import Q

def get_matched_users(logged_user):
    completed_matches = Match.objects.filter(
        Q(user_sending=logged_user) | Q(user_receiving=logged_user),
        status="MATCHED"
    ).distinct()
    
    matched_users = []
    for match in completed_matches:
        if match.user_sending == logged_user:
            matched_users.append(match.user_receiving)
        else:
            matched_users.append(match.user_sending)
        
    return matched_users

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

    # lista degli user con cui si ha un match
    matched_users = get_matched_users(request.user)

    chat_user = UserProfile.objects.get(username=username)

    context = {"room": room, "chat_user": chat_user, "messages": messages, "matched_users": matched_users}
    return render(request, "chat/chatroom.html", context)