/* uiik 1.5.0 @holyhigh2 https://github.com/holyhigh2/uiik */
//#region node_modules/myfx/dist/index.esm.mjs
var _globalThis$navigator;
/**
* myfx v2.0.0-beta.1
* A modular utility library with more utils, higher performance and simpler declarations ...
* https://github.com/holyhigh2/myfx
* (c) 2021-2026 @holyhigh2 may be freely distributed under the MIT license
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
	return typeof v === "function";
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
	const t = typeof v;
	if (t === "string") return v.length > 0;
	if (t !== "object" && t !== "function" || v === null) return false;
	if (v instanceof String) return v.length > 0;
	if (Array.isArray(v)) return true;
	const list = v;
	if ("length" in list) {
		var _Reflect$getPrototype;
		if (isFunction((_Reflect$getPrototype = Reflect.getPrototypeOf(list)) === null || _Reflect$getPrototype === void 0 ? void 0 : _Reflect$getPrototype.item)) return true;
		if (isFunction(list[Symbol.iterator])) return true;
	}
	return false;
}
/**
* 判断值是不是迭代器对象
*
* @example
* //true
* console.log(_.isIterator(new Map()))
* //true
* console.log(_.isIterator(new Map().values()))
* //false
* console.log(_.isIterator({a:1}))
*
* @param v
* @returns
* @since 1.10.0
*/
function isIterator(v) {
	return typeof v === "object" && v !== null && Symbol.iterator in v;
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
	return v instanceof Map || Object.prototype.toString.call(v) === "[object Map]";
}
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
	return v !== null && typeof v === "object";
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
	return v instanceof Set || Object.prototype.toString.call(v) === "[object Set]";
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
	return v instanceof String || Object.prototype.toString.call(v) === "[object String]";
}
/**
* 返回对象/Map的所有key数组
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
* @returns key数组
*/
function keys(obj) {
	if (obj === null || obj === void 0) return [];
	if (isMap(obj)) return Array.from(obj.keys());
	return Object.keys(obj);
}
/**
* 返回对象/Map的所有value数组
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
* @returns 值列表
*/
function values(obj) {
	if (isMap(obj)) return Array.from(obj.values());
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
* //[1, 3, 'a']
* console.log(_.toArray(new Map([[1,'a'],[3,'b'],['a',5]])).keys())
*
* @param collection 如果是Map/Object对象会转换为值列表
*
* @returns 转换后的数组对象
*/
function toArray(collection) {
	if (isArray(collection)) return collection.concat();
	if (isFunction(collection)) return [collection];
	if (isSet(collection)) return Array.from(collection);
	else if (isString(collection)) return collection.split("");
	else if (isArrayLike(collection)) return Array.from(collection);
	else if (isMap(collection)) return Array.from(collection.values());
	else if (isIterator(collection)) return Array.from(collection);
	else if (isObject(collection)) return values(collection);
	return [collection];
}
/**
* 向数组末尾追加一个或多个元素并返回
* 
* @effect 修改原数组
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
* @param array 数组，非数组返回空数组
* @param size 子数组长度
* @returns 拆分后的新数组
* @since 0.23.0
*/
function chunk(array, size = 1) {
	const rs = [];
	if (!Array.isArray(array)) return rs;
	const sizeNum = (size || 1) >> 0;
	for (let i = 0; i < array.length; i += sizeNum) rs.push(array.slice(i, i + sizeNum));
	return rs;
}
/**
* 返回参数列表中的第一个值,即<code>f(x) = x</code>。该函数可以用来为高阶函数提供数据如过滤列表或map，也用作默认迭代器
* @example
* //[1,2,4,'a','1']
* console.log(_.filter([0,1,false,2,4,undefined,'a','1','',null],_.identity))
* const list = [
*  {name:'a',value:1},
*  {name:'b',value:2},
*  {name:'c',value:3}
* ]
* //list
* console.log(_.map(list,_.identity))
*
* @param v
* @returns 第一个参数
* @since 0.17.0
*/
function identity(...args) {
	return args[0];
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
	if (Array.isArray(array)) return array.filter(identity);
	return toArray(array).filter(identity);
}
/**
* 对集合元素进行顺序遍历。
* 注意，object类型无法保证遍历顺序
*
* @example
* //1、2、3
* _.each(new Set([1,2,3]),console.log)
* //a、b、c
* _.each({'1':'a','2':'b','3':'c'},console.log)
* //1、{"a":1}、[2,3]
* _.each([1,{a:1},[2,3]],console.log)
* //h/o/l/y/h/i/g/h
* _.each('holyhigh',console.log)
* //遍历元素集合
* const x=[];_.each(document.body.children,v=>x.push(v));console.log(x)
*
* @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
* @param callback (value[,index|key[,collection][,i]]);回调函数，如果返回false会立即中断遍历
* @param startIndex 遍历起始索引
*/
function each(collection, callback, startIndex = 0) {
	if (collection == null) return;
	if (Array.isArray(collection)) {
		const size = collection.length;
		if (size === 0 || startIndex >= size) return;
		for (let i = startIndex; i < size; i++) if (callback(collection[i], i, collection, i) === false) return;
		return;
	}
	if (typeof collection === "string") {
		const size = collection.length;
		if (size === 0 || startIndex >= size) return;
		for (let i = startIndex; i < size; i++) if (callback(collection[i], i, collection, i) === false) return;
		return;
	}
	if (collection instanceof Set) {
		const size = collection.size;
		if (size === 0 || startIndex >= size) return;
		const values = collection.values();
		for (let i = startIndex; i < size; i++) if (callback(values.next().value, i, collection, i) === false) return;
		return;
	}
	if (collection instanceof Map) {
		const size = collection.size;
		if (size === 0 || startIndex >= size) return;
		const keys = collection.keys();
		const values = collection.values();
		for (let i = startIndex; i < size; i++) if (callback(values.next().value, keys.next().value, collection, i) === false) return;
		return;
	}
	const keys = Object.keys(collection);
	const size = keys.length;
	if (size === 0 || startIndex >= size) return;
	for (let i = startIndex; i < size; i++) {
		const k = keys[i];
		if (callback(collection[k], k, collection, i) === false) return;
	}
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
	const argc = arrays.length;
	if (argc < 1) return [];
	if (argc === 1) {
		const only = arrays[0];
		if (Array.isArray(only)) {
			const size = only.length;
			const copy = [];
			for (let j = 0; j < size; j++) copy.push(only[j]);
			return copy;
		}
	}
	let rs = [];
	for (let i = 0; i < argc; i++) {
		const item = arrays[i];
		if (Array.isArray(item)) for (let j = 0, size = item.length; j < size; j++) rs.push(item[j]);
		else if (isArrayLike(item)) each(item, (v) => rs.push(v));
		else rs.push(item);
	}
	return rs;
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
* @param params (...arrays[,identifier(v)]) 
* arrays - 1-n个数组或arraylike对象，非arraylike参数会被忽略; 
* identifier - 标识函数，用来对每个元素返回唯一标识，标识相同的值会认为相等。使用<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Same-value-zero_equality">SameValueZero</a> 算法进行值比较。如果为空，直接使用值自身比较
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
	if (list.length < 1) return list;
	const len = list.length;
	const kvMap = /* @__PURE__ */ new Map();
	for (let j = 0; j < len; j++) {
		const ary = list[j];
		const localMap = /* @__PURE__ */ new Map();
		for (let i = 0; i < ary.length; i++) {
			const v = ary[i];
			const id = comparator ? comparator(v) : v;
			let entry = kvMap.get(id);
			if (!entry) {
				entry = {
					i: 0,
					v
				};
				kvMap.set(id, entry);
			}
			if (!localMap.get(id)) {
				entry.i++;
				localMap.set(id, true);
			}
		}
	}
	const rs = [];
	kvMap.forEach((entry) => {
		if (entry.i < len) rs.push(entry.v);
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
* @param start 起始索引，包含
* @param end 终止索引，不包含
* @returns 填充后的新数组
*/
function fill(array, value, start = 0, end) {
	const rs = toArray(array);
	if (end && end > 0 && rs.length < end) rs.length = end;
	rs.fill(value, start, end);
	return rs;
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
	return v === void 0;
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
	let chain = path;
	if (isArray(chain)) chain = chain.join(".");
	let rs = chain + "";
	if (rs.includes("[")) rs = rs.replace(/\[(['"])?([^\]'"]+)\1?\]/gm, ".$2");
	if (rs[0] === ".") rs = rs.substring(1);
	return rs.split(".");
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
* @param defaultValue 如果path未定义，返回默认值
* @returns 属性值或默认值
*/
function get(obj, path, defaultValue) {
	if (!isObject(obj)) return defaultValue;
	if (!isArray(path) || path.length === 1 && (path = path[0]) !== void 0) {
		let v = obj[path];
		if (v !== void 0) return v;
	}
	const chain = toPath(path);
	let target = obj;
	for (let i = 0; i < chain.length; i++) {
		const seg = chain[i];
		target = target[seg];
		if (!target) break;
	}
	if (target === void 0) target = defaultValue;
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
function eq$1(a, b) {
	return a === b || Number.isNaN(a) && Number.isNaN(b);
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
	return v === null || v === void 0;
}
/**
* 判断值是不是Node的实例
*
* @example
* //true
* console.log(_.isNode(document.body.attributes[0]))
* //true
* console.log(_.isNode(document))
*
* @param v
* @returns
* @since 1.5.0
*/
function isNode(v) {
	return typeof v === "object" && v instanceof (globalThis.Node || Object);
}
/**
* 检测props对象中的所有属性是否在object中存在并使用自定义比较器对属性值进行对比。可以用于对象的深度对比。
* 当comparator参数是默认值时，与<code>isMath</code>函数相同
*
* @example
* let target = {a:{x:1,y:2},b:1}
* //true
* console.log(_.isMatchWith(target,{b:1},_.eq))
* //false
* console.log(_.isMatchWith(target,{b:'1'},_.eq))
*
* target = {a:null,b:0}
* //true
* console.log(_.isMatchWith(target,{a:'',b:'0'},(a,b)=>_.isEmpty(a) && _.isEmpty(b)?true:a==b))
*
* @param target 如果不是对象类型，返回false
* @param props 对比属性对象，如果是nil，返回true
* @param comparator 比较器。参数(object[k],props[k],k,object,props)，返回true表示匹配
* @returns 匹配所有props返回true
* @since 0.18.1
*/
function isMatchWith(target, props, comparator) {
	if (isNil(props)) return true;
	const ks = Object.keys(props);
	if (!isObject(target)) return false;
	let rs = true;
	for (let i = ks.length; i--;) {
		const k = ks[i];
		const v1 = target[k];
		const v2 = props[k];
		if (isObject(v1) && isObject(v2) && !isNode(v1) && !isNode(v2) && !isFunction(v1) && !isFunction(v2)) {
			if (!isMatchWith(v1, v2, comparator)) {
				rs = false;
				break;
			}
		} else if (!comparator(v1, v2, k, target, props)) {
			rs = false;
			break;
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
var toPath_default = toPath;
var iterateeCache = /* @__PURE__ */ new WeakMap();
var primitiveCache = /* @__PURE__ */ new Map();
/**
* 创建一个函数，函数类型根据参数值类型而定。创建的函数常用于迭代回调，在Func.js内部被大量使用
*
* @example
* const libs = [
*  {name:'func.js',platform:['web','nodejs'],tags:{utils:true},js:true},
*  {name:'juth2',platform:['web','java'],tags:{utils:false,middleware:true},js:false},
*  {name:'soya2d',platform:['web'],tags:{utils:true},js:false}
* ];
*
* //[{func.js...}] 如果参数是object，返回_.matcher
* console.log(_.filter(libs,_.iteratee({tags:{utils:true},js:true})))
* //[func.js,juth2,soya2d] 如果参数是字符串，返回_.prop
* console.log(_.map(libs,_.iteratee('name')))
* //[true,false,true] 如果参数是数组，内容会转为path，并返回_.prop
* console.log(_.map(libs,_.iteratee(['tags','utils'])))
* //[1,3,5] 如果参数是函数，返回这个函数
* console.log(_.filter([1,2,3,4,5],_.iteratee(n=>n%2)))
* //[1,2,4,'a','1'] 无参返回_.identity
* console.log(_.filter([0,1,false,2,4,undefined,'a','1','',null],_.iteratee()))
*
*
* @param value 迭代模式
* <br>当value是字符串类型时，返回_.prop
* <br>当value是对象类型时，返回_.matcher
* <br>当value是数组类型时，内容会转为path，并返回_.prop
* <br>当value是函数时，返回这个函数
* <br>当value未定义时，返回_.identity
* <br>其他类型返回f() = false
* @returns 不同类型的返回函数
* @since 0.17.0
*/
function iteratee(value) {
	if (isUndefined(value)) return identity;
	if (isFunction(value)) return value;
	if (isString(value)) {
		const cached = primitiveCache.get(value);
		if (cached) return cached;
		const fn = prop(value);
		primitiveCache.set(value, fn);
		return fn;
	}
	if (isArray(value)) {
		const key = value.join("\0");
		const cached = primitiveCache.get(key);
		if (cached) return cached;
		const fn = prop(toPath_default(value));
		primitiveCache.set(key, fn);
		return fn;
	}
	if (isObject(value)) {
		const cached = iterateeCache.get(value);
		if (cached) return cached;
		const fn = matcher(value);
		iterateeCache.set(value, fn);
		return fn;
	}
	return () => false;
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
* @param array 数组，非数组返回-1
* @param predicate (value[,index[,array]]);断言
* <br>当断言是函数时回调参数见定义
* <br>其他类型请参考 {@link utils!iteratee}
* @param fromIndex 从0开始的起始索引，设置该参数可以减少实际遍历次数。默认0
* @returns 第一个匹配断言的元素索引或-1
*/
function findIndex(array, predicate, fromIndex) {
	if (!Array.isArray(array)) return -1;
	let rs = -1;
	let fromIndexNum = fromIndex || 0;
	const itee = iteratee(predicate);
	for (let i = fromIndexNum; i < array.length; i++) {
		const v = array[i];
		if (itee(v, i, array)) {
			rs = i + fromIndexNum;
			break;
		}
	}
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
	if (isNil(collection)) return 0;
	if (collection.length) return collection.length;
	if (isMap(collection) || isSet(collection)) return collection.size;
	if (isObject(collection)) return Object.keys(collection).length;
	return 0;
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
* @param array 数组，非数组返回-1
* @param predicate (value[,index[,array]]);断言
* <br>当断言是函数时回调参数见定义
* <br>其他类型请参考 {@link utils!iteratee}
* @param fromIndex 从集合长度-1开始的起始索引。设置该参数可以减少实际遍历次数
* @returns 最后一个匹配断言的元素索引或-1
* @since 0.19.0
*/
function findLastIndex(array, predicate, fromIndex) {
	if (!Array.isArray(array)) return -1;
	let rs = -1;
	let fromIndexNum = fromIndex !== null && fromIndex !== void 0 ? fromIndex : size(array) - 1;
	const itee = iteratee(predicate);
	for (let i = fromIndexNum; i >= 0; i--) {
		const v = array[i];
		if (itee(v, i, array)) {
			rs = i;
			break;
		}
	}
	return rs;
}
var MAX_DEPTH$2 = 100;
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
* @param depth 嵌套深度
* @returns 扁平化后的新数组
*/
function flat(array, depth = 1) {
	if (array == null) return [];
	if (depth < 1) return Array.from(array);
	const safeDepth = Math.min(depth, MAX_DEPTH$2);
	const result = [];
	const stack = [];
	const inputArr = Array.from(array);
	for (let i = inputArr.length - 1; i >= 0; i--) stack.push({
		val: inputArr[i],
		depth: safeDepth
	});
	while (stack.length > 0) {
		const { val, depth: currentDepth } = stack.pop();
		if (Array.isArray(val)) {
			if (currentDepth > 0) for (let i = val.length - 1; i >= 0; i--) stack.push({
				val: val[i],
				depth: currentDepth - 1
			});
			else result.push(val);
		} else if (isSet(val)) {
			if (currentDepth > 0) {
				const childArr = Array.from(val);
				for (let i = childArr.length - 1; i >= 0; i--) stack.push({
					val: childArr[i],
					depth: currentDepth - 1
				});
			} else result.push(val);
		} else result.push(val);
	}
	return result;
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
	return v instanceof Number || Object.prototype.toString.call(v) === "[object Number]";
}
/**
* 向数组中指定位置插入一个或多个元素并返回
* 
* @effect 修改原数组
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
	if (!isNumber(index) || index < 0) index = 0;
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
* @param params (...arrays[,identifier(v)]) 
* arrays - 1-n个数组或arraylike对象，非arraylike参数会被忽略; 
* identifier - 标识函数，用来对每个元素返回唯一标识，标识相同的值会认为相等。使用<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Same-value-zero_equality">SameValueZero</a> 算法进行值比较。如果为空，直接使用值自身比较
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
	if (list.length < 1) return list;
	const len = list.length;
	list.sort((a, b) => a.length - b.length);
	const kvMap = /* @__PURE__ */ new Map();
	let idLength = 0;
	for (let i = list[0].length; i--;) {
		const v = list[0][i];
		const id = comparator ? comparator(v) : v;
		if (!kvMap.get(id)) {
			kvMap.set(id, {
				i: 1,
				v
			});
			idLength++;
		}
	}
	for (let j = 1; j < len; j++) {
		const ary = list[j];
		const localMap = /* @__PURE__ */ new Map();
		let localMatchedCount = 0;
		for (let i = 0; i < ary.length; i++) {
			const v = ary[i];
			const id = comparator ? comparator(v) : v;
			const entry = kvMap.get(id);
			if (entry && !localMap.get(id)) {
				entry.i++;
				localMap.set(id, true);
				localMatchedCount++;
				if (localMatchedCount === idLength) break;
			}
		}
	}
	const rs = [];
	kvMap.forEach((entry) => {
		if (entry.i === len) rs.push(entry.v);
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
* @param array 数组，非数组返回空字符串
* @param separator 分隔符
* @returns 拼接字符串
*/
function join(array, separator = ",") {
	if (!Array.isArray(array)) return "";
	return array.join(separator !== null && separator !== void 0 ? separator : ",");
}
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
	if (v === void 0 || v === null) return NaN;
	return Number(v);
}
/**
* 删除数组末尾或指定索引的一个元素并返回被删除的元素
* 
* @effect 修改原数组
* @example
* //3, [1, 2]
* let ary = [1,2,3];
* console.log(_.pop(ary),ary)
* //{a: 1}, [{"a":2},{"a":3}]
* ary = [{a:1},{a:2},{a:3}];
* console.log(_.pop(ary,0),ary)
*
* @param array 数组对象。如果非数组类型会直接返回null
* @param index 要删除元素的索引。默认删除最后一个元素
* @returns 被删除的值或null
*/
function pop(array, index = -1) {
	var _index;
	index = (_index = index) !== null && _index !== void 0 ? _index : -1;
	let rs = null;
	if (Array.isArray(array)) {
		var _array$pop;
		const i = toNumber(index);
		if (i > -1) {
			rs = array.splice(i, 1);
			if (rs.length < 1) rs = null;
			else rs = rs[0];
		} else rs = (_array$pop = array.pop()) !== null && _array$pop !== void 0 ? _array$pop : null;
	}
	return rs;
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
* @param array 数组，非数组返回空数组
* @param begin 切片起始下标，包含下标位置元素，默认0
* @param end 切片结束下标，<b>不包含</b>下标位置元素
* @returns 切片元素组成的新数组
*/
function slice(array, begin = 0, end) {
	if (!Array.isArray(array)) return [];
	return array.slice(begin || 0, end);
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
* @param fromIndex 从集合的fromIndex 索引处开始查找。如果集合是map/object对象，无效
* @returns 如果包含返回true否则返回false
*/
function includes(collection, value, fromIndex = 0) {
	let rs = false;
	fromIndex = fromIndex || 0;
	if (isString(collection)) return collection.includes(value, fromIndex);
	if (isArrayLike(collection) && fromIndex > 0) collection = Array.isArray(collection) ? collection.slice(fromIndex) : slice(toArray(collection), fromIndex);
	each(collection, (v) => {
		if (eq$1(v, value)) {
			rs = true;
			return false;
		}
	});
	return rs;
}
/**
* 删除数组中断言结果为true的元素并返回被删除的元素
* @effect 修改原数组
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
	if (!isArray(array)) return rs;
	const itee = iteratee(predicate);
	let i = 0;
	for (let l = 0; l < array.length; l++) {
		const item = array[l];
		if (itee(item, l, array)) rs.push(item);
		else array[i++] = item;
	}
	array.length = i;
	return rs;
}
/**
* 与without相同，但会修改原数组
* @effect 修改原数组
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
* 生成一个由(包含)start到(不包含)end的数字元素组成的数组。
* 根据参数个数不同，分为三种签名
* <pre><code class="language-javascript">
* _.range(end);
* _.range(start,end);
* _.range(start,end,step);
* </code></pre>
*
* @example
* //[0, 1, 2, 3, 4]
* console.log(_.range(5))
* //[0, -1, -2, -3, -4]
* console.log(_.range(-5))
* //[0, -0.5, -1, -1.5, -2, -2.5, -3, -3.5, -4, -4.5]
* console.log(_.range(0,-5,0.5))
* //[-5, -4, -3, -2, -1, 0]
* console.log(_.range(-5,1))
*
* @param start 起始数
* @param end 结束数
* @param step 步长
* @returns 数字数组
*/
function range(start = 0, end, step = 1) {
	let startNum = 0;
	let endNum;
	let stepNum = 1;
	if (isUndefined(end)) endNum = start;
	else {
		startNum = start;
		endNum = end;
		stepNum = Math.abs(step) || 1;
	}
	const maxCount = Math.ceil(Math.abs(endNum - startNum) / stepNum);
	const rs = [];
	if (endNum > startNum) for (let i = startNum; rs.length < maxCount && i < endNum; i += stepNum) rs.push(i);
	else if (endNum < startNum) for (let i = startNum; rs.length < maxCount && i > endNum; i -= stepNum) rs.push(i);
	return rs;
}
/**
* 对数组元素位置进行颠倒，返回改变后的数组。
*
*  @example
* //[3, 2, 1]
* console.log(_.reverse([1, 2, 3]))
*
* @param array 数组，类数组或Set
* @returns 颠倒后的新数组
*/
function reverse(array) {
	return toArray(array).reverse();
}
/**
* 同<code>sortedIndex</code>，但支持自定义回调用来获取对比值
* @example
* //2
* console.log(_.sortedIndexBy([{a:1},{a:2},{a:3}], {a:2.5},'a'))
*
* @param array 对象属性标识符数组
* @param value 需要插入数组的值
* @param itee (value)回调函数，返回排序对比值。默认 identity
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
		const mid = parseInt((left + right) / 2 + "");
		if (cb(array[mid]) < value) {
			left = mid + 1;
			index = left;
		} else right = mid;
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
* 返回一个新数组，该数组中的每个元素是调用一次callback函数后的返回值
*
* @example
* const libs = [
*  {name:'func.js',platform:['web','nodejs'],tags:{utils:true},js:false},
*  {name:'juth2',platform:['web','java'],tags:{utils:false,middleware:true},js:true},
*  {name:'soya2d',platform:['web'],tags:{utils:true},js:true}
* ];
*
* //[2,4,6]
* console.log(_.map(new Set([1,2,3]),v => v*2))
* //[1,2,3]
* console.log(_.map({'1':'a','2':'b','3':'c'},(v,k)=>k))
* //[true,false,false]
* console.log(_.map([1,{a:1},[2,3]],v => _.isNumber(v)))
* //["H", "O", "L", "Y", "H", "I", "G", "H"]
* console.log(_.map('holyhigh',v => String.fromCharCode(v.charCodeAt(0)-32)))
* //[true,false,true]
* console.log(_.map(libs,'tags.utils'))
* //["func.js", "juth2", "soya2d"]
* console.log(_.map(libs,'name'))
* //[1,2,3]
* console.log(_.map({a:1,b:2,c:3}))
*
* @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
* @param iteratee (value[,index|key[,collection]]) 回调函数，返回值作为新数组元素。
* 如果是字符串，表示返回集中的对象类型的元素的key值
* @returns 映射值的新数组
*/
function map(collection, iteratee$4 = identity) {
	const rs = [];
	const cb = iteratee(iteratee$4);
	each(collection, (v, k, c) => {
		const r = cb(v, k, c);
		rs.push(r);
	});
	return rs;
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
* @param params (...arrays[,identifier(v)]) 
* arrays - 1-n个数组或arraylike对象，非arraylike参数会被忽略; 
* identifier - 标识函数，用来对每个元素返回唯一标识，标识相同的值会认为相等。使用<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Same-value-zero_equality">SameValueZero</a> 算法进行值比较。如果为空，直接使用值自身比较
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
	list = list.filter((v) => isArrayLike(v) || isArray(v) || isSet(v));
	if (list.length < 1) return list;
	let rs;
	if (comparator) {
		const kvMap = /* @__PURE__ */ new Map();
		flat(list).forEach((v) => {
			const id = comparator(v);
			if (!kvMap.get(id)) kvMap.set(id, v);
		});
		rs = map(kvMap, (v) => v);
	} else rs = Array.from(new Set(flat(list)));
	return rs;
}
/**
* 对数组内的值进行去重
* @example
* // [1,2,4,"a","1",null]
* console.log(_.unique([1,2,2,4,4,'a','1','a',null,null]))
*
* @param array 数组，非数组返回空数组
* @returns 转换后的新数组对象
*/
function uniq(array) {
	if (!Array.isArray(array)) return [];
	return Array.from(new Set(array));
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
* @param itee (value,index) 筛选函数，返回需要对比的值。默认identity
* <br>当iteratee是函数时回调参数见定义
* <br>其他类型请参考 {@link utils.iteratee}
* @returns 去重后的新数组对象
* @since 1.0.0
*/
function uniqBy(array, itee) {
	const cb = iteratee(itee || identity);
	const keyMap = /* @__PURE__ */ new Map();
	const rs = [];
	each(array, (v, k) => {
		const key = cb(v, k);
		if (keyMap.get(key)) return;
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
			if (!row) row = rs[rowIndex] = new Array(len);
			row[colIndex] = el;
		});
	});
	return rs;
}
/**
* 返回一个新数组，数组内容由集合内所有断言结果为真的元素组成
*
* @example
* const libs = [
*  {name:'func.js',platform:['web','nodejs'],tags:{utils:true},js:false},
*  {name:'juth2',platform:['web','java'],tags:{utils:false,middleware:true},js:true},
*  {name:'soya2d',platform:['web'],tags:{utils:true},js:true}
* ];
*
* //[]
* console.log(_.filter())
* //[1,3]
* console.log(_.filter([1,2,3,4],v=>v%2===1))
* //[1]
* console.log(_.filter(['a','b','c',1],_.isNumber))
* //[1,2]
* console.log(_.filter({a:1,b:2,c:'3'},_.isNumber))
* //[f、s]
* console.log(_.filter(libs,'tags.utils'))
* //[j、s]
* console.log(_.filter(libs,{js:true}))
* //[] key不支持路径解析
* console.log(_.filter(libs,{'platform[0]':'web'}))
*
* @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
* @param predicate (value[,index|key[,collection]]) 断言
* <br>当断言是函数时回调参数见定义
* <br>其他类型请参考 {@link utils!iteratee}
* @returns 由通过断言的元素组成的新数组
*/
function filter(collection, predicate) {
	const rs = [];
	const callback = iteratee(predicate);
	each(collection, (v, k, c) => {
		if (callback(v, k, c)) rs.push(v);
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
			if (!group) group = rs[i] = new Array(size);
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
* @param params (...arrays[,iteratee(group)]) 
* arrays - 1-n个数组或arraylike对象，非arraylike参数会被忽略; 
* iteratee - 回调函数，返回组合后的分组值。默认使用<code>identity</code>函数
* 
* @returns 重新分组后的新数组
* @since 1.0.0
*/
function zipWith(...params) {
	let itee = params[params.length - 1];
	const arys = params;
	if (!isFunction(itee)) itee = identity;
	else pop(arys);
	return map(zip(...arys), (group) => itee(group));
}
/**
* 创建一个统计对象，对象的key是iteratee返回的值，对应的值是相同key出现的次数
* @example
* //{true: 5, false: 4}
* console.log(_.countBy([1,'a',3,'b',5,'c',7,'d',9],_.isNumber))
* const users = [
*  {name:'zhangsan',sex:'m',age:33},
*  {name:'lisi',sex:'f',age:21},
*  {name:'wangwu',sex:'m',age:25},
*  {name:'zhaoliu',sex:'m',age:44},
* ]
* //{m: 3, f: 1} 性别分布统计
* console.log(_.countBy(users,u=>u.sex))
* //{20: 2, 30: 1, 40: 1} 年龄段分布统计
* console.log(_.countBy(users,u=>(u.age/10>>0)*10))
*
* @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
* @param iteratee (value) 回调函数，返回统计key
* @returns 统计对象
* @since 1.0.0
*/
function countBy(collection, itee = identity) {
	const stat = {};
	const cb = iteratee(itee || identity);
	each(collection, (el) => {
		const key = cb(el);
		if (stat[key] === void 0) stat[key] = 0;
		stat[key]++;
	});
	return stat;
}
/**
* 对集合元素进行顺序遍历，与 forEach 不同在于遍历顺序是从右到左
* 注意，object类型无法保证遍历顺序
*
* @example
* //3、2、1
* _.eachRight(new Set([1,2,3]),console.log)
* //c、b、a
* _.eachRight({'1':'a','2':'b','3':'c'},console.log)
* //[2,3]、{"a":1}、1
* _.eachRight([1,{a:1},[2,3]],console.log)
* //hgihyloh
* _.eachRight('holyhigh',console.log)
*
* @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
* @param callback (value[,index|key[,collection]]);回调函数，如果返回false会立即中断遍历
*/
function eachRight(collection, callback) {
	let values;
	let keys;
	if (isString(collection) || isArrayLike(collection)) {
		let size = collection.length;
		while (size--) if (callback(collection[size], size, collection, size) === false) return;
	} else if (isSet(collection)) {
		let size = collection.size;
		values = Array.from(collection);
		while (size--) if (callback(values[size], size, collection, size) === false) return;
	} else if (isMap(collection)) {
		let size = collection.size;
		keys = collection.keys();
		values = collection.values();
		keys = Array.from(keys);
		values = Array.from(values);
		while (size--) if (callback(values[size], keys[size], collection, size) === false) return;
	} else if (isObject(collection)) {
		keys = Object.keys(collection);
		let size = keys.length;
		while (size--) {
			const k = keys[size];
			if (callback(collection[k], k, collection, size) === false) return;
		}
	}
}
/**
* 对集合内的所有元素进行断言，直到第一个返回false的元素结束。如果所有元素断言都为真返回true
*
* @example
* const libs = [
*  {name:'func.js',platform:['web','nodejs'],tags:{utils:true},js:true},
*  {name:'juth2',platform:['web','java'],tags:{utils:false,middleware:true},js:false},
*  {name:'soya2d',platform:['web'],tags:{utils:true},js:true}
* ];
*
* //true
* console.log(_.every([]))
* //true
* console.log(_.every([1,3,5],v=>v%2===1))
* //false
* console.log(_.every(['a','b','c',1],_.isNumber))
* //false
* console.log(_.every(libs,'tags.utils'))
* //false
* console.log(_.every(libs,{js:true}))
* //false key不支持路径解析
* console.log(_.every(libs,{'platform[0]':'web'}))
*
* @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
* @param predicate (value[,index|key[,collection]]) 断言
* <br>当断言是函数时回调参数见定义
* <br>其他类型请参考 {@link utils!iteratee}
* @returns 全部通过返回true，否则false。对于一个空集合，会返回true
*/
function every(collection, predicate) {
	let rs = true;
	const callback = iteratee(predicate);
	each(collection, (v, k, c) => {
		if (!callback(v, k, c)) {
			rs = false;
			return false;
		}
	});
	return rs;
}
/**
* 对集合内的所有元素进行断言并返回第一个匹配的元素
*
* @example
* const libs = [
*  {name:'func.js',platform:['web','nodejs'],tags:{utils:true},js:false},
*  {name:'juth2',platform:['web','java'],tags:{utils:false,middleware:true},js:true},
*  {name:'soya2d',platform:['web'],tags:{utils:true},js:true}
* ];
*
* //1
* console.log(_.find(['a','b','c',1,3,6],_.isNumber))
* //holyhigh
* console.log(_.find({a:1,b:true,c:'holyhigh',d:'func.js'},_.isString))
* //{f}
* console.log(_.find(libs,'tags.utils'))
* //{j}
* console.log(_.find(libs,{js:true}))
* //undefined key不支持路径解析
* console.log(_.find(libs,{'tags.utils':false}))
*
* @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
* @param predicate (value[,index|key[,collection]]) 断言
* <br>当断言是函数时回调参数见定义
* <br>其他类型请参考 {@link utils!iteratee}
* @returns 第一个匹配断言的元素或undefined
*/
function find(collection, predicate) {
	const callback = iteratee(predicate);
	let rs;
	each(collection, (v, k, c) => {
		if (callback(v, k, c)) {
			rs = v;
			return false;
		}
	});
	return rs;
}
/**
* 对集合内的所有元素进行断言并返回最后一个匹配的元素
*
* @example
* const libs = [
*  {name:'func.js',platform:['web','nodejs'],tags:{utils:false},js:false},
*  {name:'juth2',platform:['web','java'],tags:{utils:false,middleware:true},js:true},
*  {name:'soya2d',platform:['web'],tags:{utils:true},js:true}
* ];
*
* //6
* console.log(_.findLast(['a','b','c',1,3,6],_.isNumber))
* //func.js
* console.log(_.findLast({a:1,b:true,c:'holyhigh',d:'func.js'},_.isString))
* //{s}
* console.log(_.findLast(libs,'tags.utils'))
* //{s}
* console.log(_.findLast(libs,{js:true}))
* //undefined key不支持路径解析
* console.log(_.findLast(libs,{'tags.utils':false}))
*
* @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
* @param predicate (value[,index|key[,collection]]) 断言
* <br>当断言是函数时回调参数见定义
* <br>其他类型请参考 {@link utils!iteratee}
* @returns 第一个匹配断言的元素或undefined
*/
function findLast(collection, predicate) {
	const callback = iteratee(predicate);
	let rs;
	eachRight(collection, (v, k, c) => {
		if (callback(v, k, c)) {
			rs = v;
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
* 类似<code>map</code>，但会对返回值进行<code>flat</code>处理。
* 除此之外，与map函数最大的不同在于返回值与元素的映射关系并不一定是一一对应，此时更像<code>filter</code>
*
* @example
* //[1, 2, [3]]
* console.log(_.flatMap([[1,2],[[3]]]))
* //[3,5]
* console.log(_.flatMap([[1,2],3,4,5],n=>n%2?n:[]))
*
* @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
* @param iteratee (value[,index|key[,collection]]) 回调函数，返回值作为新数组元素。
* @param depth 嵌套深度
* @returns 映射值的新数组
* @since 1.0.0
*/
function flatMap(collection, itee = identity, depth = 1) {
	return flat(map(collection, itee), depth || 1);
}
/**
* 同<code>flatMap</code>，但会递归元素进行扁平化处理
*
* @example
* //[1, 2, 3]
* console.log(_.flatMapDeep([[1,2],[[3]]]))
*
* @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
* @param iteratee (value[,index|key[,collection]]) 回调函数，返回值作为新数组元素。
* @returns 映射值的新数组
* @since 1.0.0
*/
function flatMapDeep(collection, iteratee = identity) {
	return flatMap(collection, iteratee, Infinity);
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
* @param iteratee (value)回调函数，返回统计key
* @returns 统计对象
* @since 1.0.0
*/
function groupBy(collection, iteratee$3 = identity) {
	const stat = {};
	const cb = iteratee(iteratee$3 || identity);
	each(collection, (el) => {
		const key = cb(el);
		if (stat[key] === void 0) stat[key] = [];
		stat[key].push(el);
	});
	return stat;
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
	let ary = Array.isArray(array) ? array : toArray(array);
	return ary.slice(0, ary.length - 1);
}
/**
* 创建一个对象，对象的key是iteratee返回的值，对象的值是collection中最后一个key对应的值
* @example
* //{true: 9, false: 'd'}
* console.log(_.keyBy([1,'a',3,'b',5,'c',7,'d',9],_.isNumber))g
* const users = [
*  {name:'zhangsan',sex:'m',age:33},
*  {name:'lisi',sex:'f',age:21},
*  {name:'wangwu',sex:'m',age:25},
*  {name:'zhaoliu',sex:'m',age:44},
* ]
* //{m: {...}, f: {...}}
* console.log(_.keyBy(users,u=>u.sex))
* //{20: {...}, 30: {...}, 40: {...} }
* console.log(_.keyBy(users,u=>(u.age/10>>0)*10))
*
* @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
* @param iteratee (value)回调函数，返回统计key
* @returns 统计对象
* @since 1.0.0
*/
function keyBy(collection, iteratee$2 = identity) {
	const stat = {};
	const cb = iteratee(iteratee$2 || identity);
	each(collection, (el) => {
		const key = cb(el);
		stat[key] = el;
	});
	return stat;
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
* 类似<code>filter</code>函数，但返回固定长度为2的二维数组 - [[matched...],[mismatched...]]
*
* @example
* const libs = [
*  {name:'func.js',platform:['web','nodejs'],tags:{utils:true},js:false},
*  {name:'juth2',platform:['web','java'],tags:{utils:false,middleware:true},js:true},
*  {name:'soya2d',platform:['web'],tags:{utils:true},js:true}
* ];
*
* //[[func.js],[juth2,soya2d]]
* console.log(_.partition(libs,{name:'func.js'}))
*
* const seq = [1,2,3,4,5,6];
* //[[2, 4, 6],[1, 3, 5]]
* console.log(_.partition(seq,n=>n%2===0))
*
* //[[1,3],["2"]]
* console.log(_.partition({a:1,b:'2',c:3},_.isNumber))
*
* @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
* @param predicate (value[,index|key[,collection]]) 断言
* <br>当断言是函数时回调参数见定义
* <br>其他类型请参考 {@link utils!iteratee}
* @returns 由匹配列表，非匹配列表构成的二维数组
* @since 0.17.0
*/
function partition(collection, predicate) {
	const matched = [];
	const mismatched = [];
	const callback = iteratee(predicate);
	each(collection, (v, k, c) => {
		if (callback(v, k, c)) matched.push(v);
		else mismatched.push(v);
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
* @param initialValue 第一次调用 callback函数时的第一个参数的值
* @returns 汇总值
*/
function reduce(collection, callback, initialValue) {
	let rs;
	if (isNil(initialValue)) rs = first(collection);
	else rs = callback(initialValue, first(collection), first(keys(collection)), collection);
	each(collection, (v, k, c) => {
		rs = callback(rs, v, k, c);
	}, 1);
	return rs;
}
/**
* <code>filter</code>的反函数，数组内容由集合内所有断言结果为假的元素组成
*
* @example
* //['a', 'b', 'c']
* console.log(_.reject(['a','b','c',1],_.isNumber))
* //['3']
* console.log(_.reject({a:1,b:2,c:'3'},_.isNumber))
* //[2，4]
* console.log(_.reject([1,2,3,4],v=>v%2===1))
*
* @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
* @param predicate (value[,index|key[,collection]]) 断言
* <br>当断言是函数时回调参数见定义
* <br>其他类型请参考 {@link utils!iteratee}
* @returns 由通过断言的元素组成的新数组
* @since 1.0.0
*/
function reject(collection, predicate) {
	const rs = [];
	const callback = iteratee(predicate);
	each(collection, (v, k, c) => {
		if (!callback(v, k, c)) rs.push(v);
	});
	return rs;
}
function randi(min, max) {
	let maxNum = max || min;
	if (max === void 0) min = 0;
	maxNum >>= 0;
	min >>= 0;
	return Math.random() * (maxNum - min) + min >> 0;
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
/**
* 返回对指定列表的指定数量随机采样结果
* @example
* //[随机值]
* console.log(_.sampleSize([1,2,3,4,5,6,7,8,9,0]))
* //[随机值1,随机值2]
* console.log(_.sampleSize([{a:1},{b:2},{c:3},{d:4},{e:5}],2))
*
* @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
* @param count 采样数量
* @returns 采样结果
* @since 0.16.0
*/
function sampleSize(collection, count = 1) {
	var _count;
	count = (_count = count) !== null && _count !== void 0 ? _count : 1;
	const ary = toArray(collection);
	const seeds = range(0, ary.length);
	const ks = [];
	while (seeds.length > 0) {
		if (count-- < 1) break;
		const i = pop(seeds, randi(seeds.length));
		if (i !== null) ks.push(i);
	}
	return map(ks, (v) => ary[v]);
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
/**
* 对集合内的所有元素进行断言，直到第一个返回true的元素结束。
*
* @example
* const libs = [
*  {name:'func.js',platform:['web','nodejs'],tags:{utils:true},js:true},
*  {name:'juth2',platform:['web','java'],tags:{utils:false,middleware:true},js:false},
*  {name:'soya2d',platform:['web'],tags:{utils:true},js:true}
* ];
*
* //false
* console.log(_.some([]))
* //true
* console.log(_.some([1,2,3,4],v=>v%2===1))
* //true
* console.log(_.some(['a','b','c',1],_.isNumber))
* //true
* console.log(_.some(libs,'tags.middleware'))
* //true
* console.log(_.some(libs,{js:true}))
* //false key不支持路径解析
* console.log(_.some(libs,{'tags.utils':false}))
*
* @param collection 任何可遍历的集合类型，比如arraylike / set / map / object / ...
* @param predicate (value[,index|key[,collection]]) 断言
* <br>当断言是函数时回调参数见定义
* <br>其他类型请参考 {@link utils!iteratee}
* @returns 只要有任意元素断言为真返回true，否则false。对于一个空集合，会返回false
*/
function some(collection, predicate) {
	let rs = false;
	const callback = iteratee(predicate || (() => true));
	each(collection, (v, k, c) => {
		if (callback(v, k, c)) {
			rs = true;
			return false;
		}
	});
	return rs;
}
var TIME_MAP$1 = {
	s: 1e3,
	m: 6e4,
	h: 36e5,
	d: 864e5
};
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
* @param type 比较时间单位
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
function compareDate(date1, date2, type = "d") {
	const d1 = new Date(date1);
	const d2 = new Date(date2);
	type = type || "d";
	if (type === "y") return d1.getFullYear() - d2.getFullYear();
	else if (type === "M") return (d1.getFullYear() - d2.getFullYear()) * 12 + (d1.getMonth() - d2.getMonth());
	else {
		switch (type) {
			case "d":
				d1.setHours(0, 0, 0, 0);
				d2.setHours(0, 0, 0, 0);
				break;
			case "h":
				d1.setHours(d1.getHours(), 0, 0, 0);
				d2.setHours(d2.getHours(), 0, 0, 0);
				break;
			case "m":
				d1.setHours(d1.getHours(), d1.getMinutes(), 0, 0);
				d2.setHours(d2.getHours(), d2.getMinutes(), 0, 0);
		}
		return (d1.getTime() - d2.getTime()) / TIME_MAP$1[type];
	}
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
	return v instanceof Date || Object.prototype.toString.call(v) === "[object Date]";
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
	if (v == null) return "";
	if (v === 0 && 1 / v < 0) return "-0";
	const type = typeof v;
	if (type === "string") return v;
	if (type === "number" || type === "boolean") return String(v);
	if (type === "symbol") return v.toString();
	return v.toString ? v.toString() : Object.prototype.toString.call(v);
}
/**
* 使用指定回调对集合结果进行升序排序。根据集合结果的第一个元素确定排序逻辑，内置排序逻辑包括
* <ul>
* <li>字符串</li>
* <li>数字</li>
* <li>日期</li>
* </ul>
*
* @example
* //不变
* console.log(_.sortBy([{a:2},{a:1},{a:3}]))
* //[{{a:1},{a:2},{a:3}] 通过iteratee把集合变为数字后排序
* console.log(_.sortBy([{a:2},{a:1},{a:3}],'a'))
* //['3/1/2019', '2020/1/1', '2020-3-1']
* console.log(_.sortBy(['2020-3-1','2020/1/1','3/1/2019'],_.toDate))
*
* @param collection 任何可遍历的集合类型，比如array / arraylike / set / map / object / ...
* @param iteratee (value,key|index) 筛选函数，返回排序值
* <br>当iteratee是函数时回调参数见定义
* <br>其他类型请参考 {@link utils!iteratee}
* @returns 排序后的数组
* @since 1.0.0
*/
function sortBy(collection, iteratee$1 = identity) {
	if (size(collection) < 1) return [];
	const cb = iteratee(iteratee$1 || identity);
	let i = 0;
	const list = map(collection, (v, k) => {
		return {
			src: v,
			index: i++,
			value: cb(v, k)
		};
	});
	const comparator = getComparator(list[0].value);
	list.sort((a, b) => !eq$1(a.value, b.value) ? comparator(a.value, b.value) : a.index - b.index);
	const rs = new Array(list.length);
	for (let j = 0; j < list.length; j++) rs[j] = list[j].src;
	return rs;
}
var compareNumAsc = (a, b) => {
	if (isNil(a) || !isNumber(a)) return 1;
	if (isNil(b) || !isNumber(b)) return -1;
	return a - b;
};
var compareStrAsc = (a, b) => {
	if (isNil(a)) return 1;
	if (isNil(b)) return -1;
	return toString(a).localeCompare(toString(b));
};
var compareDateAsc = (a, b) => {
	if (isNil(a)) return 1;
	if (isNil(b)) return -1;
	return compareDate(a, b);
};
function getComparator(el) {
	let comparator;
	if (isNumber(el)) comparator = compareNumAsc;
	else if (isDate(el)) comparator = compareDateAsc;
	else comparator = compareStrAsc;
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
* @param comparator (a,b) 排序函数，如果为空使用sortBy逻辑
* @returns 排序后的数组
*/
function sort(collection, comparator) {
	const ary = toArray(collection);
	if (ary.length < 1) return ary;
	if (isFunction(comparator)) return ary.sort(comparator);
	else return sortBy(ary);
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
	return toArray(array).slice(1);
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
* @param length 获取元素数量，默认数组长度
* @returns 新数组
*/
function take(array, length) {
	return toArray(array).slice(0, length);
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
var TIME_MAP = {
	s: 1e3,
	m: 6e4,
	h: 36e5,
	d: 864e5
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
* @param type 量变时间类型
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
function addTime(date, amount, type = "s") {
	type = type || "s";
	const d = new Date(date);
	switch (type) {
		case "y":
			d.setFullYear(d.getFullYear() + amount);
			break;
		case "M":
			d.setMonth(d.getMonth() + amount);
			break;
		default:
			let times = 0;
			times = amount * TIME_MAP[type];
			d.setTime(d.getTime() + times);
	}
	return d;
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
* @param padString 填充字符串，如果填充后超出指定长度，会自动截取并保留左侧字符串
* @returns 在原字符串末尾填充至指定长度后的字符串
*/
function padEnd(str, len, padString = " ") {
	var _padString;
	str = toString(str);
	if (str.padEnd) return str.padEnd(len, padString);
	padString = (_padString = padString) !== null && _padString !== void 0 ? _padString : " ";
	const diff = len - str.length;
	if (diff < 1) return str;
	let fill = "";
	let i = Math.ceil(diff / padString.length);
	while (i--) fill += padString;
	return str + fill.substring(0, diff);
}
/**
* 通过指定参数得到日期对象。支持多种签名
* 
* ```js
* _.toDate(1320940800); //timestamp unix style
* _.toDate(1320940800123); //timestamp javascript style
* _.toDate([year,monthIndex,day]); //注意，monthIndex为0-based（0代表一月）
* _.toDate([year,monthIndex,day,hour,min,sec]); //注意，monthIndex为0-based（0代表一月）
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
		if (value < TIMESTAMP_MIN) value = toNumber(padEnd(value + "", 13, "0"));
		else if (value > TIMESTAMP_MAX) value = 0;
		rs = new Date(value);
	} else if (isArray(value)) rs = new Date(value[0], value[1], value[2] || 1, value[3] || 0, value[4] || 0, value[5] || 0, value[6] || 0);
	else rs = new Date(value);
	if (rs.toDateString() === "Invalid Date") rs = /* @__PURE__ */ new Date(0);
	return rs;
}
var TIMESTAMP_MIN = 0xe8d4a51000;
var TIMESTAMP_MAX = 9999999999999;
/**
* 指定日期是否是闰年
* @param date 日期对象
* @returns 闰年返回true
*/
function isLeapYear(date) {
	date = toDate(date);
	const year = date.getFullYear();
	return year % 400 === 0 || year % 4 === 0;
}
var DaysOfMonth = [
	31,
	0,
	31,
	30,
	31,
	30,
	31,
	31,
	30,
	31,
	30,
	31
];
/**
* 获取指定日期在当前年中的天数并返回
* @param date 日期对象
* @returns 当前年中的第几天
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
* @returns 当前月中的第几周
*/
function getWeekOfMonth(date) {
	date = toDate(date);
	const year = date.getFullYear();
	let firstDayOfMonth = new Date(year, date.getMonth(), 1);
	let extraWeek = 0;
	let d = firstDayOfMonth.getDay();
	if (d === 0 || d > 5) extraWeek = 1;
	return Math.ceil(date.getDate() / 7) + extraWeek;
}
/**
* 获取指定日期在当前年中的周数并返回
* @param date 日期对象
* @returns 当前年中的第几周
*/
function getWeekOfYear(date) {
	date = toDate(date);
	const year = date.getFullYear();
	let firstDayOfYear = new Date(year, 0, 1);
	let extraWeek = 0;
	let d = firstDayOfYear.getDay();
	if (d === 0 || d > 5) extraWeek = 1;
	return Math.ceil(getDayOfYear(date) / 7) + extraWeek;
}
var INVALID_DATE = "";
var SearchExp = /y{2,4}|M{1,3}|d{1,4}|h{1,2}|m{1,2}|s{1,2}|Q{1,2}|E{1,2}|W{1,2}|w{1,2}|H{1,2}|S|a/gm;
var pad0 = (str) => str.length > 1 ? str : "0" + str;
var pad00 = (str) => str.length > 2 ? str : str.length > 1 ? "0" + str : "00" + str;
function compilePattern(pattern) {
	const tokens = [];
	let lastIndex = 0;
	let match;
	while ((match = SearchExp.exec(pattern)) !== null) {
		if (match.index > lastIndex) tokens.push({
			type: "literal",
			value: pattern.slice(lastIndex, match.index)
		});
		tokens.push({
			type: "token",
			value: match[0]
		});
		lastIndex = match.index + match[0].length;
	}
	if (lastIndex < pattern.length) tokens.push({
		type: "literal",
		value: pattern.slice(lastIndex)
	});
	return tokens;
}
function buildTokenFn(tag) {
	switch (tag[0]) {
		case "y": {
			const isShort = tag === "yy";
			return (date) => {
				const year = date.getFullYear();
				return isShort ? year % 100 + "" : year + "";
			};
		}
		case "M":
			switch (tag) {
				case "M": return (date) => date.getMonth() + 1 + "";
				case "MM": return (date) => pad0(date.getMonth() + 1 + "");
				case "MMM": return (date, locale) => (locale === null || locale === void 0 ? void 0 : locale.months[date.getMonth()]) || tag;
			}
			break;
		case "d":
			switch (tag) {
				case "d": return (date) => date.getDate() + "";
				case "dd": return (date) => pad0(date.getDate() + "");
				case "ddd": return (date) => getDayOfYear(date) + "";
				case "dddd": return (date) => pad00(getDayOfYear(date) + "");
			}
			break;
		case "a": return (date, locale) => date.getHours() < 12 ? locale === null || locale === void 0 ? void 0 : locale.meridiems[0] : locale === null || locale === void 0 ? void 0 : locale.meridiems[1];
		case "h": {
			const isPadded = tag.length > 1;
			return (date) => {
				let val = date.getHours() % 12;
				if (val === 0) val = 12;
				return isPadded ? pad0(val + "") : val + "";
			};
		}
		case "H": {
			const isPadded = tag.length > 1;
			return (date) => isPadded ? pad0(date.getHours() + "") : date.getHours() + "";
		}
		case "m": {
			const isPadded = tag.length > 1;
			return (date) => isPadded ? pad0(date.getMinutes() + "") : date.getMinutes() + "";
		}
		case "s": {
			const isPadded = tag.length > 1;
			return (date) => isPadded ? pad0(date.getSeconds() + "") : date.getSeconds() + "";
		}
		case "Q":
			switch (tag) {
				case "Q": return (date) => Math.ceil((date.getMonth() + 1) / 3) + "";
				case "QQ": return (date, locale) => (locale === null || locale === void 0 ? void 0 : locale.quarters[Math.ceil((date.getMonth() + 1) / 3) - 1]) || tag;
			}
			break;
		case "W": {
			const isPadded = tag.length > 1;
			return (date) => {
				const val = getWeekOfYear(date) + "";
				return isPadded ? pad0(val) : val;
			};
		}
		case "w":
			switch (tag) {
				case "w": return (date) => getWeekOfMonth(date) + "";
				case "ww": return (date, locale) => (locale === null || locale === void 0 ? void 0 : locale.weeks[getWeekOfMonth(date) - 1]) || tag;
			}
			break;
		case "E":
			switch (tag) {
				case "E": return (date) => {
					let dayOfWeek = date.getDay();
					dayOfWeek = dayOfWeek < 1 ? 7 : dayOfWeek;
					return dayOfWeek + "";
				};
				case "EE": return (date, locale) => {
					let dayOfWeek = date.getDay();
					dayOfWeek = dayOfWeek < 1 ? 7 : dayOfWeek;
					return (locale === null || locale === void 0 ? void 0 : locale.days[dayOfWeek - 1]) || tag;
				};
			}
			break;
		case "S": return (date) => date.getMilliseconds() + "";
	}
	return () => tag;
}
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
*   - `dd` 2位日(01-30/31/29/28)
*   - `ddd` 一年中的日(1-365)
*   - `dddd` 一年中的日(001-365)
*   - `h` 1位小时(1-12)
*   - `hh` 2位小时(01-12)
*   - `H` 1位小时(0-23)
*   - `HH` 2位小时(00-23)
*   - `m` 1位分钟(0-59)
*   - `mm` 2位分钟(00-59)
*   - `s` 1位秒(0-59)
*   - `ss` 2位秒(00-59)
*   - `Q` 季度(1-4)
*   - `QQ` 季度描述(春-冬)
*   - `W` 一年中的周(1-53)
*   - `WW` 一年中的周(01-53)
*   - `w` 一月中的周(1-6)
*   - `ww` 一月中的周描述(第一周 - 第六周)
*   - `E` 星期(1-7)
*   - `EE` 星期描述(星期一 - 星期日)
*   - `S` 毫秒
*   - `a` AM/PM
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
* console.log(_.formatDate('2021-12-11T10:09:08','yy-MM-dd HH:mm:ss'))
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
* @param pattern 格式化模式
* @returns 格式化后的日期字符串，无效日期返回空字符串
*/
function formatDate(val, pattern = "yyyy-MM-dd HH:mm:ss") {
	pattern = pattern || "yyyy-MM-dd HH:mm:ss";
	let compiled = compiledCache[pattern];
	if (!compiled) {
		const tokens = compilePattern(pattern);
		const parts = [];
		for (const token of tokens) if (token.type === "literal") parts.push(token.value);
		else parts.push(buildTokenFn(token.value));
		compiled = { parts };
		compiledCache[pattern] = compiled;
	}
	if (!val) return INVALID_DATE;
	let date;
	if (typeof val === "string" || typeof val === "number") date = toDate(val);
	else date = val;
	if (date.toString().indexOf("Invalid") > -1) return INVALID_DATE;
	const locale = Locale[Lang];
	const { parts } = compiled;
	let result = "";
	for (const part of parts) if (typeof part === "string") result += part;
	else result += part(date, locale);
	return result;
}
var compiledCache = {};
var Locale = { "zh-CN": {
	quarters: [
		"一季度",
		"二季度",
		"三季度",
		"四季度"
	],
	months: [
		"一",
		"二",
		"三",
		"四",
		"五",
		"六",
		"七",
		"八",
		"九",
		"十",
		"十一",
		"十二"
	].map((v) => v + "月"),
	weeks: [
		"一",
		"二",
		"三",
		"四",
		"五",
		"六"
	].map((v) => "第" + v + "周"),
	days: [
		"一",
		"二",
		"三",
		"四",
		"五",
		"六",
		"日"
	].map((v) => "星期" + v),
	meridiems: ["AM", "PM"]
} };
var Lang = ((_globalThis$navigator = globalThis.navigator) === null || _globalThis$navigator === void 0 ? void 0 : _globalThis$navigator.language) || "zh-CN";
/**
* 设置不同locale的配置
* @param lang 语言标记，默认跟随系统
* @param {object} options 格式化选项
* @param options.quarters 季度描述，默认"一 - 四季度"
* @param options.months 月度描述，默认"一 - 十二月"
* @param options.weeks 一月中的周描述，默认"第一 - 六周"
* @param options.days 星期描述，默认"星期一 - 日"
* @param options.meridiems 上午/下午描述，默认"AM/PM"
*/
formatDate.locale = function(lang, options) {
	let locale = Locale[lang];
	if (!locale) locale = Locale[lang] = {
		quarters: [],
		months: [],
		weeks: [],
		days: [],
		meridiems: []
	};
	if (options === null || options === void 0 ? void 0 : options.quarters) locale.quarters = options === null || options === void 0 ? void 0 : options.quarters;
	if (options === null || options === void 0 ? void 0 : options.months) locale.months = options === null || options === void 0 ? void 0 : options.months;
	if (options === null || options === void 0 ? void 0 : options.weeks) locale.weeks = options === null || options === void 0 ? void 0 : options.weeks;
	if (options === null || options === void 0 ? void 0 : options.days) locale.days = options === null || options === void 0 ? void 0 : options.days;
	if (options === null || options === void 0 ? void 0 : options.meridiems) locale.meridiems = options === null || options === void 0 ? void 0 : options.meridiems;
	compiledCache = {};
};
/**
* 可以设置当前格式化使用的语言
* @param lang 语言标记，默认跟随系统
*/
formatDate.lang = function(lang) {
	Lang = lang;
	compiledCache = {};
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
	return new Date(date1).setHours(0, 0, 0, 0) === new Date(date2).setHours(0, 0, 0, 0);
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
* @param count 计数
* @returns 包装后的函数
*/
function after(fn, count = 0) {
	const proxy = fn;
	let i = count || 0;
	let rtn;
	return ((...args) => {
		if (i === 0) rtn = proxy(...args);
		if (i > 0) i--;
		return rtn;
	});
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
	if (rs === void 0) rs = interceptor2(v);
	return rs;
}
var PLACEHOLDER = void 0;
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
	return ((...params) => {
		let p = 0;
		const applyArgs = args.map((v) => v === PLACEHOLDER ? params[p++] : v);
		if (params.length > p) for (let i = p; i < params.length; i++) applyArgs.push(params[i]);
		return fn(...applyArgs);
	});
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
	return partial((fn || (() => {})).bind(thisArg), ...args);
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
	if (!isObject(obj)) return obj;
	const chain = toPath(path);
	let target = obj;
	for (let i = 0; i < chain.length; i++) {
		const seg = chain[i];
		const nextSeg = chain[i + 1];
		let tmp = target[seg];
		if (nextSeg) {
			let next = !tmp ? isNaN(parseInt(nextSeg)) ? {} : [] : tmp;
			if (!tmp) tmp = target[seg] = next;
		} else {
			target[seg] = value;
			break;
		}
		target = tmp;
	}
	return obj;
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
* @param methodNames 属性名或path
* @returns 绑定对象
* @since 0.17.0
*/
function bindAll(object, ...methodNames) {
	each(flatDeep(methodNames), (path) => {
		set(object, path, get(object, path).bind(object));
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
	if (!isFunction(fn)) return void 0;
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
* @param fns 多个函数
* @returns 组合后的入口函数
*/
function compose(...fns) {
	return (function(...args) {
		let rs = fns[0](...args);
		for (let i = 1; i < fns.length; i++) if (isFunction(fns[i])) rs = fns[i](rs);
		return rs;
	});
}
/**
* 创建一个包含指定函数逻辑的防抖函数并返回。在防抖函数执行后的下一次调用会在 `wait` 间隔结束后执行，如果等待期间调用函数则会重置wait时间。
* 对于一些需要等待过程停止后执行的场景非常有用，如输入结束时的查询、窗口resize后的计算等等
*
* 返回的防抖函数额外带有 `cancel()`，用于丢弃尚未执行的排队调用。
* 典型场景：宿主（组件/组件库）卸载时清除已排队的回调，避免回调迟到执行时访问已销毁的实例。
*
* @example
* //2
* let log = _.debounce(console.log);
* console.log(log(1),log(2))
*
* @example
* //取消排队中的调用
* let save = _.debounce(doSave, 300)
* save(data)
* save.cancel()   //doSave 不会被触发
*
* @param fn 需要调用的函数
* @param wait 抖动间隔，ms
* @param immediate 立即执行一次，默认false
* @returns 包装后的防抖函数（含 `cancel()`）
* @since 1.4.0
*/
function debounce(fn, wait, immediate = false) {
	let timer = null;
	let lastThis = null;
	let lastArgs = null;
	function invoke() {
		timer = null;
		if (lastArgs === null) return;
		let args = lastArgs;
		let self = lastThis;
		lastArgs = lastThis = null;
		fn.apply(self, args);
	}
	const debounced = function(...args) {
		lastThis = this;
		lastArgs = args;
		const callNow = immediate && timer === null;
		clearTimeout(timer);
		timer = setTimeout(function() {
			timer = null;
			if (immediate) lastThis = lastArgs = null;
			else invoke();
		}, wait);
		if (callNow) {
			const a = lastArgs;
			const s = lastThis;
			lastThis = lastArgs = null;
			fn.apply(s, a);
		}
	};
	debounced.cancel = function() {
		if (timer !== null) {
			clearTimeout(timer);
			timer = null;
		}
		lastThis = lastArgs = null;
	};
	return debounced;
}
/**
* 启动计时器，并在倒计时为0后调用函数。
* 内部使用setTimeout进行倒计时，如需中断延迟可以使用clearTimeout函数。*注意，该函数并不提供防抖逻辑*
*
* @example
* //1000ms 后显示some text !
* _.delay(console.log,1000,'some text','!');
*
* @param fn 需要调用的函数
* @param wait 倒计时。单位ms
* @param args 传入定时函数的参数
* @returns 计时器id
*/
function delay(fn, wait = 0, ...args) {
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
* @param args 可选参数对象
* @param context 可选上下文
* @returns 表达式计算结果
*/
function fval(expression, args, context) {
	const ks = args ? keys(args) : [];
	const val = args ? values(args) : [];
	return Function(...ks, "\"use strict\";return " + expression).call(context, ...val);
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
	return ((...args) => {
		let rtn;
		if (proxy) {
			let m = proxy;
			proxy = null;
			rtn = m(...args);
		}
		return rtn;
	});
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
/**
* 创建一个包含指定函数逻辑的节流函数并返回。每当节流函数执行后都会等待`wait`间隔归零才可再次调用，等待期间调用函数无效。
* 对于一些需要降低执行频率的场景非常有用，如onmousemove、onscroll等事件中
*
* @example
* //每隔1秒输出当前时间
* let log = _.throttle(console.log,1000);
* setInterval(()=>log(new Date().toTimeString()),100)
*
* @param fn 需要调用的函数
* @param wait 抖动间隔，ms
* @param options 执行选项
* @param options.leading 首次是否执行，默认true
* @param options.trailing 最后一次是否执行，默认true
* @returns 包装后的函数
* @since 1.4.0
*/
function throttle(fn, wait, options) {
	let proxy = fn;
	let lastExec = 0;
	let timer = null;
	let timeoutArgs;
	let timeoutContext;
	options = options || {
		leading: true,
		trailing: true
	};
	options.leading = options.leading === void 0 ? true : options.leading;
	options.trailing = options.trailing === void 0 ? true : options.trailing;
	function timeout() {
		if (options === null || options === void 0 ? void 0 : options.trailing) {
			for (const arg of timeoutArgs) if (EventTargetMap.has(arg)) {
				let targets = EventTargetMap.get(arg);
				let ks = Object.keys(targets);
				for (const k of ks) Object.defineProperty(arg, k, {
					value: targets[k],
					writable: false,
					enumerable: true,
					configurable: false
				});
				EventTargetMap.delete(arg);
			}
			proxy.apply(timeoutContext, timeoutArgs);
		}
		lastExec = Date.now();
		timeoutArgs = timer = null;
	}
	return (function(...args) {
		timeoutArgs = args.map((arg) => {
			if (arg instanceof globalThis.Event) EventTargetMap.set(arg, {
				currentTarget: arg.currentTarget,
				fromElement: Reflect.get(arg, "fromElement"),
				relatedTarget: Reflect.get(arg, "relatedTarget"),
				target: arg.target,
				toElement: Reflect.get(arg, "toElement")
			});
			return arg;
		});
		timeoutContext = this;
		let now = Date.now();
		let remaining = wait - (now - lastExec);
		if (remaining <= 0) {
			if (timer) {
				clearTimeout(timer);
				timeoutArgs = timer = null;
			}
			if (options === null || options === void 0 ? void 0 : options.leading) {
				proxy.apply(this, args);
				lastExec = now;
			} else if (options === null || options === void 0 ? void 0 : options.trailing) timer = setTimeout(timeout, wait);
			else lastExec = now;
		} else if (!timer) timer = setTimeout(timeout, remaining);
	});
}
var EventTargetMap = /* @__PURE__ */ new WeakMap();
/**
* 判断参数是否全部为字母或数字字符串
*
* @example
* //true
* console.log(_.isAlnum('123'))
* //true
* console.log(_.isAlnum('123abc'))
* //false
* console.log(_.isAlnum(1))
*
* @param v
* @returns 
* @since 1.15.0
*/
function isAlnum(v) {
	return typeof v === "string" && v.length > 0 && /^[\p{L}0-9]+$/u.test(v);
}
/**
* 判断参数是否全部为字母，含国际字母表
*
* @example
* //true
* console.log(_.isAlpha('𰻞𰻞mian'))
* //false
* console.log(_.isAlpha(1))
*
* @param v
* @returns 
* @since 1.15.0
*/
function isAlpha(v) {
	return typeof v === "string" && v.length > 0 && /^\p{L}+$/u.test(v);
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
	if (v === null || v === void 0) return true;
	const t = typeof v;
	if (t === "number" || t === "boolean" || t === "function") return false;
	if (Array.isArray(v)) {
		const n = v.length;
		if (n === 0) return true;
		if (n === 1) return isBlank(v[0]);
		return false;
	}
	if (typeof v === "string") {
		if (v.length === 0) return true;
		const c0 = v.charCodeAt(0);
		if (c0 > 32 && c0 < 127) return false;
		return v.trim().length === 0;
	}
	return (v + "").trim().length === 0;
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
	return v instanceof Boolean || Object.prototype.toString.call(v) === "[object Boolean]";
}
/**
* 判断值是不是自定义Element
*
* @example
* //false
* console.log(_.isCustomElement(document.body))
* //true
* console.log(_.isCustomElement(document.body.querySelector('l-ele')))
*
* @param v
* @returns
* @since 1.14.0
*/
function isCustomElement(v) {
	return typeof v === "object" && v instanceof (HTMLElement || Object) && (v.shadowRoot instanceof ShadowRoot || !!customElements.get(v.tagName.toLowerCase()) || v.tagName.split("-").length > 1);
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
	return v !== void 0;
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
	return typeof v === "object" && v instanceof (globalThis.Element || Object);
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
	if (null === v) return true;
	if (void 0 === v) return true;
	if ("" === v) return true;
	if (0 === v) return true;
	if (isArrayLike(v) && v.length < 1) return true;
	if (v instanceof Map) return v.size < 1;
	if (v instanceof Set) return v.size < 1;
	if (v instanceof Object && Object.keys(v).length < 1) return true;
	return false;
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
	return v instanceof RegExp || Object.prototype.toString.call(v) === "[object RegExp]";
}
var MAX_DEPTH$1 = 128;
function isEqualWithInternal(a, b, comparator, depth, visited) {
	if (depth > MAX_DEPTH$1) return true;
	let cptor = comparator;
	if (!isObject(a) || !isObject(b)) return (cptor || eq$1)(a, b);
	if (isDate(a) && isDate(b)) return cptor ? cptor(a, b) : a.getTime() === b.getTime();
	if (isRegExp(a) && isRegExp(b)) return cptor ? cptor(a, b) : a.toString() === b.toString();
	const aKeys = Object.keys(a);
	if (aKeys.length !== Object.keys(b).length) return false;
	if (isElement(a) && isElement(b)) {
		if (a.tagName && b.tagName) {
			if (a.tagName.toLowerCase() !== b.tagName.toLowerCase()) return false;
			if (a.id !== b.id) return false;
			const classListA = a.classList;
			const classListB = b.classList;
			if (classListA && classListB) {
				if (classListA.length !== classListB.length) return false;
				for (let i = 0; i < classListA.length; i++) if (classListA[i] !== classListB[i]) return false;
			}
			return cptor ? cptor(a, b) : true;
		}
	}
	if (isFunction(a) && isFunction(b)) return cptor ? cptor(a, b) : a.name === b.name;
	const pairKey = a;
	let bMap = visited.get(pairKey);
	if (!bMap) {
		bMap = /* @__PURE__ */ new WeakMap();
		visited.set(pairKey, bMap);
	} else if (bMap.has(b)) return true;
	bMap.set(b, true);
	const nextDepth = depth + 1;
	for (let i = aKeys.length; i--;) {
		const k = aKeys[i];
		if (!Object.prototype.hasOwnProperty.call(b, k)) return false;
		const v1 = a[k];
		const v2 = b[k];
		if (!isEqualWithInternal(v1, v2, cptor, nextDepth, visited)) return false;
	}
	return true;
}
/**
* 同<code>isEqual</code>，但支持自定义比较器。如果未指定比较器则使用内置逻辑处理  
* 内置逻辑:  
*  - 如果是日期使用getTime对比
*  - 如果是正则使用toString对比
*  - 如果是元素节点使用tagName+id+class对比
*  - 如果是函数使用name对比
* @example
* //true
* console.log(_.isEqualWith([new Date('2010-2-1'),'abcd'],['2010/2/1','Abcd'],(av,bv)=>_.isDate(av)?av.toLocaleDateString() == bv:_.test(av,bv,'i')))
*
* @param a
* @param b
* @param [comparator] 比较器，参数(v1,v2)，返回true表示匹配。如果返回undefined使用对应内置比较器处理
* @param _depth 内部递归深度计数器
* @returns
* @since 1.0.0
*/
function isEqualWith(a, b, comparator, _depth = 0) {
	return isEqualWithInternal(a, b, comparator, _depth, /* @__PURE__ */ new WeakMap());
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
	return v instanceof Error || Object.prototype.toString.call(v) === "[object Error]";
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
* 判断参数是否为小写字母
* @example
* //false
* console.log(_.isLowerCaseChar('A'))
* //true
* console.log(_.isLowerCaseChar('a'))
* //false
* console.log(_.isLowerCaseChar(null))
*
* @param v
* @returns
* @since 1.13.0
*/
function isLowerCaseChar(v) {
	if (v === null || v === void 0 || Number.isNaN(v)) return false;
	const code = (v + "").charCodeAt(0);
	return code >= 97 && code <= 122;
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
* 判断参数是否为本地函数
*
* @example
* //true
* console.log(_.isNative(Array))
* //false
* console.log(_.isNative(()=>{}))
*
* @param v
* @returns
*/
function isNative(v) {
	return typeof v === "function" && /native code/.test(v.toString());
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
* 判断参数是否为数字或数字字符串。不能判断BigInt
*
* @example
* //true
* console.log(_.isNumeric(1))
* //true
* console.log(_.isNumeric('-1.1'))
* //false
* console.log(_.isNumber('-1.1a'))
*
* @param v
* @returns
*/
function isNumeric(v) {
	if ((v + "").length < 1) return false;
	if (isNil(v)) return false;
	if (Number.isNaN(v)) return false;
	if (isNumber(v)) return true;
	return /^-?[0-9]*\.?[0-9]+$/.test(v + "");
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
var PRIMITIVE_TYPES = [
	"string",
	"number",
	"bigint",
	"boolean",
	"undefined",
	"symbol"
];
/**
* 判断参数是否为原始类型
*
* @example
* //true
* console.log(_.isPrimitive(1))
* //true
* console.log(_.isPrimitive(null)
* //false
* console.log(_.isPrimitive(new String()))
* //true
* console.log(_.isPrimitive(123n)
*
* @param v
* @returns
*/
function isPrimitive(v) {
	return null === v || PRIMITIVE_TYPES.indexOf(typeof v) > -1;
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
	return typeof v === "symbol";
}
/**
* 判断参数是否为大写字母
* @example
* //true
* console.log(_.isUpperCaseChar('A'))
* //false
* console.log(_.isUpperCaseChar(null))
*
* @param v
* @returns
* @since 1.13.0
*/
function isUpperCaseChar(v) {
	if (v === null || v === void 0 || Number.isNaN(v)) return false;
	const code = (v + "").charCodeAt(0);
	return code >= 65 && code <= 90;
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
	return v instanceof WeakMap || Object.prototype.toString.call(v) === "[object WeakMap]";
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
	return v instanceof WeakSet || Object.prototype.toString.call(v) === "[object WeakSet]";
}
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
	if (!isArray(values) && !isSet(values)) return NaN;
	const items = isArray(values) ? values : Array.from(values);
	let rs;
	for (let i = 0; i < items.length; i++) {
		const v = items[i];
		if (!isNumeric(v)) continue;
		const n = Number(v);
		if (rs === void 0 || n > rs) rs = n;
	}
	return rs === void 0 ? NaN : rs;
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
	if (!isArray(values) && !isSet(values)) return NaN;
	let total = 0;
	let len = 0;
	const items = isArray(values) ? values : Array.from(values);
	for (let i = 0; i < items.length; i++) {
		const v = items[i];
		len++;
		if (isNil(v)) continue;
		if (isNumeric(v)) total += Number(v);
		else return NaN;
	}
	return total / len;
}
/**
* 对多个数字或数字列表计算中间值并返回结果
* @example
* //2.5
* console.log(_.median([1,2,'3',4]))
* //2
* console.log(_.median([1,'2',3]))
* //1
* console.log(_.median([1,'2',-3]))
*
* @param values 数字/字符数组/Set
* @returns median value
* @since 1.12.0
*/
function median(values) {
	if (!isArray(values) && !isSet(values)) return NaN;
	let sortNumbers = [];
	if (isArray(values)) for (let i = 0; i < values.length; i++) {
		const v = values[i];
		if (isNumeric(v)) sortNumbers.push(Number(v));
	}
	else values.forEach((v) => {
		if (isNumeric(v)) sortNumbers.push(Number(v));
	});
	sortNumbers.sort((a, b) => a - b);
	let rs;
	if (sortNumbers.length % 2 === 0) {
		let i = sortNumbers.length / 2 - 1;
		rs = (sortNumbers[i] + sortNumbers[i + 1]) / 2;
	} else rs = sortNumbers[Math.ceil(sortNumbers.length / 2) - 1];
	return rs;
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
* @returns 如果参数不是数组/Set，返回NaN
* @since 1.0.0
*/
function min(values) {
	if (!isArray(values) && !isSet(values)) return NaN;
	const items = isArray(values) ? values : Array.from(values);
	let rs;
	for (let i = 0; i < items.length; i++) {
		const v = items[i];
		if (!isNumeric(v)) continue;
		const n = Number(v);
		if (rs === void 0 || n < rs) rs = n;
	}
	return rs === void 0 ? NaN : rs;
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
	if (value < min) return min;
	if (value > max) return max;
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
	if (max === void 0) {
		if (!min) return Math.random();
		max = min;
		min = 0;
	}
	max = parseFloat(max + "") || 0;
	min = parseFloat(min + "") || 0;
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
/**
* 对字符/数字数组/Set进行求和并返回结果
* - 对nil值，自动转为0
* - 对NaN值，返回NaN
* - 对Infinity值，返回Infinity
* 
* @example
* //10
* console.log(_.sum([1,'2',3,4]))
* //10
* console.log(_.sum([1,'2',3,4,null,undefined]))
* //NaN
* console.log(_.sum([NaN,'2',3,4]))
* //Infinity
* console.log(_.sum([Infinity,'2',3,4]))
* //6
* console.log(_.sum(new Set([1,2,3])))
*
* @param values 数字/字符数组/Set
* @since 1.0.0
* @returns
*/
function sum(values) {
	if (!isArray(values) && !isSet(values)) return NaN;
	let total = 0;
	const items = isArray(values) ? values : Array.from(values);
	for (let i = 0; i < items.length; i++) {
		const v = items[i];
		if (Number.isNaN(v)) return NaN;
		if (isNumeric(v)) total += Number(v);
	}
	return total;
}
var SUB_PATTERN_EXP = /^(?<pos>.+)((?<!\\=);)(?<neg>.+)$/;
var PATTERN_EXP = /(?<integer>[0,#]+)(?:\.(?<fraction>[0#]+))?(?<suffix>[%\u2030E])?/;
/**
* 通过表达式格式化数字
* 
* ``` 
* #,##0.00 => 1,234.00
* 
* #,##0.00;(#,##0.00) => 1,234.00 / (1,234.00)
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
* - `;` 正/负数子模式分隔符
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
* @param pattern 格式化模式
*
* @returns 格式化后的字符串或原始值字符串(如果格式无效时)或特殊值(Infinity\u221E、NaN\uFFFD)
*/
function formatNumber(v, pattern = "#,##0.00") {
	if (v === Infinity) return "∞";
	if (v === -Infinity) return "-∞";
	if (Number.isNaN(v)) return "�";
	let num = parseFloat(v + "");
	if (isNaN(num)) return v + "";
	let posPattern = pattern;
	let negPattern = "";
	const split = splitCache$1[pattern];
	if (split) {
		posPattern = split.pos;
		negPattern = split.neg;
	} else {
		let subPatterns = pattern.match(SUB_PATTERN_EXP);
		if (subPatterns && subPatterns.groups) {
			posPattern = subPatterns.groups.pos;
			negPattern = subPatterns.groups.neg;
		}
		splitCache$1[pattern] = {
			pos: posPattern,
			neg: negPattern
		};
	}
	const useNeg = num < 0 && !!negPattern;
	const key = useNeg ? negPattern : posPattern;
	let formatter = cache[key];
	if (!formatter) {
		formatter = makeFormatter(key, v, useNeg);
		cache[key] = formatter;
	}
	return formatter(v);
}
function makeFormatter(pattern, v, isNeg = false) {
	var _match$groups, _match$groups2, _match$groups3;
	const match = pattern.match(PATTERN_EXP);
	if (match == null) return (v) => v + "";
	let integerPtn = ((_match$groups = match.groups) === null || _match$groups === void 0 ? void 0 : _match$groups.integer) || "";
	const fractionPtn = ((_match$groups2 = match.groups) === null || _match$groups2 === void 0 ? void 0 : _match$groups2.fraction) || "";
	let suffix = ((_match$groups3 = match.groups) === null || _match$groups3 === void 0 ? void 0 : _match$groups3.suffix) || "";
	if (!integerPtn || integerPtn.indexOf("0#") > -1 || fractionPtn.indexOf("#0") > -1) return (v) => v + "";
	const ptnPart = match[0];
	const endsPart = pattern.split(ptnPart);
	const rnd = true;
	const isPercentage = suffix === "%";
	const isPermillage = suffix === "‰";
	const isScientific = suffix === "E";
	const groupMatch = integerPtn.match(/,[#0]+$/);
	let groupLen = -1;
	let groupReg = null;
	if (groupMatch) {
		groupLen = groupMatch[0].substring(1).length;
		integerPtn = integerPtn.replace(/^.*,(?=[^,])/, "");
		groupReg = new RegExp("\\B(?=(\\d{" + groupLen + "})+$)", "g");
	}
	let zeroizeLen = integerPtn.indexOf("0");
	if (zeroizeLen > -1) zeroizeLen = integerPtn.length - zeroizeLen;
	let fixedLen = Math.max(fractionPtn.lastIndexOf("0"), fractionPtn.lastIndexOf("#"));
	if (fixedLen > -1) fixedLen += 1;
	return (val) => {
		const num = parseFloat(val + "");
		let number = num;
		let exponent = 0;
		if (isPercentage) number = number * 100;
		else if (isPermillage) number = number * 1e3;
		else if (isScientific) {
			const pair = (number + "").split(".");
			if (number >= 1) exponent = pair[0].length - 1;
			else if (number < 1) {
				const fraStr = pair[1];
				exponent = fraStr.replace(/^0+/, "").length - fraStr.length - 1;
			}
			number = number / 10 ** exponent;
		}
		const numStr = number + "";
		let integer = parseInt(numStr);
		const fraction = numStr.split(".")[1] || "";
		let dStr = "";
		if (fractionPtn) {
			if (fraction.length >= fixedLen) {
				dStr = parseFloat("0." + fraction).toFixed(fixedLen);
				if (dStr[0] === "1") integer += 1;
				dStr = dStr.substring(1);
			} else dStr = "." + fractionPtn.replace(/[0#]/g, (tag, i) => {
				const l = fraction[i];
				return l == void 0 ? tag === "0" ? "0" : "" : l;
			});
			if (dStr.length < 2) dStr = "";
		} else {
			let carry = 0;
			if (fraction && rnd) carry = Math.round(parseFloat("0." + fraction));
			integer += carry;
		}
		let iStr = integer + "";
		let sym = num < 0 ? "-" : "";
		if (iStr[0] === "-" || iStr[0] === "+") {
			sym = iStr[0];
			iStr = iStr.substring(1);
		}
		if (groupReg && iStr.length > groupLen) {
			groupReg.lastIndex = 0;
			iStr = iStr.replace(groupReg, ",");
		} else if (iStr.length < integerPtn.length) {
			const integerPtnLen = integerPtn.length;
			const iStrLen = iStr.length;
			iStr = integerPtn.replace(/[0#]/g, (tag, i) => {
				if (integerPtnLen - i > iStrLen) return tag === "0" ? "0" : "";
				const l = iStr[iStrLen - (integerPtnLen - i)];
				return l == void 0 ? tag === "0" ? "0" : "" : l;
			});
		}
		if (isScientific) suffix = "E" + exponent;
		let rs = (isNeg ? "" : sym) + iStr + dStr + suffix;
		return (endsPart[0] || "") + rs + (endsPart[1] || "");
	};
}
var cache = {};
var splitCache$1 = {};
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
function inRange(v, start = 0, end) {
	start = start || 0;
	if (end === void 0) {
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
	if (v === null || v === void 0) return 0;
	return parseInt(v);
}
function checkTarget(target) {
	if (target === null || target === void 0) return {};
	if (!isObject(target)) return new target.constructor(target);
	if (!Object.isExtensible(target) || Object.isFrozen(target) || Object.isSealed(target)) return target;
}
function eachSources(target, sources, handler, afterHandler) {
	for (let s = 0; s < sources.length; s++) {
		const src = sources[s];
		if (!isObject(src)) continue;
		const ks = Object.keys(src);
		for (let i = 0; i < ks.length; i++) {
			const k = ks[i];
			let v = src[k];
			if (handler) v = handler(src[k], target[k], k, src, target);
			afterHandler(v, src[k], target[k], k, src, target);
		}
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
	if (rs) return rs;
	let src = sources;
	const sl = sources.length;
	let handler = src[sl - 1];
	if (!handler || !handler.call) handler = identity;
	else src = src.slice(0, sl - 1);
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
* @param sources 源对象
* @returns 返回target
*/
function assign(target, ...sources) {
	return assignWith(target, ...sources, identity);
}
function cloneBuiltInObject(obj) {
	let rs = null;
	if (isDate(obj)) rs = new Date(obj.getTime());
	else if (isBoolean(obj)) rs = new Boolean(obj.valueOf());
	else if (isString(obj)) rs = new String(obj);
	else if (isRegExp(obj)) rs = new RegExp(obj);
	else if (isNumber(obj)) rs = new Number(obj);
	else if (isSet(obj)) rs = new Set(obj);
	else if (isMap(obj)) rs = new Map(obj);
	return rs;
}
/**
* 浅层复制对象，支持赋值处理器
* 如果obj是基本类型，返回原值
* 如果obj是函数类型，返回原值
* 如果obj是元素类型，返回原值
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
* @param handler (value,key) 自定义赋值处理器，返回赋予新对象[k]的值。默认 `identity`
* @param skip (value,key) (value,key) 返回true 跳过clone该属性
* @returns 被复制的新对象
*/
function cloneWith(obj, handler, skip = (value, key) => false) {
	if (!isObject(obj)) return obj;
	if (isFunction(obj)) return obj;
	if (isElement(obj)) return obj;
	let copy = cloneBuiltInObject(obj);
	if (copy !== null) return copy;
	copy = new obj.constructor();
	Object.keys(obj).forEach((p) => {
		if (skip(obj[p], p)) return;
		let newProp = (handler || identity)(obj[p], p);
		try {
			copy[p] = newProp;
		} catch (e) {}
	});
	return copy;
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
* 如果obj是元素类型，返回原值
* 只复制对象的自身可枚举属性
*
* @example
* //true
* console.log(_.cloneDeepWith({d:new Date}).d instanceof Date)
*
* @param obj
* @param handler (value,key,obj) 自定义赋值处理器，返回赋予新对象[k]的值，当返回对象且返回值与被复制值相同引用则跳过深度复制。默认 `clone`
* @param skip (value,key) 返回true 跳过clone该属性
* @returns 被复制的新对象
*/
function cloneDeepWith(obj, handler, skip = (value, key) => false) {
	if (!isObject(obj)) return obj;
	if (isFunction(obj)) return obj;
	if (isElement(obj)) return obj;
	let copy = cloneBuiltInObject(obj);
	if (copy !== null) return copy;
	copy = new obj.constructor();
	Object.keys(obj).forEach((p) => {
		if (skip(obj[p], p)) return;
		let newProp = (handler || clone)(obj[p], p, obj);
		if (isObject(newProp) && newProp !== obj[p]) newProp = cloneDeepWith(newProp, handler);
		try {
			copy[p] = newProp;
		} catch (e) {}
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
	return cloneDeepWith(obj, clone);
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
	if (rs) return rs;
	eachSources(target, sources, null, (v, sv, tv, k, s, t) => {
		if (t[k] === void 0) t[k] = v;
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
	if (rs) return rs;
	eachSources(target, sources, null, (v, sv, tv, k, s, t) => {
		if (tv === void 0) t[k] = v;
		else if (isObject(tv) && !isFunction(tv)) defaultsDeep(tv, sv);
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
		if (callback(v, k, object)) {
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
function functions(obj) {
	let rs = [];
	let ks = Object.keys(obj);
	for (const k of ks) {
		let descr = Object.getOwnPropertyDescriptor(obj, k);
		if (!descr) continue;
		if (isFunction(descr.value)) rs.push(k);
	}
	return rs;
}
/**
* 检查指定key是否存在于指定的obj中（不含prototype中）
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
* 返回对象/Map的所有key数组
* 包括对象原型链中的属性key
*
* @example
* let f = new Function("this.a=1;this.b=2;");
* f.prototype.c = 3;
* //[a,b,c]
* console.log(_.keysIn(new f()))
*
* @param obj
* @returns key数组
*/
function keysIn(obj) {
	if (isMap(obj)) return Array.from(obj.keys());
	const rs = [];
	for (const k in obj) if (k) rs.push(k);
	return rs;
}
/**
* 永远返回undefined
* @example
* //undefined
* console.log(_.noop('func'))
* //undefined
* console.log(_.noop())
*
* @returns undefined
* @since 0.16.0
*/
function noop(..._args) {}
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
* @param sources (...src[,handler(src[k],target[k],k,src,target,chain)]) 
* src - 1-n个源对象; 
* handler - 自定义赋值处理器，返回赋予target[k]的值。默认使用<code>noop</code>
* @returns 返回target
* @since 0.22.0
*/
function mergeWith(target, ...sources) {
	const rs = checkTarget(target);
	if (rs) return rs;
	let src = sources;
	const sl = src.length;
	let handler = src[sl - 1];
	if (!isFunction(handler)) handler = noop;
	else src = src.slice(0, sl - 1);
	walkSources(target, src, handler, []);
	return target;
}
function walkSources(target, src, handler, stack) {
	eachSources(target, src, null, (v, sv, tv, k, s, t) => {
		const path = concat(stack, k);
		v = handler(sv, tv, k, s, t, path);
		if (v !== void 0) t[k] = v;
		else if (isObject(tv) && !isFunction(tv)) walkSources(tv, [sv], handler, path);
		else t[k] = sv;
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
* @param predicate (v,k)断言函数
* @returns 对象子集
* @since 0.23.0
*/
function omitBy(obj, predicate) {
	const rs = {};
	if (obj === null || obj === void 0) return rs;
	const ks = Object.keys(obj);
	for (let i = 0; i < ks.length; i++) {
		const k = ks[i];
		const v = obj[k];
		if (!(predicate || identity)(v, k)) rs[k] = v;
	}
	return rs;
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
* 解析标准/非标准JSON字符串
* 如果str非字符串类型，返回原值
* 如果str是无效JSON字符串，返回原值
* 
* @example
* //{a:1,b:2,c:'3'}
* console.log(_.parseJSON("{a:1,b:2,c:'3'}"))
* //{a:1,b:2,c:'3"'}
* console.log(_.parseJSON(`[{"a":1,"b":2,"c":"3\\""}]`))
* //true
* console.log(_.parseJSON('true'))
* //12
* console.log(_.parseJSON('12'))
* 
*
* @param str JSON字符串
* @param ignore 如果为true，当值为 NaN/Infinity 时忽略该属性，否则返回值对应字符串。默认false
* @returns 解析后的对象或空对象
* @since 1.9.0
*/
function parseJSON(str, ignore = false) {
	if (!isString(str)) return str;
	let s = (str + "").replace(/:\s*(['`])(.*)\1(?=\s*[},])/gm, ":\"$2\"").replace(/([{,])\s*(['`])?([\p{L}0-9_$]+)\2?\s*:/gmu, "$1\"$3\":").replace(/([\[,])(['`])(.*)\2(?=\s*[,\]])/gm, "$1\"$3\"");
	s = ignore ? s.replace(/[{,]\s*"[a-zA-Z0-9_$]+"\s*:\s*([-+]?NaN|[-+]?Infinity)\s*/gm, "") : s.replace(/:\s*([-+]?NaN|[-+]?Infinity)\s*([,}])/gm, ":\"$1\"$2");
	let rs;
	try {
		rs = JSON.parse(s);
	} catch (e) {
		rs = str;
	}
	return rs;
}
/**
* 同<code>pick</code>，但支持断言函数进行选取
* @example
* //{a: 1, b: 2}
* console.log(_.pickBy({a:1,b:2,c:'3'},_.isNumber))
*
* @param obj 选取对象
* @param predicate (v,k)断言函数
* @returns 对象子集
* @since 0.23.0
*/
function pickBy(obj, predicate) {
	const rs = {};
	if (obj === null || obj === void 0) return rs;
	const ks = Object.keys(obj);
	for (let i = 0; i < ks.length; i++) {
		const k = ks[i];
		const v = obj[k];
		if ((predicate || identity)(v, k)) rs[k] = v;
	}
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
	if (vals.length === 0) return {};
	const rs = {};
	const pairs = [];
	let key = null;
	vals.forEach((v) => {
		if (isArray(v)) {
			const tmp = toObject(...v);
			assign(rs, tmp);
		} else if (isMap(v)) v.forEach((val, k) => {
			rs[k] = val;
		});
		else if (isObject(v)) {
			if (key) {
				pairs.push(key, v);
				key = null;
			} else assign(rs, v);
		} else if (key) {
			pairs.push(key, v);
			key = null;
		} else key = v;
	});
	if (key) pairs.push(key);
	if (pairs.length > 0) for (let i = 0; i < pairs.length; i += 2) rs[pairs[i]] = pairs[i + 1];
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
	if (!isObject(obj)) return obj;
	const chain = toPath(path);
	let target = obj;
	for (let i = 0; i < chain.length; i++) {
		const seg = chain[i];
		const nextSeg = chain[i + 1];
		let tmp = target[seg];
		if (nextSeg) tmp = target[seg] = !tmp ? isNaN(parseInt(nextSeg)) ? {} : [] : tmp;
		else return delete target[seg];
		target = tmp;
	}
	return false;
}
/**
* 返回对象/Map的所有value数组
* 包括原型链中的属性
*
* @example
* let f = new Function("this.a=1;this.b=2;");
* f.prototype.c = 3;
* //[1,2,3]
* console.log(_.valuesIn(new f()))
*
* @param obj
* @returns 值列表
*/
function valuesIn(obj) {
	if (isMap(obj)) return Array.from(obj.values());
	return keysIn(obj).map((k) => obj[k]);
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
	if (str.length < 1) return str;
	return str[0].toLowerCase() + str.substring(1);
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
	let rs = "";
	str = toString(str);
	let prevType = 0;
	for (let i = 0; i < str.length; i++) {
		let s = str[i];
		if (isLowerCaseChar(s) || isNumeric(s)) {
			if (prevType === 3 || prevType === 0) s = s.toUpperCase();
			rs += s;
			prevType = 1;
			continue;
		}
		if (s === " " || s === "-" || s === "_") {
			if (prevType === 3) continue;
			prevType = 3;
			continue;
		}
		if (isUpperCaseChar(s)) {
			if (prevType === 2) s = s.toLowerCase();
			rs += s;
			prevType = 2;
		}
	}
	return rs;
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
	if (str.length < 1) return str;
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
	let rs = "";
	str = toString(str);
	for (let i = 0; i < str.length; i++) {
		let s = str[i];
		const code = s.charCodeAt(0);
		if (code === 36 || code === 46 || code === 63 || code >= 40 && code <= 43 || code >= 91 && code <= 94 || code >= 123 && code <= 125) s = "\\" + s;
		rs += s;
	}
	return rs;
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
* @param fromIndex 起始索引
* @returns 第一个匹配搜索字符串的位置索引或-1
*/
function indexOf(str, search, fromIndex = 0) {
	str = toString(str);
	return str.indexOf(search, fromIndex || 0);
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
	let rs = "";
	str = toString(str);
	let prevType = 0;
	let lastPos = str.length - 1;
	for (let i = 0; i < str.length; i++) {
		const s = str[i];
		if (isLowerCaseChar(s) || isNumeric(s)) {
			rs += s;
			prevType = 1;
			continue;
		}
		if (s === " " || s === "-" || s === "_") {
			if (prevType === 3 || i === lastPos) continue;
			rs += "-";
			prevType = 3;
			continue;
		}
		if (isUpperCaseChar(s)) {
			if (prevType === 1) rs += "-";
			rs += s.toLowerCase();
			prevType = 2;
		}
	}
	return rs;
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
* @param fromIndex 起始索引，从起始索引位置向左查找指定字符串
* @returns 最后一个匹配搜索字符串的位置索引或-1
*/
function lastIndexOf(str, search, fromIndex = Infinity) {
	str = toString(str);
	return str.lastIndexOf(search, fromIndex !== null && fromIndex !== void 0 ? fromIndex : Infinity);
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
* 使用填充字符串填充原字符串达到指定长度。从原字符串起始开始填充。
*
* @example
* //001
* console.log(_.padStart('1',3,'0'))
*
* @param str 原字符串。如果非字符串则会自动转换成字符串
* @param len 填充后的字符串长度，如果长度小于原字符串长度，返回原字符串
* @param padString 填充字符串，如果填充后超出指定长度，会自动截取并保留右侧字符串
* @returns 在原字符串起始填充至指定长度后的字符串
*/
function padStart(str, len, padString = " ") {
	var _padString2;
	str = toString(str);
	if (str.padStart) return str.padStart(len, padString);
	padString = (_padString2 = padString) !== null && _padString2 !== void 0 ? _padString2 : " ";
	const diff = len - str.length;
	if (diff < 1) return str;
	let fill = "";
	let i = Math.ceil(diff / padString.length);
	while (i--) fill += padString;
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
	return padStart(str, len, "0");
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
	if (count < 1) return "";
	if (str.repeat) return str.repeat(count);
	let i = count;
	let rs = "";
	while (i--) rs += str;
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
* 使用<code>replaceValue</code>替换<code>str</code>中的所有<code>searchValue</code>部分
*
* @example
* //'a-b-c'
* console.log(_.replaceAll('a.b.c','.','-'))
* //''
* console.log(_.replaceAll(null,'.','-'))
* //'kelikeli'
* console.log(_.replaceAll('geligeli',/ge/,'ke'))
* //'geligeli'
* console.log(_.replaceAll('kelikeli',/ke/g,()=>'ge'))
*
* @param str 字符串。非字符串值会自动转换成字符串
* @param searchValue 查找内容，正则或者字符串。非global模式的正则对象会自动转为global模式
* @param replaceValue 替换内容，字符串或处理函数。函数的返回值将用于替换
* @returns 替换后的新字符串
* @since 1.0.0
*/
var regCache$1 = /* @__PURE__ */ new Map();
function getGlobalRegExp(source) {
	let re = regCache$1.get(source);
	if (!re) {
		re = new RegExp(source, "g");
		regCache$1.set(source, re);
	}
	return re;
}
function replaceAll(str, searchValue, replaceValue) {
	let searchExp;
	let strRs = toString(str);
	if (isRegExp(searchValue)) {
		searchExp = searchValue;
		if (!searchValue.global) {
			const key = searchValue.source + "\0" + searchValue.flags + "g";
			searchExp = regCache$1.get(key);
			if (!searchExp) {
				searchExp = new RegExp(searchValue, searchValue.flags + "g");
				regCache$1.set(key, searchExp);
			}
		}
		return strRs.replace(searchExp, replaceValue);
	} else if (isString(searchValue)) {
		searchExp = getGlobalRegExp(escapeRegExp(searchValue));
		return strRs.replace(searchExp, replaceValue);
	} else if (isObject(searchValue)) {
		const ks = Object.keys(searchValue);
		for (let i = ks.length; i--;) {
			const k = ks[i];
			const v = searchValue[k];
			searchExp = getGlobalRegExp(escapeRegExp(k));
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
	let rs = "";
	str = toString(str);
	let prevType = 0;
	let lastPos = str.length - 1;
	for (let i = 0; i < str.length; i++) {
		const s = str[i];
		if (isLowerCaseChar(s) || isNumeric(s)) {
			rs += s;
			prevType = 1;
			continue;
		}
		if (s === " " || s === "-" || s === "_") {
			if (prevType === 3 || i === lastPos) continue;
			rs += "_";
			prevType = 3;
			continue;
		}
		if (isUpperCaseChar(s)) {
			if (prevType === 1) rs += "_";
			rs += s.toLowerCase();
			prevType = 2;
		}
	}
	return rs;
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
* @param limit 限制返回的结果数量，为空返回所有结果
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
* @param position 索引
* @returns 如果以查询子字符串开头返回true，否则返回false
*/
function startsWith(str, searchStr, position = 0) {
	if (typeof str === "string") return str.startsWith(searchStr, position);
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
* @param indexStart 起始索引，包含
* @param indexEnd 结束索引，不包含
* @returns
*/
function substring(str, indexStart = 0, indexEnd) {
	str = toString(str);
	indexStart = indexStart || 0;
	return str.substring(indexStart, indexEnd);
}
var testCache = /* @__PURE__ */ new Map();
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
* @param flags 如果pattern参数不是正则类型，会使用该标记作为正则构造的第二个参数
* @returns 匹配返回true
* @since 0.19.0
*/
function test(str, pattern, flags) {
	if (isRegExp(pattern)) {
		pattern.lastIndex = 0;
		return pattern.test(str);
	}
	const key = (flags || "") + "\0" + pattern;
	let regExp = testCache.get(key);
	if (!regExp) {
		regExp = new RegExp(pattern.replace(/([+/\\()\[\].{}])/gm, "\\$1"), flags);
		testCache.set(key, regExp);
	}
	regExp.lastIndex = 0;
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
* @param scale 小数位长度
* @returns 截取后的字符串
*/
function toFixed(v, scale = 0) {
	scale = scale || 0;
	const num = parseFloat(v + "");
	if (isNaN(num)) return v;
	let numStr = num + "";
	if (numStr.includes("e")) {
		let [coefficient, power] = numStr.split("e");
		let p = parseInt(power);
		let cn = coefficient.replace(".", "");
		numStr = p < 0 ? `0.${"0".repeat(-p - 1)}${cn}` : `${cn}${"0".repeat(p - cn.length + 1)}`;
	}
	const isNeg = num < 0 ? -1 : 1;
	const tmp = numStr.split(".");
	const frac = tmp[1] || "";
	const diff = scale - frac.length;
	let rs = "";
	if (diff > 0) {
		let z = padEnd(frac, scale, "0");
		z = z ? "." + z : z;
		rs = tmp[0] + z;
	} else if (diff === 0) rs = numStr;
	else {
		let integ = parseInt(tmp[0]);
		const i = frac.length + diff;
		const round = frac.substring(i);
		let keep = frac.substring(0, i);
		let startZ = false;
		if (keep[0] === "0" && keep.length > 1) {
			keep = 1 + keep.substring(1);
			startZ = true;
		}
		let n = Math.round(parseFloat(keep + "." + round));
		let nStr = keep || n > 0 ? n + "" : "";
		const strN = keep || n > 0 ? n + "" : "";
		if (n > 0 && strN.length > keep.length) {
			integ += 1 * isNeg;
			nStr = strN.substring(1);
		}
		if (startZ) nStr = parseInt(strN[0]) - 1 + strN.substring(1);
		nStr = nStr !== "" && keep.length > 0 ? "." + nStr : nStr;
		rs = integ + nStr + "";
		if (isNeg < 0 && rs[0] !== "-") rs = "-" + rs;
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
	if (str.trimEnd) return str.trimEnd();
	return str.replace(/\s*$/, "");
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
	if (str.trimStart) return str.trimStart();
	return str.replace(/^\s*/, "");
}
var sepCache = /* @__PURE__ */ new Map();
var regCache = /* @__PURE__ */ new Map();
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
	if (str.length <= len) return str;
	if (!isObject(options)) options = { omission: "..." };
	options.omission = options.omission || "...";
	str = str.substring(0, len);
	if (options.separator) {
		let separator;
		const rawSeparator = options.separator;
		if (!isObject(rawSeparator)) {
			const src = escapeRegExp(rawSeparator);
			let cached = sepCache.get(src);
			if (!cached) {
				cached = new RegExp(src, "g");
				sepCache.set(src, cached);
			}
			separator = cached;
		} else if (!rawSeparator.global) {
			const key = rawSeparator.source + "\0" + rawSeparator.flags + "g";
			let cached = regCache.get(key);
			if (!cached) {
				cached = new RegExp(rawSeparator.source, rawSeparator.flags + "g");
				regCache.set(key, cached);
			}
			separator = cached;
		} else separator = rawSeparator;
		separator.lastIndex = 0;
		let rs;
		let tmp;
		while ((tmp = separator.exec(str)) !== null) rs = tmp;
		if (rs) str = str.substring(0, rs.index);
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
	if (str.length < 1) return str;
	return str[0].toUpperCase() + str.substring(1);
}
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
* 使用MTL(Myfx Template Language)编译字符串模板，并返回编译后的render函数
*
* ### 一个MTL模板由如下部分组成：
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
* @param options MTL参数
* @param options.delimiters 分隔符，默认 ['[%' , '%]']
* @param options.mixins 混入对象。\{名称:模板字符串\}
* @param options.globals 全局变量对象，可以在任意位置引用。模板内置的全局对象有两个：`print(content)`函数、`_` 对象，Myfx的命名空间
* @param options.stripWhite 是否剔除空白，默认false。剔除发生在编译期间，渲染时不会受到影响。剔除规则：如果一行只有一个MTL注释或语句，则该行所占空白会被移除。
* @returns 编译后的执行函数。该函数需要传递一个对象类型的参数作为运行时参数
* @since 1.0.0
*/
function template(string, options) {
	let delimiters = map((options === null || options === void 0 ? void 0 : options.delimiters) || template.settings.delimiters, (d) => {
		return map(replace(d, /\//gim, ""), (l) => {
			return includes(ESCAPES, l) ? "\\" + l : l;
		}).join("");
	});
	if (!options) options = {
		delimiters,
		globals: {},
		mixins: void 0,
		stripWhite: false
	};
	const mixins = options.mixins;
	const stripWhite = options.stripWhite || false;
	const splitExp = getSplitExp(delimiters);
	splitExp.lastIndex = 0;
	return compile(parse(string, splitExp, mixins, stripWhite, delimiters), options);
}
var ESCAPES = [
	"[",
	"]",
	"{",
	"}",
	"$"
];
var splitCache = /* @__PURE__ */ new Map();
var modRegCache = /* @__PURE__ */ new Map();
function getSplitExp(delimiters) {
	const key = delimiters.join("\0");
	let re = splitCache.get(key);
	if (!re) {
		const comment = delimiters[0] + template.settings.comment + delimiters[1];
		const interpolate = delimiters[0] + template.settings.interpolate + delimiters[1];
		const evaluate = delimiters[0] + template.settings.evaluate + delimiters[1];
		const mixin = delimiters[0] + template.settings.mixin + delimiters[1];
		re = new RegExp(`(?:${comment})|(?:${mixin})|(?:${interpolate})|(?:${evaluate})`, "mg");
		splitCache.set(key, re);
	}
	return re;
}
function getModReg(delimiter) {
	let re = modRegCache.get(delimiter);
	if (!re) {
		re = new RegExp(delimiter);
		modRegCache.set(delimiter, re);
	}
	return re;
}
/**
* 模板设置对象
*/
template.settings = {
	/**
	* @defaultValue ['[%', '%]']
	*/
	delimiters: ["[%", "%]"],
	interpolate: "=([\\s\\S]+?)",
	comment: "--[\\s\\S]+?--",
	mixin: "@([a-zA-Z_$][\\w_$]*)([\\s\\S]+?)",
	evaluate: "([\\s\\S]+?)"
};
function parse(str, splitExp, mixins, stripWhite, delimiters) {
	let indicator = 0;
	let lastSegLength = 0;
	const fullStack = [];
	let prevText = null;
	while (true) {
		const rs = splitExp.exec(str);
		if (rs == null) break;
		else {
			let text = str.substring(indicator + lastSegLength, rs.index);
			if (prevText) {
				if (stripWhite) {
					const stripStart = prevText.replace(/\n\s*$/, "\n");
					const stripEnd = text.replace(/^\s*\n/, "");
					if (stripStart.length !== prevText.length && stripEnd.length !== text.length) text = stripEnd;
				}
			}
			prevText = text;
			indicator = rs.index;
			if (text) {
				const node = getText(text);
				fullStack.push(node);
			}
			try {
				const node2 = parseNode(rs, mixins, delimiters);
				fullStack.push(node2);
			} catch (error) {
				const tipInfo = map(takeRight(fullStack, 5), "source").join("") + rs[0];
				let tipIndicator = "^".repeat(rs[0].length);
				const tipLineStartIndex = lastIndexOf(substring(str, 0, rs.index), "\n") + 1;
				tipIndicator = padStart(tipIndicator, rs.index - tipLineStartIndex + tipIndicator.length, " ");
				const reason = error instanceof Error ? error.message : String(error);
				throw new SyntaxError("Invalid template syntax near: " + tipInfo + "\n" + tipIndicator + "\n" + reason);
			}
			lastSegLength = rs[0].length;
		}
	}
	const lastText = str.substring(indicator + lastSegLength);
	if (lastText) {
		const node = getText(lastText);
		fullStack.push(node);
	}
	return fullStack;
}
function getText(str) {
	return {
		text: true,
		source: str
	};
}
function parseNode(rs, mixins, delimiters) {
	const parts = compact(rs);
	const src = parts[0];
	switch (src.replace(getModReg(delimiters[0]), "")[0]) {
		case "-": return {
			comment: true,
			source: src
		};
		case "=": return {
			interpolate: true,
			source: src,
			expression: parts[1]
		};
		case "@":
			const mixin = parts[1];
			if (!mixins || !mixins[mixin]) throw new SyntaxError(`The mixin '${mixin}' does not exist, check if the options.mixins has been set`);
			let paramters = trim(parts[2]);
			if (paramters) {
				const matcher = paramters.match(/\{(?:,?[a-zA-Z_$][a-zA-Z0-9_$]*(?::.*?)?)+\}/gm);
				if (!matcher) throw new SyntaxError(`Invalid mixin paramters '${parts[2]}', must be JSON form`);
				paramters = matcher[0];
			}
			return {
				mixin: true,
				source: src,
				tmpl: mixins[mixin],
				paramters
			};
		default: return {
			evaluate: true,
			source: src,
			expression: parts[1]
		};
	}
}
function compile(tokens, options) {
	let funcStr = "";
	each(tokens, (token) => {
		if (token.comment) return;
		if (token.text) funcStr += "\nprint(`" + token.source + "`);";
		else if (token.interpolate) funcStr += `\nprint(${token.expression});`;
		else if (token.evaluate) funcStr += "\n" + token.expression;
		else if (token.mixin) funcStr += `\nprint(_.template(${JSON.stringify(token.tmpl)},$options)(${token.paramters}));`;
	});
	return (obj) => {
		let declarations = keys(obj).join(",");
		if (declarations) declarations = "{" + declarations + "}";
		let globalKeys = [];
		let globalValues = [];
		const paramAry = unzip(toPairs(options.globals));
		if (size(paramAry) > 0) {
			globalKeys = paramAry[0];
			globalValues = paramAry[1];
		}
		if (!globalKeys.includes("_")) {
			globalKeys.push("_");
			globalValues.push(myfx);
		}
		return new Function(...globalKeys, "$options", `return function(${declarations}){
      const textQ=[];
      const print=(str)=>{
        textQ.push(str)
      };` + funcStr + ";return textQ.join(\"\")}")(...globalValues, options)(obj);
	};
}
/**
* 使用高性能算法，将array结构数据变为tree结构数据。*注意，会修改原始数据*
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
* @param pidKey 父id标识
* @param options 自定义选项
* @param options.rootParentValue 根节点的parentValue，用于识别根节点。默认null
* @param options.childrenKey 包含子节点容器的key。默认'children'
* @param options.attrMap 转换tree节点时的属性映射，如\{text:'name'\}表示把array中一条记录的name属性映射为tree节点的text属性
* @param options.sortKey 如果指定排序字段，则会在转换tree时自动排序。字段值可以是数字或字符等可直接进行比较的类型。性能高于转换后再排序
* @returns 返回转换好的顶级节点数组或空数组
* @since 1.0.0
*/
function arrayToTree(array, idKey = "id", pidKey = "pid", options = {
	childrenKey: "children",
	rootParentValue: null,
	attrMap: void 0,
	sortKey: ""
}) {
	if (!isArray(array)) return [];
	const pk = pidKey || "pid";
	const attrMap = options.attrMap;
	const hasAttrMap = !!attrMap && isObject(attrMap);
	const rootParentValue = get(options, "rootParentValue", null);
	const childrenKey = options.childrenKey || "children";
	const sortKey = options.sortKey;
	const hasSortKey = !!sortKey;
	const roots = [];
	const nodeMap = {};
	const sortMap = {};
	const initParentMap = {};
	array.forEach((record) => {
		const nodeId = record[idKey || "id"];
		nodeMap[nodeId] = record;
		if (hasSortKey) {
			const sortNo = record[sortKey];
			sortMap[nodeId] = [sortNo, sortNo];
		}
		if (record[pk] === rootParentValue) {
			if (hasAttrMap) each(attrMap, (v, k) => record[k] = record[v]);
			roots.push(record);
		}
	});
	array.forEach((record) => {
		const parentId = record[pk];
		const parentNode = nodeMap[parentId];
		if (parentNode) {
			let children = parentNode[childrenKey];
			if (!initParentMap[parentId]) {
				children = parentNode[childrenKey] = [];
				initParentMap[parentId] = true;
			}
			if (hasAttrMap) each(attrMap, (v, k) => record[k] = record[v]);
			if (hasSortKey) {
				const [min, max] = sortMap[parentId];
				const sortNo = record[sortKey];
				if (sortNo <= min) {
					children.unshift(record);
					sortMap[parentId][0] = sortNo;
				} else if (sortNo >= max) {
					children.push(record);
					sortMap[parentId][1] = sortNo;
				} else {
					const i = sortedIndexBy(children, { [sortKey]: sortNo }, sortKey);
					children.splice(i, 0, record);
				}
			} else children.push(record);
		}
	});
	return hasSortKey ? sortBy(roots, sortKey) : roots;
}
/**
* 根据指定的node及parentKey属性，查找最近的祖先节点
* @param node Element节点或普通对象节点
* @param predicate (node,times,cancel)断言函数，如果返回true表示节点匹配。或调用cancel中断查找
* @param parentKey 父节点引用属性名
* @param composed 是否跨越web组件边界查找，默认为false
* @returns 断言为true的最近一个祖先节点
* @since 1.0.0
*/
function closest(node, predicate, parentKey, composed = false) {
	let p = node;
	let t = null;
	let k = true;
	let i = 0;
	while (k && p) {
		if (composed && p instanceof ShadowRoot) p = p.host;
		if (predicate(p, i++, () => {
			k = false;
		})) {
			t = p;
			break;
		}
		p = p[parentKey];
	}
	return t;
}
var MAX_DEPTH = 128;
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
* @param callback (node,parentNode,chain,level,index)回调函数，如果返回false则中断遍历，如果返回-1则停止分支遍历
* @param options 自定义选项
* @param options.childrenKey 包含子节点容器的key。默认'children'
* @since 1.0.0
*/
function walkTree(treeNodes, callback, options) {
	_walkTree(treeNodes, callback, options);
}
function _walkTree(treeNodes, callback, options, ...rest) {
	if (!isObject(treeNodes)) return;
	options = options || {};
	const parentNode = rest[0];
	const chain = rest[1] || [];
	const childrenKey = options.childrenKey || "children";
	const data = isArrayLike(treeNodes) ? treeNodes : [treeNodes];
	for (let i = 0; i < data.length; i++) {
		const node = data[i];
		const rs = callback(node, parentNode, chain, chain.length, i);
		if (rs === false) return false;
		if (rs === -1) continue;
		if (!isEmpty(node[childrenKey])) {
			if (chain.length >= MAX_DEPTH) continue;
			chain.push(node);
			const childRs = _walkTree(node[childrenKey], callback, options, node, chain);
			chain.pop();
			if (childRs === false) return;
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
function filterTree(treeNodes, predicate, options = { childrenKey: "children" }) {
	const callback = iteratee(predicate);
	const childrenKey = options.childrenKey || "children";
	let nodes = [];
	walkTree(treeNodes, (n, p, c, l) => {
		if (callback(n, p, c, l)) {
			c.forEach((node) => {
				if (!includes(nodes, node)) nodes.push(node);
			});
			nodes.push(n);
		}
	}, options);
	nodes = map(nodes, (item) => cloneWith(item, (v, k) => k === childrenKey ? null : v));
	return nodes;
}
function findTreeNode(treeNodes, predicate, options) {
	const callback = iteratee(predicate);
	let node;
	walkTree(treeNodes, (n, p, c, l, i) => {
		if (callback(n, p, c, l, i)) {
			node = n;
			return false;
		}
	}, options);
	return node;
}
function findTreeNodes(treeNodes, predicate, options) {
	const callback = iteratee(predicate);
	const nodes = [];
	walkTree(treeNodes, (n, p, c, l, i) => {
		if (callback(n, p, c, l, i)) nodes.push(n);
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
function sortTree(treeNodes, comparator, options = { childrenKey: "children" }) {
	const childrenKey = options.childrenKey || "children";
	const data = isArray(treeNodes) ? treeNodes : [treeNodes];
	data.sort((a, b) => comparator(a, b));
	data.forEach((node) => {
		if (!isEmpty(node[childrenKey])) sortTree(node[childrenKey], comparator);
	});
}
var ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split("");
/**
* 生成一个指定长度的alphaId并返回。id内容由随机字母表字符组成
* @example
* // urN-k0mpetBwboeQ
* console.log(_.alphaId())
* // Ii6cPyfw-Ql5YC8OIhVwH1lpGY9x
* console.log(_.alphaId(28))
*
* @param len id长度
* @returns alphaId
* @since 1.0.0
*/
function alphaId(len = 16) {
	const bytes = globalThis.crypto.getRandomValues(new Uint8Array(len || 16));
	let rs = "";
	for (let i = 0; i < bytes.length; i++) rs += ALPHABET[bytes[i] % ALPHABET.length];
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
	if (v === null || v === void 0 || Number.isNaN(v)) return defaultValue;
	return v;
}
var identity_default = identity;
var iteratee_default = iteratee;
/**
* 为 myfx 扩展额外函数，扩展后的函数同样具有函数链访问能力
*
* @example
* //增加扩展
* _.mixin({
*  select:_.get,
*  from:_.chain,
*  where:_.filter,
*  top:_.first
* });
*
* const libs = [
*  {name:'myfx',platform:['web','nodejs'],tags:{utils:true},js:true},
*  {name:'juth2',platform:['web','java'],tags:{utils:false,middleware:true},js:false},
*  {name:'soya2d',platform:['web'],tags:{utils:true},js:true}
* ];
* //查询utils是true的第一行数据的name值
* console.log(_.from(libs).where({tags:{utils:true}}).top().select('name').value())
*
* @param obj 扩展的函数声明
*/
function mixin(target, obj) {
	functions(obj).forEach((fnName) => {
		const fn = obj[fnName];
		if (target.prototype && target.prototype.constructor.name === "FuncChain") target.prototype["_" + fnName] = function(...rest) {
			this._chain.push({
				fn,
				params: rest
			});
			return this;
		};
		else target["_" + fnName] = fn;
	});
}
var noop_default = noop;
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
* @param epoch 时间起点，用于计算相对时间戳
* @returns snowflakeId 由于js精度问题，直接返回字符串而不是number，如果nodeId为空返回 '0000000000000000000'
* @since 1.0.0
*/
function snowflakeId(nodeId, epoch = 15804864e5) {
	epoch = epoch || 15804864e5;
	if (isNil(nodeId)) return "0000000000000000000";
	let nowTime = Date.now();
	if (lastTimeStamp === nowTime) {
		sequence += randi(1, 9);
		if (sequence > 4095) {
			nowTime = _getNextTime(lastTimeStamp);
			sequence = randi(0, 99);
		}
	} else sequence = randi(0, 99);
	lastTimeStamp = nowTime;
	const timeOffset = (nowTime - epoch).toString(2);
	const nodeBits = padEnd((nodeId % 1023).toString(2) + "", 10, "0");
	const seq = padZ(sequence.toString(2) + "", 12);
	return BigInt(`0b${timeOffset}${nodeBits}${seq}`).toString();
}
var lastTimeStamp = -1;
var sequence = 0;
var _getNextTime = (lastTime) => {
	let t = Date.now();
	while (t <= lastTime) t = Date.now();
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
* @param prefix id前缀
* @returns 唯一id
* @since 0.16.0
*/
function uniqueId(prefix) {
	return (prefix !== void 0 ? prefix + "_" : "") + seed++;
}
var seed = 0;
var VARIANTS = [
	"8",
	"9",
	"a",
	"b"
];
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
	let uuid = "";
	if (globalThis.crypto && globalThis.crypto.randomUUID) uuid = globalThis.crypto.randomUUID();
	else {
		const r32 = Math.random();
		const r16 = Math.random();
		const p1Num = Math.floor(r32 * 4026531839) + 268435456;
		const p1 = p1Num.toString(16);
		const p2Num = Math.floor(r16 * 61439) + 4096;
		const p2 = p2Num.toString(16);
		const p3 = substring((p2Num << 1).toString(16), 0, 3);
		const p4 = substring((p2Num >> 1).toString(16), 0, 3);
		let p5 = Date.now().toString(16);
		p5 = substring((p1Num >> 1).toString(16), 0, 6) + substring(p5, p5.length - 6, p5.length);
		uuid = p1 + "-" + p2 + "-4" + p3 + "-" + VARIANTS[randi(0, 3)] + p4 + "-" + p5;
	}
	return delimiter ? uuid : uuid.replace(/-/g, "");
}
/**
* chain 函数集
*/
var ChainFx = class {
	append(...values) {
		return get(FuncChain.prototype, "_append").call(this, ...arguments);
	}
	chunk(size = 1) {
		return get(FuncChain.prototype, "_chunk").call(this, ...arguments);
	}
	compact() {
		return get(FuncChain.prototype, "_compact").call(this, ...arguments);
	}
	concat() {
		return get(FuncChain.prototype, "_concat").call(this, ...arguments);
	}
	except() {
		return get(FuncChain.prototype, "_except").call(this, ...arguments);
	}
	fill(value, start = 0, end) {
		return get(FuncChain.prototype, "_fill").call(this, ...arguments);
	}
	findIndex(predicate, fromIndex) {
		return get(FuncChain.prototype, "_findIndex").call(this, ...arguments);
	}
	findLastIndex(predicate, fromIndex) {
		return get(FuncChain.prototype, "_findLastIndex").call(this, ...arguments);
	}
	flat(depth = 1) {
		return get(FuncChain.prototype, "_flat").call(this, ...arguments);
	}
	flatDeep() {
		return get(FuncChain.prototype, "_flatDeep").call(this, ...arguments);
	}
	insert(index, ...values) {
		return get(FuncChain.prototype, "_insert").call(this, ...arguments);
	}
	intersect() {
		return get(FuncChain.prototype, "_intersect").call(this, ...arguments);
	}
	join(separator = ",") {
		return get(FuncChain.prototype, "_join").call(this, ...arguments);
	}
	pop(index = -1) {
		return get(FuncChain.prototype, "_pop").call(this, ...arguments);
	}
	pull(...values) {
		return get(FuncChain.prototype, "_pull").call(this, ...arguments);
	}
	range(end, step = 1) {
		return get(FuncChain.prototype, "_range").call(this, ...arguments);
	}
	remove(predicate) {
		return get(FuncChain.prototype, "_remove").call(this, ...arguments);
	}
	reverse() {
		return get(FuncChain.prototype, "_reverse").call(this, ...arguments);
	}
	slice(begin = 0, end) {
		return get(FuncChain.prototype, "_slice").call(this, ...arguments);
	}
	sortedIndex(value) {
		return get(FuncChain.prototype, "_sortedIndex").call(this, ...arguments);
	}
	sortedIndexBy(value, itee) {
		return get(FuncChain.prototype, "_sortedIndexBy").call(this, ...arguments);
	}
	union() {
		return get(FuncChain.prototype, "_union").call(this, ...arguments);
	}
	uniq() {
		return get(FuncChain.prototype, "_uniq").call(this, ...arguments);
	}
	uniqBy(itee) {
		return get(FuncChain.prototype, "_uniqBy").call(this, ...arguments);
	}
	unzip() {
		return get(FuncChain.prototype, "_unzip").call(this, ...arguments);
	}
	without(...values) {
		return get(FuncChain.prototype, "_without").call(this, ...arguments);
	}
	zip() {
		return get(FuncChain.prototype, "_zip").call(this, ...arguments);
	}
	zipObject(values) {
		return get(FuncChain.prototype, "_zipObject").call(this, ...arguments);
	}
	zipWith() {
		return get(FuncChain.prototype, "_zipWith").call(this, ...arguments);
	}
	countBy(itee = identity_default) {
		return get(FuncChain.prototype, "_countBy").call(this, ...arguments);
	}
	every(predicate) {
		return get(FuncChain.prototype, "_every").call(this, ...arguments);
	}
	filter(predicate) {
		return get(FuncChain.prototype, "_filter").call(this, ...arguments);
	}
	find(predicate) {
		return get(FuncChain.prototype, "_find").call(this, ...arguments);
	}
	findLast(predicate) {
		return get(FuncChain.prototype, "_findLast").call(this, ...arguments);
	}
	first() {
		return get(FuncChain.prototype, "_first").call(this, ...arguments);
	}
	flatMap(itee = identity_default, depth = 1) {
		return get(FuncChain.prototype, "_flatMap").call(this, ...arguments);
	}
	flatMapDeep(iteratee = identity_default) {
		return get(FuncChain.prototype, "_flatMapDeep").call(this, ...arguments);
	}
	groupBy(iteratee = identity_default) {
		return get(FuncChain.prototype, "_groupBy").call(this, ...arguments);
	}
	includes(value, fromIndex = 0) {
		return get(FuncChain.prototype, "_includes").call(this, ...arguments);
	}
	initial() {
		return get(FuncChain.prototype, "_initial").call(this, ...arguments);
	}
	keyBy(iteratee = identity_default) {
		return get(FuncChain.prototype, "_keyBy").call(this, ...arguments);
	}
	last() {
		return get(FuncChain.prototype, "_last").call(this, ...arguments);
	}
	map(iteratee = identity_default) {
		return get(FuncChain.prototype, "_map").call(this, ...arguments);
	}
	partition(predicate) {
		return get(FuncChain.prototype, "_partition").call(this, ...arguments);
	}
	reduce(callback, initialValue) {
		return get(FuncChain.prototype, "_reduce").call(this, ...arguments);
	}
	reject(predicate) {
		return get(FuncChain.prototype, "_reject").call(this, ...arguments);
	}
	sample() {
		return get(FuncChain.prototype, "_sample").call(this, ...arguments);
	}
	sampleSize(count = 1) {
		return get(FuncChain.prototype, "_sampleSize").call(this, ...arguments);
	}
	shuffle() {
		return get(FuncChain.prototype, "_shuffle").call(this, ...arguments);
	}
	size() {
		return get(FuncChain.prototype, "_size").call(this, ...arguments);
	}
	some(predicate) {
		return get(FuncChain.prototype, "_some").call(this, ...arguments);
	}
	sort(comparator) {
		return get(FuncChain.prototype, "_sort").call(this, ...arguments);
	}
	sortBy(iteratee = identity_default) {
		return get(FuncChain.prototype, "_sortBy").call(this, ...arguments);
	}
	tail() {
		return get(FuncChain.prototype, "_tail").call(this, ...arguments);
	}
	take(length) {
		return get(FuncChain.prototype, "_take").call(this, ...arguments);
	}
	takeRight(length) {
		return get(FuncChain.prototype, "_takeRight").call(this, ...arguments);
	}
	toArray() {
		return get(FuncChain.prototype, "_toArray").call(this, ...arguments);
	}
	addTime(amount, type = "s") {
		return get(FuncChain.prototype, "_addTime").call(this, ...arguments);
	}
	compareDate(date2, type = "d") {
		return get(FuncChain.prototype, "_compareDate").call(this, ...arguments);
	}
	formatDate(pattern = "yyyy-MM-dd HH:mm:ss") {
		return get(FuncChain.prototype, "_formatDate").call(this, ...arguments);
	}
	getDayOfYear() {
		return get(FuncChain.prototype, "_getDayOfYear").call(this, ...arguments);
	}
	getWeekOfMonth() {
		return get(FuncChain.prototype, "_getWeekOfMonth").call(this, ...arguments);
	}
	getWeekOfYear() {
		return get(FuncChain.prototype, "_getWeekOfYear").call(this, ...arguments);
	}
	isLeapYear() {
		return get(FuncChain.prototype, "_isLeapYear").call(this, ...arguments);
	}
	isSameDay(date2) {
		return get(FuncChain.prototype, "_isSameDay").call(this, ...arguments);
	}
	now() {
		return get(FuncChain.prototype, "_now").call(this, ...arguments);
	}
	toDate() {
		return get(FuncChain.prototype, "_toDate").call(this, ...arguments);
	}
	after(count = 0) {
		return get(FuncChain.prototype, "_after").call(this, ...arguments);
	}
	alt(interceptor1, interceptor2) {
		return get(FuncChain.prototype, "_alt").call(this, ...arguments);
	}
	bind(thisArg, ...args) {
		return get(FuncChain.prototype, "_bind").call(this, ...arguments);
	}
	bindAll(...methodNames) {
		return get(FuncChain.prototype, "_bindAll").call(this, ...arguments);
	}
	call(...args) {
		return get(FuncChain.prototype, "_call").call(this, ...arguments);
	}
	compose() {
		return get(FuncChain.prototype, "_compose").call(this, ...arguments);
	}
	debounce(wait, immediate = false) {
		return get(FuncChain.prototype, "_debounce").call(this, ...arguments);
	}
	delay(wait = 0, ...args) {
		return get(FuncChain.prototype, "_delay").call(this, ...arguments);
	}
	fval(args, context) {
		return get(FuncChain.prototype, "_fval").call(this, ...arguments);
	}
	once() {
		return get(FuncChain.prototype, "_once").call(this, ...arguments);
	}
	partial(...args) {
		return get(FuncChain.prototype, "_partial").call(this, ...arguments);
	}
	tap(interceptor) {
		return get(FuncChain.prototype, "_tap").call(this, ...arguments);
	}
	throttle(wait, options) {
		return get(FuncChain.prototype, "_throttle").call(this, ...arguments);
	}
	isAlnum() {
		return get(FuncChain.prototype, "_isAlnum").call(this, ...arguments);
	}
	isAlpha() {
		return get(FuncChain.prototype, "_isAlpha").call(this, ...arguments);
	}
	isArray() {
		return get(FuncChain.prototype, "_isArray").call(this, ...arguments);
	}
	isArrayLike() {
		return get(FuncChain.prototype, "_isArrayLike").call(this, ...arguments);
	}
	isBlank() {
		return get(FuncChain.prototype, "_isBlank").call(this, ...arguments);
	}
	isBoolean() {
		return get(FuncChain.prototype, "_isBoolean").call(this, ...arguments);
	}
	isCustomElement() {
		return get(FuncChain.prototype, "_isCustomElement").call(this, ...arguments);
	}
	isDate() {
		return get(FuncChain.prototype, "_isDate").call(this, ...arguments);
	}
	isDefined() {
		return get(FuncChain.prototype, "_isDefined").call(this, ...arguments);
	}
	isElement() {
		return get(FuncChain.prototype, "_isElement").call(this, ...arguments);
	}
	isEmpty() {
		return get(FuncChain.prototype, "_isEmpty").call(this, ...arguments);
	}
	isEqual(b) {
		return get(FuncChain.prototype, "_isEqual").call(this, ...arguments);
	}
	isEqualWith(b, comparator, _depth = 0) {
		return get(FuncChain.prototype, "_isEqualWith").call(this, ...arguments);
	}
	isError() {
		return get(FuncChain.prototype, "_isError").call(this, ...arguments);
	}
	isFinite() {
		return get(FuncChain.prototype, "_isFinite").call(this, ...arguments);
	}
	isFunction() {
		return get(FuncChain.prototype, "_isFunction").call(this, ...arguments);
	}
	isInteger() {
		return get(FuncChain.prototype, "_isInteger").call(this, ...arguments);
	}
	isIterator() {
		return get(FuncChain.prototype, "_isIterator").call(this, ...arguments);
	}
	isLowerCaseChar() {
		return get(FuncChain.prototype, "_isLowerCaseChar").call(this, ...arguments);
	}
	isMap() {
		return get(FuncChain.prototype, "_isMap").call(this, ...arguments);
	}
	isMatch(props) {
		return get(FuncChain.prototype, "_isMatch").call(this, ...arguments);
	}
	isMatchWith(props, comparator) {
		return get(FuncChain.prototype, "_isMatchWith").call(this, ...arguments);
	}
	isNaN() {
		return get(FuncChain.prototype, "_isNaN").call(this, ...arguments);
	}
	isNative() {
		return get(FuncChain.prototype, "_isNative").call(this, ...arguments);
	}
	isNil() {
		return get(FuncChain.prototype, "_isNil").call(this, ...arguments);
	}
	isNode() {
		return get(FuncChain.prototype, "_isNode").call(this, ...arguments);
	}
	isNull() {
		return get(FuncChain.prototype, "_isNull").call(this, ...arguments);
	}
	isNumber() {
		return get(FuncChain.prototype, "_isNumber").call(this, ...arguments);
	}
	isNumeric() {
		return get(FuncChain.prototype, "_isNumeric").call(this, ...arguments);
	}
	isObject() {
		return get(FuncChain.prototype, "_isObject").call(this, ...arguments);
	}
	isPlainObject() {
		return get(FuncChain.prototype, "_isPlainObject").call(this, ...arguments);
	}
	isPrimitive() {
		return get(FuncChain.prototype, "_isPrimitive").call(this, ...arguments);
	}
	isRegExp() {
		return get(FuncChain.prototype, "_isRegExp").call(this, ...arguments);
	}
	isSafeInteger() {
		return get(FuncChain.prototype, "_isSafeInteger").call(this, ...arguments);
	}
	isSet() {
		return get(FuncChain.prototype, "_isSet").call(this, ...arguments);
	}
	isString() {
		return get(FuncChain.prototype, "_isString").call(this, ...arguments);
	}
	isSymbol() {
		return get(FuncChain.prototype, "_isSymbol").call(this, ...arguments);
	}
	isUndefined() {
		return get(FuncChain.prototype, "_isUndefined").call(this, ...arguments);
	}
	isUpperCaseChar() {
		return get(FuncChain.prototype, "_isUpperCaseChar").call(this, ...arguments);
	}
	isWeakMap() {
		return get(FuncChain.prototype, "_isWeakMap").call(this, ...arguments);
	}
	isWeakSet() {
		return get(FuncChain.prototype, "_isWeakSet").call(this, ...arguments);
	}
	add(b) {
		return get(FuncChain.prototype, "_add").call(this, ...arguments);
	}
	divide(b) {
		return get(FuncChain.prototype, "_divide").call(this, ...arguments);
	}
	max() {
		return get(FuncChain.prototype, "_max").call(this, ...arguments);
	}
	mean() {
		return get(FuncChain.prototype, "_mean").call(this, ...arguments);
	}
	median() {
		return get(FuncChain.prototype, "_median").call(this, ...arguments);
	}
	min() {
		return get(FuncChain.prototype, "_min").call(this, ...arguments);
	}
	minmax(max, value) {
		return get(FuncChain.prototype, "_minmax").call(this, ...arguments);
	}
	multiply(b) {
		return get(FuncChain.prototype, "_multiply").call(this, ...arguments);
	}
	randf(max) {
		return get(FuncChain.prototype, "_randf").call(this, ...arguments);
	}
	randi(max) {
		return get(FuncChain.prototype, "_randi").call(this, ...arguments);
	}
	subtract(b) {
		return get(FuncChain.prototype, "_subtract").call(this, ...arguments);
	}
	sum() {
		return get(FuncChain.prototype, "_sum").call(this, ...arguments);
	}
	formatNumber(pattern = "#,##0.00") {
		return get(FuncChain.prototype, "_formatNumber").call(this, ...arguments);
	}
	gt(b) {
		return get(FuncChain.prototype, "_gt").call(this, ...arguments);
	}
	gte(b) {
		return get(FuncChain.prototype, "_gte").call(this, ...arguments);
	}
	inRange(start = 0, end) {
		return get(FuncChain.prototype, "_inRange").call(this, ...arguments);
	}
	lt(b) {
		return get(FuncChain.prototype, "_lt").call(this, ...arguments);
	}
	lte(b) {
		return get(FuncChain.prototype, "_lte").call(this, ...arguments);
	}
	toInteger() {
		return get(FuncChain.prototype, "_toInteger").call(this, ...arguments);
	}
	toNumber() {
		return get(FuncChain.prototype, "_toNumber").call(this, ...arguments);
	}
	assign(...sources) {
		return get(FuncChain.prototype, "_assign").call(this, ...arguments);
	}
	assignWith(...sources) {
		return get(FuncChain.prototype, "_assignWith").call(this, ...arguments);
	}
	clone() {
		return get(FuncChain.prototype, "_clone").call(this, ...arguments);
	}
	cloneDeep() {
		return get(FuncChain.prototype, "_cloneDeep").call(this, ...arguments);
	}
	cloneDeepWith(handler, skip = (value, key) => false) {
		return get(FuncChain.prototype, "_cloneDeepWith").call(this, ...arguments);
	}
	cloneWith(handler, skip = (value, key) => false) {
		return get(FuncChain.prototype, "_cloneWith").call(this, ...arguments);
	}
	defaults(...sources) {
		return get(FuncChain.prototype, "_defaults").call(this, ...arguments);
	}
	defaultsDeep(...sources) {
		return get(FuncChain.prototype, "_defaultsDeep").call(this, ...arguments);
	}
	eq(b) {
		return get(FuncChain.prototype, "_eq").call(this, ...arguments);
	}
	findKey(predicate) {
		return get(FuncChain.prototype, "_findKey").call(this, ...arguments);
	}
	fromPairs() {
		return get(FuncChain.prototype, "_fromPairs").call(this, ...arguments);
	}
	functions() {
		return get(FuncChain.prototype, "_functions").call(this, ...arguments);
	}
	get(path, defaultValue) {
		return get(FuncChain.prototype, "_get").call(this, ...arguments);
	}
	has(key) {
		return get(FuncChain.prototype, "_has").call(this, ...arguments);
	}
	keys() {
		return get(FuncChain.prototype, "_keys").call(this, ...arguments);
	}
	keysIn() {
		return get(FuncChain.prototype, "_keysIn").call(this, ...arguments);
	}
	merge(...sources) {
		return get(FuncChain.prototype, "_merge").call(this, ...arguments);
	}
	mergeWith(...sources) {
		return get(FuncChain.prototype, "_mergeWith").call(this, ...arguments);
	}
	omit(...props) {
		return get(FuncChain.prototype, "_omit").call(this, ...arguments);
	}
	omitBy(predicate) {
		return get(FuncChain.prototype, "_omitBy").call(this, ...arguments);
	}
	parseJSON(ignore = false) {
		return get(FuncChain.prototype, "_parseJSON").call(this, ...arguments);
	}
	pick(...props) {
		return get(FuncChain.prototype, "_pick").call(this, ...arguments);
	}
	pickBy(predicate) {
		return get(FuncChain.prototype, "_pickBy").call(this, ...arguments);
	}
	prop() {
		return get(FuncChain.prototype, "_prop").call(this, ...arguments);
	}
	set(path, value) {
		return get(FuncChain.prototype, "_set").call(this, ...arguments);
	}
	toObject() {
		return get(FuncChain.prototype, "_toObject").call(this, ...arguments);
	}
	toPairs() {
		return get(FuncChain.prototype, "_toPairs").call(this, ...arguments);
	}
	unset(path) {
		return get(FuncChain.prototype, "_unset").call(this, ...arguments);
	}
	values() {
		return get(FuncChain.prototype, "_values").call(this, ...arguments);
	}
	valuesIn() {
		return get(FuncChain.prototype, "_valuesIn").call(this, ...arguments);
	}
	camelCase() {
		return get(FuncChain.prototype, "_camelCase").call(this, ...arguments);
	}
	capitalize() {
		return get(FuncChain.prototype, "_capitalize").call(this, ...arguments);
	}
	endsWith(searchStr, position) {
		return get(FuncChain.prototype, "_endsWith").call(this, ...arguments);
	}
	escapeRegExp() {
		return get(FuncChain.prototype, "_escapeRegExp").call(this, ...arguments);
	}
	indexOf(search, fromIndex = 0) {
		return get(FuncChain.prototype, "_indexOf").call(this, ...arguments);
	}
	kebabCase() {
		return get(FuncChain.prototype, "_kebabCase").call(this, ...arguments);
	}
	lastIndexOf(search, fromIndex = Infinity) {
		return get(FuncChain.prototype, "_lastIndexOf").call(this, ...arguments);
	}
	lowerCase() {
		return get(FuncChain.prototype, "_lowerCase").call(this, ...arguments);
	}
	lowerFirst() {
		return get(FuncChain.prototype, "_lowerFirst").call(this, ...arguments);
	}
	padEnd(len, padString = " ") {
		return get(FuncChain.prototype, "_padEnd").call(this, ...arguments);
	}
	padStart(len, padString = " ") {
		return get(FuncChain.prototype, "_padStart").call(this, ...arguments);
	}
	padZ(len) {
		return get(FuncChain.prototype, "_padZ").call(this, ...arguments);
	}
	pascalCase() {
		return get(FuncChain.prototype, "_pascalCase").call(this, ...arguments);
	}
	repeat(count) {
		return get(FuncChain.prototype, "_repeat").call(this, ...arguments);
	}
	replace(searchValue, replaceValue) {
		return get(FuncChain.prototype, "_replace").call(this, ...arguments);
	}
	replaceAll(searchValue, replaceValue) {
		return get(FuncChain.prototype, "_replaceAll").call(this, ...arguments);
	}
	snakeCase() {
		return get(FuncChain.prototype, "_snakeCase").call(this, ...arguments);
	}
	split(separator, limit) {
		return get(FuncChain.prototype, "_split").call(this, ...arguments);
	}
	startsWith(searchStr, position = 0) {
		return get(FuncChain.prototype, "_startsWith").call(this, ...arguments);
	}
	substring(indexStart = 0, indexEnd) {
		return get(FuncChain.prototype, "_substring").call(this, ...arguments);
	}
	test(pattern, flags) {
		return get(FuncChain.prototype, "_test").call(this, ...arguments);
	}
	toFixed(scale = 0) {
		return get(FuncChain.prototype, "_toFixed").call(this, ...arguments);
	}
	toString() {
		return get(FuncChain.prototype, "_toString").call(this, ...arguments);
	}
	trim() {
		return get(FuncChain.prototype, "_trim").call(this, ...arguments);
	}
	trimEnd() {
		return get(FuncChain.prototype, "_trimEnd").call(this, ...arguments);
	}
	trimStart() {
		return get(FuncChain.prototype, "_trimStart").call(this, ...arguments);
	}
	truncate(len, options) {
		return get(FuncChain.prototype, "_truncate").call(this, ...arguments);
	}
	upperCase() {
		return get(FuncChain.prototype, "_upperCase").call(this, ...arguments);
	}
	upperFirst() {
		return get(FuncChain.prototype, "_upperFirst").call(this, ...arguments);
	}
	arrayToTree(idKey = "id", pidKey = "pid", options = {
		childrenKey: "children",
		rootParentValue: null,
		attrMap: void 0,
		sortKey: ""
	}) {
		return get(FuncChain.prototype, "_arrayToTree").call(this, ...arguments);
	}
	closest(predicate, parentKey, composed = false) {
		return get(FuncChain.prototype, "_closest").call(this, ...arguments);
	}
	filterTree(predicate, options = { childrenKey: "children" }) {
		return get(FuncChain.prototype, "_filterTree").call(this, ...arguments);
	}
	findTreeNode(predicate, options) {
		return get(FuncChain.prototype, "_findTreeNode").call(this, ...arguments);
	}
	findTreeNodes(predicate, options) {
		return get(FuncChain.prototype, "_findTreeNodes").call(this, ...arguments);
	}
	alphaId() {
		return get(FuncChain.prototype, "_alphaId").call(this, ...arguments);
	}
	defaultTo(defaultValue) {
		return get(FuncChain.prototype, "_defaultTo").call(this, ...arguments);
	}
	matcher() {
		return get(FuncChain.prototype, "_matcher").call(this, ...arguments);
	}
	snowflakeId(epoch = 15804864e5) {
		return get(FuncChain.prototype, "_snowflakeId").call(this, ...arguments);
	}
	times(iteratee) {
		return get(FuncChain.prototype, "_times").call(this, ...arguments);
	}
	uniqueId() {
		return get(FuncChain.prototype, "_uniqueId").call(this, ...arguments);
	}
	uuid() {
		return get(FuncChain.prototype, "_uuid").call(this, ...arguments);
	}
};
/**
* 用于定义FuncChain对象并构造函数链
* 注意，该类仅用于内部构造函数链
*/
var FuncChain = class extends ChainFx {
	/**
	* @internal 
	*/
	constructor(v) {
		super();
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
		let comprehension = isArrayLike(this._wrappedValue) ? createComprehension() : null;
		const maxChainIndex = this._chain.length - 1;
		return this._chain.reduce((acc, v, i) => {
			const params = [acc, ...v.params];
			if (comprehension) {
				let rs;
				const sig = buildComprehension(comprehension, v.fn, v.params);
				if (sig > 0 || !sig && maxChainIndex === i) {
					rs = execComprehension(comprehension, acc);
					if (comprehension.tap) comprehension.tap(rs);
					comprehension = null;
				}
				if (sig > 1) comprehension = createComprehension(v.fn, v.params);
				if (rs) return sig !== 1 ? rs : v.fn(...[rs, ...v.params]);
				return acc;
			}
			if (CAN_COMPREHENSIONS.includes(v.fn.name)) {
				comprehension = createComprehension();
				return v.fn(...[acc, ...v.params]);
			}
			return v.fn(...params);
		}, this._wrappedValue);
	}
};
var CAN_COMPREHENSIONS = [
	split.name,
	toArray.name,
	range.name
];
function createComprehension(fn, params) {
	const comprehension = {
		forEachRight: false,
		goalSettings: [],
		range: [],
		reverse: false,
		count: void 0,
		tap: void 0,
		returnEl: false
	};
	if (fn && params) buildComprehension(comprehension, fn, params);
	return comprehension;
}
function buildComprehension(comprehension, fn, params) {
	const fnName = fn.name;
	switch (fnName) {
		case map.name:
		case filter.name:
			if (size(comprehension.range) > 0 || isDefined(comprehension.count)) return 2;
			let fn = params[0];
			if (!isFunction(fn)) fn = iteratee_default(params[0]);
			comprehension.goalSettings.push({
				type: fnName,
				fn
			});
			break;
		case reverse.name:
			if (size(comprehension.range) < 1) comprehension.forEachRight = !comprehension.forEachRight;
			else comprehension.reverse = !comprehension.reverse;
			break;
		case slice.name:
			if (size(comprehension.range) > 0) return 2;
			comprehension.range[0] = params[0];
			comprehension.range[1] = params[1];
			break;
		case tail.name:
			if (size(comprehension.range) > 0) return 2;
			comprehension.range[0] = 1;
			comprehension.range[1] = params[1];
			break;
		case take.name:
			if (isUndefined(comprehension.count) || params[0] < comprehension.count) comprehension.count = params[0];
			break;
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
		default: return 1;
	}
	return 0;
}
function execComprehension(comprehension, collection) {
	const targets = [];
	let targetIndex = 0;
	if (!comprehension.count && comprehension.range.length > 0) comprehension.count = comprehension.range[1] - comprehension.range[0];
	const isReverse = comprehension.reverse;
	const count = comprehension.count;
	const gs = comprehension.goalSettings;
	const gsLen = gs.length;
	const range = comprehension.range;
	const hasRange = range.length > 0;
	(comprehension.forEachRight ? eachRight : each)(collection, (v, k) => {
		let t = v;
		for (let i = 0; i < gsLen; i++) {
			const setting = gs[i];
			if (setting.type === map.name) t = setting.fn(t, k);
			else if (setting.type === filter.name) {
				if (!setting.fn(t, k)) return;
			}
		}
		if (hasRange && targetIndex++ < range[0]) return;
		if (hasRange && targetIndex > range[1]) return false;
		if (targets.length === count) return false;
		if (isReverse) targets.unshift(t);
		else targets.push(t);
	});
	if (targets.length === 1 && comprehension.returnEl) return targets[0];
	return targets;
}
var VERSION$1 = "2.0.0-beta.1";
/**
* 显式开启myfx的函数链，返回一个包裹了参数v的myfx链式对象。函数链可以链接Myfx提供的所有函数，如
<p>
* 函数链使用惰性计算 —— 直到显示调用value()方法时，函数链才会进行计算并返回结果
</p>
```js
_.chain([1,2,3,4]).map(v=>v+1).filter(v=>v%2===0).take(2).join('-').value()
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
function chain(v) {
	return v instanceof FuncChain ? v : new FuncChain(v);
}
var api = {
	append,
	chunk,
	compact,
	concat,
	except,
	fill,
	findIndex,
	findLastIndex,
	flat,
	flatDeep,
	insert,
	intersect,
	join,
	pop,
	pull,
	range,
	remove,
	reverse,
	slice,
	sortedIndex,
	sortedIndexBy,
	union,
	uniq,
	uniqBy,
	unzip,
	without,
	zip,
	zipObject,
	zipWith,
	countBy,
	each,
	eachRight,
	every,
	filter,
	find,
	findLast,
	first,
	flatMap,
	flatMapDeep,
	groupBy,
	includes,
	initial,
	keyBy,
	last,
	map,
	partition,
	reduce,
	reject,
	sample,
	sampleSize,
	shuffle,
	size,
	some,
	sort,
	sortBy,
	tail,
	take,
	takeRight,
	toArray,
	addTime,
	compareDate,
	formatDate,
	getDayOfYear,
	getWeekOfMonth,
	getWeekOfYear,
	isLeapYear,
	isSameDay,
	now,
	toDate,
	after,
	alt,
	bind,
	bindAll,
	call,
	compose,
	debounce,
	delay,
	fval,
	once,
	partial,
	tap,
	throttle,
	isAlnum,
	isAlpha,
	isArray,
	isArrayLike,
	isBlank,
	isBoolean,
	isCustomElement,
	isDate,
	isDefined,
	isElement,
	isEmpty,
	isEqual,
	isEqualWith,
	isError,
	isFinite,
	isFunction,
	isInteger,
	isIterator,
	isLowerCaseChar,
	isMap,
	isMatch,
	isMatchWith,
	isNaN: isNaN$1,
	isNative,
	isNil,
	isNode,
	isNull,
	isNumber,
	isNumeric,
	isObject,
	isPlainObject,
	isPrimitive,
	isRegExp,
	isSafeInteger,
	isSet,
	isString,
	isSymbol,
	isUndefined,
	isUpperCaseChar,
	isWeakMap,
	isWeakSet,
	add,
	divide,
	max,
	mean,
	median,
	min,
	minmax,
	multiply,
	randf,
	randi,
	subtract,
	sum,
	formatNumber,
	gt,
	gte,
	inRange,
	lt,
	lte,
	toInteger,
	toNumber,
	assign,
	assignWith,
	clone,
	cloneDeep,
	cloneDeepWith,
	cloneWith,
	defaults,
	defaultsDeep,
	eq,
	findKey,
	fromPairs,
	functions,
	get,
	has,
	keys,
	keysIn,
	merge,
	mergeWith,
	omit,
	omitBy,
	parseJSON,
	pick,
	pickBy,
	prop,
	set,
	toObject,
	toPairs,
	unset,
	values,
	valuesIn,
	camelCase,
	capitalize,
	endsWith,
	escapeRegExp,
	indexOf,
	kebabCase,
	lastIndexOf,
	lowerCase,
	lowerFirst,
	padEnd,
	padStart,
	padZ,
	pascalCase,
	repeat,
	replace,
	replaceAll,
	snakeCase,
	split,
	startsWith,
	substring,
	test,
	toFixed,
	toString,
	trim,
	trimEnd,
	trimStart,
	truncate,
	upperCase,
	upperFirst,
	template,
	arrayToTree,
	closest,
	filterTree,
	findTreeNode,
	findTreeNodes,
	sortTree,
	walkTree,
	alphaId,
	defaultTo,
	identity: identity_default,
	iteratee: iteratee_default,
	matcher,
	mixin,
	noop: noop_default,
	snowflakeId,
	times,
	toPath: toPath_default,
	uniqueId,
	uuid
};
mixin(FuncChain, { ...api });
var myfx = {
	VERSION: VERSION$1,
	chain,
	...api
};
//#endregion
//#region src/transform.ts
/**
* Transform APIs
* 用于屏蔽svg/html元素的transform差异，如rotate函数兼容问题
* @author holyhigh2
*/
var UtMap = /* @__PURE__ */ new WeakMap();
var UiiTransform = class {
	constructor(el, useTransform = true) {
		this.angle = 0;
		this.el = el;
		this.useTransform = useTransform;
		this.normalize(el);
		UtMap.set(el, this);
	}
	normalize(el) {
		let { offx, offy } = normalize(el || this.el, this.useTransform);
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
};
/**
* 统一化处理，记录offset
* @param el
*/
function normalize(el, useTransform) {
	const style = window.getComputedStyle(el);
	let offx = 0, offy = 0;
	let x = 0, y = 0;
	let mx = 0, my = 0;
	if (el instanceof HTMLElement) {
		x = parseFloat(style.left) || 0;
		y = parseFloat(style.top) || 0;
		mx = parseFloat(style.marginLeft) || 0;
		my = parseFloat(style.marginTop) || 0;
	} else {
		x = parseFloat(get(el, "x.baseVal.value") || get(el, "cx.baseVal.value")) || 0;
		y = parseFloat(get(el, "y.baseVal.value") || get(el, "cy.baseVal.value")) || 0;
	}
	if (useTransform) offx = x, offy = y;
	else offx = 0, offy = 0;
	return {
		offx: offx + mx,
		offy: offy + my
	};
}
/**
* 返回一个包装后的变形对象，可执行变形操作
* @param el
*/
function wrapper(el, useTransform = true) {
	let ut = UtMap.get(el);
	if (ut) return ut.normalize(el);
	return new UiiTransform(el, useTransform);
}
function transformMove(transofrmStr, x, y, unit = false) {
	if (!isNumber(x) || isNaN$1(x)) return `translateY(${y}${unit ? "px" : ""}) ` + transofrmStr.replace(/translateY\([^)]+?\)/, "").trim();
	if (!isNumber(y) || isNaN$1(x)) return `translateX(${x}${unit ? "px" : ""}) ` + transofrmStr.replace(/translateX\([^)]+?\)/, "").trim();
	return `translate(${x}${unit ? "px" : ""},${y}${unit ? "px" : ""}) ` + transofrmStr.replace(/translate\([^)]+?\)/, "").trim();
}
/**
* 获取元素当前transform中的位移数据
* @param el HTMLElement|SVGGraphicsElement
* @returns {x,y}
*/
function getTranslate(el) {
	let xVal = NaN, yVal = NaN;
	let transformStr = "";
	if (el instanceof SVGGraphicsElement) {
		transformStr = el.getAttribute("transform") || "";
		if (!transformStr) {
			xVal = parseFloat(get(el, "x.baseVal.value") || get(el, "cx.baseVal.value")) || 0;
			yVal = parseFloat(get(el, "y.baseVal.value") || get(el, "cy.baseVal.value")) || 0;
		}
	} else transformStr = el.style.transform || "";
	EXP_GET_TRANSLATE.lastIndex = 0;
	const xy = EXP_GET_TRANSLATE.exec(transformStr);
	if (xy && xy.groups) {
		xVal = parseFloat(xy.groups.x);
		yVal = parseFloat(xy.groups.y);
	} else {
		EXP_GET_TRANSLATE_XY.lastIndex = 0;
		const xy = EXP_GET_TRANSLATE_XY.exec(transformStr);
		if (xy && xy.groups) {
			if (xy.groups.dir == "X") xVal = parseFloat(xy.groups.v);
			else yVal = parseFloat(xy.groups.v);
		}
	}
	return {
		x: xVal,
		y: yVal
	};
}
/**
* 自动检测HTML元素或SVG元素并设置对应移动属性
* @param el HTMLElement|SVGGraphicsElement
* @param x value of px
* @param y value of px
*/
function moveTo(el, x, y) {
	if (el instanceof SVGGraphicsElement) {
		if (x) el.setAttribute("x", x + "");
		if (y) el.setAttribute("y", y + "");
	} else {
		let style = el.style;
		if (x) style.left = x + "px";
		if (y) style.top = y + "px";
	}
}
function transformMoveTo(el, x, y) {
	if (el instanceof SVGGraphicsElement) el.setAttribute("transform", transformMove(el.getAttribute("transform") || "", x || 0, y || 0));
	else {
		let style = el.style;
		style.transform = transformMove(style.transform || "", x || 0, y || 0, true);
	}
}
var EXP_GET_TRANSLATE = /translate\(\s*(?<x>[\d.-]+)\D*,\s*(?<y>[\d.-]+)\D*\)/gim;
var EXP_GET_TRANSLATE_XY = /translate(?<dir>X|Y)\(\s*(?<v>[\d.-]+)\D*\)/gim;
/**
* 自动检测HTML元素或SVG元素并设置对应移动属性
* @param el HTMLElement|SVGGraphicsElement
* @param x value of px
* @param y value of px
*/
function moveBy(el, x, y) {
	const xy = getTranslate(el);
	if (el instanceof SVGGraphicsElement) el.setAttribute("transform", transformMove(el.getAttribute("transform") || "", xy.x + x, xy.y + y));
	else {
		let style = el.style;
		style.transform = transformMove(style.transform || "", xy.x + x, xy.y + y, true);
	}
}
function rotateTo(el, deg, cx, cy) {
	if (el instanceof SVGGraphicsElement) {
		let transformStr = el.getAttribute("transform") || "";
		let originPos = isDefined(cx) && isDefined(cy);
		let origin = "";
		if (originPos) {
			let baseX = 0;
			let baseY = 0;
			if (el.x instanceof SVGAnimatedLength) {
				baseX = el.x.animVal.value;
				baseY = el.y.animVal.value;
			} else if (el.cx instanceof SVGAnimatedLength) {
				baseX = el.cx.animVal.value;
				baseY = el.cy.animVal.value;
			} else if (typeof el.getBBox === "function") {
				const bbox = el.getBBox();
				baseX = bbox.x;
				baseY = bbox.y;
			}
			cx = cx + baseX;
			cy = cy + baseY;
			origin = `,${cx},${cy}`;
		}
		transformStr = transformStr.replace(/rotate\([^)]+?\)/, "") + ` rotate(${deg}${origin})`;
		el.setAttribute("transform", transformStr);
	} else {
		let style = el.style;
		style.transform = style.transform.replace(/rotate\([^)]+?\)/, "").replace(/rotateZ\([^)]+?\)/, "") + " rotateZ(" + deg + "deg)";
	}
}
//#endregion
//#region src/utils.ts
/**
* 工具包
* @author holyhigh2
*/
/**
* 一角度对应的弧度
*/
var ONE_ANG = Math.PI / 180;
/**
* 一弧度对应的角度
*/
var ONE_RAD = 180 / Math.PI;
var THRESHOLD = 3;
/**
* 获取child相对于parent的位置信息。含border宽度
*
* @returns {x,y,w,h}
*/
function getBox(child, parent) {
	const rect = child.getBoundingClientRect();
	const rs = {
		x: 0,
		y: 0,
		w: rect.width,
		h: rect.height
	};
	parent = parent || child.offsetParent || child.ownerSVGElement || child.parentElement || document.body;
	const parentRect = parent.getBoundingClientRect();
	const parentStyle = window.getComputedStyle(parent);
	const parentBorderLeft = parseFloat(parentStyle.borderLeftWidth);
	const parentBorderTop = parseFloat(parentStyle.borderTopWidth);
	rs.x = rect.x - parentRect.x + parent.scrollLeft;
	rs.y = rect.y - parentRect.y + parent.scrollTop;
	if (child instanceof SVGElement) {} else {
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
var EDGE_THRESHOLD = 5;
var DRAGGING_RULE = "body * { pointer-events: none; }";
var lockSheet;
function lockPage() {
	lockSheet = getFirstSS();
	lockSheet === null || lockSheet === void 0 || lockSheet.insertRule("body * { pointer-events: none; }", 0);
}
function unlockPage() {
	lockSheet === null || lockSheet === void 0 || lockSheet.deleteRule(0);
}
function getFirstSS() {
	if (document.styleSheets.length < 1) document.head.appendChild(document.createElement("style"));
	const sheet = find(document.styleSheets, (ss) => !ss.href);
	if (!sheet) document.head.appendChild(document.createElement("style"));
	return sheet || find(document.styleSheets, (ss) => !ss.href);
}
var cursor = {
	html: "",
	body: ""
};
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
	} else {
		x = parseFloat(style.left) || 0;
		y = parseFloat(style.top) || 0;
	}
	return {
		x,
		y
	};
}
/**
* 获取元素样式/属性中的w/h
* @param el
*/
function getStyleSize(el, cStyle) {
	if ("getBBox" in el) {
		let { width, height } = el.getBBox();
		return {
			w: width,
			h: height
		};
	}
	if (!cStyle) cStyle = window.getComputedStyle(el);
	return {
		w: parseFloat(cStyle.width),
		h: parseFloat(cStyle.height)
	};
}
/**
* 获取matrix中的scale/angle
* @param elCStyle
* @param recur 递归计算matrix
* @returns
*/
function getMatrixInfo(el, recur = false) {
	const rs = {
		scale: 1,
		angle: 0,
		x: 0,
		y: 0
	};
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
	const svgRoot = el instanceof SVGSVGElement ? el : el.ownerSVGElement;
	if (svgRoot && typeof svgRoot.getScreenCTM === "function") {
		const ctm = svgRoot.getScreenCTM();
		if (ctm) matrix = matrix.multiply(new DOMMatrix([
			ctm.a,
			ctm.b,
			ctm.c,
			ctm.d,
			0,
			0
		]));
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
	if (!elRect) elRect = el.getBoundingClientRect();
	let rx = elRect.x, ry = elRect.y;
	if (!elCStyle) elCStyle = window.getComputedStyle(el);
	if (!matrixInfo) matrixInfo = getMatrixInfo(el, true);
	const scale = matrixInfo.scale;
	let x = event.clientX - rx - (parseFloat(elCStyle.borderLeftWidth) || 0) * scale + el.scrollLeft * scale;
	let y = event.clientY - ry - (parseFloat(elCStyle.borderTopWidth) || 0) * scale + el.scrollTop * scale;
	return {
		x: x / scale,
		y: y / scale,
		scale
	};
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
	let x = elRect.x - containerRect.x - (parseFloat(elCStyle.borderLeftWidth) || 0) * scale + container.scrollLeft * scale;
	let y = elRect.y - containerRect.y - (parseFloat(elCStyle.borderTopWidth) || 0) * scale + container.scrollTop * scale;
	return {
		x: x / scale,
		y: y / scale,
		w: elRect.width / scale,
		h: elRect.height / scale
	};
}
/**
* 获取指定元素（DOM/SVG）相对于父元素的中心点
* @param el 
* @returns 
*/
function getRectCenter(el, matrixInfo) {
	const panelRect = getRectInContainer(el, el.parentElement, matrixInfo);
	return {
		x: Math.round(panelRect.x + panelRect.w / 2),
		y: Math.round(panelRect.y + panelRect.h / 2)
	};
}
/**
* 获取指定元素的圆心坐标
* @param el
* @param left
* @param top
* @returns
*/
function getCenterXy(el, ox, oy) {
	const centerPair = window.getComputedStyle(el).transformOrigin.split(" ");
	ox = ox || parseFloat(centerPair[0]);
	oy = oy || parseFloat(centerPair[1]);
	const shadowDom = el.cloneNode();
	rotateTo(shadowDom, 0);
	const parentEl = el.parentElement;
	let startX = 0, startY = 0;
	if (parentEl) {
		parentEl.appendChild(shadowDom);
		const offsetXY = getRectInContainer(shadowDom, parentEl);
		startX = offsetXY.x, startY = offsetXY.y;
		parentEl.removeChild(shadowDom);
	}
	return {
		sx: startX,
		sy: startY,
		x: startX + ox,
		y: startY + oy,
		ox,
		oy
	};
}
function getCenterXySVG(el, ox, oy) {
	let elRect = el.getBoundingClientRect();
	let svgRect = el.ownerSVGElement.getBoundingClientRect();
	let x = elRect.x - svgRect.x;
	let y = elRect.y - svgRect.y;
	const shadowDom = el.cloneNode();
	rotateTo(shadowDom, 0);
	const parentEl = el.parentElement;
	if (parentEl) {
		parentEl.appendChild(shadowDom);
		const offsetXY = getRectInContainer(shadowDom, parentEl);
		offsetXY.x, offsetXY.y;
		parentEl.removeChild(shadowDom);
	}
	return {
		sx: x,
		sy: y,
		x: x + ox,
		y: y + oy,
		ox,
		oy
	};
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
	const { x, y, sx, sy } = el instanceof SVGGraphicsElement ? getCenterXySVG(el, originX, originY) : getCenterXy(el);
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
	return map([
		{
			x: 0,
			y: 0
		},
		{
			x: w,
			y: 0
		},
		{
			x: 0,
			y: h
		},
		{
			x: w,
			y: h
		}
	], ({ x, y }) => {
		const nx = (x - cx + sx) * Math.cos(radian) - (y - cy + sy) * Math.sin(radian);
		const ny = (x - cx + sx) * Math.sin(radian) + (y - cy + sy) * Math.cos(radian);
		return {
			x: cx + nx,
			y: cy + ny
		};
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
	if (isString(ox)) originX = parseFloat(ox) / 100 * w;
	else if (isNumber(ox)) originX = ox;
	else if (el) {
		if (!transformOrigin) transformOrigin = window.getComputedStyle(el).transformOrigin;
		const centerPair = transformOrigin.split(" ");
		originX = parseFloat(centerPair[0]);
	}
	if (isString(oy)) originY = parseFloat(oy) / 100 * h;
	else if (isNumber(oy)) originY = oy;
	else if (el) {
		if (!transformOrigin) transformOrigin = window.getComputedStyle(el).transformOrigin;
		const centerPair = transformOrigin.split(" ");
		originY = parseFloat(centerPair[1]);
	}
	return {
		originX,
		originY
	};
}
function normalizeVector(x, y) {
	let len = Math.sqrt(x * x + y * y);
	return {
		x: x / len,
		y: y / len
	};
}
function isVisible(el) {
	let rect = el.getBoundingClientRect();
	if (rect.width === 0 || rect.height === 0) return false;
	return true;
}
function isScrollableEl(el) {
	if (!el) return false;
	const node = el;
	const cs = window.getComputedStyle(node);
	const oy = cs.overflowY;
	const ox = cs.overflowX;
	const scrollableY = oy === "auto" || oy === "scroll" || oy === "overlay";
	const scrollableX = ox === "auto" || ox === "scroll" || ox === "overlay";
	return scrollableY && node.scrollHeight > node.clientHeight || scrollableX && node.scrollWidth > node.clientWidth;
}
/**
* 查找可滚动的祖先元素。
*
*
* @param el 起点元素
* @param preferred 优先候选（如 containment 指定的容器），可滚动时直接采用
*/
function getScrollParent(el, preferred) {
	if (preferred && isScrollableEl(preferred)) return preferred;
	let node = el;
	while (node && node !== document.body && node !== document.documentElement) {
		if (isScrollableEl(node)) return node;
		node = node.parentElement;
	}
	return null;
}
/**
* 可视滚动视口的矩形（padding box，已排除边框与滚动条），坐标系为视口坐标
*/
function getScrollViewportRect(el) {
	const cs = window.getComputedStyle(el);
	const rect = el.getBoundingClientRect();
	return {
		x: rect.left + (parseFloat(cs.borderLeftWidth) || 0),
		y: rect.top + (parseFloat(cs.borderTopWidth) || 0),
		width: el.clientWidth,
		height: el.clientHeight
	};
}
//#endregion
//#region src/types.ts
var UII_KEY = "__uii_target_";
var UII_MAP = {};
var UiiSn = 0;
/**
* A Base class for all Uii classes
*/
var Uii = class {
	constructor(ele, opts) {
		var _this$opts$eventCaptu;
		this.enabled = true;
		this.__listeners = [];
		this.opts = opts || {};
		this.opts.mouseButton = this.opts.mouseButton || "left";
		this.opts.eventCapture = (_this$opts$eventCaptu = this.opts.eventCapture) !== null && _this$opts$eventCaptu !== void 0 ? _this$opts$eventCaptu : true;
		if (isArrayLike(ele) && !isString(ele)) this.ele = map(ele, (el) => {
			let e = isString(el) ? document.querySelector(el) : el;
			if (!isElement(e)) {
				console.error("Invalid element \"" + el + "\"");
				return false;
			}
			return e;
		});
		else {
			if (isString(ele)) this.eleString = ele;
			const el = isString(ele) ? document.querySelectorAll(ele) : ele;
			if (!isElement(el) && !isArrayLike(el)) {
				console.error("Invalid element \"" + ele + "\"");
				return;
			}
			this.ele = isArrayLike(el) ? toArray(el) : [el];
		}
		let uid = UiiSn++ + "";
		UII_MAP[uid] = this;
		this._bindUiik(uid);
	}
	/**
	* 销毁uii对象，包括卸载事件、清空元素等
	*/
	destroy() {
		each(this.__listeners, (ev) => {
			ev[0].removeEventListener(ev[1], ev[2], ev[3]);
		});
		this.__listeners = [];
	}
	addPointerDown(el, pointerDown) {
		const onPointerDown = pointerDown;
		const uiiOptions = this.opts;
		let threshold = 0;
		let toLockPage = true;
		this.registerEvent(el, "mousedown", (e) => {
			let t = e.target;
			if (!t) return;
			let ownerOpts = uiiOptions;
			const ownerEl = closest(t, (node) => node && get(node, "__uii_target_"), "parentElement");
			if (ownerEl) {
				const ownerInst = UII_MAP[get(ownerEl, UII_KEY)];
				if (ownerInst && ownerInst.opts) ownerOpts = ownerInst.opts;
			}
			const mouseButton = ownerOpts.mouseButton;
			if (mouseButton) switch (mouseButton) {
				case "left":
					if (e.button != 0) return;
					break;
				case "right": if (e.button != 2) return;
			}
			const hasCursor = !isEmpty(get(ownerOpts, "cursor.active"));
			const currentStyle = el.style;
			const currentCStyle = window.getComputedStyle(el);
			const currentRect = el.getBoundingClientRect();
			let dragging = false;
			const originPosX = e.clientX;
			const originPosY = e.clientY;
			if (hasCursor) saveCursor();
			let onPointerStart;
			let onPointerMove;
			let onPointerEnd;
			if (!!onPointerDown({
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
				currentRect
			})) {
				e.preventDefault();
				return false;
			}
			let target = closest(t, (node) => node && get(node, "__uii_target_"), "parentElement");
			if (target) {
				var _uiiInstance$opts$loc;
				let uiiInstance = UII_MAP[get(target, UII_KEY)];
				threshold = uiiInstance.opts.threshold || 0;
				toLockPage = (_uiiInstance$opts$loc = uiiInstance.opts.lockPage) !== null && _uiiInstance$opts$loc !== void 0 ? _uiiInstance$opts$loc : true;
			}
			let matrixInfo = getMatrixInfo(el, true);
			const pointerMove = (ev) => {
				const offX = (ev.clientX - originPosX) / matrixInfo.scale;
				const offY = (ev.clientY - originPosY) / matrixInfo.scale;
				if (!dragging) {
					if (Math.abs(offX) > threshold || Math.abs(offY) > threshold) {
						dragging = true;
						if (toLockPage) lockPage();
						if (hasCursor) setCursor(ownerOpts.cursor.active);
						onPointerStart && onPointerStart({ ev });
					} else {
						ev.preventDefault();
						return false;
					}
				}
				onPointerMove && onPointerMove({
					ev,
					pointX: ev.clientX,
					pointY: ev.clientY,
					offX,
					offY,
					currentStyle,
					currentCStyle
				});
			};
			const pointerEnd = (ev) => {
				document.removeEventListener("mousemove", pointerMove, false);
				document.removeEventListener("mouseup", pointerEnd, false);
				window.removeEventListener("blur", pointerEnd, false);
				if (dragging) {
					if (toLockPage) unlockPage();
					if (hasCursor) restoreCursor();
					onPointerEnd && onPointerEnd({
						ev,
						currentStyle
					});
				}
			};
			document.addEventListener("mousemove", pointerMove);
			document.addEventListener("mouseup", pointerEnd);
			window.addEventListener("blur", pointerEnd);
			e.preventDefault();
			return false;
		}, this.opts.eventCapture);
	}
	/**
	* 注册事件，以便在{@link destroy}方法中卸载
	* @param el dom元素
	* @param event 事件名
	* @param hook 回调函数
	* @param useCapture 默认false
	*/
	registerEvent(el, event, hook, useCapture = false) {
		this.__listeners = this.__listeners.filter((l) => {
			if (l[0] === el && l[1] === event) {
				l[0].removeEventListener(l[1], l[2], l[3]);
				return false;
			}
			return true;
		});
		const wrapper = ((ev) => {
			if (!this.enabled) return;
			hook(ev);
		}).bind(this);
		el.addEventListener(event, wrapper, useCapture);
		this.__listeners.push([
			el,
			event,
			wrapper,
			useCapture
		]);
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
	_bindUiik(uid) {
		each(this.ele, (el) => {
			set(el, UII_KEY, uid);
		});
	}
	/**
	* @internal
	*/
	onOptionChanged(opts) {}
};
//#endregion
//#region src/splittable.ts
/**
* splitter
* @author holyhigh
*/
var CLASS_SPLITTABLE = "uii-splittable";
var CLASS_SPLITTABLE_HANDLE = "uii-splittable-handle";
var CLASS_SPLITTABLE_HANDLE_GHOST = "uii-splittable-handle-ghost";
var CLASS_SPLITTABLE_HANDLE_ACTIVE = "uii-splittable-handle-active";
var CLASS_SPLITTABLE_V = "uii-splittable-v";
var CLASS_SPLITTABLE_H = "uii-splittable-h";
function getRootEl(el, root) {
	let rs = el.parentNode;
	while (rs && rs.parentNode !== root) rs = rs.parentNode;
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
var Splittable = class extends Uii {
	constructor(container, opts) {
		super(container, assign({
			handleSize: 10,
			minSize: 0,
			sticky: false,
			inside: false,
			ghost: false
		}, opts));
		each(this.ele, (con) => {
			const pos = window.getComputedStyle(con).position;
			if (pos === "static" || isBlank(pos)) con.style.position = "relative";
			con.classList.toggle(CLASS_SPLITTABLE, true);
			const handleDoms = isString(this.opts.handle) ? con.querySelectorAll(this.opts.handle) : isArray(this.opts.handle) ? this.opts.handle : this.opts.handle ? [this.opts.handle] : [];
			const children = reject(con.children, (c) => {
				if (includes(handleDoms, c)) return true;
				return false;
			});
			const dir = this.__checkDirection(con);
			con.classList.toggle(dir === "v" ? CLASS_SPLITTABLE_V : CLASS_SPLITTABLE_H, true);
			const minSizeAry = map(children, (c, i) => {
				if (isArray(this.opts.minSize)) return this.opts.minSize[i] || 0;
				else return this.opts.minSize;
			});
			const stickyAry = map(children, (c, i) => {
				if (isArray(this.opts.sticky)) return this.opts.sticky[i] || false;
				else return this.opts.sticky;
			});
			if (isEmpty(handleDoms)) {
				const len = children.length - 1;
				for (let i = 0; i < len; i++) this.__bindHandle(minSizeAry.slice(i, i + 2), stickyAry.slice(i, i + 2), this.opts, dir, children[i], children[i + 1]);
			} else each(handleDoms, (h, i) => {
				var _h$parentElement;
				const isRoot = (_h$parentElement = h.parentElement) === null || _h$parentElement === void 0 ? void 0 : _h$parentElement.classList.contains(CLASS_SPLITTABLE);
				let dom1, dom2;
				if (isRoot) {
					dom1 = h.previousElementSibling;
					dom2 = h.nextElementSibling;
				} else {
					let domCon = getRootEl(h, con);
					let domL = domCon.previousElementSibling;
					let domR = domCon.nextElementSibling;
					let hasDomLHandle = isString(this.opts.handle) ? domL === null || domL === void 0 ? void 0 : domL.querySelector(this.opts.handle) : domL === null || domL === void 0 ? void 0 : domL.contains(h);
					if (domL && !hasDomLHandle) {
						dom1 = domL;
						dom2 = domCon;
					} else {
						dom1 = domCon;
						dom2 = domR;
					}
				}
				this.__bindHandle(minSizeAry.slice(i, i + 2), stickyAry.slice(i, i + 2), this.opts, dir, dom1, dom2, h);
			});
		});
	}
	/**
	* @internal
	*/
	__checkDirection(container) {
		let dir = "h";
		let cStyle = window.getComputedStyle(container);
		if (cStyle.display === "inline-flex") return dir;
		if (cStyle.display === "flex") {
			if (cStyle.flexDirection === "row") return dir;
			if (cStyle.flexDirection === "column") return "v";
		}
		const child = container.children[0];
		let lastY = child.offsetTop;
		let lastH = child.offsetHeight;
		each(container.children, (c) => {
			if (c.offsetTop > lastH + lastY) {
				dir = "v";
				return false;
			}
		});
		return dir;
	}
	/**
	* @internal
	*/
	__bindHandle(minSizeAry, stickyAry, opts, dir, dom1, dom2, handle) {
		const handleSize = opts.handleSize;
		if (!handle) {
			var _dom2$parentNode;
			handle = document.createElement("div");
			let initPos = 0;
			if (!opts.inside) initPos = dir === "v" ? dom2.offsetTop : dom2.offsetLeft;
			if (!isVisible(dom2)) {
				var _dom2$parentElement;
				(_dom2$parentElement = dom2.parentElement) === null || _dom2$parentElement === void 0 || _dom2$parentElement.addEventListener("mouseenter", () => {
					initPos = dir === "v" ? dom2.offsetTop : dom2.offsetLeft;
					handle.style.left = initPos - handleSize / 2 + "px";
				}, { once: true });
			}
			const sensorHCss = `width:${handleSize}px;height:100%;top:0;left:${initPos - handleSize / 2}px;z-index:9;`;
			const sensorVCss = `height:${handleSize}px;width:100%;left:0;top:${initPos - handleSize / 2}px;z-index:9;`;
			handle.style.cssText = "position: absolute;" + (dir === "v" ? sensorVCss : sensorHCss);
			if (opts.inside) dom2.appendChild(handle);
			(_dom2$parentNode = dom2.parentNode) === null || _dom2$parentNode === void 0 || _dom2$parentNode.insertBefore(handle, dom2);
		}
		handle.style.cursor = dir === "v" ? "s-resize" : "e-resize";
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
		const updateStart = !oneSideMode || oneSideMode === "start";
		const updateEnd = !oneSideMode || oneSideMode === "end";
		this.addPointerDown(handle, ({ currentTarget, onPointerStart, onPointerMove, onPointerEnd }) => {
			let originSize = 0;
			let originSize1 = 0;
			let splitterSize = 1;
			let blockSize = 0;
			switch (dir) {
				case "v":
					originSize = dom1.offsetHeight;
					originSize1 = dom2.offsetHeight;
					splitterSize = currentTarget.offsetHeight;
					break;
				case "h":
					originSize = dom1.offsetWidth;
					originSize1 = dom2.offsetWidth;
					splitterSize = currentTarget.offsetWidth;
			}
			blockSize = splitterSize + originSize + originSize1;
			const dom1Style = dom1.style;
			const dom2Style = dom2.style;
			const ghost = opts.ghost;
			const ghostClass = opts.ghostClass;
			const ghostTo = opts.ghostTo;
			let ghostNode = null;
			let sticked = "none";
			if (originSize < minSize1 / 2) sticked = "start";
			else if (blockSize - originSize - splitterSize < minSize2 / 2) sticked = "end";
			let startPos = dir === "v" ? dom1.offsetTop : dom1.offsetLeft;
			let ds1, anotherSize;
			onPointerStart(function(args) {
				const { ev } = args;
				currentTarget.classList.add(CLASS_SPLITTABLE_HANDLE_ACTIVE);
				if (ghost) {
					ghostNode = currentTarget.cloneNode(true);
					ghostNode.style.opacity = "0.3";
					ghostNode.style.pointerEvents = "none";
					ghostNode.classList.add(CLASS_SPLITTABLE_HANDLE_GHOST);
					if (ghostNode) {
						if (ghostClass) ghostNode.className = ghostNode.className.replace(ghostClass, "") + " " + ghostClass;
						(ghostTo ? isString(ghostTo) ? document.querySelector(ghostTo) : ghostTo : currentTarget.parentNode).appendChild(ghostNode);
						onClone && onClone({ clone: ghostNode }, ev);
					}
				}
				onStart && onStart({
					size1: originSize,
					size2: originSize1
				}, ev);
			});
			onPointerMove((args) => {
				const { ev, offX, offY, currentStyle } = args;
				let doSticky = false;
				ds1 = dir === "v" ? originSize + offY : originSize + offX;
				if (ds1 < minSize1 / 2 && sticky1 && minSize1 > 0) {
					if (sticked == "none") {
						doSticky = true;
						sticked = "start";
					}
					ds1 = 0;
				} else if (ds1 < minSize1) {
					ds1 = minSize1;
					if (sticked == "start" && sticky1) {
						doSticky = true;
						sticked = "none";
					}
				} else if (blockSize - ds1 - splitterSize < minSize2 / 2 && sticky2) {
					if (sticked == "none") {
						doSticky = true;
						sticked = "end";
					}
					ds1 = blockSize - splitterSize;
				} else if (blockSize - ds1 - splitterSize < minSize2) {
					ds1 = blockSize - minSize2 - splitterSize;
					if (sticked == "end" && sticky2) {
						doSticky = true;
						sticked = "none";
					}
				}
				anotherSize = blockSize - ds1 - splitterSize;
				if (ghostNode) {
					if (dir === "v") ghostNode.style.top = startPos + ds1 - splitterSize / 2 + "px";
					else ghostNode.style.left = startPos + ds1 - splitterSize / 2 + "px";
				} else {
					const updateProp = dir === "v" ? "height" : "width";
					if (updateStart) dom1Style.setProperty(updateProp, ds1 + "px", "important");
					if (updateEnd) dom2Style.setProperty(updateProp, anotherSize + "px", "important");
					if (doSticky) onSticky && onSticky({
						size1: ds1,
						size2: anotherSize,
						position: sticked
					}, ev);
					if (dir === "v") currentStyle.top = dom2.offsetTop - splitterSize / 2 + "px";
					else currentStyle.left = dom2.offsetLeft - splitterSize / 2 + "px";
				}
				onSplit && onSplit({
					size1: ds1,
					size2: anotherSize
				}, ev);
			});
			onPointerEnd((args) => {
				const { ev, currentStyle } = args;
				switch (dir) {
					case "v":
						originSize = (dom1 === null || dom1 === void 0 ? void 0 : dom1.offsetHeight) || -1;
						originSize1 = (dom2 === null || dom2 === void 0 ? void 0 : dom2.offsetHeight) || -1;
						break;
					case "h":
						originSize = (dom1 === null || dom1 === void 0 ? void 0 : dom1.offsetWidth) || -1;
						originSize1 = (dom2 === null || dom2 === void 0 ? void 0 : dom2.offsetWidth) || -1;
				}
				handle === null || handle === void 0 || handle.classList.remove(CLASS_SPLITTABLE_HANDLE_ACTIVE);
				if (ghostNode) {
					var _ghostNode$parentNode;
					const updateProp = dir === "v" ? "height" : "width";
					if (updateStart) dom1Style.setProperty(updateProp, ds1 + "px", "important");
					if (updateEnd) dom2Style.setProperty(updateProp, anotherSize + "px", "important");
					if (dir === "v") currentStyle.top = startPos + ds1 - splitterSize / 2 + "px";
					else currentStyle.left = startPos + ds1 - splitterSize / 2 + "px";
					(_ghostNode$parentNode = ghostNode.parentNode) === null || _ghostNode$parentNode === void 0 || _ghostNode$parentNode.removeChild(ghostNode);
				}
				onEnd && onEnd({
					size1: originSize,
					size2: originSize1
				}, ev);
			});
		});
	}
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
//#endregion
//#region src/resizable.ts
/**
* dom resizer
* @author holyhigh2
*/
var CLASS_RESIZABLE_HANDLE = "uii-resizable-handle";
var CLASS_RESIZABLE_HANDLE_ACTIVE = "uii-resizable-handle-active";
var CLASS_RESIZABLE_GHOST = "uii-resizable-ghost";
var EXP_DIR = /* @__PURE__ */ new RegExp("uii-resizable-handle-(?<dir>[nesw]+)");
/**
* 用于表示一个或多个可改变尺寸元素的定义
* > 可用CSS接口
* - .uii-resizable-handle
* - .uii-resizable-handle-[n/s/e/w/ne/nw/se/sw]
* - .uii-resizable-handle-active
* @public
*/
var Resizable = class extends Uii {
	constructor(els, opts) {
		super(els, assign({
			handleSize: 8,
			minSize: 50,
			ghost: false,
			offset: 0
		}, opts));
		each(this.ele, (el) => {
			let tmp = el;
			if (tmp._uiik_resizable) {
				tmp._uiik_resizable.destroy();
				return false;
			}
		});
		each(this.ele, (el) => {
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
			const onPointerDown = opts.onPointerDown;
			if (onPointerDown && onPointerDown(ev) === false) return true;
			let container = panel.parentElement;
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
			}
			let minWidth = 1;
			let minHeight = 1;
			let maxWidth = 9999;
			let maxHeight = 9999;
			if (isArray(opts.minSize)) {
				minWidth = opts.minSize[0];
				minHeight = opts.minSize[1];
			} else if (isNumber(opts.minSize)) {
				minWidth = opts.minSize;
				minHeight = opts.minSize;
			}
			if (isArray(opts.maxSize)) {
				maxWidth = opts.maxSize[0];
				maxHeight = opts.maxSize[1];
			} else if (isNumber(opts.maxSize)) {
				maxWidth = opts.maxSize;
				maxHeight = opts.maxSize;
			}
			const ghost = opts.ghost;
			const ghostClass = opts.ghostClass;
			let ghostNode = null;
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
			let refPoint, k1;
			let sX = 0, sY = 0;
			let startPointXy;
			onPointerStart(function(args) {
				const { ev } = args;
				handle.classList.add(CLASS_RESIZABLE_HANDLE_ACTIVE);
				if (ghost) {
					if (isFunction(ghost)) ghostNode = ghost(panel);
					else {
						ghostNode = panel.cloneNode(true);
						ghostNode.style.opacity = "0.3";
						ghostNode.style.pointerEvents = "none";
					}
					if (ghostNode) {
						var _panel$parentNode;
						if (ghostClass) ghostNode.classList.add(ghostClass);
						ghostNode.classList.toggle(CLASS_RESIZABLE_GHOST, true);
						(_panel$parentNode = panel.parentNode) === null || _panel$parentNode === void 0 || _panel$parentNode.appendChild(ghostNode);
						transform = wrapper(ghostNode);
						onClone && onClone({ clone: ghostNode }, ev);
					}
					style = ghostNode === null || ghostNode === void 0 ? void 0 : ghostNode.style;
				} else transform = wrapper(panel);
				const cStyle = window.getComputedStyle(panel);
				const w = parseFloat(cStyle.width);
				const h = parseFloat(cStyle.height);
				const oxy = parseOxy(opts.ox, opts.oy, w, h);
				oxy.originX;
				oxy.originY;
				const panelRect = getRectInContainer(panel, panel.parentElement, matrixInfo);
				let centerX = Math.round(panelRect.x + panelRect.w / 2);
				let centerY = Math.round(panelRect.y + panelRect.h / 2);
				let sx = Math.round(centerX - originW / 2);
				let sy = Math.round(centerY - originH / 2);
				transform.x = sx;
				transform.y = sy;
				const deg = matrixInfo.angle * ONE_ANG;
				currentVertex = vertexBeforeTransform = calcVertex(originW, originH, centerX, centerY, sx, sy, deg);
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
					case "ne": refPoint = currentVertex[2];
				}
				k1 = (currentVertex[1].y - refPoint.y) / (currentVertex[1].x - refPoint.x);
				style.transition = "none";
				originalTransformOrigin = style.transformOrigin;
				if (setOrigin) {
					if (toTransformOrigin) style.transformOrigin = toTransformOrigin;
					else style.transformOrigin = `${centerX - sx}px ${centerY - sy}px`;
				}
				if (panel instanceof SVGGraphicsElement) {
					sX = 0;
					sY = 0;
				}
				startPointXy = getPointInContainer(ev, container, offsetParentRect, offsetParentCStyle, matrixInfo);
				onStart && onStart.call(uiik, {
					w: originW,
					h: originH,
					transform,
					handle,
					ghost: ghostNode
				}, ev);
			});
			onPointerMove((args) => {
				const { ev, offX, offY } = args;
				let newX = startPointXy.x + offX;
				let newY = startPointXy.y + offY;
				const rpx = refPoint.x;
				const rpy = refPoint.y;
				let angle = Math.atan2(newY - rpy, newX - rpx) * ONE_RAD - matrixInfo.angle;
				let hyLen = Math.sqrt((newX - rpx) * (newX - rpx) + (newY - rpy) * (newY - rpy));
				let pl1 = Math.abs(k1 === Infinity ? newY - refPoint.y / matrixInfo.scale : hyLen * Math.cos(angle * ONE_ANG));
				let pl2 = Math.sqrt(hyLen * hyLen - pl1 * pl1);
				let w = originW;
				let h = originH;
				let y = originY;
				let x = originX;
				let angl = 0;
				switch (dir) {
					case "w":
					case "sw":
						angl = Math.atan2(currentVertex[0].y - currentVertex[1].y, currentVertex[0].x - currentVertex[1].x) * ONE_RAD;
						break;
					case "n":
					case "ne":
					case "nw": angl = Math.atan2(currentVertex[0].y - currentVertex[2].y, currentVertex[0].x - currentVertex[2].x) * ONE_RAD;
				}
				switch (dir) {
					case "s":
						h = pl2;
						break;
					case "e":
						w = pl1;
						break;
					case "n":
						h = pl2;
						if (angl === 90) h = newY - currentVertex[2].y;
						break;
					case "w":
						w = pl1;
						if (angl === 0) w = newX - currentVertex[1].x;
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
				}
				if (minHeight && h < minHeight) h = minHeight;
				if (maxHeight && h > maxHeight) h = maxHeight;
				if (minWidth && w < minWidth) w = minWidth;
				if (maxWidth && w > maxWidth) w = maxWidth;
				let hLine, wLine;
				switch (dir) {
					case "s":
						hLine = {
							p1: currentVertex[1],
							p2: currentVertex[0]
						};
						h = limitWH(newX, newY, hLine, h, minHeight);
						break;
					case "e":
						wLine = {
							p1: currentVertex[0],
							p2: currentVertex[2]
						};
						w = limitWH(newX, newY, wLine, w, minWidth);
						break;
					case "se":
						wLine = {
							p1: currentVertex[0],
							p2: currentVertex[2]
						};
						hLine = {
							p1: currentVertex[1],
							p2: currentVertex[0]
						};
						w = limitWH(newX, newY, wLine, w, minWidth);
						h = limitWH(newX, newY, hLine, h, minHeight);
						break;
					case "n":
						hLine = {
							p1: currentVertex[2],
							p2: currentVertex[3]
						};
						h = limitWH(newX, newY, hLine, h, minHeight);
						let plh;
						if (angl === 90) {
							x = currentVertex[2].x;
							y = newY;
						} else if (currentVertex[2].y > currentVertex[0].y) {
							plh = h * Math.cos(angl * ONE_ANG);
							x = currentVertex[2].x + plh;
							y = currentVertex[2].y - Math.sqrt(h * h - plh * plh);
						} else {
							plh = h * Math.cos((180 - angl) * ONE_ANG);
							x = currentVertex[2].x - plh;
							y = currentVertex[2].y + Math.sqrt(h * h - plh * plh);
						}
						break;
					case "w":
						wLine = {
							p1: currentVertex[3],
							p2: currentVertex[1]
						};
						w = limitWH(newX, newY, wLine, w, minWidth);
						let plw;
						if (angl === 0) {
							x = newX;
							y = currentVertex[1].y;
						} else if (currentVertex[1].y > currentVertex[0].y) {
							plw = w * Math.cos((180 - angl) * ONE_ANG);
							x = currentVertex[1].x - plw;
							y = currentVertex[1].y - Math.sqrt(w * w - plw * plw);
						} else {
							plw = w * Math.cos(angl * ONE_ANG);
							x = currentVertex[1].x + plw;
							y = currentVertex[1].y + Math.sqrt(w * w - plw * plw);
						}
						break;
					case "nw":
						wLine = {
							p1: currentVertex[3],
							p2: currentVertex[1]
						};
						hLine = {
							p1: currentVertex[2],
							p2: currentVertex[3]
						};
						w = limitWH(newX, newY, wLine, w, minWidth);
						h = limitWH(newX, newY, hLine, h, minHeight);
						x = newX;
						y = newY;
						let cv2x = currentVertex[2].x;
						let cv2y = currentVertex[2].y;
						let cv1x = currentVertex[1].x;
						let cv1y = currentVertex[1].y;
						let v32n = normalizeVector(cv2x - currentVertex[3].x, cv2y - currentVertex[3].y);
						v32n.x *= minWidth;
						v32n.y *= minWidth;
						let v10n = normalizeVector(currentVertex[0].x - cv1x, currentVertex[0].y - cv1y);
						v10n.x *= minWidth;
						v10n.y *= minWidth;
						let wp1 = {
							x: wLine.p1.x + v32n.x,
							y: wLine.p1.y + v32n.y
						};
						let wp2 = {
							x: wLine.p2.x + v10n.x,
							y: wLine.p2.y + v10n.y
						};
						let invalid = (wp2.x - wp1.x) * (newY - wp1.y) - (wp2.y - wp1.y) * (newX - wp1.x) > 0;
						if (invalid) {
							let v20n = normalizeVector(currentVertex[0].x - cv2x, currentVertex[0].y - cv2y);
							v20n.x *= h;
							v20n.y *= h;
							x = wp1.x + v20n.x;
							y = wp1.y + v20n.y;
						}
						let v31n = normalizeVector(cv1x - currentVertex[3].x, cv1y - currentVertex[3].y);
						v31n.x *= minHeight;
						v31n.y *= minHeight;
						let v20n = normalizeVector(currentVertex[0].x - cv2x, currentVertex[0].y - cv2y);
						v20n.x *= minHeight;
						v20n.y *= minHeight;
						let hp1 = {
							x: hLine.p1.x + v31n.x,
							y: hLine.p1.y + v31n.y
						};
						let hp2 = {
							x: hLine.p2.x + v20n.x,
							y: hLine.p2.y + v20n.y
						};
						invalid = (hp2.x - hp1.x) * (newY - hp1.y) - (hp2.y - hp1.y) * (newX - hp1.x) > 0;
						if (invalid) {
							let v10n = normalizeVector(currentVertex[0].x - cv1x, currentVertex[0].y - cv1y);
							v10n.x *= w;
							v10n.y *= w;
							x = hp2.x + v10n.x;
							y = hp2.y + v10n.y;
						}
						break;
					case "sw":
						wLine = {
							p1: currentVertex[3],
							p2: currentVertex[1]
						};
						hLine = {
							p1: currentVertex[1],
							p2: currentVertex[0]
						};
						w = limitWH(newX, newY, wLine, w, minWidth);
						h = limitWH(newX, newY, hLine, h, minHeight);
						let plw1;
						if (angl === 0) {
							x = newX;
							y = currentVertex[0].y;
						} else if (currentVertex[1].y > currentVertex[0].y) {
							plw1 = w * Math.cos((180 - angl) * ONE_ANG);
							x = currentVertex[1].x - plw1;
							y = currentVertex[1].y - Math.sqrt(w * w - plw1 * plw1);
						} else {
							plw1 = w * Math.cos((180 - angl) * ONE_ANG);
							x = currentVertex[1].x - plw1;
							y = currentVertex[1].y + Math.sqrt(w * w - plw1 * plw1);
						}
						break;
					case "ne":
						wLine = {
							p1: currentVertex[0],
							p2: currentVertex[2]
						};
						hLine = {
							p1: currentVertex[2],
							p2: currentVertex[3]
						};
						w = limitWH(newX, newY, wLine, w, minWidth);
						h = limitWH(newX, newY, hLine, h, minHeight);
						let plne;
						if (angl === 0) {
							x = newX;
							y = currentVertex[0].y;
						} else if (currentVertex[1].x > currentVertex[0].x) {
							plne = h * Math.cos((180 - angl) * ONE_ANG);
							x = currentVertex[2].x - plne;
							y = currentVertex[2].y - Math.sqrt(h * h - plne * plne);
						} else {
							plne = h * Math.cos(angl * ONE_ANG);
							x = currentVertex[2].x + plne;
							y = currentVertex[2].y + Math.sqrt(h * h - plne * plne);
						}
				}
				if (aspectRatio) {
					if (changeH && dir !== "sw") {
						if (dir === "nw") y = originY - w / aspectRatio + originH;
					}
				}
				if (changeX || changeY) switch (dir) {
					case "n":
						x = originX;
						y = currentVertex[3].y - h;
						break;
					case "w":
						x = currentVertex[1].x - w;
						y = originY;
						break;
					case "nw":
						x = currentVertex[3].x - w;
						y = currentVertex[3].y - h;
						break;
					case "ne":
						x = currentVertex[2].x;
						y = currentVertex[3].y - h;
						break;
					case "sw":
						x = currentVertex[1].x - w;
						y = originY;
				}
				let canResize = true;
				if (onResize && onResize.call) {
					onResize.call;
					const panelRect = getRectInContainer(panel, panel.parentElement, matrixInfo);
					let centerX = Math.round(panelRect.x + panelRect.w / 2);
					let centerY = Math.round(panelRect.y + panelRect.h / 2);
					let sx = Math.round(centerX - originW / 2);
					let sy = Math.round(centerY - originH / 2);
					canResize = onResize.call(uiik, {
						w,
						h,
						ow: w - originW,
						oh: h - originH,
						target: panel,
						cx: x,
						cy: y,
						sx,
						sy,
						deg: matrixInfo.angle,
						transform,
						handle
					}, ev);
				}
				if (canResize !== false) {
					if (aspectRatio) {
						if (changeW) {
							style.width = w + "px";
							style.height = w / aspectRatio + "px";
						}
						if (changeH && dir !== "sw" && dir !== "nw") {
							style.width = h * aspectRatio + "px";
							style.height = h + "px";
						}
					} else {
						if (changeW) resize(transform, style, w);
						if (changeH) resize(transform, style, void 0, h);
					}
					if (changeY) transform.moveTo(x, y + sY);
					if (changeX) transform.moveTo(x + sX, y);
				}
				lastX = x;
				lastY = y;
				currentW = w;
				currentH = h;
			});
			onPointerEnd((args) => {
				const { ev } = args;
				let doDefault = true;
				handle.classList.remove(CLASS_RESIZABLE_HANDLE_ACTIVE);
				let ghostLeft = "0";
				let ghostTop = "0";
				let ghostWidth = "0";
				let ghostHeight = "0";
				if (ghost && ghostNode) {
					var _panel$parentNode2, _panel$parentNode3;
					ghostLeft = ghostNode.style.left;
					ghostTop = ghostNode.style.top;
					ghostWidth = ghostNode.style.width;
					ghostHeight = ghostNode.style.height;
					(_panel$parentNode2 = panel.parentNode) !== null && _panel$parentNode2 !== void 0 && _panel$parentNode2.contains(ghostNode) && ((_panel$parentNode3 = panel.parentNode) === null || _panel$parentNode3 === void 0 || _panel$parentNode3.removeChild(ghostNode));
				}
				if (onEnd) doDefault = onEnd.call(uiik, {
					w: currentW,
					h: currentH,
					transform,
					handle,
					ghost: ghostNode
				}, ev);
				if (doDefault === false) return;
				if (ghost && ghostNode) {
					panelStyle.left = ghostLeft;
					panelStyle.top = ghostTop;
					transform = wrapper(panel);
					transform.moveTo(lastX + sX, lastY + sY);
					resize(transform, panelStyle, parseFloat(ghostWidth), parseFloat(ghostHeight));
				}
				if (setOrigin) panel.style.transformOrigin = originalTransformOrigin;
				let { x: centerX, y: centerY } = getRectCenter(panel, matrixInfo);
				let sx = Math.round(centerX - currentW / 2);
				let sy = Math.round(centerY - currentH / 2);
				const deg = matrixInfo.angle * ONE_ANG;
				const currentVertex = calcVertex(currentW, currentH, centerX, centerY, sx, sy, deg);
				if (setOrigin) {
					if (panel instanceof HTMLElement) {
						if (changeX || changeY) transform.moveTo(transform.x - (currentVertex[0].x - lastX), transform.y - (currentVertex[0].y - lastY));
						else transform.moveTo(transform.x - (currentVertex[0].x - vertexBeforeTransform[0].x), transform.y - (currentVertex[0].y - vertexBeforeTransform[0].y));
					}
				}
			});
		});
	}
	initHandle(panel) {
		const opts = this.opts;
		let handleStr = opts.handle;
		let handles;
		if (isString(handleStr)) handles = document.querySelectorAll(handleStr);
		else if (isFunction(handleStr)) handles = handleStr(panel);
		else if (isElement(handleStr)) handles = [handleStr];
		else if (isArrayLike(handleStr)) {
			let eles = filter(handleStr, (h) => isElement(h));
			if (eles.length > 0) handles = eles;
		}
		if (!handles) {
			console.error("Can not find handles in \"" + panel.outerHTML + "\"");
			return;
		}
		handles = isArrayLike(handles) ? handles : [handles];
		each(handles, (h) => {
			const matchRs = (h.getAttribute("class") || "").match(EXP_DIR);
			let dir = "se";
			if (matchRs) dir = matchRs.groups.dir;
			h.classList.add(CLASS_RESIZABLE_HANDLE);
			this.bindHandle(h, dir, panel, opts);
			h.style.cursor = `${dir}-resize`;
			h.dataset.cursor = `${dir}-resize`;
			h.setAttribute("name", "handle");
		});
	}
};
function limitWH(newX, newY, line, value, minValue) {
	let p1 = line.p1;
	let p2 = line.p2;
	if ((p2.x - p1.x) * (newY - p1.y) - (p2.y - p1.y) * (newX - p1.x) > 0) return minValue;
	return value;
}
function resize(transform, style, w, h) {
	if (transform.el instanceof SVGGraphicsElement) {
		if (isDefined(w)) transform.el.setAttribute("width", w + "");
		if (isDefined(h)) transform.el.setAttribute("height", h + "");
	} else {
		if (isDefined(w)) style.width = w + "px";
		if (isDefined(h)) style.height = h + "px";
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
//#endregion
//#region src/geometry.ts
function getRectRight(rect) {
	return rect.x + rect.w;
}
function getRectBottom(rect) {
	return rect.y + rect.h;
}
function rectCenter(rect) {
	return {
		x: rect.x + rect.w / 2,
		y: rect.y + rect.h / 2
	};
}
/**
* 一组矩形的并集（最小包围盒）
* @returns 空数组时返回 null
*/
function unionRect(rects) {
	if (!rects || rects.length === 0) return null;
	let x1 = Infinity;
	let y1 = Infinity;
	let x2 = -Infinity;
	let y2 = -Infinity;
	for (const rect of rects) {
		if (!rect) continue;
		x1 = Math.min(x1, rect.x);
		y1 = Math.min(y1, rect.y);
		x2 = Math.max(x2, getRectRight(rect));
		y2 = Math.max(y2, getRectBottom(rect));
	}
	if (x2 < x1 || y2 < y1) return null;
	return {
		x: x1,
		y: y1,
		w: x2 - x1,
		h: y2 - y1
	};
}
/** 两个矩形是否相交（含边界相接） */
function rectsOverlap(a, b) {
	return a.x <= getRectRight(b) && getRectRight(a) >= b.x && a.y <= getRectBottom(b) && getRectBottom(a) >= b.y;
}
/** outer 是否完全包含 inner */
function rectContains(outer, inner) {
	return inner.x >= outer.x && inner.y >= outer.y && getRectRight(inner) <= getRectRight(outer) && getRectBottom(inner) <= getRectBottom(outer);
}
/**
* 按内缩量收缩矩形
* 任一边收缩过头时该轴尺寸退化为 0；两侧内缩量不等时保留中心
*/
function rectInset(rect, insets) {
	const top = insets.top || 0;
	const right = insets.right || 0;
	const bottom = insets.bottom || 0;
	const left = insets.left || 0;
	const w = Math.max(0, rect.w - left - right);
	const h = Math.max(0, rect.h - top - bottom);
	return {
		x: left > right ? rect.x + left : getRectRight(rect) - right - w,
		y: top > bottom ? rect.y + top : getRectBottom(rect) - bottom - h,
		w,
		h
	};
}
/** 计算矩形在某对齐方式下的对齐线坐标 */
function alignCoord(rect, mode) {
	switch (mode) {
		case "left": return rect.x;
		case "centerX": return rect.x + rect.w / 2;
		case "right": return getRectRight(rect);
		case "top": return rect.y;
		case "centerY": return rect.y + rect.h / 2;
		case "bottom": return getRectBottom(rect);
	}
}
/** 令矩形在该对齐方式下的对齐线落到 coord */
function applyCoord(rect, mode, coord) {
	switch (mode) {
		case "left": return {
			...rect,
			x: coord
		};
		case "centerX": return {
			...rect,
			x: coord - rect.w / 2
		};
		case "right": return {
			...rect,
			x: coord - rect.w
		};
		case "top": return {
			...rect,
			y: coord
		};
		case "centerY": return {
			...rect,
			y: coord - rect.h / 2
		};
		case "bottom": return {
			...rect,
			y: coord - rect.h
		};
	}
}
/**
* 对齐一组矩形
*
* @param rects 待对齐的矩形
* @param mode 对齐方式
* @param to 对齐参照框，缺省为 rects 自身的并集（对齐到选区）。
*            传入单元素的数组即对齐到某个容器/画布
* @returns 新的矩形数组，不修改入参
*/
function alignRects(rects, mode, to) {
	if (!rects || rects.length === 0) return [];
	const ref = unionRect(to && to.length ? to : rects);
	if (!ref) return rects.map((r) => ({ ...r }));
	const coord = alignCoord(ref, mode);
	return rects.map((rect) => applyCoord(rect, mode, coord));
}
/**
* 沿单轴等间距分布一组矩形。
* 首尾矩形的原位不动，中间的矩形在首尾之间重新排布。
*
* 少于 3 个矩形时无可分配的空隙，原样返回
*
* @returns 与输入一一对应的新矩形数组，不修改入参
*/
function distributeRects(rects, dir, opts) {
	const result = (rects || []).map((r) => ({ ...r }));
	if (result.length < 3) return result;
	const posKey = dir === "h" ? "x" : "y";
	const sizeKey = dir === "h" ? "w" : "h";
	const order = result.map((_, i) => i);
	order.sort((a, b) => result[a][posKey] - result[b][posKey]);
	const first = result[order[0]];
	const last = result[order[order.length - 1]];
	const span = last[posKey] + last[sizeKey] - first[posKey];
	const sumSizes = result.reduce((acc, r) => acc + r[sizeKey], 0);
	const gap = (opts === null || opts === void 0 ? void 0 : opts.gap) != null ? opts.gap : (span - sumSizes) / (result.length - 1);
	const crossMode = opts === null || opts === void 0 ? void 0 : opts.align;
	const crossCoord = crossMode != null && (dir === "h" ? crossMode === "top" || crossMode === "centerY" || crossMode === "bottom" : crossMode === "left" || crossMode === "centerX" || crossMode === "right") ? alignCoord(unionRect(result), crossMode) : void 0;
	let cursor = first[posKey];
	for (const i of order) {
		if (crossCoord != null && crossMode) Object.assign(result[i], applyCoord(result[i], crossMode, crossCoord));
		result[i][posKey] = cursor;
		cursor += result[i][sizeKey] + gap;
	}
	return result;
}
/**
* 吸附到网格步长。
* 负坐标同样正确——不能用位运算 `>> 0`，它向零截断，
* 会把 x=-7/grid=10 吸附到 0 而非 -10
*/
function snapToGrid(v, grid) {
	return grid > 0 ? Math.round(v / grid) * grid : v;
}
/**
* 求解缩放后的矩形
*
* @param start 缩放前的矩形
* @param dir 手柄方向
* @param dx 指针在 x 轴上的位移
* @param dy 指针在 y 轴上的位移
* @param opts 尺寸约束
* @returns 新的矩形，不修改入参。对侧边保持不动
*/
function resizeRect(start, dir, dx, dy, opts) {
	const minW = (opts === null || opts === void 0 ? void 0 : opts.minW) != null ? opts.minW : 0;
	const minH = (opts === null || opts === void 0 ? void 0 : opts.minH) != null ? opts.minH : 0;
	const maxW = (opts === null || opts === void 0 ? void 0 : opts.maxW) != null ? opts.maxW : Infinity;
	const maxH = (opts === null || opts === void 0 ? void 0 : opts.maxH) != null ? opts.maxH : Infinity;
	const grid = (opts === null || opts === void 0 ? void 0 : opts.grid) != null ? opts.grid : 0;
	let x = start.x;
	let y = start.y;
	let w = start.w;
	let h = start.h;
	const movesX = dir.indexOf("e") >= 0 || dir.indexOf("w") >= 0;
	const movesY = dir.indexOf("n") >= 0 || dir.indexOf("s") >= 0;
	if (movesX) {
		const raw = dir.indexOf("w") >= 0 ? start.w - dx : start.w + dx;
		w = Math.min(maxW, Math.max(minW, snapToGrid(raw, grid)));
		if (dir.indexOf("w") >= 0) x = start.x + (start.w - w);
	}
	if (movesY) {
		const raw = dir.indexOf("n") >= 0 ? start.h - dy : start.h + dy;
		h = Math.min(maxH, Math.max(minH, snapToGrid(raw, grid)));
		if (dir.indexOf("n") >= 0) y = start.y + (start.h - h);
	}
	if ((opts === null || opts === void 0 ? void 0 : opts.keepAspect) && movesX && movesY && start.w > 0 && start.h > 0) {
		const ratio = start.h / start.w;
		if (Math.abs(dx) >= Math.abs(dy)) {
			const nh = Math.min(maxH, Math.max(minH, snapToGrid(w * ratio, grid)));
			if (dir.indexOf("n") >= 0) y = start.y + (start.h - nh);
			h = nh;
		} else {
			const nw = Math.min(maxW, Math.max(minW, snapToGrid(h / ratio, grid)));
			if (dir.indexOf("w") >= 0) x = start.x + (start.w - nw);
			w = nw;
		}
	}
	return {
		x,
		y,
		w,
		h
	};
}
/**
* 缩放并平移视口，使 rect 恰好居中落在视口内
*
* @param rect 世界坐标下的目标区域
* @param viewport 视口尺寸
* @returns 新的 View
*/
function fitRectInViewport(rect, viewport, opts) {
	const padding = (opts === null || opts === void 0 ? void 0 : opts.padding) != null ? opts.padding : 0;
	const minScale = (opts === null || opts === void 0 ? void 0 : opts.minScale) != null ? opts.minScale : 0;
	const maxScale = (opts === null || opts === void 0 ? void 0 : opts.maxScale) != null ? opts.maxScale : 1;
	const availW = Math.max(1, viewport.w - padding * 2);
	const availH = Math.max(1, viewport.h - padding * 2);
	const raw = rect.w > 0 && rect.h > 0 ? Math.min(availW / rect.w, availH / rect.h) : maxScale;
	const scale = Math.min(maxScale, Math.max(minScale, raw));
	return {
		x: (viewport.w - rect.w * scale) / 2 - rect.x * scale,
		y: (viewport.h - rect.h * scale) / 2 - rect.y * scale,
		scale
	};
}
/**
* 以视口内某点为锚点缩放，锚点下的世界坐标保持不动
*
* @param pivot 视口（屏幕）坐标下的锚点
*/
function zoomAt(view, pivot, factor, opts) {
	const min = (opts === null || opts === void 0 ? void 0 : opts.min) != null ? opts.min : .2;
	const max = (opts === null || opts === void 0 ? void 0 : opts.max) != null ? opts.max : 4;
	const scale = Math.min(max, Math.max(min, view.scale * factor));
	const k = scale / view.scale;
	return {
		x: pivot.x - (pivot.x - view.x) * k,
		y: pivot.y - (pivot.y - view.y) * k,
		scale
	};
}
/** 视图平移 */
function panBy(view, dx, dy) {
	return {
		x: view.x + dx,
		y: view.y + dy,
		scale: view.scale
	};
}
var DEFAULT_SNAP_POINTS = [
	"start",
	"center",
	"end"
];
/** 锚点坐标 */
function pointCoord(rect, axis, point) {
	if (axis === "x") return point === "start" ? rect.x : point === "center" ? rect.x + rect.w / 2 : getRectRight(rect);
	return point === "start" ? rect.y : point === "center" ? rect.y + rect.h / 2 : getRectBottom(rect);
}
/** 矩形在某轴上的全部锚点 */
function pointsOn(rect, axis, points) {
	return points.map((point) => ({
		point,
		coord: pointCoord(rect, axis, point)
	}));
}
/**
* 元素吸附求解：把候选矩形吸附到一组目标矩形的对齐线上
*
* 候选与目标的锚点两两配对（三线全开即 3×3 共 9 种组合），
* 因此「右边缘贴左边缘」这类交叉对齐同样会被识别。
*
* @param candidate 待吸附的矩形，通常是被拖动元素当前所在位置
* @param targets 吸附目标矩形集合
* @param opts 容差/锚点/取舍策略等
* @returns 命中时给出需施加的位移 dx/dy；未命中则 dx=dy=0
*/
function findSnap(candidate, targets, opts) {
	const result = {
		dx: 0,
		dy: 0
	};
	if (!candidate || !targets || targets.length === 0) return result;
	const tx = (opts === null || opts === void 0 ? void 0 : opts.tolerance) != null ? opts.tolerance : 6;
	const ty = (opts === null || opts === void 0 ? void 0 : opts.toleranceY) != null ? opts.toleranceY : tx;
	const strategy = (opts === null || opts === void 0 ? void 0 : opts.strategy) || "nearest";
	const exclude = (opts === null || opts === void 0 ? void 0 : opts.exclude) || [];
	const points = (opts === null || opts === void 0 ? void 0 : opts.points) && opts.points.length ? opts.points : DEFAULT_SNAP_POINTS;
	const candX = pointsOn(candidate, "x", points);
	const candY = pointsOn(candidate, "y", points);
	let bestX = null;
	let bestY = null;
	for (let i = 0; i < targets.length; i++) {
		if (exclude.indexOf(i) >= 0) continue;
		const target = targets[i];
		if (!target) continue;
		const tgtX = pointsOn(target, "x", points);
		const tgtY = pointsOn(target, "y", points);
		for (const c of candX) for (const t of tgtX) {
			const delta = t.coord - c.coord;
			if (Math.abs(delta) > tx) continue;
			const hit = {
				axis: "x",
				point: c.point,
				targetPoint: t.point,
				targetIndex: i,
				coord: t.coord,
				delta
			};
			if ((opts === null || opts === void 0 ? void 0 : opts.onHit) && opts.onHit(hit) === false) continue;
			if (!bestX || strategy === "nearest" && Math.abs(delta) < Math.abs(bestX.delta)) bestX = hit;
		}
		for (const c of candY) for (const t of tgtY) {
			const delta = t.coord - c.coord;
			if (Math.abs(delta) > ty) continue;
			const hit = {
				axis: "y",
				point: c.point,
				targetPoint: t.point,
				targetIndex: i,
				coord: t.coord,
				delta
			};
			if ((opts === null || opts === void 0 ? void 0 : opts.onHit) && opts.onHit(hit) === false) continue;
			if (!bestY || strategy === "nearest" && Math.abs(delta) < Math.abs(bestY.delta)) bestY = hit;
		}
	}
	if (bestX) {
		result.dx = bestX.delta;
		result.hitX = bestX;
	}
	if (bestY) {
		result.dy = bestY.delta;
		result.hitY = bestY;
	}
	return result;
}
/**
* 由吸附结果生成参考线
*
* @param candidate 拖动前（或吸附前）的矩形
* @param targets findSnap 的目标集合
* @param result findSnap 的返回值
* @param padding 两端外扩量
*/
function snapGuides(candidate, targets, result, padding = 40) {
	if (!candidate || !result || !result.hitX && !result.hitY) return [];
	const parts = [candidate, {
		x: candidate.x + result.dx,
		y: candidate.y + result.dy,
		w: candidate.w,
		h: candidate.h
	}];
	if (result.hitX && targets) {
		const t = targets[result.hitX.targetIndex];
		if (t) parts.push(t);
	}
	if (result.hitY && targets) {
		const t = targets[result.hitY.targetIndex];
		if (t) parts.push(t);
	}
	const span = unionRect(parts);
	if (!span) return [];
	const guides = [];
	if (result.hitX) guides.push({
		dir: "v",
		coord: result.hitX.coord,
		from: span.y - padding,
		to: getRectBottom(span) + padding
	});
	if (result.hitY) guides.push({
		dir: "h",
		coord: result.hitY.coord,
		from: span.x - padding,
		to: getRectRight(span) + padding
	});
	return guides;
}
//#endregion
//#region src/draggable.ts
/**
* dom dragger
* @author holyhigh2
*/
var DRAGGER_GROUPS = {};
var CLASS_DRAGGABLE = "uii-draggable";
var CLASS_DRAGGABLE_HANDLE = "uii-draggable-handle";
var CLASS_DRAGGABLE_ACTIVE = "uii-draggable-active";
var CLASS_DRAGGABLE_GHOST = "uii-draggable-ghost";
var HANDLE_MAP = /* @__PURE__ */ new WeakMap();
var OPTION_MAP = /* @__PURE__ */ new WeakMap();
var BINDED_CONTAINER = /* @__PURE__ */ new WeakSet();
var WATCH_MAP = {};
/**
* 解析snap的查询根
* 优先级：snapOptions.container > containment容器 > 首个可拖动元素的父元素 > document
* 后两级使组件位于shadow dom内时，无需显式配置也能命中同容器内的选择器
* @param opts
* @param container containment容器
* @param fallbackParent 首个可拖动元素的父元素
*/
function resolveSnapRoot(opts, container, fallbackParent) {
	var _opts$snapOptions;
	const c = (_opts$snapOptions = opts.snapOptions) === null || _opts$snapOptions === void 0 ? void 0 : _opts$snapOptions.container;
	if (isString(c)) {
		const el = document.querySelector(c);
		if (el) return el;
	} else if (isElement(c)) return c;
	return container || fallbackParent || document;
}
/**
* 解析snap目标，支持选择器/元素/元素数组/返回元素数组的函数。
* 与draggable.droppable、CollisionDetector.targets 的多态保持一致
* @param snap
* @param root 选择器的查询根
*/
function resolveSnapTargets(snap, root) {
	let list;
	if (isFunction(snap)) list = snap();
	else if (isString(snap)) list = root.querySelectorAll(snap);
	else if (isElement(snap)) list = [snap];
	else if (isArrayLike(snap)) list = snap;
	else list = [];
	return reject(list || [], (el) => !el);
}
/** 锚点对应的dir字符：起始边l、结束边r、中线c */
var SNAP_DIR_CHAR = {
	start: "l",
	center: "c",
	end: "r"
};
/**
* 生成dirH/dirV，如l2l、c2r。保持与旧版边缘配对命名兼容
* @param hit
*/
function snapDir(hit) {
	if (!hit) return "";
	return SNAP_DIR_CHAR[hit.point] + "2" + SNAP_DIR_CHAR[hit.targetPoint];
}
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
var Draggable = class extends Uii {
	constructor(els, opts) {
		super(els, assign({
			containment: false,
			watch: true,
			threshold: 3,
			ghost: false,
			direction: "",
			scroll: false,
			useTransform: true,
			snapOptions: { tolerance: 10 },
			self: false
		}, opts));
		this.__container = null;
		if (this.opts.handle) this.__initHandle(this.ele);
		this.onOptionChanged(this.opts);
		if (this.opts.group) {
			if (!DRAGGER_GROUPS[this.opts.group]) DRAGGER_GROUPS[this.opts.group] = [];
			DRAGGER_GROUPS[this.opts.group].push(...this.ele);
		}
		this.__initStyle(this.ele);
		if (this.opts.containment) {
			if (isBoolean(this.opts.containment)) this.__container = isEmpty(this.ele) ? null : this.ele[0].parentElement;
			else if (isString(this.opts.containment)) this.__container = document.querySelector(this.opts.containment);
			else if (isElement(this.opts.containment)) this.__container = this.opts.containment;
		}
		if (this.opts.watch && this.eleString) {
			let con;
			if (isString(this.opts.watch)) con = document.querySelector(this.opts.watch);
			else con = isEmpty(this.ele) ? null : this.ele[0].parentElement;
			let bindTarget = con || document.body;
			if (BINDED_CONTAINER.has(bindTarget)) return;
			WATCH_MAP[this.eleString] = this;
			this.bindEvent(bindTarget);
			BINDED_CONTAINER.add(bindTarget);
		} else each(this.ele, (el) => {
			this.bindEvent(el);
		});
	}
	__initHandle(ele) {
		each(ele, (el) => {
			if (HANDLE_MAP.has(el)) return;
			let h;
			if (isString(this.opts.handle)) {
				h = el.querySelector(this.opts.handle);
				if (!h) {
					console.error("No handle found \"" + this.opts.handle + "\"");
					return false;
				}
			} else if (isElement(this.opts.handle)) h = this.opts.handle;
			HANDLE_MAP.set(el, h);
		});
	}
	__initStyle(draggableList) {
		each(draggableList, (el) => {
			if (OPTION_MAP.has(el)) return;
			if (isDefined(this.opts.type)) el.dataset.dropType = this.opts.type;
			el.classList.toggle(CLASS_DRAGGABLE, true);
			(HANDLE_MAP.get(el) || el).classList.toggle(CLASS_DRAGGABLE_HANDLE, true);
			if (!isUndefined(this.opts.cursor)) {
				el.style.cursor = this.opts.cursor.default || "move";
				if (isDefined(this.opts.cursor.over)) {
					el.dataset.cursorOver = this.opts.cursor.over;
					el.dataset.cursorActive = this.opts.cursor.active || "move";
				}
			}
			OPTION_MAP.set(el, this.opts);
		});
	}
	bindEvent(bindTarget) {
		const container = this.__container;
		let draggableList = this.ele;
		const eleString = this.eleString;
		const initStyle = this.__initStyle.bind(this);
		this.addPointerDown(bindTarget, ({ ev, currentCStyle, onPointerStart, onPointerMove, onPointerEnd }) => {
			var _opts$snapOptions2, _opts$snapOptions3, _opts$snapOptions4, _opts$snapOptions5, _this$ele$;
			let t = ev.target;
			if (!t) return true;
			let opts = {};
			let findRs = closest(t, (node) => node && get(node, "__uii_target_"), "parentElement");
			if (!findRs || isEmpty(OPTION_MAP.get(findRs))) {
				let toBreak = true;
				each(WATCH_MAP, (v, k) => {
					draggableList = bindTarget.querySelectorAll(eleString);
					if (!isEmpty(draggableList) && (findRs = closest(t, (node) => includes(draggableList, node), "parentNode"))) {
						initStyle(draggableList);
						opts = v.opts;
						v.__initHandle(draggableList);
						toBreak = false;
						return false;
					}
				});
				if (toBreak) return true;
			}
			const dragDom = findRs;
			let handle = HANDLE_MAP.get(dragDom);
			if (handle && !isCustomElement(t) && !handle.contains(t)) return true;
			if (isEmpty(opts)) opts = OPTION_MAP.get(dragDom);
			if (!opts || isEmpty(opts)) return true;
			if (opts.self && dragDom !== t) return true;
			const onPointerDown = opts.onPointerDown;
			if (onPointerDown && onPointerDown({
				draggable: dragDom,
				handle
			}, ev) === false) return true;
			const filter = opts.filter;
			if (filter) {
				if (some(dragDom.querySelectorAll(filter), (ele) => ele.contains(t))) return true;
			}
			let offsetParent;
			let offsetParentRect;
			let offsetParentCStyle;
			let scrollParent;
			let scrollViewportRect;
			let startScrollLeft = 0;
			let startScrollTop = 0;
			let compensatedX = 0;
			let compensatedY = 0;
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
			let snapTargets = [];
			let snapRects = [];
			const snapTolerance = ((_opts$snapOptions2 = opts.snapOptions) === null || _opts$snapOptions2 === void 0 ? void 0 : _opts$snapOptions2.tolerance) || 10;
			const snapToleranceY = ((_opts$snapOptions3 = opts.snapOptions) === null || _opts$snapOptions3 === void 0 ? void 0 : _opts$snapOptions3.toleranceY) || snapTolerance;
			const snapPoints = (_opts$snapOptions4 = opts.snapOptions) === null || _opts$snapOptions4 === void 0 ? void 0 : _opts$snapOptions4.points;
			const snapStrategy = (_opts$snapOptions5 = opts.snapOptions) === null || _opts$snapOptions5 === void 0 ? void 0 : _opts$snapOptions5.strategy;
			const snapRoot = resolveSnapRoot(opts, container, ((_this$ele$ = this.ele[0]) === null || _this$ele$ === void 0 ? void 0 : _this$ele$.parentElement) || null);
			const onSnap = opts.onSnap;
			let lastSnapDirY = "", lastSnapDirX = "";
			let lastSnapping = "";
			const dragDomRect = dragDom.getBoundingClientRect();
			let originW;
			let originH;
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
			let dragging = false;
			let snapTimer = null;
			let startMatrixInfo;
			let startPointXy;
			onPointerStart(function(args) {
				const { ev } = args;
				dragging = true;
				offsetParent = dragDom instanceof HTMLElement ? dragDom.offsetParent || document.body : dragDom.ownerSVGElement;
				scrollParent = getScrollParent(offsetParent, container);
				scrollViewportRect = scrollParent ? getScrollViewportRect(scrollParent) : null;
				startScrollLeft = scrollParent ? scrollParent.scrollLeft : 0;
				startScrollTop = scrollParent ? scrollParent.scrollTop : 0;
				compensatedX = 0;
				compensatedY = 0;
				offsetParentRect = offsetParent.getBoundingClientRect();
				offsetParentCStyle = window.getComputedStyle(offsetParent);
				startMatrixInfo = getMatrixInfo(dragDom, true);
				const offsetXy = getPointInContainer(ev, dragDom, void 0, void 0, startMatrixInfo);
				offsetPointX = offsetXy.x;
				offsetPointY = offsetXy.y;
				startPointXy = getPointInContainer(ev, offsetParent, offsetParentRect, offsetParentCStyle, startMatrixInfo);
				originW = dragDomRect.width;
				originH = dragDomRect.height;
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
					each(DRAGGER_GROUPS[group], (el) => {
						const z = parseInt(currentCStyle.zIndex) || 0;
						if (z > i) i = z;
					});
					zIndex = i + 1;
				}
				const grid = opts.grid;
				if (isArray(grid)) {
					gridX = grid[0];
					gridY = grid[1];
				} else if (isNumber(grid)) gridX = gridY = grid;
				if (snapOn) {
					snapTargets = reject(resolveSnapTargets(snapOn, snapRoot), (el) => el === dragDom);
					snapRects = map(snapTargets, (el) => {
						const { x, y, w, h } = getRectInContainer(el, offsetParent, startMatrixInfo);
						return {
							x,
							y,
							w,
							h
						};
					});
				}
				if (inContainer) {
					maxX = container.scrollWidth - originW / startMatrixInfo.scale;
					maxY = container.scrollHeight - originH / startMatrixInfo.scale;
				}
				if (maxX < 0) maxX = 0;
				if (maxY < 0) maxY = 0;
				if (ghost) {
					if (isFunction(ghost)) ghostNode = ghost(dragDom);
					else {
						ghostNode = dragDom.cloneNode(true);
						ghostNode.style.opacity = "0.3";
						ghostNode.style.pointerEvents = "none";
						ghostNode.style.position = "absolute";
					}
					ghostNode.style.zIndex = zIndex + "";
					if (ghostClass) ghostNode.classList.add(...compact(split(ghostClass, " ")));
					ghostNode.classList.add(...compact(split(classes, " ")));
					ghostNode.classList.toggle(CLASS_DRAGGABLE_GHOST, true);
					let ghostParent = ghostTo ? isString(ghostTo) ? document.querySelector(ghostTo) : ghostTo : dragDom.parentNode;
					ghostParent === null || ghostParent === void 0 || ghostParent.appendChild(ghostNode);
					transform = wrapper(ghostNode, opts.useTransform);
					onClone && onClone({
						clone: ghostNode,
						draggable: dragDom
					}, ev);
				} else transform = wrapper(dragDom, opts.useTransform);
				dragDom.classList.add(...compact(split(classes, " ")));
				if (!ghostNode) dragDom.style.zIndex = zIndex + "";
				dragDom.classList.toggle(CLASS_DRAGGABLE_ACTIVE, true);
				onStart && onStart({
					draggable: dragDom,
					x: startPointXy.x,
					y: startPointXy.y,
					transform
				}, ev);
				const customEv = new CustomEvent("uii-dragactive", {
					bubbles: true,
					composed: true,
					cancelable: false,
					detail: { target: dragDom }
				});
				dragDom.dispatchEvent(customEv);
			});
			onPointerMove((args) => {
				const { ev, pointX, pointY, offX, offY } = args;
				const scrollDeltaX = scrollParent ? scrollParent.scrollLeft - startScrollLeft - compensatedX : 0;
				const scrollDeltaY = scrollParent ? scrollParent.scrollTop - startScrollTop - compensatedY : 0;
				let newX = startPointXy.x + offX + scrollDeltaX;
				let newY = startPointXy.y + offY + scrollDeltaY;
				if (scroll && scrollParent && scrollViewportRect) {
					const sp = scrollParent;
					const vp = scrollViewportRect;
					const lX = pointX - vp.x;
					const lY = pointY - vp.y;
					const rX = vp.x + vp.width - pointX;
					const rY = vp.y + vp.height - pointY;
					toLeft = lX < 5;
					toTop = lY < 5;
					toRight = rX < 5;
					toBottom = rY < 5;
					if (toLeft || toTop || toRight || toBottom) {
						if (!timer) timer = setInterval(() => {
							const beforeL = sp.scrollLeft;
							const beforeT = sp.scrollTop;
							if (toLeft) sp.scrollLeft -= scrollSpeed;
							else if (toRight) sp.scrollLeft += scrollSpeed;
							if (toTop) sp.scrollTop -= scrollSpeed;
							else if (toBottom) sp.scrollTop += scrollSpeed;
							const dx = sp.scrollLeft - beforeL;
							const dy = sp.scrollTop - beforeT;
							if (dx || dy) {
								compensatedX += dx;
								compensatedY += dy;
								let nx = transform.x + dx;
								let ny = transform.y + dy;
								if (inContainer) {
									if (nx < minX) nx = 0;
									if (ny < minY) ny = 0;
									if (nx > maxX) nx = maxX;
									if (ny > maxY) ny = maxY;
								}
								if (direction === "v") transform.moveToY(ny);
								else if (direction === "h") transform.moveToX(nx);
								else transform.moveTo(nx, ny);
							}
						}, 20);
					} else if (timer) {
						clearInterval(timer);
						timer = null;
					}
				}
				let x = newX - offsetPointX;
				let y = newY - offsetPointY;
				if (isNumber(gridX) && isNumber(gridY)) {
					x = snapToGrid(x, gridX);
					y = snapToGrid(y, gridY);
				}
				if (inContainer) {
					if (x < minX) x = 0;
					if (y < minY) y = 0;
					if (x > maxX) x = maxX;
					if (y > maxY) y = maxY;
				}
				let canDrag = true;
				let emitSnap = false;
				if (snapOn && snapRects.length) {
					const scale = startMatrixInfo.scale || 1;
					const snapResult = findSnap({
						x,
						y,
						w: originW / scale,
						h: originH / scale
					}, snapRects, {
						tolerance: snapTolerance,
						toleranceY: snapToleranceY,
						points: snapPoints,
						strategy: snapStrategy
					});
					if (direction === "v") {
						snapResult.dx = 0;
						snapResult.hitX = void 0;
					} else if (direction === "h") {
						snapResult.dy = 0;
						snapResult.hitY = void 0;
					}
					if (snapResult.dx || snapResult.dy) {
						x += snapResult.dx;
						y += snapResult.dy;
						lastSnapDirX = snapDir(snapResult.hitX);
						lastSnapDirY = snapDir(snapResult.hitY);
						if (onSnap && lastSnapping !== lastSnapDirX + "" + lastSnapDirY) {
							const hitX = snapResult.hitX;
							const hitY = snapResult.hitY;
							const snapDx = snapResult.dx;
							const snapDy = snapResult.dy;
							clearTimeout(snapTimer);
							snapTimer = setTimeout(() => {
								if (!dragging) return;
								onSnap({
									el: ghostNode || dragDom,
									targetH: hitX ? snapTargets[hitX.targetIndex] : void 0,
									targetV: hitY ? snapTargets[hitY.targetIndex] : void 0,
									dirH: snapDir(hitX),
									dirV: snapDir(hitY),
									dx: snapDx,
									dy: snapDy
								}, ev);
							}, 0);
							lastSnapping = lastSnapDirX + "" + lastSnapDirY;
						}
						emitSnap = true;
					} else lastSnapDirX = lastSnapDirY = lastSnapping = "";
				}
				if (onDrag && !emitSnap) {
					if (onDrag({
						draggable: dragDom,
						ox: offX,
						oy: offY,
						x,
						y,
						transform
					}, ev) === false) {
						canDrag = false;
						endX = x;
						endY = y;
					}
				}
				if (canDrag) {
					if (direction === "v") transform.moveToY(y);
					else if (direction === "h") transform.moveToX(x);
					else transform.moveTo(x, y);
					endX = x;
					endY = y;
				}
			});
			onPointerEnd((args) => {
				const { ev, currentStyle } = args;
				dragging = false;
				clearTimeout(snapTimer);
				snapTimer = null;
				if (scroll) {
					if (timer) {
						clearInterval(timer);
						timer = null;
					}
				}
				dragDom.classList.remove(...compact(split(classes, " ")));
				currentStyle.zIndex = originalZIndex;
				dragDom.classList.remove(CLASS_DRAGGABLE_ACTIVE);
				let moveToGhost = true;
				if (onEnd) moveToGhost = onEnd({
					draggable: dragDom,
					x: endX,
					y: endY,
					transform,
					ghost: ghostNode
				}, ev) === false ? false : true;
				const customEv = new CustomEvent("uii-dragdeactive", {
					bubbles: true,
					composed: true,
					cancelable: false,
					detail: { target: dragDom }
				});
				dragDom.dispatchEvent(customEv);
				if (ghost) {
					var _ghostNode$parentNode;
					(_ghostNode$parentNode = ghostNode.parentNode) === null || _ghostNode$parentNode === void 0 || _ghostNode$parentNode.removeChild(ghostNode);
					if (moveToGhost !== false) {
						let transf = wrapper(dragDom, opts.useTransform);
						if (direction === "v") transf.moveToY(endY);
						else if (direction === "h") transf.moveToX(endX);
						else transf.moveTo(endX, endY);
					}
				}
			});
		});
	}
	/**
	* @internal
	*/
	onOptionChanged(opts) {
		const droppable = opts.droppable;
		if (!isFunction(droppable)) {
			if (isUndefined(droppable)) opts.droppable = () => {};
			else if (isString(droppable)) opts.droppable = () => document.querySelectorAll(droppable);
			else if (isArrayLike(droppable)) opts.droppable = () => droppable;
			else if (isElement(droppable)) opts.droppable = () => [droppable];
		}
	}
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
//#endregion
//#region src/droppable.ts
/**
* 拖动器
* @author holyhigh2
*/
var Droppables = [];
var CLASS_DROPPABLE = "uii-droppable";
/**
* 用于表示一个或多个可响应拖动元素的定义
* > 可用CSS接口
* - .uii-droppable
* @public
*/
var Droppable = class extends Uii {
	constructor(el, opts) {
		super(el, assign({ watch: true }, opts));
		this.__boundEls = /* @__PURE__ */ new WeakSet();
		Droppables.push(this);
	}
	/**
	* @internal
	*/
	bindEvent(droppable, opts) {
		this.registerEvent(droppable, "mouseenter", (e) => {
			if (!this.__active) return;
			if (this.__active === droppable) return;
			if (opts.hoverClass) each(split(opts.hoverClass, " "), (cls) => {
				droppable.classList.toggle(cls, true);
			});
			if (this.__active.dataset.cursorOver) setCursor(this.__active.dataset.cursorOver);
			opts.onEnter && opts.onEnter({
				draggable: this.__active,
				droppable
			}, e);
		});
		this.registerEvent(droppable, "mouseleave", (e) => {
			if (!this.__active) return;
			if (this.__active === droppable) return;
			if (opts.hoverClass) each(split(opts.hoverClass, " "), (cls) => {
				droppable.classList.toggle(cls, false);
			});
			if (this.__active.dataset.cursorOver) setCursor(this.__active.dataset.cursorActive || "");
			opts.onLeave && opts.onLeave({
				draggable: this.__active,
				droppable
			}, e);
		});
		this.registerEvent(droppable, "mousemove", (e) => {
			if (!this.__active) return;
			if (this.__active === droppable) return;
			opts.onOver && opts.onOver({
				draggable: this.__active,
				droppable
			}, e);
		});
		this.registerEvent(droppable, "mouseup", (e) => {
			if (!this.__active) return;
			if (this.__active === droppable) return;
			if (opts.hoverClass) each(split(opts.hoverClass, " "), (cls) => {
				droppable.classList.toggle(cls, false);
			});
			opts.onDrop && opts.onDrop({
				draggable: this.__active,
				droppable
			}, e);
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
			this.ele = toArray(nodes);
		}
		if (isString(opts.accepts)) valid = !!target.dataset.dropType && test(opts.accepts, target.dataset.dropType);
		else if (isFunction(opts.accepts)) valid = opts.accepts(this.ele, target);
		if (!valid) return;
		this.__active = target;
		if (opts.activeClass) each(this.ele, (el) => {
			each(split(opts.activeClass || "", " "), (cls) => {
				el.classList.toggle(cls, true);
			});
		});
		opts.onActive && opts.onActive({
			draggable: target,
			droppables: this.ele
		});
		each(this.ele, (el) => {
			el.classList.toggle(CLASS_DROPPABLE, true);
			el.style.pointerEvents = "initial";
			if (this.__boundEls.has(el)) return;
			this.__boundEls.add(el);
			this.bindEvent(el, opts);
		});
	}
	/**
	* @internal
	*/
	deactive(target) {
		if (!this.__active) return;
		this.__active = null;
		const opts = this.opts;
		if (opts.activeClass) each(this.ele, (el) => {
			each(split(opts.activeClass || "", " "), (cls) => {
				el.classList.toggle(cls, false);
			});
		});
		opts.onDeactive && opts.onDeactive({
			draggable: target,
			droppables: this.ele
		});
		this.destroy();
	}
};
document.addEventListener("uii-dragactive", (e) => {
	let { target } = e.detail;
	each(Droppables, (dpb) => {
		dpb.active(target);
	});
});
document.addEventListener("uii-dragdeactive", (e) => {
	let { target } = e.detail;
	each(Droppables, (dpb) => {
		dpb.deactive(target);
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
//#endregion
//#region src/rotatable.ts
/**
* dom rotator
* @author holyhigh2
*/
var CLASS_ROTATABLE = "uii-rotatable";
var CLASS_ROTATABLE_HANDLE = "uii-rotatable-handle";
var CLASS_ROTATABLE_ACTIVE = "uii-rotatable-active";
/**
* 用于表示一个或多个可旋转元素的定义
* > 可用CSS接口
* - .uii-rotatable
* - .uii-rotatable-handle
* - .uii-rotatable-active
* @public
*/
var Rotatable = class extends Uii {
	constructor(els, opts) {
		super(els, opts);
		each(this.ele, (el) => {
			let tmp = el;
			if (tmp._uiik_rotatable) {
				tmp._uiik_rotatable.destroy();
				return false;
			}
		});
		each(this.ele, (el) => {
			el._uiik_rotatable = this;
			initHandle(this, el, this.opts);
		});
	}
};
function initHandle(uiik, el, opts) {
	let handleStr = opts.handle;
	let handles;
	if (isString(handleStr)) handles = document.querySelectorAll(handleStr);
	else if (isFunction(handleStr)) handles = handleStr(el);
	if (!handles) {
		console.error("Can not find handles with \"" + el.outerHTML + "\"");
		return;
	}
	each(handles, (h) => {
		var _opts$cursor;
		h.classList.add(CLASS_ROTATABLE_HANDLE);
		h.style.cursor = ((_opts$cursor = opts.cursor) === null || _opts$cursor === void 0 ? void 0 : _opts$cursor.default) || "crosshair";
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
		onPointerStart(function(args) {
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
			startDeg = Math.atan2(startPointXy.y - centerY, startPointXy.x - centerX) * ONE_RAD + 90;
			if (startDeg < 0) startDeg = 360 + startDeg;
			let matrixInfo = getMatrixInfo(el);
			startDeg -= matrixInfo.angle;
			el.classList.toggle(CLASS_ROTATABLE_ACTIVE, true);
			onStart && onStart({
				deg,
				cx: centerX,
				cy: centerY
			}, ev);
		});
		onPointerMove((args) => {
			const { ev, offX, offY } = args;
			let newX = startPointXy.x + offX;
			let newY = startPointXy.y + offY;
			deg = Math.atan2(newY - centerY, newX - centerX) * ONE_RAD + 90 - startDeg;
			onRotate && onRotate({
				deg,
				cx: centerX,
				cy: centerY,
				target: el,
				ox: startOx,
				oy: startOy
			}, ev);
			rotateTo(el, deg, startOx, startOy);
		});
		onPointerEnd((args) => {
			const { ev } = args;
			el.classList.toggle(CLASS_ROTATABLE_ACTIVE, false);
			onEnd && onEnd({ deg }, ev);
		});
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
//#endregion
//#region src/detector.ts
/**
* CollisionDetector
* @author holyhigh2
*/
var CollisionDetector = class {
	constructor(el, targets, opts) {
		this.__targets = targets;
		this.opts = { container: document.body };
		this.opts = assign(this.opts, opts);
		const domEl = isString(el) ? document.querySelector(el) : el;
		if (!domEl) {
			console.error("Invalid selector \"" + el + "\"");
			return;
		}
		const ele = domEl;
		this.el = domEl;
		const offset = getBox(ele, this.opts.container);
		const rect = {
			x: offset.x,
			y: offset.y,
			width: ele.offsetWidth,
			height: ele.offsetHeight
		};
		this.elData = {
			x1: rect.x,
			y1: rect.y,
			x2: rect.x + rect.width,
			y2: rect.y + rect.height
		};
		this.update();
	}
	/**
	* update targets data if them changed
	*/
	update() {
		let targets;
		if (isFunction(this.__targets)) targets = this.__targets();
		else if (isString(this.__targets)) {
			targets = this.opts.container.querySelectorAll(this.__targets);
			targets = reject(targets, (t) => t === this.el);
		} else if (isElement(this.__targets)) targets = [this.__targets];
		else targets = this.__targets;
		this.targetsData = flatMap(targets, (t) => {
			if (!t) return [];
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
		if (x1 && x2 && y1 && y2) elData = {
			x1,
			y1,
			x2,
			y2
		};
		return flatMap(this.targetsData, (td, i) => {
			if (elData.x2 < td.x1 || elData.x1 > td.x2 || elData.y2 < td.y1 || elData.y1 > td.y2) return [];
			return td.el;
		});
	}
	getInclusions(x1, y1, x2, y2) {
		let elData = this.elData;
		if (x1 && x2 && y1 && y2) elData = {
			x1,
			y1,
			x2,
			y2
		};
		return flatMap(this.targetsData, (td, i) => {
			if (elData.x2 >= td.x2 && elData.x1 <= td.x1 && elData.y2 >= td.y2 && elData.y1 <= td.y1) return td.el;
			return [];
		});
	}
};
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
//#endregion
//#region src/selectable.ts
/**
* selector
* @author holyhigh2
*/
var CLASS_SELECTOR = "uii-selector";
var CLASS_SELECTING = "uii-selecting";
var CLASS_SELECTED = "uii-selected";
/**
* 用于表示一个元素选择器的定义
* > 可用CSS接口
* - .uii-selector
* - .uii-selecting
* - .uii-selected
* @public
*/
var Selectable = class extends Uii {
	constructor(container, opts) {
		super(container, assign({
			targets: [],
			scroll: false
		}, opts));
		const domEl = this.ele[0];
		let selector = document.createElement("div");
		if (domEl instanceof SVGElement) selector = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		selector.setAttribute("class", CLASS_SELECTOR);
		selector.style.cssText = `
      position:absolute;
      left:0;top:0;
    `;
		if (this.opts.class) selector.setAttribute("class", selector.getAttribute("class") + " " + this.opts.class);
		else selector.style.cssText += "border:1px dashed #000;stroke:#000;";
		selector.style.display = "none";
		domEl.appendChild(selector);
		this.__detector = newCollisionDetector(selector, this.opts.targets, { container: domEl });
		this.__bindEvent(selector, domEl);
	}
	/**
	*  更新targets
	*/
	updateTargets() {
		this.__detector.update();
	}
	/**
	* @internal
	*/
	__bindEvent(selector, con) {
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
			if (filter) {
				if (isFunction(filter)) {
					if (filter(target)) return true;
				} else if (some(con.querySelectorAll(filter), (el) => el.contains(target))) return true;
			}
			const onPointerDown = opts.onPointerDown;
			if (onPointerDown && onPointerDown(ev) === false) return true;
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
			onPointerStart(function(args) {
				const { ev } = args;
				that.__detector.update();
				if (currentCStyle.position === "static") {
					originPos = con.style.position;
					con.style.position = "relative";
				}
				each(that.__lastSelected, (t) => {
					target.classList.toggle(CLASS_SELECTED, false);
				});
				style.display = "block";
				onStart && onStart({
					selection: that.__lastSelected,
					selectable: con
				}, ev);
			});
			onPointerMove(({ ev, offX, offY }) => {
				let pointX = startPointXy.x + offX;
				let pointY = startPointXy.y + offY;
				if (scroll) {
					const ltX = ev.clientX - currentRect.x;
					const ltY = ev.clientY - currentRect.y;
					const rbX = currentRect.x + currentRect.width - ev.clientX;
					const rbY = currentRect.y + currentRect.height - ev.clientY;
					toLeft = ltX < 5;
					toTop = ltY < 5;
					toRight = rbX < 5;
					toBottom = rbY < 5;
					if (toLeft || toTop || toRight || toBottom) {
						if (!timer) timer = setInterval(() => {
							if (toLeft) con.scrollLeft -= scrollSpeed;
							else if (toRight) con.scrollLeft += scrollSpeed;
							if (toTop) con.scrollTop -= scrollSpeed;
							else if (toBottom) con.scrollTop += scrollSpeed;
						}, 20);
					} else if (timer) {
						clearInterval(timer);
						timer = null;
					}
				}
				let x = hitPosX, y = hitPosY, w = Math.abs(offX), h = Math.abs(offY);
				if (offX > 0 && offY > 0) {
					x1 = hitPosX;
					y1 = hitPosY;
				} else if (offX < 0 && offY < 0) {
					x = x1 = pointX;
					y = y1 = pointY;
				} else if (offX < 0) x = x1 = pointX;
				else if (offY < 0) y = y1 = pointY;
				style.width = w + "px";
				style.height = h + "px";
				style.transform = `translate3d(${x}px,${y}px,0)`;
				if (mode === "overlap") selection = that.__detector.getOverlaps(x1, y1, x1 + w, y1 + h);
				else if (mode === "inclusion") selection = that.__detector.getInclusions(x1, y1, x1 + w, y1 + h);
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
				if (changed && onSelect) onSelect({
					selection,
					selectable: con
				}, ev);
			});
			onPointerEnd((args) => {
				const { ev, currentStyle } = args;
				style.display = "none";
				if (scroll) {
					if (timer) {
						clearInterval(timer);
						timer = null;
					}
				}
				if (originPos) con.style.position = originPos;
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
				that.__lastSelected = selection;
				if (onEnd) onEnd({
					selection,
					selectable: con
				}, ev);
			});
		});
	}
	/**
	* @internal
	*/
	onOptionChanged() {
		this.updateTargets();
	}
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
//#endregion
//#region src/sortable.ts
/**
* sortable
* @author holyhigh2
*/
var SORTABLE_GROUPS = {};
var CLASS_SORTABLE_CONTAINER = "uii-sortable-container";
var CLASS_SORTABLE_GHOST = "uii-sortable-ghost";
var CLASS_SORTABLE_ACTIVE = "uii-sortable-active";
var ATTR_SORTABLE_ACTIVE = "uii-sortable-active";
/**
* 用于表示一类排序容器的定义
* > 可用CSS接口
* - .uii-sortable-container
* - .uii-sortable-ghost
* - .uii-sortable-active
* @public
*/
var Sortable = class extends Uii {
	constructor(container, opts) {
		super(container, merge({
			move: {
				from: true,
				to: true
			},
			scroll: false,
			sort: true
		}, opts));
		if (size(this.ele) > 1 && !this.opts.group) this.opts.group = "uii_sortable_" + alphaId();
		each(this.ele, (el) => {
			el.classList.add(CLASS_SORTABLE_CONTAINER);
			el.style.position = "relative";
			el.style.pointerEvents = "initial";
			bindContainer(this.registerEvent.bind(this), el, this.opts);
		});
		if (this.opts.group) {
			if (!SORTABLE_GROUPS[this.opts.group]) SORTABLE_GROUPS[this.opts.group] = [];
			SORTABLE_GROUPS[this.opts.group].push([this, this.ele]);
		}
	}
	/**
	* 调用active表示移出策略肯定是true | 'copy'
	* @internal
	*/
	active(draggingItem, fromContainer, toContainers, toOpts) {
		var _toOpts$move;
		const moveFrom = (_toOpts$move = toOpts.move) === null || _toOpts$move === void 0 ? void 0 : _toOpts$move.from;
		const acceptFn = isFunction(moveFrom) ? moveFrom : () => !!moveFrom;
		const activableContainers = flatMap(toContainers, (el) => {
			return acceptFn(draggingItem, fromContainer, el) ? el : [];
		});
		each(activableContainers, (el) => {
			el.setAttribute(ATTR_SORTABLE_ACTIVE, "1");
			if (toOpts.activeClass) each(split(toOpts.activeClass || "", " "), (cls) => {
				el.classList.toggle(cls, true);
			});
		});
		this.__removeListenItems = map(activableContainers, (con) => {
			return listenItems(toOpts, con, draggingItem, con.querySelectorAll(":scope > *"));
		});
		toOpts.onActive && toOpts.onActive({
			item: draggingItem,
			from: fromContainer
		});
	}
	/**
	* @internal
	*/
	deactive(draggingItem, fromContainer, toContainers, opts) {
		each(toContainers, (el) => {
			el.removeAttribute(ATTR_SORTABLE_ACTIVE);
			if (opts.activeClass) each(split(opts.activeClass || "", " "), (cls) => {
				el.classList.toggle(cls, false);
			});
		});
		each(this.__removeListenItems, (fn) => {
			fn();
		});
		opts.onDeactive && opts.onDeactive({
			item: draggingItem,
			from: fromContainer
		});
	}
	/**
	* @internal
	*/
	onOptionChanged() {}
};
var NextNodeMap = /* @__PURE__ */ new Map();
var FilteredNodeMap = /* @__PURE__ */ new Map();
var DraggingData = null;
function bindContainer(registerEvent, container, opts) {
	registerEvent(container, "mousedown", (e) => {
		var _opts$move;
		let con = e.currentTarget;
		let t = e.target;
		if (t === con) return;
		const filterStr = opts.filter ? `:not(${opts.filter})` : "";
		const filteredItems = con.querySelectorAll(":scope > *" + filterStr);
		const i = findIndex(opts.handle ? map(filteredItems, (el) => el.querySelector(opts.handle || "")) : toArray(filteredItems), (handle) => handle && handle.contains(t));
		if (i < 0) return;
		const draggingItem = filteredItems[i];
		const ghostContainer = opts.ghostContainer || con;
		const onStart = opts.onStart;
		const onEnd = opts.onEnd;
		const ghostClass = opts.ghostClass;
		const group = opts.group;
		let moveTo = (_opts$move = opts.move) === null || _opts$move === void 0 ? void 0 : _opts$move.to;
		const toCopy = moveTo === "copy";
		const moveMode = (isFunction(moveTo) ? moveTo : () => !!moveTo)(draggingItem, con);
		const sort = opts.sort;
		opts.scroll;
		opts.scrollSpeed;
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
				if (Math.abs(offsetx) > 3 || Math.abs(offsety) > 3) {
					dragging = true;
					ghostNode = draggingItem.cloneNode(true);
					ghostNode.style.opacity = "0.3";
					ghostNode.style.pointerEvents = "none";
					ghostNode.style.position = "fixed";
					ghostNode.style.zIndex = "999";
					ghostNode.style.left = draggingItem.style.left;
					ghostNode.style.top = draggingItem.style.top;
					if (ghostClass) ghostNode.classList.add(...compact(split(ghostClass, " ")));
					ghostNode.classList.toggle(CLASS_SORTABLE_GHOST, true);
					ghostContainer.appendChild(ghostNode);
					if (!toCopy) draggingItem.classList.toggle(CLASS_SORTABLE_ACTIVE, true);
					let copy = void 0;
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
					onStart && onStart({
						item: draggingItem,
						from: con,
						index: i
					}, ev);
					lockPage();
					if (sort) removeListenItems = listenItems(opts, con, toCopy ? copy : draggingItem, filteredItems, i);
					if (moveMode && group && SORTABLE_GROUPS[group]) each(SORTABLE_GROUPS[group], ([sortable, ele]) => {
						const filtered = reject(ele, (el) => el === container);
						if (isEmpty(filtered)) return;
						sortable.active(toCopy ? copy : draggingItem, container, filtered, sortable.getOptions());
					});
				} else {
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
			document.removeEventListener("mousemove", dragListener);
			document.removeEventListener("mouseup", dragEndListener);
			window.removeEventListener("blur", dragEndListener);
			if (dragging) {
				var _DraggingData$copy;
				unlockPage();
				restoreCursor();
				if (ghostNode) ghostContainer.removeChild(ghostNode);
				const toContainer = DraggingData === null || DraggingData === void 0 ? void 0 : DraggingData.toContainer;
				DraggingData === null || DraggingData === void 0 || DraggingData.item.classList.remove(CLASS_SORTABLE_ACTIVE);
				DraggingData === null || DraggingData === void 0 || (_DraggingData$copy = DraggingData.copy) === null || _DraggingData$copy === void 0 || _DraggingData$copy.classList.remove(CLASS_SORTABLE_ACTIVE);
				DraggingData = null;
				if (removeListenItems) removeListenItems();
				if (group && SORTABLE_GROUPS[group]) each(SORTABLE_GROUPS[group], ([sortable, ele]) => {
					const filtered = reject(ele, (el) => el === container);
					if (isEmpty(filtered)) return;
					sortable.deactive(draggingItem, container, filtered, sortable.getOptions());
				});
				onEnd && onEnd({
					item: draggingItem,
					from: container,
					to: toContainer
				}, e);
			}
		};
		document.addEventListener("mousemove", dragListener);
		document.addEventListener("mouseup", dragEndListener);
		window.addEventListener("blur", dragEndListener);
		e.preventDefault();
		return false;
	});
	registerEvent(container, "mouseleave", (e) => {
		if (!DraggingData) return;
		opts.onLeave && opts.onLeave({
			item: DraggingData.item,
			from: DraggingData.fromContainer,
			to: container
		}, e);
		if (DraggingData.moveTo !== "copy") {
			if (DraggingData.spill === "remove") {
				var _DraggingData$item$pa;
				(_DraggingData$item$pa = DraggingData.item.parentElement) === null || _DraggingData$item$pa === void 0 || _DraggingData$item$pa.removeChild(DraggingData.item);
			} else if (DraggingData.spill === "revert") {
				var _DraggingData$item$pa2;
				(_DraggingData$item$pa2 = DraggingData.item.parentElement) === null || _DraggingData$item$pa2 === void 0 || _DraggingData$item$pa2.removeChild(DraggingData.item);
				const nextSibling = NextNodeMap.get(DraggingData.item);
				DraggingData.fromContainer.insertBefore(DraggingData.item, nextSibling);
			}
		}
	});
	registerEvent(container, "mouseenter", (e) => {
		if (!DraggingData) return;
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
		if (offsetX < centerX && offsetY < centerY) dir = "tl";
		else if (offsetX > centerX && offsetY > centerY) dir = "br";
		else if (offsetX < centerX && offsetY > centerY) dir = "bl";
		else if (offsetX > centerX && offsetY < centerY) dir = "tr";
		opts.onEnter && opts.onEnter({
			item: DraggingData.item,
			from: DraggingData.fromContainer,
			to: container,
			dir
		}, e);
		DraggingData.toContainer = container;
		if (container.getAttribute(ATTR_SORTABLE_ACTIVE)) {
			var _opts$move2;
			let valid = true;
			const moveFrom = (_opts$move2 = opts.move) === null || _opts$move2 === void 0 ? void 0 : _opts$move2.from;
			valid = (isFunction(moveFrom) ? moveFrom : () => !!moveFrom)(DraggingData.item, DraggingData.fromContainer, container);
			if (!valid) return;
			if (container.contains(draggingItem)) return;
			if (DraggingData.moveTo === "copy") draggingItem = DraggingData.copy;
			if (draggingItem.parentElement) draggingItem.parentElement.removeChild(draggingItem);
			let toIndex = 0;
			if (dir[0] === "t") container.insertBefore(draggingItem, container.children[0]);
			else {
				container.appendChild(draggingItem);
				toIndex = container.children.length - 1;
			}
			opts.onAdd && opts.onAdd({
				item: draggingItem,
				from: DraggingData.fromContainer,
				to: container,
				index: toIndex
			}, e);
		} else if (container === DraggingData.fromContainer) {
			if (DraggingData.copy) {
				let parent = DraggingData.copy.parentElement;
				if (parent) parent.removeChild(DraggingData === null || DraggingData === void 0 ? void 0 : DraggingData.copy);
			} else {
				if (draggingItem.parentElement) draggingItem.parentElement.removeChild(draggingItem);
				const list = filter(FilteredNodeMap.get(container), (x) => x !== draggingItem);
				if (dir[0] === "t") container.insertBefore(draggingItem, list[0]);
				else if (list.length !== container.children.length) last(list).after(draggingItem);
				else container.appendChild(draggingItem);
			}
		}
	});
}
function listenItems(opts, toContainer, draggingItem, items, fromIndex = 0) {
	const listener = (e) => {
		const ct = e.currentTarget;
		if (ct.style.transform) return;
		const toIndex = ct._uiik_i;
		let draggingItem = (DraggingData === null || DraggingData === void 0 ? void 0 : DraggingData.copy) || (DraggingData === null || DraggingData === void 0 ? void 0 : DraggingData.item);
		if (toContainer === (DraggingData === null || DraggingData === void 0 ? void 0 : DraggingData.fromContainer)) draggingItem = DraggingData === null || DraggingData === void 0 ? void 0 : DraggingData.item;
		let parent = draggingItem.parentElement;
		parent === null || parent === void 0 || parent.removeChild(draggingItem);
		if (!(parent === ct.parentElement)) parent = ct.parentElement;
		const oldIndex = fromIndex;
		if (toIndex > fromIndex) {
			fromIndex = toIndex;
			parent === null || parent === void 0 || parent.insertBefore(draggingItem, ct.nextElementSibling);
		} else {
			fromIndex = toIndex - 1;
			parent === null || parent === void 0 || parent.insertBefore(draggingItem, ct);
		}
		opts.onChange && opts.onChange({
			item: draggingItem,
			from: DraggingData === null || DraggingData === void 0 ? void 0 : DraggingData.fromContainer,
			to: toContainer,
			fromIndex: oldIndex,
			toIndex: fromIndex
		}, e);
		const toPos = {
			x: ct.offsetLeft,
			y: ct.offsetTop
		};
		const fromPos = {
			x: draggingItem.offsetLeft,
			y: draggingItem.offsetTop
		};
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
		if (item === draggingItem) return;
		item.style.pointerEvents = "initial";
		item._uiik_i = i;
		item.addEventListener("mouseenter", listener);
	});
	return () => {
		each(items, (item, i) => {
			if (item === draggingItem) return;
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
//#endregion
//#region package.json
var version = "1.5.0";
var repository = {
	"type": "git",
	"url": "https://github.com/holyhigh2/uiik"
};
//#endregion
//#region src/index.ts
if (!globalThis.welcome) {
	const ssAry = [];
	[
		"102,227,255",
		"59,208,251",
		"67,180,255"
	].forEach((v, i) => {
		const cu = "background:rgb(" + v + ");";
		if (i < 2) ssAry[i] = ssAry[4 - i] = cu;
		else ssAry[i] = "color:#fff;" + cu;
	});
	console.info(`%c %c %c Uiik - UI interactions kit | v${version} %c %c `, ...ssAry, `💎 ${repository.url}`);
	globalThis.welcome = true;
}
var VERSION = version;
var src_default = {
	VERSION: version,
	newSplittable,
	newResizable,
	newDraggable,
	newDroppable,
	newRotatable,
	newSelectable,
	newSortable
};
//#endregion
export { CollisionDetector, DRAGGING_RULE, Draggable, Droppable, EDGE_THRESHOLD, ONE_ANG, ONE_RAD, Resizable, Rotatable, Selectable, Sortable, Splittable, THRESHOLD, UII_KEY, Uii, UiiTransform, VERSION, alignRects, calcVertex, src_default as default, distributeRects, findSnap, fitRectInViewport, getBox, getCenterXy, getCenterXySVG, getMatrixInfo, getPointInContainer, getPointOffset, getRectBottom, getRectCenter, getRectInContainer, getRectRight, getScrollParent, getScrollViewportRect, getStyleSize, getStyleXy, getTranslate, getVertex, isSVGEl, isVisible, lockPage, moveBy, moveTo, newCollisionDetector, newDraggable, newDroppable, newResizable, newRotatable, newSelectable, newSortable, newSplittable, normalizeVector, panBy, parseOxy, rectCenter, rectContains, rectInset, rectsOverlap, resizeRect, restoreCursor, rotateTo, saveCursor, setCursor, snapGuides, snapToGrid, transformMoveTo, unionRect, unlockPage, wrapper, zoomAt };
