from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from .models import UserProfile, UserPreferences
from django.core.exceptions import ValidationError
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
import json


def auth_view(request):
    if request.method == 'POST':
        action = request.POST.get('action_type')

        if action == 'login':
            username = request.POST.get('username')
            password = request.POST.get('password')
            user = authenticate(request, username=username, password=password)
            print("USER: ", user)
            if user:
                login(request, user)
                return redirect('home')
            else:
                messages.error(request, 'Credenziali non valide.')

        elif action == 'register':
            username = request.POST.get('username_r')
            nome = request.POST.get('first_name')
            cognome = request.POST.get('last_name')
            email = request.POST.get('email')
            password = request.POST.get('password1_r')
            conferma_password = request.POST.get('password2_r')
            sesso = request.POST.get('sesso')

            if password != conferma_password:
                messages.error(request, 'Le password non corrispondono.')
            elif UserProfile.objects.filter(username=username).exists():
                messages.error(request, 'Username già esistente.')
            else:
                user = UserProfile.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                    first_name=nome,
                    last_name=cognome,
                    gender=sesso
                )
                login(request, user)
                return redirect('preferences')

    return render(request, 'accounts/login_register.html')

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
        profile.bio = bio
        profile.save()

        return redirect('upload_photo')

    return render(request, 'accounts/preferences.html')

@login_required
def update_bio(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            bio = data.get('bio', '').strip()

            max_length = 255
            if len(bio) > max_length:
                return JsonResponse({'success': False, 'message': f'La biografia non può superare i {max_length} caratteri.'}, status=400)

            request.user.biography = bio
            request.user.save()

            return JsonResponse({'success': True, 'message': 'Biografia aggiornata con successo!'})
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Richiesta JSON non valida.'}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Errore del server: {str(e)}'}, status=500)
    else:
        return JsonResponse({'success': False, 'message': 'Metodo non permesso.'}, status=405)


@login_required
def upload_photo(request):
    if request.method == 'POST':
        profile_pic = request.FILES.get("profile_picture")
        if profile_pic:
            user_profile = request.user
            user_profile.profile_picture = profile_pic
            user_profile.save()
            return redirect('home')
    
    return render(request, 'accounts/upload_photo.html')



def profile(request):
    user_profile = UserProfile.objects.get(username = request.user.username)
    
    user_preferences = UserPreferences.objects.get(user=request.user)
    return render(request, 'accounts/profile.html', {
        'user_profile': user_profile,
        'user_preferences': user_preferences,
        'user': request.user,
        'is_owner': True
    })