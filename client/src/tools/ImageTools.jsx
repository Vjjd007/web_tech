import { useState, useRef } from 'react';

function ImageToBase64({ logUsage }) {
  const [imgSrc, setImgSrc] = useState(null); const [base64, setBase64] = useState('');
  const handleFile = (e) => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = (ev) => { setImgSrc(ev.target.result); setBase64(ev.target.result); logUsage(f.name, 'Image to Base64'); }; r.readAsDataURL(f); } };
  return (<div><div className="file-upload-zone" onClick={() => document.getElementById('base64-in').click()}><div className="file-upload-icon">🔗</div><h3>{imgSrc ? 'Image Selected' : 'Select Image for Base64'}</h3></div>
    <input type="file" id="base64-in" accept="image/*" hidden onChange={handleFile}/>
    {base64 && <div className="tool-result" style={{marginTop:16}}><p style={{fontSize:12,color:'var(--text-muted)'}}>Base64 String (truncated):</p><pre style={{maxHeight:150,overflow:'auto',wordBreak:'break-all'}}>{base64.substring(0,500)}...</pre><CopyBtn text={base64}/></div>}</div>);
}

function ImageToolUI({ title, processImage, logUsage }) {
  const [imgSrc, setImgSrc] = useState(null); const [result, setResult] = useState(null); const canvasRef = useRef(null);
  const handleFile = (e) => { const f = e.target.files[0]; if (f) { const reader = new FileReader(); reader.onload = (ev) => setImgSrc(ev.target.result); reader.readAsDataURL(f); } };
  const process = () => { if (!imgSrc) return; const img = new Image(); img.onload = () => { const c = canvasRef.current; processImage(img, c); setResult(c.toDataURL('image/png')); logUsage(title, 'Image Processed'); }; img.src = imgSrc; };
  return (<div><div className="file-upload-zone" onClick={() => document.getElementById('img-upload').click()}>
    <div className="file-upload-icon">🖼️</div><h3>{title}</h3><p>Click or drag to upload image</p></div>
    <input type="file" id="img-upload" accept="image/*" hidden onChange={handleFile}/>
    {imgSrc && <div style={{marginTop:16}}><img src={imgSrc} alt="Preview" style={{maxHeight:200,borderRadius:'var(--radius-md)'}}/></div>}
    <canvas ref={canvasRef} style={{display:'none'}}/>
    {imgSrc && <div className="tool-actions"><button className="btn btn-primary" onClick={process} style={{width:'auto'}}>Process</button>
    {result && <a href={result} download="processed.png" className="btn btn-secondary">Download</a>}</div>}
    {result && <div style={{marginTop:16}}><img src={result} alt="Result" style={{maxHeight:300,borderRadius:'var(--radius-md)'}}/></div>}</div>);
}

function ImageResizer({ logUsage }) {
  const [imgSrc, setImgSrc] = useState(null); const [w, setW] = useState(800); const [h, setH] = useState(600); const [result, setResult] = useState(null);
  const handleFile = (e) => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = (ev) => setImgSrc(ev.target.result); r.readAsDataURL(f); } };
  const resize = () => { const img = new Image(); img.onload = () => { const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(img, 0, 0, w, h); setResult(c.toDataURL()); logUsage(`${w}x${h}`, 'Image Resized'); }; img.src = imgSrc; };
  return (<div><div className="file-upload-zone" onClick={() => document.getElementById('resize-img').click()}>
    <div className="file-upload-icon">📐</div><h3>Upload Image to Resize</h3></div>
    <input type="file" id="resize-img" accept="image/*" hidden onChange={handleFile}/>
    <div className="input-row" style={{marginTop:16}}><div className="input-group"><label>Width</label><input type="number" value={w} onChange={e => setW(e.target.value)}/></div>
    <div className="input-group"><label>Height</label><input type="number" value={h} onChange={e => setH(e.target.value)}/></div></div>
    {imgSrc && <div className="tool-actions"><button className="btn btn-primary" onClick={resize} style={{width:'auto'}}>Resize</button></div>}
    {result && <div style={{marginTop:16}}><img src={result} alt="Resized" style={{maxHeight:300,borderRadius:'var(--radius-md)'}}/><div style={{marginTop:8}}><a href={result} download="resized.png" className="btn btn-secondary">Download</a></div></div>}</div>);
}

