export const toolCategories = [
  { id: 'student', name: 'Student Tools', icon: '🎓', color: '#6C5CE7', count: 17 },
  { id: 'developer', name: 'Developer Tools', icon: '💻', color: '#00D2D3', count: 16 },
  { id: 'text', name: 'Text Tools', icon: '📝', color: '#54A0FF', count: 12 },
  { id: 'file', name: 'File Tools', icon: '📁', color: '#FECA57', count: 11 },
  { id: 'image', name: 'Image Tools', icon: '🖼️', color: '#FF6B9D', count: 11 },
  { id: 'seo', name: 'SEO Tools', icon: '🔍', color: '#FF6B6B', count: 11 },
  { id: 'ai', name: 'AI Tools', icon: '🤖', color: '#6C5CE7', count: 22 }
];

export const tools = [
  // ===== STUDENT TOOLS (17) =====
  { id: 'cgpa-calculator', name: 'CGPA Calculator', description: 'Calculate your cumulative GPA from semester grades', category: 'student', icon: '📊' },
  { id: 'attendance-calculator', name: 'Attendance Calculator', description: 'Track and calculate your attendance percentage', category: 'student', icon: '📋' },
  { id: 'study-planner', name: 'Study Planner', description: 'Plan your study schedule with time blocks', category: 'student', icon: '📅' },
  { id: 'flashcards', name: 'Flashcards', description: 'Create and study digital flashcards', category: 'student', icon: '🗂️' },
  { id: 'quiz-generator', name: 'Quiz Generator', description: 'Generate quizzes from your study material', category: 'student', icon: '❓' },
  { id: 'exam-timer', name: 'Exam Timer', description: 'Countdown timer for exam practice sessions', category: 'student', icon: '⏱️' },
  { id: 'note-organizer', name: 'Note Organizer', description: 'Organize and categorize your notes', category: 'student', icon: '📓' },
  { id: 'research-notes', name: 'Research Notes', description: 'Take structured research notes with citations', category: 'student', icon: '🔬' },
  { id: 'assignment-planner', name: 'Assignment Planner', description: 'Track assignments with deadlines and priorities', category: 'student', icon: '📌' },
  { id: 'reference-manager', name: 'Reference Manager', description: 'Manage and format academic references', category: 'student', icon: '📚' },
  { id: 'unit-converter', name: 'Unit Converter', description: 'Convert between different measurement units', category: 'student', icon: '🔄' },
  { id: 'math-solver', name: 'Math Solver', description: 'Solve mathematical expressions and equations', category: 'student', icon: '🧮' },
  { id: 'scientific-calculator', name: 'Scientific Calculator', description: 'Full-featured scientific calculator', category: 'student', icon: '🔢' },
  { id: 'equation-solver', name: 'Equation Solver', description: 'Solve linear and quadratic equations', category: 'student', icon: '✖️' },
  { id: 'graph-plotter', name: 'Graph Plotter', description: 'Plot mathematical functions on a graph', category: 'student', icon: '📈' },
  { id: 'gpa-to-percentage', name: 'GPA to % Converter', description: 'Convert your SGPA/CGPA to percentage easily', category: 'student', icon: '🔢' },
  { id: 'budget-planner', name: 'Student Budget Planner', description: 'Track your monthly expenses and savings', category: 'student', icon: '💰' },

  // ===== DEVELOPER TOOLS (16) =====
  { id: 'json-formatter', name: 'JSON Formatter', description: 'Format and validate JSON data with syntax highlighting', category: 'developer', icon: '{ }' },
  { id: 'base64-encoder', name: 'Base64 Encoder', description: 'Encode text or files to Base64 format', category: 'developer', icon: '🔐' },
  { id: 'base64-decoder', name: 'Base64 Decoder', description: 'Decode Base64 strings back to original text', category: 'developer', icon: '🔓' },
  { id: 'uuid-generator', name: 'UUID Generator', description: 'Generate random UUIDs (v4) instantly', category: 'developer', icon: '🆔' },
  { id: 'regex-tester', name: 'Regex Tester', description: 'Test regular expressions with real-time matching', category: 'developer', icon: '🔤' },
  { id: 'hash-generator', name: 'Hash Generator', description: 'Generate MD5, SHA-1, SHA-256 hashes', category: 'developer', icon: '#️⃣' },
  { id: 'password-generator', name: 'Password Generator', description: 'Generate secure random passwords', category: 'developer', icon: '🔑' },
  { id: 'code-formatter', name: 'Code Formatter', description: 'Format and beautify code snippets', category: 'developer', icon: '✨' },
  { id: 'markdown-editor', name: 'Markdown Editor', description: 'Write and preview Markdown in real-time', category: 'developer', icon: '📝' },
  { id: 'color-converter', name: 'Color Code Converter', description: 'Convert between HEX, RGB, and HSL colors', category: 'developer', icon: '🎨' },
  { id: 'sql-formatter', name: 'SQL Formatter', description: 'Format and beautify SQL queries', category: 'developer', icon: '🗄️' },
  { id: 'api-tester', name: 'API Tester', description: 'Test REST APIs with custom requests', category: 'developer', icon: '🌐' },
  { id: 'jwt-decoder', name: 'JWT Decoder', description: 'Decode and inspect JWT tokens', category: 'developer', icon: '🎫' },
  { id: 'html-previewer', name: 'HTML Previewer', description: 'Preview HTML code in real-time', category: 'developer', icon: '🖥️' },
  { id: 'css-minifier-dev', name: 'CSS Minifier', description: 'Minify CSS code to reduce file size', category: 'developer', icon: '🗜️' },
  { id: 'qrcode-generator', name: 'QR Code Generator', description: 'Generate custom QR codes for any text or URL', category: 'developer', icon: '🏁' },

  // ===== TEXT TOOLS (12) =====
  { id: 'word-counter', name: 'Word Counter', description: 'Count words, characters, sentences, and paragraphs', category: 'text', icon: '🔢' },
  { id: 'character-counter', name: 'Character Counter', description: 'Count characters with and without spaces', category: 'text', icon: '🔤' },
  { id: 'text-reverser', name: 'Text Reverser', description: 'Reverse any text string instantly', category: 'text', icon: '🔀' },
  { id: 'uppercase-converter', name: 'Uppercase Converter', description: 'Convert text to UPPERCASE format', category: 'text', icon: '🔠' },
  { id: 'lowercase-converter', name: 'Lowercase Converter', description: 'Convert text to lowercase format', category: 'text', icon: '🔡' },
  { id: 'remove-duplicates', name: 'Remove Duplicate Lines', description: 'Remove duplicate lines from text', category: 'text', icon: '🧹' },
  { id: 'sort-text', name: 'Sort Text', description: 'Sort text lines alphabetically or numerically', category: 'text', icon: '📃' },
  { id: 'slug-generator', name: 'Slug Generator', description: 'Generate URL-friendly slugs from text', category: 'text', icon: '🔗' },
  { id: 'text-diff', name: 'Text Diff Checker', description: 'Compare two texts and show differences', category: 'text', icon: '⚖️' },
  { id: 'random-text', name: 'Random Text Generator', description: 'Generate lorem ipsum or random text', category: 'text', icon: '🎲' },
  { id: 'binary-converter', name: 'Binary Converter', description: 'Convert text to binary and vice versa', category: 'text', icon: '🔢' },
  { id: 'case-scrambler', name: 'Case Scrambler', description: 'Scramble the case of your text randomly', category: 'text', icon: '🔠' },

  // ===== FILE TOOLS (11) =====
  { id: 'pdf-merger', name: 'PDF Merger', description: 'Merge multiple PDF files into one', category: 'file', icon: '📑' },
  { id: 'pdf-splitter', name: 'PDF Splitter', description: 'Split a PDF file into individual pages', category: 'file', icon: '✂️' },
  { id: 'image-to-pdf', name: 'Image to PDF', description: 'Convert images to PDF documents', category: 'file', icon: '🖼️' },
  { id: 'pdf-to-image', name: 'PDF to Image', description: 'Convert PDF pages to image files', category: 'file', icon: '📷' },
  { id: 'file-compressor', name: 'File Size Compressor', description: 'Compress files to reduce size', category: 'file', icon: '🗜️' },
  { id: 'document-converter', name: 'Document Converter', description: 'Convert between document formats', category: 'file', icon: '🔄' },
  { id: 'zip-creator', name: 'ZIP Creator', description: 'Create ZIP archives from files', category: 'file', icon: '📦' },
  { id: 'file-metadata', name: 'File Metadata Viewer', description: 'View detailed file metadata information', category: 'file', icon: 'ℹ️' },
  { id: 'csv-to-json', name: 'CSV to JSON', description: 'Convert CSV data to JSON format', category: 'file', icon: '📊' },
  { id: 'json-to-csv', name: 'JSON to CSV', description: 'Convert JSON data to CSV format', category: 'file', icon: '📋' },
  { id: 'file-renamer-bulk', name: 'Bulk File Renamer', description: 'Rename multiple files at once with patterns', category: 'file', icon: '🏷️' },

  // ===== IMAGE TOOLS (11) =====
  { id: 'image-resizer', name: 'Image Resizer', description: 'Resize images to custom dimensions', category: 'image', icon: '📐' },
  { id: 'image-cropper', name: 'Image Cropper', description: 'Crop images to desired area', category: 'image', icon: '✂️' },
  { id: 'image-compressor', name: 'Image Compressor', description: 'Compress images without losing quality', category: 'image', icon: '🗜️' },
  { id: 'format-converter', name: 'Format Converter', description: 'Convert between image formats (PNG, JPG, WebP)', category: 'image', icon: '🔄' },
  { id: 'background-remover', name: 'Background Remover', description: 'Remove image backgrounds instantly', category: 'image', icon: '🎭' },
  { id: 'image-filters', name: 'Image Filters', description: 'Apply artistic filters to images', category: 'image', icon: '🌈' },
  { id: 'watermark-tool', name: 'Watermark Tool', description: 'Add text or image watermarks', category: 'image', icon: '💧' },
  { id: 'image-metadata', name: 'Image Metadata Viewer', description: 'View EXIF and metadata of images', category: 'image', icon: 'ℹ️' },
  { id: 'thumbnail-generator', name: 'Thumbnail Generator', description: 'Generate thumbnails from images', category: 'image', icon: '🖼️' },
  { id: 'image-blur', name: 'Image Blur Tool', description: 'Apply blur effects to images', category: 'image', icon: '🌫️' },
  { id: 'image-to-base64', name: 'Image to Base64', description: 'Convert any image to Base64 string', category: 'image', icon: '🔗' },

  // ===== SEO TOOLS (11) =====
  { id: 'meta-tag-generator', name: 'Meta Tag Generator', description: 'Generate SEO-optimized meta tags', category: 'seo', icon: '🏷️' },
  { id: 'keyword-density', name: 'Keyword Density Checker', description: 'Analyze keyword density in text', category: 'seo', icon: '📊' },
  { id: 'sitemap-generator', name: 'Sitemap Generator', description: 'Generate XML sitemaps for websites', category: 'seo', icon: '🗺️' },
  { id: 'robots-txt', name: 'Robots.txt Generator', description: 'Generate robots.txt configuration', category: 'seo', icon: '🤖' },
  { id: 'serp-preview', name: 'SERP Preview Tool', description: 'Preview how your page appears in search results', category: 'seo', icon: '👁️' },
  { id: 'url-slug-gen', name: 'URL Slug Generator', description: 'Generate SEO-friendly URL slugs', category: 'seo', icon: '🔗' },
  { id: 'html-minifier', name: 'HTML Minifier', description: 'Minify HTML to reduce page size', category: 'seo', icon: '📄' },
  { id: 'css-minifier', name: 'CSS Minifier', description: 'Minify CSS stylesheets for performance', category: 'seo', icon: '🎨' },
  { id: 'js-minifier', name: 'JS Minifier', description: 'Minify JavaScript files for production', category: 'seo', icon: '⚡' },
  { id: 'speed-analyzer', name: 'Website Speed Analyzer', description: 'Analyze website loading performance', category: 'seo', icon: '🚀' },
  { id: 'domain-age-checker', name: 'Domain Age Checker', description: 'Check the age of any domain instantly', category: 'seo', icon: '📅' },

  // ===== AI TOOLS (22) =====
  { id: 'ai-chat', name: 'AI Chat Assistant', description: 'Chat with AI for any questions and help', category: 'ai', icon: '💬' },
  { id: 'ai-essay', name: 'AI Essay Writer', description: 'Generate well-structured essays on any topic', category: 'ai', icon: '📝' },
  { id: 'ai-code-gen', name: 'AI Code Generator', description: 'Generate code in any programming language', category: 'ai', icon: '💻' },
  { id: 'ai-debugger', name: 'AI Code Debugger', description: 'Find and fix bugs in your code', category: 'ai', icon: '🐛' },
  { id: 'ai-summarizer', name: 'AI Text Summarizer', description: 'Summarize long texts into key points', category: 'ai', icon: '📋' },
  { id: 'ai-research', name: 'AI Research Assistant', description: 'Get AI-powered research assistance', category: 'ai', icon: '🔬' },
  { id: 'ai-blog', name: 'AI Blog Writer', description: 'Generate SEO-optimized blog posts', category: 'ai', icon: '✍️' },
  { id: 'ai-email', name: 'AI Email Generator', description: 'Generate professional emails instantly', category: 'ai', icon: '📧' },
  { id: 'ai-resume', name: 'AI Resume Builder', description: 'Build professional resumes with AI help', category: 'ai', icon: '📄' },
  { id: 'ai-study-notes', name: 'AI Study Notes', description: 'Generate comprehensive study notes', category: 'ai', icon: '📒' },
  { id: 'ai-qa', name: 'AI Question Answering', description: 'Get instant answers to any question', category: 'ai', icon: '❓' },
  { id: 'ai-flashcards', name: 'AI Flashcard Generator', description: 'Generate flashcards from any topic', category: 'ai', icon: '🗂️' },
  { id: 'ai-interview', name: 'AI Interview Trainer', description: 'Practice interviews with AI feedback', category: 'ai', icon: '🎤' },
  { id: 'ai-grammar', name: 'AI Grammar Fixer', description: 'Fix grammar and improve writing', category: 'ai', icon: '✅' },
  { id: 'ai-explain', name: 'AI Code Explainer', description: 'Get line-by-line code explanations', category: 'ai', icon: '💡' },
  { id: 'ai-idea', name: 'AI Idea Generator', description: 'Generate creative ideas for any project', category: 'ai', icon: '💡' },
  { id: 'ai-prompt', name: 'AI Prompt Generator', description: 'Generate effective AI prompts', category: 'ai', icon: '🎯' },
  { id: 'ai-homework', name: 'AI Homework Helper', description: 'Get step-by-step homework solutions', category: 'ai', icon: '📖' },
  { id: 'ai-pdf', name: 'AI PDF Analyzer', description: 'Upload PDFs and ask AI questions about them', category: 'ai', icon: '📑' },
  { id: 'ai-image', name: 'AI Image Analyzer', description: 'Upload images and extract text with AI analysis', category: 'ai', icon: '🖼️' },
  { id: 'ai-lyrics', name: 'AI Lyric Generator', description: 'Generate song lyrics on any topic', category: 'ai', icon: '🎵' },
  { id: 'ai-trivia', name: 'AI Trivia Generator', description: 'Generate trivia questions for any subject', category: 'ai', icon: '🧩' },
];

export const getToolsByCategory = (category) => tools.filter(t => t.category === category);
export const getToolById = (id) => tools.find(t => t.id === id);
export const searchTools = (query) => {
  const q = query.toLowerCase();
  return tools.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.category.toLowerCase().includes(q)
  );
};
