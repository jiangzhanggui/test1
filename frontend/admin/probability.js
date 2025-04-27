document.addEventListener('DOMContentLoaded', function() {
    // 添加 admin-page 类到 body
    document.body.classList.add('admin-page');
    
    // 获取DOM元素
    const logoutBtn = document.getElementById('logout-btn');
    const chartContainer = document.getElementById('chart-container');
    const probabilityInputs = document.getElementById('probability-inputs');
    const totalPercentage = document.getElementById('total-percentage');
    const statusIndicator = document.getElementById('status-indicator');
    const saveProbabilityBtn = document.getElementById('save-probability-btn');
    const resetProbabilityBtn = document.getElementById('reset-probability-btn');
    
    // 检查登录状态
    checkLoginStatus();
    
    // 退出登录事件
    logoutBtn.addEventListener('click', function() {
        if (confirm('确定要退出登录吗？')) {
            localStorage.removeItem('admin_logged_in');
            window.location.href = 'login.html';
        }
    });
    
    // 加载奖项数据并初始化页面
    loadPrizesAndInitialize();
    
    // 保存概率设置
    saveProbabilityBtn.addEventListener('click', function() {
        if (!validateTotalPercentage()) {
            showNotification('概率总和必须等于100%', 'error');
            return;
        }
        
        saveProbabilitySettings();
        showNotification('概率设置已保存', 'success');
    });
    
    // 重置概率设置
    resetProbabilityBtn.addEventListener('click', function() {
        loadPrizesAndInitialize();
        showNotification('概率设置已重置', 'success');
    });
    
    // 加载奖项数据并初始化界面
    function loadPrizesAndInitialize() {
        // 从本地存储获取奖项
        let prizes = JSON.parse(localStorage.getItem('prizes'));
        
        // 如果没有奖项，初始化默认奖项
        if (!prizes || prizes.length === 0) {
            prizes = [
                { id: 1, level: '一等奖', name: 'iPhone 13 Pro Max', probability: 0.1, color: '#e74c3c', icon: 'trophy', status: 'active' },
                { id: 2, level: '二等奖', name: '小米手环', probability: 0.2, color: '#3498db', icon: 'gift', status: 'active' },
                { id: 3, level: '三等奖', name: '电影票两张', probability: 0.3, color: '#2ecc71', icon: 'ticket-alt', status: 'active' },
                { id: 4, level: '四等奖', name: '星巴克咖啡券', probability: 0.4, color: '#f1c40f', icon: 'coffee', status: 'active' }
            ];
            localStorage.setItem('prizes', JSON.stringify(prizes));
        }
        
        // 只获取启用状态的奖项
        prizes = prizes.filter(prize => prize.status === 'active');
        
        // 初始化饼图
        initializeChart(prizes);
        
        // 初始化概率输入表单
        initializeProbabilityInputs(prizes);
        
        // 更新概率总和
        updateTotalPercentage();
    }
    
    // 初始化饼图
    function initializeChart(prizes) {
        // 清空图表容器
        chartContainer.innerHTML = '';
        
        // 计算总角度（完整的圆形为360度）
        const totalDegrees = 360;
        let startDegree = 0;
        
        // 为每个奖项创建一个扇形
        prizes.forEach(prize => {
            // 计算扇形角度
            const degree = prize.probability * totalDegrees;
            
            // 创建扇形元素
            const segment = document.createElement('div');
            segment.className = 'chart-segment';
            segment.style.backgroundColor = prize.color;
            
            // 使用conic-gradient实现扇形
            chartContainer.style.background = '';
            
            // 添加到容器
            chartContainer.appendChild(segment);
            
            // 更新开始角度
            startDegree += degree;
        });
        
        // 设置容器的背景为分段的conic-gradient
        updateChartBackground(prizes);
    }
    
    // 更新饼图背景
    function updateChartBackground(prizes) {
        let gradientString = 'conic-gradient(';
        let startPercentage = 0;
        
        prizes.forEach((prize, index) => {
            const endPercentage = startPercentage + prize.probability;
            
            if (index > 0) {
                gradientString += ', ';
            }
            
            gradientString += `${prize.color} ${startPercentage * 100}% ${endPercentage * 100}%`;
            
            startPercentage = endPercentage;
        });
        
        gradientString += ')';
        chartContainer.style.background = gradientString;
    }
    
    // 初始化概率输入表单
    function initializeProbabilityInputs(prizes) {
        // 清空输入容器
        probabilityInputs.innerHTML = '';
        
        // 为每个奖项创建一个输入行
        prizes.forEach(prize => {
            // 创建输入行
            const inputItem = document.createElement('div');
            inputItem.className = 'probability-input-item';
            inputItem.setAttribute('data-id', prize.id);
            
            // 创建标签
            const label = document.createElement('div');
            label.className = 'probability-input-label';
            label.innerHTML = `
                <span class="probability-input-color" style="background-color: ${prize.color};"></span>
                <span>${prize.level} (${prize.name})</span>
            `;
            
            // 创建输入控件
            const inputControl = document.createElement('div');
            inputControl.className = 'probability-input-control';
            
            // 创建滑块输入
            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = '0';
            slider.max = '100';
            slider.step = '0.1';
            slider.value = (prize.probability * 100).toFixed(1);
            slider.id = `probability-slider-${prize.id}`;
            
            // 创建数字输入
            const number = document.createElement('input');
            number.type = 'number';
            number.min = '0';
            number.max = '100';
            number.step = '0.1';
            number.value = (prize.probability * 100).toFixed(1);
            number.id = `probability-number-${prize.id}`;
            
            // 添加事件监听器
            slider.addEventListener('input', function() {
                number.value = this.value;
                updateTotalPercentage();
                updatePrizeChart();
            });
            
            number.addEventListener('input', function() {
                slider.value = this.value;
                updateTotalPercentage();
                updatePrizeChart();
            });
            
            // 组装输入控件
            inputControl.appendChild(slider);
            inputControl.appendChild(number);
            
            // 组装输入行
            inputItem.appendChild(label);
            inputItem.appendChild(inputControl);
            
            // 添加到容器
            probabilityInputs.appendChild(inputItem);
        });
    }
    
    // 更新概率总和
    function updateTotalPercentage() {
        let total = 0;
        
        // 获取所有概率输入框
        const numberInputs = document.querySelectorAll('input[type="number"]');
        
        // 计算总和
        numberInputs.forEach(input => {
            total += parseFloat(input.value || 0);
        });
        
        // 更新显示
        totalPercentage.textContent = total.toFixed(1);
        
        // 验证总和是否为100%
        if (Math.abs(total - 100) < 0.1) {
            statusIndicator.textContent = '合法';
            statusIndicator.className = 'status active';
            totalPercentage.parentElement.classList.remove('error');
        } else {
            statusIndicator.textContent = '不合法';
            statusIndicator.className = 'status cancelled';
            totalPercentage.parentElement.classList.add('error');
        }
        
        return total;
    }
    
    // 验证概率总和是否为100%
    function validateTotalPercentage() {
        const total = updateTotalPercentage();
        return Math.abs(total - 100) < 0.1;
    }
    
    // 更新饼图
    function updatePrizeChart() {
        // 获取所有概率输入框
        const inputItems = document.querySelectorAll('.probability-input-item');
        
        // 构建临时奖项数据
        const tempPrizes = [];
        
        inputItems.forEach(item => {
            const prizeId = parseInt(item.getAttribute('data-id'));
            const probability = parseFloat(item.querySelector('input[type="number"]').value) / 100;
            
            // 从本地存储获取完整的奖项数据
            const allPrizes = JSON.parse(localStorage.getItem('prizes'));
            const prize = allPrizes.find(p => p.id === prizeId);
            
            if (prize) {
                tempPrizes.push({
                    ...prize,
                    probability
                });
            }
        });
        
        // 更新饼图背景
        updateChartBackground(tempPrizes);
    }
    
    // 保存概率设置
    function saveProbabilitySettings() {
        // 获取所有概率输入框
        const inputItems = document.querySelectorAll('.probability-input-item');
        
        // 从本地存储获取完整的奖项数据
        let allPrizes = JSON.parse(localStorage.getItem('prizes'));
        
        // 更新奖项概率
        inputItems.forEach(item => {
            const prizeId = parseInt(item.getAttribute('data-id'));
            const probability = parseFloat(item.querySelector('input[type="number"]').value) / 100;
            
            // 查找并更新对应奖项
            const prizeIndex = allPrizes.findIndex(p => p.id === prizeId);
            if (prizeIndex !== -1) {
                allPrizes[prizeIndex].probability = probability;
            }
        });
        
        // 保存回本地存储
        localStorage.setItem('prizes', JSON.stringify(allPrizes));
    }
    
    // 检查是否登录
    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('admin_logged_in');
        if (!isLoggedIn) {
            window.location.href = 'login.html';
        }
    }
    
    // 显示通知
    function showNotification(message, type) {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // 将通知添加到页面
        document.body.appendChild(notification);
        
        // 添加显示动画
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // 自动关闭通知
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // 添加通知样式
    const notificationStyle = document.createElement('style');
    notificationStyle.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 350px;
            background-color: white;
            border-radius: 5px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
            padding: 15px;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            z-index: 9999;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification.success {
            border-left: 4px solid #2ecc71;
        }
        
        .notification.error {
            border-left: 4px solid #e74c3c;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
        }
        
        .notification-content i {
            margin-right: 10px;
            font-size: 1.2rem;
        }
        
        .notification.success i {
            color: #2ecc71;
        }
        
        .notification.error i {
            color: #e74c3c;
        }
    `;
    document.head.appendChild(notificationStyle);
}); 