$(function() {
    var m = _mkdata.length;

    var ts_bid = new TimeSeries();
    var ts_ask = new TimeSeries();
    var ts_lp = new TimeSeries();

    var content = "";
    content += '<table class="table table-striped table-bordered table-condensed" id="_mkdata1">';
    content += '<thead><tr class="success">';
    for(var i=1; i<m; ++i){
      content += '<th width="15">' + _mkdata[i];
    }
    content += '</thead><tbody>';

    //for(var i=0; i<symbols.length; i++){
    content += "<tr>";
    for (var j=1; j<m; j++){
      content += "<td id=" + sym + '_' + _mkdata[j] +"></td>";
    }
    //}
    content += "</tbody></table>";

    /*content += '<table class="table table-striped table-bordered table-condensed" id="_mkdata2">';
    content += '<thead><tr class="success">';
    for(var i=m/2; i<m; ++i){
      content += '<th width="15">' + _mkdata[i];
    }
    content += '</thead><tbody>';

    //for(var i=0; i<symbols.length; i++){
    content += "<tr>";
    for (var j=m/2; j<m; j++){
      content += "<td id=" + sym + '_' + _mkdata[j] +"></td>";
    }
    //}
    content += "</tbody></table>";*/

    content += '<table class="table table-striped table-bordered table-condensed" id="_mkdata3">';
    content += '<thead><tr class="success">';
    for(var i=1; i<_mkstat.length; ++i){
      content += '<th width="15">' + _mkstat[i];
    }
    content += "<tr>";
    for (var j=1; j<_mkstat.length; j++){
      content += "<td id=" + sym + '_' + _mkstat[j] +"></td>";
    }
    content += '</thead><tbody>';
    $('#_mkdata_table').append(content);

    ////////////////////////////////////////////////////////////////////////////////

    //createtable($('#_order_table'),_order,1,sym);
    createtable($('#_tinfo_table'),_tinfo,1,sym);
    createtable($('#_portfolio'),_portfolio,0,'_portfolio');

    createOrderTable($('#_order_div'),_order,0,null);

    ////////////////////////////////////////////////////////////////////////////////
    var $message = $('#message');
    var $log = $('#log');

    ws.onopen = function(){
      $message.attr("class", 'label label-success');
      $message.text('open');
    };

    ws.onmessage = function(ev){
      if (ev.data=='z'){
        //sendmsg(ws,'B'+sym)
        setInterval(sendmsg,1500,ws,'B'+sym);
        cachedata = lscache.get(sym);
        RenderSymbolPage(cachedata, false, sym, ts_bid, ts_ask, ts_lp);
        return;
      }else if(ev.data=='o'){//No order
        var cache_key = 'cache_orders_'+sym;
        clearOrderTable(lscache.get(cache_key));
        lscache.remove('orders');
        return;
      }
      var start = new Date().getTime();
      showtext($message,ev.data);
      var json = JSON.parse(ev.data);
      RenderSymbolPage(json, true, sym, ts_bid, ts_ask, ts_lp);
      var end = new Date().getTime();
      var time = end - start;
      $("#timecost").text(time + 'ms');

    };

    ws.onclose = function(ev){
      $message.attr("class", 'label label-warning');
      $message.text('closed');
    };

    ws.onerror = function(ev){
      $message.attr("class", 'label label-danger');
      $message.text('error!');
    };

    {
      $("#Tradeinfo").tablesorter();
      $("#_mkdata").tablesorter();
      $("#_tinfo").tablesorter();
    }

    function createTimeline(ts_bid,ts_ask,ts_lp) {
      var chart = new SmoothieChart({grid:{fillStyle:'transparent'}});
      chart.addTimeSeries(ts_bid, { strokeStyle:'rgb(120, 200, 120)', fillStyle:'rgba(0, 255, 0, 0.6)', lineWidth:1 });
      chart.addTimeSeries(ts_ask, { strokeStyle:'rgb(205, 100, 0)', fillStyle:'rgba(255, 55, 0, 0.5)', lineWidth:1 });
      chart.addTimeSeries(ts_lp,  { strokeStyle:'rgb(100, 100, 255)', fillStyle:'transparent', lineWidth:1 });
      chart.streamTo(document.getElementById("chart"), 50);
    }
    createTimeline(ts_bid,ts_ask,ts_lp);
    document.getElementById("chart").width  = $('#chart').parent().width();
});
