# ECDP-Cloud 技术规范与项目结构详解 — PPT 演讲计划

> **演讲主题**：广东省应急指挥调度平台（ECDP-Cloud）技术规范与项目结构详解
> **适用场景**：新人培训 / 项目交接
> **演讲时长**：90 分钟（28 页，两大阶段 + Q&A）
> **目标受众**：新入职开发、项目交接接手人
> **PPT 风格**：tokyo-night 深色技术风（支持 T 键切换主题）
> **编制日期**：2026-08-02（v2，两大阶段重构）
> **素材来源**：`docs/微服务架构设计/系统架构设计说明书.md`（12 章）+ `docs/规范/` 下 8 份规范 + `AGENTS.md` + `docs/术语与场景分析/规范草稿.md` + 根 `pom.xml` / `ecdp-common-bom` / 各服务 `application.yml` + 部署相关 README + `docs/部署架构图.png`

---

## 一、演讲基本信息

| 项目 | 说明 |
| --- | --- |
| 主题 | ECDP-Cloud 技术规范与项目结构详解 |
| 场景 | 新人培训 / 项目交接 |
| 时长 | 90 分钟（正文 ≈86 分钟 + Q&A） |
| 页数 | 28 页（两大阶段） |
| 结构 | **大阶段一：技术规范**（S1–S15，≈50 min）→ **大阶段二：项目结构**（S16–S28，≈36 min） |
| 风格 | tokyo-night（深色技术风，可切换 dracula / catppuccin-mocha / nord / corporate-clean） |
| 模板 | html-ppt `presenter-mode-reveal`（自带 S 键演讲者模式 + 每页逐字稿） |
| 演讲目标 | 让新人从「代码怎么写、怎么协作、系统怎么部署」到「工程怎么组织、版本怎么管、环境怎么配」完整理解平台，知道写代码前该读哪些规范、遵守哪些硬性约束 |

---

## 二、演讲逻辑主线（两大阶段，90 分钟）

**一句话主线**：技术规范 = 怎么把代码写对、写稳、写好协作；项目结构 = 工程布局与治理，让"规范"能落地、可维护、可演进。

| 大阶段 | 内容 | 页码 | 时长 |
| --- | --- | --- | --- |
| **一、技术规范** | 背景与总纲 → 编码规范 / Git 规范 → 接口 / 数据库 / 签名 / 异常 / 日志 / 通信 / MQ / 度量 → 阶段小结 | S1–S15 | ≈50 min |
| **二、项目结构** | 总体架构 → 模块职责 → 技术栈 → 业务架构 → 两层 BOM → Maven Profile → Nacos 配置 → 配置实践 → 部署形态 + 部署架构图 → 演进 → 总结 | S16–S28 | ≈36 min |

**排序逻辑**：先讲"技术规范"（写代码的第一性约束：怎么写对、怎么协作、怎么保障质量），让新人拿到上岗的"红绿灯"；再讲"项目结构"（工程视角：模块怎么组织、版本怎么统一、环境怎么隔离、配置怎么治理、系统怎么部署），让新人理解规范背后的工程底座。**先规范后结构，规范是"怎么做"，结构是"凭什么"。**

---

## 三、逐页大纲（28 页）

> 每页标注：**目的 / 核心要点 / 关键素材（来源）/ 模板布局 / 逐字稿要点**。
> 逐字稿要点按 presenter-mode 三铁律编写（提示信号式、每页 150–300 字、口语化）。

---

### 大阶段一：技术规范（S1–S15）· ≈50 分钟

#### S1 封面

- **目的**：开场破冰，交代今天讲什么、讲多久。
- **核心内容**：
  - 标题：广东省应急指挥调度平台 · ECDP-Cloud
  - 副标题：技术规范与项目结构详解（新人培训 / 项目交接）
  - 演讲人 / 日期 / 时长 90 分钟
- **来源**：架构说明书第 1.1–1.4 节。
- **布局**：`cover`。
- **逐字稿要点**：自我介绍 + 欢迎；一句话点题——今天 90 分钟分两半：前半讲"代码怎么写才合规"，后半讲"工程怎么组织才可靠"；随时可打断。

#### S2 议程（两大阶段）

- **目的**：给新人一张整体地图，明确两大阶段与各自子主题。
- **核心内容**：
  - **大阶段一：技术规范**（开发与协作）—— 背景总纲 / 编码规范 / Git 规范 / 接口 / 数据库 / 数据签名 / 异常 / 日志 / 服务通信 / 消息队列 / 数据度量
  - **大阶段二：项目结构**（工程布局）—— 总体架构 / 模块职责 / 技术栈 / 业务架构 / 依赖版本 BOM / Maven Profile 环境 / Nacos 配置 / 配置实践 / 部署形态 + 部署架构图 / 演进 / 总结
- **来源**：全部素材。
- **布局**：`toc`（两大块 + 子条目）。
- **逐字稿要点**：说明两大阶段与时间分配（50/36）；给锚点——今天所有内容都能在 `docs/` 下找到原文，PPT 只是导读。

#### S3 建设背景与架构目标

- **目的**：回答"为什么要微服务、为什么要规范"，让后续所有规范都有"动机"。
- **核心内容**：
  - 建设背景：省级应急管理 + 多部门协同；**业务域多、用户角色多、系统集成多、数据安全要求高、运行连续性要求高**。
  - 8 大架构目标：业务解耦 / 统一入口 / 统一认证 / 统一权限 / 数据安全 / 弹性扩展 / 运维可控 / 持续演进。
  - 7 大设计原则：业务域驱动拆分 / 公共能力下沉 / 接口契约前置 / 配置外部化 / 安全内建 / 部署可替换 / 渐进式治理。
- **来源**：架构说明书第 2.1–2.3 节。
- **布局**：`three-column`（背景 / 目标 / 原则）。
- **逐字稿要点**：金句——**"后面所有规范，都是这些目标的具体落地。"**；用大白话讲痛点：单体装不下这么多业务域和角色，所以拆，拆完就必须靠规范兜住一致性。

