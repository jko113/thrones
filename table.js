
var $body = $("body");
var $table = $("<table>");
$table.addClass("main-table");
var $thead = $("<thead>");
var $content = $(".content");

function makeTable() {
    $content.append($table);    
    makeHeader();
}

function makeHeader() {
    var $tr = $("<tr>");
    var $name = $("<td>");
    var $alias = $("<td>");
    var $titles = $("<td>");
    var $house = $("<td>");

    $name.text("Name");
    $alias.text("Alias");
    $titles.text("Titles");
    $house.text("House");

    $tr.append($name);
    $tr.append($alias);
    $tr.append($titles);
    $tr.append($house);
    $thead.append($tr);
    $table.append($thead);
}