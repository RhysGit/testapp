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

function updateTabPill() {
    var tabBar = document.querySelector('.tab-bar');
    var pill = tabBar ? tabBar.querySelector('.tab-pill') : null;
    var tabs = tabBar ? tabBar.querySelectorAll('.tab') : [];
    var activeTab = tabBar ? tabBar.querySelector('.tab.active') : null;
    if (pill && activeTab) {
        var rect = activeTab.getBoundingClientRect();
        var barRect = tabBar.getBoundingClientRect();
        pill.style.left = (activeTab.offsetLeft) + "px";
        pill.style.width = activeTab.offsetWidth + "px";
    }
}

// Initial pill position
window.addEventListener('DOMContentLoaded', function() {
    updateTabPill();
    window.addEventListener('resize', updateTabPill);
});

// Tab click updates pill
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('tab')) {
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        e.target.classList.add('active');
        updateTabPill();
    }
});

// Swipe gesture for tab bar
(function() {
    var tabBar = document.querySelector('.tab-bar');
    if (!tabBar) return;
    var tabs = tabBar.querySelectorAll('.tab');
    var pill = tabBar.querySelector('.tab-pill');
    var startX = null;
    var pillStartLeft = null;
    var pillStartWidth = null;
    var currentTab = Array.from(tabs).findIndex(tab => tab.classList.contains('active')) || 0;
    var isSwiping = false;

    function selectTab(idx) {
        if (idx < 0 || idx >= tabs.length) return;
        tabs.forEach(tab => tab.classList.remove('active'));
        tabs[idx].classList.add('active');
        updateTabPill();
        if (tabs[idx].href) window.location.href = tabs[idx].href;
        currentTab = idx;
    }

    tabBar.addEventListener('touchstart', function(e) {
        if (e.touches.length === 1) {
            startX = e.touches[0].clientX;
            pillStartLeft = tabs[currentTab].offsetLeft;
            pillStartWidth = tabs[currentTab].offsetWidth;
            isSwiping = true;
            pill.style.transition = 'none';
        }
    });

    tabBar.addEventListener('touchmove', function(e) {
        if (!isSwiping || startX === null) return;
        var moveX = e.touches[0].clientX;
        var delta = moveX - startX;
        // Move pill horizontally, clamp within tab bar
        var barWidth = tabBar.offsetWidth;
        var minLeft = tabs[0].offsetLeft;
        var maxLeft = tabs[tabs.length - 1].offsetLeft;
        var newLeft = pillStartLeft + delta;
        newLeft = Math.max(minLeft, Math.min(maxLeft, newLeft));
        pill.style.left = newLeft + "px";
        pill.style.width = pillStartWidth + "px";
    });

    tabBar.addEventListener('touchend', function(e) {
        if (!isSwiping || startX === null) return;
        var endX = e.changedTouches[0].clientX;
        var delta = endX - startX;
        // Find nearest tab to pill's left
        var pillLeft = pillStartLeft + delta;
        var nearestIdx = 0;
        var minDist = Infinity;
        tabs.forEach((tab, idx) => {
            var dist = Math.abs(tab.offsetLeft - pillLeft);
            if (dist < minDist) {
                minDist = dist;
                nearestIdx = idx;
            }
        });
        selectTab(nearestIdx);
        pill.style.transition = ''; // Restore transition
        startX = null;
        isSwiping = false;
    });

    // Update currentTab index on tab change
    tabBar.addEventListener('click', function(e) {
        var idx = Array.from(tabs).indexOf(e.target.closest('.tab'));
        if (idx !== -1) currentTab = idx;
    });
})();
