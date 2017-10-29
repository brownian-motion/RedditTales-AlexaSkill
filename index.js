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
const reddit = require('./src/reddit-client').client; // exports our credential data in a private way, off source control
const postTools = require('./src/postTools');
const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const StoryTypes = {
    DEFAULT: "random",
    FUNNY: "funny",
    SCARY: "scary",
    CRINGEY: "cringey",
    REVENGE: "revenge",
    SATISFYING: "satisfying",
    REAL: "real",
    FICTION: "fictional"
};

const languageStrings = {
    'en': {
        translation: {
            SKILL_NAME: 'Reddit Tales',
            GET_SUB_MESSAGE: 'Here\' a sub called ',
            HELP_MESSAGE: 'You can say \"tell me a story\", or ask for something specific by saying \"tell me a ' + postTools.getRandomElementFrom(objectValues(StoryTypes)) + ' story\"... What would you like to hear?',
            HELP_REPROMPT: 'What would you like me to tell you?',
            STOP_MESSAGE: 'Goodbye!',
            STORY_SUBS: [
                {
                    subreddit: 'talesfromthefrontdesk',
                    name: 'Tales from the Front Desk',
                    categories: [StoryTypes.FUNNY, StoryTypes.REAL]
                },
                {
                    subreddit: 'talesfromthepizzaguy',
                    name: 'Tales from the Pizza Guy',
                    categories: [StoryTypes.FUNNY, StoryTypes.REAL]
                },
                {
                    subreddit: 'IDontWorkHereLady',
                    name: "I Don't Work Here, Lady",
                    categories: [StoryTypes.FUNNY, StoryTypes.CRINGEY, StoryTypes.REAL]
                },
                {
                    subreddit: 'pettyrevenge',
                    name: "Petty Revenge",
                    categories: [StoryTypes.REVENGE, StoryTypes.SATISFYING, StoryTypes.REAL]
                },
                {
                    subreddit: 'ProRevenge',
                    name: 'Pro Revenge',
                    categories: [StoryTypes.REVENGE, StoryTypes.SATISFYING, StoryTypes.REAL]
                },
                {
                    subreddit: 'talesfromtechsupport',
                    name: 'Tales from Tech Support',
                    categories: [StoryTypes.CRINGEY, StoryTypes.FUNNY, StoryTypes.REAL]
                },
                {
                    subreddit: 'talesfromretail',
                    name: 'Tales from Retail',
                    categories: [StoryTypes.CRINGEY, StoryTypes.FUNNY, StoryTypes.REAL]
                },
                {
                    subreddit: 'shortscarystories',
                    name: 'Short Scary Stories',
                    categories: [StoryTypes.SCARY, StoryTypes.FICTION]
                },
                {
                    subreddit: 'XcessiveWriting',
                    name: 'Stories by user XcessiveSmash',
                    categories: [StoryTypes.FICTION]
                },
                {
                    subreddit: 'Luna_Lovewell',
                    name: 'Stores by user Luna_Lovewell',
                    categories: [StoryTypes.FICTION]
                },
                {
                    subreddit: 'StoriesAboutKevin',
                    name: 'Stories About Kevin',
                    categories: [StoryTypes.FUNNY, StoryTypes.CRINGEY, StoryTypes.REAL]
                },
                {
                    subreddit: 'talesfromsecurity',
                    name: 'Tales from Security',
                    categories: [StoryTypes.REAL]
                },
                {
                    subreddit: 'todayiwaslucky',
                    name: 'Today I was Lucky',
                    categories: [StoryTypes.REAL]
                },
                {
                    subreddit: 'tifu',
                    name: 'Today I Effed Up',
                    categories: [StoryTypes.REAL, StoryTypes.CRINGEY]
                },
                {
                    subreddit: 'jd_rallage',
                    name: 'J. D. Rallage',
                    categories: [StoryTypes.FICTION]
                },
                {
                    subreddit: 'MaliciousCompliance',
                    name: 'Malicious Compliance',
                    categories: [StoryTypes.REAL, StoryTypes.SATISFYING, StoryTypes.REVENGE]
                },
                {
                    subreddit: 'rarelyfunny',
                    name: 'Stories by user RarelyFunny',
                    categories: [StoryTypes.FICTION]
                },
                {
                    subreddit: 'Romanticon',
                    name: 'Stories by user Romanticon',
                    categories: [StoryTypes.FICTION]
                },
                {
                    subreddit: 'Talesfromflightdesk',
                    name: 'Tales from the Flight Desk',
                    categories: [StoryTypes.REAL]
                }
            ]
        }
    }
};

function objectValues(object){ //because Object.values isn't in node 6.10
    return Object.keys(object).map(function(key){return object[key]});
}

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
    'AMAZON.NextIntent': function(){
        this.emit('ReadStory');
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

exports.storyTypes = StoryTypes;
exports.subreddits = {
    'en': languageStrings.en.translation.STORY_SUBS
};