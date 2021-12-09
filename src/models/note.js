const mongoose = require('mongoose');

// Define database Schema
const noteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref:'user',
      required: true
    },
    favoriteCount: {
      type: Number,
      default: 0
    },
    favoritedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true
  }
);

// // Define 'Note' model with noteSchema
// const Note = mongoose.model('Note',noteSchema);

// // Export the module
// module.exports = Note;

// Export the module
module.exports = mongoose.model('Note', noteSchema);
