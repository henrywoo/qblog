//var _mkdata=[ "sym","pos", "avgP", "LP", "bid", "ask", "bs", "as", "OCVol", "OPVol", "PCVOR", "OCOI", "OPOI", "PCOIR", "vrate", "trate", "LRTH", "sal"];
//var _tinfo = [ "sym", "uPNL","aPNL","vo","ps", "statuz", "inve", "lcc", "cR"];

var _mkdata = ["sym", "uPNL", "aPNL", "cR", "statuz", "pos", "avgP", "LP", "bid", "ask", "bs", "as", "OCVol", "OPVol", "PCVOR", "OCOI", "OPOI", "PCOIR", "vrate", "trate", "LRTH", "sal", "lcc"];
var _tinfo = ["sym", "vo", "ps", "inve"];
var _mkstat = ["H", "L", "C", "O", "WH13", "WL13", "WH26", "WL26", "WH52", "WL52"];
var _portfolio = ["uPNL", "aPNL", "lcc", "inve", "cR", "nlc"];
var _status = ["NP",
  "OTL", //open trade with long position
  "OTS", //open trade with short position
  "DELIMITER",
  "LWaitC", //Original long position waiting to be closed
  "LWaitC2", //Ackownledged
  "SWaitC", //Original short position waiting to be closed
  "SWaitC2",
  "NWaitL", //Original no position waiting buy order filled
  "NWaitL2",
  "NWaitS", //Original no position waiting sell order filled
  "NWaitS2"
];
var _order = [
  "sym", //sym,
  "id", //orderId,
  "ac", //action,
  "tq", //totalQuantity,
  "t", //orderType,
  "lp", //lmtPrice,
  "s", //status,
  "a", //allowedMove,
  "d", //distance,
  "afp", //avgFillPrice,
  "lfp", //lastFillPrice,
  "f", //filled,
  "r", //remaining,
  "c" //createTime
];

function sendmsg(w, s) {
  w.send(s);
}

function showtext(x, y, len) {
  len = typeof len !== 'undefined' ? len : 200;
  if (y.length > len) {
    x.text(y.substring(0, len) + "...");
  } else {
    x.text(y);
  }
}

function createtable(node, colnames, from, sym) {
  var t = colnames.length;
  content = "";
  content += '<table class="table table-striped table-bordered table-condensed">';
  content += '<thead><tr class="success">';
  for (var i = from; i < t; ++i) {
    content += '<th>' + colnames[i];
  }
  content += '</thead><tbody>';
  if (Array.isArray(sym)) {
    for (i = 0; i < sym.length; i++) {
      content += "<tr>";
      for (var j = from; j < t; ++j) {
        content += "<td id=" + sym[i] + '_' + colnames[j] + "></td>";
      }
    }
  } else {
    content += "<tr>";
    for (var j = from; j < t; ++j) {
      content += "<td id=" + sym + '_' + colnames[j] + "></td>";
    }
  }
  content += "</tbody></table>";
  node.append(content);
}

function createOrderTable(node, colnames, from, json) {
  var t = colnames.length;
  content = '<table class="table table-striped table-condensed" id="order_table"><thead><tr class="success">';
  for (var i = from; i < t; ++i) {
    content += '<th>' + colnames[i];
  }
  content += '</thead><tbody>';
  if (json != null) {
    content += "<tr>";
    for (var j = from; j < t; ++j) {
      content += "<td id=order_" + json.sym + '_' + colnames[i] + ">" + json[colnames[i]] + "</td>";
    }
  }
  content += "</tbody></table>";
  node.append(content);
}

/*
if(d.hasOwnProperty('order')){
  renderOrderTable(d.order);
}*/
function renderOrderTable(json, colnames) {
  colnames = typeof colnames !== 'undefined' ? colnames : _order;
  var ordertable = $("#order_table");

  if (json.sym == null) {
    alert('NO ORDER SYM');
  }
  var tmp = $('#order_' + json.sym + '_' + colnames[0]);
  if (tmp.length == 0) {
    content = "<tr id='tr_orderid_" + json.id + "'>";
    for (var property in json) {
      content += "<td id='order_" + json.sym + '_' + property + "'>";
      if (property=='sym'){
        content += "<a href='symbol/"+ json[property] +"' target=_blank>";
      }
      content += json[property];
      if (property=='sym'){
        content += "</a>";
      }
      content += "</td>";
    }
    $('#order_table > tbody:last-child').append(content);
  } else {
    for (var j = 0; j < colnames.length; ++j) {
      tmp = $('#order_' + json.sym + '_' + colnames[j]);
      if (tmp.text() != json[colnames[j]]) {
        tmp.text(json[colnames[j]]);
      }
    }
  }
}

$("#clearportfolio").click(function() {
  ws.send("e");
});

function getoids(orders) {
  var ids= new Array();
  for (var i = 0; i < orders.length; i++) {
    ids.push(orders[i].order.id);
  }
  return ids;
}

