import {
  BookOpen,
  Boxes,
  CalendarDays,
  ChevronRight,
  Code2,
  Database,
  ExternalLink,
  FileText,
  GitFork,
  Github,
  Layers3,
  Mail,
  Menu,
  Moon,
  Network,
  Rocket,
  Search,
  Server,
  ShieldCheck,
  Star,
  Sun,
  Terminal,
  Workflow,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

type Page = 'home' | 'articles' | 'article' | 'categories' | 'tags' | 'projects' | 'about';
type ThemeMode = 'light' | 'dark';

type Article = {
  id: string;
  title: string;
  category: string;
  date: string;
  views: string;
  description: string;
  tags: string[];
  theme: 'network' | 'algorithm' | 'memory' | 'code';
};

type Category = {
  name: string;
  count: number;
  icon: JSX.Element;
};

type Project = {
  name: string;
  repo: string;
  url: string;
  summary: string;
  role: string;
  license: string;
  stars: string;
  forks: string;
  commits: string;
  issues?: string;
  stack: string[];
  highlights: string[];
  modules: string[];
  color: 'blue' | 'green';
};

const articles: Article[] = [
  {
    id: 'tcp-handshake',
    title: '深入理解 TCP 三次握手与四次挥手',
    category: '计算机网络',
    date: '2026-04-18',
    views: '1.2k',
    description: '梳理连接建立、连接释放、状态流转、报文顺序和面试高频追问。',
    tags: ['TCP/IP', '网络协议', '面试题'],
    theme: 'network',
  },
  {
    id: 'binary-tree',
    title: '二叉树遍历的通用解法',
    category: '数据结构',
    date: '2026-04-16',
    views: '856',
    description: '对比前序、中序、后序、层序遍历，并总结递归与迭代模板。',
    tags: ['算法', '二叉树', '栈'],
    theme: 'algorithm',
  },
  {
    id: 'memory-paging',
    title: '操作系统内存管理：分页机制',
    category: '操作系统',
    date: '2026-04-14',
    views: '1.1k',
    description: '解释页表、虚拟地址、物理页框、TLB 和缺页中断流程。',
    tags: ['操作系统', '内存管理', '分页'],
    theme: 'memory',
  },
  {
    id: 'closure',
    title: '闭包作用域与运行时行为',
    category: '编程语言',
    date: '2026-04-12',
    views: '980',
    description: '从执行上下文理解词法作用域、变量捕获和闭包生命周期。',
    tags: ['JavaScript', '运行时', '作用域'],
    theme: 'code',
  },
];

const categories: Category[] = [
  { name: '计算机网络', count: 12, icon: <Network size={24} /> },
  { name: '操作系统', count: 10, icon: <Server size={24} /> },
  { name: '数据结构与算法', count: 18, icon: <Boxes size={24} /> },
  { name: '计算机组成原理', count: 8, icon: <Layers3 size={24} /> },
  { name: '编程语言', count: 14, icon: <Code2 size={24} /> },
  { name: '数据库', count: 9, icon: <Database size={24} /> },
];

const tags = [
  '计算机网络',
  '操作系统',
  '数据结构',
  '算法',
  'C++',
  'Linux',
  '计算机组成原理',
  '数据库',
  '分布式系统',
  'TCP/IP',
  '进程线程',
  '内存管理',
  '编译原理',
  '设计模式',
];

const projects: Project[] = [
  {
    name: 'GinChat',
    repo: 'USERON8/ginchat',
    url: 'https://github.com/USERON8/ginchat',
    summary: '基于 Go + Gin 构建的单体 IM 即时通讯服务，支持私聊、群聊、好友管理，使用 WebSocket 实现实时消息推送。',
    role: '实时通讯 IM 后端',
    license: 'MIT',
    stars: '1',
    forks: '0',
    commits: '4',
    stack: ['Go', 'Gin', 'GORM', 'PostgreSQL', 'Redis', 'WebSocket', 'JWT', 'Zap', 'Viper', 'Docker Compose'],
    highlights: ['私聊与群聊实时推送', '好友申请与好友列表', '游标分页历史消息', 'Redis SETNX 消息去重', '在线状态与心跳检测', 'Worker Pool 异步写库'],
    modules: ['用户模块', '好友模块', '群组模块', '消息模块', '通讯优化', '统一响应'],
    color: 'green',
  },
  {
    name: 'Cloud Shop Microservices',
    repo: 'USERON8/cloud',
    url: 'https://github.com/USERON8/cloud',
    summary: 'Cloud Shop 是基于 Spring Boot、Spring Cloud Alibaba、Dubbo、RocketMQ、MySQL、Redis、Elasticsearch 与 UniApp 的微服务电商项目。',
    role: '微服务电商平台',
    license: 'Apache-2.0',
    stars: '1',
    forks: '0',
    commits: '1,186',
    issues: '8',
    stack: ['Spring Boot', 'Spring Cloud Alibaba', 'Dubbo', 'RocketMQ', 'MySQL', 'Redis', 'Elasticsearch', 'UniApp', 'Nacos', 'Docker'],
    highlights: ['Gateway 统一公网入口', 'JWT 与内部 HMAC 信任链', 'Local Transaction + Outbox 一致性', 'RocketMQ 幂等消费', 'Cache-Aside 延迟双删', 'Elasticsearch 商品与店铺搜索'],
    modules: ['gateway', 'auth-service', 'user-service', 'order-service', 'product-service', 'stock-service', 'payment-service', 'search-service', 'governance-service', 'my-shop-uniapp'],
    color: 'blue',
  },
];

const navItems: { label: string; page: Page }[] = [
  { label: '首页', page: 'home' },
  { label: '文章', page: 'articles' },
  { label: '分类', page: 'categories' },
  { label: '标签', page: 'tags' },
  { label: '项目', page: 'projects' },
  { label: '关于我', page: 'about' },
];

function App() {
  const [page, setPage] = useState<Page>('home');
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [selectedArticle, setSelectedArticle] = useState<Article>(articles[0]);
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const filteredArticles = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return articles;
    return articles.filter((article) =>
      [article.title, article.category, article.description, ...article.tags].some((item) =>
        item.toLowerCase().includes(keyword),
      ),
    );
  }, [query]);

  const openArticle = (article: Article) => {
    setSelectedArticle(article);
    setPage('article');
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigate = (nextPage: Page) => {
    setPage(nextPage);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="site-shell" data-theme={theme}>
      <Header
        page={page}
        query={query}
        setQuery={setQuery}
        navigate={navigate}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <main>
        {page === 'home' && <HomePage navigate={navigate} openArticle={openArticle} />}
        {page === 'articles' && <ArticlesPage articles={filteredArticles} openArticle={openArticle} query={query} setQuery={setQuery} />}
        {page === 'article' && <ArticlePage article={selectedArticle} openArticle={openArticle} />}
        {page === 'categories' && <CategoriesPage />}
        {page === 'tags' && <TagsPage />}
        {page === 'projects' && <ProjectsPage />}
        {page === 'about' && <AboutPage navigate={navigate} />}
      </main>
      <Footer navigate={navigate} />
    </div>
  );
}

