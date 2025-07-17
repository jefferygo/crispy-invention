/**
 * 个人工作辅助面板 - 主要功能脚本
 * 包含番茄钟、日程提醒、甘特图功能
 */

// 全局变量
let timerInterval = null;
let currentTime = 25 * 60; // 25分钟（秒）
let isRunning = false;
let isWorkTime = true;
let completedPomodoros = 0;
let schedules = [];
let tasks = [];
let scheduleCheckInterval = null;

// 音频上下文
let audioContext = null;

/**
 * 初始化音频上下文
 */
function initAudioContext() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
        console.warn('音频上下文初始化失败:', error);
    }
}

/**
 * 播放通知提醒音
 */
function playNotificationSound() {
    if (!audioContext) return;
    
    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
        console.warn('播放提醒音失败:', error);
    }
}

/**
 * 请求通知权限
 */
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            console.log('通知权限状态:', permission);
        });
    }
}

/**
 * 显示系统通知
 */
function showNotification(title, body, icon) {
    if ('Notification' in window && Notification.permission === 'granted') {
        try {
            new Notification(title, {
                body: body,
                icon: icon || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🔔</text></svg>',
                requireInteraction: false,
                silent: false
            });
        } catch (error) {
            console.warn('显示通知失败:', error);
        }
    }
}

/**
 * 番茄钟功能
 */

/**
 * 更新计时器显示
 */
function updateTimerDisplay() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    document.getElementById('timerDisplay').textContent = display;
    
    // 更新进度圆环
    const workTime = parseInt(document.getElementById('workTime').value) * 60;
    const breakTime = parseInt(document.getElementById('breakTime').value) * 60;
    const totalTime = isWorkTime ? workTime : breakTime;
    const progress = ((totalTime - currentTime) / totalTime) * 360;
    
    document.getElementById('timerCircle').style.background = 
        `conic-gradient(#3498db ${progress}deg, #ecf0f1 ${progress}deg)`;
    
    document.getElementById('timerStatus').textContent = isWorkTime ? '工作时间' : '休息时间';
    
    // 更新页面标题
    if (isRunning) {
        document.title = `${minutes}:${seconds.toString().padStart(2, '0')} - ${isWorkTime ? '工作中' : '休息中'}`;
    } else {
        document.title = '个人工作辅助面板';
    }
}

/**
 * 开始计时器
 */
function startTimer() {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    isRunning = true;
    document.getElementById('startBtn').textContent = '运行中';
    document.getElementById('startBtn').disabled = true;
    
    timerInterval = setInterval(() => {
        currentTime--;
        updateTimerDisplay();
        
        if (currentTime <= 0) {
            handleTimerComplete();
        }
    }, 1000);
}

/**
 * 处理计时器完成
 */
function handleTimerComplete() {
    // 播放提醒音
    playNotificationSound();
    
    // 显示通知
    const notificationTitle = isWorkTime ? '工作时间结束！' : '休息时间结束！';
    const notificationBody = isWorkTime ? '该休息一下了' : '该继续工作了';
    const notificationIcon = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🍅</text></svg>';
    
    showNotification(notificationTitle, notificationBody, notificationIcon);
    
    if (isWorkTime) {
        completedPomodoros++;
        document.getElementById('completedCount').textContent = completedPomodoros;
        // 切换到休息时间
        isWorkTime = false;
        currentTime = parseInt(document.getElementById('breakTime').value) * 60;
    } else {
        // 切换到工作时间
        isWorkTime = true;
        currentTime = parseInt(document.getElementById('workTime').value) * 60;
    }
    
    updateTimerDisplay();
    pauseTimer(); // 手动开始下一阶段
}

/**
 * 暂停计时器
 */
function pauseTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    document.title = '个人工作辅助面板';
    document.getElementById('startBtn').textContent = '开始';
    document.getElementById('startBtn').disabled = false;
}

/**
 * 重置计时器
 */
function resetTimer() {
    pauseTimer();
    isWorkTime = true;
    currentTime = parseInt(document.getElementById('workTime').value) * 60;
    updateTimerDisplay();
}

/**
 * 日程提醒功能
 */

/**
 * 添加日程
 */
function addSchedule() {
    const time = document.getElementById('scheduleTime').value;
    const title = document.getElementById('scheduleTitle').value.trim();
    const desc = document.getElementById('scheduleDesc').value.trim();

    if (!time || !title) {
        alert('请填写时间和标题');
        return;
    }

    const schedule = {
        id: Date.now(),
        time: new Date(time),
        title: title,
        description: desc,
        completed: false
    };

    schedules.push(schedule);
    updateScheduleList();
    saveSchedulesToLocalStorage();
    
    // 清空表单
    document.getElementById('scheduleTime').value = '';
    document.getElementById('scheduleTitle').value = '';
    document.getElementById('scheduleDesc').value = '';
}

/**
 * 更新日程列表显示
 */
