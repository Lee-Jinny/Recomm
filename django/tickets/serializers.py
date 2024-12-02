from rest_framework import serializers
from .models import Ticket

class TicketSerializer(serializers.ModelSerializer):
    movie_title = serializers.CharField(source='movie.title', read_only=True)
    movie_poster = serializers.CharField(source='movie.poster_path', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    ticket_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        fields = (
            'id', 'movie', 'movie_title', 'movie_poster',
            'content', 'invite_venue', 'invite_date',
            'inviter', 'invitee',
            'ticket_image', 'ticket_image_url', 'username',
            'created_at', 'updated_at'
        )
        read_only_fields = ('user', 'created_at', 'updated_at')
        extra_kwargs = {
            'movie': {'required': True},
            'invite_venue': {'required': True},
            'invite_date': {'required': True},
            'inviter': {'required': True},
            'invitee': {'required': True},
            'ticket_image': {'required': True},
            'content': {'required': False}
        }

    def get_ticket_image_url(self, obj):
        if obj.ticket_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.ticket_image.url)
        return None