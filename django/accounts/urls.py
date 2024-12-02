from django.urls import path, include
from . import views
from .views import CustomRegisterView

urlpatterns = [
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/register/', CustomRegisterView.as_view(), name='rest_register'),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
     # 유저 정보 관리
    path('user/', views.user_detail, name='user_detail'),
    path('user/update/', views.user_update, name='user_update'),
    path('user/delete/', views.user_delete, name='user_delete'),
    path('user/check-password/', views.check_password, name='check-password'),
]