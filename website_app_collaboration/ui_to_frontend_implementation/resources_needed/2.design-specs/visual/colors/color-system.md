# 色彩系统 | Color System

## 主色 | Primary Colors

### 品牌主色 | Brand Primary
- `#2196F3` - 品牌蓝
  * 使用场景：主要按钮、重要链接、品牌标识
  * 变体：
    - `#1976D2` - 深色/悬停
    - `#64B5F6` - 浅色/禁用
    - `#BBDEFB` - 超浅色/背景

### 辅助色 | Secondary
- `#4CAF50` - 成功绿
  * 使用场景：成功状态、确认按钮
  * 变体：
    - `#388E3C` - 深色/悬停
    - `#81C784` - 浅色/禁用
    - `#C8E6C9` - 超浅色/背景

## 功能色 | Functional Colors

### 状态色 | Status Colors
- `#F44336` - 错误红
  * 使用场景：错误提示、删除操作
  * 变体：
    - `#D32F2F` - 深色/悬停
    - `#E57373` - 浅色/禁用
    - `#FFCDD2` - 超浅色/背景

- `#FFC107` - 警告黄
  * 使用场景：警告提示、需要注意
  * 变体：
    - `#FFA000` - 深色/悬停
    - `#FFD54F` - 浅色/禁用
    - `#FFECB3` - 超浅色/背景

- `#2196F3` - 信息蓝
  * 使用场景：信息提示、帮助信息
  * 变体：
    - `#1976D2` - 深色/悬停
    - `#64B5F6` - 浅色/禁用
    - `#BBDEFB` - 超浅色/背景

## 中性色 | Neutral Colors

### 文本色 | Text Colors
- `#212121` - 主要文本
  * 使用场景：标题、正文
- `#757575` - 次要文本
  * 使用场景：描述、说明
- `#BDBDBD` - 禁用文本
  * 使用场景：不可用状态

### 背景色 | Background Colors
- `#FFFFFF` - 纯白背景
  * 使用场景：主要内容区域
- `#F5F5F5` - 浅灰背景
  * 使用场景：次要内容区域
- `#EEEEEE` - 分割线
  * 使用场景：内容分隔

## 使用规范 | Usage Guidelines

### 无障碍对比度 | Accessibility Contrast
- 正文文本：最小对比度 4.5:1
- 大号文本：最小对比度 3:1
- 装饰性元素：无要求

### 颜色组合 | Color Combinations
- 主要按钮：品牌主色背景 + 白色文字
- 次要按钮：白色背景 + 品牌主色边框和文字
- 警告按钮：警告色背景 + 深色文字

### 状态变化 | State Changes
- 默认状态：使用基础色
- 悬停状态：使用深色变体
- 禁用状态：使用浅色变体
- 背景使用：使用超浅色变体

## SCSS变量 | SCSS Variables

```scss
// Primary Colors
$color-primary: #2196F3;
$color-primary-dark: #1976D2;
$color-primary-light: #64B5F6;
$color-primary-bg: #BBDEFB;

// Secondary Colors
$color-secondary: #4CAF50;
$color-secondary-dark: #388E3C;
$color-secondary-light: #81C784;
$color-secondary-bg: #C8E6C9;

// Status Colors
$color-error: #F44336;
$color-error-dark: #D32F2F;
$color-error-light: #E57373;
$color-error-bg: #FFCDD2;

$color-warning: #FFC107;
$color-warning-dark: #FFA000;
$color-warning-light: #FFD54F;
$color-warning-bg: #FFECB3;

$color-info: #2196F3;
$color-info-dark: #1976D2;
$color-info-light: #64B5F6;
$color-info-bg: #BBDEFB;

// Text Colors
$color-text-primary: #212121;
$color-text-secondary: #757575;
$color-text-disabled: #BDBDBD;

// Background Colors
$color-bg-primary: #FFFFFF;
$color-bg-secondary: #F5F5F5;
$color-divider: #EEEEEE;
```

## 颜色函数 | Color Functions

```scss
// 获取颜色变体
@function get-color-variant($color, $type) {
  @if $type == 'dark' {
    @return darken($color, 10%);
  } @else if $type == 'light' {
    @return lighten($color, 15%);
  } @else if $type == 'bg' {
    @return lighten($color, 30%);
  } @else {
    @return $color;
  }
}

// 检查对比度
@function check-contrast($background, $foreground) {
  $luminance1: luminance($background);
  $luminance2: luminance($foreground);
  
  $ratio: ($luminance1 + 0.05) / ($luminance2 + 0.05);
  
  @return $ratio;
}
``` 