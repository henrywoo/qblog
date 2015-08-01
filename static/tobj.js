$(function() {
    var m = _mkdata.length;
    var t = _tinfo.length;

    var ts_bid = new TimeSeries();
    var ts_ask = new TimeSeries();
    var ts_lp = new TimeSeries();

    var content = "";
    content += '<table class="table table-striped table-bordered table-condensed" id="_mkdata1">';
    content += '<thead><tr class="success">';
    for(var i=1; i<m/2; ++i){
      content += '<th width="15">' + _mkdata[i];
    }
    content += '</thead><tbody>';

    //for(var i=0; i<symbols.length; i++){
    content += "<tr>";
    for (var j=1; j<m/2; j++){
      content += "<td id=" + sym + '_' + _mkdata[j] +"></td>";
    }
    //}
    content += "</tbody></table>";

    content += '<table class="table table-striped table-bordered table-condensed" id="_mkdata2">';
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
    content += "</tbody></table>";

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

    content = "";
    content += '<table class="table table-striped table-bordered table-condensed" id="_tinfo">';
    content += '<thead><tr class="success">';
    for(var i=1;i<t;++i){
      content += '<th>' + _tinfo[i];
    }
    content += '</thead><tbody>';
    //for(var i=0; i<symbols.length; i++){
    content += "<tr>";
    for (var j=1;j<t;++j){
      content += "<td id=" + sym + '_' + _tinfo[j] +"></td>";
    }
    //}
    content += "</tbody></table>";
    $('#_tinfo_table').append(content);

    ////////////////////////////////////////////////////////////////////////////////
    content = '<table class="table table-striped table-bordered table-condensed" id="_portfolio"><tr>';
    for(var i=0; i<_portfolio.length; i++){
      content += '<td class="success" width=15>' + _portfolio[i] +
        '</td><td id="_portfolio_' + _portfolio[i] +'"></td>';
    }
    content += "</table>";
    $('#_portfolio').append(content);


    var $message = $('#message');
    var $log = $('#log');

    ws.onopen = function(){
      $message.attr("class", 'label label-success');
      $message.text('open');
    };

    function render(json, store){
      if (json.hasOwnProperty('dt')){
        $('#servertime').text(json.dt);//server time
      }
      if (json.hasOwnProperty('data')){
        if (store){
          if (json.data[0].hasOwnProperty('_tinfo') && json.data[1].hasOwnProperty('_mkdata'))
          {
            lscache.remove(sym)
            lscache.set(sym, json);
          //  $log.val($log.val()+JSON.stringify(json));
          }
        }
        var d;
        var l =  json.data.length;
        var t;
        var $tmp;
        var s='';
        var o;
        for(var i=0;i< l; ++i){
          d = json.data[i];
          if (d.hasOwnProperty('_tinfo')){
            if (d._tinfo.syms!=sym){continue;}
            for (var property in d._tinfo) {
              $tmp = $('#'+d._tinfo.syms+'_'+property);

              o=$tmp.text();
              if (o.length==0 || property!='syms'){
                if (o.length==0){
                  $tmp.attr("class", "bg-info");
                  if(property=='statuz'){
                      $tmp.text(_status[d._tinfo[property]]);
                  }else{
                      $tmp.text(d._tinfo[property]);
                  }
                }else{
                  if ($tmp.hasClass('bg-info')){
                    $tmp.attr("class", "bg-warning");
                  }else if ($tmp.hasClass('bg-warning')){
                    $tmp.attr("class", "bg-danger");
                  }else{
                    $tmp.attr("class", "bg-warning");
                  }
                  if(property=='statuz'){
                      $tmp.text(_status[d._tinfo[property]]);
                  }else{
                      $tmp.text(d._tinfo[property]);
                  }
                  $tmp.hide();
                  $tmp.fadeIn("fast");
                }
              }
            }
          }else if(d.hasOwnProperty('_mkdata')){
            for (var property in d._mkdata) {
              if (d._mkdata.hasOwnProperty(property)) {
                if (d._mkdata.sym!=sym){continue;}

                $tmp = $('#'+sym+'_'+property);
                o=$tmp.text();
                if (o.length==0 || property!='sym'){
                  if (o.length==0){
                    $tmp.attr("class", "bg-info");
                    $tmp.text(d._mkdata[property]);
                  }else{
                    if ($tmp.hasClass('bg-info')){
                      $tmp.attr("class", "bg-warning");
                    }else if ($tmp.hasClass('bg-warning')){
                      $tmp.attr("class", "bg-danger");
                    }else{
                      $tmp.attr("class", "bg-warning");
                    }
                    $tmp.text(d._mkdata[property]);
                    $tmp.hide();
                    $tmp.fadeIn("fast");
                  }
                }

                var nt = new Date().getTime();
                if (property=='bid' &&  parseFloat(d._mkdata[property])>0){
                  ts_bid.append(nt, d._mkdata[property]);
                }
                else if (property=='ask' &&  parseFloat(d._mkdata[property])>0){
                  ts_ask.append(nt, d._mkdata[property]);
                }
                else if (property=='LP' && parseFloat(d._mkdata[property])>0){
                  ts_lp.append(nt, d._mkdata[property]);
                }
              }
            }
            tableinitialized = true;
          }else if(d.hasOwnProperty('mktstatic')){
            for (var property in d.mktstatic) {
              if (d.mktstatic.sym!=sym){continue;}
              $tmp = $('#'+sym+'_'+property);
              $tmp.hide();$tmp.fadeIn("slow");$tmp.text(d.mktstatic[property]);
            }
          }else if(d.hasOwnProperty('_portfolio')){
            for (var property in d._portfolio) {
              //if (d._portfolio.hasOwnProperty(property)) {
              $tmp = $('#_portfolio'+'_'+property);
              //o=$tmp.text();
              //if (o != d._portfolio[property]){
              $tmp.hide();$tmp.fadeIn("slow");$tmp.text(d._portfolio[property]);
              //}
              //}
            }
          }else if(d.hasOwnProperty('bar5s')){
            for (var property in d.bar5s) {
              $log.val($log.val()+d.bar5s[property]);
            }
          }else if(d.hasOwnProperty('bar1d')){
            for (var property in d.bar1d) {
              $log.val($log.val()+d.bar1d[property]);
            }
          }
        }
        $("table").trigger("update");
      }
      /////////////////////////////////////////////////////////////
    }

    ws.onmessage = function(ev){
      //alert(ev.data);
      var json = JSON.parse(ev.data);
      if (json.hasOwnProperty('msg')){
        if (json.msg == "OPENACK"){
          ws.send("AddMeToObserverUpdate|"+sym);
          cachedata = lscache.get(sym);
          render(cachedata, false);
        }else{}
        $log.val($log.val()+json.msg);
        $("textarea").scrollTop(9999999);
      }else{
        var start = new Date().getTime();
        $message.text(ev.data.substring(0,100)+"...");
        render(json, true);
        var end = new Date().getTime();
        var time = end - start;
        $("#timecost").text('Execution time: ' + time);
      }

    };
    ws.onclose = function(ev){
      $message.attr("class", 'label label-important');
      $message.text('closed');
    };
    ws.onerror = function(ev){
      $message.attr("class", 'label label-warning');
      $message.text('error occurred');
    };

    /*function getdate(){
      var today = new Date();
      var h = today.getHours();
      var m = today.getMinutes();
      var s = today.getSeconds();
      if(s<10){
      s = "0"+s;
      }

      $("#clock").text(h+" : "+m+" : "+s);
      setTimeout(function(){getdate()}, 500);
      }
      getdate();*/

    {
      $("#Tradeinfo").tablesorter();
      $("#_mkdata").tablesorter();
      $("#_tinfo").tablesorter();
    }

    function createTimeline() {
      var chart = new SmoothieChart({grid:{fillStyle:'transparent'}});
      chart.addTimeSeries(ts_bid, { strokeStyle:'rgb(0, 255, 0)', fillStyle:'rgba(0, 255, 0, 0.4)', lineWidth:1 });
      chart.addTimeSeries(ts_ask, { strokeStyle:'rgb(255, 0, 0)', fillStyle:'rgba(255, 0, 0, 0.3)', lineWidth:1 });
      chart.addTimeSeries(ts_lp,  { strokeStyle:'rgb(0, 0, 255)', fillStyle:'transparent', lineWidth:1 });
      chart.streamTo(document.getElementById("chart"), 50);
    }
    createTimeline();
    document.getElementById("chart").width  = $('#chart').parent().width();
});
