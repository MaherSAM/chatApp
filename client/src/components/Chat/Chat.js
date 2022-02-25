import React, { useState, useEffect } from 'react';
import {useLocation} from 'react-router-dom'
import queryString from 'query-string';
import io from 'socket.io-client';

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './chat.css'
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';


let socket;

const Chat=(  )=>
{
  const [name, setName] = useState();
  const [room, setRoom] = useState();
  const [message, setMessage] = useState( '');
  const [messages, setMessages] = useState( [] );
  const [users, setUsers] = useState( [] );

  const location  = useLocation();
  const END_POINT = process.env.END_POINT || 'localhost:5000';


  useEffect( () =>
  {
    
    const { name, room } = queryString.parse( location.search );

    socket = io( END_POINT );

    setName( name );
    setRoom( room );

    socket.emit( 'join', { name, room }, ( { error } ) =>
    {
      
    } )
  
    return () =>
    {
      socket.emit( 'disconnect' );

      socket.off();
    }
  }, [location.search, END_POINT] );
  
  useEffect( () =>
  {
    
    socket.on( 'message', ( message ) =>
    {

      setMessages( [...messages, message] );
    
    } )
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
    

  },[messages,users] );

//function send message
  const sendMessage = (event) =>
  {
    event.preventDefault();
    if ( message )
    {
      socket.emit( 'sendMessage', message, () => setMessage( '' ) );
      }
  }

  console.log( message ,messages);
  return (

    <div className='outerContainer'>
    <div className='container'>
        <InfoBar room={room} />
        <Messages messages={messages} name={name}/>
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
  
        </div>
        <TextContainer users={users}/>
      </div>

  )
}

export default Chat