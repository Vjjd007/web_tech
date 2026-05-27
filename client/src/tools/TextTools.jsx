import { useState } from 'react';
function CopyBtn({ text }) { const [c, setC] = useState(false); return <button className="copy-btn" onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(() => setC(false), 1500); }}>{c ? '✓ Copied' : 'Copy'}</button>; }

function WordCounter({ logUsage }) {
  const [text, setText] = useState(''); 
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length; const charsNoSpace = text.replace(/\s/g,'').length;
  if (text.length > 0 && text.length % 50 === 0) logUsage(text.substring(0,50), 'Word Count');
  const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim()).length;
  return (<div><div className="input-group"><label>Text</label><textarea value={text} onChange={e => setText(e.target.value)} placeholder="Type or paste your text here..." rows={8}/></div>
    <div className="stats-grid"><div className="stat-card"><div className="stat-icon purple">📝</div><div className="stat-info"><h3>{words}</h3><p>Words</p></div></div>
    <div className="stat-card"><div className="stat-icon green">🔤</div><div className="stat-info"><h3>{chars}</h3><p>Characters</p></div></div>
    <div className="stat-card"><div className="stat-icon pink">💬</div><div className="stat-info"><h3>{sentences}</h3><p>Sentences</p></div></div>
    <div className="stat-card"><div className="stat-icon blue">📄</div><div className="stat-info"><h3>{paragraphs}</h3><p>Paragraphs</p></div></div></div>
    <p style={{fontSize:13,color:'var(--text-muted)'}}>Characters (no spaces): {charsNoSpace} | Reading time: ~{Math.ceil(words/200)} min</p></div>);
}
function CharCounter({ logUsage }) {
  const [text, setText] = useState('');
  if (text.length > 0 && text.length % 50 === 0) logUsage(text.substring(0,50), 'Char Count');
  return (<div><div className="input-group"><label>Text</label><textarea value={text} onChange={e => setText(e.target.value)} placeholder="Type text..." rows={6}/></div>
    <div className="stats-grid"><div className="stat-card"><div className="stat-icon purple">🔤</div><div className="stat-info"><h3>{text.length}</h3><p>With Spaces</p></div></div>
    <div className="stat-card"><div className="stat-icon green">📝</div><div className="stat-info"><h3>{text.replace(/\s/g,'').length}</h3><p>Without Spaces</p></div></div></div></div>);
}
function TextReverser({ logUsage }) {
  const [input, setInput] = useState(''); const result = input.split('').reverse().join('');
  return (<div><div className="input-group"><label>Text</label><textarea value={input} onChange={e => {setInput(e.target.value); logUsage(input.substring(0,50), 'Text Reverse');}} placeholder="Enter text to reverse" rows={4}/></div>
    {input && <div className="tool-result"><pre>{result}</pre><CopyBtn text={result}/></div>}</div>);
}
function UpperCase({ logUsage }) {
  const [input, setInput] = useState(''); const result = input.toUpperCase();
  return (<div><div className="input-group"><label>Text</label><textarea value={input} onChange={e => {setInput(e.target.value); logUsage(input.substring(0,50), 'Uppercase');}} placeholder="Enter text" rows={4}/></div>
    {input && <div className="tool-result"><pre>{result}</pre><CopyBtn text={result}/></div>}</div>);
}
function LowerCase({ logUsage }) {
  const [input, setInput] = useState(''); const result = input.toLowerCase();
  return (<div><div className="input-group"><label>Text</label><textarea value={input} onChange={e => {setInput(e.target.value); logUsage(input.substring(0,50), 'Lowercase');}} placeholder="Enter text" rows={4}/></div>
    {input && <div className="tool-result"><pre>{result}</pre><CopyBtn text={result}/></div>}</div>);
}
function RemoveDups({ logUsage }) {
  const [input, setInput] = useState(''); const [result, setResult] = useState('');
  const remove = () => { const lines = input.split('\n'); const r = [...new Set(lines)].join('\n'); setResult(r); logUsage('Remove Duplicates', 'Text Tool'); };
  return (<div><div className="input-group"><label>Text (one item per line)</label><textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Line 1\nLine 2\nLine 1" rows={6}/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={remove} style={{width:'auto'}}>Remove Duplicates</button></div>
    {result && <div className="tool-result"><pre>{result}</pre><CopyBtn text={result}/></div>}</div>);
}
function SortText({ logUsage }) {
  const [input, setInput] = useState(''); const [result, setResult] = useState('');
  const sort = (desc) => { const lines = input.split('\n').filter(l => l.trim()); lines.sort(); if (desc) lines.reverse(); setResult(lines.join('\n')); logUsage('Sort Text', 'Text Tool'); };
  return (<div><div className="input-group"><label>Text (one item per line)</label><textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Banana\nApple\nCherry" rows={6}/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={() => sort(false)} style={{width:'auto'}}>Sort A-Z</button><button className="btn btn-secondary" onClick={() => sort(true)}>Sort Z-A</button></div>
    {result && <div className="tool-result"><pre>{result}</pre><CopyBtn text={result}/></div>}</div>);
}
function SlugGen({ logUsage }) {
  const [input, setInput] = useState(''); const slug = input.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return (<div><div className="input-group"><label>Text</label><input type="text" value={input} onChange={e => {setInput(e.target.value); if(input.length%10===0) logUsage(slug, 'Slug Gen');}} placeholder="My Blog Post Title"/></div>
    {input && <div className="tool-result"><pre>{slug}</pre><CopyBtn text={slug}/></div>}</div>);
}
function TextDiff({ logUsage }) {
  const [text1, setText1] = useState(''); const [text2, setText2] = useState(''); const [result, setResult] = useState('');
  const diff = () => {
    const lines1 = text1.split('\n'), lines2 = text2.split('\n'); let r = '';
    const maxLen = Math.max(lines1.length, lines2.length);
    for (let i = 0; i < maxLen; i++) {
      if (i >= lines1.length) r += `+ ${lines2[i]}\n`;
      else if (i >= lines2.length) r += `- ${lines1[i]}\n`;
      else if (lines1[i] !== lines2[i]) r += `- ${lines1[i]}\n+ ${lines2[i]}\n`;
      else r += `  ${lines1[i]}\n`;
    }
    setResult(r || 'No differences found!'); logUsage('Text Diff', 'Text Tool');
  };
  return (<div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
    <div className="input-group"><label>Text 1</label><textarea value={text1} onChange={e => setText1(e.target.value)} placeholder="Original text" rows={8}/></div>
    <div className="input-group"><label>Text 2</label><textarea value={text2} onChange={e => setText2(e.target.value)} placeholder="Modified text" rows={8}/></div></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={diff} style={{width:'auto'}}>Compare</button></div>
    {result && <div className="tool-result"><pre>{result}</pre><CopyBtn text={result}/></div>}</div>);
}
function RandomText({ logUsage }) {
  const [count, setCount] = useState(3); const [result, setResult] = useState('');
  const lorem = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ');
  const gen = () => { let paragraphs = []; for (let p = 0; p < count; p++) { let sentences = []; for (let s = 0; s < 4; s++) { let words = []; const len = 8 + Math.floor(Math.random()*8); for (let w = 0; w < len; w++) words.push(lorem[Math.floor(Math.random()*lorem.length)]); words[0] = words[0][0].toUpperCase()+words[0].slice(1); sentences.push(words.join(' ')+'.'); } paragraphs.push(sentences.join(' ')); } setResult(paragraphs.join('\n\n')); logUsage('Random Text', `${count} paragraphs`); };
  return (<div><div className="input-group"><label>Paragraphs</label><input type="number" min="1" max="20" value={count} onChange={e => setCount(e.target.value)}/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={gen} style={{width:'auto'}}>Generate</button></div>
    {result && <div className="tool-result"><pre>{result}</pre><CopyBtn text={result}/></div>}</div>);
}

