const Project = require("../models/Project");
const ProjectMember = require("../models/ProjectMember");

const generate3CharKey = async (name) => {
  // 1️⃣ Extract initials
  let baseKey = name
    .replace(/[^a-zA-Z ]/g, "")
    .split(" ")
    .filter(Boolean)
    .map(word => word[0])
    .join("")
    .toUpperCase();

  // 2️⃣ Ensure exactly 3 chars
  const randomChar = () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26));

  while (baseKey.length < 3) {
    baseKey += randomChar();
  }

  baseKey = baseKey.slice(0, 3);

  let key = baseKey;
  let charCode = 65; // A

  // 3️⃣ Resolve collisions
  while (await Project.findOne({ key })) {
    key = baseKey.slice(0, 2) + String.fromCharCode(charCode);
    charCode++;

    if (charCode > 90) {
      throw new Error("Project key limit reached");
    }
  }

  return key;
};

// CREATE PROJECT
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Project name required" });
    }

    // 🔥 Generate 3-char Jira-style key
    const key = await generate3CharKey(name);

    const project = await Project.create({
      name: name.trim(),
      description,
      key,
      owner: req.user._id
    });

    // Add creator as admin
    await ProjectMember.create({
      project: project._id,
      user: req.user._id,
      role: "admin"
    });

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Project creation failed" });
  }
};

// GET PROJECTS FOR LOGGED USER
exports.getMyProjects = async (req, res) => {
  const memberships = await ProjectMember.find({ user: req.user._id })
    .populate("project");

  // 🔥 FILTER OUT DELETED PROJECTS
  const projects = memberships
    .map(m => m.project)
    .filter(p => p !== null);

  res.json(projects);
};

// ADD MEMBER TO PROJECT
exports.addMember = async (req, res) => {
  const { userId, role } = req.body;
  const projectId = req.params.id;

  await ProjectMember.create({
    project: projectId,
    user: userId,
    role
  });

  res.json({ message: "Member added" });
};

// GET PROJECT MEMBERS (for ticket assignee dropdown)
exports.getProjectMembers = async (req, res) => {
  try {
    const members = await ProjectMember
      .find({ project: req.params.projectId })
      .populate("user", "name email");

    // return only user objects
    res.json(members.map(m => m.user));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch project members" });
  }
};

// GET PROJECTS WHERE USER HAS ASSIGNED TICKETS
exports.getAssignedProjects = async (req, res) => {
  try {
    const tickets = await require("../models/Ticket").find({
      assignee: req.user._id
    }).populate("project");

    // Deduplicate projects
    const projectMap = new Map();

    tickets.forEach(t => {
      if (t.project && !projectMap.has(t.project._id.toString())) {
        projectMap.set(t.project._id.toString(), t.project);
      }
    });

    res.json(Array.from(projectMap.values()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch assigned projects" });
  }
};