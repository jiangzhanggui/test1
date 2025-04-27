document.addEventListener('DOMContentLoaded', function() {
    // 添加 admin-page 类到 body
    document.body.classList.add('admin-page');
    
    // 获取DOM元素
    const logoutBtn = document.getElementById('logout-btn');
    
    // 检查登录状态
    checkLoginStatus();
    
    // 退出登录事件
    logoutBtn.addEventListener('click', function() {
        // 确认框
        if (confirm('确定要退出登录吗？')) {
            // 清除登录状态
            localStorage.removeItem('admin_logged_in');
            // 跳转到登录页面
            window.location.href = 'login.html';
        }
    });
    
    // 检查是否登录
    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('admin_logged_in');
        if (!isLoggedIn) {
            // 未登录则跳转到登录页面
            window.location.href = 'login.html';
        }
    }
    
    // 模拟数据加载动画
    simulateLoading();
});

// 模拟数据加载动画
function simulateLoading() {
    const cards = document.querySelectorAll('.dashboard-card');
    const tables = document.querySelectorAll('.table');
    const charts = document.querySelectorAll('.prize-chart');
    
    // 添加加载骨架屏样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
        }
        .skeleton {
            background: linear-gradient(to right, #f0f0f0 8%, #e0e0e0 18%, #f0f0f0 33%);
            background-size: 1000px 100%;
            animation: shimmer 2s infinite linear;
        }
    `;
    document.head.appendChild(style);
    
    // 为卡片添加骨架屏效果
    cards.forEach(card => {
        const value = card.querySelector('.dashboard-card-value');
        const change = card.querySelector('.dashboard-card-change');
        
        value.textContent = '';
        change.textContent = '';
        value.classList.add('skeleton');
        change.classList.add('skeleton');
        
        value.style.height = '30px';
        change.style.height = '15px';
    });
    
    // 为表格添加骨架屏效果
    tables.forEach(table => {
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = '';
        
        for (let i = 0; i < 3; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < 5; j++) {
                const td = document.createElement('td');
                td.classList.add('skeleton');
                td.style.height = '20px';
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
    });
    
    // 为图表添加骨架屏效果
    charts.forEach(chart => {
        chart.querySelectorAll('.chart-segment').forEach(segment => {
            segment.classList.add('skeleton');
        });
    });
    
    // 2秒后移除骨架屏效果，显示实际数据
    setTimeout(() => {
        // 恢复卡片数据
        document.querySelector('.dashboard-card:nth-child(1) .dashboard-card-value').textContent = '1,234';
        document.querySelector('.dashboard-card:nth-child(1) .dashboard-card-change').innerHTML = '<i class="fas fa-arrow-up"></i> 12.5% 较昨日';
        
        document.querySelector('.dashboard-card:nth-child(2) .dashboard-card-value').textContent = '345';
        document.querySelector('.dashboard-card:nth-child(2) .dashboard-card-change').innerHTML = '<i class="fas fa-arrow-up"></i> 8.3% 较昨日';
        
        document.querySelector('.dashboard-card:nth-child(3) .dashboard-card-value').textContent = '27.9%';
        document.querySelector('.dashboard-card:nth-child(3) .dashboard-card-change').innerHTML = '<i class="fas fa-arrow-down"></i> 3.2% 较昨日';
        
        document.querySelector('.dashboard-card:nth-child(4) .dashboard-card-value').textContent = '5';
        document.querySelector('.dashboard-card:nth-child(4) .dashboard-card-change').innerHTML = '<i class="fas fa-equals"></i> 与昨日持平';
        
        // 恢复表格数据
        const tbody = document.querySelector('.table tbody');
        tbody.innerHTML = `
            <tr>
                <td>春节抽奖活动</td>
                <td>2025-01-20</td>
                <td>2025-02-10</td>
                <td><span class="status active">进行中</span></td>
                <td>523</td>
            </tr>
            <tr>
                <td>元旦抽奖活动</td>
                <td>2024-12-25</td>
                <td>2025-01-05</td>
                <td><span class="status completed">已结束</span></td>
                <td>412</td>
            </tr>
            <tr>
                <td>感恩节抽奖活动</td>
                <td>2024-11-20</td>
                <td>2024-11-30</td>
                <td><span class="status completed">已结束</span></td>
                <td>299</td>
            </tr>
        `;
        
        // 移除所有骨架屏效果
        document.querySelectorAll('.skeleton').forEach(el => {
            el.classList.remove('skeleton');
            el.style.height = '';
        });
    }, 2000);
} 