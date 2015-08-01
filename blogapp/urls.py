from django.conf.urls import include, url
from . import views
from django.views.generic.dates import ArchiveIndexView
from blogapp.views import ArticleMonthArchiveView
from .models import Post

urlpatterns = [
    url(r'^$', views.index),
    url(r'^about$', views.about),
    url(r'^blog$', views.post_list),
    url(r'^drafts/$', views.post_draft_list, name='post_draft_list'),
    url(r'^post/(?P<pk>[0-9]+)/publish/$', views.post_publish, name='post_publish'),
    url(r'^post/(?P<pk>[0-9]+)/remove/$', views.post_remove, name='post_remove'),
    url(r'^post/(?P<pk>[0-9]+)/$', views.post_detail),
    url(r'^post/new/$', views.post_new, name='post_new'),
    url(r'^post/(?P<pk>[0-9]+)/edit/$', views.post_edit, name='post_edit'),
    url(r'^archive/$',
        ArchiveIndexView.as_view(model=Post, date_field="published_date"),
        name="post_archive"),
    # Example: /2012/aug/
    url(r'^(?P<year>[0-9]{4})/(?P<month>[-\w]+)/$',
        ArticleMonthArchiveView.as_view(),
        name="archive_month"),
    # Example: /2012/08/
    url(r'^(?P<year>[0-9]{4})/(?P<month>[0-9]+)/$',
        ArticleMonthArchiveView.as_view(month_format='%m'),
        name="archive_month_numeric"),
]
