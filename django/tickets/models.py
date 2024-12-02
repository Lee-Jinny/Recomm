from django.db import models
from django.conf import settings

class Ticket(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tickets')
    movie = models.ForeignKey('movies.Movie', on_delete=models.CASCADE)
    content = models.TextField(null=True, blank=True)  # 메시지 내용
    invite_venue = models.CharField(max_length=200)    # 초대 장소
    invite_date = models.DateTimeField()              # 초대 일시
    inviter = models.CharField(max_length=30)              
    invitee = models.CharField(max_length=30)       
    ticket_image = models.ImageField(upload_to='tickets/')  # 생성된 티켓 이미지
    created_at = models.DateTimeField(auto_now_add=True)   # 생성 시간
    updated_at = models.DateTimeField(auto_now=True)       # 수정 시간

    def delete(self, *args, **kwargs):
        # 티켓 삭제 시 이미지 파일도 함께 삭제
        if self.ticket_image:
            self.ticket_image.delete()
        super().delete(*args, **kwargs)