function BinaryConv({ logUsage }) {
  const [input, setInput] = useState(''); const [mode, setMode] = useState('to'); const [result, setResult] = useState('');
  const conv = () => { try { if (mode === 'to') setResult(input.split('').map(c => c.charCodeAt(0).toString(2).padStart(8,'0')).join(' ')); else setResult(input.split(' ').map(b => String.fromCharCode(parseInt(b, 2))).join('')); logUsage(input, 'Binary Conversion'); } catch { setResult('Invalid Input'); } };
  return (<div><div className="tabs" style={{marginBottom:16}}><button className={`tab ${mode==='to'?'active':''}`} onClick={() => setMode('to')}>Text to Binary</button><button className={`tab ${mode==='from'?'active':''}`} onClick={() => setMode('from')}>Binary to Text</button></div>
    <textarea value={input} onChange={e => setInput(e.target.value)} rows={4} placeholder={mode==='to'?'Enter text':'01001000 01100101...'}/>
    <div className="tool-actions"><button className="btn btn-primary" onClick={conv} style={{width:'auto'}}>Convert</button></div>
    {result && <div className="tool-result"><pre style={{wordBreak:'break-all'}}>{result}</pre><CopyBtn text={result}/></div>}</div>);
}

function CaseScrambler({ logUsage }) {
  const [input, setInput] = useState(''); const scramble = () => { const r = input.split('').map(c => Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()).join(''); logUsage(input, 'Case Scrambler'); return r; };
  return (<div><textarea value={input} onChange={e => setInput(e.target.value)} rows={4} placeholder="e.g. hello world"/>
    {input && <div className="tool-result"><pre>{scramble()}</pre><CopyBtn text={scramble()}/></div>}</div>);
}

export default function TextTools({ toolId, logUsage }) {
  const map = { 
    'word-counter': <WordCounter logUsage={logUsage}/>, 
    'character-counter': <CharCounter logUsage={logUsage}/>, 
    'text-reverser': <TextReverser logUsage={logUsage}/>, 
    'uppercase-converter': <UpperCase logUsage={logUsage}/>, 
    'lowercase-converter': <LowerCase logUsage={logUsage}/>, 
    'remove-duplicates': <RemoveDups logUsage={logUsage}/>, 
    'sort-text': <SortText logUsage={logUsage}/>, 
    'slug-generator': <SlugGen logUsage={logUsage}/>, 
    'text-diff': <TextDiff logUsage={logUsage}/>, 
    'random-text': <RandomText logUsage={logUsage}/>,
    'binary-converter': <BinaryConv logUsage={logUsage}/>,
    'case-scrambler': <CaseScrambler logUsage={logUsage}/>
  };
  return map[toolId] || <p>Tool coming soon!</p>;
}
