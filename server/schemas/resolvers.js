const { AuthenticationError } = require('apollo-server-express');
const { User, Journal } = require('../models');

const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // Load saved books for a given user by id
        user: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id });
            }
            throw new AuthenticationError('Please log in to see your Providers & Groups.');
        },
        // Get user's journal documents
        journal: async (parent, args, context) => {
            if (context.user) {
                const user = await User.findById(context.user._id).populate( 'journals' );
                
                user.journals.reverse();

                return user;
            }
            throw new AuthenticationError('Please log in to see your Journal entries');
        },
        searchTherapy: async (parent, args) => {
            console.log("starting searchTherapy")
            const result = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?types=doctor&name=aa_support_group&sensor=false&radius=5000&key=${process.env.API_KEY}`)
            console.log(result.data)
            let data = JSON.stringify(result.data)
            return {result:data}
        },
    },
    Mutation: {
        // Login user using email and password values provided from client (LoginForm)
        login: async (parent, { email, password }) => {
            // Look for document with matching email in User collection
            const user = await User.findOne({ email });

            // Notify user if there isn't a document with provided email
            if (!user) {
                throw new AuthenticationError('Incorrect email');
            }

            // Compare password input to password in User document using custom method
            const correctPassword = await user.isCorrectPassword(password);

            // Notify user if password input doesn't match document
            if (!correctPassword) {
                throw new AuthenticationError('Incorrect credentials');
            }
            // User session is authenticated, with expiration clock started
            const token = signToken(user);
            return { token, user };
        },
        // Create user using values provided from client (SignupForm)
        createUser: async (parent, { fname, lname, email, password  }) => {
            const user = await User.create({ fname, lname, email, password  });

            // User session for newly create User is created, with expiration clock started
            const token = signToken(user);
            return { token, user };
        },
        // Update existing user document corresponding to whatever field values provided by client
        updateUser: async (parent, args, context) => {
            if (context.user) {
                return await User.findByIdAndUpdate(context.user._id, args, { new: true });
            }
            throw new AuthenticationError('Not logged in');
        },
        createJournal: async (parent, { journalData }, context) => {
            console.log(context);
            if (context.user) {
                const journal = new Journal({ journalData });
    
                await User.findByIdAndUpdate(context.user._id, { $push: { journals: journal }}, { new: true }  );
    
                return journal;
            }
            throw new AuthenticationError('Please login to add Journals');
        },
    },
};

module.exports = resolvers;