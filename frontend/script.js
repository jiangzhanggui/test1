// 获取奖项数据
function getPrizes() {
    // 尝试从localStorage获取奖项数据
    const storedPrizes = localStorage.getItem('prizes');
    
    // 如果存在数据则使用，否则使用默认奖项
    if (storedPrizes) {
        return JSON.parse(storedPrizes);
    } else {
        // 默认奖项
        const defaultPrizes = [
            { id: 1, level: '一等奖', name: '一等奖', description: '价值1000元大奖', probability: 0.1, color: '#e74c3c', icon: 'trophy', status: 'active' },
            { id: 2, level: '二等奖', name: '二等奖', description: '精美礼品', probability: 0.2, color: '#3498db', icon: 'gift', status: 'active' },
            { id: 3, level: '三等奖', name: '三等奖', description: '现金红包', probability: 0.3, color: '#2ecc71', icon: 'envelope', status: 'active' },
            { id: 4, level: '四等奖', name: '四等奖', description: '优惠券礼包', probability: 0.4, color: '#f1c40f', icon: 'ticket-alt', status: 'active' }
        ];
        
        // 保存默认数据到localStorage
        localStorage.setItem('prizes', JSON.stringify(defaultPrizes));
        
        return defaultPrizes;
    }
}

// DOM 元素
const lotteryWheel = document.getElementById('lottery-wheel');
const startBtn = document.getElementById('start-btn');
const winModal = document.getElementById('win-modal');
const closeModal = document.querySelector('.close-modal');
const confirmBtn = document.getElementById('confirm-btn');
const prizeName = document.getElementById('prize-name');
const prizeDescription = document.getElementById('prize-description');

// 全局奖项数据变量
let prizes = [];
let isSpinning = false; // 添加标记抽奖状态的变量
const spinDuration = 4; // 转盘旋转时间，单位秒

// 初始化转盘
function initLotteryWheel() {
    // 获取最新奖项数据
    prizes = getPrizes();
    
    // 筛选出启用状态的奖项
    const activePrizes = prizes.filter(prize => prize.status === 'active');
    
    // 如果没有启用的奖项，显示提示
    if (activePrizes.length === 0) {
        alert('没有可用的奖项，请在管理后台添加并启用奖项。');
        return;
    }
    
    // 计算每个扇形占用的角度
    const sectorAngle = 360 / activePrizes.length;
    
    // 清空转盘
    lotteryWheel.innerHTML = '';
    
    // 输出转盘初始化信息
    console.log("转盘初始化:", activePrizes.length, "个扇区");
    console.log("每个扇区角度:", sectorAngle, "度");
    
    // 添加扇形区域
    activePrizes.forEach((prize, index) => {
        // 创建扇区元素
        const wheelItem = document.createElement('div');
        wheelItem.className = 'wheel-item';
        
        // 计算当前扇区的起始角度和结束角度
        const startAngle = index * sectorAngle;
        const endAngle = (index + 1) * sectorAngle;
        
        // 根据索引分配颜色，如果奖项有自定义颜色则使用自定义颜色
        if (prize.color) {
            wheelItem.style.backgroundColor = prize.color;
        } else {
            // 使用默认颜色方案
            const colorIndex = (index % 12) + 1; // 使用12种颜色循环
            wheelItem.classList.add(`wheel-color-${colorIndex}`);
        }
        
        // 使用CSS clip-path实现精确的扇形
        // 计算扇形的半径（基于转盘宽度的50%）
        const radius = 50;
        
        // 创建clip-path路径数组
        // 从中心点开始，到扇区起始角度点，然后画弧到扇区结束角度点，最后回到中心点
        const clipPathPoints = [];
        
        // 中心点
        clipPathPoints.push(`50% 50%`);
        
        // 计算弧线点的数量 - 使用更多的点以获得更平滑的弧线
        const arcPoints = Math.max(1, Math.floor(sectorAngle / 5));
        
        // 添加起始点
        const startX = 50 + radius * Math.cos(startAngle * Math.PI / 180);
        const startY = 50 + radius * Math.sin(startAngle * Math.PI / 180);
        clipPathPoints.push(`${startX}% ${startY}%`);
        
        // 添加弧线上的点
        for (let i = 1; i <= arcPoints; i++) {
            const angle = startAngle + (i * sectorAngle / arcPoints);
            const angleRad = angle * Math.PI / 180;
            const x = 50 + radius * Math.cos(angleRad);
            const y = 50 + radius * Math.sin(angleRad);
            clipPathPoints.push(`${x}% ${y}%`);
        }
        
        // 设置clip-path
        wheelItem.style.clipPath = `polygon(${clipPathPoints.join(', ')})`;
        
        // 创建内容容器
        const wheelItemContent = document.createElement('div');
        wheelItemContent.className = 'wheel-item-content';
        
        // 计算文本位置角度（位于扇区中心）
        const textAngle = startAngle + sectorAngle / 2;
        const textRadius = radius * 0.7; // 文本距离中心的距离
        
        // 计算文本位置
        const textPosX = 50 + textRadius * Math.cos(textAngle * Math.PI / 180);
        const textPosY = 50 + textRadius * Math.sin(textAngle * Math.PI / 180);
        
        // 设置文本位置
        wheelItemContent.style.left = `${textPosX}%`;
        wheelItemContent.style.top = `${textPosY}%`;
        
        // 文本旋转角度计算 - 采用更简单的方法
        // 直接使用扇区的中心角度，加上90度使文本底部朝向圆心
        let textRotationAngle = textAngle + 90;
        
        // 应用旋转
        wheelItemContent.style.transform = `translate(-50%, -50%) rotate(${textRotationAngle}deg)`;
        
        // 根据奖项数量调整内容的显示方式
        if (activePrizes.length > 6) {
            wheelItemContent.style.fontSize = '0.9rem';  // 减小字体大小
        }
        
        // 处理级别文字，如果过长则截断
        let levelText = prize.level;
        if (levelText.length > 6) {
            levelText = levelText.substring(0, 6);
        }
        
        // 设置内容HTML
        if (prize.icon === 'envelope') {
            // 使用自定义红包图标
            wheelItemContent.innerHTML = `
                <div class="custom-hongbao"></div>
                <div>${levelText}</div>
            `;
        } else {
            // 使用Font Awesome图标
            wheelItemContent.innerHTML = `
                <i class="fas fa-${prize.icon}" style="color: ${getIconColor(prize.icon)};"></i>
                <div>${levelText}</div>
            `;
        }
        
        wheelItem.appendChild(wheelItemContent);
        lotteryWheel.appendChild(wheelItem);
    });
    
    // 更新奖品列表显示
    updatePrizeList(activePrizes);
}

