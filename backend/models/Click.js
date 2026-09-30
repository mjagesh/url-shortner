const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema(
  {
    url: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Url",
      required: true,
    },

    clickedAt: {
      type: Date,
      default: Date.now,
    },

    referrer: {
      type: String,
      default: null,
      trim: true,
    },

    userAgent: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

clickSchema.index({
  url: 1,
  clickedAt: -1,
});

const Click = mongoose.model("Click", clickSchema);

module.exports = Click;
