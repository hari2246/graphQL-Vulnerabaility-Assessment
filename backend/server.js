const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/graphql", graphqlHTTP((req) => {
  const token = req.headers.authorization?.split(" ")[1];
  let user = null;

  if (token) {
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      console.error("Invalid token");
    }
  }

  return {
    schema,
    context: { user },
    graphiql: true
    // validationRules: [depthLimit(2)] 
  };
}));

app.listen(4000, () => console.log("Server running at http://localhost:4000/graphql"));