// 更新奖品列表显示
function updatePrizeList(activePrizes) {
    const prizeList = document.querySelector('.prize-list');
    if (prizeList) {
        prizeList.innerHTML = '';
        
        activePrizes.forEach(prize => {
            const prizeItem = document.createElement('div');
            prizeItem.className = 'prize-item';
            
            if (prize.icon === 'envelope') {
                // 使用自定义红包图标
                prizeItem.innerHTML = `
                    <div class="prize-icon"><div class="custom-hongbao"></div></div>
                    <div class="prize-details">
                        <h3>${prize.level}</h3>
                        <p>${prize.description || '奖品描述'}</p>
                    </div>
                `;
            } else {
                // 使用Font Awesome图标
                prizeItem.innerHTML = `
                    <div class="prize-icon"><i class="fas fa-${prize.icon}" style="color: ${getIconColor(prize.icon)}"></i></div>
                    <div class="prize-details">
                        <h3>${prize.level}</h3>
                        <p>${prize.description || '奖品描述'}</p>
                    </div>
                `;
            }
            
            prizeList.appendChild(prizeItem);
        });
    }
}

// 根据概率获取中奖结果
function getRandomPrize() {
    // 获取最新奖项数据并过滤掉概率为0的奖项
    const activePrizes = prizes.filter(prize => prize.status === 'active' && prize.probability > 0);
    
    // 如果没有有效奖项（所有概率都为0），返回第一个活动奖项
    if (activePrizes.length === 0) {
        const anyActivePrize = prizes.filter(prize => prize.status === 'active');
        if (anyActivePrize.length > 0) {
            return anyActivePrize[0];
        }
        return null; // 如果没有活动奖项，返回null
    }
    
    // 验证奖项总概率
    let totalProbability = 0;
    activePrizes.forEach(prize => {
        totalProbability += prize.probability;
    });
    
    // 如果总概率不等于1，调整概率
    if (Math.abs(totalProbability - 1) > 0.01) {
        const factor = 1 / totalProbability;
        activePrizes.forEach(prize => {
            prize.adjustedProbability = prize.probability * factor;
        });
    } else {
        activePrizes.forEach(prize => {
            prize.adjustedProbability = prize.probability;
        });
    }
    
    const random = Math.random();
    let probabilitySum = 0;
    
    for (let i = 0; i < activePrizes.length; i++) {
        probabilitySum += activePrizes[i].adjustedProbability;
        if (random < probabilitySum) {
            return activePrizes[i];
        }
    }
    
    // 默认返回最后一个奖项
    return activePrizes[activePrizes.length - 1];
}

