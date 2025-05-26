from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Match
from apps.chat.models import ChatRoom
from apps.accounts.models import UserProfile
from django.db.models import Q

def get_pending_users_arrived(logged_user):
    # select tutti i match in arrivo al logged_user
    pending_matches = Match.objects.filter(
        user_receiving=logged_user,
        status="PENDING"
    ).distinct()

    # lista degli user che hanno mandato richiesta di match al logged_user
    pending_users = []
    for match in pending_matches:
        pending_users.append(match.user_sending)
    
    return pending_users

def get_pending_users_sent(logged_user):
    # select tutti i match mandati dal logged_user
    pending_matches = Match.objects.filter(
        user_sending=logged_user,
        status="PENDING"
    ).distinct()

    # lista degli user che hanno mandato richiesta di match al logged_user
    pending_users = []
    for match in pending_matches:
        pending_users.append(match.user_receiving)
    
    return pending_users

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

def print_actions_in_server_log(users, logged_user, pending_users_arrived, pending_users_sent, matched_users):
    print(f"\n" \
            f"FOR USER {logged_user}:\n" \
            f"- Users: {users}\n" \
            f"- Pending_users_arrived: {pending_users_arrived}\n" \
            f"- Pending_users_sent: {pending_users_sent}\n" \
            f"- Matched users: {matched_users}\n")

@login_required
def feed_view(request):
    logged_user = request.user
    
    # lista di tutti gli user
    users = UserProfile.objects.all()

    # lista degli user che hanno mandato richiesta di match al logged_user 
    pending_users_arrived = get_pending_users_arrived(logged_user)

    if request.method == "POST": # sta venendo messo like
        liked_user_username = request.POST.get("liked_username")
        disliked_user_username =  request.POST.get("disliked_username")
        print(liked_user_username, disliked_user_username)

        if liked_user_username:
            liked_user = UserProfile.objects.get(username=liked_user_username)
            print(liked_user)

            # se il liked_user ti aveva già messo like si completa il match
            if liked_user in pending_users_arrived:
                match = Match.objects.get(
                    user_sending=liked_user,
                    user_receiving=logged_user,
                    status="PENDING"
                )
                
                room = ChatRoom.objects.create(
                    name=f"{liked_user.username}-{logged_user.username}-ROOM",
                    user1=liked_user,
                    user2=logged_user
                )

                match.status = "MATCHED"
                match.room = room

                match.save()
            # altrimenti si crea una nuova entry tipo Match con status "PENDING"
            else:
                match = Match.objects.create(
                        user_sending=logged_user,
                        user_receiving=liked_user,
                        status="PENDING"
                    )
        elif disliked_user_username:
            disliked_user = UserProfile.objects.get(username=disliked_user_username)
            print(disliked_user)
    
    # aggiorna lista per evitare duplicati 
    pending_users_arrived = get_pending_users_arrived(logged_user)

    # lista degli user a cui logged_user ha mandato richiesta di match 
    pending_users_sent = get_pending_users_sent(logged_user)

    # lista degli user con cui si ha un match
    matched_users = get_matched_users(logged_user)

    print_actions_in_server_log(users, logged_user, pending_users_arrived, pending_users_sent, matched_users)

    # passo al file HTML la lista dei pending_users e dei matched_users
    context = {
        "users": users,
        "matched_users": matched_users,
        "pending_users_arrived": pending_users_arrived,
        "pending_users_sent": pending_users_sent
    }
    return render(request, "feed/feed.html", context) # NON MI PIACE CHE RICARICA SEMPRE LA PAGINA ANCHE QUANDO SI METTE SOLO LIKE A UNO
                                                        # --> mi sa che tocca farla in Javascript cosi non si deve ricaricare la pagina
