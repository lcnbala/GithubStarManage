var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var UserSchema = new Schema({
    _id: String,
    username: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    accessToken: String,
    email: {
        type: String,
        index: true,
        match: /.+\@.+\..+/
    },
    avatar_url: String,
    html_url: String,
    name: String,
    blog: String,
    location: String,
    email: String,
    type:String,
    followers: Number,
    following: Number,
    created_at: String,
    updated_at: String,
    gsm_signup: {
        type: Date,
        default: Date.now
    },
    gsm_signin: {
        type: Date,
        default: Date.now
    },
    repositories: [],
    tags: []
});




// Find possible not used username
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
    var _this = this;

    // Add a 'username' suffix
    var possibleUsername = username + (suffix || '');

    // Use the 'User' model 'findOne' method to find an available unique username
    _this.findOne({
        username: possibleUsername
    }, function(err, user) {
        // If an error occurs call the callback with a null value, otherwise find find an available unique username
        if (!err) {
            // If an available unique username was found call the callback method, otherwise call the 'findUniqueUsername' method again with a new suffix
            if (!user) {
                callback(possibleUsername);
            } else {
                return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
            }
        } else {
            callback(null);
        }
    });
};

mongoose.model('User', UserSchema);
