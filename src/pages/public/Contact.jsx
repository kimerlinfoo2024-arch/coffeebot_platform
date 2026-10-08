import { useState } from 'react';
import Page from '../../components/ui/Page';
import { useStore } from '../../store/useStore';

export default function Contact() {
  const addMessage = useStore((s) => s.addMessage);
  const [topic, setTopic] = useState('A booking');
  const [text, setText] = useState('');
  const [msg, setMsg] = useState({ ok: false, text: '' });

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return setMsg({ ok: false, text: 'Write a message before sending.' });
    addMessage({ topic, text: text.trim() });
    setMsg({ ok: true, text: "Sent. It is now in CoffeeBot's inbox." });
    setText('');
  };

  return (
    <Page>
      <div className="pagehead">
        <span className="eyebrow">Contact</span>
        <h1>Talk to CoffeeBot</h1>
        <p>Questions about activities, bookings or partnerships go straight to CoffeeBot's operations team.</p>
      </div>
      <form className="panel" style={{ maxWidth: 560 }} noValidate onSubmit={submit}>
        <div className="field"><label htmlFor="cTopic">Topic</label>
          <select id="cTopic" value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option>A booking</option><option>Activities and lessons</option>
            <option>Partnership</option><option>Something else</option>
          </select></div>
        <div className="field"><label htmlFor="cMsg">Message</label>
          <textarea id="cMsg" placeholder="How can we help?" value={text} onChange={(e) => setText(e.target.value)} /></div>
        <button className="btn" type="submit">Send message</button>
        <div className={`msg ${msg.ok ? 'ok' : msg.text ? 'bad' : ''}`}>{msg.text}</div>
      </form>
    </Page>
  );
}
