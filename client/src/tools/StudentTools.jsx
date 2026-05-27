import { useState } from 'react';

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return <button className="copy-btn" onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>{copied ? '✓ Copied' : 'Copy'}</button>;
}

function CGPACalc({ logUsage }) {
  const [semesters, setSemesters] = useState([{ gpa: '', credits: '' }]);
  const [result, setResult] = useState('');
  const addSem = () => setSemesters([...semesters, { gpa: '', credits: '' }]);
  const update = (i, k, v) => { const s = [...semesters]; s[i][k] = v; setSemesters(s); };
  const calc = () => {
    let totalPoints = 0, totalCredits = 0;
    semesters.forEach(s => { const g = parseFloat(s.gpa), c = parseFloat(s.credits); if (g && c) { totalPoints += g * c; totalCredits += c; } });
    const res = totalCredits > 0 ? `CGPA: ${(totalPoints / totalCredits).toFixed(2)}` : 'Enter valid data';
    setResult(res); logUsage('CGPA Calculation', 'Student Tool');
  };
  return (<div>
    {semesters.map((s, i) => (<div key={i} className="input-row" style={{marginBottom:8}}>
      <div className="input-group"><label>Semester {i + 1} GPA</label><input type="number" step="0.01" max="10" value={s.gpa} onChange={e => update(i, 'gpa', e.target.value)} placeholder="e.g. 8.5" /></div>
      <div className="input-group"><label>Credits</label><input type="number" value={s.credits} onChange={e => update(i, 'credits', e.target.value)} placeholder="e.g. 24" /></div>
    </div>))}
    <div className="tool-actions"><button className="btn btn-secondary" onClick={addSem}>+ Add Semester</button><button className="btn btn-primary" onClick={calc} style={{width:'auto'}}>Calculate CGPA</button></div>
    {result && <div className="tool-result"><pre>{result}</pre></div>}
  </div>);
}

function AttendanceCalc({ logUsage }) {
  const [total, setTotal] = useState(''); const [attended, setAttended] = useState(''); const [result, setResult] = useState('');
  const calc = () => { const t = parseInt(total), a = parseInt(attended); if (t > 0 && a >= 0) { const pct = (a / t * 100).toFixed(2); let msg = `Attendance: ${pct}%\nClasses Attended: ${a}/${t}\n`; if (pct < 75) msg += `\n⚠️ Below 75%! Need ${Math.ceil((0.75 * t - a) / (1 - 0.75))} more classes.`; else msg += `\n✅ Above 75%. Can skip ${Math.floor((a - 0.75 * t) / 0.75)} more classes.`; setResult(msg); logUsage(pct + '%', 'Attendance Calculation'); } };
  return (<div>
    <div className="input-row"><div className="input-group"><label>Total Classes</label><input type="number" value={total} onChange={e => setTotal(e.target.value)} placeholder="e.g. 100" /></div>
    <div className="input-group"><label>Classes Attended</label><input type="number" value={attended} onChange={e => setAttended(e.target.value)} placeholder="e.g. 80" /></div></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={calc} style={{width:'auto'}}>Calculate</button></div>
    {result && <div className="tool-result"><pre>{result}</pre><CopyBtn text={result}/></div>}
  </div>);
}

function StudyPlanner({ logUsage }) {
  const [subjects, setSubjects] = useState([{ name: '', hours: '' }]); const [result, setResult] = useState('');
  const add = () => setSubjects([...subjects, { name: '', hours: '' }]);
  const update = (i, k, v) => { const s = [...subjects]; s[i][k] = v; setSubjects(s); };
  const generate = () => {
    const totalHrs = subjects.reduce((a, s) => a + (parseFloat(s.hours) || 0), 0);
    let plan = `📅 Study Plan (${totalHrs} hours total)\n${'─'.repeat(40)}\n`;
    let startHr = 9;
    subjects.forEach(s => { if (s.name && s.hours) { plan += `\n${startHr}:00 - ${startHr + parseFloat(s.hours)}:00 → ${s.name} (${s.hours}h)`; startHr += parseFloat(s.hours) + 0.5; } });
    plan += `\n\n💡 Remember to take 15-min breaks between sessions!`;
    setResult(plan); logUsage(totalHrs + ' hours', 'Study Plan Generated');
  };
  return (<div>
    {subjects.map((s, i) => (<div key={i} className="input-row" style={{marginBottom:8}}>
      <div className="input-group"><label>Subject</label><input type="text" value={s.name} onChange={e => update(i, 'name', e.target.value)} placeholder="e.g. Math" /></div>
      <div className="input-group"><label>Hours</label><input type="number" value={s.hours} onChange={e => update(i, 'hours', e.target.value)} placeholder="e.g. 2" /></div>
    </div>))}
    <div className="tool-actions"><button className="btn btn-secondary" onClick={add}>+ Add Subject</button><button className="btn btn-primary" onClick={generate} style={{width:'auto'}}>Generate Plan</button></div>
    {result && <div className="tool-result"><pre>{result}</pre><CopyBtn text={result}/></div>}
  </div>);
}