function clearOrderTable(ordercache){
  //ordercache = lscache.get('orders');
  oldids = getoids(ordercache.orders);
  for (var i = 0; i < oldids.length; i++) {
    $('table#order_table tr#' + 'tr_orderid_' + oldids[i]).remove();
  }
}

function renderFullpage(json, cacheit) {
  if (json == null) {
    return;
  }
  if (json.hasOwnProperty('dt')) {
    $('#servertime').text(json.dt); //server time
  }

  if (json.hasOwnProperty('orders')) {
    orders = lscache.get('orders');
    if (orders == null) {
      for (var i = 0; i < json.orders.length; ++i) {
        renderOrderTable(json.orders[i].order);
      }
    } else {
      oldids = getoids(orders.orders);
      newids = getoids(json.orders);
      var diff = $(oldids).not(newids).get();
      for (var i = 0; i < diff.length; i++) {
        $('table#order_table tr#' + 'tr_orderid_' + diff[i]).remove();
      }
      for (var i = 0; i < json.orders.length; ++i) {
        renderOrderTable(json.orders[i].order);
      }

    }
    lscache.remove('orders');
    lscache.set('orders', json);
  }


  if (json.hasOwnProperty('data')) {
    if (cacheit) {
      var cachedata = lscache.get('data');
      if (cachedata == null){
        lscache.set('data', json);
      }else if (json.data.length > cachedata.length) {
        lscache.remove('data');
        lscache.set('data', json);
      }
    }


    var d;
    var l = json.data.length;
    var t;
    var $tmp;
    var s = '';
    var o;
    for (var i = 0; i < l; ++i) {
      d = json.data[i];
      if (d.hasOwnProperty('_tinfo')) {
        for (var property in d._tinfo) {
          cid = '#' + d._tinfo.sym + '_' + property; //#NQ_sym
          $tmp = $(cid);

          o = $tmp.text();
          if (o.length == 0 || property != 'sym') {
            if (o.length == 0) {
              $tmp.attr("class", "bg-info");
              if (property == 'statuz') {
                $tmp.text(_status[d._tinfo[property]]);
              } else {
                $tmp.text(d._tinfo[property]);
              }
            } else {
              if ($tmp.hasClass('bg-info')) {
                $tmp.attr("class", "bg-warning");
              } else if ($tmp.hasClass('bg-warning')) {
                $tmp.attr("class", "bg-danger");
              } else {
                $tmp.attr("class", "bg-warning");
              }
              if (property == 'statuz') {
                $tmp.text(_status[d._tinfo[property]]);
              } else {
                $tmp.text(d._tinfo[property]);
              }
              $tmp.hide();
              $tmp.fadeIn("fast");
            }
          }
        }
      } else if (d.hasOwnProperty('_mkdata')) {
        for (var property in d._mkdata) {
          cid = '#' + d._mkdata.sym + '_' + property;
          $tmp = $(cid);
          o = $tmp.text();
          if (o.length == 0 || property != 'sym') {
            if (o.length == 0) {
              $tmp.attr("class", "bg-info");
              $tmp.text(d._mkdata[property]);
            } else {
              if ($tmp.hasClass('bg-info')) {
                $tmp.attr("class", "bg-warning");
              } else if ($tmp.hasClass('bg-warning')) {
                $tmp.attr("class", "bg-danger");
              } else {
                $tmp.attr("class", "bg-warning");
              }
              $tmp.text(d._mkdata[property]);
              $tmp.hide();
              $tmp.fadeIn("fast");
            }
          }
        }
      } else if (d.hasOwnProperty('_portfolio')) {
        for (var property in d._portfolio) {
          $tmp = $('#_portfolio' + '_' + property);
          $tmp.hide();
          $tmp.fadeIn("slow");
          $tmp.text(d._portfolio[property]);
        }
      } else if (d.hasOwnProperty('bar5s')) {
        /*for (var property in d.bar5s) {
          $log.val($log.val() + d.bar5s[property]);
        }*/
      } else if (d.hasOwnProperty('bar1d')) {
        /*for (var property in d.bar1d) {
          $log.val($log.val() + d.bar1d[property]);
        }*/
      } // else if (d.hasOwnProperty('order')) {
      //renderOrderTable(d.order);
      //}
      else if (d.hasOwnProperty('accinfo')){
        $('#FullAvailableFunds_S').text(d.accinfo.FullAvailableFunds_S);
        $('#RealizedPnL').text(d.accinfo.RealizedPnL);
        $('#UnrealizedPnL').text(d.accinfo.UnrealizedPnL);
        $('#NetLiquidation_S').text(d.accinfo.NetLiquidation_S);
      }

    }
    $("table").trigger("update");
  }


}


