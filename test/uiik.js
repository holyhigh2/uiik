/* uiik 1.3.2 @holyhigh2 https://github.com/holyhigh2/uiik */
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
   * myfx/collection v1.1.0
   * A modular utility library with more utils, higher performance and simpler declarations ...
   * https://github.com/holyhigh2/myfx
   * (c) 2021-2023 @holyhigh2 may be freely distributed under the MIT license
   */
  /**
 * 判断参数是否为undefined
 * @example
 * //true
 * console.log(_.isUndefined(undefined))
 * //false
 * console.log(_.isUndefined(null))
 *
 * @param v
 * @returns
 */
function isUndefined$2(v) {
    return v === undefined;
}

/**
 * 判断参数是否为函数对象
 *
 * @example
 * //true
 * console.log(_.isFunction(new Function()))
 * //true
 * console.log(_.isFunction(()=>{}))
 *
 * @param v
 * @returns
 */
function isFunction$3(v) {
    return typeof v == 'function' || v instanceof Function;
}

/**
 * 判断参数是否为字符串，包括String类的实例以及基本类型string的值
 *
 * @example
 * //true
 * console.log(_.isString(new String('')))
 * //true
 * console.log(_.isString(''))
 *
 * @param v
 * @returns
 */
function isString$3(v) {
    return typeof v === 'string' || v instanceof String;
}

/**
 * 判断参数是否为Array对象的实例
 *
 * @example
 * //true
 * console.log(_.isArray([]))
 * //false
 * console.log(_.isArray(document.body.children))
 *
 * @param v
 * @returns
 */
function isArray$3(v) {
    // 使用 instanceof Array 无法鉴别某些场景，比如
    // Array.prototype instanceof Array => false
    // Array.isArray(Array.prototype) => true
    // typeof new Proxy([],{}) => object
    // Array.isArray(new Proxy([],{})) => true
    return Array.isArray(v);
}

const PRIMITIVE_TYPES$3 = [
    'string',
    'number',
    'bigint',
    'boolean',
    'undefined',
    'symbol',
];
/**
 * 判断值是不是一个非基本类型外的值，如果true则认为值是一个对象
 * 同样，该方法还可以用来判断一个值是不是基本类型
 *
 * @example
 * //false
 * console.log(_.isObject(1))
 * //true
 * console.log(_.isObject(new String()))
 * //false
 * console.log(_.isObject(true))
 * //false
 * console.log(_.isObject(null))
 *
 * @param v value
 * @returns 是否对象。如果值是null返回false，即使typeof null === 'object'
 */
function isObject$3(v) {
    return null !== v && PRIMITIVE_TYPES$3.indexOf(typeof v) < 0;
}

function identity$2(v) {
    return v;
}

