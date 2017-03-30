/**
 * @float-drag.js
 * @author gisonyeung
 * @version
 * @Created: 17-03-28
 * @description 原生JS编写，移动设备上任意元素在屏幕内浮动与拖动
 */

(function (global, factory) {
    if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(factory);
    } else {
        global.FloatDrag = factory();
    }
}(this, function () {
    'use strict';

    var FloatDrag = function(ele, options) {
        var defaults = {
            edge: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            },
            isRemember: true,
        };

        options = options || {};
        for (var key in defaults) {
            if (typeof options[key] === 'undefined') {
                options[key] = defaults[key];
            }
        }

        options.edge = {
            left: parseInt(options.edge.left, 10) || 0,
            right: parseInt(options.edge.right, 10) || 0,
            top: parseInt(options.edge.top, 10) || 0,
            bottom: parseInt(options.edge.bottom, 10) || 0,
        }

        var data = {
            distanceX: 0,
            distanceY: 0
        };

        var win = window;

        // 浏览器窗体尺寸
        var winWidth = win.innerWidth;
        var winHeight = win.innerHeight;

        if (!ele) {
            return;
        }

        // 设置transform坐标等方法
        var fnTranslate = function (x, y) {
            x = Math.round(1000 * x) / 1000;
            y = Math.round(1000 * y) / 1000;

            ele.style.webkitTransform = 'translate(' + [x + 'px', y + 'px'].join(',') + ')';
            ele.style.transform = 'translate3d(' + [x + 'px', y + 'px', 0].join(',') + ')';
        };

        var strStoreDistance = '';
        // 支持 localstorage 的设备则读取元素上次的位置
        if (options.isRemember 
            && ele.id 
            && win.localStorage 
            && (strStoreDistance = localStorage['FloatDrag_' + ele.id])
        ) {
            var arrStoreDistance = strStoreDistance.split(',');
            ele.distanceX = +arrStoreDistance[0];
            ele.distanceY = +arrStoreDistance[1];
            fnTranslate(ele.distanceX, ele.distanceY);
        }

        // 显示拖拽元素
        ele.style.visibility = 'visible';

        // 如果元素在屏幕之外，位置使用初始值
        var initBound = ele.getBoundingClientRect();

        if (initBound.left < -0.5 * initBound.width ||
            initBound.top < -0.5 * initBound.height ||
            initBound.right > winWidth + 0.5 * initBound.width ||
            initBound.bottom > winHeight + 0.5 * initBound.height
            ) {
            ele.distanceX = 0;
            ele.distanceY = 0;
            fnTranslate(0, 0);
        }

        ele.addEventListener('touchstart', function (event) {
            // if (data.inertiaing) {
             //   return;
            // }

            var events = event.touches[0] || event;

            data.posX = events.pageX;
            data.posY = events.pageY;

            data.touching = true;

            if (ele.distanceX) {
                data.distanceX = ele.distanceX;
            }
            if (ele.distanceY) {
                data.distanceY = ele.distanceY;
            }

            // 元素的位置数据
            data.bound = ele.getBoundingClientRect();
        });

        document.addEventListener('touchmove', function (event) {
            if (data.touching !== true) {
                return;
            }

            // 当移动开始的时候开始记录时间
            if (data.timerready == true) {
                data.timerstart = +new Date();
                data.timerready = false;
            }

            event.preventDefault();

            var events = event.touches[0] || event;

            data.nowX = events.pageX;
            data.nowY = events.pageY;

            var distanceX = data.nowX - data.posX,
                distanceY = data.nowY - data.posY;

            // 此时元素的位置
            var absLeft = data.bound.left + distanceX,
                absTop = data.bound.top + distanceY,
                absRight = absLeft + data.bound.width,
                absBottom = absTop + data.bound.height;

            // 边缘检测
            if (absLeft < options.edge.left) {
                distanceX = distanceX - absLeft + options.edge.left;
            }
            if (absTop < options.edge.top) {
                distanceY = distanceY - absTop + options.edge.top;
            }
            if (absRight > (winWidth - options.edge.right)) {
                distanceX = distanceX - (absRight - winWidth + options.edge.right);
            }
            if (absBottom > (winHeight - options.edge.bottom)) {
                distanceY = distanceY - (absBottom - winHeight + options.edge.bottom);
            }

            // 元素位置跟随
            var x = data.distanceX + distanceX, y = data.distanceY + distanceY;
            fnTranslate(x, y);

            // 缓存移动位置
            ele.distanceX = x;
            ele.distanceY = y;

            // localStorage['FloatDrag_' + ele.id] = [ele.distanceX, ele.distanceY].join();
        });

        ele.addEventListener('touchend', function (event) {
            if (data.touching === false) {
                // fix iOS fixed bug
                return;
            }
            data.touching = false;
            if (options.isRemember && win.localStorage) {
                localStorage['FloatDrag_' + ele.id] = [ele.distanceX, ele.distanceY].join();
            }
        });

    }

    return FloatDrag;

}));