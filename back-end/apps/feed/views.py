from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Match
from apps.chat.models import ChatRoom, Message
from apps.accounts.models import UserProfile, UserPreferences
from django.db.models import Q

from django.http import JsonResponse
import re
from datetime import datetime, timedelta

from django.utils import timezone

MAX_USERS = 10

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

def get_pref_values(prefs):
    user_prefs = dict()

    for field in prefs._meta.fields:
        field_name = field.name
        if field_name != "id" and field_name != "user":
            field_value = getattr(prefs, field_name) # Get field value
            #print(field_name, field_value)
            user_prefs[field_name] = field_value
    
    return user_prefs

def order_users(evaluated_users):
    pass

def get_users_algorithm(logged_user, all_users, max_users):
    #print("SONO DENTRO")
    user_prefs_obj = UserPreferences.objects.get(user=logged_user) # one istance of UserPreferences
    #print(f"QUERY {user_prefs_obj}")
    #bin_user_prefs = to_binary(user_prefs_obj)
    user_prefs = get_pref_values(user_prefs_obj)
    #print(f"DICT {user_prefs}")
    evaluated_users = dict()
    
    #max_score = len(user_prefs._meta.fields) - 2

    for user in all_users:
        score = 0

        other_user_prefs_obj = UserPreferences.objects.get(user=user) # one istance of UserPreferences
        #print(f"OTHER QUERY {other_user_prefs_obj}")
        #bin_other_user_prefs = to_binary(other_user_prefs_obj)
        other_user_prefs = get_pref_values(other_user_prefs_obj)
        #print(f"OTHER DICT {other_user_prefs}")

        # TODO : metti anche distanza (data dalla geolocalizzazione) come contributo per lo score

        # TODO : mettere field a tendina "gender" piuttosto che tanti field con i vari generi per poi fare questo
        # se il sesso non è lo stesso non importa il resto delle preferenze: si mette a 0 lo score dell'altro user
        #if user_prefs["gender"] != other_user_prefs["gender"]:
        #    evaluated_users[user] = 0
        #    continue

        for key in user_prefs:
            if user_prefs[key] and other_user_prefs[key]:
                score += 1
            elif user_prefs[key] == other_user_prefs[key]: # hanno in comune il fatto di non piacere quelle cose [BO FORSE DA LEVARE]
                score += 0.1
        
        evaluated_users[user] = score
    
    #ordered_users = order_users(evaluated_users)
    ordered_users = sorted(evaluated_users.items(), key=lambda item: item[1], reverse=True)
    #print(f"ORDERED USERS {ordered_users}")

    # prende solo lo user dei primi max_users elementi in ordered_users (che è una lista di tuple (<UserProfile>, <score>))
    best_users_list = []
    counter = 0
    for elem in ordered_users:
        user = elem[0]
        score = elem[1]

        if score > 0:
            best_users_list.append(user)

        counter += 1
        if counter > max_users:
            break

    #print(f"BEST USERS {best_users_list}")
    return best_users_list

@login_required
def feed_view(request):
    logged_user = request.user
    
    # lista di tutti gli user
    all_users = UserProfile.objects.all()

    # lista dei primi MAX_USERS user selezionati dall'algoritmo in base alle pref. del logged_user
    selected_users = get_users_algorithm(logged_user, all_users, MAX_USERS)

    # lista degli user che hanno mandato richiesta di match al logged_user 
    pending_users_arrived = get_pending_users_arrived(logged_user)

    #lista degli user a cui logged_user ha mandato richiesta di match 
    pending_users_sent = get_pending_users_sent(logged_user)

    # lista degli user con cui si ha un match
    matched_users = get_matched_users(logged_user)

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
            # altrimenti si crea una nuova entry tipo Match con status "PENDING" (sempre se non è già stata creata)
            elif liked_user not in pending_users_sent and liked_user not in matched_users:
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

    # aggiorna lista degli user a cui logged_user ha mandato richiesta di match 
    pending_users_sent = get_pending_users_sent(logged_user)

    # aggiorna lista degli user con cui si ha un match
    matched_users = get_matched_users(logged_user)

    print_actions_in_server_log(selected_users, logged_user, pending_users_arrived, pending_users_sent, matched_users)

    # passo al file HTML la lista dei pending_users e dei matched_users
    context = {
        "users": selected_users,
        "matched_users": matched_users,
        "pending_users_arrived": pending_users_arrived,
        "pending_users_sent": pending_users_sent
    }
    return render(request, "feed/feed.html", context) # NON MI PIACE CHE RICARICA SEMPRE LA PAGINA ANCHE QUANDO SI METTE SOLO LIKE A UNO
                                                        # --> mi sa che tocca farla in Javascript cosi non si deve ricaricare la pagina

def get_last_message_timestamp(logged_user, user):
    room = ChatRoom.objects.get(
        Q(user1=UserProfile.objects.get(username=logged_user.username),
          user2=UserProfile.objects.get(username=user.username)) | 
        Q(user1=UserProfile.objects.get(username=user.username), 
          user2=UserProfile.objects.get(username=logged_user.username))
    )

    messages = Message.objects.filter(room=room).order_by("-time_stamp")[::-1]
    if messages:
        last_message = messages[-1]
        last_message_time_tokens = str(last_message.time_stamp).split(" ")

        now = timezone.now()
        if last_message.time_stamp + timedelta(days=1) >= now:
            last_message_time = last_message_time_tokens[-1] # hour:minute
            last_message_timestamp = str(int(last_message_time.split(":")[0]) + 2) + ":" + last_message_time.split(":")[1]
        else:
            last_message_time = last_message_time_tokens[0] # year-month-day
            last_message_timestamp = str(last_message_time)
        
    else:
        last_message_timestamp = ""

    return last_message_timestamp

def get_searched_users(logged_user, regex):
    matched_users = get_matched_users(logged_user)
    if regex == "":
        pattern = fr".*"
    else:
        pattern = fr"^{regex}"

    search_output = []

    for user in matched_users:
        if re.match(pattern, user.username):
            last_message_timestamp = get_last_message_timestamp(logged_user, user)
            search_output.append([user.username, user.profile_picture.url, last_message_timestamp])
    return search_output

def search_chat_view(request):
    # prende la query (query parameter) dalla richiesta tipo GET fatta dal Javascript
    # modo per prendere parametri da una richiesta a un url tipo GET compresa la stringa vuota
    query = request.GET.get('q', '').strip()

    # contenuto dell'input diventa il pattern per una regex
    users = get_searched_users(logged_user=request.user, regex=query)

    # ritorna oggetto json senza ricaricare la pagina html
    # --> i cambiamenti vengono fatti lato client dal javascript che riceve questo oggetto json
    return JsonResponse({"searched_users": users})