#### S4 编码规范总纲（AGENTS.md）

- **目的**：新人写第一行代码前必须知道的"总纲级"约定，是所有专项规范的上游。
- **核心内容**：
  - 命名规范：类/接口 PascalCase、方法/变量 camelCase、常量全大写下划线、布尔 is/has/can、集合复数、DTO 以 Request/Response/DTO 结尾、异常以 Exception 结尾、配置类以 Configuration 结尾。
  - 注释规范：类/方法/属性/关键代码行**必须注释**；类注释含功能 + `@author` + `@since`；方法注释含 `@param`/`@return`；属性注释与 `@Schema(description=...)` 一致；禁止废话注释。
  - Service/Mapper：`@RequiredArgsConstructor` 构造注入（**禁止 `@Autowired` 字段注入**）；业务异常抛 `ServiceException`（**禁止 RuntimeException**）；ID 用 `IdGenerator.idKey()` 雪花（**禁止数据库自增**）。
  - DTO/Request/Response：实现 `Serializable` + `serialVersionUID`；`@Schema`；校验分组 `ValidGroup.Insert/Update`；日期 `@JsonFormat`；敏感字段 `@JsonIgnore`。
  - 集合使用：`LambdaQueryWrapper` 条件查询；Stream `.toList()`；`Collectors.toMap` 去重。
  - 代码复用与审查：**重复代码 > 3 处必须抽取；方法 ≤ 50 行；类 ≤ 500 行；硬编码提取为常量**；异常必须有 try-catch/throws。
- **来源**：AGENTS.md「编码规范」。
- **布局**：`three-column` / 分组卡片（命名 / 注释 / 分层 / 审查）。
- **逐字稿要点**：金句——**"规范不是限制，是团队协作的公共语言。"**；重点讲三条红线（禁 @Autowired 字段注入、禁 RuntimeException、禁数据库自增），新人最容易踩。

#### S5 Git 分支与提交规范（AGENTS.md）

- **目的**：新人第一天就要会的协作规范——怎么建分支、怎么提交，让历史可读、可回滚。
- **核心内容**：
  - Git Flow 分支模型：
    - `main`：生产环境代码，**禁止直接推送**；
    - `develop`：开发主分支；
    - `feature/ecdp-xxx-{描述}`：新功能开发分支。
  - 提交信息格式：`{类型}({范围}): {描述}`，可选正文。
  - 类型：`feat` 新增 / `fix` 修复 / `docs` 文档 / `style` 格式 / `refactor` 重构 / `perf` 性能 / `chore` 构建工具。
  - 示例：`feat(upms): 新增用户角色管理功能`。
- **来源**：AGENTS.md「Git 分支与提交规范」。
- **布局**：`code`（提交格式 + 示例）+ `table`（分支 / 类型）。
- **逐字稿要点**：讲三个分支的职责边界；提交格式当场读一遍——类型 + 范围 + 描述，让 `git log` 可读；提醒"main 禁止直推"是硬约束。

#### S6 接口设计规范（上）：REST 与统一响应

- **目的**：新人写接口前的第一份必读——URL 怎么命名、响应怎么统一、分页怎么分层。
- **核心内容**：
  - **禁止路径参数**（禁 `/{id}`），统一用查询参数或请求体传参。
  - URL 命名：`GET /findById`、`POST /page`、`POST /list`、`POST /save`、`PUT /update`、`DELETE /delete`、`PUT /updateStatus`。
  - 接口前缀：`/backend`（后台）/ `/mobile`（移动）/ `/screen`（大屏）/ `/inner`（内部 Feign）；**UPMS 特殊：不用 /backend，直接 `/system/user/page`**。
  - 统一响应 `ApiResult<T>`：`{ code, message, success, data, timestamp }`；响应码 200/400/401/403/404/500，业务异常 200 + code 区分。
  - 分页分层：请求继承 `PageRequest`；**Service 返回 `IPage<T>`，禁止返回 PageResult**；Controller 用 `DataUtil.convert(IPage)` 转 `PageResult<T>`。
- **来源**：接口设计规范.md。
- **布局**：`code`（ApiResult 示例 / 分页分层代码）+ `table`（URL 命名 / 前缀）。
- **逐字稿要点**：讲"禁止路径参数"的工程原因——网关、权限切面、日志切面要统一拦截参数；分页讲清分层责任——分页逻辑在 Service、页面装填在 Controller。

#### S7 接口设计规范（下）：校验、权限、返回值

- **目的**：讲清 Swagger 三件套、分组校验、返回值硬约束（这是安全红线）。
- **核心内容**：
  - Swagger 三件套：`@Operation`（Controller 方法）、`@Schema`（DTO 类与字段）、`@ParameterObject`（GET 对象参数展开）。
  - 分组校验：`ValidGroup.Insert` / `ValidGroup.Update`；Controller POST/PUT **强制 `@Validated` + 分组**。
  - 返回值硬约束：**禁止返回 `Object`、`Map<String,Object>`、直接返回 Entity**（Entity 含 `local_signature`/`signature` 会泄漏）→ 必须构造 `XxxResponse` 筛选字段。
  - 权限字符串四段式 `{产品}:{模块}:{资源}:{操作}`（例 `umps:system:user:list`）+ `@HasPermission`（OR 逻辑）。
  - 附件 JSON 字段存储：数组格式、**url 禁止存完整域名**、无附件返回 `[]` 而非 `null`。
- **来源**：接口设计规范.md。
- **布局**：`code`（反例 vs 正例）+ `table`。
- **逐字稿要点**：金句——**"为什么不许返回 Entity？因为签名字段会被打出去，这是安全问题。"**；用反例演示：直接返回 Entity → JSON 带出 `signature` → 数据可被伪造；提醒 GET 用 `@ParameterObject`，否则 Swagger 参数不展开。

#### S8 数据库设计规范

