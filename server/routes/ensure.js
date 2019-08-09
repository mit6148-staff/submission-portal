const connect = require("connect-ensure-login");

function admin(req, res, next) {
  if (!req.user.is_admin) {
    return res.status(403).send("Admin access required");
  }

  next();
}

function sameUser(req, res, next) {
  const id = req.params.user_id;
  if (id != req.user._id && !req.user.is_admin) {
    return res.status(403).send("Forbidden");
  }

  next();
}

function noop(req, res, next) {
  next();
}

function _ensureWrap(fn) {
  // provides a bypass for testing
  if (process.env.NODE_ENV === "test") {
    return noop;
  }

  const baseEnsure = connect.ensureLoggedIn("/auth/github");
  return (req, res, next) => {
    baseEnsure(req, res, () => {
      // if user is logged in, proceed to further check
      fn(req, res, next);
    });
  };
}

module.exports = {
  loggedIn: _ensureWrap(noop),
  admin: _ensureWrap(admin),
  sameUser: _ensureWrap(sameUser)
};
