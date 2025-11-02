// 等待整个 HTML 文档加载完毕后执行
document.addEventListener('DOMContentLoaded', function () {
    // 获取 HTML 元素
    const lightToggleButton = document.getElementById('theme-toggle-light');
    const darkToggleButton = document.getElementById('theme-toggle-dark');
    const htmlElement = document.documentElement; // <html> 标签

    // 检查元素是否存在，避免在没有这些按钮的页面上报错
    if (!lightToggleButton || !darkToggleButton) {
        return;
    }

    // 点击亮色模式按钮的事件
    lightToggleButton.addEventListener('click', function() {
        htmlElement.classList.remove('dark-mode');
        // 将用户的选择保存到浏览器的 localStorage 中
        localStorage.setItem('theme', 'light');
    });

    // 点击暗色模式按钮的事件
    darkToggleButton.addEventListener('click', function() {
        htmlElement.classList.add('dark-mode');
        // 将用户的选择保存到浏览器的 localStorage 中
        localStorage.setItem('theme', 'dark');
    });
});
