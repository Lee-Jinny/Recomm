from django.urls import path
from . import views


urlpatterns = [
    # path('', views.movie_list),  # 영화 목록
    path('<int:movie_pk>/', views.movie_detail), # 영화 디테일
    path('<int:movie_pk>/otts/', views.movie_ott_list), # 영화 OTT 상세
    path('save-movie/', views.save_movie), # 영화 데이터 db에 저장
    path('save-movie-ott/', views.save_movie_ott), # 영화 데이터 중 ott 정보 추가 저장
    path('check-movie/<int:tmdb_id>/', views.check_movie),
    path('toggle-like/<int:tmdb_id>/', views.toggle_like_movie),
    path('check-like/<int:tmdb_id>/', views.check_like_status),
    path('liked-movies/', views.get_liked_movies),
]

