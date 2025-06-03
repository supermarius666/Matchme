from django.db import models

# Create your models here.
class Event(models.Model):
    title = models.CharField(max_length=255)
    image = models.ImageField(upload_to='events_pics/')
    description = models.TextField()
    date = models.DateTimeField()
    location = models.CharField(max_length=255)

    def __str__(self):
        return self.title


class Place(models.Model):
    name = models.CharField(max_length=255)
    image = models.ImageField(upload_to='places_pics/')
    latitude = models.FloatField()
    longitude = models.FloatField()
    description_intro = models.TextField(blank=True, null=True)
    description_couples = models.TextField(blank=True, null=True)
    description_history = models.TextField(blank=True, null=True)
    description_outro = models.TextField(blank=True, null=True)
    link1 = models.URLField(blank=True, null=True)
    link2 = models.URLField(blank=True, null=True)
    
    def __str__(self):
        return self.name.replace('_', ' ').title()
    