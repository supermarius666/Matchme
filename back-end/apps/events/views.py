from django.shortcuts import render

# Create your views here.
def events_view(request):
    context = {}
    return render(request, "events/events.html", context)

def place_view(request, placeName):
    context = {"name": placeName}
    return render(request, "events/place.html", context)