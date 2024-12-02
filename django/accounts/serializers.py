from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
from .models import User

class CustomRegisterSerializer(RegisterSerializer):
    nick_name = serializers.CharField(max_length=10, required=True)
    security_question = serializers.CharField(max_length=200, required=True)
    security_answer = serializers.CharField(max_length=200, required=True)
    profile_image = serializers.CharField(allow_blank=True, required=False)

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data.update({
            'nick_name': self.validated_data.get('nick_name', ''),
            'security_question': self.validated_data.get('security_question', ''),
            'security_answer': self.validated_data.get('security_answer', ''),
            'profile_image': self.validated_data.get('profile_image', '')
        })
        return data

    def save(self, request):
        user = super().save(request)
        user.nick_name = self.cleaned_data.get('nick_name')
        user.security_question = self.cleaned_data.get('security_question')
        user.security_answer = self.cleaned_data.get('security_answer')
        user.profile_image = self.cleaned_data.get('profile_image', '')
        user.save()
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True, required=False)
    password2 = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ('nick_name', 'email', 'password1', 'password2', 
                 'security_question', 'security_answer', 'profile_image')
        extra_kwargs = {
            'email': {'required': False},
            'security_question': {'required': False},
            'security_answer': {'required': False},
            'profile_image': {'required': False},
        }

    def validate(self, data):
        # 비밀번호가 제공된 경우 검증
        if 'password1' in data or 'password2' in data:
            if data.get('password1') != data.get('password2'):
                raise serializers.ValidationError({"password2": "비밀번호가 일치하지 않습니다."})
        return data

    def update(self, instance, validated_data):
        # 비밀번호 처리
        password = validated_data.pop('password1', None)
        if password:
            instance.set_password(password)
        
        # 나머지 필드 업데이트
        for attr, value in validated_data.items():
            if value is not None:  # None이 아닌 값만 업데이트
                setattr(instance, attr, value)
        
        instance.save()
        return instance