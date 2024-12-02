# views.py
from dj_rest_auth.registration.views import RegisterView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.shortcuts import get_object_or_404
from .models import User
from .serializers import CustomRegisterSerializer, UserUpdateSerializer

class CustomRegisterView(RegisterView):
    serializer_class = CustomRegisterSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_detail(request):
    print("=== User Detail API Called ===")
    print(f"Auth Header: {request.headers.get('Authorization')}")
    print(f"User: {request.user}")
    
    serializer = CustomRegisterSerializer(request.user)
    return Response(serializer.data)



@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def user_update(request):
    """
    현재 로그인한 사용자의 정보를 수정
    """
    serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        user = serializer.save()
        return Response(UserUpdateSerializer(user).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def user_delete(request):
    """
    현재 로그인한 사용자의 계정을 삭제
    """
    user = request.user
    user.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def check_password(request):
    user = request.user
    password = request.data.get('password')
    
    if user.check_password(password):
        return Response({'is_valid': True})
    return Response({'is_valid': False}, status=401)