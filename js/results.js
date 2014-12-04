
var svg = d3.select("#graph").append("svg");

// svg groups
var circle_svg = svg.append("g");
var id_svg = svg.append("g");
var value_svg = svg.append("g");

// TO DO - CHANGE COLORS AND ADD COST TIMELINE
// TO DO - REMOVE
// google anaytics

function updateResults(totals) {

  var temparr = [];
  var max = 0;

  for (var i = 0; i < totals.length; i ++) {
    temparr[i] = totals[i].sentenceTotal;
    if (max < temparr[i]) {
      max = temparr[i];
    }
  }

  var svg_width = $("svg").width() - 40;

  var linear = d3.scale.linear().range([40, svg_width]).domain([0, max]);

  circle_svg.selectAll("circle").data(totals).enter().append("circle");

  circle_svg.selectAll("circle")
    .attr("cy", 50)
    .attr("r", 15)
    .attr("cx", function(d) {
      return linear(d.sentenceTotal);
      });

  id_svg.selectAll("text").data(totals).enter().append("text");

  id_svg.selectAll("text")
    .attr("y", 55)
    .attr("fill", "white")
    // font-family
    // font-size in pixels
    .attr("font-size", 15)
    .attr("text-anchor", "middle")
    .attr("x", function(d) {
      return linear(d.sentenceTotal);
      })
    .text(function(d) {
      return d.sentenceID;
    });

  value_svg.selectAll("text").data(totals).enter().append("text");

  value_svg.selectAll("text")
    .attr("y", 30)
    // font-family
    // font-size in pixels
    .attr("font-size", 15)
    .attr("text-anchor", "middle")
    .attr("x", function(d) {
      return linear(d.sentenceTotal);
      })
    .text(function(d) {
      return "$" + d.sentenceTotal;
    });

}

// var testData = [
// {times: [{"starting_time": 80, "ending_time": 200}, {"starting_time": 150, "ending_time": 200}]},
// {times: [{"starting_time": 180, "ending_time": 200}, ]},
// {times: [{"starting_time": 100, "ending_time": 100}]},
// {times: [{"starting_time": 50, "ending_time": 100}]},
// ];


// var width = 1000;
// function timelineCircle() {
// 	var chart = d3.timeline()
//           .tickFormat( //
//           	{format: d3.format("$ %g"),
//           	tickTime: 10,
//           	tickInterval: 10,
//           	tickSize: 20})
//           .display("circle"); // toggle between rectangles and circles

//           var svg = d3.select("#graph").append("svg").attr("width", width)
//           .datum(testData).call(chart);
//         }

//         timelineCircle();
