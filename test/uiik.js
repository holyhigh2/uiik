/* uiik 1.1.0 @holyhigh2 https://github.com/holyhigh2/uiik */
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
function isArray(v) {
    return Array.isArray(v);
}

function isString(v) {
    return typeof v === 'string' || v instanceof String;
}

const PRIMITIVE_TYPES = [
    'string',
    'number',
    'bigint',
    'boolean',
    'undefined',
    'symbol',
];
function isObject(v) {
    return null !== v && PRIMITIVE_TYPES.indexOf(typeof v) < 0;
}

function isFunction(v) {
    return typeof v == 'function' || v instanceof Function;
}

function isArrayLike(v) {
    if (isString(v) && v.length > 0)
        return true;
    if (!isObject(v))
        return false;
    const list = v;
    if (list.length !== undefined) {
        const proto = list.constructor.prototype;
        if (isFunction(proto.item))
            return true;
        if (isFunction(list[Symbol.iterator]))
            return true;
    }
    return false;
}

function isDefined(v) {
    return v !== undefined;
}

function isElement(v) {
    return typeof v === 'object' && v instanceof HTMLElement;
}

function isEmpty(v) {
    if (null === v)
        return true;
    if (undefined === v)
        return true;
    if ('' === v)
        return true;
    if (0 === v)
        return true;
    if (isArrayLike(v) && v.length < 1)
        return true;
    if (v instanceof Object && Object.keys(v).length < 1)
        return true;
    return false;
}

function isRegExp(v) {
    return typeof v === 'object' && v instanceof RegExp;
}

function eq(a, b) {
    if (Number.isNaN(a) && Number.isNaN(b))
        return true;
    return a === b;
}

function isMap(v) {
    return v instanceof Map;
}

function isNil(v) {
    return v === null || v === undefined;
}

function isMatchWith(target, props, comparator = eq) {
    if (isNil(props))
        return true;
    const ks = Object.keys(props);
    if (!isObject(target))
        return false;
    let rs = true;
    for (let i = ks.length; i--;) {
        const k = ks[i];
        const v1 = target[k];
        const v2 = props[k];
        if (isObject(v1) && isObject(v2)) {
            if (!isMatchWith(v1, v2, comparator)) {
                rs = false;
                break;
            }
        }
        else {
            if (!comparator(v1, v2, k, target, props)) {
                rs = false;
                break;
            }
        }
    }
    return rs;
}

function isMatch(object, props) {
    return isMatchWith(object, props, eq);
}

function isNumber(v) {
    return typeof v === 'number' || v instanceof Number;
}

function isSet(v) {
    return v instanceof Set;
}

function isUndefined(v) {
    return v === undefined;
}

function identity(v) {
    return v;
}

function toPath$1(path) {
    let chain = path;
    if (isArray(chain)) {
        chain = chain.join('.');
    }
    else {
        chain += '';
    }
    const rs = (chain + '')
        .replace(/\[([^\]]+)\]/gm, '.$1')
        .replace(/^\./g, '')
        .split('.');
    return rs;
}

function get(obj, path, defaultValue) {
    if (!isObject(obj))
        return defaultValue;
    const chain = toPath$1(path);
    let target = obj;
    for (let i = 0; i < chain.length; i++) {
        const seg = chain[i];
        target = target[seg];
        if (!target)
            break;
    }
    if (target === undefined)
        target = defaultValue;
    return target;
}

function prop(path) {
    return (obj) => {
        return get(obj, path);
    };
}

function toPath(path) {
    return toPath$1(path);
}

function matcher(props) {
    return (obj) => {
        return isMatch(obj, props);
    };
}

function iteratee(value) {
    if (isUndefined(value)) {
        return identity;
    }
    else if (isFunction(value)) {
        return value;
    }
    else if (isString(value)) {
        return prop(value);
    }
    else if (isArray(value)) {
        return prop(toPath(value));
    }
    else if (isObject(value)) {
        return matcher(value);
    }
    return () => false;
}

function _eachIterator(collection, callback, forRight) {
    let values;
    let keys;
    if (isString(collection) || isArrayLike(collection)) {
        let size = collection.length;
        if (forRight) {
            while (size--) {
                const r = callback(collection[size], size, collection);
                if (r === false)
                    return;
            }
        }
        else {
            for (let i = 0; i < size; i++) {
                const r = callback(collection[i], i, collection);
                if (r === false)
                    return;
            }
        }
    }
    else if (isSet(collection)) {
        let size = collection.size;
        if (forRight) {
            values = Array.from(collection);
            while (size--) {
                const r = callback(values[size], size, collection);
                if (r === false)
                    return;
            }
        }
        else {
            values = collection.values();
            for (let i = 0; i < size; i++) {
                const r = callback(values.next().value, i, collection);
                if (r === false)
                    return;
            }
        }
    }
    else if (isMap(collection)) {
        let size = collection.size;
        keys = collection.keys();
        values = collection.values();
        if (forRight) {
            keys = Array.from(keys);
            values = Array.from(values);
            while (size--) {
                const r = callback(values[size], keys[size], collection);
                if (r === false)
                    return;
            }
        }
        else {
            for (let i = 0; i < size; i++) {
                const r = callback(values.next().value, keys.next().value, collection);
                if (r === false)
                    return;
            }
        }
    }
    else if (isObject(collection)) {
        keys = Object.keys(collection);
        let size = keys.length;
        if (forRight) {
            while (size--) {
                const k = keys[size];
                const r = callback(collection[k], k, collection);
                if (r === false)
                    return;
            }
        }
        else {
            for (let i = 0; i < size; i++) {
                const k = keys[i];
                const r = callback(collection[k], k, collection);
                if (r === false)
                    return;
            }
        }
    }
}

function each(collection, callback) {
    _eachIterator(collection, callback, false);
}

function find(collection, predicate) {
    const callback = iteratee(predicate);
    let rs;
    each(collection, (v, k, c) => {
        const r = callback(v, k, c);
        if (r) {
            rs = v;
            return false;
        }
    });
    return rs;
}

function map(collection, itee) {
    const rs = [];
    const cb = iteratee(itee);
    each(collection, (v, k, c) => {
        const r = cb(v, k, c);
        rs.push(r);
    });
    return rs;
}

function keys(obj) {
    if (obj === null || obj === undefined)
        return [];
    return Object.keys(obj);
}

function values(obj) {
    return keys(obj).map((k) => obj[k]);
}

function toArray(collection) {
    if (isArray(collection))
        return collection.concat();
    if (isFunction(collection))
        return [collection];
    if (isSet(collection)) {
        return Array.from(collection);
    }
    else if (isString(collection)) {
        return collection.split('');
    }
    else if (isArrayLike(collection)) {
        return Array.from(collection);
    }
    else if (isMap(collection)) {
        return Array.from(collection.values());
    }
    else if (isObject(collection)) {
        return values(collection);
    }
    return [collection];
}

function flat(array, depth = 1) {
    if (depth < 1)
        return array.concat();
    const rs = toArray(array).reduce((acc, val) => {
        return acc.concat(Array.isArray(val) && depth > 0 ? flat(val, depth - 1) : val);
    }, []);
    return rs;
}

function flatMap(collection, itee, depth) {
    return flat(map(collection, itee), depth || 1);
}

function slice(array, begin, end) {
    return toArray(array).slice(begin || 0, end);
}

function includes(collection, value, fromIndex) {
    let rs = false;
    fromIndex = fromIndex || 0;
    if (isString(collection)) {
        return collection.includes(value, fromIndex);
    }
    collection = isArrayLike(collection)
        ? slice(collection, fromIndex)
        : collection;
    each(collection, (v) => {
        if (eq(v, value)) {
            rs = true;
            return false;
        }
    });
    return rs;
}

function reject(collection, predicate) {
    const rs = [];
    const callback = iteratee(predicate);
    each(collection, (v, k, c) => {
        const r = callback(v, k, c);
        if (!r) {
            rs.push(v);
        }
    });
    return rs;
}

function size(collection) {
    if (isNil(collection))
        return 0;
    if ((collection.length))
        return collection.length;
    if (isMap(collection) || isSet(collection))
        return collection.size;
    if (isObject(collection))
        return Object.keys(collection).length;
    return 0;
}

function some(collection, predicate) {
    let rs = false;
    const callback = iteratee(predicate || (() => true));
    each(collection, (v, k, c) => {
        const r = callback(v, k, c);
        if (r) {
            rs = true;
            return false;
        }
    });
    return rs;
}

function toString(v) {
    if (isNil(v))
        return '';
    if (v === 0 && 1 / v < 0)
        return '-0';
    return v.toString();
}

function eachSources(target, sources, handler, afterHandler) {
    sources.forEach((src) => {
        if (!isObject(src))
            return;
        Object.keys(src).forEach((k) => {
            let v = src[k];
            if (handler) {
                v = handler(src[k], target[k], k, src, target);
            }
            afterHandler(v, src[k], target[k], k, src, target);
        });
    });
}

function checkTarget(target) {
    if (target === null || target === undefined)
        return {};
    if (!isObject(target))
        return new target.constructor(target);
    if (!Object.isExtensible(target) ||
        Object.isFrozen(target) ||
        Object.isSealed(target)) {
        return target;
    }
}

function assignWith(target, ...sources) {
    const rs = checkTarget(target);
    if (rs)
        return rs;
    let src = sources;
    const sl = sources.length;
    let handler = src[sl - 1];
    if (!handler || !handler.call) {
        handler = identity;
    }
    else {
        src = src.slice(0, sl - 1);
    }
    eachSources(target, src, handler, (v, sv, tv, k, s, t) => {
        t[k] = v;
    });
    return target;
}

function assign(target, ...sources) {
    return assignWith(target, ...sources, identity);
}

function noop() {
    return undefined;
}

function concat(...arrays) {
    if (arrays.length < 1)
        return [];
    arrays = arrays.map((alk) => (isArrayLike(alk) ? toArray(alk) : alk));
    return toArray(arrays[0]).concat(...arrays.slice(1));
}

function mergeWith(target, ...sources) {
    const rs = checkTarget(target);
    if (rs)
        return rs;
    let src = sources;
    const sl = src.length;
    let handler = src[sl - 1];
    if (!isFunction(handler)) {
        handler = noop;
    }
    else {
        src = src.slice(0, sl - 1);
    }
    walkSources(target, src, handler, []);
    return target;
}
function walkSources(target, src, handler, stack) {
    eachSources(target, src, null, (v, sv, tv, k, s, t) => {
        const path = concat(stack, k);
        v = handler(sv, tv, k, s, t, path);
        if (v !== undefined) {
            t[k] = v;
        }
        else {
            if (isObject(tv) && !isFunction(tv)) {
                walkSources(tv, [sv], handler, path);
            }
            else {
                t[k] = sv;
            }
        }
    });
}

function merge(target, ...sources) {
    return mergeWith(target, ...sources, noop);
}

var __classPrivateFieldGet$6 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet$4 = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Uii_listeners;
/**
 * A Base class for all Uii classes
 */
