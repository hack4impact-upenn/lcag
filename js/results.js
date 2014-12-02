

var testData = [
{times: [{"starting_time": 80, "ending_time": 200}, {"starting_time": 150, "ending_time": 200}]},
{times: [{"starting_time": 180, "ending_time": 200}, ]},
{times: [{"starting_time": 100, "ending_time": 100}]},
{times: [{"starting_time": 50, "ending_time": 100}]},
];


var width = 1000;
function timelineCircle() {
	var chart = d3.timeline()
          .tickFormat( //
          	{format: d3.format("$ %g"),
          	tickTime: 10,
          	tickInterval: 10,
          	tickSize: 20})
          .display("circle"); // toggle between rectangles and circles

          var svg = d3.select("#graph").append("svg").attr("width", width)
          .datum(testData).call(chart);
      }

      timelineCircle();


