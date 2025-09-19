// Show install prompt for iOS Safari
function isIos() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent);
}
function isIpad() {
    // iPadOS 13+ uses Mac userAgent with touch support
    return /ipad/i.test(navigator.userAgent) ||
        (navigator.userAgent.includes('Macintosh') && 'ontouchend' in document);
}
function isInStandaloneMode() {
    return ('standalone' in window.navigator) && window.navigator.standalone;
}
window.addEventListener('DOMContentLoaded', function() {
    if (isIos() && !isInStandaloneMode()) {
        document.getElementById('installPrompt').style.display = 'block';
    }
    if (isIpad()) {
        document.body.classList.add('ipad-layout');
        var sidebar = document.querySelector('.sidebar-nav');
        var handle = document.querySelector('.sidebar-resize-handle');
        var main = document.querySelector('.app-main');
        if (sidebar && handle && main) {
            let isResizing = false;
            handle.addEventListener('mousedown', function(e) {
                isResizing = true;
                document.body.style.cursor = 'ew-resize';
                e.preventDefault();
            });
            window.addEventListener('mousemove', function(e) {
                if (isResizing) {
                    let newWidth = e.clientX - sidebar.getBoundingClientRect().left;
                    newWidth = Math.max(180, Math.min(400, newWidth));
                    sidebar.style.width = newWidth + 'px';
                    main.style.marginLeft = (newWidth + 20) + 'px';
                }
            });
            window.addEventListener('mouseup', function() {
                if (isResizing) {
                    isResizing = false;
                    document.body.style.cursor = '';
                }
            });
            // Touch support for iPad
            handle.addEventListener('touchstart', function(e) {
                isResizing = true;
                e.preventDefault();
            });
            window.addEventListener('touchmove', function(e) {
                if (isResizing && e.touches.length === 1) {
                    let touch = e.touches[0];
                    let newWidth = touch.clientX - sidebar.getBoundingClientRect().left;
                    newWidth = Math.max(180, Math.min(400, newWidth));
                    sidebar.style.width = newWidth + 'px';
                    main.style.marginLeft = (newWidth + 20) + 'px';
                }
            });
            window.addEventListener('touchend', function() {
                if (isResizing) {
                    isResizing = false;
                }
            });
        }
    }
});