- **目的**：讲清数据边界 + 新人建表必须遵守的硬性规则。
- **核心内容**：
  - 数据边界：按服务划分；跨服务数据访问走 Feign；共享数据结构放 API 模块；业务服务不直接访问别的服务数据表。
  - 表命名：全小写下划线、单数、模块前缀：`sys_`(upms) / `org_`(组织) / `duty_` / `plan_` / `event_` / `dispatch_` / `resource_` / `flood_` / `fusion_` / `dss_`；关联表 `{a}_{b}_rel`、日志表 `{module}_access_log`、字典表 `{module}_dict_{type}`。
  - 必须字段：`{entity}_id`（BIGINT 雪花主键，**禁止自增**）、`create_time`、`update_time`、`deleted`、**`local_signature` / `local_signature_version` / `signature` / `signature_version` 四签名字段（任何表不得省略）**。
  - 禁止事项：数据库外键约束（应用层保证一致性）、自增主键、FLOAT/DOUBLE 存金额（用 DECIMAL(p,s)）、省略签名字段；VARCHAR 必须指定长度。
  - 实体映射注解模板：`@TableId(type = IdType.ASSIGN_ID)` + `@TableLogic` + `@TableField(fill = FieldFill.INSERT/INSERT_UPDATE)` + `@Schema` + `@JsonIgnore`(deleted)。
- **来源**：数据库设计规范.md + 架构说明书第 6 章。
- **布局**：`table`（前缀 / 必须字段）+ `code`（实体注解模板）。
- **逐字稿要点**：金句——**"建表先翻数据库设计规范，签名字段是硬性要求。"**；讲两个"为什么"：为什么禁止外键（微服务拆库后外键管不住）、为什么禁止自增（雪花 ID 全局唯一、避免分库冲突）。

#### S9 数据签名设计规范（重点故事）

- **目的**：完整讲清平台最有特色的数据完整性机制——为什么需要两道签名、怎么验签、签名 Key 怎么写。
- **核心内容**：
  - 背景矛盾：一体化签名平台**不提供批量验签**（列表 N 条 = N 次 HTTP 请求）且有网络依赖 → 本地签名作为"第一道防线"解决列表批量验签的性能问题。
  - 双签名分工表：

    | 维度 | 本地签名 local_signature | 一体化签名 signature |
    | --- | --- | --- |
    | 算法 | SM2 国密 | 平台决定 |
    | 密钥 | 本地管理 | 外部平台管理 |
    | 批量 | **支持，上限 500 条** | 不支持，逐条 |
    | 网络依赖 | 无 | 有（HTTP） |
    | 用途 | 列表展示高频验签 | 导出 / 审计 / 合规 |
    | 优先级 | **优先** | 兜底 |

  - 验签策略：写入时双签 → **本地优先**（通过即信，不调外部）→ 本地失败再外部兜底 → 两者均失败判定**数据被篡改**。
  - 签名 Key 构建规范：`IService` 接口声明 `buildSignatureKey(...)`（**参数为业务关键字段、非 Entity**）；拼接**必须用 `SignatureConstants.SEPARATOR`（值 `|`）**；null 字段转空串；字节级稳定。
  - 构建示例：路段表 `sectionNo|sectionName`、组织表 `orgCode|orgName`、用户表 `username|phone`。
  - 配置：`local-signature-enabled: true`、`local-signature-batch-max: 500`；`external-signature-enabled: false`（待对接）。
- **来源**：数据签名设计规范.md。
- **布局**：`flow-diagram`（验签流程）+ `table`（分工）+ `code`（buildSignatureKey）。
- **逐字稿要点**：用冲突开场："外部签名平台很权威，但它一次只能验一条，列表几百条怎么办？" → 所以加本地签名做第一道防线；演示验签失败文案；强调**不许在业务代码里自己拼字符串**，必须走 `buildSignatureKey`。

#### S10 异常处理与错误码

- **目的**：讲清全局异常处理器、5 位错误码体系、业务异常 vs 系统异常、韧性现状。
- **核心内容**：
  - 全局异常处理器 `GlobalBizExceptionHandler`（`@RestControllerAdvice`，位于 `ecdp-common-feign`）。
  - 错误码 5 位格式：**服务标识(1位) + 模块标识(2位) + 具体错误码(2位)**。示例：11001 认证凭据无效 / 11101 Token 无效 / 11201 无权限 / 20001 组织不存在 / 20101 任务不存在。
  - 异常 → HTTP 映射：业务异常（ServiceException）**HTTP 200 + code 区分**；参数校验 400；认证 401；无权限 403；资源不存在 404；系统异常 500。
  - 服务韧性现状（⚠️ 风险提示）：Sentinel 已引入，但**所有 Remote\*Service Feign 接口均未配置 fallbackFactory —— 生产上线前必须补降级逻辑**。
  - 事务：本地事务 `@Transactional(rollbackFor = Exception.class)`（必须指定 rollbackFor）；跨服务无分布式事务，靠幂等 + MQ 异步 + 定时补偿最终一致。
- **来源**：异常处理规范.md。
- **布局**：`code`（错误码枚举 + 响应示例）+ `table`（异常→HTTP 映射）+ 风险卡。
- **逐字稿要点**：金句——**"业务异常 ≠ 系统异常，新人一律抛 ServiceException。"**；讲为什么业务异常返回 HTTP 200（HTTP 语义太粗，code 更精确）；诚实提示熔断降级待补（与 S26 呼应）。

#### S11 日志规范：@SysLog 四维操作画像

- **目的**：讲清操作日志的四个维度、编码公式、写入链路、脱敏规则。
- **核心内容**：
  - 四维枚举「操作画像」：`subSystem`（产品）+ `funcType`（行为）+ `moduleType`（资源）+ `operatorType`（访问端）。
  - ModuleTypeEnum 编码公式：**`大类 × 100 + 子序号`**。例：`FLOOD_INSPECTION_TYPE=110` → `FLOOD_ORG_TYPE=11101`；支持按 `BETWEEN 11000 AND 11999` 聚合统计。
  - SubSystemEnum 三重职责：① 日志分类 ② **RabbitMQ 路由键前缀（prefix）** ③ 错误码前缀 `buildErrorCode()`。
  - 写入链路：Controller `@SysLog` → `LogAspect`（解析 4 枚举 + IP/UA/Browser/OS）→ 构造 `SysAccessLog`（含脱敏）→ `RemoteAccessLogService.saveLog`（Feign 同步）→ upms-biz 落 `sys_access_log` 表。
  - 内置脱敏字段：`password/pwd/token/secret` → `******`；`phone/email/idCard/bankCard` 部分脱敏（如 `176****1234`）。
  - 适用边界：写操作**必须标注**；GET 查询不强制。
