const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: function() { return !this.googleId; } }, // Password required only for non-Google users
    role: { 
      type: String, 
      enum: ["user", "provider"], 
      default: "user" 
    },
    businessName: { type: String }, // Only for providers
    servicesOffered: [{ type: String }], // Only for providers
    googleId: { type: String, unique: true, sparse: true }, // Google ID for Google-authenticated users
    avatar: { type: String } // Store Google profile picture
  },
  { timestamps: true }
);

// Hash password before saving (Only if password is present)
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next(); // Skip hashing if password is absent (Google users)
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
