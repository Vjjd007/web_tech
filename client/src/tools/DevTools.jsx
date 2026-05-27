import { useState } from 'react';
function CopyBtn({ text }) { const [c, setC] = useState(false); return <button className="copy-btn" onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(() => setC(false), 1500); }}>{c ? '✓ Copied' : 'Copy'}</button>; }

function JSONFormatter({ logUsage }) {
  const [input, setInput] = useState(''); const [result, setResult] = useState('');
  const format = () => { try { const r = JSON.stringify(JSON.parse(input), null, 2); setResult(r); logUsage(input.substring(0,50), 'JSON Format'); } catch (e) { setResult('Invalid JSON: ' + e.message); } };
  return (<div><div className="input-group"><label>JSON Input</label><textarea value={input} onChange={e => setInput(e.target.value)} placeholder='{"key": "value"}' rows={6}/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={format} style={{width:'auto'}}>Format</button><button className="btn btn-secondary" onClick={() => { try { const r = JSON.stringify(JSON.parse(input)); setResult(r); logUsage(input.substring(0,50), 'JSON Minify'); } catch(e) { setResult('Invalid JSON'); } }}>Minify</button></div>
    {result && <div className="tool-result"><pre>{result}</pre><CopyBtn text={result}/></div>}</div>);
}
function Base64Enc({ logUsage }) {
  const [input, setInput] = useState(''); const [result, setResult] = useState('');
  const enc = () => { const r = btoa(unescape(encodeURIComponent(input))); setResult(r); logUsage(input.substring(0,50), 'Base64 Enc'); };
  return (<div><div className="input-group"><label>Text to Encode</label><textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Enter text" rows={4}/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={enc} style={{width:'auto'}}>Encode</button></div>
    {result && <div className="tool-result"><pre>{result}</pre><CopyBtn text={result}/></div>}</div>);
}
function Base64Dec({ logUsage }) {
  const [input, setInput] = useState(''); const [result, setResult] = useState('');
  const dec = () => { try { const r = decodeURIComponent(escape(atob(input))); setResult(r); logUsage(input.substring(0,50), 'Base64 Dec'); } catch { setResult('Invalid Base64'); } };
  return (<div><div className="input-group"><label>Base64 to Decode</label><textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Enter base64" rows={4}/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={dec} style={{width:'auto'}}>Decode</button></div>
    {result && <div className="tool-result"><pre>{result}</pre><CopyBtn text={result}/></div>}</div>);
}
function UUIDGen({ logUsage }) {
  const [uuids, setUuids] = useState([]); const [count, setCount] = useState(1);
  const gen = () => { const arr = []; for (let i = 0; i < count; i++) arr.push(crypto.randomUUID()); setUuids(arr); logUsage(count + ' UUIDs', 'UUID Gen'); };
  return (<div><div className="input-group"><label>Count</label><input type="number" min="1" max="50" value={count} onChange={e => setCount(e.target.value)}/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={gen} style={{width:'auto'}}>Generate</button></div>
    {uuids.length > 0 && <div className="tool-result"><pre>{uuids.join('\n')}</pre><CopyBtn text={uuids.join('\n')}/></div>}</div>);
}
function RegexTest({ logUsage }) {
  const [pattern, setPattern] = useState(''); const [flags, setFlags] = useState('g'); const [text, setText] = useState(''); const [result, setResult] = useState('');
  const test = () => { try { const re = new RegExp(pattern, flags); const matches = [...text.matchAll(re)]; setResult(matches.length ? `Found ${matches.length} match(es):\n${matches.map((m,i) => `${i+1}. "${m[0]}" at index ${m.index}`).join('\n')}` : 'No matches found.'); logUsage(pattern, 'Regex Test'); } catch(e) { setResult('Error: ' + e.message); } };
  return (<div><div className="input-row"><div className="input-group"><label>Pattern</label><input type="text" value={pattern} onChange={e => setPattern(e.target.value)} placeholder="\\w+"/></div>
    <div className="input-group"><label>Flags</label><input type="text" value={flags} onChange={e => setFlags(e.target.value)} placeholder="gi" style={{maxWidth:80}}/></div></div>
    <div className="input-group"><label>Test String</label><textarea value={text} onChange={e => setText(e.target.value)} placeholder="Enter text to test" rows={4}/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={test} style={{width:'auto'}}>Test</button></div>
    {result && <div className="tool-result"><pre>{result}</pre></div>}</div>);
}
function HashGen({ logUsage }) {
  const [input, setInput] = useState(''); const [result, setResult] = useState('');
  const hash = async () => {
    const enc = new TextEncoder().encode(input);
    const sha256 = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', enc))).map(b => b.toString(16).padStart(2,'0')).join('');
    setResult(`SHA-256: ${sha256}`); logUsage(input.substring(0,50), 'Hash Gen');
  };
  return (<div><div className="input-group"><label>Text</label><textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Enter text to hash" rows={3}/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={hash} style={{width:'auto'}}>Generate Hash</button></div>
    {result && <div className="tool-result"><pre>{result}</pre><CopyBtn text={result}/></div>}</div>);
}
function PasswordGen({ logUsage }) {
  const [len, setLen] = useState(16); const [result, setResult] = useState('');
  const gen = () => { const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-='; let pw = ''; const arr = new Uint32Array(len); crypto.getRandomValues(arr); arr.forEach(v => pw += chars[v % chars.length]); setResult(pw); logUsage(len + ' chars', 'Password Gen'); };
  return (<div><div className="input-group"><label>Length: {len}</label><input type="range" min="8" max="64" value={len} onChange={e => setLen(e.target.value)} style={{width:'100%'}}/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={gen} style={{width:'auto'}}>Generate Password</button></div>
    {result && <div className="tool-result"><pre style={{fontSize:18,letterSpacing:2}}>{result}</pre><CopyBtn text={result}/></div>}</div>);
}
function CodeFmt({ logUsage }) {
  const [input, setInput] = useState(''); const [result, setResult] = useState('');
  const format = () => { try { let formatted = input.replace(/;/g, ';\n').replace(/{/g, ' {\n  ').replace(/}/g, '\n}\n'); setResult(formatted); logUsage('Code Format', 'Dev Tool'); } catch { setResult(input); } };
  return (<div><div className="input-group"><label>Code</label><textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Paste code here" rows={8}/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={format} style={{width:'auto'}}>Format</button></div>
    {result && <div className="tool-result"><pre>{result}</pre><CopyBtn text={result}/></div>}</div>);
}
function MarkdownEditor({ logUsage }) {
  const [md, setMd] = useState('# Hello World\n\nThis is **bold** and *italic*.\n\n- Item 1\n- Item 2\n\n```js\nconsole.log("hello");\n```');
  const toHtml = (text) => text.replace(/^### (.+)$/gm, '<h3>$1</h3>').replace(/^## (.+)$/gm, '<h2>$1</h2>').replace(/^# (.+)$/gm, '<h1>$1</h1>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>').replace(/`(.+?)`/g, '<code style="background:#2d2d2d;padding:2px 6px;border-radius:4px;color:#e6e6e6">$1</code>').replace(/^- (.+)$/gm, '<li>$1</li>').replace(/\n/g, '<br/>');
  return (<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
    <div><div className="input-group"><label>Markdown</label><textarea value={md} onChange={e => {setMd(e.target.value); if(e.target.value.length%50===0) logUsage('Markdown Edit', 'Dev Tool');}} rows={15} style={{fontFamily:'monospace'}}/></div></div>
    <div><label style={{display:'block',fontSize:13,fontWeight:600,color:'var(--text-secondary)',marginBottom:6}}>Preview</label><div style={{padding:16,background:'var(--bg-tertiary)',borderRadius:'var(--radius-md)',minHeight:300}} dangerouslySetInnerHTML={{__html: toHtml(md)}}/></div>
  </div>);
}
function ColorConverter({ logUsage }) {
  const [color, setColor] = useState('#6C5CE7'); const [result, setResult] = useState('');
  const convert = () => {
    const hex = color.replace('#',''); const r = parseInt(hex.substr(0,2),16), g = parseInt(hex.substr(2,2),16), b = parseInt(hex.substr(4,2),16);
    const h = r/255, s2 = g/255, l2 = b/255, max = Math.max(h,s2,l2), min = Math.min(h,s2,l2), l = (max+min)/2;
    setResult(`HEX: ${color}\nRGB: rgb(${r}, ${g}, ${b})\nHSL: hsl(${Math.round(l*360)}, ${Math.round(l*100)}%, ${Math.round(l*100)}%)`);
    logUsage(color, 'Color Convert');
  };
  return (<div><div className="input-row"><div className="input-group"><label>Color</label><input type="color" value={color} onChange={e => setColor(e.target.value)} style={{height:50,padding:4}}/></div>
    <div className="input-group"><label>HEX</label><input type="text" value={color} onChange={e => setColor(e.target.value)}/></div></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={convert} style={{width:'auto'}}>Convert</button></div>
    {result && <div className="tool-result"><pre>{result}</pre><CopyBtn text={result}/><div style={{width:80,height:80,background:color,borderRadius:'var(--radius-md)',marginTop:12}}/></div>}</div>);
}
function SQLFmt({ logUsage }) {
  const [input, setInput] = useState(''); const [result, setResult] = useState('');
  const format = () => { const keywords = ['SELECT','FROM','WHERE','AND','OR','JOIN','LEFT','RIGHT','INNER','ON','ORDER BY','GROUP BY','HAVING','INSERT','INTO','VALUES','UPDATE','SET','DELETE','CREATE','TABLE','ALTER','DROP','LIMIT','OFFSET','UNION','AS','IN','NOT','NULL','IS','BETWEEN','LIKE','EXISTS','DISTINCT','COUNT','SUM','AVG','MAX','MIN']; let f = input; keywords.forEach(k => { f = f.replace(new RegExp(`\\b${k}\\b`, 'gi'), '\n' + k); }); setResult(f.trim()); logUsage('SQL Format', 'Dev Tool'); };
  return (<div><div className="input-group"><label>SQL</label><textarea value={input} onChange={e => setInput(e.target.value)} placeholder="SELECT * FROM users WHERE id = 1" rows={6}/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={format} style={{width:'auto'}}>Format SQL</button></div>
    {result && <div className="tool-result"><pre>{result}</pre><CopyBtn text={result}/></div>}</div>);
}
function APITester({ logUsage }) {
  const [url, setUrl] = useState(''); const [method, setMethod] = useState('GET'); const [body, setBody] = useState(''); const [result, setResult] = useState(''); const [loading, setLoading] = useState(false);
  const send = async () => { setLoading(true); try { const opts = { method }; if (method !== 'GET' && body) opts.body = body; opts.headers = {'Content-Type':'application/json'}; const res = await fetch(url, opts); const text = await res.text(); try { setResult(JSON.stringify(JSON.parse(text), null, 2)); } catch { setResult(text); } logUsage(url, `API Request (${method})`); } catch(e) { setResult('Error: ' + e.message); } setLoading(false); };
  return (<div><div className="input-row"><div className="input-group"><label>Method</label><select value={method} onChange={e => setMethod(e.target.value)}><option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option></select></div>
    <div className="input-group" style={{flex:3}}><label>URL</label><input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://api.example.com/data"/></div></div>
    {method !== 'GET' && <div className="input-group"><label>Body (JSON)</label><textarea value={body} onChange={e => setBody(e.target.value)} rows={4}/></div>}
    <div className="tool-actions"><button className="btn btn-primary" onClick={send} disabled={loading} style={{width:'auto'}}>{loading ? 'Sending...' : 'Send Request'}</button></div>
    {result && <div className="tool-result"><pre>{result}</pre><CopyBtn text={result}/></div>}</div>);
}
function JWTDecode({ logUsage }) {
  const [token, setToken] = useState(''); const [result, setResult] = useState('');
  const decode = () => { try { const parts = token.split('.'); if (parts.length !== 3) throw new Error('Invalid JWT'); const header = JSON.parse(atob(parts[0])); const payload = JSON.parse(atob(parts[1])); setResult(`Header:\n${JSON.stringify(header,null,2)}\n\nPayload:\n${JSON.stringify(payload,null,2)}`); logUsage('JWT Decode', 'Dev Tool'); } catch(e) { setResult('Invalid JWT: ' + e.message); } };
  return (<div><div className="input-group"><label>JWT Token</label><textarea value={token} onChange={e => setToken(e.target.value)} placeholder="eyJhbGciOiJIUzI1NiIs..." rows={4}/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={decode} style={{width:'auto'}}>Decode</button></div>
    {result && <div className="tool-result"><pre>{result}</pre><CopyBtn text={result}/></div>}</div>);
}
function HTMLPreview({ logUsage }) {
  const [html, setHtml] = useState('<h1 style="color: #6C5CE7;">Hello World!</h1>\n<p>Edit HTML and see live preview.</p>');
  return (<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
    <div><div className="input-group"><label>HTML Code</label><textarea value={html} onChange={e => {setHtml(e.target.value); if(e.target.value.length%50===0) logUsage('HTML Edit', 'Dev Tool');}} rows={15} style={{fontFamily:'monospace'}}/></div></div>
    <div><label style={{display:'block',fontSize:13,fontWeight:600,color:'var(--text-secondary)',marginBottom:6}}>Preview</label><div style={{padding:16,background:'white',borderRadius:'var(--radius-md)',minHeight:300,color:'#333',border:'1px solid var(--border)'}} dangerouslySetInnerHTML={{__html: html}}/></div>
  </div>);
}
function CSSMin({ logUsage }) {
  const [input, setInput] = useState(''); const [result, setResult] = useState('');
  const minify = () => { const r = input.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s+/g,' ').replace(/\s*([{}:;,])\s*/g,'$1').replace(/;}/g,'}').trim(); setResult(r); logUsage('CSS Minify', 'Dev Tool'); };
  return (<div><div className="input-group"><label>CSS</label><textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Paste CSS here" rows={8}/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={minify} style={{width:'auto'}}>Minify CSS</button></div>
    {result && <div className="tool-result"><pre>{result}</pre><CopyBtn text={result}/><p style={{fontSize:12,color:'var(--text-muted)',marginTop:8}}>Reduced: {((1-result.length/input.length)*100).toFixed(1)}%</p></div>}</div>);
}