function ImageFilters({ logUsage }) {
  const [imgSrc, setImgSrc] = useState(null); const [filter, setFilter] = useState('none');
  const handleFile = (e) => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = (ev) => setImgSrc(ev.target.result); r.readAsDataURL(f); } };
  const filters = ['none','grayscale(100%)','sepia(100%)','blur(3px)','brightness(150%)','contrast(200%)','hue-rotate(90deg)','invert(100%)','saturate(200%)'];
  const apply = (f) => { setFilter(f); logUsage(f.split('(')[0] || 'none', 'Filter Applied'); };
  return (<div><div className="file-upload-zone" onClick={() => document.getElementById('filter-img').click()}>
    <div className="file-upload-icon">🌈</div><h3>Upload Image</h3></div>
    <input type="file" id="filter-img" accept="image/*" hidden onChange={handleFile}/>
    {imgSrc && <><div style={{display:'flex',gap:8,flexWrap:'wrap',margin:'16px 0'}}>
      {filters.map(f => <button key={f} className={`btn ${filter===f?'btn-primary':'btn-secondary'}`} onClick={() => apply(f)} style={{fontSize:12,width:'auto'}}>{f.split('(')[0] || 'none'}</button>)}
    </div><img src={imgSrc} alt="Filtered" style={{maxHeight:400,borderRadius:'var(--radius-md)',filter}}/></>}</div>);
}

function ImageBlur({ logUsage }) {
  const [imgSrc, setImgSrc] = useState(null); const [blur, setBlur] = useState(5);
  const handleFile = (e) => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = (ev) => setImgSrc(ev.target.result); r.readAsDataURL(f); } };
  const handleBlur = (v) => { setBlur(v); if(v%5===0) logUsage(v+'px', 'Image Blur'); };
  return (<div><div className="file-upload-zone" onClick={() => document.getElementById('blur-img').click()}>
    <div className="file-upload-icon">🌫️</div><h3>Upload Image</h3></div>
    <input type="file" id="blur-img" accept="image/*" hidden onChange={handleFile}/>
    {imgSrc && <><div className="input-group" style={{marginTop:16}}><label>Blur: {blur}px</label><input type="range" min="0" max="20" value={blur} onChange={e => handleBlur(e.target.value)}/></div>
    <img src={imgSrc} alt="Blurred" style={{maxHeight:400,borderRadius:'var(--radius-md)',filter:`blur(${blur}px)`}}/></>}</div>);
}

function ImageCropper({ logUsage }) {
  const [imgSrc, setImgSrc] = useState(null);
  const [cropped, setCropped] = useState(null);
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      const reader = new FileReader();
      reader.onload = (ev) => setImgSrc(ev.target.result);
      reader.readAsDataURL(f);
    }
  };
  const crop = () => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = c.height = 300; // Fixed center crop for simplicity
      const s = Math.min(img.width, img.height);
      c.getContext('2d').drawImage(img, (img.width-s)/2, (img.height-s)/2, s, s, 0, 0, 300, 300);
      const data = c.toDataURL();
      setCropped(data);
      logUsage('300x300', 'Image Cropped');
    };
    img.src = imgSrc;
  };
  return (<div>
    <div className="file-upload-zone" onClick={() => document.getElementById('crop-input').click()}>
      <div className="file-upload-icon">✂️</div>
      <h3>Upload Image to Center Crop</h3>
    </div>
    <input type="file" id="crop-input" accept="image/*" hidden onChange={handleFile}/>
    {imgSrc && <div className="tool-actions"><button className="btn btn-primary" onClick={crop}>Crop (300x300)</button></div>}
    {cropped && <div style={{marginTop:16}}><img src={cropped} style={{borderRadius:'var(--radius-md)'}}/><br/><a href={cropped} download="cropped.png" className="btn btn-secondary" style={{marginTop:8}}>Download</a></div>}
  </div>);
}

