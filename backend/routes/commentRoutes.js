const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  addComment,
  getCommentsByTicket
} = require("../controllers/commentController");

router.post("/", protect, addComment);
router.get("/:ticketId", protect, getCommentsByTicket);

module.exports = router;
