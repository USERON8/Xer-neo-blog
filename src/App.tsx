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
  project: string;
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
  url?: string;
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
  color: 'blue' | 'green' | 'purple' | 'orange';
};

const articles: Article[] = [
  {
    id: 'ginchat-architecture',
    title: 'GinChat 架构笔记：从 HTTP 到 WebSocket',
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
    title: 'GinChat 实时链路：WebSocket、去重与异步写库',
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
    title: 'GinChat 会话体系：JWT、Refresh Token 与 Redis 状态',
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
    title: 'Cloud Shop 架构全景：网关、服务与前端入口',
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
    title: 'Cloud Shop 一致性方案：Outbox、RocketMQ 与幂等消费',
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
    title: 'Cloud Shop 安全边界：Gateway、JWT 与 HMAC 信任链',
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
    title: 'Cloud Shop 缓存策略：Cache-Aside 与延迟双删',
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
    title: 'Cloud Shop 搜索体系：Elasticsearch、热词与索引同步',
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
  {
    id: 'cloud-service-boundary',
    title: 'Cloud Shop 服务边界：路由归属与职责拆分',
    project: 'Cloud Shop',
    category: '服务边界',
    date: '2026-04-16',
    views: '1.2k',
    description: '基于 backend-api、backend-runtime 与各服务 README，整理 gateway 到各领域服务的路由归属和职责边界。',
    tags: ['Cloud Shop', 'Gateway', '服务边界', '路由归属', 'Dubbo'],
    theme: 'algorithm',
    sections: [
      {
        id: 'gateway-owner',
        title: '公网入口',
        body: 'Cloud Shop 明确要求公网 HTTP 流量只进入 gateway。gateway 负责 JWT 校验、内部身份 Header 注入、HMAC 转发、限流和降级兜底。',
      },
      {
        id: 'route-map',
        title: '路由归属',
        body: '/auth 与 /oauth2 归属 auth-service；用户、地址、商家和管理员基础域归属 user-service；商品、分类、SPU、SKU 归属 product-service；订单、购物车和售后归属 order-service；支付、退款、checkout 和回调归属 payment-service；搜索与店铺发现归属 search-service；治理类后台入口归属 governance-service。',
      },
      {
        id: 'boundary-rule',
        title: '边界规则',
        body: '内部业务调用优先使用 Dubbo RPC。控制器不写 try-catch，异常由 common-web、common-security 和服务兜底切面统一处理。',
      },
    ],
  },
  {
    id: 'cloud-frontend-api-chain',
    title: 'Cloud Shop 前端链路：UniApp API、会话与支付跳转',
    project: 'Cloud Shop',
    category: '前端接口',
    date: '2026-04-15',
    views: '960',
    description: '根据 frontend-api 梳理 UniApp 的登录、购物车、下单、支付、后台治理和上传链路。',
    tags: ['Cloud Shop', 'UniApp', 'Frontend API', '购物车', '支付链路'],
    theme: 'code',
    sections: [
      {
        id: 'session',
        title: '会话规则',
        body: 'src/api/http.ts 会在存在会话时自动附加 bearer token。前端身份来自 src/auth/session.ts 解析 JWT claims，角色归一为 USER、MERCHANT 或 ADMIN，最终授权仍以后端为准。',
      },
      {
        id: 'checkout',
        title: '购物车下单',
        body: '前端通过 /api/users/me/cart 读取或更新远程购物车，创建订单时使用服务端返回的 cartId，并同时携带 Idempotency-Key 与 clientOrderId。',
      },
      {
        id: 'payment',
        title: '支付链路',
        body: '支付流程是创建 payment order、创建 checkout session、打开 session.checkoutPath、轮询支付状态。前端不手写 checkout URL，因为 /api/payment-checkouts/{ticket} 返回的是原始 HTML。',
      },
    ],
  },
  {
    id: 'cloud-order-stock-payment',
    title: 'Cloud Shop 交易链路：订单、库存与支付协作',
    project: 'Cloud Shop',
    category: '交易链路',
    date: '2026-04-14',
    views: '1.4k',
    description: '结合 order-service、stock-service、payment-service 文档，拆解下单、库存预占、支付成功和超时取消。',
    tags: ['Cloud Shop', 'Order Service', 'Stock Service', 'Payment Service', '交易链路'],
    theme: 'network',
    sections: [
      {
        id: 'order',
        title: '订单创建',
        body: 'order-service 拥有购物车快照、订单创建、取消、发货、完成和售后动作。POST /api/orders 要求 Idempotency-Key、clientOrderId 和服务端 cartId。',
      },
      {
        id: 'stock',
        title: '库存协作',
        body: 'stock-service 负责库存预占、确认、释放、恢复和流水查询。热点库存行锁通过 stock_segment 降低争抢，并用 Redis 摘要缓存和 Lua 预检查加速可用库存判断。',
      },
      {
        id: 'payment',
        title: '支付协作',
        body: 'payment-service 负责支付单、checkout session、退款和支付回调。支付成功和退款完成通过 outbox relay 发布事件，订单侧消费后推进状态。',
      },
    ],
  },
  {
    id: 'cloud-product-search-sync',
    title: 'Cloud Shop 商品索引：商品域到搜索域的同步',
    project: 'Cloud Shop',
    category: '搜索系统',
    date: '2026-04-13',
    views: '910',
    description: '从 product-service 和 search-service 的职责出发，说明商品、分类、库存信号如何进入 Elasticsearch 搜索视图。',
    tags: ['Cloud Shop', 'Product Service', 'Search Service', 'Elasticsearch', '索引同步'],
    theme: 'algorithm',
    sections: [
      {
        id: 'product-source',
        title: '商品源头',
        body: 'product-service 拥有 product、SKU、SPU 和 category 数据，是商品与分类形态的事实来源。商品详情热点读取使用 ProductDetailCacheService 的多级缓存路径。',
      },
      {
        id: 'search-read',
        title: '搜索读取',
        body: 'search-service 承接商品搜索、店铺搜索、建议词和推荐接口，搜索文档由 Elasticsearch 承载，热词和热销商品 ID 由 Redis 管理。',
      },
      {
        id: 'freshness',
        title: '索引新鲜度',
        body: '索引新鲜度依赖商品、分类、库存等上游同步信号和定时重建路径。搜索侧以最终一致视图换取查询性能和浏览体验。',
      },
    ],
  },
  {
    id: 'cloud-observability-governance',
    title: 'Cloud Shop 可观测性：SkyWalking、Prometheus 与治理台',
    project: 'Cloud Shop',
    category: '可观测性',
    date: '2026-04-12',
    views: '1.0k',
    description: '基于 observability-stack 与 governance-service，整理 SkyWalking、Prometheus、Grafana、MQ 和 Outbox 治理入口。',
    tags: ['Cloud Shop', 'SkyWalking', 'Prometheus', 'Grafana', 'Governance', 'Outbox'],
    theme: 'memory',
    sections: [
      {
        id: 'stack',
        title: '监控组件',
        body: '本地可观测性包含 SkyWalking OAP/UI、Prometheus、Grafana、Redis Exporter、MySQL Exporter、Nginx Exporter、Elasticsearch Exporter 和 Blackbox Exporter。',
      },
      {
        id: 'watch',
        title: '观测重点',
        body: 'SkyWalking 关注 HTTP、Dubbo 拓扑、Redis/JDBC/MyBatis span 和慢 SQL；Prometheus/Grafana 关注服务 up、吞吐、延迟、Redis/MySQL 负载、Nginx 请求率、Elasticsearch 健康、outbox backlog 与 MQ consumer lag。',
      },
      {
        id: 'governance',
        title: '治理入口',
        body: 'governance-service 统一暴露 /api/admin/mq、/api/admin/outbox、/api/admin/observability、/api/admin/thread-pools、/api/admin/statistics 等后台治理路由。',
      },
    ],
  },
  {
    id: 'cloud-dev-startup-test',
    title: 'Cloud Shop 工程效率：启动脚本、烟测与 k6 压测',
    project: 'Cloud Shop',
    category: '工程效率',
    date: '2026-04-11',
    views: '870',
    description: '整理 dev-startup 与 TEST_SCRIPT_INDEX 中的启动脚本、监控开关、日志路径、契约检查和 k6 压测入口。',
    tags: ['Cloud Shop', 'Dev Startup', 'Smoke Test', 'k6', '契约检查'],
    theme: 'code',
    sections: [
      {
        id: 'startup',
        title: '启动入口',
        body: '推荐使用 scripts/dev/start-platform.* --with-monitoring 一次性启动基础设施、监控和 Java 服务。也可以用 --skip-containers、--skip-services、--services、--dry-run 等参数拆分流程。',
      },
      {
        id: 'logs',
        title: '日志位置',
        body: '进程 stdout/stderr 写入 .tmp/service-runtime/<service>/，服务滚动日志位于 services/<service>/logs/，模块目录不可写时回退到 .tmp/service-runtime/<service>/app-logs/。',
      },
      {
        id: 'tests',
        title: '测试入口',
        body: '契约检查使用 scripts/tools/check-api-contract.*，烟测使用 scripts/ci/smoke-local.*，性能测试使用 tests/perf/k6/run-k6.*。当前 k6 场景包含 gateway-route-only、order-create-only、search-chain、search-singleton-max 等。',
      },
    ],
  },
  {
    id: 'ginchat-api-contract',
    title: 'GinChat 接口设计：用户、好友、群组与消息',
    project: 'GinChat',
    category: '接口设计',
    date: '2026-04-10',
    views: '760',
    description: '根据 GinChat README 梳理注册登录、好友申请、群组管理、历史消息、未读消息和统一响应格式。',
    tags: ['GinChat', 'REST API', '好友关系', '群组管理', '统一响应'],
    theme: 'code',
    sections: [
      {
        id: 'user-api',
        title: '用户接口',
        body: 'GinChat 用户模块提供注册、登录、刷新 token、个人信息查询与修改、密码修改、用户搜索和退出登录。需要登录的接口统一携带 Authorization: Bearer <access_token>。',
      },
      {
        id: 'social-api',
        title: '好友与群组',
        body: '好友模块包含发送申请、同意或拒绝申请、收到的申请列表、好友列表和删除好友。群组模块包含创建群、我的群列表、群详情、成员列表、邀请成员、踢出成员和群聊历史消息。',
      },
      {
        id: 'message-api',
        title: '消息接口',
        body: '消息模块提供私聊历史消息、未读消息数和标记已读。历史消息使用 lastId + size 的游标分页方式，避免大偏移分页在消息表上产生额外压力。',
      },
    ],
  },
  {
    id: 'ginchat-runtime-layout',
    title: 'GinChat 工程结构：分层目录、配置与本地启动',
    project: 'GinChat',
    category: '工程效率',
    date: '2026-04-09',
    views: '690',
    description: '整理 GinChat 的 internal、middleware、pkg、router 分层，以及 PostgreSQL、Redis、Viper、Zap、Docker Compose 的启动路径。',
    tags: ['GinChat', '项目结构', 'Docker Compose', 'Zap', 'Viper'],
    theme: 'memory',
    sections: [
      {
        id: 'layout',
        title: '目录分层',
        body: 'internal/handler 承接路由处理，internal/model 管理数据模型，internal/ws 放置 WebSocket 核心，middleware 负责 JWT、日志和限流，pkg 封装配置、数据库、JWT、日志、Redis 和统一响应。',
      },
      {
        id: 'config',
        title: '配置与依赖',
        body: '项目通过 config/config.example.yaml 生成本地配置，依赖 PostgreSQL 和 Redis。数据库连接池、Redis 连接池、JWT secret 和过期时间都在配置中集中管理。',
      },
      {
        id: 'startup',
        title: '本地启动',
        body: '本地启动路径是 docker-compose up -d 启动 PostgreSQL 与 Redis，然后执行 go run main.go。服务默认运行在 http://localhost:8080。',
      },
    ],
  },
  {
    id: 'rust-blog-backend-architecture',
    title: 'blog-web 架构笔记：Axum、SeaORM 与领域模块',
    project: 'blog-web',
    category: 'Rust 后端',
    date: '2026-04-08',
    views: '820',
    description: '基于 Axum、SeaORM、PostgreSQL 和 Redis，拆解 blog-web 的认证、文章、评论、点赞、关注、通知和搜索模块。',
    tags: ['blog-web', 'Rust', 'Axum', 'SeaORM', 'PostgreSQL', 'Redis'],
    theme: 'algorithm',
    sections: [
      {
        id: 'stack',
        title: '技术栈',
        body: 'blog-web 使用 Rust 2024、Axum、SeaORM、PostgreSQL、Redis 和 Docker Compose，业务接口统一挂载在 /api/v1 下。',
      },
      {
        id: 'domain',
        title: '领域模块',
        body: '项目按 src/domains 拆分认证、用户、文章、评论、点赞、关注、通知、设置、标签和搜索等业务模块，SeaORM entities 承接数据库表映射。',
      },
      {
        id: 'startup',
        title: '启动迁移',
        body: '服务启动时会自动应用 db/*.sql 迁移。开发时先 docker compose up -d 启动依赖，再 cargo run --bin app，最后通过 /health 验证服务状态。',
      },
    ],
  },
  {
    id: 'rust-blog-api-search-cache',
    title: 'blog-web 读路径优化：API、全文搜索与 Redis 缓存',
    project: 'blog-web',
    category: '搜索系统',
    date: '2026-04-07',
    views: '740',
    description: '梳理 blog-web 的公开接口、登录接口、PostgreSQL 全文搜索、Redis 响应缓存和本地种子数据命令。',
    tags: ['blog-web', 'Full Text Search', 'Redis Cache', 'JWT', 'Seeder'],
    theme: 'network',
    sections: [
      {
        id: 'public-api',
        title: '公开接口',
        body: '公开接口包含注册、登录、文章列表、文章详情、评论列表、标签列表、文章搜索、关注者和正在关注列表，适合承载匿名浏览场景。',
      },
      {
        id: 'auth-api',
        title: '登录后接口',
        body: '登录后可以创建文章、评论、点赞、取消点赞、关注、取消关注、读取通知、全部标记已读以及读取和更新个人设置。',
      },
      {
        id: 'search-cache',
        title: '搜索与缓存',
        body: '文章全文搜索由 PostgreSQL full-text search 承载，当前已使用目标 GIN FTS 索引。部分读取端点使用 Redis 响应缓存，后续大数据量可继续引入 keyset pagination 和持久化 tsvector 列。',
      },
    ],
  },
  {
    id: 'agent-demo-desktop-assistant',
    title: 'Agent Demo 产品拆解：Windows 本地文件助手',
    project: 'Agent Demo',
    category: 'AI 工具',
    date: '2026-04-06',
    views: '880',
    description: '拆解 Agent Demo 的 PySide6 桌面端、FastAPI 服务、LangGraph 运行时、Everything 检索和隔离区清理流程。',
    tags: ['Agent Demo', 'Python', 'PySide6', 'FastAPI', 'LangGraph', 'Everything'],
    theme: 'code',
    sections: [
      {
        id: 'experience',
        title: '核心体验',
        body: 'Agent Demo 面向 Windows 本地文件检索、文件审查和安全清理。桌面客户端是主体验，提供 Assistant、Quick Cleanup、Quarantine 和 Settings 四个区域。',
      },
      {
        id: 'retrieval',
        title: '文件检索',
        body: '项目优先通过 Everything 的 es.exe 做全局文件检索，未配置 es.exe 时回退到文件系统扫描。Everything 路径可通过 EVERYTHING_ES_PATH 配置。',
      },
      {
        id: 'runtime',
        title: '运行时',
        body: '桌面端使用 PySide6，API 服务使用 FastAPI 并复用 LangGraph runtime。API 端点包含 /chat、/session/{session_id}、/health、/skills、/mcp/servers 和 /documents/ingest。',
      },
    ],
  },
  {
    id: 'agent-demo-safe-cleanup',
    title: 'Agent Demo 安全模型：候选审查、隔离区与恢复',
    project: 'Agent Demo',
    category: '安全清理',
    date: '2026-04-05',
    views: '790',
    description: '整理 Agent Demo 的保守清理模型：检索候选、生成报告、移动到隔离区、支持恢复，避免默认直接删除。',
    tags: ['Agent Demo', '文件清理', '隔离区', 'DeepSeek', 'MCP', 'RAG'],
    theme: 'memory',
    sections: [
      {
        id: 'cleanup-model',
        title: '保守清理模型',
        body: '项目的清理流程是检索候选、审查并总结、导出或检查清理计划、把确认项移动到隔离区、必要时从隔离区恢复。直接删除不是默认路径。',
      },
      {
        id: 'settings',
        title: '设置能力',
        body: 'Settings 支持配置 DeepSeek API key、模型提供方、base URL、Everything 路径、HTTP 模式和中英文 UI 语言。保存语言设置后 UI 会立即刷新。',
      },
      {
        id: 'limits',
        title: '限制边界',
        body: '桌面客户端是当前最完整路径；API runtime 依赖 Redis、PostgreSQL 和 pgvector；RAG 与 embedding 依赖配置的模型提供商；文件系统 fallback 比 Everything 慢。',
      },
    ],
  },
];

const categoryIcons: Record<string, JSX.Element> = {
  实时通讯: <Network size={24} />,
  认证与缓存: <ShieldCheck size={24} />,
  微服务架构: <Server size={24} />,
  消息与一致性: <Workflow size={24} />,
  认证与安全: <Code2 size={24} />,
  缓存设计: <Database size={24} />,
  搜索系统: <Layers3 size={24} />,
  服务边界: <Server size={24} />,
  前端接口: <Code2 size={24} />,
  交易链路: <Workflow size={24} />,
  可观测性: <ShieldCheck size={24} />,
  工程效率: <Terminal size={24} />,
};

const categories: Category[] = Array.from(new Set(articles.map((article) => article.category))).map((name) => ({
  name,
  count: articles.filter((article) => article.category === name).length,
  icon: categoryIcons[name] ?? <FileText size={24} />,
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
  {
    name: 'blog-web',
    repo: 'local/Rs/web-backend',
    url: undefined,
    summary: '基于 Rust 2024、Axum、SeaORM、PostgreSQL 与 Redis 的社交博客后端，覆盖认证、用户、文章、评论、点赞、关注、通知、标签、搜索和设置。',
    role: 'Rust 社交博客后端',
    license: '未提供',
    stars: '-',
    forks: '-',
    commits: '-',
    stack: ['Rust 2024', 'Axum', 'SeaORM', 'PostgreSQL', 'Redis', 'Docker Compose', 'JWT', 'Full Text Search'],
    highlights: ['模块化 domains 结构', '启动时自动 SQL 迁移', 'Redis 响应缓存', 'PostgreSQL 全文搜索', '本地 seed 数据生成', 'cargo fmt 与 cargo test 质量检查'],
    modules: ['auth', 'users', 'posts', 'comments', 'likes', 'follows', 'notifications', 'settings', 'tags', 'search'],
    color: 'purple',
  },
  {
    name: 'Agent Demo',
    repo: 'local/Py/agent-demo',
    url: undefined,
    summary: '面向 Windows 的本地文件助手，提供文件检索、清理候选分析、隔离区移动与恢复，桌面端基于 PySide6，服务端基于 FastAPI 与 LangGraph runtime。',
    role: 'Windows 本地 AI 文件助手',
    license: '未提供',
    stars: '-',
    forks: '-',
    commits: '-',
    stack: ['Python', 'PySide6', 'FastAPI', 'LangGraph', 'Everything', 'DeepSeek', 'Redis', 'PostgreSQL', 'pgvector'],
    highlights: ['Everything 全局文件检索', '文件系统扫描 fallback', '预设清理扫描', '隔离区与恢复流程', '中英文 UI 切换', 'MCP 与 skills 可选集成'],
    modules: ['Assistant', 'Quick Cleanup', 'Quarantine', 'Settings', 'FastAPI Runtime', 'MCP Servers', 'Skills', 'RAG'],
    color: 'orange',
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
          <span>Xer Neo Lab</span>
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
            你好，我是 <span>Xer Neo</span>
          </h1>
          <p className="hero-description">
            这里聚焦 GinChat、Cloud Shop、blog-web 与 Agent Demo，记录架构设计、消息链路、缓存一致性、安全认证、搜索系统和桌面 AI 工具实践。
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
          <button onClick={() => openArticlesWithFilter({ tag: 'blog-web' })}>blog-web</button>
          <button onClick={() => openArticlesWithFilter({ tag: 'Agent Demo' })}>Agent Demo</button>
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
  const expandedSections = getExpandedSections(article);

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
        <ArticleVisual article={article} />
        {expandedSections.map((section, index) => (
          <section className="article-section" key={section.id}>
            <span className="section-index">{String(index + 1).padStart(2, '0')}</span>
            <h2 id={section.id}>{section.title}</h2>
            <p>{section.body}</p>
          </section>
        ))}
        <DecisionPanel article={article} />
        <CodeSample article={article} />
        <ReferencePanel article={article} />
      </article>
      <aside className="side-panel">
        <div className="panel-card">
          <h3>目录</h3>
          {expandedSections.map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.title}
            </a>
          ))}
          <a href="#decision">方案取舍</a>
          <a href="#references">参考资料</a>
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
          <p>这里展示当前项目矩阵：实时通讯、微服务电商、Rust 社交博客后端和 Windows 本地 AI 文件助手。</p>
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
        <h1>Xer Neo</h1>
        <p>后端工程 / AI 工具 / 项目复盘</p>
        <div className="profile-links">
          <Github size={18} />
          <Mail size={18} />
          <BookOpen size={18} />
        </div>
      </div>
      <div className="about-content">
        <h2>个人介绍</h2>
        <p>本站用于记录 GinChat、Cloud Shop、blog-web 和 Agent Demo 的架构设计、技术链路、问题复盘和后续优化计划。</p>
        <h2>技术栈</h2>
        <TagCloud tags={['Go', 'Gin', 'WebSocket', 'Java', 'Spring Cloud Alibaba', 'RocketMQ', 'Rust', 'Axum', 'Python', 'PySide6', 'LangGraph']} />
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
          <span>Xer Neo Lab</span>
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
          <span>hello@xerneo.dev</span>
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
          {project.url ? (
            <a href={project.url} target="_blank" rel="noreferrer">
              查看仓库
              <ExternalLink size={14} />
            </a>
          ) : (
            <span className="local-project-note">本地项目资料</span>
          )}
        </article>
      ))}
    </div>
  );
}