class Uii {
    constructor(ele, opts) {
        this.enabled = true;
        _Uii_listeners.set(this, []);
        this.opts = opts || {};
        if (isArrayLike(ele) && !isString(ele)) {
            this.ele = map(ele, (el) => {
                let e = isString(el) ? document.querySelector(el) : el;
                if (!isElement(e)) {
                    console.error('Invalid element "' + el + '"');
                    return false;
                }
                return e;
            });
        }
        else {
            const el = isString(ele) ? document.querySelectorAll(ele) : ele;
            if (!isElement(el) && !isArrayLike(el)) {
                console.error('Invalid element "' + ele + '"');
                return;
            }
            this.ele = isArrayLike(el) ? toArray(el) : [el];
        }
    }
    /**
     * 销毁uii对象，包括卸载事件、清空元素等
     */
    destroy() {
        each(__classPrivateFieldGet$6(this, _Uii_listeners, "f"), (ev) => {
            ev[0].removeEventListener(ev[1], ev[2], ev[3]);
        });
        __classPrivateFieldSet$4(this, _Uii_listeners, [], "f");
    }
    /**
     * 注册事件，以便在{@link destroy}方法中卸载
     * @param el dom元素
     * @param event 事件名
     * @param hook 回调函数
     * @param useCapture 默认false
     */
    registerEvent(el, event, hook, useCapture = false) {
        const wrapper = ((ev) => {
            if (!this.enabled)
                return;
            hook(ev);
        }).bind(this);
        el.addEventListener(event, wrapper, useCapture);
        __classPrivateFieldGet$6(this, _Uii_listeners, "f").push([el, event, wrapper, useCapture]);
    }
    /**
     * 禁用uii实例，禁用后的dom不会响应事件
     */
    disable() {
        this.enabled = false;
    }
    /**
     * 启用uii实例
     */
    enable() {
        this.enabled = true;
    }
    /**
     * 获取uii实例选项对象
     */
    getOptions() {
        return this.opts;
    }
    /**
     * 获取指定名称的选项值
     * @param name
     * @returns
     */
    getOption(name) {
        return this.opts[name];
    }
    /**
     * 设置多个选项值。触发`onOptionChanged`
     * @param options
     */
    setOptions(options) {
        assign(this.opts, options);
        this.onOptionChanged(this.opts);
    }
    /**
     * 设置指定name的选项值。触发`onOptionChanged`
     * @param name
     * @param value
     */
    setOption(name, value) {
        this.opts[name] = value;
        this.onOptionChanged(this.opts);
    }
    /**
     * @internal
     */
    onOptionChanged(opts) { }
}
_Uii_listeners = new WeakMap();

/* eslint-disable max-len */
/**
 * 获取child相对于parent的offset信息。含border宽度
 * @returns
 */
function getOffset(child, parent) {
    const rs = { x: 0, y: 0 };
    let op = child.offsetParent;
    while (op && parent && op !== parent) {
        const style = window.getComputedStyle(op);
        rs.x += op.offsetLeft + parseFloat(style.borderLeftWidth);
        rs.y += op.offsetTop + parseFloat(style.borderTopWidth);
        op = op.offsetParent;
    }
    rs.x += child.offsetLeft;
    rs.y += child.offsetTop;
    return rs;
}
/**
 * 边缘检测最小内部边距
 */
const EDGE_THRESHOLD = 5;
const DRAGGING_RULE = "body * { pointer-events: none; }";
let lockSheet;
function lockPage() {
    lockSheet = getFirstSS();
    lockSheet === null || lockSheet === void 0 ? void 0 : lockSheet.insertRule(DRAGGING_RULE, 0);
}
function unlockPage() {
    lockSheet === null || lockSheet === void 0 ? void 0 : lockSheet.deleteRule(0);
}
function getFirstSS() {
    if (document.styleSheets.length < 1) {
        document.head.appendChild(document.createElement('style'));
    }
    const sheet = find(document.styleSheets, ss => !ss.href);
    if (!sheet) {
        document.head.appendChild(document.createElement('style'));
    }
    return sheet || find(document.styleSheets, ss => !ss.href);
}
let cursor = { html: '', body: '' };
function saveCursor() {
    cursor.body = document.body.style.cursor;
    cursor.html = document.documentElement.style.cursor;
}
function setCursor(cursor) {
    document.body.style.cursor = document.documentElement.style.cursor = cursor;
}
function restoreCursor() {
    document.body.style.cursor = cursor.body;
    document.documentElement.style.cursor = cursor.html;
}

var __classPrivateFieldGet$5 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Splittable_instances, _Splittable_checkDirection, _Splittable_bindHandle;
const THRESHOLD$4 = 1;
const CLASS_SPLITTABLE = "uii-splittable";
const CLASS_SPLITTABLE_HANDLE = "uii-splittable-handle";
const CLASS_SPLITTABLE_HANDLE_GHOST = "uii-splittable-handle-ghost";
const CLASS_SPLITTABLE_HANDLE_ACTIVE = "uii-splittable-handle-active";
const CLASS_SPLITTABLE_V = "uii-splittable-v";
const CLASS_SPLITTABLE_H = "uii-splittable-h";
function getRootEl(el, root) {
    let rs = el.parentNode;
    while (rs && rs.parentNode !== root) {
        rs = rs.parentNode;
    }
    return rs;
}
/**
 * 用于表示一个或多个分割器的定义
 * > 可用CSS接口
 * - .uii-splittable
 * - .uii-splittable-handle
 * - .uii-splittable-handle-ghost
 * - .uii-splittable-handle-active
 * - .uii-splittable-v
 * - .uii-splittable-h
 * @public
 */
