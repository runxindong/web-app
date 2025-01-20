# 资源文件 | Assets

## 目录说明 | Directory Description

本目录包含所有项目所需的资源文件，包括图片、图标和字体文件。

### 1. 图片资源 | Images
- 位置 | Location: `/images`
- 内容 | Contents:
  - 背景图片 | Backgrounds: `/backgrounds`
  - 内容图片 | Content: `/content`
  - 响应式图片 | Responsive: `/responsive`

### 2. 图标文件 | Icons
- 位置 | Location: `/icons`
- 内容 | Contents:
  - 导航图标 | Navigation: `/nav`
  - 功能图标 | Function: `/function`
  - 社交图标 | Social: `/social`

### 3. 字体文件 | Fonts
- 位置 | Location: `/fonts`
- 格式 | Formats: .woff2, .woff, .ttf

## 文件要求 | File Requirements

1. 图片规范
   - 格式选择
     * JPG: 照片类图片
     * PNG: 需要透明背景
     * WebP: 现代浏览器
     * SVG: 矢量图形
   - 尺寸要求
     * 最大宽度: 1920px
     * 响应式尺寸集
     * 2x/3x 适配
   - 优化要求
     * 合适的压缩率
     * 渐进式加载
     * 体积控制
     * 清晰度平衡

2. 图标规范
   - 格式要求
     * 首选 SVG 格式
     * 提供 PNG 备选
     * 统一的尺寸
     * 清晰的命名
   - 样式统一
     * 线条粗细
     * 拐角圆角
     * 视觉重量
     * 留白空间

3. 字体规范
   - 格式支持
     * WOFF2 优先
     * WOFF 备选
     * TTF 兜底
   - 字重选择
     * Regular (400)
     * Medium (500)
     * Bold (700)
   - 优化考虑
     * 字体子集化
     * 按需加载
     * 本地字体降级
     * 性能优化

## 示例文件结构 | Example File Structure

```
images/
├── backgrounds/
│   ├── hero-bg-desktop.jpg
│   ├── hero-bg-tablet.jpg
│   └── hero-bg-mobile.jpg
│
├── content/
│   ├── feature-1.webp
│   ├── feature-2.webp
│   └── feature-3.webp
│
└── responsive/
    ├── product-desktop.jpg
    ├── product-tablet.jpg
    └── product-mobile.jpg

icons/
├── nav/
│   ├── menu.svg
│   ├── search.svg
│   └── close.svg
│
├── function/
│   ├── edit.svg
│   ├── delete.svg
│   └── share.svg
│
└── social/
    ├── facebook.svg
    ├── twitter.svg
    └── instagram.svg

fonts/
├── PingFangSC-Regular.woff2
├── PingFangSC-Medium.woff2
└── PingFangSC-Bold.woff2
```

## 性能优化 | Performance Optimization

1. 图片优化
   - 响应式图片
   - 延迟加载
   - 预加载关键资源
   - WebP 格式转换

2. 图标优化
   - SVG Sprite
   - 图标字体
   - 按需加载
   - 路径优化

3. 字体优化
   - 字体子集化
   - 预加载策略
   - FOIT/FOUT 处理
   - 本地字体降级

## 资源管理 | Asset Management

1. 版本控制
   - 文件命名规范
   - 版本号管理
   - 更新记录
   - 备份策略

2. 访问控制
   - CDN 分发
   - 缓存策略
   - 防盗链设置
   - 访问权限
