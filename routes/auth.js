const express = require("express");
const passport = require("passport");

const router = express.Router();

// Login route (redirects to GitHub)
router.get("/login", passport.authenticate("github", { scope: ["user:email"] }));

// GitHub Auth callback
router.get("/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login"
  }),
  (req, res) => {
    res.send("GitHub Login Successful");
  }
);

// Get current user
router.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.send("Logged out");
  });
});

module.exports = router;
