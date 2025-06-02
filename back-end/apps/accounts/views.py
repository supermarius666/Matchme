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
            citta = request.POST.get('citta')

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
                    gender=sesso,
                    city=citta
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
                return redirect('accounts:preferences')

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

        return redirect('accounts:upload_photo_reg')

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
def upload_photo_reg(request):
    if request.method == 'POST':
        profile_pic = request.FILES.get("profile_picture")
        if profile_pic:
            user_profile = request.user
            user_profile.profile_picture = profile_pic
            user_profile.save()
            return redirect('home')
    
    return render(request, 'accounts/upload_photo.html')



@login_required
def upload_photo(request):
    if request.method == 'POST':
        try:
            user_profile = request.user

            if 'profile_picture' in request.FILES:
                file = request.FILES['profile_picture']
                user_profile.profile_picture = file
                user_profile.save()
                return JsonResponse({
                    'success': True,
                    'message': 'Foto profilo caricata con successo!',
                    'profile_picture_url': user_profile.profile_picture.url
                })
            
            elif 'cover_picture' in request.FILES:
                file = request.FILES['cover_picture']
                user_profile.cover_picture = file
                user_profile.save()
                return JsonResponse({
                    'success': True,
                    'message': 'Foto di copertina caricata con successo!',
                    'cover_picture_url': user_profile.cover_picture.url
                })
            
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Nessun file immagine valido trovato nella richiesta.'
                }, status=400)

        except Exception as e:
            import traceback
            traceback.print_exc()
            return JsonResponse({
                'success': False,
                'message': f'Errore del server durante il caricamento: {str(e)}'
            }, status=500)
    else:
        return JsonResponse({
            'success': False,
            'message': 'Metodo non permesso.'
        }, status=405)

@login_required
def profile(request):
    user_profile = UserProfile.objects.get(username=request.user.username)
    user_preferences = UserPreferences.objects.get(user=request.user)

    try:
        user_stats = UserStats.objects.get(user=request.user)
    except UserStats.DoesNotExist:
        user_stats = None

    return render(request, 'accounts/profile.html', {
        'user_profile': user_profile,
        'user_preferences': user_preferences,
        'user_stats': user_stats,
        'user': request.user,
        'is_owner': True
    })

@login_required
def profile_view(request, username):
    viewed_user = get_object_or_404(UserProfile, username=username)
    
    viewed_user_preferences = None
    try:
        viewed_user_preferences = UserPreferences.objects.get(user=viewed_user)
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
        'user_preferences': viewed_user_preferences,
        'user_stats': viewed_user_stats,
        'current_user': request.user,
        'is_owner': is_owner,
    })