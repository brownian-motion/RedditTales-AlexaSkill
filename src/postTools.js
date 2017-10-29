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
    const title = story.title;
    const author = story.author.name;
    const body = story.selftext;
    const url = 'https://reddit.com'+story.permalink; //permalink doesn't have the reddit url
    const subreddit = story.subreddit.display_name;
    // Create speech output
    const tagStripperRegex = /\^<>\\\/\[]=\+#/ig;

    const cardTitle = "\"" + title.replace(tagStripperRegex, ' ') + "\", by " + author + ' on ' + subreddit;
    const cardContent = body.replace(tagStripperRegex, ' ') + "\n\n" + url;
    const speechOutput = "By " + author + ".\n\n" + body.replace(tagStripperRegex, ' ');

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