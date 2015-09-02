(function () {
    window.onLoadAuthJS = function () {
        google.load("visualization", "1", { "callback": onVisualLoad });
    };

    onVisualLoad = function () {
        var querystring = encodeURIComponent('select A, B, C, D, E, F, G, H, I, J, K where K = "Pending"');
        var request = new google.visualization.Query('https://docs.google.com/a/mrpkedu.org/spreadsheets/d/1Df0VVPUabFqqMHJ96NUvEv0AI6mFtCzgeSb2VAiIFHM/gviz/tq?sheet=NewRequests&tq=' + querystring);
        console.log(querystring);
        request.send(handleRequest);
    };

    var handleRequest = function (response) {
        var objs = [];
        var result = $.parseJSON(response.getDataTable().toJSON());
        console.log(result);

        for (var i = 0; i < result.rows.length; i++) {
            var obj = {};
            for (var o in result.cols) {
                if (result.cols[o].type == 'datetime')
                    obj[result.cols[o].label] = result.rows[i].c[o].f;
                else if (result.cols[o].type == 'date')
                    obj[result.cols[o].label] = result.rows[i].c[o].f;
                else
                    obj[result.cols[o].label] = result.rows[i].c[o].v;
            }
            objs.push(obj);
        }

        var groups = {};
        for (var item in objs) {
            var group = objs[item].Category;
            if (!(group in groups)) {
                var counter = 1;
                groups[group] = {
                    event: [objs[item]]
                };
            } else {
                groups[group].event.push(objs[item]);
            }
        }

        console.log(groups);
        fillTable(groups, loadHtml);
    };

    function fillTable(groups, callback) {
        var html = "";
        for (var group in groups) {
            var table = "<h2>" + group + "</h2>";
            table += "<table  cellspacing=\"0\" style=\"border-spacing: 0;\"><thead><tr>";
            table += "<th width='22px'></th>"
            table += "<th style='min-width: 75px; max-width: 95px; text-align: center;'>TimeStamp</th>";
            table += "<th style='min-width: 90px; max-width: 100px; text-align: center;'>Submitted By</th>";
            table += "<th style='min-width: 90px; max-width: 115px; text-align: center;'>Organization</th>";
            table += "<th style='min-width: 120px; max-width: 130px; text-align: center;'>Run Dates</th>";
            table += "<th width='50%'>Message</th>";
            table += "</tr></thead><tbody>";
            for (var i = 0; i < groups[group].event.length; i++) {
                table += "<tr class='row-display'>";
                table += "<td><input type='checkbox' name='selected' id='input-selected' /></td>"
                table += "<td>" + groups[group].event[i].TimeStamp + "</td>";
                table += "<td>" + groups[group].event[i].SubmittedBy + "</td>";
                table += "<td>" + groups[group].event[i].Organization + "</td>";
                table += "<td id='rundates'>" + groups[group].event[i].RunDates + "</td>";
                table += "<td>" + groups[group].event[i].Message + "</td></tr>";
                table += "<tr class='row-details'><td colspan='6'>";
                table += "<textarea name='Message' id='input-message' rows='3' style='width: 70%; margin-left: 13%; margin-right: 13%; display: block;' readonly>" + groups[group].event[i].Message + "</textarea>";
                table += "<div style='position: relative; float: left; width: 25%; margin-left: 10%;'>";

                table += "<div style='margin-right: 5%;'><label>Event Name: </label><input type='text' name='EventName' id='input-eventname' value='" + groups[group].event[i].EventName + "' style='width: 100%'/></div>";
                table += "<div style='margin-right: 5%;'><label>Event Location: </label><input type='text' name='EventLocation' id='input-eventlocation' value='" + groups[group].event[i].EventLocation + "' style='width: 100%'/></div>";
                table += "<div><label>Event Date: </label><input type='text' name='EventDate' id='input-eventdate' value='" + groups[group].event[i].EventDate + "' style='width: 50%'/></div>";
                table += "</div>";

                table += "<div style='position: relative; float: left; width: 25%;'>";
                table += "<div><label>Organization: </label><input type='text' name='Organization' id='input-organization' value='" + groups[group].event[i].Organization + "' style='width: 99%'/></div>";
                table += "<div><label>Bulletin Category: </label><select id='input-category' name='Category' style='width: 100%'><option value='CollegeCareer'>College and Career</option><option value='Counseling'>Counseling</option><option value='Club'>Club</option><option value='General'>General</option><option value='ClassOf'>Class Of</option><option value='SchoolEvent'>SchoolEvent</option><option value='Athletics'>Athletics</option></select></div>";
                table += "</div>";

                table += "<div style='position: relative; float: left; width: 25%; margin-right: 10%;'>";
                table += "<div id='input-rundates' name='RunDates'></div>";
                table += "</div>";

                table += "</div>";

                
                table += "</td></tr>";
            }
            table += "</tbody></table>"
            html += table;
        }
        callback(html);
    }
    
    function selectCatagory(tar, opt) {
        $(tar + 'option').each(function (a, b) {
            console.log(b);
        });
    }

    var loadHtml = function (html) {
        $("#tabs-pending").html(html);
        $(".row-display").children('td').hover(function () {
            $(this).parent('tr').toggleClass('on-hover');
        });

        $(".row-display").click(function (e) {
            var run = [];
            if (e.currentTarget.children[4].innerHTML.indexOf(',') > 0) {
                run = [e.currentTarget.children[4].innerHTML.split(',')];
            }
            $(this).next(".row-details").slideToggle("fast", function () {
                var tar = $(this).next(".row-details");
                var args = {
                    target: tar,
                    params: run
                };
                return createDatePicker(args);
            });
        });
    }
})();

