from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from .models import UserProfile, UserPreferences
from django.core.exceptions import ValidationError
from django.contrib.auth.decorators import login_required

def auth_view(request):
    if request.method == 'POST':
        action = request.POST.get('action_type')

        if action == 'login':
            username = request.POST.get('username')
            password = request.POST.get('password')
            user = authenticate(request, username=username, password=password)
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
                return redirect('home')

    return render(request, 'accounts/login_register.html')



@login_required
def preferences_view(request):
    if request.method == 'POST':
        # Ottieni le preferenze selezionate dal form
        interests = request.POST.getlist('interested_in')  # getlist per raccogliere tutte le checkbox selezionate
        
        # campo bio 
        bio = request.POST.get('bio', '').strip()[:255]

        # Trova o crea l'oggetto UserPreferences associato all'utente
        preferences, created = UserPreferences.objects.get_or_create(user=request.user)

        # Salva le preferenze nell'oggetto UserPreferences
        preferences.interested_in = interests
        preferences.save()


        # Salva o crea UserProfile
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        profile.bio = bio
        profile.save()

        return redirect('upload_photo')  # Reindirizza alla pagina del profilo (o dove preferisci)

    return render(request, 'accounts/preferences.html')  # Il template con il form per le preferenze



@login_required
def update_bio(request):
    if request.method == 'POST':
        bio = request.POST.get('bio', '').strip()[:255]
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        profile.bio = bio
        profile.save()
    return redirect('profile')  # Sostituisci con il nome corretto della tua view del profilo

@login_required
def view_preferences(request):
    preferences = UserPreferences.objects.get(user=request.user)
    return render(request, 'accounts/view_preferences.html', {'preferences': preferences})



@login_required
def upload_photo(request):
    if request.method == 'POST' and request.FILES['profile_picture']:
        user_profile = request.user.profile
        user_profile.profile_picture = request.FILES['profile_picture']
        user_profile.save()
        return redirect('profile')  # Reindirizza a una pagina del profilo dell'utente o dove preferisci
    
    return render(request, 'accounts/upload_photo.html')



def profile(request): 
    user_profile = request.user.profile  # Assicurati che l'utente abbia un profilo associato
    user_preferences = UserPreferences.objects.get(user=request.user)
    return render(request, 'accounts/sium.html', {
        'user_profile': user_profile, 
        'user_preferences': user_preferences,
        'user': request.user,         # Passa anche user se non l'hai già fatto
        'is_owner': True              # Perché sei nel profilo dell'utente loggato
    })


