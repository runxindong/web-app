/**
 * 实时通信示例
 */

(() => {
    // WebSocket聊天
    class ChatManager {
        constructor() {
            this.ws = null;
            this.messageContainer = document.getElementById('chatMessages');
            this.messageInput = document.getElementById('messageInput');
            this.sendButton = document.getElementById('sendMessage');
            
            this.init();
        }

        init() {
            // 连接WebSocket
            this.connectWebSocket();
            
            // 绑定事件
            this.sendButton?.addEventListener('click', () => this.sendMessage());
            this.messageInput?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        // 连接WebSocket
        connectWebSocket() {
            try {
                this.ws = new WebSocket('wss://api.example.com/chat');
                
                this.ws.addEventListener('open', () => {
                    this.appendMessage('系统', '连接成功');
                    this.setConnectionStatus('已连接');
                });

                this.ws.addEventListener('message', (event) => {
                    const message = JSON.parse(event.data);
                    this.appendMessage(message.sender, message.content);
                });

                this.ws.addEventListener('close', () => {
                    this.appendMessage('系统', '连接已断开');
                    this.setConnectionStatus('已断开');
                    
                    // 5秒后重连
                    setTimeout(() => this.connectWebSocket(), 5000);
                });

                this.ws.addEventListener('error', (error) => {
                    console.error('WebSocket Error:', error);
                    this.appendMessage('系统', '连接错误');
                    this.setConnectionStatus('错误');
                });
            } catch (error) {
                console.error('WebSocket Connection Error:', error);
                this.appendMessage('系统', '无法建立连接');
                this.setConnectionStatus('错误');
            }
        }

        // 发送消息
        sendMessage() {
            if (!this.messageInput?.value.trim() || !this.ws) return;

            const message = {
                type: 'message',
                content: this.messageInput.value,
                timestamp: new Date().toISOString()
            };

            try {
                this.ws.send(JSON.stringify(message));
                this.messageInput.value = '';
            } catch (error) {
                console.error('Send Message Error:', error);
                this.appendMessage('系统', '发送消息失败');
            }
        }

        // 添加消息到容器
        appendMessage(sender, content) {
            if (!this.messageContainer) return;

            const messageElement = document.createElement('div');
            messageElement.className = `message ${sender === '系统' ? 'system' : 'user'}`;
            
            const timestamp = new Date().toLocaleTimeString();
            
            messageElement.innerHTML = `
                <div class="message-header">
                    <span class="sender">${this.escapeHtml(sender)}</span>
                    <span class="time">${timestamp}</span>
                </div>
                <div class="message-content">${this.escapeHtml(content)}</div>
            `;

            this.messageContainer.appendChild(messageElement);
            this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
        }

        // 设置连接状态
        setConnectionStatus(status) {
            const statusElement = document.createElement('div');
            statusElement.className = `connection-status ${status.toLowerCase()}`;
            statusElement.textContent = `连接状态: ${status}`;
            
            const existingStatus = document.querySelector('.connection-status');
            if (existingStatus) {
                existingStatus.remove();
            }
            
            this.messageContainer?.parentElement?.insertBefore(
                statusElement,
                this.messageContainer
            );
        }

        // HTML转义
        escapeHtml(unsafe) {
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }
    }

    // 服务器推送事件
    class NotificationManager {
        constructor() {
            this.eventSource = null;
            this.notificationList = document.getElementById('notificationList');
            this.subscribeButton = document.getElementById('subscribeNotifications');
            
            this.init();
        }

        init() {
            // 绑定订阅事件
            this.subscribeButton?.addEventListener('click', () => {
                if (this.eventSource) {
                    this.unsubscribe();
                } else {
                    this.subscribe();
                }
            });
        }

        // 订阅通知
        subscribe() {
            try {
                this.eventSource = new EventSource('https://api.example.com/notifications');

                this.eventSource.addEventListener('open', () => {
                    this.appendNotification('系统', '已连接到通知服务');
                    this.updateSubscribeButton('取消订阅');
                });

                this.eventSource.addEventListener('message', (event) => {
                    const notification = JSON.parse(event.data);
                    this.appendNotification(
                        notification.type,
                        notification.content
                    );
                });

                this.eventSource.addEventListener('error', () => {
                    this.appendNotification('系统', '通知服务连接错误');
                    this.unsubscribe();
                });

                // 处理不同类型的通知
                ['info', 'warning', 'error'].forEach(type => {
                    this.eventSource.addEventListener(type, (event) => {
                        const notification = JSON.parse(event.data);
                        this.appendNotification(type, notification.content);
                    });
                });
            } catch (error) {
                console.error('EventSource Error:', error);
                this.appendNotification('系统', '无法连接到通知服务');
            }
        }

        // 取消订阅
        unsubscribe() {
            if (this.eventSource) {
                this.eventSource.close();
                this.eventSource = null;
                
                this.appendNotification('系统', '已断开通知服务');
                this.updateSubscribeButton('订阅通知');
            }
        }

        // 添加通知
        appendNotification(type, content) {
            if (!this.notificationList) return;

            const notificationElement = document.createElement('div');
            notificationElement.className = `notification ${type.toLowerCase()}`;
            
            const timestamp = new Date().toLocaleTimeString();
            
            notificationElement.innerHTML = `
                <div class="notification-header">
                    <span class="type">${this.escapeHtml(type)}</span>
                    <span class="time">${timestamp}</span>
                </div>
                <div class="notification-content">
                    ${this.escapeHtml(content)}
                </div>
            `;

            this.notificationList.insertBefore(
                notificationElement,
                this.notificationList.firstChild
            );

            // 添加动画
            requestAnimationFrame(() => {
                notificationElement.style.opacity = '1';
                notificationElement.style.transform = 'translateX(0)';
            });

            // 限制通知数量
            this.limitNotifications();
        }

        // 限制通知数量
        limitNotifications() {
            const maxNotifications = 50;
            const notifications = this.notificationList?.children;
            
            if (notifications && notifications.length > maxNotifications) {
                for (let i = maxNotifications; i < notifications.length; i++) {
                    notifications[i].remove();
                }
            }
        }

        // 更新订阅按钮
        updateSubscribeButton(text) {
            if (this.subscribeButton) {
                this.subscribeButton.textContent = text;
                this.subscribeButton.className = this.eventSource
                    ? 'subscribed'
                    : '';
            }
        }

        // HTML转义
        escapeHtml(unsafe) {
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }
    }

    // 初始化管理器
    new ChatManager();
    new NotificationManager();
})(); 