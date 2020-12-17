
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({

    email: {

        type: String,
        required: true

    },

    query: {

        type: String,
        required: true

    }

}, { timestamps: true });

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = { Comment };