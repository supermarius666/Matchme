from django.db import models
from apps.accounts.models import UserProfile
#from apps.feed.models import Match

# NOTA: avendo Match una primary key su ChatRoom, nella chatroom si può accedere a due user
# con una query nel database
class ChatRoom(models.Model):
    #id = models.AutoField(
    #    primary_key=True
    #)

    #room = models.ForeignKey(
    #    Match,
    #    on_delete=models.CASCADE,
    #    null=True
    #)

    name = models.CharField(
        max_length=255,
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

    # utente che ha spedito il messaggio
    user_sender = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE
    ) 

    message_payload = models.CharField(
        max_length=1000
    )

    time_stamp = models.DateTimeField(

    )

    def __str__(self):
        return f"[{self.room.name}] {self.user_sender} : \"{self.message_payload}\" | {self.time_stamp}"