- **来源**：日志规范.md。
- **布局**：`arch-diagram`（写入链路）+ `table`（四维 / 脱敏）+ `code`（@SysLog 示例）。
- **逐字稿要点**：金句——**"每个操作都能回答：谁 / 哪个系统 / 做了什么 / 从哪端来。"**；讲编码公式让同一模块资源天然落在同一区间，方便聚合统计。

#### S12 服务间通信规范

- **目的**：讲清 Feign 契约、@Inner 内部接口、第三方对接收敛、幂等设计、熔断降级现状。
- **核心内容**：
  - Feign 接口：统一放 `ecdp-*-api` 模块，命名 **`Remote{功能}Service`**；**必须**在 `META-INF/spring/org.springframework.cloud.openfeign.FeignClient.imports` 声明全限定类名。
  - `@NoToken`：Feign 内部调用不携带用户 Token。
  - `@Inner` 内部接口：默认 true（校验 `from=Y` 头）、`@Inner(value=false)` 为公开认证接口；`InnerAspect` 校验 + `FeignInnerRequestInterceptor` 自动加头。
  - 第三方对接收敛：**所有外部系统对接（短信/预警/路段/里程桩/融合通信）必须收敛到 `ecdp-third-party`**；`HttpUtils` 不得进 `ecdp-common`。
  - 幂等设计：Redis `setIfAbsent("idempotent:role:save:{entId}:{code}", "1", Duration.ofMinutes(5))` + 数据库唯一约束 + `DuplicateKeyException` → `ServiceException("该角色编码已存在")`。
  - ⚠️ 熔断降级现状：Sentinel 已引但未配 FallbackFactory（与 S10 呼应）。
- **来源**：服务间通信规范.md。
- **布局**：`flow-diagram`（Feign 调用链路）+ `code`（幂等模板）+ `table`。
- **逐字稿要点**：金句——**"服务间只依赖 API 契约，不依赖对方 Biz。"**；讲第三方收敛的价值——外部系统变化只影响 third-party，核心业务不被波及；幂等模板现场读一遍。

#### S13 消息队列规范

- **目的**：讲清 MQ 命名、消息体、消费约束、延时队列方案，以及"命名为什么全局统一"。
- **核心内容**：
  - 延时队列三方案对比：TTL+DLX（实现简单、精度秒级）/ **x-delayed-message 插件（毫秒级、本项目采用）** / 数据库轮询（可靠、有轮询开销）。
  - 三段式命名：**`{prefix}.{module}.{action}`**，prefix 取自 `SubSystemEnum.prefix`。例：交换机 `flood.task.exchange`、队列 `flood.task.created.queue`、路由键 `flood.task.created`。
  - 消息体规范：JSON 序列化（禁 Java 原生序列化）；字段必须 `@Schema`；实现 `Serializable` + `serialVersionUID`；ID 用 Long 雪花。
  - 消费者规范：`@MqConsumerLog` 自动 ACK；NackStrategy 三态 **REQUEUE / NACK / DISCARD**；**禁止手动 ACK、异常必须外抛、消费者必须幂等、禁止阻塞**；消费日志落 `mq_consume_log`。
  - 代码位置：**禁止在 `ecdp-common-rabbitmq` 写业务代码**；按 `amqp/config|constant|listener|message` 分包。
- **来源**：消息队列规范.md。
- **布局**：`table`（方案对比 / 命名示例）+ `code`（交换机声明 / 消费者）。
- **逐字稿要点**：讲命名联动——路由键前缀和 `@SysLog.moduleType` 共用 SubSystemEnum，**一套枚举管三件事**（日志分类/MQ 前缀/错误码前缀）；强调消费者铁律是消息不丢不重的基础。

#### S14 数据度量规范（参考性规范，轻量页）

- **目的**：提醒"单位混用是隐蔽 bug"，给出统一量纲与精度的三原则。
- **核心内容**：
  - 定位：**参考性规范**（非强制），统一各量纲的单位与精度。
  - 通用三原则：**存储精度 ≥ 计算精度 ≥ 展示精度**；**口径一致**（避免"米+千米"混用）；**字段语义标注**（`@Schema(description="本次巡查距离（m）")`）。
  - 高频要点：经纬度 `BigDecimal` 保留 6 位小数，禁 double；持续时长用**秒**；金额 **`BigDecimal` + `DECIMAL(18,2)` + `setScale(2, HALF_UP)`**，绝对禁止 float/double（`0.1 + 0.2 ≠ 0.3`）；百分比内部存 0–1 小数。
- **来源**：数据度量规范.md。
- **布局**：`two-column`（反例 vs 正例）+ `table`（三原则）。
- **逐字稿要点**：轻量一页，讲"金额用 float 是灾难"；提醒写字段顺手在 `@Schema` 里标单位，成本最低收益最高。

#### S15 技术规范阶段小结（金句回顾）

- **目的**：收束阶段一，强化"规范即契约"心智，并过渡到阶段二。
- **核心内容**：
  - 高频红线回顾：禁止外键约束 / 禁止返回 Entity（签名泄漏）/ 禁止 float 存金额 / 业务异常 ≠ 系统异常（抛 ServiceException）/ 禁止手动 ACK / 子模块禁止写版本号 / 禁止 @Autowired 字段注入。
  - 阶段过渡：规范保证了"单点正确"，下一步看工程怎么组织让这些规范长期可维护。
- **来源**：全部规范。
- **布局**：`big-quote`（金句墙）+ `bullets`（红线清单）。
- **逐字稿要点**：快速过一遍 7 条红线，每条一句话；过渡语："代码怎么写合规讲完了，接下来看工程底座——模块、版本、环境、配置怎么组织。"