function FormatConverter({ logUsage }) {
  const [imgSrc, setImgSrc] = useState(null);
  const [format, setFormat] = useState('image/jpeg');
  const [result, setResult] = useState(null);
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      const reader = new FileReader();
      reader.onload = (ev) => setImgSrc(ev.target.result);
      reader.readAsDataURL(f);
    }
  };
  const convert = () => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      c.getContext('2d').drawImage(img, 0, 0);
      const data = c.toDataURL(format);
      setResult(data);
      logUsage(format.split('/')[1].toUpperCase(), 'Format Conversion');
    };
    img.src = imgSrc;
  };
  return (<div>
    <div className="file-upload-zone" onClick={() => document.getElementById('fmt-input').click()}>
      <div className="file-upload-icon">🔄</div>
      <h3>Select Image to Convert</h3>
    </div>
    <input type="file" id="fmt-input" accept="image/*" hidden onChange={handleFile}/>
    <div className="input-row" style={{marginTop:16}}><div className="input-group"><label>Target Format</label><select value={format} onChange={e => setFormat(e.target.value)}><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></div></div>
    {imgSrc && <div className="tool-actions"><button className="btn btn-primary" onClick={convert}>Convert</button></div>}
    {result && <div style={{marginTop:16}}><p style={{fontSize:12,color:'var(--text-muted)'}}>Ready for download ({format})</p><a href={result} download={`converted.${format.split('/')[1]}`} className="btn btn-secondary">Download</a></div>}
  </div>);
}

function ImageCompressor({ logUsage }) {
  const [imgSrc, setImgSrc] = useState(null);
  const [quality, setQuality] = useState(0.7);
  const [result, setResult] = useState(null);
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      const r = new FileReader(); r.onload = (ev) => setImgSrc(ev.target.result); r.readAsDataURL(f);
    }
  };
  const compress = () => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      c.getContext('2d').drawImage(img, 0, 0);
      const data = c.toDataURL('image/jpeg', quality);
      setResult(data);
      logUsage('Compress Image', `Quality: ${quality}`);
    };
    img.src = imgSrc;
  };
  return (<div>
    <div className="file-upload-zone" onClick={() => document.getElementById('comp-input').click()}>
      <div className="file-upload-icon">🗜️</div><h3>Select Image to Compress</h3>
    </div>
    <input type="file" id="comp-input" accept="image/*" hidden onChange={handleFile}/>
    <div className="input-row" style={{marginTop:16}}><div className="input-group"><label>Quality ({quality})</label><input type="range" min="0.1" max="1.0" step="0.1" value={quality} onChange={e => setQuality(parseFloat(e.target.value))}/></div></div>
    {imgSrc && <div className="tool-actions"><button className="btn btn-primary" onClick={compress}>Compress</button></div>}
    {result && <div style={{marginTop:16}}><p style={{fontSize:12}}>Compressed Image Size: {Math.round(result.length * 0.75 / 1024)} KB</p><a href={result} download="compressed.jpg" className="btn btn-secondary">Download</a></div>}
  </div>);
}

function BackgroundRemover({ logUsage }) {
  const [imgSrc, setImgSrc] = useState(null); const [result, setResult] = useState(null); const [threshold, setThreshold] = useState(200);
  const handleFile = (e) => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = (ev) => setImgSrc(ev.target.result); r.readAsDataURL(f); } };
  const remove = () => {
    const img = new Image(); img.onload = () => {
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0); const data = ctx.getImageData(0,0,c.width,c.height);
      for(let i=0; i<data.data.length; i+=4) {
        if(data.data[i] > threshold && data.data[i+1] > threshold && data.data[i+2] > threshold) data.data[i+3] = 0;
      }
      ctx.putImageData(data, 0, 0); setResult(c.toDataURL()); logUsage(`Threshold: ${threshold}`, 'Background Removed');
    }; img.src = imgSrc;
  };
  return (<div><div className="file-upload-zone" onClick={() => document.getElementById('bg-in').click()}><div className="file-upload-icon">🎭</div><h3>{imgSrc ? 'Image Selected' : 'Select Image to Remove Background'}</h3><p>Works best for white backgrounds</p></div>
    <input type="file" id="bg-in" accept="image/*" hidden onChange={handleFile}/>
    {imgSrc && <><div className="input-group" style={{marginTop:16}}><label>Brightness Threshold: {threshold}</label><input type="range" min="100" max="250" value={threshold} onChange={e => setThreshold(e.target.value)}/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={remove}>Remove (Lite)</button></div></>}
    {result && <div style={{marginTop:16}}><img src={result} style={{maxHeight:300,borderRadius:'var(--radius-md)',background:'url(https://www.transparenttextures.com/patterns/carbon-fibre.png)'}}/><br/><a href={result} download="no_bg.png" className="btn btn-secondary" style={{marginTop:8}}>Download PNG</a></div>}</div>);
}

