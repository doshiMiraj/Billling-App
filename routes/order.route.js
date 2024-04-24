const Router = require("express").Router;
const router = Router();
const {
  createBill,
  editBill,
  deleteBill,
  restoreBill,
} = require("../controllers/Order.controller");

router.post("/", createBill);
router.put("/edit-bill", editBill);
router.delete("/delete-bill", deleteBill);
router.put("/restore-bill", restoreBill);

module.exports = router;
