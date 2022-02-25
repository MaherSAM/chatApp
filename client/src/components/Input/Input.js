import React from 'react'

import './input.css';

const Input = ({message,setMessage,sendMessage}) => {
    return (
      <form>
            <input
                className='input'
                type='text'
                placeholder='Type a message...'
                value={message}
    onChange={( event ) => { setMessage( event.target.value ); }}
    // eslint-disable-next-line no-unused-expressions
    onKeyPress={( event ) => { event.key === 'Enter' ? sendMessage(event):null;}}
            />
            <button className='sendButton' onClick={(event)=> sendMessage(event)}>Send message</button>
      </form>
  
  )
}

export default Input