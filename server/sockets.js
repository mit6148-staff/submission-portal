let io, socketmap;

module.exports = {
  init: (http) => {
    io = require("socket.io")(http);

    socketmap = {};
    io.on("connection", (socket) => {
      socket.on("init", (data) => {
        console.log(`User ${data.user_id} connected to socket with team ${data.team_id}`);
        if (data.team_id) {
          socket.join(data.team_id)
        }
        socketmap[data.user_id] = socket;
      });
    });
  },

  addUser: (user, socket) => (socketmap[user] = socket),
  getUser: (user) => socketmap[user],
  getIo: () => io,

  // for test purposes
  mockInit: () => {
    const socketMock = {
      join: () => {},
      emit: () => {},
    };
    socketMock.in = () => socketMock;
    io = socketMock;
    return io;
  },
};
