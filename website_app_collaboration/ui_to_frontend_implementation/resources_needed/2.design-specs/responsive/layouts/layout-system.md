# 布局系统 | Layout System

## 网格系统 | Grid System

### 基础网格 | Base Grid
- 列数: 12列
- 槽宽: `20px`
- 边距: `20px`
- 容器宽度: 响应式

### 响应式网格 | Responsive Grid
- 移动端: 4列
  * 容器: `100%`
  * 槽宽: `16px`
  * 边距: `16px`

- 平板端: 8列
  * 容器: `720px`
  * 槽宽: `20px`
  * 边距: `20px`

- 桌面端: 12列
  * 容器: `960px`
  * 槽宽: `24px`
  * 边距: `24px`

- 大屏端: 12列
  * 容器: `1200px`
  * 槽宽: `24px`
  * 边距: `24px`

## 布局类型 | Layout Types

### 固定布局 | Fixed Layout
- 特点
  * 固定宽度
  * 居中对齐
  * 两侧留白
  * 内容限宽

### 流式布局 | Fluid Layout
- 特点
  * 百分比宽度
  * 弹性伸缩
  * 全屏适配
  * 内容自适应

### 混合布局 | Hybrid Layout
- 特点
  * 结合固定和流式
  * 局部固定
  * 局部流式
  * 灵活运用

## SCSS变量 | SCSS Variables

```scss
// Grid System
$grid-columns: 12;
$grid-gutter: 20px;
$grid-margin: 20px;

// Responsive Grid
$grid-mobile-columns: 4;
$grid-tablet-columns: 8;
$grid-desktop-columns: 12;

// Container Widths
$container-mobile: 100%;
$container-tablet: 720px;
$container-desktop: 960px;
$container-large: 1200px;

// Gutters
$gutter-mobile: 16px;
$gutter-tablet: 20px;
$gutter-desktop: 24px;

// Margins
$margin-mobile: 16px;
$margin-tablet: 20px;
$margin-desktop: 24px;
```

## 网格混合器 | Grid Mixins

```scss
// 容器混合器
@mixin container {
  margin-right: auto;
  margin-left: auto;
  padding-right: $grid-margin;
  padding-left: $grid-margin;
  width: 100%;
  
  @include mobile {
    max-width: $container-mobile;
    padding-right: $margin-mobile;
    padding-left: $margin-mobile;
  }
  
  @include tablet {
    max-width: $container-tablet;
    padding-right: $margin-tablet;
    padding-left: $margin-tablet;
  }
  
  @include desktop {
    max-width: $container-desktop;
    padding-right: $margin-desktop;
    padding-left: $margin-desktop;
  }
  
  @include large {
    max-width: $container-large;
  }
}

// 行混合器
@mixin row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -$grid-gutter / 2;
  margin-left: -$grid-gutter / 2;
}

// 列混合器
@mixin column($size) {
  flex: 0 0 percentage($size / $grid-columns);
  max-width: percentage($size / $grid-columns);
  padding-right: $grid-gutter / 2;
  padding-left: $grid-gutter / 2;
}
```

## 布局模式 | Layout Patterns

### 常用布局 | Common Layouts
```scss
// 居中布局
@mixin center-layout {
  display: flex;
  justify-content: center;
  align-items: center;
}

// 两栏布局
@mixin two-column-layout {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $grid-gutter;
  
  @include mobile {
    grid-template-columns: 1fr;
  }
}

// 三栏布局
@mixin three-column-layout {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $grid-gutter;
  
  @include mobile {
    grid-template-columns: 1fr;
  }
  
  @include tablet {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

### 特殊布局 | Special Layouts
```scss
// 圣杯布局
@mixin holy-grail-layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "nav main aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  
  @include mobile {
    grid-template-areas:
      "header"
      "nav"
      "main"
      "aside"
      "footer";
    grid-template-columns: 1fr;
  }
}

// 瀑布流布局
@mixin masonry-layout($columns: 3) {
  column-count: $columns;
  column-gap: $grid-gutter;
  
  > * {
    break-inside: avoid;
    margin-bottom: $grid-gutter;
  }
  
  @include mobile {
    column-count: 1;
  }
  
  @include tablet {
    column-count: 2;
  }
}
```

## 响应式布局 | Responsive Layouts

### 自适应容器 | Adaptive Containers
```scss
// 自适应容器混合器
@mixin adaptive-container {
  width: 100%;
  margin: 0 auto;
  
  @include mobile {
    padding: $margin-mobile;
  }
  
  @include tablet {
    padding: $margin-tablet;
    max-width: $container-tablet;
  }
  
  @include desktop {
    padding: $margin-desktop;
    max-width: $container-desktop;
  }
}
```

### 弹性布局 | Flexible Layouts
```scss
// 弹性布局混合器
@mixin flexible-layout {
  display: flex;
  flex-wrap: wrap;
  gap: $grid-gutter;
  
  > * {
    flex: 1 1 300px;
  }
  
  @include mobile {
    > * {
      flex: 1 1 100%;
    }
  }
}
```

## 最佳实践 | Best Practices

### 布局原则 | Layout Principles
1. 一致性
   - 使用统一的网格系统
   - 保持间距的一致性
   - 遵循对齐原则
   - 维护视觉层次

2. 响应性
   - 移动优先设计
   - 渐进增强
   - 断点合理使用
   - 内容优先

3. 可维护性
   - 模块化布局
   - 命名规范
   - 注释清晰
   - 代码复用 