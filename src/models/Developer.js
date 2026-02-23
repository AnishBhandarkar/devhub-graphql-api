const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const developerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    bio: String,
    skills: [String],
    avatarUrl: {
      type: String,
      default:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPGiYz_up_5JS0SljbyfNRBWdvYFAgOTE1YA&s',
    },
    followers: [{ type: Schema.Types.ObjectId, ref: 'Developer' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'Developer' }],
  },
  { timestamps: true }
);

// Hash password before saving
developerSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Instance method to compare password
developerSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Developer = mongoose.model('Developer', developerSchema);
module.exports = Developer;