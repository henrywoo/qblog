#!/usr/bin/env python
from tornado.options import options, define, parse_command_line
from tornado.log import enable_pretty_logging
from tornado import httpserver, ioloop, web, wsgi
import django.core.handlers.wsgi
import colored_traceback.always
import os, sys
from pysentosa.config import LOCALIP


project_name = 'qblog'

_HERE = os.path.dirname(os.path.abspath(__file__))
print _HERE
sys.path.append(_HERE)
os.environ['DJANGO_SETTINGS_MODULE'] = project_name + '.settings'
os.environ['PYTHONPATH'] = '.'

print django.VERSION

if django.VERSION[1] > 5:
    django.setup()

define('port', type=int, default=80)

class MultiStaticFileHandler(web.StaticFileHandler):
    def initialize(self, paths):
        self.paths = paths

    def get(self, path):
        for p in self.paths:
            if not os.path.exists(p + "/" + path):
              continue
            super(MultiStaticFileHandler, self).initialize(p)
            return super(MultiStaticFileHandler, self).get(path)
        return web.HTTPError(404)

def main():
  parse_command_line()
  enable_pretty_logging()
  wsgi_app = wsgi.WSGIContainer(django.core.handlers.wsgi.WSGIHandler())
  staticpath=[
        _HERE+"/static/",
        "/usr/local/lib/python2.7/dist-packages/django/contrib/admin/static/",
        "/usr/local/lib/python2.7/dist-packages/django_admin_bootstrapped/static/",
        "/usr/local/lib/python2.7/dist-packages/bootstrap_markdown/static/",
  ]
  mapping = [(r'/(favicon.ico)', web.StaticFileHandler, {'path': _HERE + "/static"}),
              (r'/static/(.*)', MultiStaticFileHandler, {'paths': staticpath}),
              ('.*', web.FallbackHandler, dict(fallback=wsgi_app)),
  ]
  tornado_app = web.Application(mapping, debug=True)
  server = httpserver.HTTPServer(tornado_app)
  server.listen(options.port)
  print "http://{}:{}".format(LOCALIP, options.port)
  try:
    ioloop.IOLoop.instance().start()
  except KeyboardInterrupt:
    ioloop.IOLoop.instance().stop()
  print "Finished"


if __name__ == '__main__':
    main()
