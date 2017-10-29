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

exports.emitStoryPost = function emitStoryPost(story, alexa) {
    // Create speech output
    const title = story.title;
    const author = story.author.name;
    const body = story.selftext;
    const url = story.permalink;

    const cardTitle = "\"" + title + "\", by " + author;
    const cardContent = body + "\n\n" + url;
    const speechOutput = "By " + author + ".\n\n" + body;

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