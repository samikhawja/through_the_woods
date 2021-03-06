const { Schema, model } = require('mongoose');

const journalSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
        },
        body: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },
        sentiment: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
);

const Journal = model('Journal', journalSchema);

module.exports = Journal;