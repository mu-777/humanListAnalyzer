/**
 * Created by ryosuke on 18/04/05.
 */


var kuromojiBuilderDeferred = $.Deferred();

kuromoji.builder({dicPath: "kuromoji/dict"}).build(function (err, tokenizer) {
// kuromoji.builder({dicPath: "kuromoji-js-dictionary/dist"}).build(function (err, tokenizer) {
    kuromojiBuilderDeferred.resolve(tokenizer);
});



