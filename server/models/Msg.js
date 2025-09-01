import mongoose from "mongoose";

const msgSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  text: {
    type: String,
    default: ""
  },
  media: {
    type: String,
    default: ""
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

msgSchema.pre("validate", function(next) {
  if (!this.text && !this.media) {
    return next(new Error("Either text or media is required"));
  }
  next();
});

const Msg = mongoose.model("Msg", msgSchema);

export default Msg;
