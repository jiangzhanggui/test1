document.addEventListener('DOMContentLoaded', function() {
    // 添加 admin-page 类到 body
    document.body.classList.add('admin-page');
    
    // 获取DOM元素
    const logoutBtn = document.getElementById('logout-btn');
    const addPrizeBtn = document.getElementById('add-prize-btn');
    const prizeModal = document.getElementById('prize-modal');
    const closePrizeModal = document.getElementById('close-prize-modal');
    const cancelBtn = document.getElementById('cancel-btn');
    const savePrizeBtn = document.getElementById('save-prize-btn');
    const prizeList = document.getElementById('prize-list');
    const modalTitle = document.getElementById('modal-title');
    
    const prizeIdInput = document.getElementById('prize-id');
    const prizeLevelInput = document.getElementById('prize-level');
    const prizeNameInput = document.getElementById('prize-name');
    const prizeProbabilityInput = document.getElementById('prize-probability');
    const prizeColorInput = document.getElementById('prize-color');
    const prizeIconInput = document.getElementById('prize-icon');
    const prizeStatusInput = document.getElementById('prize-status');
    const iconPreview = document.getElementById('icon-preview');
    
    const confirmModal = document.getElementById('confirm-modal');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    
    // 检查登录状态
    checkLoginStatus();
    
    // 初始化数据
    loadPrizes();
    
    // 添加概率监控显示
    addProbabilityMonitor();
    
    // 退出登录事件
    logoutBtn.addEventListener('click', function() {
        if (confirm('确定要退出登录吗？')) {
            localStorage.removeItem('admin_logged_in');
            // 直接跳转到抽奖首页
            window.location.href = '../index.html';
        }
    });
    
    // 添加奖项按钮点击事件
    addPrizeBtn.addEventListener('click', function() {
        resetForm();
        modalTitle.textContent = '添加奖项';
        prizeModal.style.display = 'flex';
    });
    
    // 关闭模态窗口
    closePrizeModal.addEventListener('click', function() {
        prizeModal.style.display = 'none';
    });
    
    cancelBtn.addEventListener('click', function() {
        prizeModal.style.display = 'none';
    });
    
    // 取消删除
    cancelDeleteBtn.addEventListener('click', function() {
        confirmModal.style.display = 'none';
    });
    
    // 确认删除事件
    confirmDeleteBtn.addEventListener('click', function() {
        const prizeId = parseInt(this.getAttribute('data-id'));
        deletePrize(prizeId);
        confirmModal.style.display = 'none';
    });
    
    // 使用事件委托处理编辑和删除按钮点击
    document.addEventListener('click', function(e) {
        // 处理编辑按钮点击
        if (e.target.closest('.edit-btn')) {
            const btn = e.target.closest('.edit-btn');
            const prizeId = parseInt(btn.getAttribute('data-id'));
            editPrize(prizeId);
        }
        
        // 处理删除按钮点击
        if (e.target.closest('.delete-btn')) {
            const btn = e.target.closest('.delete-btn');
            const prizeId = parseInt(btn.getAttribute('data-id'));
            confirmDeleteBtn.setAttribute('data-id', prizeId);
            confirmModal.style.display = 'flex';
        }
    });
    
    // 保存奖项
    savePrizeBtn.addEventListener('click', function() {
        if (!validateForm()) {
            return; // 只有基本表单验证失败才阻止保存
        }
        
        try {
            // 验证总概率是否为100%，但只提示不阻止保存
            checkTotalProbability();
            
            const prizeId = prizeIdInput.value;
            const prizeData = {
                id: prizeId ? parseInt(prizeId) : Date.now(),
                level: prizeLevelInput.value,
                name: prizeNameInput.value,
                description: prizeNameInput.value,
                probability: parseFloat(prizeProbabilityInput.value) / 100,
                color: prizeColorInput.value,
                icon: prizeIconInput.value,
                status: prizeStatusInput.value
            };
            
            // 获取现有奖项
            let prizes = JSON.parse(localStorage.getItem('prizes') || '[]');
            
            if (prizeId) {
                // 更新现有奖项
                const index = prizes.findIndex(p => p.id === parseInt(prizeId));
                if (index !== -1) {
                    prizes[index] = prizeData;
                    showNotification('奖项更新成功', 'success');
                }
            } else {
                // 添加新奖项
                prizes.push(prizeData);
                showNotification('奖项添加成功', 'success');
            }
            
            // 保存到本地存储
            localStorage.setItem('prizes', JSON.stringify(prizes));
            
            // 重新加载奖项列表
            loadPrizes();
            
            // 关闭模态窗口
            prizeModal.style.display = 'none';
        } catch (error) {
            console.error('保存奖项时出错:', error);
            showNotification('保存失败，请重试', 'error');
        }
    });
    
    // 图标预览
    prizeIconInput.addEventListener('change', function() {
        iconPreview.className = `fas fa-${this.value}`;
    });
    
    // 加载奖项数据
    function loadPrizes() {
        // 清空列表
        prizeList.innerHTML = '';
        
        // 从本地存储获取奖项
        let prizes = JSON.parse(localStorage.getItem('prizes'));
        
        // 如果没有奖项，初始化默认奖项
        if (!prizes || prizes.length === 0) {
            prizes = [
                { id: 1, level: '一等奖', name: '一等奖', description: '价值1000元大奖', probability: 0.1, color: '#e74c3c', icon: 'trophy', status: 'active' },
                { id: 2, level: '二等奖', name: '二等奖', description: '精美礼品', probability: 0.2, color: '#3498db', icon: 'gift', status: 'active' },
                { id: 3, level: '三等奖', name: '三等奖', description: '现金红包', probability: 0.3, color: '#2ecc71', icon: 'envelope', status: 'active' },
                { id: 4, level: '四等奖', name: '四等奖', description: '优惠券礼包', probability: 0.4, color: '#f1c40f', icon: 'ticket-alt', status: 'active' }
            ];
            localStorage.setItem('prizes', JSON.stringify(prizes));
        }
        
        // 遍历奖项并添加到表格
        prizes.forEach((prize) => {
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td>${prize.level}</td>
                <td>
                    <div class="prize-name-display">
                        <i class="fas fa-${prize.icon}" style="color: ${prize.color};"></i>
                        <span>${prize.description}</span>
                    </div>
                </td>
                <td>${(prize.probability * 100).toFixed(1)}%</td>
                <td>
                    <span class="status ${prize.status === 'active' ? 'active' : 'cancelled'}">
                        ${prize.status === 'active' ? '启用' : '禁用'}
                    </span>
                </td>
                <td class="actions">
                    <button class="btn btn-sm btn-primary edit-btn" data-id="${prize.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${prize.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            prizeList.appendChild(tr);
        });
    }
    
    // 编辑奖项
    function editPrize(prizeId) {
        const prizes = JSON.parse(localStorage.getItem('prizes'));
        const prize = prizes.find(p => p.id === prizeId);
        
        if (prize) {
            prizeIdInput.value = prize.id;
            prizeLevelInput.value = prize.level;
            prizeNameInput.value = prize.description;
            prizeProbabilityInput.value = (prize.probability * 100).toFixed(1);
            prizeColorInput.value = prize.color;
            prizeIconInput.value = prize.icon;
            prizeStatusInput.value = prize.status;
            
            // 更新图标预览
            iconPreview.className = `fas fa-${prize.icon}`;
            
            modalTitle.textContent = '编辑奖项';
            prizeModal.style.display = 'flex';
        }
    }
    
    // 删除奖项
    function deletePrize(prizeId) {
        let prizes = JSON.parse(localStorage.getItem('prizes'));
        prizes = prizes.filter(p => p.id !== prizeId);
        localStorage.setItem('prizes', JSON.stringify(prizes));
        
        loadPrizes();
        showNotification('奖项已删除', 'success');
    }
    
    // 重置表单
    function resetForm() {
        prizeIdInput.value = '';
        prizeLevelInput.value = '';
        prizeNameInput.value = '';
        prizeProbabilityInput.value = '';
        prizeColorInput.value = '#e74c3c';
        prizeIconInput.value = 'trophy';
        prizeStatusInput.value = 'active';
        
        // 更新图标预览
        iconPreview.className = 'fas fa-trophy';
    }
    
    // 表单验证
    function validateForm() {
        if (!prizeLevelInput.value.trim()) {
            showNotification('请输入奖项等级', 'error');
            return false;
        }
        
        if (!prizeNameInput.value.trim()) {
            showNotification('请输入奖品名称', 'error');
            return false;
        }
        
        const probability = parseFloat(prizeProbabilityInput.value);
        if (isNaN(probability)) {
            showNotification('请输入有效的数字', 'error');
            return false;
        }
        
        if (probability < 0 || probability > 100) {
            showNotification('概率必须为0%至100%之间', 'error');
            return false;
        }
        
        return true;
    }
    
    // 检查概率总和是否为100%，仅显示提示不阻止保存
    function checkTotalProbability() {
        try {
            // 获取当前所有奖项
            let prizes = JSON.parse(localStorage.getItem('prizes') || '[]');
            
            // 如果是编辑现有奖项，从列表中移除当前编辑的奖项
            const currentPrizeId = prizeIdInput.value;
            if (currentPrizeId) {
                prizes = prizes.filter(p => p.id !== parseInt(currentPrizeId));
            }
            
            // 计算所有现有奖项的概率总和（不包括当前编辑的奖项）
            let totalProbability = 0;
            prizes.forEach(prize => {
                if (prize.status === 'active') {
                    totalProbability += prize.probability;
                }
            });
            
            // 加上当前编辑的奖项概率
            const currentProbability = parseFloat(prizeProbabilityInput.value) / 100;
            totalProbability += currentProbability;
            
            // 检查总和是否为1（100%）
            if (Math.abs(totalProbability - 1) > 0.001) { // 允许0.1%的误差
                const formattedTotal = (totalProbability * 100).toFixed(1);
                showNotification(`概率总和建议为100%，当前总和为${formattedTotal}%`, 'warning');
            }
        } catch (error) {
            console.warn('检查概率总和时出错:', error);
            // 出错也不影响保存
        }
    }
    
    // 检查是否登录
    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('admin_logged_in');
        if (!isLoggedIn) {
            window.location.href = '../index.html';
        }
    }
    
    // 显示通知
    function showNotification(message, type) {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'exclamation-circle'}"></i>
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
    
    // 添加概率监控显示
    function addProbabilityMonitor() {
        // 创建概率总和显示元素
        const probabilityMonitor = document.createElement('div');
        probabilityMonitor.id = 'probability-monitor';
        probabilityMonitor.className = 'probability-monitor';
        probabilityMonitor.innerHTML = '<span>概率总和：</span><span class="total-value">0%</span>';
        
        // 查找概率输入字段的父元素
        const probabilityFormGroup = prizeProbabilityInput.closest('.form-group');
        // 将监控元素插入到概率输入字段后
        probabilityFormGroup.appendChild(probabilityMonitor);
        
        // 监听概率输入变化
        prizeProbabilityInput.addEventListener('input', updateProbabilityTotal);
        
        // 监听模态窗口显示
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'style' && 
                    prizeModal.style.display === 'flex') {
                    updateProbabilityTotal();
                }
            });
        });
        observer.observe(prizeModal, { attributes: true });
        
        // 初次更新概率总和
        updateProbabilityTotal();
    }
    
    // 更新概率总和显示
    function updateProbabilityTotal() {
        const totalValueElement = document.querySelector('#probability-monitor .total-value');
        if (!totalValueElement) return;
        
        // 获取当前所有奖项
        let prizes = JSON.parse(localStorage.getItem('prizes') || '[]');
        
        // 如果是编辑现有奖项，从列表中移除当前编辑的奖项
        const currentPrizeId = prizeIdInput.value;
        if (currentPrizeId) {
            prizes = prizes.filter(p => p.id !== parseInt(currentPrizeId));
        }
        
        // 计算所有现有奖项的概率总和（不包括当前编辑的奖项）
        let totalProbability = 0;
        prizes.forEach(prize => {
            if (prize.status === 'active') {
                totalProbability += prize.probability;
            }
        });
        
        // 加上当前编辑的奖项概率
        const currentProbability = parseFloat(prizeProbabilityInput.value) / 100 || 0;
        totalProbability += currentProbability;
        
        // 更新显示
        const formattedTotal = (totalProbability * 100).toFixed(1);
        totalValueElement.textContent = `${formattedTotal}%`;
        
        // 根据总和是否为100%设置样式
        if (Math.abs(totalProbability - 1) > 0.001) {
            totalValueElement.classList.add('warning');
        } else {
            totalValueElement.classList.remove('warning');
        }
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
            border-radius: 6px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
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
        
        .notification.warning {
            border-left: 4px solid #f39c12;
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
        
        .notification.warning i {
            color: #f39c12;
        }
        
        .prize-name-display {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .prize-name-display i {
            font-size: 1.2rem;
        }
        
        .icon-preview {
            margin-top: 10px;
            font-size: 2rem;
            color: #3498db;
            text-align: center;
        }
        
        .btn-sm {
            padding: 5px 10px;
            font-size: 0.8rem;
        }
        
        /* 确保模态窗口显示正确 */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }
        
        .modal.show {
            display: flex;
        }
    `;
    document.head.appendChild(notificationStyle);
    
    // 添加样式
    const additionalStyle = document.createElement('style');
    additionalStyle.textContent = `
        .probability-monitor {
            margin-top: 8px;
            font-size: 0.9rem;
            display: flex;
            justify-content: space-between;
            color: #666;
        }
        
        .probability-monitor .total-value {
            font-weight: bold;
        }
        
        .probability-monitor .total-value.warning {
            color: #f39c12;
        }
    `;
    document.head.appendChild(additionalStyle);
}); 