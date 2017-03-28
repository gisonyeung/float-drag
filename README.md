# FloatDrag
移动设备上任意元素在屏幕内浮动与拖动

原生 JavaScript 编写，适用于触屏设备。

# 使用示意
① 引入 JS 文件
```JavaScript
<script src="float-drag.js"></script>
```

② 绑定
```JavaScript
new FloatDrag(document.getElementById('ball'));
```

# 参数
```JavaScript
new FloatDarg(ele, option);
```
其中：
* `ele`表示需要拖动的元素；
* `option`为可选参数，包括：
  * `edge`，对象，表示元素与边缘的距离值，默认为`{ left: 0, right: 0, top: 0, bottom: 0 }`，未填的方向默认为`0`。
  * `isRemember`，布尔值，表示是否记录元素位置（使用`localstorage`，以元素 ID 作为索引），默认为`true`。
