const mongoose = require('mongoose');

// Define database Schema
const noteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    }
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
