const mongoose = require('mongoose');

// Define database Schema
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      index: { unique: true }
    },
    email: { 
      type: String,
      required: true,
      index: { unique: true }
    },
    password: {
        type: String,
        required: true,

    },
    avatar: {
        type: String,
    }
  },
  {
    timestamps: true
  }
);



// Export the module
module.exports = mongoose.model('User', UserSchema);