// 开始抽奖
function startLottery() {
    // 停止当前抽奖
    stopCurrentLottery();
    
    // 过滤出有效奖项
    const activePrizes = prizes.filter(prize => prize.status === 'active');
    
    // 检查是否有有效奖项
    if (activePrizes.length === 0) {
        alert('没有可用的奖项，请先设置奖项！');
        startBtn.disabled = false;
        startBtn.textContent = '开始抽奖';
        return;
    }
    
    // 设置抽奖状态
    isSpinning = true;
    
    // 记录转盘上每个扇区对应的奖项
    // 这确保我们知道转盘上每个位置对应的具体奖项
    const wheelPrizeMap = [];
    activePrizes.forEach((prize, index) => {
        wheelPrizeMap.push({ 
            index: index, 
            prizeId: prize.id, 
            level: prize.level 
        });
    });
    
    console.log("转盘奖项映射:", wheelPrizeMap);
    
    // 确定中奖结果
    const winPrize = getRandomPrize();
    console.log("随机选中的奖项:", winPrize);
    
    // 在转盘上找到该奖项对应的扇区索引
    // 注意：转盘上的扇区索引是按照DOM中的顺序，这可能与prizes数组不同
    const winningWheelItem = wheelPrizeMap.find(item => item.prizeId === winPrize.id);
    
    if (!winningWheelItem) {
        console.error("错误：找不到中奖奖项在转盘上的位置");
        isSpinning = false;
        startBtn.disabled = false;
        startBtn.textContent = '开始抽奖';
        return;
    }
    
    const winningIndex = winningWheelItem.index;
    console.log(`选中的中奖索引: ${winningIndex}, 奖项级别: ${winningWheelItem.level}`);
    
    // 计算每个扇区的角度大小
    const sectorAngle = 360 / activePrizes.length;
    
    // 计算中奖扇区的中心角度 - 扇区是从0度开始顺时针排列的
    // 指针在顶部（270度位置），所以计算最终角度时需要考虑这一点
    const prizeCenterAngle = winningIndex * sectorAngle + sectorAngle / 2;
    
    // 计算指针指向扇区中心所需的旋转角度
    // 由于转盘顺时针旋转，而我们想让指针（在270度位置）指向中奖扇区中心
    // 需要将转盘旋转到 (270 - prizeCenterAngle) 度的位置，并保持为正数
    let targetAngle = (270 - prizeCenterAngle) % 360;
    if (targetAngle < 0) targetAngle += 360;
    
    console.log(`
        扇区数量: ${activePrizes.length}
        每个扇区角度: ${sectorAngle}°
        中奖扇区中心角度: ${prizeCenterAngle}°
        目标停止角度: ${targetAngle}°
    `);
    
    // 计算最终旋转角度（确保至少旋转5圈以上，再加上目标角度）
    const extraRotations = 5 * 360; // 额外旋转5圈
    const finalRotation = extraRotations + targetAngle;
    
    console.log(`最终旋转角度: ${finalRotation}°`);
    
    // 开始旋转转盘
    lotteryWheel.style.transition = `transform ${spinDuration}s cubic-bezier(0.18, 0.89, 0.32, 1)`;
    lotteryWheel.style.transform = `rotate(${finalRotation}deg)`;
    
    // 转盘停止后显示中奖信息，确保显示的奖项与指针指向的一致
    setTimeout(() => {
        console.log(`转盘停止在角度: ${finalRotation % 360}°`);
        console.log(`显示中奖结果: ${winPrize.level}`);
        isSpinning = false;
        
        // 播放中奖音效
        const audio = document.getElementById('win-audio');
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log('播放音效失败', e));
        }
        
        // 添加震动效果
        if (navigator.vibrate) {
            navigator.vibrate(200);
        }
        
        // 显示中奖结果
        displayWinResult(winPrize);
        
    }, spinDuration * 1000 + 200); // 增加一点延迟确保转盘完全停止
}

