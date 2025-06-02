from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Match
from apps.chat.models import ChatRoom
from apps.accounts.models import UserProfile

import json
from django.views.decorators.csrf import csrf_exempt

from django.http import JsonResponse

# funzioni utils per algoritmo e per calcolo dei tipi di user
from .feed_utils.algorithm import *
from .feed_utils.users import *

MAX_USERS = 10

def generate_feed(request):
    logged_user = request.user

    # lista di tutti gli user
    all_users = UserProfile.objects.all()

    # lista dei primi MAX_USERS user selezionati dall'algoritmo in base alle pref. del logged_user
    selected_users = get_users_algorithm(logged_user, all_users, MAX_USERS)

    # lista degli user che hanno mandato richiesta di match al logged_user 
    pending_users_arrived = get_pending_users_arrived(logged_user)

    # lista degli user a cui logged_user ha mandato richiesta di match 
    pending_users_sent = get_pending_users_sent(logged_user)

    # lista degli user con cui si ha un match
    matched_users = get_matched_users(logged_user)

    #print_actions_in_server_log(selected_users, logged_user, pending_users_arrived, pending_users_sent, matched_users)

    return JsonResponse(
        {
            "logged_user": logged_user.username,
            "selected_users": selected_users,
            "pending_users_arrived": pending_users_arrived,
            "pending_users_sent": pending_users_sent,
            "matched_users": matched_users
        })

def update_matches_to_db(request, data):
    logged_user = request.user

    liked_user_username = data.get("likedUser")

    # lista degli user che hanno mandato richiesta di match al logged_user 
    pending_users_arrived = get_pending_users_arrived(logged_user)

    # lista degli user a cui logged_user ha mandato richiesta di match 
    pending_users_sent = get_pending_users_sent(logged_user)

    # lista degli user con cui si ha un match
    matched_users = get_matched_users(logged_user)

    if liked_user_username:
        liked_user = UserProfile.objects.get(username=liked_user_username)
        liked_user_info = get_user_info(liked_user)
        print(f"{logged_user} LIKED {liked_user}")

        # se il liked_user ti aveva già messo like si completa il match
        if liked_user_info in pending_users_arrived:
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
        # altrimenti si crea una nuova entry tipo Match con status "PENDING" (sempre se non è già stata creata)
        elif liked_user not in pending_users_sent and liked_user not in matched_users:
            match = Match.objects.create(
                    user_sending=logged_user,
                    user_receiving=liked_user,
                    status="PENDING"
                )

@csrf_exempt
def feed_actions_view(request):
    logged_user = request.user

    if request.method == "POST": # sta venendo messo like
        data = json.loads(request.body)
        type = data.get("type")

        if type == "feed":
            genderSelected = data.get("genderSelected", [])
            ageMin = data.get("ageMin")
            ageMax = data.get("ageMax")
            distanceMax = data.get("distanceMax")

            print(f"Gender Selected: {genderSelected} \nAge Range: [{ageMin}-{ageMax}] \n Max Distance: {distanceMax}")

            feed_response = generate_feed(request)
            #print(f"feed responsee::: {feed_response}")
        elif type == "like":
            update_matches_to_db(request, data)
            feed_response = generate_feed(request)
        return feed_response

    return None

@login_required
def feed_view(request):
    context = {}
    return render(request, "feed/feed.html", context)

def search_chat_view(request):
    # prende la query (query parameter) dalla richiesta tipo GET fatta dal Javascript
    # modo per prendere parametri da una richiesta a un url tipo GET compresa la stringa vuota
    query = request.GET.get('q', '').strip()

    # contenuto dell'input diventa il pattern per una regex
    users = get_searched_users(logged_user=request.user, regex=query)

    # ritorna oggetto json senza ricaricare la pagina html
    # --> i cambiamenti vengono fatti lato client dal javascript che riceve questo oggetto json
    return JsonResponse({"searched_users": users})