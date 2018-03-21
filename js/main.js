/**
 * Created by ryosuke on 18/03/11.
 */

"use strict";

var NODATA_STR = 'NoData',
    NOTFOUND_STR = 'NotFound',
    charts = [],
    getWikiContents = function (title) {
        console.log('getWikiContents');
        var datatype = 'json',
            url = 'https://ja.wikipedia.org/w/api.php?format=' + datatype + '&action=query&prop=revisions&rvprop=content&titles=' + title;
        return $.ajax({
            type: "get",
            dataType: 'jsonp',
            timeout: 10000,
            cache: false,
            url: url
        });
    },
    wikiResponse2Contents = function (res) {
        return res.hasOwnProperty('query') ? res['query']['pages'][Object.keys(res['query']['pages'])[0]]['revisions'][0]['*'] : null;
    },
    wikiContents2birthday = function (contents) {
        var yearkeystr = '生年 = ',
            monthkeystr = '生月 = ',
            daykeystr = '生日 = ';
        return new Date(Number(contents.substr(contents.indexOf(yearkeystr) + yearkeystr.length, 5)),
            Number(contents.substr(contents.indexOf(monthkeystr) + monthkeystr.length, 2)) - 1,
            Number(contents.substr(contents.indexOf(daykeystr) + daykeystr.length, 2)));
    },
    wikiContents2age = function (contents) {
        var date2int = function (date) {
            return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
        };
        return (Math.floor((date2int(new Date()) - date2int(wikiContents2birthday(contents))) / 10000))
    };

var agesLineChart = function (names, ages) {
    return new Chart(document.getElementById("ageChart"), {
        type: "bar",
        data: {
            labels: names,
            datasets: [
                {
                    label: 'Age',
                    data: ages,
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                    borderColor: "rgba(255, 99, 132, 1.0)",
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            title: {display: false, text: 'Ages'},
            legend: {display: false},
            scaleLabel: {display: false},
            scales: {yAxes: [{ticks: {beginAtZero: true}}]}
        },
        plugins: [{
            afterDatasetsUpdate: function (chart, options) {
                var averages = chart.config.data.datasets.map(function (dataset, idx, arr) {
                    var filtered = dataset.data.filter(function (val) {
                            return !isNaN(val)
                        }),
                        sum = filtered.reduce(function (prev, curr) {
                            return prev + curr
                        });
                    return sum / filtered.length;
                });
                chart.config.options.averages = averages;
            },
            afterRender: function (chart, options) {
                if (!chart.config.options.averages) {
                    return;
                }
                var ctxPlugin = chart.chart.ctx,
                    datasets = chart.config.data.datasets,
                    xAxe = chart.scales[chart.config.options.scales.xAxes[0].id],
                    yAxe = chart.scales[chart.config.options.scales.yAxes[0].id];

                chart.config.options.averages.forEach(function (average, idx, arr) {
                    var averagePx = yAxe.getPixelForValue(average);
                    ctxPlugin.strokeStyle = datasets[idx].borderColor;
                    ctxPlugin.beginPath();
                    ctxPlugin.moveTo(xAxe.left, averagePx);
                    ctxPlugin.lineTo(xAxe.right, averagePx);
                    ctxPlugin.stroke();

                    ctxPlugin.fillStyle = datasets[idx].borderColor;
                    ctxPlugin.font = Chart.helpers.fontString(20, 'normal', 'default');
                    ctxPlugin.textAlign = 'right';
                    ctxPlugin.textBaseline = 'bottom';
                    ctxPlugin.fillText('Average: ' + average.toFixed(2),
                        xAxe.right - 2, averagePx - 5);
                });
            }
        }]
    });
};


function AnalyzeHumanList() {
    console.log('AnalyzeHumanList');
    document.getElementById("results").style.display = "none";
    document.getElementById("loader").style.display = "block";
    charts.forEach(function (chart) {
        chart.destroy();
    });

    var form = document.forms.namedItem('humanListForm'),
        result = document.getElementById("result"),
        humanList = form.humanList.value.split('\n').filter(function (val) {
            return val != '';
        }).map(function (val) {
            return val.replace(/\s+/g, "");
        });

    if (humanList.length === 0) {
        humanList = ['水樹奈々', '田村ゆかり', '悠木碧', '堀江由衣', '植田佳奈',
            '中原麻衣', '阿澄佳奈', '田所あずさ', '諸星すみれ', '小倉唯',
            '大橋彩香', '竹達彩奈', '伊藤静', '斎藤千和', '後藤邑子',
            '柚木涼香', '能登麻美子', '水橋かおり', '沢城みゆき', '下地紫野']
    }

    $.when.apply($, humanList.map(function (name, idx, arr) {
        return getWikiContents(name);
    })).then(function () {
        var wikiContentsList = Array.prototype.slice.call(humanList.length > 1 ? arguments : [[arguments[0]]], 0).map(function (res, idx, arr) {
                return wikiResponse2Contents(res[0]);
            }),
            ageList = wikiContentsList.map(function (contents, idx, arr) {
                return wikiContents2age(contents)
            }).map(function (age, idx, arr) {
                return isNaN(age) ? NODATA_STR : age;
            });
        charts.push(agesLineChart(humanList, ageList));
        document.getElementById("loader").style.display = "none";
        document.getElementById("results").style.display = "block";
    }, function (err) {
        console.log(err)
    });
}

