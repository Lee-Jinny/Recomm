from django.shortcuts import get_list_or_404, get_object_or_404

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated

from .serializers import CommentSerializer
from .models import Comment
from movies.models import Movie

# Create your views here.
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def comment_list(request, movie_pk):

    movie = Movie.objects.filter(tmdb_id=movie_pk).first()
    if not movie:
        return Response({'error': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # 댓글 목록 출력
    if request.method == 'GET':
        comments = Comment.objects.filter(movie=movie)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)
    
    # 댓글 생성
    elif request.method == 'POST':
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(
                user=request.user,
                movie=movie
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)