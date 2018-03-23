/**
 * Created by ryosuke on 18/03/23.
 */

/* global require, module, exports, console */

"use strict";

var NODATA_STR = 'NoData',
    NOTFOUND_STR = 'NotFound',
    parseContents = function (contents, keystr, vallength) {
        return contents.substr(contents.indexOf(keystr) + keystr.length, vallength);
    },
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
        return new Date(Number(parseContents(contents, '生年 = ', 5)),
            Number(parseContents(contents, '生月 = ', 2)) - 1,
            Number(parseContents(contents, '生日 = ', 2)));
    },
    wikiContents2age = function (contents) {
        var date2int = function (date) {
            return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
        };
        return (Math.floor((date2int(new Date()) - date2int(wikiContents2birthday(contents))) / 10000))
    },
    wikiContents2tall = function (contents) {
        return Number(parseContents(contents, '身長 = ', 3));
    },
    // return 1: men, 2: women, 3: others
    wikiContents2sex = function (contents) {
        var sex = parseContents(contents, '性別 = ', 6);
        return sex == '[[男性]]' ? 1 : sex == '[[女性]]' ? 2 : 3;
    };
