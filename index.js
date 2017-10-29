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
const reddit = require('./src/reddit-client').client; // exports our credential data in a private way, off source control
const packageInfo = require('./package.json');
const postTools = require('./src/postTools');
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

const handlers = {
    'LaunchRequest': function () {
        this.emit('ReadStory');
    },
    'GetSubreddit': function () {
        this.emit(':tell', "Sorry, my developer is working on that right now!");
    },
    'ReadStory': function () {
        // Get a random post from the appropriate subreddits
        //TODO: handle categories at all
        const subArr = this.t('STORY_SUBS');
        const multireddit = subArr.map(function (sub) {
            return sub.subreddit
        }).join('+');
        const alexa = this;
        postTools.getStoryPosts(multireddit, reddit)
            .done(function (stories) {
                postTools.emitRandomStoryPostFrom(stories, alexa);
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
