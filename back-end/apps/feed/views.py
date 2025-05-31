from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Match
from apps.chat.models import ChatRoom
from apps.accounts.models import UserProfile, UserPreferences
from django.db.models import Q

MAX_USERS = 10

def get_pending_users_arrived(logged_user):
    pending_matches = Match.objects.filter(
        user_receiving=logged_user,
        status="PENDING"
    ).distinct()

    pending_users = []
    for match in pending_matches:
        pending_users.append(match.user_sending)
    
    return pending_users

def get_pending_users_sent(logged_user):
    pending_matches = Match.objects.filter(
        user_sending=logged_user,
        status="PENDING"
    ).distinct()

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
            field_value = getattr(prefs, field_name)
            user_prefs[field_name] = field_value
    
    return user_prefs

def order_users(evaluated_users):
    pass

def get_users_algorithm(logged_user, all_users, max_users):
    print("SONO DENTRO")
    user_prefs_obj = UserPreferences.objects.get(user=logged_user)
    print(f"QUERY {user_prefs_obj}")
    user_prefs = get_pref_values(user_prefs_obj)
    print(f"DICT {user_prefs}")
    evaluated_users = dict()
    
    for user in all_users:
        score = 0

        other_user_prefs_obj = UserPreferences.objects.get(user=user)
        print(f"OTHER QUERY {other_user_prefs_obj}")
        other_user_prefs = get_pref_values(other_user_prefs_obj)
        print(f"OTHER DICT {other_user_prefs}")

        for key in user_prefs:
            if user_prefs[key] and other_user_prefs[key]:
                score += 1
            elif user_prefs[key] == other_user_prefs[key]:
                score += 0.1
        
        evaluated_users[user] = score
    
    ordered_users = sorted(evaluated_users.items(), key=lambda item: item[1], reverse=True)
    print(f"ORDERED USERS {ordered_users}")

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

    print(f"BEST USERS {best_users_list}")
    return best_users_list

@login_required
def feed_view(request):
    logged_user = request.user
    
    all_users = UserProfile.objects.all()

    selected_users = get_users_algorithm(logged_user, all_users, MAX_USERS)

    pending_users_arrived = get_pending_users_arrived(logged_user)

    if request.method == "POST":
        liked_user_username = request.POST.get("liked_username")
        disliked_user_username =  request.POST.get("disliked_username")
        print(liked_user_username, disliked_user_username)

        if liked_user_username:
            liked_user = UserProfile.objects.get(username=liked_user_username)
            print(liked_user)

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
            else:
                match = Match.objects.create(
                        user_sending=logged_user,
                        user_receiving=liked_user,
                        status="PENDING"
                    )
        elif disliked_user_username:
            disliked_user = UserProfile.objects.get(username=disliked_user_username)
            print(disliked_user)
    
    pending_users_arrived = get_pending_users_arrived(logged_user)

    pending_users_sent = get_pending_users_sent(logged_user)

    matched_users = get_matched_users(logged_user)

    print_actions_in_server_log(selected_users, logged_user, pending_users_arrived, pending_users_sent, matched_users)

    context = {
        "users": selected_users,
        "matched_users": matched_users,
        "pending_users_arrived": pending_users_arrived,
        "pending_users_sent": pending_users_sent
    }
    return render(request, "feed/feed.html", context)
