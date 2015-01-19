function addCompareOptions(sentence_number) {	

	$(".comparisonoptions").append(
		$("<option>").attr("value", sentence_number).html("SENTENCE CHOICE " + sentence_number))

	$(".comparisonoptions").change(function(event) {
			updateComparison();
	});
}

function deleteCompareOptions(sentence_number) {

	console.log("calling delete");

	$(".comparisonoptions").children("option").each(function() {
		if ($(this).attr("value") == sentence_number) {
			console.log("removing sentence option: " + $(this).attr("value"));
			$(this).remove();
			return;
		}
	});
}

function updateComparison() {
	var firstID = $("#firstopt").find(".comparisonoptions option:selected").val();
	var secondID = $("#secondopt").find(".comparisonoptions option:selected").val();

	if (firstID == 0 || secondID == 0) {
		return;
	}

	var cost1 = 0;
	var cost2 = 0; 

	for (var i = 0; i < totals.length; i++) {
		if (totals[i].sentenceID == firstID) {
			cost1 = totals[i].sentenceTotal;
		}
		if (totals[i].sentenceID == secondID) {
			cost2 = totals[i].sentenceTotal;
		}
	}

	console.log("cost1: " + cost1);
	console.log("cost2: " + cost2);

	// clear results
	$(".compareresults").html("");

	if (cost1 > cost2) {
		$(".compareresults")
		.append(
			$("<span>").attr("id", "first").html(firstID)
			).append(" costs more than ")
		.append(
			$("<span>").attr("id", "second").html(secondID)
			).append(" by ")
		.append(
			$("<span>").attr("id", "diff").html("$" + (cost1 - cost2))
			)
	}
	else if (cost1 < cost2) {
		$(".compareresults").append(
			$("<span>").attr("id", "first").html(firstID)
			).append(" costs less than ").append(
			$("<span>").attr("id", "second").html(secondID)
			).append(" by ").append(
			$("<span>").attr("id", "diff").html("$" + (cost2 - cost1))
			)
	}
	else {
		$(".compareresults").append(
			$("<span>").attr("id", "first").html(firstID)
			).append(" costs the same as ").append(
			$("<span>").attr("id", "second").html(secondID)
			)
	}


}