function Flashcards({ logUsage }) {
  const [cards, setCards] = useState([{ q: '', a: '' }]); const [idx, setIdx] = useState(0); const [showAns, setShowAns] = useState(false); const [mode, setMode] = useState('create');
  const add = () => setCards([...cards, { q: '', a: '' }]);
  const update = (i, k, v) => { const c = [...cards]; c[i][k] = v; setCards(c); };
  const validCards = cards.filter(c => c.q && c.a);
  return (<div>
    <div className="tabs" style={{marginBottom:16}}><button className={`tab ${mode==='create'?'active':''}`} onClick={() => setMode('create')}>Create</button><button className={`tab ${mode==='study'?'active':''}`} onClick={() => { setMode('study'); setIdx(0); setShowAns(false); logUsage('Flashcards', 'Study Mode'); }}>Study</button></div>
    {mode === 'create' ? (<div>{cards.map((c, i) => (<div key={i} style={{marginBottom:12,padding:16,background:'var(--bg-tertiary)',borderRadius:'var(--radius-md)'}}>
      <div className="input-group"><label>Question {i+1}</label><input type="text" value={c.q} onChange={e => update(i,'q',e.target.value)} placeholder="Question"/></div>
      <div className="input-group"><label>Answer</label><input type="text" value={c.a} onChange={e => update(i,'a',e.target.value)} placeholder="Answer"/></div>
    </div>))}<button className="btn btn-secondary" onClick={add}>+ Add Card</button></div>)
    : validCards.length > 0 ? (<div style={{textAlign:'center',padding:32}}>
      <p style={{fontSize:13,color:'var(--text-muted)',marginBottom:8}}>Card {idx+1} of {validCards.length}</p>
      <div style={{padding:32,background:'var(--bg-tertiary)',borderRadius:'var(--radius-lg)',minHeight:120,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:600,cursor:'pointer'}} onClick={() => setShowAns(!showAns)}>
        {showAns ? `✅ ${validCards[idx].a}` : `❓ ${validCards[idx].q}`}
      </div>
      <p style={{fontSize:12,color:'var(--text-muted)',margin:'12px 0'}}>Click card to flip</p>
      <div className="tool-actions" style={{justifyContent:'center'}}><button className="btn btn-secondary" onClick={() => { setIdx(Math.max(0,idx-1)); setShowAns(false); }}>← Prev</button><button className="btn btn-primary" onClick={() => { setIdx(Math.min(validCards.length-1,idx+1)); setShowAns(false); }} style={{width:'auto'}}>Next →</button></div>
    </div>) : <p style={{textAlign:'center',color:'var(--text-muted)'}}>Create cards first!</p>}
  </div>);
}

function QuizGen({ logUsage }) {
  const [topic, setTopic] = useState(''); const [result, setResult] = useState('');
  const generate = () => {
    const quizzes = {
      default: `📝 Quiz: ${topic}\n\n1. What is the main concept of ${topic}?\n   a) Option A\n   b) Option B\n   c) Option C\n   d) Option D\n\n2. Which of the following best describes ${topic}?\n   a) Description A\n   b) Description B\n   c) Description C\n   d) Description D\n\n3. True or False: ${topic} is widely used in modern applications.\n\n4. Explain ${topic} in your own words.\n\n5. What are the advantages of ${topic}?\n\n✏️ Tip: Research each question thoroughly!`
    };
    setResult(quizzes.default); logUsage(topic, 'Quiz Generated');
  };
  return (<div>
    <div className="input-group"><label>Topic</label><input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Enter topic for quiz"/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={generate} style={{width:'auto'}}>Generate Quiz</button></div>
    {result && <div className="tool-result"><pre>{result}</pre><CopyBtn text={result}/></div>}
  </div>);
}

