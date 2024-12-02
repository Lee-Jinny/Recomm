from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404, get_list_or_404

from .serializers import MovieDetailSerializer, MovieOTTSerializer  

# vue에서 구현힘들 시 사용
# @api_view(['GET'])
# def movie_list(request):
#     movies = get_list_or_404(Movie)
#     serializer = MovieSerializer(movies, many=True)
#     return Response(serializer.data)


@api_view(['GET'])
def movie_detail(request, movie_pk):
    movie = get_object_or_404(Movie, pk=movie_pk)
    if request.method == 'GET':
        serializer = MovieDetailSerializer(movie)
        return Response(serializer.data)


@api_view(['GET'])
def movie_ott_list(request, movie_pk):  
    movie_otts = get_list_or_404(MovieOTT, movie_id=movie_pk)  
    if request.method == 'GET':  
        serializer = MovieOTTSerializer(movie_otts, many=True)  
        return Response(serializer.data)
    



from .models import Movie, MovieOTT

## 영화 데이터 db 저장
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_movie(request):

    movie = Movie.objects.filter(tmdb_id=request.data['tmdb_id']).first()

    if request.method == 'POST':
        # 이미 존재하는 영화라면
        if movie:

            # 데이터 구조분해할당 한것..! 업데이트 하려구
            for key, value in request.data.items():
                setattr(movie, key, value) 
            movie.save()

            # OTT 정보도 업데이트
            movie.movie_otts.all().delete()

            return Response({
                'id': movie.id,
                'message' : '영화 정보가 업데이트되었습니다.'
            }, status=status.HTTP_200_OK)
        
        # db에 없는 영화
        movie = Movie.objects.create(**request.data)
        return Response({
            'id':movie.id,
            'message':'새로운 영화가 저장되었습니다.'
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'error' : '잘못된 요청입니다.'
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_movie_ott(request):
    if request.method == 'POST':
        movie = get_object_or_404(Movie, id=request.data['movie_id'])

        # 이미 존재하는 ott인지 확인 
        ott = MovieOTT.objects.filter(
            movie_id=movie,
            ott_name=request.data['ott_name']
        ).first()

        if ott:
            ott.ott_link = request.data['ott_link']
            ott.save()
        else:
            MovieOTT.objects.create(
                movie_id=movie,
                ott_name=request.data['ott_name'],
                ott_link=request.data['ott_link']
            )
        return Response({
            'message': 'OTT 정보가 저장되었습니다.'
        }, status=status.HTTP_200_OK)
    
    return Response({
        'error' : '잘못된 요청입니다.'
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_movie(request, tmdb_id):
    exists = Movie.objects.filter(tmdb_id=tmdb_id).exists()
    return Response({'exists': exists}, status=status.HTTP_200_OK)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_like_movie(request, tmdb_id):  # movie_id를 tmdb_id로 변경
    try:
        movie = get_object_or_404(Movie, tmdb_id=tmdb_id)
        user = request.user

        if movie.liked_by.filter(id=user.id).exists():
            movie.liked_by.remove(user)
            is_liked = False
        else:
            movie.liked_by.add(user)
            is_liked = True

        return Response({
            'status': 'success',
            'is_liked': is_liked
        })
    except Movie.DoesNotExist:
        return Response(
            {'error': 'Movie not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_like_status(request, tmdb_id):
    print(f"=== check_like_status 호출됨 ===")
    print(f"TMDB ID: {tmdb_id}")
    print(f"요청 유저: {request.user.username}")
    
    try:
        # 영화가 DB에 없는 경우도 처리
        movie = Movie.objects.filter(tmdb_id=tmdb_id).first()
        print(f"DB에서 찾은 영화: {movie}")
        
        if not movie:
            print("영화를 DB에서 찾을 수 없음")
            return Response({
                'exists': False,
                'is_liked': False,
                'message': '영화가 DB에 없습니다'
            }, status=status.HTTP_200_OK)
            
        # 좋아요 상태 확인
        is_liked = movie.liked_by.filter(id=request.user.id).exists()
        print(f"좋아요 상태: {is_liked}")
        
        return Response({
            'exists': True,
            'is_liked': is_liked,
            'message': '조회 성공'
        }, status=status.HTTP_200_OK)  # status 명시적 추가
        
    except Exception as e:
        print(f"에러 발생: {str(e)}")
        print(f"에러 타입: {type(e)}")
        import traceback
        print(f"상세 에러: {traceback.format_exc()}")
        return Response({
            'error': str(e),
            'exists': False,
            'is_liked': False,
            'message': '에러가 발생했습니다'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_liked_movies(request):
    user = request.user
    liked_movies = Movie.objects.filter(liked_by=user)
    serializer = MovieDetailSerializer(
        liked_movies, 
        many=True,
        context={'request': request}
    )
    return Response(serializer.data)
