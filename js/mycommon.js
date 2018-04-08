/**
 * Created by ryosuke on 18/03/24.
 */

'use strict';

var NODATA_STR = 'NoData',
    NOTFOUND_STR = 'NotFound',
    MAN = 'man',
    WOMAN = 'woman',
    LGBT = 'lgbt',
    int2color = function (r, g, b, a) {
        return 'rgba(' + [r, g, b, a].join(', ') + ')';
    },
    manColor = function (a) {
        return int2color(66, 164, 242, a || 1.0);
    },
    womanColor = function (a) {
        return int2color(255, 99, 132, a || 1.0);
    },
    basicColor = function (a) {
        return int2color(120, 138, 155, a || 1.0);
    },
    getColorFromSex = function (sex, a) {
        return sex == MAN ? manColor(a) : sex == WOMAN ? womanColor(a) : basicColor(a);
    },
    MANIMG = new Image(),
    WOMANIMG = new Image(),
    LGBTIMG = new Image(),
    CHARTJS = 'chartjs',
    ZINGCHART = 'zingchart',
    destroyChartjs = function (chart) {
        chart.destroy();
    },
    destroyZingchart = function (id) {
        zingchart.exec(id, 'destroy');
    },
    destroyChart = {};

destroyChart[CHARTJS] = destroyChartjs;
destroyChart[ZINGCHART] = destroyZingchart;

MANIMG.src = 'img/man.png';
WOMANIMG.src = 'img/woman.png';
LGBTIMG.src = 'img/lgbt.png';
