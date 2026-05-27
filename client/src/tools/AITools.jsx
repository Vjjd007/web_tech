import { useState, useRef } from 'react';
function CopyBtn({ text }) { const [c, setC] = useState(false); return <button className="copy-btn" onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(() => setC(false), 1500); }}>{c ? '✓ Copied' : 'Copy'}</button>; }

function AIGenerateTool({ title, placeholder, type, generateAI, logUsage }) {
  const [input, setInput] = useState(''); const [result, setResult] = useState(''); const [loading, setLoading] = useState(false);
  const generate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await generateAI({ prompt: input, type });
      const out = res.data.response;
      setResult(out);
      if (logUsage) logUsage(input.substring(0, 100), out.substring(0, 100));
    } catch (err) {
      console.error('AI Generate Error:', err);
      setResult('AI generation failed: ' + (err?.response?.data?.error || err.message || 'Unknown error'));
    }
    setLoading(false);
  };
  return (<div><div className="input-group"><label>{title}</label><textarea value={input} onChange={e => setInput(e.target.value)} placeholder={placeholder} rows={6}/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={generate} disabled={loading} style={{width:'auto'}}>{loading ? '⏳ Generating...' : '✨ Generate'}</button></div>
    {result && <div className="tool-result"><pre>{result}</pre><CopyBtn text={result}/></div>}</div>);
}

function AIChatAssistant({ generateAI }) {
  return <AIGenerateTool title="Ask AI Anything" placeholder="Ask any question..." type="qa" generateAI={generateAI}/>;
}

function PDFAnalyzer({ uploadPDF, askPDF, logUsage }) {
  const [pdfText, setPdfText] = useState(''); const [question, setQuestion] = useState(''); const [answer, setAnswer] = useState(''); const [loading, setLoading] = useState(false); const [filename, setFilename] = useState('');
  const handleUpload = async (e) => { const f = e.target.files[0]; if (!f) return; setLoading(true); const fd = new FormData(); fd.append('pdf', f);
    try { const res = await uploadPDF(fd); setPdfText(res.data.text); setFilename(res.data.filename); logUsage(f.name, 'PDF Uploaded'); } catch { setPdfText('Failed to parse PDF'); } setLoading(false); };
  const ask = async () => { if (!question || !pdfText) return; setLoading(true); try { const res = await askPDF({ question, pdfText }); const out = res.data.answer; setAnswer(out); logUsage(question, 'PDF AI Analysis'); } catch { setAnswer('Failed to analyze'); } setLoading(false); };
  return (<div>
    <div className="file-upload-zone" onClick={() => document.getElementById('pdf-ai-upload').click()}>
      <div className="file-upload-icon">📑</div><h3>{filename || 'Upload PDF'}</h3><p>{pdfText ? `${pdfText.length} chars extracted` : 'Select a PDF to analyze'}</p></div>
    <input type="file" id="pdf-ai-upload" accept=".pdf" hidden onChange={handleUpload}/>
    {pdfText && <><div className="input-group" style={{marginTop:16}}><label>Ask about the document</label><textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder="What is this document about?" rows={3}/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={ask} disabled={loading} style={{width:'auto'}}>{loading ? '⏳ Analyzing...' : '🔍 Ask AI'}</button></div></>}
    {answer && <div className="tool-result"><pre>{answer}</pre><CopyBtn text={answer}/></div>}</div>);
}

function ImageAnalyzer({ ocrImage, askImage, logUsage }) {
  const [imageText, setImageText] = useState(''); const [question, setQuestion] = useState(''); const [answer, setAnswer] = useState(''); const [loading, setLoading] = useState(false); const [filename, setFilename] = useState('');
  const handleUpload = async (e) => { const f = e.target.files[0]; if (!f) return; setLoading(true); const fd = new FormData(); fd.append('image', f);
    try { const res = await ocrImage(fd); setImageText(res.data.text); setFilename(res.data.filename); logUsage(f.name, 'Image OCR'); } catch { setImageText('OCR failed'); } setLoading(false); };
  const ask = async () => { if (!question || !imageText) return; setLoading(true); try { const res = await askImage({ question, imageText }); const out = res.data.answer; setAnswer(out); logUsage(question, 'Image AI Analysis'); } catch { setAnswer('Analysis failed'); } setLoading(false); };
  return (<div>
    <div className="file-upload-zone" onClick={() => document.getElementById('img-ai-upload').click()}>
      <div className="file-upload-icon">🖼️</div><h3>{filename || 'Upload Image'}</h3><p>{imageText ? `Extracted: ${imageText.substring(0,100)}...` : 'Select an image for OCR analysis'}</p></div>
    <input type="file" id="img-ai-upload" accept="image/*" hidden onChange={handleUpload}/>
    {imageText && <><div className="tool-result" style={{marginTop:16}}><pre>Extracted text:\n{imageText}</pre></div>
    <div className="input-group" style={{marginTop:16}}><label>Ask about the image</label><textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder="What does this image contain?" rows={3}/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={ask} disabled={loading} style={{width:'auto'}}>{loading ? '⏳ Analyzing...' : '🔍 Ask AI'}</button></div></>}
    {answer && <div className="tool-result"><pre>{answer}</pre><CopyBtn text={answer}/></div>}</div>);
}

