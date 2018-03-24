/**
 * Created by ryosuke on 18/03/23.
 */

'use strict';

var showStrPlugin = {
        afterRender: function (chart, options) {
            var ctx = chart.chart.ctx;
            ctx.font = Chart.helpers.fontString(20, 'normal', 'default');
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            chart.config.data.datasets.forEach(function (dataset, i) {
                chart.getDatasetMeta(i).data.forEach(function (metadata, j) {
                    var data = dataset.data[j],
                        position = metadata.tooltipPosition();
                    if (!isNaN(data)) {
                        return;
                    }
                    ctx.fillStyle = $.isArray(dataset.borderColor) ? dataset.borderColor[j] : dataset.borderColor;
                    ctx.fillText(data, position.x, (position.y || (metadata._yScale.bottom - 5)));
                });
            });
        }
    },
    showAveragePlugin = {
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
            var ctx = chart.chart.ctx,
                xAxe = chart.scales[chart.config.options.scales.xAxes[0].id],
                yAxe = chart.scales[chart.config.options.scales.yAxes[0].id];

            chart.config.options.averages.forEach(function (average, idx, arr) {
                var averagePx = yAxe.getPixelForValue(average);
                ctx.strokeStyle = basicColor();
                ctx.beginPath();
                ctx.moveTo(xAxe.left, averagePx);
                ctx.lineTo(xAxe.right, averagePx);
                ctx.stroke();

                ctx.fillStyle = basicColor();
                ctx.font = Chart.helpers.fontString(20, 'normal', 'default');
                ctx.textAlign = 'right';
                ctx.textBaseline = 'bottom';
                ctx.fillText('Average: ' + average.toFixed(2), xAxe.right - 2, averagePx - 5);
            });
        }
    },
    addBackgroundImgPlugin = {
        afterDatasetsUpdate: function (chart, options) {
            var ctx = chart.chart.ctx;
            chart.config.data.datasets.forEach(function (dataset, i) {
                chart.getDatasetMeta(i).data.forEach(function (metadata, j) {
                    var data = dataset.data[j],
                        img = sexes[j] == MAN ? MANIMG : sexes[j] == WOMAN ? WOMANIMG : LGBTIMG;
                    dataset.backgroundColor = ctx.createPattern(img, 'repeat')
                });
            });
        }
    },
    agesBarChart = function (names, ages, sexes) {
        return new Chart($('#ageChart'), {
            type: "bar",
            data: {
                labels: names,
                datasets: [{
                    label: 'Age',
                    data: ages,
                    backgroundColor: sexes.map(function (sex) {
                        return getColorFromSex(sex, 0.6);
                    }),
                    borderColor: sexes.map(function (sex) {
                        return getColorFromSex(sex);
                    }),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                title: {display: false, text: 'Ages'},
                legend: {display: false},
                scaleLabel: {display: false},
                scales: {yAxes: [{ticks: {beginAtZero: true}}]}
            },
            plugins: [showAveragePlugin, showStrPlugin]
        });
    },
    heightsBarChart = function (names, heights, sexes) {
        return new Chart($('#heightChart'), {
            type: "bar",
            data: {
                labels: names,
                datasets: [{
                    label: 'Heights',
                    data: heights,
                    backgroundColor: sexes.map(function (sex) {
                        return getColorFromSex(sex, 0.6);
                    }),
                    borderColor: sexes.map(function (sex) {
                        return getColorFromSex(sex);
                    }),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                title: {display: false, text: 'Heights'},
                legend: {display: false},
                scaleLabel: {display: false},
                scales: {yAxes: [{ticks: {beginAtZero: true}}]}
            },
            plugins: [showAveragePlugin, showStrPlugin]
        });
    },
    bloodtypePieChart = function (names, bloodtypes) {
        var BTKeys = ['A', 'B', 'O', 'AB', 'NoData'],
            bloodtypeMap = {};
        BTKeys.forEach(function (key) {
            bloodtypeMap[key] = [];
        });
        bloodtypes.forEach(function (bt, idx, arr) {
            if (BTKeys.indexOf(bt)) {
                bloodtypeMap[bt].push(names[idx]);
            } else {
                bloodtypeMap['others'].push(names[idx]);
            }
        });
        return new Chart($('#bloodtypeChart'), {
            type: "doughnut",
            data: {
                labels: BTKeys,
                datasets: [{
                    label: 'BloodType',
                    data: BTKeys.map(function (key) {
                        return bloodtypeMap[key].length;
                    }),
                    backgroundColor: [
                        int2color(236, 240, 62, 0.6),
                        int2color(246, 251, 254, 0.6),
                        int2color(29, 68, 147, 0.6),
                        int2color(209, 39, 51, 0.6),
                        basicColor(0.6)
                    ]
                }]
            },
            options: {
                responsive: true,
                title: {display: false, text: 'BloodType'},
                legend: {display: true, position: 'top'},
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem, data) {
                            var bt = data.labels[tooltipItem.index];
                            return bt + ': ' + bloodtypeMap[bt].join(', ');
                        }
                    }
                }
            },
            plugins: []
        });
    };
