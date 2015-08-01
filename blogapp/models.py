from django.db import models
from django.utils import timezone
from taggit.managers import TaggableManager

# https://github.com/alex/django-taggit
class Post(models.Model):

    author = models.ForeignKey('auth.User')
    title = models.CharField(max_length=400)
    text = models.TextField()

    created_date = models.DateTimeField(default=timezone.now)
    published_date = models.DateTimeField(blank=True, null=True)
    tags = TaggableManager()

    def publish(self):
        self.published_date = timezone.now()
        self.save()

    def __unicode__(self):
        return self.title
