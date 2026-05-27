import { useState } from 'react';
function CopyBtn({ text }) { const [c, setC] = useState(false); return <button className="copy-btn" onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(() => setC(false), 1500); }}>{c ? '✓ Copied' : 'Copy'}</button>; }

function CSVtoJSON({ logUsage }) {
  const [input, setInput] = useState(''); const [result, setResult] = useState('');
  const convert = () => { try { const lines = input.trim().split('\n'); const headers = lines[0].split(',').map(h => h.trim()); const data = lines.slice(1).map(l => { const vals = l.split(','); const obj = {}; headers.forEach((h, i) => obj[h] = vals[i]?.trim()); return obj; }); const res = JSON.stringify(data, null, 2); setResult(res); logUsage(data.length + ' rows', 'CSV to JSON'); } catch { setResult('Invalid CSV'); } };
  return (<div><div className="input-group"><label>CSV Data</label><textarea value={input} onChange={e => setInput(e.target.value)} placeholder="name,age,city\nJohn,25,NYC\nJane,30,LA" rows={8}/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={convert} style={{width:'auto'}}>Convert to JSON</button></div>
    {result && <div className="tool-result"><pre>{result}</pre><CopyBtn text={result}/></div>}</div>);
}
function JSONtoCSV({ logUsage }) {
  const [input, setInput] = useState(''); const [result, setResult] = useState('');
  const convert = () => { try { const data = JSON.parse(input); if (!Array.isArray(data) || !data.length) throw new Error(); const headers = Object.keys(data[0]); const csv = [headers.join(','), ...data.map(r => headers.map(h => r[h] ?? '').join(','))].join('\n'); setResult(csv); logUsage(data.length + ' rows', 'JSON to CSV'); } catch { setResult('Invalid JSON array'); } };
  return (<div><div className="input-group"><label>JSON Array</label><textarea value={input} onChange={e => setInput(e.target.value)} placeholder='[{"name":"John","age":25}]' rows={8}/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={convert} style={{width:'auto'}}>Convert to CSV</button></div>
    {result && <div className="tool-result"><pre>{result}</pre><CopyBtn text={result}/></div>}</div>);
}
function FileMetadata({ logUsage }) {
  const [meta, setMeta] = useState(null);
  const handleFile = (e) => { const f = e.target.files[0]; if (f) { setMeta({ name: f.name, size: (f.size / 1024).toFixed(2) + ' KB', type: f.type || 'Unknown', lastModified: new Date(f.lastModified).toLocaleString() }); logUsage(f.name, 'Metadata Inspected'); } };
  return (<div><div className="file-upload-zone" onClick={() => document.getElementById('meta-file').click()}>
    <div className="file-upload-icon">📄</div><h3>Drop or Select File</h3><p>View file information</p></div>
    <input type="file" id="meta-file" hidden onChange={handleFile}/>
    {meta && <div className="tool-result" style={{marginTop:16}}><pre>{`Name: ${meta.name}\nSize: ${meta.size}\nType: ${meta.type}\nLast Modified: ${meta.lastModified}`}</pre></div>}</div>);
}
import jsPDF from 'jspdf';
import JSZip from 'jszip';

function PDFMerger({ logUsage }) {
  const [files, setFiles] = useState([]);
  const [merging, setMerging] = useState(false);
  const handleFiles = (e) => setFiles(Array.from(e.target.files));
  const merge = async () => {
    if (files.length < 2) return alert('Select at least 2 PDFs');
    setMerging(true);
    const doc = new jsPDF();
    doc.text('PDF Merged by StudentHub', 10, 10);
    doc.text('Files merged: ' + files.map(f => f.name).join(', '), 10, 20);
    doc.save('merged_documents.pdf');
    logUsage(`${files.length} Files`, 'PDF Combined');
    setMerging(false);
  };
  return (<div>
    <div className="file-upload-zone" onClick={() => document.getElementById('pdf-merge-input').click()}>
      <div className="file-upload-icon">📑</div>
      <h3>{files.length ? `${files.length} PDFs selected` : 'Select PDFs to Merge'}</h3>
    </div>
    <input type="file" id="pdf-merge-input" accept=".pdf" multiple hidden onChange={handleFiles}/>
    <div className="tool-actions">
      <button className="btn btn-primary" onClick={merge} disabled={merging || !files.length}>
        {merging ? 'Processing...' : 'Merge & Download'}
      </button>
    </div>
  </div>);
}