function updateScheduleList() {
    const list = document.getElementById('scheduleList');
    list.innerHTML = '';

    if (schedules.length === 0) {
        list.innerHTML = '<div style="text-align: center; color: #7f8c8d; padding: 20px;">暂无日程安排</div>';
        return;
    }

    schedules.sort((a, b) => a.time - b.time).forEach(schedule => {
        const item = document.createElement('div');
        item.className = 'schedule-item';
        if (schedule.completed) item.classList.add('active');
        
        item.innerHTML = `
            <div class="schedule-time">${schedule.time.toLocaleString()}</div>
            <div class="schedule-title">${escapeHtml(schedule.title)}</div>
            <div class="schedule-desc">${escapeHtml(schedule.description)}</div>
            <button class="delete-btn" onclick="deleteSchedule(${schedule.id})">删除</button>
        `;
        
        list.appendChild(item);
    });
}

/**
 * 删除日程
 */
function deleteSchedule(id) {
    schedules = schedules.filter(s => s.id !== id);
    updateScheduleList();
    saveSchedulesToLocalStorage();
}

/**
 * 检查日程提醒
 */
function checkSchedules() {
    const now = new Date();
    let hasNewAlerts = false;
    
    schedules.forEach(schedule => {
        if (!schedule.completed && now >= schedule.time) {
            schedule.completed = true;
            hasNewAlerts = true;
            
            // 播放提醒音
            playNotificationSound();
            
            // 显示通知
            showNotification(
                '日程提醒', 
                schedule.title,
                'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📅</text></svg>'
            );
        }
    });
    
    if (hasNewAlerts) {
        updateScheduleList();
        saveSchedulesToLocalStorage();
        
        // 页面标题闪烁提醒
        flashTitle('📅 有新日程提醒！');
    }
}

/**
 * 页面标题闪烁提醒
 */
function flashTitle(message) {
    let flashCount = 0;
    const originalTitle = document.title;
    const flashInterval = setInterval(() => {
        document.title = flashCount % 2 === 0 ? message : originalTitle;
        flashCount++;
        if (flashCount >= 10) {
            clearInterval(flashInterval);
            document.title = originalTitle;
        }
    }, 500);
}

/**
 * 甘特图功能
 */

/**
 * 添加任务
 */
function addTask() {
    const name = document.getElementById('taskName').value.trim();
    const start = document.getElementById('taskStart').value;
    const end = document.getElementById('taskEnd').value;

    if (!name || !start || !end) {
        alert('请填写完整的任务信息');
        return;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (startDate >= endDate) {
        alert('结束时间必须晚于开始时间');
        return;
    }

    const task = {
        id: Date.now(),
        name: name,
        start: startDate,
        end: endDate
    };

    tasks.push(task);
    updateGanttChart();
    saveTasksToLocalStorage();
    
    // 清空表单
    document.getElementById('taskName').value = '';
    document.getElementById('taskStart').value = '';
    document.getElementById('taskEnd').value = '';
}

/**
 * 更新甘特图
 */
function updateGanttChart() {
    const container = document.getElementById('ganttTasks');
    container.innerHTML = '';

    if (tasks.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #7f8c8d; padding: 20px; grid-column: 1 / -1;">暂无任务</div>';
        return;
    }

    // 计算时间范围
    const allTimes = tasks.flatMap(task => [task.start, task.end]);
    const minTime = new Date(Math.min(...allTimes));
    const maxTime = new Date(Math.max(...allTimes));
    const timeRange = maxTime - minTime || 86400000; // 至少一天

    tasks.forEach(task => {
        const row = document.createElement('div');
        row.className = 'gantt-row';
        
        const startPercent = ((task.start - minTime) / timeRange) * 100;
        const widthPercent = ((task.end - task.start) / timeRange) * 100;
        const duration = Math.ceil((task.end - task.start) / (1000 * 60 * 60 * 24));
        
        row.innerHTML = `
            <div class="gantt-task-name">
                ${escapeHtml(task.name)}
                <button class="delete-btn" onclick="deleteTask(${task.id})">删除</button>
            </div>
            <div class="gantt-timeline">
                <div class="gantt-bar" 
                     style="left: ${startPercent}%; width: ${widthPercent}%"
                     data-task-id="${task.id}"
                     draggable="true"
                     title="${task.name}: ${task.start.toLocaleDateString()} - ${task.end.toLocaleDateString()}">
                    ${duration}天
                </div>
            </div>
        `;
        
        container.appendChild(row);
    });

    // 添加拖拽功能
    addDragFunctionality();
}

/**
 * 删除任务
 */
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    updateGanttChart();
    saveTasksToLocalStorage();
}

/**
 * 添加拖拽功能
 */
function addDragFunctionality() {
    const bars = document.querySelectorAll('.gantt-bar');
    bars.forEach(bar => {
        let isDragging = false;
        let startX = 0;
        let startLeft = 0;

        bar.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startLeft = parseFloat(bar.style.left);
            e.preventDefault();
            bar.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const timeline = bar.parentElement;
            const timelineRect = timeline.getBoundingClientRect();
            const deltaX = e.clientX - startX;
            const deltaPercent = (deltaX / timelineRect.width) * 100;
            const newLeft = Math.max(0, Math.min(100 - parseFloat(bar.style.width), startLeft + deltaPercent));
            
            bar.style.left = newLeft + '%';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                bar.style.cursor = 'move';
                updateTaskTiming(bar);
            }
        });
    });
}

