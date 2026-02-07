const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createTicket,
  getTicketsByProject,
  getAllTicketsForUser,
  updateTicket,
  deleteTicket,
  assignTicket
} = require("../controllers/ticketController");

router.post("/", protect, createTicket);
router.get("/", protect, getTicketsByProject);
router.put("/:id", protect, updateTicket);
router.delete("/:id", protect, deleteTicket);
router.patch("/:id/assign", protect, assignTicket);
router.get("/all", protect, getAllTicketsForUser);

module.exports = router;
