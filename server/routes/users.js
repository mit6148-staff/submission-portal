/* Defines all routes under /api/users/ */

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const errorWrap = require("./errorWrap");
const ensure = require("./ensure");
const utils = require("./util");

function findUser(year, id, populate) {
  const filter = id.length > 0 ? { _id: id } : { year: year };
  const query = User.find(filter);
  if (populate) {
    query.populate("team");
  }

  return query.exec();
}

//gets all users registesred in the current year
router.get("/", ensure.admin, async (req, res) => {
  const users = await findUser(req.year, "", req.query.populate === "true");
  if (req.query.searchQuery != null) {
    console.log(users)
    res.send(utils.searchFilter(users, req.query.searchQuery, ["first_name", "last_name", "github_username"]));
  }
  else {
    res.send(users);
  }
});

router.get(
  "/:user_id",
  ensure.sameUser,
  errorWrap(async (req, res) => {
    const user = await findUser(req.year, req.params["user_id"], true);
    res.send(user);
  })
);

router.post(
  "/:user_id/update",
  ensure.sameUser,
  errorWrap(async (req, res) => {
    const result = await User.findByIdAndUpdate(
      req.params["user_id"],
      req.body
    );

    if (!result) return res.sendStatus(404);
    res.sendStatus(204);
  })
);

router.post(
  "/:user_id/tag",
  ensure.admin,
  errorWrap(async (req, res) => {
    const result = await User.findByIdAndUpdate(req.params["user_id"], {
      $addToSet: { tags: req.body.tag }
    });

    if (!result) return res.sendStatus(404);
    res.sendStatus(204);
  })
);

router.delete(
  "/:user_id/tag",
  ensure.admin,
  errorWrap(async (req, res) => {
    const result = await User.findByIdAndUpdate(req.params["user_id"], {
      $pull: { tags: req.body.tag }
    });

    if (!result) return res.sendStatus(404);
    res.sendStatus(204);
  })
);

router.delete(
  "/:user_id",
  ensure.admin,
  errorWrap(async (req, res) => {
    await User.findByIdAndDelete(req.params["user_id"]);
    console.log(`deleted user ${req.params["user_id"]}`);
    res.sendStatus(204);
  })
);
module.exports = router;
