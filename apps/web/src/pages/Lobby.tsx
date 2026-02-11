import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Alert, Typography } from 'antd'
import PageLayout from '../components/layout/PageLayout'

export default function Lobby() {
  const navigate = useNavigate()
  const [roomCode, setRoomCode] = useState('')
  const [error, setError] = useState('')

  const handleCreate = () => {
    navigate('/map-select?mode=create')
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
    <PageLayout>
      <Typography.Title level={2} style={{ color: '#eee', margin: '0 0 4px' }}>
        Advance Wars 2
      </Typography.Title>
      <Typography.Text style={{ color: '#94a3b8', marginBottom: 16, display: 'block' }}>
        Turn-based tactical warfare
      </Typography.Text>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 320 }}>
        <Button type="primary" size="large" block onClick={handleCreate}>
          Create Game
        </Button>

        <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Input
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Room code"
              maxLength={6}
              size="large"
              style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}
            />
          <Button type="default" htmlType="submit" size="large" block>
              Join Game
            </Button>
          {error && (
            <Alert message={error} type="error" showIcon style={{ marginBottom: 8 }} />
          )}
        </form>

        <Button
          type="default"
          ghost
          size="large"
          block
          onClick={() => navigate('/map-select?mode=local')}
          style={{ marginTop: 32, borderColor: '#475569', color: '#94a3b8' }}
        >
          Local Play (Single Device)
        </Button>
      </div>
    </PageLayout>
  )
}
