require("dotenv").config();
console.log(process.env);
const mongoose = require("mongoose");

const MONGODB_URI = `mongodb+srv://${
  process.env.MONGODB_USERNAME
}:${encodeURIComponent(
  process.env.MONGODB_PASSWORD
)}@cluster0.pfqom1s.mongodb.net/?retryWrites=true&w=majority`;

console.log("MONGODB_URI:", MONGODB_URI);
console.log("MONGODB_URI:", MONGODB_URI);
console.log(process.env.MONGODB_PASSWORD);
console.log(process.env.MONGODB_USERNAME);

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connection successful");
  } catch (error) {
    console.error("Error connecting to database:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
