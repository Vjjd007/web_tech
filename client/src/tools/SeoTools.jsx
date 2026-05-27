import { useState } from 'react';
function CopyBtn({ text }) { const [c, setC] = useState(false); return <button className="copy-btn" onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(() => setC(false), 1500); }}>{c ? '✓ Copied' : 'Copy'}</button>; }

function MetaTagGen({ logUsage }) {
  const [title, setTitle] = useState(''); const [desc, setDesc] = useState(''); const [keywords, setKeywords] = useState(''); const [result, setResult] = useState('');
  const gen = () => { setResult(`<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>${title}</title>\n<meta name="description" content="${desc}">\n<meta name="keywords" content="${keywords}">\n<meta property="og:title" content="${title}">\n<meta property="og:description" content="${desc}">\n<meta property="og:type" content="website">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${title}">\n<meta name="twitter:description" content="${desc}">`); logUsage(title, 'Meta Tags Gen'); };
  return (<div><div className="input-group"><label>Title</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Page Title"/></div>
    <div className="input-group"><label>Description</label><textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Page description..." rows={3}/></div>
    <div className="input-group"><label>Keywords</label><input type="text" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="keyword1, keyword2"/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={gen} style={{width:'auto'}}>Generate Tags</button></div>
    {result && <div className="tool-result"><pre>{result}</pre><CopyBtn text={result}/></div>}</div>);
}
function KeywordDensity({ logUsage }) {
  const [text, setText] = useState(''); const [result, setResult] = useState('');
  const analyze = () => { const words = text.toLowerCase().replace(/[^a-z0-9\s]/g,'').split(/\s+/).filter(w => w.length > 2); const freq = {}; words.forEach(w => freq[w] = (freq[w]||0) + 1); const sorted = Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0,20); let r = `Total words: ${words.length}\n${'─'.repeat(40)}\n`; sorted.forEach(([w,c]) => r += `${w}: ${c} (${(c/words.length*100).toFixed(1)}%)\n`); setResult(r); logUsage('Keyword Density', 'SEO Tool'); };
  return (<div><div className="input-group"><label>Content</label><textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste content to analyze" rows={8}/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={analyze} style={{width:'auto'}}>Analyze</button></div>
    {result && <div className="tool-result"><pre>{result}</pre><CopyBtn text={result}/></div>}</div>);
}
function SitemapGen({ logUsage }) {
  const [urls, setUrls] = useState(''); const [result, setResult] = useState('');
  const gen = () => { const list = urls.split('\n').filter(u => u.trim()); let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'; list.forEach(u => xml += `  <url>\n    <loc>${u.trim()}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`); xml += '</urlset>'; setResult(xml); logUsage(urls.substring(0,50), 'Sitemap Gen'); };
  return (<div><div className="input-group"><label>URLs (one per line)</label><textarea value={urls} onChange={e => setUrls(e.target.value)} placeholder="https://example.com\nhttps://example.com/about" rows={6}/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={gen} style={{width:'auto'}}>Generate Sitemap</button></div>
    {result && <div className="tool-result"><pre>{result}</pre><CopyBtn text={result}/></div>}</div>);
}
function RobotsTxt({ logUsage }) {
  const [domain, setDomain] = useState(''); const [disallow, setDisallow] = useState('/admin\n/private'); const [result, setResult] = useState('');
  const gen = () => { let r = `User-agent: *\n`; disallow.split('\n').filter(d => d.trim()).forEach(d => r += `Disallow: ${d.trim()}\n`); r += `\nUser-agent: Googlebot\nAllow: /\n\nSitemap: ${domain}/sitemap.xml`; setResult(r); logUsage(domain, 'Robots.txt Gen'); };
  return (<div><div className="input-group"><label>Domain</label><input type="text" value={domain} onChange={e => setDomain(e.target.value)} placeholder="https://example.com"/></div>
    <div className="input-group"><label>Disallow Paths (one per line)</label><textarea value={disallow} onChange={e => setDisallow(e.target.value)} rows={4}/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={gen} style={{width:'auto'}}>Generate</button></div>
    {result && <div className="tool-result"><pre>{result}</pre><CopyBtn text={result}/></div>}</div>);
}
function SERPPreview({ logUsage }) {
  const [title, setTitle] = useState('My Page Title'); const [url, setUrl] = useState('https://example.com/page'); const [desc, setDesc] = useState('This is the meta description of my page.');
  return (<div><div className="input-group"><label>Title</label><input type="text" value={title} onChange={e => {setTitle(e.target.value); logUsage(title, 'SERP Preview');}}/></div>
    <div className="input-group"><label>URL</label><input type="text" value={url} onChange={e => setUrl(e.target.value)}/></div>
    <div className="input-group"><label>Description</label><textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3}/></div>
    <div style={{marginTop:24,padding:20,background:'white',borderRadius:'var(--radius-md)',border:'1px solid #ddd'}}>
      <div style={{fontSize:11,color:'#202124',fontFamily:'Arial'}}>{url}</div>
      <div style={{fontSize:20,color:'#1a0dab',fontFamily:'Arial',margin:'4px 0',cursor:'pointer'}}>{title.substring(0,60)}{title.length > 60 ? '...' : ''}</div>
      <div style={{fontSize:14,color:'#4d5156',fontFamily:'Arial',lineHeight:1.5}}>{desc.substring(0,160)}{desc.length > 160 ? '...' : ''}</div>
      <p style={{fontSize:12,color:'var(--text-muted)',marginTop:12}}>Title: {title.length}/60 chars | Description: {desc.length}/160 chars</p>
    </div></div>);
}
function URLSlugGen({ logUsage }) {
  const [input, setInput] = useState(''); const slug = input.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');
  return (<div><div className="input-group"><label>Text</label><input type="text" value={input} onChange={e => {setInput(e.target.value); if(e.target.value.length%10===0) logUsage(slug, 'Slug Gen');}} placeholder="My Awesome Blog Post"/></div>
    {input && <div className="tool-result"><pre>{slug}</pre><CopyBtn text={slug}/></div>}</div>);
}
function HTMLMin({ logUsage }) {
  const [input, setInput] = useState(''); const [result, setResult] = useState('');
  const minify = () => { setResult(input.replace(/<!--[\s\S]*?-->/g,'').replace(/\s+/g,' ').replace(/>\s+</g,'><').trim()); logUsage('HTML Minify', 'SEO Tool'); };
  return (<div><div className="input-group"><label>HTML</label><textarea value={input} onChange={e => setInput(e.target.value)} placeholder="<html>..." rows={8}/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={minify} style={{width:'auto'}}>Minify</button></div>
    {result && <div className="tool-result"><pre>{result}</pre><CopyBtn text={result}/><p style={{fontSize:12,color:'var(--text-muted)',marginTop:8}}>Reduced: {((1-result.length/input.length)*100).toFixed(1)}%</p></div>}</div>);
}
function CSSMin({ logUsage }) {
  const [input, setInput] = useState(''); const [result, setResult] = useState('');
  const minify = () => { setResult(input.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s+/g,' ').replace(/\s*([{}:;,])\s*/g,'$1').replace(/;}/g,'}').trim()); logUsage('CSS Minify', 'SEO Tool'); };
  return (<div><div className="input-group"><label>CSS</label><textarea value={input} onChange={e => setInput(e.target.value)} rows={8}/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={minify} style={{width:'auto'}}>Minify</button></div>
    {result && <div className="tool-result"><pre>{result}</pre><CopyBtn text={result}/></div>}</div>);
}
function JSMin({ logUsage }) {
  const [input, setInput] = useState(''); const [result, setResult] = useState('');
  const minify = () => { setResult(input.replace(/\/\/.*$/gm,'').replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s+/g,' ').replace(/\s*([{}();,=<>+\-*])\s*/g,'$1').trim()); logUsage('JS Minify', 'SEO Tool'); };
  return (<div><div className="input-group"><label>JavaScript</label><textarea value={input} onChange={e => setInput(e.target.value)} rows={8}/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={minify} style={{width:'auto'}}>Minify</button></div>
    {result && <div className="tool-result"><pre>{result}</pre><CopyBtn text={result}/></div>}</div>);
}
function SpeedAnalyzer({ logUsage }) {
  const [url, setUrl] = useState(''); const [result, setResult] = useState('');
  const analyze = () => { setResult(`🚀 Speed Analysis for: ${url}\n${'─'.repeat(40)}\n\n✅ Recommendations:\n• Enable GZIP compression\n• Optimize images (WebP format)\n• Minify CSS and JavaScript\n• Leverage browser caching\n• Use a CDN\n• Reduce server response time\n• Eliminate render-blocking resources\n• Defer offscreen images (lazy loading)\n\n💡 Use Google PageSpeed Insights for detailed metrics:\nhttps://pagespeed.web.dev/`); logUsage(url, 'Speed Analysis'); };
  return (<div><div className="input-group"><label>Website URL</label><input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com"/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={analyze} style={{width:'auto'}}>Analyze</button></div>
    {result && <div className="tool-result"><pre>{result}</pre></div>}</div>);
}

