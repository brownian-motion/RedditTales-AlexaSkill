'use strict';

const postTools = require('../src/postTools');

const BAREBONES_TITLE = 'TITLE';
const BAREBONES_AUTHOR = 'AUTHOR';
const BAREBONES_SELF_TEXT = 'SELFTEXT';
const BAREBONES_PERMALINK = 'PERMALINK';

exports.test_emittingStoryHitsCallback = function (test){
    test.expect(5);
    const testAlexaObject = {
        emit: function(type, speechOutput, cardTitle, cardContent){
            test.equals(type, ':tellWithCard');
            test.ok(speechOutput.includes(BAREBONES_SELF_TEXT));
            test.ok(cardTitle.includes(BAREBONES_AUTHOR));
            test.ok(cardTitle.includes(BAREBONES_TITLE));
            test.ok(cardContent.includes(BAREBONES_SELF_TEXT));
        }
    };
    postTools.emitStoryPost(makeBarebonesPost(), testAlexaObject);
    test.done();
};

exports.test_gettingRandomElementWorks = function(test){
    test.expect(1);
    const test_obj = {'test':'a'};
    test.equals(postTools.getRandomElementFrom([test_obj]), test_obj);
    test.done();
};

exports.test_emittingRandomStoryFromListEmitsOne = function (test){
    test.expect(5);
    const testAlexaObject = {
        emit: function(type, speechOutput, cardTitle, cardContent){
            test.equals(type, ':tellWithCard');
            test.ok(speechOutput.includes(BAREBONES_SELF_TEXT));
            test.ok(cardTitle.includes(BAREBONES_AUTHOR));
            test.ok(cardTitle.includes(BAREBONES_TITLE));
            test.ok(cardContent.includes(BAREBONES_SELF_TEXT));
        }
    };
    postTools.emitRandomStoryPostFrom([makeBarebonesPost()], testAlexaObject);
    test.done();
};

function makeBarebonesPost() {
    return {
        'title': BAREBONES_TITLE,
        'author': BAREBONES_AUTHOR,
        'selftext': BAREBONES_SELF_TEXT,
        'permalink': BAREBONES_PERMALINK
    }
}