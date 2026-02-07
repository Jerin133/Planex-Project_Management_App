const Ticket = require("../models/Ticket");
const User = require("../models/User");
const ProjectMember = require("../models/ProjectMember");
const ALLOWED_STATUS = ["todo", "in-progress", "done"];

// CREATE TICKET
exports.createTicket = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      projectId,
      assigneeEmail
    } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ message: "Title and project are required" });
    }

    let assigneeUser = null;
    if (assigneeEmail) {
      assigneeUser = await User.findOne({ email: assigneeEmail });
    }

    const ticket = await Ticket.create({
      title,
      description,
      priority,
      project: projectId,
      assignee: assigneeUser?._id || null,
      reporter: req.user._id
    });

    // ✅ SAFE MEMBER UPSERTS (Jira-style)
    await ProjectMember.updateOne(
      { project: projectId, user: req.user._id },
      { $setOnInsert: { role: "member" } },
      { upsert: true }
    );

    if (assigneeUser) {
      await ProjectMember.updateOne(
        { project: projectId, user: assigneeUser._id },
        { $setOnInsert: { role: "member" } },
        { upsert: true }
      );
    }

    res.status(201).json(ticket);
  } catch (error) {
    console.error("Create ticket failed:", error);
    res.status(500).json({ message: "Failed to create ticket" });
  }
};

// GET TICKETS BY PROJECT
exports.getTicketsByProject = async (req, res) => {
  const { projectId, status, priority, assignee, search } = req.query;

  const query = { project: projectId };

  if (status) {
    query.status = status;
  }

  if (priority) {
    query.priority = priority;
  }

  if (assignee) {
    query.assignee = assignee;
  }

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  const tickets = await Ticket.find(query)
    .populate("assignee", "name email")
    .populate("reporter", "name email")
    .sort({ createdAt: -1 });

  res.json(tickets);
};

// UPDATE TICKET
exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (req.body.status && !ALLOWED_STATUS.includes(req.body.status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    Object.assign(ticket, req.body);
    await ticket.save();

    res.json(ticket);
  } catch (err) {
    console.error("Update ticket failed:", err);
    res.status(500).json({ message: "Failed to update ticket" });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (
      ticket.reporter.toString() !== req.user._id.toString() &&
      ticket.assignee?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await ticket.deleteOne();
    res.json({ message: "Ticket deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete ticket" });
  }
};

// ASSIGN USER
exports.assignTicket = async (req, res) => {
  const { assigneeId } = req.body;

  const ticket = await Ticket.findByIdAndUpdate(
    req.params.id,
    { assignee: assigneeId },
    { new: true }
  );

  res.json(ticket);
};

// GET ALL TICKETS FOR DASHBOARD
exports.getAllTicketsForUser = async (req, res) => {
  const tickets = await Ticket.find({
    $or: [
      { reporter: req.user._id },
      { assignee: req.user._id }
    ]
  })
  .populate("project", "name key")
  .populate("assignee", "name email");

  res.json(tickets);
};
