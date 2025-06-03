from django.shortcuts import render, redirect
from .forms import ContactForm
from django.core.mail import send_mail
from django.conf import settings

# Create your views here.
def home_view(request):
	if request.user.is_authenticated:
		return redirect("feed")
	return render(request, "main/home.html", {})


def about_view(request):
	return render(request, "main/about.html", {})


def contact_view(request):
	return render(request, "main/contact.html", {})

def custom_404_view(request, exception):
    return render(request, '404.html', status=404)

def contact_view(request):
    # print("[+] contact_view called") # debug print
    sent = request.session.pop('sent', False)
    form = ContactForm()   
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            nome = form.cleaned_data['nome']
            email = form.cleaned_data['email']
            msg = form.cleaned_data['msg']

            # Email al team
            send_mail(
                subject=f"Messaggio da {nome}",
                message=msg,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=['matchme.vmf@gmail.com'], # indirizzo del team
                fail_silently=False,
            )

            # Email di conferma all'utente
            conferma = (
                f"Ciao {nome},\n\n"
                "Grazie per il tuo messaggio. Risponderemo al più presto.\n\n"
                f"Messaggio ricevuto:\n{msg}\n\n"
                "Il team MatchMe"
            )
            send_mail(
                subject="Conferma invio messaggio - MatchMe",
                message=conferma,
                from_email='noreply@matchme.com', # indirizzo del noreply
                recipient_list=[email],
                fail_silently=False,
            )
            request.session['sent'] = True
            return redirect('contact')
            #return redirect('contact_success')  # redirect a success.html
    return render(request, 'main/contact.html', {'form': form, 'sent': sent})