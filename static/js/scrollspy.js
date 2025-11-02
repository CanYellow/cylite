/* --- 目录滚动高亮脚本 (最终版) --- */
document.addEventListener('DOMContentLoaded', () => {

    console.log('TOC Script: DOM fully loaded. Starting script.');

    // ▼▼▼ 核心改动：找到真正的滚动容器 ▼▼▼
    // CSS 选择器完全匹配你提供的那段代码
    const scrollContainer = document.querySelector('.single-page-wrapper.with-toc');
    
    // 如果找不到这个容器，脚本就直接停止，防止报错
    if (!scrollContainer) {
        console.error('TOC Script Error: Could not find the scroll container ".single-page-wrapper.with-toc"');
        return;
    }
    
    console.log("TOC Script: Found the correct scroll container:", scrollContainer);

    const toc = document.getElementById('TableOfContents');
    if (!toc) return;
    const tocLinks = Array.from(toc.querySelectorAll('a[href^="#"]'));
    if (tocLinks.length === 0) return;
    const headings = tocLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
    
    console.log(`TOC Script: Initial setup complete. Found ${tocLinks.length} links and ${headings.length} matching headings.`);

    let activeLink = null;
    
    // 这个值现在可能需要重新调整，可以从 80 或 100 开始试
    // 它代表页面顶部导航栏的高度，或者你希望标题滚动到离顶部多远时触发高亮
    const offset = 80; 

    const highlightToc = () => {
        let currentHeading = null;
        for (const heading of headings) {
            // getBoundingClientRect() 仍然是相对于视口，所以这里的逻辑不需要改变
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
            if (newActiveLink){
                 newActiveLink.classList.add('active-toc-link');
                // ▼▼▼ 新增逻辑：检查并滚动目录以显示高亮项 ▼▼▼
                const tocContainerRect = toc.getBoundingClientRect(); // toc 就是 #TableOfContents
                const linkRect = newActiveLink.getBoundingClientRect();

                // 判断高亮链接是否完全在目录的可视区域之外
                const isNotInView = (linkRect.top < tocContainerRect.top) || (linkRect.bottom > tocContainerRect.bottom);

                if (isNotInView) {
                    // 如果不可见，则平滑地将其滚动到容器的中央
                    newActiveLink.scrollIntoView({
                        behavior: 'smooth', // 平滑滚动
                        block: 'center'     // 滚动到中心位置
                    });
                }
                // ▲▲▲ 新增逻辑结束 ▲▲▲
            }
            activeLink = newActiveLink;
        }
    };
    
    let throttleTimer;
    // ▼▼▼ 核心改动：将事件监听器绑定到正确的容器上 ▼▼▼
    scrollContainer.addEventListener('scroll', () => {
        if (throttleTimer) return;
        throttleTimer = setTimeout(() => {
            highlightToc();
            throttleTimer = null;
        }, 100); // 节流，避免性能问题
    }, { passive: true });
    
    // 初始加载时执行一次，确保刷新时状态正确
    highlightToc();
});