function RenderSymbolPage(json, cacheit, sym, ts_bid, ts_ask, ts_lp) {
  if (json.hasOwnProperty('dt')) {
    $('#servertime').text(json.dt); //server time
  }

  if (json.hasOwnProperty('orders')) {
    var cache_key = 'cache_orders_'+sym;
    var oldjson = lscache.get(cache_key);
    if (oldjson == null) {
      for (var i = 0; i < json.orders.length; ++i) {
        renderOrderTable(json.orders[i].order);
      }
    } else {
      oldids = getoids(oldjson.orders);
      newids = getoids(json.orders);
      var diff = $(oldids).not(newids).get();
      for (var i = 0; i < diff.length; i++) {
        $('table#order_table tr#' + 'tr_orderid_' + diff[i]).remove();
      }
      for (var i = 0; i < json.orders.length; ++i) {
        renderOrderTable(json.orders[i].order);
      }

    }
    lscache.remove(cache_key);
    lscache.set(cache_key,json);
  }

  if (json.hasOwnProperty('data')) {
    if (cacheit) {
      if (json.data[0].hasOwnProperty('_tinfo') &&
        json.data[1].hasOwnProperty('_mkdata')) {
        lscache.remove(sym)
        lscache.set(sym, json);
      }
    }
    var d;
    var l = json.data.length;
    var t;
    var $tmp;
    var s = '';
    var o;
    for (var i = 0; i < l; ++i) {
      d = json.data[i];
      if (d.hasOwnProperty('_tinfo')) {
        //if (d._tinfo.syms!=sym){continue;}
        for (var property in d._tinfo) {
          $tmp = $('#' + d._tinfo.sym + '_' + property);

          o = $tmp.text();
          if (o.length == 0 || property != 'sym') {
            if (o.length == 0) {
              $tmp.attr("class", "bg-info");
              if (property == 'statuz') {
                $tmp.text(_status[d._tinfo[property]]);
              } else {
                $tmp.text(d._tinfo[property]);
              }
            } else {
              if ($tmp.hasClass('bg-info')) {
                $tmp.attr("class", "bg-warning");
              } else if ($tmp.hasClass('bg-warning')) {
                $tmp.attr("class", "bg-danger");
              } else {
                $tmp.attr("class", "bg-warning");
              }
              if (property == 'statuz') {
                $tmp.text(_status[d._tinfo[property]]);
              } else {
                $tmp.text(d._tinfo[property]);
              }
              $tmp.hide();
              $tmp.fadeIn("fast");
            }
          }
        }
      } else if (d.hasOwnProperty('_mkdata')) {
        for (var property in d._mkdata) {
          $tmp = $('#' + sym + '_' + property);
          o = $tmp.text();
          if (o.length == 0 || property != 'sym') {
            if (o.length == 0) {
              $tmp.attr("class", "bg-info");
              $tmp.text(d._mkdata[property]);
            } else {
              if ($tmp.hasClass('bg-info')) {
                $tmp.attr("class", "bg-warning");
              } else if ($tmp.hasClass('bg-warning')) {
                $tmp.attr("class", "bg-danger");
              } else {
                $tmp.attr("class", "bg-warning");
              }
              $tmp.text(d._mkdata[property]);
              $tmp.hide();
              $tmp.fadeIn("fast");
            }
          }

          var nt = new Date().getTime();
          if (property == 'bid' && parseFloat(d._mkdata[property]) > 0) {
            ts_bid.append(nt, d._mkdata[property]);
          } else if (property == 'ask' && parseFloat(d._mkdata[property]) > 0) {
            ts_ask.append(nt, d._mkdata[property]);
          } else if (property == 'LP' && parseFloat(d._mkdata[property]) > 0) {
            ts_lp.append(nt, d._mkdata[property]);
          }
        }
        tableinitialized = true;
      } else if (d.hasOwnProperty('mktstatic')) {
        for (var property in d.mktstatic) {
          if (d.mktstatic.sym != sym) {
            continue;
          }
          $tmp = $('#' + sym + '_' + property);
          $tmp.hide();
          $tmp.fadeIn("slow");
          $tmp.text(d.mktstatic[property]);
        }
      } else if (d.hasOwnProperty('_portfolio')) {
        for (var property in d._portfolio) {
          //if (d._portfolio.hasOwnProperty(property)) {
          $tmp = $('#_portfolio' + '_' + property);
          //o=$tmp.text();
          //if (o != d._portfolio[property]){
          $tmp.hide();
          $tmp.fadeIn("slow");
          $tmp.text(d._portfolio[property]);
          //}
          //}
        }
      }
      /*else if(d.hasOwnProperty('bar5s')){
                  for (var property in d.bar5s) {
                    $log.val($log.val()+d.bar5s[property]);
                  }
                }else if(d.hasOwnProperty('bar1d')){
                  for (var property in d.bar1d) {
                    $log.val($log.val()+d.bar1d[property]);
                  }
                }*/
      else if (d.hasOwnProperty('order')) {
        for (var property in d.order) {
          //if (d.order.sym!=sym){continue;}
          $tmp = $('#' + sym + '_' + property);
          if ($tmp.text() != d.order[property]) {
            $tmp.hide();
            $tmp.fadeIn("slow");
            $tmp.text(d.order[property]);
          }
        }
      }
    }
    $("table").trigger("update");
  }
  /////////////////////////////////////////////////////////////
}
