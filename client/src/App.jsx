import { useState, useEffect } from 'react'
import io from 'socket.io-client'
import './App.css'

const socket = io('http://localhost:4000')


function App() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])


  const handleSubmit = (e) => {
    e.preventDefault()
    // CON ESTO LE EMITO EL MENSAJE AL BACK
    socket.emit('message', message)


    const newMessage = {
      body: message,
      from: 'Me'
    }
    setMessages([... messages, newMessage])
    setMessage('')
  }

  useEffect(() => { 
    const recibirMessage = message => {
      setMessages([...messages, message])
    }
    socket.on('message',  recibirMessage)

    return () => {
      socket.off('message',  recibirMessage)
    }
  }, [messages])

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center ">

      <form onSubmit={handleSubmit} className="bg-zinc-900 p-10 w-9/12	">
        <h1 className='text-2xl font-bold my-2'>Chat con react</h1>
        <ul className='h-80 overflow-y-auto'>
          {messages.map((message, index) => (
            <li key={index} className={`my-2 p-2 table text-sm rounded-xl ${message.from === 'Me' ? 'bg-black ml-auto': 'bg-sky-700'}`}>
              <p>{message.from}: {message.body}</p>
            </li>
          ))}  
        </ul>
        <input 
          type="text" 
          onChange={ e => setMessage(e.target.value)} 
          value={message}
          className ="border-2 rounded-xl border-zinc-500 p-2 text-black w-full"
        />
        {/* <button className='bg-blue-500 px-4 py-2 '>Send</button> */} 
      </form>
    </div>
  )
}

export default App
