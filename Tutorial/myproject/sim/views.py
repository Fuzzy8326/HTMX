# Import the 'render' function to render HTML templates
# Import 'HttpResponse' to return raw HTML responses
from django.shortcuts import render
from django.http import HttpResponse

# Import the custom form 'SampleForm' from your 'sim' app
from sim.forms import SampleForm

def index(request):
    return render(request, 'sim/index.html')

# This view handles a sample form submission via POST requests
def sample_post(request, *args, **kwargs):
    print(f'{request.POST = }')
    name = request.POST.get('name', '')
    email = request.POST.get('email', '')
    favourite_colour = request.POST.get('favourite_color', '')
    
    if name and email and favourite_colour:
        return HttpResponse('<p class="success">Form submitted successfully! ✅</p>')
    else:
        return HttpResponse('<p class="error">Please provide both name and email and favourite color.❌</p>')
 

# A simple view that renders a template named 'example.html'
# This could be used to display a static page or a page containing your form
def example(request):
    return render(request, 'example.html')

