$(document).ready(function() {
	// reading data and loading program
	$.ajax({
		type: "GET",
		url: "exampledata2.txt",
		dataType: "text",
		success: function(data, textStatus, jqXHR) {processData(data, textStatus, jqXHR);}
	});
});

var lines = {}; // storing lines to be read in from csv
var totals = []; // storing all the totals in an array of objects {sentenceID: INTEGER, sentenceTotal: INTEGER}

// reads in all data from csv
function processData(allText, textStatus, jqXHR) {

	// split into lines
	var allTextLines = allText.split(/\r\n|\n/);
	var headers = allTextLines[0].split(/\t/); // set headers

	// for all lines, split by delimeter, create object and add to lines
	for (var i=1; i<allTextLines.length; i++) {
		var data = allTextLines[i].split(/\t/);

		// testing to see if anything wrong with input (else skip)
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
			}
		console.log("lines: " + lines[data[0]]);
		}
	}

	// after reading in data, run rest of program
	createEverything();
		// lines contains all the data, access a disposition with lines["Disposition"]
		// example: x = lines["Secure Custody"] will give you the object with all the secure custody data
		// x["Annual Cost"] will give you $424
		// note: weird rounding shenanigans in the original file, ask client?
	}

function createEverything() {

	// array to store sentence objects
	var sentences = [];

	// jQuery sentence button object
	var sentence_button =
	$("<div>").attr("class", "large-6 columns").append(
		$("<a>").attr("class", "button expand").html("ADD A SENTENCE CHOICE")
		);

	// empty column for when there are an even number of sentences
	var empty_column = $("<div>").attr("class", "large-6 columns");

	// counter to set id of next_sentence
	var next_sentence = 1;

	// INITIAL SENTENCE DISPLAY
	sentences.push({id: next_sentence, sent: createSentence(next_sentence)});
	next_sentence++;
	sentences.push({id: next_sentence, sent: createSentence(next_sentence)});
	next_sentence++;
	reloadSentences();

	function reloadSentences() {

		console.log("Reloading sentences.");

		// clear input html
		$(".input").html("");

		// redisplay (depending on whether odd or even sentences, adjust button and columns accordingly)
		if (sentences.length % 2 == 0) {

			console.log("Even number of sentences: " + sentences.length);

			for (var i = 0; i < sentences.length/2; i++) {
				$(".input").append(
					$("<div>").attr("class", "row")
					.append(sentences[i*2].sent)
					.append(sentences[i*2+1].sent)
					)
			}
			$(".input").append(
				$("<div>").attr("class", "row")
				.append(sentence_button)
				.append(empty_column)
				)
		}
		else {

			console.log("Odd number of sentences: " + sentences.length);

			for (var i = 0; i < sentences.length/2 - 1; i++) {
				$(".input")
				.append(
					$("<div>").attr("class", "row")
					.append(sentences[i*2].sent)
					.append(sentences[i*2+1].sent)
					)
			}
			$(".input").append(
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

			// get id of sentence to be deleted
			var sentence_number = $(event.target).closest(".sentence").attr("id")

			// remove selected sentence from stored sentences
			for (var i = 0; i < sentences.length; i++) {
				if (sentences[i].id == parseInt(sentence_number)) {
					sentences.splice(i, 1);
					break;
				}
			}

			// remove sentence total from stored totals
			for (var i = 0; i < totals.length; i++) {
				if (totals[i].sentenceID == parseInt(sentence_number)) {
					console.log("Deleted sentence " + (i + 1) + " total.");
					totals.splice(i, 1);
					break;
				}
			}
			updateResults(totals);
			reloadSentences();
			addingDispositions();
		});
	}
	addingDispositions();
}

// returns a jQuery object that represents a new sentence
// @param - id of the next sentence
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



// adding dispositions
function addingDispositions() { 

	$(".add").click(function(event) {

		console.log("Adding a disposition.");

		// load options for disposition
		var options = [];
		jQuery.each(lines, function(index, value) {
			options.push($("<option>").attr("value", index).html(index));
		});
		
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

		// event listener for removing selected disposition object
		$(".sub").click(function(event) {
			console.log("Deleting a disposition");
			var temp = $(event.target).closest(".new");
			$(event.target).closest(".dispositions").remove();
			updateTotal(temp);
		});

		// call updateTotal() whenever there is an input change
		$(".opt").change(function(event) {
			updateTotal($(event.target));
		});
		$(".years").keyup(function(event) {
			updateTotal($(event.target));
		});
		$(".months").keyup(function(event) {
			updateTotal($(event.target));
		});
		$(".days").keyup(function(event) {
			updateTotal($(event.target));
		});
	});
}

// function for updating sentence totals
// @param - the element that change is happening
function updateTotal(targ) {	

	console.log("Updating total.");

	var total = 0; // local variable for storing potentially new total

	// iterate through all the dispositions in the current sentence
	targ.closest(".new").children(".dispositions").each(function() {	

		var disposition = $(this).find(".opt option:selected").text();

		if (disposition != "") {

			console.log(lines[disposition]);

			var days = parseFloat(lines[disposition]["Daily Cost"].substring(1));
			var months = parseFloat(lines[disposition]["Daily Cost"].substring(1)) * 30;
			var years = parseFloat(lines[disposition]["Annual Cost"].substring(1));
			var full = parseFloat(lines[disposition]["Cost of Full Course of Treatment"].substring(1));

			console.log("Full : " + full);
			console.log("DMY cost : " + days + " | " + months + " | " + years);
 
			var numDays = parseInt($(this).find(".days").val());
			var numMonths = parseInt($(this).find(".months").val());
			var numYears = parseInt($(this).find(".years").val());

			// reminder here - sentences are either full or dmy sentences

			if (isNaN(full)) {
				$(this).find(".ov").css("visibility", "visible");
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

	

	// get ID of changed sentence
	var sentence_number = targ.closest(".sentence").attr("id");

	console.log("Updated sentence total: " + total + " | Sentence changed: " + sentence_number);

	// update totals
	var exists = false;
	for (var i = 0; i < totals.length; i++) {
		if (totals[i].sentenceID == parseInt(sentence_number)) {
			totals[i].sentenceTotal = total;
			exists = true;
		}
	}
	// if sentence total is new, store new sentence total
	if (!exists && !isNaN(sentence_number)) {
		totals.push({sentenceID: parseInt(sentence_number), sentenceTotal: total});
	}

	// update html to reflect new total
	targ.closest(".sentence").children(".total").html(
		"TOTAL : $" + total
		);

	updateResults(totals);
}