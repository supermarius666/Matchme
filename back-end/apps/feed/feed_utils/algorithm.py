from .users import get_user_info
from apps.accounts.models import UserPreferences

import requests

import math

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Access environment variables
api_key = os.environ.get("API_KEY")

# per calcolare la componente di score per la distanza
MAX_DISTANCE_SCORE = 30
DISTANCE_PARAMETER = 150
MAX_DISTANCE = 10000

def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the distance between two points on the Earth surface using the
    Haversine formula.
    """
    # Radius of the Earth in kilometers
    R = 6371.0

    # Convert latitude and longitude from degrees to radians
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)

    # Difference in coordinates
    dlon = lon2_rad - lon1_rad
    dlat = lat2_rad - lat1_rad

    # Haversine formula
    a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    distance = R * c

    return distance

def get_coords_from_city(city):
    lat = 0
    lon = 0
    print(f"API KEY!!!: {api_key}")
    try:
        response = requests.get(f"http://api.openweathermap.org/geo/1.0/direct?q={city}&limit={5}&appid={api_key}")
        response.raise_for_status()
        data = response.json()
        lat = data[0]["lat"]
        lon = data[0]["lon"]
        print(f"lat: {lat}, lon: {lon}")
    except requests.RequestException as e:
        print("Errore nella chiamata all'API")
    
    return lat, lon

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

def compute_distance(city1, city2):
    lat1, lon1 = get_coords_from_city(city1)
    lat2, lon2 = get_coords_from_city(city2)

    distance = haversine_distance(lat1, lon1, lat2, lon2)
    print(f"computed distance: {distance}")
    return distance

def get_distance_score(distance):
    """ una semplice iperbole equilatera (all'aumentare della distanza lo score va a zero premiando molto chi è molto vicino) """

    distance_score = DISTANCE_PARAMETER / distance
    return distance_score

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

        # AND logico per capire se i due user non hanno nessuna attrazione sessuale in comune
        if not (user_prefs["male"] and other_user_prefs["male"]) and \
            not (user_prefs["female"] and other_user_prefs["female"]) and \
            not (user_prefs["other"] and other_user_prefs["other"]):
            evaluated_users[user] = 0
        else:
            if logged_user.city and user.city:
                distance = compute_distance(logged_user.city, user.city)
            else:
                distance = MAX_DISTANCE

            if distance <= 0: # per non dividere per 0
                distance_score = MAX_DISTANCE_SCORE
            elif distance > MAX_DISTANCE: # per prevenire overflow
                distance_score = 0
            else:
                distance_score = get_distance_score(distance)
                if distance_score > MAX_DISTANCE_SCORE:
                    distance_score = MAX_DISTANCE_SCORE

            score += distance_score

            for key in user_prefs:
                if user_prefs[key] and other_user_prefs[key]:
                    score += 1
                elif user_prefs[key] == other_user_prefs[key]: # hanno in comune il fatto di non piacere quelle cose [BO FORSE DA LEVARE]
                    score += 0.1
            
            evaluated_users[user] = score
    
    #ordered_users = order_users(evaluated_users)
    ordered_users = sorted(evaluated_users.items(), key=lambda item: item[1], reverse=True)
    print(f"ORDERED USERS {ordered_users}")

    # prende solo lo user dei primi max_users elementi in ordered_users (che è una lista di tuple (<UserProfile>, <score>))
    best_users_list = []
    counter = 0
    for elem in ordered_users:
        user = elem[0]
        score = elem[1]

        if score > 0:
            best_users_list.append(get_user_info(user))

        counter += 1
        if counter > max_users:
            break

    print(f"BEST USERS {best_users_list}")
    return best_users_list