/**
 * 第三方服务集成示例
 */

(() => {
    // 地图服务集成
    class MapService {
        constructor() {
            this.mapContainer = document.getElementById('mapContainer');
            this.searchInput = document.getElementById('searchLocation');
            this.searchButton = document.getElementById('searchButton');
            this.map = null;
            this.marker = null;
            
            this.init();
        }

        init() {
            // 加载地图脚本
            this.loadMapScript()
                .then(() => this.initializeMap())
                .catch(error => this.handleError(error));

            // 绑定搜索事件
            this.searchButton?.addEventListener('click', () => this.searchLocation());
            this.searchInput?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchLocation();
                }
            });
        }

        // 加载地图脚本
        loadMapScript() {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
                script.async = true;
                script.defer = true;
                
                script.onload = resolve;
                script.onerror = () => reject(new Error('加载地图脚本失败'));
                
                document.head.appendChild(script);
            });
        }

        // 初始化地图
        initializeMap() {
            if (!this.mapContainer) return;

            // 默认位置（北京）
            const defaultPosition = { lat: 39.9042, lng: 116.4074 };
            
            // 创建地图
            this.map = new google.maps.Map(this.mapContainer, {
                center: defaultPosition,
                zoom: 12,
                styles: this.getMapStyles()
            });

            // 创建标记
            this.marker = new google.maps.Marker({
                position: defaultPosition,
                map: this.map,
                animation: google.maps.Animation.DROP
            });

            // 添加点击事件
            this.map.addListener('click', (event) => {
                this.updateMarkerPosition(event.latLng);
            });
        }

        // 搜索位置
        async searchLocation() {
            if (!this.searchInput?.value) return;

            try {
                const geocoder = new google.maps.Geocoder();
                const response = await new Promise((resolve, reject) => {
                    geocoder.geocode(
                        { address: this.searchInput.value },
                        (results, status) => {
                            if (status === 'OK') {
                                resolve(results[0]);
                            } else {
                                reject(new Error('地址查找失败'));
                            }
                        }
                    );
                });

                const location = response.geometry.location;
                this.updateMarkerPosition(location);
                this.map.setCenter(location);
                this.map.setZoom(15);
            } catch (error) {
                this.handleError(error);
            }
        }

        // 更新标记位置
        updateMarkerPosition(location) {
            this.marker.setPosition(location);
            this.marker.setAnimation(google.maps.Animation.DROP);
            
            // 显示信息窗口
            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div>
                        <h3>位置信息</h3>
                        <p>纬度: ${location.lat()}</p>
                        <p>经度: ${location.lng()}</p>
                    </div>
                `
            });
            
            infoWindow.open(this.map, this.marker);
        }

        // 获取地图样式
        getMapStyles() {
            return [
                {
                    featureType: 'water',
                    elementType: 'geometry',
                    stylers: [{ color: '#e9e9e9' }]
                },
                {
                    featureType: 'landscape',
                    elementType: 'geometry',
                    stylers: [{ color: '#f5f5f5' }]
                }
                // 添加更多样式...
            ];
        }

        // 处理错误
        handleError(error) {
            console.error('Map Error:', error);
            
            const errorMessage = document.createElement('div');
            errorMessage.className = 'map-error';
            errorMessage.textContent = error.message || '地图加载失败';
            
            this.mapContainer?.appendChild(errorMessage);
        }
    }

    // 支付服务集成
    class PaymentService {
        constructor() {
            this.alipayButton = document.getElementById('payWithAlipay');
            this.wechatButton = document.getElementById('payWithWechat');
            
            this.init();
        }

        init() {
            // 绑定支付事件
            this.alipayButton?.addEventListener('click', () => this.payWithAlipay());
            this.wechatButton?.addEventListener('click', () => this.payWithWechat());
        }

        // 支付宝支付
        async payWithAlipay() {
            try {
                // 创建订单
                const order = await this.createOrder('alipay');
                
                // 跳转到支付宝支付页面
                window.location.href = order.paymentUrl;
            } catch (error) {
                this.handleError(error);
            }
        }

        // 微信支付
        async payWithWechat() {
            try {
                // 创建订单
                const order = await this.createOrder('wechat');
                
                // 显示微信支付二维码
                this.showWechatQRCode(order.qrCodeUrl);
            } catch (error) {
                this.handleError(error);
            }
        }

        // 创建订单
        async createOrder(paymentMethod) {
            const response = await fetch('https://api.example.com/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: 0.01,
                    paymentMethod: paymentMethod
                })
            });

            if (!response.ok) {
                throw new Error('创建订单失败');
            }

            return response.json();
        }

        // 显示微信支付二维码
        showWechatQRCode(qrCodeUrl) {
            // 创建模态框
            const modal = document.createElement('div');
            modal.className = 'payment-modal';
            modal.innerHTML = `
                <div class="payment-modal-content">
                    <h3>微信支付</h3>
                    <img src="${qrCodeUrl}" alt="微信支付二维码">
                    <p>请使用微信扫描二维码完成支付</p>
                    <button class="close-modal">关闭</button>
                </div>
            `;

            // 添加关闭事件
            const closeButton = modal.querySelector('.close-modal');
            closeButton?.addEventListener('click', () => {
                modal.remove();
            });

            document.body.appendChild(modal);

            // 开始轮询支付状态
            this.pollPaymentStatus();
        }

        // 轮询支付状态
        pollPaymentStatus() {
            const pollInterval = setInterval(async () => {
                try {
                    const response = await fetch('https://api.example.com/payment/status');
                    const status = await response.json();

                    if (status.paid) {
                        clearInterval(pollInterval);
                        this.handlePaymentSuccess();
                    }
                } catch (error) {
                    console.error('Poll payment status error:', error);
                }
            }, 2000);

            // 5分钟后停止轮询
            setTimeout(() => {
                clearInterval(pollInterval);
            }, 5 * 60 * 1000);
        }

        // 处理支付成功
        handlePaymentSuccess() {
            // 移除支付模态框
            const modal = document.querySelector('.payment-modal');
            modal?.remove();

            // 显示成功消息
            const successMessage = document.createElement('div');
            successMessage.className = 'payment-success';
            successMessage.textContent = '支付成功！';
            
            document.body.appendChild(successMessage);

            // 3秒后移除消息
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
        }

        // 处理错误
        handleError(error) {
            console.error('Payment Error:', error);
            
            const errorMessage = document.createElement('div');
            errorMessage.className = 'payment-error';
            errorMessage.textContent = error.message || '支付失败，请稍后重试';
            
            document.body.appendChild(errorMessage);

            // 3秒后移除错误消息
            setTimeout(() => {
                errorMessage.remove();
            }, 3000);
        }
    }

    // 初始化服务
    new MapService();
    new PaymentService();
})(); 