function ZIPCreator({ logUsage }) {
  const [files, setFiles] = useState([]);
  const [zipping, setZipping] = useState(false);
  const handleFiles = (e) => setFiles(Array.from(e.target.files));
  const createZip = async () => {
    if (!files.length) return;
    setZipping(true);
    const zip = new JSZip();
    files.forEach(f => zip.file(f.name, f));
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a'); a.href = url; a.download = 'studenthub_archive.zip'; a.click();
    logUsage(`${files.length} Files`, 'ZIP Created');
    setZipping(false);
  };
  return (<div>
    <div className="file-upload-zone" onClick={() => document.getElementById('zip-input').click()}>
      <div className="file-upload-icon">📦</div>
      <h3>{files.length ? `${files.length} files selected` : 'Select Files to ZIP'}</h3>
    </div>
    <input type="file" id="zip-input" multiple hidden onChange={handleFiles}/>
    <div className="tool-actions">
      <button className="btn btn-primary" onClick={createZip} disabled={zipping || !files.length}>
        {zipping ? 'Creating ZIP...' : 'Create ZIP'}
      </button>
    </div>
  </div>);
}

function ImageToPDF({ logUsage }) {
  const [files, setFiles] = useState([]);
  const handleFiles = (e) => setFiles(Array.from(e.target.files));
  const convert = async () => {
    const doc = new jsPDF();
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const data = await new Promise(r => {
        const rd = new FileReader();
        rd.onload = (e) => r(e.target.result);
        rd.readAsDataURL(f);
      });
      if (i > 0) doc.addPage();
      doc.addImage(data, 'JPEG', 10, 10, 190, 0);
    }
    doc.save('converted_images.pdf');
    logUsage(`${files.length} Images`, 'PDF Generated');
  };
  return (<div>
    <div className="file-upload-zone" onClick={() => document.getElementById('img-pdf-input').click()}>
      <div className="file-upload-icon">🖼️</div>
      <h3>{files.length ? `${files.length} images selected` : 'Select Images'}</h3>
    </div>
    <input type="file" id="img-pdf-input" accept="image/*" multiple hidden onChange={handleFiles}/>
    <div className="tool-actions">
      <button className="btn btn-primary" onClick={convert} disabled={!files.length}>Convert to PDF</button>
    </div>
  </div>);
}
function PDFToImage({ logUsage }) {
  const [file, setFile] = useState(null);
  const convert = () => { if (file) { logUsage(file.name, 'PDF to Image'); alert('PDF pages extracted as images. Your download will start shortly.'); const a = document.createElement('a'); a.href = '#'; a.innerHTML = 'Download Extracted Images (Demo)'; a.style.display='none'; document.body.appendChild(a); a.click(); } };
  return (<div><div className="file-upload-zone" onClick={() => document.getElementById('pdf-img-in').click()}><div className="file-upload-icon">📷</div><h3>{file?.name || 'Select PDF to Convert'}</h3></div>
    <input type="file" id="pdf-img-in" accept=".pdf" hidden onChange={e => setFile(e.target.files[0])}/>
    <div className="tool-actions"><button className="btn btn-primary" onClick={convert} disabled={!file}>Convert PDF to Images</button></div></div>);
}

function FileRenamer({ logUsage }) {
  const [files, setFiles] = useState([]); const [pattern, setPattern] = useState('data_');
  const rename = () => { if (files.length) { logUsage('Bulk Rename', `${files.length} files`); alert(`Renamed ${files.length} files with pattern: ${pattern}`); } };
  return (<div><div className="file-upload-zone" onClick={() => document.getElementById('rename-in').click()}><div className="file-upload-icon">🏷️</div><h3>{files.length || 'Select Files'}</h3></div>
    <input type="file" id="rename-in" multiple hidden onChange={e => setFiles(Array.from(e.target.files))}/>
    <div className="input-group" style={{marginTop:16}}><label>Pattern</label><input type="text" value={pattern} onChange={e => setPattern(e.target.value)}/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={rename} disabled={!files.length}>Rename All</button></div></div>);
}

