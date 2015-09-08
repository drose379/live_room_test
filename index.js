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


var rooms = {};

app.get("/",function(request,response) {
	response.sendFile(__dirname + '/index.html');
});

io.on('connection',function(socket) {
	
	var userName;
	var socketRoom;

	socket.on('roomSelect',function(room) {
		socket.join(room);
		socketRoom = room;

		if(room in rooms == false) {
			rooms[room] = {};
		}

		//check if rooms object already has field for this room, if yes, leave it alone, if no, create a new field for users of this room, add users in 'nameEntered' event

	});

	socket.on('nameEntered',function(name) {
		rooms[socketRoom][name] = name;
		userName = name;
		socket.broadcast.to(socketRoom).emit('userEnter',name);
		io.sockets.in(socketRoom).emit('updateActiveUsers',JSON.stringify(rooms[socketRoom]));

		//add user to their respective room object in the rooms object
			//only emit the part of rooms that the user is a part of

	});

	socket.on('disconnect',function() {
		socket.broadcast.to(socketRoom).emit('userLeft',userName);
		
		var inner = rooms[socketRoom];
		delete inner[userName];

		io.sockets.in(socketRoom).emit('updateActiveUsers',JSON.stringify(rooms[socketRoom]));
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