// 显示中奖信息
function showWinPrize(prize) {
    prizeName.textContent = prize.level;
    prizeDescription.textContent = prize.description;
    
    // 设置中奖图标
    const prizeAnimation = document.querySelector('.prize-animation');
    
    if (prize.icon === 'envelope') {
        // 使用自定义红包图标
        prizeAnimation.innerHTML = '<div class="custom-hongbao"></div>';
    } else {
        // 使用Font Awesome图标
        prizeAnimation.innerHTML = `<i class="fas fa-${prize.icon} prize-icon" style="color: ${getIconColor(prize.icon)}"></i>`;
    }
    
    // 显示弹窗
    winModal.style.display = 'flex';
    
    // 添加烟花动画
    createFireworks();
}

// 关闭弹窗
function closeWinModal() {
    winModal.style.display = 'none';
    stopFireworks();
}

// 创建烟花动画
function createFireworks() {
    // 这里简单模拟烟花效果，实际项目中可以使用专业的特效库
    const fireworks = document.createElement('div');
    fireworks.className = 'fireworks';
    fireworks.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    document.body.appendChild(fireworks);
    
    // 创建20个烟花粒子
    for (let i = 0; i < 20; i++) {
        createParticle(fireworks);
    }
    
    // 播放音效
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-game-bonus-reached-2065.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.log('自动播放被阻止，需要用户交互'));
}

// 创建烟花粒子
function createParticle(container) {
    const particle = document.createElement('div');
    
    // 随机颜色
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // 随机位置
    const x = Math.random() * 100;
    const y = Math.random() * 50 + 25;
    
    // 随机大小
    const size = Math.random() * 8 + 4;
    
    // 设置粒子样式
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background-color: ${randomColor};
        border-radius: 50%;
        top: ${y}%;
        left: ${x}%;
        opacity: 0;
        animation: particle-animation 1.5s ease-out forwards;
    `;
    
    container.appendChild(particle);
    
    // 动画结束后移除粒子
    setTimeout(() => {
        particle.remove();
    }, 1500);
}

// 停止烟花动画
function stopFireworks() {
    const fireworks = document.querySelector('.fireworks');
    if (fireworks) {
        fireworks.remove();
    }
}

// 添加粒子动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes particle-animation {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 0;
        }
        20% {
            opacity: 1;
        }
        100% {
            transform: translate(
                ${Math.random() > 0.5 ? '+' : '-'}${Math.random() * 100 + 50}px,
                ${Math.random() > 0.5 ? '+' : '-'}${Math.random() * 100 + 50}px
            ) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 事件监听
startBtn.addEventListener('click', startLottery);
closeModal.addEventListener('click', closeWinModal);
confirmBtn.addEventListener('click', closeWinModal);

// 页面加载完成后初始化转盘
document.addEventListener('DOMContentLoaded', () => {
    initLotteryWheel();
});

// 根据图标类型获取颜色
function getIconColor(iconType) {
    switch(iconType) {
        case 'trophy':
            return '#ffd700'; // 金色
        case 'gift':
        case 'envelope':
            return '#e74c3c'; // 红色
        case 'ticket-alt':
            return '#5dade2'; // 浅蓝色
        default:
            return '#ffd700'; // 默认金色
    }
}

// 停止当前抽奖进程
function stopCurrentLottery() {
    // 如果正在旋转，重置转盘
    if (isSpinning) {
        lotteryWheel.style.transition = 'none';
        lotteryWheel.style.transform = 'rotate(0deg)';
        
        // 强制回流，使浏览器应用上面的样式
        void lotteryWheel.offsetWidth;
    }
    
    // 重置按钮状态
    startBtn.disabled = true;
    startBtn.textContent = '抽奖中...';
}

// 显示中奖结果
function displayWinResult(prize) {
    // 显示中奖信息
    showWinPrize(prize);
    
    // 重置按钮状态
    startBtn.disabled = false;
    startBtn.textContent = '开始抽奖';
} 