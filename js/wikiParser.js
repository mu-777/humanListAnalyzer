/**
 * Created by ryosuke on 18/03/23.
 */

/* global require, module, exports, console */

"use strict";

var NODATA_STR = 'NoData',
    NOTFOUND_STR = 'NotFound',
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