export default function AITools({ toolId, logUsage, generateAI, uploadPDF, askPDF, ocrImage, askImage }) {
  const toolMap = {
    'ai-chat': <AIGenerateTool title="Ask AI Anything" placeholder="Ask any question..." type="qa" generateAI={generateAI} logUsage={logUsage}/>,
    'ai-essay': <AIGenerateTool title="Topic" placeholder="Write an essay..." type="essay" generateAI={generateAI} logUsage={logUsage}/>,
    'ai-code-gen': <AIGenerateTool title="Task Description" placeholder="Create a React component..." type="code" generateAI={generateAI} logUsage={logUsage}/>,
    'ai-debugger': <AIGenerateTool title="Paste Buggy Code" placeholder="Paste code with bugs here..." type="debug" generateAI={generateAI} logUsage={logUsage}/>,
    'ai-summarizer': <AIGenerateTool title="Text to Summarize" placeholder="Paste a long text..." type="summarize" generateAI={generateAI} logUsage={logUsage}/>,
    'ai-research': <AIGenerateTool title="Research Topic" placeholder="Research the effects of..." type="research" generateAI={generateAI} logUsage={logUsage}/>,
    'ai-blog': <AIGenerateTool title="Blog Topic" placeholder="Write a blog post..." type="blog" generateAI={generateAI} logUsage={logUsage}/>,
    'ai-email': <AIGenerateTool title="Email Context" placeholder="Write a professional email..." type="email" generateAI={generateAI} logUsage={logUsage}/>,
    'ai-resume': <AIGenerateTool title="Your Info" placeholder="Create a resume section..." type="resume" generateAI={generateAI} logUsage={logUsage}/>,
    'ai-study-notes': <AIGenerateTool title="Topic" placeholder="Generate study notes..." type="studynotes" generateAI={generateAI} logUsage={logUsage}/>,
    'ai-qa': <AIGenerateTool title="Question" placeholder="What is quantum computing?" type="qa" generateAI={generateAI} logUsage={logUsage}/>,
    'ai-flashcards': <AIGenerateTool title="Topic" placeholder="Generate flashcards..." type="flashcards" generateAI={generateAI} logUsage={logUsage}/>,
    'ai-interview': <AIGenerateTool title="Role/Topic" placeholder="Practice interview questions..." type="interview" generateAI={generateAI} logUsage={logUsage}/>,
    'ai-grammar': <AIGenerateTool title="Text to Fix" placeholder="Fix grammar errors..." type="grammar" generateAI={generateAI} logUsage={logUsage}/>,
    'ai-explain': <AIGenerateTool title="Code to Explain" placeholder="Paste code..." type="explain" generateAI={generateAI} logUsage={logUsage}/>,
    'ai-idea': <AIGenerateTool title="Project Type" placeholder="Generate creative ideas..." type="idea" generateAI={generateAI} logUsage={logUsage}/>,
    'ai-prompt': <AIGenerateTool title="Task" placeholder="Generate effective prompts..." type="promptgen" generateAI={generateAI} logUsage={logUsage}/>,
    'ai-homework': <AIGenerateTool title="Problem" placeholder="Solve: If a train..." type="homework" generateAI={generateAI} logUsage={logUsage}/>,
    'ai-lyrics': <AIGenerateTool title="Song Topic" placeholder="Write lyrics about a space adventure" type="lyrics" generateAI={generateAI} logUsage={logUsage}/>,
    'ai-trivia': <AIGenerateTool title="Subject" placeholder="Generate 5 trivia questions about space..." type="trivia" generateAI={generateAI} logUsage={logUsage}/>,
    'ai-pdf': <PDFAnalyzer uploadPDF={uploadPDF} askPDF={askPDF} logUsage={logUsage}/>,
    'ai-image': <ImageAnalyzer ocrImage={ocrImage} askImage={askImage} logUsage={logUsage}/>
  };
  return toolMap[toolId] || <p>AI Tool coming soon!</p>;
}