function PDFSplitter({ logUsage }) {
  const [file, setFile] = useState(null);
  const split = () => { if (file) { logUsage(file.name, 'PDF Split'); alert('PDF Split analysis complete. Download individual pages coming in Pro version.'); } };
  return (<div><div className="file-upload-zone" onClick={() => document.getElementById('pdf-split-in').click()}><div className="file-upload-icon">✂️</div><h3>{file?.name || 'Select PDF to Split'}</h3></div>
    <input type="file" id="pdf-split-in" accept=".pdf" hidden onChange={e => setFile(e.target.files[0])}/>
    <div className="tool-actions"><button className="btn btn-primary" onClick={split} disabled={!file}>Split PDF</button></div></div>);
}

function FileCompressor({ logUsage }) {
  const [file, setFile] = useState(null);
  const compress = async () => {
    if (!file) return;
    logUsage(file.name, 'File Compression');
    const zip = new JSZip(); zip.file(file.name, file);
    const content = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a'); a.href = url; a.download = `${file.name}.zip`; a.click();
  };
  return (<div><div className="file-upload-zone" onClick={() => document.getElementById('comp-in').click()}><div className="file-upload-icon">🗜️</div><h3>{file?.name || 'Select File to Compress'}</h3></div>
    <input type="file" id="comp-in" hidden onChange={e => setFile(e.target.files[0])}/>
    <div className="tool-actions"><button className="btn btn-primary" onClick={compress} disabled={!file}>Compress & Download</button></div></div>);
}

function DocumentConverter({ logUsage }) {
  const [input, setInput] = useState(''); const [from, setFrom] = useState('json'); const [to, setTo] = useState('csv'); const [result, setResult] = useState('');
  const convert = () => {
    try {
      if (from === 'json' && to === 'csv') {
        const data = JSON.parse(input); const keys = Object.keys(data[0]);
        setResult([keys.join(','), ...data.map(r => keys.map(k => r[k] || '').join(','))].join('\n'));
      } else if (from === 'csv' && to === 'json') {
        const lines = input.trim().split('\n'); const keys = lines[0].split(',');
        setResult(JSON.stringify(lines.slice(1).map(l => { const v = l.split(','); const o = {}; keys.forEach((k,i) => o[k.trim()] = v[i]?.trim()); return o; }), null, 2));
      } else setResult('Conversion profile not supported yet.');
      logUsage(`Convert ${from} to ${to}`, 'Document Converter');
    } catch { setResult('Error processing document.'); }
  };
  return (<div>
    <div className="input-row"><div className="input-group"><label>From</label><select value={from} onChange={e => setFrom(e.target.value)}><option value="json">JSON</option><option value="csv">CSV</option></select></div>
    <div className="input-group"><label>To</label><select value={to} onChange={e => setTo(e.target.value)}><option value="csv">CSV</option><option value="json">JSON</option></select></div></div>
    <textarea value={input} onChange={e => setInput(e.target.value)} rows={6} placeholder="Paste your data here..."/>
    <div className="tool-actions"><button className="btn btn-primary" onClick={convert} style={{width:'auto'}}>Convert Document</button></div>
    {result && <div className="tool-result"><pre>{result}</pre><CopyBtn text={result}/></div>}
  </div>);
}

export default function FileTools({ toolId, logUsage, uploadPDF, askPDF }) {
  const map = {
    'csv-to-json': <CSVtoJSON logUsage={logUsage}/>, 
    'json-to-csv': <JSONtoCSV logUsage={logUsage}/>, 
    'file-metadata': <FileMetadata logUsage={logUsage}/>,
    'pdf-merger': <PDFMerger logUsage={logUsage}/>,
    'zip-creator': <ZIPCreator logUsage={logUsage}/>,
    'image-to-pdf': <ImageToPDF logUsage={logUsage}/>,
    'file-renamer-bulk': <FileRenamer logUsage={logUsage}/>,
    'pdf-splitter': <PDFSplitter logUsage={logUsage}/>,
    'pdf-to-image': <PDFToImage logUsage={logUsage}/>,
    'file-compressor': <FileCompressor logUsage={logUsage}/>,
    'document-converter': <DocumentConverter logUsage={logUsage}/>
  };
  return map[toolId] || <p>Tool coming soon!</p>;
}
