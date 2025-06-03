from django.db import models
from apps.accounts.models import UserProfile
from apps.chat.models import ChatRoom
from django.db.models import Q, F

STATUS_CHOICES = [
    ("PENDING", "Pending"),
    ("MATCHED", "Matched"),
    ("NOT_MATCHED", "Not_Matched")
]

class Match(models.Model):
    user_sending = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name="user_sending"
    )

    user_receiving = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name="user_receiving"
    )

    room = models.ForeignKey(
        ChatRoom,
        on_delete=models.CASCADE,
        null=True
    )

    status = models.CharField(
        max_length=12,
        choices=STATUS_CHOICES,
        default="NOT_MATCHED"
    )

    class Meta:
        constraints = [
            # Ensures the combination of user_sending, user_receiving, room is unique
            # Django doesn't implement multiple field primary keys (we have to use Unique together)
            models.UniqueConstraint(
                fields=["user_sending", "user_receiving", "room"],
                name="unique_constraint"
            ),
            # TODO mettere constraint che fa user1 < user2 per evitare ridondanze (a,b) (b,a) (a,a) (b,b)
        ]

    def __str__(self):
        if self.status == "PENDING":
            return f"{self.user_sending} waiting {self.user_receiving} to match too"
        elif self.status == "MATCHED":
            return f"Match between {self.user_sending} and {self.user_receiving}"
        else:
            return f"{self.user_sending} and {self.user_receiving} still NOT Matched"
        
class Post(models.Model):
    user = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE
    )

    post_pic = models.ImageField(
        upload_to="post_pics", # Image will be saved to MEDIA_ROOT/post_pics/ (MEDIA_ROOT path specified in settings.py)
    )

    text = models.CharField(
        max_length=1000
    )

    time_stamp = models.DateTimeField(
        null=True,
        blank=True
    )