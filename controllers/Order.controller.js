const Bill = require("../models/bill.model");

exports.createBill = async (req, res) => {
  try {
    const {
      billCode,
      date,
      consumerName,
      consumerCity,
      productsPurchased,
      extraCharges,
      totalAmount,
    } = req.body;

    if (
      !billCode ||
      !date ||
      !consumerName ||
      !consumerCity ||
      !productsPurchased ||
      !extraCharges ||
      !totalAmount
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const billDetails = await Bill.create({
      billCode,
      date,
      consumerName,
      consumerCity,
      productsPurchased,
      extraCharges,
      totalAmount,
    });

    return res.status(200).json({
      success: true,
      billDetails,
      message: "Bill registered successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Bill cannot be registered. Please try again",
    });
  }
};

exports.getBillDetail = async (req, res) => {
  try {
    const billCode = req.query?.billCode;

    const bill = await Bill.findOne({ billCode });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: `Bill with ${billCode} bill code not found`,
      });
    }

    return res.status(200).json({
      success: true,
      bill,
      message: "Bill details fetched successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error while fetching bill details",
    });
  }
};

exports.editBill = async (req, res) => {
  try {
    const {
      billCode,
      updatedBillCode,
      updatedDate,
      updatedConsumerName,
      updatedConsumerCity,
      updatedProductsPurchased,
      updatedExtraCharges,
      updatedTotalAmount,
    } = req.body;

    if (!billCode) {
      return res.status(400).json({
        success: false,
        message: "Bill code is required",
      });
    }

    const updatedBillDetails = await Bill.findOneAndUpdate(
      { billCode },
      {
        billCode: updatedBillCode,
        date: updatedDate,
        consumerName: updatedConsumerName,
        consumerCity: updatedConsumerCity,
        productsPurchased: updatedProductsPurchased,
        extraCharges: updatedExtraCharges,
        totalAmount: updatedTotalAmount,
      },
      { new: true }
    );

    if (!updatedBillDetails) {
      return res.status(400).json({
        success: false,
        message: "Bill with provided bill code doesn't exist",
      });
    }

    return res.status(200).json({
      success: true,
      updatedBillDetails,
      message: "Bill updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while updating bill",
    });
  }
};

exports.deleteBill = async (req, res) => {
  try {
    const { billCode } = req.params;

    if (!billCode) {
      return res.status(400).json({
        success: false,
        message: "Bill code is required",
      });
    }

    const deletedBillDetails = await Bill.findOne({ billCode });

    if (!deletedBillDetails) {
      return res.status(400).json({
        success: false,
        message: "Bill with provided bill code doesn't exists",
      });
    }

    const deletedBill = await deletedBillDetails.delete();

    return res.status(200).json({
      success: true,
      deletedBill,
      message: "Bill deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error while deleting bill",
    });
  }
};

exports.restoreBill = async (req, res) => {
  try {
    const { billCode } = req.params;

    if (!billCode) {
      return res.status(400).json({
        success: false,
        message: "Bill code is required",
      });
    }

    const deletedBill = await Bill.findDeleted({
      $and: [{ deleted: true }, { billCode: billCode }],
    });

    if (!deletedBill.length) {
      return res.status(404, "Bill with provded bill code doesn't exists");
    }

    deletedBill[0].deleted = false;
    const restoredBill = await deletedBill[0].save();

    return res.status(200).json({
      success: true,
      restoredBill,
      message: "Bill restored successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error while restoring bill",
    });
  }
};

exports.fetchAllBill = async (req, res) => {
  try {
    const totalBills = (await Bill.find()).length;

    const page = Number(req.query.page) || 0;
    const limit = Number(req.query.limit) || totalBills;
    const { search } = req.query;

    let pipeline = [];

    if (search) {
      const matchStage = {
        $or: [
          { billCode: { $regex: search, $options: "i" } },
          { date: { $regex: search, $options: "i" } },
          { consumerName: { $regex: search, $options: "i" } },
          { consumerCity: { $regex: search, $options: "i" } },
        ],
      };

      pipeline.push({ $match: matchStage });
    }

    const bills = await Bill.aggregate(pipeline)
      .skip(page * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      bills,
      totalBills,
      message: "Bills fetched successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error while fetching bills",
    });
  }
};

exports.fetchDeletedBill = async (req, res) => {
  const page = Number(req.query.page) || 0;
  const limit = Number(req.query.limit) || 5;
  const { search } = req.query;
  const deletedBills = await Bill.findDeleted({ deleted: true })
    .skip(page * limit)
    .limit(limit);

  const totalDeletedBills = deletedBills.length;

  if (!search) {
    return res.status(200).json({
      success: true,
      deletedBills,
      totalDeletedBills,
      message: "Deleted Bills fetched successfully",
    });
  }

  const filteredDeletedBills = deletedBills.filter(
    (bill) =>
      new RegExp(search, "i").test(bill.billCode) ||
      new RegExp(search, "i").test(bill.consumerName) ||
      new RegExp(search, "i").test(bill.consumerCity) ||
      new RegExp(search, "i").test(bill.date)
  );

  return res.status(200).json({
    success: true,
    deletedBills: filteredDeletedBills,
    totalDeletedBills,
    message: "Fetched deleted products based on filter successfully",
  });
};
