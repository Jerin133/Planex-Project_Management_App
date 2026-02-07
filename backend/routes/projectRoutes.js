const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createProject,
  getMyProjects,
  addMember,
  getProjectMembers,
  getAssignedProjects
} = require("../controllers/projectController");

router.post("/", protect, createProject);
router.get("/", protect, getMyProjects);
router.post("/:id/members", protect, addMember);
router.get("/:projectId/members", protect, getProjectMembers);
router.get("/assigned", protect, getAssignedProjects);

module.exports = router;
