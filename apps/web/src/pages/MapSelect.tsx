import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card, Spin, Alert, Typography, Row, Col } from 'antd'
import PageLayout from '../components/layout/PageLayout'
import BackButton from '../components/layout/BackButton'

interface MapInfo {
  id: string
  name: string
  width: number
  height: number
}

export default function MapSelect() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') ?? 'local'

  const [maps, setMaps] = useState<MapInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/maps')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load maps')
        return res.json()
      })
      .then(setMaps)
      .catch(() => setError('Could not load maps'))
      .finally(() => setLoading(false))
  }, [])

  const handleSelect = async (mapId: string) => {
    if (mode === 'local') {
      navigate('/game/local', { state: { mapId } })
      return
    }

    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mapId }),
      })
      if (!res.ok) throw new Error('Failed to create room')
      const data = await res.json()
      navigate(`/game/${data.roomCode}`)
    } catch {
      navigate('/game/local', { state: { mapId } })
    }
  }

  if (loading) {
    return (
      <PageLayout>
        <div style={{ alignSelf: 'flex-start' }}>
          <BackButton />
        </div>
        <Spin size="large" style={{ marginTop: 48 }} />
        <Typography.Text style={{ color: '#94a3b8', marginTop: 16 }}>
          Loading maps...
        </Typography.Text>
      </PageLayout>
    )
  }

  if (error) {
    return (
      <PageLayout>
        <div style={{ alignSelf: 'flex-start' }}>
          <BackButton />
        </div>
        <Alert message={error} type="error" showIcon style={{ marginTop: 16 }} />
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div style={{ width: '100%', maxWidth: 640 }}>
        <div style={{ alignSelf: 'flex-start', marginBottom: 24 }}>
          <BackButton />
        </div>
        <Typography.Title level={2} style={{ color: '#eee', margin: '0 0 4px' }}>
          Select Map
        </Typography.Title>
        <Typography.Text style={{ color: '#94a3b8', marginBottom: 32, display: 'block' }}>
          {mode === 'local' ? 'Local Play' : 'Create Online Game'}
        </Typography.Text>

        <Row gutter={[16, 16]}>
          {maps.map((m) => (
            <Col xs={24} sm={12} md={8} key={m.id}>
              <Card
                hoverable
                onClick={() => handleSelect(m.id)}
                style={{ textAlign: 'center' }}
              >
                <Typography.Text strong style={{ display: 'block', marginBottom: 4 }}>
                  {m.name}
                </Typography.Text>
                <Typography.Text type="secondary">
                  {m.width}×{m.height}
                </Typography.Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </PageLayout>
  )
}
