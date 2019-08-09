/* Defines all routes under /api/users/ */

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const errorWrap = require("./errorWrap");
const ensure = require("./ensure");
const utils = require("./util.js");

function find_user(year, id, populate, callback) {
  const filter = id.length > 0 ? { _id: id } : { year: year };
  const query = User.find(filter);
  if (populate) {
    query.populate("team");
  }
  query.exec((err, data) => {
    callback(data);
  });
}

//gets all users registesred in the current year
router.get("/", ensure.admin, async (req, res) => {
  find_user(
    await utils.get_filter_year(req),
    "",
    req.query.populate === "true",
    data => res.send(data)
  );
});

router.get(
  "/:user_id",
  ensure.sameUser,
  errorWrap(async (req, res) => {
    find_user(req.year, req.params["user_id"], true, data => res.send(data));
  })
);

router.post("/:user_id/update", (req, res) => {
  const updates = req.body;
  User.findByIdAndUpdate(req.params["user_id"], updates).then(data => {
    if (!data) return res.sendStatus(404);
    res.sendStatus(204);
  });
});

router.post("/:user_id/tag", (req, res) => {
  User.findByIdAndUpdate(req.params["user_id"], {
    $addToSet: { tags: req.body.tag }
  }).then(data => {
    if (!data) return res.sendStatus(404);
    res.sendStatus(204);
  });
});

router.delete("/:user_id/tag", (req, res) => {
  User.findByIdAndUpdate(req.params["user_id"], {
    $pull: { tags: req.body.tag }
  }).then(data => {
    if (!data) return res.sendStatus(404);
    res.sendStatus(204);
  });
});

router.delete("/:user_id", (req, res) => {
  User.findByIdAndDelete(req.params["user_id"], err => {
    if (err) {
      console.log("error deleting");
      res.sendStatus(500);
    } else {
      console.log(`deleted user ${req.params["user_id"]}`);
      res.sendStatus(204);
    }
  });
});
module.exports = router;
