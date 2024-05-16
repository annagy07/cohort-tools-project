const router = require("express").Router();

const User = require("../models/User.model");

router.get("/api/users/:id", (req, res) => {
  const UserId = req.params.id;
  User.findById(UserId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "user not found" });
      }
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed retrieving user" });
    });
});

module.exports = router;
