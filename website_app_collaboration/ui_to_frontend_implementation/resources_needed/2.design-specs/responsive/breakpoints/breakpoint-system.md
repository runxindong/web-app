# 断点系统 | Breakpoint System

## 标准断点 | Standard Breakpoints

### 主要断点 | Primary Breakpoints
- 移动端: `0 - 767px`
  * 单列布局
  * 堆叠组件
  * 简化导航
  * 触摸优化

- 平板端: `768px - 1023px`
  * 双列布局
  * 部分展开组件
  * 组合导航
  * 混合交互

- 桌面端: `1024px - 1439px`
  * 多列布局
  * 完整组件
  * 完整导航
  * 鼠标交互

- 大屏端: `1440px+`
  * 宽屏布局
  * 扩展内容
  * 高级功能
  * 优化体验

### 特殊断点 | Special Breakpoints
- 小型手机: `0 - 374px`
  * 极简布局
  * 关键内容
  * 基础功能

- 大型平板: `1024px - 1199px`
  * 增强布局
  * 功能扩展
  * 交互优化

## SCSS变量 | SCSS Variables

```scss
// Primary Breakpoints
$breakpoint-mobile: 767px;
$breakpoint-tablet: 1023px;
$breakpoint-desktop: 1439px;

// Special Breakpoints
$breakpoint-small-mobile: 374px;
$breakpoint-large-tablet: 1199px;

// Minimum Widths
$min-width-mobile: 320px;
$min-width-tablet: 768px;
$min-width-desktop: 1024px;
$min-width-large: 1440px;

// Container Widths
$container-mobile: 100%;
$container-tablet: 720px;
$container-desktop: 960px;
$container-large: 1200px;
```

## 媒体查询混合器 | Media Query Mixins

```scss
// 响应式断点混合器
@mixin mobile {
  @media (max-width: $breakpoint-mobile) {
    @content;
  }
}

@mixin tablet {
  @media (min-width: #{$breakpoint-mobile + 1px}) and (max-width: $breakpoint-tablet) {
    @content;
  }
}

@mixin desktop {
  @media (min-width: #{$breakpoint-tablet + 1px}) and (max-width: $breakpoint-desktop) {
    @content;
  }
}

@mixin large {
  @media (min-width: #{$breakpoint-desktop + 1px}) {
    @content;
  }
}

// 方向断点混合器
@mixin landscape {
  @media (orientation: landscape) {
    @content;
  }
}

@mixin portrait {
  @media (orientation: portrait) {
    @content;
  }
}

// 特殊设备混合器
@mixin retina {
  @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    @content;
  }
}

@mixin touch-device {
  @media (hover: none) and (pointer: coarse) {
    @content;
  }
}
```

## 使用示例 | Usage Examples

```scss
// 响应式容器
.container {
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
  
  @include mobile {
    max-width: $container-mobile;
  }
  
  @include tablet {
    max-width: $container-tablet;
  }
  
  @include desktop {
    max-width: $container-desktop;
  }
  
  @include large {
    max-width: $container-large;
  }
}

// 响应式网格
.grid {
  display: grid;
  gap: 20px;
  
  @include mobile {
    grid-template-columns: 1fr;
  }
  
  @include tablet {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @include desktop {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @include large {
    grid-template-columns: repeat(4, 1fr);
  }
}

// 响应式导航
.nav {
  @include mobile {
    position: fixed;
    bottom: 0;
    width: 100%;
  }
  
  @include tablet-up {
    position: static;
    width: auto;
  }
}
```

## 最佳实践 | Best Practices

### 移动优先 | Mobile First
1. 基础样式
   - 默认移动端样式
   - 渐进增强
   - 性能优先
   - 内容优先

2. 断点使用
   - 从小到大
   - 避免过多断点
   - 基于内容
   - 保持一致性

3. 性能考虑
   - 最小化媒体查询
   - 复用代码
   - 优化资源
   - 测试性能

### 响应式图片 | Responsive Images
```scss
// 响应式图片混合器
@mixin responsive-image {
  max-width: 100%;
  height: auto;
  
  @include retina {
    // 高清图片处理
  }
}

// 背景图片混合器
@mixin responsive-background {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  
  @include mobile {
    background-image: url('image-mobile.jpg');
  }
  
  @include tablet-up {
    background-image: url('image-desktop.jpg');
  }
}
```

### 响应式字体 | Responsive Typography
```scss
// 响应式字体混合器
@mixin responsive-font-size($min-size, $max-size) {
  font-size: clamp(#{$min-size}, #{$min-size} + 2vw, #{$max-size});
}

// 使用示例
h1 {
  @include responsive-font-size(24px, 48px);
}
``` 