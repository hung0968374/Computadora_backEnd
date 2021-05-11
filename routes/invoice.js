const express = require("express");
const verifyToken = require("../middleware/auth");
const router = express.Router();
const Invoice = require("../models/Invoice");
const User = require("../models/User");

router.get("/", verifyToken, async (req, res) => {
  try {
    const invoices = await Invoice.find({}).sort({ createdAt: -1 });
    res.json({ success: true, invoices });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});
router.get("/getInvoiceByParticularUser", verifyToken, async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(403).json({ message: "Yêu cầu không hợp lệ" });
  }
  try {
    const invoices = await Invoice.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, invoices });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});
router.post("/", verifyToken, async (req, res) => {
  console.log(req.userId);
  const form = req.body.form;
  const userId = req.userId;
  const { invoiceItems } = req.body;
  const { customerName, customerPhone, email, address } = form;
  const billCharge = req.body.billCharge;
  if (!userId) {
    return res.status(403).json({ message: "Yêu cầu không hợp lệ" });
  } else if (invoiceItems.length === 0) {
    return res.status(400).json({ message: "Yêu cầu không hợp lệ" });
  }
  try {
    const newInvoice = new Invoice({
      userId,
      invoiceItems,
      customerName,
      email,
      customerPhone,
      address,
      billCharge,
    });
    await newInvoice.save();
    res.json({ sucess: true, invoice: newInvoice });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});
module.exports = router;
