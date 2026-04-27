import {
  BookOpen,
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
type ArticleTheme = 'network' | 'algorithm' | 'memory' | 'code';

type Article = {
  id: string;
  title: string;
  project: 'GinChat' | 'Cloud Shop';
  category: string;
  date: string;
  views: string;
  description: string;
  tags: string[];
  theme: ArticleTheme;
  sections: { id: string; title: string; body: string }[];
  code?: string;
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
    id: 'ginchat-architecture',
    title: 'GinChat 单体 IM 服务架构拆解',
    project: 'GinChat',
    category: '实时通讯',
    date: '2026-04-24',
    views: '1.2k',
    description: '围绕 Gin、GORM、PostgreSQL、Redis 与 WebSocket，梳理 GinChat 的模块边界和请求链路。',
    tags: ['GinChat', 'Go', 'Gin', 'GORM', 'PostgreSQL', 'WebSocket'],
    theme: 'code',
    sections: [
      {
        id: 'boundary',
        title: '模块边界',
        body: 'GinChat 按 handler、model、ws、middleware、pkg、router 拆分职责。handler 负责 HTTP 入口，ws 负责连接管理和消息转发，pkg 封装配置、数据库、JWT、日志、Redis 与统一响应。',
      },
      {
        id: 'data',
        title: '数据与缓存',
        body: '项目使用 PostgreSQL + GORM 管理用户、好友、群组和消息数据；Redis 承担用户缓存、在线状态、消息去重和 refresh token 存储。',
      },
      {
        id: 'value',
        title: '项目价值',
        body: '这个项目适合展示 Go Web 后端、实时通讯、Redis 状态管理和基础 IM 业务建模能力。',
      },
    ],
    code: `router.GET("/api/ws", handler.WebSocket)
manager.Register(client)
client.ReadPump()
client.WritePump()`,
  },
  {
    id: 'ginchat-websocket-flow',
    title: 'GinChat WebSocket 消息链路与 Worker Pool',
    project: 'GinChat',
    category: '实时通讯',
    date: '2026-04-23',
    views: '980',
    description: '从连接、ReadPump、消息去重、异步写库到在线转发，复盘 GinChat 的实时消息流。',
    tags: ['GinChat', 'WebSocket', 'Redis', 'Worker Pool', '消息去重'],
    theme: 'network',
    sections: [
      {
        id: 'connect',
        title: '连接建立',
        body: '客户端通过 ws://localhost:8080/api/ws?token=<access_token> 建立连接，服务端校验 token 后把连接注册到在线用户管理器。',
      },
      {
        id: 'dispatch',
        title: '消息分发',
        body: 'ReadPump 接收 JSON 消息后先用 Redis SETNX 做 60 秒内的 msgId 去重，再交给 Worker Pool 异步写库，最后由 Manager 找到目标在线连接并通过 WritePump 推送。',
      },
      {
        id: 'offline',
        title: '离线处理',
        body: '目标用户不在线时消息仍然落库，用户上线后通过历史消息接口按游标分页拉取，避免实时通道和历史补偿耦合。',
      },
    ],
  },
  {
    id: 'ginchat-auth-cache',
    title: 'GinChat JWT 认证、Refresh Token 与 Redis 状态管理',
    project: 'GinChat',
    category: '认证与缓存',
    date: '2026-04-22',
    views: '856',
    description: '整理 GinChat 中 access token、refresh token、用户缓存和在线状态的职责划分。',
    tags: ['GinChat', 'JWT', 'Redis', 'Token', '限流'],
    theme: 'memory',
    sections: [
      {
        id: 'token',
        title: 'Token 分工',
        body: 'access token 用于接口鉴权，refresh token 用于续期。需要登录的 HTTP 接口通过 Authorization Bearer 传递 token，WebSocket 连接通过 URL 参数传递 token。',
      },
      {
        id: 'redis',
        title: 'Redis 状态',
        body: 'Redis 在项目中承担用户信息缓存、在线状态、消息去重和 refresh token 存储。状态类数据放 Redis，核心业务数据落 PostgreSQL。',
      },
      {
        id: 'limit',
        title: '请求保护',
        body: 'middleware 中提供 IP 限流能力，配合 JWT 鉴权和统一响应结构，让接口入口保持一致的错误处理方式。',
      },
    ],
  },
  {
    id: 'cloud-architecture',
    title: 'Cloud Shop 微服务电商系统架构总览',
    project: 'Cloud Shop',
    category: '微服务架构',
    date: '2026-04-21',
    views: '1.5k',
    description: '基于 Cloud Shop v1.1.0，梳理 gateway、业务服务、Dubbo RPC、RocketMQ、Redis、Elasticsearch 与 UniApp 的整体协作。',
    tags: ['Cloud Shop', 'Spring Boot', 'Spring Cloud Alibaba', 'Dubbo', 'UniApp'],
    theme: 'algorithm',
    sections: [
      {
        id: 'entry',
        title: '系统入口',
        body: 'gateway 是唯一公网后端入口，负责校验公网 JWT，并向下游注入内部身份 Header。本地 Docker 环境通过 Nginx 暴露平台入口。',
      },
      {
        id: 'services',
        title: '服务拆分',
        body: '系统包含 auth、user、product、stock、order、payment、search、governance 等服务，并通过 common-parent 统一公共依赖与约束。',
      },
      {
        id: 'frontend',
        title: '前端承载',
        body: 'my-shop-uniapp 承载商城前端，后端通过 gateway 对外提供统一 API，内部服务之间使用 Dubbo 和消息队列解耦。',
      },
    ],
  },
  {
    id: 'cloud-outbox-rocketmq',
    title: 'Cloud Shop 的 Outbox 与 RocketMQ 最终一致性',
    project: 'Cloud Shop',
    category: '消息与一致性',
    date: '2026-04-20',
    views: '1.3k',
    description: '说明 Cloud Shop 如何用本地事务、outbox_event、RocketMQ 投递和幂等消费替代强一致分布式事务。',
    tags: ['Cloud Shop', 'RocketMQ', 'Outbox', '最终一致性', '幂等消费'],
    theme: 'network',
    sections: [
      {
        id: 'model',
        title: '一致性模型',
        body: '跨服务写入使用 Local Transaction + Outbox + RocketMQ + 幂等消费。业务数据和 outbox_event 在同一个本地事务内提交，relay 再负责可靠投递。',
      },
      {
        id: 'consumer',
        title: '消费侧幂等',
        body: '消费者必须按业务唯一键或消息事件 ID 做幂等，避免 RocketMQ 重试带来的重复扣减、重复更新或重复通知。',
      },
      {
        id: 'tradeoff',
        title: '工程取舍',
        body: '这套方案牺牲瞬时强一致，换取微服务拆分后的可恢复性、可观测性和较低运行复杂度。',
      },
    ],
  },
  {
    id: 'cloud-gateway-security',
    title: 'Cloud Shop Gateway、JWT 与内部 HMAC 信任链',
    project: 'Cloud Shop',
    category: '认证与安全',
    date: '2026-04-19',
    views: '1.1k',
    description: '拆解公网 JWT 校验、内部身份 Header 注入、下游 HMAC 校验和服务间信任边界。',
    tags: ['Cloud Shop', 'Gateway', 'JWT', 'HMAC', '安全'],
    theme: 'code',
    sections: [
      {
        id: 'public',
        title: '公网入口',
        body: '公网请求只进入 gateway。gateway 校验 JWT 后生成内部身份 Header，下游服务以这些 Header 作为内部身份来源。',
      },
      {
        id: 'internal',
        title: '内部调用',
        body: '内部微服务之间校验 HMAC 签名，降低伪造内部 Header 的风险。Bearer Token 请求可绕过该校验，适合兼容特定入口。',
      },
      {
        id: 'boundary',
        title: '安全边界',
        body: '核心边界在 gateway 与内部服务之间，外部身份和内部身份需要明确分层，避免下游服务重复解析公网认证逻辑。',
      },
    ],
  },
  {
    id: 'cloud-cache-strategy',
    title: 'Cloud Shop Redis Cache-Aside 与延迟双删',
    project: 'Cloud Shop',
    category: '缓存设计',
    date: '2026-04-18',
    views: '920',
    description: '整理商品、库存、支付等场景下 Redis 缓存的职责边界，以及 payment-service 的缓存限制。',
    tags: ['Cloud Shop', 'Redis', 'Cache-Aside', '延迟双删', '缓存雪崩'],
    theme: 'memory',
    sections: [
      {
        id: 'aside',
        title: 'Cache-Aside',
        body: '读取时先查缓存，未命中再查数据库并回填；写入时先更新数据库，再删除缓存，必要时通过延迟双删降低并发脏读概率。',
      },
      {
        id: 'payment',
        title: '支付服务限制',
        body: 'payment-service 的缓存只用于幂等和限流，不缓存金额和终态数据，避免支付终态被缓存污染。',
      },
      {
        id: 'risk',
        title: '高并发风险',
        body: '热点库存行锁、缓存雪崩和 outbox relay 积压是系统重点性能风险，需要结合限流、预热、随机过期和监控处理。',
      },
    ],
  },
  {
    id: 'cloud-search',
    title: 'Cloud Shop Elasticsearch 商品与店铺搜索',
    project: 'Cloud Shop',
    category: '搜索系统',
    date: '2026-04-17',
    views: '880',
    description: '说明 search-service 如何承接商品与店铺检索，并和业务服务保持索引同步。',
    tags: ['Cloud Shop', 'Elasticsearch', 'Search Service', '商品搜索'],
    theme: 'algorithm',
    sections: [
      {
        id: 'scope',
        title: '搜索职责',
        body: 'search-service 负责面向用户的商品与店铺检索，把高频查询从 MySQL 事务库中剥离出来。',
      },
      {
        id: 'sync',
        title: '索引同步',
        body: '业务服务变更后通过事件或同步任务更新 Elasticsearch 索引，保证搜索侧具备最终一致的数据视图。',
      },
      {
        id: 'query',
        title: '查询优化',
        body: '搜索接口适合承载关键词、分类、排序和分页能力，后续可扩展高亮、聚合筛选和搜索建议。',
      },
    ],
  },
];