function Header({
  page,
  query,
  setQuery,
  navigate,
  menuOpen,
  setMenuOpen,
  theme,
  toggleTheme,
}: {
  page: Page;
  query: string;
  setQuery: (value: string) => void;
  navigate: (page: Page) => void;
  menuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
}) {
  const ThemeIcon = theme === 'light' ? Moon : Sun;

  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="brand" onClick={() => navigate('home')} aria-label="返回首页">
          <span className="brand-mark">
            <Code2 size={17} />
          </span>
          <span>CodeExplorer</span>
        </button>
        <nav className="desktop-nav">
          {navItems.map((item) => (
            <button key={item.page} className={page === item.page ? 'active' : ''} onClick={() => navigate(item.page)}>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <label className="search-pill">
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索文章..." />
            <Search size={16} />
          </label>
          <button className="icon-button theme-button" aria-label="切换主题" onClick={toggleTheme}>
            <ThemeIcon size={17} />
          </button>
          <button className="avatar-button" aria-label="打开个人资料" onClick={() => navigate('about')}>
            <span>CE</span>
          </button>
          <button className="mobile-menu" aria-label="打开菜单" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="mobile-nav">
          {navItems.map((item) => (
            <button key={item.page} className={page === item.page ? 'active' : ''} onClick={() => navigate(item.page)}>
              {item.label}
            </button>
          ))}
          <button onClick={toggleTheme}>{theme === 'light' ? '切换夜晚模式' : '切换白天模式'}</button>
        </nav>
      )}
    </header>
  );
}

