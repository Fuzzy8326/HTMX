# Import 'path' to define URL patterns
from django.urls import path
# Import views from the current app directory
from . import views

# Define URL patterns for this app
urlpatterns = [
    # URL for the index/home page
    # Accessing '/sim/' will call views.index
    path('', views.index, name='index'),
    
    # URL for the 'example' view
    # Accessing '/example/' will call views.example
    path('example/', views.example, name='example'),

    # URL for the 'sample_post' view
    # Accessing '/sample-post/' will call views.sample_post
    path('sample-post/', views.sample_post, name='sample-post'),
]