$(function() {
    //http://stackoverflow.com/questions/3722646/jquery-table-sorting-problem-with-dynamically-added-rows
    /* http://stackoverflow.com/questions/8749236/create-table-with-jquery-append */
    var content = "";
    content += '<table class="table table-striped table-condensed" id="_mkdata">';
    content += '<thead><tr class="success"><th>ID<th>SYM';
    var m = _mkdata.length;
    for(var i=1;i<m;++i){
        content += '<th>' + _mkdata[i];
    }
    content += '</thead><tbody>';

    for(var i=0; i<symbols.length; i++){
        content += "<tr><td>" + (i+1) + "<td><a href='symbol/"+symbols[i]+"' target=_blank>" + symbols[i]+"</a>";
        for (var j=1;j<_mkdata.length;j++){
            content += "<td id=" + symbols[i] + '_' + _mkdata[j] +"></td>";
        }
    }
    content += "</tbody></table>";
    $('#_mkdata_table').append(content);


    content = "";
    content += '<table class="table table-striped table-condensed">';
    content += '<tr class="success">';
    for(var i=0;i<_portfolio.length;++i){
      content += '<th>' + _portfolio[i];
    }
    content += '<tr>';
    for(var i=0; i<_portfolio.length; i++){
      content += '<td id="_portfolio' + '_' + _portfolio[i] +'">';
    }
    content += "</tbody></table>";
    $('#_portfolio').append(content);


    var $message = $('#message');
    var $log = $('#log');

    createOrderTable($('#_order_div'),_order,0,null);

    var refreshIntervalId;

    ws.onopen = function(){
      $message.attr("class", 'label label-success');
      $message.text('open');
    };

    ws.onmessage = function(ev){
      if (ev.data=='z'){
        //sendmsg(ws,'A')
        refreshIntervalId = setInterval(sendmsg,2000,ws,'A');
        cachedata = lscache.get('data');
        renderFullpage(cachedata, false);
        return;
      }else if(ev.data=='o'){//No order
        clearOrderTable(lscache.get('orders'));
        lscache.remove('orders');
        return;
      }

      var start = new Date().getTime();
      //showtext($message,ev.data);
      var json = JSON.parse(ev.data);
      renderFullpage(json, true);
      var end = new Date().getTime();
      var time = end - start;
      $("#timecost").text(time + 'ms');
    };

    ws.onclose = function(ev){
      $message.attr("class", 'label label-warning');
      $message.text('closed');
      clearInterval(refreshIntervalId);
    };

    ws.onerror = function(ev){
      $message.attr("class", 'label label-danger');
      $message.text('error occurred. sentosa server is inaccessible!');
      clearInterval(refreshIntervalId);
    };

    {
      $("#_mkdata").tablesorter();
      $("#order_table").tablesorter();
    }

    //document.getElementById("chart").width  = $('#chart').parent().width();
});
