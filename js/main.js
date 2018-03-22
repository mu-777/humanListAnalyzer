/**
 * Created by ryosuke on 18/03/11.
 */

"use strict";

var charts = [],
    resultElements = $('.result'),
    lorderElements =$('.loader'),
    turnOnResult = function (name) {
        $('#'+name+'-loader').css({'display': 'none'});
        $('#'+name+'-result').css({'display': "block"});
    };

function AnalyzeHumanList() {
    console.log('AnalyzeHumanList');
    [].forEach.call(resultElements, function (el) {el.style.display= 'none';});
    [].forEach.call(lorderElements, function (el) {el.style.display= 'block';});

    charts.forEach(function (chart) {
        chart.destroy();
    });

    var form = document.forms.namedItem('humanListForm'),
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
        turnOnResult('age');

    }, function (err) {
        console.log(err)
    });
}