function HomePage({ navigate, openArticle }: { navigate: (page: Page) => void; openArticle: (article: Article) => void }) {
  return (
    <>
      <section className="hero-section reveal">
        <div className="hero-copy">
          <p className="eyebrow">CS 学习笔记与工程成长记录</p>
          <h1>
            你好，我是 <span>CodeExplorer</span>
          </h1>
          <p className="hero-description">
            这里沉淀计算机网络、操作系统、算法、数据库和后端工程实践，把零散学习变成可复用的技术资产。
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => navigate('articles')}>
              浏览文章
            </button>
            <button className="secondary-button" onClick={() => navigate('about')}>
              关于我
            </button>
          </div>
        </div>
        <HeroVisual />
      </section>

      <section className="content-section reveal delay-1">
        <SectionHeading title="最新文章" action="查看全部" onClick={() => navigate('articles')} />
        <div className="article-grid">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} openArticle={openArticle} />
          ))}
        </div>
      </section>

      <section className="content-section reveal delay-2">
        <SectionHeading title="分类浏览" action="查看分类" onClick={() => navigate('categories')} />
        <div className="category-grid">
          {categories.map((category) => (
            <CategoryCard key={category.name} category={category} />
          ))}
        </div>
      </section>

      <section className="content-section reveal delay-3">
        <SectionHeading title="热门标签" action="查看标签" onClick={() => navigate('tags')} />
        <TagCloud tags={tags} />
      </section>

      <section className="content-section reveal delay-4">
        <SectionHeading title="真实项目" action="查看项目" onClick={() => navigate('projects')} />
        <ProjectShowcase compact />
      </section>

      <section className="learning-banner reveal delay-4">
        <div className="rocket-badge">
          <Rocket size={42} />
        </div>
        <div>
          <h2>持续学习，持续探索</h2>
          <p>记录关键问题，复盘工程实践，让每一次踩坑都变成下一次提效的依据。</p>
        </div>
        <button className="primary-button" onClick={() => navigate('projects')}>
          查看项目
        </button>
      </section>
    </>
  );
}

