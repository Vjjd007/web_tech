import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { getToolsByCategory, toolCategories } from '../data/toolsData';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const category = toolCategories.find(c => c.id === categoryId);
  const categoryTools = getToolsByCategory(categoryId);

  return (
    <DashboardLayout title={category?.name || 'Tools'}>
      <div className="page-header">
        <h1>{category?.icon} {category?.name || 'Tools'}</h1>
        <p>{categoryTools.length} tools available</p>
      </div>
      <div className="tool-grid">
        {categoryTools.map(tool => (
          <div key={tool.id} className="tool-card" onClick={() => navigate(`/tool/${tool.id}`)}>
            <div className={`tool-card-icon ${tool.category}`}>
              <span>{tool.icon}</span>
            </div>
            <h3>{tool.name}</h3>
            <p>{tool.description}</p>
            <div className="tool-card-footer">
              <span className={`tool-category-tag tag-${tool.category}`}>{tool.category}</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
