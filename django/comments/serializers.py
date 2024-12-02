from rest_framework import serializers
from .models import Comment

# class CommentListSerializer(serializers.ModelSerializer):
#     username = serializers.CharField(source='user.username')
#     user_id = serializers.IntegerField(source='user.id')
#     profile_image = serializers.CharField(source='user.profile_image')
#     nick_name = serializers.CharField(source='user.nick_name')

#     class Meta:
#         model = Comment
#         fields = ('id', 'content', 'created_at', 'username', 'user_id', 'profile_image', 'nick_name')
#         read_only_fields = ('id', 'created_at', 'username', 'user_id', 'profile_image', 'nick_name', 'user', 'movie')

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    profile_image = serializers.CharField(source='user.profile_image', read_only=True)
    nick_name = serializers.CharField(source='user.nick_name', read_only=True)

    class Meta:
        model = Comment
        fields= ('id', 'content', 'created_at', 'username', 'user_id', 'profile_image', 'nick_name')
        read_only_fields = ('user', 'movie',)