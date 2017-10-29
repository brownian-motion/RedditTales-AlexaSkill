const index = require('../index');

exports.test_subredditsHaveRequiredFields = function(test){
    test.expect(3* index.subreddits.en.length);
    for(var i = 0 ; i < index.subreddits.en.length; i++){
        subreddit = index.subreddits.en[i];
        test.ok(subreddit.hasOwnProperty('subreddit'));
        test.ok(subreddit.hasOwnProperty('categories'));
        test.ok(subreddit.hasOwnProperty('name'));
    }
    test.done();
};