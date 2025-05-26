from django.shortcuts import render, redirect

# Create your views here.
def home_view(request):
	if request.user.is_authenticated:
		return redirect("feed")
	return render(request, "main/home.html", {})