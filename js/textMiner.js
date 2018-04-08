/**
 * Created by ryosuke on 18/04/05.
 */


var kuromojiBuilderDeferred = $.Deferred(),
    txtAnalyzerFactory = function (tokenizer) {
        return function (plaintxt, idx, arr) {
            return tokenizer.tokenize(plaintxt);
        };
    },
    noumFilter = function (analyzedtxts) {
        return analyzedtxts.filter(function (analyzedtxt) {
            return analyzedtxt['pos'] === '名詞';
        }).map(function (noumtxt) {
            return noumtxt['surface_form'];
        }).filter(function (noumstr) {
            return noumstr.length > 1 && noumstr.match('[0-9!"$%&\\\'()\\*\\+\\-\\.,\\/:;<=>?@\\[\\\\\\]^_`{|}~]+$') == null;
        });
    },
    makeListUnique = function (list) {
        return Array.from(new Set(list));
    },
    wordcloudChart = function (humanList, wordsList) {
        var id = 'wordcloudChart',
            freqPerHuman = wordsList.splice(1, wordsList.length - 1).reduce(function (prev, curr, idx) {
                return prev.map(function (dict) {
                    var noum = Object.keys(dict)[0],
                        curridx = curr.indexOf(noum);
                    if (curridx >= 0) {
                        dict[noum].push(humanList[idx + 1]);
                        curr.splice(curridx, 1);
                    }
                    return dict;
                }).concat(curr.map(function (noum) {
                    var d = {};
                    d[noum] = [humanList[idx + 1]];
                    return d;
                }));
            }, wordsList[0].map(function (noum) {
                var d = {};
                d[noum] = [humanList[0]];
                return d;
            }));

        zingchart.render({
            id: id,
            data: {
                "graphset": [{
                    "type": "wordcloud",
                    "options": {
                        "style": {"tooltip": {visible: true, text: '%text: %hits'}},
                        'words': freqPerHuman.filter(function (freqdict) {
                            return freqdict[Object.keys(freqdict)[0]].length > 1;
                        }).map(function (freqdict) {
                            var key = Object.keys(freqdict)[0];
                            return {'text': key, 'count': freqdict[key].length}
                        })
                    }
                }]
            },
            height: 700,
            width: '100%'
        });
        return {
            'kind': ZINGCHART,
            'data': id
        };
    };

kuromoji.builder({dicPath: "kuromoji/dict"}).build(function (err, tokenizer) {
// kuromoji.builder({dicPath: "kuromoji-js-dictionary/dist"}).build(function (err, tokenizer) {
// kuromoji.builder({dicPath: "dist"}).build(function (err, tokenizer) {
    console.log('tokenizer built');
    kuromojiBuilderDeferred.resolve(tokenizer);
});