import { QRCodeCanvas } from 'qrcode.react';

function QRCodeGen({ logUsage }) {
  const [text, setText] = useState('https://studenthub.io');
  const download = () => {
    const c = document.getElementById('qr-canvas');
    const u = c.toDataURL('image/png');
    const a = document.createElement('a'); a.href = u; a.download = 'qrcode.png'; a.click();
    logUsage(text, 'QR Code Download');
  };
  return (<div style={{textAlign:'center'}}>
    <div className="input-group"><label>Content (URL or Text)</label><input type="text" value={text} onChange={e => setText(e.target.value)}/></div>
    <div style={{background:'white',padding:20,display:'inline-block',borderRadius:'var(--radius-md)',marginTop:16}}>
      <QRCodeCanvas id="qr-canvas" value={text} size={200} level="H" includeMargin={true}/>
    </div>
    <div className="tool-actions" style={{justifyContent:'center'}}><button className="btn btn-primary" onClick={download} style={{width:'auto'}}>Download QR</button></div>
  </div>);
}

export default function DevTools({ toolId, logUsage }) {
  const map = { 
    'json-formatter': <JSONFormatter logUsage={logUsage}/>, 
    'base64-encoder': <Base64Enc logUsage={logUsage}/>, 
    'base64-decoder': <Base64Dec logUsage={logUsage}/>, 
    'uuid-generator': <UUIDGen logUsage={logUsage}/>, 
    'regex-tester': <RegexTest logUsage={logUsage}/>, 
    'hash-generator': <HashGen logUsage={logUsage}/>, 
    'password-generator': <PasswordGen logUsage={logUsage}/>, 
    'code-formatter': <CodeFmt logUsage={logUsage}/>, 
    'markdown-editor': <MarkdownEditor logUsage={logUsage}/>, 
    'color-converter': <ColorConverter logUsage={logUsage}/>, 
    'sql-formatter': <SQLFmt logUsage={logUsage}/>, 
    'api-tester': <APITester logUsage={logUsage}/>, 
    'jwt-decoder': <JWTDecode logUsage={logUsage}/>, 
    'html-previewer': <HTMLPreview logUsage={logUsage}/>, 
    'css-minifier-dev': <CSSMin logUsage={logUsage}/>,
    'qrcode-generator': <QRCodeGen logUsage={logUsage}/>
  };
  return map[toolId] || <p>Tool coming soon!</p>;
}
