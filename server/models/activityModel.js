import mongoose from "mongoose";

const activitySchema = mongoose.Schema(
  {
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
