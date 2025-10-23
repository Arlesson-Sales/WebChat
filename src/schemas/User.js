import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    online: Boolean,
    token: String,
    name: String,
    hash: String,
});

export default mongoose.model("User", UserSchema);
