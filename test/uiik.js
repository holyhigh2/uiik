/* uiik 1.3.3 @holyhigh2 https://github.com/holyhigh2/uiik */
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
function isUndefined$3(v) {
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
function isFunction$4(v) {
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
function isString$4(v) {
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
function isArray$4(v) {
    // 使用 instanceof Array 无法鉴别某些场景，比如
    // Array.prototype instanceof Array => false
    // Array.isArray(Array.prototype) => true
    // typeof new Proxy([],{}) => object
    // Array.isArray(new Proxy([],{})) => true
    return Array.isArray(v);
}

const PRIMITIVE_TYPES$4 = [
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
function isObject$4(v) {
    return null !== v && PRIMITIVE_TYPES$4.indexOf(typeof v) < 0;
}

function identity$3(v) {
    return v;
}

function toPath$1$3(path) {
    let chain = path;
    if (isArray$4(chain)) {
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
function get$3(obj, path, defaultValue) {
    if (!isObject$4(obj))
        return defaultValue;
    const chain = toPath$1$3(path);
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
function prop$2(path) {
    return (obj) => {
        return get$3(obj, path);
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
function toPath$3(path) {
    return toPath$1$3(path);
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
function isNil$3(v) {
    return v === null || v === undefined;
}

function eq$3(a, b) {
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
function isMatchWith$2(target, props, comparator = eq$3) {
    if (isNil$3(props))
        return true;
    const ks = Object.keys(props);
    if (!isObject$4(target))
        return false;
    let rs = true;
    for (let i = ks.length; i--;) {
        const k = ks[i];
        const v1 = target[k];
        const v2 = props[k];
        if (isObject$4(v1) && isObject$4(v2)) {
            if (!isMatchWith$2(v1, v2, comparator)) {
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
function isMatch$2(object, props) {
    return isMatchWith$2(object, props, eq$3);
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
function matcher$2(props) {
    return (obj) => {
        return isMatch$2(obj, props);
    };
}

function iteratee$2(value) {
    if (isUndefined$3(value)) {
        return identity$3;
    }
    else if (isFunction$4(value)) {
        return value;
    }
    else if (isString$4(value)) {
        return prop$2(value);
    }
    else if (isArray$4(value)) {
        return prop$2(toPath$3(value));
    }
    else if (isObject$4(value)) {
        return matcher$2(value);
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
function isArrayLike$4(v) {
    if (isString$4(v) && v.length > 0)
        return true;
    if (!isObject$4(v))
        return false;
    // 具有length属性
    const list = v;
    if (list.length !== undefined) {
        const proto = list.constructor.prototype;
        // NodeList/HTMLCollection/CSSRuleList/...
        if (isFunction$4(proto.item))
            return true;
        // arguments
        if (isFunction$4(list[Symbol.iterator]))
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
function isSet$3(v) {
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
function isMap$3(v) {
    return v instanceof Map;
}

function _eachIterator$2(collection, callback, forRight) {
    let values;
    let keys;
    if (isString$4(collection) || isArrayLike$4(collection)) {
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
    else if (isSet$3(collection)) {
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
    else if (isMap$3(collection)) {
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
    else if (isObject$4(collection)) {
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

function each$2(collection, callback) {
    _eachIterator$2(collection, callback, false);
}

function find$1(collection, predicate) {
    const callback = iteratee$2(predicate);
    let rs;
    each$2(collection, (v, k, c) => {
        const r = callback(v, k, c);
        if (r) {
            rs = v;
            return false;
        }
    });
    return rs;
}

function map$1(collection, itee) {
    const rs = [];
    const cb = iteratee$2(itee);
    each$2(collection, (v, k, c) => {
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
function keys$3(obj) {
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
function values$3(obj) {
    return keys$3(obj).map((k) => obj[k]);
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
function toArray$3(collection) {
    if (isArray$4(collection))
        return collection.concat();
    if (isFunction$4(collection))
        return [collection];
    if (isSet$3(collection)) {
        return Array.from(collection);
    }
    else if (isString$4(collection)) {
        return collection.split('');
    }
    else if (isArrayLike$4(collection)) {
        return Array.from(collection);
    }
    else if (isMap$3(collection)) {
        return Array.from(collection.values());
    }
    else if (isObject$4(collection)) {
        return values$3(collection);
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
function flat$1(array, depth = 1) {
    if (depth < 1)
        return array.concat();
    const rs = toArray$3(array).reduce((acc, val) => {
        return acc.concat(Array.isArray(val) && depth > 0 ? flat$1(val, depth - 1) : val);
    }, []);
    return rs;
}

function flatMap$1(collection, itee, depth) {
    return flat$1(map$1(collection, itee), depth || 1);
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
function slice$2(array, begin, end) {
    return toArray$3(array).slice(begin || 0, end);
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
function includes$1(collection, value, fromIndex) {
    let rs = false;
    fromIndex = fromIndex || 0;
    if (isString$4(collection)) {
        return collection.includes(value, fromIndex);
    }
    collection = isArrayLike$4(collection)
        ? slice$2(collection, fromIndex)
        : collection;
    each$2(collection, (v) => {
        if (eq$3(v, value)) {
            rs = true;
            return false;
        }
    });
    return rs;
}

function reject$1(collection, predicate) {
    const rs = [];
    const callback = iteratee$2(predicate);
    each$2(collection, (v, k, c) => {
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
function size$1(collection) {
    if (isNil$3(collection))
        return 0;
    if ((collection.length))
        return collection.length;
    if (isMap$3(collection) || isSet$3(collection))
        return collection.size;
    if (isObject$4(collection))
        return Object.keys(collection).length;
    return 0;
}

function some$1(collection, predicate) {
    let rs = false;
    const callback = iteratee$2(predicate || (() => true));
    each$2(collection, (v, k, c) => {
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
function isArray$3(v) {
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
function isString$3(v) {
    return typeof v === 'string' || v instanceof String;
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
function isBlank$1(v) {
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
function isBoolean$1(v) {
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
function isDefined$1(v) {
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
function isElement$1(v) {
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
function isEmpty$1(v) {
    if (null === v)
        return true;
    if (undefined === v)
        return true;
    if ('' === v)
        return true;
    if (0 === v)
        return true;
    if (isArrayLike$3(v) && v.length < 1)
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
function isNaN$2(v) {
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
function isNumber$1(v) {
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
function isUndefined$2(v) {
    return v === undefined;
}

/**
   * myfx/object v1.1.0
   * A modular utility library with more utils, higher performance and simpler declarations ...
   * https://github.com/holyhigh2/myfx
   * (c) 2021-2023 @holyhigh2 may be freely distributed under the MIT license
   */
  function identity$2(v) {
    return v;
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

function eachSources$1(target, sources, handler, afterHandler) {
    sources.forEach((src) => {
        if (!isObject$2(src))
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

function checkTarget$1(target) {
    if (target === null || target === undefined)
        return {};
    if (!isObject$2(target))
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
function assignWith$1(target, ...sources) {
    const rs = checkTarget$1(target);
    if (rs)
        return rs;
    let src = sources;
    const sl = sources.length;
    let handler = src[sl - 1];
    if (!handler || !handler.call) {
        handler = identity$2;
    }
    else {
        src = src.slice(0, sl - 1);
    }
    eachSources$1(target, src, handler, (v, sv, tv, k, s, t) => {
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
function assign$1(target, ...sources) {
    return assignWith$1(target, ...sources, identity$2);
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

function toPath$1$2(path) {
    let chain = path;
    if (isArray$2(chain)) {
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
    if (!isObject$2(obj))
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

function noop$1() {
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
function isSet$2(v) {
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
    if (isArray$2(collection))
        return collection.concat();
    if (isFunction$2(collection))
        return [collection];
    if (isSet$2(collection)) {
        return Array.from(collection);
    }
    else if (isString$2(collection)) {
        return collection.split('');
    }
    else if (isArrayLike$2(collection)) {
        return Array.from(collection);
    }
    else if (isMap$2(collection)) {
        return Array.from(collection.values());
    }
    else if (isObject$2(collection)) {
        return values$2(collection);
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
function concat$1(...arrays) {
    if (arrays.length < 1)
        return [];
    arrays = arrays.map((alk) => (isArrayLike$2(alk) ? toArray$2(alk) : alk));
    return toArray$2(arrays[0]).concat(...arrays.slice(1));
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
function mergeWith$1(target, ...sources) {
    const rs = checkTarget$1(target);
    if (rs)
        return rs;
    let src = sources;
    const sl = src.length;
    let handler = src[sl - 1];
    if (!isFunction$2(handler)) {
        handler = noop$1;
    }
    else {
        src = src.slice(0, sl - 1);
    }
    walkSources$1(target, src, handler, []);
    return target;
}
function walkSources$1(target, src, handler, stack) {
    eachSources$1(target, src, null, (v, sv, tv, k, s, t) => {
        const path = concat$1(stack, k);
        v = handler(sv, tv, k, s, t, path);
        if (v !== undefined) {
            t[k] = v;
        }
        else {
            if (isObject$2(tv) && !isFunction$2(tv)) {
                walkSources$1(tv, [sv], handler, path);
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
function merge$1(target, ...sources) {
    return mergeWith$1(target, ...sources, noop$1);
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
            parseFloat(get$2(el, "x.baseVal.value") || get$2(el, "cx.baseVal.value")) ||
                0;
        y =
            parseFloat(get$2(el, "y.baseVal.value") || get$2(el, "cy.baseVal.value")) ||
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
    if (!isNumber$1(x) || isNaN$2(x)) {
        return (`translateY(${y}${unit ? "px" : ""}) ` +
            transofrmStr.replace(/translateY\([^)]+?\)/, "").trim());
    }
    if (!isNumber$1(y) || isNaN$2(x)) {
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
                parseFloat(get$2(el, "x.baseVal.value") || get$2(el, "cx.baseVal.value")) ||
                    0;
            yVal =
                parseFloat(get$2(el, "y.baseVal.value") || get$2(el, "cy.baseVal.value")) ||
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
        let originPos = isDefined$1(cx) && isDefined$1(cy);
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
    const sheet = find$1(document.styleSheets, (ss) => !ss.href);
    if (!sheet) {
        document.head.appendChild(document.createElement("style"));
    }
    return sheet || find$1(document.styleSheets, (ss) => !ss.href);
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
    return map$1(originVertex, ({ x, y }) => {
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
    if (isString$3(ox)) {
        //percent
        originX = (parseFloat(ox) / 100) * w;
    }
    else if (isNumber$1(ox)) {
        originX = ox;
    }
    else if (el) {
        //origin
        if (!transformOrigin)
            transformOrigin = window.getComputedStyle(el).transformOrigin;
        const centerPair = transformOrigin.split(" ");
        originX = parseFloat(centerPair[0]);
    }
    if (isString$3(oy)) {
        //percent
        originY = (parseFloat(oy) / 100) * h;
    }
    else if (isNumber$1(oy)) {
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
        if (isArrayLike$3(ele) && !isString$3(ele)) {
            this.ele = map$1(ele, (el) => {
                let e = isString$3(el) ? document.querySelector(el) : el;
                if (!isElement$1(e)) {
                    console.error('Invalid element "' + el + '"');
                    return false;
                }
                return e;
            });
        }
        else {
            if (isString$3(ele)) {
                this.eleString = ele;
            }
            const el = isString$3(ele) ? document.querySelectorAll(ele) : ele;
            if (!isElement$1(el) && !isArrayLike$3(el)) {
                console.error('Invalid element "' + ele + '"');
                return;
            }
            this.ele = isArrayLike$3(el)
                ? toArray$3(el)
                : [el];
        }
    }
    /**
     * 销毁uii对象，包括卸载事件、清空元素等
     */
    destroy() {
        each$2(__classPrivateFieldGet(this, _Uii_listeners, "f"), (ev) => {
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
            const hasCursor = !isEmpty$1(get$2(uiiOptions, "cursor.active"));
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
        assign$1(this.opts, options);
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
        super(container, assign$1({
            handleSize: 10,
            minSize: 0,
            sticky: false,
            inside: false,
            ghost: false
        }, opts));
        _Splittable_instances.add(this);
        each$2(this.ele, con => {
            //detect container position
            const pos = window.getComputedStyle(con).position;
            if (pos === "static" || isBlank$1(pos)) {
                con.style.position = "relative";
            }
            con.classList.toggle(CLASS_SPLITTABLE, true);
            const handleDoms = con.querySelectorAll(this.opts.handle);
            const children = reject$1(con.children, c => {
                if (includes$1(handleDoms, c))
                    return true;
                return false;
            });
            const dir = __classPrivateFieldGet(this, _Splittable_instances, "m", _Splittable_checkDirection).call(this, con);
            con.classList.toggle(dir === 'v' ? CLASS_SPLITTABLE_V : CLASS_SPLITTABLE_H, true);
            const minSizeAry = map$1(children, (c, i) => {
                if (isArray$3(this.opts.minSize)) {
                    return this.opts.minSize[i] || 0;
                }
                else {
                    return this.opts.minSize;
                }
            });
            const stickyAry = map$1(children, (c, i) => {
                if (isArray$3(this.opts.sticky)) {
                    return this.opts.sticky[i] || false;
                }
                else {
                    return this.opts.sticky;
                }
            });
            if (isEmpty$1(handleDoms)) {
                const len = children.length - 1;
                for (let i = 0; i < len; i++) {
                    __classPrivateFieldGet(this, _Splittable_instances, "m", _Splittable_bindHandle).call(this, minSizeAry.slice(i, i + 2), stickyAry.slice(i, i + 2), this.opts, dir, children[i], children[i + 1]);
                }
            }
            else {
                each$2(handleDoms, (h, i) => {
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
    each$2(container.children, c => {
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
                    let ghostParent = ghostTo ? (isString$3(ghostTo) ? document.querySelector(ghostTo) : ghostTo) : currentTarget.parentNode;
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
        super(els, assign$1({
            handleSize: 8,
            minSize: 50,
            dir: ["n", "s", "e", "w", "ne", "nw", "se", "sw"],
            ghost: false,
            offset: 0,
        }, opts));
        each$2(this.ele, (el) => {
            let tmp = el;
            if (tmp._uiik_resizable) {
                tmp._uiik_resizable.destroy();
                return false;
            }
        });
        each$2(this.ele, (el) => {
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
            if (isArray$3(opts.minSize)) {
                minWidth = opts.minSize[0];
                minHeight = opts.minSize[1];
            }
            else if (isNumber$1(opts.minSize)) {
                minWidth = opts.minSize;
                minHeight = opts.minSize;
            }
            if (isArray$3(opts.maxSize)) {
                maxWidth = opts.maxSize[0];
                maxHeight = opts.maxSize[1];
            }
            else if (isNumber$1(opts.maxSize)) {
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
                    if (isFunction$3(ghost)) {
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
        if (isString$3(handleStr)) {
            handles = document.querySelectorAll(handleStr);
        }
        else if (isFunction$3(handleStr)) {
            handles = handleStr(panel);
        }
        if (!handles) {
            console.error('Can not find handles with "' + panel.outerHTML + '"');
            return;
        }
        handles = isArrayLike$3(handles) ? handles : [handles];
        each$2(handles, (h) => {
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
        if (isDefined$1(w))
            transform.el.setAttribute("width", w + "");
        if (isDefined$1(h))
            transform.el.setAttribute("height", h + "");
    }
    else {
        if (isDefined$1(w))
            style.width = w + "px";
        if (isDefined$1(h))
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
function isArray$1(v) {
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
function isFunction$1(v) {
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
function isSet$1(v) {
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
function isString$1(v) {
    return typeof v === 'string' || v instanceof String;
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

function identity$1(v) {
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
function compact$1(array) {
    return toArray$1(array).filter(identity$1);
}

function _eachIterator$1(collection, callback, forRight) {
    let values;
    let keys;
    if (isString$1(collection) || isArrayLike$1(collection)) {
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
    else if (isSet$1(collection)) {
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
    else if (isMap$1(collection)) {
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
    else if (isObject$1(collection)) {
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
        return get$1(obj, path);
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
    return toPath$1$1(path);
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

function eq$2(a, b) {
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
function isMatchWith$1(target, props, comparator = eq$2) {
    if (isNil$2(props))
        return true;
    const ks = Object.keys(props);
    if (!isObject$1(target))
        return false;
    let rs = true;
    for (let i = ks.length; i--;) {
        const k = ks[i];
        const v1 = target[k];
        const v2 = props[k];
        if (isObject$1(v1) && isObject$1(v2)) {
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
    return isMatchWith$1(object, props, eq$2);
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
    if (isUndefined$1(value)) {
        return identity$1;
    }
    else if (isFunction$1(value)) {
        return value;
    }
    else if (isString$1(value)) {
        return prop$1(value);
    }
    else if (isArray$1(value)) {
        return prop$1(toPath$2(value));
    }
    else if (isObject$1(value)) {
        return matcher$1(value);
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
function slice$1(array, begin, end) {
    return toArray$1(array).slice(begin || 0, end);
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
function findIndex$1(array, predicate, fromIndex) {
    let rs = -1;
    let fromIndexNum = fromIndex || 0;
    const itee = iteratee$1(predicate);
    each$1(slice$1(array, fromIndexNum), (v, k, c) => {
        const r = itee(v, k, c);
        if (r) {
            rs = k + fromIndexNum;
            return false;
        }
    });
    return rs;
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
function toString$1(v) {
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
function isRegExp$1(v) {
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
function split$1(str, separator, limit) {
    return toString$1(str).split(separator, limit);
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
function test$1(str, pattern, flags) {
    let regExp = pattern;
    if (!isRegExp$1(regExp)) {
        regExp = new RegExp(pattern, flags);
    }
    return regExp.test(str);
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
function closest$1(node, predicate, parentKey) {
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
        super(els, assign$1({
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
            each$2(this.ele, (el) => {
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
            if (isBoolean$1(this.opts.containment)) {
                __classPrivateFieldSet(this, _Draggable_container, isEmpty$1(this.ele) ? null : this.ele[0].parentElement, "f");
            }
            else if (isString$3(this.opts.containment)) {
                __classPrivateFieldSet(this, _Draggable_container, document.querySelector(this.opts.containment), "f");
            }
            else if (isElement$1(this.opts.containment)) {
                __classPrivateFieldSet(this, _Draggable_container, this.opts.containment, "f");
            }
        }
        if (this.opts.watch && this.eleString) {
            let con;
            if (isString$3(this.opts.watch)) {
                con = document.querySelector(this.opts.watch);
            }
            else {
                con = isEmpty$1(this.ele) ? null : this.ele[0].parentElement;
            }
            this.bindEvent(con || document.body, this.opts, __classPrivateFieldGet(this, _Draggable_handleMap, "f"));
        }
        else {
            each$2(this.ele, (el) => {
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
            let findRs = closest$1(t, (node) => includes$1(draggableList, node), "parentNode");
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
                if (some$1(dragDom.querySelectorAll(filter), (ele) => ele.contains(t)))
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
                    each$2(DRAGGER_GROUPS[group], (el) => {
                        const z = parseInt(currentCStyle.zIndex) || 0;
                        if (z > i)
                            i = z;
                    });
                    zIndex = i + 1;
                }
                const grid = opts.grid;
                if (isArray$3(grid)) {
                    gridX = grid[0];
                    gridY = grid[1];
                }
                else if (isNumber$1(grid)) {
                    gridX = gridY = grid;
                }
                if (snapOn) {
                    //获取拖动元素所在容器内的可吸附对象
                    snappable = map$1((container || document).querySelectorAll(snapOn), (el) => {
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
                    if (isFunction$3(ghost)) {
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
                        ghostNode.classList.add(...compact$1(split$1(ghostClass, " ")));
                    }
                    ghostNode.classList.add(...compact$1(split$1(classes, " ")));
                    ghostNode.classList.toggle(CLASS_DRAGGABLE_GHOST, true);
                    let ghostParent = ghostTo ? (isString$3(ghostTo) ? document.querySelector(ghostTo) : ghostTo) : dragDom.parentNode;
                    ghostParent === null || ghostParent === void 0 ? void 0 : ghostParent.appendChild(ghostNode);
                    transform = wrapper(ghostNode, opts.useTransform);
                    onClone && onClone({ clone: ghostNode }, ev);
                }
                else {
                    transform = wrapper(dragDom, opts.useTransform);
                }
                //apply classes
                dragDom.classList.add(...compact$1(split$1(classes, " ")));
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
                if (isNumber$1(gridX) && isNumber$1(gridY)) {
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
                        each$2(snappable, (data) => {
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
                        each$2(snappable, (data) => {
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
                dragDom.classList.remove(...compact$1(split$1(classes, " ")));
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
        if (!isFunction$3(droppable)) {
            if (isUndefined$2(droppable)) {
                opts.droppable = () => { };
            }
            else if (isString$3(droppable)) {
                opts.droppable = () => document.querySelectorAll(droppable);
            }
            else if (isArrayLike$3(droppable)) {
                opts.droppable = () => droppable;
            }
            else if (isElement$1(droppable)) {
                opts.droppable = () => [droppable];
            }
        }
    }
}
_Draggable_handleMap = new WeakMap(), _Draggable_container = new WeakMap(), _Draggable_instances = new WeakSet(), _Draggable_initStyle = function _Draggable_initStyle(draggableList) {
    each$2(draggableList, (el) => {
        if (isDefined$1(this.opts.type))
            el.dataset.dropType = this.opts.type;
        el.classList.toggle(CLASS_DRAGGABLE, true);
        const ee = __classPrivateFieldGet(this, _Draggable_handleMap, "f").get(el) || el;
        ee.classList.toggle(CLASS_DRAGGABLE_HANDLE, true);
        if (!isUndefined$2(this.opts.cursor)) {
            el.style.cursor = this.opts.cursor.default || "move";
            if (isDefined$1(this.opts.cursor.over)) {
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
        super(el, assign$1({
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
                each$2(split$1(opts.hoverClass, ' '), cls => {
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
                each$2(split$1(opts.hoverClass, ' '), cls => {
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
                each$2(split$1(opts.hoverClass, ' '), cls => {
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
            this.ele = toArray$3(nodes);
        }
        //check accepts
        if (isString$3(opts.accepts)) {
            valid = !!target.dataset.dropType && test$1(opts.accepts, target.dataset.dropType);
        }
        else if (isFunction$3(opts.accepts)) {
            valid = opts.accepts(this.ele, target);
        }
        if (!valid)
            return;
        __classPrivateFieldSet(this, _Droppable_active, target, "f");
        if (opts.activeClass) {
            each$2(this.ele, el => {
                each$2(split$1(opts.activeClass || '', ' '), cls => {
                    el.classList.toggle(cls, true);
                });
            });
        }
        opts.onActive && opts.onActive({ draggable: target, droppables: this.ele });
        //bind events
        each$2(this.ele, (el) => {
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
            each$2(this.ele, el => {
                each$2(split$1(opts.activeClass || '', ' '), cls => {
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
    each$2(Droppables, dpb => {
        dpb.active(e.target);
    });
});
document.addEventListener("uii-dragdeactive", (e) => {
    each$2(Droppables, dpb => {
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
        each$2(this.ele, (el) => {
            let tmp = el;
            if (tmp._uiik_rotatable) {
                tmp._uiik_rotatable.destroy();
                return false;
            }
        });
        each$2(this.ele, (el) => {
            el._uiik_rotatable = this;
            initHandle(this, el, this.opts);
        });
    }
}
function initHandle(uiik, el, opts) {
    let handleStr = opts.handle;
    let handles;
    if (isString$3(handleStr)) {
        handles = document.querySelectorAll(handleStr);
    }
    else if (isFunction$3(handleStr)) {
        handles = handleStr(el);
    }
    if (!handles) {
        console.error('Can not find handles with "' + el.outerHTML + '"');
        return;
    }
    each$2(handles, (h) => {
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
        this.opts = assign$1(this.opts, opts);
        const domEl = isString$3(el) ? document.querySelector(el) : el;
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
        if (isFunction$3(__classPrivateFieldGet(this, _CollisionDetector__targets, "f"))) {
            targets = __classPrivateFieldGet(this, _CollisionDetector__targets, "f").call(this);
        }
        else if (isString$3(__classPrivateFieldGet(this, _CollisionDetector__targets, "f"))) {
            targets = this.opts.container.querySelectorAll(__classPrivateFieldGet(this, _CollisionDetector__targets, "f"));
            targets = reject$1(targets, t => t === this.el);
        }
        else if (isElement$1(__classPrivateFieldGet(this, _CollisionDetector__targets, "f"))) {
            targets = [__classPrivateFieldGet(this, _CollisionDetector__targets, "f")];
        }
        else {
            targets = __classPrivateFieldGet(this, _CollisionDetector__targets, "f");
        }
        this.targetsData = flatMap$1(targets, t => {
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
        let overlaps = flatMap$1(this.targetsData, (td, i) => {
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
        let contains = flatMap$1(this.targetsData, (td, i) => {
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
        super(container, assign$1({
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
        const selectingClassAry = compact$1(split$1(opts.selectingClass, " "));
        const selectedClassAry = compact$1(split$1(opts.selectedClass, " "));
        //check filter
        if (filter) {
            if (isFunction$3(filter)) {
                if (filter(target))
                    return true;
            }
            else if (some$1(con.querySelectorAll(filter), (el) => el.contains(target)))
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
            each$2(__classPrivateFieldGet(that, _Selectable__lastSelected, "f"), t => {
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
            each$2(lastSelection, (t) => {
                if (!includes$1(selection, t)) {
                    t.classList.toggle(CLASS_SELECTING, false);
                    each$2(selectingClassAry, (cls) => {
                        t.classList.toggle(cls, false);
                    });
                }
            });
            each$2(selection, (t) => {
                t.classList.toggle(CLASS_SELECTING, true);
                each$2(selectingClassAry, (cls) => {
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
            each$2(selection, (t) => {
                each$2(selectingClassAry, (cls) => {
                    t.classList.toggle(cls, false);
                });
                each$2(selectedClassAry, (cls) => {
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
  const ALPHABET$1 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'.split('');
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
function alphaId$1(len) {
    const bytes = self.crypto.getRandomValues(new Uint8Array(len || 16));
    let rs = '';
    bytes.forEach(b => rs += ALPHABET$1[b % ALPHABET$1.length]);
    return rs;
}

/**
   * myfx v1.1.0
   * A modular utility library with more utils, higher performance and simpler declarations ...
   * https://github.com/holyhigh2/myfx
   * (c) 2021-2023 @holyhigh2 may be freely distributed under the MIT license
   */
  function _getGrouped(str) {
    return (str.match(/[A-Z]{2,}|([^\s-_]([^\s-_A-Z]+)?(?=[\s-_A-Z]))|([^\s-_]+(?=$))/g) || []);
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
    if (isNil(v))
        return '';
    if (v === 0 && 1 / v < 0)
        return '-0';
    return v.toString();
}

/**
 * 转换字符串第一个字符为大写并返回
 *
 * @example
 * //'First'
 * console.log(_.upperFirst('first'))//mixCase
 * //'GetMyURL'
 * console.log(_.upperFirst('getMyURL'))//camelCase
 *
 * @param str
 * @returns 返回新字符串
 */
function upperFirst(str) {
    str = toString(str);
    if (str.length < 1)
        return str;
    return str[0].toUpperCase() + str.substring(1);
}

/**
 * 返回帕斯卡风格的字符串
 *
 * @example
 * //'LoveLovesToLoveLove'
 * console.log(_.pascalCase('Love loves to love Love'))//spaces
 * //'ABC'
 * console.log(_.pascalCase('a B-c'))//mixCase
 * //'GetMyUrl'
 * console.log(_.pascalCase('getMyURL'))//camelCase
 * //'AbCdEf'
 * console.log(_.pascalCase('AB_CD_EF'))//snakeCase
 * //'ABcDEfGhXy'
 * console.log(_.pascalCase('aBc   D__EF_GH----XY_'))//mixCase
 *
 * @param str
 * @returns 返回新字符串
 */
function pascalCase(str) {
    return _getGrouped(toString(str)).reduce((acc, v) => acc + upperFirst(v.toLowerCase()), '');
}

/**
 * 转换字符串第一个字符为小写并返回
 *
 * @example
 * //'fIRST'
 * console.log(_.lowerFirst('FIRST'))//mixCase
 * //'love loves to love Love'
 * console.log(_.lowerFirst('Love loves to love Love'))//spaces
 *
 * @param str
 * @returns 返回新字符串
 */
function lowerFirst(str) {
    str = toString(str);
    if (str.length < 1)
        return str;
    return str[0].toLowerCase() + str.substring(1);
}

/**
 * 返回驼峰风格的字符串
 *
 * @example
 * //'aBC'
 * console.log(_.camelCase('a-b c'))//mixCase
 * //'loveLovesToLoveLove'
 * console.log(_.camelCase('Love loves to love Love'))//spaces
 * //'aBC'
 * console.log(_.camelCase('a B-c'))//camelCase
 * //'getMyUrl'
 * console.log(_.camelCase('getMyURL'))//camelCase
 *
 * @param str
 * @returns 返回新字符串
 */
function camelCase(str) {
    return lowerFirst(pascalCase(toString(str)));
}

/**
 * 把字符串的首字母大写，如果首字母不是ascii中的a-z则返回原值
 *
 * @example
 * //Abc
 * console.log(_.capitalize('abc'))
 * //''
 * console.log(_.capitalize(null))
 * //1
 * console.log(_.capitalize(1))
 *
 *
 * @param str 字符串
 * @returns 对于null/undefined会返回空字符串
 */
function capitalize(str) {
    str = toString(str);
    if (str.length < 1)
        return str;
    return str[0].toUpperCase() + toString(str.substring(1)).toLowerCase();
}

/**
 * 验证字符串是否以查询子字符串结尾
 *
 * @example
 * //true
 * console.log(_.endsWith('func.js','js'))
 * //true
 * console.log(_.endsWith('func.js','c',4))
 *
 * @param str
 * @param searchStr 查询字符串
 * @param position 索引
 * @returns 如果以查询子字符串开头返回true，否则返回false
 */
function endsWith(str, searchStr, position) {
    return toString(str).endsWith(searchStr, position);
}

const REG_EXP_KEYWORDS = [
    '\\',
    '$',
    '(',
    ')',
    '*',
    '+',
    '.',
    '[',
    ']',
    '?',
    '^',
    '{',
    '}',
    '|',
];
/**
 * 转义正则字符串中的特殊字符，包括 '\', '$', '(', ')', '*', '+', '.', '[', ']', '?', '^', '\{', '\}', '|'
 *
 * @example
 * //\^\[func\.js\] \+ \{crud-vue\} = \.\*\?\$
 * console.log(_.escapeRegExp('^[func.js] + {crud-vue} = .*?$'))
 *
 * @param str 需要转义的字符串
 * @returns 转义后的新字符串
 * @since 1.0.0
 */
function escapeRegExp(str) {
    return toString(str)
        .split('')
        .reduce((a, b) => a + (REG_EXP_KEYWORDS.includes(b) ? '\\' + b : b), '');
}

/**
 * 查找指定值在字符串中首次出现的位置索引
 *
 * @example
 * //10
 * console.log(_.indexOf('cyberfunc.js','js'))
 * //10
 * console.log(_.indexOf('cyberfunc.js','js',5))
 *
 * @param str
 * @param search 指定字符串
 * @param [fromIndex=0] 起始索引
 * @returns 第一个匹配搜索字符串的位置索引或-1
 */
function indexOf(str, search, fromIndex) {
    str = toString(str);
    return str.indexOf(search, fromIndex || 0);
}

/**
 * 返回所有字母是小写格式的字符串
 *
 * @example
 * //''
 * console.log(_.lowerCase())
 * //'func.js'
 * console.log(_.lowerCase('FUNC.JS'))
 *
 * @param str
 * @returns 返回新字符串
 */
function lowerCase(str) {
    return toString(str).toLowerCase();
}

/**
 * 返回短横线风格的字符串
 *
 * @example
 * //'a-b-c'
 * console.log(_.kebabCase('a_b_c'))//snakeCase
 * //'webkit-perspective-origin-x'
 * console.log(_.kebabCase('webkitPerspectiveOriginX'))//camelCase
 * //'a-b-c'
 * console.log(_.kebabCase('a B-c'))//mixCase
 * //'get-my-url'
 * console.log(_.kebabCase('getMyURL'))//camelCase
 *
 * @param str
 * @returns 返回新字符串
 */
function kebabCase(str) {
    return lowerCase(_getGrouped(toString(str)).join('-'));
}

/**
 * 查找指定值在字符串中最后出现的位置索引
 *
 * @example
 * //10
 * console.log(_.lastIndexOf('cyberfunc.js','js'))
 * //-1
 * console.log(_.lastIndexOf('cyberfunc.js','js',5))
 *
 * @param str
 * @param search 指定字符串
 * @param [fromIndex=Infinity] 起始索引，从起始索引位置向左查找指定字符串
 * @returns 最后一个匹配搜索字符串的位置索引或-1
 */
function lastIndexOf(str, search, fromIndex) {
    str = toString(str);
    return str.lastIndexOf(search, fromIndex || Infinity);
}

/**
 * 使用填充字符串填充原字符串达到指定长度。从原字符串末尾开始填充。
 *
 * @example
 * //100
 * console.log(_.padEnd('1',3,'0'))
 * //1-0-0-
 * console.log(_.padEnd('1',6,'-0'))
 * //1
 * console.log(_.padEnd('1',0,'-0'))
 *
 * @param str 原字符串
 * @param len 填充后的字符串长度，如果长度小于原字符串长度，返回原字符串
 * @param [padString=' '] 填充字符串，如果填充后超出指定长度，会自动截取并保留左侧字符串
 * @returns 在原字符串末尾填充至指定长度后的字符串
 */
function padEnd(str, len, padString) {
    str = toString(str);
    if (str.padEnd)
        return str.padEnd(len, padString);
    padString = padString || ' ';
    const diff = len - str.length;
    if (diff < 1)
        return str;
    let fill = '';
    let i = Math.ceil(diff / padString.length);
    while (i--) {
        fill += padString;
    }
    return str + fill.substring(0, diff);
}

/**
 * 使用填充字符串填充原字符串达到指定长度。从原字符串起始开始填充。
 *
 * @example
 * //001
 * console.log(_.padStart('1',3,'0'))
 *
 * @param str 原字符串。如果非字符串则会自动转换成字符串
 * @param len 填充后的字符串长度，如果长度小于原字符串长度，返回原字符串
 * @param [padString=' '] 填充字符串，如果填充后超出指定长度，会自动截取并保留右侧字符串
 * @returns 在原字符串起始填充至指定长度后的字符串
 */
function padStart(str, len, padString) {
    str = toString(str);
    if (str.padStart)
        return str.padStart(len, padString);
    padString = padString || ' ';
    const diff = len - str.length;
    if (diff < 1)
        return str;
    let fill = '';
    let i = Math.ceil(diff / padString.length);
    while (i--) {
        fill += padString;
    }
    return fill.substring(fill.length - diff, fill.length) + str;
}

/**
 * 使用字符0填充原字符串达到指定长度。从原字符串起始位置开始填充。
 *
 * @example
 * //001
 * console.log(_.padZ('1',3))
 *
 * @param str 原字符串
 * @param len 填充后的字符串长度
 * @returns 填充后的字符串
 */
function padZ(str, len) {
    return padStart(str, len, '0');
}

/**
 * 创建一个以原字符串为模板，重复指定次数的新字符串
 *
 * @example
 * //funcfuncfunc
 * console.log(_.repeat('func',3))
 *
 * @param str 原字符串
 * @param count 重复次数
 * @returns 对于null/undefined会返回空字符串
 */
function repeat(str, count) {
    str = toString(str);
    count = Number.isFinite(count) ? count : 0;
    if (count < 1)
        return '';
    if (str.repeat)
        return str.repeat(count);
    let i = count;
    let rs = '';
    while (i--) {
        rs += str;
    }
    return rs;
}

/**
 * 使用<code>replaceValue</code>替换<code>str</code>中的首个<code>searchValue</code>部分
 *
 * @example
 * //'func-js'
 * console.log(_.replace('func.js','.','-'))
 * //''
 * console.log(_.replace(null,'.','-'))
 * //'kelikeli'
 * console.log(_.replace('geligeli',/ge/g,'ke'))
 * //'geligeli'
 * console.log(_.replace('kelikeli',/ke/g,()=>'ge'))
 *
 * @param str 字符串。非字符串值会自动转换成字符串
 * @param searchValue 查找内容，正则或者字符串
 * @param replaceValue 替换内容，字符串或处理函数。函数的返回值将用于替换
 * @returns 替换后的新字符串
 */
function replace(str, searchValue, replaceValue) {
    return toString(str).replace(searchValue, replaceValue);
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

function replaceAll(str, searchValue, replaceValue) {
    let searchExp;
    let strRs = toString(str);
    if (isRegExp(searchValue)) {
        searchExp = searchValue;
        if (!searchValue.global) {
            searchExp = new RegExp(searchValue, searchValue.flags + 'g');
        }
        return strRs.replace(searchExp, replaceValue);
    }
    else if (isString(searchValue)) {
        searchExp = new RegExp(escapeRegExp(searchValue), 'g');
        return strRs.replace(searchExp, replaceValue);
    }
    else if (isObject(searchValue)) {
        const ks = Object.keys(searchValue);
        for (let i = ks.length; i--;) {
            const k = ks[i];
            const v = searchValue[k];
            searchExp = new RegExp(escapeRegExp(k), 'g');
            strRs = strRs.replace(searchExp, v);
        }
        return strRs;
    }
    return str;
}

/**
 * 返回下划线风格的字符串
 *
 * @example
 * //'a_b_c'
 * console.log(_.snakeCase('a-b c'))//mixCase
 * //'love_loves_to_love_love'
 * console.log(_.snakeCase('Love loves to love Love'))//spaces
 * //'a_b_c'
 * console.log(_.snakeCase('a B-c'))//camelCase
 * //'get_my_url'
 * console.log(_.snakeCase('getMyURL'))//camelCase
 *
 * @param str
 * @returns 返回新字符串
 */
function snakeCase(str) {
    return lowerCase(_getGrouped(toString(str)).join('_'));
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
 * 验证字符串是否以查询子字符串开头
 *
 * @example
 * //true
 * console.log(_.startsWith('func.js','func'))
 * //false
 * console.log(_.startsWith('func.js','func',3))
 * //true
 * console.log(_.startsWith('func.js','c',3))
 *
 * @param str
 * @param searchStr 查询字符串
 * @param [position=0] 索引
 * @returns 如果以查询子字符串开头返回true，否则返回false
 */
function startsWith(str, searchStr, position) {
    return toString(str).startsWith(searchStr, position);
}

/**
 * 对字符串进行截取，返回从起始索引到结束索引间的新字符串。
 *
 * @example
 * //"34567"
 * console.log(_.substring('12345678',2,7))
 * //"345678"
 * console.log(_.substring('12345678',2))
 * //""
 * console.log(_.substring())
 *
 * @param str 需要截取的字符串，如果非字符串对象会进行字符化处理。基本类型会直接转为字符值，对象类型会调用toString()方法
 * @param [indexStart=0] 起始索引，包含
 * @param [indexEnd=str.length] 结束索引，不包含
 * @returns
 */
function substring(str, indexStart, indexEnd) {
    str = toString(str);
    indexStart = indexStart || 0;
    return str.substring(indexStart, indexEnd);
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
 * 截取数字小数位。用来修复原生toFixed函数的bug
 *
 * @example
 * //14.05
 * console.log(_.toFixed(14.049,2))
 * //-15
 * console.log(_.toFixed(-14.6))
 * //14.0001
 * console.log(_.toFixed(14.00005,4))
 * //0.101
 * console.log(_.toFixed(0.1009,3))
 * //2.47
 * console.log(_.toFixed(2.465,2))
 * //2.46 原生
 * console.log((2.465).toFixed(2))
 *
 * @param v 数字或数字字符串
 * @param [scale=0] 小数位长度
 * @returns 填充后的字符串
 */
function toFixed(v, scale) {
    scale = scale || 0;
    const num = parseFloat(v + '');
    if (isNaN(num))
        return v;
    const isNeg = num < 0 ? -1 : 1;
    const tmp = (num + '').split('.');
    const frac = tmp[1] || '';
    const diff = scale - frac.length;
    let rs = '';
    if (diff > 0) {
        let z = padEnd(frac, scale, '0');
        z = z ? '.' + z : z;
        rs = tmp[0] + z;
    }
    else if (diff === 0) {
        rs = num + '';
    }
    else {
        let integ = parseInt(tmp[0]);
        const i = frac.length + diff;
        const round = frac.substring(i);
        let keep = frac.substring(0, i);
        let startZ = false;
        if (keep[0] === '0' && keep.length > 1) {
            keep = 1 + keep.substring(1);
            startZ = true;
        }
        let n = Math.round(parseFloat(keep + '.' + round));
        const strN = n + '';
        if (n > 0 && strN.length > keep.length) {
            integ += 1 * isNeg;
            n = strN.substring(1);
        }
        if (startZ) {
            n = parseInt(strN[0]) - 1 + strN.substring(1);
        }
        n = n !== '' && keep.length > 0 ? '.' + n : n;
        rs = integ + n + '';
        if (isNeg < 0 && rs[0] !== '-')
            rs = '-' + rs;
    }
    return rs;
}

/**
 * 从字符串的两端删除空白字符。
 *
 * @example
 * //holyhigh
 * console.log(_.trim('  holyhigh '))
 *
 * @param str
 * @returns 对于null/undefined会返回空字符串
 */
function trim(str) {
    str = toString(str);
    return str.trim();
}

/**
 * 从字符串末尾删除空白字符。
 *
 * @example
 * //'  holyhigh'
 * console.log(_.trimEnd('  holyhigh '))
 *
 * @param str
 * @returns 对于null/undefined会返回空字符串
 */
function trimEnd(str) {
    str = toString(str);
    if (str.trimEnd)
        return str.trimEnd();
    return str.replace(/\s*$/, '');
}

/**
 * 从字符串起始位置删除空白字符。
 *
 * @example
 * //'holyhigh '
 * console.log(_.trimStart('  holyhigh '))
 *
 * @param str
 * @returns 对于null/undefined会返回空字符串
 */
function trimStart(str) {
    str = toString(str);
    if (str.trimStart)
        return str.trimStart();
    return str.replace(/^\s*/, '');
}

/**
 * 对超过指定长度的字符串进行截取并在末尾追加代替字符
 *
 * @example
 * //func...
 * console.log(_.truncate('func.js',4))
 * //func...
 * console.log(_.truncate('func.js',6,{separator:/\.\w+/g}))
 * //func.js.com...
 * console.log(_.truncate('func.js.com.cn',13,{separator:'.'}))
 * //func.js
 * console.log(_.truncate('func.js',10))
 * //fun!!!
 * console.log(_.truncate('func.js',3,{omission:'!!!'}))
 *
 * @param str
 * @param len 最大长度。如果长度大于<code>str</code>长度，直接返回str
 * @param options 可选项
 * @param options.omission 替代字符，默认 '...'
 * @param options.separator 截断符。如果截取后的字符串中包含截断符，则最终只会返回截断符之前的内容
 * @returns 返回新字符串
 * @since 1.0.0
 */
function truncate(str, len, options) {
    str = toString(str);
    if (str.length <= len)
        return str;
    if (!isObject(options)) {
        options = { omission: '...' };
    }
    options.omission = options.omission || '...';
    str = str.substring(0, len);
    if (options.separator) {
        let separator = options.separator;
        if (!isObject(separator)) {
            separator = new RegExp(escapeRegExp(separator), 'g');
        }
        else if (!separator.global) {
            separator = new RegExp(separator, separator.flags + 'g');
        }
        let rs;
        let tmp;
        while ((tmp = separator.exec(str)) !== null) {
            rs = tmp;
        }
        if (rs) {
            str = str.substring(0, rs.index);
        }
    }
    return str + options.omission;
}

/**
 * 返回所有字母是大写格式的字符串
 *
 * @example
 * //''
 * console.log(_.upperCase())
 * //'FUNC.JS'
 * console.log(_.upperCase('func.js'))
 *
 * @param str
 * @returns 返回新字符串
 */
function upperCase(str) {
    return toString(str).toUpperCase();
}

var str = /*#__PURE__*/Object.freeze({
  __proto__: null,
  camelCase: camelCase,
  capitalize: capitalize,
  endsWith: endsWith,
  escapeRegExp: escapeRegExp,
  indexOf: indexOf,
  kebabCase: kebabCase,
  lastIndexOf: lastIndexOf,
  lowerCase: lowerCase,
  lowerFirst: lowerFirst,
  padEnd: padEnd,
  padStart: padStart,
  padZ: padZ,
  pascalCase: pascalCase,
  repeat: repeat,
  replace: replace,
  replaceAll: replaceAll,
  snakeCase: snakeCase,
  split: split,
  startsWith: startsWith,
  substring: substring,
  test: test,
  toFixed: toFixed,
  toString: toString,
  trim: trim,
  trimEnd: trimEnd,
  trimStart: trimStart,
  truncate: truncate,
  upperCase: upperCase,
  upperFirst: upperFirst
});

/**
 * 通过表达式格式化数字
 *
 * ```
 * #,##0.00 => 1,234.00
 * ```
 *
 * pattern解释：
 *
 * - `0` 如果对应位置上没有数字，则用零代替。用于整数位时在位数不足时补0，用于小数位时，如果超长会截取限位并四舍五入；如果位数不足则补0
 * - `#` 如果对应位置上没有数字，不显示。用于整数位时在位数不足时原样显示，用于小数位时，如果超长会截取限位并四舍五入；如果位数不足原样显示
 * - `.` 小数分隔符，只能出现一个
 * - `,` 分组符号，如果出现多个分组符号，以最右侧为准
 * - `%` 后缀符号，数字乘100，并追加%
 * - `\u2030` 后缀符号，数字乘1000，并追加‰
 * - `E` 后缀符号，转为科学计数法格式
 *
 * @example
 * //小数位截取时会自动四舍五入
 * console.log(_.formatNumber(123.678,'0.00'))
 * //在整数位中，0不能出现在#左侧；在小数位中，0不能出现在#右侧。
 * console.log(_.formatNumber(12.1,'0##.#0')) //格式错误，返回原值
 * //当有分组出现时，0只会影响短于表达式的数字
 * console.log(_.formatNumber(12.1,',000.00'))//012.10
 * console.log(_.formatNumber(1234.1,',000.00'))//1,234.10
 * //非表达式字符会原样保留
 * console.log(_.formatNumber(1234.1,'￥,000.00元'))//￥1,234.10元
 * //转为科学计数法
 * console.log(_.formatNumber(-0.01234,'##.0000E'))//-1.2340e-2
 * //#号在小数位中会限位，整数位中不会
 * console.log(_.formatNumber(123.456,'#.##'))//123.46
 *
 * @param v 需要格式化的值，可以是数字或字符串类型
 * @param [pattern='#,##0.00'] 格式化模式
 *
 * @returns 格式化后的字符串或原始值字符串(如果格式无效时)或特殊值(Infinity\u221E、NaN\uFFFD)
 */
function formatNumber(v, pattern = '#,##0.00') {
    if (v === Infinity)
        return '\u221E';
    if (v === -Infinity)
        return '-\u221E';
    if (Number.isNaN(v))
        return '\uFFFD';
    if (isNaN(parseFloat(v + '')))
        return v + '';
    let formatter = cache$1[pattern];
    if (!formatter) {
        const match = pattern.match(/(?<integer>[0,#]+)(?:\.(?<fraction>[0#]+))?(?<suffix>[%\u2030E])?/);
        if (match == null) {
            return v + '';
        }
        let integerPtn = match.groups?.integer || '';
        const fractionPtn = match.groups?.fraction || '';
        let suffix = match.groups?.suffix || '';
        if (!integerPtn ||
            integerPtn.indexOf('0#') > -1 ||
            fractionPtn.indexOf('#0') > -1)
            return v + '';
        const ptnPart = match[0];
        const endsPart = pattern.split(ptnPart);
        const rnd = true; // round
        const isPercentage = suffix === '%';
        const isPermillage = suffix === '\u2030';
        const isScientific = suffix === 'E';
        const groupMatch = integerPtn.match(/,[#0]+$/);
        let groupLen = -1;
        if (groupMatch) {
            groupLen = groupMatch[0].substring(1).length;
            integerPtn = integerPtn.replace(/^.*,(?=[^,])/, '');
        }
        let zeroizeLen = integerPtn.indexOf('0');
        if (zeroizeLen > -1) {
            zeroizeLen = integerPtn.length - zeroizeLen;
        }
        let fixedLen = Math.max(fractionPtn.lastIndexOf('0'), fractionPtn.lastIndexOf('#'));
        if (fixedLen > -1) {
            fixedLen += 1;
        }
        formatter = (val) => {
            const num = parseFloat(val + '');
            let number = num;
            let exponent = 0;
            if (isPercentage) {
                number = number * 100;
            }
            else if (isPermillage) {
                number = number * 1000;
            }
            else if (isScientific) {
                const str = number + '';
                const pair = str.split('.');
                if (number >= 1) {
                    exponent = pair[0].length - 1;
                }
                else if (number < 1) {
                    const fraStr = pair[1];
                    exponent = fraStr.replace(/^0+/, '').length - fraStr.length - 1;
                }
                number = number / 10 ** exponent;
            }
            const numStr = number + '';
            let integer = parseInt(numStr);
            const pair = numStr.split('.');
            const fraction = pair[1] || '';
            // 处理小数
            let dStr = '';
            if (fractionPtn) {
                if (fraction.length >= fixedLen) {
                    dStr = parseFloat('0.' + fraction).toFixed(fixedLen);
                    dStr = dStr.substring(1);
                }
                else {
                    dStr =
                        '.' +
                            fractionPtn.replace(/[0#]/g, (tag, i) => {
                                const l = fraction[i];
                                return l == undefined ? (tag === '0' ? '0' : '') : l;
                            });
                }
                if (dStr.length < 2) {
                    dStr = '';
                }
            }
            else {
                let carry = 0;
                if (fraction && rnd) {
                    carry = Math.round(parseFloat('0.' + fraction));
                }
                integer += carry;
            }
            // 处理整数
            let iStr = integer + '';
            let sym = num < 0 ? '-' : '';
            if (iStr[0] === '-' || iStr[0] === '+') {
                sym = iStr[0];
                iStr = iStr.substring(1);
            }
            if (groupLen > -1 && iStr.length > groupLen) {
                const reg = new RegExp('\\B(?=(\\d{' + groupLen + '})+$)', 'g');
                iStr = iStr.replace(reg, ',');
            }
            else if (iStr.length < integerPtn.length) {
                const integerPtnLen = integerPtn.length;
                const iStrLen = iStr.length;
                iStr = integerPtn.replace(/[0#]/g, (tag, i) => {
                    if (integerPtnLen - i > iStrLen)
                        return tag === '0' ? '0' : '';
                    const l = iStr[iStrLen - (integerPtnLen - i)];
                    return l == undefined ? (tag === '0' ? '0' : '') : l;
                });
            }
            // 合并
            if (isScientific) {
                suffix = 'e' + exponent;
            }
            let rs = sym + iStr + dStr + suffix;
            return (endsPart[0] || '') + rs + (endsPart[1] || '');
        };
    }
    return formatter(v);
}
const cache$1 = {};

/**
 * 转换任何对象为数字类型
 *
 * @example
 * //NaN
 * console.log(_.toNumber(null))
 * //1
 * console.log(_.toNumber('1'))
 * //NaN
 * console.log(_.toNumber([3,6,9]))
 * //-0
 * console.log(_.toNumber(-0))
 * //NaN
 * console.log(_.toNumber(NaN))
 * //NaN
 * console.log(_.toNumber('123a'))
 *
 * @param v 任何值
 * @returns 对于null/undefined会返回NaN
 */
function toNumber(v) {
    if (v === undefined || v === null)
        return NaN;
    return Number(v);
}

/**
 * 判断a是否大于b
 *
 * @example
 * //true
 * console.log(_.gt(2,1))
 * //false
 * console.log(_.gt(5,'5'))
 *
 * @param a
 * @param b
 * @returns
 * @since 1.0.0
 */
function gt(a, b) {
    return toNumber(a) > toNumber(b);
}

/**
 * 判断a是否大于等于b
 *
 * @example
 * //true
 * console.log(_.gte(2,1))
 * //true
 * console.log(_.gte(5,'5'))
 * //false
 * console.log(_.gte(5,'b'))
 *
 * @param a
 * @param b
 * @returns
 * @since 1.0.0
 */
function gte(a, b) {
    return toNumber(a) >= toNumber(b);
}

/**
 * 判断a是否小于b
 *
 * @example
 * //true
 * console.log(_.lt(1,2))
 * //false
 * console.log(_.lt(5,'5'))
 *
 * @param a
 * @param b
 * @returns
 * @since 1.0.0
 */
function lt(a, b) {
    return toNumber(a) < toNumber(b);
}

function inRange(v, start, end) {
    start = start || 0;
    if (end === undefined) {
        end = start;
        start = 0;
    }
    if (start > end) {
        const tmp = end;
        end = start;
        start = tmp;
    }
    return gte(v, start) && lt(v, end);
}

/**
 * 判断a是否小于等于b
 *
 * @example
 * //true
 * console.log(_.lte(1,2))
 * //true
 * console.log(_.lte(5,'5'))
 * //false
 * console.log(_.lte(5,'b'))
 *
 * @param a
 * @param b
 * @returns
 * @since 1.0.0
 */
function lte(a, b) {
    return toNumber(a) <= toNumber(b);
}

/**
 * 转换整数。小数部分会直接丢弃
 *
 * @example
 * //9
 * console.log(_.toInteger(9.99))
 * //12
 * console.log(_.toInteger('12.34'))
 * //0
 * console.log(_.toInteger(null))
 * //0
 * console.log(_.toInteger(new Error))
 *
 * @param v
 * @returns
 * @since 1.0.0
 */
function toInteger(v) {
    if (v === null || v === undefined)
        return 0;
    return parseInt(v);
}

var num = /*#__PURE__*/Object.freeze({
  __proto__: null,
  formatNumber: formatNumber,
  gt: gt,
  gte: gte,
  inRange: inRange,
  lt: lt,
  lte: lte,
  toInt: toInteger,
  toInteger: toInteger,
  toNumber: toNumber
});

const TIME_MAP$1 = {
    s: 1000,
    m: 1000 * 60,
    h: 1000 * 60 * 60,
    d: 1000 * 60 * 60 * 24,
};
/**
 * 对日期时间进行量变处理
 *
 * @example
 * //2020/5/1 08:00:20
 * console.log(_.formatDate(_.addTime(new Date('2020-05-01'),20),'yyyy/MM/dd hh:mm:ss'))
 * //2020-04-11 08:00
 * console.log(_.formatDate(_.addTime(new Date('2020-05-01'),-20,'d')))
 * //2022-01-01 00:00
 * console.log(_.formatDate(_.addTime(new Date('2020-05-01 0:0'),20,'M')))
 *
 * @param date 原日期时间
 * @param amount 变化量，可以为负数
 * @param [type='s'] 量变时间类型
 * <ul>
 * <li><code>y</code> 年</li>
 * <li><code>M</code> 月</li>
 * <li><code>d</code> 日</li>
 * <li><code>h</code> 时</li>
 * <li><code>m</code> 分</li>
 * <li><code>s</code> 秒</li>
 * </ul>
 * @returns 日期对象
 */
function addTime(date, amount, type) {
    type = type || 's';
    const d = new Date(date);
    switch (type) {
        case 'y':
            d.setFullYear(d.getFullYear() + amount);
            break;
        case 'M':
            d.setMonth(d.getMonth() + amount);
            break;
        default:
            let times = 0;
            times = amount * TIME_MAP$1[type];
            d.setTime(d.getTime() + times);
    }
    return d;
}

const TIME_MAP = {
    s: 1000,
    m: 1000 * 60,
    h: 1000 * 60 * 60,
    d: 1000 * 60 * 60 * 24,
};
// const DATE_CONVERT_EXP = /(\d+)-(\d+)-(\d+)/;
/**
 * 比较两个日期，并返回由比较时间单位确定的相差时间。
 * <p>
 * 使用truncated对比算法 —— 小于指定时间单位的值会被视为相同，
 * 比如对比月，则两个日期的 日/时/分/秒 会被认为相同，以此类推。
 * </p>
 * 相差时间为正数表示date1日期晚于(大于)date2，负数相反，0表示时间/日期相同。
 * <p>
 * 注意，如果对比单位是 h/m/s，务必要保持格式一致，比如
 *
 * ```ts
 * //实际相差8小时
 * new Date('2020-01-01')
 * //vs
 * new Date('2020/01/01')
 * ```
 *
 * @example
 * //0
 * console.log(_.compareDate(new Date('2020/05/01'),'2020/5/1'))
 * //格式不一致，相差8小时
 * console.log(_.compareDate(new Date('2020-05-01'),'2020/5/1','h'))
 * //-59
 * console.log(_.compareDate(new Date('2019/01/01'),'2019/3/1'))
 *
 * @param date1 日期对象、时间戳或合法格式的日期时间字符串。
 * 对于字符串格式，可以时<a href="https://www.iso.org/iso-8601-date-and-time-format.html">UTC格式</a>，或者
 * <a href="https://tools.ietf.org/html/rfc2822#section-3.3">RFC2822</a>格式
 * @param date2 同date1
 * @param [type='d'] 比较时间单位
 * <ul>
 * <li><code>y</code> 年</li>
 * <li><code>M</code> 月</li>
 * <li><code>d</code> 日</li>
 * <li><code>h</code> 时</li>
 * <li><code>m</code> 分</li>
 * <li><code>s</code> 秒</li>
 * </ul>
 * @returns 根据比较时间单位返回的比较值。正数为date1日期晚于(大于)date2，负数相反，0表示相同。
 */
function compareDate(date1, date2, type) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    type = type || 'd';
    if (type === 'y') {
        return d1.getFullYear() - d2.getFullYear();
    }
    else if (type === 'M') {
        return ((d1.getFullYear() - d2.getFullYear()) * 12 +
            (d1.getMonth() - d2.getMonth()));
    }
    else {
        switch (type) {
            case 'd':
                d1.setHours(0, 0, 0, 0);
                d2.setHours(0, 0, 0, 0);
                break;
            case 'h':
                d1.setHours(d1.getHours(), 0, 0, 0);
                d2.setHours(d2.getHours(), 0, 0, 0);
                break;
            case 'm':
                d1.setHours(d1.getHours(), d1.getMinutes(), 0, 0);
                d2.setHours(d2.getHours(), d2.getMinutes(), 0, 0);
                break;
        }
        const diff = d1.getTime() - d2.getTime();
        return diff / TIME_MAP[type];
    }
}

/**
 * 判断值是不是一个整数
 *
 * @example
 * //true
 * console.log(_.isInteger(-0))
 * //true
 * console.log(_.isInteger(5.0))
 * //false
 * console.log(_.isSafeInteger(5.000000000000001))
 * //true
 * console.log(_.isSafeInteger(5.0000000000000001))
 * //false
 * console.log(_.isInteger('5'))
 * //true
 * console.log(_.isInteger(Number.MAX_SAFE_INTEGER))
 * //true
 * console.log(_.isInteger(Number.MAX_VALUE))
 *
 * @param v
 * @returns
 */
function isInteger(v) {
    return Number.isInteger(v);
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
function isArray(v) {
    // 使用 instanceof Array 无法鉴别某些场景，比如
    // Array.prototype instanceof Array => false
    // Array.isArray(Array.prototype) => true
    // typeof new Proxy([],{}) => object
    // Array.isArray(new Proxy([],{})) => true
    return Array.isArray(v);
}

/**
 * 通过指定参数得到日期对象。支持多种签名
 *
 * ```js
 * _.toDate(1320940800); //timestamp unix style
 * _.toDate(1320940800123); //timestamp javascript style
 * _.toDate([year,month,day]); //注意，month的索引从1开始
 * _.toDate([year,month,day,hour,min,sec]); //注意，month的索引从1开始
 * _.toDate(datetimeStr);
 * ```
 *
 * @example
 * //'2011/11/11 00:00:00'
 * console.log(_.toDate(1320940800).toLocaleString())
 * //'2011/11/11 00:01:39'
 * console.log(_.toDate(1320940899999).toLocaleString())
 * //'2022/12/12 00:00:00'
 * console.log(_.toDate([2022,11,12]).toLocaleString())
 * //'2022/12/12 12:12:12'
 * console.log(_.toDate([2022,11,12,12,12,12]).toLocaleString())
 * //'2022/2/2 00:00:00'
 * console.log(_.toDate('2022/2/2').toLocaleString())
 * //'2022/2/2 08:00:00'
 * console.log(_.toDate('2022-02-02').toLocaleString())
 *
 * @param value 转换参数
 *
 * @returns 转换后的日期。无效日期统一返回1970/1/1
 */
function toDate(value) {
    let rs;
    if (isInteger(value)) {
        if (value < TIMESTAMP_MIN) {
            value = toNumber(padEnd(value + '', 13, '0'));
        }
        else if (value > TIMESTAMP_MAX) {
            value = 0;
        }
        rs = new Date(value);
    }
    else if (isArray(value)) {
        rs = new Date(...value);
    }
    else {
        rs = new Date(value);
    }
    if (rs.toDateString() === 'Invalid Date') {
        rs = new Date(0);
    }
    return rs;
}
const TIMESTAMP_MIN = 1000000000000;
const TIMESTAMP_MAX = 9999999999999;

/**
 * 指定日期是否是闰年
 * @param date 日期对象
 * @returns {number} 闰年返回true
 */
function isLeapYear(date) {
    date = toDate(date);
    const year = date.getFullYear();
    return year % 400 === 0 || year % 4 === 0;
}

const DaysOfMonth = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
/**
 * 获取指定日期在当前年中的天数并返回
 * @param date 日期对象
 * @returns {number} 当前年中的第几天
 */
function getDayOfYear(date) {
    date = toDate(date);
    const leapYear = isLeapYear(date);
    const month = date.getMonth();
    let dates = date.getDate();
    for (let i = 0; i < month; i++) {
        const ds = DaysOfMonth[i] || (leapYear ? 29 : 28);
        dates += ds;
    }
    return dates;
}

/**
 * 获取指定日期在当前月中的周数并返回
 * @param date 日期对象
 * @returns {number} 当前月中的第几周
 */
function getWeekOfMonth(date) {
    date = toDate(date);
    const year = date.getFullYear();
    let firstDayOfMonth = new Date(year, date.getMonth(), 1);
    let extraWeek = 0;
    //超过周5多1周
    let d = firstDayOfMonth.getDay();
    if (d === 0 || d > 5) {
        extraWeek = 1;
    }
    return Math.ceil(date.getDate() / 7) + extraWeek;
}

/**
 * 获取指定日期在当前年中的周数并返回
 * @param date 日期对象
 * @returns {number} 当前年中的第几周
 */
function getWeekOfYear(date) {
    date = toDate(date);
    const year = date.getFullYear();
    let firstDayOfYear = new Date(year, 0, 1);
    let extraWeek = 0;
    //超过周5多1周
    let d = firstDayOfYear.getDay();
    if (d === 0 || d > 5) {
        extraWeek = 1;
    }
    return Math.ceil(getDayOfYear(date) / 7) + extraWeek;
}

const INVALID_DATE = '';
const SearchExp = /y{2,4}|M{1,3}|d{1,4}|h{1,2}|m{1,2}|s{1,2}|Q{1,2}|E{1,2}|W{1,2}|w{1,2}/gm;
const pad0 = (str) => str.length > 1 ? '' : '0' + str;
const pad00 = (str) => str.length > 2 ? '' : (str.length > 1 ? '0' + str : '00' + str);
/**
 * 通过表达式格式化日期时间
 *
 * ```
 * yyyy-MM-dd hh:mm:ss => 2020-12-11 10:09:08
 * ```
 *
 * pattern解释：
 *
 * - `yy` 2位年 - 22
 * - `yyyy` 4位年 - 2022
 * - `M` 1位月(1-12)
 * - `MM` 2位月(01-12)
 * - `MMM` 月描述(一月 - 十二月)
 * - `d` 1位日(1-30/31/29/28)
  - `dd` 2位日(01-30/31/29/28)
  - `ddd` 一年中的日(1-365)
  - `dddd` 一年中的日(001-365)
  - `h` 1位小时(0-23)
  - `hh` 2位小时(00-23)
  - `m` 1位分钟(0-59)
  - `mm` 2位分钟(00-59)
  - `s` 1位秒(0-59)
  - `ss` 2位秒(00-59)
  - `Q` 季度(1-4)
  - `QQ` 季度描述(春-冬)
  - `W` 一年中的周(1-53)
  - `WW` 一年中的周(01-53)
  - `w` 一月中的周(1-6)
  - `ww` 一月中的周描述(第一周 - 第六周)
  - `E` 星期(1-7)
  - `EE` 星期描述(星期一 - 星期日)
 *
 * @example
 * //now time
 * console.log(_.formatDate(_.now(),'yyyy-MM-dd hh:mm'))
 * //2/1/2021
 * console.log(_.formatDate('2021-2-1','M/d/yyyy'))
 * //2/1/21
 * console.log(_.formatDate('2021-2-1','M/d/yy'))
 * //02/01/21
 * console.log(_.formatDate('2021-2-1','MM/dd/yy'))
 * //02/01/2021
 * console.log(_.formatDate('2021-2-1','MM/dd/yyyy'))
 * //21/02/01
 * console.log(_.formatDate('2021-2-1','yy/MM/dd'))
 * //2021-02-01
 * console.log(_.formatDate('2021-2-1','yyyy-MM-dd'))
 * //21-12-11 10:09:08
 * console.log(_.formatDate('2021-12-11T10:09:08','yy-MM-dd hh:mm:ss'))
 * //12/11/2020 1009
 * console.log(_.formatDate('2020-12-11 10:09:08','MM/dd/yyyy hhmm'))
 * //2020-12-11 08:00
 * console.log(_.formatDate(1607644800000))
 * //''
 * console.log(_.formatDate('13:02'))
 * //''
 * console.log(_.formatDate(null))
 * //现在时间:(20-12-11 10:09:08)
 * console.log(_.formatDate('2020-12-11 10:09:08','现在时间:(yy-MM-dd hh:mm:ss)'))
 *
 * @param val 需要格式化的值，可以是日期对象或时间字符串或日期毫秒数
 * @param [pattern='yyyy-MM-dd hh:mm:ss'] 格式化模式
 * @returns 格式化后的日期字符串，无效日期返回空字符串
 */
function formatDate(val, pattern) {
    pattern = pattern || 'yyyy-MM-dd hh:mm:ss';
    let formatter = cache[pattern];
    if (!formatter) {
        formatter = (date) => {
            if (!date)
                return INVALID_DATE;
            let ptn = pattern + '';
            if (typeof date === 'string' || typeof date === 'number') {
                date = toDate(date);
            }
            if (date.toString().indexOf('Invalid') > -1)
                return INVALID_DATE;
            let valDate = date;
            return ptn.replace(SearchExp, (tag) => {
                const cap = tag[0];
                const month = valDate.getMonth();
                const locale = Locale[Lang];
                if (cap === 'y') {
                    const year = valDate.getFullYear();
                    return tag === 'yy' ? (year % 100) + '' : year + '';
                }
                else if (cap === 'M') {
                    switch (tag) {
                        case 'M':
                            return month + 1 + '';
                        case 'MM':
                            return pad0(month + 1 + '');
                        case 'MMM':
                            return locale?.months[month] || tag;
                    }
                }
                else if (cap == 'd') {
                    let dayOfMonth = valDate.getDate();
                    switch (tag) {
                        case 'd':
                            return dayOfMonth + '';
                        case 'dd':
                            return pad0(dayOfMonth + '');
                        case 'ddd':
                            return getDayOfYear(valDate) + '';
                        case 'dddd':
                            return pad00(getDayOfYear(valDate) + '');
                    }
                }
                else if (cap == 'h') {
                    const val = valDate.getHours() + '';
                    return tag.length > 1 ? pad0(val) : val;
                }
                else if (cap == 'm') {
                    const val = valDate.getMinutes() + '';
                    return tag.length > 1 ? pad0(val) : val;
                }
                else if (cap == 's') {
                    const val = valDate.getSeconds() + '';
                    return tag.length > 1 ? pad0(val) : val;
                }
                else if (cap == 'Q') {
                    const quarter = Math.ceil(month / 3);
                    if (tag === 'Q')
                        return quarter + '';
                    return locale?.quarters[quarter - 1] || tag;
                }
                else if (cap === 'W') {
                    const val = getWeekOfYear(valDate) + '';
                    return tag.length > 1 ? pad0(val) : val;
                }
                else if (cap === 'w') {
                    const val = getWeekOfMonth(valDate);
                    if (tag === 'w')
                        return val + '';
                    return locale?.weeks[val - 1] || tag;
                }
                else if (cap === 'E') {
                    let dayOfWeek = valDate.getDay();
                    dayOfWeek = dayOfWeek < 1 ? 7 : dayOfWeek;
                    return tag === 'E'
                        ? dayOfWeek + ''
                        : locale?.days[dayOfWeek - 1] || tag;
                }
                return tag;
            });
        };
    }
    return formatter(val);
}
const cache = {};
const Locale = {
    'zh-CN': {
        quarters: ['一季度', '二季度', '三季度', '四季度'],
        months: [
            '一',
            '二',
            '三',
            '四',
            '五',
            '六',
            '七',
            '八',
            '九',
            '十',
            '十一',
            '十二',
        ].map((v) => v + '月'),
        weeks: ['一', '二', '三', '四', '五', '六'].map((v) => '第' + v + '周'),
        days: ['一', '二', '三', '四', '五', '六', '日'].map((v) => '星期' + v),
    },
};
let Lang = globalThis.navigator?.language || 'zh-CN';
/**
 * 设置不同locale的配置
 * @param lang 语言标记，默认跟随系统
 * @param options 格式化选项
 * @param options.quarters 季度描述，默认"一 - 四季度"
 * @param options.months 月度描述，默认"一 - 十二月"
 * @param options.weeks 一月中的周描述，默认"第一 - 六周"
 * @param options.days 星期描述，默认"星期一 - 日"
 */
formatDate.locale = function (lang, options) {
    let locale = Locale[lang];
    if (!locale) {
        locale = Locale[lang] = { quarters: [], months: [], weeks: [], days: [] };
    }
    if (options?.quarters) {
        locale.quarters = options?.quarters;
    }
    if (options?.months) {
        locale.months = options?.months;
    }
    if (options?.weeks) {
        locale.weeks = options?.weeks;
    }
    if (options?.days) {
        locale.days = options?.days;
    }
};
/**
 * 可以设置当前格式化使用的语言
 * @param lang 语言标记，默认跟随系统
 */
formatDate.lang = function (lang) {
    Lang = lang;
};

/**
 * 比较两个日期是否为同一天
 * @example
 * //true
 * console.log(_.isSameDay(new Date('2020-05-01'),'2020/5/1'))
 * //false
 * console.log(_.isSameDay(new Date('2020-05-01 23:59:59.999'),'2020/5/2 0:0:0.000'))
 *
 * @param date1 日期对象或合法格式的日期时间字符串
 * @param date2 同date1
 * @returns
 */
function isSameDay(date1, date2) {
    return (new Date(date1).setHours(0, 0, 0, 0) ===
        new Date(date2).setHours(0, 0, 0, 0));
}

/**
 * 返回13位日期毫秒数，表示从1970 年 1 月 1 日 00:00:00 (UTC)起到当前时间
 *
 * @example
 * //now time
 * console.log(_.now())
 *
 * @returns 带毫秒数的时间戳
 */
function now() {
    return Date.now();
}

var datetime = /*#__PURE__*/Object.freeze({
  __proto__: null,
  addTime: addTime,
  compareDate: compareDate,
  formatDate: formatDate,
  getDayOfYear: getDayOfYear,
  getWeekOfMonth: getWeekOfMonth,
  getWeekOfYear: getWeekOfYear,
  isLeapYear: isLeapYear,
  isSameDay: isSameDay,
  now: now,
  toDate: toDate
});

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
 * 判断值是不是一个Date实例
 *
 * @example
 * //true
 * console.log(_.isDate(new Date()))
 * //false
 * console.log(_.isDate('2020/1/1'))
 *
 * @param v
 * @returns
 */
function isDate(v) {
    return v instanceof Date;
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
    if (isArrayLike(v) && v.length < 1)
        return true;
    if (v instanceof Object && Object.keys(v).length < 1)
        return true;
    return false;
}

function eq$1(a, b) {
    if (Number.isNaN(a) && Number.isNaN(b))
        return true;
    return a === b;
}

/**
 * 同<code>isEqual</code>，但支持自定义比较器
 *
 * @example
 * //true
 * console.log(_.isEqualWith([new Date('2010-2-1'),'abcd'],['2010/2/1','Abcd'],(av,bv)=>_.isDate(av)?av.toLocaleDateString() == bv:_.test(av,bv,'i')))
 *
 * @param a
 * @param b
 * @param [comparator] 比较器，参数(v1,v2)，返回true表示匹配。如果返回undefined使用对应内置比较器处理
 * @returns
 * @since 1.0.0
 */
function isEqualWith(a, b, comparator) {
    let cptor = comparator;
    if (!isObject(a) || !isObject(b)) {
        return (cptor || eq$1)(a, b);
    }
    let keys = [];
    if ((keys = Object.keys(a)).length !== Object.keys(b).length)
        return false;
    if (isDate(a) && isDate(b))
        return cptor ? cptor(a, b) : a.getTime() === b.getTime();
    if (isRegExp(a) && isRegExp(b))
        return cptor ? cptor(a, b) : a.toString() === b.toString();
    for (let i = keys.length; i--;) {
        const k = keys[i];
        const v1 = a[k], v2 = b[k];
        if (!isEqualWith(v1, v2, cptor)) {
            return false;
        }
    }
    return true;
}

/**
 * 判断两个值是否相等，对于非基本类型会进行深度比较，可以比较日期/正则/数组/对象等
 *
 * @example
 * //false
 * console.log(_.isEqual(1,'1'))
 * //true,false
 * let o = {a:1,b:[2,{c:['3','x']}]}
 * let oo = {a:1,b:[2,{c:['3','x']}]}
 * console.log(_.isEqual(o,oo),o == oo)
 * //true
 * console.log(_.isEqual([new Date('2010-2-1'),/12/],[new Date(1264953600000),new RegExp('12')]))
 * //false
 * console.log(_.isEqual([new Date('2010-2-1'),'abcd'],['2010/2/1','Abcd']))
 *
 * @param a
 * @param b
 * @returns
 * @since 1.0.0
 */
function isEqual(a, b) {
    return isEqualWith(a, b);
}

/**
 * 判断值是不是异常对象
 *
 * @example
 * //true
 * console.log(_.isError(new TypeError))
 * //false
 * console.log(_.isError(Error))
 * //true
 * try{a=b}catch(e){console.log(_.isError(e))}
 *
 * @param v
 * @returns
 * @since 1.0.0
 */
function isError(v) {
    return typeof v === 'object' && v instanceof Error;
}

/**
 * 判断值是不是有限数字
 *
 * @example
 * //false
 * console.log(_.isFinite('0'))
 * //true
 * console.log(_.isFinite(0))
 * //true
 * console.log(_.isFinite(Number.MAX_VALUE))
 * //true
 * console.log(_.isFinite(99999999999999999999999999999999999999999999999999999999999999999999999))
 * //false
 * console.log(_.isFinite(Infinity))
 *
 * @param v
 * @returns
 * @since 1.0.0
 */
function isFinite(v) {
    return Number.isFinite(v);
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
function isMatchWith(target, props, comparator = eq$1) {
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
    return isMatchWith(object, props, eq$1);
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
function isNaN$1(v) {
    return Number.isNaN(v);
}

/**
 * 判断参数是否为null
 *
 * @example
 * //true
 * console.log(_.isNull(null))
 * //false
 * console.log(_.isNull(undefined))
 *
 * @param v
 * @returns
 */
function isNull(v) {
    return null === v;
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
 * 判断值是不是一个朴素对象，即通过Object创建的对象
 *
 * @example
 * //false
 * console.log(_.isPlainObject(1))
 * //false
 * console.log(_.isPlainObject(new String()))
 * //true
 * console.log(_.isPlainObject({}))
 * //false
 * console.log(_.isPlainObject(null))
 * //true
 * console.log(_.isPlainObject(new Object))
 * function Obj(){}
 * //false
 * console.log(_.isPlainObject(new Obj))
 *
 * @param v value
 * @returns 是否朴素对象
 * @since 0.19.0
 */
function isPlainObject(v) {
    return isObject(v) && v.constructor === Object.prototype.constructor;
}

/**
 * 判断值是不是一个安全整数
 *
 * @example
 * //true
 * console.log(_.isSafeInteger(-0))
 * //true
 * console.log(_.isSafeInteger(5.0))
 * //false
 * console.log(_.isSafeInteger(5.000000000000001))
 * //true
 * console.log(_.isSafeInteger(5.0000000000000001))
 * //false
 * console.log(_.isSafeInteger('5'))
 * //true
 * console.log(_.isSafeInteger(Number.MAX_SAFE_INTEGER))
 * //false
 * console.log(_.isSafeInteger(Number.MAX_VALUE))
 *
 * @param v
 * @returns
 */
function isSafeInteger(v) {
    return Number.isSafeInteger(v);
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
 * 判断值是不是Symbol
 *
 * @example
 * //true
 * console.log(_.isSymbol(Symbol()))
 *
 * @param v
 * @returns
 * @since 1.0.0
 */
function isSymbol(v) {
    return typeof v === 'symbol';
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

/**
 * 判断值是不是一个WeakMap对象
 *
 * @example
 * //true
 * console.log(_.isWeakMap(new WeakMap))
 * //false
 * console.log(_.isWeakMap(new Map))
 *
 * @param v
 * @returns
 */
function isWeakMap(v) {
    return v instanceof WeakMap;
}

/**
 * 判断值是不是一个WeakSet对象
 *
 * @example
 * //true
 * console.log(_.isWeakSet(new WeakSet))
 * //false
 * console.log(_.isWeakSet(new Set))
 *
 * @param v
 * @returns
 */
function isWeakSet(v) {
    return v instanceof WeakSet;
}

var is = /*#__PURE__*/Object.freeze({
  __proto__: null,
  isArray: isArray,
  isArrayLike: isArrayLike,
  isBlank: isBlank,
  isBoolean: isBoolean,
  isDate: isDate,
  isDefined: isDefined,
  isElement: isElement,
  isEmpty: isEmpty,
  isEqual: isEqual,
  isEqualWith: isEqualWith,
  isError: isError,
  isFinite: isFinite,
  isFunction: isFunction,
  isInteger: isInteger,
  isMap: isMap,
  isMatch: isMatch,
  isMatchWith: isMatchWith,
  isNaN: isNaN$1,
  isNil: isNil,
  isNull: isNull,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isRegExp: isRegExp,
  isSafeInteger: isSafeInteger,
  isSet: isSet,
  isString: isString,
  isSymbol: isSymbol,
  isUndefined: isUndefined,
  isWeakMap: isWeakMap,
  isWeakSet: isWeakSet
});

function identity(v) {
    return v;
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
    return assignWith(target, ...sources, identity);
}

function cloneBuiltInObject(obj) {
    let rs = null;
    if (isDate(obj)) {
        rs = new Date(obj.getTime());
    }
    else if (isBoolean(obj)) {
        rs = Boolean(obj);
    }
    else if (isString(obj)) {
        rs = String(obj);
    }
    else if (isRegExp(obj)) {
        rs = new RegExp(obj);
    }
    return rs;
}

/**
 * 浅层复制对象，支持赋值处理器
 * 如果obj是基本类型，返回原值
 * 如果obj是函数类型，返回原值
 *
 * 只复制对象的自身可枚举属性
 *
 * @example
 * //{x: 1, y: 2, z: null}
 * console.log(_.cloneWith({x:1,y:2,z:3},(v,k)=>k=='z'?null:v))
 * //null
 * console.log(_.cloneWith(null))
 *
 * @param obj
 * @param  {Function} [handler=identity] (obj[k],k) 自定义赋值处理器，返回赋予新对象[k]的值
 * @returns 被复制的新对象
 */
function cloneWith(obj, handler = identity) {
    if (!isObject(obj))
        return obj;
    if (isFunction(obj))
        return obj;
    let copy = cloneBuiltInObject(obj);
    if (copy !== null)
        return copy;
    copy = new obj.constructor();
    return assignWith(copy, obj, (sv, tv, k) => handler(sv, k));
}

/**
 * 浅层复制对象
 * 如果是基本类型，返回原值
 * 如果是函数类型，返回原值
 * 只复制对象的自身可枚举属性
 *
 * @example
 * //null
 * console.log(_.clone(null))
 *
 * @param obj
 * @returns 被复制的新对象
 */
function clone(obj) {
    return cloneWith(obj, identity);
}

/**
 * 完整复制对象,可以保持被复制属性的原有类型。支持赋值处理器
 *
 * 如果obj是基本类型，返回原值
 * 如果obj是函数类型，返回原值
 * 只复制对象的自身可枚举属性
 *
 * @example
 * //true
 * console.log(_.cloneDeepWith({d:new Date}).d instanceof Date)
 *
 * @param obj
 * @param handler (obj[k],k,obj) 自定义赋值处理器，返回赋予新对象[k]的值。默认 `identity`
 * @returns 被复制的新对象
 */
function cloneDeepWith(obj, handler) {
    if (!isObject(obj))
        return obj;
    if (isFunction(obj))
        return obj;
    let copy = cloneBuiltInObject(obj);
    if (copy !== null)
        return copy;
    copy = new obj.constructor();
    const propNames = Object.keys(obj);
    propNames.forEach((p) => {
        let newProp = (handler || identity)(obj[p], p, obj);
        if (isObject(newProp)) {
            newProp = cloneDeepWith(newProp, handler);
        }
        try {
            // maybe unwritable
            ;
            copy[p] = newProp;
        }
        catch (e) { }
    });
    return copy;
}

/**
 * 完整复制对象,可以保持被复制属性的原有类型
 *
 * 如果obj是基本类型，返回原值
 * 如果obj是函数类型，返回原值
 * 只复制对象的自身可枚举属性
 *
 * @example
 * //true
 * console.log(_.cloneDeep({d:new Date}).d instanceof Date)
 *
 * @param obj
 * @returns 被复制的新对象
 */
function cloneDeep(obj) {
    return cloneDeepWith(obj, identity);
}

/**
 * 将一个或多个源对象的可枚举属性值分配到目标对象中属性值为undefined的属性上。
 * 如果源对象有多个，则按照从左到右的顺序依次对target赋值，相同属性会被忽略
 *
 * > 该函数会修改目标对象
 *
 * - 当目标对象是null/undefined时，返回空对象
 * - 当目标对象是基本类型时，返回对应的包装对象
 * - 当目标对象是不可扩展/冻结/封闭状态时，返回目标对象
 *
 * @example
 * //{a: 1, b: 2, c: 3}
 * console.log(_.defaults({a:1},{b:2},{c:3,b:1,a:2}))
 *
 * @param target 目标对象
 * @param sources 1-n个源对象
 * @returns 返回target
 * @since 0.21.0
 */
function defaults(target, ...sources) {
    const rs = checkTarget(target);
    if (rs)
        return rs;
    eachSources(target, sources, null, (v, sv, tv, k, s, t) => {
        if (t[k] === undefined) {
            t[k] = v;
        }
    });
    return target;
}

/**
 * 与<code>defaults</code>相同，但会递归对象属性
 *
 * > 该函数会修改目标对象
 *
 * @example
 * //{a: {x: 1, y: 2, z: 3}, b: 2}
 * console.log(_.defaultsDeep({a:{x:1}},{b:2},{a:{x:3,y:2}},{a:{z:3,x:4}}))
 *
 * @param target 目标对象
 * @param sources 1-n个源对象
 * @returns 返回target
 * @since 0.21.0
 */
function defaultsDeep(target, ...sources) {
    const rs = checkTarget(target);
    if (rs)
        return rs;
    eachSources(target, sources, null, (v, sv, tv, k, s, t) => {
        if (tv === undefined) {
            t[k] = v;
        }
        else if (isObject(tv) && !isFunction(tv)) {
            defaultsDeep(tv, sv);
        }
    });
    return target;
}

/**
 * 判断两个值是否相等。使用<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Same-value-zero_equality">SameValueZero</a>
 * 算法进行值比较。
 *
 * @example
 * //true
 * console.log(_.eq(NaN,NaN))
 * //false
 * console.log(_.eq(1,'1'))
 *
 * @param a
 * @param b
 * @returns
 * @since 1.0.0
 */
function eq(a, b) {
    return eq$1(a, b);
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
 * 对`object`内的所有属性进行断言并返回第一个匹配的属性key
 *
 * @example
 * const libs = {
 *  'func.js':{platform:['web','nodejs'],tags:{utils:true}},
 *  'juth2':{platform:['web','java'],tags:{utils:false,middleware:true}},
 *  'soya2d':{platform:['web'],tags:{utils:true}}
 * }
 *
 * //func.js 查询对象的key
 * console.log(_.findKey(libs,'tags.utils'))
 * //juth2
 * console.log(_.findKey(libs,{'tags.utils':false}))
 * //tags
 * console.log(_.findKey(libs['soya2d'],'utils'))
 * //2
 * console.log(_.findKey([{a:1,b:2},{c:2},{d:3}],'d'))
 *
 * @param object 所有集合对象array / arrayLike / map / object / ...
 * @param predicate (value[,index|key[,collection]]) 断言
 * <br>当断言是函数时回调参数见定义
 * <br>其他类型请参考 {@link utils!iteratee}
 * @returns 第一个匹配断言的元素的key或undefined
 */
function findKey(object, predicate) {
    const callback = iteratee(predicate);
    let rs;
    for (let k in object) {
        let v = object[k];
        const r = callback(v, k, object);
        if (r) {
            rs = k;
            break;
        }
    }
    return rs;
}

/**
 * <code>toPairs</code>反函数，创建一个由键值对数组组成的对象
 *
 * @example
 * //{a:1,b:2,c:3}
 * console.log(_.fromPairs([['a', 1], ['b', 2], ['c', 3]]))
 *
 * @param pairs 键值对数组
 * @returns 对象
 */
function fromPairs(pairs) {
    const rs = {};
    for (let k in pairs) {
        let pair = pairs[k];
        rs[pair[0]] = pair[1];
    }
    return rs;
}

/**
 * 返回对象中的函数属性key数组
 * @example
 * const funcs = {
 *  a(){},
 *  b(){}
 * };
 * //[a,b]
 * console.log(_.functions(funcs))
 * //[....]
 * console.log(_.functions(_))
 *
 * @param obj
 * @returns 函数名数组
 * @since 0.18.0
 */
function functions$1(obj) {
    let rs = [];
    for (let k in obj) {
        if (isFunction(obj[k])) {
            rs.push(k);
        }
    }
    return rs;
}

/**
 * 检查指定key是否存在于指定的obj中
 *
 * @example
 * //true
 * console.log(_.has({a:12},'a'))
 *
 * @param obj
 * @param key
 * @returns 如果key存在返回true
 */
function has(obj, key) {
    return obj && obj.hasOwnProperty && obj.hasOwnProperty(key);
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
 * 返回对象的所有key数组
 * 包括原型链中的属性key
 *
 * @example
 * let f = new Function("this.a=1;this.b=2;");
 * f.prototype.c = 3;
 * //[a,b,c]
 * console.log(_.keysIn(new f()))
 *
 * @param obj
 * @returns 对象的key
 */
function keysIn(obj) {
    const rs = [];
    // eslint-disable-next-line guard-for-in
    for (const k in obj) {
        if (k)
            rs.push(k);
    }
    return rs;
}

function noop() {
    return undefined;
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
    arrays = arrays.map((alk) => (isArrayLike(alk) ? toArray(alk) : alk));
    return toArray(arrays[0]).concat(...arrays.slice(1));
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

/**
 * 同<code>omit</code>，但支持断言函数进行剔除
 * @example
 * //{c: '3'}
 * console.log(_.omitBy({a:1,b:2,c:'3'},_.isNumber))
 *
 * @param obj 选取对象
 * @param [predicate=identity] (v,k)断言函数
 * @returns 对象子集
 * @since 0.23.0
 */
function omitBy(obj, predicate) {
    const rs = {};
    if (obj === null || obj === undefined)
        return rs;
    Object.keys(obj).forEach(k => {
        let v = obj[k];
        if (!(predicate || identity)(v, k)) {
            rs[k] = v;
        }
    });
    return rs;
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
    const rs = toArray(array).reduce((acc, val) => {
        return acc.concat(Array.isArray(val) && depth > 0 ? flat(val, depth - 1) : val);
    }, []);
    return rs;
}

/**
 * 无限深度遍历数组，并将所有元素与子数组中的元素合并为一个新数组返回
 *
 * @example
 * //[1,2,1,3,4]
 * console.log(_.flatDeep(new Set([1,1,[2,[1,[3,4]]]])))
 * //[1,2,3,4]
 * console.log(_.flatDeep([1,[2,[3,[4]]]]))
 *
 * @param array 数组
 * @returns 扁平化后的新数组
 */
function flatDeep(array) {
    return flat(array, Infinity);
}

/**
 * 创建一个剔除指定属性的对象子集并返回。与pick()刚好相反
 * @example
 * //{a: 1, c: '3'}
 * console.log(_.omit({a:1,b:2,c:'3'},'b'))
 * //{a: 1}
 * console.log(_.omit({a:1,b:2,c:'3'},'b','c'))
 * //{c: '3'}
 * console.log(_.omit({a:1,b:2,c:'3'},['b','a']))
 *
 * @param obj 选取对象
 * @param props 属性集合
 * @returns 对象子集
 * @since 0.16.0
 */
function omit(obj, ...props) {
    const keys = flatDeep(props);
    return omitBy(obj, (v, k) => {
        return keys.includes(k);
    });
}

/**
 * 同<code>pick</code>，但支持断言函数进行选取
 * @example
 * //{a: 1, b: 2}
 * console.log(_.pickBy({a:1,b:2,c:'3'},_.isNumber))
 *
 * @param obj 选取对象
 * @param [predicate=identity] (v,k)断言函数
 * @returns 对象子集
 * @since 0.23.0
 */
function pickBy(obj, predicate) {
    const rs = {};
    if (obj === null || obj === undefined)
        return rs;
    Object.keys(obj).forEach(k => {
        let v = obj[k];
        if ((predicate || identity)(v, k)) {
            rs[k] = v;
        }
    });
    return rs;
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
    if (isString(collection)) {
        return collection.includes(value, fromIndex);
    }
    collection = isArrayLike(collection)
        ? slice(collection, fromIndex)
        : collection;
    each(collection, (v) => {
        if (eq$1(v, value)) {
            rs = true;
            return false;
        }
    });
    return rs;
}

/**
 * 创建一个指定属性的对象子集并返回
 * @example
 * //{b: 2}
 * console.log(_.pick({a:1,b:2,c:'3'},'b'))
 * //{b: 2,c:'3'}
 * console.log(_.pick({a:1,b:2,c:'3'},'b','c'))
 * //{a: 1, b: 2}
 * console.log(_.pick({a:1,b:2,c:'3'},['b','a']))
 *
 * @param obj 选取对象
 * @param props 属性集合
 * @returns 对象子集
 * @since 0.16.0
 */
function pick(obj, ...props) {
    const keys = flatDeep(props);
    return pickBy(obj, (v, k) => {
        return includes(keys, k);
    });
}

/**
 * 通过path设置对象属性值。如果路径不存在则创建，索引会创建数组，属性会创建对象
 * <div class="alert alert-secondary">
      该函数会修改源对象
    </div>

    @example
 * //{"a":1,"b":{"c":[undefined,{"x":10}]}}
 * console.log(_.set({a:1},'b.c.1.x',10))
 *
 * @param obj 需要设置属性值的对象，如果obj不是对象(isObject返回false)，直接返回obj
 * @param path 属性路径，可以是索引数字，字符串key，或者多级属性数组
 * @param value 任何值
 * @returns obj 修改后的源对象
 * @since 0.16.0
 */
function set(obj, path, value) {
    if (!isObject(obj))
        return obj;
    const chain = toPath$1(path);
    let target = obj;
    for (let i = 0; i < chain.length; i++) {
        const seg = chain[i];
        const nextSeg = chain[i + 1];
        let tmp = target[seg];
        if (nextSeg) {
            tmp = target[seg] = !tmp ? (isNaN(nextSeg) ? {} : []) : tmp;
        }
        else {
            target[seg] = value;
            break;
        }
        target = tmp;
    }
    return obj;
}

/**
 * 解析传递参数并返回一个根据参数值创建的Object实例。
 * 支持数组对、k/v对、对象、混合方式等创建
 * 是 toPairs 的反函数
 *
 * @example
 * //{a:1,b:2}
 * console.log(_.toObject('a',1,'b',2))
 * //如果参数没有成对匹配，最后一个属性值则为undefined
 * //{a:1,b:2,c:undefined}
 * console.log(_.toObject('a',1,'b',2,'c'))
 * //{a:1,b:4,c:3} 重复属性会覆盖
 * console.log(_.toObject(['a',1,'b',2],['c',3],['b',4]))
 * //{a:1,b:2} 对象类型返回clone
 * console.log(_.toObject({a:1,b:2}))
 * //{1:now time,a:{}} 混合方式
 * console.log(_.toObject([1,new Date],'a',{}))
 *
 * @param vals 对象创建参数，可以是一个数组/对象或者多个成对匹配的基本类型或者多个不定的数组/对象
 * @returns 如果没有参数返回空对象
 */
function toObject(...vals) {
    if (vals.length === 0)
        return {};
    const rs = {};
    const pairs = []; // 存放k/v
    let key = null;
    vals.forEach((v) => {
        if (isArray(v)) {
            const tmp = toObject(...v);
            assign(rs, tmp);
        }
        else if (isObject(v)) {
            if (key) {
                pairs.push(key, v);
                key = null;
            }
            else {
                assign(rs, v);
            }
        }
        else {
            if (key) {
                pairs.push(key, v);
                key = null;
            }
            else {
                key = v;
            }
        }
    });
    if (key) {
        pairs.push(key);
    }
    if (pairs.length > 0) {
        for (let i = 0; i < pairs.length; i += 2) {
            rs[pairs[i]] = pairs[i + 1];
        }
    }
    return rs;
}

/**
 * 返回指定对象的所有[key,value]组成的二维数组
 *
 * @example
 * //[['a', 1], ['b', 2], ['c', 3]]
 * console.log(_.toPairs({a:1,b:2,c:3}))
 *
 * @param obj
 * @returns 二维数组
 */
function toPairs(obj) {
    const rs = [];
    for (let k in obj) {
        let v = obj[k];
        rs.push([k, v]);
    }
    return rs;
}

/**
 * 删除obj上path路径对应属性
 * @param obj 需要设置属性值的对象，如果obj不是对象(isObject返回false)，直接返回obj
 * @param path 属性路径，可以是索引数字，字符串key，或者多级属性数组
 * @since 1.0.0
 * @returns 成功返回true，失败或路径不存在返回false
 */
function unset(obj, path) {
    if (!isObject(obj))
        return obj;
    const chain = toPath$1(path);
    let target = obj;
    for (let i = 0; i < chain.length; i++) {
        const seg = chain[i];
        const nextSeg = chain[i + 1];
        let tmp = target[seg];
        if (nextSeg) {
            tmp = target[seg] = !tmp ? (isNaN(nextSeg) ? {} : []) : tmp;
        }
        else {
            return delete target[seg];
        }
        target = tmp;
    }
    return false;
}

/**
 * 返回对象的所有value数组
 * 包括原型链中的属性
 *
 * @example
 * let f = new Function("this.a=1;this.b=2;");
 * f.prototype.c = 3;
 * //[1,2,3]
 * console.log(_.valuesIn(new f()))
 *
 * @param obj
 * @returns 对象根属性对应的值列表
 */
function valuesIn(obj) {
    return keysIn(obj).map((k) => obj[k]);
}

var object = /*#__PURE__*/Object.freeze({
  __proto__: null,
  assign: assign,
  assignWith: assignWith,
  clone: clone,
  cloneDeep: cloneDeep,
  cloneDeepWith: cloneDeepWith,
  cloneWith: cloneWith,
  defaults: defaults,
  defaultsDeep: defaultsDeep,
  eq: eq,
  findKey: findKey,
  fromPairs: fromPairs,
  functions: functions$1,
  get: get,
  has: has,
  keys: keys,
  keysIn: keysIn,
  merge: merge,
  mergeWith: mergeWith,
  omit: omit,
  omitBy: omitBy,
  pick: pick,
  pickBy: pickBy,
  prop: prop,
  set: set,
  toObject: toObject,
  toPairs: toPairs,
  unset: unset,
  values: values,
  valuesIn: valuesIn
});

function countBy(collection, itee) {
    const stat = {};
    const cb = iteratee(itee || identity);
    each(collection, (el) => {
        const key = cb(el);
        if (stat[key] === undefined)
            stat[key] = 0;
        stat[key]++;
    });
    return stat;
}

function eachRight(collection, callback) {
    _eachIterator(collection, callback, true);
}

function every(collection, predicate) {
    let rs = true;
    const callback = iteratee(predicate);
    each(collection, (v, k, c) => {
        const r = callback(v, k, c);
        if (!r) {
            rs = false;
            return false;
        }
    });
    return rs;
}

function filter(collection, predicate) {
    const rs = [];
    const callback = iteratee(predicate);
    each(collection, (v, k, c) => {
        const r = callback(v, k, c);
        if (r) {
            rs.push(v);
        }
    });
    return rs;
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

function findLast(collection, predicate) {
    const callback = iteratee(predicate);
    let rs;
    eachRight(collection, (v, k, c) => {
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

function flatMap(collection, itee, depth) {
    return flat(map(collection, itee), depth || 1);
}

function flatMapDeep(collection, itee) {
    return flatMap(collection, itee, Infinity);
}

/**
 * 创建一个统计对象，对象的key是iteratee返回的值，对应的值是由所有key对应值组成的数组
 * @example
 * //{true: [1, 3, 5, 7, 9], false: ['a', 'b', 'c', 'd']}
 * console.log(_.groupBy([1,'a',3,'b',5,'c',7,'d',9],_.isNumber))
 * const users = [
 *  {name:'zhangsan',sex:'m',age:33},
 *  {name:'lisi',sex:'f',age:21},
 *  {name:'wangwu',sex:'m',age:25},
 *  {name:'zhaoliu',sex:'m',age:44},
 * ]
 * //{m: [{...},{...},{...}], f: [{...}]} 性别分布统计
 * console.log(_.groupBy(users,u=>u.sex))
 * //{20: [{...},{...}], 30: [{...}], 40: [{...}]} 年龄段分布统计
 * console.log(_.groupBy(users,u=>(u.age/10>>0)*10))
 *
 * @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
 * @param [iteratee=identity] (value)回调函数，返回统计key
 * @returns 统计对象
 * @since 1.0.0
 */
function groupBy(collection, itee) {
    const stat = {};
    const cb = iteratee(itee || identity);
    each(collection, (el) => {
        const key = cb(el);
        if (stat[key] === undefined)
            stat[key] = [];
        stat[key].push(el);
    });
    return stat;
}

function keyBy(collection, itee) {
    const stat = {};
    const cb = iteratee(itee || identity);
    each(collection, (el) => {
        const key = cb(el);
        stat[key] = el;
    });
    return stat;
}

function partition(collection, predicate) {
    const matched = [];
    const mismatched = [];
    const callback = iteratee(predicate);
    each(collection, (v, k, c) => {
        const r = callback(v, k, c);
        if (r) {
            matched.push(v);
        }
        else {
            mismatched.push(v);
        }
    });
    return [matched, mismatched];
}

/**
 * 对集合中的每个元素执行一次reducer函数，并将其结果汇总为单个值返回。
 * <p>
 * 如果没有提供initialValue，reduce 会从集合索引1开始执行 callback 方法。如果提供initialValue则从索引0开始。
 * </p>
 * <p>
 * 注意，对于Object类型的对象，如果未提供initialValue，则accumulator会是索引0元素的value，而不是key
 * </p>
 *
 * @example
 * //25
 * console.log(_.reduce([1,3,5,7,9],(a,v)=>a+v))
 * //35
 * console.log(_.reduce([1,3,5,7,9],(a,v)=>a+v,10))
 * //x-y-z
 * console.log(_.reduce({x:1,y:2,z:3},(a,v,k)=>a+'-'+k,'').substr(1))
 *
 * @param collection
 * @param callback (accumulator,value[,key|index[,collection]]);reducer函数
 * @param [initialValue] 第一次调用 callback函数时的第一个参数的值
 * @returns 汇总值
 */
function reduce(collection, callback, initialValue) {
    let accumulator = initialValue;
    let hasInitVal = initialValue !== undefined;
    each(collection, (v, k, c) => {
        if (hasInitVal) {
            accumulator = callback(accumulator, v, k, c);
        }
        else {
            accumulator = v;
            hasInitVal = true;
        }
    });
    return accumulator;
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

function randi(min, max) {
    let maxNum = max || min;
    if (max === undefined) {
        min = 0;
    }
    maxNum >>= 0;
    min >>= 0;
    return (Math.random() * (maxNum - min) + min) >> 0;
}

/**
 * 返回对指定列表的唯一随机采样结果
 * @example
 * //随机值
 * console.log(_.sample([1,2,3,4,5,6,7,8,9,0]))
 * //随机值
 * console.log(_.sample({a:1,b:2,c:3,d:4,e:5}))
 *
 * @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
 * @returns 采样结果
 * @since 0.16.0
 */
function sample(collection) {
    const ary = toArray(collection);
    return ary[randi(ary.length)];
}

function range(start = 0, end, step) {
    let startNum = 0;
    let endNum = 0;
    let stepNum = 1;
    if (isNumber(start) && isUndefined(end) && isUndefined(step)) {
        endNum = start >> 0;
    }
    else if (isNumber(start) && isNumber(end) && isUndefined(step)) {
        startNum = start >> 0;
        endNum = end >> 0;
    }
    else if (isNumber(start) && isNumber(end) && isNumber(step)) {
        startNum = start >> 0;
        endNum = end >> 0;
        stepNum = step || 1;
    }
    const rs = Array(Math.round(Math.abs(endNum - startNum) / stepNum));
    let rsIndex = 0;
    if (endNum > startNum) {
        for (let i = startNum; i < endNum; i += stepNum) {
            rs[rsIndex++] = i;
        }
    }
    else if (endNum < startNum) {
        for (let i = startNum; i > endNum; i -= stepNum) {
            rs[rsIndex++] = i;
        }
    }
    return rs;
}

/**
 * 删除数组末尾或指定索引的一个元素并返回被删除的元素
 *
 * > 该函数会修改原数组
 *
 * @example
 * //3, [1, 2]
 * let ary = [1,2,3];
 * console.log(_.pop(ary),ary)
 * //{a: 1}, [{"a":2},{"a":3}]
 * ary = [{a:1},{a:2},{a:3}];
 * console.log(_.pop(ary,0),ary)
 *
 * @param array 数组对象。如果非数组类型会直接返回null
 * @param [index=-1] 要删除元素的索引。默认删除最后一个元素
 * @returns 被删除的值或null
 */
function pop(array, index) {
    index = index || -1;
    let rs = null;
    if (isArray(array)) {
        const i = toNumber(index);
        if (i > -1) {
            rs = array.splice(i, 1);
            if (rs.length < 1)
                rs = null;
            else {
                rs = rs[0];
            }
        }
        else {
            rs = array.pop();
        }
    }
    return rs;
}

/**
 * 返回对指定列表的指定数量随机采样结果
 * @example
 * //[随机值]
 * console.log(_.sampleSize([1,2,3,4,5,6,7,8,9,0]))
 * //[随机值1,随机值2]
 * console.log(_.sampleSize([{a:1},{b:2},{c:3},{d:4},{e:5}],2))
 *
 * @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
 * @param [count=1] 采样数量
 * @returns 采样结果
 * @since 0.16.0
 */
function sampleSize(collection, count) {
    count = count || 1;
    const ary = toArray(collection);
    const seeds = range(0, ary.length);
    const ks = [];
    while (seeds.length > 0) {
        if (count-- < 1)
            break;
        const i = pop(seeds, randi(seeds.length));
        if (i)
            ks.push(i);
    }
    const rs = map(ks, (v) => ary[v]);
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

/**
 * 返回指定数组的一个随机乱序副本
 * @example
 * //[随机内容]
 * console.log(_.shuffle([1,2,3,4,5,6,7,8,9,0]))
 * //[随机内容]
 * console.log(_.shuffle([{a:1},{a:2},{a:3},{a:4},{a:5}]))
 * //[随机内容]
 * console.log(_.shuffle({a:1,b:2,c:3,d:4,e:5}))
 *
 * @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
 * @returns 乱序副本
 * @since 0.16.0
 */
function shuffle(collection) {
    return sampleSize(collection, size(collection));
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

function sortBy(collection, itee) {
    if (size(collection) < 1)
        return [];
    const cb = iteratee(itee || identity);
    let i = 0;
    const list = map(collection, (v, k) => {
        return {
            src: v,
            index: i++,
            value: cb(v, k),
        };
    });
    const comparator = getComparator(list[0].value);
    return map(list.sort((a, b) => !eq$1(a.value, b.value) ? comparator(a.value, b.value) : a.index - b.index), (item) => item.src);
}
// comparators
const compareNumAsc = (a, b) => {
    if (isNil(a) || !isNumber(a))
        return 1;
    if (isNil(b) || !isNumber(b))
        return -1;
    return a - b;
};
const compareStrAsc = (a, b) => {
    if (isNil(a))
        return 1;
    if (isNil(b))
        return -1;
    return toString(a).localeCompare(toString(b));
};
const compareDateAsc = (a, b) => {
    if (isNil(a))
        return 1;
    if (isNil(b))
        return -1;
    return compareDate(a, b);
};
// eslint-disable-next-line require-jsdoc
function getComparator(el) {
    let comparator;
    if (isNumber(el)) {
        comparator = compareNumAsc;
    }
    else if (isDate(el)) {
        comparator = compareDateAsc;
    }
    else {
        comparator = compareStrAsc;
    }
    return comparator;
}

/**
 * 对集合进行排序，并返回排序后的数组副本。
 *
 * @example
 * //字符排序 ['lao1', 'lao2', 'lao3']
 * console.log(_.sort(['lao1','lao3','lao2']))
 * //数字排序[7, 9, 80]
 * console.log(_.sort([9,80,7]))
 * //日期排序["3/1/2019", "2020/1/1", Wed Apr 01 2020...]
 * console.log(_.sort([new Date(2020,3,1),'2020/1/1','3/1/2019']))
 * //第一个元素不是日期对象，需要转换
 * console.log(_.sort(_.map(['2020/1/1',new Date(2020,3,1),'3/1/2019'],v=>new Date(v))))
 * //对象排序
 * const users = [
 *  {name:'zhangsan',age:53},
 *  {name:'lisi',age:44},
 *  {name:'wangwu',age:25},
 *  {name:'zhaoliu',age:36}
 * ];
 * //[25,36,44,53]
 * console.log(_.sort(users,(a,b)=>a.age-b.age))
 * // 倒排
 * console.log(_.sort(users,(a,b)=>b.age-a.age))
 *
 * @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
 * @param [comparator] (a,b) 排序函数，如果为空使用sortBy逻辑
 * @returns 排序后的数组
 */
function sort(collection, comparator) {
    const ary = toArray(collection);
    if (ary.length < 1)
        return ary;
    if (isFunction(comparator)) {
        return ary.sort(comparator);
    }
    else {
        return sortBy(collection);
    }
}

var collection = /*#__PURE__*/Object.freeze({
  __proto__: null,
  countBy: countBy,
  each: each,
  eachRight: eachRight,
  every: every,
  filter: filter,
  find: find,
  findLast: findLast,
  flatMap: flatMap,
  flatMapDeep: flatMapDeep,
  groupBy: groupBy,
  includes: includes,
  keyBy: keyBy,
  map: map,
  partition: partition,
  reduce: reduce,
  reject: reject,
  sample: sample,
  sampleSize: sampleSize,
  shuffle: shuffle,
  size: size,
  some: some,
  sort: sort,
  sortBy: sortBy,
  toArray: toArray
});

/**
 * 向数组末尾追加一个或多个元素并返回
 *
 * > 该函数会修改原数组
 *
 * @example
 * //[1, 2, 3, 4]
 * let ary = [1,2];
 * _.append(ary,3,4);
 * console.log(ary);
 * //[1, 2, Array(2), 5]
 * ary = [1,2];
 * _.append(ary,[3,4],5);
 * console.log(ary);
 * //[1, 2, 3, 4]
 * ary = [1,2];
 * _.append(ary,...[3,4]);
 * console.log(ary);
 *
 * @param array 数组对象。如果非数组类型会自动转为数组
 * @param values 1-n个需要插入列表的值
 * @returns 插入值后的数组对象
 */
function append(array, ...values) {
    const rs = isArray(array) ? array : toArray(array);
    rs.push(...values);
    return rs;
}

/**
 * 把指定数组拆分成多个长度为size的子数组，并返回子数组组成的二维数组
 * @example
 * //[[1,2],[3,4]]
 * console.log(_.chunk([1,2,3,4],2))
 * //[[1,2,3],[4]]
 * console.log(_.chunk([1,2,3,4],3))
 *
 * @param array 数组对象。如果非数组类型会转成数组
 * @param [size=1] 子数组长度
 * @returns 拆分后的新数组
 * @since 0.23.0
 */
function chunk(array, size = 1) {
    const ary = toArray(array);
    const sizeNum = (size || 1) >> 0;
    const rs = [];
    ary.forEach((v, i) => {
        if (i % sizeNum == 0) {
            rs.push(ary.slice(i, i + sizeNum));
        }
    });
    return rs;
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

/**
 * 对所有集合做差集并返回差集元素组成的新数组
 *
 * @example
 * //[1]
 * console.log(_.except([1,2,3],[2,3]))
 * //[1,4]
 * console.log(_.except([1,2,3],[2,3],[3,2,1,4]))
 * //[{name: "b"}]
 * console.log(_.except([{name:'a'},{name:'b'}],[{name:'a'}],v=>v.name))
 * //[2, 3, "2", "3"] '2'和2不相等
 * console.log(_.except([1,2,3],[1,'2',3],[2,'3',1]))
 *
 * @param [arrays] 1-n个数组或arraylike对象，非arraylike参数会被忽略
 * @param [identifier] (v);标识函数，用来对每个元素返回唯一标识，标识相同的值会认为相等。使用<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Same-value-zero_equality">SameValueZero</a>
 * 算法进行值比较。如果为空，直接使用值自身比较
 * @returns 差集元素组成的新数组
 */
function except(...params) {
    let comparator;
    let list = params;
    const sl = params.length;
    if (sl > 2) {
        const lp = params[sl - 1];
        if (isFunction(lp)) {
            comparator = lp;
            list = params.slice(0, params.length - 1);
        }
    }
    list = list.filter((v) => isArrayLike(v) || isArray(v));
    if (list.length < 1)
        return list;
    const len = list.length;
    const kvMap = new Map();
    // 遍历所有元素
    for (let j = 0; j < len; j++) {
        const ary = list[j];
        const localMap = new Map();
        for (let i = 0; i < ary.length; i++) {
            const v = ary[i];
            const id = comparator ? comparator(v) : v;
            if (!kvMap.get(id)) {
                // 防止组内重复
                kvMap.set(id, { i: 0, v: v });
            }
            if (kvMap.get(id) && !localMap.get(id)) {
                kvMap.get(id).i++;
                // 相同id本组内不再匹配
                localMap.set(id, true);
            }
        }
    }
    const rs = [];
    each(kvMap, (v) => {
        if (v.i < len) {
            rs.push(v.v);
        }
    });
    return rs;
}

/**
 * 使用固定值填充arrayLike中从起始索引到终止索引内的全部元素
 *
 * @example
 * //[6, 6, 6]
 * console.log(_.fill(new Array(3), 6))
 * //[1, 'x', 'x', 'x', 5]
 * console.log(_.fill([1, 2, 3, 4, 5], 'x', 1, 4))
 *
 * @param array 数组
 * @param value 填充值
 * @param [start=0] 起始索引，包含
 * @param [end] 终止索引，不包含
 * @returns 填充后的新数组
 */
function fill(array, value, start = 0, end) {
    const rs = toArray(array);
    rs.fill(value, start, end);
    return rs;
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
 * 对集合内的所有元素进行断言并返回最后一个匹配的元素索引
 *
 * @example
 * //5 查询数组的索引
 * console.log(_.findLastIndex(['a','b','c',1,3,6],_.isNumber))
 * //2
 * console.log(_.findLastIndex([{a:1},{a:2},{a:3}],'a'))
 *
 * @param array arrayLike对象及set对象
 * @param predicate (value[,index[,array]]);断言
 * <br>当断言是函数时回调参数见定义
 * <br>其他类型请参考 {@link utils!iteratee}
 * @param [fromIndex=array.length - 1] 从集合长度-1开始的起始索引。设置该参数可以减少实际遍历次数
 * @returns 最后一个匹配断言的元素索引或-1
 * @since 0.19.0
 */
function findLastIndex(array, predicate, fromIndex) {
    let rs = -1;
    let fromIndexNum = fromIndex || 0;
    const itee = iteratee(predicate);
    if (fromIndex === undefined) {
        fromIndexNum = size(array) - 1;
    }
    eachRight(slice(array, 0, fromIndexNum + 1), (v, k, c) => {
        const r = itee(v, k, c);
        if (r) {
            rs = k;
            return false;
        }
    });
    return rs;
}

/**
 * 获取数组中的第一个元素
 *
 * @example
 * //1
 * console.log(_.first([1,2,3]))
 * //"1"
 * console.log(_.first(new Set(['1',1])))
 *
 * @param array 数组
 * @returns 数组中第一个元素
 */
function first(array) {
    return toArray(array)[0];
}

/**
 * 返回除最后一个元素外的所有元素组成的新数组
 *
 * @example
 * //[1, 2]
 * console.log(_.initial([1, 2, 3]))
 *
 * @param array 数组
 * @returns 新数组
 * @since 0.19.0
 */
function initial(array) {
    return array.slice(0, array.length - 1);
}

/**
 * 向数组中指定位置插入一个或多个元素并返回
 *
 * > 该函数会修改原数组
 *
 * @example
 * //[1, 2, Array(1), 'a', 3, 4]
 * let ary = [1,2,3,4];
 * _.insert(ary,2,[1],'a');
 * console.log(ary);
 * //[1, 2, 3, 4]
 * ary = [3,4];
 * _.insert(ary,0,1,2);
 * console.log(ary);
 * //func.js
 * console.log(_.insert('funcjs',4,'.').join(''));
 *
 * @param array 数组对象。如果非数组类型会自动转为数组
 * @param index 插入位置索引，0 - 列表长度
 * @param values 1-n个需要插入列表的值
 * @returns 插入值后的数组对象
 */
function insert(array, index, ...values) {
    const rs = isArray(array) ? array : toArray(array);
    if (!isNumber(index) || index < 0)
        index = 0;
    rs.splice(index, 0, ...values);
    return rs;
}

/**
 * 对所有集合做交集并返回交集元素组成的新数组
 * <p>
 * 关于算法性能可以查看文章<a href="https://www.jianshu.com/p/aa131d573575" target="_holyhigh">《如何实现高性能集合操作(intersect)》</a>
 * </p>
 *
 * @example
 * //[2]
 * console.log(_.intersect([1,2,3],[2,3],[1,2]))
 * //[3]
 * console.log(_.intersect([1,1,2,2,3],[1,2,3,4,4,4],[3,3,3,3,3,3]))
 * //[{name: "a"}] 最后一个参数是函数时作为标识函数
 * console.log(_.intersect([{name:'a'},{name:'b'}],[{name:'a'}],v=>v.name))
 * //[]
 * console.log(_.intersect())
 * //[3] 第三个参数被忽略，然后求交集
 * console.log(_.intersect([1,2,3],[3],undefined))
 * //[1] "2"和2不相同，3和"3"不相同
 * console.log(_.intersect([1,2,3],[1,'2',3],[2,'3',1]))
 *
 * @param [arrays] 1-n个数组或arraylike对象，非arraylike参数会被忽略
 * @param [identifier] (v);标识函数，用来对每个元素返回唯一标识，标识相同的值会认为相等。使用<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Same-value-zero_equality">SameValueZero</a>
 * 算法进行值比较。如果为空，直接使用值自身比较
 * @returns 交集元素组成的新数组
 */
function intersect(...params) {
    let comparator;
    let list = params;
    const sl = params.length;
    if (sl > 2) {
        const lp = params[sl - 1];
        if (isFunction(lp)) {
            comparator = lp;
            list = params.slice(0, sl - 1);
        }
    }
    list = list.filter((v) => isArrayLike(v) || isArray(v));
    if (list.length < 1)
        return list;
    const len = list.length;
    // 取得最短集合
    list.sort((a, b) => a.length - b.length);
    const kvMap = new Map();
    // 记录最少id
    let idLength = 0; // 用于快速匹配
    for (let i = list[0].length; i--;) {
        const v = list[0][i];
        const id = comparator ? comparator(v) : v;
        if (!kvMap.get(id)) {
            // 防止组内重复
            kvMap.set(id, { i: 1, v: v });
            idLength++;
        }
    }
    for (let j = 1; j < len; j++) {
        const ary = list[j];
        const localMap = new Map();
        let localMatchedCount = 0;
        for (let i = 0; i < ary.length; i++) {
            const v = ary[i];
            const id = comparator ? comparator(v) : v;
            if (kvMap.get(id) && !localMap.get(id)) {
                kvMap.get(id).i++;
                // 相同id本组内不再匹配
                localMap.set(id, true);
                // 匹配次数加1
                localMatchedCount++;
                // 已经匹配完所有可交集元素，无需继续检查
                if (localMatchedCount === idLength)
                    break;
            }
        }
    }
    const rs = [];
    each(kvMap, (v) => {
        if (v.i === len) {
            rs.push(v.v);
        }
    });
    return rs;
}

/**
 * 把arrayLike中所有元素连接成字符串并返回。对于基本类型元素会直接转为字符值，对象类型会调用toString()方法
 *
 * @example
 * //'1/2/3/4'
 * console.log(_.join([1, 2, 3, 4], '/'))
 * //'1,2,3,4'
 * console.log(_.join([1, 2, 3, 4]))
 *
 * @param array 数组
 * @param [separator=','] 分隔符
 * @returns 拼接字符串
 */
function join(array, separator) {
    return toArray(array).join(separator || ',');
}

/**
 * 获取数组中的最后一个元素
 *
 * @example
 * //3
 * console.log(_.last([1,2,3]))
 *
 * @param array 数组
 * @returns 数组中最后一个元素
 */
function last(array) {
    const ary = toArray(array);
    return ary[ary.length - 1];
}

/**
 * 删除数组中断言结果为true的元素并返回被删除的元素
 * <div class="alert alert-secondary">
      该函数会修改原数组
    </div>
 *
 * @example
 * //[1, 3] [2, 4]
 * let ary = [1,2,3,4];
 * console.log(_.remove(ary,x=>x%2),ary)
 * //[2] [1,3]
 * ary = [{a:1},{a:2},{a:3}];
 * console.log(_.remove(ary,v=>v.a===2),ary)
 * //[3] [1,2]
 * ary = [{a:1},{a:2},{a:3}];
 * console.log(_.remove(ary,{a:3}),ary)
 *
 * @param array 数组对象，如果参数非数组直接返回
 * @param predicate (value[,index[,array]]);断言
 * <br>当断言是函数时回调参数见定义
 * <br>其他类型请参考 {@link utils!iteratee}
 * @returns 被删除的元素数组或空数组
 * @since 0.19.0
 */
function remove(array, predicate) {
    const rs = [];
    if (!isArray(array))
        return rs;
    const itee = iteratee(predicate);
    let i = 0;
    for (let l = 0; l < array.length; l++) {
        const item = array[l];
        const r = itee(item, l, array);
        if (r) {
            rs.push(item);
        }
        else {
            array[i++] = item;
        }
    }
    array.length = i;
    return rs;
}

/**
 * 与without相同，但会修改原数组
 * <div class="alert alert-secondary">
      该函数会修改原数组
    </div>
 *
 * @example
 * //[1, 1] true
 * let ary = [1,2,3,4,3,2,1];
 * let newAry = _.pull(ary,2,3,4)
 * console.log(newAry,ary === newAry)
 *
 * @param array 数组对象
 * @param values 需要删除的值
 * @returns 新数组
 * @since 0.19.0
 */
function pull(array, ...values) {
    remove(array, (item) => includes(values, item));
    return array;
}

/**
 * 对数组元素位置进行颠倒，返回改变后的数组。
 *
 *  @example
 * //[3, 2, 1]
 * console.log(_.reverse([1, 2, 3]))
 *
 * @param array 数组
 * @returns 颠倒后的新数组
 */
function reverse(array) {
    const rs = toArray(array);
    return rs.reverse();
}

/**
 * 同<code>sortedIndex</code>，但支持自定义回调用来获取对比值
 * @example
 * //2
 * console.log(_.sortedIndexBy([{a:1},{a:2},{a:3}], {a:2.5},'a'))
 *
 * @param keys 对象属性标识符数组
 * @param value 需要插入数组的值
 * @param [iteratee=identity] (value)回调函数，返回排序对比值
 * @returns array索引
 * @since 1.0.0
 */
function sortedIndexBy(array, value, itee) {
    let left = 0;
    let right = size(array);
    let index = 0;
    const cb = iteratee(itee || identity);
    value = cb(value);
    while (left < right) {
        const mid = parseInt((left + right) / 2);
        if (cb(array[mid]) < value) {
            left = mid + 1;
            index = left;
        }
        else {
            right = mid;
        }
    }
    return index;
}

/**
 * 使用二分法确定在array保持排序不变的情况下，value可以插入array的最小索引
 * @example
 * //1
 * console.log(_.sortedIndex([1,2,3],1.5))
 * //1
 * console.log(_.sortedIndex(['a', 'c'], 'b'))
 * //0
 * console.log(_.sortedIndex([{a:1},{a:2},{a:3}], {a:2.5}))
 *
 * @param array 对象属性标识符数组
 * @param value 需要插入数组的值
 * @returns array索引
 * @since 1.0.0
 */
function sortedIndex(array, value) {
    return sortedIndexBy(array, value);
}

/**
 * 返回除第一个元素外的所有元素组成的新数组
 *
 * @example
 * //[2, 3]
 * console.log(_.tail([1, 2, 3]))
 *
 * @param array 数组
 * @returns 新数组
 */
function tail(array) {
    const rs = toArray(array);
    return rs.slice(1);
}

/**
 * 从起始位置获取指定数量的元素并放入新数组后返回
 *
 * @example
 * //[1, 2, 3]
 * console.log(_.take([1, 2, 3, 4, 5],3))
 * //[1, 2, 3, 4, 5]
 * console.log(_.take([1, 2, 3, 4, 5]))
 *
 * @param array 数组
 * @param [length] 获取元素数量，默认数组长度
 * @returns 新数组
 */
function take(array, length) {
    const rs = toArray(array);
    return rs.slice(0, length);
}

/**
 * 从数组末尾位置获取指定数量的元素放入新数组并返回
 *
 * @example
 * //[3, 4, 5]
 * console.log(_.takeRight([1, 2, 3, 4, 5],3))
 * //[1, 2, 3, 4, 5]
 * console.log(_.takeRight([1, 2, 3, 4, 5]))
 *
 * @param array 数组
 * @param length
 * @returns 新数组
 * @since 1.0.0
 */
function takeRight(array, length) {
    const rs = toArray(array);
    const maxLength = rs.length;
    return rs.slice(maxLength - (length || maxLength), maxLength);
}

/**
 * 对所有集合做并集并返回并集元素组成的新数组。并集类似concat()但不允许重复值
 *
 * @example
 * //[1, 2, 3]
 * console.log(_.union([1,2,3],[2,3]))
 * //[1, 2, 3, "1", "2"]
 * console.log(_.union([1,2,3],['1','2']))
 * //[{name: "a"},{name: "b"}]
 * console.log(_.union([{name:'a'},{name:'b'}],[{name:'a'}],v=>v.name))
 * //[a/b/a] 没有标识函数无法去重
 * console.log(_.union([{name:'a'},{name:'b'}],[{name:'a'}]))
 * //[1, 2, 3, "3"] "3"和3不相等
 * console.log(_.union([1,2,3],[1,3],[2,'3',1]))
 *
 * @param [arrays] 1-n个数组或arraylike对象，非arraylike参数会被忽略
 * @param [identifier] (v);标识函数，用来对每个元素返回唯一标识，标识相同的值会认为相等。使用<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Same-value-zero_equality">SameValueZero</a>
 * 算法进行值比较。如果为空，直接使用值自身比较
 * @returns 并集元素组成的新数组
 */
function union(...params) {
    let comparator;
    let list = params;
    const sl = params.length;
    if (sl > 2 && isFunction(params[sl - 1])) {
        comparator = params[sl - 1];
        list = params.slice(0, sl - 1);
    }
    list = list.filter((v) => isArrayLike(v) || isArray(v));
    if (list.length < 1)
        return list;
    let rs;
    if (comparator) {
        const kvMap = new Map();
        flat(list).forEach((v) => {
            const id = comparator(v);
            if (!kvMap.get(id)) {
                kvMap.set(id, v);
            }
        });
        rs = map(kvMap, (v) => v);
    }
    else {
        rs = toArray(new Set(flat(list)));
    }
    return rs;
}

/**
 * 对数组内的值进行去重
 * @example
 * // [1,2,4,"a","1",null]
 * console.log(_.unique([1,2,2,4,4,'a','1','a',null,null]))
 *
 * @param array 数组
 * @returns 转换后的新数组对象
 */
function uniq(array) {
    const ary = toArray(array);
    return toArray(new Set(ary));
}

/**
 * 同<code>uniq</code>，但支持自定义筛选函数
 * @example
 * // [{"a":1},{"a":"1"},{"a":2},{"a":"2"}]
 * console.log(_.uniqBy([{a:1},{a:1},{a:'1'},{a:2},{a:'2'},{a:2}],'a'))
 * // [{"a":1},{"a":2}]
 * console.log(_.uniqBy([{a:1},{a:1},{a:'1'},{a:2},{a:'2'},{a:2}],v=>v.a>>0))
 *
 * @param array 数组
 * @param iteratee (value,index) 筛选函数，返回需要对比的值。默认identity
 * <br>当iteratee是函数时回调参数见定义
 * <br>其他类型请参考 {@link utils.iteratee}
 * @returns 去重后的新数组对象
 * @since 1.0.0
 */
function uniqBy(array, itee) {
    const cb = iteratee(itee || identity);
    const keyMap = new Map();
    const rs = [];
    each(array, (v, k) => {
        const key = cb(v, k);
        if (keyMap.get(key))
            return;
        keyMap.set(key, 1);
        rs.push(v);
    });
    return rs;
}

/**
 * <code>zip</code>的反操作
 * @example
 * //[[1,2,undefined],['a','b','c']]
 * console.log(_.unzip([[1, 'a'],[2, 'b'],[undefined, 'c']]))
 * //[['a', 'b', 'c'], [1, 2, undefined],['1', undefined,undefined]]
 * console.log(_.unzip([['a', 1, '1'], ['b', 2],['c']]))
 *
 * @param array 包含若干分组的数组
 * @returns 重新分组后的新数组
 * @since 0.23.0
 */
function unzip(array) {
    const rs = [];
    const len = size(array);
    each(array, (group, colIndex) => {
        each(group, (el, rowIndex) => {
            let row = rs[rowIndex];
            if (!row) {
                row = rs[rowIndex] = new Array(len);
            }
            row[colIndex] = el;
        });
    });
    return rs;
}

/**
 * 返回删除所有values后的新数组。使用<code>eq</code>函数进行等值判断
 *
 * @example
 * //[1, 1]
 * console.log(_.without([1,2,3,4,3,2,1],2,3,4))
 *
 * @param array 数组对象
 * @param values 需要删除的值
 * @returns 新数组
 * @since 0.19.0
 */
function without(array, ...values) {
    return filter(array, (item) => !includes(values, item));
}

/**
 * 创建一个由指定数组arrays内元素重新分组后组成的二维数组，
 * 第一个子数组由每个数组内的第一个元素组成，第二个子数组由每个数组内的第二个元素组成，以此类推。
 * 子数组的数量由参数中数组内元素最多的数组决定。
 * @example
 * //[[1, 'a'],[2, 'b'],[undefined, 'c']]
 * console.log(_.zip([1,2],['a','b','c']))
 * //[['a', 1, '1'], ['b', 2, undefined],['c', undefined,undefined]]
 * console.log(_.zip(['a','b','c'],[1,2],['1']))
 *
 * @param arrays 1-n个数组
 * @returns 重新分组后的新数组
 * @since 0.23.0
 */
function zip(...arrays) {
    const rs = [];
    const size = arrays.length;
    arrays.forEach((ary, colIndex) => {
        each(ary, (el, i) => {
            let group = rs[i];
            if (!group) {
                group = rs[i] = new Array(size);
            }
            group[colIndex] = el;
        });
    });
    return rs;
}

/**
 * 创建一个对象，属性名称与属性值分别来自两个数组
 * @example
 * //{a: 1, b: 2}
 * console.log(_.zipObject(['a','b'],[1,2,3]))
 *
 * @param keys 对象属性标识符数组
 * @param values 对象值数组
 * @returns 组合后的对象
 * @since 0.23.0
 */
function zipObject(keys, values) {
    const rs = {};
    each(keys, (k, i) => {
        rs[k] = get(values, i);
    });
    return rs;
}

/**
 * 与<code>zip</code>相同，但支持自定义组合逻辑
 * @example
 * //[[1, 3, 5], [2, 4, 6]]
 * console.log(_.zipWith([1,2],[3,4],[5,6]))
 * //[9, 12]
 * console.log(_.zipWith([1,2],[3,4],[5,6],_.sum))
 * //[3, 4]
 * console.log(_.zipWith([1,2],[3,4],[5,6],group=>_.avg(group)))
 *
 * @param arrays 1-n个数组
 * @param [iteratee=identity] (group)回调函数，返回组合后的分组值
 * @returns 重新分组后的新数组
 * @since 1.0.0
 */
function zipWith(...params) {
    const sl = params.length;
    let itee = params[sl - 1];
    const arys = params;
    if (!isFunction(itee)) {
        itee = identity;
    }
    else {
        pop(arys);
    }
    const rs = zip(...arys);
    return map(rs, (group) => itee(group));
}

var array = /*#__PURE__*/Object.freeze({
  __proto__: null,
  append: append,
  chunk: chunk,
  compact: compact,
  concat: concat,
  except: except,
  fill: fill,
  findIndex: findIndex,
  findLastIndex: findLastIndex,
  first: first,
  flat: flat,
  flatDeep: flatDeep,
  head: first,
  initial: initial,
  insert: insert,
  intersect: intersect,
  join: join,
  last: last,
  pop: pop,
  pull: pull,
  range: range,
  remove: remove,
  reverse: reverse,
  slice: slice,
  sortedIndex: sortedIndex,
  sortedIndexBy: sortedIndexBy,
  tail: tail,
  take: take,
  takeRight: takeRight,
  union: union,
  uniq: uniq,
  uniqBy: uniqBy,
  unzip: unzip,
  without: without,
  zip: zip,
  zipObject: zipObject,
  zipWith: zipWith
});

/**
 * a + b
 * @example
 * //3
 * console.log(_.add(1,2))
 * //1
 * console.log(_.add(1,null))
 * //NaN
 * console.log(_.add(1,NaN))
 *
 * @param a
 * @param b
 * @returns a+b
 * @since 1.0.0
 */
function add(a, b) {
    a = isNil(a) ? 0 : a;
    b = isNil(b) ? 0 : b;
    return a + b;
}

/**
 * a / b
 * @example
 * //0.5
 * console.log(_.divide(1,2))
 * //Infinity
 * console.log(_.divide(1,null))
 * //NaN
 * console.log(_.divide(1,NaN))
 *
 * @param a
 * @param b
 * @returns a/b
 * @since 1.0.0
 */
function divide(a, b) {
    a = isNil(a) ? 0 : a;
    b = isNil(b) ? 0 : b;
    return a / b;
}

/**
 * 返回给定数字序列中最大的一个。忽略NaN，null，undefined
 * @example
 * //7
 * console.log(_.max([2,3,1,NaN,7,4,null]))
 * //6
 * console.log(_.max([4,5,6,'x','y']))
 * //Infinity
 * console.log(_.max([4,5,6,Infinity]))
 *
 * @param values 数字/字符数组/Set
 * @returns
 * @since 1.0.0
 */
function max(values) {
    const vals = flatMap(values, v => isNil(v) || isNaN(v) ? [] : v);
    let f64a = new Float64Array(vals);
    f64a.sort();
    return f64a[f64a.length - 1];
}

/**
 * 对多个数字或数字列表计算平均值并返回结果
 * @example
 * //2.5
 * console.log(_.mean([1,2,'3',4]))
 * //NaN
 * console.log(_.mean([1,'2',3,'a',4]))
 * //2
 * console.log(_.mean([1,'2',3,null,4]))
 *
 * @param values 数字/字符数组/Set
 * @returns mean value
 * @since 1.0.0
 */
function mean(values) {
    const vals = map(values, v => isNil(v) ? 0 : v);
    let f64a = new Float64Array(vals);
    let rs = 0;
    f64a.forEach(v => {
        rs += v;
    });
    return rs / f64a.length;
}

/**
 * 返回给定数字序列中最小的一个。忽略NaN，null，undefined
 * @example
 * //-1
 * console.log(_.min([2,3,1,7,'-1']))
 * //0
 * console.log(_.min([4,3,6,0,'x','y']))
 * //-Infinity
 * console.log(_.min([-Infinity,-9999,0,null]))
 * @param values 数字/字符数组/Set
 * @returns
 * @since 1.0.0
 */
function min(values) {
    const vals = flatMap(values, v => isNil(v) || isNaN(v) ? [] : v);
    let f64a = new Float64Array(vals);
    f64a.sort();
    return f64a[0];
}

/**
 * 返回min/max如果value超出范围
 * @example
 * //1
 * console.log(_.minmax([1,10,0]))
 * //6
 * console.log(_.minmax([4,8,6]))
 *
 * @param min
 * @param max
 * @param value
 * @returns
 */
function minmax(min, max, value) {
    if (value < min)
        return min;
    if (value > max)
        return max;
    return value;
}

/**
 * a * b
 * @example
 * //2
 * console.log(_.multiply(1,2))
 * //0
 * console.log(_.multiply(1,null))
 * //NaN
 * console.log(_.multiply(1,NaN))
 *
 * @param a
 * @param b
 * @returns a*b
 * @since 1.0.0
 */
function multiply(a, b) {
    a = isNil(a) ? 0 : a;
    b = isNil(b) ? 0 : b;
    return a * b;
}

function randf(min, max) {
    if (max === undefined) {
        if (!min)
            return Math.random();
        max = min;
        min = 0;
    }
    max = parseFloat(max + '') || 0;
    min = parseFloat(min + '') || 0;
    return Math.random() * (max - min) + min;
}

/**
 * a - b
 * @example
 * //-1
 * console.log(_.subtract(1,2))
 * //1
 * console.log(_.subtract(1,null))
 * //NaN
 * console.log(_.subtract(1,NaN))
 *
 * @param a
 * @param b
 * @returns a - b
 * @since 1.0.0
 */
function subtract(a, b) {
    a = isNil(a) ? 0 : a;
    b = isNil(b) ? 0 : b;
    return a - b;
}

function sum(...values) {
    let ary = values;
    if (ary.length === 1 && isArrayLike(ary[0])) {
        ary = ary[0];
    }
    const vals = ary.map((v) => isNil(v) ? 0 : v);
    let rs = 0;
    const f64a = new Float64Array(vals);
    f64a.forEach((v) => {
        rs += v;
    });
    return rs;
}

var math = /*#__PURE__*/Object.freeze({
  __proto__: null,
  add: add,
  divide: divide,
  max: max,
  mean: mean,
  min: min,
  minmax: minmax,
  multiply: multiply,
  randf: randf,
  randi: randi,
  subtract: subtract,
  sum: sum
});

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

/**
 * 如果v是null/undefined/NaN中的一个，返回defaultValue
 * @example
 * //"x"
 * console.log(_.defaultTo(null,'x'))
 * //0
 * console.log(_.defaultTo(0,'y'))
 *
 * @param v 任何值
 * @param defaultValue 任何值
 * @returns v或defaultValue
 * @since 0.16.0
 */
function defaultTo(v, defaultValue) {
    if (v === null || v === undefined || Number.isNaN(v))
        return defaultValue;
    return v;
}

/**
 * 为func.js扩展额外函数，扩展后的函数同样具有函数链访问能力
 *
 * @example
 * //增加扩展
 * _.mixin({
 *  select:_.get,
 *  from:_.chain,
 *  where:_.filter,
 *  top:_.head
 * });
 *
 * const libs = [
 *  {name:'func.js',platform:['web','nodejs'],tags:{utils:true},js:true},
 *  {name:'juth2',platform:['web','java'],tags:{utils:false,middleware:true},js:false},
 *  {name:'soya2d',platform:['web'],tags:{utils:true},js:true}
 * ];
 * //查询utils是true的第一行数据的name值
 * console.log(_.from(libs).where({tags:{utils:true}}).top().select('name').value())
 *
 * @param obj 扩展的函数声明
 */
function mixin(target, obj) {
    functions$1(obj).forEach((fnName) => {
        const fn = obj[fnName];
        if (isFunction(target)) {
            target[fnName] = fn;
        }
        else {
            target.prototype[fnName] = function (...rest) {
                this._chain.push({
                    fn: fn,
                    params: rest,
                });
                return this;
            };
        }
    });
}

/**
 * 当通过非esm方式引用函数库时，函数库会默认挂载全局变量<code>_</code>。
 * 如果项目中存在其它以该变量为命名空间的函数库（如lodash、underscore等）则会发生命名冲突。
 * 该函数可恢复全局变量为挂载前的引用，并返回myfuncs命名空间
 * @example
 * // 返回myfuncs并重置全局命名空间 _
 * console.log(_.noConflict())
 *
 * @returns 返回myfuncs命名空间
 * @since 1.0.0
 */
function noConflict() {
    const ctx = globalThis;
    if (ctx.myff) {
        ctx._ = ctx.__f_prev;
    }
    return ctx.myff;
}

/**
 * 生成一个64bit整数的雪花id并返回，具体格式如下：
 * <code>
 * 0 - timestamp                                       - nodeId       - sequence<br>
 * 0 - [0000000000 0000000000 0000000000 0000000000 0] - [0000000000] - [000000000000]
 * </code>
 * 可用于客户端生成可跟踪统计的id，如定制终端
 * @example
 * // 343155438738309188
 * console.log(_.snowflakeId(123))
 * // 78249955004317758
 * console.log(_.snowflakeId(456,new Date(2022,1,1).getTime()))
 *
 * @param nodeId 节点id，10bit整数
 * @param [epoch=1580486400000] 时间起点，用于计算相对时间戳
 * @returns snowflakeId 由于js精度问题，直接返回字符串而不是number，如果nodeId为空返回 '0000000000000000000'
 * @since 1.0.0
 */
function snowflakeId(nodeId, epoch) {
    epoch = epoch || 1580486400000;
    if (isNil(nodeId))
        return '0000000000000000000';
    let nowTime = Date.now();
    // 12bits for seq
    if (lastTimeStamp === nowTime) {
        sequence += randi(1, 9);
        if (sequence > 0xfff) {
            nowTime = _getNextTime(lastTimeStamp);
            sequence = randi(0, 99);
        }
    }
    else {
        sequence = randi(0, 99);
    }
    lastTimeStamp = nowTime;
    // 41bits for time
    const timeOffset = (nowTime - epoch).toString(2);
    // 10bits for nodeId
    const nodeBits = padEnd((nodeId % 0x3ff).toString(2) + '', 10, '0');
    // 12bits for seq
    const seq = padZ(sequence.toString(2) + '', 12);
    return BigInt(`0b${timeOffset}${nodeBits}${seq}`).toString();
}
let lastTimeStamp = -1;
let sequence = 0;
const _getNextTime = (lastTime) => {
    let t = Date.now();
    while (t <= lastTime) {
        t = Date.now();
    }
    return t;
};

/**
 * 调用iteratee函数n次，并将历次调用的返回值数组作为结果返回
 * @example
 * //['0',...,'4']
 * console.log(_.times(5,String))
 * //[[0],[1]]
 * console.log(_.times(2,_.toArray))
 *
 * @param n 迭代次数
 * @param iteratee 每次迭代调用函数
 * @returns 返回值数组
 * @since 0.17.0
 */
function times(n, iteratee) {
    return range(n).map(iteratee);
}

/**
 * 返回一个全局的整数id，序号从0开始。可以用于前端列表编号等用途
 *
 * @example
 * //func_0
 * console.log(_.uniqueId('func'))
 * //1
 * console.log(_.uniqueId())
 *
 * @param [prefix] id前缀
 * @returns 唯一id
 * @since 0.16.0
 */
function uniqueId(prefix) {
    return (prefix !== undefined ? prefix + '_' : '') + seed++;
}
let seed = 0;

const VARIANTS = ['8', '9', 'a', 'b'];
/**
 * 生成一个32/36个字符组件的随机uuid(v4)并返回
 * @example
 * // ddfd73a5-62ac-4412-ad2b-fd495f766caf
 * console.log(_.uuid(true))
 * // ddfd73a562ac4412ad2bfd495f766caf
 * console.log(_.uuid())
 *
 * @param delimiter 是否生成分隔符
 * @returns uuid
 * @since 1.0.0
 */
function uuid(delimiter) {
    let uuid = '';
    if (self.crypto.randomUUID) {
        // only in https
        uuid = self.crypto.randomUUID();
    }
    else {
        const r32 = Math.random();
        const r16 = Math.random();
        const p1Num = Math.floor(r32 * (0xffffffff - 0x10000000)) + 0x10000000;
        const p1 = p1Num.toString(16);
        const p2Num = Math.floor(r16 * (0xffff - 0x1000)) + 0x1000;
        const p2 = p2Num.toString(16);
        const p3 = substring((p2Num << 1).toString(16), 0, 3);
        const p4 = substring((p2Num >> 1).toString(16), 0, 3);
        let p5 = Date.now().toString(16);
        p5 =
            substring((p1Num >> 1).toString(16), 0, 6) +
                substring(p5, p5.length - 6, p5.length);
        uuid =
            p1 + '-' + p2 + '-4' + p3 + '-' + VARIANTS[randi(0, 3)] + p4 + '-' + p5;
    }
    return delimiter ? uuid : uuid.replace(/-/g, '');
}

var utils = /*#__PURE__*/Object.freeze({
  __proto__: null,
  alphaId: alphaId,
  defaultTo: defaultTo,
  identity: identity,
  iteratee: iteratee,
  matcher: matcher,
  mixin: mixin,
  noConflict: noConflict,
  noop: noop,
  snowflakeId: snowflakeId,
  times: times,
  toPath: toPath,
  uniqueId: uniqueId,
  uuid: uuid
});

/**
 * 创建一个包含指定函数逻辑且内置计数的包装函数并返回。
 * 该函数每调用一次计数会减一，直到计数为0后生效。可用于异步结果汇总时只调用一次的场景
 *
 * @example
 * //undefined, undefined, 'data saved'
 * let saveTip = _.after(()=>'data saved',2);
 * console.log(saveTip(),saveTip(),saveTip())
 *
 * @param fn 需要调用的函数
 * @param [count=0] 计数
 * @returns 包装后的函数
 */
function after(fn, count) {
    const proxy = fn;
    let i = count || 0;
    let rtn;
    return (...args) => {
        if (i === 0) {
            rtn = proxy(...args);
        }
        if (i > 0)
            i--;
        return rtn;
    };
}

/**
 * 传递v为参数执行interceptor1函数，如果该函数返回值未定义(undefined)则执行interceptor2函数，并返回函数返回值。
 * 用于函数链中的分支操作
 * @example
 * //false
 * console.log(_.alt(9,v=>false,v=>20))
 *
 * @param v
 * @param interceptor1 (v)
 * @param interceptor2 (v)
 * @returns 函数返回值
 */
function alt(v, interceptor1, interceptor2) {
    let rs = interceptor1(v);
    if (rs === undefined) {
        rs = interceptor2(v);
    }
    return rs;
}

const PLACEHOLDER = void 0;
/**
 * 创建一个新的函数，该函数会调用fn，并传入指定的部分参数。
 *
 * `partial()`常用来创建函数模板或扩展核心函数，比如
 *
 * ```js
 * let delay2 = _.partial(setTimeout,undefined,2000);
 * delay2(()=>\{console.log('2秒后调用')\})
 * ```
 *
 * @example
 * //2748
 * let hax2num = _.partial(parseInt,undefined,16);
 * console.log(hax2num('abc'))
 * //9
 * let square = _.partial(Math.pow,undefined,2);
 * console.log(square(3))
 * //￥12,345.00元
 * let formatYuan = _.partial(_.formatNumber,undefined,'￥,000.00元');
 * console.log(formatYuan(12345))
 * //[func.js] hi...
 * let log = _.partial((...args)=>args.join(' '),'[func.js][',undefined,']',undefined);
 * console.log(log('info','hi...'))
 *
 * @param fn 需要调用的函数
 * @param args 参数可以使用undefined作为占位符，以此来确定不同的实参位置
 * @returns 部分应用后的新函数
 */
function partial(fn, ...args) {
    return function (...params) {
        let p = 0;
        const applyArgs = args.map((v) => (v === PLACEHOLDER ? params[p++] : v));
        if (params.length > p) {
            for (let i = p; i < params.length; i++) {
                applyArgs.push(params[i]);
            }
        }
        return fn(...applyArgs);
    };
}

/**
 * 创建一个新的函数，并且绑定函数的this上下文。默认参数部分同<code>partial()</code>
 *
 * @example
 * const obj = {
 *  text:'Func.js',
 *  click:function(a,b,c){console.log('welcome to '+this.text,a,b,c)},
 *  blur:function(){console.log('bye '+this.text)}
 * }
 * //自动填充参数
 * let click = _.bind(obj.click,obj,'a',undefined,'c');
 * click('hi')
 * //1秒后执行，无参数
 * setTimeout(click,1000)
 *
 * @param fn 需要调用的函数
 * @param thisArg fn函数内this所指向的值
 * @param args 参数可以使用undefined作为占位符，以此来确定不同的实参位置
 * @returns 绑定thisArg的新函数
 * @since 0.17.0
 */
function bind(fn, thisArg, ...args) {
    return partial(fn.bind(thisArg), ...args);
}

/**
 * 批量绑定对象内的函数属性，将这些函数的this上下文指向绑定对象。经常用于模型中的函数用于外部场景，比如setTimeout/事件绑定等
 *
 * @example
 * const obj = {
 *  text:'Func.js',
 *  click:function(a,b,c){console.log('welcome to '+this.text,a,b,c)},
 *  click2:function(){console.log('hi '+this.text)}
 * }
 * //自动填充参数
 * _.bindAll(obj,'click',['click2']);
 * //1秒后执行，无参数
 * setTimeout(obj.click,1000)
 * //事件
 * top.onclick = obj.click2
 *
 * @param object 绑定对象
 * @param  {...(string | Array<string>)} methodNames 属性名或path
 * @returns 绑定对象
 * @since 0.17.0
 */
function bindAll(object, ...methodNames) {
    const pathList = flatDeep(methodNames);
    each(pathList, (path) => {
        const fn = get(object, path);
        set(object, path, fn.bind(object));
    });
    return object;
}

/**
 * 通过给定参数调用fn并返回执行结果
 *
 * @example
 * //自动填充参数
 * _.call(fn,1,2);
 * //事件
 * _.call(fn,1,2);
 *
 * @param fn 需要执行的函数
 * @param args 可变参数
 * @returns 执行结果。如果函数无效或无返回值返回undefined
 * @since 1.0.0
 */
function call(fn, ...args) {
    if (!isFunction(fn))
        return undefined;
    return fn(...args);
}

/**
 * 创建一个新的函数，该函数的参数会传递给第一个<code>fns</code>函数来计算结果，而结果又是第二个fns函数的参数，以此类推，
 * 直到所有函数执行完成。常用于封装不同的可重用函数模块组成新的函数或实现惰性计算，比如
 *
 * <pre><code class="language-javascript">
 * let checkName = _.compose(_.trim,v=>v.length>6);
 * checkName(' holyhigh') //=> true
 * checkName(' ') //=> false
 * </code></pre>
 *
 * @example
 * // Holyhigh
 * let formatName = _.compose(_.lowerCase,_.capitalize);
 * console.log(formatName('HOLYHIGH'))
 *
 * @param  {...function} fns
 * @returns 组合后的入口函数
 */
function compose(...fns) {
    return function (...args) {
        let rs = fns[0](...args);
        for (let i = 1; i < fns.length; i++) {
            if (isFunction(fns[i])) {
                rs = fns[i](rs);
            }
        }
        return rs;
    };
}

/**
 * 启动计时器，并在倒计时为0后调用函数。
 * 内部使用setTimeout进行倒计时，如需中断延迟可以使用clearTimeout函数
 * <div class="alert alert-secondary">
      注意，函数并不提供防抖逻辑。如果需要处理重复调用必须自己处理计时器id
    </div>
 *
 * @example
 * //1000ms 后显示some text !
 * _.delay(console.log,1000,'some text','!');
 *
 * @param fn 需要调用的函数
 * @param [wait=0] 倒计时。单位ms
 * @param [args] 传入定时函数的参数
 * @returns 计时器id
 */
function delay(fn, wait, ...args) {
    return setTimeout(() => {
        fn(...args);
    }, wait || 0);
}

/**
 * 类似eval，对表达式进行求值并返回结果。不同于eval，fval()执行在严格模式下
 *
 * > 注意，如果页面设置了<a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP">CSP</a>可能会导致该函数失效
 *
 * @example
 * //5
 * console.log(_.fval('3+2'));
 * //{name:"func.js"}
 * console.log(_.fval("{name:'func.js'}"));
 * //0
 * console.log(_.fval('1+x-b',{x:2,b:3}))
 *
 * @param expression 计算表达式
 * @param args 参数对象
 * @returns 表达式计算结果
 */
function fval(expression, args) {
    const ks = keys(args);
    const val = values(args);
    return Function(...ks, '"use strict";return ' + expression)(...val);
}

/**
 * 创建一个包含指定函数逻辑的包装函数并返回。该函数仅执行一次
 *
 * @example
 * //2748, undefined
 * let parseInt2 = _.once(parseInt);
 * console.log(parseInt2('abc',16),parseInt2('abc',16))
 *
 * @param fn 需要调用的函数
 * @returns 包装后的函数
 */
function once(fn) {
    let proxy = fn;
    return (...args) => {
        let rtn;
        if (proxy) {
            rtn = proxy(...args);
        }
        proxy = null;
        return rtn;
    };
}

/**
 * 传递v为参数执行interceptor函数，然后返回v。常用于函数链的过程调试，比如在filter后执行日志操作
 * <p>
 * 注意，一旦函数链执行了shortcut fusion，tap函数的执行会延迟到一个数组推导完成后执行
 * </p>
 *
 * @example
 * //shortut fusion中的tap只保留最后一个
 * _([1,2,3,4])
 * .map(v=>v*3).tap(v=>console.log(v))//被覆盖
 * .filter(v=>v%2===0).tap(v=>console.log(v))//会延迟，并输出结果[6,12]
 * .join('-')
 * .value()
 *
 * @param v
 * @param interceptor (v);如果v是引用值，改变v将影响后续函数流
 * @returns v
 */
function tap(v, interceptor) {
    interceptor(v);
    return v;
}

var functions = /*#__PURE__*/Object.freeze({
  __proto__: null,
  after: after,
  alt: alt,
  bind: bind,
  bindAll: bindAll,
  call: call,
  compose: compose,
  delay: delay,
  fval: fval,
  once: once,
  partial: partial,
  tap: tap
});

/* eslint-disable no-invalid-this */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/**
 * 函数链操作相关函数
 * @author holyhigh
 */
/**
 * 用于定义FuncChain对象并构造函数链
 * 注意，该类仅用于内部构造函数链
 */
class FuncChain {
    /**
     * @internal
     */
    constructor(v) {
        this._wrappedValue = v;
        this._chain = [];
    }
    /**
     * 惰性计算。执行函数链并返回计算结果
     * @example
     * //2-4
     * console.log(_([1,2,3,4]).map(v=>v+1).filter(v=>v%2===0).take(2).join('-').value())
     * //[1,2,2,1]
     * console.log(_(["{a:1,b:2}","{a:2,b:1}"]).map((v) => _.fval(v)).map(v=>[v.a,v.b]).join().value())
     * //[1,2,3,4]
     * console.log(_([1,2,3,4]).value())
     *
     * @returns 执行函数链返回的值
     */
    value() {
        let comprehension = isArrayLike(this._wrappedValue)
            ? createComprehension()
            : null;
        const maxChainIndex = this._chain.length - 1;
        return this._chain.reduce((acc, v, i) => {
            const params = [acc, ...v.params];
            if (comprehension) {
                let rs;
                const sig = buildComprehension(comprehension, v.fn, v.params);
                if (sig > 0 || (!sig && maxChainIndex === i)) {
                    rs = execComprehension(comprehension, acc);
                    if (comprehension.tap) {
                        comprehension.tap(rs);
                    }
                    comprehension = null;
                }
                if (sig > 1) {
                    comprehension = createComprehension(v.fn, v.params);
                }
                if (rs) {
                    return sig !== 1 ? rs : v.fn(...[rs, ...v.params]);
                }
                return acc;
            }
            if (CAN_COMPREHENSIONS.includes(v.fn.name)) {
                comprehension = createComprehension();
                return v.fn(...[acc, ...v.params]);
            }
            return v.fn(...params);
        }, this._wrappedValue);
    }
}
/**
 * 返回一个包裹了参数v的FuncChain对象，并隐式开始函数链。函数链可以链接Myfx提供的所有函数，如

```js
 _([1,2,3,4]).map(v=>v+1).filter(v=>v%2===0).take(2).join('-').value()
```

 * 函数链与直接调用方法的区别不仅在于可以链式调用，更在于函数链是基于惰性求值的。
 * 上式中必须通过显式调用`value()`方法才能获取结果，
 * 而只有在`value()`方法调用时整个函数链才进行求值。
 *
 *
 * 惰性求值允许FuncChain实现捷径融合(shortcut fusion) —— 一项基于已有函数对数组循环次数进行大幅减少以提升性能的优化技术。
 * 下面的例子演示了原生函数链和Myfx函数链的性能差异
 * @example
 * let ary = _.range(20000000);
console.time('native');
let c = 0;
let a = ary.map((v)=>{
    c++;
    return v+1;
  }).filter((v) => {
    c++;
    return v%2==0;
  })
  .reverse()
  .slice(1, 4)
console.timeEnd('native');
console.log(a, c, '次');//大约600ms左右，循环 40000000 次

//Myfx
ary = _.range(20000000);
console.time('Myfx');
let x = 0;
let targets = _(ary)
  .map((v) => {
    x++;
    return v+1;
  })
  .filter((v) => {
    x++;
    return v%2==0;
  })
  .reverse()
  .slice(1, 4)
  .value();
console.timeEnd('Myfx');
console.log(targets, x, '次');//大约0.5ms左右，循环 18 次
 *
 * @param v
 * @returns Myfx对象
 */
function myfx(v) {
    return v instanceof FuncChain ? v : new FuncChain(v);
}
const CAN_COMPREHENSIONS = [split.name, toArray.name, range.name];
function createComprehension(fn, params) {
    const comprehension = {
        forEachRight: false,
        goalSettings: [],
        range: [],
        reverse: false,
        count: undefined,
        tap: undefined,
        returnEl: false,
    };
    if (fn && params) {
        buildComprehension(comprehension, fn, params);
    }
    return comprehension;
}
function buildComprehension(comprehension, fn, params) {
    const fnName = fn.name;
    switch (fnName) {
        case map.name:
        case filter.name:
            if (size(comprehension.range) > 0 || isDefined(comprehension.count))
                return 2;
            let fn = params[0];
            if (!isFunction(fn)) {
                fn = iteratee(params[0]);
            }
            comprehension.goalSettings.push({ type: fnName, fn: fn });
            break;
        case reverse.name:
            if (size(comprehension.range) < 1) {
                comprehension.forEachRight = !comprehension.forEachRight;
            }
            else {
                comprehension.reverse = !comprehension.reverse;
            }
            break;
        case slice.name:
            if (size(comprehension.range) > 0)
                return 2;
            comprehension.range[0] = params[0];
            comprehension.range[1] = params[1];
            break;
        case tail.name:
            if (size(comprehension.range) > 0)
                return 2;
            comprehension.range[0] = 1;
            comprehension.range[1] = params[1];
            break;
        case take.name:
            if (isUndefined(comprehension.count) || params[0] < comprehension.count) {
                comprehension.count = params[0];
            }
            break;
        case first.name:
        case first.name:
            if (isUndefined(comprehension.count) || 1 < comprehension.count) {
                comprehension.count = 1;
                comprehension.returnEl = true;
            }
            break;
        case last.name:
            comprehension.count = 1;
            comprehension.returnEl = true;
            comprehension.forEachRight = true;
            break;
        case tap.name:
            comprehension.tap = params[0];
            break;
        default:
            return 1;
    }
    return 0;
}
function execComprehension(comprehension, collection) {
    const targets = [];
    let targetIndex = 0;
    if (!comprehension.count && comprehension.range.length > 0) {
        comprehension.count = comprehension.range[1] - comprehension.range[0];
    }
    const isReverse = comprehension.reverse;
    const count = comprehension.count;
    const gs = comprehension.goalSettings;
    const gsLen = gs.length;
    const range = comprehension.range;
    const hasRange = range.length > 0;
    const forEach = comprehension.forEachRight ? eachRight : each;
    forEach(collection, (v, k) => {
        let t = v;
        // before save target
        for (let i = 0; i < gsLen; i++) {
            const setting = gs[i];
            if (setting.type === map.name) {
                t = setting.fn(t, k);
            }
            else if (setting.type === filter.name) {
                if (!setting.fn(t, k)) {
                    return;
                }
            }
        } // for end
        if (hasRange && targetIndex++ < range[0])
            return;
        if (hasRange && targetIndex > range[1])
            return false;
        if (targets.length === count)
            return false;
        if (isReverse) {
            targets.unshift(t);
        }
        else {
            targets.push(t);
        }
    });
    if (targets.length === 1 && comprehension.returnEl) {
        return targets[0];
    }
    return targets;
}

/* eslint-disable max-len */
/**
 * 模板函数
 *
 * @packageDocumentation
 */
/**
 *
 * @author holyhigh
 */
/**
 * 使用FTL(Fun.js Template Language)编译字符串模板，并返回编译后的render函数
 *
 * ### 一个FTL模板由如下部分组成：
 * - **文本** 原样内容输出
 * - **注释** `[%-- 注释 --%]` 仅在模板中显示，编译后不存在也不会输出
 * - **插值** `[%= 插值内容 %]` 输出表达式的结果，支持js语法
 * - **混入** `[%@名称 {参数} %]` 可以混入模板片段。被混入的片段具有独立作用域，可以通过JSON格式的对象传递参数给片段
 * - **语句** `[% _.each(xxxx... %]` 原生js语句
 *
 * @example
 * let render = _.template("1 [%= a %] 3");
 * //1 4 3
 * console.log(render({a:4}))
 *
 * render = _.template("1 [% print(_.range(2,5)) %] 5");
 * //1 2,3,4 5
 * console.log(render())
 *
 * render = _.template("[%-- 注释1 --%] [%@mix {x:5}%] [%-- 注释2 --%]",{
 *  mixins:{
 *    mix:'<div>[%= x %]</div>'
 *  }
 * });
 * //<div>5</div>
 * console.log(render())
 *
 * @param string 模板字符串
 * @param options FTL参数
 * @param options.delimiters 分隔符，默认 ['[%' , '%]']
 * @param options.mixins 混入对象。\{名称:模板字符串\}
 * @param options.globals 全局变量对象，可以在任意位置引用。模板内置的全局对象有两个：`print(content)`函数、`_` 对象，Myfx的命名空间
 * @param options.stripWhite 是否剔除空白，默认false。剔除发生在编译期间，渲染时不会受到影响。剔除规则：如果一行只有一个FTL注释或语句，则该行所占空白会被移除。
 * @returns 编译后的执行函数。该函数需要传递一个对象类型的参数作为运行时参数
 * @since 1.0.0
 */
function template$1(string, options) {
    const delimiters = map(template$1.settings.delimiters, (d) => {
        const letters = replace(d, /\//gim, '');
        return map(letters, (l) => {
            return includes(ESCAPES, l) ? '\\' + l : l;
        }).join('');
    });
    options = toObject(options);
    const mixins = options.mixins;
    const stripWhite = options.stripWhite || false;
    const comment = delimiters[0] + template$1.settings.comment + delimiters[1];
    const interpolate = delimiters[0] + template$1.settings.interpolate + delimiters[1];
    const evaluate = delimiters[0] + template$1.settings.evaluate + delimiters[1];
    const mixin = delimiters[0] + template$1.settings.mixin + delimiters[1];
    const splitExp = new RegExp(`(?:${comment})|(?:${mixin})|(?:${interpolate})|(?:${evaluate})`, 'mg');
    // ///////////////////////////////----拆分表达式与文本
    // 1. 对指令及插值进行分段
    const tokens = parse(string, splitExp, mixins, stripWhite);
    // 2. 编译render函数
    const render = compile(tokens, options);
    return render;
}
const ESCAPES = ['[', ']', '{', '}', '$'];
/**
 * 模板设置对象
 */
template$1.settings = {
    /**
     * @defaultValue ['[%', '%]']
     */
    delimiters: ['[%', '%]'],
    interpolate: '=([\\s\\S]+?)',
    comment: '--[\\s\\S]+?--',
    mixin: '@([a-zA-Z_$][\\w_$]*)([\\s\\S]+?)',
    evaluate: '([\\s\\S]+?)',
};
function parse(str, splitExp, mixins, stripWhite) {
    let indicator = 0;
    let lastSegLength = 0;
    const tokens = [];
    const fullStack = [];
    let prevText = null;
    let prevNode = null;
    while (true) {
        const rs = splitExp.exec(str);
        if (rs == null) {
            const node = getText(str.substring(indicator + lastSegLength, str.length));
            if (prevText) {
                tokens.push(getText(prevText));
            }
            if (prevNode) {
                tokens.push(prevNode);
            }
            tokens.push(node);
            break;
        }
        else {
            let text = str.substring(indicator + lastSegLength, rs.index);
            if (prevText) {
                // check strip white
                if (stripWhite) {
                    const stripStart = prevText.replace(/\n\s*$/, '\n');
                    const stripEnd = text.replace(/^\s*\n/, '');
                    const prevTextNode = getText(stripStart);
                    if (stripStart.length !== prevText.length &&
                        stripEnd.length !== text.length) {
                        text = stripEnd;
                    }
                    if (prevNode?.comment) {
                        tokens.push(prevTextNode);
                    }
                    else {
                        // FTL标签之间都是\s\n，可以合并
                        const lastToken = last(tokens);
                        const merge1 = prevText.replace(/\n|\s/g, '');
                        const merge2 = lastToken
                            ? lastToken.source.replace(/\n|\s/g, '')
                            : true;
                        if (!merge1 && !merge2 && lastToken) {
                            lastToken.source = '';
                        }
                        else {
                            tokens.push(getText(prevText));
                        }
                        if (prevNode)
                            tokens.push(prevNode);
                    }
                }
                else {
                    tokens.push(getText(prevText));
                    if (prevNode)
                        tokens.push(prevNode);
                }
            }
            prevText = text;
            indicator = rs.index;
            const node = getText(text);
            fullStack.push(node);
            try {
                const node2 = parseNode(rs, mixins);
                prevNode = node2;
                fullStack.push(node2);
            }
            catch (error) {
                // 获取最近信息
                const recInfo = takeRight(fullStack, 5);
                const tipInfo = map(recInfo, 'source').join('') + rs[0];
                let tipIndicator = map(rs[0], () => '^').join('');
                const tipLineStartIndex = lastIndexOf(substring(str, 0, rs.index), '\n') + 1;
                tipIndicator = padStart(tipIndicator, rs.index - tipLineStartIndex + tipIndicator.length, ' ');
                console.error('...', tipInfo + '\n' + tipIndicator + '\n', error);
                return tokens;
            }
            lastSegLength = rs[0].length;
        }
    }
    return tokens;
}
function getText(str) {
    return {
        text: true,
        source: str,
    };
}
function parseNode(rs, mixins) {
    const parts = compact(rs);
    const src = parts[0];
    const modifier = src.replace(template$1.settings.delimiters[0], '')[0];
    switch (modifier) {
        case '-':
            return {
                comment: true,
                source: src,
            };
        case '=':
            return {
                interpolate: true,
                source: src,
                expression: parts[1],
            };
        case '@':
            const mixin = parts[1];
            if (!mixins || !mixins[mixin]) {
                throw new SyntaxError(`The mixin '${mixin}' does not exist, check if the options.mixins has been set`);
            }
            let paramters = trim(parts[2]);
            if (paramters) {
                const matcher = paramters.match(/\{(?:,?[a-zA-Z_$][a-zA-Z0-9_$]*(?::.*?)?)+\}/gm);
                if (!matcher) {
                    throw new SyntaxError(`Invalid mixin paramters '${parts[2]}', must be JSON form`);
                }
                paramters = matcher[0];
            }
            return {
                mixin: true,
                source: src,
                tmpl: mixins[mixin],
                paramters,
            };
        default:
            return {
                evaluate: true,
                source: src,
                expression: parts[1],
            };
    }
}
// 返回编译后的render函数
// 函数中不能出现异步代码，否则会导致render失败
// 默认全局变量 print() / _
function compile(tokens, options) {
    let funcStr = '';
    each(tokens, (token) => {
        if (token.comment)
            return;
        if (token.text) {
            funcStr += '\nprint(`' + token.source + '`);';
        }
        else if (token.interpolate) {
            funcStr += `\nprint(${token.expression});`;
        }
        else if (token.evaluate) {
            funcStr += '\n' + token.expression;
        }
        else if (token.mixin) {
            funcStr += `\nprint(_.template(${JSON.stringify(token.tmpl)},$options)(${token.paramters}));`;
        }
    });
    return (obj) => {
        let declarations = keys(obj).join(',');
        if (declarations) {
            declarations = '{' + declarations + '}';
        }
        let globalKeys = [];
        let globalValues = [];
        const paramAry = unzip(toPairs(options.globals));
        if (size(paramAry) > 0) {
            globalKeys = paramAry[0];
            globalValues = paramAry[1];
        }
        globalKeys.push('_');
        globalValues.push(myfx);
        const getRender = new Function(...globalKeys, '$options', `return function(${declarations}){
      const textQ=[];
      const print=(str)=>{
        textQ.push(str)
      };` +
            funcStr +
            ';return textQ.join("")}')(...globalValues, options);
        return getRender(obj);
    };
}

var template = /*#__PURE__*/Object.freeze({
  __proto__: null,
  template: template$1
});

/**
 * 使用高性能算法，将array结构数据变为tree结构数据
 * @example
 * //生成测试数据
 * function addChildren(count,parent){
 *  const data = [];
 *  const pid = parent?parent.id:null;
 *  const parentName = parent?parent.name+'-':'';
 *  _.each(_.range(0,count),i=>{
 *    const sortNo = _.randi(0,count);
 *    data.push({id:_.alphaId(),pid,name:parentName+i,sortNo})
 *  });
 *  return data;
 * }
 *
 * function genTree(depth,parents,data){
 *  _.each(parents,r=>{
 *    const children = addChildren(_.randi(1,4),r);
 *    if(depth-1>0){
 *      genTree(depth-1,children,data);
 *    }
 *    _.append(data,...children);
 *  });
 * }
 *
 * const roots = addChildren(2);
 * const data = [];
 * genTree(2,roots,data);
 * _.insert(data,0,...roots);
 *
 * const tree = _.arrayToTree(data,'id','pid',{attrMap:{text:'name'}});
 * _.walkTree(tree,(parentNode,node,chain)=>console.log('node',node.text,'sortNo',node.sortNo,'chain',_.map(chain,n=>n.name)));
 *
 *
 * @param array 原始数据集。如果非Array类型，返回空数组
 * @param idKey id标识
 * @param pidKey='pid' 父id标识
 * @param options 自定义选项
 * @param options.rootParentValue 根节点的parentValue，用于识别根节点。默认null
 * @param options.childrenKey 包含子节点容器的key。默认'children'
 * @param options.attrMap 转换tree节点时的属性映射，如\{text:'name'\}表示把array中一条记录的name属性映射为tree节点的text属性
 * @param options.sortKey 如果指定排序字段，则会在转换tree时自动排序。字段值可以是数字或字符等可直接进行比较的类型。性能高于转换后再排序
 * @returns 返回转换好的顶级节点数组或空数组
 * @since 1.0.0
 */
function arrayToTree(array, idKey = 'id', pidKey, options = {}) {
    if (!isArray(array))
        return [];
    const pk = pidKey || 'pid';
    const attrMap = options.attrMap;
    const hasAttrMap = !!attrMap && isObject(attrMap);
    const rootParentValue = get(options, 'rootParentValue', null);
    const childrenKey = options.childrenKey || 'children';
    const sortKey = options.sortKey;
    const hasSortKey = !!sortKey;
    const roots = [];
    const nodeMap = {};
    const sortMap = {};
    array.forEach((record) => {
        const nodeId = record[idKey || 'id'];
        nodeMap[nodeId] = record;
        if (hasSortKey) {
            const sortNo = record[sortKey];
            sortMap[nodeId] = [sortNo, sortNo]; // min,max
        }
        if (record[pk] === rootParentValue) {
            if (hasAttrMap) {
                each(attrMap, (v, k) => (record[k] = record[v]));
            }
            roots.push(record);
        }
    });
    array.forEach((record) => {
        const parentId = record[pk];
        const parentNode = nodeMap[parentId];
        if (parentNode) {
            let children = parentNode[childrenKey];
            if (!children) {
                children = parentNode[childrenKey] = [];
            }
            if (hasAttrMap) {
                each(attrMap, (v, k) => (record[k] = record[v]));
            }
            if (hasSortKey) {
                const [min, max] = sortMap[parentId];
                const sortNo = record[sortKey];
                if (sortNo <= min) {
                    children.unshift(record);
                    sortMap[parentId][0] = sortNo;
                }
                else if (sortNo >= max) {
                    children.push(record);
                    sortMap[parentId][1] = sortNo;
                }
                else {
                    const i = sortedIndexBy(children, { [sortKey]: sortNo }, sortKey);
                    children.splice(i, 0, record);
                }
            }
            else {
                children.push(record);
            }
        }
    });
    return hasSortKey ? sortBy(roots, sortKey) : roots;
}

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

/**
 * 以给定节点为根遍历所有子孙节点。深度优先
 * @example
 * //生成测试数据
 * function addChildren(count,parent){
 *  const data = [];
 *  const pid = parent?parent.id:null;
 *  const parentName = parent?parent.name+'-':'';
 *  _.each(_.range(0,count),i=>{
 *    const sortNo = _.randi(0,count);
 *    data.push({id:_.alphaId(),pid,name:parentName+i,sortNo})
 *  });
 *  return data;
 * }
 *
 * function genTree(depth,parents,data){
 *  _.each(parents,r=>{
 *    const children = addChildren(_.randi(1,4),r);
 *    if(depth-1>0){
 *      genTree(depth-1,children,data);
 *    }
 *    _.append(data,...children);
 *  });
 * }
 *
 * const roots = addChildren(2);
 * const data = [];
 * genTree(2,roots,data);
 * _.insert(data,0,...roots);
 * const tree = _.arrayToTree(data,'id','pid',{sortKey:'sortNo'});
 *
 * _.walkTree(tree,(node,parentNode,chain)=>console.log('node',node.name,'sortNo',node.sortNo,'chain',_.map(chain,n=>n.name)))
 *
 * @param treeNodes 一组节点或一个节点
 * @param callback (node,parentNode,chain,level)回调函数，如果返回false则中断遍历，如果返回-1则停止分支遍历
 * @param options 自定义选项
 * @param options.childrenKey 包含子节点容器的key。默认'children'
 * @since 1.0.0
 */
function walkTree(treeNodes, callback, options) {
    _walkTree(treeNodes, callback, options);
}
function _walkTree(treeNodes, callback, options, ...rest) {
    options = options || {};
    const parentNode = rest[0];
    const chain = rest[1] || [];
    const childrenKey = options.childrenKey || 'children';
    const data = isArrayLike(treeNodes) ? treeNodes : [treeNodes];
    for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const rs = callback(node, parentNode, chain, chain.length);
        if (rs === false)
            return;
        if (rs === -1)
            continue;
        if (!isEmpty(node[childrenKey])) {
            let nextChain = [node];
            if (parentNode) {
                nextChain = chain.concat(nextChain);
            }
            const rs = _walkTree(node[childrenKey], callback, options, node, nextChain);
            if (rs === false)
                return;
        }
    }
}

/**
 * 类似<code>findTreeNodes</code>，但会返回包含所有父节点的节点副本数组，已做去重处理。
 * 结果集可用于重新构建tree
 * @example
 * //生成测试数据
 * function addChildren(count,parent){
 *  const data = [];
 *  const pid = parent?parent.id:null;
 *  const parentName = parent?parent.name+'-':'';
 *  _.each(_.range(0,count),i=>{
 *    const sortNo = _.randi(1,4);
 *    data.push({id:_.alphaId(),pid,name:parentName+i,sortNo})
 *  });
 *  return data;
 * }
 *
 * function genTree(depth,parents,data){
 *  _.each(parents,r=>{
 *    const children = addChildren(_.randi(1,4),r);
 *    if(depth-1>0){
 *      genTree(depth-1,children,data);
 *    }
 *    _.append(data,...children);
 *  });
 * }
 *
 * const roots = addChildren(2);
 * const data = [];
 * genTree(2,roots,data);
 * _.insert(data,0,...roots);
 * const tree = _.arrayToTree(data,'id','pid',{sortKey:'sortNo'});
 *
 * _.each(_.filterTree(tree,node=>node.sortNo>1),node=>console.log(_.omit(node,'children','id','pid')))
 *
 *
 * @param treeNodes 一组节点或一个节点
 * @param predicate (node,parentNode,chain,level) 断言
 * <br>当断言是函数时回调参数见定义
 * <br>其他类型请参考 {@link utils!iteratee}
 * @param options 自定义选项
 * @param options.childrenKey 包含子节点容器的key。默认'children'
 * @returns 找到的符合条件的所有节点副本或空数组
 * @since 1.0.0
 */
function filterTree(treeNodes, predicate, options) {
    options = options || {};
    const callback = iteratee(predicate);
    const childrenKey = options.childrenKey || 'children';
    let nodes = [];
    walkTree(treeNodes, (n, p, c, l) => {
        const rs = callback(n, p, c, l);
        if (rs) {
            c.forEach((node) => {
                if (!includes(nodes, node)) {
                    nodes.push(node);
                }
            });
            nodes.push(n);
        }
    }, options);
    nodes = map(nodes, (item) => cloneWith(item, (v, k) => (k === childrenKey ? null : v)));
    return nodes;
}

/**
 * 查找给定节点及所有子孙节点中符合断言的第一个节点并返回
 * @example
 * //生成测试数据
 * function addChildren(count,parent){
 *  const data = [];
 *  const pid = parent?parent.id:null;
 *  const parentName = parent?parent.name+'-':'';
 *  _.each(_.range(0,count),i=>{
 *    const sortNo = _.randi(0,count);
 *    data.push({id:_.alphaId(),pid,name:parentName+i,sortNo})
 *  });
 *  return data;
 * }
 *
 * function genTree(depth,parents,data){
 *  _.each(parents,r=>{
 *    const children = addChildren(_.randi(2,5),r);
 *    if(depth-1>0){
 *      genTree(depth-1,children,data);
 *    }
 *    _.append(data,...children);
 *  });
 * }
 *
 * const roots = addChildren(2);
 * const data = [];
 * genTree(4,roots,data);
 * _.insert(data,0,...roots);
 * const tree = _.arrayToTree(data,'id','pid',{sortKey:'sortNo'});
 *
 * console.log(_.omit(_.findTreeNode(tree,node=>node.sortNo>2),'children','id','pid'))
 *
 *
 * @param treeNodes 一组节点或一个节点
 * @param predicate (node,parentNode,chain,level) 断言
 * <br>当断言是函数时回调参数见定义
 * <br>其他类型请参考 {@link utils!iteratee}
 * @param options 自定义选项
 * @param options.childrenKey 包含子节点容器的key。默认'children'
 * @returns 第一个匹配断言的节点或undefined
 * @since 1.0.0
 */
function findTreeNode(treeNodes, predicate, options) {
    const callback = iteratee(predicate);
    let node;
    walkTree(treeNodes, (n, p, c, l) => {
        const rs = callback(n, p, c, l);
        if (rs) {
            node = n;
            return false;
        }
    }, options);
    return node;
}

/**
 * 查找给定节点及所有子孙节点中符合断言的所有节点并返回
 * @example
 * //生成测试数据
 * function addChildren(count,parent){
 *  const data = [];
 *  const pid = parent?parent.id:null;
 *  const parentName = parent?parent.name+'-':'';
 *  _.each(_.range(0,count),i=>{
 *    const sortNo = _.randi(0,count);
 *    data.push({id:_.alphaId(),pid,name:parentName+i,sortNo})
 *  });
 *  return data;
 * }
 *
 * function genTree(depth,parents,data){
 *  _.each(parents,r=>{
 *    const children = addChildren(_.randi(2,5),r);
 *    if(depth-1>0){
 *      genTree(depth-1,children,data);
 *    }
 *    _.append(data,...children);
 *  });
 * }
 *
 * const roots = addChildren(2);
 * const data = [];
 * genTree(3,roots,data);
 * _.insert(data,0,...roots);
 * const tree = _.arrayToTree(data,'id','pid',{sortKey:'sortNo'});
 *
 * _.each(_.findTreeNodes(tree,node=>node.sortNo>2),node=>console.log(_.omit(node,'children','id','pid')))
 *
 *
 * @param treeNodes 一组节点或一个节点
 * @param predicate (node,parentNode,chain,level) 断言
 * <br>当断言是函数时回调参数见定义
 * <br>其他类型请参考 {@link utils!iteratee}
 * @param options 自定义选项
 * @param options.childrenKey 包含子节点容器的key。默认'children'
 * @returns 找到的符合条件的所有节点或空数组
 * @since 1.0.0
 */
function findTreeNodes(treeNodes, predicate, options) {
    const callback = iteratee(predicate);
    const nodes = [];
    walkTree(treeNodes, (n, p, c, l) => {
        const rs = callback(n, p, c, l);
        if (rs) {
            nodes.push(n);
        }
    }, options);
    return nodes;
}

/**
 * 对给定节点及所有子孙节点(同级)排序
 * @example
 * //生成测试数据
 * function addChildren(count,parent){
 *  const data = [];
 *  const pid = parent?parent.id:null;
 *  const parentName = parent?parent.name+'-':'';
 *  _.each(_.range(0,count),i=>{
 *    const sortNo = _.randi(0,9);
 *    data.push({id:_.alphaId(),pid,name:parentName+i,sortNo})
 *  });
 *  return data;
 * }
 *
 * function genTree(depth,parents,data){
 *  _.each(parents,r=>{
 *    const children = addChildren(_.randi(1,4),r);
 *    if(depth-1>0){
 *      genTree(depth-1,children,data);
 *    }
 *    _.append(data,...children);
 *  });
 * }
 *
 * const roots = addChildren(1);
 * const data = [];
 * genTree(2,roots,data);
 * _.insert(data,0,...roots);
 * let tree = _.arrayToTree(data,'id','pid');
 *
 * console.log('Before sort---------------');
 * _.walkTree(_.cloneDeep(tree),(parentNode,node,chain)=>console.log('node',node.name,'sortNo',node.sortNo))
 * _.sortTree(tree,(a,b)=>a.sortNo - b.sortNo);
 * console.log('After sort---------------');
 * _.walkTree(tree,(parentNode,node,chain)=>console.log('node',node.name,'sortNo',node.sortNo))
 *
 * @param treeNodes 一组节点或一个节点
 * @param comparator (a,b) 排序函数
 * @param options 自定义选项
 * @param options.childrenKey 包含子节点容器的key。默认'children'
 *
 * @since 1.0.0
 */
function sortTree(treeNodes, comparator, options) {
    options = options || {};
    const childrenKey = options.childrenKey || 'children';
    const data = isArray(treeNodes)
        ? treeNodes
        : [treeNodes];
    data.sort((a, b) => comparator(a, b));
    data.forEach((node) => {
        if (!isEmpty(node[childrenKey])) {
            sortTree(node[childrenKey], comparator);
        }
    });
}

var tree = /*#__PURE__*/Object.freeze({
  __proto__: null,
  arrayToTree: arrayToTree,
  closest: closest,
  filterTree: filterTree,
  findTreeNode: findTreeNode,
  findTreeNodes: findTreeNodes,
  sortTree: sortTree,
  walkTree: walkTree
});

/* eslint-disable require-jsdoc */
/* eslint-disable no-invalid-this */
/* eslint-disable max-len */
mixin(FuncChain, {
    ...str,
    ...num,
    ...datetime,
    ...is,
    ...object,
    ...collection,
    ...math,
    ...utils,
    ...functions,
    ...array,
    ...template,
    ...tree,
});
mixin(myfx, {
    ...str,
    ...num,
    ...datetime,
    ...is,
    ...object,
    ...collection,
    ...math,
    ...utils,
    ...functions,
    ...array,
    ...template,
    ...tree,
});
myfx.VERSION = '1.1.0'; //version
/**
 * 显式开启myfx的函数链，返回一个包裹了参数v的myfx链式对象。
 * <p>
 * 函数链使用惰性计算 —— 直到显示调用value()方法时，函数链才会进行计算并返回结果
 * </p>
 * @example
 * //3-5
 * console.log(_.chain([1,2,3,4]).map(v=>v+1).filter(v=>v%2!==0).take(2).join('-').value())
 *
 * @param v
 * @returns myfx对象
 */
myfx.chain = myfx;
//bind _
const ctx = globalThis;
if (ctx.myff) {
    setTimeout(function () {
        ctx.__f_prev = ctx._;
        ctx._ = ctx.myfx = myfx;
    }, 0);
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
        super(container, merge$1({
            move: {
                from: true,
                to: true,
            },
            scroll: true,
            sort: true
        }, opts));
        _Sortable_removeListenItems.set(this, void 0);
        if (size$1(this.ele) > 1 && !this.opts.group) {
            this.opts.group = "uii_sortable_" + alphaId$1();
        }
        each$2(this.ele, (el) => {
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
        const acceptFn = isFunction$3(moveFrom) ? moveFrom : () => !!moveFrom;
        //验证移入策略
        const activableContainers = flatMap$1(toContainers, (el) => {
            const valid = acceptFn(draggingItem, fromContainer, el);
            return valid ? el : [];
        });
        each$2(activableContainers, (el) => {
            el.setAttribute(ATTR_SORTABLE_ACTIVE, "1");
            if (toOpts.activeClass) {
                each$2(split$1(toOpts.activeClass || "", " "), (cls) => {
                    el.classList.toggle(cls, true);
                });
            }
        });
        __classPrivateFieldSet(this, _Sortable_removeListenItems, map$1(activableContainers, (con) => {
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
        each$2(toContainers, (el) => {
            el.removeAttribute(ATTR_SORTABLE_ACTIVE);
            if (opts.activeClass) {
                each$2(split$1(opts.activeClass || "", " "), (cls) => {
                    el.classList.toggle(cls, false);
                });
            }
        });
        each$2(__classPrivateFieldGet(this, _Sortable_removeListenItems, "f"), (fn) => {
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
const NextNodeMap = new Map();
const FilteredNodeMap = new Map();
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
            ? map$1(filteredItems, (el) => el.querySelector(opts.handle || ""))
            : toArray$3(filteredItems);
        const i = findIndex$1(handles, (handle) => handle.contains(t));
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
        const toOutFn = isFunction$3(moveTo) ? moveTo : () => !!moveTo;
        const moveMode = toOutFn(draggingItem, con);
        const sort = opts.sort;
        opts.scroll;
        opts.scrollSpeed || 10;
        let hitPosX = e.offsetX + con.scrollLeft, hitPosY = e.offsetY + con.scrollTop;
        saveCursor();
        let dragging = false;
        let ghostNode = null;
        let removeListenItems = null;
        NextNodeMap.set(draggingItem, draggingItem.nextElementSibling);
        FilteredNodeMap.set(con, filteredItems);
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
                        ghostNode.classList.add(...compact$1(split$1(ghostClass, " ")));
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
                        each$2(SORTABLE_GROUPS[group], ([sortable, ele]) => {
                            const filtered = reject$1(ele, (el) => el === container);
                            if (isEmpty$1(filtered))
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
                    each$2(SORTABLE_GROUPS[group], ([sortable, ele]) => {
                        const filtered = reject$1(ele, (el) => el === container);
                        if (isEmpty$1(filtered))
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
                // const list = PrevNodeMap.get(DraggingData.fromContainer) as NodeListOf<Element>;
                const nextSibling = NextNodeMap.get(DraggingData.item);
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
            const acceptFn = isFunction$3(moveFrom) ? moveFrom : () => !!moveFrom;
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
                // let toIndex = 0;
                const list = filter(FilteredNodeMap.get(container), x => x !== draggingItem);
                if (dir[0] === "t") {
                    container.insertBefore(draggingItem, list[0]);
                }
                else {
                    if (list.length !== container.children.length) {
                        last(list).after(draggingItem);
                    }
                    else {
                        container.appendChild(draggingItem);
                        // toIndex = container.children.length - 1;
                    }
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
    each$2(items, (item, i) => {
        item.style.position = "relative";
        if (item === draggingItem)
            return;
        item.style.pointerEvents = "initial";
        item._uiik_i = i;
        item.addEventListener("mouseenter", listener);
    });
    return () => {
        //解绑enter事件
        each$2(items, (item, i) => {
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
