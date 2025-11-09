# Import the 'render' function to render HTML templates
# Import 'HttpResponse' to return raw HTML responses
from django.shortcuts import render
from django.http import HttpResponse

# Import the custom form 'SampleForm' from your 'sim' app
from sim.forms import SampleForm

# This view handles a sample form submission via POST requests
def sample_post(request, *args, **kwargs):
    # Instantiate the form with POST data if available, otherwise create an empty form
    form = SampleForm(request.POST or None)

    # Check if the submitted form is valid (all required fields filled and passes validation)
    if form.is_valid():
        # Print the cleaned (validated) data to the console for debugging
        print(f'{form.cleaned_data=}')
        # Return a simple HTML response indicating the form was submitted successfully
        return HttpResponse('<p class="success">Form submitted successfully! ✅</p>')
    else:
        # If the form is invalid, return an HTML response showing the errors
        return HttpResponse(
            f'<p class="error">'
            f'Your form submission was unsuccessful ❌. '
            f'Please would you correct the errors? '
            f'The current errors: {form.errors}'
            f'</p>'
        )

# A simple view that renders a template named 'example.html'
# This could be used to display a static page or a page containing your form
def example(request):
    return render(request, 'example.html')