function ArticlesPage({
  articles,
  openArticle,
  query,
  setQuery,
}: {
  articles: Article[];
  openArticle: (article: Article) => void;
  query: string;
  setQuery: (value: string) => void;
}) {
  return (
    <section className="page-layout reveal">
      <div className="main-column">
        <Breadcrumb current="文章" />
        <div className="page-title-row">
          <h1>文章</h1>
          <label className="page-search">
            <Search size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索文章..." />
          </label>
        </div>
        <div className="tabs">
          <button className="active">最新</button>
          <button>热门</button>
          <button>推荐</button>
        </div>
        <div className="article-list">
          {articles.map((article) => (
            <button className="article-row" key={article.id} onClick={() => openArticle(article)}>
              <Diagram type={article.theme} compact />
              <div>
                <h2>{article.title}</h2>
                <p>{article.description}</p>
                <div className="meta-line">
                  <span>{article.date}</span>
                  <span>{article.views} 阅读</span>
                  <span>{article.category}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="pagination">
          {[1, 2, 3, 4, 5].map((number) => (
            <button key={number} className={number === 1 ? 'active' : ''}>
              {number}
            </button>
          ))}
          <button aria-label="下一页">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <ArticleSidebar />
    </section>
  );
}

function ArticlePage({ article, openArticle }: { article: Article; openArticle: (article: Article) => void }) {
  return (
    <section className="page-layout reveal">
      <article className="article-detail">
        <Breadcrumb current={article.title} parent="文章" />
        <h1>{article.title}</h1>
        <div className="article-meta">
          <span>
            <CalendarDays size={15} /> {article.date}
          </span>
          <span>{article.category}</span>
          <span>{article.views} 阅读</span>
        </div>
        <div className="summary-box">
          <strong>摘要：</strong>本文通过报文流和状态转换图解释核心 CS 概念，并补充面试中容易追问的细节。
        </div>
        <h2 id="three-way">三次握手</h2>
        <p>TCP 通过 SYN、SYN-ACK、ACK 建立可靠连接，客户端与服务端在传输数据前完成初始序列号同步。</p>
        <Diagram type="network" />
        <ol>
          <li>客户端发送 SYN，进入 SYN_SENT 状态。</li>
          <li>服务端回复 SYN-ACK，进入 SYN_RCVD 状态。</li>
          <li>客户端发送 ACK，双方进入 ESTABLISHED 状态。</li>
        </ol>
        <h2 id="four-way">四次挥手</h2>
        <p>连接释放需要分别关闭两个方向的数据流，因此正常路径下 FIN 与 ACK 会拆成四次报文交互。</p>
        <pre>
          <code>{`client.close()
send FIN
wait ACK
receive FIN
send ACK`}</code>
        </pre>
        <h2 id="questions">常见问题</h2>
        <p>重点关注 TIME_WAIT 归属、重复报文处理，以及为什么两次报文足以确认但不足以安全建立连接。</p>
      </article>
      <aside className="side-panel">
        <div className="panel-card">
          <h3>目录</h3>
          <a href="#three-way">三次握手</a>
          <a href="#four-way">四次挥手</a>
          <a href="#questions">常见问题</a>
        </div>
        <div className="panel-card">
          <h3>相关文章</h3>
          {articles
            .filter((item) => item.id !== article.id)
            .slice(0, 3)
            .map((item) => (
              <button key={item.id} className="related-link" onClick={() => openArticle(item)}>
                {item.title}
                <span>{item.date}</span>
              </button>
            ))}
        </div>
      </aside>
    </section>
  );
}

function CategoriesPage() {
  return (
    <section className="simple-page reveal">
      <Breadcrumb current="分类" />
      <h1>分类</h1>
      <div className="category-grid wide">
        {categories.map((category) => (
          <CategoryCard key={category.name} category={category} />
        ))}
      </div>
    </section>
  );
}

function TagsPage() {
  return (
    <section className="simple-page reveal">
      <Breadcrumb current="标签" />
      <h1>标签</h1>
      <div className="tag-panel">
        <TagCloud tags={tags} />
      </div>
    </section>
  );
}

function ProjectsPage() {
  const [activeProject, setActiveProject] = useState<Project>(projects[0]);

  return (
    <section className="simple-page reveal">
      <Breadcrumb current="项目" />
      <div className="project-hero">
        <div>
          <p className="eyebrow">GitHub 真实项目沉淀</p>
          <h1>项目</h1>
          <p>这里展示当前公开仓库中最能体现后端工程能力的两个项目：一个聚焦实时通讯链路，一个覆盖微服务电商全链路。</p>
        </div>
        <a className="github-link" href="https://github.com/USERON8" target="_blank" rel="noreferrer">
          <Github size={18} />
          访问 GitHub
          <ExternalLink size={15} />
        </a>
      </div>
      <div className="project-grid rich">
        {projects.map((project) => (
          <button
            className={`project-card ${activeProject.name === project.name ? 'active' : ''} ${project.color}`}
            key={project.name}
            onClick={() => setActiveProject(project)}
          >
            <ProjectIcon project={project} />
            <span className="project-role">{project.role}</span>
            <h2>{project.name}</h2>
            <p>{project.summary}</p>
            <ProjectStats project={project} />
          </button>
        ))}
      </div>
      <ProjectDetail project={activeProject} />
    </section>
  );
}

function AboutPage({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <section className="about-layout reveal">
      <Breadcrumb current="关于我" />
      <div className="profile-card">
        <div className="profile-avatar">CE</div>
        <h1>CodeExplorer</h1>
        <p>CS 学习者 / 后端开发者</p>
        <div className="profile-links">
          <Github size={18} />
          <Mail size={18} />
          <BookOpen size={18} />
        </div>
      </div>
      <div className="about-content">
        <h2>个人介绍</h2>
        <p>本站用于记录 CS 基础、后端工程实践和项目复盘。当前重点项目包括 GinChat 实时通讯服务与 Cloud Shop 微服务电商系统。</p>
        <h2>技术栈</h2>
        <TagCloud tags={['Go', 'Gin', 'Java', 'Spring Cloud Alibaba', 'Dubbo', 'RocketMQ', 'Redis', 'MySQL', 'Elasticsearch', 'UniApp']} />
        <button className="primary-button" onClick={() => navigate('projects')}>
          查看项目
        </button>
      </div>
    </section>
  );
}

function Footer({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <footer className="site-footer">
      <div>
        <button className="brand footer-brand" onClick={() => navigate('home')}>
          <span className="brand-mark">
            <Code2 size={17} />
          </span>
          <span>CodeExplorer</span>
        </button>
        <p>CS 学习笔记、技术文章和项目记录。</p>
        <div className="social-row">
          <Github size={18} />
          <Mail size={18} />
          <BookOpen size={18} />
        </div>
      </div>
      <div className="footer-columns">
        <div>
          <h3>导航</h3>
          <button onClick={() => navigate('home')}>首页</button>
          <button onClick={() => navigate('articles')}>文章</button>
          <button onClick={() => navigate('projects')}>项目</button>
          <button onClick={() => navigate('about')}>关于我</button>
        </div>
        <div>
          <h3>分类</h3>
          <span>计算机网络</span>
          <span>操作系统</span>
          <span>数据结构</span>
          <span>编程语言</span>
        </div>
        <div>
          <h3>联系</h3>
          <span>hello@codeexplorer.com</span>
          <span>已适配 GitHub Pages</span>
        </div>
      </div>
    </footer>
  );
}

function SectionHeading({ title, action, onClick }: { title: string; action: string; onClick: () => void }) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      <button onClick={onClick}>
        {action}
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

function ProjectShowcase({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`project-showcase ${compact ? 'compact' : ''}`}>
      {projects.map((project) => (
        <article className={`project-feature ${project.color}`} key={project.name}>
          <div className="project-feature-head">
            <ProjectIcon project={project} />
            <div>
              <span>{project.role}</span>
              <h3>{project.name}</h3>
            </div>
          </div>
          <p>{project.summary}</p>
          <ProjectStats project={project} />
          <div className="mini-stack">
            {project.stack.slice(0, compact ? 5 : 8).map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <a href={project.url} target="_blank" rel="noreferrer">
            查看仓库
            <ExternalLink size={14} />
          </a>
        </article>
      ))}
    </div>
  );
}

function ProjectDetail({ project }: { project: Project }) {
  return (
    <article className="project-detail">
      <div className="project-detail-main">
        <div className="project-detail-title">
          <ProjectIcon project={project} />
          <div>
            <span>{project.repo}</span>
            <h2>{project.name}</h2>
          </div>
        </div>
        <p>{project.summary}</p>
        <div className="detail-block">
          <h3>技术栈</h3>
          <div className="mini-stack">
            {project.stack.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
        <div className="detail-block">
          <h3>能力覆盖</h3>
          <div className="highlight-grid">
            {project.highlights.map((item) => (
              <span key={item}>
                <ShieldCheck size={15} />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
      <aside className="project-detail-side">
        <ProjectStats project={project} stacked />
        <div className="module-list">
          <h3>模块结构</h3>
          {project.modules.map((module) => (
            <span key={module}>{module}</span>
          ))}
        </div>
        <a className="primary-button repo-button" href={project.url} target="_blank" rel="noreferrer">
          打开仓库
          <ExternalLink size={15} />
        </a>
      </aside>
    </article>
  );
}

function ProjectStats({ project, stacked = false }: { project: Project; stacked?: boolean }) {
  return (
    <div className={`project-stats ${stacked ? 'stacked' : ''}`}>
      <span>
        <Star size={14} />
        {project.stars} Star
      </span>
      <span>
        <GitFork size={14} />
        {project.forks} Fork
      </span>
      <span>
        <Workflow size={14} />
        {project.commits} Commits
      </span>
      {project.issues && <span>{project.issues} Issues</span>}
      <span>{project.license}</span>
    </div>
  );
}

function ProjectIcon({ project }: { project: Project }) {
  return (
    <div className={`project-icon ${project.color}`}>
      {project.color === 'green' ? <Terminal size={23} /> : <Server size={23} />}
    </div>
  );
}

function ArticleCard({ article, openArticle }: { article: Article; openArticle: (article: Article) => void }) {
  return (
    <button className="article-card" onClick={() => openArticle(article)}>
      <Diagram type={article.theme} compact />
      <div className="card-body">
        <span className="category-badge">{article.category}</span>
        <h3>{article.title}</h3>
        <p>{article.description}</p>
        <div className="meta-line">
          <span>{article.date}</span>
          <span>{article.views} 阅读</span>
        </div>
      </div>
    </button>
  );
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <article className="category-card">
      <div className="category-icon">{category.icon}</div>
      <div>
        <h3>{category.name}</h3>
        <p>{category.count} 篇文章</p>
      </div>
    </article>
  );
}

function TagCloud({ tags }: { tags: string[] }) {
  return (
    <div className="tag-cloud">
      {tags.map((tag) => (
        <button key={tag}>{tag}</button>
      ))}
    </div>
  );
}

function Breadcrumb({ current, parent }: { current: string; parent?: string }) {
  return (
    <div className="breadcrumb">
      <span>首页</span>
      {parent && <span>{parent}</span>}
      <strong>{current}</strong>
    </div>
  );
}

function ArticleSidebar() {
  return (
    <aside className="side-panel">
      <div className="panel-card">
        <h3>分类</h3>
        {categories.map((category) => (
          <button className="side-row" key={category.name}>
            <span>{category.name}</span>
            <strong>{category.count}</strong>
          </button>
        ))}
      </div>
      <div className="panel-card">
        <h3>标签云</h3>
        <TagCloud tags={tags.slice(0, 10)} />
      </div>
    </aside>
  );
}

function HeroVisual() {
  return (
    <div className="hero-visual" aria-label="开发者工作台插画">
      <div className="monitor">
        <div className="window-dots">
          <span />
          <span />
          <span />
        </div>
        <div className="code-lines">
          <i />
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="laptop">
        <Code2 size={48} />
      </div>
      <div className="plant">
        <span />
        <span />
        <span />
      </div>
      <div className="floating-card card-a">
        <ShieldCheck size={20} />
      </div>
      <div className="floating-card card-b">
        <FileText size={20} />
      </div>
    </div>
  );
}

function Diagram({ type, compact = false }: { type: Article['theme']; compact?: boolean }) {
  if (type === 'network') {
    return (
      <div className={`diagram network-diagram ${compact ? 'compact' : ''}`}>
        <div className="node left">客户端</div>
        <div className="node right">服务端</div>
        <span className="line l1">SYN</span>
        <span className="line l2">SYN + ACK</span>
        <span className="line l3">ACK</span>
      </div>
    );
  }

  if (type === 'algorithm') {
    return (
      <div className={`diagram tree-diagram ${compact ? 'compact' : ''}`}>
        <span className="tree-node root">根</span>
        <span className="tree-node n1">左</span>
        <span className="tree-node n2">右</span>
        <span className="tree-node n3">叶</span>
        <span className="tree-node n4">叶</span>
      </div>
    );
  }

  if (type === 'memory') {
    return (
      <div className={`diagram memory-diagram ${compact ? 'compact' : ''}`}>
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <span key={item}>页 {item}</span>
        ))}
      </div>
    );
  }

  return (
    <div className={`diagram code-diagram ${compact ? 'compact' : ''}`}>
      <span>const note = &#123;</span>
      <span> topic: "closure",</span>
      <span> scope: "lexical"</span>
      <span>&#125;;</span>
    </div>
  );
}

export default App;
