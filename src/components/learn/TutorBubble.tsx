import { PURPLE } from '../../constants'

export interface TutorMessage {
  role: 'user' | 'assistant'
  content: string
}

export default function TutorBubble({ message, color = PURPLE }: { message: TutorMessage; color?: string }) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && (
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-full mr-2 text-sm font-bold"
          style={{ width: 32, height: 32, backgroundColor: color, color: '#fff', fontFamily: '"Nunito", sans-serif', alignSelf: 'flex-end' }}
        >
          L
        </div>
      )}
      <div
        style={{
          maxWidth: '75%',
          padding: '10px 14px',
          borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          backgroundColor: isUser ? color : '#fff',
          border: isUser ? 'none' : '1.5px solid rgba(0,0,0,0.08)',
          color: isUser ? '#fff' : '#18181B',
          fontFamily: '"Nunito", sans-serif',
          fontSize: 15,
          lineHeight: 1.5,
          fontWeight: 600,
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        }}
      >
        {message.content}
      </div>
    </div>
  )
}
