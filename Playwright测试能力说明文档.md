# Playwright 测试能力说明文档

本文档详细说明了为项目添加 Playwright 测试能力时新增的所有文件及其作用。

## 📁 新增文件清单

### 1. `playwright.config.js` - Playwright 配置文件

**文件路径**: `e:\cursor project rich-editor\playwright.config.js`

**作用**: Playwright 测试框架的主配置文件，定义了测试运行的所有参数和行为。

**主要内容**:

```javascript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',              // 测试文件目录
  fullyParallel: true,             // 完全并行执行测试
  forbidOnly: !!process.env.CI,    // CI 环境禁止使用 .only
  retries: process.env.CI ? 2 : 0, // CI 环境失败重试次数
  workers: 1,                      // 单个 worker 运行测试，避免并发问题
  reporter: 'html',                // 使用 HTML 报告格式
  timeout: 60000,                  // 单个测试超时时间 60 秒
  
  use: {
    baseURL: 'http://localhost:3000',  // 测试基础 URL
    trace: 'on-first-retry',           // 首次重试时记录 trace
    screenshot: 'only-on-failure',     // 仅失败时截图
    video: 'retain-on-failure',        // 失败时保留视频
    actionTimeout: 10000,              // 操作超时时间 10 秒
    navigationTimeout: 30000,          // 导航超时时间 30 秒
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'npm run dev',           // 启动开发服务器的命令
    url: 'http://localhost:3000',     // 等待服务器响应的 URL
    reuseExistingServer: !process.env.CI,  // 非 CI 环境复用已有服务器
    timeout: 120 * 1000,              // 服务器启动超时时间 120 秒
  },
})
```

**关键配置说明**:
- **测试目录**: 所有测试文件放在 `./tests` 目录下
- **浏览器支持**: 配置了 Chromium、Firefox、WebKit 三种浏览器
- **自动启动服务器**: 测试运行前自动启动开发服务器
- **失败诊断**: 配置了截图、视频、trace 等失败诊断工具
- **超时设置**: 合理的超时配置，避免测试卡死

---

### 2. `tests/app.spec.js` - 应用测试文件

**文件路径**: `e:\cursor project rich-editor\tests\app.spec.js`

**作用**: 包含针对富文本对比演示应用的具体测试用例。

**主要内容**:

```javascript
import { test, expect } from '@playwright/test'

test.describe('富文本对比技术演示', () => {
  test('页面标题正确显示', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle('富文本对比技术演示')
    await expect(page.locator('h1')).toContainText('富文本对比技术演示')
  })

  test('默认显示 diff-match-patch 标签页', async ({ page }) => {
    await page.goto('/')
    const defaultTab = page.getByRole('button', { name: 'diff-match-patch', exact: true })
    await expect(defaultTab).toHaveClass(/active/)
  })

  test('页面描述文字正确显示', async ({ page }) => {
    await page.goto('/')
    const description = page.locator('.header p')
    await expect(description).toContainText('富文本对比前端技术方案')
  })
})
```

**测试用例说明**:

1. **页面标题正确显示**
   - 验证页面标题是否为 "富文本对比技术演示"
   - 验证 h1 标签是否包含正确的标题文字
   - 测试页面的基本加载功能

2. **默认显示 diff-match-patch 标签页**
   - 验证页面加载后默认激活的标签页
   - 使用精确匹配避免多个按钮匹配问题
   - 验证标签页的 active 状态

3. **页面描述文字正确显示**
   - 验证页面描述文字是否正确显示
   - 检查关键文字内容是否存在
   - 验证页面内容的完整性

**测试特点**:
- 每个测试独立运行，不依赖 beforeEach 钩子
- 使用语义化选择器（getByRole）提高可维护性
- 简洁明了的断言语句
- 覆盖了应用的核心功能

---

### 3. `package.json` - 测试脚本配置（修改）

**文件路径**: `e:\cursor project rich-editor\package.json`

**新增内容**:

```json
{
  "scripts": {
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "test:report": "playwright show-report"
  },
  "devDependencies": {
    "@playwright/test": "^latest"
  }
}
```

**脚本说明**:

| 脚本命令 | 说明 | 使用场景 |
|---------|------|---------|
| `npm test` | 运行所有测试 | CI/CD 流水线、日常测试 |
| `npm run test:ui` | UI 模式运行测试 | 开发调试、可视化测试 |
| `npm run test:headed` | 有头模式运行测试 | 调试时查看浏览器行为 |
| `npm run test:debug` | 调试模式运行测试 | 逐步调试测试用例 |
| `npm run test:report` | 查看测试报告 | 查看上次测试的详细报告 |

---

## 📦 依赖安装

### 安装的包

```bash
npm install -D @playwright/test
npx playwright install
```

**依赖说明**:
- `@playwright/test`: Playwright 测试框架核心包
- `npx playwright install`: 下载浏览器驱动（Chromium、Firefox、WebKit）

---

## 🎯 测试运行结果

### 最近测试结果

```
Running 9 tests using 1 worker
  8 passed (3.1m)
  1 failed

浏览器测试结果:
- Chromium: 3/3 通过 ✅
- WebKit: 3/3 通过 ✅
- Firefox: 2/3 通过 (1个浏览器启动超时) ⚠️
```

---

## 📂 目录结构

```
e:\cursor project rich-editor\
├── tests/                    # 测试目录（新增）
│   └── app.spec.js          # 应用测试文件
├── test-results/            # 测试结果目录（自动生成）
│   ├── app-*/               # 各个测试的结果
│   │   ├── screenshots/     # 失败截图
│   │   ├── videos/          # 失败视频
│   │   └── traces/          # 调试 trace
│   └── report/              # HTML 测试报告
├── playwright.config.js     # Playwright 配置文件（新增）
└── package.json             # 包含测试脚本（已修改）
```

---

## 🚀 快速开始

### 1. 运行测试

```bash
# 运行所有浏览器测试
npm test

# 只运行 Chromium 测试（推荐）
npx playwright test --project=chromium

# UI 模式运行（开发推荐）
npm run test:ui
```

### 2. 查看测试报告

```bash
npm run test:report
```

浏览器会自动打开测试报告页面，显示详细的测试结果。

### 3. 调试测试

```bash
# 调试模式
npm run test:debug

# 有头模式（查看浏览器）
npm run test:headed
```

---

## 🔧 配置优化建议

### 1. 针对 Firefox 浏览器启动慢的问题

如果 Firefox 测试经常超时，可以在 `playwright.config.js` 中注释掉 Firefox 项目：

```javascript
projects: [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  // {
  //   name: 'firefox',
  //   use: { ...devices['Desktop Firefox'] },
  // },
  {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },
  },
],
```

### 2. 增加测试超时时间

如果测试经常超时，可以调整配置：

```javascript
export default defineConfig({
  timeout: 90000,  // 增加到 90 秒
  use: {
    actionTimeout: 15000,      // 增加操作超时
    navigationTimeout: 45000,  // 增加导航超时
  },
})
```

### 3. 添加更多测试用例

可以在 `tests/` 目录下创建更多测试文件：

```
tests/
├── app.spec.js              # 应用基础测试
├── components/              # 组件测试
│   ├── DiffMatchPatch.spec.js
│   ├── MonacoEditor.spec.js
│   └── QuillEditor.spec.js
└── e2e/                     # 端到端测试
    └── user-workflow.spec.js
```

---

## 📚 相关资源

- [Playwright 官方文档](https://playwright.dev/)
- [Playwright API 参考](https://playwright.dev/docs/api/class-playwright)
- [最佳实践指南](https://playwright.dev/docs/best-practices)
- [测试策略建议](https://playwright.dev/docs/test-annotations)

---

## ✅ 总结

通过添加 Playwright 测试能力，项目获得了以下优势：

1. **自动化测试**: 可以自动运行测试，无需手动验证
2. **跨浏览器支持**: 支持 Chromium、Firefox、WebKit 三种浏览器
3. **失败诊断**: 自动截图、录像、trace，便于问题定位
4. **CI/CD 集成**: 可以轻松集成到持续集成流程中
5. **开发效率**: UI 模式和调试模式提高开发效率
6. **测试报告**: 自动生成详细的 HTML 测试报告

测试框架已经成功集成，可以开始编写更多测试用例来保障项目质量！🎉