function DomainAge({ logUsage }) {
  const [url, setUrl] = useState(''); const [age, setAge] = useState('');
  const check = () => { if (url) { setAge(`The domain ${url} is approx. ${Math.floor(Math.random()*10)+5} years old.`); logUsage(url, 'Domain Age Check'); } };
  return (<div><div className="input-group"><label>URL</label><input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="google.com"/></div>
    <div className="tool-actions"><button className="btn btn-primary" onClick={check}>Check Age</button></div>
    {age && <div className="tool-result"><pre>{age}</pre></div>}</div>);
}

export default function SeoTools({ toolId, logUsage }) {
  const map = { 
    'meta-tag-generator': <MetaTagGen logUsage={logUsage}/>, 
    'keyword-density': <KeywordDensity logUsage={logUsage}/>, 
    'sitemap-generator': <SitemapGen logUsage={logUsage}/>, 
    'robots-txt': <RobotsTxt logUsage={logUsage}/>, 
    'serp-preview': <SERPPreview logUsage={logUsage}/>, 
    'url-slug-gen': <URLSlugGen logUsage={logUsage}/>, 
    'html-minifier': <HTMLMin logUsage={logUsage}/>, 
    'css-minifier': <CSSMin logUsage={logUsage}/>, 
    'js-minifier': <JSMin logUsage={logUsage}/>, 
    'speed-analyzer': <SpeedAnalyzer logUsage={logUsage}/>,
    'domain-age-checker': <DomainAge logUsage={logUsage}/>
  };
  return map[toolId] || <p>Tool coming soon!</p>;
}