function toPath$1$2(path) {
    let chain = path;
    if (isArray$3(chain)) {
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

/**
 * 通过path获取对象属性值
 *
 * @example
 * //2
 * console.log(_.get([1,2,3],1))
 * //Holyhigh
 * console.log(_.get({a:{b:[{x:'Holyhigh'}]}},['a','b',0,'x']))
 * //Holyhigh2
 * console.log(_.get({a:{b:[{x:'Holyhigh2'}]}},'a.b.0.x'))
 * //Holyhigh
 * console.log(_.get({a:{b:[{x:'Holyhigh'}]}},'a.b[0].x'))
 * //hi
 * console.log(_.get([[null,[null,null,'hi']]],'[0][1][2]'))
 * //not find
 * console.log(_.get({},'a.b[0].x','not find'))
 *
 * @param obj 需要获取属性值的对象，如果obj不是对象(isObject返回false)，则返回defaultValue
 * @param path 属性路径，可以是索引数字，字符串key，或者多级属性数组
 * @param [defaultValue] 如果path未定义，返回默认值
 * @returns 属性值或默认值
 */
function get$2(obj, path, defaultValue) {
    if (!isObject$3(obj))
        return defaultValue;
    const chain = toPath$1$2(path);
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

/**
 * 创建一个函数，该函数返回指定对象的path属性值
 * @example
 * const libs = [
 *  {name:'func.js',platform:['web','nodejs'],tags:{utils:true},js:false},
 *  {name:'juth2',platform:['web','java'],tags:{utils:false,middleware:true},js:true},
 *  {name:'soya2d',platform:['web'],tags:{utils:true},js:true}
 * ];
 * //[true,false,true]
 * console.log(_.map(libs,_.prop('tags.utils')))
 * //nodejs
 * console.log(_.prop(['platform',1])(libs[0]))
 *
 * @param path
 * @returns 接收一个对象作为参数的函数
 * @since 0.17.0
 */
function prop$1(path) {
    return (obj) => {
        return get$2(obj, path);
    };
}

/**
 * 解析path并返回数组
 * @example
 * //['a', 'b', '2', 'c']
 * console.log(_.toPath('a.b[2].c'))
 * //['a', 'b', 'c', '1']
 * console.log(_.toPath(['a','b','c[1]']))
 * //['1']
 * console.log(_.toPath(1))
 *
 * @param path 属性路径，可以是数字索引，字符串key，或者多级属性数组
 * @returns path数组
 * @since 0.16.0
 */
function toPath$2(path) {
    return toPath$1$2(path);
}

/**
 * 判断值是否为null或undefined
 *
 * @example
 * //true
 * console.log(_.isNil(undefined))
 * //false
 * console.log(_.isNil(0))
 * //true
 * console.log(_.isNil(null))
 * //false
 * console.log(_.isNil(NaN))
 *
 * @param v
 * @returns
 * @since 1.0.0
 */
function isNil$2(v) {
    return v === null || v === undefined;
}

function eq$1(a, b) {
    if (Number.isNaN(a) && Number.isNaN(b))
        return true;
    return a === b;
}

/**
 * 检测props对象中的所有属性是否在object中存在并使用自定义比较器对属性值进行对比。可以用于对象的深度对比。
 * 当comparator参数是默认值时，与<code>isMath</code>函数相同
 *
 * @example
 * let target = {a:{x:1,y:2},b:1}
 * //true
 * console.log(_.isMatchWith(target,{b:1}))
 * //false
 * console.log(_.isMatchWith(target,{b:'1'}))
 *
 * target = {a:null,b:0}
 * //true
 * console.log(_.isMatchWith(target,{a:'',b:'0'},(a,b)=>_.isEmpty(a) && _.isEmpty(b)?true:a==b))
 *
 * @param target 如果不是对象类型，返回false
 * @param props 对比属性对象，如果是nil，返回true
 * @param [comparator=eq] 比较器，参数(object[k],props[k],k,object,props)，返回true表示匹配
 * @returns 匹配所有props返回true
 * @since 0.18.1
 */
function isMatchWith$1(target, props, comparator = eq$1) {
    if (isNil$2(props))
        return true;
    const ks = Object.keys(props);
    if (!isObject$3(target))
        return false;
    let rs = true;
    for (let i = ks.length; i--;) {
        const k = ks[i];
        const v1 = target[k];
        const v2 = props[k];
        if (isObject$3(v1) && isObject$3(v2)) {
            if (!isMatchWith$1(v1, v2, comparator)) {
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

/**
 * 检测props对象中的所有属性是否在object中存在，可用于对象的深度对比。
 * 使用<code>eq</code>作为值对比逻辑
 *
 * @example
 * let target = {a:{x:1,y:2},b:1}
 * //true
 * console.log(_.isMatch(target,{b:1}))
 * //true
 * console.log(_.isMatch(target,{a:{x:1}}))
 *
 * target = [{x:1,y:2},{b:1}]
 * //true
 * console.log(_.isMatch(target,{1:{b:1}}))
 * //true
 * console.log(_.isMatch(target,[{x:1}]))
 *
 * @param object
 * @param props 对比属性对象，如果是null，返回true
 * @returns 匹配所有props返回true
 * @since 0.17.0
 */
function isMatch$1(object, props) {
    return isMatchWith$1(object, props, eq$1);
}

/**
 * 创建一个函数，该函数接收一个对象为参数并返回对该对象使用props进行验证的的断言结果。
 *
 *
 * @example
 * const libs = [
 *  {name:'func.js',platform:['web','nodejs'],tags:{utils:true},js:true},
 *  {name:'juth2',platform:['web','java'],tags:{utils:false,middleware:true},js:false},
 *  {name:'soya2d',platform:['web'],tags:{utils:true},js:false}
 * ];
 *
 * //[{func.js...}]
 * console.log(_.filter(libs,_.matcher({tags:{utils:true},js:true})))
 *
 * @param props 断言条件对象
 * @returns matcher(v)函数
 * @since 0.17.0
 */
function matcher$1(props) {
    return (obj) => {
        return isMatch$1(obj, props);
    };
}

function iteratee$1(value) {
    if (isUndefined$2(value)) {
        return identity$2;
    }
    else if (isFunction$3(value)) {
        return value;
    }
    else if (isString$3(value)) {
        return prop$1(value);
    }
    else if (isArray$3(value)) {
        return prop$1(toPath$2(value));
    }
    else if (isObject$3(value)) {
        return matcher$1(value);
    }
    return () => false;
}

/**
 * 判断参数是否为类数组对象
 *
 * @example
 * //true
 * console.log(_.isArrayLike('abc123'))
 * //true
 * console.log(_.isArrayLike([]))
 * //true
 * console.log(_.isArrayLike(document.body.children))
 *
 * @param v
 * @returns
 */
function isArrayLike$3(v) {
    if (isString$3(v) && v.length > 0)
        return true;
    if (!isObject$3(v))
        return false;
    // 具有length属性
    const list = v;
    if (list.length !== undefined) {
        const proto = list.constructor.prototype;
        // NodeList/HTMLCollection/CSSRuleList/...
        if (isFunction$3(proto.item))
            return true;
        // arguments
        if (isFunction$3(list[Symbol.iterator]))
            return true;
    }
    return false;
}

/**
 * 判断值是不是一个Set对象
 *
 * @example
 * //false
 * console.log(_.isSet(new WeakSet))
 * //true
 * console.log(_.isSet(new Set))
 *
 * @param v
 * @returns
 */
function isSet$2(v) {
    return v instanceof Set;
}

/**
 * 判断值是不是一个Map对象
 *
 * @example
 * //true
 * console.log(_.isMap(new Map()))
 * //false
 * console.log(_.isMap(new WeakMap()))
 *
 * @param v
 * @returns
 */
function isMap$2(v) {
    return v instanceof Map;
}

function _eachIterator$1(collection, callback, forRight) {
    let values;
    let keys;
    if (isString$3(collection) || isArrayLike$3(collection)) {
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
    else if (isSet$2(collection)) {
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
    else if (isMap$2(collection)) {
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
    else if (isObject$3(collection)) {
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

function each$1(collection, callback) {
    _eachIterator$1(collection, callback, false);
}

function find(collection, predicate) {
    const callback = iteratee$1(predicate);
    let rs;
    each$1(collection, (v, k, c) => {
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
    const cb = iteratee$1(itee);
    each$1(collection, (v, k, c) => {
        const r = cb(v, k, c);
        rs.push(r);
    });
    return rs;
}

/**
 * 返回对象的所有key数组
 *
 * > 只返回对象的自身可枚举属性
 *
 * @example
 * let f = new Function("this.a=1;this.b=2;");
 * f.prototype.c = 3;
 * //[a,b]
 * console.log(_.keys(new f()))
 *
 * @param obj
 * @returns 对象的key
 */
function keys$2(obj) {
    if (obj === null || obj === undefined)
        return [];
    return Object.keys(obj);
}

/**
 * 返回对象的所有value数组
 * <div class="alert alert-secondary">
      只返回对象的自身可枚举属性
    </div>
 *
 *
 * @example
 * let f = new Function("this.a=1;this.b=2;");
 * f.prototype.c = 3;
 * //[1,2]
 * console.log(_.values(new f()))
 *
 * @param obj
 * @returns 对象根属性对应的值列表
 */
function values$2(obj) {
    return keys$2(obj).map((k) => obj[k]);
}

/**
 * 把一个集合对象转为array对象。对于非集合对象，
 * <ul>
 * <li>字符串 - 每个字符都会变成数组的元素</li>
 * <li>其他情况 - 返回包含一个collection元素的数组</li>
 * </ul>
 *
 * @example
 * //[1,2,3]
 * console.log(_.toArray(new Set([1,2,3])))
 * //['a','b','c']
 * console.log(_.toArray('abc'))
 * //[1,2,'b']
 * console.log(_.toArray({x:1,y:2,z:'b'}))
 * //[[1, 'a'], [3, 'b'], ['a', 5]]
 * console.log(_.toArray(new Map([[1,'a'],[3,'b'],['a',5]])))
 *
 * @param collection 如果是Map/Object对象会转换为值列表
 *
 * @returns 转换后的数组对象
 */
function toArray$2(collection) {
    if (isArray$3(collection))
        return collection.concat();
    if (isFunction$3(collection))
        return [collection];
    if (isSet$2(collection)) {
        return Array.from(collection);
    }
    else if (isString$3(collection)) {
        return collection.split('');
    }
    else if (isArrayLike$3(collection)) {
        return Array.from(collection);
    }
    else if (isMap$2(collection)) {
        return Array.from(collection.values());
    }
    else if (isObject$3(collection)) {
        return values$2(collection);
    }
    return [collection];
}

/**
 * 按照指定的嵌套深度递归遍历数组，并将所有元素与子数组中的元素合并为一个新数组返回
 *
 * @example
 * //[1,2,3,4,5]
 * console.log(_.flat([1,[2,3],[4,5]]))
 * //[1,2,3,4,5,[6,7]]
 * console.log(_.flat([1,[2,3],[4,5,[6,7]]]))
 * //[1,2,3,[4]]
 * console.log(_.flat([1,[2,[3,[4]]]],2))
 * //[1,2,1,3,4]
 * console.log(_.flat(new Set([1,1,[2,[1,[3,4]]]]),Infinity))
 *
 * @param array 数组
 * @param [depth=1] 嵌套深度
 * @returns 扁平化后的新数组
 */
function flat(array, depth = 1) {
    if (depth < 1)
        return array.concat();
    const rs = toArray$2(array).reduce((acc, val) => {
        return acc.concat(Array.isArray(val) && depth > 0 ? flat(val, depth - 1) : val);
    }, []);
    return rs;
}

function flatMap(collection, itee, depth) {
    return flat(map(collection, itee), depth || 1);
}

/**
 * 对数组进行切片，并返回切片后的新数组，原数组不变。新数组内容是对原数组内容的浅拷贝
 *
 * @example
 * //[2,3,4]
 * console.log(_.slice([1,2,3,4,5],1,4))
 * //[2,3,4,5]
 * console.log(_.slice([1,2,3,4,5],1))
 *
 *
 * @param array 数组
 * @param [begin=0] 切片起始下标，包含下标位置元素
 * @param [end] 切片结束下标，<b>不包含</b>下标位置元素
 * @returns 切片元素组成的新数组
 */
function slice$1(array, begin, end) {
    return toArray$2(array).slice(begin || 0, end);
}

/**
 * 判断集合中是否包含给定的值。使用<code>eq</code>函数进行等值判断。
 *
 * @example
 * //true
 * console.log(_.includes({a:1,b:2},2))
 * //false
 * console.log(_.includes([1,3,5,7,[2]],2))
 * //true
 * console.log(_.includes([1,3,5,7,[2]],3))
 * //false
 * console.log(_.includes([1,3,5,7,[2]],3,2))
 * //true
 * console.log(_.includes([0,null,undefined,NaN],NaN))
 * //true
 * console.log(_.includes('abcdefg','abc'))
 * //false
 * console.log(_.includes('abcdefg','abc',2))
 * //false
 * console.log(_.includes('aBcDeFg','abc'))
 *
 * @param collection 如果集合是map/object对象，则只对value进行比对
 * @param value
 * @param [fromIndex=0] 从集合的fromIndex 索引处开始查找。如果集合是map/object对象，无效
 * @returns 如果包含返回true否则返回false
 */
function includes(collection, value, fromIndex) {
    let rs = false;
    fromIndex = fromIndex || 0;
    if (isString$3(collection)) {
        return collection.includes(value, fromIndex);
    }
    collection = isArrayLike$3(collection)
        ? slice$1(collection, fromIndex)
        : collection;
    each$1(collection, (v) => {
        if (eq$1(v, value)) {
            rs = true;
            return false;
        }
    });
    return rs;
}

function reject(collection, predicate) {
    const rs = [];
    const callback = iteratee$1(predicate);
    each$1(collection, (v, k, c) => {
        const r = callback(v, k, c);
        if (!r) {
            rs.push(v);
        }
    });
    return rs;
}

/**
 * 获取集合对象的内容数量，对于map/object对象获取的是键/值对的数量
 *
 * @example
 * //3
 * console.log(_.size({a:1,b:2,c:{x:1}}))
 * //0
 * console.log(_.size(null))
 * //3
 * console.log(_.size(new Set([1,2,3])))
 * //2
 * console.log(_.size([1,[2,[3]]]))
 * //2
 * console.log(_.size(document.body.children))
 * //4
 * console.log(_.size(document.body.childNodes))
 * //3 arguments已不推荐使用，请使用Rest参数
 * console.log((function(){return _.size(arguments)})('a',2,'b'))
 * //7
 * console.log(_.size('func.js'))
 *
 * @param collection
 * @returns 集合长度，对于null/undefined/WeakMap/WeakSet返回0
 */
function size(collection) {
    if (isNil$2(collection))
        return 0;
    if ((collection.length))
        return collection.length;
    if (isMap$2(collection) || isSet$2(collection))
        return collection.size;
    if (isObject$3(collection))
        return Object.keys(collection).length;
    return 0;
}

function some(collection, predicate) {
    let rs = false;
    const callback = iteratee$1(predicate || (() => true));
    each$1(collection, (v, k, c) => {
        const r = callback(v, k, c);
        if (r) {
            rs = true;
            return false;
        }
    });
    return rs;
}

/**
   * myfx/is v1.1.0
   * A modular utility library with more utils, higher performance and simpler declarations ...
   * https://github.com/holyhigh2/myfx
   * (c) 2021-2023 @holyhigh2 may be freely distributed under the MIT license
   */
  /**
 * 判断参数是否为Array对象的实例
 *
 * @example
 * //true
 * console.log(_.isArray([]))
 * //false
 * console.log(_.isArray(document.body.children))
 *
 * @param v
 * @returns
 */
function isArray$2(v) {
    // 使用 instanceof Array 无法鉴别某些场景，比如
    // Array.prototype instanceof Array => false
    // Array.isArray(Array.prototype) => true
    // typeof new Proxy([],{}) => object
    // Array.isArray(new Proxy([],{})) => true
    return Array.isArray(v);
}

/**
 * 判断参数是否为字符串，包括String类的实例以及基本类型string的值
 *
 * @example
 * //true
 * console.log(_.isString(new String('')))
 * //true
 * console.log(_.isString(''))
 *
 * @param v
 * @returns
 */
function isString$2(v) {
    return typeof v === 'string' || v instanceof String;
}

const PRIMITIVE_TYPES$2 = [
    'string',
    'number',
    'bigint',
    'boolean',
    'undefined',
    'symbol',
];
/**
 * 判断值是不是一个非基本类型外的值，如果true则认为值是一个对象
 * 同样，该方法还可以用来判断一个值是不是基本类型
 *
 * @example
 * //false
 * console.log(_.isObject(1))
 * //true
 * console.log(_.isObject(new String()))
 * //false
 * console.log(_.isObject(true))
 * //false
 * console.log(_.isObject(null))
 *
 * @param v value
 * @returns 是否对象。如果值是null返回false，即使typeof null === 'object'
 */
function isObject$2(v) {
    return null !== v && PRIMITIVE_TYPES$2.indexOf(typeof v) < 0;
}

/**
 * 判断参数是否为函数对象
 *
 * @example
 * //true
 * console.log(_.isFunction(new Function()))
 * //true
 * console.log(_.isFunction(()=>{}))
 *
 * @param v
 * @returns
 */
function isFunction$2(v) {
    return typeof v == 'function' || v instanceof Function;
}

/**
 * 判断参数是否为类数组对象
 *
 * @example
 * //true
 * console.log(_.isArrayLike('abc123'))
 * //true
 * console.log(_.isArrayLike([]))
 * //true
 * console.log(_.isArrayLike(document.body.children))
 *
 * @param v
 * @returns
 */
function isArrayLike$2(v) {
    if (isString$2(v) && v.length > 0)
        return true;
    if (!isObject$2(v))
        return false;
    // 具有length属性
    const list = v;
    if (list.length !== undefined) {
        const proto = list.constructor.prototype;
        // NodeList/HTMLCollection/CSSRuleList/...
        if (isFunction$2(proto.item))
            return true;
        // arguments
        if (isFunction$2(list[Symbol.iterator]))
            return true;
    }
    return false;
}

/**
 * 对字符串进行trim后进行验证。如果非字符串，转为字符串后进行验证
 * @example
 * //true
 * console.log(_.isBlank('  '))
 * //true
 * console.log(_.isBlank(null))
 * //false
 * console.log(_.isBlank({}))
 * //false
 * console.log(_.isBlank('     1'))
 *
 * @param v 字符串
 * @returns 如果字符串是null/undefined/\t \n \f \r或trim后长度为0，返回true
 * @since 0.16.0
 */
function isBlank(v) {
    return v === null || v === undefined || (v + '').trim().replace(/\t|\n|\f|\r/mg, '').length === 0;
}

/**
 * 判断值是不是一个布尔值
 *
 * @example
 * //true
 * console.log(_.isBoolean(false))
 * //false
 * console.log(_.isBoolean('true'))
 * //false
 * console.log(_.isBoolean(1))
 *
 * @param v
 * @returns
 */
function isBoolean(v) {
    return typeof v === 'boolean' || v instanceof Boolean;
}

/**
 * isUndefined()的反向验证函数，在需要验证是否变量存在的场景下非常有用
 * @example
 * //true
 * console.log(_.isDefined(null))
 * //false
 * console.log(_.isDefined(undefined))
 *
 * @param v
 * @returns
 */
function isDefined(v) {
    return v !== undefined;
}

/**
 * 判断值是不是Element的实例
 *
 * @example
 * //true
 * console.log(_.isElement(document.body))
 * //false
 * console.log(_.isElement(document))
 *
 * @param v
 * @returns
 * @since 1.0.0
 */
function isElement(v) {
    return typeof v === 'object' && v instanceof Element;
}

/**
 * 判断参数是否为空，包括`null/undefined/空字符串/0/[]/{}`都表示空
 *
 * 注意：相比isBlank，isEmpty只判断字符串长度是否为0
 *
 * @example
 * //true
 * console.log(_.isEmpty(null))
 * //true
 * console.log(_.isEmpty([]))
 * //false
 * console.log(_.isEmpty({x:1}))
 *
 * @param v
 * @returns
 */
function isEmpty(v) {
    if (null === v)
        return true;
    if (undefined === v)
        return true;
    if ('' === v)
        return true;
    if (0 === v)
        return true;
    if (isArrayLike$2(v) && v.length < 1)
        return true;
    if (v instanceof Object && Object.keys(v).length < 1)
        return true;
    return false;
}

/**
 * 判断值是否NaN本身。与全局isNaN函数相比，只有NaN值本身才会返回true
 * <p>
 * isNaN(undefined) => true <br>
 * _.isNaN(undefined) => false
 * </p>
 *
 * @example
 * //true
 * console.log(_.isNaN(NaN))
 * //false
 * console.log(_.isNaN(null))
 * //false
 * console.log(_.isNaN(undefined))
 *
 * @param v
 * @returns
 */
function isNaN(v) {
    return Number.isNaN(v);
}

/**
 * 判断参数是否为数字类型值
 *
 * @example
 * //true
 * console.log(_.isNumber(1))
 * //true
 * console.log(_.isNumber(Number.MAX_VALUE))
 * //false
 * console.log(_.isNumber('1'))
 *
 * @param v
 * @returns
 */
function isNumber(v) {
    return typeof v === 'number' || v instanceof Number;
}

/**
 * 判断参数是否为undefined
 * @example
 * //true
 * console.log(_.isUndefined(undefined))
 * //false
 * console.log(_.isUndefined(null))
 *
 * @param v
 * @returns
 */
function isUndefined$1(v) {
    return v === undefined;
}

/**
   * myfx/object v1.1.0
   * A modular utility library with more utils, higher performance and simpler declarations ...
   * https://github.com/holyhigh2/myfx
   * (c) 2021-2023 @holyhigh2 may be freely distributed under the MIT license
   */
  function identity$1(v) {
    return v;
}

const PRIMITIVE_TYPES$1 = [
    'string',
    'number',
    'bigint',
    'boolean',
    'undefined',
    'symbol',
];
/**
 * 判断值是不是一个非基本类型外的值，如果true则认为值是一个对象
 * 同样，该方法还可以用来判断一个值是不是基本类型
 *
 * @example
 * //false
 * console.log(_.isObject(1))
 * //true
 * console.log(_.isObject(new String()))
 * //false
 * console.log(_.isObject(true))
 * //false
 * console.log(_.isObject(null))
 *
 * @param v value
 * @returns 是否对象。如果值是null返回false，即使typeof null === 'object'
 */
function isObject$1(v) {
    return null !== v && PRIMITIVE_TYPES$1.indexOf(typeof v) < 0;
}

function eachSources(target, sources, handler, afterHandler) {
    sources.forEach((src) => {
        if (!isObject$1(src))
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
    if (!isObject$1(target))
        return new target.constructor(target);
    if (!Object.isExtensible(target) ||
        Object.isFrozen(target) ||
        Object.isSealed(target)) {
        return target;
    }
}

/**
 * 与<code>assign</code>相同，但支持自定义处理器
 *
 * > 该函数会修改目标对象
 *
 * @example
 * //{x: 1, y: '3y', z: null}
 * console.log(_.assignWith({x:1},{y:3,z:4},(sv,tv,k)=>k=='z'?null:sv+k))
 *
 * @param target 目标对象
 * @param sources 源对象，可变参数。最后一个参数为函数时，签名为(src[k],target[k],k,src,target) 自定义赋值处理器，返回赋予target[k]的值
 * @returns 返回target
 */
function assignWith(target, ...sources) {
    const rs = checkTarget(target);
    if (rs)
        return rs;
    let src = sources;
    const sl = sources.length;
    let handler = src[sl - 1];
    if (!handler || !handler.call) {
        handler = identity$1;
    }
    else {
        src = src.slice(0, sl - 1);
    }
    eachSources(target, src, handler, (v, sv, tv, k, s, t) => {
        t[k] = v;
    });
    return target;
}

/**
 * 将一个或多个源对象的可枚举属性值分配到目标对象。如果源对象有多个，则按照从左到右的顺序依次对target赋值，相同属性会被覆盖
 *
 * > 该函数会修改目标对象
 *
 * <ul>
 *  <li>当目标对象是null/undefined时，返回空对象</li>
 *  <li>当目标对象是基本类型时，返回对应的包装对象</li>
 *  <li>当目标对象是不可扩展/冻结/封闭状态时，返回目标对象</li>
 * </ul>
 * @example
 * //{x:1,y:3}
 * console.log(_.assign({x:1},{y:3}))
 *
 * @param target 目标对象
 * @param  {...object} sources 源对象
 * @returns 返回target
 */
function assign(target, ...sources) {
    return assignWith(target, ...sources, identity$1);
}

/**
 * 判断参数是否为函数对象
 *
 * @example
 * //true
 * console.log(_.isFunction(new Function()))
 * //true
 * console.log(_.isFunction(()=>{}))
 *
 * @param v
 * @returns
 */
function isFunction$1(v) {
    return typeof v == 'function' || v instanceof Function;
}

/**
 * 判断参数是否为字符串，包括String类的实例以及基本类型string的值
 *
 * @example
 * //true
 * console.log(_.isString(new String('')))
 * //true
 * console.log(_.isString(''))
 *
 * @param v
 * @returns
 */
function isString$1(v) {
    return typeof v === 'string' || v instanceof String;
}

/**
 * 判断参数是否为Array对象的实例
 *
 * @example
 * //true
 * console.log(_.isArray([]))
 * //false
 * console.log(_.isArray(document.body.children))
 *
 * @param v
 * @returns
 */
function isArray$1(v) {
    // 使用 instanceof Array 无法鉴别某些场景，比如
    // Array.prototype instanceof Array => false
    // Array.isArray(Array.prototype) => true
    // typeof new Proxy([],{}) => object
    // Array.isArray(new Proxy([],{})) => true
    return Array.isArray(v);
}

function toPath$1$1(path) {
    let chain = path;
    if (isArray$1(chain)) {
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

/**
 * 通过path获取对象属性值
 *
 * @example
 * //2
 * console.log(_.get([1,2,3],1))
 * //Holyhigh
 * console.log(_.get({a:{b:[{x:'Holyhigh'}]}},['a','b',0,'x']))
 * //Holyhigh2
 * console.log(_.get({a:{b:[{x:'Holyhigh2'}]}},'a.b.0.x'))
 * //Holyhigh
 * console.log(_.get({a:{b:[{x:'Holyhigh'}]}},'a.b[0].x'))
 * //hi
 * console.log(_.get([[null,[null,null,'hi']]],'[0][1][2]'))
 * //not find
 * console.log(_.get({},'a.b[0].x','not find'))
 *
 * @param obj 需要获取属性值的对象，如果obj不是对象(isObject返回false)，则返回defaultValue
 * @param path 属性路径，可以是索引数字，字符串key，或者多级属性数组
 * @param [defaultValue] 如果path未定义，返回默认值
 * @returns 属性值或默认值
 */
function get$1(obj, path, defaultValue) {
    if (!isObject$1(obj))
        return defaultValue;
    const chain = toPath$1$1(path);
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

/**
 * 返回对象的所有key数组
 *
 * > 只返回对象的自身可枚举属性
 *
 * @example
 * let f = new Function("this.a=1;this.b=2;");
 * f.prototype.c = 3;
 * //[a,b]
 * console.log(_.keys(new f()))
 *
 * @param obj
 * @returns 对象的key
 */
function keys$1(obj) {
    if (obj === null || obj === undefined)
        return [];
    return Object.keys(obj);
}

function noop() {
    return undefined;
}

/**
 * 判断值是不是一个Set对象
 *
 * @example
 * //false
 * console.log(_.isSet(new WeakSet))
 * //true
 * console.log(_.isSet(new Set))
 *
 * @param v
 * @returns
 */
function isSet$1(v) {
    return v instanceof Set;
}

/**
 * 判断参数是否为类数组对象
 *
 * @example
 * //true
 * console.log(_.isArrayLike('abc123'))
 * //true
 * console.log(_.isArrayLike([]))
 * //true
 * console.log(_.isArrayLike(document.body.children))
 *
 * @param v
 * @returns
 */
function isArrayLike$1(v) {
    if (isString$1(v) && v.length > 0)
        return true;
    if (!isObject$1(v))
        return false;
    // 具有length属性
    const list = v;
    if (list.length !== undefined) {
        const proto = list.constructor.prototype;
        // NodeList/HTMLCollection/CSSRuleList/...
        if (isFunction$1(proto.item))
            return true;
        // arguments
        if (isFunction$1(list[Symbol.iterator]))
            return true;
    }
    return false;
}

/**
 * 判断值是不是一个Map对象
 *
 * @example
 * //true
 * console.log(_.isMap(new Map()))
 * //false
 * console.log(_.isMap(new WeakMap()))
 *
 * @param v
 * @returns
 */
function isMap$1(v) {
    return v instanceof Map;
}

/**
 * 返回对象的所有value数组
 * <div class="alert alert-secondary">
      只返回对象的自身可枚举属性
    </div>
 *
 *
 * @example
 * let f = new Function("this.a=1;this.b=2;");
 * f.prototype.c = 3;
 * //[1,2]
 * console.log(_.values(new f()))
 *
 * @param obj
 * @returns 对象根属性对应的值列表
 */
function values$1(obj) {
    return keys$1(obj).map((k) => obj[k]);
}

/**
 * 把一个集合对象转为array对象。对于非集合对象，
 * <ul>
 * <li>字符串 - 每个字符都会变成数组的元素</li>
 * <li>其他情况 - 返回包含一个collection元素的数组</li>
 * </ul>
 *
 * @example
 * //[1,2,3]
 * console.log(_.toArray(new Set([1,2,3])))
 * //['a','b','c']
 * console.log(_.toArray('abc'))
 * //[1,2,'b']
 * console.log(_.toArray({x:1,y:2,z:'b'}))
 * //[[1, 'a'], [3, 'b'], ['a', 5]]
 * console.log(_.toArray(new Map([[1,'a'],[3,'b'],['a',5]])))
 *
 * @param collection 如果是Map/Object对象会转换为值列表
 *
 * @returns 转换后的数组对象
 */
function toArray$1(collection) {
    if (isArray$1(collection))
        return collection.concat();
    if (isFunction$1(collection))
        return [collection];
    if (isSet$1(collection)) {
        return Array.from(collection);
    }
    else if (isString$1(collection)) {
        return collection.split('');
    }
    else if (isArrayLike$1(collection)) {
        return Array.from(collection);
    }
    else if (isMap$1(collection)) {
        return Array.from(collection.values());
    }
    else if (isObject$1(collection)) {
        return values$1(collection);
    }
    return [collection];
}

/**
 * 合并数组或值并返回新数组，元素可以重复。基于 `Array.prototype.concat` 实现
 *
 * @example
 * //[a/b/a]
 * console.log(_.concat([{name:'a'},{name:'b'}],[{name:'a'}]))
 * //[1, 2, 3, 1, 2]
 * console.log(_.concat([1,2,3],[1,2]))
 * //[1, 2, 3, 1, 2, null, 0]
 * console.log(_.concat([1,2,3],[1,2],null,0))
 * //[1, 2, 3, 1, 2, doms..., 0, null]
 * console.log(_.concat([1,2,3],[1,2],document.body.children,0,null))
 *
 * @param arrays 1-n个数组对象
 * @returns 如果参数为空，返回空数组
 */
function concat(...arrays) {
    if (arrays.length < 1)
        return [];
    arrays = arrays.map((alk) => (isArrayLike$1(alk) ? toArray$1(alk) : alk));
    return toArray$1(arrays[0]).concat(...arrays.slice(1));
}

/**
 * 与<code>merge</code>相同，但支持自定义处理器
 *
 * > 该函数会修改目标对象
 *
 * @example
 * //{x: 2, y: {a: 2, b: 4, c: 3, d: 27}}
 * console.log(_.mergeWith({x:1,y:{a:1,b:2,c:3}},{x:2,y:{a:2,d:3}},{y:{b:4}},(sv,tv,k)=>k=='d'?sv*9:undefined))
 *
 * @param target 目标对象
 * @param sources 1-n个源对象
 * @param [handler=noop] (src[k],target[k],k,src,target,chain) 自定义赋值处理器，返回赋予target[k]的值
 * @returns 返回target
 * @since 0.22.0
 */
function mergeWith(target, ...sources) {
    const rs = checkTarget(target);
    if (rs)
        return rs;
    let src = sources;
    const sl = src.length;
    let handler = src[sl - 1];
    if (!isFunction$1(handler)) {
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
            if (isObject$1(tv) && !isFunction$1(tv)) {
                walkSources(tv, [sv], handler, path);
            }
            else {
                t[k] = sv;
            }
        }
    });
}

/**
 * 类似<code>assign</code>，但会递归源对象的属性合并到目标对象。
 * <br>如果目标对象属性值存在，但对应源对象的属性值为undefined，跳过合并操作。
 * 支持自定义处理器，如果处理器返回值为undefined，启用默认合并。
 * 该函数在对可选配置项与默认配置项进行合并时非常有用
 *
 * > 该函数会修改目标对象
 *
 * - 当目标对象是null/undefined时，返回空对象
 * - 当目标对象是基本类型时，返回对应的包装对象
 * - 当目标对象是不可扩展/冻结/封闭状态时，返回目标对象
 *
 * @example
 * //{x: 0, y: {a: 1, b: 2, c: 3, d: 4}}
 * console.log(_.merge({x:1,y:{a:1,b:2}},{x:2,y:{c:5,d:4}},{x:0,y:{c:3}}))
 * //[{x: 0, y: {a: 1, b: 2, c: 3, d: 4}}]
 * console.log(_.merge([{x:1,y:{a:1,b:2}}],[{x:2,y:{c:5,d:4}}],[{x:0,y:{c:3}}]))
 *
 * @param target 目标对象
 * @param sources 1-n个源对象
 * @returns 返回target
 * @since 0.22.0
 */
function merge(target, ...sources) {
    return mergeWith(target, ...sources, noop);
}

/* eslint-disable max-len */
const UtMap = new WeakMap();
class UiiTransform {
    constructor(el, useTransform = true) {
        this.angle = 0;
        this.el = el;
        this.useTransform = useTransform;
        this.normalize(el);
        UtMap.set(el, this);
    }
    normalize(el) {
        let { offx, offy } = normalize(el || this.el, this.useTransform);
        // this.x = offx
        // this.y = offy
        this.offx = offx * -1;
        this.offy = offy * -1;
        return this;
    }
    moveTo(x, y) {
        this.x = x;
        this.y = y;
        (this.useTransform ? transformMoveTo : moveTo)(this.el, this.x + this.offx, this.y + this.offy);
    }
    moveToX(x) {
        this.x = x;
        (this.useTransform ? transformMoveTo : moveTo)(this.el, this.x + this.offx, NaN);
    }
    moveToY(y) {
        this.y = y;
        (this.useTransform ? transformMoveTo : moveTo)(this.el, NaN, this.y + this.offy);
    }
    rotateTo(deg, cx, cy) {
        this.angle = deg;
        rotateTo(this.el, deg, cx, cy);
    }
}
/**
 * 统一化处理，记录offset
 * @param el
 */
function normalize(el, useTransform) {
    const style = window.getComputedStyle(el);
    let offx = 0, offy = 0;
    let x = 0, y = 0;
    let mx = 0, my = 0;
    //1. get left/top (include margins)
    if (el instanceof HTMLElement) {
        x = parseFloat(style.left) || 0;
        y = parseFloat(style.top) || 0;
        mx = parseFloat(style.marginLeft) || 0;
        my = parseFloat(style.marginTop) || 0;
    }
    else {
        x =
            parseFloat(get$1(el, "x.baseVal.value") || get$1(el, "cx.baseVal.value")) ||
                0;
        y =
            parseFloat(get$1(el, "y.baseVal.value") || get$1(el, "cy.baseVal.value")) ||
                0;
    }
    //2. get translate
    if (useTransform) {
        (offx = x), (offy = y);
    }
    else {
        (offx = 0), (offy = 0);
    }
    // moveTo(el, x, y);
    return { offx: offx + mx, offy: offy + my };
}
/**
 * 返回一个包装后的变形对象，可执行变形操作
 * @param el
 */
function wrapper(el, useTransform = true) {
    let ut = UtMap.get(el);
    if (ut)
        return ut.normalize(el);
    return new UiiTransform(el, useTransform);
}
function transformMove(transofrmStr, x, y, unit = false) {
    if (!isNumber(x) || isNaN(x)) {
        return (`translateY(${y}${unit ? "px" : ""}) ` +
            transofrmStr.replace(/translateY\([^)]+?\)/, "").trim());
    }
    if (!isNumber(y) || isNaN(x)) {
        return (`translateX(${x}${unit ? "px" : ""}) ` +
            transofrmStr.replace(/translateX\([^)]+?\)/, "").trim());
    }
    return (`translate(${x}${unit ? "px" : ""},${y}${unit ? "px" : ""}) ` +
        transofrmStr.replace(/translate\([^)]+?\)/, "").trim());
}
/**
 * 获取元素当前transform中的位移数据
 * @param el HTMLElement|SVGGraphicsElement
 * @returns {x,y}
 */
function getTranslate(el) {
    let xVal = NaN, yVal = NaN;
    let transformStr = "";
    //svg
    if (el instanceof SVGGraphicsElement) {
        transformStr = el.getAttribute("transform") || "";
        if (!transformStr) {
            xVal =
                parseFloat(get$1(el, "x.baseVal.value") || get$1(el, "cx.baseVal.value")) ||
                    0;
            yVal =
                parseFloat(get$1(el, "y.baseVal.value") || get$1(el, "cy.baseVal.value")) ||
                    0;
        }
    }
    else {
        let style = el.style;
        transformStr = style.transform || "";
    }
    EXP_GET_TRANSLATE.lastIndex = 0;
    const xy = EXP_GET_TRANSLATE.exec(transformStr);
    if (xy && xy.groups) {
        xVal = parseFloat(xy.groups.x);
        yVal = parseFloat(xy.groups.y);
    }
    else {
        EXP_GET_TRANSLATE_XY.lastIndex = 0;
        const xy = EXP_GET_TRANSLATE_XY.exec(transformStr);
        if (xy && xy.groups) {
            if (xy.groups.dir == "X") {
                xVal = parseFloat(xy.groups.v);
            }
            else {
                yVal = parseFloat(xy.groups.v);
            }
        }
    }
    return { x: xVal, y: yVal };
}
/**
 * 自动检测HTML元素或SVG元素并设置对应移动属性
 * @param el HTMLElement|SVGGraphicsElement
 * @param x value of px
 * @param y value of px
 */
function moveTo(el, x, y) {
    //svg
    if (el instanceof SVGGraphicsElement) {
        if (x)
            el.setAttribute("x", x + "");
        if (y)
            el.setAttribute("y", y + "");
    }
    else {
        let style = el.style;
        if (x)
            style.left = x + "px";
        if (y)
            style.top = y + "px";
    }
}
function transformMoveTo(el, x, y) {
    //svg
    if (el instanceof SVGGraphicsElement) {
        el.setAttribute("transform", transformMove(el.getAttribute("transform") || "", x || 0, y || 0));
    }
    else {
        let style = el.style;
        style.transform = transformMove(style.transform || "", x || 0, y || 0, true);
    }
}
const EXP_GET_TRANSLATE = /translate\(\s*(?<x>[\d.-]+)\D*,\s*(?<y>[\d.-]+)\D*\)/gim;
const EXP_GET_TRANSLATE_XY = /translate(?<dir>X|Y)\(\s*(?<v>[\d.-]+)\D*\)/gim;
/**
 * 自动检测HTML元素或SVG元素并设置对应移动属性
 * @param el HTMLElement|SVGGraphicsElement
 * @param x value of px
 * @param y value of px
 */
function moveBy(el, x, y) {
    const xy = getTranslate(el);
    //svg
    if (el instanceof SVGGraphicsElement) {
        el.setAttribute("transform", transformMove(el.getAttribute("transform") || "", xy.x + x, xy.y + y));
    }
    else {
        let style = el.style;
        style.transform = transformMove(style.transform || "", xy.x + x, xy.y + y, true);
    }
}
function rotateTo(el, deg, cx, cy) {
    //svg
    if (el instanceof SVGGraphicsElement) {
        let transformStr = el.getAttribute("transform") || "";
        let originPos = isDefined(cx) && isDefined(cy);
        let origin = "";
        if (originPos) {
            //origin offset
            if (el.x instanceof SVGAnimatedLength) {
                cx += el.x.animVal.value;
                cy += el.y.animVal.value;
            }
            else if (el.cx instanceof SVGAnimatedLength) {
                cx += el.cx.animVal.value;
                cy += el.cy.animVal.value;
            }
            origin = `,${cx},${cy}`;
        }
        transformStr =
            transformStr.replace(/rotate\([^)]+?\)/, "") + ` rotate(${deg}${origin})`;
        el.setAttribute("transform", transformStr);
    }
    else {
        let style = el.style;
        style.transform =
            style.transform
                .replace(/rotate\([^)]+?\)/, "")
                .replace(/rotateZ\([^)]+?\)/, "") +
                " rotateZ(" +
                deg +
                "deg)";
    }
}

/* eslint-disable max-len */
/**
 * 一角度对应的弧度
 */
const ONE_ANG = Math.PI / 180;
/**
 * 一弧度对应的角度
 */
const ONE_RAD = 180 / Math.PI;
const THRESHOLD = 3;
/**
 * 获取child相对于parent的位置信息。含border宽度
 *
 * @returns {x,y,w,h}
 */
function getBox(child, parent) {
    const rect = child.getBoundingClientRect();
    const rs = { x: 0, y: 0, w: rect.width, h: rect.height };
    parent =
        parent ||
            child.offsetParent ||
            child.ownerSVGElement ||
            child.parentElement ||
            document.body;
    const parentRect = parent.getBoundingClientRect(); //bcr包含padding，不包含borderWidth
    const parentStyle = window.getComputedStyle(parent);
    const parentBorderLeft = parseFloat(parentStyle.borderLeftWidth);
    const parentBorderTop = parseFloat(parentStyle.borderTopWidth);
    rs.x = rect.x - parentRect.x + parent.scrollLeft;
    rs.y = rect.y - parentRect.y + parent.scrollTop;
    if (child instanceof SVGElement) ;
    else {
        rs.x -= parentBorderLeft;
        rs.y -= parentBorderTop;
    }
    return rs;
}
/**
 * 获取事件目标与点击点之间的偏移
 * @param e
 * @returns [offx,offy]
 */
function getPointOffset(e, pos) {
    let ox = e.offsetX || 0, oy = e.offsetY || 0;
    if (e.target instanceof SVGElement) {
        ox -= pos.x;
        oy -= pos.y;
    }
    return [ox, oy];
}
function isSVGEl(el) {
    return el instanceof SVGElement;
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
        document.head.appendChild(document.createElement("style"));
    }
    const sheet = find(document.styleSheets, (ss) => !ss.href);
    if (!sheet) {
        document.head.appendChild(document.createElement("style"));
    }
    return sheet || find(document.styleSheets, (ss) => !ss.href);
}
let cursor = { html: "", body: "" };
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
/**
 * 获取元素样式/属性中的x/y
 * @param el
 */
function getStyleXy(el) {
    const style = window.getComputedStyle(el);
    let x = 0, y = 0;
    if (el instanceof SVGGraphicsElement) {
        x = parseFloat(style.x || style.cx) || 0;
        y = parseFloat(style.y || style.cy) || 0;
    }
    else {
        x = parseFloat(style.left) || 0;
        y = parseFloat(style.top) || 0;
    }
    return { x, y };
}
/**
 * 获取元素样式/属性中的w/h
 * @param el
 */
function getStyleSize(el, cStyle) {
    if ("getBBox" in el) {
        //SVG
        let { width, height } = el.getBBox();
        return { w: width, h: height };
    }
    if (!cStyle)
        cStyle = window.getComputedStyle(el);
    const w = parseFloat(cStyle.width);
    const h = parseFloat(cStyle.height);
    return { w, h };
}
/**
 * 获取matrix中的scale/angle
 * @param elCStyle
 * @param recur 递归计算matrix
 * @returns
 */
function getMatrixInfo(el, recur = false) {
    const rs = { scale: 1, angle: 0, x: 0, y: 0 };
    let a = 1, b = 0;
    let elCStyle = window.getComputedStyle(el);
    let matrix = new DOMMatrix(elCStyle.transform);
    if (recur) {
        let p = el.parentElement;
        while (p && p.tagName !== "BODY" && p.tagName.toLowerCase() !== "svg") {
            let pCStyle = window.getComputedStyle(p);
            const pMatrix = new DOMMatrix(pCStyle.transform);
            matrix = matrix.multiply(pMatrix);
            p = p.parentElement;
        }
    }
    if (matrix) {
        a = matrix.a;
        b = matrix.b;
        matrix.c;
        matrix.d;
        rs.x = matrix.e;
        rs.y = matrix.f;
    }
    rs.scale = Math.sqrt(a * a + b * b);
    rs.angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    return rs;
}
/**
 * 获取当前鼠标相对于指定元素el的坐标
 * @param event 点击事件
 * @param el 元素
 * @param elRect 元素的DOMRect
 * @param elCStyle 元素的计算样式
 * @returns
 */
function getPointInContainer(event, el, elRect, elCStyle, matrixInfo) {
    if (!elRect) {
        elRect = el.getBoundingClientRect();
    }
    let rx = elRect.x, ry = elRect.y;
    if (!elCStyle) {
        elCStyle = window.getComputedStyle(el);
    }
    if (!matrixInfo) {
        matrixInfo = getMatrixInfo(el, true);
    }
    const scale = matrixInfo.scale;
    let x = event.clientX -
        rx -
        (parseFloat(elCStyle.borderLeftWidth) || 0) * scale +
        el.scrollLeft * scale;
    let y = event.clientY -
        ry -
        (parseFloat(elCStyle.borderTopWidth) || 0) * scale +
        el.scrollTop * scale;
    return { x: x / scale, y: y / scale, scale };
}
/**
 * 获取元素el在容器container中的相对boundingBox
 * @param el
 * @param container
 */
function getRectInContainer(el, container, matrixInfo) {
    const elRect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const elCStyle = window.getComputedStyle(container);
    matrixInfo = matrixInfo || getMatrixInfo(container, true);
    const scale = matrixInfo.scale;
    let x = elRect.x -
        containerRect.x -
        (parseFloat(elCStyle.borderLeftWidth) || 0) * scale +
        container.scrollLeft * scale;
    let y = elRect.y -
        containerRect.y -
        (parseFloat(elCStyle.borderTopWidth) || 0) * scale +
        container.scrollTop * scale;
    return {
        x: x / scale,
        y: y / scale,
        w: elRect.width / scale,
        h: elRect.height / scale,
    };
}
/**
 * 获取指定元素（DOM/SVG）相对于父元素的中心点
 * @param el
 * @returns
 */
function getRectCenter(el, matrixInfo) {
    const panelRect = getRectInContainer(el, el.parentElement, matrixInfo);
    let x = Math.round(panelRect.x + panelRect.w / 2);
    let y = Math.round(panelRect.y + panelRect.h / 2);
    return { x, y };
}
/**
 * 获取指定元素的圆心坐标
 * @param el
 * @param left
 * @param top
 * @returns
 */
function getCenterXy(el, ox, oy) {
    const cStyle = window.getComputedStyle(el);
    //origin
    const center = cStyle.transformOrigin;
    const centerPair = center.split(" ");
    ox = ox || parseFloat(centerPair[0]);
    oy = oy || parseFloat(centerPair[1]);
    //left & top
    const shadowDom = el.cloneNode();
    rotateTo(shadowDom, 0);
    const parentEl = el.parentElement;
    let startX = 0, startY = 0;
    if (parentEl) {
        parentEl.appendChild(shadowDom);
        const offsetXY = getRectInContainer(shadowDom, parentEl);
        (startX = offsetXY.x), (startY = offsetXY.y);
        parentEl.removeChild(shadowDom);
    }
    return { sx: startX, sy: startY, x: startX + ox, y: startY + oy, ox, oy };
}
function getCenterXySVG(el, ox, oy) {
    let elRect = el.getBoundingClientRect();
    let svgRect = el.ownerSVGElement.getBoundingClientRect();
    let x = elRect.x - svgRect.x;
    let y = elRect.y - svgRect.y;
    //left & top
    const shadowDom = el.cloneNode();
    rotateTo(shadowDom, 0);
    const parentEl = el.parentElement;
    if (parentEl) {
        //这里的偏移需要处理
        parentEl.appendChild(shadowDom);
        const offsetXY = getRectInContainer(shadowDom, parentEl);
        (offsetXY.x), (offsetXY.y);
        parentEl.removeChild(shadowDom);
    }
    return { sx: x, sy: y, x: x + ox, y: y + oy, ox, oy };
}
/**
 * 获取元素当前顶点
 * @param el
 * @param ox 相对于图形左上角的圆心偏移，支持数字/百分比，仅对SVG元素有效，对于非SVG元素使用transform-origin属性
 * @param oy
 */
function getVertex(el, ox, oy) {
    const cStyle = window.getComputedStyle(el);
    const w = parseFloat(cStyle.width);
    const h = parseFloat(cStyle.height);
    const { originX, originY } = parseOxy(ox, oy, w, h);
    const { x, y, sx, sy } = el instanceof SVGGraphicsElement
        ? getCenterXySVG(el, originX, originY)
        : getCenterXy(el);
    const { angle } = getMatrixInfo(el);
    return calcVertex(w, h, x, y, sx, sy, angle * ONE_ANG);
}
/**
 * 计算指定矩形旋转后的顶点坐标
 * @param w 宽
 * @param h 高
 * @param cx 圆心
 * @param cy
 * @param sx
 * @param sy
 * @param radian 旋转角 弧度值
 * @returns
 */
function calcVertex(w, h, cx, cy, sx, sy, radian) {
    let originVertex = [
        { x: 0, y: 0 },
        { x: w, y: 0 },
        { x: 0, y: h },
        { x: w, y: h },
    ];
    return map(originVertex, ({ x, y }) => {
        const nx = (x - cx + sx) * Math.cos(radian) - (y - cy + sy) * Math.sin(radian);
        const ny = (x - cx + sx) * Math.sin(radian) + (y - cy + sy) * Math.cos(radian);
        return { x: cx + nx, y: cy + ny };
    });
}
/**
 * 解析ox/y
 * @param ox 如果不是number或string，originX为0
 * @param oy 如果不是number或string，originY为0
 * @param w
 * @param h
 * @param el
 * @returns {originX,originY}
 */
function parseOxy(ox, oy, w, h, el) {
    let originX = 0, originY = 0;
    let transformOrigin;
    if (isString$2(ox)) {
        //percent
        originX = (parseFloat(ox) / 100) * w;
    }
    else if (isNumber(ox)) {
        originX = ox;
    }
    else if (el) {
        //origin
        if (!transformOrigin)
            transformOrigin = window.getComputedStyle(el).transformOrigin;
        const centerPair = transformOrigin.split(" ");
        originX = parseFloat(centerPair[0]);
    }
    if (isString$2(oy)) {
        //percent
        originY = (parseFloat(oy) / 100) * h;
    }
    else if (isNumber(oy)) {
        originY = oy;
    }
    else if (el) {
        //origin
        if (!transformOrigin)
            transformOrigin = window.getComputedStyle(el).transformOrigin;
        const centerPair = transformOrigin.split(" ");
        originY = parseFloat(centerPair[1]);
    }
    return { originX, originY };
}
function normalizeVector(x, y) {
    let len = Math.sqrt(x * x + y * y);
    return { x: x / len, y: y / len };
}
function isVisible(el) {
    let rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
        return false;
    }
    return true;
}

var _Uii_listeners;
/**
 * A Base class for all Uii classes
 */
class Uii {
    constructor(ele, opts) {
        this.enabled = true;
        _Uii_listeners.set(this, []);
        this.opts = opts || {};
        this.opts.mouseButton = this.opts.mouseButton || 'left';
        if (isArrayLike$2(ele) && !isString$2(ele)) {
            this.ele = map(ele, (el) => {
                let e = isString$2(el) ? document.querySelector(el) : el;
                if (!isElement(e)) {
                    console.error('Invalid element "' + el + '"');
                    return false;
                }
                return e;
            });
        }
        else {
            if (isString$2(ele)) {
                this.eleString = ele;
            }
            const el = isString$2(ele) ? document.querySelectorAll(ele) : ele;
            if (!isElement(el) && !isArrayLike$2(el)) {
                console.error('Invalid element "' + ele + '"');
                return;
            }
            this.ele = isArrayLike$2(el)
                ? toArray$2(el)
                : [el];
        }
    }
    /**
     * 销毁uii对象，包括卸载事件、清空元素等
     */
    destroy() {
        each$1(__classPrivateFieldGet(this, _Uii_listeners, "f"), (ev) => {
            ev[0].removeEventListener(ev[1], ev[2], ev[3]);
        });
        __classPrivateFieldSet(this, _Uii_listeners, [], "f");
    }
    //通用指针事件处理接口
    addPointerDown(el, pointerDown, opts) {
        const onPointerDown = pointerDown;
        const threshold = opts.threshold || 0;
        const toLockPage = opts.lockPage || false;
        const uiiOptions = this.opts;
        this.registerEvent(el, "mousedown", (e) => {
            if (uiiOptions.mouseButton) {
                switch (uiiOptions.mouseButton) {
                    case "left":
                        if (e.button != 0)
                            return;
                        break;
                    case "right":
                        if (e.button != 2)
                            return;
                        break;
                }
            }
            let t = e.target;
            if (!t)
                return;
            //uiik options
            const hasCursor = !isEmpty(get$1(uiiOptions, "cursor.active"));
            //提取通用信息
            const currentStyle = el.style;
            const currentCStyle = window.getComputedStyle(el);
            const currentRect = el.getBoundingClientRect();
            let dragging = false;
            const originPosX = e.clientX;
            const originPosY = e.clientY;
            if (hasCursor) {
                saveCursor();
            }
            let onPointerStart;
            let onPointerMove;
            let onPointerEnd;
            const toBreak = !!onPointerDown({
                onPointerMove: (pm) => {
                    onPointerMove = pm;
                },
                onPointerStart: (ps) => {
                    onPointerStart = ps;
                },
                onPointerEnd: (pe) => {
                    onPointerEnd = pe;
                },
                ev: e,
                pointX: e.clientX,
                pointY: e.clientY,
                target: t,
                currentTarget: el,
                currentStyle,
                currentCStyle,
                currentRect,
            });
            if (toBreak) {
                e.preventDefault();
                return false;
            }
            let matrixInfo = getMatrixInfo(el, true);
            //函数
            const pointerMove = (ev) => {
                const offX = (ev.clientX - originPosX) / matrixInfo.scale;
                const offY = (ev.clientY - originPosY) / matrixInfo.scale;
                if (!dragging) {
                    if (Math.abs(offX) > threshold || Math.abs(offY) > threshold) {
                        dragging = true;
                        if (toLockPage) {
                            lockPage();
                        }
                        if (hasCursor) {
                            setCursor(uiiOptions.cursor.active);
                        }
                        onPointerStart && onPointerStart({ ev });
                    }
                    else {
                        ev.preventDefault();
                        return false;
                    }
                }
                onPointerMove &&
                    onPointerMove({
                        ev,
                        pointX: ev.clientX,
                        pointY: ev.clientY,
                        offX,
                        offY,
                        currentStyle,
                        currentCStyle,
                    });
            };
            const pointerEnd = (ev) => {
                document.removeEventListener("mousemove", pointerMove, false);
                document.removeEventListener("mouseup", pointerEnd, false);
                window.removeEventListener("blur", pointerEnd, false);
                if (dragging) {
                    if (toLockPage) {
                        unlockPage();
                    }
                    if (hasCursor) {
                        restoreCursor();
                    }
                    onPointerEnd && onPointerEnd({ ev, currentStyle });
                }
            };
            document.addEventListener("mousemove", pointerMove);
            document.addEventListener("mouseup", pointerEnd);
            window.addEventListener("blur", pointerEnd);
            e.preventDefault();
            return false;
        }, true);
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
        __classPrivateFieldGet(this, _Uii_listeners, "f").push([el, event, wrapper, useCapture]);
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

var _Splittable_instances, _Splittable_checkDirection, _Splittable_bindHandle;
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
        each$1(this.ele, con => {
            //detect container position
            const pos = window.getComputedStyle(con).position;
            if (pos === "static" || isBlank(pos)) {
                con.style.position = "relative";
            }
            con.classList.toggle(CLASS_SPLITTABLE, true);
            const handleDoms = con.querySelectorAll(this.opts.handle);
            const children = reject(con.children, c => {
                if (includes(handleDoms, c))
                    return true;
                return false;
            });
            const dir = __classPrivateFieldGet(this, _Splittable_instances, "m", _Splittable_checkDirection).call(this, con);
            con.classList.toggle(dir === 'v' ? CLASS_SPLITTABLE_V : CLASS_SPLITTABLE_H, true);
            const minSizeAry = map(children, (c, i) => {
                if (isArray$2(this.opts.minSize)) {
                    return this.opts.minSize[i] || 0;
                }
                else {
                    return this.opts.minSize;
                }
            });
            const stickyAry = map(children, (c, i) => {
                if (isArray$2(this.opts.sticky)) {
                    return this.opts.sticky[i] || false;
                }
                else {
                    return this.opts.sticky;
                }
            });
            if (isEmpty(handleDoms)) {
                const len = children.length - 1;
                for (let i = 0; i < len; i++) {
                    __classPrivateFieldGet(this, _Splittable_instances, "m", _Splittable_bindHandle).call(this, minSizeAry.slice(i, i + 2), stickyAry.slice(i, i + 2), this.opts, dir, children[i], children[i + 1]);
                }
            }
            else {
                each$1(handleDoms, (h, i) => {
                    const isRoot = h.parentNode.classList.contains(CLASS_SPLITTABLE);
                    let dom1, dom2;
                    if (isRoot) {
                        dom1 = h.previousElementSibling;
                        dom2 = h.nextElementSibling;
                    }
                    else {
                        let domCon = getRootEl(h, con);
                        let domL = domCon.previousElementSibling;
                        let domR = domCon.nextElementSibling;
                        if (domL && !domL.querySelector(this.opts.handle)) {
                            dom1 = domL;
                            dom2 = domCon;
                        }
                        else {
                            dom1 = domCon;
                            dom2 = domR;
                        }
                    }
                    __classPrivateFieldGet(this, _Splittable_instances, "m", _Splittable_bindHandle).call(this, minSizeAry.slice(i, i + 2), stickyAry.slice(i, i + 2), this.opts, dir, dom1, dom2, h);
                });
            }
        });
    }
}
_Splittable_instances = new WeakSet(), _Splittable_checkDirection = function _Splittable_checkDirection(container) {
    let dir = 'h';
    const child = container.children[0];
    let lastY = child.offsetTop;
    each$1(container.children, c => {
        if (c.offsetTop != lastY) {
            dir = 'v';
            return false;
        }
    });
    return dir;
}, _Splittable_bindHandle = function _Splittable_bindHandle(minSizeAry, stickyAry, opts, dir, dom1, dom2, handle) {
    var _a, _b;
    const handleSize = opts.handleSize;
    if (!handle) {
        handle = document.createElement('div');
        let initPos = 0;
        if (!opts.inside) {
            initPos = (dir === 'v' ? dom2.offsetTop : dom2.offsetLeft);
        }
        if (!isVisible(dom2)) {
            (_a = dom2.parentElement) === null || _a === void 0 ? void 0 : _a.addEventListener('mouseenter', () => {
                initPos = (dir === 'v' ? dom2.offsetTop : dom2.offsetLeft);
                handle.style.left = initPos - handleSize / 2 + 'px';
            }, { once: true });
        }
        const sensorHCss = `width:${handleSize}px;height:100%;top:0;left:${initPos - handleSize / 2}px;z-index:9;`;
        const sensorVCss = `height:${handleSize}px;width:100%;left:0;top:${initPos - handleSize / 2}px;z-index:9;`;
        handle.style.cssText =
            'position: absolute;' + (dir === 'v' ? sensorVCss : sensorHCss);
        if (opts.inside) {
            dom2.appendChild(handle);
        }
        (_b = dom2.parentNode) === null || _b === void 0 ? void 0 : _b.insertBefore(handle, dom2);
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
    this.addPointerDown(handle, ({ currentTarget, onPointerStart, onPointerMove, onPointerEnd }) => {
        // 1. 获取原始高度/宽度;设置宽度/高度
        let originSize = 0;
        let originSize1 = 0;
        let splitterSize = 1;
        let blockSize = 0; // 分割区size
        switch (dir) {
            case 'v':
                originSize = dom1.offsetHeight;
                originSize1 = dom2.offsetHeight;
                splitterSize = currentTarget.offsetHeight;
                break;
            case 'h':
                originSize = dom1.offsetWidth;
                originSize1 = dom2.offsetWidth;
                splitterSize = currentTarget.offsetWidth;
                break;
        }
        blockSize = splitterSize + originSize + originSize1;
        const dom1Style = dom1.style;
        const dom2Style = dom2.style;
        //ghost
        const ghost = opts.ghost;
        const ghostClass = opts.ghostClass;
        const ghostTo = opts.ghostTo;
        let ghostNode = null;
        // 初始化sticked位置
        let sticked = 'none';
        if (originSize < minSize1 / 2) {
            sticked = 'start';
        }
        else if (blockSize - originSize - splitterSize < minSize2 / 2) {
            sticked = 'end';
        }
        let startPos = dir === 'v' ? dom1.offsetTop : dom1.offsetLeft;
        let ds1, anotherSize;
        //bind events
        onPointerStart(function (args) {
            const { ev } = args;
            currentTarget.classList.add(CLASS_SPLITTABLE_HANDLE_ACTIVE);
            if (ghost) {
                ghostNode = currentTarget.cloneNode(true);
                ghostNode.style.opacity = '0.3';
                ghostNode.style.pointerEvents = 'none';
                ghostNode.classList.add(CLASS_SPLITTABLE_HANDLE_GHOST);
                if (ghostNode) {
                    if (ghostClass) {
                        ghostNode.className =
                            ghostNode.className.replace(ghostClass, '') + ' ' + ghostClass;
                    }
                    let ghostParent = ghostTo ? (isString$2(ghostTo) ? document.querySelector(ghostTo) : ghostTo) : currentTarget.parentNode;
                    ghostParent.appendChild(ghostNode);
                    onClone && onClone({ clone: ghostNode }, ev);
                }
            }
            onStart && onStart({ size1: originSize, size2: originSize1 }, ev);
        });
        onPointerMove((args) => {
            const { ev, offX, offY, currentStyle } = args;
            let doSticky = false;
            ds1 = dir === 'v' ? originSize + offY : originSize + offX;
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
                    ghostNode.style.top = startPos + ds1 - splitterSize / 2 + 'px';
                }
                else {
                    ghostNode.style.left = startPos + ds1 - splitterSize / 2 + 'px';
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
                    currentStyle.top = dom2.offsetTop - splitterSize / 2 + 'px';
                }
                else {
                    currentStyle.left = dom2.offsetLeft - splitterSize / 2 + 'px';
                }
            }
            onSplit && onSplit({ size1: ds1, size2: anotherSize }, ev);
        });
        onPointerEnd((args) => {
            var _a;
            const { ev, currentStyle } = args;
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
                    currentStyle.top = startPos + ds1 - splitterSize / 2 + 'px';
                }
                else {
                    currentStyle.left = startPos + ds1 - splitterSize / 2 + 'px';
                }
                (_a = ghostNode.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(ghostNode);
            }
            onEnd && onEnd({ size1: originSize, size2: originSize1 }, ev);
        });
    }, {
        threshold: THRESHOLD,
        lockPage: true
    });
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
const CLASS_RESIZABLE_HANDLE = "uii-resizable-handle";
const CLASS_RESIZABLE_HANDLE_DIR = "uii-resizable-handle-";
const CLASS_RESIZABLE_HANDLE_ACTIVE = "uii-resizable-handle-active";
const EXP_DIR = new RegExp(CLASS_RESIZABLE_HANDLE_DIR + "(?<dir>[nesw]+)");
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
            dir: ["n", "s", "e", "w", "ne", "nw", "se", "sw"],
            ghost: false,
            offset: 0,
        }, opts));
        each$1(this.ele, (el) => {
            let tmp = el;
            if (tmp._uiik_resizable) {
                tmp._uiik_resizable.destroy();
                return false;
            }
        });
        each$1(this.ele, (el) => {
            el._uiik_resizable = this;
            this.initHandle(el);
        });
    }
    bindHandle(handle, dir, panel, opts) {
        const onStart = opts.onStart;
        const onResize = opts.onResize;
        const onEnd = opts.onEnd;
        const onClone = opts.onClone;
        const uiik = this;
        this.addPointerDown(handle, ({ ev, onPointerStart, onPointerMove, onPointerEnd }) => {
            //检测
            const onPointerDown = opts.onPointerDown;
            if (onPointerDown && onPointerDown(ev) === false)
                return true;
            let container = panel.parentElement;
            // 获取panel当前信息
            let matrixInfo = getMatrixInfo(panel, true);
            const offset = getRectInContainer(panel, container, matrixInfo);
            const offsetParentRect = container.getBoundingClientRect();
            const offsetParentCStyle = window.getComputedStyle(container);
            let setOrigin = !(panel instanceof SVGGraphicsElement) && matrixInfo.angle != 0;
            const { w, h } = getStyleSize(panel);
            const originW = w;
            const originH = h;
            const originX = offset.x;
            const originY = offset.y;
            let changeW = false;
            let changeH = false;
            let changeX = false;
            let changeY = false;
            let toTransformOrigin = "";
            switch (dir) {
                case "s":
                    changeH = true;
                    break;
                case "e":
                    changeW = true;
                    break;
                case "se":
                    changeW = true;
                    changeH = true;
                    break;
                case "n":
                    changeX = true;
                    changeY = true;
                    changeH = true;
                    toTransformOrigin = "0 0";
                    break;
                case "w":
                    changeX = true;
                    changeY = true;
                    changeW = true;
                    toTransformOrigin = "0 0";
                    break;
                case "sw":
                case "ne":
                case "nw":
                    changeX = true;
                    changeY = true;
                    changeW = true;
                    changeH = true;
                    toTransformOrigin = "0 0";
                    break;
            }
            // boundary
            let minWidth = 1;
            let minHeight = 1;
            let maxWidth = 9999;
            let maxHeight = 9999;
            if (isArray$2(opts.minSize)) {
                minWidth = opts.minSize[0];
                minHeight = opts.minSize[1];
            }
            else if (isNumber(opts.minSize)) {
                minWidth = opts.minSize;
                minHeight = opts.minSize;
            }
            if (isArray$2(opts.maxSize)) {
                maxWidth = opts.maxSize[0];
                maxHeight = opts.maxSize[1];
            }
            else if (isNumber(opts.maxSize)) {
                maxWidth = opts.maxSize;
                maxHeight = opts.maxSize;
            }
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
            let transform;
            let lastX = 0, lastY = 0;
            let originalTransformOrigin = "";
            let vertexBeforeTransform;
            let currentVertex;
            let refPoint;
            //slope
            let k1;
            let sX = 0, sY = 0;
            let startPointXy;
            //bind events
            onPointerStart(function (args) {
                var _a;
                const { ev } = args;
                handle.classList.add(CLASS_RESIZABLE_HANDLE_ACTIVE);
                if (ghost) {
                    if (isFunction$2(ghost)) {
                        ghostNode = ghost(panel);
                    }
                    else {
                        ghostNode = panel.cloneNode(true);
                        ghostNode.style.opacity = "0.3";
                        ghostNode.style.pointerEvents = "none";
                    }
                    if (ghostNode) {
                        if (ghostClass) {
                            ghostNode.className =
                                ghostNode.className.replace(ghostClass, "") +
                                    " " +
                                    ghostClass;
                        }
                        (_a = panel.parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(ghostNode);
                        transform = wrapper(ghostNode);
                        onClone && onClone({ clone: ghostNode }, ev);
                    }
                    style = ghostNode === null || ghostNode === void 0 ? void 0 : ghostNode.style;
                }
                else {
                    transform = wrapper(panel);
                }
                const cStyle = window.getComputedStyle(panel);
                const w = parseFloat(cStyle.width);
                const h = parseFloat(cStyle.height);
                const oxy = parseOxy(opts.ox, opts.oy, w, h);
                oxy.originX;
                oxy.originY;
                //计算sx及cx
                const panelRect = getRectInContainer(panel, panel.parentElement, matrixInfo);
                let centerX = Math.round(panelRect.x + panelRect.w / 2);
                let centerY = Math.round(panelRect.y + panelRect.h / 2);
                let sx = Math.round(centerX - originW / 2);
                let sy = Math.round(centerY - originH / 2);
                transform.x = sx;
                transform.y = sy;
                const deg = matrixInfo.angle * ONE_ANG;
                currentVertex = vertexBeforeTransform = calcVertex(originW, originH, centerX, centerY, sx, sy, deg);
                //计算参考点及斜率
                switch (dir) {
                    case "s":
                    case "e":
                    case "se":
                        refPoint = currentVertex[0];
                        break;
                    case "n":
                    case "w":
                    case "nw":
                        refPoint = currentVertex[3];
                        break;
                    case "sw":
                        refPoint = currentVertex[1];
                        break;
                    case "ne":
                        refPoint = currentVertex[2];
                        break;
                }
                //水平斜率
                k1 =
                    (currentVertex[1].y - refPoint.y) /
                        (currentVertex[1].x - refPoint.x); //w
                //change trans origin
                style.transition = "none";
                originalTransformOrigin = style.transformOrigin;
                if (setOrigin) {
                    if (toTransformOrigin) {
                        style.transformOrigin = toTransformOrigin;
                    }
                    else {
                        style.transformOrigin = `${centerX - sx}px ${centerY - sy}px`;
                    }
                }
                if (panel instanceof SVGGraphicsElement) {
                    sX = matrixInfo.x - currentVertex[0].x;
                    sY = matrixInfo.y - currentVertex[0].y;
                }
                startPointXy = getPointInContainer(ev, container, offsetParentRect, offsetParentCStyle, matrixInfo);
                onStart &&
                    onStart.call(uiik, { w: originW, h: originH, transform }, ev);
            });
            onPointerMove((args) => {
                const { ev, offX, offY } = args;
                let newX = startPointXy.x + offX;
                let newY = startPointXy.y + offY;
                const rpx = refPoint.x;
                const rpy = refPoint.y;
                ////////////////////////////////////////// 计算边长
                //1. calc angle
                let angle = Math.atan2(newY - rpy, newX - rpx) * ONE_RAD - matrixInfo.angle;
                //2. hypotenuse length
                let hyLen = Math.sqrt((newX - rpx) * (newX - rpx) + (newY - rpy) * (newY - rpy));
                //3. h&v projection length
                let pl1 = Math.abs(k1 === Infinity
                    ? newY - refPoint.y / matrixInfo.scale
                    : hyLen * Math.cos(angle * ONE_ANG));
                let pl2 = Math.sqrt(hyLen * hyLen - pl1 * pl1);
                let w = originW;
                let h = originH;
                let y = originY;
                let x = originX;
                let angl = 0;
                switch (dir) {
                    case "w":
                    case "sw":
                        angl =
                            Math.atan2(currentVertex[0].y - currentVertex[1].y, currentVertex[0].x - currentVertex[1].x) * ONE_RAD;
                        break;
                    case "n":
                    case "ne":
                    case "nw":
                        angl =
                            Math.atan2(currentVertex[0].y - currentVertex[2].y, currentVertex[0].x - currentVertex[2].x) * ONE_RAD;
                }
                //w & h
                switch (dir) {
                    case "s":
                        h = pl2;
                        break;
                    case "e":
                        w = pl1;
                        break;
                    case "n":
                        h = pl2;
                        if (angl === 90) {
                            h = newY - currentVertex[2].y;
                        }
                        break;
                    case "w":
                        w = pl1;
                        if (angl === 0) {
                            w = newX - currentVertex[1].x;
                        }
                        break;
                    case "nw":
                        w = pl1;
                        h = pl2;
                        if (matrixInfo.angle === 180) {
                            w = newX - currentVertex[3].x;
                            h = newY - currentVertex[3].y;
                        }
                        break;
                    case "se":
                    case "sw":
                    case "ne":
                        w = pl1;
                        h = pl2;
                        break;
                }
                //w & h boundary
                if (minHeight && h < minHeight)
                    h = minHeight;
                if (maxHeight && h > maxHeight)
                    h = maxHeight;
                if (minWidth && w < minWidth) {
                    w = minWidth;
                }
                if (maxWidth && w > maxWidth)
                    w = maxWidth;
                let hLine, wLine;
                // x & y
                switch (dir) {
                    case "s":
                        hLine = { p1: currentVertex[1], p2: currentVertex[0] };
                        h = limitWH(newX, newY, hLine, h, minHeight);
                        break;
                    case "e":
                        wLine = { p1: currentVertex[0], p2: currentVertex[2] };
                        w = limitWH(newX, newY, wLine, w, minWidth);
                        break;
                    case "se":
                        wLine = { p1: currentVertex[0], p2: currentVertex[2] };
                        hLine = { p1: currentVertex[1], p2: currentVertex[0] };
                        w = limitWH(newX, newY, wLine, w, minWidth);
                        h = limitWH(newX, newY, hLine, h, minHeight);
                        break;
                    case "n":
                        hLine = { p1: currentVertex[2], p2: currentVertex[3] };
                        h = limitWH(newX, newY, hLine, h, minHeight);
                        let plh;
                        //1&2 quad
                        if (angl === 90) {
                            x = currentVertex[2].x;
                            y = newY;
                        }
                        else if (currentVertex[2].y > currentVertex[0].y) {
                            plh = h * Math.cos(angl * ONE_ANG);
                            x = currentVertex[2].x + plh;
                            y = currentVertex[2].y - Math.sqrt(h * h - plh * plh);
                        }
                        else {
                            plh = h * Math.cos((180 - angl) * ONE_ANG);
                            x = currentVertex[2].x - plh;
                            y = currentVertex[2].y + Math.sqrt(h * h - plh * plh);
                        }
                        break;
                    case "w":
                        wLine = { p1: currentVertex[3], p2: currentVertex[1] };
                        w = limitWH(newX, newY, wLine, w, minWidth);
                        let plw;
                        //1&4 quad
                        if (angl === 0) {
                            x = newX;
                            y = currentVertex[1].y;
                        }
                        else if (currentVertex[1].y > currentVertex[0].y) {
                            plw = w * Math.cos((180 - angl) * ONE_ANG);
                            x = currentVertex[1].x - plw;
                            y = currentVertex[1].y - Math.sqrt(w * w - plw * plw);
                        }
                        else {
                            plw = w * Math.cos(angl * ONE_ANG);
                            x = currentVertex[1].x + plw;
                            y = currentVertex[1].y + Math.sqrt(w * w - plw * plw);
                        }
                        break;
                    case "nw":
                        wLine = { p1: currentVertex[3], p2: currentVertex[1] };
                        hLine = { p1: currentVertex[2], p2: currentVertex[3] };
                        w = limitWH(newX, newY, wLine, w, minWidth);
                        h = limitWH(newX, newY, hLine, h, minHeight);
                        x = newX;
                        y = newY;
                        let cv2x = currentVertex[2].x;
                        let cv2y = currentVertex[2].y;
                        let cv1x = currentVertex[1].x;
                        let cv1y = currentVertex[1].y;
                        //W boundary
                        let v32n = normalizeVector(cv2x - currentVertex[3].x, cv2y - currentVertex[3].y);
                        v32n.x *= minWidth;
                        v32n.y *= minWidth;
                        let v10n = normalizeVector(currentVertex[0].x - cv1x, currentVertex[0].y - cv1y);
                        v10n.x *= minWidth;
                        v10n.y *= minWidth;
                        let wp1 = { x: wLine.p1.x + v32n.x, y: wLine.p1.y + v32n.y };
                        let wp2 = { x: wLine.p2.x + v10n.x, y: wLine.p2.y + v10n.y };
                        let invalid = (wp2.x - wp1.x) * (newY - wp1.y) -
                            (wp2.y - wp1.y) * (newX - wp1.x) >
                            0;
                        if (invalid) {
                            let v20n = normalizeVector(currentVertex[0].x - cv2x, currentVertex[0].y - cv2y);
                            v20n.x *= h;
                            v20n.y *= h;
                            x = wp1.x + v20n.x;
                            y = wp1.y + v20n.y;
                        }
                        //H boundary
                        let v31n = normalizeVector(cv1x - currentVertex[3].x, cv1y - currentVertex[3].y);
                        v31n.x *= minHeight;
                        v31n.y *= minHeight;
                        let v20n = normalizeVector(currentVertex[0].x - cv2x, currentVertex[0].y - cv2y);
                        v20n.x *= minHeight;
                        v20n.y *= minHeight;
                        let hp1 = { x: hLine.p1.x + v31n.x, y: hLine.p1.y + v31n.y };
                        let hp2 = { x: hLine.p2.x + v20n.x, y: hLine.p2.y + v20n.y };
                        invalid =
                            (hp2.x - hp1.x) * (newY - hp1.y) -
                                (hp2.y - hp1.y) * (newX - hp1.x) >
                                0;
                        if (invalid) {
                            let v10n = normalizeVector(currentVertex[0].x - cv1x, currentVertex[0].y - cv1y);
                            v10n.x *= w;
                            v10n.y *= w;
                            x = hp2.x + v10n.x;
                            y = hp2.y + v10n.y;
                        }
                        break;
                    case "sw":
                        wLine = { p1: currentVertex[3], p2: currentVertex[1] };
                        hLine = { p1: currentVertex[1], p2: currentVertex[0] };
                        w = limitWH(newX, newY, wLine, w, minWidth);
                        h = limitWH(newX, newY, hLine, h, minHeight);
                        let plw1;
                        //1&4 quad
                        if (angl === 0) {
                            x = newX;
                            y = currentVertex[0].y;
                        }
                        else if (currentVertex[1].y > currentVertex[0].y) {
                            plw1 = w * Math.cos((180 - angl) * ONE_ANG);
                            x = currentVertex[1].x - plw1;
                            y = currentVertex[1].y - Math.sqrt(w * w - plw1 * plw1);
                        }
                        else {
                            plw1 = w * Math.cos((180 - angl) * ONE_ANG);
                            x = currentVertex[1].x - plw1;
                            y = currentVertex[1].y + Math.sqrt(w * w - plw1 * plw1);
                        }
                        break;
                    case "ne":
                        wLine = { p1: currentVertex[0], p2: currentVertex[2] };
                        hLine = { p1: currentVertex[2], p2: currentVertex[3] };
                        w = limitWH(newX, newY, wLine, w, minWidth);
                        h = limitWH(newX, newY, hLine, h, minHeight);
                        let plne;
                        if (angl === 0) {
                            x = newX;
                            y = currentVertex[0].y;
                        }
                        else if (currentVertex[1].x > currentVertex[0].x) {
                            //1&2 quad
                            plne = h * Math.cos((180 - angl) * ONE_ANG);
                            x = currentVertex[2].x - plne;
                            y = currentVertex[2].y - Math.sqrt(h * h - plne * plne);
                        }
                        else {
                            plne = h * Math.cos(angl * ONE_ANG);
                            x = currentVertex[2].x + plne;
                            y = currentVertex[2].y + Math.sqrt(h * h - plne * plne);
                        }
                        break;
                }
                if (aspectRatio) {
                    if (changeW) {
                        style.width = w + "px";
                        style.height = w / aspectRatio + "px";
                    }
                    if (changeH && dir !== "sw") {
                        if (dir === "nw") {
                            y = originY - w / aspectRatio + originH;
                        }
                        else {
                            style.width = h * aspectRatio + "px";
                            style.height = h + "px";
                        }
                    }
                }
                else {
                    if (changeW) {
                        resize(transform, style, w);
                    }
                    if (changeH) {
                        resize(transform, style, undefined, h);
                    }
                }
                if (changeY) {
                    transform.moveTo(x, y + sY);
                }
                if (changeX) {
                    transform.moveTo(x + sX, y);
                }
                lastX = x;
                lastY = y;
                currentW = w;
                currentH = h;
                if (onResize && onResize.call) {
                    onResize.call;
                    const panelRect = getRectInContainer(panel, panel.parentElement, matrixInfo);
                    let centerX = Math.round(panelRect.x + panelRect.w / 2);
                    let centerY = Math.round(panelRect.y + panelRect.h / 2);
                    let sx = Math.round(centerX - originW / 2);
                    let sy = Math.round(centerY - originH / 2);
                    onResize.call(uiik, {
                        w,
                        h,
                        ow: w - originW,
                        oh: h - originH,
                        target: panel,
                        cx: x,
                        cy: y,
                        sx: sx,
                        sy: sy,
                        deg: matrixInfo.angle,
                        transform,
                    }, ev);
                }
            });
            onPointerEnd((args) => {
                var _a, _b;
                const { ev } = args;
                if (ghost && ghostNode) {
                    ((_a = panel.parentNode) === null || _a === void 0 ? void 0 : _a.contains(ghostNode)) &&
                        ((_b = panel.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(ghostNode));
                    panelStyle.left = ghostNode.style.left;
                    panelStyle.top = ghostNode.style.top;
                    moveTo(panel, lastX / matrixInfo.scale, lastY / matrixInfo.scale);
                    resize(transform, panelStyle, parseFloat(ghostNode.style.width), parseFloat(ghostNode.style.height));
                }
                if (setOrigin)
                    panel.style.transformOrigin = originalTransformOrigin;
                let { x: centerX, y: centerY } = getRectCenter(panel, matrixInfo);
                let sx = Math.round(centerX - currentW / 2);
                let sy = Math.round(centerY - currentH / 2);
                const deg = matrixInfo.angle * ONE_ANG;
                const currentVertex = calcVertex(currentW, currentH, centerX, centerY, sx, sy, deg);
                //修正偏移
                if (setOrigin) {
                    if (panel instanceof HTMLElement) {
                        if (changeX || changeY) {
                            transform.moveTo(transform.x - (currentVertex[0].x - lastX), transform.y - (currentVertex[0].y - lastY));
                        }
                        else {
                            transform.moveTo(transform.x -
                                (currentVertex[0].x - vertexBeforeTransform[0].x), transform.y -
                                (currentVertex[0].y - vertexBeforeTransform[0].y));
                        }
                    }
                } //if setOrigin
                handle.classList.remove(CLASS_RESIZABLE_HANDLE_ACTIVE);
                onEnd &&
                    onEnd.call(uiik, { w: currentW, h: currentH, transform }, ev);
            });
        }, {
            threshold: THRESHOLD,
            lockPage: true,
        });
    }
    initHandle(panel) {
        const opts = this.opts;
        let handleStr = opts.handle;
        let handles;
        if (isString$2(handleStr)) {
            handles = document.querySelectorAll(handleStr);
        }
        else if (isFunction$2(handleStr)) {
            handles = handleStr(panel);
        }
        if (!handles) {
            console.error('Can not find handles with "' + panel.outerHTML + '"');
            return;
        }
        handles = isArrayLike$2(handles) ? handles : [handles];
        each$1(handles, (h) => {
            //get dir from handle
            const className = h.getAttribute("class") || "";
            const matchRs = className.match(EXP_DIR);
            let dir = "se";
            if (matchRs) {
                dir = matchRs.groups.dir;
            }
            h.classList.add(CLASS_RESIZABLE_HANDLE);
            this.bindHandle(h, dir, panel, opts);
            h.style.cursor = `${dir}-resize`;
            h.dataset.cursor = `${dir}-resize`;
            h.setAttribute("name", "handle");
        });
    }
}
function limitWH(newX, newY, line, value, minValue) {
    let p1 = line.p1;
    let p2 = line.p2;
    let invalid = (p2.x - p1.x) * (newY - p1.y) - (p2.y - p1.y) * (newX - p1.x) > 0;
    if (invalid) {
        return minValue;
    }
    return value;
}
function resize(transform, style, w, h) {
    //svg
    if (transform.el instanceof SVGGraphicsElement) {
        if (isDefined(w))
            transform.el.setAttribute("width", w + "");
        if (isDefined(h))
            transform.el.setAttribute("height", h + "");
    }
    else {
        if (isDefined(w))
            style.width = w + "px";
        if (isDefined(h))
            style.height = h + "px";
    }
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

/**
   * myfx/string v1.1.0
   * A modular utility library with more utils, higher performance and simpler declarations ...
   * https://github.com/holyhigh2/myfx
   * (c) 2021-2023 @holyhigh2 may be freely distributed under the MIT license
   */

/**
 * 判断值是否为null或undefined
 *
 * @example
 * //true
 * console.log(_.isNil(undefined))
 * //false
 * console.log(_.isNil(0))
 * //true
 * console.log(_.isNil(null))
 * //false
 * console.log(_.isNil(NaN))
 *
 * @param v
 * @returns
 * @since 1.0.0
 */
function isNil$1(v) {
    return v === null || v === undefined;
}

/**
 * 转换任何对象为字符串。如果对象本身为string类型的值/对象，则返回该对象的字符串形式。否则返回对象的toString()方法的返回值
 *
 * @example
 * //''
 * console.log(_.toString(null))
 * //1
 * console.log(_.toString(1))
 * //3,6,9
 * console.log(_.toString([3,6,9]))
 * //-0
 * console.log(_.toString(-0))
 * //[object Set]
 * console.log(_.toString(new Set([3,6,9])))
 * //{a:1}
 * console.log(_.toString({a:1,toString:()=>'{a:1}'}))
 *
 * @param v 任何值
 * @returns 对于null/undefined会返回空字符串
 */
function toString(v) {
    if (isNil$1(v))
        return '';
    if (v === 0 && 1 / v < 0)
        return '-0';
    return v.toString();
}

/**
 * 判断值是不是一个正则对象
 *
 * @example
 * //true
 * console.log(_.isRegExp(new RegExp))
 * //true
 * console.log(_.isRegExp(/1/))
 *
 * @param v
 * @returns
 * @since 0.19.0
 */
function isRegExp(v) {
    return typeof v === 'object' && v instanceof RegExp;
}

/**
 * 使用分隔符将字符串分割为多段数组
 *
 * @example
 * //["func", "js"]
 * console.log(_.split('func.js','.'))
 * //["func"]
 * console.log(_.split('func.js','.',1))
 *
 * @param str 原字符串。如果非字符串则会自动转换成字符串
 * @param separator 分隔符
 * @param [limit] 限制返回的结果数量，为空返回所有结果
 * @returns 分割后的数组
 */
function split(str, separator, limit) {
    return toString(str).split(separator, limit);
}

/**
 * 检测字符串是否与指定的正则匹配
 *
 * @example
 * //true 忽略大小写包含判断
 * console.log(_.test('func.js','Func','i'))
 * //true 忽略大小写相等判断
 * console.log(_.test('func.js',/^FUNC\.js$/i))
 * //false
 * console.log(_.test('func.js',/FUNC/))
 *
 * @param str
 * @param pattern 指定正则。如果非正则类型会自动转换为正则再进行匹配
 * @param [flags] 如果pattern参数不是正则类型，会使用该标记作为正则构造的第二个参数
 * @returns 匹配返回true
 * @since 0.19.0
 */
function test(str, pattern, flags) {
    let regExp = pattern;
    if (!isRegExp(regExp)) {
        regExp = new RegExp(pattern, flags);
    }
    return regExp.test(str);
}

/**
   * myfx/array v1.1.0
   * A modular utility library with more utils, higher performance and simpler declarations ...
   * https://github.com/holyhigh2/myfx
   * (c) 2021-2023 @holyhigh2 may be freely distributed under the MIT license
   */
  /**
 * 判断参数是否为Array对象的实例
 *
 * @example
 * //true
 * console.log(_.isArray([]))
 * //false
 * console.log(_.isArray(document.body.children))
 *
 * @param v
 * @returns
 */
function isArray(v) {
    // 使用 instanceof Array 无法鉴别某些场景，比如
    // Array.prototype instanceof Array => false
    // Array.isArray(Array.prototype) => true
    // typeof new Proxy([],{}) => object
    // Array.isArray(new Proxy([],{})) => true
    return Array.isArray(v);
}

/**
 * 判断参数是否为函数对象
 *
 * @example
 * //true
 * console.log(_.isFunction(new Function()))
 * //true
 * console.log(_.isFunction(()=>{}))
 *
 * @param v
 * @returns
 */
function isFunction(v) {
    return typeof v == 'function' || v instanceof Function;
}

/**
 * 判断值是不是一个Set对象
 *
 * @example
 * //false
 * console.log(_.isSet(new WeakSet))
 * //true
 * console.log(_.isSet(new Set))
 *
 * @param v
 * @returns
 */
function isSet(v) {
    return v instanceof Set;
}

/**
 * 判断参数是否为字符串，包括String类的实例以及基本类型string的值
 *
 * @example
 * //true
 * console.log(_.isString(new String('')))
 * //true
 * console.log(_.isString(''))
 *
 * @param v
 * @returns
 */
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
/**
 * 判断值是不是一个非基本类型外的值，如果true则认为值是一个对象
 * 同样，该方法还可以用来判断一个值是不是基本类型
 *
 * @example
 * //false
 * console.log(_.isObject(1))
 * //true
 * console.log(_.isObject(new String()))
 * //false
 * console.log(_.isObject(true))
 * //false
 * console.log(_.isObject(null))
 *
 * @param v value
 * @returns 是否对象。如果值是null返回false，即使typeof null === 'object'
 */
function isObject(v) {
    return null !== v && PRIMITIVE_TYPES.indexOf(typeof v) < 0;
}

/**
 * 判断参数是否为类数组对象
 *
 * @example
 * //true
 * console.log(_.isArrayLike('abc123'))
 * //true
 * console.log(_.isArrayLike([]))
 * //true
 * console.log(_.isArrayLike(document.body.children))
 *
 * @param v
 * @returns
 */
function isArrayLike(v) {
    if (isString(v) && v.length > 0)
        return true;
    if (!isObject(v))
        return false;
    // 具有length属性
    const list = v;
    if (list.length !== undefined) {
        const proto = list.constructor.prototype;
        // NodeList/HTMLCollection/CSSRuleList/...
        if (isFunction(proto.item))
            return true;
        // arguments
        if (isFunction(list[Symbol.iterator]))
            return true;
    }
    return false;
}

/**
 * 判断值是不是一个Map对象
 *
 * @example
 * //true
 * console.log(_.isMap(new Map()))
 * //false
 * console.log(_.isMap(new WeakMap()))
 *
 * @param v
 * @returns
 */
function isMap(v) {
    return v instanceof Map;
}

/**
 * 返回对象的所有key数组
 *
 * > 只返回对象的自身可枚举属性
 *
 * @example
 * let f = new Function("this.a=1;this.b=2;");
 * f.prototype.c = 3;
 * //[a,b]
 * console.log(_.keys(new f()))
 *
 * @param obj
 * @returns 对象的key
 */
function keys(obj) {
    if (obj === null || obj === undefined)
        return [];
    return Object.keys(obj);
}

/**
 * 返回对象的所有value数组
 * <div class="alert alert-secondary">
      只返回对象的自身可枚举属性
    </div>
 *
 *
 * @example
 * let f = new Function("this.a=1;this.b=2;");
 * f.prototype.c = 3;
 * //[1,2]
 * console.log(_.values(new f()))
 *
 * @param obj
 * @returns 对象根属性对应的值列表
 */
function values(obj) {
    return keys(obj).map((k) => obj[k]);
}

/**
 * 把一个集合对象转为array对象。对于非集合对象，
 * <ul>
 * <li>字符串 - 每个字符都会变成数组的元素</li>
 * <li>其他情况 - 返回包含一个collection元素的数组</li>
 * </ul>
 *
 * @example
 * //[1,2,3]
 * console.log(_.toArray(new Set([1,2,3])))
 * //['a','b','c']
 * console.log(_.toArray('abc'))
 * //[1,2,'b']
 * console.log(_.toArray({x:1,y:2,z:'b'}))
 * //[[1, 'a'], [3, 'b'], ['a', 5]]
 * console.log(_.toArray(new Map([[1,'a'],[3,'b'],['a',5]])))
 *
 * @param collection 如果是Map/Object对象会转换为值列表
 *
 * @returns 转换后的数组对象
 */
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

function identity(v) {
    return v;
}

/**
 * 对集合内的假值进行剔除，并返回剔除后的新数组。假值包括 null/undefined/NaN/0/''/false
 * @example
 * //[1,2,4,'a','1']
 * console.log(_.compact([0,1,false,2,4,undefined,'a','1','',null]))
 *
 * @param array 数组
 * @returns 转换后的新数组对象
 */
function compact(array) {
    return toArray(array).filter(identity);
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

/**
 * 判断参数是否为undefined
 * @example
 * //true
 * console.log(_.isUndefined(undefined))
 * //false
 * console.log(_.isUndefined(null))
 *
 * @param v
 * @returns
 */
function isUndefined(v) {
    return v === undefined;
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

/**
 * 通过path获取对象属性值
 *
 * @example
 * //2
 * console.log(_.get([1,2,3],1))
 * //Holyhigh
 * console.log(_.get({a:{b:[{x:'Holyhigh'}]}},['a','b',0,'x']))
 * //Holyhigh2
 * console.log(_.get({a:{b:[{x:'Holyhigh2'}]}},'a.b.0.x'))
 * //Holyhigh
 * console.log(_.get({a:{b:[{x:'Holyhigh'}]}},'a.b[0].x'))
 * //hi
 * console.log(_.get([[null,[null,null,'hi']]],'[0][1][2]'))
 * //not find
 * console.log(_.get({},'a.b[0].x','not find'))
 *
 * @param obj 需要获取属性值的对象，如果obj不是对象(isObject返回false)，则返回defaultValue
 * @param path 属性路径，可以是索引数字，字符串key，或者多级属性数组
 * @param [defaultValue] 如果path未定义，返回默认值
 * @returns 属性值或默认值
 */
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

/**
 * 创建一个函数，该函数返回指定对象的path属性值
 * @example
 * const libs = [
 *  {name:'func.js',platform:['web','nodejs'],tags:{utils:true},js:false},
 *  {name:'juth2',platform:['web','java'],tags:{utils:false,middleware:true},js:true},
 *  {name:'soya2d',platform:['web'],tags:{utils:true},js:true}
 * ];
 * //[true,false,true]
 * console.log(_.map(libs,_.prop('tags.utils')))
 * //nodejs
 * console.log(_.prop(['platform',1])(libs[0]))
 *
 * @param path
 * @returns 接收一个对象作为参数的函数
 * @since 0.17.0
 */
function prop(path) {
    return (obj) => {
        return get(obj, path);
    };
}

/**
 * 解析path并返回数组
 * @example
 * //['a', 'b', '2', 'c']
 * console.log(_.toPath('a.b[2].c'))
 * //['a', 'b', 'c', '1']
 * console.log(_.toPath(['a','b','c[1]']))
 * //['1']
 * console.log(_.toPath(1))
 *
 * @param path 属性路径，可以是数字索引，字符串key，或者多级属性数组
 * @returns path数组
 * @since 0.16.0
 */
function toPath(path) {
    return toPath$1(path);
}

/**
 * 判断值是否为null或undefined
 *
 * @example
 * //true
 * console.log(_.isNil(undefined))
 * //false
 * console.log(_.isNil(0))
 * //true
 * console.log(_.isNil(null))
 * //false
 * console.log(_.isNil(NaN))
 *
 * @param v
 * @returns
 * @since 1.0.0
 */
function isNil(v) {
    return v === null || v === undefined;
}

function eq(a, b) {
    if (Number.isNaN(a) && Number.isNaN(b))
        return true;
    return a === b;
}

/**
 * 检测props对象中的所有属性是否在object中存在并使用自定义比较器对属性值进行对比。可以用于对象的深度对比。
 * 当comparator参数是默认值时，与<code>isMath</code>函数相同
 *
 * @example
 * let target = {a:{x:1,y:2},b:1}
 * //true
 * console.log(_.isMatchWith(target,{b:1}))
 * //false
 * console.log(_.isMatchWith(target,{b:'1'}))
 *
 * target = {a:null,b:0}
 * //true
 * console.log(_.isMatchWith(target,{a:'',b:'0'},(a,b)=>_.isEmpty(a) && _.isEmpty(b)?true:a==b))
 *
 * @param target 如果不是对象类型，返回false
 * @param props 对比属性对象，如果是nil，返回true
 * @param [comparator=eq] 比较器，参数(object[k],props[k],k,object,props)，返回true表示匹配
 * @returns 匹配所有props返回true
 * @since 0.18.1
 */
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

/**
 * 检测props对象中的所有属性是否在object中存在，可用于对象的深度对比。
 * 使用<code>eq</code>作为值对比逻辑
 *
 * @example
 * let target = {a:{x:1,y:2},b:1}
 * //true
 * console.log(_.isMatch(target,{b:1}))
 * //true
 * console.log(_.isMatch(target,{a:{x:1}}))
 *
 * target = [{x:1,y:2},{b:1}]
 * //true
 * console.log(_.isMatch(target,{1:{b:1}}))
 * //true
 * console.log(_.isMatch(target,[{x:1}]))
 *
 * @param object
 * @param props 对比属性对象，如果是null，返回true
 * @returns 匹配所有props返回true
 * @since 0.17.0
 */
function isMatch(object, props) {
    return isMatchWith(object, props, eq);
}

/**
 * 创建一个函数，该函数接收一个对象为参数并返回对该对象使用props进行验证的的断言结果。
 *
 *
 * @example
 * const libs = [
 *  {name:'func.js',platform:['web','nodejs'],tags:{utils:true},js:true},
 *  {name:'juth2',platform:['web','java'],tags:{utils:false,middleware:true},js:false},
 *  {name:'soya2d',platform:['web'],tags:{utils:true},js:false}
 * ];
 *
 * //[{func.js...}]
 * console.log(_.filter(libs,_.matcher({tags:{utils:true},js:true})))
 *
 * @param props 断言条件对象
 * @returns matcher(v)函数
 * @since 0.17.0
 */
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

/**
 * 对数组进行切片，并返回切片后的新数组，原数组不变。新数组内容是对原数组内容的浅拷贝
 *
 * @example
 * //[2,3,4]
 * console.log(_.slice([1,2,3,4,5],1,4))
 * //[2,3,4,5]
 * console.log(_.slice([1,2,3,4,5],1))
 *
 *
 * @param array 数组
 * @param [begin=0] 切片起始下标，包含下标位置元素
 * @param [end] 切片结束下标，<b>不包含</b>下标位置元素
 * @returns 切片元素组成的新数组
 */
function slice(array, begin, end) {
    return toArray(array).slice(begin || 0, end);
}

/**
 * 对集合内的所有元素进行断言并返回第一个匹配的元素索引
 *
 * @example
 * //3 查询数组的索引
 * console.log(_.findIndex(['a','b','c',1,3,6],_.isNumber))
 * //0
 * console.log(_.findIndex([{a:1},{a:2},{a:3}],'a'))
 * //2
 * console.log(_.findIndex([{a:1},{a:2},{a:3}],{a:3}))
 *
 * @param array 数组
 * @param predicate (value[,index[,array]]);断言
 * <br>当断言是函数时回调参数见定义
 * <br>其他类型请参考 {@link utils!iteratee}
 * @param fromIndex 从0开始的起始索引，设置该参数可以减少实际遍历次数。默认0
 * @returns 第一个匹配断言的元素索引或-1
 */
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

/**
   * myfx/tree v1.1.0
   * A modular utility library with more utils, higher performance and simpler declarations ...
   * https://github.com/holyhigh2/myfx
   * (c) 2021-2023 @holyhigh2 may be freely distributed under the MIT license
   */

/**
 * 根据指定的node及parentKey属性，查找最近的祖先节点
 * @param node Element节点或普通对象节点
 * @param predicate (node,times,cancel)断言函数，如果返回true表示节点匹配。或调用cancel中断查找
 * @param parentKey 父节点引用属性名
 * @returns 断言为true的最近一个祖先节点
 * @since 1.0.0
 */
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

var _Draggable_instances, _Draggable_handleMap, _Draggable_container, _Draggable_initStyle;
const DRAGGER_GROUPS = {};
const CLASS_DRAGGABLE = "uii-draggable";
const CLASS_DRAGGABLE_HANDLE = "uii-draggable-handle";
const CLASS_DRAGGABLE_ACTIVE = "uii-draggable-active";
const CLASS_DRAGGABLE_GHOST = "uii-draggable-ghost";
/**
 * 用于表示一个或多个可拖动元素的定义
 * 每个拖动元素可以有独立handle，也可以公用一个handle
 * 可拖动元素拖动时自动剔除left/top/x/y/cx/cy属性，而使用transform:translate替代
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
            containment: false,
            watch: true,
            threshold: THRESHOLD,
            ghost: false,
            direction: "",
            scroll: true,
            useTransform: true,
            snapOptions: {
                tolerance: 10,
            },
            self: false,
        }, opts));
        _Draggable_instances.add(this);
        _Draggable_handleMap.set(this, new WeakMap());
        _Draggable_container.set(this, null);
        if (this.opts.handle) {
            each$1(this.ele, (el) => {
                const h = el.querySelector(this.opts.handle);
                if (!h) {
                    console.error('No handle found "' + this.opts.handle + '"');
                    return false;
                }
                __classPrivateFieldGet(this, _Draggable_handleMap, "f").set(el, h);
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
        __classPrivateFieldGet(this, _Draggable_instances, "m", _Draggable_initStyle).call(this, this.ele);
        //containment
        if (this.opts.containment) {
            if (isBoolean(this.opts.containment)) {
                __classPrivateFieldSet(this, _Draggable_container, isEmpty(this.ele) ? null : this.ele[0].parentElement, "f");
            }
            else if (isString$2(this.opts.containment)) {
                __classPrivateFieldSet(this, _Draggable_container, document.querySelector(this.opts.containment), "f");
            }
            else if (isElement(this.opts.containment)) {
                __classPrivateFieldSet(this, _Draggable_container, this.opts.containment, "f");
            }
        }
        if (this.opts.watch && this.eleString) {
            let con;
            if (isString$2(this.opts.watch)) {
                con = document.querySelector(this.opts.watch);
            }
            else {
                con = isEmpty(this.ele) ? null : this.ele[0].parentElement;
            }
            this.bindEvent(con || document.body, this.opts, __classPrivateFieldGet(this, _Draggable_handleMap, "f"));
        }
        else {
            each$1(this.ele, (el) => {
                this.bindEvent(el, this.opts, __classPrivateFieldGet(this, _Draggable_handleMap, "f"));
            });
        }
    }
    bindEvent(bindTarget, opts, handleMap) {
        const container = __classPrivateFieldGet(this, _Draggable_container, "f");
        let draggableList = this.ele;
        const eleString = this.eleString;
        const initStyle = __classPrivateFieldGet(this, _Draggable_instances, "m", _Draggable_initStyle).bind(this);
        this.addPointerDown(bindTarget, ({ ev, currentCStyle, onPointerStart, onPointerMove, onPointerEnd, }) => {
            var _a;
            let t = ev.target;
            if (!t)
                return true;
            //refresh draggableList
            if (opts.watch && eleString) {
                draggableList = bindTarget.querySelectorAll(eleString);
                initStyle(draggableList);
            }
            //find drag dom & handle
            let findRs = closest(t, (node) => includes(draggableList, node), "parentNode");
            if (!findRs)
                return true;
            const dragDom = findRs;
            let handle = handleMap.get(dragDom);
            if (handle && !handle.contains(t)) {
                return true;
            }
            if (opts.self && dragDom !== t)
                return true;
            //检测
            const onPointerDown = opts.onPointerDown;
            if (onPointerDown &&
                onPointerDown({ draggable: dragDom }, ev) === false)
                return true;
            const filter = opts.filter;
            //check filter
            if (filter) {
                if (some(dragDom.querySelectorAll(filter), (ele) => ele.contains(t)))
                    return true;
            }
            //用于计算鼠标移动时当前位置
            let offsetParent;
            let offsetParentRect;
            let offsetParentCStyle;
            let offsetPointX = 0;
            let offsetPointY = 0;
            const inContainer = !!container;
            const ghost = opts.ghost;
            const ghostClass = opts.ghostClass;
            const ghostTo = opts.ghostTo;
            const direction = opts.direction;
            const onStart = opts.onStart;
            const onDrag = opts.onDrag;
            const onEnd = opts.onEnd;
            const onClone = opts.onClone;
            const originalZIndex = currentCStyle.zIndex;
            let zIndex = opts.zIndex || originalZIndex;
            const classes = opts.classes || "";
            const group = opts.group;
            const scroll = opts.scroll;
            const scrollSpeed = opts.scrollSpeed || 10;
            let gridX, gridY;
            const snapOn = opts.snap;
            let snappable;
            const snapTolerance = ((_a = opts.snapOptions) === null || _a === void 0 ? void 0 : _a.tolerance) || 10;
            const onSnap = opts.onSnap;
            let lastSnapDirY = "", lastSnapDirX = "";
            let lastSnapping = "";
            const dragDomRect = dragDom.getBoundingClientRect();
            let originW;
            let originH;
            // boundary
            let minX = 0;
            let minY = 0;
            let maxX = 0;
            let maxY = 0;
            let ghostNode;
            let transform;
            let timer = null;
            let toLeft = false;
            let toTop = false;
            let toRight = false;
            let toBottom = false;
            let endX = 0, endY = 0;
            let startMatrixInfo;
            let startPointXy;
            //bind events
            onPointerStart(function (args) {
                const { ev } = args;
                ///////////////////////// initial states start;
                offsetParent =
                    dragDom instanceof HTMLElement
                        ? dragDom.offsetParent || document.body
                        : dragDom.ownerSVGElement;
                offsetParentRect = offsetParent.getBoundingClientRect();
                offsetParentCStyle = window.getComputedStyle(offsetParent);
                startMatrixInfo = getMatrixInfo(dragDom, true);
                const offsetXy = getPointInContainer(ev, dragDom, undefined, undefined, startMatrixInfo);
                offsetPointX = offsetXy.x;
                offsetPointY = offsetXy.y;
                startPointXy = getPointInContainer(ev, offsetParent, offsetParentRect, offsetParentCStyle, startMatrixInfo);
                originW =
                    dragDomRect.width;
                originH =
                    dragDomRect.height;
                //svg group el
                if (dragDom instanceof SVGGElement || dragDom instanceof SVGSVGElement) {
                    let bbox = dragDom.getBBox();
                    offsetPointX += bbox.x;
                    offsetPointY += bbox.y;
                }
                if (startMatrixInfo.angle != 0) {
                    let { sx, sy } = getCenterXy(dragDom);
                    offsetPointX = startPointXy.x - sx;
                    offsetPointY = startPointXy.y - sy;
                }
                if (group) {
                    let i = -1;
                    each$1(DRAGGER_GROUPS[group], (el) => {
                        const z = parseInt(currentCStyle.zIndex) || 0;
                        if (z > i)
                            i = z;
                    });
                    zIndex = i + 1;
                }
                const grid = opts.grid;
                if (isArray$2(grid)) {
                    gridX = grid[0];
                    gridY = grid[1];
                }
                else if (isNumber(grid)) {
                    gridX = gridY = grid;
                }
                if (snapOn) {
                    //获取拖动元素所在容器内的可吸附对象
                    snappable = map((container || document).querySelectorAll(snapOn), (el) => {
                        //计算相对容器xy
                        const { x, y, w, h } = getRectInContainer(el, offsetParent);
                        return {
                            x1: x,
                            y1: y,
                            x2: x + w,
                            y2: y + h,
                            el: el,
                        };
                    });
                }
                if (inContainer) {
                    maxX =
                        container.scrollWidth - originW / startMatrixInfo.scale;
                    maxY =
                        container.scrollHeight - originH / startMatrixInfo.scale;
                }
                if (maxX < 0)
                    maxX = 0;
                if (maxY < 0)
                    maxY = 0;
                ///////////////////////// initial states end;
                if (ghost) {
                    if (isFunction$2(ghost)) {
                        ghostNode = ghost(dragDom);
                    }
                    else {
                        ghostNode = dragDom.cloneNode(true);
                        ghostNode.style.opacity = "0.3";
                        ghostNode.style.pointerEvents = "none";
                        ghostNode.style.position = "absolute";
                    }
                    ghostNode.style.zIndex = zIndex + "";
                    if (ghostClass) {
                        ghostNode.classList.add(...compact(split(ghostClass, " ")));
                    }
                    ghostNode.classList.add(...compact(split(classes, " ")));
                    ghostNode.classList.toggle(CLASS_DRAGGABLE_GHOST, true);
                    let ghostParent = ghostTo ? (isString$2(ghostTo) ? document.querySelector(ghostTo) : ghostTo) : dragDom.parentNode;
                    ghostParent === null || ghostParent === void 0 ? void 0 : ghostParent.appendChild(ghostNode);
                    transform = wrapper(ghostNode, opts.useTransform);
                    onClone && onClone({ clone: ghostNode }, ev);
                }
                else {
                    transform = wrapper(dragDom, opts.useTransform);
                }
                //apply classes
                dragDom.classList.add(...compact(split(classes, " ")));
                if (!ghostNode)
                    dragDom.style.zIndex = zIndex + "";
                dragDom.classList.toggle(CLASS_DRAGGABLE_ACTIVE, true);
                onStart &&
                    onStart({ draggable: dragDom, x: startPointXy.x, y: startPointXy.y, transform }, ev);
                //notify
                const customEv = new Event("uii-dragactive", {
                    bubbles: true,
                    cancelable: false,
                });
                dragDom.dispatchEvent(customEv);
            });
            onPointerMove((args) => {
                const { ev, pointX, pointY, offX, offY } = args;
                let newX = startPointXy.x + offX;
                let newY = startPointXy.y + offY;
                //edge detect
                if (scroll) {
                    const lX = pointX - offsetParentRect.x;
                    const lY = pointY - offsetParentRect.y;
                    const rX = offsetParentRect.x + offsetParentRect.width - pointX;
                    const rY = offsetParentRect.y + offsetParentRect.height - pointY;
                    toLeft = lX < EDGE_THRESHOLD;
                    toTop = lY < EDGE_THRESHOLD;
                    toRight = rX < EDGE_THRESHOLD;
                    toBottom = rY < EDGE_THRESHOLD;
                    if (toLeft || toTop || toRight || toBottom) {
                        if (!timer) {
                            timer = setInterval(() => {
                                if (toLeft) {
                                    offsetParent.scrollLeft -= scrollSpeed;
                                }
                                else if (toRight) {
                                    offsetParent.scrollLeft += scrollSpeed;
                                }
                                if (toTop) {
                                    offsetParent.scrollTop -= scrollSpeed;
                                }
                                else if (toBottom) {
                                    offsetParent.scrollTop += scrollSpeed;
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
                let x = newX - offsetPointX;
                let y = newY - offsetPointY;
                //grid
                if (isNumber(gridX) && isNumber(gridY)) {
                    x = ((x / gridX) >> 0) * gridX;
                    y = ((y / gridY) >> 0) * gridY;
                }
                if (inContainer) {
                    if (x < minX) {
                        x = 0;
                    }
                    if (y < minY) {
                        y = 0;
                    }
                    if (x > maxX) {
                        x = maxX;
                    }
                    if (y > maxY) {
                        y = maxY;
                    }
                }
                let canDrag = true;
                let emitSnap = false;
                if (snapOn) {
                    const currPageX1 = x;
                    const currPageY1 = y;
                    const currPageX2 = currPageX1 + originW;
                    const currPageY2 = currPageY1 + originH;
                    //check snappable
                    let snapX = NaN, snapY = NaN;
                    let targetX, targetY;
                    let snapDirX, snapDirY;
                    if (!direction || direction === "v") {
                        each$1(snappable, (data) => {
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
                        each$1(snappable, (data) => {
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
                            x = snapX;
                        }
                        if (snapY) {
                            y = snapY;
                        }
                        if (onSnap && lastSnapping !== lastSnapDirX + "" + lastSnapDirY) {
                            setTimeout(() => {
                                //emit after relocate
                                onSnap({
                                    el: ghostNode || dragDom,
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
                        ox: offX,
                        oy: offY,
                        x: x,
                        y: y,
                        transform,
                    }, ev) === false) {
                        canDrag = false;
                        endX = x;
                        endY = y;
                    }
                }
                if (canDrag) {
                    if (direction === "v") {
                        transform.moveToY(y);
                    }
                    else if (direction === "h") {
                        transform.moveToX(x);
                    }
                    else {
                        transform.moveTo(x, y);
                    }
                    endX = x;
                    endY = y;
                }
            });
            onPointerEnd((args) => {
                var _a;
                const { ev, currentStyle } = args;
                if (scroll) {
                    if (timer) {
                        clearInterval(timer);
                        timer = null;
                    }
                }
                //restore classes
                dragDom.classList.remove(...compact(split(classes, " ")));
                currentStyle.zIndex = originalZIndex;
                dragDom.classList.remove(CLASS_DRAGGABLE_ACTIVE);
                let moveToGhost = true;
                if (onEnd) {
                    moveToGhost =
                        onEnd({ draggable: dragDom, x: endX, y: endY, transform }, ev) ===
                            false
                            ? false
                            : true;
                }
                //notify
                const customEv = new Event("uii-dragdeactive", {
                    bubbles: true,
                    cancelable: false,
                });
                dragDom.dispatchEvent(customEv);
                if (ghost) {
                    (_a = ghostNode.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(ghostNode);
                    if (moveToGhost !== false) {
                        wrapper(dragDom, opts.useTransform).moveTo(transform.x, transform.y);
                    }
                }
            });
        }, {
            threshold: this.opts.threshold || 0,
            lockPage: true,
        });
    }
    /**
     * @internal
     */
    onOptionChanged(opts) {
        const droppable = opts.droppable;
        if (!isFunction$2(droppable)) {
            if (isUndefined$1(droppable)) {
                opts.droppable = () => { };
            }
            else if (isString$2(droppable)) {
                opts.droppable = () => document.querySelectorAll(droppable);
            }
            else if (isArrayLike$2(droppable)) {
                opts.droppable = () => droppable;
            }
            else if (isElement(droppable)) {
                opts.droppable = () => [droppable];
            }
        }
    }
}
_Draggable_handleMap = new WeakMap(), _Draggable_container = new WeakMap(), _Draggable_instances = new WeakSet(), _Draggable_initStyle = function _Draggable_initStyle(draggableList) {
    each$1(draggableList, (el) => {
        if (isDefined(this.opts.type))
            el.dataset.dropType = this.opts.type;
        el.classList.toggle(CLASS_DRAGGABLE, true);
        const ee = __classPrivateFieldGet(this, _Draggable_handleMap, "f").get(el) || el;
        ee.classList.toggle(CLASS_DRAGGABLE_HANDLE, true);
        if (!isUndefined$1(this.opts.cursor)) {
            el.style.cursor = this.opts.cursor.default || "move";
            if (isDefined(this.opts.cursor.over)) {
                el.dataset.cursorOver = this.opts.cursor.over;
                el.dataset.cursorActive = this.opts.cursor.active || "move";
            }
        }
    });
};
/**
 * create a draggable pattern for one or more elements with opts
 * @param els selector string / html element
 * @param opts
 * @returns Draggable instance
 */
function newDraggable(els, opts) {
    return new Draggable(els, opts);
}

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
        super(el, assign({
            watch: true
        }, opts));
        _Droppable_active.set(this, void 0);
        Droppables.push(this);
    }
    /**
     * @internal
     */
    bindEvent(droppable, opts) {
        //dragenter
        this.registerEvent(droppable, "mouseenter", (e) => {
            if (!__classPrivateFieldGet(this, _Droppable_active, "f"))
                return;
            if (__classPrivateFieldGet(this, _Droppable_active, "f") === droppable)
                return;
            if (opts.hoverClass) {
                each$1(split(opts.hoverClass, ' '), cls => {
                    droppable.classList.toggle(cls, true);
                });
            }
            if (__classPrivateFieldGet(this, _Droppable_active, "f").dataset.cursorOver) {
                setCursor(__classPrivateFieldGet(this, _Droppable_active, "f").dataset.cursorOver);
            }
            opts.onEnter && opts.onEnter({ draggable: __classPrivateFieldGet(this, _Droppable_active, "f"), droppable }, e);
        });
        //dragleave
        this.registerEvent(droppable, "mouseleave", (e) => {
            if (!__classPrivateFieldGet(this, _Droppable_active, "f"))
                return;
            if (__classPrivateFieldGet(this, _Droppable_active, "f") === droppable)
                return;
            if (opts.hoverClass) {
                each$1(split(opts.hoverClass, ' '), cls => {
                    droppable.classList.toggle(cls, false);
                });
            }
            if (__classPrivateFieldGet(this, _Droppable_active, "f").dataset.cursorOver) {
                setCursor(__classPrivateFieldGet(this, _Droppable_active, "f").dataset.cursorActive || '');
            }
            opts.onLeave && opts.onLeave({ draggable: __classPrivateFieldGet(this, _Droppable_active, "f"), droppable }, e);
        });
        //dragover
        this.registerEvent(droppable, "mousemove", (e) => {
            if (!__classPrivateFieldGet(this, _Droppable_active, "f"))
                return;
            if (__classPrivateFieldGet(this, _Droppable_active, "f") === droppable)
                return;
            opts.onOver && opts.onOver({ draggable: __classPrivateFieldGet(this, _Droppable_active, "f"), droppable }, e);
        });
        //drop
        this.registerEvent(droppable, "mouseup", (e) => {
            if (!__classPrivateFieldGet(this, _Droppable_active, "f"))
                return;
            if (__classPrivateFieldGet(this, _Droppable_active, "f") === droppable)
                return;
            if (opts.hoverClass) {
                each$1(split(opts.hoverClass, ' '), cls => {
                    droppable.classList.toggle(cls, false);
                });
            }
            opts.onDrop && opts.onDrop({ draggable: __classPrivateFieldGet(this, _Droppable_active, "f"), droppable }, e);
        });
    }
    /**
     * @internal
     */
    active(target) {
        let valid = true;
        const opts = this.opts;
        if (opts.watch && this.eleString) {
            let nodes = document.querySelectorAll(this.eleString);
            this.ele = toArray$2(nodes);
        }
        //check accepts
        if (isString$2(opts.accepts)) {
            valid = !!target.dataset.dropType && test(opts.accepts, target.dataset.dropType);
        }
        else if (isFunction$2(opts.accepts)) {
            valid = opts.accepts(this.ele, target);
        }
        if (!valid)
            return;
        __classPrivateFieldSet(this, _Droppable_active, target, "f");
        if (opts.activeClass) {
            each$1(this.ele, el => {
                each$1(split(opts.activeClass || '', ' '), cls => {
                    el.classList.toggle(cls, true);
                });
            });
        }
        opts.onActive && opts.onActive({ draggable: target, droppables: this.ele });
        //bind events
        each$1(this.ele, (el) => {
            el.classList.toggle(CLASS_DROPPABLE, true);
            el.style.pointerEvents = 'initial';
            this.bindEvent(el, opts);
        });
    }
    /**
     * @internal
     */
    deactive(target) {
        if (!__classPrivateFieldGet(this, _Droppable_active, "f"))
            return;
        __classPrivateFieldSet(this, _Droppable_active, null, "f");
        const opts = this.opts;
        if (opts.activeClass) {
            each$1(this.ele, el => {
                each$1(split(opts.activeClass || '', ' '), cls => {
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
    each$1(Droppables, dpb => {
        dpb.active(e.target);
    });
});
document.addEventListener("uii-dragdeactive", (e) => {
    each$1(Droppables, dpb => {
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
        each$1(this.ele, (el) => {
            let tmp = el;
            if (tmp._uiik_rotatable) {
                tmp._uiik_rotatable.destroy();
                return false;
            }
        });
        each$1(this.ele, (el) => {
            el._uiik_rotatable = this;
            initHandle(this, el, this.opts);
        });
    }
}
function initHandle(uiik, el, opts) {
    let handleStr = opts.handle;
    let handles;
    if (isString$2(handleStr)) {
        handles = document.querySelectorAll(handleStr);
    }
    else if (isFunction$2(handleStr)) {
        handles = handleStr(el);
    }
    if (!handles) {
        console.error('Can not find handles with "' + el.outerHTML + '"');
        return;
    }
    each$1(handles, (h) => {
        var _a;
        h.classList.add(CLASS_ROTATABLE_HANDLE);
        h.style.cursor = ((_a = opts.cursor) === null || _a === void 0 ? void 0 : _a.default) || "crosshair";
        bindHandle(uiik, h, el, opts);
    });
    el.classList.toggle(CLASS_ROTATABLE, true);
}
function bindHandle(uiik, handle, el, opts) {
    const onStart = opts.onStart;
    const onRotate = opts.onRotate;
    const onEnd = opts.onEnd;
    let deg = 0;
    uiik.addPointerDown(handle, ({ onPointerStart, onPointerMove, onPointerEnd }) => {
        let centerX = 0, centerY = 0;
        let startOx = 0;
        let startOy = 0;
        let startDeg = 0;
        let container;
        let startPointXy;
        //bind events
        onPointerStart(function (args) {
            const { ev } = args;
            const { w, h } = getStyleSize(el);
            const { originX, originY } = parseOxy(opts.ox, opts.oy, w, h, el);
            startOx = originX;
            startOy = originY;
            let centerXy = getRectCenter(el);
            centerX = centerXy.x;
            centerY = centerXy.y;
            container = el.parentElement;
            startPointXy = getPointInContainer(ev, container);
            startDeg =
                Math.atan2(startPointXy.y - centerY, startPointXy.x - centerX) * ONE_RAD +
                    90;
            if (startDeg < 0)
                startDeg = 360 + startDeg;
            let matrixInfo = getMatrixInfo(el);
            startDeg -= matrixInfo.angle;
            //apply classes
            el.classList.toggle(CLASS_ROTATABLE_ACTIVE, true);
            onStart && onStart({ deg, cx: centerX, cy: centerY }, ev);
        });
        onPointerMove((args) => {
            const { ev, offX, offY } = args;
            let newX = startPointXy.x + offX;
            let newY = startPointXy.y + offY;
            deg =
                Math.atan2(newY - centerY, newX - centerX) * ONE_RAD +
                    90 -
                    startDeg;
            onRotate &&
                onRotate({
                    deg,
                    cx: centerX,
                    cy: centerY,
                    target: el,
                    ox: startOx,
                    oy: startOy,
                }, ev);
            rotateTo(el, deg, startOx, startOy);
        });
        onPointerEnd((args) => {
            const { ev } = args;
            el.classList.toggle(CLASS_ROTATABLE_ACTIVE, false);
            onEnd && onEnd({ deg }, ev);
        });
    }, {
        threshold: THRESHOLD,
        lockPage: true,
    });
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

var _CollisionDetector__targets;
class CollisionDetector {
    constructor(el, targets, opts) {
        _CollisionDetector__targets.set(this, void 0);
        __classPrivateFieldSet(this, _CollisionDetector__targets, targets, "f");
        this.opts = {
            container: document.body
        };
        this.opts = assign(this.opts, opts);
        const domEl = isString$2(el) ? document.querySelector(el) : el;
        if (!domEl) {
            console.error('Invalid selector "' + el + '"');
            return;
        }
        const ele = domEl;
        this.el = domEl;
        //el data
        const offset = getBox(ele, this.opts.container);
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
        if (isFunction$2(__classPrivateFieldGet(this, _CollisionDetector__targets, "f"))) {
            targets = __classPrivateFieldGet(this, _CollisionDetector__targets, "f").call(this);
        }
        else if (isString$2(__classPrivateFieldGet(this, _CollisionDetector__targets, "f"))) {
            targets = this.opts.container.querySelectorAll(__classPrivateFieldGet(this, _CollisionDetector__targets, "f"));
            targets = reject(targets, t => t === this.el);
        }
        else if (isElement(__classPrivateFieldGet(this, _CollisionDetector__targets, "f"))) {
            targets = [__classPrivateFieldGet(this, _CollisionDetector__targets, "f")];
        }
        else {
            targets = __classPrivateFieldGet(this, _CollisionDetector__targets, "f");
        }
        this.targetsData = flatMap(targets, t => {
            if (!t)
                return [];
            const rect = getRectInContainer(t, this.opts.container);
            return {
                x1: rect.x,
                y1: rect.y,
                x2: rect.x + rect.w,
                y2: rect.y + rect.h,
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

var _Selectable_instances, _Selectable__detector, _Selectable__lastSelected, _Selectable_bindEvent;
const CLASS_SELECTOR = "uii-selector";
const CLASS_SELECTING = "uii-selecting";
const CLASS_SELECTED = "uii-selected";
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
        let selector = document.createElement("div");
        if (domEl instanceof SVGElement) {
            selector = document.createElementNS('http://www.w3.org/2000/svg', "rect");
        }
        selector.setAttribute('class', CLASS_SELECTOR);
        selector.style.cssText = `
      position:absolute;
      left:0;top:0;
    `;
        if (this.opts.class) {
            selector.setAttribute('class', selector.getAttribute('class') + " " + this.opts.class);
        }
        else {
            selector.style.cssText += "border:1px dashed #000;stroke:#000;";
        }
        selector.style.display = 'none';
        domEl.appendChild(selector);
        //create detector
        __classPrivateFieldSet(this, _Selectable__detector, newCollisionDetector(selector, this.opts.targets, {
            container: domEl,
        }), "f");
        __classPrivateFieldGet(this, _Selectable_instances, "m", _Selectable_bindEvent).call(this, selector, domEl);
    }
    /**
     *  更新targets
     */
    updateTargets() {
        __classPrivateFieldGet(this, _Selectable__detector, "f").update();
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
    this.addPointerDown(con, ({ ev, target, currentRect, currentCStyle, currentTarget, onPointerStart, onPointerMove, onPointerEnd }) => {
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
            if (isFunction$2(filter)) {
                if (filter(target))
                    return true;
            }
            else if (some(con.querySelectorAll(filter), (el) => el.contains(target)))
                return true;
        }
        //检测
        const onPointerDown = opts.onPointerDown;
        if (onPointerDown && onPointerDown(ev) === false)
            return true;
        let originPos = "";
        let startPointXy = getPointInContainer(ev, con, currentRect, currentCStyle);
        let hitPosX = startPointXy.x;
        let hitPosY = startPointXy.y;
        const style = selector.style;
        let selection = [];
        let lastSelection = [];
        let x1 = hitPosX, y1 = hitPosY;
        let timer = null;
        let toLeft = false;
        let toTop = false;
        let toRight = false;
        let toBottom = false;
        //bind events
        onPointerStart(function (args) {
            const { ev } = args;
            //update targets count & positions
            __classPrivateFieldGet(that, _Selectable__detector, "f").update();
            //detect container position
            const pos = currentCStyle.position;
            if (pos === "static") {
                originPos = con.style.position;
                con.style.position = "relative";
            }
            //clear _lastSelected
            each$1(__classPrivateFieldGet(that, _Selectable__lastSelected, "f"), t => {
                target.classList.toggle(CLASS_SELECTED, false);
            });
            style.display = 'block';
            onStart && onStart({ selection: __classPrivateFieldGet(that, _Selectable__lastSelected, "f"), selectable: con }, ev);
        });
        onPointerMove(({ ev, offX, offY }) => {
            let pointX = startPointXy.x + offX;
            let pointY = startPointXy.y + offY;
            //edge detect
            if (scroll) {
                const ltX = ev.clientX - currentRect.x;
                const ltY = ev.clientY - currentRect.y;
                const rbX = currentRect.x + currentRect.width - ev.clientX;
                const rbY = currentRect.y + currentRect.height - ev.clientY;
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
            let x = hitPosX, y = hitPosY, w = Math.abs(offX), h = Math.abs(offY);
            if (offX > 0 && offY > 0) {
                x1 = hitPosX;
                y1 = hitPosY;
            }
            else if (offX < 0 && offY < 0) {
                x = x1 = pointX;
                y = y1 = pointY;
            }
            else if (offX < 0) {
                x = x1 = pointX;
            }
            else if (offY < 0) {
                y = y1 = pointY;
            }
            style.width = w + "px";
            style.height = h + "px";
            style.transform = `translate3d(${x}px,${y}px,0)`;
            //detect collision
            if (mode === "overlap") {
                selection = __classPrivateFieldGet(that, _Selectable__detector, "f").getOverlaps(x1, y1, x1 + w, y1 + h);
            }
            else if (mode === "inclusion") {
                selection = __classPrivateFieldGet(that, _Selectable__detector, "f").getInclusions(x1, y1, x1 + w, y1 + h);
            }
            each$1(lastSelection, (t) => {
                if (!includes(selection, t)) {
                    t.classList.toggle(CLASS_SELECTING, false);
                    each$1(selectingClassAry, (cls) => {
                        t.classList.toggle(cls, false);
                    });
                }
            });
            each$1(selection, (t) => {
                t.classList.toggle(CLASS_SELECTING, true);
                each$1(selectingClassAry, (cls) => {
                    t.classList.toggle(cls, true);
                });
            });
            const changed = lastSelection.length != selection.length;
            lastSelection = selection;
            if (changed && onSelect)
                onSelect({ selection, selectable: con }, ev);
        });
        onPointerEnd((args) => {
            const { ev, currentStyle } = args;
            style.display = 'none';
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
            each$1(selection, (t) => {
                each$1(selectingClassAry, (cls) => {
                    t.classList.toggle(cls, false);
                });
                each$1(selectedClassAry, (cls) => {
                    t.classList.toggle(cls, true);
                });
                t.classList.toggle(CLASS_SELECTING, false);
                t.classList.toggle(CLASS_SELECTED, true);
            });
            __classPrivateFieldSet(that, _Selectable__lastSelected, selection, "f");
            if (onEnd)
                onEnd({ selection, selectable: con }, ev);
        });
    }, {
        threshold: THRESHOLD,
        lockPage: true
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

/**
   * myfx/utils v1.1.0
   * A modular utility library with more utils, higher performance and simpler declarations ...
   * https://github.com/holyhigh2/myfx
   * (c) 2021-2023 @holyhigh2 may be freely distributed under the MIT license
   */
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'.split('');
/**
 * 生成一个指定长度的alphaId并返回。id内容由随机字母表字符组成
 * @example
 * // urN-k0mpetBwboeQ
 * console.log(_.alphaId())
 * // Ii6cPyfw-Ql5YC8OIhVwH1lpGY9x
 * console.log(_.alphaId(28))
 *
 * @param [len=16] id长度
 * @returns alphaId
 * @since 1.0.0
 */
function alphaId(len) {
    const bytes = self.crypto.getRandomValues(new Uint8Array(len || 16));
    let rs = '';
    bytes.forEach(b => rs += ALPHABET[b % ALPHABET.length]);
    return rs;
}

var _Sortable_removeListenItems;
const SORTABLE_GROUPS = {};
const CLASS_SORTABLE_CONTAINER = "uii-sortable-container";
const CLASS_SORTABLE_GHOST = "uii-sortable-ghost";
const CLASS_SORTABLE_ACTIVE = "uii-sortable-active";
const ATTR_SORTABLE_ACTIVE = "uii-sortable-active";
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
        each$1(this.ele, (el) => {
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
        const acceptFn = isFunction$2(moveFrom) ? moveFrom : () => !!moveFrom;
        //验证移入策略
        const activableContainers = flatMap(toContainers, (el) => {
            const valid = acceptFn(draggingItem, fromContainer, el);
            return valid ? el : [];
        });
        each$1(activableContainers, (el) => {
            el.setAttribute(ATTR_SORTABLE_ACTIVE, "1");
            if (toOpts.activeClass) {
                each$1(split(toOpts.activeClass || "", " "), (cls) => {
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
        each$1(toContainers, (el) => {
            el.removeAttribute(ATTR_SORTABLE_ACTIVE);
            if (opts.activeClass) {
                each$1(split(opts.activeClass || "", " "), (cls) => {
                    el.classList.toggle(cls, false);
                });
            }
        });
        each$1(__classPrivateFieldGet(this, _Sortable_removeListenItems, "f"), (fn) => {
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
            : toArray$2(filteredItems);
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
        const toOutFn = isFunction$2(moveTo) ? moveTo : () => !!moveTo;
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
                        each$1(SORTABLE_GROUPS[group], ([sortable, ele]) => {
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
                    each$1(SORTABLE_GROUPS[group], ([sortable, ele]) => {
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
            const acceptFn = isFunction$2(moveFrom) ? moveFrom : () => !!moveFrom;
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
    each$1(items, (item, i) => {
        item.style.position = "relative";
        if (item === draggingItem)
            return;
        item.style.pointerEvents = "initial";
        item._uiik_i = i;
        item.addEventListener("mouseenter", listener);
    });
    return () => {
        //解绑enter事件
        each$1(items, (item, i) => {
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

var version = "1.3.3";
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

export { CollisionDetector, DRAGGING_RULE, Draggable, Droppable, EDGE_THRESHOLD, ONE_ANG, ONE_RAD, Resizable, Rotatable, Selectable, Sortable, Splittable, THRESHOLD, Uii, UiiTransform, VERSION, calcVertex, index as default, getBox, getCenterXy, getCenterXySVG, getMatrixInfo, getPointInContainer, getPointOffset, getRectCenter, getRectInContainer, getStyleSize, getStyleXy, getTranslate, getVertex, isSVGEl, isVisible, lockPage, moveBy, moveTo, newCollisionDetector, newDraggable, newDroppable, newResizable, newRotatable, newSelectable, newSortable, newSplittable, normalizeVector, parseOxy, restoreCursor, rotateTo, saveCursor, setCursor, transformMoveTo, unlockPage, wrapper };
