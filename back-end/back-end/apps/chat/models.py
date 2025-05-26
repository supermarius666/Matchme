from django.db import models
from apps.accounts.models import UserProfile

# NOTA: avendo Match una primary key su ChatRoom, nella chatroom si può accedere a due user
# con una query nel database
class ChatRoom(models.Model):
    room_id = models.AutoField(
        primary_key=True
    )

    user1 = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name="user1"
    )

    user2 = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name="user2"
    )

class Message(models.Model):
    room = models.ForeignKey(
        ChatRoom,
        on_delete=models.CASCADE, 
    )

    message_payload = models.CharField(
        max_length=1000
    )

    time_stamp = models.DateTimeField(

    )
