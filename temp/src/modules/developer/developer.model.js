const mongoose = require('mongoose');

const { Schema } = mongoose;

const developerSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        bio: String,
        skills: [String],
        avatarUrl: {
            type: String,
            default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPGiYz_up_5JS0SljbyfNRBWdvYFAgOTE1YA&s"
        },
        followers: [{
            type: Schema.Types.ObjectId,
            ref: "Developer"
        }],
        following: [{
            type: Schema.Types.ObjectId,
            ref: "Developer"
        }]
    },
    { timestamps: true }
);

const Developer = mongoose.model('Developer', developerSchema);

module.exports = Developer;