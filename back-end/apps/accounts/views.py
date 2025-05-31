from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from .models import UserProfile, UserPreferences, UserStats 
from django.core.exceptions import ValidationError
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
import json # Import json module
from django.shortcuts import render, get_object_or_404



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
        # Ottieni le preferenze selezionate dal form
        selected_prefs = request.POST.getlist('interested_in')  # getlist per raccogliere tutte le checkbox selezionate
        
        # campo bio 
        bio = request.POST.get('bio', '').strip()[:255]

        # Trova o crea l'oggetto UserPreferences associato all'utente
        preferences, created = UserPreferences.objects.get_or_create(user=request.user)

        # Salva le preferenze nell'oggetto UserPreferences
        all_pref = UserPreferences._meta.get_fields()        
        interests = [field.name for field in all_pref]
        
        for interest in interests:
            
            if interest in selected_prefs:
                # lo metto true
                setattr(preferences, interest, True)
    
        preferences.save()

        # Salva UserProfile
        profile = UserProfile.objects.get(username=request.user.username)
        profile.bio = bio
        profile.save()

        return redirect('accounts:upload_photo_reg')  # Reindirizza alla pagina del profilo (o dove preferisci)

    return render(request, 'accounts/preferences.html')  # Il template con il form per le preferenze

@login_required
def update_bio(request):
    if request.method == 'POST':
        try:
            # Parse the JSON body
            data = json.loads(request.body)
            bio = data.get('bio', '').strip()

            # Ensure biography does not exceed max_length
            max_length = 255
            if len(bio) > max_length:
                return JsonResponse({'success': False, 'message': f'La biografia non può superare i {max_length} caratteri.'}, status=400)

            # request.user is already the UserProfile instance
            request.user.biography = bio
            request.user.save()

            return JsonResponse({'success': True, 'message': 'Biografia aggiornata con successo!'})
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Richiesta JSON non valida.'}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Errore del server: {str(e)}'}, status=500)
    else:
        # Only POST requests are allowed for this endpoint
        return JsonResponse({'success': False, 'message': 'Metodo non permesso.'}, status=405)


@login_required
def upload_photo_reg(request):
    if request.method == 'POST':
        profile_pic = request.FILES.get("profile_picture")
        if profile_pic:
            user_profile = request.user
            user_profile.profile_picture = profile_pic
            user_profile.save()
            return redirect('home')  # Reindirizza a una pagina del profilo dell'utente o dove preferisci
    
    return render(request, 'accounts/upload_photo.html')



@login_required
def upload_photo(request):
    if request.method == 'POST':
        try:
            user_profile = request.user # request.user è già l'istanza di UserProfile

            # Controlla se è stata caricata una foto profilo
            if 'profile_picture' in request.FILES:
                file = request.FILES['profile_picture']
                user_profile.profile_picture = file
                user_profile.save()
                return JsonResponse({
                    'success': True,
                    'message': 'Foto profilo caricata con successo!',
                    'profile_picture_url': user_profile.profile_picture.url # Invia l'URL aggiornato
                })
            
            # Controlla se è stata caricata una foto di copertina
            elif 'cover_picture' in request.FILES:
                file = request.FILES['cover_picture']
                user_profile.cover_picture = file
                user_profile.save()
                return JsonResponse({
                    'success': True,
                    'message': 'Foto di copertina caricata con successo!',
                    'cover_picture_url': user_profile.cover_picture.url # Invia l'URL aggiornato
                })
            
            # Se nessun file è stato trovato nella richiesta
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Nessun file immagine valido trovato nella richiesta.'
                }, status=400) # Bad Request

        except Exception as e:
            # Cattura qualsiasi altro errore e restituisce una risposta JSON
            traceback.print_exc() # Stampa il traceback completo nella console del server per debugging
            return JsonResponse({
                'success': False,
                'message': f'Errore del server durante il caricamento: {str(e)}'
            }, status=500) # Internal Server Error
    else:
        # Se la richiesta non è POST, non permetterla per l'API di upload
        return JsonResponse({
            'success': False,
            'message': 'Metodo non permesso.'
        }, status=405) # Method Not Allowed


def profile(request): 
    user_profile = UserProfile.objects.get(username = request.user.username)
  
    user_preferences = UserPreferences.objects.get(user=request.user)
    return render(request, 'accounts/profile.html', {
        'user_profile': user_profile, 
        'user_preferences': user_preferences,
        'user': request.user,         # Passa anche user se non l'hai già fatto
        'is_owner': True              # Perché sei nel profilo dell'utente loggato
    })




def profile_view(request, username): 
    # PASSO 1: Recupera il UserProfile basandoti sull'username passato nell'URL
    # MyCustomUser è il tuo modello UserProfile, quindi username è un campo diretto
    viewed_user = get_object_or_404(UserProfile, username=username)
    
    # PASSO 2: Recupera le preferenze dell'utente *visualizzato*
    viewed_user_preferences = None
    try:
        viewed_user_preferences = UserPreferences.objects.get(user=viewed_user)
    except UserPreferences.DoesNotExist:
        pass 

    # PASSO 3: Recupera le statistiche dell'utente *visualizzato*
    viewed_user_stats = None
    try:
        viewed_user_stats = UserStats.objects.get(user=viewed_user)
    except UserStats.DoesNotExist:
        pass


    # PASSO 4: Determina se l'utente loggato è il proprietario del profilo visualizzato
    is_owner = (request.user.is_authenticated and request.user == viewed_user)

    return render(request, 'accounts/profile.html', {
        'user_profile': viewed_user, # Questo è l'oggetto UserProfile dell'utente che stai visualizzando
        'user_preferences': viewed_user_preferences, # Le preferenze dell'utente visualizzato
        'user_stats': viewed_user_stats, # Le statistiche dell'utente visualizzato
        'current_user': request.user, # L'utente attualmente loggato (utile per controlli nel template)
        'is_owner': is_owner,         # True se l'utente loggato è il proprietario del profilo
    })


