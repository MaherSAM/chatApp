const express = require( 'express' );
const cors = require( 'cors' );
const socketIo = require( 'socket.io' );
const http = require( 'http' );

const { addUser, removeUser, getUser, getUsersInRoom } =require('./users.js');

const app = express();

const PORT = process.env.PORT || 5000;

const router = require( './router' );
const { cpSync } = require( 'fs' );


const server = http.createServer( app );
const io = socketIo( server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});



io.on( 'connection', ( socket ) =>
{
  
    console.log( "We have a new connection !!!" );
    socket.on( 'join', ({name,room},callback) =>
    {
        const { error, user } = addUser( { id: socket.id, name, room } );
        
        if ( error ) return callback( error );

        socket.join( room );

        console.log( user );

        socket.emit( 'message', { user: 'admin', text: `${ user.name },welcome to the room ${ user.room }` } );
        socket.broadcast.to( user.room ).emit( 'message', { user: 'admin', text: `${ user.name }, has joined!` } );

    
        io.to( user.room ).emit( 'roomData', { room: user.room, users: getUsersInRoom( user.room ) } );

        callback( { 'error': null });

    })

    socket.on( 'sendMessage', (message,callback) =>
    {
        console.log( message );
        console.log( socket.id );
        const user = getUser( socket.id );
        console.log( user.room );
        io.in( user.room ).emit( 'message', { user: user.name, text: message } );
        io.to( user.room ).emit( 'roomData', { room: user.room, users: getUsersInRoom( user.room ) } );
       

        callback();
    } )

    socket.on( 'disconnect', () =>
    {
        
        console.log( 'User had left !!!' );
        var user = removeUser( socket.id );
        if (user)
        {
            io.to( user.room ).emit( 'message', { user: 'admin', text: `${ user.name } has left` } );
            }

    } );

} );


app.use( router );
app.use( cors() );


 
server.listen( PORT, () => console.log( `Server has started on port ${ PORT }` ) );