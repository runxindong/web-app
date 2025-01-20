/**
 * API集成示例
 */

(() => {
    // RESTful API集成
    class RESTfulAPI {
        constructor() {
            this.baseURL = 'https://api.example.com';
            this.userList = document.getElementById('userList');
            this.loadUsersBtn = document.getElementById('loadUsers');
            this.addUserForm = document.getElementById('addUserForm');
            
            this.init();
        }

        init() {
            // 绑定事件
            this.loadUsersBtn?.addEventListener('click', () => this.loadUsers());
            this.addUserForm?.addEventListener('submit', (e) => this.addUser(e));
        }

        // 加载用户列表
        async loadUsers() {
            try {
                this.setLoading(this.userList, true);
                
                const response = await axios.get(`${this.baseURL}/users`);
                const users = response.data;
                
                this.renderUsers(users);
            } catch (error) {
                this.handleError(error);
            } finally {
                this.setLoading(this.userList, false);
            }
        }

        // 添加用户
        async addUser(event) {
            event.preventDefault();
            
            const nameInput = document.getElementById('userName');
            const emailInput = document.getElementById('userEmail');
            
            if (!nameInput || !emailInput) return;
            
            const userData = {
                name: nameInput.value,
                email: emailInput.value
            };

            try {
                this.setLoading(this.addUserForm, true);
                
                const response = await axios.post(`${this.baseURL}/users`, userData);
                const newUser = response.data;
                
                // 添加到列表
                this.addUserToList(newUser);
                
                // 重置表单
                event.target.reset();
                
                // 显示成功消息
                this.showMessage('用户添加成功', 'success');
            } catch (error) {
                this.handleError(error);
            } finally {
                this.setLoading(this.addUserForm, false);
            }
        }

        // 渲染用户列表
        renderUsers(users) {
            if (!this.userList) return;
            
            this.userList.innerHTML = users.map(user => `
                <li>
                    <strong>${this.escapeHtml(user.name)}</strong>
                    <br>
                    <small>${this.escapeHtml(user.email)}</small>
                </li>
            `).join('');
        }

        // 添加单个用户到列表
        addUserToList(user) {
            if (!this.userList) return;
            
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${this.escapeHtml(user.name)}</strong>
                <br>
                <small>${this.escapeHtml(user.email)}</small>
            `;
            
            this.userList.appendChild(li);
        }

        // 设置加载状态
        setLoading(element, isLoading) {
            if (element) {
                element.classList.toggle('loading', isLoading);
            }
        }

        // 显示消息
        showMessage(message, type = 'info') {
            const messageElement = document.createElement('div');
            messageElement.className = `message ${type}`;
            messageElement.textContent = message;
            
            document.body.appendChild(messageElement);
            
            // 3秒后移除
            setTimeout(() => {
                messageElement.remove();
            }, 3000);
        }

        // 处理错误
        handleError(error) {
            console.error('API Error:', error);
            
            let message = '发生错误，请稍后重试';
            
            if (error.response) {
                // 服务器响应错误
                switch (error.response.status) {
                    case 400:
                        message = '请求参数错误';
                        break;
                    case 401:
                        message = '未授权，请登录';
                        break;
                    case 403:
                        message = '无权访问';
                        break;
                    case 404:
                        message = '请求的资源不存在';
                        break;
                    case 500:
                        message = '服务器内部错误';
                        break;
                }
            } else if (error.request) {
                // 请求未收到响应
                message = '无法连接到服务器';
            }
            
            this.showMessage(message, 'error');
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

    // GraphQL集成
    class GraphQLAPI {
        constructor() {
            this.endpoint = 'https://api.example.com/graphql';
            this.postList = document.getElementById('postList');
            this.loadPostsBtn = document.getElementById('loadPosts');
            
            this.client = graphql(this.endpoint, {
                headers: {
                    'Content-Type': 'application/json',
                    // 添加其他必要的头部
                }
            });
            
            this.init();
        }

        init() {
            this.loadPostsBtn?.addEventListener('click', () => this.loadPosts());
        }

        // 加载文章列表
        async loadPosts() {
            try {
                this.setLoading(this.postList, true);
                
                const query = `
                    query GetPosts {
                        posts {
                            id
                            title
                            excerpt
                            author {
                                name
                            }
                        }
                    }
                `;
                
                const response = await this.client.query(query);
                this.renderPosts(response.posts);
            } catch (error) {
                this.handleError(error);
            } finally {
                this.setLoading(this.postList, false);
            }
        }

        // 渲染文章列表
        renderPosts(posts) {
            if (!this.postList) return;
            
            this.postList.innerHTML = posts.map(post => `
                <article class="post">
                    <h5>${this.escapeHtml(post.title)}</h5>
                    <p>${this.escapeHtml(post.excerpt)}</p>
                    <small>作者: ${this.escapeHtml(post.author.name)}</small>
                </article>
            `).join('');
        }

        // 设置加载状态
        setLoading(element, isLoading) {
            if (element) {
                element.classList.toggle('loading', isLoading);
            }
        }

        // 处理错误
        handleError(error) {
            console.error('GraphQL Error:', error);
            
            let message = '加载文章失败，请稍后重试';
            
            if (error.response?.errors) {
                message = error.response.errors[0].message;
            }
            
            // 显示错误消息
            const messageElement = document.createElement('div');
            messageElement.className = 'message error';
            messageElement.textContent = message;
            
            this.postList?.appendChild(messageElement);
            
            // 3秒后移除
            setTimeout(() => {
                messageElement.remove();
            }, 3000);
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

    // 初始化API集成
    new RESTfulAPI();
    new GraphQLAPI();
})(); 