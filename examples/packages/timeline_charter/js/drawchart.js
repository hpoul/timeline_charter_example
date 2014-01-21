// http://stackoverflow.com/a/646643/109219
if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}
function blubber(el) {
//alert('we got called ' + el);
el.innerHTML = 'heheh';
//  alert('blubber');
}
function drawChart(element, keysAndLabels, dataByKey, keyprefix) {
  element.innerHTML = '<div class="chart_container"><div class="y_axis"></div><div class="chart"></div><div class="timeline"></div><div class="preview"></div><div class="legend_container"><div class="smoother" title="Smoothing"></div><div class="legend"></div><div class="options"></div></div></div>';
  var chartElement = element.querySelector('.chart');
  var yAxisElement = element.querySelector('.y_axis');
  var legendElement = element.querySelector('.legend');
  var optionsElement = element.querySelector('.options');
  var idprefix = "id"+Math.round(Math.random()*1000);
  function inputRadioField(name, value, label) {
    return '<input type="radio" name="'+name+'" value="'+value+'" id="'+idprefix+name+value+'" /> <label for="'+idprefix+name+value+'">'+label+'</label><br />';
  }
  optionsElement.innerHTML = '<br /><form>'
    +inputRadioField('renderer', 'area', 'Area')
    +inputRadioField('renderer', 'line', 'Lines')+'<br />'
    +inputRadioField('offset', 'zero', 'Stack')
    +inputRadioField('offset', 'expand', 'Pct')
    +inputRadioField('offset', 'value', 'Value')+'</form>';
  var optionsForm = optionsElement.querySelector('form');
  optionsForm.querySelector('[name="renderer"][value="area"]').setAttribute('checked', 'checked');
  optionsForm.querySelector('[name="offset"][value="zero"]').setAttribute('checked', 'checked');
  var palette = new Rickshaw.Color.Palette();
  var series = [];
  for(var key in keysAndLabels) {
    if (key.startsWith(keyprefix)) {
      series.push({
        color: palette.color(),
        name: keysAndLabels[key],
        data: dataByKey[key]
      });
      console.log('key: ' + key + ' has: ' + dataByKey[key].length);
    }
  }
  
    var graph = new Rickshaw.Graph( {
    //renderer: 'line',
    renderer: 'stack',
    element: chartElement,
    width: 800,
    height: 300,
    preserve: true,
    series: series
  });
  var axes = new Rickshaw.Graph.Axis.Time( { graph: graph } );
  var y_axis = new Rickshaw.Graph.Axis.Y( {
        graph: graph,
        orientation: 'left',
        tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
        element: yAxisElement,
  } );
  var hoverDetail = new Rickshaw.Graph.HoverDetail( {
      graph: graph
  } );
  var legend = new Rickshaw.Graph.Legend({
    graph: graph,
    element: legendElement
  });
  var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
    graph: graph,
    legend: legend
  });
  var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
    graph: graph,
    legend: legend
  });
  // ordering requires jquery .. which somehow doesn't work right now.. so ignore it.
  /*
  var order = new Rickshaw.Graph.Behavior.Series.Order({
    graph: graph,
    legend: legend
  });*/
  /*
  var slider = new Rickshaw.Graph.RangeSlider({
    graph: graph,
    element: element.querySelector('.preview')
  });*/
  graph.render();
/*
  var preview = new Rickshaw.Graph.RangeSlider.Preview( {
    graph: graph,
    element: element.querySelector('.preview'),
  } );
  
  var previewXAxis = new Rickshaw.Graph.Axis.Time({
    graph: preview.previews[0],
    timeFixture: new Rickshaw.Fixtures.Time.Local()
  });
  
  previewXAxis.render();*/
  
  var forEach = Array.prototype.forEach;
  var renderer = 'area';
  forEach.call(optionsElement.querySelectorAll('[name="renderer"],[name="offset"]'), function(el){
    el.addEventListener('change', function(ev){
      //alert(ev.target.value + ' / ' + optionsForm.elements.renderer.value);
      if (ev.target.name === 'renderer') {
        renderer = ev.target.value;
        graph.configure({renderer: renderer});
      } else if (ev.target.name === 'offset') {
        var config = { renderer: renderer, interpolation: 'cardinal' };
        console.log('setting it to ' + ev.target.value);
        if (ev.target.value === 'value') {
          config.unstack = true;
          config.offset = 'zero';
        } else {
          config.unstack = false;
          config.offset = ev.target.value;
        }
        console.log('configure .. ', config);
        graph.configure(config);
      }
      graph.render();
    });
  });
}

function loadAndDraw(chartWrapperElement, prefix, json) {
console.log('loading ..');
  //d3.json('latestdata.json', function(error, json){
  console.log('done.');
    var dataByKey = json.dataByKey;
    drawChart(chartWrapperElement, json.keyLabelMapping, json.dataByKey, prefix);
    //drawChart(document.querySelector('#chartwrapper'), json.keyLabelMapping, json.dataByKey, 'worktrail.actionlog.count.group');
    //drawChart(document.querySelector('#chartwrapper2'), json.keyLabelMapping, json.dataByKey, 'worktrail.company.creation');
    //document.querySelector('#lastupdated').innerHTML = 'Last updated ' + json.lastupdatestr;
    
  //});
}
