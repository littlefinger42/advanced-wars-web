import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Lobby.module.css'

export default function Lobby() {
  const navigate = useNavigate()
  const [roomCode, setRoomCode] = useState('')
  const [error, setError] = useState('')

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      if (!res.ok) throw new Error('Failed to create room')
      const data = await res.json()
      navigate(`/game/${data.roomCode}`)
    } catch {
      navigate('/game/local')
    }
  }

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault()
    const code = roomCode.trim().toUpperCase()
    if (!code) {
      setError('Enter a room code')
      return
    }
    setError('')
    navigate(`/game/${code}`)
  }

  return (
    <div className={styles.lobby}>
      <h1>Advance Wars 2</h1>
      <p className={styles.subtitle}>Turn-based tactical warfare</p>

      <div className={styles.actions}>
        <button className={styles.primary} onClick={handleCreate}>
          Create Game
        </button>

        <form onSubmit={handleJoin} className={styles.joinForm}>
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            placeholder="Room code"
            maxLength={6}
            className={styles.input}
          />
          <button type="submit" className={styles.secondary}>
            Join Game
          </button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
      </div>

      <button
        className={styles.local}
        onClick={() => navigate('/game/local')}
      >
        Local Play (Single Device)
      </button>
    </div>
  )
}
