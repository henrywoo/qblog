#!/usr/bin/python
# -*- coding: utf-8 -*-
from __future__ import absolute_import  # Python 2 only

from django.contrib.staticfiles.storage import staticfiles_storage
from django.core.urlresolvers import reverse

from jinja2 import Environment
from pysentosa.config import *
#from pysentosa.utils import getLastPrice
#from pysentosa.tradeinfo import getTI

# https://docs.djangoproject.com/en/1.8/topics/templates/#django.template.backends.base.Template.render
def environment(**options):
    env = Environment(**options)
    env.globals.update({
        'static': staticfiles_storage.url,
        'url': reverse,
        'ip': LOCALIP,
        'domain': 'www.quant365.com',
        'title': "Quant365",
        'anno': "Trading with science and techonlogy",
        #'cquery': CQuery(),
        #'getLastPrice': getLastPrice,
        #'getTI': getTI,
    })
    env.globals.update(yml_sentosa)
    env.globals.update(yml_holiday)
    env.globals.update({'SYMBOLS': SYMBOLS})
    return env

if __name__ == "__main__":
    print yml_sentosa