class Splittable extends Uii {
    constructor(container, opts) {
        super(container, assign({
            handleSize: 10,
            minSize: 0,
            sticky: false,
            inside: false,
            ghost: false
        }, opts));
        _Splittable_instances.add(this);
        each(this.ele, con => {
            //detect container position
            const pos = window.getComputedStyle(con).position;
            if (pos === "static") {
                con.style.position = "relative";
            }
            con.classList.toggle(CLASS_SPLITTABLE, true);
            const handleDoms = con.querySelectorAll(this.opts.handle);
            const children = reject(con.children, c => {
                if (includes(handleDoms, c))
                    return true;
                return false;
            });
            const dir = __classPrivateFieldGet$5(this, _Splittable_instances, "m", _Splittable_checkDirection).call(this, con);
            con.classList.toggle(dir === 'v' ? CLASS_SPLITTABLE_V : CLASS_SPLITTABLE_H, true);
            const minSizeAry = map(children, (c, i) => {
                if (isArray(this.opts.minSize)) {
                    return this.opts.minSize[i] || 0;
                }
                else {
                    return this.opts.minSize;
                }
            });
            const stickyAry = map(children, (c, i) => {
                if (isArray(this.opts.sticky)) {
                    return this.opts.sticky[i] || false;
                }
                else {
                    return this.opts.sticky;
                }
            });
            if (isEmpty(handleDoms)) {
                const len = children.length - 1;
                for (let i = 0; i < len; i++) {
                    __classPrivateFieldGet$5(this, _Splittable_instances, "m", _Splittable_bindHandle).call(this, minSizeAry.slice(i, i + 2), stickyAry.slice(i, i + 2), this.opts, dir, children[i], children[i + 1]);
                }
            }
            else {
                each(handleDoms, (h, i) => {
                    const isRoot = h.parentNode.classList.contains(CLASS_SPLITTABLE);
                    let dom1, dom2;
                    if (isRoot) {
                        dom1 = h.previousElementSibling;
                        dom2 = h.nextElementSibling;
                    }
                    else {
                        dom2 = getRootEl(h, con);
                        dom1 = dom2.previousElementSibling;
                    }
                    __classPrivateFieldGet$5(this, _Splittable_instances, "m", _Splittable_bindHandle).call(this, minSizeAry.slice(i, i + 2), stickyAry.slice(i, i + 2), this.opts, dir, dom1, dom2, h);
                });
            }
        });
    }
}
_Splittable_instances = new WeakSet(), _Splittable_checkDirection = function _Splittable_checkDirection(container) {
    let dir = 'h';
    const child = container.children[0];
    let lastY = child.offsetTop;
    each(container.children, c => {
        if (c.offsetTop != lastY) {
            dir = 'v';
            return false;
        }
    });
    return dir;
}, _Splittable_bindHandle = function _Splittable_bindHandle(minSizeAry, stickyAry, opts, dir, dom1, dom2, handle) {
    var _a;
    const handleSize = opts.handleSize;
    if (!handle) {
        handle = document.createElement('div');
        let initPos = 0;
        if (!opts.inside) {
            initPos = (dir === 'v' ? dom2.offsetTop : dom2.offsetLeft);
        }
        const sensorHCss = `width:${handleSize}px;height:100%;top:0;left:${initPos - handleSize / 2}px;z-index:9;`;
        const sensorVCss = `height:${handleSize}px;width:100%;left:0;top:${initPos - handleSize / 2}px;z-index:9;`;
        handle.style.cssText =
            'position: absolute;' + (dir === 'v' ? sensorVCss : sensorHCss);
        if (opts.inside) {
            dom2.appendChild(handle);
        }
        (_a = dom2.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(handle, dom2);
    }
    handle.style.cursor = dir === 'v' ? 's-resize' : 'e-resize';
    handle.dataset.cursor = handle.style.cursor;
    handle.classList.add(CLASS_SPLITTABLE_HANDLE);
    const minSize1 = minSizeAry[0];
    const minSize2 = minSizeAry[1];
    let sticky1 = stickyAry[0];
    let sticky2 = stickyAry[1];
    const onStart = opts.onStart;
    const onSplit = opts.onSplit;
    const onEnd = opts.onEnd;
    const onSticky = opts.onSticky;
    const onClone = opts.onClone;
    const oneSideMode = opts.oneSideMode;
    const updateStart = !oneSideMode || oneSideMode === 'start';
    const updateEnd = !oneSideMode || oneSideMode === 'end';
    handle.onmousedown = function (e) {
        // 1. 获取原始高度/宽度;设置宽度/高度
        let originSize = 0;
        let originSize1 = 0;
        const originPosX = e.clientX;
        const originPosY = e.clientY;
        let splitterSize = 1;
        let blockSize = 0; // 分割区size
        switch (dir) {
            case 'v':
                originSize = dom1.offsetHeight;
                originSize1 = dom2.offsetHeight;
                splitterSize = handle.offsetHeight;
                break;
            case 'h':
                originSize = dom1.offsetWidth;
                originSize1 = dom2.offsetWidth;
                splitterSize = handle.offsetWidth;
                break;
        }
        blockSize = splitterSize + originSize + originSize1;
        const dom1Style = dom1.style;
        const dom2Style = dom2.style;
        //ghost
        const ghost = opts.ghost;
        const ghostClass = opts.ghostClass;
        let ghostNode = null;
        // 初始化sticked位置
        let sticked = 'none';
        if (originSize < minSize1 / 2) {
            sticked = 'start';
        }
        else if (blockSize - originSize - splitterSize < minSize2 / 2) {
            sticked = 'end';
        }
        let dragging = false;
        saveCursor();
        let startPos = dir === 'v' ? dom1.offsetTop : dom1.offsetLeft;
        let ds1, anotherSize;
        const dragListener = (ev) => {
            var _a;
            const offsetx = ev.clientX - originPosX;
            const offsety = ev.clientY - originPosY;
            if (!dragging) {
                if (Math.abs(offsetx) > THRESHOLD$4 || Math.abs(offsety) > THRESHOLD$4) {
                    dragging = true;
                    handle === null || handle === void 0 ? void 0 : handle.classList.add(CLASS_SPLITTABLE_HANDLE_ACTIVE);
                    if (ghost) {
                        ghostNode = handle.cloneNode(true);
                        ghostNode.style.opacity = '0.3';
                        ghostNode.style.pointerEvents = 'none';
                        ghostNode.classList.add(CLASS_SPLITTABLE_HANDLE_GHOST);
                        if (ghostNode) {
                            if (ghostClass) {
                                ghostNode.className =
                                    ghostNode.className.replace(ghostClass, '') + ' ' + ghostClass;
                            }
                            (_a = handle === null || handle === void 0 ? void 0 : handle.parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(ghostNode);
                            onClone && onClone({ clone: ghostNode }, e);
                        }
                    }
                    lockPage();
                    setCursor((handle === null || handle === void 0 ? void 0 : handle.dataset.cursor) || '');
                    onStart && onStart({ size1: originSize, size2: originSize1 }, ev);
                }
                else {
                    ev.preventDefault();
                    return false;
                }
            }
            let doSticky = false;
            ds1 = dir === 'v' ? originSize + offsety : originSize + offsetx;
            if (ds1 < minSize1 / 2 && sticky1 && minSize1 > 0) {
                if (sticked == 'none') {
                    doSticky = true;
                    sticked = 'start';
                }
                ds1 = 0;
            }
            else if (ds1 < minSize1) {
                ds1 = minSize1;
                if (sticked == 'start' && sticky1) {
                    // 重置状态
                    doSticky = true;
                    sticked = 'none';
                }
            }
            else if (blockSize - ds1 - splitterSize < minSize2 / 2 &&
                sticky2) {
                if (sticked == 'none') {
                    doSticky = true;
                    sticked = 'end';
                }
                ds1 = blockSize - splitterSize;
            }
            else if (blockSize - ds1 - splitterSize < minSize2) {
                ds1 = blockSize - minSize2 - splitterSize;
                if (sticked == 'end' && sticky2) {
                    // 重置状态
                    doSticky = true;
                    sticked = 'none';
                }
            }
            anotherSize = blockSize - ds1 - splitterSize;
            if (ghostNode) {
                if (dir === 'v') {
                    ghostNode.style.top = startPos + ds1 - handleSize / 2 + 'px';
                }
                else {
                    ghostNode.style.left = startPos + ds1 - handleSize / 2 + 'px';
                }
            }
            else {
                const updateProp = dir === 'v' ? 'height' : 'width';
                if (updateStart) {
                    dom1Style.setProperty(updateProp, ds1 + 'px', 'important');
                }
                if (updateEnd) {
                    dom2Style.setProperty(updateProp, anotherSize + 'px', 'important');
                }
                if (doSticky) {
                    onSticky && onSticky({ size1: ds1, size2: anotherSize, position: sticked }, ev);
                }
                //update handle
                if (dir === 'v') {
                    handle.style.top = dom2.offsetTop - handleSize / 2 + 'px';
                }
                else {
                    handle.style.left = dom2.offsetLeft - handleSize / 2 + 'px';
                }
            }
            onSplit && onSplit({ size1: ds1, size2: anotherSize }, ev);
            ev.preventDefault();
            return false;
        };
        const dragEndListener = (ev) => {
            var _a, _b;
            document.removeEventListener('mousemove', dragListener, false);
            document.removeEventListener('mouseup', dragEndListener, false);
            window.removeEventListener('blur', dragEndListener, false);
            if (dragging) {
                switch (dir) {
                    case 'v':
                        originSize = (dom1 === null || dom1 === void 0 ? void 0 : dom1.offsetHeight) || -1;
                        originSize1 = (dom2 === null || dom2 === void 0 ? void 0 : dom2.offsetHeight) || -1;
                        break;
                    case 'h':
                        originSize = (dom1 === null || dom1 === void 0 ? void 0 : dom1.offsetWidth) || -1;
                        originSize1 = (dom2 === null || dom2 === void 0 ? void 0 : dom2.offsetWidth) || -1;
                        break;
                }
                handle === null || handle === void 0 ? void 0 : handle.classList.remove(CLASS_SPLITTABLE_HANDLE_ACTIVE);
                if (ghostNode) {
                    const updateProp = dir === 'v' ? 'height' : 'width';
                    if (updateStart) {
                        dom1Style.setProperty(updateProp, ds1 + 'px', 'important');
                    }
                    if (updateEnd) {
                        dom2Style.setProperty(updateProp, anotherSize + 'px', 'important');
                    }
                    //update handle
                    if (dir === 'v') {
                        handle.style.top = startPos + ds1 - handleSize / 2 + 'px';
                    }
                    else {
                        handle.style.left = startPos + ds1 - handleSize / 2 + 'px';
                    }
                    ((_a = ghostNode.parentNode) === null || _a === void 0 ? void 0 : _a.contains(ghostNode)) && ((_b = ghostNode.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(ghostNode));
                }
                unlockPage();
                restoreCursor();
                onEnd && onEnd({ size1: originSize, size2: originSize1 }, ev);
            }
        };
        document.addEventListener('mousemove', dragListener, false);
        document.addEventListener('mouseup', dragEndListener, false);
        window.addEventListener('blur', dragEndListener, false);
        e.preventDefault();
        return false;
    };
};
/**
 * Add one or more splittors into the container
 * @param container css selector or html element
 * @param opts SplittableOptions
 * @returns
 */
function newSplittable(container, opts) {
    return new Splittable(container, opts);
}

/* eslint-disable max-len */
const THRESHOLD$3 = 2;
const CLASS_RESIZABLE_HANDLE = "uii-resizable-handle";
const CLASS_RESIZABLE_HANDLE_DIR = "uii-resizable-handle-";
const CLASS_RESIZABLE_HANDLE_ACTIVE = "uii-resizable-handle-active";
/**
 * 用于表示一个或多个可改变尺寸元素的定义
 * > 可用CSS接口
 * - .uii-resizable-handle
 * - .uii-resizable-handle-[n/s/e/w/ne/nw/se/sw]
 * - .uii-resizable-handle-active
 * @public
 */
class Resizable extends Uii {
    constructor(els, opts) {
        super(els, assign({
            handleSize: 8,
            minSize: 50,
            dir: ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'],
            ghost: false,
            offset: 0
        }, opts));
        each(this.ele, (el) => {
            initHandle$1(el, this.opts);
        });
    }
}
function bindHandle$1(handle, dir, panel, opts) {
    const onStart = opts.onStart;
    const onResize = opts.onResize;
    const onEnd = opts.onEnd;
    const onClone = opts.onClone;
    handle.onmousedown = function (e) {
        // 获取panel当前信息
        const originW = panel.offsetWidth;
        const originH = panel.offsetHeight;
        const originX = panel.offsetLeft;
        const originY = panel.offsetTop;
        let changeW = false;
        let changeH = false;
        let changeX = false;
        let changeY = false;
        switch (dir) {
            case 's':
                changeH = true;
                break;
            case 'e':
                changeW = true;
                break;
            case 'n':
                changeY = true;
                changeH = true;
                break;
            case 'w':
                changeX = true;
                changeW = true;
                break;
            case 'se':
                changeW = true;
                changeH = true;
                break;
            case 'sw':
                changeX = true;
                changeW = true;
                changeH = true;
                break;
            case 'ne':
                changeY = true;
                changeW = true;
                changeH = true;
                break;
            case 'nw':
                changeX = true;
                changeY = true;
                changeW = true;
                changeH = true;
                break;
        }
        const originPosX = e.clientX;
        const originPosY = e.clientY;
        // boundary
        let minWidth;
        let minHeight;
        let maxWidth;
        let maxHeight;
        if (isArray(opts.minSize)) {
            minWidth = opts.minSize[0];
            minHeight = opts.minSize[1];
        }
        else if (isNumber(opts.minSize)) {
            minWidth = opts.minSize;
            minHeight = opts.minSize;
        }
        if (isArray(opts.maxSize)) {
            maxWidth = opts.maxSize[0];
            maxHeight = opts.maxSize[1];
        }
        else if (isNumber(opts.maxSize)) {
            maxWidth = opts.maxSize;
            maxHeight = opts.maxSize;
        }
        const minX = maxWidth ? originX - maxWidth + originW : null;
        const minY = maxHeight ? originY - maxHeight + originH : null;
        const maxX = minWidth ? originX + originW - minWidth : null;
        const maxY = minHeight ? originY + originH - minHeight : null;
        //ghost
        const ghost = opts.ghost;
        const ghostClass = opts.ghostClass;
        let ghostNode = null;
        //aspectRatio
        const aspectRatio = opts.aspectRatio;
        const panelStyle = panel.style;
        let style = panelStyle;
        let currentW = originW;
        let currentH = originH;
        let dragging = false;
        saveCursor();
        const dragListener = (ev) => {
            var _a;
            const offsetx = ev.clientX - originPosX;
            const offsety = ev.clientY - originPosY;
            if (!dragging) {
                if (Math.abs(offsetx) > THRESHOLD$3 || Math.abs(offsety) > THRESHOLD$3) {
                    dragging = true;
                    handle.classList.add(CLASS_RESIZABLE_HANDLE_ACTIVE);
                    if (ghost) {
                        if (isFunction(ghost)) {
                            ghostNode = ghost();
                        }
                        else {
                            ghostNode = panel.cloneNode(true);
                            ghostNode.style.opacity = '0.3';
                            ghostNode.style.pointerEvents = 'none';
                        }
                        if (ghostNode) {
                            if (ghostClass) {
                                ghostNode.className =
                                    ghostNode.className.replace(ghostClass, '') + ' ' + ghostClass;
                            }
                            (_a = panel.parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(ghostNode);
                            onClone && onClone({ clone: ghostNode }, ev);
                        }
                        style = ghostNode === null || ghostNode === void 0 ? void 0 : ghostNode.style;
                    }
                    lockPage();
                    setCursor(handle.dataset.cursor || '');
                    onStart && onStart({ w: originW, h: originH }, ev);
                }
                else {
                    ev.preventDefault();
                    return false;
                }
            }
            let w = originW;
            let h = originH;
            let y = originY;
            let x = originX;
            if (changeW) {
                w = originW + offsetx * (changeX ? -1 : 1);
                if (minWidth && w < minWidth)
                    w = minWidth;
                if (maxWidth && w > maxWidth)
                    w = maxWidth;
            }
            if (changeH) {
                h = originH + offsety * (changeY ? -1 : 1);
                if (minHeight && h < minHeight)
                    h = minHeight;
                if (maxHeight && h > maxHeight)
                    h = maxHeight;
            }
            if (changeY) {
                y = originY + offsety;
                if (minY && y < minY)
                    y = minY;
                if (maxY && y > maxY)
                    y = maxY;
            }
            if (changeX) {
                x = originX + offsetx;
                if (minX && x < minX)
                    x = minX;
                if (maxX && x > maxX)
                    x = maxX;
            }
            if (aspectRatio) {
                if (changeW) {
                    style.width = w + 'px';
                    style.height = w / aspectRatio + 'px';
                }
                if (changeH && dir !== 'sw') {
                    if (dir === 'nw') {
                        y = originY - w / aspectRatio + originH;
                    }
                    else {
                        style.width = h * aspectRatio + 'px';
                        style.height = h + 'px';
                    }
                }
            }
            else {
                if (changeW) {
                    style.width = w + 'px';
                }
                if (changeH) {
                    style.height = h + 'px';
                }
            }
            if (changeY) {
                style.top = y + 'px';
            }
            if (changeX) {
                style.left = x + 'px';
            }
            currentW = w;
            currentH = h;
            onResize && onResize({ w, h }, ev);
            ev.preventDefault();
            return false;
        };
        const dragEndListener = (ev) => {
            var _a, _b;
            document.removeEventListener('mousemove', dragListener, false);
            document.removeEventListener('mouseup', dragEndListener, false);
            window.removeEventListener('blur', dragEndListener, false);
            if (ghost && ghostNode) {
                ((_a = panel.parentNode) === null || _a === void 0 ? void 0 : _a.contains(ghostNode)) && ((_b = panel.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(ghostNode));
                panelStyle.left = ghostNode.style.left;
                panelStyle.top = ghostNode.style.top;
                panelStyle.width = ghostNode.style.width;
                panelStyle.height = ghostNode.style.height;
            }
            if (dragging) {
                handle.classList.remove(CLASS_RESIZABLE_HANDLE_ACTIVE);
                unlockPage();
                restoreCursor();
                onEnd && onEnd({ w: currentW, h: currentH }, ev);
            }
        };
        document.addEventListener('mousemove', dragListener, false);
        document.addEventListener('mouseup', dragEndListener, false);
        window.addEventListener('blur', dragEndListener, false);
        e.preventDefault();
        return false;
    };
}
function initHandle$1(panel, opts) {
    // create handles
    const handleSize = opts.handleSize;
    const offset = opts.offset || 0;
    each(opts.dir || ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'], (dir) => {
        const handle = document.createElement('div');
        handle.classList.add(CLASS_RESIZABLE_HANDLE, CLASS_RESIZABLE_HANDLE_DIR + dir);
        handle.setAttribute('name', 'handle');
        let css = '';
        switch (dir) {
            case 'n':
                css = `left:0px;top:${-offset}px;width:100%;height:${handleSize}px;`;
                break;
            case 's':
                css = `left:0px;bottom:${-offset}px;width:100%;height:${handleSize}px;`;
                break;
            case 'w':
                css = `top:0px;left:${-offset}px;width:${handleSize}px;height:100%;`;
                break;
            case 'e':
                css = `top:0px;right:${-offset}px;width:${handleSize}px;height:100%;`;
                break;
            default:
                css = `width:${handleSize}px;height:${handleSize}px;z-index:9;`;
                switch (dir) {
                    case 'ne':
                        css += `top:${-offset}px;right:${-offset}px;`;
                        break;
                    case 'nw':
                        css += `top:${-offset}px;left:${-offset}px;`;
                        break;
                    case 'se':
                        css += `bottom:${-offset}px;right:${-offset}px;`;
                        break;
                    case 'sw':
                        css += `bottom:${-offset}px;left:${-offset}px;`;
                }
        }
        bindHandle$1(handle, dir, panel, opts);
        handle.style.cssText = `position: absolute;cursor: ${dir}-resize;` + css;
        handle.dataset.cursor = `${dir}-resize`;
        panel.appendChild(handle);
    });
}
/**
 * Make els resizable
 * @param els selector string / html element
 * @param opts
 * @returns
 */
function newResizable(els, opts) {
    return new Resizable(els, opts);
}

function split(str, separator, limit) {
    return toString(str).split(separator, limit);
}

function test(str, pattern, flags) {
    let regExp = pattern;
    if (!isRegExp(regExp)) {
        regExp = new RegExp(pattern, flags);
    }
    return regExp.test(str);
}

function closest(node, predicate, parentKey) {
    let p = node;
    let t = null;
    let k = true;
    let i = 0;
    while (k && p) {
        if (predicate(p, i++, () => { k = false; })) {
            t = p;
            break;
        }
        p = p[parentKey];
    }
    return t;
}

function compact(array) {
    return toArray(array).filter(identity);
}

function findIndex(array, predicate, fromIndex) {
    let rs = -1;
    let fromIndexNum = fromIndex || 0;
    const itee = iteratee(predicate);
    each(slice(array, fromIndexNum), (v, k, c) => {
        const r = itee(v, k, c);
        if (r) {
            rs = k + fromIndexNum;
            return false;
        }
    });
    return rs;
}

var __classPrivateFieldGet$4 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Draggable_handleMap;
const DRAGGER_GROUPS = {};
const CLASS_DRAGGABLE = "uii-draggable";
const CLASS_DRAGGABLE_HANDLE = "uii-draggable-handle";
const CLASS_DRAGGABLE_ACTIVE = "uii-draggable-active";
const CLASS_DRAGGABLE_GHOST = "uii-draggable-ghost";
/**
 * 用于表示一个或多个可拖动元素的定义
 * > 可用CSS接口
 * - .uii-draggable
 * - .uii-draggable-handle
 * - .uii-draggable-active
 * - .uii-draggable-ghost
 * @public
 */
class Draggable extends Uii {
    constructor(els, opts) {
        super(els, assign({
            container: false,
            threshold: 0,
            ghost: false,
            direction: "",
            scroll: true,
            snapOptions: {
                tolerance: 10,
            }
        }, opts));
        _Draggable_handleMap.set(this, new WeakMap());
        if (this.opts.handle) {
            each(this.ele, (el) => {
                const h = el.querySelector(this.opts.handle);
                if (!h) {
                    console.error('No handle found "' + this.opts.handle + '"');
                    return false;
                }
                __classPrivateFieldGet$4(this, _Draggable_handleMap, "f").set(el, h);
            });
        }
        this.onOptionChanged(this.opts);
        //put into group
        if (this.opts.group) {
            if (!DRAGGER_GROUPS[this.opts.group]) {
                DRAGGER_GROUPS[this.opts.group] = [];
            }
            DRAGGER_GROUPS[this.opts.group].push(...this.ele);
        }
        each(this.ele, (el) => {
            bindEvent(this.registerEvent.bind(this), el, this.opts, __classPrivateFieldGet$4(this, _Draggable_handleMap, "f"));
            if (isDefined(this.opts.type))
                el.dataset.dropType = this.opts.type;
            el.classList.toggle(CLASS_DRAGGABLE, true);
            const ee = __classPrivateFieldGet$4(this, _Draggable_handleMap, "f").get(el) || el;
            ee.classList.toggle(CLASS_DRAGGABLE_HANDLE, true);
            if (isDefined(this.opts.cursor)) {
                el.style.cursor = this.opts.cursor.default || 'move';
                if (isDefined(this.opts.cursor.over)) {
                    el.dataset.cursorOver = this.opts.cursor.over;
                    el.dataset.cursorActive = this.opts.cursor.active || 'move';
                }
            }
        });
    }
    /**
     * @internal
     */
    onOptionChanged(opts) {
        const droppable = opts.droppable;
        if (!isFunction(droppable)) {
            if (isUndefined(droppable)) {
                opts.droppable = () => { };
            }
            else if (isString(droppable)) {
                opts.droppable = () => document.querySelectorAll(droppable);
            }
            else if (isArrayLike(droppable)) {
                opts.droppable = () => droppable;
            }
            else if (isElement(droppable)) {
                opts.droppable = () => [droppable];
            }
        }
    }
}
_Draggable_handleMap = new WeakMap();
function bindEvent(registerEvent, el, opts, handleMap) {
    registerEvent(el, "mousedown", (e) => {
        var _a;
        // get options
        let dragDom = e.currentTarget;
        let t = e.target;
        if (!t)
            return;
        let handle = handleMap.get(dragDom);
        if (handle && !handle.contains(t)) {
            return;
        }
        const filter = opts.filter;
        //check filter
        if (filter) {
            if (some(el.querySelectorAll(filter), ele => ele.contains(t)))
                return;
        }
        const computedStyle = window.getComputedStyle(dragDom);
        const container = dragDom.offsetParent || document.body;
        const inContainer = opts.container;
        const threshold = opts.threshold || 0;
        const ghost = opts.ghost;
        const ghostClass = opts.ghostClass;
        const direction = opts.direction;
        const onStart = opts.onStart;
        const onDrag = opts.onDrag;
        const onEnd = opts.onEnd;
        const onClone = opts.onClone;
        const originalZIndex = computedStyle.zIndex;
        let zIndex = opts.zIndex || originalZIndex;
        const classes = opts.classes || '';
        const group = opts.group;
        if (group) {
            let i = -1;
            each(DRAGGER_GROUPS[group], el => {
                const z = parseInt(window.getComputedStyle(el).zIndex) || 0;
                if (z > i)
                    i = z;
            });
            zIndex = i + 1;
        }
        const scroll = opts.scroll;
        const scrollSpeed = opts.scrollSpeed || 10;
        let gridX, gridY;
        const grid = opts.grid;
        if (isArray(grid)) {
            gridX = grid[0];
            gridY = grid[1];
        }
        else if (isNumber(grid)) {
            gridX = gridY = grid;
        }
        const snapOn = opts.snap;
        let snappable;
        const snapTolerance = ((_a = opts.snapOptions) === null || _a === void 0 ? void 0 : _a.tolerance) || 10;
        const onSnap = opts.onSnap;
        let lastSnapDirY = "", lastSnapDirX = "";
        let lastSnapping = "";
        let parentOffsetX = 0, parentOffsetY = 0;
        if (snapOn) {
            snappable = map(document.querySelectorAll(snapOn), (el) => {
                let offX = 0, offY = 0;
                closest(el, (el) => {
                    offX += el.offsetLeft;
                    offY += el.offsetTop;
                    return false;
                }, "offsetParent");
                return {
                    x1: offX,
                    y1: offY,
                    x2: offX + el.offsetWidth,
                    y2: offY + el.offsetHeight,
                    el: el,
                };
            });
            closest(dragDom, (el, times) => {
                if (times > 0) {
                    parentOffsetX += el.offsetLeft;
                    parentOffsetY += el.offsetTop;
                }
                return false;
            }, "offsetParent");
        }
        const originW = dragDom.offsetWidth + parseFloat(computedStyle.borderLeftWidth) + parseFloat(computedStyle.borderRightWidth);
        const originH = dragDom.offsetHeight + parseFloat(computedStyle.borderTopWidth) + parseFloat(computedStyle.borderBottomWidth);
        // boundary
        let minX = 0;
        let minY = 0;
        let maxX = 0;
        let maxY = 0;
        if (inContainer) {
            maxX = container.scrollWidth - originW;
            maxY = container.scrollHeight - originH;
        }
        if (maxX < 0)
            maxX = 0;
        if (maxY < 0)
            maxY = 0;
        //start point
        const rect = container.getBoundingClientRect();
        const offset = getOffset(t, container);
        const ox = e.offsetX || 0;
        const oy = e.offsetY || 0;
        let hitPosX = offset.x + ox + container.scrollLeft;
        let hitPosY = offset.y + oy + container.scrollTop;
        let cursorX = ox, cursorY = e.offsetY;
        if (e.target !== dragDom) {
            const offset = getOffset(t, dragDom);
            const style = window.getComputedStyle(t);
            cursorX = offset.x + ox + parseFloat(style.borderLeftWidth);
            cursorY = offset.y + oy + parseFloat(style.borderTopWidth);
        }
        const cursorAt = opts.cursorAt;
        if (cursorAt) {
            const l = cursorAt.left;
            const t = cursorAt.top;
            if (isString(l)) {
                cursorX = parseFloat(l) / 100 * dragDom.offsetWidth;
            }
            else {
                cursorX = l;
            }
            if (isString(t)) {
                cursorY = parseFloat(t) / 100 * dragDom.offsetWidth;
            }
            else {
                cursorY = t;
            }
        }
        const style = dragDom.style;
        let dragging = false;
        let copyNode;
        let timer = null;
        let toLeft = false;
        let toTop = false;
        let toRight = false;
        let toBottom = false;
        saveCursor();
        const dragListener = (ev) => {
            var _a;
            const newX = ev.clientX - rect.x + container.scrollLeft;
            const newY = ev.clientY - rect.y + container.scrollTop;
            let offsetx = newX - hitPosX;
            let offsety = newY - hitPosY;
            if (!dragging) {
                if (Math.abs(offsetx) > threshold || Math.abs(offsety) > threshold) {
                    dragging = true;
                    if (ghost) {
                        if (isFunction(ghost)) {
                            copyNode = ghost(dragDom);
                        }
                        else {
                            copyNode = dragDom.cloneNode(true);
                            copyNode.style.opacity = "0.3";
                            copyNode.style.pointerEvents = "none";
                            copyNode.style.position = "absolute";
                        }
                        copyNode.style.left = dragDom.style.left;
                        copyNode.style.top = dragDom.style.top;
                        copyNode.style.zIndex = zIndex + '';
                        if (ghostClass) {
                            copyNode.classList.add(...compact(split(ghostClass, ' ')));
                        }
                        copyNode.classList.add(...compact(split(classes, ' ')));
                        copyNode.classList.toggle(CLASS_DRAGGABLE_GHOST, true);
                        (_a = dragDom.parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(copyNode);
                        onClone && onClone({ clone: copyNode }, ev);
                    }
                    //apply classes
                    dragDom.classList.add(...compact(split(classes, ' ')));
                    if (!copyNode)
                        dragDom.style.zIndex = zIndex + '';
                    dragDom.classList.toggle(CLASS_DRAGGABLE_ACTIVE, true);
                    onStart && onStart({ draggable: dragDom }, ev);
                    lockPage();
                    if (opts.cursor) {
                        setCursor(opts.cursor.active || 'move');
                    }
                    //notify
                    const customEv = new Event("uii-dragactive", { "bubbles": true, "cancelable": false });
                    dragDom.dispatchEvent(customEv);
                }
                else {
                    ev.preventDefault();
                    return false;
                }
            }
            //edge detect
            if (scroll) {
                const ltX = ev.clientX - rect.x;
                const ltY = ev.clientY - rect.y;
                const rbX = rect.x + rect.width - ev.clientX;
                const rbY = rect.y + rect.height - ev.clientY;
                toLeft = ltX < EDGE_THRESHOLD;
                toTop = ltY < EDGE_THRESHOLD;
                toRight = rbX < EDGE_THRESHOLD;
                toBottom = rbY < EDGE_THRESHOLD;
                if (toLeft || toTop
                    ||
                        toRight || toBottom) {
                    if (!timer) {
                        timer = setInterval(() => {
                            if (toLeft) {
                                container.scrollLeft -= scrollSpeed;
                            }
                            else if (toRight) {
                                container.scrollLeft += scrollSpeed;
                            }
                            if (toTop) {
                                container.scrollTop -= scrollSpeed;
                            }
                            else if (toBottom) {
                                container.scrollTop += scrollSpeed;
                            }
                        }, 20);
                    }
                }
                else {
                    if (timer) {
                        clearInterval(timer);
                        timer = null;
                    }
                }
            }
            let x = newX - cursorX;
            let y = newY - cursorY;
            //grid
            if (isNumber(gridX) && isNumber(gridY)) {
                x = ((x / gridX) >> 0) * gridX;
                y = ((y / gridY) >> 0) * gridY;
            }
            if (inContainer) {
                if (x < minX)
                    x = minX;
                if (y < minY)
                    y = minY;
                if (x > maxX)
                    x = maxX;
                if (y > maxY)
                    y = maxY;
            }
            let canDrag = true;
            let emitSnap = false;
            if (snapOn) {
                const currPageX1 = parentOffsetX + x;
                const currPageY1 = parentOffsetY + y;
                const currPageX2 = currPageX1 + originW;
                const currPageY2 = currPageY1 + originH;
                //check snappable
                let snapX = NaN, snapY = NaN;
                let targetX, targetY;
                let snapDirX, snapDirY;
                if (!direction || direction === "v") {
                    each(snappable, (data) => {
                        if (Math.abs(data.y1 - currPageY1) <= snapTolerance) {
                            //top parallel
                            snapY = data.y1;
                            snapDirY = "t2t";
                        }
                        else if (Math.abs(data.y2 - currPageY1) <= snapTolerance) {
                            //b2t
                            snapY = data.y2;
                            snapDirY = "t2b";
                        }
                        else if (Math.abs(data.y1 - currPageY2) <= snapTolerance) {
                            //t2b
                            snapY = data.y1 - originH;
                            snapDirY = "b2t";
                        }
                        else if (Math.abs(data.y2 - currPageY2) <= snapTolerance) {
                            //bottom parallel
                            snapY = data.y2 - originH;
                            snapDirY = "b2b";
                        }
                        if (snapY) {
                            lastSnapDirY = snapDirY;
                            targetY = data.el;
                            return false;
                        }
                    });
                }
                if (!direction || direction === "h") {
                    each(snappable, (data) => {
                        if (Math.abs(data.x1 - currPageX1) <= snapTolerance) {
                            //left parallel
                            snapX = data.x1;
                            snapDirX = "l2l";
                        }
                        else if (Math.abs(data.x2 - currPageX1) <= snapTolerance) {
                            //r2l
                            snapX = data.x2;
                            snapDirX = "l2r";
                        }
                        else if (Math.abs(data.x1 - currPageX2) <= snapTolerance) {
                            //l2r
                            snapX = data.x1 - originW;
                            snapDirX = "r2l";
                        }
                        else if (Math.abs(data.x2 - currPageX2) <= snapTolerance) {
                            //right parallel
                            snapX = data.x2 - originW;
                            snapDirX = "r2r";
                        }
                        if (snapX) {
                            lastSnapDirX = snapDirX;
                            targetX = data.el;
                            return false;
                        }
                    });
                }
                if (snapX || snapY) {
                    if (snapX) {
                        x = snapX - parentOffsetX;
                    }
                    if (snapY) {
                        y = snapY - parentOffsetY;
                    }
                    if (onSnap && lastSnapping !== lastSnapDirX + "" + lastSnapDirY) {
                        setTimeout(() => {
                            //emit after relocate
                            onSnap({
                                el: copyNode || dragDom,
                                targetH: targetX,
                                targetV: targetY,
                                dirH: snapDirX,
                                dirV: snapDirY,
                            }, ev);
                        }, 0);
                        lastSnapping = lastSnapDirX + "" + lastSnapDirY;
                    }
                    emitSnap = true;
                }
                else {
                    lastSnapDirX = lastSnapDirY = lastSnapping = "";
                }
            }
            if (onDrag && !emitSnap) {
                if (onDrag({
                    draggable: dragDom,
                    ox: offsetx,
                    oy: offsety,
                    x: x,
                    y: y
                }, ev) === false) {
                    canDrag = false;
                }
            }
            if (canDrag) {
                if (copyNode) {
                    if (direction === "v") {
                        copyNode.style.top = `${y}px`;
                    }
                    else if (direction === "h") {
                        copyNode.style.left = `${x}px`;
                    }
                    else {
                        copyNode.style.left = `${x}px`;
                        copyNode.style.top = `${y}px`;
                    }
                }
                else {
                    if (direction === "v") {
                        style.top = `${y}px`;
                    }
                    else if (direction === "h") {
                        style.left = `${x}px`;
                    }
                    else {
                        style.left = `${x}px`;
                        style.top = `${y}px`;
                    }
                }
            }
            ev.preventDefault();
            return false;
        };
        const dragEndListener = (ev) => {
            var _a, _b;
            document.removeEventListener("mousemove", dragListener);
            document.removeEventListener("mouseup", dragEndListener);
            window.removeEventListener("blur", dragEndListener);
            if (scroll) {
                if (timer) {
                    clearInterval(timer);
                    timer = null;
                }
            }
            //restore classes
            dragDom.classList.remove(...compact(split(classes, ' ')));
            dragDom.style.zIndex = originalZIndex;
            dragDom.classList.remove(CLASS_DRAGGABLE_ACTIVE);
            let moveToGhost = true;
            if (dragging && onEnd) {
                moveToGhost = onEnd({ draggable: dragDom }, ev) === false ? false : true;
            }
            //notify
            const customEv = new Event("uii-dragdeactive", { "bubbles": true, "cancelable": false });
            dragDom.dispatchEvent(customEv);
            if (dragging) {
                unlockPage();
                restoreCursor();
                if (ghost) {
                    ((_a = dragDom.parentNode) === null || _a === void 0 ? void 0 : _a.contains(copyNode)) && ((_b = dragDom.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(copyNode));
                    if (moveToGhost !== false) {
                        style.left = copyNode.style.left;
                        style.top = copyNode.style.top;
                    }
                }
            }
        };
        document.addEventListener("mousemove", dragListener);
        document.addEventListener("mouseup", dragEndListener);
        window.addEventListener("blur", dragEndListener);
        e.preventDefault();
        return false;
    });
}
/**
 * create a draggable pattern for one or more elements with opts
 * @param els selector string / html element
 * @param opts
 * @returns Draggable instance
 */
function newDraggable(els, opts) {
    return new Draggable(els, opts);
}

var __classPrivateFieldGet$3 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet$3 = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Droppable_active;
const Droppables = [];
const CLASS_DROPPABLE = "uii-droppable";
/**
 * 用于表示一个或多个可响应拖动元素的定义
 * > 可用CSS接口
 * - .uii-droppable
 * @public
 */
class Droppable extends Uii {
    constructor(el, opts) {
        super(el, assign({}, opts));
        _Droppable_active.set(this, void 0);
        Droppables.push(this);
    }
    /**
     * @internal
     */
    bindEvent(droppable, opts) {
        //dragenter
        this.registerEvent(droppable, "mouseenter", (e) => {
            if (!__classPrivateFieldGet$3(this, _Droppable_active, "f"))
                return;
            if (opts.hoverClass) {
                each(split(opts.hoverClass, ' '), cls => {
                    droppable.classList.toggle(cls, true);
                });
            }
            if (__classPrivateFieldGet$3(this, _Droppable_active, "f").dataset.cursorOver) {
                setCursor(__classPrivateFieldGet$3(this, _Droppable_active, "f").dataset.cursorOver);
            }
            opts.onEnter && opts.onEnter({ draggable: __classPrivateFieldGet$3(this, _Droppable_active, "f"), droppable }, e);
        });
        //dragleave
        this.registerEvent(droppable, "mouseleave", (e) => {
            if (!__classPrivateFieldGet$3(this, _Droppable_active, "f"))
                return;
            if (opts.hoverClass) {
                each(split(opts.hoverClass, ' '), cls => {
                    droppable.classList.toggle(cls, false);
                });
            }
            if (__classPrivateFieldGet$3(this, _Droppable_active, "f").dataset.cursorOver) {
                setCursor(__classPrivateFieldGet$3(this, _Droppable_active, "f").dataset.cursorActive || '');
            }
            opts.onLeave && opts.onLeave({ draggable: __classPrivateFieldGet$3(this, _Droppable_active, "f"), droppable }, e);
        });
        //dragover
        this.registerEvent(droppable, "mousemove", (e) => {
            if (!__classPrivateFieldGet$3(this, _Droppable_active, "f"))
                return;
            opts.onOver && opts.onOver({ draggable: __classPrivateFieldGet$3(this, _Droppable_active, "f"), droppable }, e);
        });
        //drop
        this.registerEvent(droppable, "mouseup", (e) => {
            if (!__classPrivateFieldGet$3(this, _Droppable_active, "f"))
                return;
            if (opts.hoverClass) {
                each(split(opts.hoverClass, ' '), cls => {
                    droppable.classList.toggle(cls, false);
                });
            }
            opts.onDrop && opts.onDrop({ draggable: __classPrivateFieldGet$3(this, _Droppable_active, "f"), droppable }, e);
        });
    }
    /**
     * @internal
     */
    active(target) {
        let valid = true;
        const opts = this.opts;
        //check accepts
        if (isString(opts.accepts)) {
            valid = !!target.dataset.dropType && test(opts.accepts, target.dataset.dropType);
        }
        else if (isFunction(opts.accepts)) {
            valid = opts.accepts(this.ele, target);
        }
        if (!valid)
            return;
        __classPrivateFieldSet$3(this, _Droppable_active, target, "f");
        if (opts.activeClass) {
            each(this.ele, el => {
                each(split(opts.activeClass || '', ' '), cls => {
                    el.classList.toggle(cls, true);
                });
            });
        }
        opts.onActive && opts.onActive({ draggable: target, droppables: this.ele });
        //bind events
        each(this.ele, (el) => {
            el.classList.toggle(CLASS_DROPPABLE, true);
            el.style.pointerEvents = 'initial';
            this.bindEvent(el, opts);
        });
    }
    /**
     * @internal
     */
    deactive(target) {
        if (!__classPrivateFieldGet$3(this, _Droppable_active, "f"))
            return;
        __classPrivateFieldSet$3(this, _Droppable_active, null, "f");
        const opts = this.opts;
        if (opts.activeClass) {
            each(this.ele, el => {
                each(split(opts.activeClass || '', ' '), cls => {
                    el.classList.toggle(cls, false);
                });
            });
        }
        opts.onDeactive && opts.onDeactive({ draggable: target, droppables: this.ele });
        //unbind events
        this.destroy();
    }
}
_Droppable_active = new WeakMap();
//uii-drag active
document.addEventListener("uii-dragactive", (e) => {
    each(Droppables, dpb => {
        dpb.active(e.target);
    });
});
document.addEventListener("uii-dragdeactive", (e) => {
    each(Droppables, dpb => {
        dpb.deactive(e.target);
    });
});
/**
 * Enable els to response to draggable objects
 * @param els selector string / html element
 * @param opts
 * @returns
 */
function newDroppable(els, opts) {
    return new Droppable(els, opts);
}

/* eslint-disable max-len */
const ONE_DEG = 180 / Math.PI;
const THRESHOLD$2 = 2;
const CLASS_ROTATABLE = "uii-rotatable";
const CLASS_ROTATABLE_HANDLE = "uii-rotatable-handle";
const CLASS_ROTATABLE_ACTIVE = "uii-rotatable-active";
/**
 * 用于表示一个或多个可旋转元素的定义
 * > 可用CSS接口
 * - .uii-rotatable
 * - .uii-rotatable-handle
 * - .uii-rotatable-active
 * @public
 */
class Rotatable extends Uii {
    constructor(els, opts) {
        super(els, opts);
        each(this.ele, (el) => {
            initHandle(el, this.opts);
        });
    }
}
function initHandle(el, opts) {
    var _a;
    const handle = document.createElement('div');
    handle.className = CLASS_ROTATABLE_HANDLE;
    handle.style.cssText = `
    position:absolute;
    width:12px;
    height:12px;
    border-radius:50%;
    left: calc(50% - 6px);
    top: -24px;
    `;
    handle.style.cursor = ((_a = opts.cursor) === null || _a === void 0 ? void 0 : _a.default) || 'crosshair';
    bindHandle(handle, el, opts);
    el.classList.toggle(CLASS_ROTATABLE, true);
    el.appendChild(handle);
}
function bindHandle(handle, el, opts) {
    const onStart = opts.onStart;
    const onRotate = opts.onRotate;
    const onEnd = opts.onEnd;
    handle.onmousedown = function (e) {
        var _a, _b;
        // calc center
        const center = window.getComputedStyle(el).transformOrigin || '';
        const centerPair = center.split(' ');
        const shadowDom = el.cloneNode();
        shadowDom.style.cssText = 'transform:rotate(0);z-index:-999;position:absolute;';
        (_a = el.parentElement) === null || _a === void 0 ? void 0 : _a.appendChild(shadowDom);
        const offsetXY = shadowDom.getBoundingClientRect();
        (_b = el.parentElement) === null || _b === void 0 ? void 0 : _b.removeChild(shadowDom);
        let centerX = parseFloat(centerPair[0]) + offsetXY.x;
        let centerY = parseFloat(centerPair[1]) + offsetXY.y;
        let a = 0, b = 0;
        const matrix = window.getComputedStyle(el).transform;
        if (matrix.indexOf('matrix') > -1) {
            const abcd = matrix.replace(/^matrix\(|\)$/mg, '').split(',');
            a = parseFloat(abcd[0]);
            b = parseFloat(abcd[1]);
        }
        let deg = Math.atan2(b, a) * ONE_DEG;
        if (deg < 0)
            deg = 360 - deg;
        if (deg > 360)
            deg = 360 - deg % 360;
        const style = el.style;
        let startDeg = Math.atan2(e.clientY - centerY, e.clientX - centerX) * ONE_DEG + 90;
        if (startDeg < 0)
            startDeg = 360 + startDeg;
        const offsetDeg = startDeg - deg;
        let dragging = false;
        saveCursor();
        const dragListener = (ev) => {
            var _a;
            const offsetx = ev.clientX - centerX;
            const offsety = ev.clientY - centerY;
            if (!dragging) {
                if (Math.abs(offsetx) > THRESHOLD$2 || Math.abs(offsety) > THRESHOLD$2) {
                    dragging = true;
                    //apply classes
                    el.classList.toggle(CLASS_ROTATABLE_ACTIVE, true);
                    onStart && onStart({ deg }, ev);
                    lockPage();
                    if (isDefined(opts.cursor)) {
                        setCursor(((_a = opts.cursor) === null || _a === void 0 ? void 0 : _a.active) || 'crosshair');
                    }
                }
                else {
                    ev.preventDefault();
                    return false;
                }
            }
            deg = Math.atan2(offsety, offsetx) * ONE_DEG + 90 - offsetDeg;
            if (deg < 0)
                deg = 360 + deg;
            onRotate && onRotate({ deg }, ev);
            style.transform = style.transform.replace(/rotateZ\(.*?\)/, '') + ' rotateZ(' + deg + 'deg)';
            ev.preventDefault();
            return false;
        };
        const dragEndListener = (ev) => {
            document.removeEventListener('mousemove', dragListener, false);
            document.removeEventListener('mouseup', dragEndListener, false);
            window.removeEventListener('blur', dragEndListener, false);
            if (dragging) {
                unlockPage();
                restoreCursor();
                el.classList.toggle(CLASS_ROTATABLE_ACTIVE, false);
                onEnd && onEnd({ deg }, ev);
            }
        };
        document.addEventListener('mousemove', dragListener, false);
        document.addEventListener('mouseup', dragEndListener, false);
        window.addEventListener('blur', dragEndListener, false);
        e.preventDefault();
        return false;
    };
}
/**
 * Make els rotatable
 * @param els selector string / html element
 * @param opts
 * @returns
 */
function newRotatable(els, opts) {
    return new Rotatable(els, opts);
}

var __classPrivateFieldSet$2 = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$2 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CollisionDetector__targets;
class CollisionDetector {
    constructor(el, targets, opts) {
        _CollisionDetector__targets.set(this, void 0);
        __classPrivateFieldSet$2(this, _CollisionDetector__targets, targets, "f");
        this.opts = {
            container: document.body
        };
        this.opts = assign(this.opts, opts);
        const domEl = isString(el) ? document.querySelector(el) : el;
        if (!domEl) {
            console.error('Invalid selector "' + el + '"');
            return;
        }
        const ele = domEl;
        this.el = domEl;
        //el data
        const offset = getOffset(ele, this.opts.container);
        const rect = { x: offset.x, y: offset.y, width: ele.offsetWidth, height: ele.offsetHeight };
        this.elData = {
            x1: rect.x,
            y1: rect.y,
            x2: rect.x + rect.width,
            y2: rect.y + rect.height,
        };
        //targets data
        this.update();
    }
    /**
     * update targets data if them changed
     */
    update() {
        let targets;
        if (isFunction(__classPrivateFieldGet$2(this, _CollisionDetector__targets, "f"))) {
            targets = __classPrivateFieldGet$2(this, _CollisionDetector__targets, "f").call(this);
        }
        else if (isString(__classPrivateFieldGet$2(this, _CollisionDetector__targets, "f"))) {
            targets = this.opts.container.querySelectorAll(__classPrivateFieldGet$2(this, _CollisionDetector__targets, "f"));
        }
        else if (isElement(__classPrivateFieldGet$2(this, _CollisionDetector__targets, "f"))) {
            targets = [__classPrivateFieldGet$2(this, _CollisionDetector__targets, "f")];
        }
        else {
            targets = __classPrivateFieldGet$2(this, _CollisionDetector__targets, "f");
        }
        this.targetsData = flatMap(targets, t => {
            if (!t)
                return [];
            if (!isElement(t))
                return [];
            const offset = getOffset(t, this.opts.container);
            const rect = { x: offset.x, y: offset.y, width: t.offsetWidth, height: t.offsetHeight };
            return {
                x1: rect.x,
                y1: rect.y,
                x2: rect.x + rect.width,
                y2: rect.y + rect.height,
                el: t
            };
        });
    }
    getOverlaps(x1, y1, x2, y2) {
        let elData = this.elData;
        if (x1 && x2 && y1 && y2) {
            elData = {
                x1,
                y1,
                x2,
                y2,
            };
        }
        let overlaps = flatMap(this.targetsData, (td, i) => {
            if (elData.x2 < td.x1 || elData.x1 > td.x2 || elData.y2 < td.y1 || elData.y1 > td.y2)
                return [];
            return td.el;
        });
        return overlaps;
    }
    getInclusions(x1, y1, x2, y2) {
        let elData = this.elData;
        if (x1 && x2 && y1 && y2) {
            elData = {
                x1,
                y1,
                x2,
                y2,
            };
        }
        let contains = flatMap(this.targetsData, (td, i) => {
            if (elData.x2 >= td.x2 && elData.x1 <= td.x1 && elData.y2 >= td.y2 && elData.y1 <= td.y1)
                return td.el;
            return [];
        });
        return contains;
    }
}
_CollisionDetector__targets = new WeakMap();
/**
 * create a detector for the el and return
 * @param el element to be detected
 * @param targets
 * @param opts CollisionDetectorOptions
 * @param opts.container a root element of targets
 * @returns
 */
function newCollisionDetector(el, targets, opts) {
    return new CollisionDetector(el, targets, opts);
}

var __classPrivateFieldSet$1 = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$1 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Selectable_instances, _Selectable__detector, _Selectable__lastSelected, _Selectable_bindEvent;
const CLASS_SELECTOR = "uii-selector";
const CLASS_SELECTING = "uii-selecting";
const CLASS_SELECTED = "uii-selected";
const THRESHOLD$1 = 2;
/**
 * 用于表示一个元素选择器的定义
 * > 可用CSS接口
 * - .uii-selector
 * - .uii-selecting
 * - .uii-selected
 * @public
 */
class Selectable extends Uii {
    constructor(container, opts) {
        super(container, assign({
            targets: [],
            scroll: true,
        }, opts));
        _Selectable_instances.add(this);
        _Selectable__detector.set(this, void 0);
        _Selectable__lastSelected.set(this, void 0);
        const domEl = this.ele[0];
        //create selector
        const selector = document.createElement("div");
        selector.className = CLASS_SELECTOR;
        selector.style.cssText = `
      position:absolute;
      left:-9999px;
    `;
        if (this.opts.class) {
            selector.className += " " + this.opts.class;
        }
        else {
            selector.style.cssText += "border:1px dashed #000;";
        }
        domEl.appendChild(selector);
        //create detector
        __classPrivateFieldSet$1(this, _Selectable__detector, newCollisionDetector(selector, this.opts.targets, {
            container: domEl,
        }), "f");
        __classPrivateFieldGet$1(this, _Selectable_instances, "m", _Selectable_bindEvent).call(this, selector, domEl);
    }
    /**
     *  更新targets
     */
    updateTargets() {
        __classPrivateFieldGet$1(this, _Selectable__detector, "f").update();
    }
    /**
     * @internal
     */
    onOptionChanged() {
        this.updateTargets();
    }
}
_Selectable__detector = new WeakMap(), _Selectable__lastSelected = new WeakMap(), _Selectable_instances = new WeakSet(), _Selectable_bindEvent = function _Selectable_bindEvent(selector, con) {
    const that = this;
    const opts = this.opts;
    this.registerEvent(con, "mousedown", (e) => {
        const t = e.target;
        const onStart = opts.onStart;
        const onSelect = opts.onSelect;
        const onEnd = opts.onEnd;
        const mode = opts.mode || "overlap";
        const scroll = opts.scroll;
        const scrollSpeed = opts.scrollSpeed || 10;
        const filter = opts.filter;
        const selectingClassAry = compact(split(opts.selectingClass, " "));
        const selectedClassAry = compact(split(opts.selectedClass, " "));
        //check filter
        if (filter) {
            if (isFunction(filter)) {
                if (filter(t))
                    return;
            }
            else if (some(con.querySelectorAll(filter), (el) => el.contains(t)))
                return;
        }
        let originPos = "";
        //offset
        const rect = con.getBoundingClientRect();
        const conStyle = window.getComputedStyle(con);
        const blw = parseFloat(conStyle.borderLeftWidth);
        const btw = parseFloat(conStyle.borderTopWidth);
        let hitPosX = e.offsetX + con.scrollLeft, hitPosY = e.offsetY + con.scrollTop;
        if (t !== con) {
            const offset = getOffset(t, con);
            const style = window.getComputedStyle(t);
            hitPosX = offset.x + e.offsetX + parseFloat(style.borderLeftWidth);
            hitPosY = offset.y + e.offsetY + parseFloat(style.borderTopWidth);
        }
        const style = selector.style;
        let selection = [];
        let lastSelection = [];
        let x1 = hitPosX, y1 = hitPosY;
        let dragging = false;
        let timer = null;
        let toLeft = false;
        let toTop = false;
        let toRight = false;
        let toBottom = false;
        const dragListener = (ev) => {
            const newX = ev.clientX - rect.x + con.scrollLeft - blw;
            const newY = ev.clientY - rect.y + con.scrollTop - btw;
            const offsetx = newX - hitPosX;
            const offsety = newY - hitPosY;
            if (!dragging) {
                if (Math.abs(offsetx) > THRESHOLD$1 || Math.abs(offsety) > THRESHOLD$1) {
                    dragging = true;
                    //update targets count & positions
                    __classPrivateFieldGet$1(this, _Selectable__detector, "f").update();
                    //detect container position
                    const pos = window.getComputedStyle(con).position;
                    if (pos === "static") {
                        originPos = con.style.position;
                        con.style.position = "relative";
                    }
                    //clear _lastSelected
                    each(__classPrivateFieldGet$1(this, _Selectable__lastSelected, "f"), t => {
                        t.classList.toggle(CLASS_SELECTED, false);
                    });
                    onStart && onStart({ selection: __classPrivateFieldGet$1(this, _Selectable__lastSelected, "f"), selectable: con }, ev);
                }
                else {
                    ev.preventDefault();
                    return false;
                }
            }
            //edge detect
            if (scroll) {
                const ltX = ev.clientX - rect.x;
                const ltY = ev.clientY - rect.y;
                const rbX = rect.x + rect.width - ev.clientX;
                const rbY = rect.y + rect.height - ev.clientY;
                toLeft = ltX < EDGE_THRESHOLD;
                toTop = ltY < EDGE_THRESHOLD;
                toRight = rbX < EDGE_THRESHOLD;
                toBottom = rbY < EDGE_THRESHOLD;
                if (toLeft || toTop || toRight || toBottom) {
                    if (!timer) {
                        timer = setInterval(() => {
                            if (toLeft) {
                                con.scrollLeft -= scrollSpeed;
                            }
                            else if (toRight) {
                                con.scrollLeft += scrollSpeed;
                            }
                            if (toTop) {
                                con.scrollTop -= scrollSpeed;
                            }
                            else if (toBottom) {
                                con.scrollTop += scrollSpeed;
                            }
                        }, 20);
                    }
                }
                else {
                    if (timer) {
                        clearInterval(timer);
                        timer = null;
                    }
                }
            }
            let x = hitPosX, y = hitPosY, w = Math.abs(offsetx), h = Math.abs(offsety);
            if (offsetx > 0 && offsety > 0) {
                x1 = hitPosX;
                y1 = hitPosY;
            }
            else if (offsetx < 0 && offsety < 0) {
                x = x1 = newX;
                y = y1 = newY;
            }
            else if (offsetx < 0) {
                x = x1 = newX;
            }
            else if (offsety < 0) {
                y = y1 = newY;
            }
            style.left = x + "px";
            style.top = y + "px";
            style.width = w + "px";
            style.height = h + "px";
            //detect collision
            if (mode === "overlap") {
                selection = __classPrivateFieldGet$1(that, _Selectable__detector, "f").getOverlaps(x1, y1, x1 + w, y1 + h);
            }
            else if (mode === "inclusion") {
                selection = __classPrivateFieldGet$1(that, _Selectable__detector, "f").getInclusions(x1, y1, x1 + w, y1 + h);
            }
            each(lastSelection, (t) => {
                if (!includes(selection, t)) {
                    t.classList.toggle(CLASS_SELECTING, false);
                    each(selectingClassAry, (cls) => {
                        t.classList.toggle(cls, false);
                    });
                }
            });
            each(selection, (t) => {
                t.classList.toggle(CLASS_SELECTING, true);
                each(selectingClassAry, (cls) => {
                    t.classList.toggle(cls, true);
                });
            });
            const changed = lastSelection.length != selection.length;
            lastSelection = selection;
            if (changed && onSelect)
                onSelect({ selection, selectable: con }, ev);
            ev.preventDefault();
            return false;
        };
        const dragEndListener = (ev) => {
            style.left = "-9999px";
            style.width = style.height = "0px";
            document.removeEventListener("mousemove", dragListener, false);
            document.removeEventListener("mouseup", dragEndListener, false);
            window.removeEventListener("blur", dragEndListener, false);
            if (scroll) {
                if (timer) {
                    clearInterval(timer);
                    timer = null;
                }
            }
            //restore container position
            if (originPos) {
                con.style.position = originPos;
            }
            each(selection, (t) => {
                each(selectingClassAry, (cls) => {
                    t.classList.toggle(cls, false);
                });
                each(selectedClassAry, (cls) => {
                    t.classList.toggle(cls, true);
                });
                t.classList.toggle(CLASS_SELECTING, false);
                t.classList.toggle(CLASS_SELECTED, true);
            });
            __classPrivateFieldSet$1(this, _Selectable__lastSelected, selection, "f");
            if (dragging && onEnd)
                onEnd({ selection, selectable: con }, ev);
        };
        document.addEventListener("mousemove", dragListener, false);
        document.addEventListener("mouseup", dragEndListener, false);
        window.addEventListener("blur", dragEndListener, false);
        e.preventDefault();
        return false;
    });
};
/**
 * Add a selector into the container
 * @param container css selector or html element
 * @param opts
 * @returns
 */
function newSelectable(container, opts) {
    return new Selectable(container, opts);
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'.split('');
function alphaId(len) {
    const bytes = self.crypto.getRandomValues(new Uint8Array(len || 16));
    let rs = '';
    bytes.forEach(b => rs += ALPHABET[b % ALPHABET.length]);
    return rs;
}

var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Sortable_removeListenItems;
const SORTABLE_GROUPS = {};
const CLASS_SORTABLE_CONTAINER = "uii-sortable-container";
const CLASS_SORTABLE_GHOST = "uii-sortable-ghost";
const CLASS_SORTABLE_ACTIVE = "uii-sortable-active";
const ATTR_SORTABLE_ACTIVE = "uii-sortable-active";
const THRESHOLD = 2;
/**
 * 用于表示一类排序容器的定义
 * > 可用CSS接口
 * - .uii-sortable-container
 * - .uii-sortable-ghost
 * - .uii-sortable-active
 * @public
 */
class Sortable extends Uii {
    constructor(container, opts) {
        super(container, merge({
            move: {
                from: true,
                to: true,
            },
            scroll: true,
            sort: true
        }, opts));
        _Sortable_removeListenItems.set(this, void 0);
        if (size(this.ele) > 1 && !this.opts.group) {
            this.opts.group = "uii_sortable_" + alphaId();
        }
        each(this.ele, (el) => {
            el.classList.add(CLASS_SORTABLE_CONTAINER);
            el.style.position = "relative";
            el.style.pointerEvents = "initial";
            bindContainer(this.registerEvent.bind(this), el, this.opts);
        });
        //put into group
        if (this.opts.group) {
            if (!SORTABLE_GROUPS[this.opts.group]) {
                SORTABLE_GROUPS[this.opts.group] = [];
            }
            SORTABLE_GROUPS[this.opts.group].push([this, this.ele]);
        }
    }
    /**
     * 调用active表示移出策略肯定是true | 'copy'
     * @internal
     */
    active(draggingItem, fromContainer, toContainers, toOpts) {
        var _a;
        //check move
        const moveFrom = (_a = toOpts.move) === null || _a === void 0 ? void 0 : _a.from;
        const acceptFn = isFunction(moveFrom) ? moveFrom : () => !!moveFrom;
        //验证移入策略
        const activableContainers = flatMap(toContainers, (el) => {
            const valid = acceptFn(draggingItem, fromContainer, el);
            return valid ? el : [];
        });
        each(activableContainers, (el) => {
            el.setAttribute(ATTR_SORTABLE_ACTIVE, "1");
            if (toOpts.activeClass) {
                each(split(toOpts.activeClass || "", " "), (cls) => {
                    el.classList.toggle(cls, true);
                });
            }
        });
        __classPrivateFieldSet(this, _Sortable_removeListenItems, map(activableContainers, (con) => {
            const filteredItems = con.querySelectorAll(":scope > *");
            return listenItems(toOpts, con, draggingItem, filteredItems);
        }), "f");
        toOpts.onActive &&
            toOpts.onActive({ item: draggingItem, from: fromContainer });
    }
    /**
     * @internal
     */
    deactive(draggingItem, fromContainer, toContainers, opts) {
        each(toContainers, (el) => {
            el.removeAttribute(ATTR_SORTABLE_ACTIVE);
            if (opts.activeClass) {
                each(split(opts.activeClass || "", " "), (cls) => {
                    el.classList.toggle(cls, false);
                });
            }
        });
        each(__classPrivateFieldGet(this, _Sortable_removeListenItems, "f"), (fn) => {
            fn();
        });
        opts.onDeactive &&
            opts.onDeactive({ item: draggingItem, from: fromContainer });
    }
    /**
     * @internal
     */
    onOptionChanged() { }
}
_Sortable_removeListenItems = new WeakMap();
let DraggingData = null;
function bindContainer(registerEvent, container, opts) {
    registerEvent(container, "mousedown", (e) => {
        var _a;
        let con = e.currentTarget;
        let t = e.target;
        if (t === con)
            return;
        // filter & handle
        const filterStr = opts.filter ? `:not(${opts.filter})` : "";
        const filteredItems = con.querySelectorAll(":scope > *" + filterStr);
        const handles = opts.handle
            ? map(filteredItems, (el) => el.querySelector(opts.handle || ""))
            : toArray(filteredItems);
        const i = findIndex(handles, (handle) => handle.contains(t));
        if (i < 0)
            return;
        const draggingItem = filteredItems[i];
        const ghostContainer = opts.ghostContainer || con;
        const onStart = opts.onStart;
        const onEnd = opts.onEnd;
        const ghostClass = opts.ghostClass;
        const group = opts.group;
        let moveTo = (_a = opts.move) === null || _a === void 0 ? void 0 : _a.to;
        const toCopy = moveTo === "copy";
        const toOutFn = isFunction(moveTo) ? moveTo : () => !!moveTo;
        const moveMode = toOutFn(draggingItem, con);
        const sort = opts.sort;
        opts.scroll;
        opts.scrollSpeed || 10;
        let hitPosX = e.offsetX + con.scrollLeft, hitPosY = e.offsetY + con.scrollTop;
        saveCursor();
        let dragging = false;
        let ghostNode = null;
        let removeListenItems = null;
        const dragListener = (ev) => {
            const newX = ev.clientX;
            const newY = ev.clientY;
            let offsetx = newX - hitPosX;
            let offsety = newY - hitPosY;
            if (!dragging) {
                if (Math.abs(offsetx) > THRESHOLD || Math.abs(offsety) > THRESHOLD) {
                    dragging = true;
                    ghostNode = draggingItem.cloneNode(true);
                    ghostNode.style.opacity = "0.3";
                    ghostNode.style.pointerEvents = "none";
                    ghostNode.style.position = "fixed";
                    ghostNode.style.zIndex = "999";
                    ghostNode.style.left = draggingItem.style.left;
                    ghostNode.style.top = draggingItem.style.top;
                    if (ghostClass) {
                        ghostNode.classList.add(...compact(split(ghostClass, " ")));
                    }
                    ghostNode.classList.toggle(CLASS_SORTABLE_GHOST, true);
                    ghostContainer.appendChild(ghostNode);
                    if (!toCopy)
                        draggingItem.classList.toggle(CLASS_SORTABLE_ACTIVE, true);
                    let copy = undefined;
                    if (toCopy) {
                        copy = draggingItem.cloneNode(true);
                        copy.classList.toggle(CLASS_SORTABLE_ACTIVE, true);
                    }
                    DraggingData = {
                        item: draggingItem,
                        fromIndex: i,
                        fromContainer: con,
                        toContainer: con,
                        moveTo: toCopy ? "copy" : moveMode,
                        spill: opts.spill,
                        copy
                    };
                    onStart && onStart({ item: draggingItem, from: con, index: i }, ev);
                    lockPage();
                    if (sort) {
                        removeListenItems = listenItems(opts, con, toCopy ? draggingItem : copy, filteredItems, i);
                    }
                    //active
                    if (moveMode && group && SORTABLE_GROUPS[group]) {
                        each(SORTABLE_GROUPS[group], ([sortable, ele]) => {
                            const filtered = reject(ele, (el) => el === container);
                            if (isEmpty(filtered))
                                return;
                            sortable.active(toCopy ? draggingItem : copy, container, filtered, sortable.getOptions());
                        });
                    }
                }
                else {
                    ev.preventDefault();
                    return false;
                }
            }
            ghostNode.style.left = newX + "px";
            ghostNode.style.top = newY + "px";
            ev.preventDefault();
            return false;
        };
        const dragEndListener = (ev) => {
            var _a;
            document.removeEventListener("mousemove", dragListener);
            document.removeEventListener("mouseup", dragEndListener);
            window.removeEventListener("blur", dragEndListener);
            if (dragging) {
                unlockPage();
                restoreCursor();
                if (ghostNode)
                    ghostContainer.removeChild(ghostNode);
                const toContainer = DraggingData === null || DraggingData === void 0 ? void 0 : DraggingData.toContainer;
                DraggingData === null || DraggingData === void 0 ? void 0 : DraggingData.item.classList.remove(CLASS_SORTABLE_ACTIVE);
                (_a = DraggingData === null || DraggingData === void 0 ? void 0 : DraggingData.copy) === null || _a === void 0 ? void 0 : _a.classList.remove(CLASS_SORTABLE_ACTIVE);
                DraggingData = null;
                if (removeListenItems)
                    removeListenItems();
                //deactive
                if (group && SORTABLE_GROUPS[group]) {
                    each(SORTABLE_GROUPS[group], ([sortable, ele]) => {
                        const filtered = reject(ele, (el) => el === container);
                        if (isEmpty(filtered))
                            return;
                        sortable.deactive(draggingItem, container, filtered, sortable.getOptions());
                    });
                }
                onEnd && onEnd({ item: draggingItem, from: container, to: toContainer }, e);
            }
        };
        document.addEventListener("mousemove", dragListener);
        document.addEventListener("mouseup", dragEndListener);
        window.addEventListener("blur", dragEndListener);
        e.preventDefault();
        return false;
    });
    registerEvent(container, "mouseleave", (e) => {
        var _a, _b;
        if (!DraggingData)
            return;
        opts.onLeave &&
            opts.onLeave({
                item: DraggingData.item,
                from: DraggingData.fromContainer,
                to: container,
            }, e);
        if (DraggingData.moveTo !== 'copy') {
            if (DraggingData.spill === 'remove') {
                (_a = DraggingData.item.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(DraggingData.item);
            }
            else if (DraggingData.spill === 'revert') {
                (_b = DraggingData.item.parentElement) === null || _b === void 0 ? void 0 : _b.removeChild(DraggingData.item);
                const nextSibling = DraggingData.fromContainer.children[DraggingData.fromIndex];
                DraggingData.fromContainer.insertBefore(DraggingData.item, nextSibling);
            }
        }
    });
    //总是先触发容器enter，之后才是itementer
    registerEvent(container, "mouseenter", (e) => {
        var _a;
        if (!DraggingData)
            return;
        let draggingItem = DraggingData.item;
        draggingItem.parentElement;
        const cx = e.clientX;
        const cy = e.clientY;
        const rect = container.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const offsetX = cx - rect.x;
        const offsetY = cy - rect.y;
        let dir = "";
        if (offsetX < centerX && offsetY < centerY) {
            dir = "tl";
        }
        else if (offsetX > centerX && offsetY > centerY) {
            dir = "br";
        }
        else if (offsetX < centerX && offsetY > centerY) {
            dir = "bl";
        }
        else if (offsetX > centerX && offsetY < centerY) {
            dir = "tr";
        }
        opts.onEnter &&
            opts.onEnter({
                item: DraggingData.item,
                from: DraggingData.fromContainer,
                to: container,
                dir,
            }, e);
        DraggingData.toContainer = container;
        if (container.getAttribute(ATTR_SORTABLE_ACTIVE)) {
            let valid = true;
            //check move
            const moveFrom = (_a = opts.move) === null || _a === void 0 ? void 0 : _a.from;
            const acceptFn = isFunction(moveFrom) ? moveFrom : () => !!moveFrom;
            valid = acceptFn(DraggingData.item, DraggingData.fromContainer, container);
            if (!valid)
                return;
            if (container.contains(draggingItem)) {
                return;
            }
            //此处检测移出策略
            const moveTo = DraggingData.moveTo;
            if (moveTo === "copy") {
                draggingItem = DraggingData.copy;
            }
            if (draggingItem.parentElement)
                draggingItem.parentElement.removeChild(draggingItem);
            let toIndex = 0;
            if (dir[0] === "t") {
                container.insertBefore(draggingItem, container.children[0]);
            }
            else {
                container.appendChild(draggingItem);
                toIndex = container.children.length - 1;
            }
            opts.onAdd &&
                opts.onAdd({
                    item: draggingItem,
                    from: DraggingData.fromContainer,
                    to: container,
                    index: toIndex,
                }, e);
        }
        else if (container === DraggingData.fromContainer) {
            if (DraggingData.copy) {
                let parent = DraggingData.copy.parentElement;
                if (parent)
                    parent.removeChild(DraggingData === null || DraggingData === void 0 ? void 0 : DraggingData.copy);
            }
            else {
                if (draggingItem.parentElement)
                    draggingItem.parentElement.removeChild(draggingItem);
                if (dir[0] === "t") {
                    container.insertBefore(draggingItem, container.children[0]);
                }
                else {
                    container.appendChild(draggingItem);
                    container.children.length - 1;
                }
            }
        }
    });
}
function listenItems(opts, toContainer, draggingItem, items, fromIndex = 0) {
    //sorting listener
    const listener = (e) => {
        const ct = e.currentTarget;
        if (ct.style.transform) {
            return;
        }
        const toIndex = ct._uiik_i;
        let draggingItem = (DraggingData === null || DraggingData === void 0 ? void 0 : DraggingData.copy) || (DraggingData === null || DraggingData === void 0 ? void 0 : DraggingData.item);
        if (toContainer === (DraggingData === null || DraggingData === void 0 ? void 0 : DraggingData.fromContainer)) {
            draggingItem = DraggingData === null || DraggingData === void 0 ? void 0 : DraggingData.item;
        }
        let parent = draggingItem.parentElement;
        parent === null || parent === void 0 ? void 0 : parent.removeChild(draggingItem);
        const sameContainer = parent === ct.parentElement;
        if (!sameContainer) {
            parent = ct.parentElement;
        }
        const oldIndex = fromIndex;
        if (toIndex > fromIndex) {
            fromIndex = toIndex;
            parent === null || parent === void 0 ? void 0 : parent.insertBefore(draggingItem, ct.nextElementSibling);
        }
        else {
            fromIndex = toIndex - 1;
            parent === null || parent === void 0 ? void 0 : parent.insertBefore(draggingItem, ct);
        }
        opts.onChange &&
            opts.onChange({
                item: draggingItem,
                from: DraggingData === null || DraggingData === void 0 ? void 0 : DraggingData.fromContainer,
                to: toContainer,
                fromIndex: oldIndex,
                toIndex: fromIndex,
            }, e);
        const toPos = { x: ct.offsetLeft, y: ct.offsetTop };
        const fromPos = { x: draggingItem.offsetLeft, y: draggingItem.offsetTop };
        ct.style.transform = `translate3d(${fromPos.x - toPos.x}px,${fromPos.y - toPos.y}px,0)`;
        draggingItem.style.transform = `translate3d(${toPos.x - fromPos.x}px,${toPos.y - fromPos.y}px,0)`;
        draggingItem.offsetHeight;
        ct.offsetHeight;
        draggingItem.style.transition = "transform .15s";
        draggingItem.style.transform = `translate3d(0px,0px,0)`;
        ct.style.transition = "transform .15s";
        ct.style.transform = `translate3d(0px,0px,0)`;
        setTimeout(() => {
            ct.style.transition = "";
            ct.style.transform = ``;
            draggingItem.style.transition = "";
            draggingItem.style.transform = ``;
        }, 150);
        e.stopPropagation();
        e.preventDefault();
    };
    each(items, (item, i) => {
        item.style.position = "relative";
        if (item === draggingItem)
            return;
        item.style.pointerEvents = "initial";
        item._uiik_i = i;
        item.addEventListener("mouseenter", listener);
    });
    return () => {
        //解绑enter事件
        each(items, (item, i) => {
            if (item === draggingItem)
                return;
            item.removeEventListener("mouseenter", listener);
        });
    };
}
/**
 * make elements within the container sortable
 * @param container css selector or html element（array)
 * @param opts
 * @returns
 */
function newSortable(container, opts) {
    return new Sortable(container, opts);
}

var version = "1.1.0";
var repository = {
	type: "git",
	url: "https://github.com/holyhigh2/uiik"
};

// welcome info
const welcome = globalThis.welcome;
if (!welcome) {
    const ssAry = [];
    ['102,227,255', '59,208,251', '67,180,255'].forEach((v, i) => {
        const cu = 'background:rgb(' + v + ');';
        if (i < 2) {
            ssAry[i] = ssAry[5 - 1 - i] = cu;
        }
        else {
            ssAry[i] = 'color:#fff;' + cu;
        }
    });
    console.info(`%c %c %c Uiik - UI interactions kit | v${version} %c %c `, ...ssAry, `💎 ${repository.url}`);
    globalThis.welcome = true;
}
const VERSION = version;
var index = {
    VERSION: version,
    newSplittable,
    newResizable,
    newDraggable,
    newDroppable,
    newRotatable,
    newSelectable,
    newSortable
};

export { CollisionDetector, Draggable, Droppable, Resizable, Rotatable, Selectable, Sortable, Splittable, Uii, VERSION, index as default, newCollisionDetector, newDraggable, newDroppable, newResizable, newRotatable, newSelectable, newSortable, newSplittable };