---

### 大阶段二：项目结构（S16–S28）· ≈36 分钟

#### S16 总体架构分层视图

- **目的**：阶段二开篇，从"怎么写"转入"怎么组织"，先看整体分层。
- **核心内容**：
  - 7 层架构：客户端接入层 → 网关与认证层（gateway/auth）→ 平台服务层（upms）→ 业务服务层（8 业务）→ 基础服务层（third-party/workflow）→ 公共能力层（ecdp-common/*）→ 数据与中间件层（OpenGauss/Redis/Nacos/RabbitMQ/XXL-JOB/S3）。
  - 请求处理链路：客户端携带 Token → 网关校验 JWT 并路由 → 业务服务 Token 内省 + `@HasPermission` → 执行业务逻辑访问数据库 → 统一 `ApiResult` 响应。
- **来源**：架构说明书第 3 章。
- **布局**：`arch-diagram`（7 层堆叠）+ 请求链路条。
- **逐字稿要点**：带新人"走一遍"完整请求链路；强调三层边界——网关不写业务、Auth 只管认证、业务服务不碰别的服务数据表。

#### S17 模块划分与职责

- **目的**：讲清 7 个聚合模块、三大类模块职责、13 个微服务端口，让新人能看懂仓库目录。
- **核心内容**：
  - 7 个聚合模块（根 pom `<modules>`）：

    | 聚合模块 | 内容 |
    | --- | --- |
    | ecdp-common | 公共能力聚合（13 个 ecdp-common-* 子模块） |
    | ecdp-apis | API 契约聚合（各业务 *-api + apis-bom） |
    | ecdp-business | 业务服务聚合（8 个业务服务） |
    | ecdp-services | 基础服务（third-party / workflow） |
    | ecdp-upms | 权限管理（upms-biz + upms-api） |
    | ecdp-auth | 认证授权中心（单体 OAuth2） |
    | ecdp-gateway | API 网关（Spring Cloud Gateway / WebFlux） |

  - 三大类模块职责：**API 契约模块**（仅 Feign/实体/DTO/枚举，不含业务）；**业务微服务**（Controller/Service/Mapper，承载业务域）；**公共模块**（通用能力沉淀，不反向依赖业务）。
  - 13 个微服务端口表（gateway 28088 / auth 25010 / upms-biz 25020 / duty 25030 … / flood-inspection 25100 / third-party 25510 / workflow 25520）。
- **来源**：根 pom.xml + 架构说明书第 5.2 节 + _MAP.md。
- **布局**：`table`（聚合模块 / 服务端口）+ 树状结构图。
- **逐字稿要点**：对照仓库目录讲 7 个顶层文件夹各是什么；强调 API/Biz 分离"接口契约前置"；端口段位记忆法（25010–25100 业务段、28088 网关段）。

#### S18 技术栈总览

- **目的**：让新人知道"系统是用什么搭的"，理解每个组件解决什么问题。
- **核心内容**：JDK 17 / Spring Boot 3.5.13 / Spring Cloud 2025.0.1 / Spring Cloud Alibaba 2025.0.0.0 / Nacos 2.x / Gateway 4.3.2 / Spring Security OAuth2 + JJWT 0.12.5 / MyBatis-Plus 3.5.16 / OpenGauss 6.0+ / Redis 7.x + Caffeine / Redisson 3.39.0 + Lock4j 2.2.7 / RabbitMQ 3.x / XXL-JOB 3.4.0 / Sentinel 1.8.x / SpringDoc 2.8.14 + Knife4j 4.5.0 / Hutool 5.8.44 / Jasypt 3.0.5。
- **来源**：架构说明书第 7 章。
- **布局**：`kpi-grid`（分组：运行时 / 微服务治理 / 数据 / 中间件）。
- **逐字稿要点**：金句——**"每个组件都是为解决一个具体问题而选。"**；版本统一由 BOM 管理（下页展开），防止版本漂移。

#### S19 业务架构与核心业务链路

- **目的**：用一条"应急事件处置闭环"把业务服务串起来，理解服务间协作。
- **核心内容**：
  - 11 个业务域：平台支撑（upms）/ 值守 / 预案 / 事件 / 调度 / 资源 / 辅助决策 / 数据融合 / 防汛巡查 / 外部集成 / 流程支撑。
  - 核心业务闭环：`事件接报 → 事件研判与分级 → 预案匹配与资源查询 → 调度指挥与任务派发 → 处置过程跟踪 → 结果反馈与复盘分析`。
  - 链路中的服务分工：event 接报流转 → plan 提供处置依据 → resource 提供队伍物资 → dispatch 派发任务 → dss/fusion 做态势分析 → third-party 补充外部数据。
- **来源**：架构说明书第 4 章。
- **布局**：`flow-diagram`（6 节点闭环）+ 业务域分组表。
- **逐字稿要点**：用故事串场："一场洪水来了，怎么被系统处理？"；强调 `flood-inspection` 复杂度最高——自带业务域 RBAC + Feign 与 UPMS 协同。

#### S20 依赖版本如何定义：两层 BOM

- **目的**：讲清版本治理的核心——两层 BOM 设计，让"升级只改一处"。
- **核心内容**：
  - 根 pom `<dependencyManagement>` 依次 import 5 个 BOM：`ecdp-common-bom` → `ecdp-apis-bom` → `spring-boot-dependencies` → `spring-cloud-dependencies` → `spring-cloud-alibaba-dependencies`。
  - 两层 BOM 设计：
    - **`ecdp-common-bom`**：第三方依赖版本 + 12 个 `ecdp-common-*` 内部模块版本；
    - **`ecdp-apis-bom`**：各业务 `ecdp-*-api` 模块版本。
  - 代表版本清单（common-bom 收录）：hutool 5.8.44 / mybatis-plus 3.5.16 / mybatis-plus-join 1.5.5 / opengauss-jdbc 5.0.0 / postgresql 42.2.27 / redisson 3.39.0 / lock4j 2.2.7 / xxl-job 3.4.0 / knife4j 4.5.0 / springdoc 2.8.14 / spring-cloud-gateway-server 4.3.2 / okhttp 4.12.0 / jjwt 0.12.5 / transmittable-thread-local 2.12.6 / commons-io 2.18.0 / UserAgentUtils 1.21。
  - **强制规则**：子模块引入 BOM 已管理的依赖**禁止写 `<version>`**；**禁止抄版本号**（先查 BOM）；**禁止子模块私自**新增 `<dependencyManagement>`；内部模块版本统一 `1.0.0`，出现 `1.0.1` 视为违规。
  - 新增依赖流程：BOM `<properties>` 加版本变量 → `<dependencyManagement>` 引用 `${xxx.version}` → 子模块不写版本 → `mvn dependency:tree | grep xxx` 验证。
- **来源**：根 pom.xml + `ecdp-common-bom/pom.xml` + 规范草稿「BOM 规范」。
- **布局**：`arch-diagram`（两层 BOM 引用链）+ `code`（dependencyManagement 示例）+ `table`（代表版本）。
- **逐字稿要点**：金句——**"版本只写一处，升级只改一处。"**；讲"为什么两层"——common-bom 管第三方和公共模块，apis-bom 管 API 契约，解耦、互不影响；强调子模块写 `<version>` 是代码审查不通过项。

#### S21 Maven Profile 环境划分

- **目的**：讲清 6 个环境的编译期选择机制与 Nacos namespace/group 双层隔离。
- **核心内容**：
  - 6 个 Maven Profile 表：

    | Profile | 用途 | Nacos 地址 | namespace | group |
    | --- | --- | --- | --- | --- |
    | `dev`（默认） | 本地开发 | 127.0.0.1:8848 | `fetch` | `local` |
    | `nas_local` | 局域网本地 | 192.168.0.166:8848 | `ecdp` | `local` |
    | `nas_jx_local` | 局域网本地（江西） | 192.168.0.166:8848 | `ecdp` | `jx` |
    | `nas_local_ky` | 本地科员（私有） | 127.0.0.1:8848 | `ecdp` | `local_ky` |
    | `71.95_test` | 测试环境 | 10.0.71.95:8848 | `ecdp` | `local` |
    | `11.14_prod` | 生产环境 | 10.169.11.14:8848 | `ecdp` | `local` |

  - 三层隔离：**Maven profile（编译期选择器）** 注入 `@nacos.xxx@` 占位符 → **Nacos namespace（系统隔离：ecdp 生产系 / fetch 开发系）** → **Nacos group（环境隔离：local / jx / local_ky）**。
  - 单一变更点：环境差异只改根 pom `<profiles>` 一处，影响全部 13 个服务（避免改 13 个 yml）。
  - 强制规则：环境差异**只允许**在根 pom profiles 维护；属性命名小写+点分隔；新增环境命名 `{环境代号}_{环境类型}`；仅 `dev` 用 `activeByDefault`；禁止引入 bootstrap.yml。
- **来源**：根 pom.xml `<profiles>` + 规范草稿「Profiles 规范」。
- **布局**：`table`（6 环境）+ `flow-diagram`（profile→namespace→group 隔离）。
- **逐字稿要点**：金句——**"namespace 区分系统，group 区分环境，改一处影响 13 个服务。"**；现场演示：`mvn clean package -P 71.95_test` 会把 71.95 的地址注入到每个服务的 yml 里。

#### S22 Nacos 配置统一管理

- **目的**：讲清配置如何分层、如何从 Nacos 引入、为什么没有 bootstrap.yml。
- **核心内容**：
  - **无 bootstrap.yml**（SCA 2025 已用 `spring.config.import` 替代 bootstrap 机制）。
  - Nacos 配置三层分层（后加载覆盖先加载）：

    | 顺序 | 配置项 | 用途 | 维护方 |
    | --- | --- | --- | --- |
    | ① | `nacos:application.yml` | 系统级共享（MyBatis-Plus 全局策略 / JWT 密钥 / Logstash） | 架构组 |
    | ② | `nacos:${spring.application.name}.yml` | 服务专属（端口 / Feign 自定义 / 线程池） | 服务负责人 |
    | ③ | `nacos:common-*.yml` | 公共组件（common-ds 数据源 / common-s3 / common-rabbitmq） | 组件负责人 |

  - 写法示例（业务服务 application.yml）：

    ```yaml
    spring:
      config:
        import:
          - optional:nacos:application.yml
          - optional:nacos:${spring.application.name}.yml
          - optional:nacos:common-ds.yml
    ```

  - `optional:` 前缀 = 配置不存在时不报错（本地无该配置也能启动）；每个配置文件可独立热更新。
  - 强制规则：**禁止按环境建配置文件**（如 `application-dev.yml`）——group 已承担环境隔离。
- **来源**：各服务 application.yml + 规范草稿「Profiles 规范」。
- **布局**：`code`（application.yml 示例）+ `arch-diagram`（三层叠加）。
- **逐字稿要点**：讲三层各放什么、谁维护；强调"为什么没有 bootstrap.yml"——Spring Cloud Alibaba 2025 用 spring.config.import 了，新增模块别再引 bootstrap。

#### S23 配置工程化实践

- **目的**：讲清类型安全配置、敏感配置加密、打包命令，及一个待改进项。
- **核心内容**：
  - `@ConfigurationProperties` 类型绑定：统一 `xxxProperties` 类（放 `config.properties` 子包），**禁止业务类 `@Value("${...}")` 散落注入**；类名以 `Properties` 结尾；`@EnableConfigurationProperties(XxxProperties.class)` 启用；支持整组热刷新。
  - 敏感配置加密：Jasypt `ENC(...)` 加密存储（`jasypt-spring-boot-starter` 已全局引入）。
  - 打包 / 启动命令：

    ```bash
    mvn clean package -DskipTests                          # dev（默认）
    mvn clean package -DskipTests -P 71.95_test            # 测试环境
    mvn clean package -DskipTests -P 11.14_prod            # 生产环境
    ```

  - 瘦身打包：`maven.thin.skip=false` 开启瘦身，第三方依赖单独放 `project-libs` 目录（`maven.include.groupId=com.infoview`）。
  - ⚠️ 待改进：当前 6 个 profile 中 `nacos.password` 均为明文（历史欠账），建议迁到 `~/.m2/settings.xml <servers>` 凭据 + Jasypt `ENC(...)`。
- **来源**：规范草稿「Properties 规范」+ 根 pom.xml + Jasypt 集成。
- **布局**：`code`（Properties 类 / 打包命令）+ 风险卡（密码明文）。
- **逐字稿要点**：讲"禁 @Value"的理由——散落的 @Value 不可发现、不可类型校验、不可整组刷新；诚实提风险——Nacos 密码明文是待改项。

#### S24 部署形态：源码部署 + 容器化 + 中间件

- **目的**：让新人知道系统有哪几种部署姿势、中间件在哪、常见排障三板斧。
- **核心内容**：
  - 源码部署（`docs/源码部署微服务`）：JDK 17（`/v0/web/rcs_main/middleware/jdk17`）、`-Xms4g -Xmx4g`、`-XX:+UseZGC`、`-Dloader.path=./project-libs`、`--spring.config.location=./config/application.yml`；部署根 `/v0/web/rcs_main/rcs_server/`；`run.sh start|stop|restart|status|logs`。
  - 容器化（`docs/容器化部署微服务`）：Docker Compose 编排，当前启用 **7 个**（gateway/auth/upms/duty/dispatch/flood-inspection/third-party）+ 6 个预留（plan/event/resource/dss/fusion/workflow）；`network_mode: host`（5 个服务）、`restart: always`、挂载 `jar/config/project-libs/logs`（部分 +`cache_temps`）；`run.sh up|start|stop|restart|status|logs|down|clean-libs`。
  - 中间件（`docs/容器化部署中间件`）：Nacos 3.2.0（18080 控制台 / 8848 API / 9848 gRPC）、RabbitMQ 4.2-management（5672 AMQP / 15672 管理，含延迟消息插件）、MinIO（9000 API / 9001 控制台）。
  - 排障三板斧：① `NoClassDefFoundError` → project-libs 缺 API jar 或版本旧，重新构建同步；② `Load balancer does not contain an instance...` → 目标服务未注册到 Nacos，先 status/logs 排查；③ restart 后报"进程已存在" → `ps -ef | grep <svc>` 验证。
- **来源**：容器化部署微服务 / 源码部署微服务 / 容器化部署中间件 README。
- **布局**：`three-column`（源码 / 容器化 / 中间件）+ `table`（排障三板斧）。
- **逐字稿要点**：新人实操导向——怎么跑起来、服务挂了怎么办（restart: always 自动拉起）、怎么看日志；三板斧让新人遇到问题先自查。

#### S25 部署架构图

- **目的**：用一张图把整个系统的物理部署拓扑串起来，作为项目结构阶段的收尾。
- **核心内容**：
  - 嵌入 **`docs/部署架构图.png`**（1536×1024）。
  - 对照图讲解（以架构说明书第十章为依据）：负载入口 / 反向代理 → `ecdp-gateway` 容器 → `ecdp-auth` / `ecdp-upms-biz` / 业务服务容器 → 中间件（Nacos / OpenGauss / Redis / RabbitMQ / XXL-JOB / S3）。
- **来源**：`docs/部署架构图.png` + 架构说明书第 10.1 节。
- **布局**：`image-hero`（全宽嵌入部署架构图）。
- **逐字稿要点**：按"入口 → 网关 → 认证/权限 → 业务 → 中间件"的路径带新人读图；把 S16 的分层逻辑映射到物理部署上——**逻辑分层 vs 物理部署是对应的**。

#### S26 演进路线与当前待办

- **目的**：诚实呈现现状与风险，给接手人明确的待办清单。
- **核心内容**：
  - 演进方向：Kubernetes 化（Deployment/Service/Ingress/ConfigMap/Probe/HPA）→ 服务治理增强（Sentinel 熔断限流隔离）→ 可观测性增强（监控 / 链路 / 日志聚合 / 告警）→ 安全体系增强 → 数据治理增强 → 文档体系化。
  - 当前待办（⚠️ 风险提示卡）：
    1. **Feign 熔断降级未配置 fallbackFactory** —— 生产上线前所有 Remote\*Service 必补；
    2. **一体化签名待对接** —— `external-signature-enabled: false`；
    3. **存量表未按前缀规范** —— `app_info`、`mq_consume_log` 等历史表例外，新表必须遵守；
    4. **Nacos 密码明文** —— 建议迁 settings.xml 凭据 + Jasypt `ENC(...)`。
- **来源**：架构说明书第 12 章 + 异常/通信/数据库规范 + 规范草稿。
- **布局**：`roadmap`（NOW / NEXT / LATER）+ 风险卡片。
- **逐字稿要点**：金句——**"如果你们接手，先处理这几件事。"**；诚实讲待办是"渐进式治理"的既定节奏，不是项目不行；把四件事讲成可执行清单。

#### S27 总结 Takeaways + 学习路径

- **目的**：收束两大阶段，给出新人必读文档路径。
- **核心内容**：
  - 一句话主线：**业务域驱动拆分 + 规范即契约 + 安全/签名内建 + 工程布局统一（BOM/Profile/Nacos）**。
  - 新人必读顺序：系统架构设计说明书 → AGENTS.md → 接口设计规范 → 数据库设计规范 → 数据签名设计规范 → 异常 / 日志 / 服务间通信 / 消息队列规范。
- **来源**：全部素材。
- **布局**：`bullets`（学习路径）+ 一句话主线。
- **逐字稿要点**：快速回顾两大阶段（技术规范 = 怎么写对，项目结构 = 凭什么可靠）；给学习路径——"先读说明书建地图，写代码前翻 AGENTS.md 和接口/数据库规范，遇到签名、异常、MQ、部署再翻对应专项。"

#### S28 感谢 + Q&A

- **目的**：感谢聆听，开放提问。
- **核心内容**：回顾两大阶段一句话总结；开放 Q&A；提示所有文档在 `docs/` 下可查。
- **来源**：全部素材。
- **布局**：`thanks`。
- **逐字稿要点**：一句收尾——"规范让我们把代码写对，结构让这些对能长期保持。"；开放提问。

---

## 四、逐字稿三铁律（写 notes 时遵守）

1. **不是讲稿，是提示信号** — 核心词用 `<strong>` 加粗、过渡句独立成段、数据和名字列清楚。
2. **每页 150–300 字** — 少于 150 会卡壳，多于 300 扫不完；按 2–3 分钟/页节奏。
3. **用口语不用书面语** — "因此→所以"、"该方案→这个方案"、"综上所述→所以简单来说"。写完读一遍。

---

## 五、HTML PPT 制作方案（交付物 2，待计划文档确认后执行）

- **底座**：复制 html-ppt 技能 `templates/full-decks/presenter-mode-reveal/`（自带 S 键演讲者模式 + notes 逐字稿示例）。
- **主题**：`tokyo-night`；`<html data-themes="tokyo-night,dracula,catppuccin-mocha,nord,corporate-clean">` 支持 T 键循环切换。
- **布局复用**：cover / toc / arch-diagram / table / kpi-grid / flow-diagram / code / two-column / three-column / big-quote / roadmap / image-hero / thanks。
- **输出位置**：`/Users/zhang/.claude/skills/html-ppt/examples/ecdp-architecture/index.html`（含 style.css 与每页 notes）。
- **部署架构图**：把 `docs/部署架构图.png` 拷贝进 deck 目录，S25 用 `<img>` 嵌入并适配比例。
- **动效**：`fade-up` / `rise-in` 克制使用，不用爆炸/glitch 类动效。
- **逐字稿**：28 页每页写满 150–300 字 `<aside class="notes">`。

---

## 六、演讲 Q&A 备问

| 可能的提问 | 建议回答要点 |
| --- | --- |
| 为什么用两层 BOM？ | common-bom 管第三方 + 公共模块，apis-bom 管 API 契约——解耦两类版本，升级互不影响；子模块一律不写版本。 |
| 为什么 profile 改一处影响 13 个服务？ | 根 pom `<profiles>` 是环境差异唯一来源，通过 `@nacos.xxx@` 占位符 + 资源过滤注入到每个服务 yml。 |
| namespace / group 怎么区分？ | namespace 区分系统（`ecdp` 生产系 / `fetch` 开发系），group 区分环境（`local` / `jx` / `local_ky`）。 |
| 为什么禁止 bootstrap.yml？ | Spring Cloud Alibaba 2025 已用 `spring.config.import` 替代 bootstrap 机制，统一走 application.yml + Nacos import。 |
| 为什么用 OpenGauss 不用 MySQL/Oracle？ | 兼容 PostgreSQL 生态、企业级能力、适配政企结构化数据场景；配合 MyBatis-Plus 常规 CRUD。 |
| 双签名会不会太复杂？能不能只用本地签名？ | 本地签名覆盖列表高频验签；一体化签名用于导出/审计/合规的权威背书，监管场景是刚需。 |
| 为什么禁止返回 Entity？ | Entity 含 `signature` 等签名字段，序列化会泄漏，数据可被伪造篡改。 |
| 业务异常为什么返回 HTTP 200？ | HTTP 状态码语义粗，业务错误用 5 位 code 精确区分，前端按 code 处理更友好。 |
| 熔断降级没配，现在能上线吗？ | 不能——Sentinel 已引入但未配 fallbackFactory，这是生产前必补项（见 S26 待办）。 |
| 跨服务调用没有分布式事务，数据会不会不一致？ | 通过幂等 + 状态机 + MQ 异步 + 补偿 + 对账实现最终一致，不采用重 2PC。 |
| 新模块怎么接入？ | 建 API 契约模块 + Feign 声明（META-INF/spring imports）→ Biz 实现 → Nacos 配置 → 网关路由；BOM 登记 → 注册。 |

---

## 七、参考文档索引

| 文档 | 说明 | 演讲覆盖 |
| --- | --- | --- |
| `docs/微服务架构设计/系统架构设计说明书.md` | 12 章架构总纲 | S3、S16–S19、S25–S26 |
| `AGENTS.md` | 编码规范总纲 + Git 分支提交规范 | S4–S5 |
| `docs/规范/接口设计规范.md` | REST/响应/校验/权限/返回值 | S6–S7 |
| `docs/规范/数据库设计规范.md` | 表命名/必须字段/实体映射 | S8 |
| `docs/规范/数据签名设计规范.md` | 双签名架构/Key 构建 | S9 |
| `docs/规范/异常处理规范.md` | 全局异常/错误码/韧性/事务 | S10 |
| `docs/规范/日志规范.md` | @SysLog 四维/脱敏/链路 | S11 |
| `docs/规范/服务间通信规范.md` | Feign/@Inner/第三方/幂等 | S12 |
| `docs/规范/消息队列规范.md` | 命名/消息体/消费者/延时 | S13 |
| `docs/规范/数据度量规范.md` | 单位与精度（参考性） | S14 |
| `docs/术语与场景分析/规范草稿.md` | Profiles/BOM/Properties 等工程规范 | S20–S23 |
| 根 `pom.xml` / `ecdp-common-bom/pom.xml` / 各服务 `application.yml` | 构建/版本/配置实证 | S20–S22 |
| `docs/容器化部署微服务/README.md` | Docker Compose 部署 | S24 |
| `docs/源码部署微服务/README.md` | 源码部署与 JVM 参数 | S24 |
| `docs/容器化部署中间件/README.md` | 中间件端口与账号 | S24 |
| `docs/部署架构图.png` | 部署架构图 | S25 |

---

*本计划由「架构说明书 + 8 份规范 + AGENTS.md + 规范草稿 + 实际工程配置 + 部署文档」提炼生成，所有数据与示例均来自上述文档原文，可作为演讲逐字稿与 HTML PPT 制作的一手素材。*
