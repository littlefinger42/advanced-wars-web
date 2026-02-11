import { Flex } from 'antd'

interface PageLayoutProps {
  children: React.ReactNode
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <Flex
      vertical
      align="center"
      justify="center"
      style={{
        minHeight: '100vh',
        padding: 24,
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      }}
    >
      {children}
    </Flex>
  )
}
