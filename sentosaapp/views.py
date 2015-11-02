from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.http import JsonResponse
from pysentosa.config import *
from pysentosa.tradeinfo import *
from pysentosa.data import YahooData

@login_required
def monitor(request):
    return render(request, 'sentosaapp/monitor.html')

def getPostions():
    result=CQuery().Query("select * from transaction")
    return dict(result.groupby('s').mean()['q'])

@login_required
def index(request):
    #positions = getPostions()
    ti = {}
    for s in SYMBOLS:
        ti[s] = getTI(s)
    return render(request, 'sentosaapp/sentosa.html',
                  {#'positions': positions,
                   'ti': ti,
                   'POSITION_STATUS': POSITION_STATUS,
                    }
                  )

# http://192.168.254.130/sentosaapp/tobj/YY/
@login_required
def tobj(request, sym):
    tinfo = getTI(sym)
    return render(request, 'sentosaapp/tobj.html',
                  {'tinfo': tinfo,
                   'sym' : sym,
                   'POSITION_STATUS': POSITION_STATUS,}
                  )

@login_required
def symbol(request, sym):
    tinfo = getTI(sym)
    return render(request, 'sentosaapp/symbol.html',
                  {'tinfo': tinfo,
                   'sym' : sym,
                   'POSITION_STATUS': POSITION_STATUS,}
                  )

datacache={}
@login_required
def data(request, sym, callback):
    global datacache
    if datacache.has_key(sym):
        d = datacache[sym]
    else:
        d = "("+YahooData(sym,'2010').getClosePrice()+");"
        datacache[sym] = d
    return render(request, 'sentosaapp/data.html',{'d': callback + d})
    #return HttpResponse("parent.Response_OK()", mimetype="application/x-javascript")

def error404(request):
    #return render(request, 'sentosaapp/404.html')
    from django.template import Context, loader
    template = loader.get_template('sentosaapp/404.html')
    context = Context({'message': 'All: %s' % request, })
    # 3. Return Template for this view + Data
    return HttpResponse(content=template.render(context), content_type='text/html; charset=utf-8', status=404)
