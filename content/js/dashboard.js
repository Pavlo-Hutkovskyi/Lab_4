/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9800974817221771, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "-58-0"], "isController": false}, {"data": [0.84375, 500, 1500, ""], "isController": true}, {"data": [1.0, 500, 1500, "-58-2"], "isController": false}, {"data": [0.93125, 500, 1500, "-58-1"], "isController": false}, {"data": [1.0, 500, 1500, "-50"], "isController": false}, {"data": [1.0, 500, 1500, "-51"], "isController": false}, {"data": [1.0, 500, 1500, "-52"], "isController": false}, {"data": [1.0, 500, 1500, "-53"], "isController": false}, {"data": [1.0, 500, 1500, "-54"], "isController": false}, {"data": [1.0, 500, 1500, "-55"], "isController": false}, {"data": [1.0, 500, 1500, "-56"], "isController": false}, {"data": [1.0, 500, 1500, "-57"], "isController": false}, {"data": [0.91875, 500, 1500, "-58"], "isController": false}, {"data": [1.0, 500, 1500, "-48"], "isController": false}, {"data": [1.0, 500, 1500, "-49"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1151, 0, 0.0, 62.54648132059079, 9, 1228, 20.0, 157.79999999999995, 217.0, 708.8400000000001, 215.74507966260546, 557.5322531044986, 112.48297651124649], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["-58-0", 80, 0, 0.0, 26.3625, 14, 250, 18.5, 42.400000000000034, 63.65000000000002, 250.0, 16.89902830587241, 6.106094212082805, 6.271123785382341], "isController": false}, {"data": ["", 80, 0, 0.0, 572.05, 289, 1552, 407.0, 1283.4, 1429.45, 1552.0, 14.831294030404154, 295.4259072580645, 89.89842591305154], "isController": true}, {"data": ["-58-2", 80, 0, 0.0, 113.58749999999998, 67, 362, 114.0, 126.80000000000001, 129.95, 362.0, 16.760946993505133, 257.77689935575114, 7.873062015503876], "isController": false}, {"data": ["-58-1", 80, 0, 0.0, 181.0625, 62, 1080, 79.5, 575.7, 595.5, 1080.0, 15.987210231814549, 22.59520508593126, 6.602140162869705], "isController": false}, {"data": ["-50", 84, 0, 0.0, 27.940476190476186, 9, 206, 17.0, 44.0, 151.0, 206.0, 17.333883615352867, 4.868706149401568, 8.328389393314072], "isController": false}, {"data": ["-51", 84, 0, 0.0, 18.749999999999996, 9, 82, 17.0, 28.5, 40.75, 82.0, 17.34462110262234, 4.89874238591782, 8.333548420400579], "isController": false}, {"data": ["-52", 83, 0, 0.0, 29.33734939759035, 9, 164, 18.0, 57.40000000000025, 151.39999999999998, 164.0, 17.23421926910299, 4.742289698401163, 8.297334081706811], "isController": false}, {"data": ["-53", 83, 0, 0.0, 19.15662650602409, 9, 60, 18.0, 28.400000000000034, 34.0, 60.0, 17.194945100476488, 4.776800743215247, 8.261633778744562], "isController": false}, {"data": ["-54", 84, 0, 0.0, 28.976190476190492, 9, 208, 17.0, 36.0, 145.25, 208.0, 17.34820322180917, 4.758775751239158, 8.335269516728625], "isController": false}, {"data": ["-55", 82, 0, 0.0, 18.524390243902445, 10, 50, 17.0, 26.0, 38.24999999999997, 50.0, 17.12257256212153, 4.760665718312801, 8.226861035706829], "isController": false}, {"data": ["-56", 82, 0, 0.0, 18.817073170731707, 10, 81, 17.0, 26.0, 37.54999999999998, 81.0, 17.104714226115977, 4.755700484981227, 8.218280663329162], "isController": false}, {"data": ["-57", 81, 0, 0.0, 29.14814814814816, 9, 189, 17.0, 53.19999999999993, 146.79999999999998, 189.0, 16.920827240442865, 4.638416871213704, 8.262122675997494], "isController": false}, {"data": ["-58", 80, 0, 0.0, 321.3625, 161, 1228, 217.0, 712.2, 730.45, 1228.0, 15.476881408396208, 265.49464052524667, 19.404669060746762], "isController": false}, {"data": ["-48", 84, 0, 0.0, 31.44047619047618, 9, 241, 18.0, 51.5, 173.25, 241.0, 17.160367722165475, 4.714831779877426, 8.261778600612871], "isController": false}, {"data": ["-49", 84, 0, 0.0, 25.66666666666666, 9, 199, 17.0, 33.5, 138.25, 199.0, 17.319587628865982, 4.662532216494846, 8.203125], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1151, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
