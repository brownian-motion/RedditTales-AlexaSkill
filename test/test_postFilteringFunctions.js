require('nodeunit');

const index = require('../index');
const postTools = require('../postTools');

exports.test_emittingRandomStoryFromListEmitsOne = function (test){
    test.expect(1);
    const testAlexaObject = {
        emit: function(type){
            test.equals(type, ':tellWithCard');
        }
    };
    postTools.emitRandomStoryPost([makeBarebonesPost()], testAlexaObject);
    test.done();
};

exports.test_emittingStoryHitsCallback = function (test){
    test.expect(1);
    const testAlexaObject = {
        emit: function(type){
            test.equals(type, ':tellWithCard');
        }
    };
    postTools.emitStoryPost(makeBarebonesPost(), testAlexaObject);
    test.done();
};

function makeBarebonesPost() {
    return {
        'title': 'TITLE',
        'author': 'AUTHOR',
        'selftext': 'SELFTEXT',
        'permalink': 'PERMALINK'
    }
}