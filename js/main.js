$(document).ready(function() {

	$.ajax({
		type: "GET",
		url: "exampledata2.txt",
		dataType: "text",
		success: function(data, textStatus, jqXHR) {processData(data, textStatus, jqXHR);}
	});



});

var lines = [];

function processData(allText, textStatus, jqXHR) {
	var allTextLines = allText.split(/\r\n|\n/);
	var headers = allTextLines[0].split(/\t/);

	for (var i=1; i<allTextLines.length; i++) {
		var data = allTextLines[i].split(/\t/);
		var usefulData = false;
		for (var x = 1; x < data.length; x++) {
			if (data[x] != "") {
				usefulData = true;
			}
		}
		if (data.length == headers.length && data[0] != "" && usefulData) {
			var tarr = [];
			for (var j=0; j<headers.length; j++) {
				tarr[headers[j]] = data[j];
				console.log(headers[j]+":"+data[j]);
			}
			lines.push(tarr);
			// lines = tarr;

			// FIX LINES SO INDEX IS DISPOSITION
		}
	}
	createEverything();
		// lines contains all the data, access a disposition with lines["Disposition"]
		// example: x = lines["Secure Custody"] will give you the object with all the secure custody data
		// x["Annual Cost"] will give you $424
		// note: weird rounding shenanigans in the original file, ask client?
	}


	function createEverything() {

		$(".add").click(function(event) {

			var options = [];
			jQuery.each(lines, function(index, value) {

				options.push($("<option>").attr("value", value["Disposition"]).html(value["Disposition"]));
			});
			console.log("********");
			console.log(options);
			console.log("********");

			$(event.target).closest(".dispadd").prev(".new").append(

				$("<div>").attr("class", "row dispositions")
				.append(
					$("<div>").attr("class", "small-1 columns").append(
						$("<div>").attr("class", "addsub sub").append(
							$("<img>").attr("src", "img/sub.jpg")
							)
						)
					)
				.append(
					$("<div>").attr("class", "small-5 columns").append(
						$("<select>").attr("class", "opt")
						.append($("<option>").attr("value", ""))
						.append(options)
						)
					)
				.append(
					$("<div>").attr("class", "small-2 columns").append(
						$("<div>").attr("class", "row collapse").append(
							$("<div>").attr("class", "small-5 columns").append(
								$("<input>").attr("class", "years").attr("type", "text").attr("placeholder", "")
								)
							).append(
							$("<div>").attr("class", "small-7 columns").append(
								$("<span>").attr("class", "postfix").html("YEARS")
								)
							)
							)
					)
				.append(
					$("<div>").attr("class", "small-2 columns").append(
						$("<div>").attr("class", "row collapse").append(
							$("<div>").attr("class", "small-5 columns").append(
								$("<input>").attr("class", "months").attr("type", "text").attr("placeholder", "")
								)
							).append(
							$("<div>").attr("class", "small-7 columns").append(
								$("<span>").attr("class", "postfix").html("MONTHS")
								)
							)
							)
					)
				.append(
					$("<div>").attr("class", "small-2 columns").append(
						$("<div>").attr("class", "row collapse").append(
							$("<div>").attr("class", "small-5 columns").append(
								$("<input>").attr("class", "days").attr("type", "text").attr("placeholder", "")
								)
							).append(
							$("<div>").attr("class", "small-7 columns").append(
								$("<span>").attr("class", "postfix").html("DAYS")
								)
							)
							)
					)


				);




$(".sub").click(function(event) {
	$(event.target).closest(".dispositions").remove();
});

$(".opt").change(function(event) {
	updateTotal(event);
});

$(".years").keyup(function(event) {
	updateTotal(event);
});
$(".months").keyup(function(event) {
	updateTotal(event);
});
$(".days").keyup(function(event) {
	updateTotal(event);
});


function updateTotal(event) {	
	var total = 0;

	$(event.target).closest(".new").children(".dispositions").each(function() {	

		var disposition = $(this).find(".opt option:selected").text();

		console.log(lines[disposition]);

		var days = parseFloat(lines[disposition]["Daily Cost"].substring(1));
		var months = parseFloat(lines[disposition]["Daily Cost"].substring(1)) * 30;
		var years = parseFloat(lines[disposition]["Annual Cost"].substring(1));

		console.log(days + "*" + months + "*" + years);

		var numDays = parseFloat($(this).children(".days")[0]);
		var numMonths = parseFloat($(this).children(".months")[0]);
		var numYears = parseFloat($(this).children(".years")[0]);

		total = days * numDays + months * numMonths + years * numYears;

		


	});

	console.log(total);

	$(event.target).closest(".sentence").children("total").html(
		"Total: " + total
		);



}


});



}
