/**
 * Created by ryosuke on 18/03/23.
 */

/* global require, module, exports, console */

"use strict";

var parseContents = function (contents, keystr, vallength) {
        return contents.substr(contents.indexOf(keystr) + keystr.length, vallength);
    },
    getWikiContents = function (title) {
        console.log('getWikiContents');
        var url = 'https://ja.wikipedia.org/w/api.php?format=json&action=query&prop=revisions&rvprop=content&rvparse&titles=' + title;
        return $.ajax({
            type: "get",
            dataType: 'jsonp',
            timeout: 10000,
            cache: false,
            url: url
        });
    },
    wikiResponse2Contents = function (res) {
        var contentstxt = res.hasOwnProperty('query') ? res['query']['pages'][Object.keys(res['query']['pages'])[0]]['revisions'][0]['*'] : null;
        return contentstxt != null ? $($.parseHTML(contentstxt))[0] : null;
    },
    wikiContents2birthday = function (contents) {
        var bdaystr = $(contents).find('.bday').text(),
            bdaylst = bdaystr === "" ? [NaN, NaN, NaN] : bdaystr.split('-');
        return new Date(Number(bdaylst[0]), Number(bdaylst[1]), Number(bdaylst[2]));
    },
    wikiContents2age = function (contents) {
        var date2int = function (date) {
            return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
        };
        return (Math.floor((date2int(new Date()) - date2int(wikiContents2birthday(contents))) / 10000))
    },
    wikiContents2height = function (contents) {
        var txt = $(contents).find('.infobox tr th').filter(function (idx) {
            return $(this).text() === '身長';
        }).parent().find('td').text();
        return txt === '' ? NODATA_STR : Number(txt.substr(0, txt.indexOf('cm')));
    },
    wikiContents2sex = function (contents) {
        var txt = $(contents).find('.infobox tr th').filter(function (idx) {
            return $(this).text() === '性別';
        }).parent().find('td').text();
        return txt.match('男性') ? MAN : txt.match('女性') ? WOMAN : LGBT;
    },
    wikiContents2bloodtype = function (contents) {
        var txt = $(contents).find('.infobox tr th').filter(function (idx) {
            return $(this).text() === '血液型';
        }).parent().find('td').text();
        return txt.match('[A-Z]+') || NODATA_STR;
    },
    wikiContents2plaintxt = function (contents) {
        var txt = $(contents).find('p', 'p a').text() + '\n' + $(contents).find('ul li', 'ul li a').text();
        // var txt = $(contents).find('p', 'p a', 'ul li', 'ul li a').text();
        return txt.split('\n').filter(function (str, idx, arr) {
            return str.search('[0-9]+.') !== 0;
        }).map(function (str, idx, arr) {
            return str.replace(/\[[0-9]+\]/g, '');
        }).join('\n');
    };
