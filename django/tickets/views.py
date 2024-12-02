from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from .models import Ticket
from .serializers import TicketSerializer
from movies.models import Movie 

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def ticket_list(request):
    if request.method == 'GET':
        tickets = Ticket.objects.filter(user=request.user).order_by('-created_at')
        serializer = TicketSerializer(tickets, many=True, context={'request': request})
        return Response(serializer.data)
    
    elif request.method == 'POST':
        print("========== REQUEST DEBUG ==========")
        print("Files:", request.FILES)
        print("POST Data:", request.POST)
        print("Data:", request.data)
    
        # TMDB ID로 Movie 객체 찾기
        tmdb_id = request.POST.get('movie')
        movie = get_object_or_404(Movie, tmdb_id=tmdb_id)
        
        # 받은 데이터 복사 후 movie ID 수정
        data = request.POST.copy()
        data['movie'] = movie.id  # movie의 실제 PK로 교체
        
        # 파일 데이터 추가
        if 'ticket_image' in request.FILES:
            data['ticket_image'] = request.FILES['ticket_image']
            
        serializer = TicketSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            ticket = serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        print("Validation Errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([AllowAny])
def ticket_detail(request, ticket_pk):
    ticket = get_object_or_404(Ticket, pk=ticket_pk)

    # GET 요청은 누구나 접근 가능해야한다 (ex/ 초대 티켓을 받은 상대방, 카카오톡 링크로 진입한 사용자)
    if request.method == 'GET':
        serializer = TicketSerializer(ticket, context={'request': request})
        print('GET request data: ', serializer.data)
        return Response(serializer.data)
    
    if request.method in ['PUT', 'DELETE'] :
        # permission 데코레이터 대신 인증 확인 
        if not request.user.is_authenticated:
            return Response({'detail':'로그인이 필요합니다.'}, status=status.HTTP_401_UNAUTHORIZED)
    
        if ticket.user != request.user:
            return Response({'detail': '권한이 없습니다.'}, status=status.HTTP_403_FORBIDDEN)

        elif request.method == 'PUT':
            serializer = TicketSerializer(ticket, data=request.data, partial=True, context={'request': request})
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data)

        elif request.method == 'DELETE':
            ticket.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ticket_count(request):
    count = Ticket.objects.filter(user=request.user).count()
    return Response({'count': count})