/**
 * Created by ryosuke on 18/03/11.
 */

"use strict";

var charts = [],
    resultElements = $('.result'),
    lorderElements = $('.loader'),
    turnOnResult = function (name) {
        $('#' + name + '-loader').css({'display': 'none'});
        $('#' + name + '-result').css({'display': "block"});
    };

function AnalyzeHumanList() {
    console.log('AnalyzeHumanList');
    [].forEach.call(resultElements, function (el) {
        el.style.display = 'none';
    });
    [].forEach.call(lorderElements, function (el) {
        el.style.display = 'block';
    });
    charts.forEach(function (chartinfo) {
        var t =destroyChart[chartinfo['kind']];
        destroyChart[chartinfo['kind']](chartinfo['data'])
    });

    var form = document.forms.namedItem('humanListForm'),
        humanList = form.humanList.value.split('\n').filter(function (val) {
            return val != '';
        }).map(function (val) {
            return val.replace(/\s+/g, "");
        }),
        plaintxtDeferred = $.Deferred();

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
            ageList = wikiContentsList.map(wikiContents2age).map(function (age) {
                return isNaN(age) ? NODATA_STR : age;
            }),
            heightList = wikiContentsList.map(wikiContents2height),
            sexList = wikiContentsList.map(wikiContents2sex),
            bloodtypeList = wikiContentsList.map(wikiContents2bloodtype);

        charts.push(agesBarChart(humanList, ageList, sexList));
        turnOnResult('age');

        charts.push(heightsBarChart(humanList, heightList, sexList));
        turnOnResult('height');

        charts.push(bloodtypePieChart(humanList, bloodtypeList));
        turnOnResult('bloodtype');

        $.when(kuromojiBuilderDeferred).then(function (tokenizer) {
            var plaintxtList = wikiContentsList.map(wikiContents2plaintxt),
                analyzedtxtsList = plaintxtList.map(txtAnalyzerFactory(tokenizer)),
                filteredNoumsList = analyzedtxtsList.map(noumFilter),
                filteredUniqueNoumsList = filteredNoumsList.map(makeListUnique);
            charts.push(wordcloudChart(humanList, filteredUniqueNoumsList));
            turnOnResult('wordcloud');
        }, function (err) {
            console.log(err);
        });
    }, function (err) {
        console.log(err)
    });
}

