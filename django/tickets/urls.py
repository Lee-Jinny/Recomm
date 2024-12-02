from django.urls import path
from . import views


urlpatterns = [
    path('', views.ticket_list),
    path('<int:ticket_pk>/', views.ticket_detail),
    path('count/', views.ticket_count),
]