function ArticleVisual({ article }: { article: Article }) {
  const steps = getArticleVisualSteps(article);

  return (
    <div className={`article-visual-card ${article.theme}`}>
      <div className="visual-header">
        <div>
          <span>{article.project}</span>
          <h3>{getVisualTitle(article)}</h3>
        </div>
        <ProjectBadge project={article.project} />
      </div>
      <div className="visual-flow">
        {steps.map((step, index) => (
          <div className="visual-step" key={step}>
            <strong>{String(index + 1).padStart(2, '0')}</strong>
            <span>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DecisionPanel({ article }: { article: Article }) {
  const decisions = getDecisionBlocks(article);

  return (
    <section className="decision-panel" id="decision">
      <div className="decision-head">
        <span>Architecture Decision</span>
        <h2>方案取舍</h2>
      </div>
      <div className="decision-grid">
        {decisions.map((item) => (
          <article key={item.title}>
            <strong>{item.title}</strong>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReferencePanel({ article }: { article: Article }) {
  const references = getReferenceLinks(article);

  return (
    <section className="reference-panel" id="references">
      <h2>参考资料</h2>
      <div>
        {references.map((reference) => (
          <a key={reference.href} href={reference.href} target="_blank" rel="noreferrer">
            {reference.label}
            <ExternalLink size={14} />
          </a>
        ))}
      </div>
    </section>
  );
}

function getExpandedSections(article: Article) {
  const projectSections: Record<string, { id: string; title: string; body: string }[]> = {
    GinChat: [
      {
        id: 'design-choice',
        title: '我的方案选型',
        body: 'GinChat 选择单体服务承载 IM 核心链路，是因为项目规模以功能完整和链路清晰为先。HTTP 接口、WebSocket 连接管理、Redis 状态和 PostgreSQL 持久化都在同一个部署单元内，调试成本低，适合先把消息模型、好友关系和群组关系跑通。',
      },
      {
        id: 'alternative',
        title: '其他可选方案',
        body: '如果在线用户规模扩大，可以把 WebSocket 网关、消息投递和业务 API 拆成独立服务；如果消息量继续提升，可以引入 Kafka、RocketMQ 或 NATS 做消息缓冲；如果需要多端同步和复杂会话，可以进一步设计会话表、设备表和未读游标表。',
      },
    ],
    'Cloud Shop': [
      {
        id: 'design-choice',
        title: '我的方案选型',
        body: 'Cloud Shop 选择 Spring Cloud Alibaba + Dubbo + RocketMQ 的组合，是为了把公网入口、领域服务、RPC 调用和异步一致性分层。gateway 处理公网安全和路由，Dubbo 处理内部同步调用，RocketMQ 处理订单、库存、支付和搜索同步这类跨服务副作用。',
      },
      {
        id: 'alternative',
        title: '其他可选方案',
        body: '替代方案包括 Spring Cloud OpenFeign 统一 HTTP 内部调用、Kafka 承载事件流、Seata 处理强一致分布式事务、Debezium CDC 同步搜索索引。当前项目选择 Outbox + RocketMQ，是为了控制复杂度并保留失败重放和治理入口。',
      },
    ],
    'blog-web': [
      {
        id: 'design-choice',
        title: '我的方案选型',
        body: 'blog-web 选择 Rust + Axum + SeaORM，是为了获得类型约束、异步性能和较清晰的领域模块边界。全文搜索直接使用 PostgreSQL，适合博客系统早期阶段减少外部搜索集群维护成本。',
      },
      {
        id: 'alternative',
        title: '其他可选方案',
        body: '替代方案包括 Actix Web、Poem、SQLx、Diesel、Elasticsearch 或 Meilisearch。当前选择 Axum 与 SeaORM 更偏向组合式路由和 ORM 实体管理；当搜索权重、分词、聚合和推荐复杂度增加后，再迁移到独立搜索引擎更合理。',
      },
    ],
    'Agent Demo': [
      {
        id: 'design-choice',
        title: '我的方案选型',
        body: 'Agent Demo 选择 PySide6 作为主体验，是因为文件检索、隔离区和设置项都更适合桌面端交互。FastAPI 和 LangGraph runtime 保留为服务化入口，让后续 MCP、skills 和 RAG 能接入同一套运行时。',
      },
      {
        id: 'alternative',
        title: '其他可选方案',
        body: '替代方案包括 Electron、Tauri、纯 Web 控制台、AutoGen 或 CrewAI。当前项目偏向本地文件安全，PySide6 能降低系统权限、文件选择和本机路径交互成本；LangGraph 则适合把检索、审查、计划和隔离区动作显式建模。',
      },
    ],
  };

  return [...article.sections, ...(projectSections[article.project] ?? [])];
}

function getDecisionBlocks(article: Article) {
  const common = [
    {
      title: '当前选择',
      body: getChoiceSummary(article),
    },
    {
      title: '替代方案',
      body: getAlternativeSummary(article),
    },
    {
      title: '落地注意',
      body: getRiskSummary(article),
    },
  ];

  return common;
}

function getChoiceSummary(article: Article) {
  if (article.project === 'GinChat') return 'Go + Gin + GORM + Redis + WebSocket，优先保证 IM 链路闭环、状态清晰和本地部署简单。';
  if (article.project === 'Cloud Shop') return 'Spring Cloud Alibaba + Dubbo + RocketMQ + Redis + Elasticsearch，按电商主链路拆分同步调用、异步事件和搜索读模型。';
  if (article.project === 'blog-web') return 'Rust + Axum + SeaORM + PostgreSQL FTS + Redis，把博客读写、搜索和缓存控制在一个轻量后端里。';
  return 'PySide6 桌面端 + FastAPI 服务端 + LangGraph runtime，优先保障本地文件操作的可控性和可恢复性。';
}

function getAlternativeSummary(article: Article) {
  if (article.project === 'GinChat') return '可替换为独立 WebSocket 网关、Kafka/RocketMQ 消息总线、MongoDB 消息存储或分布式在线状态中心。';
  if (article.project === 'Cloud Shop') return '可替换为 OpenFeign、Kafka、Seata、Debezium CDC、Meilisearch 或更轻量的单体模块化架构。';
  if (article.project === 'blog-web') return '可替换为 Actix Web、SQLx、Diesel、Meilisearch、Elasticsearch 或独立 CQRS 读模型。';
  return '可替换为 Electron、Tauri、纯 Web 控制台、AutoGen、CrewAI 或直接使用 Everything HTTP API。';
}

function getRiskSummary(article: Article) {
  if (article.project === 'GinChat') return '核心风险是连接扩容、消息顺序、离线补偿和 Redis 状态过期，需要后续补多节点连接路由和消息投递确认。';
  if (article.project === 'Cloud Shop') return '核心风险是热点库存、Outbox 积压、MQ 重试风暴、缓存脏读和支付终态污染，需要治理台和压测脚本持续覆盖。';
  if (article.project === 'blog-web') return '核心风险是全文搜索性能、缓存失效策略、迁移脚本回滚和 Rust 编译迭代成本，需要围绕查询基线持续测试。';
  return '核心风险是误判清理候选和误删文件，因此默认隔离而非删除，并保留审查、报告和恢复路径。';
}

function getReferenceLinks(article: Article) {
  if (article.project === 'GinChat') {
    return [
      { label: 'Redis SETNX command', href: 'https://redis.io/docs/latest/commands/setnx/' },
      { label: 'Gorilla WebSocket repository', href: 'https://github.com/gorilla/websocket' },
    ];
  }
  if (article.project === 'Cloud Shop') {
    return [
      { label: 'Spring Cloud Gateway reference', href: 'https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/' },
      { label: 'Apache RocketMQ Transaction Message', href: 'https://rocketmq.apache.org/docs/featureBehavior/04transactionmessage/' },
      { label: 'Apache RocketMQ Message Model', href: 'https://rocketmq.apache.org/docs/domainModel/04message/' },
    ];
  }
  if (article.project === 'blog-web') {
    return [
      { label: 'Axum State extractor', href: 'https://docs.rs/axum/latest/axum/extract/struct.State.html' },
      { label: 'SeaORM migration guide', href: 'https://www.sea-ql.org/SeaORM/docs/migration/writing-migration/' },
      { label: 'PostgreSQL text search indexes', href: 'https://www.postgresql.org/docs/current/textsearch-indexes.html' },
    ];
  }
  return [
    { label: 'FastAPI documentation', href: 'https://fastapi.tiangolo.com/' },
    { label: 'LangGraph workflows and agents', href: 'https://docs.langchain.com/oss/python/langgraph/workflows-agents' },
  ];
}


function CodeSample({ article }: { article: Article }) {
  const snippet = article.code ?? getArticleCode(article);

  return (
    <div className="code-sample">
      <div className="code-title">
        <span>{getCodeLabel(article)}</span>
        <strong>{article.project}</strong>
      </div>
      <pre>
        <code>{snippet}</code>
      </pre>
    </div>
  );
}

function ProjectBadge({ project }: { project: string }) {
  return <span className="project-badge">{project}</span>;
}

function getVisualTitle(article: Article) {
  if (article.project === 'GinChat') return '实时消息链路';
  if (article.project === 'Cloud Shop') return '微服务协作链路';
  if (article.project === 'blog-web') return '内容平台读写链路';
  return '本地助手安全工作流';
}

function getArticleVisualSteps(article: Article) {
  if (article.project === 'GinChat') {
    return ['HTTP 鉴权', 'WebSocket 连接', 'Redis 状态', '异步落库', '在线推送'];
  }
  if (article.project === 'Cloud Shop') {
    return ['Gateway 入口', '领域服务', '本地事务', 'Outbox 事件', '治理观测'];
  }
  if (article.project === 'blog-web') {
    return ['Axum Router', 'Domain Handler', 'SeaORM Entity', 'PostgreSQL FTS', 'Redis Cache'];
  }
  return ['检索候选', '生成计划', '人工确认', '移动隔离', '可逆恢复'];
}

function getCodeLabel(article: Article) {
  if (article.project === 'GinChat') return 'Go / WebSocket';
  if (article.project === 'Cloud Shop') return 'Spring Cloud / MQ';
  if (article.project === 'blog-web') return 'Rust / Axum';
  return 'Python / FastAPI';
}

function getArticleCode(article: Article) {
  if (article.project === 'GinChat') {
    return `func (c *Client) ReadPump() {
  for {
    msg := c.readJSON()
    if redis.SetNX(msg.MsgID, 60*time.Second) {
      workerPool.Submit(msg)
      manager.Forward(msg)
    }
  }
}`;
  }

  if (article.project === 'Cloud Shop') {
    return `@Transactional
public void createOrder(CreateOrderCommand command) {
  orderRepository.save(order);
  outboxRepository.save(OrderCreatedEvent.of(order));
  transaction.afterCommit(outboxRelay::publish);
}`;
  }

  if (article.project === 'blog-web') {
    return `let app = Router::new()
  .nest("/api/v1/auth", auth_routes())
  .nest("/api/v1/posts", post_routes())
  .layer(auth_middleware(state.clone()))
  .with_state(state);`;
  }

  return `async def chat(request: ChatRequest):
    candidates = retrieval.search(request.query)
    report = cleanup.review(candidates)
    return {"plan": report, "action": "quarantine_only"}`;
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
        {project.url ? (
          <a className="primary-button repo-button" href={project.url} target="_blank" rel="noreferrer">
            打开仓库
            <ExternalLink size={15} />
          </a>
        ) : (
          <span className="local-project-note large">本地 README 项目，暂未配置公开仓库地址</span>
        )}
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
      {project.color === 'green' && <Terminal size={23} />}
      {project.color === 'blue' && <Server size={23} />}
      {project.color === 'purple' && <BookOpen size={23} />}
      {project.color === 'orange' && <FileText size={23} />}
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
