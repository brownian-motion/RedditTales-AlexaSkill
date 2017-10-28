/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';

const Alexa = require('alexa-sdk');
const snoowrap = require('snoowrap');
const credentials = require('./credentials'); // exports our credential data in a private way, off source control
const packageInfo = require('./package.json');
const postTools = require('./postTools');
var emitRandomStoryPost = postTools.emitRandomStoryPost;

const reddit = new snoowrap({
    userAgent: "alexa:reddit-tales:v" + packageInfo.version,
    clientId: credentials.clientID,
    clientSecret: credentials.clientSecret,
    username: credentials.username,
    password: credentials.password
});

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const StoryTypes = {DEFAULT: "random", FUNNY: "funny", SCARY: "scary"};

const languageStrings = {
    'en': {
        translation: {
            SKILL_NAME: 'Reddit Tales',
            GET_SUB_MESSAGE: 'Here\' a sub called ',
            HELP_MESSAGE: 'You can say tell me a story, or tell me a funny story... What would you like to hear?',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
            STORY_SUBS: [
                {
                    'subreddit': 'talesfromthefrontdesk',
                    'name': 'Tales from the front desk',
                    'categories': [StoryTypes.FUNNY]
                }
            ]
        }
    }
};

function getStoryPosts(subreddit) {
    return reddit.getSubreddit(subreddit)
        .getHot()
        .then(function (stories) {
            return stories.filter(isSFW);
        })
        .then(function (stories) {
            return stories.filter(isNotStickiedPost);
        })
        .then(function (stories) {
            return stories.filter(isTextPost);
        });
}

const handlers = {
    'LaunchRequest': function () {
        this.emit('ReadStory');
    },
    'GetSubreddit': function(){
        this.emit(':tell', "Sorry, my developer is working on that right now!");
    },
    'GetStory': function () {
        // Get a random post from the appropriate subreddits
        //TODO: handle categories at all
        const subArr = this.t('STORY_SUBS');
        const multireddit = subArr.map(function (sub) {
            return sub.subreddit
        }).join('+');

        getStoryPosts(multireddit)
            .done(function (stories) {
                emitRandomStoryPost(stories, this);
            })
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'ReadStory': function () {
        this.emit(':tell', "Hello, world!" + this.t('STORY_SUBS')[1]);
    }
};

function getSubredditsThatAre(category, alexa) {
    return alexa.t('STORY_SUBS').filter(function (sub) {
        return sub.categories.includes(category);
    });
}

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
