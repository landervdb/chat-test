var app = require('express')(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);

io.enable('browser client minification');
io.enable('browser client gzip'); 

server.listen(8080);

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/static/index.html');
});

io.sockets.on('connection', function (socket) {
	socket.on('set nickname', function (name) {
		socket.set('nickname', name, function () {
			socket.broadcast.emit('member joined', name);
		});
	})

	socket.on('chat message sent', function (message) {
		socket.get('nickname', function (err, name) {
			console.log(name + ': ' + message);
			socket.broadcast.emit('chat message received', { user: name, msg: message });
		});
	})
});

console.log('Server listening on port 8080');