const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema(
  {
    role: String,
  },
  { timestamps: true }
);

User.plugin(passportLocalMongoose);

module.exports = mongoose.models.User || mongoose.model('User', User);
export default mongoose.models.User || mongoose.model('User', User);
