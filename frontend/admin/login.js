document.addEventListener('DOMContentLoaded', function() {
    // DOM 元素
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember');
    const loginBtn = document.getElementById('login-btn');
    const errorMessage = document.getElementById('error-message');
    
    // 检查本地存储中是否有保存的用户名和密码
    const savedUsername = localStorage.getItem('admin_username');
    const savedPassword = localStorage.getItem('admin_password');
    
    if (savedUsername && savedPassword) {
        usernameInput.value = savedUsername;
        passwordInput.value = savedPassword;
        rememberCheckbox.checked = true;
    }
    
    // 登录按钮点击事件
    loginBtn.addEventListener('click', function() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        // 简单的表单验证
        if (!username || !password) {
            showError('请输入用户名和密码');
            return;
        }
        
        // 这里通常应该与后端API进行交互验证用户信息
        // 简单演示中，我们使用一个硬编码的管理员账户
        if (username === 'admin' && password === 'admin123') {
            // 如果选中了记住密码，则保存到本地存储
            if (rememberCheckbox.checked) {
                localStorage.setItem('admin_username', username);
                localStorage.setItem('admin_password', password);
            } else {
                localStorage.removeItem('admin_username');
                localStorage.removeItem('admin_password');
            }
            
            // 设置登录状态
            localStorage.setItem('admin_logged_in', 'true');
            
            // 登录成功，跳转到奖项管理页面
            window.location.href = 'prizes.html';
        } else {
            showError('用户名或密码错误');
            
            // 登录失败尝试次数记录
            let failedAttempts = parseInt(localStorage.getItem('login_failed_attempts') || '0');
            failedAttempts++;
            localStorage.setItem('login_failed_attempts', failedAttempts.toString());
            
            // 如果失败次数达到3次，禁用登录按钮一段时间
            if (failedAttempts >= 3) {
                loginBtn.disabled = true;
                showError('登录失败次数过多，请稍后再试');
                
                setTimeout(() => {
                    loginBtn.disabled = false;
                    localStorage.setItem('login_failed_attempts', '0');
                    errorMessage.textContent = '';
                }, 30000); // 30秒后重新启用
            }
        }
    });
    
    // 按回车键登录
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginBtn.click();
        }
    });
    
    // 显示错误消息
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.opacity = '1';
        
        // 错误消息震动效果
        errorMessage.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            errorMessage.style.animation = '';
        }, 500);
    }
    
    // 添加震动动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
}); 