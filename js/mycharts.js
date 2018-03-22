/**
 * Created by ryosuke on 18/03/23.
 */

'use strict';

var showAveragePlugin = {
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
                ctxPlugin.fillText('Average: ' + average.toFixed(2), xAxe.right - 2, averagePx - 5);
            });
        }
    },
    agesLineChart = function (names, ages) {
        return new Chart($('#ageChart'), {
            type: "bar",
            data: {
                labels: names,
                datasets: [{
                    label: 'Age',
                    data: ages,
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                    borderColor: "rgba(255, 99, 132, 1.0)",
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
            plugins: [showAveragePlugin]
        });
    };
