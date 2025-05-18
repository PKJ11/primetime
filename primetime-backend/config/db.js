const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://pratikkumarjhavnit:cBkOwgGUuMB4ZMia@cluster0.sxfhet5.mongodb.net/PrimeTime?retryWrites=true&w=majority");
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
