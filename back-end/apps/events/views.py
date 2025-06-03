from django.shortcuts import render
from .models import Event, Place

def events_main_view(request):
    events = Event.objects.all()
    places = Place.objects.all()
    context = {'events': events, 'places': places}
    return render(request, "events/events.html", context)


def place_event_view(request, placeName): 
    place = Place.objects.get(name=placeName)
    context = {'place': place}
    return render(request, "events/place.html", context)