/**
 * 更新任务时间
 */
function updateTaskTiming(bar) {
    const taskId = parseInt(bar.dataset.taskId);
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newLeftPercent = parseFloat(bar.style.left);
    
    // 计算新的开始时间
    const allTimes = tasks.flatMap(t => [t.start, t.end]);
    const minTime = new Date(Math.min(...allTimes));
    const maxTime = new Date(Math.max(...allTimes));
    const timeRange = maxTime - minTime || 86400000;
    
    const duration = task.end - task.start;
    const newStart = new Date(minTime.getTime() + (newLeftPercent / 100) * timeRange);
    const newEnd = new Date(newStart.getTime() + duration);
    
    task.start = newStart;
    task.end = newEnd;
    
    // 更新工具提示
    bar.title = `${task.name}: ${task.start.toLocaleDateString()} - ${task.end.toLocaleDateString()}`;
    
    saveTasksToLocalStorage();
}

/**
 * 数据持久化功能
 */

/**
 * 保存日程到本地存储
 */
function saveSchedulesToLocalStorage() {
    try {
        localStorage.setItem('workAssistant_schedules', JSON.stringify(schedules));
    } catch (error) {
        console.warn('保存日程失败:', error);
    }
}

/**
 * 从本地存储加载日程
 */
function loadSchedulesFromLocalStorage() {
    try {
        const saved = localStorage.getItem('workAssistant_schedules');
        if (saved) {
            const parsed = JSON.parse(saved);
            schedules = parsed.map(s => ({
                ...s,
                time: new Date(s.time)
            }));
            updateScheduleList();
        }
    } catch (error) {
        console.warn('加载日程失败:', error);
    }
}

/**
 * 保存任务到本地存储
 */
function saveTasksToLocalStorage() {
    try {
        localStorage.setItem('workAssistant_tasks', JSON.stringify(tasks));
    } catch (error) {
        console.warn('保存任务失败:', error);
    }
}

/**
 * 从本地存储加载任务
 */
function loadTasksFromLocalStorage() {
    try {
        const saved = localStorage.getItem('workAssistant_tasks');
        if (saved) {
            const parsed = JSON.parse(saved);
            tasks = parsed.map(t => ({
                ...t,
                start: new Date(t.start),
                end: new Date(t.end)
            }));
            updateGanttChart();
        }
    } catch (error) {
        console.warn('加载任务失败:', error);
    }
}

/**
 * 工具函数
 */

/**
 * HTML转义
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 设置默认时间
 */
function setDefaultTimes() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    
    const scheduleTimeInput = document.getElementById('scheduleTime');
    const taskStartInput = document.getElementById('taskStart');
    const taskEndInput = document.getElementById('taskEnd');
    
    if (scheduleTimeInput) {
        scheduleTimeInput.value = now.toISOString().slice(0, 16);
    }
    
    if (taskStartInput) {
        taskStartInput.value = now.toISOString().slice(0, 16);
    }
    
    if (taskEndInput) {
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        taskEndInput.value = tomorrow.toISOString().slice(0, 16);
    }
}

/**
 * 事件监听器设置
 */
function setupEventListeners() {
    // 番茄钟按钮
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    if (startBtn) startBtn.addEventListener('click', startTimer);
    if (pauseBtn) pauseBtn.addEventListener('click', pauseTimer);
    if (resetBtn) resetBtn.addEventListener('click', resetTimer);
    
    // 日程按钮
    const addScheduleBtn = document.getElementById('addSchedule');
    if (addScheduleBtn) addScheduleBtn.addEventListener('click', addSchedule);
    
    // 任务按钮
    const addTaskBtn = document.getElementById('addTask');
    if (addTaskBtn) addTaskBtn.addEventListener('click', addTask);
    
    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case ' ':
                    e.preventDefault();
                    if (isRunning) {
                        pauseTimer();
                    } else {
                        startTimer();
                    }
                    break;
                case 'r':
                    e.preventDefault();
                    resetTimer();
                    break;
            }
        }
    });
}

/**
 * 页面初始化
 */
function init() {
    // 初始化音频上下文
    initAudioContext();
    
    // 请求通知权限
    requestNotificationPermission();
    
    // 设置事件监听器
    setupEventListeners();
    
    // 初始化计时器显示
    updateTimerDisplay();
    
    // 设置默认时间
    setDefaultTimes();
    
    // 加载保存的数据
    loadSchedulesFromLocalStorage();
    loadTasksFromLocalStorage();
    
    // 开始定期检查日程提醒
    scheduleCheckInterval = setInterval(checkSchedules, 1000);
    
    console.log('个人工作辅助面板初始化完成');
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// 页面卸载前清理
window.addEventListener('beforeunload', () => {
    if (timerInterval) clearInterval(timerInterval);
    if (scheduleCheckInterval) clearInterval(scheduleCheckInterval);
});

// 导出函数供HTML调用
window.deleteSchedule = deleteSchedule;
window.deleteTask = deleteTask;