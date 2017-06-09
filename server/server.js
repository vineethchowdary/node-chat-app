const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
const {generateMessage,generateLocationMessage} = require('./utils/message.js');
const {isRealString} = require('./utils/validation.js');
app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');


socket.on('join',(params,callback) => {
  if(!isRealString(params.name) || !isRealString(params.room))
  {
    callback('name and room is required');
  }
   socket.join(params.room)
   //socket.leave('the office fan');
   //socket.emit--specific user
    //socket.broadcast.emit---all user except the send user---socket.broadcast.to('the office fans').emit
   //io.emi-----to all users--io.to('the office fans').emit
   socket.emit('newMessage',generateMessage('admin','welcome to chat app'));
   socket.broadcast.to(params.room).emit('newMessage',generateMessage('admin',`${params.name} has joined`));


  callback();
});

socket.on('createMessage',(message,callback) => {
  console.log(message);
   io.emit('newMessage',generateMessage(message.from,message.text));
   callback();
});


socket.on('createLocationMessage',(coords) => {
  io.emit('newLocationMessage',generateLocationMessage('admin',coords.latitude,coords.longitude));
});


  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });



});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
