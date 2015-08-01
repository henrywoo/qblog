$(function() {
    //http://stackoverflow.com/questions/3722646/jquery-table-sorting-problem-with-dynamically-added-rows
    /* http://stackoverflow.com/questions/8749236/create-table-with-jquery-append */
    //var ts_aPNL = new TimeSeries();
    var ts_uPNL = new TimeSeries();


    var content = "";
    content += '<table class="table table-striped table-bordered table-condensed" id="_mkdata">';
    content += '<thead><tr class="success"><th>ID<th>SYM';
    var m = _mkdata.length;
    var t = _tinfo.length;
    for(var i=1;i<m;++i){
        content += '<th>' + _mkdata[i];
    }
    content += '</thead><tbody>';

    for(var i=0; i<symbols.length; i++){
        content += "<tr><td>" + (i+1) + "<td><a href='tobj/"+symbols[i]+"' target=_blank>" + symbols[i]+"</a>";
        for (var j=1;j<_mkdata.length;j++){
            content += "<td id=" + symbols[i] + '_' + _mkdata[j] +"></td>";
        }
    }
    content += "</tbody></table>";
    $('#_mkdata_table').append(content);

    ////////////////////////////////////////////////////////////////////////////////

    content = "";
    content += '<table class="table table-striped table-bordered table-condensed" id="_tinfo">';
    content += '<thead><tr class="success"><th>';
    for(var i=0;i<_tinfo.length;++i){
      content += '<th>' + _tinfo[i];
    }
    content += '</thead><tbody>';
    for(var i=0; i<symbols.length; i++){
      content += "<tr><td>" + (i+1);
      for (var j in _tinfo){
        content += "<td id=" + symbols[i] + '_' + _tinfo[j] +"></td>";
      }
    }
    content += "</tbody></table>";
    $('#_tinfo_table').append(content);

    ////////////////////////////////////////////////////////////////////////////////
    content = "";
    content += '<table class="table table-striped table-bordered table-condensed">';
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

    ws.onopen = function(){
      $message.attr("class", 'label label-success');
      $message.text('open');
    };

    ws.onmessage = function(ev){
      //$message.attr("class", 'label label-info');
      //$message.hide();
      //$message.fadeIn("slow");
      //$message.text(ev.data);

      //alert(ev.data);
      var json = JSON.parse(ev.data);
      if (json.hasOwnProperty('msg')){
        y=json.msg.split('>');
        if (y.length == 2){
          /*sym = y[0].substr(1);
            msg = y[1];
            var PCOIRatio='PCOIRatio';
          //'<YY>PCVORatio:55.000/65.000=0.846';
          //'TRP:70.733,73.020,76.947'
          var PCVORatio='PCVORatio';
          var _13w='13w';
          var TRP='TRP';
          var BID_PRICE='BID_PRICE';
          var ASK_PRICE='ASK_PRICE';
          var LAST_PRICE='LAST_PRICE';

          if (msg.substring(0,4)=='dSpd'){
          var $dSpd = $('#dSpd_'+sym);
          $dSpd.text(msg.substr(5));
          }else if(msg.substring(0,PCOIRatio.length)==PCOIRatio){
          $tmp = $('#'+PCOIRatio+'_'+sym);
          $tmp.text(msg.substr(PCOIRatio.length+1));
          $tmp.attr("class", "bg-info");
          }else if(msg.substring(0,PCVORatio.length)==PCVORatio){
          $tmp = $('#'+PCVORatio+'_'+sym);
          $tmp.text(msg.substr(PCVORatio.length+1));
          }else if(msg.substring(0,_13w.length)==_13w){
          $tmp = $('#_'+_13w+'_'+sym);
          $tmp.text(msg);
          $tmp.attr("class", "bg-info");
          }else if(msg.substring(0,TRP.length)==TRP){
          $tmp = $('#'+TRP+'_'+sym);
          $tmp.text(msg.substr(TRP.length+1));
          }else if(msg.substring(0,BID_PRICE.length)==BID_PRICE){
          $tmp = $('#'+BID_PRICE+'_'+sym);
          $tmp.text(msg.substr(BID_PRICE.length+1));
          }else if(msg.substring(0,ASK_PRICE.length)==ASK_PRICE){
          $tmp = $('#'+ASK_PRICE+'_'+sym);
          $tmp.text(msg.substr(ASK_PRICE.length+1));
          }else if(msg.substring(0,LAST_PRICE.length)==LAST_PRICE){
          $tmp = $('#'+LAST_PRICE+'_'+sym);
          $tmp.text(msg.substr(LAST_PRICE.length+1));
          $tmp.attr("class", "bg-info");
          }*/
        }else{
          if (json.msg == "OPENACK"){
            ws.send("AddMeToObserverList");
          }else{
            //
          }
        }
        $log.val($log.val()+json.msg);
        $("textarea").scrollTop(9999999);
      }else{
        var start = new Date().getTime();
        $message.text(ev.data.substring(0,100)+"...");
        /////////////////////////////////////////////////////////////
        if (json.hasOwnProperty('dt')){
          $('#servertime').text(json.dt);//server time
        }
        if (json.hasOwnProperty('data')){
          var d;
          var l =  json.data.length;
          var t;
          var $tmp;
          var s='';
          var o;
          for(var i=0;i< l; ++i){
            d = json.data[i];
            if (d.hasOwnProperty('_tinfo')){
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
                    //$tmp.text(d._tinfo[property]);
                    $tmp.hide();
                    $tmp.fadeIn("fast");
                  }
                }
                /*
                   t = d._tinfo[property];
                   if (Array.isArray(t)){
                   s='';
                   for (var k=0; k<t.length; k++){
                   s = s + t[k] + ",";
                   }
                   s = s.substring(0, s.length-1);
                   $tmp.hide();$tmp.fadeIn("slow");$tmp.text(s);
                   }else{
                   if ($tmp.hasClass('bg-info')){
                   $tmp.attr("class", "bg-warning");
                   }else if ($tmp.hasClass('bg-warning')){
                   $tmp.attr("class", "bg-danger");
                   }else{
                   $tmp.attr("class", "bg-warning");
                   }
                   $tmp.hide();$tmp.fadeIn("slow");$tmp.text(t);
                   }*/

                //$tmp.attr("class", "bg-info");
              }
            }else if(d.hasOwnProperty('_mkdata')){

              for (var property in d._mkdata) {
                if (d._mkdata.hasOwnProperty(property)) {
                  $tmp = $('#'+d._mkdata.sym+'_'+property);
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
                }
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
              //ts_aPNL.append(new Date().getTime(), d._portfolio['aPNL']);
              ts_uPNL.append(new Date().getTime(), d._portfolio['uPNL']);
            }else if(d.hasOwnProperty('bar5s')){
                for (var property in d.bar5s) {
                    $log.val($log.val()+d.bar5s[property]);
                //if (d._portfolio.hasOwnProperty(property)) {
                  //$tmp = $('#_portfolio'+'_'+property);
                  //o=$tmp.text();
                  //if (o != d._portfolio[property]){
                  //$tmp.hide();$tmp.fadeIn("slow");$tmp.text(d._portfolio[property]);
                  //}
                //}
                }
            }else if(d.hasOwnProperty('bar1d')){
                for (var property in d.bar1d) {
                    $log.val($log.val()+d.bar1d[property]);
                }
            }
            $("table").trigger("update");
          }
        }
        /////////////////////////////////////////////////////////////
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
        //chart.addTimeSeries(ts_aPNL, { strokeStyle: 'rgba(0, 255, 0, 1)',
        //    fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 1 });
        chart.addTimeSeries(ts_uPNL, { strokeStyle: 'rgba(0, 255, 255, 1)',
            fillStyle: 'rgba(0, 255, 255, 0.4)', lineWidth: 1 });
        chart.streamTo(document.getElementById("chart"), 50);
    }
    createTimeline();
    document.getElementById("chart").width  = $('#chart').parent().width();
});

