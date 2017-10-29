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

exports.text_emittingStoryWithEditOmitsEdit = function(test){
    test.expect(6);
    const testPost = makeBarebonesPost();
    testPost.selftext += "\n EDIT: Wow, gold? Thanks, stranger!";
    const testAlexaObject = {
        emit: function(type, speechOutput, cardTitle, cardContent){
            test.equals(type, ':tellWithCard');
            test.ok(speechOutput.includes(BAREBONES_SELF_TEXT));
            test.ok(!speechOutput.includes('EDIT'));
            test.ok(cardTitle.includes(BAREBONES_AUTHOR));
            test.ok(cardTitle.includes(BAREBONES_TITLE));
            test.ok(cardContent.includes(BAREBONES_SELF_TEXT));
        }
    };
    postTools.emitStoryPost(testPost, testAlexaObject);
    test.done();
};

exports.test_emittingStoryWithTheWordEditDoesNotOmitEdit = function(test){
    test.expect(7);
    const testPost = makeBarebonesPost();
    testPost.selftext += "\n don't edit this please";
    const testAlexaObject = {
        emit: function(type, speechOutput, cardTitle, cardContent){
            test.equals(type, ':tellWithCard');
            test.ok(speechOutput.includes(BAREBONES_SELF_TEXT));
            test.ok(speechOutput.includes('edit'));
            test.ok(speechOutput.includes('please'));
            test.ok(cardTitle.includes(BAREBONES_AUTHOR));
            test.ok(cardTitle.includes(BAREBONES_TITLE));
            test.ok(cardContent.includes(BAREBONES_SELF_TEXT));
        }
    };
    postTools.emitStoryPost(testPost, testAlexaObject);
    test.done();
};

exports.test_emittingXMLDropsTags = function(test){
    test.expect(8);
    const testPost = makeBarebonesPost();
    testPost.selftext += "\n <div id=\"myid\">content</div>";
    const testAlexaObject = {
        emit: function(type, speechOutput, cardTitle, cardContent){
            test.equals(type, ':tellWithCard');
            test.ok(speechOutput.includes(BAREBONES_SELF_TEXT));
            test.ok(!speechOutput.includes('<'), "didn't drop less than tag");
            test.ok(!speechOutput.includes('>'), "didn't drop greater than tag");
            test.ok(!speechOutput.includes('='), "didn't drop equals sign");
            test.ok(cardTitle.includes(BAREBONES_AUTHOR));
            test.ok(cardTitle.includes(BAREBONES_TITLE));
            test.ok(cardContent.includes(BAREBONES_SELF_TEXT));
        }
    };
    postTools.emitStoryPost(testPost, testAlexaObject);
    test.done();
};


exports.test_emittingAmpersandAsAnd = function(test){
    test.expect(7);
    const testPost = makeBarebonesPost();
    testPost.selftext += "\n this & that";
    const testAlexaObject = {
        emit: function(type, speechOutput, cardTitle, cardContent){
            test.equals(type, ':tellWithCard');
            test.ok(speechOutput.includes(BAREBONES_SELF_TEXT));
            test.ok(!speechOutput.includes('&'), "didn't convert ampersand");
            test.ok(speechOutput.includes(' and '), "didn't convert ampersand");
            test.ok(cardTitle.includes(BAREBONES_AUTHOR));
            test.ok(cardTitle.includes(BAREBONES_TITLE));
            test.ok(cardContent.includes(BAREBONES_SELF_TEXT));
        }
    };
    postTools.emitStoryPost(testPost, testAlexaObject);
    test.done();
};

function makeBarebonesPost() {
    return {
        title: BAREBONES_TITLE,
        author: {name: BAREBONES_AUTHOR} ,
        subreddit: {display_name: 'BAREBONES_SUBREDDIT'},
        selftext: BAREBONES_SELF_TEXT,
        permalink: BAREBONES_PERMALINK
    }
}
