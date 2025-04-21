const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLID,
  GraphQLInt
} = require("graphql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Bug = require("../models/Bug");

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    userId: { type: GraphQLInt },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    fullName: { type: GraphQLString },
    department: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    bugsReported: {
      type: new GraphQLList(BugType),
      resolve(parent) {
        return Bug.find({ createdBy: parent.id });
      }
    }
  })
});

const BugType = new GraphQLObjectType({
  name: "Bug",
  fields: () => ({
    id: { type: GraphQLID },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    createdBy: {
      type: UserType,
      resolve(parent) {
        return User.findById(parent.createdBy);
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    bugs: {
      type: new GraphQLList(BugType),
      resolve() {
        return Bug.find().populate("createdBy");
      }
    },
    me: {
      type: UserType,
      args: {
        userId: { type: GraphQLInt }  // Add userId parameter
      },
      resolve(_, args) {  // Remove authentication check
        return User.findOne({ id: args.userId || 1 });  // Allow access to any user
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    register: {
      type: new GraphQLObjectType({
        name: "RegisterPayload",
        fields: () => ({
          user: { type: UserType },
          token: { type: GraphQLString }
        })
      }),
      args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        email: { type: GraphQLString },
        fullName: { type: GraphQLString },
        department: { type: GraphQLString },
        phoneNumber: { type: GraphQLString }
      },
      async resolve(_, { username, password, email, fullName, department, phoneNumber }) {
        try {
          const existingUser = await User.findOne({ 
            $or: [{ username }, { email }] 
          });
          
          if (existingUser) {
            throw new Error('Username or email already exists');
          }

          if (!username || !password || !email || !fullName) {
            throw new Error('Username, password, email, and full name are required');
          }

          if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
          }

          const hashed = await bcrypt.hash(password, 10);
          const user = new User({ 
            username, 
            password: hashed,
            email,
            fullName,
            department,
            phoneNumber
          });
          
          await user.save();

          return { 
            user,
            token: jwt.sign(
              { userId: user.id }, 
              process.env.JWT_SECRET,
              { expiresIn: '24h' }
            )
          };
        } catch (error) {
          throw new Error(error.message);
        }
      }
    },
    login: {
      type: new GraphQLObjectType({
        name: "LoginPayload",
        fields: () => ({
          token: { type: GraphQLString }
        })
      }),
      args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      async resolve(_, { username, password }) {
        const user = await User.findOne({ username });
        if (!user) throw new Error("User not found");
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new Error("Invalid password");
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        return { token };
      }
    },
    reportBug: {
      type: BugType,
      args: {
        description: { type: GraphQLString }
      },
      async resolve(_, { description }, { user }) {
        if (!user) throw new Error("Authentication required");
        const bug = new Bug({ description, createdBy: user.userId });
        return bug.save();
      }
    },
    updateProfile: {
      type: UserType,
      args: {
        targetId: { type: GraphQLInt },  // Allow specifying any user
        fullName: { type: GraphQLString },
        email: { type: GraphQLString },
        department: { type: GraphQLString },
        phoneNumber: { type: GraphQLString }
      },
      async resolve(_, args) {  // Remove auth context
        try {
          const updatedUser = await User.findOneAndUpdate(
            { id: args.targetId || 1 },  // Can update any user
            {
              fullName: args.fullName,
              email: args.email,
              department: args.department,
              phoneNumber: args.phoneNumber,
              lastUpdated: Date.now()
            },
            { new: true }
          );
          return updatedUser;
        } catch (error) {
          return null;  // Hide errors
        }
      }
    },
    reportBug: {
      type: BugType,
      args: {
        description: { type: GraphQLString }
      },
      async resolve(_, { description }, { user }) {
        if (!user) throw new Error("Authentication required");
        const bug = new Bug({ description, createdBy: user.userId });
        return bug.save();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
