const Router = require("express").Router;
const router = Router();
const {
  createBill,
  editBill,
  deleteBill,
  restoreBill,
  fetchAllBill,
  fetchDeletedBill,
  getBillDetail,
} = require("../controllers/Order.controller");

router.post("/", createBill);
router.put("/edit-bill", editBill);
router.delete("/delete-bill", deleteBill);
router.put("/restore-bill", restoreBill);
router.get("/", fetchAllBill);
router.get("/get-deleted-bills", fetchDeletedBill);
router.get("/bill-detail", getBillDetail);

module.exports = router;
