jQuery("#scoresBtn").on("click", function() {
    jQuery("#content").empty();
    //jQuery("#content").append(
    //"<ol>" + scoreEntry +
    //"</ol>"
    $("#content").append(scoreEntry);
    //);
});

jQuery("#creditsBtn").on("click", function() {
    jQuery("#content").empty();
    jQuery("#content").append(
    "<div>" + "Game created by Josh" + "</div>"
    );
});

jQuery("#playagainBtn").on("click", function() {

    score = 0;
    game.state.restart();
});
