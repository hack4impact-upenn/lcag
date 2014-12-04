
var svg = d3.select("#graph").append("svg");

// svg groups
var circle_svg = svg.append("g");
var id_svg = svg.append("g");
var value_svg = svg.append("g");

// ***********************************************************
// TO DO
// 1. cost timeline
// 2. sentence summary/compare (Thomas' idea)
// 3. aesthetic quirks - colors, responsiveness
// 4. google analytics
// ***********************************************************

// updates svg to reflect sentence totals on a cost timeline
function updateResults(totals) {

	console.log("Updating results | Number of sentence totals: " + totals.length);

  	// DISPLAY SOMETHING AS DEFAULT (WORK ON THIS AFTER)
  	// if there are no sentence totals, clear svg
  	if (totals.length == 0) {
  		console.log("No totals.");
  		$("svg").html("");
  		circle_svg = svg.append("g");
  		id_svg = svg.append("g");
  		value_svg = svg.append("g");
  		return;
  	}

  	var max = 0; // find max value for the linear scale
  	for (var i = 0; i < totals.length; i ++) {
  		if (max < totals[i].sentenceTotal) {
  			max = totals[i].sentenceTotal;
  		}
  	}

  	// set linear scale for display (NEEDS TO BE REPONSIVE)
  	var svg_width = $("svg").width() - 40;
  	var linear = d3.scale.linear().range([40, svg_width]).domain([0, max]);

  	// create svg circles
  	circle_svg.selectAll("circle").data(totals).enter().append("circle");
  	circle_svg.selectAll("circle")
  		.attr("cy", 50) // y position
  		.attr("r", 15) // radius
  		.attr("cx", function(d) { // x position determined by total
  			return linear(d.sentenceTotal);
  		});

  	// create svg text for sentence id
  	id_svg.selectAll("text").data(totals).enter().append("text");
  	id_svg.selectAll("text")
  		.attr("y", 55)
  		.attr("fill", "white")
		.attr("font-size", 15)
		.attr("text-anchor", "middle")
		.attr("x", function(d) {
			return linear(d.sentenceTotal);
		}).text(function(d) { // set text using sentenceID property
			return d.sentenceID;
		});

	// create svg text for sentence total
	value_svg.selectAll("text").data(totals).enter().append("text");
	value_svg.selectAll("text")
		.attr("y", 30)
		.attr("font-size", 15)
		.attr("text-anchor", "middle")
		.attr("x", function(d) {
			return linear(d.sentenceTotal);
		}).text(function(d) {
			return "$" + d.sentenceTotal;
		});
}

// TO DELETE - USE FOR COLORS

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
