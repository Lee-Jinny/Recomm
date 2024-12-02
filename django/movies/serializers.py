from rest_framework import serializers
from .models import Movie, MovieOTT

# vue 예비용
# class MovieSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = MovieOTT
#         fields = ('__all__')


class MovieDetailSerializer(serializers.ModelSerializer):
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = '__all__'

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.liked_by.filter(id=request.user.id).exists()
        return False



class MovieOTTSerializer(serializers.ModelSerializer):
    movie_title = serializers.CharField(source='movie.title', read_only=True) 

    class Meta:
        model = MovieOTT
        fields = ('id', 'movie', 'ott_name', 'ott_link', 'movie_title')

