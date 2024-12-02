from django.db import models
from django.conf import settings


# Create your models here.

class Movie(models.Model):
    tmdb_id = models.IntegerField(unique=True)  # 고유 값
    title = models.CharField(max_length=200)    
    overview = models.TextField()        
    poster_path = models.CharField(max_length=250, null=True, blank=True) # 포스터가 없을 수도 있음
    genre = models.CharField(max_length=100)     
    pos_ott = models.TextField(null=True, blank=True)# ott에 연결되지 않았을 수 있음
    actors = models.TextField()               
    runtime = models.IntegerField(null=True, blank=True)  
    liked_by = models.ManyToManyField(settings.AUTH_USER_MODEL,related_name='liked_movies',blank=True)




class MovieOTT(models.Model):
    movie_id = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='movie_otts')
    ott_name = models.CharField(max_length=100)  
    ott_link = models.URLField(max_length=250)   


    class Meta:
        unique_together = ('movie_id', 'ott_name')  # 중복 되지 않도록

