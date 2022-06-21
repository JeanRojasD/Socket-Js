import { SyntheticEvent, useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

function App() {
  const [message, setMessage] = useState('')
  const [socket, setSocket] = useState<Socket>()
  const connectedRef = useRef(false)

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()

    if (!socket) return

    socket.emit('message:send', message, (response: any) => {

      alert(response)

    })

    console.log(message)
  }

  useEffect(() => {
    if (connectedRef.current) return

    const connection = io('http://localhost:5000')

    setSocket(connection)

    connectedRef.current = true
  }, [])

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="message"
        placeholder="Digite sua mensagem..."
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Enviar</button>
    </form>
  )
}

export default App
