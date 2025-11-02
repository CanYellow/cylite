// /js/copy-code.js

(function() {
  'use strict';

  // 1. 定义SVG图标
  const svgCopy = '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"><path fill-rule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path><path fill-rule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"></path></svg>';
  const svgCheck = '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>';

  // 2. 添加按钮的核心函数
  const addCopyButtons = (clipboard) => {
    // 寻找所有 .highlight > pre > code 的结构
    document.querySelectorAll('.highlight pre > code').forEach((codeBlock) => {
      const highlightContainer = codeBlock.parentNode.parentNode;
      
      // 创建按钮
      const button = document.createElement('button');
      button.className = 'clipboard-button';
      button.type = 'button';
      button.title = 'Copy to clipboard';
      button.innerHTML = svgCopy;

      // 添加点击事件
      button.addEventListener('click', () => {
        clipboard.writeText(codeBlock.innerText).then(
          () => {
            button.blur(); // 防止按钮在点击后保持焦点状态
            button.innerHTML = svgCheck;
            setTimeout(() => { button.innerHTML = svgCopy; }, 2000);
          },
          (error) => {
            button.innerHTML = 'Error';
            console.error('Failed to copy text: ', error);
          }
        );
      });

      // 4. 【关键修改】将按钮添加到 .highlight 容器的内部
      //    这样 CSS 的 `position: absolute` 才能相对于 `position: relative` 的 .highlight 生效
      highlightContainer.appendChild(button);
    });
  };

  // 3. 检查并执行
  // 使用 DOMContentLoaded 确保页面元素加载完毕后再执行脚本
  document.addEventListener('DOMContentLoaded', () => {
    if (navigator && navigator.clipboard) {
      addCopyButtons(navigator.clipboard);
    } else {
      // 兼容旧版浏览器或 http 协议
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/clipboard-polyfill/3.0.3/promise/clipboard-polyfill.promise.min.js';
      script.integrity = 'sha512-O9Q+AhI1w7LT1/tHysPWDwwrgB1fKJ/nXPNLC30i8LF6RdSz4dGZyWB9WySag3DZMdGuK5yHJEdKXMKI2m5uSQ==';
      script.crossOrigin = 'anonymous';
      script.referrerpolicy = 'no-referrer';
      script.onload = () => addCopyButtons(clipboard);
      document.body.appendChild(script);
    }
  });

})();
