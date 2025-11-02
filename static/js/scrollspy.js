/* --- 目录滚动高亮脚本 (防冲突修复版) --- */
document.addEventListener('DOMContentLoaded', () => {
    const scrollContainer = document.querySelector('.single-page-wrapper.with-toc');
    const toc = document.getElementById('TableOfContents');

    if (!scrollContainer || !toc) {
        console.error('TOC Script Error: Missing critical elements.');
        return;
    }

    const tocLinks = Array.from(toc.querySelectorAll('a[href^="#"]'));
    if (tocLinks.length === 0) return;
    
    const headings = tocLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
    
    const offset = 80;
    let activeLink = null;
    let throttleTimer;

    // ▼▼▼【核心修改 ①】▼▼▼
    // 新增一个标志位，用于判断当前是否由用户点击链接触发的滚动
    let isNavigatingViaClick = false;

    const highlightToc = () => {
        let currentHeading = null;
        for (const heading of headings) {
            if (heading.getBoundingClientRect().top <= offset) {
                currentHeading = heading;
            } else {
                break;
            }
        }

        const currentActiveId = currentHeading ? currentHeading.id : null;
        const newActiveLink = currentActiveId ? toc.querySelector(`a[href="#${CSS.escape(currentActiveId)}"]`) : null;

        if (newActiveLink !== activeLink) {
            if (activeLink) activeLink.classList.remove('active-toc-link');
            if (newActiveLink) {
                newActiveLink.classList.add('active-toc-link');
                
                // ▼▼▼【核心修改 ②】▼▼▼
                // 只有在不是用户点击跳转的情况下，才自动滚动目录
                if (!isNavigatingViaClick) {
                    newActiveLink.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest' // 使用 'nearest' 避免不必要的滚动
                    });
                }
            }
            activeLink = newActiveLink;
        }
    };

    scrollContainer.addEventListener('scroll', () => {
        if (throttleTimer) return;
        throttleTimer = setTimeout(() => {
            highlightToc();
            throttleTimer = null;
        }, 100);
    }, { passive: true });

    // ▼▼▼【核心修改 ③】▼▼▼
    // 监听所有目录链接的点击事件，但这次我们不阻止默认行为
    tocLinks.forEach(link => {
        link.addEventListener('click', () => {
            // 当用户点击时，立刻设置标志位为 true
            isNavigatingViaClick = true;

            // 在短暂延迟后，自动将标志位恢复为 false。
            // 这个延迟给了浏览器足够的时间去完成跳转和渲染，避免冲突。
            // 500毫秒是一个比较安全的时间。
            setTimeout(() => {
                isNavigatingViaClick = false;
            }, 500); 
        });
    });

    highlightToc();
});