const categoryMeta: Omit<Category, 'count'>[] = [
  { name: '实时通讯', icon: <Network size={24} /> },
  { name: '认证与缓存', icon: <ShieldCheck size={24} /> },
  { name: '微服务架构', icon: <Server size={24} /> },
  { name: '消息与一致性', icon: <Workflow size={24} /> },
  { name: '认证与安全', icon: <Code2 size={24} /> },
  { name: '缓存设计', icon: <Database size={24} /> },
  { name: '搜索系统', icon: <Layers3 size={24} /> },
];

const categories: Category[] = categoryMeta.map((item) => ({
  ...item,
  count: articles.filter((article) => article.category === item.name).length,
}));

const tags = Array.from(new Set(articles.flatMap((article) => article.tags)));

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
    summary: '基于 Spring Boot、Spring Cloud Alibaba、Dubbo、RocketMQ、MySQL、Redis、Elasticsearch 与 UniApp 的微服务电商项目。',
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
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filteredArticles = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesKeyword =
        !keyword ||
        [article.title, article.project, article.category, article.description, ...article.tags].some((item) =>
          item.toLowerCase().includes(keyword),
        );
      const matchesCategory = !activeCategory || article.category === activeCategory;
      const matchesTag = !activeTag || article.tags.includes(activeTag);
      return matchesKeyword && matchesCategory && matchesTag;
    });
  }, [activeCategory, activeTag, query]);

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

  const openArticlesWithFilter = (filter?: { category?: string; tag?: string }) => {
    setQuery('');
    setActiveCategory(filter?.category ?? null);
    setActiveTag(filter?.tag ?? null);
    setPage('articles');
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setQuery('');
    setActiveCategory(null);
    setActiveTag(null);
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
        {page === 'home' && <HomePage navigate={navigate} openArticle={openArticle} openArticlesWithFilter={openArticlesWithFilter} />}
        {page === 'articles' && (
          <ArticlesPage
            articles={filteredArticles}
            openArticle={openArticle}
            query={query}
            setQuery={setQuery}
            activeCategory={activeCategory}
            activeTag={activeTag}
            clearFilters={clearFilters}
            openArticlesWithFilter={openArticlesWithFilter}
          />
        )}
        {page === 'article' && <ArticlePage article={selectedArticle} openArticle={openArticle} />}
        {page === 'categories' && <CategoriesPage openArticlesWithFilter={openArticlesWithFilter} />}
        {page === 'tags' && <TagsPage openArticlesWithFilter={openArticlesWithFilter} />}
        {page === 'projects' && <ProjectsPage />}
        {page === 'about' && <AboutPage navigate={navigate} />}
      </main>
      <Footer navigate={navigate} openArticlesWithFilter={openArticlesWithFilter} />
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

function HomePage({
  navigate,
  openArticle,
  openArticlesWithFilter,
}: {
  navigate: (page: Page) => void;
  openArticle: (article: Article) => void;
  openArticlesWithFilter: (filter?: { category?: string; tag?: string }) => void;
}) {
  return (
    <>
      <section className="hero-section reveal">
        <div className="hero-copy">
          <p className="eyebrow">围绕真实项目沉淀后端工程能力</p>
          <h1>
            你好，我是 <span>CodeExplorer</span>
          </h1>
          <p className="hero-description">
            这里聚焦 GinChat 实时通讯服务与 Cloud Shop 微服务电商系统，记录架构设计、消息链路、缓存一致性、安全认证和搜索系统实践。
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => navigate('articles')}>
              浏览文章
            </button>
            <button className="secondary-button" onClick={() => navigate('projects')}>
              查看项目
            </button>
          </div>
        </div>
        <HeroVisual />
      </section>

      <section className="content-section reveal delay-1">
        <SectionHeading title="项目文章" action="查看全部" onClick={() => navigate('articles')} />
        <div className="article-grid">
          {articles.slice(0, 4).map((article) => (
            <ArticleCard key={article.id} article={article} openArticle={openArticle} />
          ))}
        </div>
      </section>

      <section className="content-section reveal delay-2">
        <SectionHeading title="分类浏览" action="查看分类" onClick={() => navigate('categories')} />
        <div className="category-grid">
          {categories.map((category) => (
            <CategoryCard key={category.name} category={category} onSelect={() => openArticlesWithFilter({ category: category.name })} />
          ))}
        </div>
      </section>

      <section className="content-section reveal delay-3">
        <SectionHeading title="技术标签" action="查看标签" onClick={() => navigate('tags')} />
        <TagCloud tags={tags} onSelect={(tag) => openArticlesWithFilter({ tag })} />
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
          <h2>从项目复盘到技术文章</h2>
          <p>每篇文章都对应真实仓库中的模块、链路或工程取舍，后续可以继续补充压测、部署和源码解析。</p>
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
  activeCategory,
  activeTag,
  clearFilters,
  openArticlesWithFilter,
}: {
  articles: Article[];
  openArticle: (article: Article) => void;
  query: string;
  setQuery: (value: string) => void;
  activeCategory: string | null;
  activeTag: string | null;
  clearFilters: () => void;
  openArticlesWithFilter: (filter?: { category?: string; tag?: string }) => void;
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
          <button className="active">项目复盘</button>
          <button onClick={() => openArticlesWithFilter({ tag: 'GinChat' })}>GinChat</button>
          <button onClick={() => openArticlesWithFilter({ tag: 'Cloud Shop' })}>Cloud Shop</button>
        </div>
        {(activeCategory || activeTag || query) && (
          <div className="filter-bar">
            {activeCategory && <span>分类：{activeCategory}</span>}
            {activeTag && <span>标签：{activeTag}</span>}
            {query && <span>搜索：{query}</span>}
            <button onClick={clearFilters}>清除筛选</button>
          </div>
        )}
        <div className="article-list">
          {articles.map((article) => (
            <button className="article-row" key={article.id} onClick={() => openArticle(article)}>
              <Diagram type={article.theme} compact />
              <div>
                <span className="category-badge">{article.project}</span>
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
          {articles.length === 0 && <div className="empty-state">没有匹配的文章，请调整分类、标签或搜索关键词。</div>}
        </div>
      </div>
      <ArticleSidebar openArticlesWithFilter={openArticlesWithFilter} />
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
          <span>{article.project}</span>
          <span>{article.category}</span>
          <span>{article.views} 阅读</span>
        </div>
        <div className="summary-box">
          <strong>摘要：</strong>
          {article.description}
        </div>
        {article.sections.map((section) => (
          <section key={section.id}>
            <h2 id={section.id}>{section.title}</h2>
            <p>{section.body}</p>
          </section>
        ))}
        <Diagram type={article.theme} />
        {article.code && (
          <pre>
            <code>{article.code}</code>
          </pre>
        )}
      </article>
      <aside className="side-panel">
        <div className="panel-card">
          <h3>目录</h3>
          {article.sections.map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.title}
            </a>
          ))}
        </div>
        <div className="panel-card">
          <h3>相关文章</h3>
          {articles
            .filter((item) => item.id !== article.id && item.project === article.project)
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

function CategoriesPage({ openArticlesWithFilter }: { openArticlesWithFilter: (filter?: { category?: string; tag?: string }) => void }) {
  return (
    <section className="simple-page reveal">
      <Breadcrumb current="分类" />
      <h1>分类</h1>
      <div className="category-grid wide">
        {categories.map((category) => (
          <CategoryCard key={category.name} category={category} onSelect={() => openArticlesWithFilter({ category: category.name })} />
        ))}
      </div>
    </section>
  );
}

function TagsPage({ openArticlesWithFilter }: { openArticlesWithFilter: (filter?: { category?: string; tag?: string }) => void }) {
  return (
    <section className="simple-page reveal">
      <Breadcrumb current="标签" />
      <h1>标签</h1>
      <div className="tag-panel">
        <TagCloud tags={tags} onSelect={(tag) => openArticlesWithFilter({ tag })} />
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
        <p>后端工程学习者 / 项目复盘记录者</p>
        <div className="profile-links">
          <Github size={18} />
          <Mail size={18} />
          <BookOpen size={18} />
        </div>
      </div>
      <div className="about-content">
        <h2>个人介绍</h2>
        <p>本站用于记录 GinChat 与 Cloud Shop 两个真实项目中的架构设计、技术链路、问题复盘和后续优化计划。</p>
        <h2>技术栈</h2>
        <TagCloud tags={['Go', 'Gin', 'WebSocket', 'Spring Cloud Alibaba', 'Dubbo', 'RocketMQ', 'Redis', 'MySQL', 'Elasticsearch', 'UniApp']} />
        <button className="primary-button" onClick={() => navigate('projects')}>
          查看项目
        </button>
      </div>
    </section>
  );
}

function Footer({
  navigate,
  openArticlesWithFilter,
}: {
  navigate: (page: Page) => void;
  openArticlesWithFilter: (filter?: { category?: string; tag?: string }) => void;
}) {
  return (
    <footer className="site-footer">
      <div>
        <button className="brand footer-brand" onClick={() => navigate('home')}>
          <span className="brand-mark">
            <Code2 size={17} />
          </span>
          <span>CodeExplorer</span>
        </button>
        <p>围绕真实项目的技术文章、工程复盘和项目记录。</p>
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
          {categories.slice(0, 4).map((category) => (
            <button key={category.name} onClick={() => openArticlesWithFilter({ category: category.name })}>
              {category.name}
            </button>
          ))}
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
        <span className="category-badge">{article.project}</span>
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

function CategoryCard({ category, onSelect }: { category: Category; onSelect: () => void }) {
  return (
    <button className="category-card" onClick={onSelect}>
      <div className="category-icon">{category.icon}</div>
      <div>
        <h3>{category.name}</h3>
        <p>{category.count} 篇文章</p>
      </div>
    </button>
  );
}

function TagCloud({ tags, onSelect }: { tags: string[]; onSelect?: (tag: string) => void }) {
  return (
    <div className="tag-cloud">
      {tags.map((tag) => (
        <button key={tag} onClick={() => onSelect?.(tag)}>
          {tag}
        </button>
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

function ArticleSidebar({ openArticlesWithFilter }: { openArticlesWithFilter: (filter?: { category?: string; tag?: string }) => void }) {
  return (
    <aside className="side-panel">
      <div className="panel-card">
        <h3>分类</h3>
        {categories.map((category) => (
          <button className="side-row" key={category.name} onClick={() => openArticlesWithFilter({ category: category.name })}>
            <span>{category.name}</span>
            <strong>{category.count}</strong>
          </button>
        ))}
      </div>
      <div className="panel-card">
        <h3>标签云</h3>
        <TagCloud tags={tags.slice(0, 14)} onSelect={(tag) => openArticlesWithFilter({ tag })} />
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

function Diagram({ type, compact = false }: { type: ArticleTheme; compact?: boolean }) {
  if (type === 'network') {
    return (
      <div className={`diagram network-diagram ${compact ? 'compact' : ''}`}>
        <div className="node left">生产者</div>
        <div className="node right">消费者</div>
        <span className="line l1">写入事件</span>
        <span className="line l2">投递消息</span>
        <span className="line l3">幂等消费</span>
      </div>
    );
  }

  if (type === 'algorithm') {
    return (
      <div className={`diagram tree-diagram ${compact ? 'compact' : ''}`}>
        <span className="tree-node root">网关</span>
        <span className="tree-node n1">服务</span>
        <span className="tree-node n2">消息</span>
        <span className="tree-node n3">缓存</span>
        <span className="tree-node n4">搜索</span>
      </div>
    );
  }

  if (type === 'memory') {
    return (
      <div className={`diagram memory-diagram ${compact ? 'compact' : ''}`}>
        {['Token', '用户缓存', '在线状态', '幂等键', '限流键', '延迟删除'].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    );
  }

  return (
    <div className={`diagram code-diagram ${compact ? 'compact' : ''}`}>
      <span>project := realRepo</span>
      <span>article := architectureNote</span>
      <span>tags := techStack</span>
      <span>publish(article)</span>
    </div>
  );
}

export default App;
