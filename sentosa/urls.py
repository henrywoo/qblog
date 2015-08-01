from django.conf.urls import include, url
from . import views

urlpatterns = [
    url(r'^$', views.index),
    url(r'^monitor/$', views.monitor, name='monitor'),
    url(r'^tobj/(?P<sym>\w{0,50})/$', views.tobj, name='tobj'),
    url(r'^symbol/(?P<sym>\w{0,50})/$', views.symbol, name='symbol'),
    url(r'^data/(?P<sym>\w{0,50})/callback=(?P<callback>\w{0,50}).*?$', views.data, name='data'),
]
# http://192.168.254.130/sentosa/data/AAPL/?callback=jQuery182028521879474689993_1436767563812&_=1436767564189