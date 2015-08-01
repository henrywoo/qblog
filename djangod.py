#!/usr/bin/env python
# python ../mysite/djangod.py runserver 192.168.122.10:8000
import sys 
import os
..
class Daemon(object):
  def __init__(self):
    self.stdin  ='/dev/null'
    self.stdout ='/dev/null'
    self.stderr ='/dev/null'

  def daemonize(self):
    try:
      pid = os.fork()
      if pid > 0:
        sys.exit(0)
    except OSError, e:
      sys.exit(1)

    os.setsid()
    os.umask(0)

    try:
      pid = os.fork()
      if pid > 0:
        sys.exit(0)
    except OSError, e:
      sys.exit(1)

    sys.stdout.flush()
    sys.stderr.flush()
    si = file(self.stdin, 'r')
    so = file(self.stdout, 'a+')
    se = file(self.stderr, 'a+', 0)
    os.dup2(si.fileno(), sys.stdin.fileno())
    os.dup2(so.fileno(), sys.stdout.fileno())
    os.dup2(se.fileno(), sys.stderr.fileno())

    self.run()

  def run(self):
    ''''''

class DjangoDaemon(Daemon):
  def run(self):
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "qblog.settings")
    from django.core.management import execute_from_command_line
    execute_from_command_line(sys.argv)

if __name__ == "__main__":
  daemon = DjangoDaemon()
  daemon.daemonize()
