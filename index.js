var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

/**
	* TO START: just keep a live list of users and names connected to the room. say when user connects and disconnects from room, once comfterble with concepts, implement rooms.
	
	** Steps to check understanding 

	* Add a real time user count
	* Along with X has Connected and X has left, show list of users who are currently in the room ==
	* Implement rooms

	** Issues
*/


var activeUsers = {};

app.get("/",function(request,response) {
	response.sendFile(__dirname + '/index.html');
});

io.on('connection',function(socket) {
	
	var userName;

	socket.on('nameEntered',function(name) {
		activeUsers[name] = name;
		userName = name;
		io.emit('userEnter',name);
		io.emit('updateActiveUsers',JSON.stringify(activeUsers));
		console.log(JSON.stringify(activeUsers));
	});

	socket.on('disconnect',function() {
		io.emit('userLeft',userName);
		delete activeUsers[userName];
		io.emit('updateActiveUsers',JSON.stringify(activeUsers));
	});

	/**
		* Listen for socket roomchange event, will receive room as string, join the room here. 
		* When user chooses a room, only emit their name to the given room with socket.broadcast.to(room).
		* FActive users in the same room will only get notified of new users who enter the same room as them
			* May have to get rid of active users when first imeplemting rooms, and just have the "Activtiy" section, once comfterble with rooms, implement active users
			* Create a rooms parent object, with inner arrays of each room and users inside.
	*/

});


http.listen(3000,function() {
	console.log("Running");
}) 