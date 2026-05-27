import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { getToolById } from '../data/toolsData';
import { useState, useEffect } from 'react';
import { addFavorite, removeFavorite, logToolUsage, generateAI, uploadPDF, askPDF, ocrImage, askImage } from '../services/api';
import StudentTools from '../tools/StudentTools';
import DevTools from '../tools/DevTools';
import TextTools from '../tools/TextTools';
import FileTools from '../tools/FileTools';
import ImageTools from '../tools/ImageTools';
import SeoTools from '../tools/SeoTools';
import AITools from '../tools/AITools';

export default function ToolPage() {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const tool = getToolById(toolId);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [toolId]);

  if (!tool) return (
    <DashboardLayout title="Tool Not Found">
      <div className="empty-state">
        <div className="empty-state-icon">🔍</div>
        <h3>Tool Not Found</h3>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')} style={{width:'auto',marginTop:16}}>Back to Dashboard</button>
      </div>
    </DashboardLayout>
  );

  const toggleFav = async () => {
    try {
      if (isFav) { await removeFavorite(tool.id); setIsFav(false); }
      else { await addFavorite({ toolId: tool.id, toolName: tool.name, category: tool.category }); setIsFav(true); }
    } catch {}
  };

  const logUsage = (input, output) => {
    try { logToolUsage({ toolId: tool.id, toolName: tool.name, category: tool.category, input, output }); } catch {}
  };

  const renderTool = () => {
    const props = { toolId: tool.id, logUsage, generateAI, uploadPDF, askPDF, ocrImage, askImage };
    switch (tool.category) {
      case 'student': return <StudentTools {...props} />;
      case 'developer': return <DevTools {...props} />;
      case 'text': return <TextTools {...props} />;
      case 'file': return <FileTools {...props} />;
      case 'image': return <ImageTools {...props} />;
      case 'seo': return <SeoTools {...props} />;
      case 'ai': return <AITools {...props} />;
      default: return <p>Tool not implemented yet.</p>;
    }
  };

  return (
    <DashboardLayout title={tool.name}>
      <div className="tool-page">
        <div className="tool-page-header">
          <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
          <div style={{flex:1}}>
            <h1 style={{fontSize:24,fontWeight:800,display:'flex',alignItems:'center',gap:10}}>
              <span>{tool.icon}</span> {tool.name}
            </h1>
            <p style={{color:'var(--text-secondary)',fontSize:14}}>{tool.description}</p>
          </div>
          <button className={`fav-btn ${isFav?'active':''}`} onClick={toggleFav} style={{fontSize:24}}>{isFav?'★':'☆'}</button>
        </div>
        <div className="tool-workspace">{renderTool()}</div>
      </div>
    </DashboardLayout>
  );
}
