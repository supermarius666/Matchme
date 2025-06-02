from apps.feed.models import Match
from apps.chat.models import ChatRoom, Message
from apps.accounts.models import UserProfile

from django.db.models import Q

from datetime import datetime, timedelta
from django.utils import timezone

import re

def get_user_info(user):
    return [user.username, user.profile_picture.url]

def get_pending_users_arrived(logged_user):
    # select tutti i match in arrivo al logged_user
    pending_matches = Match.objects.filter(
        user_receiving=logged_user,
        status="PENDING"
    ).distinct()

    # lista degli user che hanno mandato richiesta di match al logged_user
    pending_users = []
    for match in pending_matches:
        pending_users.append(get_user_info(match.user_sending))
    
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
        pending_users.append(get_user_info(match.user_receiving))
    
    return pending_users

def get_matched_users(logged_user):
    completed_matches = Match.objects.filter(
        Q(user_sending=logged_user) | Q(user_receiving=logged_user),
        status="MATCHED"
    ).distinct()
    
    matched_users = []
    for match in completed_matches:
        if match.user_sending == logged_user:
            matched_users.append(get_user_info(match.user_receiving))
        else:
            matched_users.append(get_user_info(match.user_sending))
        
    return matched_users

def print_actions_in_server_log(users, logged_user, pending_users_arrived, pending_users_sent, matched_users):
    print(f"\n" \
            f"FOR USER {logged_user}:\n" \
            f"- Users: {users}\n" \
            f"- Pending_users_arrived: {pending_users_arrived}\n" \
            f"- Pending_users_sent: {pending_users_sent}\n" \
            f"- Matched users: {matched_users}\n")

def get_last_message_timestamp(logged_username, username):
    room = ChatRoom.objects.get(
        Q(user1=UserProfile.objects.get(username=logged_username),
          user2=UserProfile.objects.get(username=username)) | 
        Q(user1=UserProfile.objects.get(username=username), 
          user2=UserProfile.objects.get(username=logged_username))
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
        if re.match(pattern, user[0]):
            last_message_timestamp = get_last_message_timestamp(logged_user.username, user[0])
            user.append(last_message_timestamp)
            search_output.append(user)
    return search_output