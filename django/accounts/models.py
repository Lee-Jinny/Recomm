from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    SECURITY_QUESTIONS = [
        ('Q1', '가장 좋아하는 영화 장르는?'),
        ('Q2', '가장 싫어하는 영화 등장인물은?'),
        ('Q3', '영화 속 장소 중 가장 가보고 싶은 곳은?'),
        ('Q4', '영화에 출연하게 된다면 어떤 이름을 가지고 싶나요?'),
        ('Q5', '3반 디자인팀장 이름은?'),
        ('Q6', '3반 DJ 이름은?'),
    ]

    
    nick_name = models.CharField(max_length=10)
    security_question = models.CharField(
        max_length=2,
        choices=SECURITY_QUESTIONS
    )
    security_answer = models.CharField(max_length=200)
    profile_image = models.CharField(max_length=200, blank=True)
    