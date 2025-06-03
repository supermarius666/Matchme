from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .models import UserProfile, UserPreferences, UserStats
from django.core.exceptions import ValidationError
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
import json
from django.core.mail import send_mail
from django.conf import settings

from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone

from datetime import datetime, timedelta

import os
from django.core.files import File

def auth_view(request):
    return render(request, 'accounts/login_register.html')

#@csrf_exempt
def auth_request_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        action = data.get("type")

        if action == 'login':
            user = authenticate(request, username=data.get("loginUsername"), password=data.get("loginPassword"))
            print("USER: ", user)
            if user:
                login(request, user)
                #return redirect('home')
                return JsonResponse({
                            "success": True,
                            "message": "utente acceduto con successo."
                        })
            else:
                return JsonResponse({
                        "success": False,
                        "message": "Credenziali invalide."
                    })

        elif action == 'register':
            userExists = UserProfile.objects.filter(username=data.get("regUsername")).exists()

            # regBirthDate : regBirthDate,

            if not userExists:
                user = UserProfile.objects.create_user(
                    username=data.get("regUsername"),
                    first_name=data.get("regNome"),
                    last_name=data.get("regCognome"),
                    email=data.get("regMail"),
                    password=data.get("regPassword"),
                    gender=data.get("regGender"),
                    city=data.get("regCity")
                )

                user_stats = UserStats.objects.create(
                    user=user,
                    registration_day=timezone.now().date()
                )

                subject = "Benvenuto su MatchMe!"
                message = f"Ciao {user.first_name},\n\nGrazie per esserti registrato su MatchMe! Siamo felici di averti con noi.\n\nCordiali saluti,\nIl team di MatchMe"
                from_email = settings.EMAIL_HOST_USER
                recipient_list = [user.email]

                try:
                    send_mail(subject, message, from_email, recipient_list)
                except Exception as e:
                    print(f"Errore nell'invio dell'email: {e}")
                login(request, user)

                print("SUCECSSO")

                return JsonResponse({
                        "success": True,
                        "message": "utente creato con successo"
                    })
            else:
                return JsonResponse({
                        "success": False,
                        "message": "utente già esistente"
                    })

    return JsonResponse({
            "success": False,
            "message": "Richiesta sbagliata"
        })

@login_required
def logout_view(request):
    if request.method == "POST":
        logout(request)
    return redirect("home")

@login_required
def preferences_view(request):
    if request.method == 'POST':
        selected_prefs = request.POST.getlist('interested_in')
        
        bio = request.POST.get('bio', '').strip()[:255]
      
        preferences, created = UserPreferences.objects.get_or_create(user=request.user)

        all_pref = UserPreferences._meta.get_fields()        
        interests = [field.name for field in all_pref]
        
        for interest in interests:
            
            if interest in selected_prefs:
                setattr(preferences, interest, True)
    
        preferences.save()

        profile = UserProfile.objects.get(username=request.user.username)
        profile.biography = bio
        profile.save()

        return redirect('accounts:upload_photo_reg')

    return render(request, 'accounts/preferences.html')

def update_bio(request):
    try: 
        bio = request.POST.get('bio', '').strip()[:255]

        bio_max_length = 255
        if len(bio) > bio_max_length:
            response = {"success": False, "message": "bio non aggiornata"}
            return response
  
        request.user.biography = bio
        request.user.save()

        response = {"success": True, "message": "bio aggiornata"}
        return response
    
    except Exception as e:
        response = {"success": False, "message": "bio non aggiornata"}
        return response

def update_photo(request):
    try:
        user_profile = request.user

        if "profile_picture" in request.FILES:
            file = request.FILES["profile_picture"]
            user_profile.profile_picture = file
            user_profile.save()

        if "cover_picture" in request.FILES:
            file = request.FILES["cover_picture"]
            user_profile.cover_picture = file
            user_profile.save()

        response = {"success": True, "message": "foto profilo e cover aggiornate"}
        return response

    except Exception as e:
        response = {"success": True, "message": "photo aggiornata"}
        return response

@login_required
@csrf_exempt
def update_profile_view(request):
    if request.method == 'POST':
        bio_response = update_bio(request)
        photo_response = update_photo(request)

        if bio_response["success"] and photo_response["success"]:
            return JsonResponse({'success': True, 'message': 'Aggiornate foto e bio con successo'})
        else:
            return JsonResponse({'success': False, 'message': 'Errore nel caricamento foto e/o bio'})
    else:
        return JsonResponse({'success': False, 'message': 'Metodo non permesso.'}, status=405)

@login_required
def upload_photo_reg(request):
    if request.method == 'POST':
        user_profile = request.user
        profile_pic = request.FILES.get("profile_picture")

        if profile_pic:
            user_profile.profile_picture = profile_pic
            user_profile.save()
        else:
            image_path = "../front-end/media/profile_pics/default_profile_pic.png"
            #image_path = "/media/profile_pics/default_profile_pic.png"
            with open(image_path, 'rb') as f:
                image_file = File(f, name=os.path.basename(image_path))
                user_profile.profile_picture = image_file
                user_profile.save()

        return redirect('home')
    
    return render(request, 'accounts/upload_photo.html')

def get_pref_values(prefs):
    user_prefs = dict()

    for field in prefs._meta.fields:
        field_name = field.name
        if field_name != "id" and field_name != "user":
            field_value = getattr(prefs, field_name) # Get field value
            #print(field_name, field_value)
            user_prefs[field_name] = field_value
    return user_prefs

@login_required
def profile_view(request, username):
    viewed_user = get_object_or_404(UserProfile, username=username)
    viewed_user_preferences = None

    try:
        viewed_user_preferences = UserPreferences.objects.get(user=viewed_user)
        prefs = get_pref_values(viewed_user_preferences)
        prefs_list = []
        for key in prefs:
            if prefs[key] == True:
                prefs_list.append(key)


    except UserPreferences.DoesNotExist:
        pass

    viewed_user_stats = None
    try:
        viewed_user_stats = UserStats.objects.get(user=viewed_user)
    except UserStats.DoesNotExist:
        pass

    is_owner = (request.user.is_authenticated and request.user == viewed_user)

    return render(request, 'accounts/profile.html', {
        'user_profile': viewed_user,
        'user_preferences': prefs_list,
        'user_stats': viewed_user_stats,
        'current_user': request.user,
        'is_owner': is_owner,
    })