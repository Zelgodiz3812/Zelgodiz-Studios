
import rileyCoreAgent from './riley-core-agent';

export default function RileyPanel() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');


  async function sendMessage() {
    if (!input) return;
    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    let reply;
    // If user asks for code, use Riley's local model
    if (/code|generate|write|function|script|component|class|example/i.test(input)) {
      const code = await rileyCoreAgent.generateCode(input, 128);
      reply = {
        role: 'riley',
        text: code,
        reasoning: 'Generated using Riley\'s local open-source model.'
      };
    } else {
      // Fallback to compliance/logic/other answers
      const result = rileyCoreAgent.getPrompt ? rileyCoreAgent.getPrompt() : 'Riley is ready.';
      reply = {
        role: 'riley',
        text: result,
        reasoning: 'Compliance and reasoning enforced.'
      };
    }
    setMessages((prev) => [...prev, reply]);
  }

  return (
    <div style={{ padding: 10, background: '#111', color: '#fff', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: 10 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ color: msg.role === 'user' ? '#0ff' : '#fff', marginBottom: 6 }}>
            <strong>{msg.role === 'user' ? 'You' : 'Riley'}:</strong>
            {msg.text && msg.text.trim().startsWith('```') ? (
              <pre style={{ background: '#222', color: '#0f0', padding: 8, borderRadius: 4, marginTop: 4 }}>{msg.text.replace(/^```[a-z]*|```$/g, '')}</pre>
            ) : (
              <span> {msg.text}</span>
            )}
            {msg.reasoning && (
              <div style={{ fontSize: '0.85em', color: '#0ff', marginTop: 2 }}>
                <em>Reasoning: {msg.reasoning}</em>
              </div>
            )}
          </div>
        ))}
      </div>
      <input
        style={{ padding: 8, background: '#222', color: '#fff', border: '1px solid #333' }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Ask Riley anything..."
      />
    </div>
  );
}
