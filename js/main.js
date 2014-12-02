$(document).ready(function() {

	$.ajax({
		type: "GET",
		url: "exampledata2.txt",
		dataType: "text",
		success: function(data, textStatus, jqXHR) {processData(data, textStatus, jqXHR);}
	});



});

var lines = {};
var totals = [];

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
			lines[data[0]] = {};
			for (var j=1; j<headers.length; j++) {
				lines[data[0]][headers[j]] = data[j];
		//		tarr[headers[j]] = data[j];
		//		console.log(headers[j]+":"+data[j]);
			}
		//	console.log(tarr);
		//	lines[data[0]] = tarr;
			console.log("lines: " + lines[data[0]]);
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

// creating a new sentence
function createSentence(next_sentence) {

	var name = "SENTENCE CHOICE " + next_sentence.toString();
	var new_sentence = 
		$("<div>").attr("class", "large-6 columns")
		.append(
			$("<div>").attr("class", "sentence").attr("id", next_sentence)
			.append(
				$("<div>").attr("class", "header").html(name)
				.append(
					$("<img>").attr("src", "img/delete.png").attr("class", "delete")
					)
				)
			.append(
				$("<div>").attr("class", "new")
				)
			.append(
				$("<div>").attr("class", "row dispadd")
				.append(
					$("<div>").attr("class", "small-1 columns")
					.append(
						$("<div>").attr("class", "addsub add")
						.append(
							$("<img>").attr("src", "img/add.jpg")
							)
						)
					)
				.append(
					$("<div>").attr("class", "small-11 columns")
					.html("...add disposition")
					)
				)
			.append(
				$("<div>").attr("class", "row total")
				.html("TOTAL : 0")
				)
			);

	return new_sentence;
}

function createEverything() {

	var sentences = [];

	var sentence_button =
		$("<div>").attr("class", "large-6 columns")
		.append(
			$("<a>").attr("class", "button expand")
			.html("ADD A SENTENCE CHOICE")
			);



	var empty_column = $("<div>").attr("class", "large-6 columns");

	var next_sentence = 1;
	
	console.log("start: " + sentences.length);

	// INITIAL SENTENCE DISPLAY
	sentences.push({id: next_sentence, sent: createSentence(next_sentence)});
	next_sentence++;
	sentences.push({id: next_sentence, sent: createSentence(next_sentence)});
	next_sentence++;
	reloadSentences();

	console.log("setup: " + sentences.length);

	function reloadSentences() {
		// clear html
		$(".input").html("");

		// redisplay (let's see what happens)
		if (sentences.length % 2 == 0) {
			for (var i = 0; i < sentences.length/2; i++) {
				$(".input")
				.append(
					$("<div>").attr("class", "row")
					.append(sentences[i*2].sent)
					.append(sentences[i*2+1].sent)
					)
			}
			$(".input")
			.append(
				$("<div>").attr("class", "row")
				.append(sentence_button)
				.append(empty_column)
				)
		}
		else {
			for (var i = 0; i < sentences.length/2 - 1; i++) {
				console.log("got here: " + sentences.length);
				$(".input")
				.append(
					$("<div>").attr("class", "row")
					.append(sentences[i*2].sent)
					.append(sentences[i*2+1].sent)
					)
			}
			$(".input")
			.append(
				$("<div>").attr("class", "row")
				.append(sentences[sentences.length-1].sent)
				.append(sentence_button)
				)
		}

		// adding sentences
	$(".expand").click(function(event) {
		sentences.push({id: next_sentence, sent: createSentence(next_sentence)});
		next_sentence++;

		console.log("add: " + sentences.length);

		reloadSentences();
		addingDispositions();
		});

	// deleting sentences
	$(".delete").click(function(event) {
		var sentence_number = $(event.target).closest(".sentence").attr("id")

		for (var i = 0; i < sentences.length; i++) {
			if (sentences[i].id == parseInt(sentence_number)) {
				sentences.splice(i, 1);
				break;
			}
		}

		for (var i = 0; i < totals.length; i++) {
			if (totals[i].sentenceID == parseInt(sentence_number)) {
				totals.splice(i, 1);
				break;
			}
		}

		reloadSentences();
		addingDispositions();
		});
	}
	addingDispositions();
}

	// adding dispositions
	function addingDispositions() { 


		$(".add").click(function(event) {

		// load options for disposition
		var options = [];
		jQuery.each(lines, function(index, value) {
			options.push($("<option>").attr("value", index).html(index));
		});
		// console.log("********");
		// console.log(options);
		// console.log("********");
		
		// new disposition object
		var new_disposition = $("<div>").attr("class", "row dispositions")
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
				$("<div>").attr("class", "small-2 columns ov").append(
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
				$("<div>").attr("class", "small-2 columns ov").append(
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
				$("<div>").attr("class", "small-2 columns ov").append(
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
				);

		// add new disposition object
		$(event.target).closest(".dispadd").prev(".new").append(new_disposition);

		// remove selected disposition object
		$(".sub").click(function(event) {
			$(event.target).closest(".dispositions").remove();
			});

		// call updateTotal() whenever there is an input change
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

		// function for updating sentence totals
		function updateTotal(event) {	
			var total = 0;

			$(event.target).closest(".new").children(".dispositions").each(function() {	

				var disposition = $(this).find(".opt option:selected").text();

				if (disposition != "") {

					console.log(lines[disposition]);

					var days = parseFloat(lines[disposition]["Daily Cost"].substring(1));
					var months = parseFloat(lines[disposition]["Daily Cost"].substring(1)) * 30;
					var years = parseFloat(lines[disposition]["Annual Cost"].substring(1));
					var full = parseFloat(lines[disposition]["Cost of Full Course of Treatment"].substring(1));

					console.log("FULL : " + full);

					console.log(days + "*" + months + "*" + years);

					console.log("day: " + $(this).find(".days").val());

					var numDays = parseInt($(this).find(".days").val());
					var numMonths = parseInt($(this).find(".months").val());
					var numYears = parseInt($(this).find(".years").val());


					if (isNaN(full)) {
						if (!isNaN(numDays)) {
							total += days * numDays;
						}
						if (!isNaN(numMonths)) {
							total += months * numMonths;
						}
						if (!isNaN(numYears)) {
							total += years * numYears;
						}
					}
					else {
						$(this).find(".ov").css("visibility", "hidden");
						total += full;
					}


				}

				});

			console.log(total);

			// ARRAY LIST OF OBJECTS
			// OBJECT -> TWO PROPERTIES (sentenceID, sentenceTotal)

			var sentence_number = $(event.target).closest(".sentence").attr("id")

			boolean changed = false;
			for (var i = 0; i < totals.length; i++) {
				if (totals[i].sentenceID == parseInt(sentence_number)) {
					totals[i].sentenceTotal = total;
					changed = true;
				}
			}

			if (!changed) {
				totals.push({sentenceID: parseInt(sentence_number), sentenceTotal: total});
			}


			$(event.target).closest(".sentence").children(".total").html(
				"TOTAL : " + total
				);

			updateResults(totals);

		}


	});

	
	
}
