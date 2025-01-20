# 字体系统 | Typography System

## 字体族 | Font Families

### 主要字体 | Primary Fonts
- 中文字体
  * `PingFang SC` - 苹方简体
  * `Microsoft YaHei` - 微软雅黑
  * `Noto Sans SC` - 思源黑体
- 英文字体
  * `SF Pro Text` - 系统默认
  * `Roboto` - 通用无衬线
  * `-apple-system` - 系统默认

### 特殊用途 | Special Usage
- 代码字体
  * `SF Mono` - 系统等宽
  * `Consolas` - Windows等宽
  * `Monaco` - macOS等宽
- 数字字体
  * `DIN` - 数据展示
  * `Helvetica Neue` - 数字内容

## 字号系统 | Font Sizes

### 标题字号 | Heading Sizes
- H1: `36px/2.25rem`
  * 使用：主标题
  * 行高：1.2
  * 字重：600
- H2: `30px/1.875rem`
  * 使用：次级标题
  * 行高：1.3
  * 字重：500
- H3: `24px/1.5rem`
  * 使用：段落标题
  * 行高：1.4
  * 字重：500
- H4: `20px/1.25rem`
  * 使用：小标题
  * 行高：1.4
  * 字重：500
- H5: `16px/1rem`
  * 使用：强调文本
  * 行高：1.5
  * 字重：500

### 正文字号 | Body Sizes
- 大号文本: `18px/1.125rem`
  * 使用：重要内容
  * 行高：1.6
  * 字重：400
- 正文文本: `16px/1rem`
  * 使用：普通内容
  * 行高：1.5
  * 字重：400
- 小号文本: `14px/0.875rem`
  * 使用：辅助说明
  * 行高：1.5
  * 字重：400
- 超小文本: `12px/0.75rem`
  * 使用：注释信息
  * 行高：1.5
  * 字重：400

## 字重定义 | Font Weights

### 标准字重 | Standard Weights
- Regular: `400`
  * 使用：正文内容
- Medium: `500`
  * 使用：标题、强调
- Semibold: `600`
  * 使用：主标题
- Bold: `700`
  * 使用：特殊强调

## SCSS变量 | SCSS Variables

```scss
// Font Families
$font-family-base: -apple-system, BlinkMacSystemFont, "SF Pro Text", "PingFang SC", "Microsoft YaHei", sans-serif;
$font-family-code: "SF Mono", Consolas, Monaco, monospace;
$font-family-number: "DIN", "Helvetica Neue", sans-serif;

// Font Sizes
$font-size-base: 16px;
$font-size-lg: 18px;
$font-size-sm: 14px;
$font-size-xs: 12px;

$font-size-h1: 36px;
$font-size-h2: 30px;
$font-size-h3: 24px;
$font-size-h4: 20px;
$font-size-h5: 16px;

// Line Heights
$line-height-tight: 1.2;
$line-height-base: 1.5;
$line-height-loose: 1.6;

// Font Weights
$font-weight-regular: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

## 混合器 | Mixins

```scss
// 标题样式
@mixin heading-1 {
  font-size: $font-size-h1;
  line-height: $line-height-tight;
  font-weight: $font-weight-semibold;
}

@mixin heading-2 {
  font-size: $font-size-h2;
  line-height: 1.3;
  font-weight: $font-weight-medium;
}

@mixin heading-3 {
  font-size: $font-size-h3;
  line-height: 1.4;
  font-weight: $font-weight-medium;
}

// 正文样式
@mixin body-large {
  font-size: $font-size-lg;
  line-height: $line-height-loose;
  font-weight: $font-weight-regular;
}

@mixin body-base {
  font-size: $font-size-base;
  line-height: $line-height-base;
  font-weight: $font-weight-regular;
}

@mixin body-small {
  font-size: $font-size-sm;
  line-height: $line-height-base;
  font-weight: $font-weight-regular;
}
```

## 响应式排版 | Responsive Typography

### 移动端调整 | Mobile Adjustments
- H1: `28px/1.75rem`
- H2: `24px/1.5rem`
- H3: `20px/1.25rem`
- H4: `18px/1.125rem`
- H5: `16px/1rem`

### 平板端调整 | Tablet Adjustments
- H1: `32px/2rem`
- H2: `28px/1.75rem`
- H3: `22px/1.375rem`
- H4: `19px/1.188rem`
- H5: `16px/1rem`

```scss
// 响应式混合器
@mixin responsive-typography {
  @media (max-width: 768px) {
    h1 { font-size: 28px; }
    h2 { font-size: 24px; }
    h3 { font-size: 20px; }
    h4 { font-size: 18px; }
  }
  
  @media (min-width: 769px) and (max-width: 1024px) {
    h1 { font-size: 32px; }
    h2 { font-size: 28px; }
    h3 { font-size: 22px; }
    h4 { font-size: 19px; }
  }
}
``` 