const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AuthenticationError, ForbiddenError } = require('apollo-server-express');
require('dotenv').config();
const mongoose = require('mongoose');

const gravatar = require('../util/gravatar');



module.exports = {
    newNote: async (parent, args, { models, user }) => {
        // Check authentication
        if (!user) {
            throw new AuthenticationError('You must be signed in to create a note');
        }

        return await models.Note.create({
            content: args.content,
            author: mongoose.Types.ObjectId(user.id)
        })
    },

    deleteNote: async (parent, { id }, { models, user }) => {
        // Check authentication
        if (!user) {
            throw new AuthenticationError('You must be signed in to delete a note');
        }

        // Find the note
        const note = await models.Note.findById(id);

        // Check if the note owner is current user
        if (note && String(note.author) !== user.id) {
            throw new ForbiddenError("You don't have permission to delete this note");
        }

        try {
            await note.remove();
            return true;
        } catch (err) {
            return false;
        }
    },

    updateNote: async (parent, { content, id }, { models }) => {
        // Check authentication
        if (!user) {
            throw new AuthenticationError('You must be signed in to update a note');
        }

        // Find the note
        const note = await models.Note.findById(id);

        // Check if the note owner is current user
        if (note && String(note.author) !== user.id) {
            throw new ForbiddenError("You don't have permission to update this note");
        }

        return await models.Note.findOneAndUpdate(
            {
                _id: id,
            },
            {
                $set: {
                    content
                }
            },
            {
                new: true
            }
        );
    },

    signUp: async (parent, { username, email, password }, { models }) => {
        // Normalize email address
        email = email.trim().toLowerCase();
        // Hash the password
        const hashed = await bcrypt.hash(password, 10);
        // Create the gravatar URL
        const avatar = gravatar(email);
        try{
            const user = await models.User.create({
                username,
                email,
                avatar,
                password: hashed
            })
            // Create and return the json web token
            return jwt.sign({id: user._id}, process.env.JWT_SECRET);
        }catch(err){
            console.log(err);
            throw new Error('Error creating account');
        }

    },

    signIn: async (parent, { username, email, password }, { models }) => {
        if (email) {
            email = email.trim().toLowerCase();
        }
        
        const user = await models.User.findOne({ 
            $or: [{ email }, { username }]
        });

        if (!user) {
            throw new AuthenticationError('Error signing in');
        }

        // Check password
        const valid = await bcrypt.compare(password, user.password);    
        if (!valid) {
            throw new AuthenticationError('Error signing in');
        }

        // Create and return the json web token
        return jwt.sign({id: user._id}, process.env.JWT_SECRET);
    },

    toggleFavorite: async (parent, { id }, { models, user }) => {
        // Check authentication
        if (!user) {
            throw new AuthenticationError();
        }

        // Check if the user has already favorited the notes
        let noteCheck = await models.Note.findById(id);
        const hasUser = noteCheck.favoritedBy.indexOf(user.id);

        // If the user has favorited the note
        if (hasUser >= 0) {
            return await models.Note.findByIdAndUpdate(
                id, 
                {
                    $pull: {
                        favoritedBy: mongoose.Types.ObjectId(user.id)
                    },
                    $inc: {
                        favoriteCount: -1
                    }
                },
                {
                    // Set new to true to return the updated doc
                    new: true
                }
            );
        } else {
            // If the user has not favorited the note
            return await models.Note.findByIdAndUpdate(
                id, 
                {
                    $push: {
                        favoritedBy: mongoose.Types.ObjectId(user.id)
                    },
                    $inc: {
                        favoriteCount: 1
                    }
                },
                {
                    new: true
                }
            );
        }
    },


    
    
};