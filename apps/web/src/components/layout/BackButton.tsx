import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

export default function BackButton() {
  const navigate = useNavigate()
  return (
    <Button type="text" onClick={() => navigate('/')} style={{ color: 'rgba(255,255,255,0.65)' }}>
      ← Back
    </Button>
  )
}
