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
        var url = 'https://ja.wikipedia.org/w/api.php?format=json&action=query&prop=revisions&rvprop=content&titles=' + title;
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
    wikiContents2height = function (contents) {
        return Number(parseContents(contents, '身長 =', 4));
    },
    wikiContents2sex = function (contents) {
        var sex = parseContents(contents, '性別 = ', 6);
        return sex == '[[男性]]' ? MAN : sex == '[[女性]]' ? WOMAN : LGBT;
    },
    wikiContents2bloodtype = function (contents) {
        return parseContents(contents, '血液型 = [[ABO式血液型|', 2).match('[A-Z]+');
    };
