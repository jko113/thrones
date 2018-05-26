// declare variables and create/display initial page structure
var GOT_URL = "https://www.anapioficeandfire.com/api/characters?page=";
var currentPage = 1;
var pageSize = "&pageSize=20";
var $content = $(".content");

makeTable();

var $mainTable = $(".main-table");
var $next = $(".next");
var $previous = $(".previous");
var $pageNumberDisplay = $(".page-number");
var $goTo = $(".go-to");
var $submit = $(".submit");

displayPage(currentPage);

// attach event listeners to various page elements
$goTo.on("focus", function(event) {
    $goTo.attr("placeholder", "");
});

$goTo.on("blur", function(event) {
    if ($goTo.val() === "") {
        $goTo.attr("placeholder", "Go to page...");
    }
});

$submit.on("click", function(event) {
    event.preventDefault();
    var parsedPage = parseInt($goTo.val());

    if (isNaN(parsedPage)) {
        alert("You've submitted an invalid value.");
    } else if (parsedPage > 107 || parsedPage < 1) {
        alert("Only values between 1 and 107 can be accepted.");
    } else {        
        $goTo.val("");
        $goTo.attr("placeholder", "Go to page...");
        currentPage = parsedPage;
        loadPage(currentPage);
    }
});

$next.on("click", function() {
    if (currentPage < 107) {
        clearTable();
        currentPage++;
        loadPage(currentPage);
    } else {
        alert("no more results, homie");
    }
});

$previous.on("click", function() {
    if (currentPage > 1) {
        currentPage--;
        loadPage(currentPage);
    } else {
        alert("you're on page 1, homie");
    }
});

// declare various functions
function loadPage(pageNo) {
    clearTable();
    currentStart = (pageNo - 1) * 20 + 1;
        storePage(pageNo).then(function(result) {
            displayPage(pageNo);
            displayContent();
        });
}

function clearTable() {
    $(".table-row").remove();
}

function storePage(pageNo) {
    var newUrl = GOT_URL + pageNo + pageSize;
    
    return $.get(newUrl, function(data) {
        localStorage.setItem("finalResults", JSON.stringify(data));
        
    });
}

function displayPage(pageNo) {
    var currentStart = (pageNo - 1) * 20 + 1;
    return $(".page-number").text("page " + pageNo + " of 107 (results " + currentStart + "-" + (currentStart + 19) + ")");
}

function displayContent() {
    var textToDisplay = JSON.parse(localStorage.getItem("finalResults"));
    formatData(textToDisplay).then(function(result) {
        var formattedData = result;
        formattedData.forEach(function(row) {
            addNewRow(row);
        })
    });
}

function formatData(unformattedData) {
    var promises = unformattedData.map(function(item) {
        if (item.allegiances.length) {
            return $.get(item.allegiances[0]).then(function(result) {
                return result.name + "|" + item.allegiances[0];
            });
        } else {
            return new Promise(function(resolve, reject) {
                resolve("Unknown");
            });
        }
    });

    return Promise.all(promises).then(function(results) {

        var finalResult = unformattedData.map(function(item, idx) {
            var houseOfAllegiance = results[idx];
            return {
                name: item.name.length ? item.name : undefined,
                alias: item.aliases[0] ? item.aliases : undefined,
                house: houseOfAllegiance.includes("|") ? pretrim(houseOfAllegiance) : undefined,
                url: houseOfAllegiance.includes("|") ? posttrim(houseOfAllegiance) : undefined,
                titles: item.titles[0] ? item.titles : undefined
            };
        })

        return finalResult;
    })
}

function pretrim (str) {
    var index = str.indexOf("|");
    return str.slice(0, index);
}

function posttrim (str) {
    var index = str.indexOf("|");
    return str.slice(index + 1);
}

function addNewRow (obj) {

    var $newRow = $("<tr>");
    $newRow.addClass("table-row");
    var $newName = $("<td>");
    var $newAlias = $("<td>");
    var $newTitles = $("<td>");
    var $newHouse = $("<td>");
    var $newHouseLink = $("<a>");

    if (obj.name) {
        $newName.text(obj.name);
    } else {
        $newName.text("N/A");
    }

    if (obj.alias) {
        obj.alias.forEach(function(item) {

            var $newDiv = $("<div>");
            $newDiv.text(item);
            $newAlias.append($newDiv);
        });
    } else {
        $newAlias.text("N/A");
    }

    if (obj.house) {
        $newHouseLink.text(obj.house);
        $newHouseLink.attr("target", "_blank");
    } else {
        $newHouse.text("Unaffiliated or unknown");
    }

    if (obj.titles) {

        obj.titles.forEach(function(item) {
            
            var $newDiv = $("<div>");
            $newDiv.text(item);
            $newTitles.append($newDiv);
        });
    } else {
        $newTitles.text("N/A");
    }

    if (obj.url) {
        $newHouse.append($newHouseLink);
        $newHouseLink.attr("href", obj.url);
    }

    $newRow.append($newName);
    $newRow.append($newAlias);
    $newRow.append($newTitles);
    $newRow.append($newHouse);
    $mainTable.append($newRow);
}

function getStarted() {
    storePage(currentPage).then(function(result) {
        displayContent();
    });
}

getStarted();