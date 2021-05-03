const express = require("express");
const verifyToken = require("../middleware/auth");
const router = express.Router();
const Invoice = require("../models/Invoice");

router.get("/", async (req, res) => {
  try {
    const invoices = await Invoice.find({});
    res.json({ success: true, invoices });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});
router.get("/getInvoiceByParticularUser", verifyToken, async (req, res) => {
  const userId = req.userId;
  try {
    const invoice = await Invoice.find({ userId: userId });
    res.json({ success: true, invoice });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});
router.post("/", verifyToken, async (req, res) => {
  const form = req.body.form;
  const { invoiceItems } = req.body;
  const { customerName, customerPhone, email, address } = form;
  const userId = req.userId;
  if (!userId) {
    return res.status(400).json({ message: "yêu cầu không hợp lệ" });
  } else if (invoiceItems.length === 0) {
    return res.status(400).json({ message: "yêu cầu không hợp lệ" });
  }
  try {
    const newInvoice = new Invoice({
      userId,
      invoiceItems,
      customerName,
      email,
      customerPhone,
      address,
    });
    await newInvoice.save();
    res.json({ sucess: true, invoice: newInvoice });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});
module.exports = router;
