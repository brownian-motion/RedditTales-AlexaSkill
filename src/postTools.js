exports.isTextPost = function isTextPost(post) {
    return Boolean(post.selftext);
};

exports.isNotStickiedPost = function isNotStickiedPost(post) {
    return !post.stickied;
};

exports.isSFW = function isSFW(post) {
    return !post.over_18;
};

exports.isStoryPost = function (post) {
    return exports.isSFW(post) && exports.isTextPost(post) && exports.isNotStickiedPost(post);
};

exports.getStoryPosts = function (subreddit, reddit) {
    return reddit
        .getSubreddit(subreddit)
        .getHot()
        .filter(exports.isStoryPost);
};

exports.withoutTagCharacters = function (text) {
    const tagStripperRegex = /[\^<>\\\/\[\]=+#{}]/ig;
    return text.replace(/&/, ' and ').replace(tagStripperRegex, ' ');
};

exports.withoutLinks = function(text){
    const urlMatcher = /http(s?):\/\/\S+/ig;
    return text.replace(urlMatcher, ' ');
};

exports.withoutEditAtEnd = function(text){
    const editMatchingRegex = /EDIT[:|\n].*/ig;
    return text.replace(editMatchingRegex, '');
};

exports.emitStoryPost = function emitStoryPost(story, alexa) {
    const title = exports.withoutTagCharacters(story.title);
    const author = story.author.name;
    const body = exports.withoutTagCharacters(exports.withoutLinks(exports.withoutEditAtEnd(story.selftext)));
    const url = 'https://reddit.com'+story.permalink; //permalink doesn't have the reddit url
    const subreddit = story.subreddit.display_name; //TODO: get the subreddit's pronouncable name
    // Create speech output

    const cardTitle = "\"" + title + "\", by " + author + ' on ' + subreddit;
    const cardContent = body + "\n\n" + url;
    const speechOutput = "Here's a story by " + author + ".\n\n" + body;

    alexa.emit(':tellWithCard', speechOutput, cardTitle, cardContent);
};


exports.getRandomElementFrom = function (array) {
    if(array.length === 0){
        throw new Error("Pulling from an empty array");
    }
    return array[Math.floor(Math.random() * array.length)];
};

exports.emitRandomStoryPostFrom = function emitRandomStoryPost(stories, alexa) {
    exports.emitStoryPost(exports.getRandomElementFrom(stories), alexa);
};