function ExamTimer({ logUsage }) {
  const [mins, setMins] = useState(60); const [time, setTime] = useState(null); const [running, setRunning] = useState(false);
  const start = () => { setTime(mins * 60); setRunning(true); logUsage(mins + ' min', 'Exam Timer Started'); };
  const stop = () => setRunning(false);
  const reset = () => { setRunning(false); setTime(null); };
  useState(() => { if (running && time > 0) { const t = setInterval(() => setTime(p => p > 0 ? p - 1 : 0), 1000); return () => clearInterval(t); } }, [running, time]);
  const fmt = (s) => `${Math.floor(s/3600).toString().padStart(2,'0')}:${Math.floor((s%3600)/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;
  return (<div style={{textAlign:'center'}}>
    <div className="input-group"><label>Duration (minutes)</label><input type="number" value={mins} onChange={e => setMins(e.target.value)} style={{maxWidth:200,margin:'0 auto'}}/></div>
    <div style={{fontSize:64,fontWeight:800,fontFamily:'monospace',margin:'32px 0',color: time !== null && time < 60 ? 'var(--accent-red)' : 'var(--primary)'}}>
      {time !== null ? fmt(time) : fmt(mins * 60)}
    </div>
    <div className="tool-actions" style={{justifyContent:'center'}}>
      {!running ? <button className="btn btn-primary" onClick={start} style={{width:'auto'}}>▶ Start</button> : <button className="btn btn-secondary" onClick={stop}>⏸ Pause</button>}
      <button className="btn btn-secondary" onClick={reset}>↺ Reset</button>
    </div>
  </div>);
}

function NoteOrganizer({ logUsage }) {
  const [notes, setNotes] = useState([]); const [title, setTitle] = useState(''); const [content, setContent] = useState(''); const [category, setCategory] = useState('General');
  const add = () => { if (title && content) { setNotes([...notes, { title, content, category, date: new Date().toLocaleString() }]); setTitle(''); setContent(''); logUsage(title, 'Note Saved'); } };
  return (<div>
    <div className="input-group"><label>Category</label><select value={category} onChange={e => setCategory(e.target.value)}><option>General</option><option>Math</option><option>Science</option><option>History</option><option>Programming</option></select></div>
    <div className="input-group"><label>Title</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Note title"/></div>
    <div className="input-group"><label>Content</label><textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your note..." rows={4}/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={add} style={{width:'auto'}}>Save Note</button></div>
    {notes.map((n, i) => (<div key={i} className="tool-result" style={{marginTop:12}}><pre><strong>[{n.category}] {n.title}</strong>{'\n'}{n.date}{'\n\n'}{n.content}</pre></div>))}
  </div>);
}

function UnitConverter({ logUsage }) {
  const [val, setVal] = useState(''); const [from, setFrom] = useState('km'); const [to, setTo] = useState('mi'); const [result, setResult] = useState('');
  const conversions = { km_mi: 0.621371, mi_km: 1.60934, kg_lb: 2.20462, lb_kg: 0.453592, c_f: (v) => v*9/5+32, f_c: (v) => (v-32)*5/9, m_ft: 3.28084, ft_m: 0.3048, l_gal: 0.264172, gal_l: 3.78541, cm_in: 0.393701, in_cm: 2.54 };
  const units = ['km','mi','kg','lb','c','f','m','ft','l','gal','cm','in'];
  const convert = () => {
    const v = parseFloat(val); if (isNaN(v)) return;
    const key = `${from}_${to}`;
    const factor = conversions[key];
    let res = '';
    if (typeof factor === 'function') res = `${v} ${from} = ${factor(v).toFixed(4)} ${to}`;
    else if (factor) res = `${v} ${from} = ${(v * factor).toFixed(4)} ${to}`;
    else if (from === to) res = `${v} ${from} = ${v} ${to}`;
    else res = 'Conversion not available for this pair';
    setResult(res); logUsage(`${from} to ${to}`, 'Unit Conversion');
  };
  return (<div>
    <div className="input-row"><div className="input-group"><label>Value</label><input type="number" value={val} onChange={e => setVal(e.target.value)} placeholder="Enter value"/></div>
    <div className="input-group"><label>From</label><select value={from} onChange={e => setFrom(e.target.value)}>{units.map(u => <option key={u} value={u}>{u}</option>)}</select></div>
    <div className="input-group"><label>To</label><select value={to} onChange={e => setTo(e.target.value)}>{units.map(u => <option key={u} value={u}>{u}</option>)}</select></div></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={convert} style={{width:'auto'}}>Convert</button></div>
    {result && <div className="tool-result"><pre>{result}</pre></div>}
  </div>);
}

function MathSolver({ logUsage }) {
  const [expr, setExpr] = useState(''); const [result, setResult] = useState('');
  const solve = () => { try { const r = Function('"use strict"; return (' + expr.replace(/[^0-9+\-*/().%\s^]/g, '') + ')')(); setResult(`${expr} = ${r}`); logUsage(expr, 'Math Solved'); } catch { setResult('Invalid expression'); } };
  return (<div>
    <div className="input-group"><label>Expression</label><input type="text" value={expr} onChange={e => setExpr(e.target.value)} placeholder="e.g. (5 + 3) * 2 - 10 / 5"/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={solve} style={{width:'auto'}}>Solve</button></div>
    {result && <div className="tool-result"><pre>{result}</pre></div>}
  </div>);
}

function ScientificCalc({ logUsage }) {
  const [display, setDisplay] = useState('0');
  const press = (v) => setDisplay(d => d === '0' ? v : d + v);
  const clear = () => setDisplay('0');
  const calc = () => {
    try {
      const expr = display.replace(/×/g,'*').replace(/÷/g,'/').replace(/π/g,'Math.PI').replace(/√\(/g,'Math.sqrt(').replace(/sin\(/g,'Math.sin(').replace(/cos\(/g,'Math.cos(').replace(/tan\(/g,'Math.tan(').replace(/log\(/g,'Math.log10(').replace(/ln\(/g,'Math.log(');
      const res = String(Function('"use strict"; return (' + expr + ')')());
      setDisplay(res);
      logUsage(display, 'Scientific Calc');
    } catch {
      setDisplay('Error');
    }
  };
  const btns = ['7','8','9','÷','4','5','6','×','1','2','3','-','0','.','=','+','sin(','cos(','tan(','π','√(','log(','ln(','(',')','C'];
  return (<div>
    <div style={{
      background: 'var(--bg-tertiary)',
      padding: '20px',
      borderRadius: 'var(--radius-md)',
      fontSize: '28px',
      fontFamily: 'monospace',
      textAlign: 'right',
      marginBottom: '16px',
      minHeight: '50px',
      wordBreak: 'break-all'
    }}>{display}</div>
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px'}}>
      {btns.map(b => (
        <button 
          key={b} 
          className={`btn ${b==='='?'btn-primary':'btn-secondary'}`} 
          onClick={() => b==='='?calc():b==='C'?clear():press(b)} 
          style={{fontSize: '16px', padding: '14px'}}
        >{b}</button>
      ))}
    </div>
  </div>);
}

function EquationSolver({ logUsage }) {
  const [a, setA] = useState(''); const [b, setB] = useState(''); const [c, setC] = useState(''); const [result, setResult] = useState('');
  const solve = () => {
    const A = parseFloat(a), B = parseFloat(b), C = parseFloat(c);
    let r = '';
    if (!c && B !== 0) { r = `Linear: x = ${(-A / B).toFixed(4)}\n${B}x + ${A} = 0`; }
    else {
      const disc = B*B - 4*A*C;
      r = `Quadratic: ${A}x² + ${B}x + ${C} = 0\nDiscriminant: ${disc}\n`;
      if (disc > 0) r += `x₁ = ${((-B + Math.sqrt(disc)) / (2*A)).toFixed(4)}\nx₂ = ${((-B - Math.sqrt(disc)) / (2*A)).toFixed(4)}`;
      else if (disc === 0) r += `x = ${(-B / (2*A)).toFixed(4)} (repeated root)`;
      else r += `x₁ = ${(-B/(2*A)).toFixed(4)} + ${(Math.sqrt(-disc)/(2*A)).toFixed(4)}i\nx₂ = ${(-B/(2*A)).toFixed(4)} - ${(Math.sqrt(-disc)/(2*A)).toFixed(4)}i`;
    }
    setResult(r); logUsage(`${a}x² + ${b}x + ${c} = 0`, 'Equation Solved');
  };
  return (<div>
    <p style={{fontSize:13,color:'var(--text-secondary)',marginBottom:16}}>Solve ax² + bx + c = 0 (leave c empty for linear)</p>
    <div className="input-row">
      <div className="input-group"><label>a</label><input type="number" value={a} onChange={e => setA(e.target.value)} placeholder="a"/></div>
      <div className="input-group"><label>b</label><input type="number" value={b} onChange={e => setB(e.target.value)} placeholder="b"/></div>
      <div className="input-group"><label>c</label><input type="number" value={c} onChange={e => setC(e.target.value)} placeholder="c (optional)"/></div>
    </div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={solve} style={{width:'auto'}}>Solve</button></div>
    {result && <div className="tool-result"><pre>{result}</pre><CopyBtn text={result}/></div>}
  </div>);
}

function GraphPlotter({ logUsage }) {
  const [fn, setFn] = useState('Math.sin(x)');
  const plot = () => {
    const c = document.getElementById('graph-canvas'); if (!c) return; const ctx = c.getContext('2d');
    const w = c.width = c.offsetWidth, h = c.height = 400;
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-tertiary'); ctx.fillRect(0,0,w,h);
    ctx.strokeStyle = 'var(--border)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0,h/2); ctx.lineTo(w,h/2); ctx.moveTo(w/2,0); ctx.lineTo(w/2,h); ctx.strokeStyle = '#666'; ctx.stroke();
    ctx.beginPath(); ctx.strokeStyle = '#6C5CE7'; ctx.lineWidth = 2;
    for (let px = 0; px < w; px++) {
      const x = (px - w/2) / 40;
      try { const y = Function('x', '"use strict"; return ' + fn)(x); const py = h/2 - y * 40;
        if (px === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      } catch {}
    }
    ctx.stroke(); logUsage(fn, 'Graph Plotted');
  };
  return (<div>
    <div className="input-group"><label>Function f(x) =</label><input type="text" value={fn} onChange={e => setFn(e.target.value)} placeholder="e.g. Math.sin(x), x*x, Math.pow(x,3)"/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={plot} style={{width:'auto'}}>Plot Graph</button></div>
    <canvas id="graph-canvas" style={{width:'100%',height:400,borderRadius:'var(--radius-md)',marginTop:16,background:'var(--bg-tertiary)'}}/>
  </div>);
}

function SimpleNotes({ title, logUsage }) {
  const [text, setText] = useState(''); const [saved, setSaved] = useState([]);
  const save = () => { if (text) { setSaved([...saved, { text, time: new Date().toLocaleString() }]); setText(''); logUsage(title, 'Note Saved'); } };
  return (<div>
    <div className="input-group"><label>{title || 'Notes'}</label><textarea value={text} onChange={e => setText(e.target.value)} placeholder="Start writing..." rows={6}/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={save} style={{width:'auto'}}>Save</button></div>
    {saved.map((n, i) => (<div key={i} className="tool-result" style={{marginTop:8}}><pre>{n.time}{'\n'}{n.text}</pre></div>))}
  </div>);
}

function AssignmentPlanner({ logUsage }) {
  const [assignments, setAssignments] = useState([]); const [name, setName] = useState(''); const [deadline, setDeadline] = useState(''); const [priority, setPriority] = useState('Medium');
  const add = () => { if (name && deadline) { setAssignments([...assignments, { name, deadline, priority, done: false }]); setName(''); setDeadline(''); logUsage(name, 'Assignment Added'); } };
  const toggle = (i) => { const a = [...assignments]; a[i].done = !a[i].done; setAssignments(a); };
  return (<div>
    <div className="input-row">
      <div className="input-group"><label>Assignment</label><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Assignment name"/></div>
      <div className="input-group"><label>Deadline</label><input type="date" value={deadline} onChange={e => setDeadline(e.target.value)}/></div>
      <div className="input-group"><label>Priority</label><select value={priority} onChange={e => setPriority(e.target.value)}><option>High</option><option>Medium</option><option>Low</option></select></div>
    </div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={add} style={{width:'auto'}}>Add Assignment</button></div>
    {assignments.map((a, i) => (<div key={i} className="history-item" style={{marginTop:8}} onClick={() => toggle(i)}>
      <div className="history-item-left"><span style={{fontSize:20}}>{a.done ? '✅' : '⬜'}</span><div className="history-info"><h4 style={{textDecoration:a.done?'line-through':'none'}}>{a.name}</h4><p>{a.deadline} • {a.priority}</p></div></div>
    </div>))}
  </div>);
}

function ReferenceManager({ logUsage }) {
  const [refs, setRefs] = useState([]); const [author, setAuthor] = useState(''); const [title, setTitle] = useState(''); const [year, setYear] = useState(''); const [format, setFormat] = useState('APA');
  const add = () => {
    if (author && title && year) {
      const formatted = format === 'APA' ? `${author} (${year}). ${title}.` : format === 'MLA' ? `${author}. "${title}." ${year}.` : `${author}, "${title}," ${year}.`;
      setRefs([...refs, { formatted, format }]); setAuthor(''); setTitle(''); setYear(''); logUsage(title, 'Reference Added');
    }
  };
  return (<div>
    <div className="input-group"><label>Format</label><select value={format} onChange={e => setFormat(e.target.value)}><option>APA</option><option>MLA</option><option>Chicago</option></select></div>
    <div className="input-row">
      <div className="input-group"><label>Author</label><input type="text" value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author name"/></div>
      <div className="input-group"><label>Title</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title"/></div>
      <div className="input-group"><label>Year</label><input type="number" value={year} onChange={e => setYear(e.target.value)} placeholder="2024"/></div>
    </div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={add} style={{width:'auto'}}>Add Reference</button></div>
    {refs.length > 0 && <div className="tool-result"><pre>{refs.map(r => r.formatted).join('\n')}</pre><CopyBtn text={refs.map(r=>r.formatted).join('\n')}/></div>}
  </div>);
}

function GPAToPct({ logUsage }) {
  const [gpa, setGpa] = useState(''); const [pct, setPct] = useState('');
  const conv = () => { const g = parseFloat(gpa); if (g) { const p = (g * 9.5).toFixed(2); setPct(p + '%'); logUsage(gpa, p + '%'); } };
  return (<div><div className="input-group"><label>GPA (10.0 scale)</label><input type="number" value={gpa} onChange={e => setGpa(e.target.value)} placeholder="e.g. 8.5"/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={conv} style={{width:'auto'}}>Convert to %</button></div>
    {pct && <div className="tool-result"><pre>Percentage: {pct}</pre></div>}</div>);
}

function BudgetPlanner({ logUsage }) {
  const [budget, setBudget] = useState(''); const [expenses, setExpenses] = useState([{ name: '', amt: '' }]);
  const add = () => setExpenses([...expenses, { name: '', amt: '' }]);
  const update = (i, k, v) => { const e = [...expenses]; e[i][k] = v; setExpenses(e); };
  const total = expenses.reduce((a, e) => a + (parseFloat(e.amt) || 0), 0);
  const finish = () => logUsage('Budget Plan', 'Total: $' + total);
  return (<div><div className="input-group"><label>Monthly Budget</label><input type="number" value={budget} onChange={e => setBudget(e.target.value)}/></div>
    {expenses.map((e, i) => (<div key={i} className="input-row"><input type="text" value={e.name} onChange={v => update(i,'name',v.target.value)} placeholder="Rent"/><input type="number" value={e.amt} onChange={v => update(i,'amt',v.target.value)} placeholder="500"/></div>))}
    <div className="tool-actions"><button className="btn btn-secondary" onClick={add}>+ Add Expense</button><button className="btn btn-primary" onClick={finish}>Save Plan</button></div>
    <div className="tool-result"><pre>Total Expenses: ${total}{'\n'}Remaining: ${budget - total}</pre></div></div>);
}

export default function StudentTools({ toolId, logUsage }) {
  const map = {
    'cgpa-calculator': <CGPACalc logUsage={logUsage}/>, 
    'attendance-calculator': <AttendanceCalc logUsage={logUsage}/>, 
    'study-planner': <StudyPlanner logUsage={logUsage}/>,
    'flashcards': <Flashcards logUsage={logUsage}/>, 
    'quiz-generator': <QuizGen logUsage={logUsage}/>, 
    'exam-timer': <ExamTimer logUsage={logUsage}/>,
    'note-organizer': <NoteOrganizer logUsage={logUsage}/>, 
    'research-notes': <SimpleNotes title="Research Notes" logUsage={logUsage}/>,
    'assignment-planner': <AssignmentPlanner logUsage={logUsage}/>, 
    'reference-manager': <ReferenceManager logUsage={logUsage}/>,
    'unit-converter': <UnitConverter logUsage={logUsage}/>, 
    'math-solver': <MathSolver logUsage={logUsage}/>, 
    'scientific-calculator': <ScientificCalc logUsage={logUsage}/>,
    'equation-solver': <EquationSolver logUsage={logUsage}/>, 
    'graph-plotter': <GraphPlotter logUsage={logUsage}/>,
    'gpa-to-percentage': <GPAToPct logUsage={logUsage}/>,
    'budget-planner': <BudgetPlanner logUsage={logUsage}/>
  };
  return map[toolId] || <p>Tool coming soon!</p>;
}
