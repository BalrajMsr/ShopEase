import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user","admin"], default: "user" },
  phoneNumber: { type: String  },
  address: { type: String  },
  city: { type: String  },
  state: { type: String  },
  country: { type: String  },
  zipCode: { type: String  },
  emailVerified: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("User", userSchema);