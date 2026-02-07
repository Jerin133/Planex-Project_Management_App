const Comment = require("../models/Comment");

// ADD COMMENT
exports.addComment = async (req, res) => {
  const { ticketId, text } = req.body;

  const comment = await Comment.create({
    ticket: ticketId,
    user: req.user._id,
    text
  });

  res.status(201).json(comment);
};

// GET COMMENTS BY TICKET
exports.getCommentsByTicket = async (req, res) => {
  const { ticketId } = req.params;

  const comments = await Comment.find({ ticket: ticketId })
    .populate("user", "name email")
    .sort({ createdAt: 1 });

  res.json(comments);
};