function WatermarkTool({ logUsage }) {
  const [imgSrc, setImgSrc] = useState(null); const [text, setText] = useState('STUDENT HUB'); const [result, setResult] = useState(null);
  const handleFile = (e) => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = (ev) => setImgSrc(ev.target.result); r.readAsDataURL(f); } };
  const apply = () => {
    const img = new Image(); img.onload = () => {
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0); ctx.font = `${Math.floor(img.width/15)}px Arial`; ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.textAlign = 'center'; ctx.fillText(text, img.width/2, img.height/2); setResult(c.toDataURL());
      logUsage(text, 'Watermark Applied');
    }; img.src = imgSrc;
  };
  return (<div><div className="file-upload-zone" onClick={() => document.getElementById('water-in').click()}><div className="file-upload-icon">💧</div><h3>{imgSrc ? 'Image Selected' : 'Select Image to Watermark'}</h3></div>
    <input type="file" id="water-in" accept="image/*" hidden onChange={handleFile}/>
    {imgSrc && <><div className="input-group" style={{marginTop:16}}><label>Watermark Text</label><input type="text" value={text} onChange={e => setText(e.target.value)}/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={apply}>Apply Watermark</button></div></>}
    {result && <div style={{marginTop:16}}><img src={result} style={{maxHeight:300,borderRadius:'var(--radius-md)'}}/><br/><a href={result} download="watermarked.png" className="btn btn-secondary" style={{marginTop:8}}>Download</a></div>}</div>);
}

function ThumbnailGen({ logUsage }) {
  const [imgSrc, setImgSrc] = useState(null); const [result, setResult] = useState(null);
  const handleFile = (e) => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = (ev) => setImgSrc(ev.target.result); r.readAsDataURL(f); } };
  const gen = () => {
    const img = new Image(); img.onload = () => {
      const c = document.createElement('canvas'); c.width = 150; c.height = 150;
      c.getContext('2d').drawImage(img, 0, 0, 150, 150); setResult(c.toDataURL());
      logUsage('Thumbnail Generated', '150x150');
    }; img.src = imgSrc;
  };
  return (<div><div className="file-upload-zone" onClick={() => document.getElementById('thumb-in').click()}><div className="file-upload-icon">🖼️</div><h3>{imgSrc ? 'Image Selected' : 'Select Image for Thumbnail'}</h3></div>
    <input type="file" id="thumb-in" accept="image/*" hidden onChange={handleFile}/>
    {imgSrc && <div className="tool-actions"><button className="btn btn-primary" onClick={gen}>Generate Thumbnail</button></div>}
    {result && <div style={{marginTop:16}}><img src={result} style={{borderRadius:'var(--radius-md)'}}/><br/><a href={result} download="thumb.png" className="btn btn-secondary" style={{marginTop:8}}>Download (150x150)</a></div>}</div>);
}

function ImageMeta({ logUsage }) {
  const [info, setInfo] = useState(null);
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      const img = new Image();
      img.onload = () => {
        setInfo({ name: f.name, size: (f.size / 1024).toFixed(2) + ' KB', type: f.type, dim: `${img.width} x ${img.height}` });
        logUsage(f.name, 'Metadata Extracted');
      };
      img.src = URL.createObjectURL(f);
    }
  };
  return (<div><div className="file-upload-zone" onClick={() => document.getElementById('meta-in').click()}><div className="file-upload-icon">ℹ️</div><h3>Select Image to Inspect</h3></div>
    <input type="file" id="meta-in" accept="image/*" hidden onChange={handleFile}/>
    {info && <div className="tool-result" style={{marginTop:16}}><pre>{`Name: ${info.name}\nSize: ${info.size}\nType: ${info.type}\nDimensions: ${info.dim}`}</pre></div>}</div>);
}

export default function ImageTools({ toolId, logUsage }) {
  const map = {
    'image-resizer': <ImageResizer logUsage={logUsage}/>,
    'image-cropper': <ImageCropper logUsage={logUsage}/>,
    'format-converter': <FormatConverter logUsage={logUsage}/>,
    'image-filters': <ImageFilters logUsage={logUsage}/>,
    'image-blur': <ImageBlur logUsage={logUsage}/>,
    'image-compressor': <ImageCompressor logUsage={logUsage}/>,
    'image-to-base64': <ImageToBase64 logUsage={logUsage}/>,
    'watermark-tool': <WatermarkTool logUsage={logUsage}/>,
    'thumbnail-generator': <ThumbnailGen logUsage={logUsage}/>,
    'image-metadata': <ImageMeta logUsage={logUsage}/>,
    'background-remover': <BackgroundRemover logUsage={logUsage}/>
  };
  return map[toolId] || <p>Tool coming soon!</p>;
}
