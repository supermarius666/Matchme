from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission, BaseUserManager

GENDER_CHOICES = [
    ('M', "Male"),
    ('F', "Female"),
    ('O', "Other")
]

# Per usare il metodo create_user() anche su user custom che estendono AbstractUser,
# bisogna creare la classe CustoUserManager e nella classe user custom aggiungere campo objects = CustomUserManager()
class CustomUserManager(BaseUserManager):
    def create_user(self, username, email=None, password=None, **extra_fields):
        if not username:
            raise ValueError('Il campo username è obbligatorio')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, email, password, **extra_fields)

class UserProfile(AbstractUser):
    # AbstractUser already provides:
    # - username
    # - first_name
    # - last_name
    # - email
    # - password
    # - is_staff
    # - is_active
    # - is_superuser
    # - last_login
    # - date_joined

    profile_picture = models.ImageField(
        upload_to='profile_pics', # Image will be saved to MEDIA_ROOT/profile_pic/ (MEDIA_ROOT path specified in settings.py)
        default='profile_pics/default_profile_pic.png'
    )

    cover_picture = models.ImageField(
        upload_to='cover_pics', # Image will be saved to MEDIA_ROOT/profile_pic/ (MEDIA_ROOT path specified in settings.py)
        default='cover_pics/default_cover_pic.png'
    )

    gender = models.CharField(
        max_length=1,
        choices=GENDER_CHOICES,
        default='O'
    )

    biography = models.CharField(
        max_length=255,
        blank=True
    )

    online = models.BooleanField(
        blank=False,
        default=False
    )

    # Groups e Permissions sono concetti che indicano cosa possono fare gli utenti autenticati
    # AbstractUser possiede un campo groups e user_permission di tipo ManyToMany (una ForeignKey doppia)
    # --> Li possiedono anche UserProfile e User essendo figli di AbstractUser

    # In Django esistono i Reverse Accessors che sono un campo della classe alla quale si fa foreign key o manytomanyfield
    # (User fa foreign key su Group --> Group presenta un reverse accessor per User)
    # (in questo modo non solo User può accedere a Group tramite f.k. ma anche Group può accedere a User)

    # Group possiede un reverse accessor per AbstractUser, 
    # --> ma ora essendoci due tipi AbstractUser (UserProfile o User) non sa a chi riferirsi dei due 
    # --> bisogna rinominare il nome della foreign key/manytomanyfield in UserProfile per far si che Group abbia
    #       due reverse accessors (uno per UserProfile e l'altro per User) e evitare conflitti
    #       (altrimenti Group non saprebbe a chi riferirsi)
    #       [stessa cosa per Permissions]

    # Add unique related_name for groups and user_permissions
    groups = models.ManyToManyField(
        Group,
        blank=True,
        related_name="user_profiles"
    )

    user_permissions = models.ManyToManyField(
        Permission,
        blank=True,
        related_name="user_profiles"
    )

    objects = CustomUserManager()

    def __str__(self):
        return self.username

    # Add custom methods


class UserPreferences(models.Model):
    user = models.OneToOneField(
        UserProfile,
        on_delete=models.CASCADE,
        related_name='preferences'
    )

    # Fields TBD
    musica = models.BooleanField(default=False)
    videogiochi = models.BooleanField(default=False)
    sport = models.BooleanField(default=False)
    viaggi = models.BooleanField(default=False)
    arte = models.BooleanField(default=False)
    lettura = models.BooleanField(default=False)
    cucina = models.BooleanField(default=False)
    spiritualita = models.BooleanField(default=False)
    moda = models.BooleanField(default=False)
    cinema_serie = models.BooleanField(default=False)
    fotografia = models.BooleanField(default=False)
    natura = models.BooleanField(default=False)
    uscite_romantiche = models.BooleanField(default=False)
    spontaneita = models.BooleanField(default=False)
    relazione_seria = models.BooleanField(default=False)
    avventure = models.BooleanField(default=False)
    ballo = models.BooleanField(default=False)
    amicizia = models.BooleanField(default=False)
    tecnologia = models.BooleanField(default=False)
    volontariato = models.BooleanField(default=False)
    goth = models.BooleanField(default=False)
    casual = models.BooleanField(default=False)
    animali = models.BooleanField(default=False)
    commedia = models.BooleanField(default=False)
    passeggiate = models.BooleanField(default=False)
    filosofia = models.BooleanField(default=False)
    relax = models.BooleanField(default=False)
    lavoro = models.BooleanField(default=False)
    crescita_personale = models.BooleanField(default=False)
    cultura = models.BooleanField(default=False)
    minimalismo = models.BooleanField(default=False)


class UserStats(models.Model):
    user = models.OneToOneField(
        UserProfile, # Use settings.AUTH_USER_MODEL for forward compatibility
        on_delete=models.CASCADE, # If the user is deleted, delete their preferences
        related_name='user_stats' # You can specify a related_name for clearer reverse access
    )

    match_counter = models.IntegerField(
        default=0
    )

    like_sent_counter = models.IntegerField(
        default=0
    )

    dislike_sent_counter = models.IntegerField(
        default=0
    )

    # match_counter / like_sent_counter
    match_rate = models.FloatField(
        default=0.0
    )

    like_recv_counter = models.IntegerField(
        default=0
    )

    dislike_recv_counter = models.IntegerField(
        default=0
    )

    registration_day = models.DateField(
        # default=None # TODO vedi meglio
    )

    def __str__(self):
        return f"{self.user} has match rate: {self.match_rate}" 
