# 间距系统 | Spacing System

## 基础单位 | Base Units

### 基础栅格 | Base Grid
- 基础单位: `4px`
- 常用倍数: 1, 2, 3, 4, 6, 8, 12, 16
- 计算方式: `基础单位 × 倍数`

### 标准间距 | Standard Spacing
- 超小间距: `4px` (1×)
  * 使用：图标内边距、紧凑布局
- 小间距: `8px` (2×)
  * 使用：文本间距、列表项
- 中间距: `16px` (4×)
  * 使用：段落间距、卡片内边距
- 大间距: `24px` (6×)
  * 使用：组件间距、区块分隔
- 超大间距: `32px` (8×)
  * 使用：区域间距、页面分隔
- 巨大间距: `48px` (12×)
  * 使用：主要区块分隔、页面边距

## 应用场景 | Usage Scenarios

### 内边距 | Padding
- 按钮内边距: `8px 16px`
- 卡片内边距: `16px`
- 模态框内边距: `24px`
- 页面容器内边距: `24px`

### 外边距 | Margin
- 文本段落间距: `16px`
- 列表项间距: `8px`
- 卡片间距: `16px`
- 区块间距: `32px`

### 组件间距 | Component Spacing
- 表单项间距: `16px`
- 导航项间距: `24px`
- 标题与内容间距: `16px`
- 按钮组间距: `8px`

## SCSS变量 | SCSS Variables

```scss
// Base Units
$spacing-unit: 4px;

// Standard Spacing
$spacing-xs: $spacing-unit;        // 4px
$spacing-sm: $spacing-unit * 2;    // 8px
$spacing-md: $spacing-unit * 4;    // 16px
$spacing-lg: $spacing-unit * 6;    // 24px
$spacing-xl: $spacing-unit * 8;    // 32px
$spacing-xxl: $spacing-unit * 12;  // 48px

// Component Specific
$button-padding: $spacing-sm $spacing-md;
$card-padding: $spacing-md;
$modal-padding: $spacing-lg;
$container-padding: $spacing-lg;

// Layout Spacing
$section-margin: $spacing-xl;
$grid-gutter: $spacing-md;
$list-item-margin: $spacing-sm;
```

## 混合器 | Mixins

```scss
// 内边距混合器
@mixin padding($size) {
  @if $size == 'sm' {
    padding: $spacing-sm;
  } @else if $size == 'md' {
    padding: $spacing-md;
  } @else if $size == 'lg' {
    padding: $spacing-lg;
  }
}

// 外边距混合器
@mixin margin($size) {
  @if $size == 'sm' {
    margin: $spacing-sm;
  } @else if $size == 'md' {
    margin: $spacing-md;
  } @else if $size == 'lg' {
    margin: $spacing-lg;
  }
}

// 间距工具类生成器
@mixin generate-spacing-utilities {
  // Padding
  .p-xs { padding: $spacing-xs; }
  .p-sm { padding: $spacing-sm; }
  .p-md { padding: $spacing-md; }
  .p-lg { padding: $spacing-lg; }
  .p-xl { padding: $spacing-xl; }
  
  // Margin
  .m-xs { margin: $spacing-xs; }
  .m-sm { margin: $spacing-sm; }
  .m-md { margin: $spacing-md; }
  .m-lg { margin: $spacing-lg; }
  .m-xl { margin: $spacing-xl; }
}
```

## 响应式间距 | Responsive Spacing

### 移动端调整 | Mobile Adjustments
- 容器内边距: `16px`
- 卡片内边距: `12px`
- 区块间距: `24px`
- 组件间距: `12px`

### 平板端调整 | Tablet Adjustments
- 容器内边距: `20px`
- 卡片内边距: `16px`
- 区块间距: `28px`
- 组件间距: `16px`

```scss
// 响应式间距混合器
@mixin responsive-spacing {
  @media (max-width: 768px) {
    .container {
      padding: $spacing-md;
    }
    
    .card {
      padding: $spacing-sm + $spacing-unit;
    }
    
    .section {
      margin-bottom: $spacing-lg;
    }
  }
  
  @media (min-width: 769px) and (max-width: 1024px) {
    .container {
      padding: $spacing-md + $spacing-unit;
    }
    
    .card {
      padding: $spacing-md;
    }
    
    .section {
      margin-bottom: $spacing-lg + $spacing-unit;
    }
  }
}
```

## 最佳实践 | Best Practices

### 间距原则 | Spacing Principles
1. 一致性
   - 使用预定义的间距值
   - 避免随意的间距数值
   - 保持视觉节奏

2. 层次感
   - 相关元素使用较小间距
   - 不相关元素使用较大间距
   - 通过间距创建视觉层次

3. 响应式调整
   - 在小屏幕上适当减小间距
   - 保持元素间的比例关系
   - 确保可读性和可用性 