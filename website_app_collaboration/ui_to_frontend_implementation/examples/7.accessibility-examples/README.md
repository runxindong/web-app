# 可访问性示例 / Accessibility Examples

这个目录包含了一系列Web可访问性示例，展示了如何创建无障碍的网页内容和交互。
This directory contains a series of web accessibility examples, demonstrating how to create accessible web content and interactions.

## 目录结构 / Directory Structure

```
7.accessibility-examples/
├── index.html          # 主页面，包含所有可访问性示例 / Main page containing all accessibility examples
├── styles.css          # 样式文件 / Stylesheet
├── images/            # 图片资源目录 / Image resources directory
│   ├── icons/        # 图标文件 / Icon files
│   └── decorative/   # 装饰图片 / Decorative images
└── js/               # JavaScript文件目录 / JavaScript files directory
    ├── keyboard.js         # 键盘导航 / Keyboard navigation
    ├── screen-reader.js    # 屏幕阅读器支持 / Screen reader support
    ├── aria.js            # ARIA实现 / ARIA implementation
    └── focus.js           # 焦点管理 / Focus management
```

## 可访问性特性 / Accessibility Features

### 1. 键盘可访问性 / Keyboard Accessibility
- 完整的键盘导航支持 / Complete keyboard navigation support
- 可见的焦点指示器 / Visible focus indicators
- 键盘快捷键 / Keyboard shortcuts
- 跳过导航链接 / Skip navigation links

### 2. 屏幕阅读器支持 / Screen Reader Support
- 语义化HTML结构 / Semantic HTML structure
- 描述性文本标签 / Descriptive text labels
- 图片替代文本 / Image alternative text
- 表单字段说明 / Form field descriptions

### 3. ARIA实现 / ARIA Implementation
- ARIA地标角色 / ARIA landmark roles
- 动态内容更新通知 / Dynamic content update notifications
- 状态和属性标记 / State and property labeling
- 实时区域更新 / Live region updates

### 4. 视觉辅助 / Visual Assistance
- 高对比度模式 / High contrast mode
- 可调整文本大小 / Adjustable text size
- 颜色无障碍 / Color accessibility
- 焦点可视化 / Focus visualization

### 5. 表单可访问性 / Form Accessibility
- 清晰的标签关联 / Clear label associations
- 错误提示 / Error notifications
- 表单验证反馈 / Form validation feedback
- 必填字段标记 / Required field marking

### 6. 多媒体可访问性 / Multimedia Accessibility
- 视频字幕 / Video captions
- 音频转录 / Audio transcripts
- 媒体控制器 / Media controls
- 替代内容 / Alternative content

## 最佳实践 / Best Practices

1. 语义化标记 / Semantic Markup
```html
<!-- 好的实践 / Good practice -->
<nav aria-label="主导航">
  <ul>
    <li><a href="#home">首页</a></li>
  </ul>
</nav>

<!-- 避免 / Avoid -->
<div class="nav">
  <div><a href="#home">首页</a></div>
</div>
```

2. ARIA使用 / ARIA Usage
```html
<!-- 好的实践 / Good practice -->
<button aria-expanded="false" aria-controls="menu">
  菜单
</button>
<div id="menu" hidden>
  <!-- 菜单内容 / Menu content -->
</div>
```

3. 焦点管理 / Focus Management
```javascript
// 模态框打开时捕获焦点 / Capture focus when modal opens
modal.addEventListener('show', () => {
    firstFocusableElement.focus();
});
```

## 使用方法 / Usage

1. 克隆仓库并打开示例
   Clone repository and open examples
   ```bash
   # 启动本地服务器 / Start local server
   python -m http.server 8000
   ```

2. 使用辅助技术测试
   Test with assistive technologies
   - 使用屏幕阅读器 / Use screen readers
   - 仅使用键盘导航 / Navigate using keyboard only
   - 检查高对比度模式 / Check high contrast mode

## 测试工具 / Testing Tools

- NVDA (屏幕阅读器 / Screen reader)
- WAVE (可访问性评估工具 / Accessibility evaluation tool)
- Axe (自动化测试工具 / Automated testing tool)
- Lighthouse (性能和可访问性审计 / Performance and accessibility audit)

## 技术栈 / Tech Stack

- HTML5 (语义化标签 / Semantic tags)
- CSS3 (可访问性样式 / Accessible styles)
- JavaScript (可访问性增强 / Accessibility enhancements)
- WAI-ARIA (可访问性角色和属性 / Accessibility roles and properties)

## 注意事项 / Notes

1. 确保所有功能可通过键盘访问
   Ensure all functionality is keyboard accessible

2. 提供足够的颜色对比度
   Provide sufficient color contrast

3. 测试不同辅助技术的兼容性
   Test compatibility with different assistive technologies

4. 定期进行可访问性审计
   Conduct regular accessibility audits

## 可访问性检查清单 / Accessibility Checklist

- [ ] 所有图片都有替代文本 / All images have alt text
- [ ] 表单控件有关联标签 / Form controls have associated labels
- [ ] 颜色对比度符合WCAG标准 / Color contrast meets WCAG standards
- [ ] 页面结构使用正确的标题层级 / Page structure uses proper heading hierarchy
- [ ] 所有交互元素可通过键盘访问 / All interactive elements are keyboard accessible

## 相关资源 / Related Resources

- [WCAG 2.1 指南](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA 实践](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM 对比度检查器](https://webaim.org/resources/contrastchecker/)
- [A11Y 项目](https://www.a11yproject.com/)

## 贡献 / Contributing

欢迎提交问题和改进建议。
Feel free to submit issues and improvement suggestions.

## 许可证 / License

MIT 