from django.urls import path
from . import views

app_name = 'program' 

urlpatterns = [
    path('', views.programCatalogView, name='programList'),         

]
