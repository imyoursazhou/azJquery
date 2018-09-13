(function( window, undefined ) {
    var azjQuery = function(selector) {
        //此时构造函数是init，返回的就是init对象
        return new azjQuery.prototype.init(selector);
    };
    azjQuery.prototype = {
        constructor: azjQuery,
        init: function (selector) {
            /*
             1.传入 '' null undefined NaN  0  false, 返回空的jQuery对象
             2.字符串:
             代码片段:会将创建好的DOM元素存储到jQuery对象中返回
             选择器: 会将找到的所有元素存储到jQuery对象中返回
             3.数组:
             会将数组中存储的元素依次存储到jQuery对象中立返回
             4.除上述类型以外的:
             会将传入的数据存储到jQuery对象中返回
            */
            // 0.去除字符串两端的空格
            selector = azjQuery.trim(selector);

            // 1.传入 '' null undefined NaN  0  false, 返回空的jQuery对象
            if(!selector){
                return this;
            }
            // 2.方法处理
            else if(azjQuery.isFunction(selector)){
                azjQuery.ready(selector);
            }
            // 3.字符串
            else if(azjQuery.isString(selector)){
                // 3.1判断是否是代码片段 <a>
                if(azjQuery.isHTML(selector)){
                    // 1.根据代码片段创建所有的元素
                    var temp = document.createElement("div");
                    temp.innerHTML = selector;
                    [].push.apply(this, temp.children);
                }
                // 3.2判断是否是选择器
                else{
                    // 1.根据传入的选择器找到对应的元素
                    var res = document.querySelectorAll(selector);
                    // 2.将找到的元素添加到azjQuery上
                    [].push.apply(this, res);
                }
            }
            // 4.数组
            else if(azjQuery.isArray(selector)){
                // 将自定义的伪数组转换为真数组
                var arr = [].slice.call(selector);
                // 将真数组转换为伪数组
                [].push.apply(this, arr);
            }
            // 5.除上述类型以外
            else{
                this[0] = selector;
                this.length = 1;
            }
            return this;
        },
        version: "1.1.0",
        selector: "",
        length: 0,
        // [].push找到数组的push方法
        // 冒号前面的push将来由azjQuery对象调用
        // 相当于 [].push.apply(this);
        push: [].push,
        sort: [].sort,
        splice: [].splice,
        toArray: function () {
            return [].slice.call(this);
        },
        get: function (num) {
            // 没有传递参数
            if(arguments.length === 0){
                return this.toArray();
            }
            // 传递不是负数
            else if(num >= 0){
                return this[num];
            }
            // 传递负数
            else{
                return this[this.length + num];
            }
        },
        eq: function (num) {
            // 没有传递参数
            if(arguments.length === 0){
                return new azjQuery();
            }else{
                return azjQuery(this.get(num));
            }
        },
        first: function () {
            return this.eq(0);
        },
        last: function () {
            return this.eq(-1);
        },
        each: function (fn) {
            return azjQuery.each(this, fn);
        },
    };
    //将azjQuery的属性方法和原型方法展开
    azjQuery.extend = azjQuery.prototype.extend = function (obj) {
        for(var key in obj){
            this[key] = obj[key];
        }
    };
    // 属性方法,不需要调用init入口函数创建实例就能调用的方法
    // 可以使用$.functoinName()或者azjQuery.functoinName()直接调用方法
    // 工具方法
    azjQuery.extend({
        isString : function(str){
        	return typeof str === "string";
    	},
        isHTML : function(str){
            return str.charAt(0) == "<" &&
                str.charAt(str.length - 1) == ">" &&
                str.length >= 3;
        },
        trim : function(str){
            if(!azjQuery.isString(str)){
                return str;
            }
            // 判断是否支持trim方法
            if(str.trim){
                return str.trim();
            }else{
                return str.replace(/^\s+|\s+$/g, "");
            }
        },
        isObject : function(sele){
            return typeof sele === "object";
        },
        isWindow : function(sele){
            return sele === window;
        },
        isArray : function(sele){
            if(azjQuery.isObject(sele) &&
                !azjQuery.isWindow(sele) &&
                "length" in sele){
                return true;
            }
            return false;
        },
        isFunction : function(sele){
            return typeof sele === "function";
        },
        ready: function (fn) {
            // 判断DOM是否加载完毕
            if(document.readyState == "complete"){
                fn();
            }else if(document.addEventListener){
                document.addEventListener("DOMContentLoaded", function () {
                    fn();
                });
            }else{
                document.attachEvent("onreadystatechange", function () {
                    if(document.readyState == "complete"){
                       fn();
                    }
                });
            }
        },
        each: function (obj, fn) {
            // 1.判断是否是数组
            if(azjQuery.isArray(obj)){
                for(var i = 0; i < obj.length; i++){
                   // 使得调用each函数时，在回调函数内部的this值指向遍历的的当前项
                   var res = fn.call(obj[i], i, obj[i]);
                   if(res === true){
                       continue;
                   }else if(res === false){
                       break;
                   }
                }
            }
            // 2.判断是否是对象
            else if(azjQuery.isObject(obj)){
                for(var key in obj){
                    // 使得调用each函数时，在回调函数内部的this值指向遍历的的当前项
                    var res = fn.call(obj[key], key, obj[key]);
                    if(res === true){
                        continue;
                    }else if(res === false){
                        break;
                    }
                }
            }
            return obj;
        },
        map: function (obj, fn) {
            var res = [];
            // 1.判断是否是数组
            if(azjQuery.isArray(obj)){
                for(var i = 0; i < obj.length; i++){
                    var temp = fn(obj[i], i);
                    if(temp){
                        res.push(temp);
                    }
                }
            }
            // 2.判断是否是对象
            else if(azjQuery.isObject(obj)){
                for(var key in obj){
                    var temp =fn(obj[key], key);
                    if(temp){
                        res.push(temp);
                    }
                }
            }
            return res;
        },
        get_nextsibling: function (n) {
            var x = n.nextSibling;
            while (x != null && x.nodeType!=1)
            {
                x=x.nextSibling;
            }
            return x;
        },
        get_previoussibling: function (n) {
            var x=n.previousSibling;
            while (x != null && x.nodeType!=1)
            {
                x=x.previousSibling;
            }
            return x;
        },
        getStyle: function (dom, styleName) {
            if(window.getComputedStyle){
                return window.getComputedStyle(dom)[styleName];
            }else{
                return dom.currentStyle[styleName];
            }
        },
        addEvent: function(dom, name, callBack) {
            if(dom.addEventListener){
                dom.addEventListener(name, callBack);
            }else{
                dom.attachEvent("on"+name, callBack);
            }
        },
        ajax:function(options){
            azjQuery.prototype.init().ajaxPrototype(options);
        }
    });
    // 原型方法，需要调用入口函数创建init对象的实例以后才可以调用
    // DOM操作相关方法
    azjQuery.prototype.extend({
		empty:function(){
			//1.遍历所有找到的元素
			this.each(function(key,value){
				value.innerHTML = '';
			});
			//2.方便链式编程
			return this;
		},
        remove: function (sele) {
            if(arguments.length === 0){
                // 1.遍历指定的元素
                this.each(function (key, value) {
                    // 根据遍历到的元素找到对应的父元素
                    var parent = value.parentNode;
                    // 通过父元素删除指定的元素
                    parent.removeChild(value);
                });
            }else{
                var $this = this;
                // 1.根据传入的选择器找到对应的元素
                $(sele).each(function (key, value) {
                    // 2.遍历找到的元素, 获取对应的类型
                    var type = value.tagName;
                    // 3.遍历指定的元素
                    $this.each(function (k, v) {
                        // 4.获取指定元素的类型
                        var t = v.tagName;
                        // 5.判断找到元素的类型和指定元素的类型
                        if(t === type){
                            // 根据遍历到的元素找到对应的父元素
                            var parent = value.parentNode;
                            // 通过父元素删除指定的元素
                            parent.removeChild(value);
                        }
                    });
                })
            }
            return this;
        },
        html: function (content) {
            if(arguments.length === 0){
                return this[0].innerHTML;
            }else{
                this.each(function (key, value) {
                    value.innerHTML = content;
                })
            }
        },
        text: function (content) {
            if(arguments.length === 0){
                var res = "";
                this.each(function (key, value) {
                    res += value.innerText;
                });
                return res;
            }else{
                this.each(function (key, value) {
                    value.innerText = content;
                });
            }
        },
        appendTo: function (sele) {
            // 1.统一的将传入的数据转换为jQuery对象
            var $target = $(sele);
            var $this = this;
            var res = [];
            // 2.遍历取出所有指定的元素
            $.each($target, function (key, value) {
                // 2.遍历取出所有的元素
                $this.each(function (k, v) {
                    // 3.判断当前是否是第0个指定的元素
                    if(key === 0){
                        // 直接添加
                        value.appendChild(v);
                        res.push(v);
                    }else{
                        // 先拷贝再添加
                        var temp = v.cloneNode(true);
                        value.appendChild(temp);
                        res.push(temp);
                    }
                });
            });
            // 3.返回所有添加的元素
            return $(res);
        },
        prependTo: function (sele) {
            // 1.统一的将传入的数据转换为jQuery对象
            var $target = $(sele);
            var $this = this;
            var res = [];
            // 2.遍历取出所有指定的元素
            $.each($target, function (key, value) {
                // 2.遍历取出所有的元素
                $this.each(function (k, v) {
                    // 3.判断当前是否是第0个指定的元素
                    if(key === 0){
                        // 直接添加
                        value.insertBefore(v, value.firstChild);
                        res.push(v);
                    }else{
                        // 先拷贝再添加
                        var temp = v.cloneNode(true);
                        value.insertBefore(temp, value.firstChild);
                        res.push(temp);
                    }
                });
            });
            // 3.返回所有添加的元素
            return $(res);
        },
        append: function (sele) {
            // 判断传入的参数是否是字符串
            if(azjQuery.isString(sele)){
                this[0].innerHTML += sele;
            }else{
                $(sele).appendTo(this);
            }
            return this;
        },
        prepend: function (sele) {
            // 判断传入的参数是否是字符串
            if(azjQuery.isString(sele)){
                this[0].innerHTML = sele + this[0].innerHTML;
            }else{
                $(sele).prependTo(this);
            }
            return this;
        },
        insertBefore: function (sele) {
            // 1.统一的将传入的数据转换为jQuery对象
            var $target = $(sele);
            var $this = this;
            var res = [];
            // 2.遍历取出所有指定的元素
            $.each($target, function (key, value) {
                var parent = value.parentNode;
                // 2.遍历取出所有的元素
                $this.each(function (k, v) {
                    // 3.判断当前是否是第0个指定的元素
                    if(key === 0){
                        // 直接添加
                        parent.insertBefore(v, value);
                        res.push(v);
                    }else{
                        // 先拷贝再添加
                        var temp = v.cloneNode(true);
                        parent.insertBefore(temp, value);
                        res.push(temp);
                    }
                });
            });
            // 3.返回所有添加的元素
            return $(res);
        },
        insertAfter: function (sele) {
            // 1.统一的将传入的数据转换为jQuery对象
            var $target = $(sele);
            var $this = this;
            var res = [];
            // 2.遍历取出所有指定的元素
            $.each($target, function (key, value) {
                var parent = value.parentNode;
                var nextNode = $.get_nextsibling(value);
                // 2.遍历取出所有的元素
                $this.each(function (k, v) {
                    // 3.判断当前是否是第0个指定的元素
                    if(key === 0){
                        // 直接添加
                        parent.insertBefore(v, nextNode);
                        res.push(v);
                    }else{
                        // 先拷贝再添加
                        var temp = v.cloneNode(true);
                        parent.insertBefore(temp, nextNode);
                        res.push(temp);
                    }
                });
            });
            // 3.返回所有添加的元素
            return $(res);
        },
        replaceAll: function (sele) {
            // 1.统一的将传入的数据转换为jQuery对象
            var $target = $(sele);
            var $this = this;
            var res = [];
            // 2.遍历取出所有指定的元素
            $.each($target, function (key, value) {
                // 2.遍历取出所有的元素
                $this.each(function (k, v) {
                    // 3.判断当前是否是第0个指定的元素
                    if(key === 0){
                        // 1.将元素插入到指定元素的前面
                        $(v).insertBefore(value);
                        // 2.将指定元素删除
                        $(value).remove();
                        res.push(v);
                    }else{
                        // 先拷贝再添加
                        var temp = v.cloneNode(true);
                        // 1.将元素插入到指定元素的前面
                        $(temp).insertBefore(value);
                        // 2.将指定元素删除
                        $(value).remove();
                        res.push(temp);
                    }
                });
            });
            // 3.返回所有添加的元素
            return $(res);
        },
        clone: function (deep) {
            var res = [];
            // 判断是否是深复制
            if(deep){
                // 深复制
                this.each(function (key, ele) {
                    var temp = ele.cloneNode(true);
                    // 遍历元素中的eventsCache对象
                    azjQuery.each(ele.eventsCache, function (name, array) {
                        // 遍历事件对应的数组
                        azjQuery.each(array, function (index, method) {
                            // 给复制的元素添加事件
                            $(temp).on(name, method);
                        });
                    });
                    res.push(temp);
                });
                return $(res);
            }else{
                // 浅复制
                this.each(function (key, ele) {
                    var temp = ele.cloneNode(true);
                    res.push(temp);
                });
                return $(res);
            }
        }
    });
    // 筛选相关方法
    azjQuery.prototype.extend({
        next: function (sele) {
            var res = [];
            if(arguments.length === 0){
                // 返回所有找到的
                this.each(function (key, value) {
                    var temp = azjQuery.get_nextsibling(value);
                    if(temp != null){
                        res.push(temp);
                    }
                });
            }else{
                // 返回指定找到的
                this.each(function (key, value) {
                    var temp = azjQuery.get_nextsibling(value)
                    $(sele).each(function (k, v) {
                        if(v == null || v !== temp) return true;
                        res.push(v);
                    });
                });
            }
            return $(res);
        },
        prev: function (sele) {
            var res = [];
            if(arguments.length === 0){
                this.each(function (key, value) {
                    var temp = azjQuery.get_previoussibling(value);
                    if(temp == null) return true;
                    res.push(temp);
                });
            }else{
                this.each(function (key, value) {
                    var temp = azjQuery.get_previoussibling(value);
                    $(sele).each(function (k, v) {
                        if(v == null || temp !== v) return true;
                        res.push(v);
                    })
                });
            }
            return $(res);
        }
    });
    // 属性操作相关的方法
    azjQuery.prototype.extend({
        attr: function (attr, value) {
            // 1.判断是否是字符串
            if(azjQuery.isString(attr)){
                // 判断是一个字符串还是两个字符串
                if(arguments.length === 1){
                    return this[0].getAttribute(attr);
                }else{
                    this.each(function (key, ele) {
                        ele.setAttribute(attr, value);
                    });
                }
            }
            // 2.判断是否是对象
            else if(azjQuery.isObject(attr)){
                var $this = this;
                // 遍历取出所有属性节点的名称和对应的值
                $.each(attr, function (key, value) {
                    // 遍历取出所有的元素
                    $this.each(function (k, ele) {
                        ele.setAttribute(key, value);
                    });
                });
            }
            return this;
        },
        prop: function (attr, value) {
            // 1.判断是否是字符串
            if(azjQuery.isString(attr)){
                // 判断是一个字符串还是两个字符串
                if(arguments.length === 1){
                    return this[0][attr];
                }else{
                    this.each(function (key, ele) {
                        ele[attr] = value;
                    });
                }
            }
            // 2.判断是否是对象
            else if(azjQuery.isObject(attr)){
                var $this = this;
                // 遍历取出所有属性节点的名称和对应的值
                $.each(attr, function (key, value) {
                    // 遍历取出所有的元素
                    $this.each(function (k, ele) {
                        ele[key] = value;
                    });
                });
            }
            return this;
        },
        css: function (attr, value) {
            // 1.判断是否是字符串
            if(azjQuery.isString(attr)){
                // 判断是一个字符串还是两个字符串
                if(arguments.length === 1){
                    return azjQuery.getStyle(this[0], attr);
                }else{
                    this.each(function (key, ele) {
                        ele.style[attr] = value;
                    });
                }
            }
            // 2.判断是否是对象
            else if(azjQuery.isObject(attr)){
                var $this = this;
                // 遍历取出所有属性节点的名称和对应的值
                $.each(attr, function (key, value) {
                    // 遍历取出所有的元素
                    $this.each(function (k, ele) {
                        ele.style[key] = value;
                    });
                });
            }
            return this;
        },
        val: function (content) {
            if(arguments.length === 0){
                return this[0].value;
            }else{
                this.each(function (key, ele) {
                    ele.value = content;
                });
                return this;
            }
        },
        hasClass: function (name) {
            var flag = false;
            if(arguments.length === 0){
                return flag;
            }else{
                this.each(function (key, ele) {
                    // 1.获取元素中class保存的值
                    var className = " "+ele.className+" ";
                    // 2.给指定字符串的前后也加上空格
                    name = " "+name+" ";
                    // 3.通过indexOf判断是否包含指定的字符串
                    if(className.indexOf(name) != -1){
                        flag = true;
                        return false;
                    }
                });
                return flag;
            }
        },
        addClass: function (name) {
            if(arguments.length === 0) return this;

            // 1.对传入的类名进行切割
            var names = name.split(" ");
            // 2.遍历取出所有的元素
            this.each(function (key, ele) {
                // 3.遍历数组取出每一个类名
                $.each(names, function (k, value) {
                    // 4.判断指定元素中是否包含指定的类名
                    if(!$(ele).hasClass(value)){
                        ele.className = ele.className + " " + value;
                    }
                });
            });
            return this;
        },
        removeClass: function (name) {
            if(arguments.length === 0){
                this.each(function (key, ele) {
                    ele.className = "";
                });
            }else{
                // 1.对传入的类名进行切割
                var names = name.split(" ");
                // 2.遍历取出所有的元素
                this.each(function (key, ele) {
                    // 3.遍历数组取出每一个类名
                    $.each(names, function (k, value) {
                        // 4.判断指定元素中是否包含指定的类名
                        if($(ele).hasClass(value)){
                            ele.className = (" "+ele.className+" ").replace(" "+value+" ", "");
                        }
                    });
                });
            }
            return this;
        },
        toggleClass: function (name) {
            if(arguments.length === 0){
                this.removeClass();
            }else{
                // 1.对传入的类名进行切割
                var names = name.split(" ");
                // 2.遍历取出所有的元素
                this.each(function (key, ele) {
                    // 3.遍历数组取出每一个类名
                    $.each(names, function (k, value) {
                        // 4.判断指定元素中是否包含指定的类名
                        if($(ele).hasClass(value)){
                            // 删除
                            $(ele).removeClass(value);
                        }else{
                            // 添加
                            $(ele).addClass(value);
                        }
                    });
                });
            }
            return this;
        }
    });
    // 事件操作相关的方法
    azjQuery.prototype.extend({
        on: function (name, callBack) {
            // 1.遍历取出所有元素
            this.each(function (key, ele) {
                // 2.判断当前元素中是否有保存所有事件的对象
                if(!ele.eventsCache){
                    ele.eventsCache = {};
                }
                // 3.判断对象中有没有对应类型的数组
                if(!ele.eventsCache[name]){
                    ele.eventsCache[name] = [];
                    // 4.将回调函数添加到数据中
                    ele.eventsCache[name].push(callBack);
                    // 5.添加对应类型的事件
                    azjQuery.addEvent(ele, name, function () {
                        azjQuery.each(ele.eventsCache[name], function (k, method) {
                            method.call(ele);
                        });
                    });
                }else{
                    // 6.将回调函数添加到数据中
                    ele.eventsCache[name].push(callBack);
                }
            });
            return this;
        },
        off: function (name, callBack) {
            // 1.判断是否没有传入参数
            if(arguments.length === 0){
                this.each(function (key, ele) {
                    ele.eventsCache = {};
                });
            }
            // 2.判断是否传入了一个参数
            else if(arguments.length === 1){
                this.each(function (key, ele) {
                    ele.eventsCache[name] = [];
                });
            }
            // 3.判断是否传入了两个参数
            else if(arguments.length === 2){
                this.each(function (key, ele) {
                    azjQuery.each(ele.eventsCache[name], function (index, method) {
                        // 判断当前遍历到的方法和传入的方法是否相同
                        if(method === callBack){
                            ele.eventsCache[name].splice(index,  1);
                        }
                    });
                });
            }
            return this;
        }
    });
    //ajax请求
    azjQuery.prototype.extend({
        obj2str:function(data){
            data = data || {}; // 如果没有传参, 为了添加随机因子,必须自己创建一个对象
            data.t = new Date().getTime();
            var res = [];
            for(var key in data){
                // URL中只可以出现字母/数字/下划线/ASCII码, 如果出现了中文需要调用encodeURIComponent方法转码
                res.push(encodeURIComponent(key)+"="+encodeURIComponent(data[key])); // [userName=azhou, userPwd=123456];
            }
            return res.join("&"); // userName=azhou&userPwd=123456
        },
        ajaxPrototype:function(option){
            // 0.将对象转换为字符串
            var str = this.obj2str(option.data); // key=value&key=value;
            // 1.创建一个异步对象
            var xmlhttp, timer;
            if (window.XMLHttpRequest)
            {// code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp=new XMLHttpRequest();
            }
            else
            {// code for IE6, IE5
                xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
            }
            // 2.设置请求方式和请求地址
            /*
            method：请求的类型；GET 或 POST
            url：文件在服务器上的位置
            async：true（异步）或 false（同步）
            */
            if(option.type.toLowerCase() === "get"){
                xmlhttp.open(option.type, option.url+"?"+str, true);
                // 3.发送请求
                xmlhttp.send();
            }else{
                xmlhttp.open(option.type, option.url,true);
                // 注意点: 以下代码必须放到open和send之间
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                xmlhttp.send(str);
            }

            // 4.监听状态的变化
            xmlhttp.onreadystatechange = function (ev2) {
                /*
                0: 请求未初始化
                1: 服务器连接已建立
                2: 请求已接收
                3: 请求处理中
                4: 请求已完成，且响应已就绪
                */
                if(xmlhttp.readyState === 4){
                    clearInterval(timer);
                    // 判断是否请求成功
                    if(xmlhttp.status >= 200 && xmlhttp.status < 300 ||
                        xmlhttp.status === 304){
                        // 5.处理返回的结果
                        // console.log("接收到服务器返回的数据");
                        option.success(xmlhttp);
                    }else{
                        // console.log("没有接收到服务器返回的数据");
                        option.error(xmlhttp);
                    }
                }
            };
            // 判断外界是否传入了超时时间
            if(option.timeout){
                timer = setInterval(function () {
                    console.log("中断请求");
                    xmlhttp.abort();
                    clearInterval(timer);
                }, option.timeout);
            }
        },
    });
    //将azjQuery函数指向的原型对象，赋值给init构造函数的原型对象
    azjQuery.prototype.init.prototype = azjQuery.prototype;
    window.azjQuery = window.$ = azjQuery;
})( window );