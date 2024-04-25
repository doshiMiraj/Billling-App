const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const billSchema = new mongoose.Schema(
  {
    billCode: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
      set: function (date) {
        // Parse the input date string "dd, mm, yyyy" and convert it to a Date object
        const [day, month, year] = date.split(", ").map(Number);
        return new Date(year, month - 1, day);
      },
    },
    consumerName: {
      type: String,
      required: true,
    },
    consumerCity: {
      type: String,
      required: true,
    },
    productsPurchased: [
      {
        category: {
          type: String,
          required: true,
          lowercase: true,
        },
        box: {
          type: String,
          required: true,
        },
        piecesInBox: {
          type: String,
          required: true,
        },
        dollarCode: {
          type: String,
          required: true,
        },
        pricePerPiece: {
          type: String,
          required: true,
        },
        totalPieces: {
          type: String,
          required: true,
        },
        totalAmount: {
          type: String,
          required: true,
        },
      },
    ],
    extraCharges: {
      type: String,
    },
    totalAmount: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

billSchema.plugin(mongoose_delete, { overrideMethods: "all" });

module.exports = mongoose.model("Bill", billSchema);
