// \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t, t.exports), e = null), t.exports), s = (e, n) => {
	let r = Object.setPrototypeOf({}, null);
	for (var i in e) t(r, i, {
		get: e[i],
		enumerable: !0
	});
	return n & 1 || t(r, Symbol.toStringTag, { value: "Module" }), n & 2 ? r : Object.preventExtensions(r);
}, c = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, l = (n, r, o) => (o = n == null ? {} : e(i(n)), c(r || !n || !n.__esModule || !a.call(n, "default") ? t(o, "default", {
	value: n,
	enumerable: !0
}) : o, n)), u = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), o = Symbol.for("react.consumer"), s = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), l = Symbol.for("react.suspense"), u = Symbol.for("react.memo"), d = Symbol.for("react.lazy"), f = Symbol.for("react.activity"), p = Symbol.for("react.view_transition"), m = Symbol.iterator;
	function h(e) {
		return typeof e != "object" || !e ? null : (e = m && e[m] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var g = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	}, _ = Object.assign, v = {};
	function y(e, t, n) {
		this.props = e, this.context = t, this.refs = v, this.updater = n || g;
	}
	y.prototype.isReactComponent = {}, y.prototype.setState = function(e, t) {
		if (typeof e != "object" && typeof e != "function" && e != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, e, t, "setState");
	}, y.prototype.forceUpdate = function(e) {
		this.updater.enqueueForceUpdate(this, e, "forceUpdate");
	};
	function b() {}
	b.prototype = y.prototype;
	function x(e, t, n) {
		this.props = e, this.context = t, this.refs = v, this.updater = n || g;
	}
	var S = x.prototype = new b();
	S.constructor = x, _(S, y.prototype), S.isPureReactComponent = !0;
	var C = Array.isArray;
	function w() {}
	var T = {
		H: null,
		A: null,
		T: null,
		S: null
	}, E = Object.prototype.hasOwnProperty;
	function D(e, n, r) {
		var i = r.ref;
		return {
			$$typeof: t,
			type: e,
			key: n,
			ref: i === void 0 ? null : i,
			props: r
		};
	}
	function O(e, t) {
		return D(e.type, t, e.props);
	}
	function k(e) {
		return typeof e == "object" && !!e && e.$$typeof === t;
	}
	function ee(e) {
		var t = {
			"=": "=0",
			":": "=2"
		};
		return "$" + e.replace(/[=:]/g, function(e) {
			return t[e];
		});
	}
	var te = /\/+/g;
	function A(e, t) {
		return typeof e == "object" && e && e.key != null ? ee("" + e.key) : t.toString(36);
	}
	function j(e) {
		switch (e.status) {
			case "fulfilled": return e.value;
			case "rejected": throw e.reason;
			default: switch (typeof e.status == "string" ? e.then(w, w) : (e.status = "pending", e.then(function(t) {
				e.status === "pending" && (e.status = "fulfilled", e.value = t);
			}, function(t) {
				e.status === "pending" && (e.status = "rejected", e.reason = t);
			})), e.status) {
				case "fulfilled": return e.value;
				case "rejected": throw e.reason;
			}
		}
		throw e;
	}
	function ne(e, r, i, a, o) {
		var s = typeof e;
		(s === "undefined" || s === "boolean") && (e = null);
		var c = !1;
		if (e === null) c = !0;
		else switch (s) {
			case "bigint":
			case "string":
			case "number":
				c = !0;
				break;
			case "object": switch (e.$$typeof) {
				case t:
				case n:
					c = !0;
					break;
				case d: return c = e._init, ne(c(e._payload), r, i, a, o);
			}
		}
		if (c) return o = o(e), c = a === "" ? "." + A(e, 0) : a, C(o) ? (i = "", c != null && (i = c.replace(te, "$&/") + "/"), ne(o, r, i, "", function(e) {
			return e;
		})) : o != null && (k(o) && (o = O(o, i + (o.key == null || e && e.key === o.key ? "" : ("" + o.key).replace(te, "$&/") + "/") + c)), r.push(o)), 1;
		c = 0;
		var l = a === "" ? "." : a + ":";
		if (C(e)) for (var u = 0; u < e.length; u++) a = e[u], s = l + A(a, u), c += ne(a, r, i, s, o);
		else if (u = h(e), typeof u == "function") for (e = u.call(e), u = 0; !(a = e.next()).done;) a = a.value, s = l + A(a, u++), c += ne(a, r, i, s, o);
		else if (s === "object") {
			if (typeof e.then == "function") return ne(j(e), r, i, a, o);
			throw r = String(e), Error("Objects are not valid as a React child (found: " + (r === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : r) + "). If you meant to render a collection of children, use an array instead.");
		}
		return c;
	}
	function re(e, t, n) {
		if (e == null) return e;
		var r = [], i = 0;
		return ne(e, r, "", "", function(e) {
			return t.call(n, e, i++);
		}), r;
	}
	function M(e) {
		if (e._status === -1) {
			var t = (0, e._result)();
			t.then(function(n) {
				(e._status === 0 || e._status === -1) && (e._status = 1, e._result = n, t.status === void 0 && (t.status = "fulfilled", t.value = n));
			}, function(n) {
				(e._status === 0 || e._status === -1) && (e._status = 2, e._result = n, t.status === void 0 && (t.status = "rejected", t.reason = n));
			}), e._status === -1 && (e._status = 0, e._result = t);
		}
		if (e._status === 1) return e._result.default;
		throw e._result;
	}
	var ie = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	};
	function ae(e) {
		var t = T.T, n = {};
		n.types = t === null ? null : t.types, T.T = n;
		try {
			var r = e(), i = T.S;
			i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && r.then(w, ie);
		} catch (e) {
			ie(e);
		} finally {
			t !== null && n.types !== null && (t.types = n.types), T.T = t;
		}
	}
	function oe(e) {
		var t = T.T;
		if (t !== null) {
			var n = t.types;
			n === null ? t.types = [e] : n.indexOf(e) === -1 && n.push(e);
		} else ae(oe.bind(null, e));
	}
	var se = {
		map: re,
		forEach: function(e, t, n) {
			re(e, function() {
				t.apply(this, arguments);
			}, n);
		},
		count: function(e) {
			var t = 0;
			return re(e, function() {
				t++;
			}), t;
		},
		toArray: function(e) {
			return re(e, function(e) {
				return e;
			}) || [];
		},
		only: function(e) {
			if (!k(e)) throw Error("React.Children.only expected to receive a single React element child.");
			return e;
		}
	};
	e.Activity = f, e.Children = se, e.Component = y, e.Fragment = r, e.Profiler = a, e.PureComponent = x, e.StrictMode = i, e.Suspense = l, e.ViewTransition = p, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = T, e.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(e) {
			return T.H.useMemoCache(e);
		}
	}, e.addTransitionType = oe, e.cache = function(e) {
		return function() {
			return e.apply(null, arguments);
		};
	}, e.cacheSignal = function() {
		return null;
	}, e.cloneElement = function(e, t, n) {
		if (e == null) throw Error("The argument must be a React element, but you passed " + e + ".");
		var r = _({}, e.props), i = e.key;
		if (t != null) for (a in t.key !== void 0 && (i = "" + t.key), t) !E.call(t, a) || a === "key" || a === "__self" || a === "__source" || a === "ref" && t.ref === void 0 || (r[a] = t[a]);
		var a = arguments.length - 2;
		if (a === 1) r.children = n;
		else if (1 < a) {
			for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
			r.children = o;
		}
		return D(e.type, i, r);
	}, e.createContext = function(e) {
		return e = {
			$$typeof: s,
			_currentValue: e,
			_currentValue2: e,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		}, e.Provider = e, e.Consumer = {
			$$typeof: o,
			_context: e
		}, e;
	}, e.createElement = function(e, t, n) {
		var r, i = {}, a = null;
		if (t != null) for (r in t.key !== void 0 && (a = "" + t.key), t) E.call(t, r) && r !== "key" && r !== "__self" && r !== "__source" && (i[r] = t[r]);
		var o = arguments.length - 2;
		if (o === 1) i.children = n;
		else if (1 < o) {
			for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
			i.children = s;
		}
		if (e && e.defaultProps) for (r in o = e.defaultProps, o) i[r] === void 0 && (i[r] = o[r]);
		return D(e, a, i);
	}, e.createRef = function() {
		return { current: null };
	}, e.forwardRef = function(e) {
		return {
			$$typeof: c,
			render: e
		};
	}, e.isValidElement = k, e.lazy = function(e) {
		return {
			$$typeof: d,
			_payload: {
				_status: -1,
				_result: e
			},
			_init: M
		};
	}, e.memo = function(e, t) {
		return {
			$$typeof: u,
			type: e,
			compare: t === void 0 ? null : t
		};
	}, e.startTransition = ae, e.unstable_useCacheRefresh = function() {
		return T.H.useCacheRefresh();
	}, e.use = function(e) {
		return T.H.use(e);
	}, e.useActionState = function(e, t, n) {
		return T.H.useActionState(e, t, n);
	}, e.useCallback = function(e, t) {
		return T.H.useCallback(e, t);
	}, e.useContext = function(e) {
		return T.H.useContext(e);
	}, e.useDebugValue = function() {}, e.useDeferredValue = function(e, t) {
		return T.H.useDeferredValue(e, t);
	}, e.useEffect = function(e, t) {
		return T.H.useEffect(e, t);
	}, e.useEffectEvent = function(e) {
		return T.H.useEffectEvent(e);
	}, e.useId = function() {
		return T.H.useId();
	}, e.useImperativeHandle = function(e, t, n) {
		return T.H.useImperativeHandle(e, t, n);
	}, e.useInsertionEffect = function(e, t) {
		return T.H.useInsertionEffect(e, t);
	}, e.useLayoutEffect = function(e, t) {
		return T.H.useLayoutEffect(e, t);
	}, e.useMemo = function(e, t) {
		return T.H.useMemo(e, t);
	}, e.useOptimistic = function(e, t) {
		return T.H.useOptimistic(e, t);
	}, e.useReducer = function(e, t, n) {
		return T.H.useReducer(e, t, n);
	}, e.useRef = function(e) {
		return T.H.useRef(e);
	}, e.useState = function(e) {
		return T.H.useState(e);
	}, e.useSyncExternalStore = function(e, t, n) {
		return T.H.useSyncExternalStore(e, t, n);
	}, e.useTransition = function() {
		return T.H.useTransition();
	}, e.version = "19.3.1";
})), d = /* @__PURE__ */ o(((e, t) => {
	t.exports = u();
})), f = /* @__PURE__ */ o(((e) => {
	function t(e, t) {
		var n = e.length;
		for (e.push(t); 0 < n;) {
			var r = n - 1 >>> 1, a = e[r];
			if (0 < i(a, t)) e[r] = t, e[n] = a, n = r;
			else break;
		}
	}
	function n(e) {
		return e.length === 0 ? null : e[0];
	}
	function r(e) {
		if (e.length === 0) return null;
		var t = e[0], n = e.pop();
		if (n !== t) {
			e[0] = n;
			for (var r = 0, a = e.length, o = a >>> 1; r < o;) {
				var s = 2 * (r + 1) - 1, c = e[s], l = s + 1, u = e[l];
				if (0 > i(c, n)) l < a && 0 > i(u, c) ? (e[r] = u, e[l] = n, r = l) : (e[r] = c, e[s] = n, r = s);
				else if (l < a && 0 > i(u, n)) e[r] = u, e[l] = n, r = l;
				else break;
			}
		}
		return t;
	}
	function i(e, t) {
		var n = e.sortIndex - t.sortIndex;
		return n === 0 ? e.id - t.id : n;
	}
	if (e.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
		var a = performance;
		e.unstable_now = function() {
			return a.now();
		};
	} else {
		var o = Date, s = o.now();
		e.unstable_now = function() {
			return o.now() - s;
		};
	}
	var c = [], l = [], u = 1, d = null, f = 3, p = !1, m = !1, h = !1, g = !1, _ = typeof setTimeout == "function" ? setTimeout : null, v = typeof clearTimeout == "function" ? clearTimeout : null, y = typeof setImmediate < "u" ? setImmediate : null;
	function b(e) {
		for (var i = n(l); i !== null;) {
			if (i.callback === null) r(l);
			else if (i.startTime <= e) r(l), i.sortIndex = i.expirationTime, t(c, i);
			else break;
			i = n(l);
		}
	}
	function x(e) {
		if (h = !1, b(e), !m) {
			if (n(c) !== null) m = !0, S || (S = !0, O());
			else {
				var t = n(l);
				t !== null && te(x, t.startTime - e);
			}
		}
	}
	var S = !1, C = -1, w = 5, T = -1;
	function E() {
		return g ? !0 : !(e.unstable_now() - T < w);
	}
	function D() {
		if (g = !1, S) {
			var t = e.unstable_now();
			T = t;
			var i = !0;
			try {
				e: {
					m = !1, h && (h = !1, v(C), C = -1), p = !0;
					var a = f;
					try {
						t: {
							for (b(t), d = n(c); d !== null && !(d.expirationTime > t && E());) {
								var o = d.callback;
								if (typeof o == "function") {
									d.callback = null, f = d.priorityLevel;
									var s = o(d.expirationTime <= t);
									if (t = e.unstable_now(), typeof s == "function") {
										d.callback = s, b(t), i = !0;
										break t;
									}
									d === n(c) && r(c), b(t);
								} else r(c);
								d = n(c);
							}
							if (d !== null) i = !0;
							else {
								var u = n(l);
								u !== null && te(x, u.startTime - t), i = !1;
							}
						}
						break e;
					} finally {
						d = null, f = a, p = !1;
					}
					i = void 0;
				}
			} finally {
				i ? O() : S = !1;
			}
		}
	}
	var O;
	if (typeof y == "function") O = function() {
		y(D);
	};
	else if (typeof MessageChannel < "u") {
		var k = new MessageChannel(), ee = k.port2;
		k.port1.onmessage = D, O = function() {
			ee.postMessage(null);
		};
	} else O = function() {
		_(D, 0);
	};
	function te(t, n) {
		C = _(function() {
			t(e.unstable_now());
		}, n);
	}
	e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(e) {
		e.callback = null;
	}, e.unstable_forceFrameRate = function(e) {
		0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : w = 0 < e ? Math.floor(1e3 / e) : 5;
	}, e.unstable_getCurrentPriorityLevel = function() {
		return f;
	}, e.unstable_next = function(e) {
		switch (f) {
			case 1:
			case 2:
			case 3:
				var t = 3;
				break;
			default: t = f;
		}
		var n = f;
		f = t;
		try {
			return e();
		} finally {
			f = n;
		}
	}, e.unstable_requestPaint = function() {
		g = !0;
	}, e.unstable_runWithPriority = function(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5: break;
			default: e = 3;
		}
		var n = f;
		f = e;
		try {
			return t();
		} finally {
			f = n;
		}
	}, e.unstable_scheduleCallback = function(r, i, a) {
		var o = e.unstable_now();
		switch (typeof a == "object" && a ? (a = a.delay, a = typeof a == "number" && 0 < a ? o + a : o) : a = o, r) {
			case 1:
				var s = -1;
				break;
			case 2:
				s = 250;
				break;
			case 5:
				s = 0x3fffffff;
				break;
			case 4:
				s = 1e4;
				break;
			default: s = 5e3;
		}
		return s = a + s, r = {
			id: u++,
			callback: i,
			priorityLevel: r,
			startTime: a,
			expirationTime: s,
			sortIndex: -1
		}, a > o ? (r.sortIndex = a, t(l, r), n(c) === null && r === n(l) && (h ? (v(C), C = -1) : h = !0, te(x, a - o))) : (r.sortIndex = s, t(c, r), m || p || (m = !0, S || (S = !0, O()))), r;
	}, e.unstable_shouldYield = E, e.unstable_wrapCallback = function(e) {
		var t = f;
		return function() {
			var n = f;
			f = t;
			try {
				return e.apply(this, arguments);
			} finally {
				f = n;
			}
		};
	};
})), p = /* @__PURE__ */ o(((e, t) => {
	t.exports = f();
})), m = /* @__PURE__ */ o(((e) => {
	var t = d();
	function n(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function r() {}
	var i = {
		d: {
			f: r,
			r: function() {
				throw Error(n(522));
			},
			D: r,
			C: r,
			L: r,
			m: r,
			X: r,
			S: r,
			M: r
		},
		p: 0,
		findDOMNode: null
	}, a = Symbol.for("react.portal"), o = Symbol.for("react.recoverable"), s = Symbol.for("react.optimistic_key");
	function c(e, t, n) {
		var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
		return {
			$$typeof: a,
			key: r == null ? null : r === s ? s : "" + r,
			children: e,
			containerInfo: t,
			implementation: n
		};
	}
	var l = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function u(e, t) {
		if (e === "font") return "";
		if (typeof t == "string") return t === "use-credentials" ? t : "";
	}
	e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = i, e.browser = function(e) {
		return {
			$$typeof: o,
			_reason: e
		};
	}, e.createPortal = function(e, t) {
		var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
		if (!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11) throw Error(n(299));
		return c(e, t, null, r);
	}, e.flushSync = function(e) {
		var t = l.T, n = i.p;
		try {
			if (l.T = null, i.p = 2, e) return e();
		} finally {
			l.T = t, i.p = n, i.d.f();
		}
	}, e.preconnect = function(e, t) {
		typeof e == "string" && (t ? (t = t.crossOrigin, t = typeof t == "string" ? t === "use-credentials" ? t : "" : void 0) : t = null, i.d.C(e, t));
	}, e.prefetchDNS = function(e) {
		typeof e == "string" && i.d.D(e);
	}, e.preinit = function(e, t) {
		if (typeof e == "string" && t && typeof t.as == "string") {
			var n = t.as, r = u(n, t.crossOrigin), a = typeof t.integrity == "string" ? t.integrity : void 0, o = typeof t.fetchPriority == "string" ? t.fetchPriority : void 0;
			n === "style" ? i.d.S(e, typeof t.precedence == "string" ? t.precedence : void 0, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o
			}) : n === "script" && i.d.X(e, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0
			});
		}
	}, e.preinitModule = function(e, t) {
		if (typeof e == "string") {
			if (typeof t == "object" && t) {
				if (t.as == null || t.as === "script") {
					var n = u(t.as, t.crossOrigin);
					i.d.M(e, {
						crossOrigin: n,
						integrity: typeof t.integrity == "string" ? t.integrity : void 0,
						nonce: typeof t.nonce == "string" ? t.nonce : void 0,
						fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0
					});
				}
			} else t ?? i.d.M(e);
		}
	}, e.preload = function(e, t) {
		if (typeof e == "string" && typeof t == "object" && t && typeof t.as == "string") {
			var n = t.as, r = u(n, t.crossOrigin);
			i.d.L(e, n, {
				crossOrigin: r,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0,
				type: typeof t.type == "string" ? t.type : void 0,
				fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0,
				referrerPolicy: typeof t.referrerPolicy == "string" ? t.referrerPolicy : void 0,
				imageSrcSet: typeof t.imageSrcSet == "string" ? t.imageSrcSet : void 0,
				imageSizes: typeof t.imageSizes == "string" ? t.imageSizes : void 0,
				media: typeof t.media == "string" ? t.media : void 0
			});
		}
	}, e.preloadModule = function(e, t) {
		if (typeof e == "string") {
			if (t) {
				var n = u(t.as, t.crossOrigin);
				i.d.m(e, {
					as: typeof t.as == "string" && t.as !== "script" ? t.as : void 0,
					crossOrigin: n,
					integrity: typeof t.integrity == "string" ? t.integrity : void 0,
					nonce: typeof t.nonce == "string" ? t.nonce : void 0,
					fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0
				});
			} else i.d.m(e);
		}
	}, e.requestFormReset = function(e) {
		i.d.r(e);
	}, e.unstable_batchedUpdates = function(e, t) {
		return e(t);
	}, e.useFormState = function(e, t, n) {
		return l.H.useFormState(e, t, n);
	}, e.useFormStatus = function() {
		return l.H.useHostTransitionStatus();
	}, e.version = "19.3.1";
})), h = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == "function") try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = m();
})), g = /* @__PURE__ */ o(((e) => {
	var t = p(), n = d(), r = h();
	function i(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function a(e) {
		return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
	}
	function o(e) {
		for (var t = e, n = t; n && !n.alternate;) t = n, t.flags & 4098 && (e = t.return), n = t.return;
		for (; t.return;) t = t.return;
		return t.tag === 3 ? e : null;
	}
	function s(e) {
		if (e.tag === 13) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function c(e) {
		if (e.tag === 31) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function l(e) {
		if (o(e) !== e) throw Error(i(188));
	}
	function u(e) {
		var t = e.alternate;
		if (!t) {
			if (t = o(e), t === null) throw Error(i(188));
			return t === e ? e : null;
		}
		for (var n = e, r = t;;) {
			var a = n.return;
			if (a === null) break;
			var s = a.alternate;
			if (s === null) {
				if (r = a.return, r !== null) {
					n = r;
					continue;
				}
				break;
			}
			if (a.child === s.child) {
				for (s = a.child; s;) {
					if (s === n) return l(a), e;
					if (s === r) return l(a), t;
					s = s.sibling;
				}
				throw Error(i(188));
			}
			if (n.return !== r.return) n = a, r = s;
			else {
				for (var c = !1, u = a.child; u;) {
					if (u === n) {
						c = !0, n = a, r = s;
						break;
					}
					if (u === r) {
						c = !0, r = a, n = s;
						break;
					}
					u = u.sibling;
				}
				if (!c) {
					for (u = s.child; u;) {
						if (u === n) {
							c = !0, n = s, r = a;
							break;
						}
						if (u === r) {
							c = !0, r = s, n = a;
							break;
						}
						u = u.sibling;
					}
					if (!c) throw Error(i(189));
				}
			}
			if (n.alternate !== r) throw Error(i(190));
		}
		if (n.tag !== 3) throw Error(i(188));
		return n.stateNode.current === n ? e : t;
	}
	function f(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e;
		for (e = e.child; e !== null;) {
			if (t = f(e), t !== null) return t;
			e = e.sibling;
		}
		return null;
	}
	function m(e, t, n, r, i, a) {
		for (; e !== null;) {
			if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && n(e, r, i, a) || (e.tag !== 22 || e.memoizedState === null) && (t || e.tag !== 5 && e.tag !== 27) && m(e.child, t, n, r, i, a)) return !0;
			e = e.sibling;
		}
		return !1;
	}
	function g(e) {
		for (e = e.return; e !== null;) {
			if (e.tag === 3 || e.tag === 5 || e.tag === 27) return e;
			e = e.return;
		}
		return null;
	}
	function _(e) {
		var t = !1;
		for (e = e.return; e !== null && (e.tag === 4 && (t = !0), e.tag !== 3 && e.tag !== 5 && e.tag !== 27);) e = e.return;
		return t;
	}
	function v(e) {
		var t = [null, null], n = g(e);
		return n === null || y(t, e, n.child, { foundSelf: !1 }), t;
	}
	function y(e, t, n, r) {
		for (; n !== null;) {
			if (n === t) r.foundSelf = !0;
			else if (n.tag === 5 || n.tag === 27 || n.tag === 6) {
				if (r.foundSelf) return e[1] = n, !0;
				e[0] = n;
			} else if ((n.tag !== 22 || n.memoizedState === null) && y(e, t, n.child, r)) return !0;
			n = n.sibling;
		}
		return !1;
	}
	function b(e) {
		switch (e.tag) {
			case 5:
			case 27:
			case 6: return e.stateNode;
			case 3: return e.stateNode.containerInfo;
			default: throw Error(i(559));
		}
	}
	var x = null, S = null;
	function C(e, t, n) {
		return e === n || e === t && (x = e, !0);
	}
	function w(e, t, n) {
		return e === n ? (S = e, !1) : e === t && (S !== null && (x = e), !0);
	}
	function T(e) {
		if (e === null) return null;
		do
			e = e === null ? null : e.return;
		while (e && e.tag !== 5 && e.tag !== 27 && e.tag !== 3);
		return e || null;
	}
	function E(e, t, n) {
		for (var r = 0, i = e; i; i = n(i)) r++;
		i = 0;
		for (var a = t; a; a = n(a)) i++;
		for (; 0 < r - i;) e = n(e), r--;
		for (; 0 < i - r;) t = n(t), i--;
		for (; r--;) {
			if (e === t || t !== null && e === t.alternate) return e;
			e = n(e), t = n(t);
		}
		return null;
	}
	var D = Object.assign, O = Symbol.for("react.element"), k = Symbol.for("react.transitional.element"), ee = Symbol.for("react.portal"), te = Symbol.for("react.fragment"), A = Symbol.for("react.strict_mode"), j = Symbol.for("react.profiler"), ne = Symbol.for("react.consumer"), re = Symbol.for("react.context"), M = Symbol.for("react.forward_ref"), ie = Symbol.for("react.suspense"), ae = Symbol.for("react.suspense_list"), oe = Symbol.for("react.memo"), se = Symbol.for("react.lazy"), ce = Symbol.for("react.activity"), le = Symbol.for("react.legacy_hidden"), ue = Symbol.for("react.memo_cache_sentinel"), de = Symbol.for("react.view_transition"), fe = Symbol.for("react.recoverable"), pe = Symbol.iterator;
	function me(e) {
		return typeof e != "object" || !e ? null : (e = pe && e[pe] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var he = Symbol.for("react.client.reference");
	function ge(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === he ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case te: return "Fragment";
			case j: return "Profiler";
			case A: return "StrictMode";
			case ie: return "Suspense";
			case ae: return "SuspenseList";
			case ce: return "Activity";
			case de: return "ViewTransition";
		}
		if (typeof e == "object") switch (e.$$typeof) {
			case ee: return "Portal";
			case re: return e.displayName || "Context";
			case ne: return (e._context.displayName || "Context") + ".Consumer";
			case M:
				var t = e.render;
				return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
			case oe: return t = e.displayName || null, t === null ? ge(e.type) || "Memo" : t;
			case se:
				t = e._payload, e = e._init;
				try {
					return ge(e(t));
				} catch {}
		}
		return null;
	}
	var _e = Array.isArray, N = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, ve = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, ye = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, be = [], xe = -1;
	function P(e) {
		return { current: e };
	}
	function Se(e) {
		0 > xe || (e.current = be[xe], be[xe] = null, xe--);
	}
	function Ce(e, t) {
		xe++, be[xe] = e.current, e.current = t;
	}
	var we = P(null), Te = P(null), F = P(null), Ee = P(null);
	function De(e, t) {
		switch (Ce(F, t), Ce(Te, e), Ce(we, null), t.nodeType) {
			case 9:
			case 11:
				e = (e = t.documentElement) && (e = e.namespaceURI) ? fp(e) : 0;
				break;
			default: if (e = t.tagName, t = t.namespaceURI) t = fp(t), e = pp(t, e);
			else switch (e) {
				case "svg":
					e = 1;
					break;
				case "math":
					e = 2;
					break;
				default: e = 0;
			}
		}
		Se(we), Ce(we, e);
	}
	function Oe() {
		Se(we), Se(Te), Se(F);
	}
	function ke(e) {
		var t = e.memoizedState;
		t !== null && (ch._currentValue = t.memoizedState, Ce(Ee, e)), t = we.current;
		var n = pp(t, e.type);
		t !== n && (Ce(Te, e), Ce(we, n));
	}
	function I(e) {
		Te.current === e && (Se(we), Se(Te)), Ee.current === e && (Se(Ee), ch._currentValue = ye);
	}
	var Ae, je;
	function Me(e) {
		if (Ae === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			Ae = t && t[1] || "", je = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + Ae + e + je;
	}
	var Ne = !1;
	function Pe(e, t) {
		if (!e || Ne) return "";
		Ne = !0;
		var n = Error.prepareStackTrace;
		Error.prepareStackTrace = void 0;
		try {
			var r = { DetermineComponentFrameRoot: function() {
				try {
					if (t) {
						var n = function() {
							throw Error();
						};
						if (Object.defineProperty(n.prototype, "props", { set: function() {
							throw Error();
						} }), typeof Reflect == "object" && Reflect.construct) {
							try {
								Reflect.construct(n, []);
							} catch (e) {
								var r = e;
							}
							Reflect.construct(e, [], n);
						} else {
							try {
								n.call();
							} catch (e) {
								r = e;
							}
							n = !1;
							try {
								var i = Object.getOwnPropertyDescriptor(e.prototype, "props");
								Object.defineProperty(e.prototype, "props", {
									configurable: !0,
									set: function() {
										throw Error();
									}
								}), n = !0, new e();
							} finally {
								n && (i === void 0 ? delete e.prototype.props : Object.defineProperty(e.prototype, "props", i));
							}
						}
					} else {
						try {
							throw Error();
						} catch (e) {
							r = e;
						}
						(n = e()) && typeof n.catch == "function" && n.catch(function() {});
					}
				} catch (e) {
					if (e && r && typeof e.stack == "string") return [e.stack, r.stack];
				}
				return [null, null];
			} };
			r.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
			var i = Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot, "name");
			i && i.configurable && Object.defineProperty(r.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
			var a = r.DetermineComponentFrameRoot(), o = a[0], s = a[1];
			if (o && s) {
				var c = o.split("\n"), l = s.split("\n");
				for (i = r = 0; r < c.length && !c[r].includes("DetermineComponentFrameRoot");) r++;
				for (; i < l.length && !l[i].includes("DetermineComponentFrameRoot");) i++;
				if (r === c.length || i === l.length) for (r = c.length - 1, i = l.length - 1; 1 <= r && 0 <= i && c[r] !== l[i];) i--;
				for (; 1 <= r && 0 <= i; r--, i--) if (c[r] !== l[i]) {
					if (r !== 1 || i !== 1) do
						if (r--, i--, 0 > i || c[r] !== l[i]) {
							var u = "\n" + c[r].replace(" at new ", " at ");
							return e.displayName && u.includes("<anonymous>") && (u = u.replace("<anonymous>", e.displayName)), u;
						}
					while (1 <= r && 0 <= i);
					break;
				}
			}
		} finally {
			Ne = !1, Error.prepareStackTrace = n;
		}
		return (n = e ? e.displayName || e.name : "") ? Me(n) : "";
	}
	function Fe(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5: return Me(e.type);
			case 16: return Me("Lazy");
			case 13: return e.child !== t && t !== null ? Me("Suspense Fallback") : Me("Suspense");
			case 19: return Me("SuspenseList");
			case 0:
			case 15: return Pe(e.type, !1);
			case 11: return Pe(e.type.render, !1);
			case 1: return Pe(e.type, !0);
			case 31: return Me("Activity");
			case 30: return Me("ViewTransition");
			default: return "";
		}
	}
	function Ie(e) {
		try {
			var t = "", n = null;
			do
				t += Fe(e, n), n = e, e = e.return;
			while (e);
			return t;
		} catch (e) {
			return "\nError generating stack: " + e.message + "\n" + e.stack;
		}
	}
	var Le = Object.prototype.hasOwnProperty, Re = t.unstable_scheduleCallback, ze = t.unstable_cancelCallback, Be = t.unstable_shouldYield, Ve = t.unstable_requestPaint, He = t.unstable_now, Ue = t.unstable_getCurrentPriorityLevel, We = t.unstable_ImmediatePriority, Ge = t.unstable_UserBlockingPriority, Ke = t.unstable_NormalPriority, qe = t.unstable_LowPriority, Je = t.unstable_IdlePriority, Ye = t.log, Xe = t.unstable_setDisableYieldValue, Ze = null, Qe = null;
	function $e(e) {
		if (typeof Ye == "function" && Xe(e), Qe && typeof Qe.setStrictMode == "function") try {
			Qe.setStrictMode(Ze, e);
		} catch {}
	}
	var et = Math.clz32 ? Math.clz32 : rt, tt = Math.log, nt = Math.LN2;
	function rt(e) {
		return e >>>= 0, e === 0 ? 32 : 31 - (tt(e) / nt | 0) | 0;
	}
	var it = 256, at = 262144, ot = 4194304;
	function st(e) {
		var t = e & 42;
		if (t !== 0) return t;
		switch (e & -e) {
			case 1: return 1;
			case 2: return 2;
			case 4: return 4;
			case 8: return 8;
			case 16: return 16;
			case 32: return 32;
			case 64: return 64;
			case 128: return 128;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072: return e & -e;
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return e & 3932160;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return e & 62914560;
			case 67108864: return 67108864;
			case 0x8000000: return 0x8000000;
			case 268435456: return 268435456;
			case 536870912: return 536870912;
			case 0x40000000: return 0;
			default: return e;
		}
	}
	function ct(e, t, n) {
		var r = e.pendingLanes;
		if (r === 0) return 0;
		var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
		e = e.warmLanes;
		var s = r & 0x7ffffff;
		return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = st(n))) : i = st(o) : i = st(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = st(n))) : i = st(o)) : i = st(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
	}
	function lt(e, t) {
		return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
	}
	function ut(e, t) {
		t & 8 && (t |= t & 32);
		var n = e.entangledLanes;
		if (n !== 0) for (e = e.entanglements, n &= t; 0 < n;) {
			var r = 31 - et(n), i = 1 << r;
			t |= e[r], n &= ~i;
		}
		return t;
	}
	function dt(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 4:
			case 8:
			case 64: return t + 250;
			case 16:
			case 32:
			case 128:
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return t + 5e3;
			default: return -1;
		}
	}
	function ft() {
		var e = ot;
		return ot <<= 1, !(ot & 62914560) && (ot = 4194304), e;
	}
	function pt(e) {
		for (var t = [], n = 0; 31 > n; n++) t.push(e);
		return t;
	}
	function mt(e, t) {
		e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
	}
	function ht(e, t, n, r, i, a) {
		var o = e.pendingLanes;
		e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
		var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
		for (n = o & ~n; 0 < n;) {
			var u = 31 - et(n), d = 1 << u;
			s[u] = 0, c[u] = -1;
			var f = l[u];
			if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
				var p = f[u];
				p !== null && (p.lane &= -536870913);
			}
			n &= ~d;
		}
		r !== 0 && gt(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
	}
	function gt(e, t, n) {
		e.pendingLanes |= t, e.suspendedLanes &= ~t;
		var r = 31 - et(t);
		e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 0x40000000 | n & 261930;
	}
	function _t(e, t) {
		var n = e.entangledLanes |= t;
		for (e = e.entanglements; n;) {
			var r = 31 - et(n), i = 1 << r;
			i & t | e[r] & t && (e[r] |= t), n &= ~i;
		}
	}
	function vt(e, t) {
		var n = t & -t;
		return n = n & 42 ? 1 : yt(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
	}
	function yt(e) {
		switch (e) {
			case 2:
				e = 1;
				break;
			case 8:
				e = 4;
				break;
			case 32:
				e = 16;
				break;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				e = 128;
				break;
			case 268435456:
				e = 0x8000000;
				break;
			default: e = 0;
		}
		return e;
	}
	function bt(e) {
		return e &= -e, 2 < e ? 8 < e ? e & 0x7ffffff ? 32 : 268435456 : 8 : 2;
	}
	function xt() {
		var e = ve.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : wh(e.type)) : e;
	}
	function St(e, t) {
		var n = ve.p;
		try {
			return ve.p = e, t();
		} finally {
			ve.p = n;
		}
	}
	var L = Math.random().toString(36).slice(2), Ct = "__reactFiber$" + L, wt = "__reactProps$" + L, Tt = "__reactContainer$" + L, Et = "__reactEvents$" + L, Dt = "__reactListeners$" + L, Ot = "__reactHandles$" + L, kt = "__reactResources$" + L, At = "__reactMarker$" + L, jt = "__reactLoad$" + L;
	function Mt(e) {
		delete e[Ct], delete e[wt], delete e[Dt], delete e[Ot];
	}
	function Nt(e) {
		var t;
		if (t = e[Ct]) return t;
		for (var n = e.parentNode; n;) {
			if (t = n[Tt] || n[Ct]) {
				if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = mm(e); e !== null;) {
					if (n = e[Ct]) return n;
					e = mm(e);
				}
				return t;
			}
			e = n, n = e.parentNode;
		}
		return null;
	}
	function Pt(e) {
		if (e = e[Ct] || e[Tt]) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
		}
		return null;
	}
	function R(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(i(33));
	}
	function Ft(e) {
		var t = e[kt];
		return t ||= e[kt] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		}, t;
	}
	function It(e) {
		e[At] = !0;
	}
	function Lt(e) {
		e[jt] = void 0;
	}
	var Rt = /* @__PURE__ */ new Set(), zt = {};
	function Bt(e, t) {
		Vt(e, t), Vt(e + "Capture", t);
	}
	function Vt(e, t) {
		for (zt[e] = t, e = 0; e < t.length; e++) Rt.add(t[e]);
	}
	var Ht = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), z = {}, Ut = {};
	function Wt(e) {
		return Le.call(Ut, e) ? !0 : Le.call(z, e) ? !1 : Ht.test(e) ? Ut[e] = !0 : (z[e] = !0, !1);
	}
	var Gt = !1;
	function Kt() {
		var e = Gt;
		return Gt = !1, e;
	}
	function qt(e, t, n) {
		if (Wt(t)) {
			if (n === null) e.removeAttribute(t);
			else {
				switch (typeof n) {
					case "undefined":
					case "function":
					case "symbol":
						e.removeAttribute(t);
						return;
					case "boolean":
						var r = t.toLowerCase().slice(0, 5);
						if (r !== "data-" && r !== "aria-") {
							e.removeAttribute(t);
							return;
						}
				}
				e.setAttribute(t, n);
			}
		}
	}
	function Jt(e, t, n) {
		if (n === null) e.removeAttribute(t);
		else {
			switch (typeof n) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(t);
					return;
			}
			e.setAttribute(t, n);
		}
	}
	function Yt(e, t, n, r) {
		if (r === null) e.removeAttribute(n);
		else {
			switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(n);
					return;
			}
			e.setAttributeNS(t, n, r);
		}
	}
	function Xt(e) {
		switch (typeof e) {
			case "bigint":
			case "boolean":
			case "number":
			case "string":
			case "undefined":
			case "object": return e;
			default: return "";
		}
	}
	function Zt(e) {
		var t = e.type;
		return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
	}
	function Qt(e, t, n) {
		var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
		if (!e.hasOwnProperty(t) && r !== void 0 && typeof r.get == "function" && typeof r.set == "function") {
			var i = r.get, a = r.set;
			return Object.defineProperty(e, t, {
				configurable: !0,
				get: function() {
					return i.call(this);
				},
				set: function(e) {
					n = "" + e, a.call(this, e);
				}
			}), Object.defineProperty(e, t, { enumerable: r.enumerable }), {
				getValue: function() {
					return n;
				},
				setValue: function(e) {
					n = "" + e;
				},
				stopTracking: function() {
					e._valueTracker = null, delete e[t];
				}
			};
		}
	}
	function $t(e) {
		if (!e._valueTracker) {
			var t = Zt(e) ? "checked" : "value";
			e._valueTracker = Qt(e, t, "" + e[t]);
		}
	}
	function en(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = Zt(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n && (t.setValue(e), !0);
	}
	var tn = /[\n"\\]/g;
	function nn(e) {
		return e.replace(tn, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function rn(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Xt(t)) : e.value !== "" + Xt(t) && (e.value = "" + Xt(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : on(e, Xt(n)) : o === "number" && e.value == t ? on(e, Xt(e.value)) : on(e, Xt(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + Xt(s) : e.removeAttribute("name");
	}
	function an(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				$t(e);
				return;
			}
			n = n == null ? "" : "" + Xt(n), t = t == null ? n : "" + Xt(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r ??= i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), $t(e);
	}
	function on(e, t) {
		e.defaultValue !== "" + t && (e.defaultValue = "" + t);
	}
	function sn(e, t, n, r) {
		if (e = e.options, t) {
			t = {};
			for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
			for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
		} else {
			for (n = "" + Xt(n), t = null, i = 0; i < e.length; i++) {
				if (e[i].value === n) {
					e[i].selected = !0, r && (e[i].defaultSelected = !0);
					return;
				}
				t !== null || e[i].disabled || (t = e[i]);
			}
			t !== null && (t.selected = !0);
		}
	}
	function cn(e, t, n) {
		t != null && (t = "" + Xt(t), t !== e.value && (e.value = t), n == null) ? e.defaultValue !== t && (e.defaultValue = t) : e.defaultValue = n == null ? "" : "" + Xt(n);
	}
	function ln(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(i(92));
				if (_e(r)) {
					if (1 < r.length) throw Error(i(93));
					r = r[0];
				}
				n = r;
			}
			n ??= "", t = n;
		}
		n = Xt(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), $t(e);
	}
	function un(e, t) {
		if (t) {
			var n = e.firstChild;
			if (n && n === e.lastChild && n.nodeType === 3) {
				n.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var dn = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function fn(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || dn.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
	}
	function pn(e, t, n) {
		if (t != null && typeof t != "object") throw Error(i(62));
		if (e = e.style, n != null) {
			for (var r in n) !n.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "", Gt = !0);
			for (var a in t) r = t[a], t.hasOwnProperty(a) && n[a] !== r && (fn(e, a, r), Gt = !0);
		} else for (var o in t) t.hasOwnProperty(o) && fn(e, o, t[o]);
	}
	function mn(e) {
		if (e.indexOf("-") === -1) return !1;
		switch (e) {
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph": return !1;
			default: return !0;
		}
	}
	var hn = /* @__PURE__ */ new Map([
		["acceptCharset", "accept-charset"],
		["htmlFor", "for"],
		["httpEquiv", "http-equiv"],
		["crossOrigin", "crossorigin"],
		["accentHeight", "accent-height"],
		["alignmentBaseline", "alignment-baseline"],
		["arabicForm", "arabic-form"],
		["baselineShift", "baseline-shift"],
		["capHeight", "cap-height"],
		["clipPath", "clip-path"],
		["clipRule", "clip-rule"],
		["colorInterpolation", "color-interpolation"],
		["colorInterpolationFilters", "color-interpolation-filters"],
		["colorProfile", "color-profile"],
		["colorRendering", "color-rendering"],
		["dominantBaseline", "dominant-baseline"],
		["enableBackground", "enable-background"],
		["fillOpacity", "fill-opacity"],
		["fillRule", "fill-rule"],
		["floodColor", "flood-color"],
		["floodOpacity", "flood-opacity"],
		["fontFamily", "font-family"],
		["fontSize", "font-size"],
		["fontSizeAdjust", "font-size-adjust"],
		["fontStretch", "font-stretch"],
		["fontStyle", "font-style"],
		["fontVariant", "font-variant"],
		["fontWeight", "font-weight"],
		["glyphName", "glyph-name"],
		["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
		["glyphOrientationVertical", "glyph-orientation-vertical"],
		["horizAdvX", "horiz-adv-x"],
		["horizOriginX", "horiz-origin-x"],
		["imageRendering", "image-rendering"],
		["letterSpacing", "letter-spacing"],
		["lightingColor", "lighting-color"],
		["markerEnd", "marker-end"],
		["markerMid", "marker-mid"],
		["markerStart", "marker-start"],
		["maskType", "mask-type"],
		["overlinePosition", "overline-position"],
		["overlineThickness", "overline-thickness"],
		["paintOrder", "paint-order"],
		["panose-1", "panose-1"],
		["pointerEvents", "pointer-events"],
		["renderingIntent", "rendering-intent"],
		["shapeRendering", "shape-rendering"],
		["stopColor", "stop-color"],
		["stopOpacity", "stop-opacity"],
		["strikethroughPosition", "strikethrough-position"],
		["strikethroughThickness", "strikethrough-thickness"],
		["strokeDasharray", "stroke-dasharray"],
		["strokeDashoffset", "stroke-dashoffset"],
		["strokeLinecap", "stroke-linecap"],
		["strokeLinejoin", "stroke-linejoin"],
		["strokeMiterlimit", "stroke-miterlimit"],
		["strokeOpacity", "stroke-opacity"],
		["strokeWidth", "stroke-width"],
		["textAnchor", "text-anchor"],
		["textDecoration", "text-decoration"],
		["textRendering", "text-rendering"],
		["transformOrigin", "transform-origin"],
		["underlinePosition", "underline-position"],
		["underlineThickness", "underline-thickness"],
		["unicodeBidi", "unicode-bidi"],
		["unicodeRange", "unicode-range"],
		["unitsPerEm", "units-per-em"],
		["vAlphabetic", "v-alphabetic"],
		["vHanging", "v-hanging"],
		["vIdeographic", "v-ideographic"],
		["vMathematical", "v-mathematical"],
		["vectorEffect", "vector-effect"],
		["vertAdvY", "vert-adv-y"],
		["vertOriginX", "vert-origin-x"],
		["vertOriginY", "vert-origin-y"],
		["wordSpacing", "word-spacing"],
		["writingMode", "writing-mode"],
		["xmlnsXlink", "xmlns:xlink"],
		["xHeight", "x-height"]
	]), gn = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function _n(e) {
		return gn.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
	}
	function vn() {}
	var yn = null;
	function bn(e) {
		return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
	}
	var xn = null, Sn = null;
	function Cn(e) {
		var t = Pt(e);
		if (t && (e = t.stateNode)) {
			var n = e[wt] || null;
			switch (e = t.stateNode, t.type) {
				case "input":
					if (rn(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + nn("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var a = r[wt] || null;
								if (!a) throw Error(i(90));
								rn(r, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && en(r);
					}
					break;
				case "textarea":
					cn(e, n.value, n.defaultValue);
					break;
				case "select": t = n.value, t != null && sn(e, !!n.multiple, t, !1);
			}
		}
	}
	var wn = !1;
	function Tn(e, t, n) {
		if (wn) return e(t, n);
		wn = !0;
		try {
			return e(t);
		} finally {
			if (wn = !1, (xn !== null || Sn !== null) && (Bd(), xn && (t = xn, e = Sn, Sn = xn = null, Cn(t), e))) for (t = 0; t < e.length; t++) Cn(e[t]);
		}
	}
	function En(e, t) {
		var n = e.stateNode;
		if (n === null) return null;
		var r = n[wt] || null;
		if (r === null) return null;
		switch (n = r[t], t) {
			case "onClick":
			case "onClickCapture":
			case "onDoubleClick":
			case "onDoubleClickCapture":
			case "onMouseDown":
			case "onMouseDownCapture":
			case "onMouseMove":
			case "onMouseMoveCapture":
			case "onMouseUp":
			case "onMouseUpCapture":
			case "onMouseEnter":
				(r = !r.disabled) || (e = e.type, r = e !== "button" && e !== "input" && e !== "select" && e !== "textarea"), e = !r;
				break;
			default: e = !1;
		}
		if (e) return null;
		if (n && typeof n != "function") throw Error(i(231, t, typeof n));
		return n;
	}
	var Dn = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, On = !1;
	if (Dn) try {
		var kn = {};
		Object.defineProperty(kn, "passive", { get: function() {
			On = !0;
		} }), window.addEventListener("test", kn, kn), window.removeEventListener("test", kn, kn);
	} catch {
		On = !1;
	}
	var An = null, jn = null, Mn = null;
	function Nn() {
		if (Mn) return Mn;
		var e, t = jn, n = t.length, r, i = "value" in An ? An.value : An.textContent, a = i.length;
		for (e = 0; e < n && t[e] === i[e]; e++);
		var o = n - e;
		for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
		return Mn = i.slice(e, 1 < r ? 1 - r : void 0);
	}
	function Pn(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function Fn() {
		return !0;
	}
	function In() {
		return !1;
	}
	function Ln(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? Fn : In, this.isPropagationStopped = In, this;
		}
		return D(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = Fn);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = Fn);
			},
			persist: function() {},
			isPersistent: Fn
		}), t;
	}
	var Rn = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, zn = Ln(Rn), Bn = D({}, Rn, {
		view: 0,
		detail: 0
	}), Vn = Ln(Bn), Hn, Un, Wn, Gn = D({}, Bn, {
		screenX: 0,
		screenY: 0,
		clientX: 0,
		clientY: 0,
		pageX: 0,
		pageY: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		getModifierState: nr,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== Wn && (Wn && e.type === "mousemove" ? (Hn = e.screenX - Wn.screenX, Un = e.screenY - Wn.screenY) : Un = Hn = 0, Wn = e), Hn);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : Un;
		}
	}), Kn = Ln(Gn), qn = Ln(D({}, Gn, { dataTransfer: 0 })), Jn = Ln(D({}, Bn, { relatedTarget: 0 })), Yn = Ln(D({}, Rn, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Xn = Ln(D({}, Rn, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), Zn = Ln(D({}, Rn, { data: 0 })), Qn = {
		Esc: "Escape",
		Spacebar: " ",
		Left: "ArrowLeft",
		Up: "ArrowUp",
		Right: "ArrowRight",
		Down: "ArrowDown",
		Del: "Delete",
		Win: "OS",
		Menu: "ContextMenu",
		Apps: "ContextMenu",
		Scroll: "ScrollLock",
		MozPrintableKey: "Unidentified"
	}, $n = {
		8: "Backspace",
		9: "Tab",
		12: "Clear",
		13: "Enter",
		16: "Shift",
		17: "Control",
		18: "Alt",
		19: "Pause",
		20: "CapsLock",
		27: "Escape",
		32: " ",
		33: "PageUp",
		34: "PageDown",
		35: "End",
		36: "Home",
		37: "ArrowLeft",
		38: "ArrowUp",
		39: "ArrowRight",
		40: "ArrowDown",
		45: "Insert",
		46: "Delete",
		112: "F1",
		113: "F2",
		114: "F3",
		115: "F4",
		116: "F5",
		117: "F6",
		118: "F7",
		119: "F8",
		120: "F9",
		121: "F10",
		122: "F11",
		123: "F12",
		144: "NumLock",
		145: "ScrollLock",
		224: "Meta"
	}, er = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function tr(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = er[e]) ? !!t[e] : !1;
	}
	function nr() {
		return tr;
	}
	var rr = Ln(D({}, Bn, {
		key: function(e) {
			if (e.key) {
				var t = Qn[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = Pn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? $n[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: nr,
		charCode: function(e) {
			return e.type === "keypress" ? Pn(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? Pn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), ir = Ln(D({}, Gn, {
		pointerId: 0,
		width: 0,
		height: 0,
		pressure: 0,
		tangentialPressure: 0,
		tiltX: 0,
		tiltY: 0,
		twist: 0,
		pointerType: 0,
		isPrimary: 0
	})), ar = Ln(D({}, Rn, { submitter: 0 })), or = Ln(D({}, Bn, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: nr
	})), sr = Ln(D({}, Rn, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), cr = Ln(D({}, Gn, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), lr = Ln(D({}, Rn, {
		newState: 0,
		oldState: 0,
		source: 0
	})), ur = [
		9,
		13,
		27,
		32
	], dr = Dn && "CompositionEvent" in window, fr = null;
	Dn && "documentMode" in document && (fr = document.documentMode);
	var pr = Dn && "TextEvent" in window && !fr, mr = Dn && (!dr || fr && 8 < fr && 11 >= fr), hr = " ", gr = !1;
	function _r(e, t) {
		switch (e) {
			case "keyup": return ur.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function vr(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var yr = !1;
	function br(e, t) {
		switch (e) {
			case "compositionend": return vr(t);
			case "keypress": return t.which === 32 ? (gr = !0, hr) : null;
			case "textInput": return e = t.data, e === hr && gr ? null : e;
			default: return null;
		}
	}
	function xr(e, t) {
		if (yr) return e === "compositionend" || !dr && _r(e, t) ? (e = Nn(), Mn = jn = An = null, yr = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return mr && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var Sr = {
		color: !0,
		date: !0,
		datetime: !0,
		"datetime-local": !0,
		email: !0,
		month: !0,
		number: !0,
		password: !0,
		range: !0,
		search: !0,
		tel: !0,
		text: !0,
		time: !0,
		url: !0,
		week: !0
	};
	function Cr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!Sr[e.type] : t === "textarea";
	}
	function wr(e, t, n, r) {
		xn ? Sn ? Sn.push(r) : Sn = [r] : xn = r, t = Yf(t, "onChange"), 0 < t.length && (n = new zn("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var Tr = null, Er = null;
	function Dr(e) {
		Hf(e, 0);
	}
	function Or(e) {
		if (en(R(e))) return e;
	}
	function kr(e, t) {
		if (e === "change") return t;
	}
	var Ar = !1;
	if (Dn) {
		var jr;
		if (Dn) {
			var Mr = "oninput" in document;
			if (!Mr) {
				var Nr = document.createElement("div");
				Nr.setAttribute("oninput", "return;"), Mr = typeof Nr.oninput == "function";
			}
			jr = Mr;
		} else jr = !1;
		Ar = jr && (!document.documentMode || 9 < document.documentMode);
	}
	function Pr() {
		Tr && (Tr.detachEvent("onpropertychange", Fr), Er = Tr = null);
	}
	function Fr(e) {
		if (e.propertyName === "value" && Or(Er)) {
			var t = [];
			wr(t, Er, e, bn(e)), Tn(Dr, t);
		}
	}
	function Ir(e, t, n) {
		e === "focusin" ? (Pr(), Tr = t, Er = n, Tr.attachEvent("onpropertychange", Fr)) : e === "focusout" && Pr();
	}
	function Lr(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return Or(Er);
	}
	function Rr(e, t) {
		if (e === "click") return Or(t);
	}
	function zr(e, t) {
		if (e === "input" || e === "change") return Or(t);
	}
	function Br(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var Vr = typeof Object.is == "function" ? Object.is : Br;
	function Hr(e, t) {
		if (Vr(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!Le.call(t, i) || !Vr(e[i], t[i])) return !1;
		}
		return !0;
	}
	function Ur(e) {
		if (e ||= typeof document < "u" ? document : void 0, e === void 0) return null;
		try {
			return e.activeElement || e.body;
		} catch {
			return e.body;
		}
	}
	function Wr(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function Gr(e, t) {
		var n = Wr(e);
		e = 0;
		for (var r; n;) {
			if (n.nodeType === 3) {
				if (r = e + n.textContent.length, e <= t && r >= t) return {
					node: n,
					offset: t - e
				};
				e = r;
			}
			e: {
				for (; n;) {
					if (n.nextSibling) {
						n = n.nextSibling;
						break e;
					}
					n = n.parentNode;
				}
				n = void 0;
			}
			n = Wr(n);
		}
	}
	function Kr(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Kr(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function qr(e) {
		e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
		for (var t = Ur(e.document); t instanceof e.HTMLIFrameElement;) {
			try {
				var n = typeof t.contentWindow.location.href == "string";
			} catch {
				n = !1;
			}
			if (n) e = t.contentWindow;
			else break;
			t = Ur(e.document);
		}
		return t;
	}
	function Jr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var Yr = Dn && "documentMode" in document && 11 >= document.documentMode, Xr = null, Zr = null, Qr = null, $r = !1;
	function ei(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		$r || Xr == null || Xr !== Ur(r) || (r = Xr, "selectionStart" in r && Jr(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), Qr && Hr(Qr, r) || (Qr = r, r = Yf(Zr, "onSelect"), 0 < r.length && (t = new zn("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = Xr)));
	}
	function ti(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var ni = {
		animationend: ti("Animation", "AnimationEnd"),
		animationiteration: ti("Animation", "AnimationIteration"),
		animationstart: ti("Animation", "AnimationStart"),
		transitionrun: ti("Transition", "TransitionRun"),
		transitionstart: ti("Transition", "TransitionStart"),
		transitioncancel: ti("Transition", "TransitionCancel"),
		transitionend: ti("Transition", "TransitionEnd")
	}, ri = {}, ii = {};
	Dn && (ii = document.createElement("div").style, "AnimationEvent" in window || (delete ni.animationend.animation, delete ni.animationiteration.animation, delete ni.animationstart.animation), "TransitionEvent" in window || delete ni.transitionend.transition);
	function ai(e) {
		if (ri[e]) return ri[e];
		if (!ni[e]) return e;
		var t = ni[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in ii) return ri[e] = t[n];
		return e;
	}
	var oi = ai("animationend"), si = ai("animationiteration"), ci = ai("animationstart"), li = ai("transitionrun"), ui = ai("transitionstart"), di = ai("transitioncancel"), fi = ai("transitionend"), pi = /* @__PURE__ */ new Map(), mi = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	mi.push("scrollEnd");
	function hi(e, t) {
		pi.set(e, t), Bt(t, [e]);
	}
	var gi = 0;
	function _i(e, t) {
		if (e.name != null && e.name !== "auto") return e.name;
		if (t.autoName !== null) return t.autoName;
		e = Sd.identifierPrefix;
		var n = gi++;
		return e = "_" + e + "t_" + n.toString(32) + "_", t.autoName = e;
	}
	function vi(e) {
		if (e == null || typeof e == "string") return e;
		var t = null, n = kd;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = e[n[r]];
			if (i != null) {
				if (i === "none") return "none";
				t = t == null ? i : t + (" " + i);
			}
		}
		return t ?? e.default;
	}
	function yi(e, t) {
		return e = vi(e), t = vi(t), t == null ? e === "auto" ? null : e : t === "auto" ? null : t;
	}
	var bi = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	}, xi = [], Si = 0, Ci = 0;
	function wi() {
		for (var e = Si, t = Ci = Si = 0; t < e;) {
			var n = xi[t];
			xi[t++] = null;
			var r = xi[t];
			xi[t++] = null;
			var i = xi[t];
			xi[t++] = null;
			var a = xi[t];
			if (xi[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && Oi(n, i, a);
		}
	}
	function Ti(e, t, n, r) {
		xi[Si++] = e, xi[Si++] = t, xi[Si++] = n, xi[Si++] = r, Ci |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function Ei(e, t, n, r) {
		return Ti(e, t, n, r), ki(e);
	}
	function Di(e, t) {
		return Ti(e, null, null, t), ki(e);
	}
	function Oi(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - et(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function ki(e) {
		if (50 < Ad) throw Ad = 0, jd = null, Error(i(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var Ai = {};
	function ji(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function Mi(e, t, n, r) {
		return new ji(e, t, n, r);
	}
	function Ni(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function Pi(e, t) {
		var n = e.alternate;
		return n === null ? (n = Mi(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 0x47f00000, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function Fi(e, t) {
		e.flags &= 0x47f00002;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function Ii(e, t, n, r, a, o) {
		var s = 0;
		if (r = e, typeof r == "function") Ni(r) && (s = 1);
		else if (typeof r == "string") s = Ym(e, n, we.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else e: switch (r) {
			case ce: return e = Mi(31, n, t, a), e.elementType = ce, e.lanes = o, e;
			case te: return Li(n.children, a, o, t);
			case A:
				s = 8, a |= 24;
				break;
			case j: return e = Mi(12, n, t, a | 2), e.elementType = j, e.lanes = o, e;
			case ie: return e = Mi(13, n, t, a), e.elementType = ie, e.lanes = o, e;
			case ae: return e = Mi(19, n, t, a), e.elementType = ae, e.lanes = o, e;
			case le:
			case de: return e = a | 32, e = Mi(30, n, t, e), e.elementType = de, e.lanes = o, e.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}, e;
			default:
				if (typeof r == "object" && r) switch (r.$$typeof) {
					case re:
						s = 10;
						break e;
					case ne:
						s = 9;
						break e;
					case M:
						s = 11;
						break e;
					case oe:
						s = 14;
						break e;
					case se:
						s = 16, r = null;
						break e;
				}
				s = 29, n = Error(i(130, e === null ? "null" : typeof e, "")), r = null;
		}
		return t = Mi(s, n, t, a), t.elementType = e, t.type = r, t.lanes = o, t;
	}
	function Li(e, t, n, r) {
		return e = Mi(7, e, r, t), e.lanes = n, e;
	}
	function Ri(e, t, n) {
		return e = Mi(6, e, null, t), e.lanes = n, e;
	}
	function zi(e) {
		var t = Mi(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function Bi(e, t, n) {
		return t = Mi(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var Vi = /* @__PURE__ */ new WeakMap();
	function Hi(e, t) {
		if (typeof e == "object" && e) {
			var n = Vi.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: Ie(t)
			}, Vi.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: Ie(t)
		};
	}
	var Ui = [], Wi = 0, Gi = null, Ki = 0, qi = [], Ji = 0, Yi = null, Xi = 1, Zi = "";
	function Qi(e, t) {
		Ui[Wi++] = Ki, Ui[Wi++] = Gi, Gi = e, Ki = t;
	}
	function $i(e, t, n) {
		qi[Ji++] = Xi, qi[Ji++] = Zi, qi[Ji++] = Yi, Yi = e;
		var r = Xi;
		e = Zi;
		var i = 32 - et(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - et(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, Xi = 1 << 32 - et(t) + i | n << i | r, Zi = a + e;
		} else Xi = 1 << a | n << i | r, Zi = e;
	}
	function ea(e) {
		e.return !== null && (Qi(e, 1), $i(e, 1, 0));
	}
	function ta(e) {
		for (; e === Gi;) Gi = Ui[--Wi], Ui[Wi] = null, Ki = Ui[--Wi], Ui[Wi] = null;
		for (; e === Yi;) Yi = qi[--Ji], qi[Ji] = null, Zi = qi[--Ji], qi[Ji] = null, Xi = qi[--Ji], qi[Ji] = null;
	}
	function na(e, t) {
		qi[Ji++] = Xi, qi[Ji++] = Zi, qi[Ji++] = Yi, Xi = t.id, Zi = t.overflow, Yi = e;
	}
	var ra = null, ia = null, B = !1, aa = null, oa = !1, sa = Error(i(519));
	function ca(e) {
		throw ma(Hi(Error(i(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), sa;
	}
	function la(e) {
		var t = e.stateNode, n = e.type, r = e.memoizedProps;
		switch (t[Ct] = e, t[wt] = r, n) {
			case "dialog":
				Z("cancel", t), Z("close", t);
				break;
			case "iframe":
			case "object":
			case "embed":
				Z("load", t);
				break;
			case "video":
			case "audio":
				for (n = 0; n < Bf.length; n++) Z(Bf[n], t);
				break;
			case "source":
				Z("error", t);
				break;
			case "img":
			case "image":
			case "link":
				Z("error", t), Z("load", t);
				break;
			case "details":
				Z("toggle", t);
				break;
			case "input":
				Z("invalid", t), an(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				Z("invalid", t);
				break;
			case "textarea": Z("invalid", t), ln(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || tp(t.textContent, n) ? (r.popover != null && (Z("beforetoggle", t), Z("toggle", t)), r.onScroll != null && Z("scroll", t), r.onScrollEnd != null && Z("scrollend", t), r.onClick != null && (t.onclick = vn), t = !0) : t = !1, t || ca(e, !0);
	}
	function ua(e) {
		for (ra = e.return; ra;) switch (ra.tag) {
			case 5:
			case 31:
			case 13:
				oa = !1;
				return;
			case 27:
			case 3:
				oa = !0;
				return;
			default: ra = ra.return;
		}
	}
	function da(e) {
		if (e !== ra) return !1;
		if (!B) return ua(e), B = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = n === "form" || n === "button" || hp(e.type, e.memoizedProps)), n = !n), n && ia && ca(e), ua(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			ia = pm(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			ia = pm(e);
		} else t === 27 ? (t = ia, wp(e.type) ? (e = fm, fm = null, ia = e) : ia = t) : ia = ra ? dm(e.stateNode.nextSibling) : null;
		return !0;
	}
	function fa() {
		ia = ra = null, B = !1;
	}
	function pa() {
		var e = aa;
		return e !== null && (md === null ? md = e : md.push.apply(md, e), aa = null), e;
	}
	function ma(e) {
		aa === null ? aa = [e] : aa.push(e);
	}
	var ha = P(null), ga = null, _a = null;
	function va(e, t, n) {
		Ce(ha, t._currentValue), t._currentValue = n;
	}
	function V(e) {
		e._currentValue = ha.current, Se(ha);
	}
	function ya(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function ba(e, t, n, r) {
		var a = e.child;
		for (a !== null && (a.return = e); a !== null;) {
			var o = a.dependencies;
			if (o !== null) {
				var s = a.child;
				o = o.firstContext;
				e: for (; o !== null;) {
					var c = o;
					o = a;
					for (var l = 0; l < t.length; l++) if (c.context === t[l]) {
						o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), ya(o.return, n, e), r || (s = null);
						break e;
					}
					o = c.next;
				}
			} else if (a.tag === 18) {
				if (s = a.return, s === null) throw Error(i(341));
				s.lanes |= n, o = s.alternate, o !== null && (o.lanes |= n), ya(s, n, e), s = null;
			} else a.tag === 13 && a.memoizedState !== null && a.memoizedState.dehydrated === null ? (a.lanes |= n, s = a.alternate, s !== null && (s.lanes |= n), ya(a.return, n, e), s = a.child, s = s === null ? null : s.sibling) : s = a.child;
			if (s !== null) s.return = a;
			else for (s = a; s !== null;) {
				if (s === e) {
					s = null;
					break;
				}
				if (a = s.sibling, a !== null) {
					a.return = s.return, s = a;
					break;
				}
				s = s.return;
			}
			a = s;
		}
	}
	function xa(e, t, n, r) {
		e = null;
		for (var a = t, o = !1; a !== null;) {
			if (!o) {
				if (a.flags & 524288) o = !0;
				else if (a.flags & 262144) break;
			}
			if (a.tag === 10) {
				var s = a.alternate;
				if (s === null) throw Error(i(387));
				if (s = s.memoizedProps, s !== null) {
					var c = a.type;
					Vr(a.pendingProps.value, s.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (a === Ee.current) {
				if (s = a.alternate, s === null) throw Error(i(387));
				s.memoizedState.memoizedState !== a.memoizedState.memoizedState && (e === null ? e = [ch] : e.push(ch));
			}
			a = a.return;
		}
		return e !== null && ba(t, e, n, r), t.flags |= 262144, e !== null;
	}
	function Sa(e) {
		for (e = e.firstContext; e !== null;) {
			if (!Vr(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function Ca(e) {
		ga = e, _a = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function wa(e) {
		return Ea(ga, e);
	}
	function Ta(e, t) {
		return ga === null && Ca(e), Ea(e, t);
	}
	function Ea(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, _a === null) {
			if (e === null) throw Error(i(308));
			_a = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else _a = _a.next = t;
		return n;
	}
	var Da = typeof AbortController < "u" ? AbortController : function() {
		var e = [], t = this.signal = {
			aborted: !1,
			addEventListener: function(t, n) {
				e.push(n);
			}
		};
		this.abort = function() {
			t.aborted = !0, e.forEach(function(e) {
				return e();
			});
		};
	}, Oa = t.unstable_scheduleCallback, ka = t.unstable_NormalPriority, Aa = {
		$$typeof: re,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function ja() {
		return {
			controller: new Da(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function Ma(e) {
		e.refCount--, e.refCount === 0 && Oa(ka, function() {
			e.controller.abort();
		});
	}
	function Na(e, t) {
		if (e.pendingLanes & 4194048) {
			var n = e.transitionTypes;
			for (n === null && (n = e.transitionTypes = []), e = 0; e < t.length; e++) {
				var r = t[e];
				n.indexOf(r) === -1 && n.push(r);
			}
		}
	}
	var Pa = null;
	function Fa(e) {
		var t = e.transitionTypes;
		return e.transitionTypes = null, t;
	}
	var Ia = null, La = 0, Ra = 0, za = null;
	function Ba(e, t) {
		if (Ia === null) {
			var n = Ia = [];
			La = 0, Ra = Ff(), za = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return La++, t.then(Va, Va), t;
	}
	function Va() {
		if (--La === 0 && (Pa = null, Ia !== null)) {
			za !== null && (za.status = "fulfilled");
			var e = Ia;
			Ia = null, Ra = 0, za = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function Ha(e, t) {
		var n = [], r = {
			status: "pending",
			value: null,
			reason: null,
			then: function(e) {
				n.push(e);
			}
		};
		return e.then(function() {
			r.status = "fulfilled", r.value = t;
			for (var e = 0; e < n.length; e++) (0, n[e])(t);
		}, function(e) {
			for (r.status = "rejected", r.reason = e, e = 0; e < n.length; e++) (0, n[e])(void 0);
		}), r;
	}
	var Ua = N.S;
	N.S = function(e, t) {
		if (_d = He(), typeof t == "object" && t && typeof t.then == "function" && Ba(e, t), Pa !== null) for (var n = Sf; n !== null;) Na(n, Pa), n = n.next;
		if (n = e.types, n !== null) {
			for (var r = Sf; r !== null;) Na(r, n), r = r.next;
			if (Ra !== 0) {
				r = Pa, r === null && (r = Pa = []);
				for (var i = 0; i < n.length; i++) {
					var a = n[i];
					r.indexOf(a) === -1 && r.push(a);
				}
			}
		}
		Ua !== null && Ua(e, t);
	};
	var Wa = P(null);
	function Ga() {
		var e = Wa.current;
		return e === null ? ed.pooledCache : e;
	}
	function Ka(e, t) {
		t === null ? Ce(Wa, Wa.current) : Ce(Wa, t.pool);
	}
	function qa() {
		var e = Ga();
		return e === null ? null : {
			parent: Aa._currentValue,
			pool: e
		};
	}
	var Ja = Error(i(460)), Ya = Error(i(474)), Xa = Error(i(542)), Za = { then: function() {} };
	function Qa(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function $a(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(vn, vn), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, ro(e), e === void 0 && !("reason" in t) ? Error(i(600)) : e;
			default:
				if (typeof t.status == "string") t.then(vn, vn);
				else {
					if (e = ed, e !== null && 100 < e.shellSuspendCounter) throw Error(i(482));
					e = t, e.status = "pending", e.then(function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "fulfilled", n.value = e;
						}
					}, function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "rejected", n.reason = e;
						}
					});
				}
				switch (t.status) {
					case "fulfilled": return t.value;
					case "rejected": throw e = t.reason, ro(e), e;
				}
				throw to = t, Ja;
		}
	}
	function eo(e) {
		try {
			return (0, e._init)(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (to = e, Ja) : e;
		}
	}
	var to = null;
	function no() {
		if (to === null) throw Error(i(459));
		var e = to;
		return to = null, e;
	}
	function ro(e) {
		if (e === Ja || e === Xa) throw Error(i(483));
	}
	var io = null, ao = 0;
	function oo(e) {
		var t = ao;
		return ao += 1, io === null && (io = []), $a(io, e, t);
	}
	function so(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function co(e, t) {
		throw t.$$typeof === O ? Error(i(525)) : (e = Object.prototype.toString.call(t), Error(i(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function lo(e) {
		function t(t, n) {
			if (e) {
				var r = t.deletions;
				r === null ? (t.deletions = [n], t.flags |= 16) : r.push(n);
			}
		}
		function n(n, r) {
			if (!e) return null;
			for (; r !== null;) t(n, r), r = r.sibling;
			return null;
		}
		function r(e) {
			for (var t = /* @__PURE__ */ new Map(); e !== null;) e.key === null ? t.set(e.index, e) : t.set(e.key, e), e = e.sibling;
			return t;
		}
		function a(e, t) {
			return e = Pi(e, t), e.index = 0, e.sibling = null, e;
		}
		function o(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 0x8000002, n) : (r = r.index, r < n ? (t.flags |= 2, n) : r)) : (t.flags |= 1048576, n);
		}
		function s(t) {
			return e && t.alternate === null && (t.flags |= 0x8000002), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = Ri(n, e.mode, r), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var i = n.type;
			return i === te ? (e = d(e, t, n.props.children, r, n.key), so(e, n), e) : t !== null && (t.elementType === i || typeof i == "object" && i && i.$$typeof === se && eo(i) === t.type) ? (t = a(t, n.props), so(t, n), t.return = e, t) : (t = Ii(n.type, n.key, n.props, null, e.mode, r), so(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = Bi(n, e.mode, r), t.return = e, t) : (t = a(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, i) {
			return t === null || t.tag !== 7 ? (t = Li(n, e.mode, r, i), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = Ri("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case k: return n = Ii(t.type, t.key, t.props, null, e.mode, n), so(n, t), n.return = e, n;
					case ee: return t = Bi(t, e.mode, n), t.return = e, t;
					case se: return t = eo(t), f(e, t, n);
				}
				if (_e(t) || me(t)) return t = Li(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, oo(t), n);
				if (t.$$typeof === re) return f(e, Ta(e, t), n);
				co(e, t);
			}
			return null;
		}
		function p(e, t, n, r) {
			var i = t === null ? null : t.key;
			if (typeof n == "string" && n !== "" || typeof n == "number" || typeof n == "bigint") return i === null ? c(e, t, "" + n, r) : null;
			if (typeof n == "object" && n) {
				switch (n.$$typeof) {
					case k: return n.key === i ? l(e, t, n, r) : null;
					case ee: return n.key === i ? u(e, t, n, r) : null;
					case se: return n = eo(n), p(e, t, n, r);
				}
				if (_e(n) || me(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, oo(n), r);
				if (n.$$typeof === re) return p(e, t, Ta(e, n), r);
				co(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case k: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case ee: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case se: return r = eo(r), m(e, t, n, r, i);
				}
				if (_e(r) || me(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, oo(r), i);
				if (r.$$typeof === re) return m(e, t, n, Ta(t, r), i);
				co(t, r);
			}
			return null;
		}
		function h(i, a, s, c) {
			for (var l = null, u = null, d = a, h = a = 0, g = null; d !== null && h < s.length; h++) {
				d.index > h ? (g = d, d = null) : g = d.sibling;
				var _ = p(i, d, s[h], c);
				if (_ === null) {
					d === null && (d = g);
					break;
				}
				e && d && _.alternate === null && t(i, d), a = o(_, a, h), u === null ? l = _ : u.sibling = _, u = _, d = g;
			}
			if (h === s.length) return n(i, d), B && Qi(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (a = o(d, a, h), u === null ? l = d : u.sibling = d, u = d);
				return B && Qi(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && (_ = g.alternate, _ !== null && d.delete(_.key === null ? h : _.key)), a = o(g, a, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), B && Qi(i, h), l;
		}
		function g(a, s, c, l) {
			if (c == null) throw Error(i(151));
			for (var u = null, d = null, h = s, g = s = 0, _ = null, v = c.next(); h !== null && !v.done; g++, v = c.next()) {
				h.index > g ? (_ = h, h = null) : _ = h.sibling;
				var y = p(a, h, v.value, l);
				if (y === null) {
					h === null && (h = _);
					break;
				}
				e && h && y.alternate === null && t(a, h), s = o(y, s, g), d === null ? u = y : d.sibling = y, d = y, h = _;
			}
			if (v.done) return n(a, h), B && Qi(a, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(a, v.value, l), v !== null && (s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
				return B && Qi(a, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, a, g, v.value, l), v !== null && (e && (_ = v.alternate, _ !== null && h.delete(_.key === null ? g : _.key)), s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(a, e);
			}), B && Qi(a, g), u;
		}
		function _(e, r, o, c) {
			if (typeof o == "object" && o && o.type === te && o.key === null && o.props.ref === void 0 && (o = o.props.children), typeof o == "object" && o) {
				switch (o.$$typeof) {
					case k:
						e: {
							for (var l = o.key; r !== null;) {
								if (r.key === l) {
									if (l = o.type, l === te) {
										if (r.tag === 7) {
											n(e, r.sibling), c = a(r, o.props.children), so(c, o), c.return = e, e = c;
											break e;
										}
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === se && eo(l) === r.type) {
										n(e, r.sibling), c = a(r, o.props), so(c, o), c.return = e, e = c;
										break e;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							o.type === te ? (c = Li(o.props.children, e.mode, c, o.key), so(c, o), c.return = e, e = c) : (c = Ii(o.type, o.key, o.props, null, e.mode, c), so(c, o), c.return = e, e = c);
						}
						return s(e);
					case ee:
						e: {
							for (l = o.key; r !== null;) {
								if (r.key === l) {
									if (r.tag === 4 && r.stateNode.containerInfo === o.containerInfo && r.stateNode.implementation === o.implementation) {
										n(e, r.sibling), c = a(r, o.children || []), c.return = e, e = c;
										break e;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							c = Bi(o, e.mode, c), c.return = e, e = c;
						}
						return s(e);
					case se: return o = eo(o), _(e, r, o, c);
				}
				if (_e(o)) return h(e, r, o, c);
				if (me(o)) {
					if (l = me(o), typeof l != "function") throw Error(i(150));
					return o = l.call(o), g(e, r, o, c);
				}
				if (typeof o.then == "function") return _(e, r, oo(o), c);
				if (o.$$typeof === re) return _(e, r, Ta(e, o), c);
				co(e, o);
			}
			return typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint" ? (o = "" + o, r !== null && r.tag === 6 ? (n(e, r.sibling), c = a(r, o), c.return = e, e = c) : (n(e, r), c = Ri(o, e.mode, c), c.return = e, e = c), s(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				ao = 0;
				var i = _(e, t, n, r);
				return io = null, i;
			} catch (t) {
				if (t === Ja || t === Xa) throw t;
				var a = Mi(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var uo = lo(!0), fo = lo(!1), po = !1;
	function mo(e) {
		e.updateQueue = {
			baseState: e.memoizedState,
			firstBaseUpdate: null,
			lastBaseUpdate: null,
			shared: {
				pending: null,
				lanes: 0,
				hiddenCallbacks: null
			},
			callbacks: null
		};
	}
	function ho(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function go(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function _o(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, $u & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = ki(e), Oi(e, null, n), t;
		}
		return Ti(e, r, t, n), ki(e);
	}
	function vo(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, _t(e, n);
		}
	}
	function yo(e, t) {
		var n = e.updateQueue, r = e.alternate;
		if (r !== null && (r = r.updateQueue, n === r)) {
			var i = null, a = null;
			if (n = n.firstBaseUpdate, n !== null) {
				do {
					var o = {
						lane: n.lane,
						tag: n.tag,
						payload: n.payload,
						callback: null,
						next: null
					};
					a === null ? i = a = o : a = a.next = o, n = n.next;
				} while (n !== null);
				a === null ? i = a = t : a = a.next = t;
			} else i = a = t;
			n = {
				baseState: r.baseState,
				firstBaseUpdate: i,
				lastBaseUpdate: a,
				shared: r.shared,
				callbacks: r.callbacks
			}, e.updateQueue = n;
		} else e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
	}
	var bo = !1;
	function xo() {
		if (bo) {
			var e = za;
			if (e !== null) throw e;
		}
	}
	function So(e, t, n, r) {
		bo = !1;
		var i = e.updateQueue;
		po = !1;
		var a = i.firstBaseUpdate, o = i.lastBaseUpdate, s = i.shared.pending;
		if (s !== null) {
			i.shared.pending = null;
			var c = s, l = c.next;
			c.next = null, o === null ? a = l : o.next = l, o = c;
			var u = e.alternate;
			u !== null && (u = u.updateQueue, s = u.lastBaseUpdate, s !== o && (s === null ? u.firstBaseUpdate = l : s.next = l, u.lastBaseUpdate = c));
		}
		if (a !== null) {
			var d = i.baseState;
			o = 0, u = l = c = null, s = a;
			do {
				var f = s.lane & -536870913, p = f !== s.lane;
				if (p ? (J & f) === f : (r & f) === f) {
					f !== 0 && f === Ra && (bo = !0), u !== null && (u = u.next = {
						lane: 0,
						tag: s.tag,
						payload: s.payload,
						callback: null,
						next: null
					});
					e: {
						var m = e, h = s;
						f = t;
						var g = n;
						switch (h.tag) {
							case 1:
								if (m = h.payload, typeof m == "function") {
									d = m.call(g, d, f);
									break e;
								}
								d = m;
								break e;
							case 3: m.flags = m.flags & -65537 | 128;
							case 0:
								if (m = h.payload, f = typeof m == "function" ? m.call(g, d, f) : m, f == null) break e;
								d = D({}, d, f);
								break e;
							case 2: po = !0;
						}
					}
					f = s.callback, f !== null && (e.flags |= 64, p && (e.flags |= 8192), p = i.callbacks, p === null ? i.callbacks = [f] : p.push(f));
				} else p = {
					lane: f,
					tag: s.tag,
					payload: s.payload,
					callback: s.callback,
					next: null
				}, u === null ? (l = u = p, c = d) : u = u.next = p, o |= f;
				if (s = s.next, s === null) {
					if (s = i.shared.pending, s === null) break;
					p = s, s = p.next, p.next = null, i.lastBaseUpdate = p, i.shared.pending = null;
				}
			} while (1);
			u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), cd |= o, e.lanes = o, e.memoizedState = d;
		}
	}
	function Co(e, t) {
		if (typeof e != "function") throw Error(i(191, e));
		e.call(t);
	}
	function wo(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) Co(n[e], t);
	}
	var To = P(null), Eo = P(0);
	function Do(e, t) {
		e = od, Ce(Eo, e), Ce(To, t), od = e | t.baseLanes;
	}
	function Oo() {
		Ce(Eo, od), Ce(To, To.current);
	}
	function ko() {
		od = Eo.current, Se(To), Se(Eo);
	}
	var Ao = P(null), jo = null;
	function Mo(e) {
		var t = e.alternate;
		Ce(Lo, Lo.current & 1), Ce(Ao, e), jo === null && (t === null || To.current !== null || t.memoizedState !== null) && (jo = e);
	}
	function No(e) {
		Ce(Lo, Lo.current), Ce(Ao, e), jo === null && (jo = e);
	}
	function Po(e) {
		e.tag === 22 ? (Ce(Lo, Lo.current), Ce(Ao, e), jo === null && (jo = e)) : Fo();
	}
	function Fo() {
		Ce(Lo, Lo.current), Ce(Ao, Ao.current);
	}
	function Io(e) {
		Se(Ao), jo === e && (jo = null), Se(Lo);
	}
	var Lo = P(0);
	function Ro(e, t) {
		Ce(Ao, Ao.current), Ce(Lo, t);
	}
	function zo(e) {
		Se(Lo), Se(Ao), jo === e && (jo = null);
	}
	function Bo(e) {
		for (var t = e; t !== null;) {
			if (t.tag === 13) {
				var n = t.memoizedState;
				if (n !== null && (n = n.dehydrated, n === null || cm(n) || lm(n))) return t;
			} else if (t.tag === 19 && t.memoizedProps.revealOrder !== "independent") {
				if (t.flags & 128) return t;
			} else if (t.child !== null) {
				t.child.return = t, t = t.child;
				continue;
			}
			if (t === e) break;
			for (; t.sibling === null;) {
				if (t.return === null || t.return === e) return null;
				t = t.return;
			}
			t.sibling.return = t.return, t = t.sibling;
		}
		return null;
	}
	var Vo = 0, H = null, Ho = null, Uo = null, Wo = !1, Go = !1, Ko = !1, qo = 0, Jo = 0, Yo = null, Xo = 0;
	function Zo() {
		throw Error(i(321));
	}
	function Qo(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!Vr(e[n], t[n])) return !1;
		return !0;
	}
	function $o(e, t, n, r, i, a) {
		return Vo = a, H = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, N.H = e === null || e.memoizedState === null ? mc : hc, Ko = !1, a = n(r, i), Ko = !1, Go && (a = ts(t, n, r, i)), es(e), a;
	}
	function es(e) {
		N.H = pc;
		var t = Ho !== null && Ho.next !== null;
		if (Vo = 0, Uo = Ho = H = null, Wo = !1, Jo = 0, Yo = null, t) throw Error(i(300));
		e === null || Mc || (e = e.dependencies, e !== null && Sa(e) && (Mc = !0));
	}
	function ts(e, t, n, r) {
		H = e;
		var a = 0;
		do {
			if (Go && (Yo = null), Jo = 0, Go = !1, 25 <= a) throw Error(i(301));
			if (a += 1, Uo = Ho = null, e.updateQueue != null) {
				var o = e.updateQueue;
				o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
			}
			N.H = gc, o = t(n, r);
		} while (Go);
		return o;
	}
	function ns() {
		var e = N.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? cs(t) : t, e = e.useState()[0], (Ho === null ? null : Ho.memoizedState) !== e && (H.flags |= 1024), t;
	}
	function rs() {
		var e = qo !== 0;
		return qo = 0, e;
	}
	function is(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function as(e) {
		if (Wo) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			Wo = !1;
		}
		Vo = 0, Uo = Ho = H = null, Go = !1, Jo = qo = 0, Yo = null;
	}
	function U() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return Uo === null ? H.memoizedState = Uo = e : Uo = Uo.next = e, Uo;
	}
	function os() {
		if (Ho === null) {
			var e = H.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = Ho.next;
		var t = Uo === null ? H.memoizedState : Uo.next;
		if (t !== null) Uo = t, Ho = e;
		else {
			if (e === null) throw H.alternate === null ? Error(i(467)) : Error(i(310));
			Ho = e, e = {
				memoizedState: Ho.memoizedState,
				baseState: Ho.baseState,
				baseQueue: Ho.baseQueue,
				queue: Ho.queue,
				next: null
			}, Uo === null ? H.memoizedState = Uo = e : Uo = Uo.next = e;
		}
		return Uo;
	}
	function ss() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function cs(e) {
		var t = Jo;
		return Jo += 1, Yo === null && (Yo = []), e = $a(Yo, e, t), t = H, (Uo === null ? t.memoizedState : Uo.next) === null && (t = t.alternate, N.H = t === null || t.memoizedState === null ? mc : hc), e;
	}
	function W(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return cs(e);
			if (e.$$typeof === fe) return;
			if (e.$$typeof === re) return wa(e);
		}
		throw Error(i(438, String(e)));
	}
	function ls(e) {
		var t = null, n = H.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = H.alternate;
			r !== null && (r = r.updateQueue, r !== null && (r = r.memoCache, r != null && (t = {
				data: r.data.map(function(e) {
					return e.slice();
				}),
				index: 0
			})));
		}
		if (t ??= {
			data: [],
			index: 0
		}, n === null && (n = ss(), H.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = ue;
		return t.index++, n;
	}
	function us(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function ds(e) {
		return fs(os(), Ho, e);
	}
	function fs(e, t, n) {
		var r = e.queue;
		if (r === null) throw Error(i(311));
		r.lastRenderedReducer = n;
		var a = e.baseQueue, o = r.pending;
		if (o !== null) {
			if (a !== null) {
				var s = a.next;
				a.next = o.next, o.next = s;
			}
			t.baseQueue = a = o, r.pending = null;
		}
		if (o = e.baseState, a === null) e.memoizedState = o;
		else {
			t = a.next;
			var c = s = null, l = null, u = t, d = !1;
			do {
				var f = u.lane & -536870913;
				if (f === u.lane ? (Vo & f) === f : (J & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === Ra && (d = !0);
					else if ((Vo & p) === p) {
						u = u.next, p === Ra && (d = !0);
						continue;
					} else f = {
						lane: 0,
						revertLane: u.revertLane,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}, l === null ? (c = l = f, s = o) : l = l.next = f, H.lanes |= p, cd |= p;
					f = u.action, Ko && n(o, f), o = u.hasEagerState ? u.eagerState : n(o, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, s = o) : l = l.next = p, H.lanes |= f, cd |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? s = o : l.next = c, !Vr(o, e.memoizedState) && (Mc = !0, d && (n = za, n !== null))) throw n;
			e.memoizedState = o, e.baseState = s, e.baseQueue = l, r.lastRenderedState = o;
		}
		return a === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function ps(e) {
		var t = os(), n = t.queue;
		if (n === null) throw Error(i(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, a = n.pending, o = t.memoizedState;
		if (a !== null) {
			n.pending = null;
			var s = a = a.next;
			do
				o = e(o, s.action), s = s.next;
			while (s !== a);
			Vr(o, t.memoizedState) || (Mc = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
		}
		return [o, r];
	}
	function ms(e, t, n) {
		var r = H, a = os(), o = B;
		if (o) {
			if (n === void 0) throw Error(i(407));
			n = n();
		} else n = t();
		var s = !Vr((Ho || a).memoizedState, n);
		if (s && (a.memoizedState = n, Mc = !0), a = a.queue, zs(_s.bind(null, r, a, e), [e]), e = a.getSnapshot !== t || s || Uo !== null && !!(Uo.memoizedState.tag & 1), Ps(e ? 9 : 8, { destroy: void 0 }, gs.bind(null, r, a, n, t), null), e) {
			if (r.flags |= 2048, ed === null) throw Error(i(349));
			o || Vo & 127 || hs(r, t, n);
		}
		return n;
	}
	function hs(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = H.updateQueue, t === null ? (t = ss(), H.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function gs(e, t, n, r) {
		t.value = n, t.getSnapshot = r, vs(t) && ys(e);
	}
	function _s(e, t, n) {
		return n(function() {
			vs(t) && ys(e);
		});
	}
	function vs(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !Vr(e, n);
		} catch {
			return !0;
		}
	}
	function ys(e) {
		var t = Di(e, 2);
		t !== null && Fd(t, e, 2);
	}
	function bs(e) {
		var t = U();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), Ko) {
				$e(!0);
				try {
					n();
				} finally {
					$e(!1);
				}
			}
		}
		return t.memoizedState = t.baseState = e, t.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: us,
			lastRenderedState: e
		}, t;
	}
	function xs(e, t, n, r) {
		return e.baseState = n, fs(e, Ho, typeof r == "function" ? r : us);
	}
	function Ss(e, t, n, r, a) {
		if (uc(e)) throw Error(i(485));
		if (e = t.action, e !== null) {
			var o = {
				payload: a,
				action: e,
				next: null,
				isTransition: !0,
				status: "pending",
				value: null,
				reason: null,
				listeners: [],
				then: function(e) {
					o.listeners.push(e);
				}
			};
			N.T === null ? o.isTransition = !1 : n(!0), r(o), n = t.pending, n === null ? (o.next = t.pending = o, Cs(t, o)) : (o.next = n.next, t.pending = n.next = o);
		}
	}
	function Cs(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = N.T, o = {};
			o.types = a === null ? null : a.types, N.T = o;
			try {
				var s = n(i, r), c = N.S;
				c !== null && c(o, s), ws(e, t, s);
			} catch (n) {
				Es(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), N.T = a;
			}
		} else try {
			a = n(i, r), ws(e, t, a);
		} catch (n) {
			Es(e, t, n);
		}
	}
	function ws(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			Ts(e, t, n);
		}, function(n) {
			return Es(e, t, n);
		}) : Ts(e, t, n);
	}
	function Ts(e, t, n) {
		t.status = "fulfilled", t.value = n, Ds(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, Cs(e, n)));
	}
	function Es(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, Ds(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function Ds(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function Os(e, t) {
		return t;
	}
	function ks(e, t) {
		if (B) {
			var n = ed.formState;
			if (n !== null) {
				e: {
					var r = H;
					if (B) {
						if (ia) {
							t: {
								for (var i = ia, a = oa; i.nodeType !== 8;) if (!a || (i = dm(i.nextSibling), i === null)) {
									i = null;
									break t;
								}
								a = i.data, i = a === "F!" || a === "F" ? i : null;
							}
							if (i) {
								ia = dm(i.nextSibling), r = i.data === "F!";
								break e;
							}
						}
						ca(r);
					}
					r = !1;
				}
				r && (t = n[0]);
			}
		}
		return n = U(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: Os,
			lastRenderedState: t
		}, n.queue = r, n = sc.bind(null, H, r), r.dispatch = n, r = bs(!1), a = lc.bind(null, H, !1, r.queue), r = U(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = Ss.bind(null, H, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function As(e) {
		return js(os(), Ho, e);
	}
	function js(e, t, n) {
		if (t = fs(e, t, Os)[0], e = ds(us)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = cs(t);
		} catch (e) {
			throw e === Ja ? Xa : e;
		}
		else r = t;
		t = os();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (H.flags |= 2048, Ps(9, { destroy: void 0 }, Ms.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function Ms(e, t) {
		e.action = t;
	}
	function Ns(e) {
		var t = os(), n = Ho;
		if (n !== null) return js(t, n, e);
		os(), t = t.memoizedState, n = os();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function Ps(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = H.updateQueue, t === null && (t = ss(), H.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function Fs() {
		return os().memoizedState;
	}
	function Is(e, t, n, r) {
		var i = U();
		H.flags |= e, i.memoizedState = Ps(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function Ls(e, t, n, r) {
		var i = os();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		Ho !== null && r !== null && Qo(r, Ho.memoizedState.deps) ? i.memoizedState = Ps(t, a, n, r) : (H.flags |= e, i.memoizedState = Ps(1 | t, a, n, r));
	}
	function Rs(e, t) {
		Is(8390656, 8, e, t);
	}
	function zs(e, t) {
		Ls(2048, 8, e, t);
	}
	function Bs(e) {
		H.flags |= 4;
		var t = H.updateQueue;
		if (t === null) t = ss(), H.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function Vs(e) {
		var t = os().memoizedState;
		return Bs({
			ref: t,
			nextImpl: e
		}), function() {
			if ($u & 2) throw Error(i(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function Hs(e, t) {
		return Ls(4, 2, e, t);
	}
	function Us(e, t) {
		return Ls(4, 4, e, t);
	}
	function Ws(e, t) {
		if (typeof t == "function") {
			e = e();
			var n = t(e);
			return function() {
				typeof n == "function" ? n() : t(null);
			};
		}
		if (t != null) return e = e(), t.current = e, function() {
			t.current = null;
		};
	}
	function Gs(e, t, n) {
		n = n == null ? null : n.concat([e]), Ls(4, 4, Ws.bind(null, t, e), n);
	}
	function Ks() {}
	function qs(e, t) {
		var n = os();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && Qo(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function Js(e, t) {
		var n = os();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && Qo(t, r[1])) return r[0];
		if (r = e(), Ko) {
			$e(!0);
			try {
				e();
			} finally {
				$e(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function Ys(e, t, n) {
		return n === void 0 || Vo & 0x40000000 && !(J & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = Nd(), H.lanes |= e, cd |= e, n);
	}
	function Xs(e, t, n, r) {
		return Vr(n, t) ? n : To.current === null ? !(Vo & 106) || Vo & 0x40000000 && !(J & 261930) ? (Mc = !0, e.memoizedState = n) : (e = Nd(), H.lanes |= e, cd |= e, t) : (e = Ys(e, n, r), Vr(e, t) || (Mc = !0), e);
	}
	function Zs(e, t, n, r, i) {
		var a = ve.p;
		ve.p = a !== 0 && 8 > a ? a : 8;
		var o = N.T, s = {};
		s.types = o === null ? null : o.types, N.T = s, lc(e, !1, t, n);
		try {
			var c = i(), l = N.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? cc(e, t, Ha(c, r), Md(e)) : cc(e, t, r, Md(e));
		} catch (n) {
			cc(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, Md());
		} finally {
			ve.p = a, o !== null && s.types !== null && (o.types = s.types), N.T = o;
		}
	}
	function Qs() {}
	function $s(e, t, n, r) {
		if (e.tag !== 5) throw Error(i(476));
		Zs(e, ec(e).queue, t, ye, n === null ? Qs : function() {
			return tc(e), n(r);
		});
	}
	function ec(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: ye,
			baseState: ye,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: us,
				lastRenderedState: ye
			},
			next: null
		};
		var n = {};
		return t.next = {
			memoizedState: n,
			baseState: n,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: us,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function tc(e) {
		var t = ec(e);
		t.next === null && (t = e.alternate.memoizedState), cc(e, t.next.queue, {}, Md());
	}
	function nc() {
		return wa(ch);
	}
	function rc() {
		return os().memoizedState;
	}
	function ic() {
		return os().memoizedState;
	}
	function ac(e) {
		for (var t = e.return; t !== null;) {
			switch (t.tag) {
				case 24:
				case 3:
					var n = Md();
					e = go(n);
					var r = _o(t, e, n);
					r !== null && (Fd(r, t, n), vo(r, t, n)), t = { cache: ja() }, e.payload = t;
					return;
			}
			t = t.return;
		}
	}
	function oc(e, t, n) {
		var r = Md();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, uc(e) ? dc(t, n) : (n = Ei(e, t, n, r), n !== null && (Fd(n, e, r), fc(n, t, r)));
	}
	function sc(e, t, n) {
		cc(e, t, n, Md());
	}
	function cc(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (uc(e)) dc(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, Vr(s, o)) return Ti(e, t, i, 0), ed === null && wi(), !1;
			} catch {}
			if (n = Ei(e, t, i, r), n !== null) return Fd(n, e, r), fc(n, t, r), !0;
		}
		return !1;
	}
	function lc(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: Ff(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, uc(e)) {
			if (t) throw Error(i(479));
		} else t = Ei(e, n, r, 2), t !== null && Fd(t, e, 2);
	}
	function uc(e) {
		var t = e.alternate;
		return e === H || t !== null && t === H;
	}
	function dc(e, t) {
		Go = Wo = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function fc(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, _t(e, n);
		}
	}
	var pc = {
		readContext: wa,
		use: W,
		useCallback: Zo,
		useContext: Zo,
		useEffect: Zo,
		useImperativeHandle: Zo,
		useLayoutEffect: Zo,
		useInsertionEffect: Zo,
		useMemo: Zo,
		useReducer: Zo,
		useRef: Zo,
		useState: Zo,
		useDebugValue: Zo,
		useDeferredValue: Zo,
		useTransition: Zo,
		useSyncExternalStore: Zo,
		useId: Zo,
		useHostTransitionStatus: Zo,
		useFormState: Zo,
		useActionState: Zo,
		useOptimistic: Zo,
		useMemoCache: Zo,
		useCacheRefresh: Zo,
		useEffectEvent: Zo
	}, mc = {
		readContext: wa,
		use: W,
		useCallback: function(e, t) {
			return U().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: wa,
		useEffect: Rs,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), Is(4194308, 4, Ws.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return Is(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			Is(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = U();
			t = t === void 0 ? null : t;
			var r = e();
			if (Ko) {
				$e(!0);
				try {
					e();
				} finally {
					$e(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		},
		useReducer: function(e, t, n) {
			var r = U();
			if (n !== void 0) {
				var i = n(t);
				if (Ko) {
					$e(!0);
					try {
						n(t);
					} finally {
						$e(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = oc.bind(null, H, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = U();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = bs(e);
			var t = e.queue, n = sc.bind(null, H, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: Ks,
		useDeferredValue: function(e, t) {
			return Ys(U(), e, t);
		},
		useTransition: function() {
			var e = bs(!1);
			return e = Zs.bind(null, H, e.queue, !0, !1), U().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = H, a = U();
			if (B) {
				if (n === void 0) throw Error(i(407));
				n = n();
			} else {
				if (n = t(), ed === null) throw Error(i(349));
				J & 127 || hs(r, t, n);
			}
			a.memoizedState = n;
			var o = {
				value: n,
				getSnapshot: t
			};
			return a.queue = o, Rs(_s.bind(null, r, o, e), [e]), r.flags |= 2048, Ps(9, { destroy: void 0 }, gs.bind(null, r, o, n, t), null), n;
		},
		useId: function() {
			var e = U(), t = ed.identifierPrefix;
			if (B) {
				var n = Zi, r = Xi;
				n = (r & ~(1 << 32 - et(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = qo++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = Xo++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: nc,
		useFormState: ks,
		useActionState: ks,
		useOptimistic: function(e) {
			var t = U();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = lc.bind(null, H, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: ls,
		useCacheRefresh: function() {
			return U().memoizedState = ac.bind(null, H);
		},
		useEffectEvent: function(e) {
			var t = U(), n = { impl: e };
			return t.memoizedState = n, function() {
				if ($u & 2) throw Error(i(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, hc = {
		readContext: wa,
		use: W,
		useCallback: qs,
		useContext: wa,
		useEffect: zs,
		useImperativeHandle: Gs,
		useInsertionEffect: Hs,
		useLayoutEffect: Us,
		useMemo: Js,
		useReducer: ds,
		useRef: Fs,
		useState: function() {
			return ds(us);
		},
		useDebugValue: Ks,
		useDeferredValue: function(e, t) {
			return Xs(os(), Ho.memoizedState, e, t);
		},
		useTransition: function() {
			var e = ds(us)[0], t = os().memoizedState;
			return [typeof e == "boolean" ? e : cs(e), t];
		},
		useSyncExternalStore: ms,
		useId: rc,
		useHostTransitionStatus: nc,
		useFormState: As,
		useActionState: As,
		useOptimistic: function(e, t) {
			return xs(os(), Ho, e, t);
		},
		useMemoCache: ls,
		useCacheRefresh: ic,
		useEffectEvent: Vs
	}, gc = {
		readContext: wa,
		use: W,
		useCallback: qs,
		useContext: wa,
		useEffect: zs,
		useImperativeHandle: Gs,
		useInsertionEffect: Hs,
		useLayoutEffect: Us,
		useMemo: Js,
		useReducer: ps,
		useRef: Fs,
		useState: function() {
			return ps(us);
		},
		useDebugValue: Ks,
		useDeferredValue: function(e, t) {
			var n = os();
			return Ho === null ? Ys(n, e, t) : Xs(n, Ho.memoizedState, e, t);
		},
		useTransition: function() {
			var e = ps(us)[0], t = os().memoizedState;
			return [typeof e == "boolean" ? e : cs(e), t];
		},
		useSyncExternalStore: ms,
		useId: rc,
		useHostTransitionStatus: nc,
		useFormState: Ns,
		useActionState: Ns,
		useOptimistic: function(e, t) {
			var n = os();
			return Ho === null ? (n.baseState = e, [e, n.queue.dispatch]) : xs(n, Ho, e, t);
		},
		useMemoCache: ls,
		useCacheRefresh: ic,
		useEffectEvent: Vs
	};
	function _c(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : D({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var vc = {
		enqueueSetState: function(e, t, n) {
			e = e._reactInternals;
			var r = Md(), i = go(r);
			i.payload = t, n != null && (i.callback = n), t = _o(e, i, r), t !== null && (Fd(t, e, r), vo(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = Md(), i = go(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = _o(e, i, r), t !== null && (Fd(t, e, r), vo(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = Md(), r = go(n);
			r.tag = 2, t != null && (r.callback = t), t = _o(e, r, n), t !== null && (Fd(t, e, n), vo(t, e, n));
		}
	};
	function yc(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !Hr(n, r) || !Hr(i, a) : !0;
	}
	function bc(e, t, n, r) {
		e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && vc.enqueueReplaceState(t, t.state, null);
	}
	function xc(e, t) {
		var n = t;
		if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
		if (e = e.defaultProps) for (var i in n === t && (n = D({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
		return n;
	}
	function Sc(e) {
		bi(e);
	}
	function Cc(e) {
		console.error(e);
	}
	function wc(e) {
		bi(e);
	}
	function Tc(e, t) {
		try {
			(0, e.onUncaughtError)(t.value, { componentStack: t.stack });
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Ec(e, t, n) {
		try {
			(0, e.onCaughtError)(n.value, {
				componentStack: n.stack,
				errorBoundary: t.tag === 1 ? t.stateNode : null
			});
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Dc(e, t, n) {
		return n = go(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			Tc(e, t);
		}, n;
	}
	function Oc(e) {
		return e = go(e), e.tag = 3, e;
	}
	function kc(e, t, n, r) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var a = r.value;
			e.payload = function() {
				return i(a);
			}, e.callback = function() {
				Ec(t, n, r);
			};
		}
		var o = n.stateNode;
		o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
			Ec(t, n, r), typeof i != "function" && (bd === null ? bd = /* @__PURE__ */ new Set([this]) : bd.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function Ac(e, t, n, r, a) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && xa(t, n, a, !0), n = Ao.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13:
					case 19: return jo === null ? qd() : n.alternate === null && sd === 0 && (sd = 3), n.flags &= -257, n.flags |= 65536, n.lanes = a, r === Za ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([r]) : t.add(r), gf(e, r, a)), !1;
					case 22: return n.flags |= 65536, r === Za ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: /* @__PURE__ */ new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([r]) : n.add(r)), gf(e, r, a)), !1;
				}
				throw Error(i(435, n.tag));
			}
			return gf(e, r, a), qd(), !1;
		}
		if (B) return t = Ao.current, t === null ? (r !== sa && (t = Error(i(423), { cause: r }), ma(Hi(t, n))), e = e.current.alternate, e.flags |= 65536, a &= -a, e.lanes |= a, r = Hi(r, n), a = Dc(e.stateNode, r, a), yo(e, a), sd !== 4 && (sd = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = a, r !== sa && (e = Error(i(422), { cause: r }), ma(Hi(e, n)))), !1;
		var o = Error(i(520), { cause: r });
		if (o = Hi(o, n), pd === null ? pd = [o] : pd.push(o), sd !== 4 && (sd = 2), t === null) return !0;
		r = Hi(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = a & -a, n.lanes |= e, e = Dc(n.stateNode, r, e), yo(n, e), !1;
				case 1:
					if (t = n.type, o = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (bd === null || !bd.has(o)))) return n.flags |= 65536, a &= -a, n.lanes |= a, a = Oc(a), kc(a, e, n, r), yo(n, a), !1;
					break;
				case 22: if (n.memoizedState !== null) return n.flags |= 65536, !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var jc = Error(i(461)), Mc = !1;
	function Nc(e, t, n, r) {
		t.child = e === null ? fo(t, null, n, r) : uo(t, e.child, n, r);
	}
	function Pc(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return Ca(t), r = $o(e, t, n, o, a, i), s = rs(), e !== null && !Mc ? (is(e, t, i), G(e, t, i)) : (B && s && ea(t), t.flags |= 1, Nc(e, t, r, i), t.child);
	}
	function Fc(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !Ni(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, Ic(e, t, a, r, i)) : (e = Ii(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !cl(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? Hr : n, n(o, r) && e.ref === t.ref) return G(e, t, i);
		}
		return t.flags |= 1, e = Pi(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function Ic(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (Hr(a, r) && e.ref === t.ref) {
				if (Mc = !1, t.pendingProps = r = a, cl(e, i)) e.flags & 131072 && (Mc = !0);
				else return t.lanes = e.lanes, G(e, t, i);
			}
		}
		return Wc(e, t, n, r, i);
	}
	function Lc(e, t, n, r) {
		var i = r.children, a = e === null ? null : e.memoizedState;
		if (e === null && t.stateNode === null && (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), r.mode === "hidden") {
			if (t.flags & 128) {
				if (a = a === null ? n : a.baseLanes | n, e !== null) {
					for (r = t.child = e.child, i = 0; r !== null;) i = i | r.lanes | r.childLanes, r = r.sibling;
					r = i & ~a;
				} else r = 0, t.child = null;
				return zc(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && Ka(t, a === null ? null : a.cachePool), a === null ? Oo() : Do(t, a), Po(t);
			else return r = t.lanes = 536870912, zc(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && Ka(t, null), Oo(), Fo()) : (Ka(t, a.cachePool), Do(t, a), Fo(), t.memoizedState = null);
		return Nc(e, t, i, n), t.child;
	}
	function Rc(e, t) {
		return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), t.sibling;
	}
	function zc(e, t, n, r, i) {
		var a = Ga();
		return a = a === null ? null : {
			parent: Aa._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && Ka(t, null), Oo(), Po(t), e !== null && xa(e, t, r, !0), t.childLanes = i, null;
	}
	function Bc(e, t) {
		return t = $c({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function Vc(e, t, n) {
		return uo(t, e.child, null, n), e = Bc(t, t.pendingProps), e.flags |= 2, Io(t), t.memoizedState = null, e;
	}
	function Hc(e, t, n) {
		var r = t.pendingProps, a = !!(t.flags & 128);
		if (t.flags &= -129, e === null) {
			if (B) {
				if (r.mode === "hidden") return e = Bc(t, r), t.lanes = 536870912, e.memoizedState = {
					baseLanes: 0,
					cachePool: null
				}, Rc(null, e);
				if (No(t), (e = ia) ? (e = sm(e, oa), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Yi === null ? null : {
						id: Xi,
						overflow: Zi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = zi(e), n.return = t, t.child = n, ra = t, ia = null)) : e = null, e === null) throw ca(t);
				return t.lanes = 536870912, null;
			}
			return Bc(t, r);
		}
		var o = e.memoizedState;
		if (o !== null) {
			var s = o.dehydrated;
			if (No(t), a) {
				if (t.flags & 256) t.flags &= -257, t = Vc(e, t, n);
				else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
				else throw Error(i(558));
			} else if (Mc || xa(e, t, n, !1), a = (n & e.childLanes) !== 0, Mc || a) {
				if (To.current === null) {
					if (r = ed, r !== null && (s = vt(r, n), s !== 0 && s !== o.retryLane)) throw o.retryLane = s, Di(e, s), Fd(r, e, s), jc;
					qd();
				}
				t = Vc(e, t, n);
			} else e = o.treeContext, ia = dm(s.nextSibling), ra = t, B = !0, aa = null, oa = !1, e !== null && na(t, e), t = Bc(t, r), t.flags |= 0x8001000;
			return t;
		}
		return e = Pi(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function Uc(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(i(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function Wc(e, t, n, r, i) {
		return Ca(t), n = $o(e, t, n, r, void 0, i), r = rs(), e !== null && !Mc ? (is(e, t, i), G(e, t, i)) : (B && r && ea(t), t.flags |= 1, Nc(e, t, n, i), t.child);
	}
	function Gc(e, t, n, r, i, a) {
		return Ca(t), t.updateQueue = null, n = ts(t, r, n, i), es(e), r = rs(), e !== null && !Mc ? (is(e, t, a), G(e, t, a)) : (B && r && ea(t), t.flags |= 1, Nc(e, t, n, a), t.child);
	}
	function Kc(e, t, n, r, i) {
		if (Ca(t), t.stateNode === null) {
			var a = Ai, o = n.contextType;
			typeof o == "object" && o && (a = wa(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = vc, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, mo(t), o = n.contextType, a.context = typeof o == "object" && o ? wa(o) : Ai, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (_c(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && vc.enqueueReplaceState(a, a.state, null), So(t, r, a, i), xo(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = xc(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = Ai, typeof u == "object" && u && (o = wa(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && bc(t, a, r, o), po = !1;
			var f = t.memoizedState;
			a.state = f, So(t, r, a, i), xo(), l = t.memoizedState, s || f !== l || po ? (typeof d == "function" && (_c(t, n, d, r), l = t.memoizedState), (c = po || yc(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, ho(e, t), o = t.memoizedProps, u = xc(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = Ai, typeof l == "object" && l && (c = wa(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && bc(t, a, r, c), po = !1, f = t.memoizedState, a.state = f, So(t, r, a, i), xo();
			var p = t.memoizedState;
			o !== d || f !== p || po || e !== null && e.dependencies !== null && Sa(e.dependencies) ? (typeof s == "function" && (_c(t, n, s, r), p = t.memoizedState), (u = po || yc(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && Sa(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, Uc(e, t), r = !!(t.flags & 128), a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = uo(t, e.child, null, i), t.child = uo(t, null, n, i)) : Nc(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = G(e, t, i), e;
	}
	function qc(e, t, n, r) {
		return fa(), t.flags |= 256, Nc(e, t, n, r), t.child;
	}
	var Jc = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function Yc(e) {
		return {
			baseLanes: e,
			cachePool: qa()
		};
	}
	function Xc(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= dd), e;
	}
	function Zc(e, t, n) {
		var r = t.pendingProps, i = !1, a = !!(t.flags & 128), o;
		if ((o = a) || (o = e !== null && e.memoizedState === null ? !1 : !!(Lo.current & 2)), o && (i = !0, t.flags &= -129), o = !!(t.flags & 32), t.flags &= -33, e === null) {
			if (B) {
				if (i ? Mo(t) : Fo(), (e = ia) ? (e = sm(e, oa), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Yi === null ? null : {
						id: Xi,
						overflow: Zi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = zi(e), n.return = t, t.child = n, ra = t, ia = null)) : e = null, e === null) throw ca(t);
				return t.lanes = lm(e) ? 32 : 536870912, null;
			}
			return a = r.children, r = r.fallback, i ? (Fo(), i = t.mode, a = $c({
				mode: "hidden",
				children: a
			}, i), r = Li(r, i, n, null), a.return = t, r.return = t, a.sibling = r, t.child = a, r = t.child, r.memoizedState = Yc(n), r.childLanes = Xc(e, o, n), t.memoizedState = Jc, Rc(null, r)) : (Mo(t), Qc(t, a));
		}
		var s = e.memoizedState;
		if (s !== null) {
			var c = s.dehydrated;
			if (c !== null) return tl(e, t, a, o, r, c, s, n);
		}
		return i ? (Fo(), i = r.fallback, a = t.mode, s = e.child, c = s.sibling, r = Pi(s, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = s.subtreeFlags & 0x47f00000, c === null ? (i = Li(i, a, n, null), i.flags |= 2) : i = Pi(c, i), i.return = t, r.return = t, r.sibling = i, t.child = r, Rc(null, r), r = t.child, i = e.child.memoizedState, i === null ? i = Yc(n) : (a = i.cachePool, a === null ? a = qa() : (s = Aa._currentValue, a = a.parent === s ? a : {
			parent: s,
			pool: s
		}), i = {
			baseLanes: i.baseLanes | n,
			cachePool: a
		}), r.memoizedState = i, r.childLanes = Xc(e, o, n), t.memoizedState = Jc, Rc(e.child, r)) : (Mo(t), n = e.child, e = n.sibling, n = Pi(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (o = t.deletions, o === null ? (t.deletions = [e], t.flags |= 16) : o.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function Qc(e, t) {
		return t = $c({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function $c(e, t) {
		return e = Mi(22, e, null, t), e.lanes = 0, e;
	}
	function el(e, t, n) {
		return uo(t, e.child, null, n), e = Qc(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function tl(e, t, n, r, a, o, s, c) {
		if (n) return t.flags & 256 ? (Mo(t), t.flags &= -257, el(e, t, c)) : t.memoizedState === null ? (Fo(), o = a.fallback, s = t.mode, a = $c({
			mode: "visible",
			children: a.children
		}, s), o = Li(o, s, c, null), o.flags |= 2, a.return = t, o.return = t, a.sibling = o, t.child = a, uo(t, e.child, null, c), a = t.child, a.memoizedState = Yc(c), a.childLanes = Xc(e, r, c), t.memoizedState = Jc, Rc(null, a)) : (Fo(), t.child = e.child, t.flags |= 128, null);
		if (Mo(t), lm(o)) {
			if (r = o.nextSibling && o.nextSibling.dataset, r) var l = r.dgst;
			return r = l, r !== "" && (a = Error(i(419)), a.stack = "", a.digest = r, ma({
				value: a,
				source: null,
				stack: null
			})), el(e, t, c);
		}
		if (Mc || xa(e, t, c, !1), r = (c & e.childLanes) !== 0, Mc || r) {
			if (To.current !== null) return el(e, t, c);
			if (r = ed, r !== null && (a = vt(r, c), a !== 0 && a !== s.retryLane)) throw s.retryLane = a, Di(e, a), Fd(r, e, a), jc;
			return cm(o) || qd(), el(e, t, c);
		}
		return cm(o) ? (t.flags |= 192, t.child = e.child, null) : (e = s.treeContext, ia = dm(o.nextSibling), ra = t, B = !0, aa = null, oa = !1, e !== null && na(t, e), t = Qc(t, a.children), t.flags |= 0x8001000, t);
	}
	function nl(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), ya(e.return, t, n);
	}
	function rl(e) {
		for (var t = null; e !== null;) {
			var n = e.alternate;
			n !== null && Bo(n) === null && (t = e), e = e.sibling;
		}
		return t;
	}
	function il(e, t, n, r, i, a) {
		var o = e.memoizedState;
		o === null ? e.memoizedState = {
			isBackwards: t,
			rendering: null,
			renderingStartTime: 0,
			last: r,
			tail: n,
			tailMode: i,
			treeForkCount: a
		} : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = i, o.treeForkCount = a);
	}
	function al(e) {
		var t = e.child;
		for (e.child = null; t !== null;) {
			var n = t.sibling;
			t.sibling = e.child, e.child = t, t = n;
		}
	}
	function ol(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = Lo.current;
		if (t.flags & 128) return Ro(t, o), null;
		var s = !!(o & 2);
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, Ro(t, o), i === "backwards" && e !== null ? (al(e), Nc(e, t, r, n), al(e)) : Nc(e, t, r, n), r = B ? Ki : 0, !s && e !== null && e.flags & 128) e: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && nl(e, n, t);
			else if (e.tag === 19) nl(e, n, t);
			else if (e.child !== null) {
				e.child.return = e, e = e.child;
				continue;
			}
			if (e === t) break;
			for (; e.sibling === null;) {
				if (e.return === null || e.return === t) break e;
				e = e.return;
			}
			e.sibling.return = e.return, e = e.sibling;
		}
		switch (i) {
			case "backwards":
				n = rl(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null, al(t)), il(t, !0, i, null, a, r);
				break;
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && Bo(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				il(t, !0, n, null, a, r);
				break;
			case "together":
				il(t, !1, null, null, void 0, r);
				break;
			case "independent":
				t.memoizedState = null;
				break;
			default: n = rl(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), il(t, !1, i, n, a, r);
		}
		return t.child;
	}
	function sl(e, t, n) {
		var r = t.pendingProps;
		return va(t, t.type, r.value), Nc(e, t, r.children, n), t.child;
	}
	function G(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), cd |= t.lanes, (n & t.childLanes) === 0) {
			if (e !== null) {
				if (xa(e, t, n, !1), (n & t.childLanes) === 0) return null;
			} else return null;
		}
		if (e !== null && t.child !== e.child) throw Error(i(153));
		if (t.child !== null) {
			for (e = t.child, n = Pi(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = Pi(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function cl(e, t) {
		return (e.lanes & t) !== 0 || (e = e.dependencies, !!(e !== null && Sa(e)));
	}
	function ll(e, t, n) {
		switch (t.tag) {
			case 3:
				De(t, t.stateNode.containerInfo), va(t, Aa, e.memoizedState.cache), fa();
				break;
			case 27:
			case 5:
				ke(t);
				break;
			case 4:
				De(t, t.stateNode.containerInfo);
				break;
			case 10:
				va(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, No(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) {
					if (r.dehydrated !== null) return Mo(t), t.flags |= 128, null;
					r = xa(e, t, n, !1);
					var i = t.child.childLanes;
					return r || (n & i) !== 0 ? Zc(e, t, n) : (Mo(t), e = G(e, t, n), e === null ? null : e.sibling);
				}
				Mo(t);
				break;
			case 19:
				if (t.flags & 128) return ol(e, t, n);
				if (i = !!(e.flags & 128), r = (n & t.childLanes) !== 0, r ||= (xa(e, t, n, !1), (n & t.childLanes) !== 0), i) {
					if (r) return ol(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), Ro(t, Lo.current), r) break;
				return null;
			case 22: return t.lanes = 0, Lc(e, t, n, t.pendingProps);
			case 24: va(t, Aa, e.memoizedState.cache);
		}
		return G(e, t, n);
	}
	function ul(e, t, n) {
		if (e !== null) {
			if (e.memoizedProps !== t.pendingProps) Mc = !0;
			else {
				if (!cl(e, n) && !(t.flags & 128)) return Mc = !1, ll(e, t, n);
				Mc = !!(e.flags & 131072);
			}
		} else Mc = !1, B && t.flags & 1048576 && $i(t, Ki, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				e: {
					var r = t.pendingProps;
					if (e = eo(t.elementType), t.type = e, typeof e == "function") Ni(e) ? (r = xc(e, r), t.tag = 1, t = Kc(null, t, e, r, n)) : (t.tag = 0, t = Wc(null, t, e, r, n));
					else {
						if (e != null) {
							var a = e.$$typeof;
							if (a === M) {
								t.tag = 11, t = Pc(null, t, e, r, n);
								break e;
							}
							if (a === oe) {
								t.tag = 14, t = Fc(null, t, e, r, n);
								break e;
							}
							if (a === re) {
								t.tag = 10, t.type = e, t = sl(null, t, n);
								break e;
							}
						}
						throw t = ge(e) || e, Error(i(306, t, ""));
					}
				}
				return t;
			case 0: return Wc(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, a = xc(r, t.pendingProps), Kc(e, t, r, a, n);
			case 3:
				e: {
					if (De(t, t.stateNode.containerInfo), e === null) throw Error(i(387));
					r = t.pendingProps;
					var o = t.memoizedState;
					a = o.element, ho(e, t), So(t, r, null, n);
					var s = t.memoizedState;
					if (r = s.cache, va(t, Aa, r), r !== o.cache && ba(t, [Aa], n, !0), xo(), r = s.element, o.isDehydrated) {
						if (o = {
							element: r,
							isDehydrated: !1,
							cache: s.cache
						}, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
							t = qc(e, t, r, n);
							break e;
						}
						if (r !== a) {
							a = Hi(Error(i(424)), t), ma(a), t = qc(e, t, r, n);
							break e;
						}
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (ia = dm(e.firstChild), ra = t, B = !0, aa = null, oa = !0, n = fo(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 0x8001000, n = n.sibling;
					} else {
						if (fa(), r === a) {
							t = G(e, t, n);
							break e;
						}
						Nc(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return Uc(e, t), e === null ? (n = Fm(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : B || (t.stateNode = mp(t.type, t.pendingProps, F.current, t)) : t.memoizedState = Fm(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return ke(t), e === null && B && (r = t.stateNode = _m(t.type, t.pendingProps, F.current), ra = t, oa = !0, a = ia, wp(t.type) ? (fm = a, ia = dm(r.firstChild)) : ia = a), Nc(e, t, t.pendingProps.children, n), Uc(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && B && ((a = r = ia) && (r = am(r, t.type, t.pendingProps, oa), r === null ? a = !1 : (t.stateNode = r, ra = t, ia = dm(r.firstChild), oa = !1, a = !0)), a || ca(t)), ke(t), a = t.type, o = t.pendingProps, s = e === null ? null : e.memoizedProps, r = o.children, hp(a, o) ? r = null : s !== null && hp(a, s) && (t.flags |= 32), t.memoizedState !== null && (a = $o(e, t, ns, null, null, n), ch._currentValue = a), Uc(e, t), Nc(e, t, r, n), t.child;
			case 6: return e === null && B && ((e = n = ia) && (n = om(n, t.pendingProps, oa), n === null ? e = !1 : (t.stateNode = n, ra = t, ia = null, e = !0)), e || ca(t)), null;
			case 13: return Zc(e, t, n);
			case 4: return De(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = uo(t, null, r, n) : Nc(e, t, r, n), t.child;
			case 11: return Pc(e, t, t.type, t.pendingProps, n);
			case 7: return r = t.pendingProps, Uc(e, t), Nc(e, t, r, n), t.child;
			case 8:
			case 12: return Nc(e, t, t.pendingProps.children, n), t.child;
			case 10: return sl(e, t, n);
			case 9: return a = t.type._context, r = t.pendingProps.children, Ca(t), a = wa(a), r = r(a), t.flags |= 1, Nc(e, t, r, n), t.child;
			case 14: return Fc(e, t, t.type, t.pendingProps, n);
			case 15: return Ic(e, t, t.type, t.pendingProps, n);
			case 19: return ol(e, t, n);
			case 31: return Hc(e, t, n);
			case 22: return Lc(e, t, n, t.pendingProps);
			case 24: return Ca(t), r = wa(Aa), e === null ? (a = Ga(), a === null && (a = ed, o = ja(), a.pooledCache = o, o.refCount++, o !== null && (a.pooledCacheLanes |= n), a = o), t.memoizedState = {
				parent: r,
				cache: a
			}, mo(t), va(t, Aa, a)) : ((e.lanes & n) !== 0 && (ho(e, t), So(t, null, null, n), xo()), a = e.memoizedState, o = t.memoizedState, a.parent === r ? (r = o.cache, va(t, Aa, r), r !== a.cache && ba(t, [Aa], n, !0)) : (a = {
				parent: r,
				cache: r
			}, t.memoizedState = a, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = a), va(t, Aa, r))), Nc(e, t, t.pendingProps.children, n), t.child;
			case 30: return t.stateNode === null && (t.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}), r = t.pendingProps, r.name != null && r.name !== "auto" ? t.flags |= e === null ? 18882560 : 18874368 : B && ea(t), e !== null && e.memoizedProps.name !== r.name ? t.flags |= 4194816 : Uc(e, t), Nc(e, t, r.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(i(156, t.tag));
	}
	function dl(e) {
		e.flags |= 4;
	}
	function fl(e, t, n, r, i) {
		var a;
		if ((a = !!(e.mode & 32)) && (a = n === null ? Xm(t, r) : Xm(t, r) && (r.src !== n.src || r.srcSet !== n.srcSet)), a) {
			if (e.flags |= 16777216, (i & 335544128) === i) {
				if (e.stateNode.complete) e.flags |= 8192;
				else if (Wd()) e.flags |= 8192;
				else throw to = Za, Ya;
			}
		} else e.flags &= -16777217;
	}
	function pl(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !Zm(t)) {
			if (Wd()) e.flags |= 8192;
			else throw to = Za, Ya;
		}
	}
	function ml(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : ft(), e.lanes |= t, fd |= t);
	}
	function hl(e, t) {
		if (!B) switch (e.tailMode) {
			case "visible": break;
			case "collapsed":
				for (var n = e.tail, r = null; n !== null;) n.alternate !== null && (r = n), n = n.sibling;
				r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
				break;
			default:
				for (t = e.tail, n = null; t !== null;) t.alternate !== null && (n = t), t = t.sibling;
				n === null ? e.tail = null : n.sibling = null;
		}
	}
	function gl(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 0x47f00000, r |= i.flags & 0x47f00000, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function _l(e, t, n) {
		var r = t.pendingProps;
		switch (ta(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14:
			case 1: return gl(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), V(Aa), Oe(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (da(t) ? dl(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, pa())), gl(t), null;
			case 26:
				var a = t.type, o = t.memoizedState;
				return e === null ? (dl(t), o === null ? (gl(t), fl(t, a, null, r, n)) : (gl(t), pl(t, o))) : o ? o === e.memoizedState ? (gl(t), t.flags &= -16777217) : (dl(t), gl(t), pl(t, o)) : (e = e.memoizedProps, e !== r && dl(t), gl(t), fl(t, a, e, r, n)), null;
			case 27:
				if (I(t), n = F.current, a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && dl(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return gl(t), t.subtreeFlags &= -33554433, null;
					}
					e = we.current, da(t) ? la(t, e) : (e = _m(a, r, n), t.stateNode = e, dl(t));
				}
				return gl(t), t.subtreeFlags &= -33554433, null;
			case 5:
				if (I(t), a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && dl(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return gl(t), t.subtreeFlags &= -33554433, null;
					}
					if (o = we.current, da(t)) la(t, o);
					else {
						var s = dp(F.current);
						switch (o) {
							case 1:
								o = s.createElementNS("http://www.w3.org/2000/svg", a);
								break;
							case 2:
								o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
								break;
							default: switch (a) {
								case "svg":
									o = s.createElementNS("http://www.w3.org/2000/svg", a);
									break;
								case "math":
									o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
									break;
								case "script":
									o = s.createElement("div"), o.innerHTML = "<script><\/script>", o = o.removeChild(o.firstChild);
									break;
								case "select":
									o = typeof r.is == "string" ? s.createElement("select", { is: r.is }) : s.createElement("select"), r.multiple ? o.multiple = !0 : r.size && (o.size = r.size);
									break;
								default: o = typeof r.is == "string" ? s.createElement(a, { is: r.is }) : s.createElement(a);
							}
						}
						o[Ct] = t, o[wt] = r;
						e: for (s = t.child; s !== null;) {
							if (s.tag === 5 || s.tag === 6) o.appendChild(s.stateNode);
							else if (s.tag !== 4 && s.tag !== 27 && s.child !== null) {
								s.child.return = s, s = s.child;
								continue;
							}
							if (s === t) break;
							for (; s.sibling === null;) {
								if (s.return === null || s.return === t) break e;
								s = s.return;
							}
							s.sibling.return = s.return, s = s.sibling;
						}
						switch (t.stateNode = o, ip(o, a, r), a) {
							case "button":
							case "input":
							case "select":
							case "textarea":
								r = !!r.autoFocus;
								break;
							case "img":
								r = !0;
								break;
							default: r = !1;
						}
						r && dl(t);
					}
				}
				return gl(t), t.subtreeFlags &= -33554433, fl(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && dl(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(i(166));
					if (e = F.current, da(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, a = ra, a !== null) switch (a.tag) {
							case 27:
							case 5: r = a.memoizedProps;
						}
						e[Ct] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || tp(e.nodeValue, n)), e || ca(t, !0);
					} else e = dp(e).createTextNode(r), e[Ct] = t, t.stateNode = e;
				}
				return gl(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = da(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(i(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(557));
							e[Ct] = t;
						} else fa(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						gl(t), e = !1;
					} else n = pa(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (Io(t), t) : (Io(t), null);
					if (t.flags & 128) throw Error(i(558));
				}
				return gl(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (a = da(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!a) throw Error(i(318));
							if (a = t.memoizedState, a = a === null ? null : a.dehydrated, !a) throw Error(i(317));
							a[Ct] = t;
						} else fa(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						gl(t), a = !1;
					} else a = pa(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), a = !0;
					if (!a) return t.flags & 256 ? (Io(t), t) : (Io(t), null);
				}
				return Io(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, a = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (a = r.alternate.memoizedState.cachePool.pool), o = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool), o !== a && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), ml(t, t.updateQueue), gl(t), null);
			case 4: return Oe(), e === null && Gf(t.stateNode.containerInfo), t.flags |= 67108864, gl(t), null;
			case 10: return V(t.type), gl(t), null;
			case 19:
				if (zo(t), r = t.memoizedState, r === null) return gl(t), null;
				if (a = !!(t.flags & 128), o = r.rendering, o === null) {
					if (a) hl(r, !1);
					else {
						if (sd !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
							if (o = Bo(e), o !== null) {
								for (t.flags |= 128, hl(r, !1), e = o.updateQueue, t.updateQueue = e, ml(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) Fi(n, e), n = n.sibling;
								return Ro(t, Lo.current & 1 | 2), B && Qi(t, r.treeForkCount), t.child;
							}
							e = e.sibling;
						}
						r.tail !== null && He() > vd && (t.flags |= 128, a = !0, hl(r, !1), t.lanes = 4194304);
					}
				} else {
					if (!a) {
						if (e = Bo(o), e !== null) {
							if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, ml(t, e), hl(r, !0), r.tail === null && r.tailMode !== "collapsed" && r.tailMode !== "visible" && !o.alternate && !B) return gl(t), null;
						} else 2 * He() - r.renderingStartTime > vd && n !== 536870912 && (t.flags |= 128, a = !0, hl(r, !1), t.lanes = 4194304);
					}
					r.isBackwards ? (o.sibling = t.child, t.child = o) : (e = r.last, e === null ? t.child = o : e.sibling = o, r.last = o);
				}
				if (r.tail !== null) {
					e = r.tail;
					e: {
						for (n = e; n !== null;) {
							if (n.alternate !== null) {
								n = !1;
								break e;
							}
							n = n.sibling;
						}
						n = !0;
					}
					return r.rendering = e, r.tail = e.sibling, r.renderingStartTime = He(), e.sibling = null, o = Lo.current, o = a ? o & 1 | 2 : o & 1, r.tailMode === "visible" || r.tailMode === "collapsed" || !n || B ? Ro(t, o) : (n = o, Ce(Ao, t), Ce(Lo, n), jo === null && (jo = t)), B && Qi(t, r.treeForkCount), e;
				}
				return gl(t), null;
			case 22:
			case 23: return Io(t), ko(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (gl(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : gl(t), n = t.updateQueue, n !== null && ml(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && Se(Wa), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), V(Aa), gl(t), null;
			case 25: return null;
			case 30: return t.flags |= 33554432, gl(t), null;
		}
		throw Error(i(156, t.tag));
	}
	function vl(e, t) {
		switch (ta(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return V(Aa), Oe(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return I(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (Io(t), t.alternate === null) throw Error(i(340));
					fa();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (Io(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(i(340));
					fa();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return zo(t), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, e = t.memoizedState, e !== null && (e.rendering = null, e.tail = null), t.flags |= 4, t) : null;
			case 4: return Oe(), null;
			case 10: return V(t.type), null;
			case 22:
			case 23: return Io(t), ko(), e !== null && Se(Wa), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return V(Aa), null;
			default: return null;
		}
	}
	function yl(e, t) {
		switch (ta(t), t.tag) {
			case 3:
				V(Aa), Oe();
				break;
			case 26:
			case 27:
			case 5:
				I(t);
				break;
			case 4:
				Oe();
				break;
			case 31:
				t.memoizedState !== null && Io(t);
				break;
			case 13:
				Io(t);
				break;
			case 19:
				zo(t);
				break;
			case 10:
				V(t.type);
				break;
			case 22:
			case 23:
				Io(t), ko(), e !== null && Se(Wa);
				break;
			case 24: V(Aa);
		}
	}
	function bl(e, t) {
		try {
			var n = t.updateQueue, r = n === null ? null : n.lastEffect;
			if (r !== null) {
				var i = r.next;
				n = i;
				do {
					if ((n.tag & e) === e) {
						r = void 0;
						var a = n.create, o = n.inst;
						r = a(), o.destroy = r;
					}
					n = n.next;
				} while (n !== i);
			}
		} catch (e) {
			hf(t, t.return, e);
		}
	}
	function K(e, t, n) {
		try {
			var r = t.updateQueue, i = r === null ? null : r.lastEffect;
			if (i !== null) {
				var a = i.next;
				r = a;
				do {
					if ((r.tag & e) === e) {
						var o = r.inst, s = o.destroy;
						if (s !== void 0) {
							o.destroy = void 0, i = t;
							var c = n, l = s;
							try {
								l();
							} catch (e) {
								hf(i, c, e);
							}
						}
					}
					r = r.next;
				} while (r !== a);
			}
		} catch (e) {
			hf(t, t.return, e);
		}
	}
	function xl(e) {
		var t = e.updateQueue;
		if (t !== null) {
			var n = e.stateNode;
			try {
				wo(t, n);
			} catch (t) {
				hf(e, e.return, t);
			}
		}
	}
	function Sl(e, t, n) {
		n.props = xc(e.type, e.memoizedProps), n.state = e.memoizedState;
		try {
			n.componentWillUnmount();
		} catch (n) {
			hf(e, t, n);
		}
	}
	function Cl(e, t) {
		try {
			var n = e.ref;
			if (n !== null) {
				switch (e.tag) {
					case 26:
					case 27:
					case 5:
						var r = e.stateNode;
						break;
					case 30:
						var i = e.stateNode, a = _i(e.memoizedProps, i);
						(i.ref === null || i.ref.name !== a) && (i.ref = Ip(a)), r = i.ref;
						break;
					case 7:
						if (e.stateNode === null) {
							var o = new Lp(e);
							m(e.child, !1, em, o, void 0, void 0), e.stateNode = o;
						}
						r = e.stateNode;
						break;
					default: r = e.stateNode;
				}
				typeof n == "function" ? e.refCleanup = n(r) : n.current = r;
			}
		} catch (n) {
			hf(e, t, n);
		}
	}
	function wl(e, t) {
		var n = e.ref, r = e.refCleanup;
		if (n !== null) {
			if (typeof r == "function") try {
				r();
			} catch (n) {
				hf(e, t, n);
			} finally {
				e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
			}
			else if (typeof n == "function") try {
				n(null);
			} catch (n) {
				hf(e, t, n);
			}
			else n.current = null;
		}
	}
	function Tl(e, t) {
		if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && e.alternate === null && t !== null) for (var n = 0; n < t.length; n++) nm(e.stateNode, t[n]);
	}
	function El(e) {
		for (var t = e.return; t !== null && (kl(t) && nm(e.stateNode, t.stateNode), !Ol(t));) t = t.return;
	}
	function Dl(e) {
		for (var t = e.return; t !== null && (kl(t) && rm(e.stateNode, t.stateNode), !Ol(t));) t = t.return;
	}
	function Ol(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 27;
	}
	function kl(e) {
		return e && e.tag === 7 && e.stateNode !== null;
	}
	function Al(e) {
		var t = e.type, n = e.memoizedProps, r = e.stateNode;
		try {
			switch (t) {
				case "button":
				case "input":
				case "select":
				case "textarea":
					n.autoFocus && r.focus();
					break;
				case "img": n.src ? r.src = n.src : n.srcSet && (r.srcset = n.srcSet);
			}
		} catch (t) {
			hf(e, e.return, t);
		}
	}
	function jl(e, t, n) {
		try {
			var r = e.stateNode;
			op(r, e.type, n, t), r[wt] = t;
		} catch (t) {
			hf(e, e.return, t);
		}
	}
	function Ml(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && wp(e.type) || e.tag === 4;
	}
	function Nl(e) {
		e: for (;;) {
			for (; e.sibling === null;) {
				if (e.return === null || Ml(e.return)) return null;
				e = e.return;
			}
			for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
				if (e.tag === 27 && wp(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
				e.child.return = e, e = e.child;
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function Pl(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(i, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(i), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = vn)), Tl(e, r), Gt = !0;
		else if (i !== 4 && (i === 27 && (Tl(e, r), r = null, wp(e.type) && (n = e.stateNode, t = null)), e = e.child, e !== null)) for (Pl(e, t, n, r), e = e.sibling; e !== null;) Pl(e, t, n, r), e = e.sibling;
	}
	function Fl(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? n.insertBefore(i, t) : n.appendChild(i), Tl(e, r), Gt = !0;
		else if (i !== 4 && (i === 27 && (Tl(e, r), r = null, wp(e.type) && (n = e.stateNode)), e = e.child, e !== null)) for (Fl(e, t, n, r), e = e.sibling; e !== null;) Fl(e, t, n, r), e = e.sibling;
	}
	function Il(e) {
		var t = e.stateNode, n = e.memoizedProps;
		try {
			for (var r = e.type, i = t.attributes; i.length;) t.removeAttributeNode(i[0]);
			ip(t, r, n), t[Ct] = e, t[wt] = n;
		} catch (t) {
			hf(e, e.return, t);
		}
	}
	var Ll = !1, Rl = null;
	function zl(e) {
		(e.tag === 30 || e.subtreeFlags & 33554432) && (Ll = !0);
	}
	var Bl = null;
	function Vl() {
		var e = Bl;
		return Bl = null, e;
	}
	var Hl = 0;
	function Ul(e, t, n, r, i) {
		return Hl = 0, Wl(e.child, t, n, r, i);
	}
	function Wl(e, t, n, r, i) {
		for (var a = !1; e !== null;) {
			if (e.tag === 5) {
				var o = e.stateNode;
				if (r !== null) {
					var s = Ap(o);
					r.push(s), s.view && (a = !0);
				} else a || Ap(o).view && (a = !0);
				Ll = !0, Dp(o, Hl === 0 ? t : t + "_" + Hl, n), Hl++;
			} else e.tag === 22 && e.memoizedState !== null || e.tag === 30 && i || Wl(e.child, t, n, r, i) && (a = !0);
			e = e.sibling;
		}
		return a;
	}
	function Gl(e, t) {
		for (; e !== null;) e.tag === 5 ? Op(e.stateNode, e.memoizedProps) : e.tag === 22 && e.memoizedState !== null || e.tag === 30 && t || Gl(e.child, t), e = e.sibling;
	}
	function Kl(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if ((e.tag !== 22 || e.memoizedState === null) && (Kl(e), e.tag === 30 && e.flags & 18874368 && e.stateNode.paired)) {
				var t = e.memoizedProps;
				if (t.name == null || t.name === "auto") throw Error(i(544));
				var n = t.name;
				t = yi(t.default, t.share), t !== "none" && (Ul(e, n, t, null, !1) || Gl(e.child, !1));
			}
			e = e.sibling;
		}
	}
	function ql(e, t) {
		if (e.tag === 30) {
			var n = e.stateNode, r = e.memoizedProps, i = _i(r, n), a = yi(r.default, n.paired ? r.share : r.enter);
			a === "none" ? Kl(e) : Ul(e, i, a, null, !1) ? (Kl(e), n.paired || t || Pd(e, r.onEnter)) : Gl(e.child, !1);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) ql(e, t), e = e.sibling;
		else Kl(e);
	}
	function Jl(e) {
		if (Rl !== null && Rl.size !== 0) {
			var t = Rl;
			if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
				if (e.tag !== 22 || e.memoizedState === null) {
					if (e.tag === 30 && e.flags & 18874368) {
						var n = e.memoizedProps, r = n.name;
						if (r != null && r !== "auto") {
							var i = t.get(r);
							if (i !== void 0) {
								var a = yi(n.default, n.share);
								if (a !== "none" && (Ul(e, r, a, null, !1) ? (a = e.stateNode, i.paired = a, a.paired = i, Pd(e, n.onShare)) : Gl(e.child, !1)), t.delete(r), t.size === 0) break;
							}
						}
					}
					Jl(e);
				}
				e = e.sibling;
			}
		}
	}
	function Yl(e) {
		if (e.tag === 30) {
			var t = e.memoizedProps, n = _i(t, e.stateNode), r = Rl === null ? void 0 : Rl.get(n), i = yi(t.default, r === void 0 ? t.exit : t.share);
			i !== "none" && (Ul(e, n, i, null, !1) ? r === void 0 ? Pd(e, t.onExit) : (i = e.stateNode, r.paired = i, i.paired = r, Rl.delete(n), Pd(e, t.onShare)) : Gl(e.child, !1)), Rl !== null && Jl(e);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) Yl(e), e = e.sibling;
		else Rl !== null && Jl(e);
	}
	function Xl(e) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var t = e.memoizedProps, n = _i(t, e.stateNode);
				t = yi(t.default, t.update), e.flags &= -5, t !== "none" && Ul(e, n, t, e.memoizedState = [], !1);
			} else e.subtreeFlags & 33554432 && Xl(e);
			e = e.sibling;
		}
	}
	function Zl(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if (e.tag !== 22 || e.memoizedState === null) {
				if (e.tag === 30 && e.flags & 18874368) {
					var t = e.stateNode;
					t.paired !== null && (t.paired = null, Gl(e.child, !1));
				}
				Zl(e);
			}
			e = e.sibling;
		}
	}
	function Ql(e) {
		if (e.tag === 30) e.stateNode.paired = null, Gl(e.child, !1), Zl(e);
		else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) Ql(e), e = e.sibling;
		else Zl(e);
	}
	function $l(e) {
		for (e = e.child; e !== null;) e.tag === 30 ? Gl(e.child, !1) : e.subtreeFlags & 33554432 && $l(e), e = e.sibling;
	}
	function eu(e, t, n, r, i, a, o) {
		for (var s = !1; t !== null;) {
			if (t.tag === 5) {
				var c = t.stateNode;
				if (a !== null && Hl < a.length) {
					var l = a[Hl], u = Ap(c);
					(l.view || u.view) && (s = !0);
					var d;
					if (d = !(e.flags & 4)) {
						if (u.clip) d = !0;
						else {
							d = l.rect;
							var f = u.rect;
							d = d.y !== f.y || d.x !== f.x || d.height !== f.height || d.width !== f.width;
						}
					}
					d && (e.flags |= 4), u.abs ? u = !l.abs : (l = l.rect, u = u.rect, u = l.height !== u.height || l.width !== u.width), u && (e.flags |= 32);
				} else e.flags |= 32;
				e.flags & 4 && Dp(c, Hl === 0 ? n : n + "_" + Hl, i), s && e.flags & 4 || (Bl === null && (Bl = []), Bl.push(c, Hl === 0 ? r : r + "_" + Hl, t.memoizedProps)), Hl++;
			} else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && o ? e.flags |= t.flags & 32 : eu(e, t.child, n, r, i, a, o) && (s = !0));
			t = t.sibling;
		}
		return s;
	}
	function tu(e, t) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var n = e.memoizedProps, r = e.stateNode, i = _i(n, r), a = yi(n.default, n.update);
				if (t) {
					r = r.clones;
					var o = r === null ? null : r.map(jp);
				} else o = e.memoizedState, e.memoizedState = null;
				r = e;
				var s = e.child;
				Hl = 0, i = eu(r, s, i, i, a, o, !1), e.flags & 4 && i && (t || Pd(e, n.onUpdate));
			} else e.subtreeFlags & 33554432 && tu(e, t);
			e = e.sibling;
		}
	}
	var nu = !1, ru = !1, iu = !1, au = !1, ou = typeof WeakSet == "function" ? WeakSet : Set, su = null, cu = !1, lu = !1, uu = !1, du = !1;
	function fu(e, t, n) {
		if (e = e.containerInfo, lp = _h, e = qr(e), Jr(e)) {
			if ("selectionStart" in e) var r = {
				start: e.selectionStart,
				end: e.selectionEnd
			};
			else e: {
				r = (r = e.ownerDocument) && r.defaultView || window;
				var i = r.getSelection && r.getSelection();
				if (i && i.rangeCount !== 0) {
					r = i.anchorNode;
					var a = i.anchorOffset, o = i.focusNode;
					i = i.focusOffset;
					try {
						r.nodeType, o.nodeType;
					} catch {
						r = null;
						break e;
					}
					var s = 0, c = -1, l = -1, u = 0, d = 0, f = e, p = null;
					t: for (;;) {
						for (var m; f !== r || a !== 0 && f.nodeType !== 3 || (c = s + a), f !== o || i !== 0 && f.nodeType !== 3 || (l = s + i), f.nodeType === 3 && (s += f.nodeValue.length), (m = f.firstChild) !== null;) p = f, f = m;
						for (;;) {
							if (f === e) break t;
							if (p === r && ++u === a && (c = s), p === o && ++d === i && (l = s), (m = f.nextSibling) !== null) break;
							f = p, p = f.parentNode;
						}
						f = m;
					}
					r = c === -1 || l === -1 ? null : {
						start: c,
						end: l
					};
				} else r = null;
			}
			r ||= {
				start: 0,
				end: 0
			};
		} else r = null;
		for (up = {
			focusedElem: e,
			selectionRange: r
		}, _h = !1, n = (n & 335544064) === n, su = t, t = n ? 9270 : 1024; su !== null;) {
			if (e = su, n && (r = e.deletions, r !== null)) for (a = 0; a < r.length; a++) n && Yl(r[a]);
			if (e.alternate === null && e.flags & 2) n && zl(e), pu(n);
			else {
				if (e.tag === 22) {
					if (r = e.alternate, e.memoizedState !== null) {
						r !== null && r.memoizedState === null && n && Yl(r), pu(n);
						continue;
					}
					if (r !== null && r.memoizedState !== null) {
						n && zl(e), pu(n);
						continue;
					}
				}
				r = e.child, (e.subtreeFlags & t) !== 0 && r !== null ? (r.return = e, su = r) : (n && Xl(e), pu(n));
			}
		}
		Rl = null;
	}
	function pu(e) {
		for (; su !== null;) {
			var t = su, n = e, r = t.alternate, a = t.flags;
			switch (t.tag) {
				case 0:
				case 11:
				case 15: break;
				case 1:
					if (a & 1024 && r !== null) {
						n = void 0, a = r.memoizedProps, r = r.memoizedState;
						var o = t.stateNode;
						try {
							var s = xc(t.type, a);
							n = o.getSnapshotBeforeUpdate(s, r), o.__reactInternalSnapshotBeforeUpdate = n;
						} catch (e) {
							hf(t, t.return, e);
						}
					}
					break;
				case 3:
					if (a & 1024) {
						if (r = t.stateNode.containerInfo, n = r.nodeType, n === 9) im(r);
						else if (n === 1) switch (r.nodeName) {
							case "HEAD":
							case "HTML":
							case "BODY":
								im(r);
								break;
							default: r.textContent = "";
						}
					}
					break;
				case 5:
				case 26:
				case 27:
				case 6:
				case 4:
				case 17: break;
				case 30:
					n && r !== null && (n = _i(r.memoizedProps, r.stateNode), a = t.memoizedProps, a = yi(a.default, a.update), a !== "none" && Ul(r, n, a, r.memoizedState = [], !0));
					break;
				default: if (a & 1024) throw Error(i(163));
			}
			if (r = t.sibling, r !== null) {
				r.return = t.return, su = r;
				break;
			}
			su = t.return;
		}
	}
	function mu(e, t, n) {
		var r = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				Pu(e, n), r & 4 && bl(5, n);
				break;
			case 1:
				if (Pu(e, n), r & 4) {
					if (e = n.stateNode, t === null) try {
						e.componentDidMount();
					} catch (e) {
						hf(n, n.return, e);
					}
					else {
						var i = xc(n.type, t.memoizedProps);
						t = t.memoizedState;
						try {
							e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate);
						} catch (e) {
							hf(n, n.return, e);
						}
					}
				}
				r & 64 && xl(n), r & 512 && Cl(n, n.return);
				break;
			case 3:
				if (Pu(e, n), r & 64 && (e = n.updateQueue, e !== null)) {
					if (t = null, n.child !== null) switch (n.child.tag) {
						case 27:
						case 5:
						case 1: t = n.child.stateNode;
					}
					try {
						wo(e, t);
					} catch (e) {
						hf(n, n.return, e);
					}
				}
				break;
			case 27: t === null && r & 4 && Il(n);
			case 26:
			case 5:
				Pu(e, n), t === null && r & 4 && Al(n), r & 512 && Cl(n, n.return);
				break;
			case 12:
				Pu(e, n);
				break;
			case 31:
				Pu(e, n), r & 4 && Cu(e, n);
				break;
			case 13:
				Pu(e, n), r & 4 && wu(e, n), r & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = yf.bind(null, n), um(e, n))));
				break;
			case 22:
				if (r = n.memoizedState !== null || nu, !r) {
					var a = t !== null && t.memoizedState !== null || ru;
					t = nu, i = ru, nu = r, (ru = a) && !i ? (r = 2, n.subtreeFlags & 8772 && (r |= 1), Iu(e, n, r)) : Pu(e, n), nu = t, ru = i;
				}
				break;
			case 30:
				Pu(e, n), r & 512 && Cl(n, n.return);
				break;
			case 7: r & 512 && Cl(n, n.return);
			default: Pu(e, n);
		}
	}
	function hu(e, t) {
		for (e = e.child; e !== null;) gu(e, t), e = e.sibling;
	}
	function gu(e, t) {
		switch (e.tag) {
			case 5:
			case 26:
				try {
					var n = e.stateNode;
					if (t) {
						var r = n.style;
						typeof r.setProperty == "function" ? r.setProperty("display", "none", "important") : r.display = "none";
					} else {
						var i = e.stateNode, a = e.memoizedProps.style, o = a != null && a.hasOwnProperty("display") ? a.display : null;
						i.style.display = o == null || typeof o == "boolean" ? "" : ("" + o).trim();
					}
				} catch (t) {
					hf(e, e.return, t);
				}
				_u(e, t);
				break;
			case 6:
				try {
					e.stateNode.nodeValue = t ? "" : e.memoizedProps, Gt = !0;
				} catch (t) {
					hf(e, e.return, t);
				}
				break;
			case 18:
				try {
					var s = e.stateNode;
					t ? Ep(s, !0) : Ep(e.stateNode, !1);
				} catch (t) {
					hf(e, e.return, t);
				}
				break;
			case 22:
			case 23:
				e.memoizedState === null && hu(e, t);
				break;
			default: hu(e, t);
		}
	}
	function _u(e, t) {
		if (e.subtreeFlags & 67108864) for (e = e.child; e !== null;) {
			e: {
				var n = e, r = t;
				switch (n.tag) {
					case 4:
						gu(n, r);
						break e;
					case 22:
						n.memoizedState === null && _u(n, r);
						break e;
					default: _u(n, r);
				}
			}
			e = e.sibling;
		}
	}
	function vu(e) {
		var t = e.alternate;
		t !== null && (e.alternate = null, vu(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && Mt(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var yu = null, bu = !1;
	function xu(e, t, n) {
		for (n = n.child; n !== null;) Su(e, t, n), n = n.sibling;
	}
	function Su(e, t, n) {
		if (Qe && typeof Qe.onCommitFiberUnmount == "function") try {
			Qe.onCommitFiberUnmount(Ze, n);
		} catch {}
		switch (n.tag) {
			case 26:
				ru || wl(n, t), xu(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && !ru && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				ru || wl(n, t), Dl(n);
				var r = yu, i = bu;
				wp(n.type) && (yu = n.stateNode, bu = !1), xu(e, t, n), vm(n.stateNode, n.type, n.memoizedProps), yu = r, bu = i;
				break;
			case 5: ru || wl(n, t), Dl(n);
			case 6:
				if (n.tag === 6 && Dl(n), r = yu, i = bu, yu = null, xu(e, t, n), yu = r, bu = i, yu !== null) {
					if (bu) try {
						(yu.nodeType === 9 ? yu.body : yu.nodeName === "HTML" ? yu.ownerDocument.body : yu).removeChild(n.stateNode), Gt = !0;
					} catch (e) {
						hf(n, t, e);
					}
					else try {
						yu.removeChild(n.stateNode), Gt = !0;
					} catch (e) {
						hf(n, t, e);
					}
				}
				break;
			case 18:
				yu !== null && (bu ? (e = yu, Tp(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Uh(e)) : Tp(yu, n.stateNode));
				break;
			case 4:
				r = yu, i = bu, yu = n.stateNode.containerInfo, bu = !0, xu(e, t, n), yu = r, bu = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				K(2, n, t), ru || K(4, n, t), xu(e, t, n);
				break;
			case 1:
				ru || (wl(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function" && Sl(n, t, r)), xu(e, t, n);
				break;
			case 21:
				xu(e, t, n);
				break;
			case 22:
				ru = (r = ru) || n.memoizedState !== null, xu(e, t, n), ru = r;
				break;
			case 30:
				wl(n, t), xu(e, t, n);
				break;
			case 7:
				ru || wl(n, t), xu(e, t, n);
				break;
			default: xu(e, t, n);
		}
	}
	function Cu(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
			e = e.dehydrated;
			try {
				Uh(e);
			} catch (e) {
				hf(t, t.return, e);
			}
		}
	}
	function wu(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
			Uh(e);
		} catch (e) {
			hf(t, t.return, e);
		}
	}
	function Tu(e) {
		switch (e.tag) {
			case 31:
			case 13:
			case 19:
				var t = e.stateNode;
				return t === null && (t = e.stateNode = new ou()), t;
			case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new ou()), t;
			default: throw Error(i(435, e.tag));
		}
	}
	function Eu(e, t) {
		var n = Tu(e);
		t.forEach(function(t) {
			if (!n.has(t)) {
				n.add(t);
				var r = bf.bind(null, e, t);
				t.then(r, r);
			}
		});
	}
	function Du(e, t, n) {
		var r = t.deletions;
		if (r !== null) for (var a = 0; a < r.length; a++) {
			var o = r[a], s = e, c = t, l = c;
			e: for (; l !== null;) {
				switch (l.tag) {
					case 27:
						if (wp(l.type)) {
							yu = l.stateNode, bu = !1;
							break e;
						}
						break;
					case 5:
						yu = l.stateNode, bu = !1;
						break e;
					case 3:
					case 4:
						yu = l.stateNode.containerInfo, bu = !0;
						break e;
				}
				l = l.return;
			}
			if (yu === null) throw Error(i(160));
			Su(s, c, o), yu = null, bu = !1, s = o.alternate, s !== null && (s.return = null), o.return = null;
		}
		if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) ku(t, e, n), t = t.sibling;
	}
	var Ou = null;
	function ku(e, t, n) {
		var r = e.alternate, a = e.flags;
		switch (e.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				if (a & 4 && (r = e.updateQueue, r = r === null ? null : r.events, r !== null)) for (var o = 0; o < r.length; o++) {
					var s = r[o];
					s.ref.impl = s.nextImpl;
				}
				Du(t, e, n), Au(e), a & 4 && (K(3, e, e.return), bl(3, e), K(5, e, e.return));
				break;
			case 1:
				Du(t, e, n), Au(e), a & 512 && (ru || r === null || wl(r, r.return)), a & 64 && nu && (e = e.updateQueue, e !== null && (t = e.callbacks, t !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? t : n.concat(t))));
				break;
			case 26:
				if (o = Ou, Du(t, e, n), Au(e), a & 512 && (ru || r === null || wl(r, r.return)), a & 4) {
					if (a = r === null ? null : r.memoizedState, n = e.memoizedState, r === null) {
						if (n === null) {
							if (e.stateNode === null) {
								if (nu) e.stateNode = mp(e.type, e.memoizedProps, t.containerInfo, e);
								else {
									e: {
										t = e.type, n = e.memoizedProps, a = o.ownerDocument || o;
										t: switch (t) {
											case "title":
												r = a.getElementsByTagName("title")[0], (!r || r[At] || r[Ct] || r.namespaceURI === "http://www.w3.org/2000/svg" || r.hasAttribute("itemprop")) && (r = a.createElement(t), a.head.insertBefore(r, a.querySelector("head > title"))), ip(r, t, n), r[Ct] = e, It(r), t = r;
												break e;
											case "link":
												if (o = qm("link", "href", a).get(t + (n.href || ""))) {
													for (s = 0; s < o.length; s++) if (r = o[s], r.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && r.getAttribute("rel") === (n.rel == null ? null : n.rel) && r.getAttribute("title") === (n.title == null ? null : n.title) && r.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
														o.splice(s, 1);
														break t;
													}
												}
												r = a.createElement(t), ip(r, t, n), a.head.appendChild(r);
												break;
											case "meta":
												if (o = qm("meta", "content", a).get(t + (n.content || ""))) {
													for (s = 0; s < o.length; s++) if (r = o[s], r.getAttribute("content") === (n.content == null ? null : "" + n.content) && r.getAttribute("name") === (n.name == null ? null : n.name) && r.getAttribute("property") === (n.property == null ? null : n.property) && r.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && r.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
														o.splice(s, 1);
														break t;
													}
												}
												r = a.createElement(t), ip(r, t, n), a.head.appendChild(r);
												break;
											default: throw Error(i(468, t));
										}
										r[Ct] = e, It(r), t = r;
									}
									e.stateNode = t;
								}
							} else nu || Jm(o, e.type, e.stateNode);
						} else e.stateNode = Hm(o, n, e.memoizedProps);
					} else a === n ? n === null && e.stateNode !== null && jl(e, e.memoizedProps, r.memoizedProps) : (a === null ? (t = r.stateNode, t === null || ru || t.parentNode.removeChild(t)) : a.count--, n === null ? nu || Jm(o, e.type, e.stateNode) : Hm(o, n, e.memoizedProps));
				}
				break;
			case 27:
				Du(t, e, n), Au(e), a & 512 && (ru || r === null || wl(r, r.return)), r !== null && a & 4 && jl(e, e.memoizedProps, r.memoizedProps);
				break;
			case 5:
				if (o = iu, iu = !1, Du(t, e, n), iu = o, Au(e), a & 512 && (ru || r === null || wl(r, r.return)), e.flags & 32) {
					t = e.stateNode;
					try {
						un(t, ""), Gt = !0;
					} catch (t) {
						hf(e, e.return, t);
					}
				}
				a & 4 && e.stateNode != null && (t = e.memoizedProps, jl(e, t, r === null ? t : r.memoizedProps)), a & 1024 && (au = !0);
				break;
			case 6:
				if (Du(t, e, n), Au(e), a & 4) {
					if (e.stateNode === null) throw Error(i(162));
					t = e.memoizedProps, n = e.stateNode;
					try {
						n.nodeValue = t, Gt = !0;
					} catch (t) {
						hf(e, e.return, t);
					}
				}
				break;
			case 3:
				if (Gt = !1, Km = null, o = Ou, Ou = Sm(t.containerInfo), Du(t, e, n), Ou = o, Au(e), a & 4 && r !== null && r.memoizedState.isDehydrated) try {
					Uh(t.containerInfo);
				} catch (t) {
					hf(e, e.return, t);
				}
				au && (au = !1, ju(e)), Gt = !1;
				break;
			case 4:
				a = iu, iu = nu, r = Kt(), o = Ou, Ou = Sm(e.stateNode.containerInfo), Du(t, e, n), Au(e), Ou = o, Gt && lu && (uu = !0), Gt = r, iu = a;
				break;
			case 12:
				Du(t, e, n), Au(e);
				break;
			case 31:
				Du(t, e, n), Au(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Eu(e, t)));
				break;
			case 13:
				Du(t, e, n), Au(e), e.child.flags & 8192 && e.memoizedState !== null != (r !== null && r.memoizedState !== null) && (gd = He()), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Eu(e, t)));
				break;
			case 22:
				o = e.memoizedState !== null, s = r !== null && r.memoizedState !== null;
				var c = nu, l = ru, u = iu;
				nu = c || o, iu = u || o, ru = l || s, Du(t, e, n), ru = l, iu = u, nu = c, Au(e), a & 8192 && (t = e.stateNode, t._visibility = o ? t._visibility & -2 : t._visibility | 1, !o || r === null || s || nu || ru || (t = s || ru, n = nu, r = ru, nu = o || nu, ru = t, Fu(e, 2), nu = n, ru = r), !o && iu || hu(e, o)), a & 4 && (t = e.updateQueue, t !== null && (n = t.retryQueue, n !== null && (t.retryQueue = null, Eu(e, n))));
				break;
			case 19:
				Du(t, e, n), Au(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Eu(e, t)));
				break;
			case 30:
				a & 512 && (ru || r === null || wl(r, r.return)), a = Kt(), o = lu, s = (n & 335544064) === n, c = e.memoizedProps, lu = s && yi(c.default, c.update) !== "none", Du(t, e, n), Au(e), s && r !== null && Gt && (e.flags |= 4), lu = o, Gt = a;
				break;
			case 21: break;
			case 7: a & 512 && (ru || r === null || wl(r, r.return)), r && r.stateNode !== null && (r.stateNode._fragmentFiber = e);
			default: Du(t, e, n), Au(e);
		}
	}
	function Au(e) {
		var t = e.flags;
		if (t & 2) {
			try {
				for (var n, r = e.return; r !== null;) {
					if (Ml(r)) {
						n = r;
						break;
					}
					r = r.return;
				}
				r = null;
				for (var a = e.return; a !== null;) {
					if (kl(a)) {
						var o = a.stateNode;
						r === null ? r = [o] : r.push(o);
					}
					if (Ol(a)) break;
					a = a.return;
				}
				var s = r;
				if (n == null) throw Error(i(160));
				switch (n.tag) {
					case 27:
						var c = n.stateNode;
						Fl(e, Nl(e), c, s);
						break;
					case 5:
						var l = n.stateNode;
						n.flags & 32 && (un(l, ""), n.flags &= -33), Fl(e, Nl(e), l, s);
						break;
					case 3:
					case 4:
						var u = n.stateNode.containerInfo;
						Pl(e, Nl(e), u, s);
						break;
					default: throw Error(i(161));
				}
			} catch (t) {
				hf(e, e.return, t);
			}
			e.flags &= -3;
		}
		t & 4096 && (e.flags &= -4097);
	}
	function ju(e) {
		if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
			var t = e;
			ju(t), t.tag === 5 && t.flags & 1024 && (t = t.stateNode, _h = !0, t.reset(), _h = !1), e = e.sibling;
		}
	}
	function Mu(e, t) {
		if (t.subtreeFlags & 9270) for (t = t.child; t !== null;) Nu(t, e), t = t.sibling;
		else tu(t, !1);
	}
	function Nu(e, t) {
		var n = e.alternate;
		if (n === null) ql(e, !1);
		else switch (e.tag) {
			case 3:
				if (du = cu = !1, Vl(), Mu(t, e), !cu && !uu) {
					if (e = Bl, e !== null) for (var r = 0; r < e.length; r += 3) {
						n = e[r];
						var i = e[r + 1];
						Op(n, e[r + 2]), n = n.ownerDocument.documentElement, n !== null && n.animate({
							opacity: [0, 0],
							pointerEvents: ["none", "none"]
						}, {
							duration: 0,
							fill: "forwards",
							pseudoElement: "::view-transition-group(" + i + ")"
						});
					}
					e = t.containerInfo, e = e.nodeType === 9 ? e.documentElement : e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "" && (e.style.viewTransitionName = "none", e.animate({
						opacity: [0, 0],
						pointerEvents: ["none", "none"]
					}, {
						duration: 0,
						fill: "forwards",
						pseudoElement: "::view-transition-group(root)"
					}), e.animate({
						width: [0, 0],
						height: [0, 0]
					}, {
						duration: 0,
						fill: "forwards",
						pseudoElement: "::view-transition"
					})), du = !0;
				}
				Bl = null;
				break;
			case 5:
				Mu(t, e);
				break;
			case 4:
				r = cu, cu = !1, Mu(t, e), cu && (uu = !0), cu = r;
				break;
			case 22:
				e.memoizedState === null && (n.memoizedState === null ? Mu(t, e) : ql(e, !1));
				break;
			case 30:
				r = cu, i = Vl(), cu = !1, Mu(t, e), cu && (e.flags |= 4);
				var a = e.memoizedProps, o = e.stateNode;
				t = _i(a, o), o = _i(n.memoizedProps, o);
				var s = yi(a.default, a.update);
				s === "none" ? t = !1 : (a = n.memoizedState, n.memoizedState = null, n = e.child, Hl = 0, t = eu(e, n, t, o, s, a, !0), Hl !== (a === null ? 0 : a.length) && (e.flags |= 32)), e.flags & 4 && t ? (Pd(e, e.memoizedProps.onUpdate), Bl = i) : i !== null && (i.push.apply(i, Bl), Bl = i), cu = e.flags & 32 ? !0 : r;
				break;
			default: Mu(t, e);
		}
	}
	function Pu(e, t) {
		if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) mu(e, t.alternate, t), t = t.sibling;
	}
	function Fu(e, t) {
		for (e = e.child; e !== null;) {
			var n = e, r = t;
			switch (n.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					K(4, n, n.return), Fu(n, r);
					break;
				case 1:
					wl(n, n.return);
					var i = n.stateNode;
					typeof i.componentWillUnmount == "function" && Sl(n, n.return, i), Fu(n, r);
					break;
				case 27: r & 2 && vm(n.stateNode, n.type, n.memoizedProps);
				case 5:
					wl(n, n.return), n.tag !== 5 && n.tag !== 27 || Dl(n), Fu(n, r);
					break;
				case 6:
					Dl(n);
					break;
				case 26:
					wl(n, n.return), i = n.stateNode, n.memoizedState !== null || i === null || ru || i.parentNode.removeChild(i), Fu(n, r);
					break;
				case 22:
					n.memoizedState === null && Fu(n, r);
					break;
				case 30:
					wl(n, n.return), Fu(n, r);
					break;
				case 7: wl(n, n.return);
				default: Fu(n, r);
			}
			e = e.sibling;
		}
	}
	function Iu(e, t, n) {
		for (n = t.subtreeFlags & 8772 ? n : n & -2, t = t.child; t !== null;) {
			var r = t.alternate, i = e, a = t, o = a.flags, s = !!(n & 1);
			switch (a.tag) {
				case 0:
				case 11:
				case 15:
					Iu(i, a, n), bl(4, a);
					break;
				case 1:
					if (Iu(i, a, n), r = a, i = r.stateNode, typeof i.componentDidMount == "function") try {
						i.componentDidMount();
					} catch (e) {
						hf(r, r.return, e);
					}
					if (r = a, i = r.updateQueue, i !== null) {
						var c = r.stateNode;
						try {
							var l = i.shared.hiddenCallbacks;
							if (l !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < l.length; i++) Co(l[i], c);
						} catch (e) {
							hf(r, r.return, e);
						}
					}
					s && o & 64 && xl(a), Cl(a, a.return);
					break;
				case 27: n & 2 && Il(a);
				case 5:
					a.tag !== 5 && a.tag !== 27 || El(a), Iu(i, a, n), s && r === null && o & 4 && Al(a), Cl(a, a.return);
					break;
				case 6:
					El(a);
					break;
				case 26:
					c = a.stateNode, a.memoizedState !== null || c === null || nu || Jm(Sm(c.ownerDocument), a.type, c), Iu(i, a, n), s && r === null && o & 4 && Al(a), Cl(a, a.return);
					break;
				case 12:
					Iu(i, a, n);
					break;
				case 31:
					Iu(i, a, n), s && o & 4 && Cu(i, a);
					break;
				case 13:
					Iu(i, a, n), s && o & 4 && wu(i, a);
					break;
				case 22:
					a.memoizedState === null && Iu(i, a, n), Cl(a, a.return);
					break;
				case 30:
					Iu(i, a, n), Cl(a, a.return);
					break;
				case 7: Cl(a, a.return);
				default: Iu(i, a, n);
			}
			t = t.sibling;
		}
	}
	function Lu(e, t) {
		var n = null;
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && Ma(n));
	}
	function Ru(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Ma(e));
	}
	function zu(e, t, n, r) {
		var i = (n & 335544064) === n;
		if (t.subtreeFlags & (i ? 10262 : 10256)) for (t = t.child; t !== null;) Bu(e, t, n, r), t = t.sibling;
		else i && $l(t);
	}
	function Bu(e, t, n, r) {
		var i = (n & 335544064) === n;
		i && t.alternate === null && t.return !== null && t.return.alternate !== null && Ql(t);
		var a = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				zu(e, t, n, r), a & 2048 && bl(9, t);
				break;
			case 1:
				zu(e, t, n, r);
				break;
			case 3:
				zu(e, t, n, r), i && du && (e = e.containerInfo, e = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, e.style.viewTransitionName === "root" && (e.style.viewTransitionName = ""), e = e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "none" && (e.style.viewTransitionName = "")), a & 2048 && (a = null, t.alternate !== null && (a = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== a && (t.refCount++, a != null && Ma(a)));
				break;
			case 12:
				if (a & 2048) {
					zu(e, t, n, r), a = t.stateNode;
					try {
						var o = t.memoizedProps, s = o.id, c = o.onPostCommit;
						typeof c == "function" && c(s, t.alternate === null ? "mount" : "update", a.passiveEffectDuration, -0);
					} catch (e) {
						hf(t, t.return, e);
					}
				} else zu(e, t, n, r);
				break;
			case 31:
			case 13:
				zu(e, t, n, r);
				break;
			case 23: break;
			case 22:
				o = t.stateNode, s = t.alternate, t.memoizedState === null ? (i && s !== null && s.memoizedState !== null && Ql(t), o._visibility & 2 ? zu(e, t, n, r) : (o._visibility |= 2, Vu(e, t, n, r, !!(t.subtreeFlags & 10256) || !1))) : (i && s !== null && s.memoizedState === null && Ql(s), o._visibility & 2 ? zu(e, t, n, r) : Hu(e, t)), a & 2048 && Lu(s, t);
				break;
			case 24:
				zu(e, t, n, r), a & 2048 && Ru(t.alternate, t);
				break;
			case 30:
				i && (a = t.alternate, a !== null && (Gl(a.child, !0), Gl(t.child, !0))), zu(e, t, n, r);
				break;
			default: zu(e, t, n, r);
		}
	}
	function Vu(e, t, n, r, i) {
		for (i &&= !!(t.subtreeFlags & 10256) || !1, t = t.child; t !== null;) {
			var a = e, o = t, s = n, c = r, l = o.flags;
			switch (o.tag) {
				case 0:
				case 11:
				case 15:
					Vu(a, o, s, c, i), bl(8, o);
					break;
				case 23: break;
				case 22:
					var u = o.stateNode;
					o.memoizedState === null ? (u._visibility |= 2, Vu(a, o, s, c, i)) : u._visibility & 2 ? Vu(a, o, s, c, i) : Hu(a, o), i && l & 2048 && Lu(o.alternate, o);
					break;
				case 24:
					Vu(a, o, s, c, i), i && l & 2048 && Ru(o.alternate, o);
					break;
				default: Vu(a, o, s, c, i);
			}
			t = t.sibling;
		}
	}
	function Hu(e, t) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) {
			var n = e, r = t, i = r.flags;
			switch (r.tag) {
				case 22:
					Hu(n, r), i & 2048 && Lu(r.alternate, r);
					break;
				case 24:
					Hu(n, r), i & 2048 && Ru(r.alternate, r);
					break;
				default: Hu(n, r);
			}
			t = t.sibling;
		}
	}
	var Uu = 8192;
	function Wu(e, t, n) {
		if (e.subtreeFlags & Uu) for (e = e.child; e !== null;) Gu(e, t, n), e = e.sibling;
	}
	function Gu(e, t, n) {
		switch (e.tag) {
			case 26:
				Wu(e, t, n), e.flags & Uu && (e.memoizedState === null ? (e = e.stateNode, (t & 335544128) === t && $m(n, e)) : eh(n, Ou, e.memoizedState, e.memoizedProps));
				break;
			case 5:
				Wu(e, t, n), e.flags & Uu && (e = e.stateNode, (t & 335544128) === t && $m(n, e));
				break;
			case 3:
			case 4:
				var r = Ou;
				Ou = Sm(e.stateNode.containerInfo), Wu(e, t, n), Ou = r;
				break;
			case 22:
				e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = Uu, Uu = 16777216, Wu(e, t, n), Uu = r) : Wu(e, t, n));
				break;
			case 30:
				if ((e.flags & Uu) !== 0 && (r = e.memoizedProps.name, r != null && r !== "auto")) {
					var i = e.stateNode;
					i.paired = null, Rl === null && (Rl = /* @__PURE__ */ new Map()), Rl.set(r, i);
				}
				Wu(e, t, n);
				break;
			default: Wu(e, t, n);
		}
	}
	function Ku(e) {
		var t = e.alternate;
		if (t !== null && (e = t.child, e !== null)) {
			t.child = null;
			do
				t = e.sibling, e.sibling = null, e = t;
			while (e !== null);
		}
	}
	function qu(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				su = r, Xu(r, e);
			}
			Ku(e);
		}
		if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) Ju(e), e = e.sibling;
	}
	function Ju(e) {
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				qu(e), e.flags & 2048 && K(9, e, e.return);
				break;
			case 3:
			case 12:
				qu(e);
				break;
			case 22:
				var t = e.stateNode;
				e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Yu(e)) : qu(e);
				break;
			default: qu(e);
		}
	}
	function Yu(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				su = r, Xu(r, e);
			}
			Ku(e);
		}
		for (e = e.child; e !== null;) {
			switch (t = e, t.tag) {
				case 0:
				case 11:
				case 15:
					K(8, t, t.return), Yu(t);
					break;
				case 22:
					n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, Yu(t));
					break;
				default: Yu(t);
			}
			e = e.sibling;
		}
	}
	function Xu(e, t) {
		for (; su !== null;) {
			var n = su;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					K(8, n, t);
					break;
				case 23:
				case 22:
					if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
						var r = n.memoizedState.cachePool.pool;
						r != null && r.refCount++;
					}
					break;
				case 24: Ma(n.memoizedState.cache);
			}
			if (r = n.child, r !== null) r.return = n, su = r;
			else for (n = e; su !== null;) {
				r = su;
				var i = r.sibling, a = r.return;
				if (vu(r), r === n) {
					su = null;
					break;
				}
				if (i !== null) {
					i.return = a, su = i;
					break;
				}
				su = a;
			}
		}
	}
	var Zu = {
		getCacheForType: function(e) {
			var t = wa(Aa), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return wa(Aa).controller.signal;
		}
	}, Qu = typeof WeakMap == "function" ? WeakMap : Map, $u = 0, ed = null, q = null, J = 0, td = 0, nd = null, rd = !1, id = !1, ad = !1, od = 0, sd = 0, cd = 0, ld = 0, ud = 0, dd = 0, fd = 0, pd = null, md = null, hd = !1, gd = 0, _d = 0, vd = 1e400, yd = null, bd = null, xd = 0, Sd = null, Cd = null, Y = 0, wd = 0, Td = null, Ed = null, Dd = null, Od = null, kd = null, Ad = 0, jd = null;
	function Md() {
		return $u & 2 && J !== 0 ? J & -J : N.T === null ? xt() : Ff();
	}
	function Nd() {
		if (dd === 0) {
			if (!(J & 536870912) || B) {
				var e = at;
				at <<= 1, !(at & 3932160) && (at = 262144), dd = e;
			} else dd = 536870912;
		}
		return e = Ao.current, e !== null && (e.flags |= 32), dd;
	}
	function Pd(e, t) {
		if (t != null) {
			var n = e.stateNode, r = n.ref;
			r === null && (r = n.ref = Ip(_i(e.memoizedProps, n))), Od === null && (Od = []), Od.push(t.bind(null, r));
		}
	}
	function Fd(e, t, n) {
		(e === ed && (td === 2 || td === 9) || e.cancelPendingCommit !== null) && (Hd(e, 0), zd(e, J, dd, !1)), mt(e, n), $u & 2 && e === ed || (e === ed && (!($u & 2) && (ld |= n), sd === 4 && zd(e, J, dd, !1)), Of(e));
	}
	function Id(e, t, n) {
		if ($u & 6) throw Error(i(327));
		var r = !n && !(t & 127) && (t & e.expiredLanes) === 0 || lt(e, t), a = r ? Xd(e, t) : Jd(e, t, !0), o = r;
		do {
			if (a === 0) {
				id && !r && zd(e, t, 0, !1);
				break;
			}
			if (n = e.current.alternate, o && !Rd(n)) a = Jd(e, t, !1), o = !1;
			else {
				if (a === 2) {
					if (o = t, e.errorRecoveryDisabledLanes & o) var s = 0;
					else s = e.pendingLanes & -536870913, s = s === 0 ? s & 536870912 ? 536870912 : 0 : s;
					if (s !== 0) {
						t = s;
						e: {
							var c = e;
							a = pd;
							var l = c.current.memoizedState.isDehydrated;
							if (l && (Hd(c, s).flags |= 256), s = Jd(c, s, !1), s !== 2 && s !== 6) {
								if (ad && !l) {
									c.errorRecoveryDisabledLanes |= o, ld |= o, a = 4;
									break e;
								}
								o = md, md = a, o !== null && (md === null ? md = o : md.push.apply(md, o));
							}
							a = s;
						}
						if (o = !1, a !== 2) continue;
					}
				}
				if (a === 1) {
					Hd(e, 0), zd(e, t, 0, !0);
					break;
				}
				e: {
					switch (r = e, o = a, o) {
						case 0:
						case 1: throw Error(i(345));
						case 4: if ((t & 4194048) !== t && (t & 62914560) !== t) break;
						case 6:
							zd(r, t, dd, !rd);
							break e;
						case 2:
							md = null;
							break;
						case 3:
						case 5: break;
						default: throw Error(i(329));
					}
					if ((t & 62914560) === t && (a = gd + 300 - He(), 10 < a)) {
						if (zd(r, t, dd, !rd), ct(r, 0, !0) !== 0) break e;
						Y = t, r.timeoutHandle = vp(Ld.bind(null, r, n, md, yd, hd, t, dd, ld, fd, rd, o, "Throttled", -0, 0), a);
						break e;
					}
					Ld(r, n, md, yd, hd, t, dd, ld, fd, rd, o, null, -0, 0);
				}
				break;
			}
		} while (1);
		Of(e);
	}
	function Ld(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
		e.timeoutHandle = -1;
		var m = t.subtreeFlags, h = (a & 335544064) === a;
		d = null, (h || m & 8192 || (m & 16785408) == 16785408) && (d = {
			stylesheets: null,
			count: 0,
			imgCount: 0,
			imgBytes: 0,
			suspenseyImages: [],
			waitingForImages: !0,
			waitingForViewTransition: !1,
			unsuspend: vn
		}, Rl = null, Gu(t, a, d), h && (m = d, h = e.containerInfo, h = (h.nodeType === 9 ? h : h.ownerDocument).__reactViewTransition, h != null && (m.count++, m.waitingForViewTransition = !0, m = Q.bind(m), h.finished.then(m, m))), m = (a & 62914560) === a ? gd - He() : (a & 4194048) === a ? _d - He() : 0, m = nh(d, m), m !== null) ? (Y = a, e.cancelPendingCommit = m(rf.bind(null, e, t, a, n, r, i, o, s, c, l, u, d, null, f, p)), zd(e, a, o, !l)) : rf(e, t, a, n, r, i, o, s, c, l, u, d);
	}
	function Rd(e) {
		for (var t = e;;) {
			var n = t.tag;
			if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
				var i = n[r], a = i.getSnapshot;
				i = i.value;
				try {
					if (!Vr(a(), i)) return !1;
				} catch {
					return !1;
				}
			}
			if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
			else {
				if (t === e) break;
				for (; t.sibling === null;) {
					if (t.return === null || t.return === e) return !0;
					t = t.return;
				}
				t.sibling.return = t.return, t = t.sibling;
			}
		}
		return !0;
	}
	function zd(e, t, n, r) {
		t = ut(e, t), t &= ~ud, t &= ~ld, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
		for (var i = t; 0 < i;) {
			var a = 31 - et(i), o = 1 << a;
			r[a] = -1, i &= ~o;
		}
		n !== 0 && gt(e, n, t);
	}
	function Bd() {
		return $u & 6 ? !0 : (kf(0, !1), !1);
	}
	function Vd() {
		if (q !== null) {
			if (td === 0) var e = q.return;
			else e = q, _a = ga = null, as(e), io = null, ao = 0, e = q;
			for (; e !== null;) yl(e.alternate, e), e = e.return;
			q = null;
		}
	}
	function Hd(e, t) {
		var n = e.timeoutHandle;
		return n !== -1 && (e.timeoutHandle = -1, yp(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), Y = 0, Vd(), ed = e, q = n = Pi(e.current, null), J = t, td = 0, nd = null, rd = !1, id = lt(e, t), ad = !1, fd = dd = ud = ld = cd = sd = 0, md = pd = null, hd = !1, od = ut(e, t), wi(), n;
	}
	function Ud(e, t) {
		H = null, N.H = pc, t === Ja || t === Xa ? (t = no(), td = 3) : t === Ya ? (t = no(), td = 4) : td = t === jc ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, nd = t, q === null && (sd = 1, Tc(e, Hi(t, e.current)));
	}
	function Wd() {
		var e = Ao.current;
		return e === null ? !0 : (J & 4194048) === J ? jo === null : (J & 62914560) === J || J & 536870912 ? e === jo : !1;
	}
	function Gd() {
		var e = N.H;
		return N.H = pc, e === null ? pc : e;
	}
	function Kd() {
		var e = N.A;
		return N.A = Zu, e;
	}
	function qd() {
		sd = 4, rd || (J & 4194048) !== J && Ao.current !== null || (id = !0), !(cd & 0x7ffffff) && !(ld & 0x7ffffff) || ed === null || zd(ed, J, dd, !1);
	}
	function Jd(e, t, n) {
		var r = $u;
		$u |= 2;
		var i = Gd(), a = Kd();
		(ed !== e || J !== t) && (yd = null, Hd(e, t)), t = !1;
		var o = sd;
		e: do
			try {
				if (td !== 0 && q !== null) {
					var s = q, c = nd;
					switch (td) {
						case 8:
							Vd(), o = 6;
							break e;
						case 3:
						case 2:
						case 9:
						case 6:
							Ao.current === null && (t = !0);
							var l = td;
							if (td = 0, nd = null, ef(e, s, c, l), n && id) {
								o = 0;
								break e;
							}
							break;
						default: l = td, td = 0, nd = null, ef(e, s, c, l);
					}
				}
				Yd(), o = sd;
				break;
			} catch (t) {
				Ud(e, t);
			}
		while (1);
		return t && e.shellSuspendCounter++, _a = ga = null, $u = r, N.H = i, N.A = a, q === null && (ed = null, J = 0, wi()), o;
	}
	function Yd() {
		for (; q !== null;) Qd(q);
	}
	function Xd(e, t) {
		var n = $u;
		$u |= 2;
		var r = Gd(), a = Kd();
		ed !== e || J !== t ? (yd = null, vd = He() + 500, Hd(e, t)) : id = lt(e, t);
		e: do
			try {
				if (td !== 0 && q !== null) {
					t = q;
					var o = nd;
					t: switch (td) {
						case 1:
							td = 0, nd = null, ef(e, t, o, 1);
							break;
						case 2:
						case 9:
							if (Qa(o)) {
								td = 0, nd = null, $d(t);
								break;
							}
							t = function() {
								td !== 2 && td !== 9 || ed !== e || (td = 7), Of(e);
							}, o.then(t, t);
							break e;
						case 3:
							td = 7;
							break e;
						case 4:
							td = 5;
							break e;
						case 7:
							Qa(o) ? (td = 0, nd = null, $d(t)) : (td = 0, nd = null, ef(e, t, o, 7));
							break;
						case 5:
							var s = null;
							switch (q.tag) {
								case 26: s = q.memoizedState;
								case 5:
								case 27:
									var c = q;
									if (s ? Zm(s) : c.stateNode.complete) {
										td = 0, nd = null;
										var l = c.sibling;
										if (l !== null) q = l;
										else {
											var u = c.return;
											u === null ? q = null : (q = u, tf(u));
										}
										break t;
									}
							}
							td = 0, nd = null, ef(e, t, o, 5);
							break;
						case 6:
							td = 0, nd = null, ef(e, t, o, 6);
							break;
						case 8:
							Vd(), sd = 6;
							break e;
						default: throw Error(i(462));
					}
				}
				Zd();
				break;
			} catch (t) {
				Ud(e, t);
			}
		while (1);
		return _a = ga = null, N.H = r, N.A = a, $u = n, q === null ? (ed = null, J = 0, wi(), sd) : 0;
	}
	function Zd() {
		for (; q !== null && !Be();) Qd(q);
	}
	function Qd(e) {
		var t = ul(e.alternate, e, od);
		e.memoizedProps = e.pendingProps, t === null ? tf(e) : q = t;
	}
	function $d(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = Gc(n, t, t.pendingProps, t.type, void 0, J);
				break;
			case 11:
				t = Gc(n, t, t.pendingProps, t.type.render, t.ref, J);
				break;
			case 5:
				as(t);
				var r = t;
				r === ra && (B ? (ua(r), r.tag === 5 && r.stateNode != null && (ia = r.stateNode)) : (ua(r), B = !0));
			default: yl(n, t), t = q = Fi(t, od), t = ul(n, t, od);
		}
		e.memoizedProps = e.pendingProps, t === null ? tf(e) : q = t;
	}
	function ef(e, t, n, r) {
		_a = ga = null, as(t), io = null, ao = 0;
		var i = t.return;
		try {
			if (Ac(e, i, t, n, J)) {
				sd = 1, Tc(e, Hi(n, e.current)), q = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw q = i, t;
			sd = 1, Tc(e, Hi(n, e.current)), q = null;
			return;
		}
		t.flags & 32768 ? (B || r === 1 ? e = !0 : id || J & 536870912 ? e = !1 : (rd = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = Ao.current, r !== null && r.tag === 13 && (r.flags |= 16384))), nf(t, e)) : tf(t);
	}
	function tf(e) {
		var t = e;
		do {
			if (t.flags & 32768) {
				nf(t, rd);
				return;
			}
			e = t.return;
			var n = _l(t.alternate, t, od);
			if (n !== null) {
				q = n;
				return;
			}
			if (t = t.sibling, t !== null) {
				q = t;
				return;
			}
			q = t = e;
		} while (t !== null);
		sd === 0 && (sd = 5);
	}
	function nf(e, t) {
		do {
			var n = vl(e.alternate, e);
			if (n !== null) {
				n.flags &= 32767, q = n;
				return;
			}
			if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
				q = e;
				return;
			}
			q = e = n;
		} while (e !== null);
		sd = 6, q = null;
	}
	function rf(e, t, n, r, a, o, s, c, l, u, d, f) {
		e.cancelPendingCommit = null;
		do
			ff();
		while (xd !== 0);
		if ($u & 6) throw Error(i(327));
		if (t !== null) {
			if (t === e.current) throw Error(i(177));
			e === ed && (q = ed = null, J = 0), Cd = t, Sd = e, Y = n, Td = a, Ed = r, af(e, t, n, s, c, l, f);
		}
	}
	function af(e, t, n, r, i, a, o) {
		var s = t.lanes | t.childLanes;
		if (wd = s, s |= Ci, ht(e, n, s, r, i, a), Od = null, (n & 335544064) === n ? (kd = Fa(e), r = 10262) : (kd = null, r = 10256), (t.subtreeFlags & r) !== 0 || (t.flags & r) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, xf(Ke, function() {
			return pf(), null;
		})) : (e.callbackNode = null, e.callbackPriority = 0), Ll = !1, r = !!(t.flags & 13878), t.subtreeFlags & 13878 || r) {
			r = N.T, N.T = null, i = ve.p, ve.p = 2, a = $u, $u |= 4;
			try {
				fu(e, t, n);
			} finally {
				$u = a, ve.p = i, N.T = r;
			}
		}
		xd = 1, Ll ? Dd = Pp(o, e.containerInfo, kd, cf, lf, sf, uf, pf, of, null, null) : (cf(), lf(), uf());
	}
	function of(e) {
		xd !== 0 && (0, Sd.onRecoverableError)(e, { componentStack: null });
	}
	function sf() {
		xd === 3 && (xd = 0, Nu(Cd, Sd), xd = 4);
	}
	function cf() {
		if (xd === 1) {
			xd = 0;
			var e = Sd, t = Cd, n = Y, r = !!(t.flags & 13878);
			if (t.subtreeFlags & 13878 || r) {
				r = N.T, N.T = null;
				var i = ve.p;
				ve.p = 2;
				var a = $u;
				$u |= 4;
				try {
					lu = uu = !1, ku(t, e, n), n = up;
					var o = qr(e.containerInfo), s = n.focusedElem, c = n.selectionRange;
					if (o !== s && s && s.ownerDocument && Kr(s.ownerDocument.documentElement, s)) {
						if (c !== null && Jr(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = Gr(s, h), v = Gr(s, g);
									if (_ && v && (p.rangeCount !== 1 || p.anchorNode !== _.node || p.anchorOffset !== _.offset || p.focusNode !== v.node || p.focusOffset !== v.offset)) {
										var y = d.createRange();
										y.setStart(_.node, _.offset), p.removeAllRanges(), h > g ? (p.addRange(y), p.extend(v.node, v.offset)) : (y.setEnd(v.node, v.offset), p.addRange(y));
									}
								}
							}
						}
						for (d = [], p = s; p = p.parentNode;) p.nodeType === 1 && d.push({
							element: p,
							left: p.scrollLeft,
							top: p.scrollTop
						});
						for (typeof s.focus == "function" && s.focus(), s = 0; s < d.length; s++) {
							var b = d[s];
							b.element.scrollLeft = b.left, b.element.scrollTop = b.top;
						}
					}
					_h = !!lp, up = lp = null;
				} finally {
					$u = a, ve.p = i, N.T = r;
				}
			}
			e.current = t, xd = 2;
		}
	}
	function lf() {
		if (xd === 2) {
			xd = 0;
			var e = Sd, t = Cd, n = !!(t.flags & 8772);
			if (t.subtreeFlags & 8772 || n) {
				n = N.T, N.T = null;
				var r = ve.p;
				ve.p = 2;
				var i = $u;
				$u |= 4;
				try {
					mu(e, t.alternate, t);
				} finally {
					$u = i, ve.p = r, N.T = n;
				}
			}
			xd = 3;
		}
	}
	function uf() {
		if (xd === 4 || xd === 3) {
			xd = 0;
			var e = Dd;
			Dd = null, Ve();
			var t = Sd, n = Cd, r = Y, i = Ed, a = (r & 335544064) === r ? 10262 : 10256;
			if ((n.subtreeFlags & a) !== 0 || (n.flags & a) !== 0 ? xd = 5 : (xd = 0, Cd = Sd = null, df(t, t.pendingLanes)), a = t.pendingLanes, a === 0 && (bd = null), bt(r), n = n.stateNode, Qe && typeof Qe.onCommitFiberRoot == "function") try {
				Qe.onCommitFiberRoot(Ze, n, void 0, (n.current.flags & 128) == 128);
			} catch {}
			if (i !== null) {
				n = N.T, a = ve.p, ve.p = 2, N.T = null;
				try {
					for (var o = t.onRecoverableError, s = 0; s < i.length; s++) {
						var c = i[s];
						o(c.value, { componentStack: c.stack });
					}
				} finally {
					N.T = n, ve.p = a;
				}
			}
			if (i = Od, o = kd, kd = null, i !== null && (Od = null, o === null && (o = []), e !== null)) for (c = 0; c < i.length; c++) n = (0, i[c])(o), n !== void 0 && e.finished.finally(n);
			Y & 3 && ff(), Of(t), a = t.pendingLanes, r & 261930 && a & 42 ? t === jd ? Ad++ : (Ad = 0, jd = t) : (Ad = 0, jd = null), kf(0, !1);
		}
	}
	function df(e, t) {
		(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Ma(t)));
	}
	function ff() {
		return Dd !== null && (Dd.skipTransition(), Dd = null), cf(), lf(), uf(), pf();
	}
	function pf() {
		if (xd !== 5) return !1;
		var e = Sd, t = wd;
		wd = 0;
		var n = bt(Y), r = N.T, a = ve.p;
		try {
			ve.p = 32 > n ? 32 : n, N.T = null, n = Td, Td = null;
			var o = Sd, s = Y;
			if (xd = 0, Cd = Sd = null, Y = 0, $u & 6) throw Error(i(331));
			var c = $u;
			if ($u |= 4, Ju(o.current), Bu(o, o.current, s, n), $u = c, kf(0, !1), Qe && typeof Qe.onPostCommitFiberRoot == "function") try {
				Qe.onPostCommitFiberRoot(Ze, o);
			} catch {}
			return !0;
		} finally {
			ve.p = a, N.T = r, df(e, t);
		}
	}
	function mf(e, t, n) {
		t = Hi(n, t), t = Dc(e.stateNode, t, 2), e = _o(e, t, 2), e !== null && (mt(e, 2), Of(e));
	}
	function hf(e, t, n) {
		if (e.tag === 3) mf(e, e, n);
		else for (; t !== null;) {
			if (t.tag === 3) {
				mf(t, e, n);
				break;
			}
			if (t.tag === 1) {
				var r = t.stateNode;
				if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (bd === null || !bd.has(r))) {
					e = Hi(n, e), n = Oc(2), r = _o(t, n, 2), r !== null && (kc(n, r, t, e), mt(r, 2), Of(r));
					break;
				}
			}
			t = t.return;
		}
	}
	function gf(e, t, n) {
		var r = e.pingCache;
		if (r === null) {
			r = e.pingCache = new Qu();
			var i = /* @__PURE__ */ new Set();
			r.set(t, i);
		} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
		i.has(n) || (ad = !0, i.add(n), e = _f.bind(null, e, t, n), t.then(e, e));
	}
	function _f(e, t, n) {
		var r = e.pingCache;
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, ed === e && (J & n) === n && (sd === 4 || sd === 3 && (J & 62914560) === J && 300 > He() - gd ? $u & 2 ? ud |= n : Hd(e, 0) : ud |= n, fd === J && (fd = 0)), Of(e);
	}
	function vf(e, t) {
		t === 0 && (t = ft()), e = Di(e, t), e !== null && (mt(e, t), Of(e));
	}
	function yf(e) {
		var t = e.memoizedState, n = 0;
		t !== null && (n = t.retryLane), vf(e, n);
	}
	function bf(e, t) {
		var n = 0;
		switch (e.tag) {
			case 31:
			case 13:
				var r = e.stateNode, a = e.memoizedState;
				a !== null && (n = a.retryLane);
				break;
			case 19:
				r = e.stateNode;
				break;
			case 22:
				r = e.stateNode._retryCache;
				break;
			default: throw Error(i(314));
		}
		r !== null && r.delete(t), vf(e, n);
	}
	function xf(e, t) {
		return Re(e, t);
	}
	var Sf = null, Cf = null, wf = !1, Tf = !1, Ef = !1, Df = 0;
	function Of(e) {
		e !== Cf && e.next === null && (Cf === null ? Sf = Cf = e : Cf = Cf.next = e), Tf = !0, wf || (wf = !0, Pf());
	}
	function kf(e, t) {
		if (!Ef && Tf) {
			Ef = !0;
			do
				for (var n = !1, r = Sf; r !== null;) {
					if (!t) {
						if (e !== 0) {
							var i = r.pendingLanes;
							if (i === 0) var a = 0;
							else {
								var o = r.suspendedLanes, s = r.pingedLanes;
								a = (1 << 31 - et(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 0xc000095 ? a & 0xc000095 | 1 : a ? a | 2 : 0;
							}
							a !== 0 && (n = !0, X(r, a));
						} else a = J, a = ct(r, r === ed ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || lt(r, a) || (n = !0, X(r, a));
					}
					r = r.next;
				}
			while (n);
			Ef = !1;
		}
	}
	function Af() {
		jf();
	}
	function jf() {
		Tf = wf = !1;
		var e = 0;
		Df !== 0 && _p() && (e = Df);
		for (var t = He(), n = null, r = Sf; r !== null;) {
			var i = r.next, a = Mf(r, t);
			a === 0 ? (r.next = null, n === null ? Sf = i : n.next = i, i === null && (Cf = n)) : (n = r, (e !== 0 || a & 3) && (Tf = !0)), r = i;
		}
		xd !== 0 && xd !== 5 || kf(e, !1), Df !== 0 && (Df = 0);
	}
	function Mf(e, t) {
		for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
			var o = 31 - et(a), s = 1 << o, c = i[o];
			c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = dt(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
		}
		if (t = ed, n = J, n = ct(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && (td === 2 || td === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && ze(r), e.callbackNode = null, e.callbackPriority = 0;
		if (!(n & 3) || lt(e, n)) {
			if (t = n & -n, t === e.callbackPriority) return t;
			switch (r !== null && ze(r), bt(n)) {
				case 2:
				case 8:
					n = Ge;
					break;
				case 32:
					n = Ke;
					break;
				case 268435456:
					n = Je;
					break;
				default: n = Ke;
			}
			return r = Nf.bind(null, e), n = Re(n, r), e.callbackPriority = t, e.callbackNode = n, t;
		}
		return r !== null && r !== null && ze(r), e.callbackPriority = 2, e.callbackNode = null, 2;
	}
	function Nf(e, t) {
		if (xd !== 0 && xd !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
		var n = e.callbackNode;
		if (ff() && e.callbackNode !== n) return null;
		var r = J;
		return r = ct(e, e === ed ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (Id(e, r, t), Mf(e, He()), e.callbackNode != null && e.callbackNode === n ? Nf.bind(null, e) : null);
	}
	function X(e, t) {
		if (ff()) return null;
		Id(e, t, !0);
	}
	function Pf() {
		Sp(function() {
			$u & 6 ? Re(We, Af) : jf();
		});
	}
	function Ff() {
		if (Df === 0) {
			var e = Ra;
			e === 0 && (e = it, it <<= 1, !(it & 261888) && (it = 256)), Df = e;
		}
		return Df;
	}
	function If(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : _n(e);
	}
	function Lf(e, t, n, r, i) {
		if (t === "submit" && n && n.stateNode === i) {
			var a = If((i[wt] || null).action), o = r.submitter;
			o && (t = (t = o[wt] || null) ? If(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new zn("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (Df !== 0) {
								var e = new FormData(i, o);
								$s(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = new FormData(i, o), $s(n, {
							pending: !0,
							data: e,
							method: i.method,
							action: a
						}, a, e));
					},
					currentTarget: i
				}]
			});
		}
	}
	for (var Rf = 0; Rf < mi.length; Rf++) {
		var zf = mi[Rf];
		hi(zf.toLowerCase(), "on" + (zf[0].toUpperCase() + zf.slice(1)));
	}
	hi(oi, "onAnimationEnd"), hi(si, "onAnimationIteration"), hi(ci, "onAnimationStart"), hi("dblclick", "onDoubleClick"), hi("focusin", "onFocus"), hi("focusout", "onBlur"), hi(li, "onTransitionRun"), hi(ui, "onTransitionStart"), hi(di, "onTransitionCancel"), hi(fi, "onTransitionEnd"), Vt("onMouseEnter", ["mouseout", "mouseover"]), Vt("onMouseLeave", ["mouseout", "mouseover"]), Vt("onPointerEnter", ["pointerout", "pointerover"]), Vt("onPointerLeave", ["pointerout", "pointerover"]), Bt("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), Bt("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), Bt("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), Bt("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), Bt("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), Bt("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
	var Bf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Vf = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Bf));
	function Hf(e, t) {
		t = !!(t & 4);
		for (var n = 0; n < e.length; n++) {
			var r = e[n], i = r.event;
			r = r.listeners;
			e: {
				var a = void 0;
				if (t) for (var o = r.length - 1; 0 <= o; o--) {
					var s = r[o], c = s.instance, l = s.currentTarget;
					if (s = s.listener, c !== a && i.isPropagationStopped()) break e;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						bi(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break e;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						bi(e);
					}
					i.currentTarget = null, a = c;
				}
			}
		}
	}
	function Z(e, t) {
		var n = t[Et];
		n === void 0 && (n = t[Et] = /* @__PURE__ */ new Set());
		var r = e + "__bubble";
		n.has(r) || (Kf(t, e, 2, !1), n.add(r));
	}
	function Uf(e, t, n) {
		var r = 0;
		t && (r |= 4), Kf(n, e, r, t);
	}
	var Wf = "_reactListening" + Math.random().toString(36).slice(2);
	function Gf(e) {
		if (!e[Wf]) {
			e[Wf] = !0, Rt.forEach(function(t) {
				t !== "selectionchange" && (Vf.has(t) || Uf(t, !1, e), Uf(t, !0, e));
			});
			var t = e.nodeType === 9 ? e : e.ownerDocument;
			t === null || t[Wf] || (t[Wf] = !0, Uf("selectionchange", !1, t));
		}
	}
	function Kf(e, t, n, r) {
		switch (wh(t)) {
			case 2:
				var i = vh;
				break;
			case 8:
				i = yh;
				break;
			default: i = bh;
		}
		n = i.bind(null, t, n, e), i = void 0, !On || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
			capture: !0,
			passive: i
		}) : i === void 0 ? e.addEventListener(t, n, !1) : e.addEventListener(t, n, { passive: i });
	}
	function qf(e, t, n, r, i) {
		var a = r;
		if (!(t & 1) && !(t & 2) && r !== null) e: for (;;) {
			if (r === null) return;
			var s = r.tag;
			if (s === 3 || s === 4) {
				var c = r.stateNode.containerInfo;
				if (c === i) break;
				if (s === 4) for (s = r.return; s !== null;) {
					var l = s.tag;
					if ((l === 3 || l === 4) && s.stateNode.containerInfo === i) return;
					s = s.return;
				}
				for (; c !== null;) {
					if (s = Nt(c), s === null) return;
					if (l = s.tag, l === 5 || l === 6 || l === 26 || l === 27) {
						r = a = s;
						continue e;
					}
					c = c.parentNode;
				}
			}
			r = r.return;
		}
		Tn(function() {
			var r = a, i = bn(n), s = [];
			e: {
				var c = pi.get(e);
				if (c !== void 0) {
					var l = zn, u = e;
					switch (e) {
						case "keypress": if (Pn(n) === 0) break e;
						case "keydown":
						case "keyup":
							l = rr;
							break;
						case "focusin":
							u = "focus", l = Jn;
							break;
						case "focusout":
							u = "blur", l = Jn;
							break;
						case "beforeblur":
						case "afterblur":
							l = Jn;
							break;
						case "click": if (n.button === 2) break e;
						case "auxclick":
						case "dblclick":
						case "mousedown":
						case "mousemove":
						case "mouseup":
						case "mouseout":
						case "mouseover":
						case "contextmenu":
							l = Kn;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							l = qn;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							l = or;
							break;
						case oi:
						case si:
						case ci:
							l = Yn;
							break;
						case fi:
							l = sr;
							break;
						case "scroll":
						case "scrollend":
							l = Vn;
							break;
						case "wheel":
							l = cr;
							break;
						case "copy":
						case "cut":
						case "paste":
							l = Xn;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							l = ir;
							break;
						case "submit":
							l = ar;
							break;
						case "toggle":
						case "beforetoggle": l = lr;
					}
					var d = !!(t & 4), f = !d && (e === "scroll" || e === "scrollend"), p = d ? c === null ? null : c + "Capture" : c;
					d = [];
					for (var m = r, h; m !== null;) {
						var g = m;
						if (h = g.stateNode, g = g.tag, g !== 5 && g !== 26 && g !== 27 || h === null || p === null || (g = En(m, p), g != null && d.push(Jf(m, g, h))), f) break;
						m = m.return;
					}
					0 < d.length && (c = new l(c, u, null, n, i), s.push({
						event: c,
						listeners: d
					}));
				}
			}
			if (!(t & 7)) {
				e: {
					if (l = e === "mouseover" || e === "pointerover", c = e === "mouseout" || e === "pointerout", l && n !== yn && (u = n.relatedTarget || n.fromElement) && (Nt(u) || u[Tt])) break e;
					(c || l) && (u = i.window === i ? i : (l = i.ownerDocument) ? l.defaultView || l.parentWindow : window, c ? (l = n.relatedTarget || n.toElement, c = r, l = l ? Nt(l) : null, l !== null && (f = o(l), d = l.tag, l !== f || d !== 5 && d !== 27 && d !== 6) && (l = null)) : (c = null, l = r), c !== l && (d = Kn, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = ir, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = c == null ? u : R(c), h = l == null ? u : R(l), u = new d(g, m + "leave", c, n, i), u.target = f, u.relatedTarget = h, g = null, Nt(i) === r && (d = new d(p, m + "enter", l, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, d = c && l ? E(c, l, Xf) : null, c !== null && Zf(s, u, c, d, !1), l !== null && f !== null && Zf(s, f, l, d, !0)));
				}
				e: {
					if (c = r ? R(r) : window, l = c.nodeName && c.nodeName.toLowerCase(), l === "select" || l === "input" && c.type === "file") var _ = kr;
					else if (Cr(c)) {
						if (Ar) _ = zr;
						else {
							_ = Lr;
							var v = Ir;
						}
					} else l = c.nodeName, !l || l.toLowerCase() !== "input" || c.type !== "checkbox" && c.type !== "radio" ? r && mn(r.elementType) && (_ = kr) : _ = Rr;
					if (_ &&= _(e, r)) {
						wr(s, _, n, i);
						break e;
					}
					v && v(e, c, r);
				}
				switch (v = r ? R(r) : window, e) {
					case "focusin":
						(Cr(v) || v.contentEditable === "true") && (Xr = v, Zr = r, Qr = null);
						break;
					case "focusout":
						Qr = Zr = Xr = null;
						break;
					case "mousedown":
						$r = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						$r = !1, ei(s, n, i);
						break;
					case "selectionchange": if (Yr) break;
					case "keydown":
					case "keyup": ei(s, n, i);
				}
				var y;
				if (dr) e: {
					switch (e) {
						case "compositionstart":
							var b = "onCompositionStart";
							break e;
						case "compositionend":
							b = "onCompositionEnd";
							break e;
						case "compositionupdate":
							b = "onCompositionUpdate";
							break e;
					}
					b = void 0;
				}
				else yr ? _r(e, n) && (b = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (b = "onCompositionStart");
				b && (mr && n.locale !== "ko" && (yr || b !== "onCompositionStart" ? b === "onCompositionEnd" && yr && (y = Nn()) : (An = i, jn = "value" in An ? An.value : An.textContent, yr = !0)), v = Yf(r, b), 0 < v.length && (b = new Zn(b, e, null, n, i), s.push({
					event: b,
					listeners: v
				}), y ? b.data = y : (y = vr(n), y !== null && (b.data = y)))), (y = pr ? br(e, n) : xr(e, n)) && (b = Yf(r, "onBeforeInput"), 0 < b.length && (v = new Zn("onBeforeInput", "beforeinput", null, n, i), s.push({
					event: v,
					listeners: b
				}), v.data = y)), Lf(s, e, r, n, i);
			}
			Hf(s, t);
		});
	}
	function Jf(e, t, n) {
		return {
			instance: e,
			listener: t,
			currentTarget: n
		};
	}
	function Yf(e, t) {
		for (var n = t + "Capture", r = []; e !== null;) {
			var i = e, a = i.stateNode;
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = En(e, n), i != null && r.unshift(Jf(e, i, a)), i = En(e, t), i != null && r.push(Jf(e, i, a))), e.tag === 3) return r;
			e = e.return;
		}
		return [];
	}
	function Xf(e) {
		if (e === null) return null;
		do
			e = e.return;
		while (e && e.tag !== 5 && e.tag !== 27);
		return e || null;
	}
	function Zf(e, t, n, r, i) {
		for (var a = t._reactName, o = []; n !== null && n !== r;) {
			var s = n, c = s.alternate, l = s.stateNode;
			if (s = s.tag, c !== null && c === r) break;
			s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = En(n, a), l != null && o.unshift(Jf(n, l, c))) : i || (l = En(n, a), l != null && o.push(Jf(n, l, c)))), n = n.return;
		}
		o.length !== 0 && e.push({
			event: t,
			listeners: o
		});
	}
	var Qf = /\r\n?/g, $f = /\u0000|\uFFFD/g;
	function ep(e) {
		return (typeof e == "string" ? e : "" + e).replace(Qf, "\n").replace($f, "");
	}
	function tp(e, t) {
		return t = ep(t), ep(e) === t;
	}
	function np(e, t, n, r, a, o) {
		switch (n) {
			case "children":
				if (typeof r == "string") t === "body" || t === "textarea" && r === "" || un(e, r);
				else if (typeof r == "number" || typeof r == "bigint") t !== "body" && un(e, "" + r);
				else return;
				break;
			case "className":
				Jt(e, "class", r);
				break;
			case "tabIndex":
				Jt(e, "tabindex", r);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				Jt(e, n, r);
				break;
			case "style":
				pn(e, r, o);
				return;
			case "data": if (t !== "object") {
				Jt(e, "data", r);
				break;
			}
			case "src":
			case "href":
				if (r === "" && (t !== "a" || n !== "href") || r == null || typeof r == "function" || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = _n(r), e.setAttribute(n, r);
				break;
			case "action":
			case "formAction":
				if (typeof r == "function") {
					e.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
					break;
				}
				if (typeof o == "function" && (n === "formAction" ? (t !== "input" && np(e, t, "name", a.name, a, null), np(e, t, "formEncType", a.formEncType, a, null), np(e, t, "formMethod", a.formMethod, a, null), np(e, t, "formTarget", a.formTarget, a, null)) : (np(e, t, "encType", a.encType, a, null), np(e, t, "method", a.method, a, null), np(e, t, "target", a.target, a, null))), r == null || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = _n(r), e.setAttribute(n, r);
				break;
			case "onClick":
				r != null && (e.onclick = vn);
				return;
			case "onScroll":
				r != null && Z("scroll", e);
				return;
			case "onScrollEnd":
				r != null && Z("scrollend", e);
				return;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						o?.__html !== n && (e.innerHTML = n);
					}
				}
				break;
			case "multiple":
				e.multiple = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "muted":
				e.muted = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "ref":
			case "autoFocus": break;
			case "xlinkHref":
				if (r == null || typeof r == "function" || typeof r == "boolean" || typeof r == "symbol") {
					e.removeAttribute("xlink:href");
					break;
				}
				n = _n(r), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
				break;
			case "contentEditable":
			case "spellCheck":
			case "draggable":
			case "value":
			case "autoReverse":
			case "externalResourcesRequired":
			case "focusable":
			case "preserveAlpha":
				r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "inert":
			case "allowFullScreen":
			case "async":
			case "autoPlay":
			case "controls":
			case "credentialless":
			case "default":
			case "defer":
			case "disabled":
			case "disablePictureInPicture":
			case "disableRemotePlayback":
			case "formNoValidate":
			case "hidden":
			case "loop":
			case "noModule":
			case "noValidate":
			case "open":
			case "playsInline":
			case "readOnly":
			case "required":
			case "reversed":
			case "scoped":
			case "seamless":
			case "itemScope":
				r && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, "") : e.removeAttribute(n);
				break;
			case "capture":
			case "download":
				!0 === r ? e.setAttribute(n, "") : !1 !== r && r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "cols":
			case "rows":
			case "size":
			case "span":
				r != null && typeof r != "function" && typeof r != "symbol" && !isNaN(r) && 1 <= r ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "rowSpan":
			case "start":
				r == null || typeof r == "function" || typeof r == "symbol" || isNaN(r) ? e.removeAttribute(n) : e.setAttribute(n, r);
				break;
			case "popover":
				Z("beforetoggle", e), Z("toggle", e), qt(e, "popover", r);
				break;
			case "xlinkActuate":
				Yt(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
				break;
			case "xlinkArcrole":
				Yt(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
				break;
			case "xlinkRole":
				Yt(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
				break;
			case "xlinkShow":
				Yt(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
				break;
			case "xlinkTitle":
				Yt(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
				break;
			case "xlinkType":
				Yt(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
				break;
			case "xmlBase":
				Yt(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
				break;
			case "xmlLang":
				Yt(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
				break;
			case "xmlSpace":
				Yt(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
				break;
			case "is":
				qt(e, "is", r);
				break;
			case "innerText":
			case "textContent": return;
			default: if (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") n = hn.get(n) || n, qt(e, n, r);
			else return;
		}
		Gt = !0;
	}
	function rp(e, t, n, r, a, o) {
		switch (n) {
			case "style":
				pn(e, r, o);
				return;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						o?.__html !== n && (e.innerHTML = n);
					}
				}
				break;
			case "children":
				if (typeof r == "string") un(e, r);
				else if (typeof r == "number" || typeof r == "bigint") un(e, "" + r);
				else return;
				break;
			case "onScroll":
				r != null && Z("scroll", e);
				return;
			case "onScrollEnd":
				r != null && Z("scrollend", e);
				return;
			case "onClick":
				r != null && (e.onclick = vn);
				return;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref":
			case "innerText":
			case "textContent": return;
			default:
				if (!zt.hasOwnProperty(n)) e: {
					if (n[0] === "o" && n[1] === "n" && (a = n.endsWith("Capture"), o = n.slice(2, a ? n.length - 7 : void 0), t = e[wt] || null, t = t == null ? null : t[n], typeof t == "function" && e.removeEventListener(o, t, a), typeof r == "function")) {
						typeof t != "function" && t !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(o, r, a);
						break e;
					}
					Gt = !0, n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : qt(e, n, r);
				}
				return;
		}
		Gt = !0;
	}
	function ip(e, t, n) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "img":
				Z("error", e), Z("load", e);
				var r = !1, a = !1, o;
				for (o in n) if (n.hasOwnProperty(o)) {
					var s = n[o];
					if (s != null) switch (o) {
						case "src":
							r = !0;
							break;
						case "srcSet":
							a = !0;
							break;
						case "children":
						case "dangerouslySetInnerHTML": throw Error(i(137, t));
						default: np(e, t, o, s, n, null);
					}
				}
				a && np(e, t, "srcSet", n.srcSet, n, null), r && np(e, t, "src", n.src, n, null);
				return;
			case "input":
				Z("invalid", e);
				var c = o = s = a = null, l = null, u = null;
				for (r in n) if (n.hasOwnProperty(r)) {
					var d = n[r];
					if (d != null) switch (r) {
						case "name":
							a = d;
							break;
						case "type":
							s = d;
							break;
						case "checked":
							l = d;
							break;
						case "defaultChecked":
							u = d;
							break;
						case "value":
							o = d;
							break;
						case "defaultValue":
							c = d;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (d != null) throw Error(i(137, t));
							break;
						default: np(e, t, r, d, n, null);
					}
				}
				an(e, o, c, l, u, s, a, !1);
				return;
			case "select":
				for (a in Z("invalid", e), r = s = o = null, n) if (n.hasOwnProperty(a) && (c = n[a], c != null)) switch (a) {
					case "value":
						o = c;
						break;
					case "defaultValue":
						s = c;
						break;
					case "multiple": r = c;
					default: np(e, t, a, c, n, null);
				}
				t = o, n = s, e.multiple = !!r, t == null ? n != null && sn(e, !!r, n, !0) : sn(e, !!r, t, !1);
				return;
			case "textarea":
				for (s in Z("invalid", e), o = a = r = null, n) if (n.hasOwnProperty(s) && (c = n[s], c != null)) switch (s) {
					case "value":
						r = c;
						break;
					case "defaultValue":
						a = c;
						break;
					case "children":
						o = c;
						break;
					case "dangerouslySetInnerHTML":
						if (c != null) throw Error(i(91));
						break;
					default: np(e, t, s, c, n, null);
				}
				ln(e, r, a, o);
				return;
			case "option":
				for (l in n) if (n.hasOwnProperty(l) && (r = n[l], r != null)) switch (l) {
					case "selected":
						e.selected = r && typeof r != "function" && typeof r != "symbol";
						break;
					default: np(e, t, l, r, n, null);
				}
				return;
			case "dialog":
				Z("beforetoggle", e), Z("toggle", e), Z("cancel", e), Z("close", e);
				break;
			case "iframe":
			case "object":
				Z("load", e);
				break;
			case "video":
			case "audio":
				for (r = 0; r < Bf.length; r++) Z(Bf[r], e);
				break;
			case "image":
				Z("error", e), Z("load", e);
				break;
			case "details":
				Z("toggle", e);
				break;
			case "embed":
			case "source":
			case "link": Z("error", e), Z("load", e);
			case "area":
			case "base":
			case "br":
			case "col":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "track":
			case "wbr":
			case "menuitem":
				for (u in n) if (n.hasOwnProperty(u) && (r = n[u], r != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML": throw Error(i(137, t));
					default: np(e, t, u, r, n, null);
				}
				return;
			default: if (mn(t)) {
				for (d in n) n.hasOwnProperty(d) && (r = n[d], r !== void 0 && rp(e, t, d, r, n, void 0));
				return;
			}
		}
		for (c in n) n.hasOwnProperty(c) && (r = n[c], r != null && np(e, t, c, r, n, null));
	}
	var ap = {};
	function op(e, t, n, r) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "input":
				var a = null, o = null, s = null, c = null, l = null, u = null, d = null;
				for (m in n) {
					var f = n[m];
					if (n.hasOwnProperty(m) && f != null) switch (m) {
						case "checked":
						case "value": break;
						case "defaultValue": l = f;
						default: r.hasOwnProperty(m) || np(e, t, m, null, r, f);
					}
				}
				for (var p in r) {
					var m = r[p];
					if (f = n[p], r.hasOwnProperty(p) && (m != null || f != null)) switch (p) {
						case "type":
							m !== f && (Gt = !0), o = m;
							break;
						case "name":
							m !== f && (Gt = !0), a = m;
							break;
						case "checked":
							m !== f && (Gt = !0), u = m;
							break;
						case "defaultChecked":
							m !== f && (Gt = !0), d = m;
							break;
						case "value":
							m !== f && (Gt = !0), s = m;
							break;
						case "defaultValue":
							m !== f && (Gt = !0), c = m;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (m != null) throw Error(i(137, t));
							break;
						default: m !== f && np(e, t, p, m, r, f);
					}
				}
				rn(e, s, c, l, u, d, o, a);
				return;
			case "select":
				for (o in m = s = c = p = null, n) if (l = n[o], n.hasOwnProperty(o) && l != null) switch (o) {
					case "value": break;
					case "multiple": m = l;
					default: r.hasOwnProperty(o) || np(e, t, o, null, r, l);
				}
				for (a in r) if (o = r[a], l = n[a], r.hasOwnProperty(a) && (o != null || l != null)) switch (a) {
					case "value":
						o !== l && (Gt = !0), p = o;
						break;
					case "defaultValue":
						o !== l && (Gt = !0), c = o;
						break;
					case "multiple": o !== l && (Gt = !0), s = o;
					default: o !== l && np(e, t, a, o, r, l);
				}
				t = c, n = s, r = m, p == null ? !!r != !!n && (t == null ? sn(e, !!n, n ? [] : "", !1) : sn(e, !!n, t, !0)) : sn(e, !!n, p, !1);
				return;
			case "textarea":
				for (c in m = p = null, n) if (a = n[c], n.hasOwnProperty(c) && a != null && !r.hasOwnProperty(c)) switch (c) {
					case "value":
					case "children": break;
					default: np(e, t, c, null, r, a);
				}
				for (s in r) if (a = r[s], o = n[s], r.hasOwnProperty(s) && (a != null || o != null)) switch (s) {
					case "value":
						a !== o && (Gt = !0), p = a;
						break;
					case "defaultValue":
						a !== o && (Gt = !0), m = a;
						break;
					case "children": break;
					case "dangerouslySetInnerHTML":
						if (a != null) throw Error(i(91));
						break;
					default: a !== o && np(e, t, s, a, r, o);
				}
				cn(e, p, m);
				return;
			case "option":
				for (var h in n) if (p = n[h], n.hasOwnProperty(h) && p != null && !r.hasOwnProperty(h)) switch (h) {
					case "selected":
						e.selected = !1;
						break;
					default: np(e, t, h, null, r, p);
				}
				for (l in r) if (p = r[l], m = n[l], r.hasOwnProperty(l) && p !== m && (p != null || m != null)) switch (l) {
					case "selected":
						p !== m && (Gt = !0), e.selected = p && typeof p != "function" && typeof p != "symbol";
						break;
					default: np(e, t, l, p, r, m);
				}
				return;
			case "img":
			case "link":
			case "area":
			case "base":
			case "br":
			case "col":
			case "embed":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "source":
			case "track":
			case "wbr":
			case "menuitem":
				for (var g in n) p = n[g], n.hasOwnProperty(g) && p != null && !r.hasOwnProperty(g) && np(e, t, g, null, r, p);
				for (u in r) if (p = r[u], m = n[u], r.hasOwnProperty(u) && p !== m && (p != null || m != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML":
						if (p != null) throw Error(i(137, t));
						break;
					default: np(e, t, u, p, r, m);
				}
				return;
			default: if (mn(t)) {
				for (var _ in n) p = n[_], n.hasOwnProperty(_) && p !== void 0 && !r.hasOwnProperty(_) && rp(e, t, _, void 0, r, p);
				for (d in r) p = r[d], m = n[d], !r.hasOwnProperty(d) || p === m || p === void 0 && m === void 0 || rp(e, t, d, p, r, m);
				return;
			}
		}
		for (var v in n) p = n[v], n.hasOwnProperty(v) && p != null && !r.hasOwnProperty(v) && np(e, t, v, null, r, p);
		for (f in r) p = r[f], m = n[f], !r.hasOwnProperty(f) || p === m || p == null && m == null || np(e, t, f, p, r, m);
	}
	function sp(e) {
		switch (e) {
			case "css":
			case "script":
			case "font":
			case "img":
			case "image":
			case "input":
			case "link": return !0;
			default: return !1;
		}
	}
	function cp() {
		if (typeof performance.getEntriesByType == "function") {
			for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), r = 0; r < n.length; r++) {
				var i = n[r], a = i.transferSize, o = i.initiatorType, s = i.duration;
				if (a && s && sp(o)) {
					for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
						var c = n[r], l = c.startTime;
						if (l > s) break;
						var u = c.transferSize, d = c.initiatorType;
						u && sp(d) && (c = c.responseEnd, o += u * (c < s ? 1 : (s - l) / (c - l)));
					}
					if (--r, t += 8 * (a + o) / (i.duration / 1e3), e++, 10 < e) break;
				}
			}
			if (0 < e) return t / e / 1e6;
		}
		return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
	}
	var lp = null, up = null;
	function dp(e) {
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	function fp(e) {
		switch (e) {
			case "http://www.w3.org/2000/svg": return 1;
			case "http://www.w3.org/1998/Math/MathML": return 2;
			default: return 0;
		}
	}
	function pp(e, t) {
		if (e === 0) switch (t) {
			case "svg": return 1;
			case "math": return 2;
			default: return 0;
		}
		return e === 1 && t === "foreignObject" ? 0 : e;
	}
	function mp(e, t, n, r) {
		return n = dp(n).createElement(e), n[Ct] = r, n[wt] = t, ip(n, e, t), It(n), n;
	}
	function hp(e, t) {
		return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
	}
	var gp = null;
	function _p() {
		var e = window.event;
		return e && e.type === "popstate" ? e !== gp && (gp = e, !0) : (gp = null, !1);
	}
	var vp = typeof setTimeout == "function" ? setTimeout : void 0, yp = typeof clearTimeout == "function" ? clearTimeout : void 0, bp = typeof Promise == "function" ? Promise : void 0, xp = typeof requestAnimationFrame == "function" ? requestAnimationFrame : vp, Sp = typeof queueMicrotask == "function" ? queueMicrotask : bp === void 0 ? vp : function(e) {
		return bp.resolve(null).then(e).catch(Cp);
	};
	function Cp(e) {
		setTimeout(function() {
			throw e;
		});
	}
	function wp(e) {
		return e === "head";
	}
	function Tp(e, t) {
		var n = t, r = 0;
		do {
			var i = n.nextSibling;
			if (e.removeChild(n), i && i.nodeType === 8) {
				if (n = i.data, n === "/$" || n === "/&") {
					if (r === 0) {
						e.removeChild(i), Uh(t);
						return;
					}
					r--;
				} else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&") r++;
				else if (n === "html") ym(e.ownerDocument.documentElement);
				else if (n === "head") {
					n = e.ownerDocument.head, ym(n);
					for (var a = n.firstChild; a;) {
						var o = a.nextSibling, s = a.nodeName;
						a[At] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
					}
				} else n === "body" && ym(e.ownerDocument.body);
			}
			n = i;
		} while (n);
		Uh(t);
	}
	function Ep(e, t) {
		var n = e;
		e = 0;
		do {
			var r = n.nextSibling;
			if (n.nodeType === 1 ? t ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (t ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), r && r.nodeType === 8) {
				if (n = r.data, n === "/$") {
					if (e === 0) break;
					e--;
				} else n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || e++;
			}
			n = r;
		} while (n);
	}
	function Dp(e, t, n) {
		if (t = CSS.escape(t) === t ? t : "r-" + btoa(t).replace(/=/g, ""), e.style.viewTransitionName = t, n != null && (e.style.viewTransitionClass = n), n = getComputedStyle(e), n.display === "inline") {
			if (t = e.getClientRects(), t.length === 1) var r = 1;
			else for (var i = r = 0; i < t.length; i++) {
				var a = t[i];
				0 < a.width && 0 < a.height && r++;
			}
			r === 1 && (e = e.style, e.display = t.length === 1 ? "inline-block" : "block", e.marginTop = "-" + n.paddingTop, e.marginBottom = "-" + n.paddingBottom);
		}
	}
	function Op(e, t) {
		e = e.style, t = t.style;
		var n = t == null ? null : t.hasOwnProperty("viewTransitionName") ? t.viewTransitionName : t.hasOwnProperty("view-transition-name") ? t["view-transition-name"] : null;
		e.viewTransitionName = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), n = t == null ? null : t.hasOwnProperty("viewTransitionClass") ? t.viewTransitionClass : t.hasOwnProperty("view-transition-class") ? t["view-transition-class"] : null, e.viewTransitionClass = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), e.display === "inline-block" && (t == null ? e.display = e.margin = "" : (n = t.display, e.display = n == null || typeof n == "boolean" ? "" : n, n = t.margin, n == null ? (n = t.hasOwnProperty("marginTop") ? t.marginTop : t["margin-top"], e.marginTop = n == null || typeof n == "boolean" ? "" : n, t = t.hasOwnProperty("marginBottom") ? t.marginBottom : t["margin-bottom"], e.marginBottom = t == null || typeof t == "boolean" ? "" : t) : e.margin = n));
	}
	function kp(e, t, n) {
		return n = n.ownerDocument.defaultView, {
			rect: e,
			abs: t.position === "absolute" || t.position === "fixed",
			clip: t.clipPath !== "none" || t.overflow !== "visible" || t.filter !== "none" || t.mask !== "none" || t.mask !== "none" || t.borderRadius !== "0px",
			view: 0 <= e.bottom && 0 <= e.right && e.top <= n.innerHeight && e.left <= n.innerWidth
		};
	}
	function Ap(e) {
		return kp(e.getBoundingClientRect(), getComputedStyle(e), e);
	}
	function jp(e) {
		var t = e.getBoundingClientRect();
		t = new DOMRect(t.x + 2e4, t.y + 2e4, t.width, t.height);
		var n = getComputedStyle(e);
		return kp(t, n, e);
	}
	function Mp(e) {
		return e.documentElement.clientHeight;
	}
	function Np(e) {
		this.addEventListener("load", e), this.addEventListener("error", e);
	}
	function Pp(e, t, n, r, i, a, o, s, c) {
		var l = t.nodeType === 9 ? t : t.ownerDocument;
		try {
			var u = l.startViewTransition({
				update: function() {
					var t = l.defaultView, n = t.navigation && t.navigation.transition, o = l.fonts.status;
					r();
					var s = [];
					if (o === "loaded" && (Mp(l), l.fonts.status === "loading" && s.push(l.fonts.ready)), o = s.length, e !== null) for (var c = e.suspenseyImages, u = 0, d = 0; d < c.length; d++) {
						var f = c[d];
						if (!f.complete) {
							var p = f.getBoundingClientRect();
							if (0 < p.bottom && 0 < p.right && p.top < t.innerHeight && p.left < t.innerWidth) {
								if (u += Qm(f), u > th) {
									s.length = o;
									break;
								}
								f = new Promise(Np.bind(f)), s.push(f);
							}
						}
					}
					if (0 < s.length) return t = Promise.race([Promise.all(s), new Promise(function(e) {
						return setTimeout(e, 500);
					})]).then(i, i), (n ? Promise.allSettled([n.finished, t]) : t).then(a, a);
					if (i(), n) return n.finished.then(a, a);
					a();
				},
				types: n
			});
			l.__reactViewTransition = u;
			var d = [];
			return u.ready.then(function() {
				for (var e = l.documentElement.getAnimations({ subtree: !0 }), t = 0; t < e.length; t++) {
					var n = e[t], r = n.effect, i = r.pseudoElement;
					if (i != null && i.startsWith("::view-transition")) {
						d.push(n), n = r.getKeyframes();
						for (var a = i = void 0, s = !0, c = 0; c < n.length; c++) {
							var u = n[c], f = u.width;
							if (i === void 0) i = f;
							else if (i !== f) {
								s = !1;
								break;
							}
							if (f = u.height, a === void 0) a = f;
							else if (a !== f) {
								s = !1;
								break;
							}
							delete u.width, delete u.height, u.transform === "none" && delete u.transform;
						}
						s && i !== void 0 && a !== void 0 && (r.setKeyframes(n), s = getComputedStyle(r.target, r.pseudoElement), s.width !== i || s.height !== a) && (s = n[0], s.width = i, s.height = a, s = n[n.length - 1], s.width = i, s.height = a, r.setKeyframes(n));
					}
				}
				o();
			}, function(e) {
				l.__reactViewTransition === u && (l.__reactViewTransition = null);
				try {
					if (typeof e == "object" && e) switch (e.name) {
						case "InvalidStateError": (e.message === "View transition was skipped because document visibility state is hidden." || e.message === "Skipping view transition because document visibility state has become hidden." || e.message === "Skipping view transition because viewport size changed." || e.message === "Transition was aborted because of invalid state") && (e = null);
					}
					e !== null && c(e);
				} finally {
					r(), i(), o();
				}
			}), u.finished.finally(function() {
				for (var e = 0; e < d.length; e++) d[e].cancel();
				l.__reactViewTransition === u && (l.__reactViewTransition = null), s();
			}), u;
		} catch {
			return r(), i(), o(), null;
		}
	}
	function Fp(e, t) {
		this._scope = document.documentElement, this._selector = "::view-transition-" + e + "(" + t + ")";
	}
	Fp.prototype.animate = function(e, t) {
		return t = typeof t == "number" ? { duration: t } : D({}, t), t.pseudoElement = this._selector, this._scope.animate(e, t);
	}, Fp.prototype.getAnimations = function() {
		for (var e = this._scope, t = this._selector, n = e.getAnimations({ subtree: !0 }), r = [], i = 0; i < n.length; i++) {
			var a = n[i].effect;
			a !== null && a.target === e && a.pseudoElement === t && r.push(n[i]);
		}
		return r;
	}, Fp.prototype.getComputedStyle = function() {
		return getComputedStyle(this._scope, this._selector);
	};
	function Ip(e) {
		return {
			name: e,
			group: new Fp("group", e),
			imagePair: new Fp("image-pair", e),
			old: new Fp("old", e),
			new: new Fp("new", e)
		};
	}
	function Lp(e) {
		this._fragmentFiber = e, this._observers = this._eventListeners = null;
	}
	Lp.prototype.addEventListener = function(e, t, n) {
		var r = null, i = null;
		if (!(n != null && typeof n != "boolean" && (r = n.signal || null, r !== null && r.aborted))) {
			this._eventListeners === null && (this._eventListeners = []);
			var a = this._eventListeners;
			if (Hp(a, e, t, n) === -1) {
				var o = this, s = t;
				n != null && typeof n != "boolean" && !0 === n.once && (s = function(r) {
					o.removeEventListener(e, t, n), typeof t == "function" ? t.call(this, r) : t.handleEvent(r);
				}), r !== null && (i = o.removeEventListener.bind(o, e, t, n), r.addEventListener("abort", i, { once: !0 }), i = r.removeEventListener.bind(r, "abort", i)), r = Bp(n), a.push({
					type: e,
					listener: t,
					optionsOrUseCapture: n,
					attachedListener: s,
					cleanup: i
				}), m(this._fragmentFiber.child, !1, Rp, e, s, r);
			}
			this._eventListeners = a;
		}
	};
	function Rp(e, t, n, r) {
		return b(e).addEventListener(t, n, r), !1;
	}
	Lp.prototype.removeEventListener = function(e, t, n) {
		var r = this._eventListeners;
		if (r !== null && (t = Hp(r, e, t, n), t !== -1)) {
			var i = r[t];
			n = i.attachedListener;
			var a = i.cleanup;
			i = Bp(i.optionsOrUseCapture), m(this._fragmentFiber.child, !1, zp, e, n, i), r.splice(t, 1), a !== null && a();
		}
	};
	function zp(e, t, n, r) {
		return b(e).removeEventListener(t, n, r), !1;
	}
	function Bp(e) {
		return e != null && typeof e != "boolean" && (!0 === e.once || e.signal instanceof AbortSignal) ? {
			capture: e.capture,
			passive: e.passive
		} : e;
	}
	function Vp(e) {
		return e == null ? "c=0" : typeof e == "boolean" ? "c=" + (e ? "1" : "0") : "c=" + (e.capture ? "1" : "0");
	}
	function Hp(e, t, n, r) {
		if (e.length === 0) return -1;
		r = Vp(r);
		for (var i = 0; i < e.length; i++) {
			var a = e[i];
			if (a.type === t && a.listener === n && Vp(a.optionsOrUseCapture) === r) return i;
		}
		return -1;
	}
	Lp.prototype.dispatchEvent = function(e) {
		var t = g(this._fragmentFiber);
		if (t === null) return !0;
		t = b(t);
		var n = this._eventListeners;
		if (n !== null && 0 < n.length || !e.bubbles) {
			var r = t.nodeType === 9 ? t.createComment("") : document.createTextNode("");
			if (n) for (var i = 0; i < n.length; i++) {
				var a = n[i];
				r.addEventListener(a.type, a.attachedListener, Bp(a.optionsOrUseCapture));
			}
			if (t.appendChild(r), e = r.dispatchEvent(e), n) for (i = 0; i < n.length; i++) a = n[i], r.removeEventListener(a.type, a.attachedListener, Bp(a.optionsOrUseCapture));
			return t.removeChild(r), e;
		}
		return t.dispatchEvent(e);
	}, Lp.prototype.focus = function(e) {
		m(this._fragmentFiber.child, !0, Up, e, void 0, void 0);
	};
	function Up(e, t) {
		return e.tag !== 6 && (e = b(e), hm(e, t));
	}
	Lp.prototype.focusLast = function(e) {
		var t = [];
		m(this._fragmentFiber.child, !0, Wp, t, void 0, void 0);
		for (var n = t.length - 1; 0 <= n && !Up(t[n], e); n--);
	};
	function Wp(e, t) {
		return t.push(e), !1;
	}
	Lp.prototype.blur = function() {
		var e = g(this._fragmentFiber);
		e !== null && (e = b(e), e = dp(e).activeElement, e !== null && m(this._fragmentFiber.child, !1, Gp, e, void 0, void 0));
	};
	function Gp(e, t) {
		return e.tag !== 6 && (e = b(e), e === t || e.contains(t) ? (t.blur(), !0) : !1);
	}
	Lp.prototype.observeUsing = function(e) {
		this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(e), m(this._fragmentFiber.child, !1, Kp, e, void 0, void 0);
	};
	function Kp(e, t) {
		return e.tag === 6 || (e = b(e), t.observe(e)), !1;
	}
	Lp.prototype.unobserveUsing = function(e) {
		var t = this._observers;
		if (t !== null && t.has(e)) {
			t.delete(e), m(this._fragmentFiber.child, !1, qp, e, void 0, void 0);
			for (var n = t = 0; n < Jp.length; n++) {
				var r = Jp[n];
				r.fragmentInstance === this && r.observer === e ? e.unobserve(r.instance) : Jp[t++] = r;
			}
			Jp.length = t;
		}
	};
	function qp(e, t) {
		return e.tag === 6 || (e = b(e), t.unobserve(e)), !1;
	}
	var Jp = [], Yp = !1;
	function Xp(e, t, n) {
		Jp.push({
			fragmentInstance: e,
			observer: t,
			instance: n
		}), Yp || (Yp = !0, gm(function() {
			Yp = !1;
			var e = Jp;
			Jp = [];
			for (var t = 0; t < e.length; t++) {
				var n = e[t];
				n.observer.unobserve(n.instance);
			}
		}));
	}
	Lp.prototype.getClientRects = function() {
		var e = [];
		return m(this._fragmentFiber.child, !1, Zp, e, void 0, void 0), e;
	};
	function Zp(e, t) {
		if (e.tag === 6) {
			e = e.stateNode;
			var n = e.ownerDocument.createRange();
			n.selectNodeContents(e), t.push.apply(t, n.getClientRects());
		} else e = b(e), t.push.apply(t, e.getClientRects());
		return !1;
	}
	Lp.prototype.getRootNode = function(e) {
		var t = g(this._fragmentFiber);
		return t === null ? this : b(t).getRootNode(e);
	}, Lp.prototype.compareDocumentPosition = function(e) {
		var t = g(this._fragmentFiber);
		if (t === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
		var n = [];
		m(this._fragmentFiber.child, !1, Wp, n, void 0, void 0);
		var r = b(t);
		if (n.length === 0) {
			if (n = r, _(this._fragmentFiber)) {
				e: {
					for (t = this._fragmentFiber.return; t !== null;) {
						if (t.tag === 4) {
							t = t.stateNode.containerInfo;
							break e;
						}
						if (t.tag === 3 || t.tag === 5 || t.tag === 27) break;
						t = t.return;
					}
					t = null;
				}
				t != null && (n = t);
			}
			t = this._fragmentFiber;
			var i = r = n.compareDocumentPosition(e);
			return n === e ? i = Node.DOCUMENT_POSITION_CONTAINS : r & Node.DOCUMENT_POSITION_CONTAINED_BY && (n = v(t)[1], n === null ? i = Node.DOCUMENT_POSITION_PRECEDING : (e = b(n).compareDocumentPosition(e), i = e === 0 || e & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), i |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
		}
		t = b(n[0]), i = b(n[n.length - 1]);
		var a = _(this._fragmentFiber) ? t.parentElement : r;
		if (a == null) return Node.DOCUMENT_POSITION_DISCONNECTED;
		r = a.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY, a = a.compareDocumentPosition(i) & Node.DOCUMENT_POSITION_CONTAINED_BY;
		var o = t.compareDocumentPosition(e), s = i.compareDocumentPosition(e), c = o & Node.DOCUMENT_POSITION_CONTAINED_BY || s & Node.DOCUMENT_POSITION_CONTAINED_BY;
		return s = r && a && o & Node.DOCUMENT_POSITION_FOLLOWING && s & Node.DOCUMENT_POSITION_PRECEDING, t = r && t === e || a && i === e || c || s ? Node.DOCUMENT_POSITION_CONTAINED_BY : !r && t === e || !a && i === e ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : o, t & Node.DOCUMENT_POSITION_DISCONNECTED || t & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || Qp(t, this._fragmentFiber, n[0], n[n.length - 1], e) ? t : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
	};
	function Qp(e, t, n, r, i) {
		var a = Nt(i);
		if (e & Node.DOCUMENT_POSITION_CONTAINED_BY) {
			if (n = !!a) e: {
				for (; a !== null;) {
					if (a.tag === 7 && (a === t || a.alternate === t)) {
						n = !0;
						break e;
					}
					a = a.return;
				}
				n = !1;
			}
			return n;
		}
		if (e & Node.DOCUMENT_POSITION_CONTAINS) {
			if (a === null) return a = i.ownerDocument, i === a || i === a.documentElement || i === a.body;
			e: {
				for (a = t, t = g(t); a !== null;) {
					if (!(a.tag !== 5 && a.tag !== 3 && a.tag !== 27 || a !== t && a.alternate !== t)) {
						a = !0;
						break e;
					}
					a = a.return;
				}
				a = !1;
			}
			return a;
		}
		return e & Node.DOCUMENT_POSITION_PRECEDING ? ((t = !!a) && !(t = a === n) && (t = E(n, a, T), t === null ? t = !1 : (m(t, !0, C, a, n), a = x, x = null, t = a !== null)), t) : e & Node.DOCUMENT_POSITION_FOLLOWING ? ((t = !!a) && !(t = a === r) && (t = E(r, a, T), t === null ? t = !1 : (m(t, !0, w, a, r), a = x, S = x = null, t = a !== null)), t) : !1;
	}
	function $p(e, t) {
		var n = e.ownerDocument.createRange();
		n.selectNodeContents(e), e = n.getBoundingClientRect(), window.scrollTo(window.scrollX + e.left, t ? window.scrollY + e.top : window.scrollY + e.bottom - window.innerHeight);
	}
	Lp.prototype.scrollIntoView = function(e) {
		if (typeof e == "object") throw Error(i(566));
		var t = [];
		m(this._fragmentFiber.child, !1, Wp, t, void 0, void 0);
		var n = !1 !== e;
		if (t.length === 0) {
			var r = v(this._fragmentFiber);
			if (r = n ? r[1] || r[0] || g(this._fragmentFiber) : r[0] || r[1], r === null) return;
			if (r.tag === 6) {
				e = b(r), $p(e, n);
				return;
			}
			if (r = b(r), r.nodeType !== 9) {
				if (r.nodeType === 11) {
					n = "host" in r ? r.host : null, n !== null && n.scrollIntoView(e);
					return;
				}
				r.scrollIntoView(e);
			}
		}
		for (r = n ? t.length - 1 : 0; r !== (n ? -1 : t.length);) {
			var a = t[r];
			a.tag === 6 ? (a = b(a), $p(a, n)) : b(a).scrollIntoView(e), r += n ? -1 : 1;
		}
	};
	function em(e, t) {
		return e = b(e), tm(e, t), !1;
	}
	function tm(e, t) {
		e.reactFragments ??= /* @__PURE__ */ new Set(), e.reactFragments.add(t);
	}
	function nm(e, t) {
		var n = t._eventListeners;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r];
			e.addEventListener(i.type, i.attachedListener, Bp(i.optionsOrUseCapture));
		}
		e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(n) {
			for (var r = 0, i = 0; i < Jp.length; i++) {
				var a = Jp[i];
				(a.fragmentInstance !== t || a.observer !== n || a.instance !== e) && (Jp[r++] = a);
			}
			Jp.length = r, n.observe(e);
		}), tm(e, t));
	}
	function rm(e, t) {
		var n = t._eventListeners;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r];
			e.removeEventListener(i.type, i.attachedListener, Bp(i.optionsOrUseCapture));
		}
		e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(n) {
			typeof n.rootMargin == "string" ? Xp(t, n, e) : n.unobserve(e);
		}), e.reactFragments != null && e.reactFragments.delete(t));
	}
	function im(e) {
		var t = e.firstChild;
		for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
			var n = t;
			switch (t = t.nextSibling, n.nodeName) {
				case "HTML":
				case "HEAD":
				case "BODY":
					im(n), Mt(n);
					continue;
				case "SCRIPT":
				case "STYLE": continue;
				case "LINK": if (n.rel.toLowerCase() === "stylesheet") continue;
			}
			e.removeChild(n);
		}
	}
	function am(e, t, n, r) {
		for (; e.nodeType === 1;) {
			var i = n;
			if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
				if (!r && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
			} else if (!r) {
				if (t === "input" && e.type === "hidden") {
					var a = i.name == null ? null : "" + i.name;
					if (i.type === "hidden" && e.getAttribute("name") === a) return e;
				} else return e;
			} else if (!e[At]) switch (t) {
				case "meta":
					if (!e.hasAttribute("itemprop")) break;
					return e;
				case "link":
					if (a = e.getAttribute("rel"), a === "stylesheet" && e.hasAttribute("data-precedence") || a !== i.rel || e.getAttribute("href") !== (i.href == null || i.href === "" ? null : i.href) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin) || e.getAttribute("title") !== (i.title == null ? null : i.title)) break;
					return e;
				case "style":
					if (e.hasAttribute("data-precedence")) break;
					return e;
				case "script":
					if (a = e.getAttribute("src"), (a !== (i.src == null ? null : i.src) || e.getAttribute("type") !== (i.type == null ? null : i.type) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin)) && a && e.hasAttribute("async") && !e.hasAttribute("itemprop")) break;
					return e;
				default: return e;
			}
			if (e = dm(e.nextSibling), e === null) break;
		}
		return null;
	}
	function om(e, t, n) {
		if (t === "") return null;
		for (; e.nodeType !== 3;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = dm(e.nextSibling), e === null)) return null;
		return e;
	}
	function sm(e, t) {
		for (; e.nodeType !== 8;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = dm(e.nextSibling), e === null)) return null;
		return e;
	}
	function cm(e) {
		return e.data === "$?" || e.data === "$~";
	}
	function lm(e) {
		return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
	}
	function um(e, t) {
		var n = e.ownerDocument;
		if (e.data === "$~") e._reactRetry = t;
		else if (e.data !== "$?" || n.readyState !== "loading") t();
		else {
			var r = function() {
				t(), n.removeEventListener("DOMContentLoaded", r);
			};
			n.addEventListener("DOMContentLoaded", r), e._reactRetry = r;
		}
	}
	function dm(e) {
		for (; e != null; e = e.nextSibling) {
			var t = e.nodeType;
			if (t === 1 || t === 3) break;
			if (t === 8) {
				if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F") break;
				if (t === "/$" || t === "/&") return null;
			}
		}
		return e;
	}
	var fm = null;
	function pm(e) {
		e = e.nextSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "/$" || n === "/&") {
					if (t === 0) return dm(e.nextSibling);
					t--;
				} else n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
			}
			e = e.nextSibling;
		}
		return null;
	}
	function mm(e) {
		e = e.previousSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
					if (t === 0) return e;
					t--;
				} else n !== "/$" && n !== "/&" || t++;
			}
			e = e.previousSibling;
		}
		return null;
	}
	function hm(e, t) {
		function n() {
			r = !0;
		}
		if (e.ownerDocument.activeElement === e) return !0;
		var r = !1;
		try {
			e.ownerDocument.addEventListener("focus", n, !0), (e.focus || HTMLElement.prototype.focus).call(e, t);
		} finally {
			e.ownerDocument.removeEventListener("focus", n, !0);
		}
		return r;
	}
	function gm(e) {
		xp(function() {
			xp(function(t) {
				return e(t);
			});
		});
	}
	function _m(e, t, n) {
		switch (t = dp(n), e) {
			case "html":
				if (e = t.documentElement, !e) throw Error(i(452));
				return e;
			case "head":
				if (e = t.head, !e) throw Error(i(453));
				return e;
			case "body":
				if (e = t.body, !e) throw Error(i(454));
				return e;
			default: throw Error(i(451));
		}
	}
	function vm(e, t, n) {
		for (var r in n) {
			var i = n[r];
			n.hasOwnProperty(r) && i != null && np(e, t, r, null, ap, i);
		}
		n.dangerouslySetInnerHTML != null && (e.textContent = ""), e.onclick === vn && (e.onclick = null), Mt(e);
	}
	function ym(e) {
		for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
		Mt(e);
	}
	var bm = /* @__PURE__ */ new Map(), xm = /* @__PURE__ */ new Set();
	function Sm(e) {
		if (typeof e.getRootNode == "function") {
			var t = e.getRootNode();
			if (t.nodeType === 9 || t.nodeType === 11) return t;
		}
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	var Cm = ve.d;
	ve.d = {
		f: wm,
		r: Tm,
		D: Om,
		C: km,
		L: Am,
		m: jm,
		X: Nm,
		S: Mm,
		M: Pm
	};
	function wm() {
		var e = Cm.f(), t = Bd();
		return e || t;
	}
	function Tm(e) {
		var t = Pt(e);
		t !== null && t.tag === 5 && t.type === "form" ? tc(t) : Cm.r(e);
	}
	var Em = typeof document > "u" ? null : document;
	function Dm(e, t, n) {
		var r = Em;
		if (r && typeof t == "string" && t) {
			var i = nn(t);
			i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), xm.has(i) || (xm.add(i), e = {
				rel: e,
				crossOrigin: n,
				href: t
			}, r.querySelector(i) === null && (t = r.createElement("link"), ip(t, "link", e), It(t), r.head.appendChild(t)));
		}
	}
	function Om(e) {
		Cm.D(e), Dm("dns-prefetch", e, null);
	}
	function km(e, t) {
		Cm.C(e, t), Dm("preconnect", e, t);
	}
	function Am(e, t, n) {
		Cm.L(e, t, n);
		var r = Em;
		if (r && e && t) {
			var i = "link[rel=\"preload\"][as=\"" + nn(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + nn(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + nn(n.imageSizes) + "\"]")) : i += "[href=\"" + nn(e) + "\"]";
			var a = i;
			switch (t) {
				case "style":
					a = Im(e);
					break;
				case "script": a = Bm(e);
			}
			if (!(bm.has(a) || (e = D({
				rel: "preload",
				href: t === "image" && n && n.imageSrcSet ? void 0 : e,
				as: t
			}, n), bm.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(Lm(a)) || t === "script" && r.querySelector(Vm(a))))) {
				var o = r.createElement("link");
				ip(o, "link", e), t === "style" && (o[jt] = !0, o.onload = o.onerror = function() {
					Lt(o);
				}), It(o), r.head.appendChild(o);
			}
		}
	}
	function jm(e, t) {
		Cm.m(e, t);
		var n = Em;
		if (n && e) {
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + nn(r) + "\"][href=\"" + nn(e) + "\"]", a = i;
			switch (r) {
				case "audioworklet":
				case "paintworklet":
				case "serviceworker":
				case "sharedworker":
				case "worker":
				case "script": a = Bm(e);
			}
			if (!bm.has(a) && (e = D({
				rel: "modulepreload",
				href: e
			}, t), bm.set(a, e), n.querySelector(i) === null)) {
				switch (r) {
					case "audioworklet":
					case "paintworklet":
					case "serviceworker":
					case "sharedworker":
					case "worker":
					case "script": if (n.querySelector(Vm(a))) return;
				}
				r = n.createElement("link"), ip(r, "link", e), It(r), n.head.appendChild(r);
			}
		}
	}
	function Mm(e, t, n) {
		Cm.S(e, t, n);
		var r = Em;
		if (r && e) {
			var i = Ft(r).hoistableStyles, a = Im(e);
			t ||= "default";
			var o = i.get(a);
			if (!o) {
				var s = {
					loading: 0,
					preload: null
				};
				if (o = r.querySelector(Lm(a))) s.loading = 5;
				else {
					e = D({
						rel: "stylesheet",
						href: e,
						"data-precedence": t
					}, n), (n = bm.get(a)) && Wm(e, n);
					var c = o = r.createElement("link");
					It(c), ip(c, "link", e), c._p = new Promise(function(e, t) {
						c.onload = e, c.onerror = t;
					}), c.addEventListener("load", function() {
						s.loading |= 1;
					}), c.addEventListener("error", function() {
						s.loading |= 2;
					}), s.loading |= 4, Um(o, t, r);
				}
				o = {
					type: "stylesheet",
					instance: o,
					count: 1,
					state: s
				}, i.set(a, o);
			}
		}
	}
	function Nm(e, t) {
		Cm.X(e, t);
		var n = Em;
		if (n && e) {
			var r = Ft(n).hoistableScripts, i = Bm(e), a = r.get(i);
			a || (a = n.querySelector(Vm(i)), a || (e = D({
				src: e,
				async: !0
			}, t), (t = bm.get(i)) && Gm(e, t), a = n.createElement("script"), It(a), ip(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Pm(e, t) {
		Cm.M(e, t);
		var n = Em;
		if (n && e) {
			var r = Ft(n).hoistableScripts, i = Bm(e), a = r.get(i);
			a || (a = n.querySelector(Vm(i)), a || (e = D({
				src: e,
				async: !0,
				type: "module"
			}, t), (t = bm.get(i)) && Gm(e, t), a = n.createElement("script"), It(a), ip(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Fm(e, t, n, r) {
		var a = (a = F.current) ? Sm(a) : null;
		if (!a) throw Error(i(446));
		switch (e) {
			case "meta":
			case "title": return null;
			case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (n = Im(n.href), t = Ft(a).hoistableStyles, r = t.get(n), r || (r = {
				type: "style",
				instance: null,
				count: 0,
				state: null
			}, t.set(n, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			case "link":
				if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
					e = Im(n.href);
					var o = Ft(a).hoistableStyles, s = o.get(e);
					if (s || (a = a.ownerDocument || a, s = {
						type: "stylesheet",
						instance: null,
						count: 0,
						state: {
							loading: 0,
							preload: null
						}
					}, o.set(e, s), (o = a.querySelector(Lm(e))) ? o._p || (s.instance = o, s.state.loading = 5) : (o = bm.get(e), o || (o = {
						rel: "preload",
						as: "style",
						href: n.href,
						crossOrigin: n.crossOrigin,
						integrity: n.integrity,
						media: n.media,
						hrefLang: n.hrefLang,
						referrerPolicy: n.referrerPolicy
					}, bm.set(e, o)), zm(a, e, o, s.state))), t && r === null) throw Error(i(528, ""));
					return s;
				}
				if (t && r !== null) throw Error(i(529, ""));
				return null;
			case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (n = Bm(n), t = Ft(a).hoistableScripts, r = t.get(n), r || (r = {
				type: "script",
				instance: null,
				count: 0,
				state: null
			}, t.set(n, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			default: throw Error(i(444, e));
		}
	}
	function Im(e) {
		return "href=\"" + nn(e) + "\"";
	}
	function Lm(e) {
		return "link[rel=\"stylesheet\"][" + e + "]";
	}
	function Rm(e) {
		return D({}, e, {
			"data-precedence": e.precedence,
			precedence: null
		});
	}
	function zm(e, t, n, r) {
		if (t = e.querySelector("link[rel=\"preload\"][as=\"style\"][" + t + "]")) {
			if (!0 !== t[jt]) {
				r.loading = 1;
				return;
			}
		} else t = e.createElement("link"), t[jt] = !0, t.onload = t.onerror = Lt.bind(null, t), ip(t, "link", n), It(t), e.head.appendChild(t);
		r.preload = t, t.addEventListener("load", function() {
			return r.loading |= 1;
		}), t.addEventListener("error", function() {
			return r.loading |= 2;
		});
	}
	function Bm(e) {
		return "[src=\"" + nn(e) + "\"]";
	}
	function Vm(e) {
		return "script[async]" + e;
	}
	function Hm(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + nn(n.href) + "\"]");
				if (r) return t.instance = r, It(r), r;
				var a = D({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return r = (e.ownerDocument || e).createElement("style"), It(r), ip(r, "style", a), Um(r, n.precedence, e), t.instance = r;
			case "stylesheet":
				a = Im(n.href);
				var o = e.querySelector(Lm(a));
				if (o) return t.state.loading |= 4, t.instance = o, It(o), o;
				r = Rm(n), (a = bm.get(a)) && Wm(r, a), o = (e.ownerDocument || e).createElement("link"), It(o);
				var s = o;
				return s._p = new Promise(function(e, t) {
					s.onload = e, s.onerror = t;
				}), ip(o, "link", r), t.state.loading |= 4, Um(o, n.precedence, e), t.instance = o;
			case "script": return o = Bm(n.src), (a = e.querySelector(Vm(o))) ? (t.instance = a, It(a), a) : (r = n, (a = bm.get(o)) && (r = D({}, n), Gm(r, a)), e = e.ownerDocument || e, a = e.createElement("script"), It(a), ip(a, "link", r), e.head.appendChild(a), t.instance = a);
			case "void": return null;
			default: throw Error(i(443, t.type));
		}
		else t.type === "stylesheet" && !(t.state.loading & 4) && (r = t.instance, t.state.loading |= 4, Um(r, n.precedence, e));
		return t.instance;
	}
	function Um(e, t, n) {
		for (var r = n.querySelectorAll("link[rel=\"stylesheet\"][data-precedence],style[data-precedence]"), i = r.length ? r[r.length - 1] : null, a = i, o = 0; o < r.length; o++) {
			var s = r[o];
			if (s.dataset.precedence === t) a = s;
			else if (a !== i) break;
		}
		a ? a.parentNode.insertBefore(e, a.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
	}
	function Wm(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.title ??= t.title;
	}
	function Gm(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.integrity ??= t.integrity;
	}
	var Km = null;
	function qm(e, t, n) {
		if (Km === null) {
			var r = /* @__PURE__ */ new Map(), i = Km = /* @__PURE__ */ new Map();
			i.set(n, r);
		} else i = Km, r = i.get(n), r || (r = /* @__PURE__ */ new Map(), i.set(n, r));
		if (r.has(e)) return r;
		for (r.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
			var a = n[i];
			if (!(a[At] || a[Ct] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== "http://www.w3.org/2000/svg") {
				var o = a.getAttribute(t) || "";
				o = e + o;
				var s = r.get(o);
				s ? s.push(a) : r.set(o, [a]);
			}
		}
		return r;
	}
	function Jm(e, t, n) {
		e = e.ownerDocument || e, e.head.insertBefore(n, t === "title" ? e.querySelector("head > title") : null);
	}
	function Ym(e, t, n) {
		if (n === 1 || t.itemProp != null) return !1;
		switch (e) {
			case "meta":
			case "title": return !0;
			case "style":
				if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "") break;
				return !0;
			case "link":
				if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError) break;
				switch (t.rel) {
					case "stylesheet": return e = t.disabled, typeof t.precedence == "string" && e == null;
					default: return !0;
				}
			case "script": if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string") return !0;
		}
		return !1;
	}
	function Xm(e, t) {
		return e === "img" && t.src != null && t.src !== "" && t.onLoad == null && t.loading !== "lazy";
	}
	function Zm(e) {
		return !(e.type === "stylesheet" && !(e.state.loading & 3));
	}
	function Qm(e) {
		return (e.width || 100) * (e.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * .25;
	}
	function $m(e, t) {
		typeof t.decode == "function" && (e.imgCount++, t.complete || (e.imgBytes += Qm(t), e.suspenseyImages.push(t)), e = ih.bind(e), t.decode().then(e, e));
	}
	function eh(e, t, n, r) {
		if (n.type === "stylesheet" && (typeof r.media != "string" || !1 !== matchMedia(r.media).matches) && !(n.state.loading & 4)) {
			if (n.instance === null) {
				var i = Im(r.href), a = t.querySelector(Lm(i));
				if (a) {
					t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = Q.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = a, It(a);
					return;
				}
				a = t.ownerDocument || t, r = Rm(r), (i = bm.get(i)) && Wm(r, i), a = a.createElement("link"), It(a);
				var o = a;
				o._p = new Promise(function(e, t) {
					o.onload = e, o.onerror = t;
				}), ip(a, "link", r), n.instance = a;
			}
			e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && !(n.state.loading & 3) && (e.count++, n = Q.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
		}
	}
	var th = 0;
	function nh(e, t) {
		return e.stylesheets && e.count === 0 && oh(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
			var r = setTimeout(function() {
				if (e.stylesheets && oh(e, e.stylesheets), e.unsuspend) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, 6e4 + t);
			0 < e.imgBytes && th === 0 && (th = 62500 * cp());
			var i = setTimeout(function() {
				if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && oh(e, e.stylesheets), e.unsuspend)) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, (e.imgBytes > th ? 50 : 800) + t);
			return e.unsuspend = n, function() {
				e.unsuspend = null, clearTimeout(r), clearTimeout(i);
			};
		} : null;
	}
	function rh(e) {
		if (e.count === 0 && (e.imgCount === 0 || !e.waitingForImages)) {
			if (e.stylesheets) oh(e, e.stylesheets);
			else if (e.unsuspend) {
				var t = e.unsuspend;
				e.unsuspend = null, t();
			}
		}
	}
	function Q() {
		this.count--, rh(this);
	}
	function ih() {
		this.imgCount--, rh(this);
	}
	var ah = null;
	function oh(e, t) {
		e.stylesheets = null, e.unsuspend !== null && (e.count++, ah = /* @__PURE__ */ new Map(), t.forEach(sh, e), ah = null, Q.call(e));
	}
	function sh(e, t) {
		if (!(t.state.loading & 4)) {
			var n = ah.get(e);
			if (n) var r = n.get(null);
			else {
				n = /* @__PURE__ */ new Map(), ah.set(e, n);
				for (var i = e.querySelectorAll("link[data-precedence],style[data-precedence]"), a = 0; a < i.length; a++) {
					var o = i[a];
					(o.nodeName === "LINK" || o.getAttribute("media") !== "not all") && (n.set(o.dataset.precedence, o), r = o);
				}
				r && n.set(null, r);
			}
			i = t.instance, o = i.getAttribute("data-precedence"), a = n.get(o) || r, a === r && n.set(null, i), n.set(o, i), this.count++, r = Q.bind(this), i.addEventListener("load", r), i.addEventListener("error", r), a ? a.parentNode.insertBefore(i, a.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= 4;
		}
	}
	var ch = {
		$$typeof: re,
		Provider: null,
		Consumer: null,
		_currentValue: ye,
		_currentValue2: ye,
		_threadCount: 0
	};
	function lh(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = pt(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = pt(0), this.hiddenUpdates = pt(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function uh(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new lh(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = Mi(3, null, null, t), e.current = a, a.stateNode = e, t = ja(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, mo(a), e;
	}
	function dh(e) {
		return e ? (e = Ai, e) : Ai;
	}
	function fh(e, t, n, r, i, a) {
		i = dh(i), r.context === null ? r.context = i : r.pendingContext = i, r = go(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = _o(e, r, t), n !== null && (Fd(n, e, t), vo(n, e, t));
	}
	function ph(e, t) {
		if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
			var n = e.retryLane;
			e.retryLane = n !== 0 && n < t ? n : t;
		}
	}
	function mh(e, t) {
		ph(e, t), (e = e.alternate) && ph(e, t);
	}
	function hh(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = Di(e, 67108864);
			t !== null && Fd(t, e, 67108864), mh(e, 67108864);
		}
	}
	function gh(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = Md();
			t = yt(t);
			var n = Di(e, t);
			n !== null && Fd(n, e, t), mh(e, t);
		}
	}
	var _h = !0;
	function vh(e, t, n, r) {
		var i = N.T;
		N.T = null;
		var a = ve.p;
		try {
			ve.p = 2, bh(e, t, n, r);
		} finally {
			ve.p = a, N.T = i;
		}
	}
	function yh(e, t, n, r) {
		var i = N.T;
		N.T = null;
		var a = ve.p;
		try {
			ve.p = 8, bh(e, t, n, r);
		} finally {
			ve.p = a, N.T = i;
		}
	}
	function bh(e, t, n, r) {
		if (_h) {
			var i = xh(r);
			if (i === null) qf(e, t, r, Sh, n), Nh(e, r);
			else if (Fh(i, e, t, n, r)) r.stopPropagation();
			else if (Nh(e, r), t & 4 && -1 < Mh.indexOf(e)) {
				for (; i !== null;) {
					var a = Pt(i);
					if (a !== null) switch (a.tag) {
						case 3:
							if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
								var o = st(a.pendingLanes);
								if (o !== 0) {
									var s = a;
									for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
										var c = 1 << 31 - et(o);
										s.entanglements[1] |= c, o &= ~c;
									}
									Of(a), !($u & 6) && (vd = He() + 500, kf(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = Di(a, 2), s !== null && Fd(s, a, 2), Bd(), mh(a, 2);
					}
					if (a = xh(r), a === null && qf(e, t, r, Sh, n), a === i) break;
					i = a;
				}
				i !== null && r.stopPropagation();
			} else qf(e, t, r, null, n);
		}
	}
	function xh(e) {
		return e = bn(e), Ch(e);
	}
	var Sh = null;
	function Ch(e) {
		if (Sh = null, e = Nt(e), e !== null) {
			var t = o(e);
			if (t === null) e = null;
			else {
				var n = t.tag;
				if (n === 13) {
					if (e = s(t), e !== null) return e;
					e = null;
				} else if (n === 31) {
					if (e = c(t), e !== null) return e;
					e = null;
				} else if (n === 3) {
					if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
					e = null;
				} else t !== e && (e = null);
			}
		}
		return Sh = e, null;
	}
	function wh(e) {
		switch (e) {
			case "beforetoggle":
			case "cancel":
			case "click":
			case "close":
			case "contextmenu":
			case "copy":
			case "cut":
			case "auxclick":
			case "dblclick":
			case "dragend":
			case "dragstart":
			case "drop":
			case "focusin":
			case "focusout":
			case "input":
			case "invalid":
			case "keydown":
			case "keypress":
			case "keyup":
			case "mousedown":
			case "mouseup":
			case "paste":
			case "pause":
			case "play":
			case "pointercancel":
			case "pointerdown":
			case "pointerup":
			case "ratechange":
			case "reset":
			case "seeked":
			case "submit":
			case "toggle":
			case "touchcancel":
			case "touchend":
			case "touchstart":
			case "volumechange":
			case "change":
			case "selectionchange":
			case "textInput":
			case "compositionstart":
			case "compositionend":
			case "compositionupdate":
			case "beforeblur":
			case "afterblur":
			case "beforeinput":
			case "blur":
			case "fullscreenchange":
			case "fullscreenerror":
			case "focus":
			case "hashchange":
			case "popstate":
			case "select":
			case "selectstart": return 2;
			case "drag":
			case "dragenter":
			case "dragexit":
			case "dragleave":
			case "dragover":
			case "mousemove":
			case "mouseout":
			case "mouseover":
			case "pointermove":
			case "pointerout":
			case "pointerover":
			case "resize":
			case "scroll":
			case "touchmove":
			case "wheel":
			case "mouseenter":
			case "mouseleave":
			case "pointerenter":
			case "pointerleave": return 8;
			case "message": switch (Ue()) {
				case We: return 2;
				case Ge: return 8;
				case Ke:
				case qe: return 32;
				case Je: return 268435456;
				default: return 32;
			}
			default: return 32;
		}
	}
	var Th = !1, Eh = null, Dh = null, Oh = null, kh = /* @__PURE__ */ new Map(), Ah = /* @__PURE__ */ new Map(), jh = [], Mh = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
	function Nh(e, t) {
		switch (e) {
			case "focusin":
			case "focusout":
				Eh = null;
				break;
			case "dragenter":
			case "dragleave":
				Dh = null;
				break;
			case "mouseover":
			case "mouseout":
				Oh = null;
				break;
			case "pointerover":
			case "pointerout":
				kh.delete(t.pointerId);
				break;
			case "gotpointercapture":
			case "lostpointercapture": Ah.delete(t.pointerId);
		}
	}
	function Ph(e, t, n, r, i, a) {
		return e === null || e.nativeEvent !== a ? (e = {
			blockedOn: t,
			domEventName: n,
			eventSystemFlags: r,
			nativeEvent: a,
			targetContainers: [i]
		}, t !== null && (t = Pt(t), t !== null && hh(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
	}
	function Fh(e, t, n, r, i) {
		switch (t) {
			case "focusin": return Eh = Ph(Eh, e, t, n, r, i), !0;
			case "dragenter": return Dh = Ph(Dh, e, t, n, r, i), !0;
			case "mouseover": return Oh = Ph(Oh, e, t, n, r, i), !0;
			case "pointerover":
				var a = i.pointerId;
				return kh.set(a, Ph(kh.get(a) || null, e, t, n, r, i)), !0;
			case "gotpointercapture": return a = i.pointerId, Ah.set(a, Ph(Ah.get(a) || null, e, t, n, r, i)), !0;
		}
		return !1;
	}
	function Ih(e) {
		var t = Nt(e.target);
		if (t !== null) {
			var n = o(t);
			if (n !== null) {
				if (t = n.tag, t === 13) {
					if (t = s(n), t !== null) {
						e.blockedOn = t, St(e.priority, function() {
							gh(n);
						});
						return;
					}
				} else if (t === 31) {
					if (t = c(n), t !== null) {
						e.blockedOn = t, St(e.priority, function() {
							gh(n);
						});
						return;
					}
				} else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
					e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
					return;
				}
			}
		}
		e.blockedOn = null;
	}
	function Lh(e) {
		if (e.blockedOn !== null) return !1;
		for (var t = e.targetContainers; 0 < t.length;) {
			var n = xh(e.nativeEvent);
			if (n === null) {
				n = e.nativeEvent;
				var r = new n.constructor(n.type, n);
				yn = r, n.target.dispatchEvent(r), yn = null;
			} else return t = Pt(n), t !== null && hh(t), e.blockedOn = n, !1;
			t.shift();
		}
		return !0;
	}
	function Rh(e, t, n) {
		Lh(e) && n.delete(t);
	}
	function zh() {
		Th = !1, Eh !== null && Lh(Eh) && (Eh = null), Dh !== null && Lh(Dh) && (Dh = null), Oh !== null && Lh(Oh) && (Oh = null), kh.forEach(Rh), Ah.forEach(Rh);
	}
	function Bh(e, n) {
		e.blockedOn === n && (e.blockedOn = null, Th || (Th = !0, t.unstable_scheduleCallback(t.unstable_NormalPriority, zh)));
	}
	var Vh = null;
	function Hh(e) {
		Vh !== e && (Vh = e, t.unstable_scheduleCallback(t.unstable_NormalPriority, function() {
			Vh === e && (Vh = null);
			for (var t = 0; t < e.length; t += 3) {
				var n = e[t], r = e[t + 1], i = e[t + 2];
				if (typeof r != "function") {
					if (Ch(r || n) === null) continue;
					break;
				}
				var a = Pt(n);
				a !== null && (e.splice(t, 3), t -= 3, $s(a, {
					pending: !0,
					data: i,
					method: n.method,
					action: r
				}, r, i));
			}
		}));
	}
	function Uh(e) {
		function t(t) {
			return Bh(t, e);
		}
		Eh !== null && Bh(Eh, e), Dh !== null && Bh(Dh, e), Oh !== null && Bh(Oh, e), kh.forEach(t), Ah.forEach(t);
		for (var n = 0; n < jh.length; n++) {
			var r = jh[n];
			r.blockedOn === e && (r.blockedOn = null);
		}
		for (; 0 < jh.length && (n = jh[0], n.blockedOn === null);) Ih(n), n.blockedOn === null && jh.shift();
		if (n = (e.ownerDocument || e).$$reactFormReplay, n != null) for (r = 0; r < n.length; r += 3) {
			var i = n[r], a = n[r + 1], o = i[wt] || null;
			if (typeof a == "function") o || Hh(n);
			else if (o) {
				var s = null;
				if (a && a.hasAttribute("formAction")) {
					if (i = a, o = a[wt] || null) s = o.formAction;
					else if (Ch(i) !== null) continue;
				} else s = o.action;
				typeof s == "function" ? n[r + 1] = s : (n.splice(r, 3), r -= 3), Hh(n);
			}
		}
	}
	function Wh() {
		function e(e) {
			e.canIntercept && e.info === "react-transition" && e.intercept({
				handler: function() {
					return new Promise(function(e) {
						return i = e;
					});
				},
				focusReset: "manual",
				scroll: "manual"
			});
		}
		function t() {
			i !== null && (i(), i = null), r || setTimeout(n, 20);
		}
		function n() {
			if (!r && !navigation.transition) {
				var e = navigation.currentEntry;
				e && e.url != null && navigation.navigate(e.url, {
					state: e.getState(),
					info: "react-transition",
					history: "replace"
				});
			}
		}
		if (typeof navigation == "object") {
			var r = !1, i = null;
			return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(n, 100), function() {
				r = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), i !== null && (i(), i = null);
			};
		}
	}
	function Gh(e) {
		this._internalRoot = e;
	}
	Kh.prototype.render = Gh.prototype.render = function(e) {
		var t = this._internalRoot;
		if (t === null) throw Error(i(409));
		fh(t.current, Md(), e, t, null, null);
	}, Kh.prototype.unmount = Gh.prototype.unmount = function() {
		var e = this._internalRoot;
		if (e !== null) {
			this._internalRoot = null;
			var t = e.containerInfo;
			fh(e.current, 2, null, e, null, null), Bd(), t[Tt] = null;
		}
	};
	function Kh(e) {
		this._internalRoot = e;
	}
	Kh.prototype.unstable_scheduleHydration = function(e) {
		if (e) {
			var t = xt();
			e = {
				blockedOn: null,
				target: e,
				priority: t
			};
			for (var n = 0; n < jh.length && t !== 0 && t < jh[n].priority; n++);
			jh.splice(n, 0, e), n === 0 && Ih(e);
		}
	};
	var qh = n.version;
	if (qh !== "19.3.1") throw Error(i(527, qh, "19.3.1"));
	ve.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(i(188)) : (e = Object.keys(e).join(","), Error(i(268, e)));
		return e = u(t), e = e === null ? null : f(e), e = e === null ? null : e.stateNode, e;
	};
	var Jh = {
		bundleType: 0,
		version: "19.3.1",
		rendererPackageName: "react-dom",
		currentDispatcherRef: N,
		reconcilerVersion: "19.3.1"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var Yh = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!Yh.isDisabled && Yh.supportsFiber) try {
			Ze = Yh.inject(Jh), Qe = Yh;
		} catch {}
	}
	e.createRoot = function(e, t) {
		if (!a(e)) throw Error(i(299));
		var n = !1, r = "", o = Sc, s = Cc, c = wc;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (o = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = uh(e, 1, !1, null, null, n, r, null, o, s, c, Wh), e[Tt] = t.current, Gf(e), new Gh(t);
	};
})), _ = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == "function") try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = g();
})), v = /* @__PURE__ */ l(d(), 1), y = _(), b = "@layer properties{:host,*,:before,:after,::backdrop{--tw-divide-y-reverse:0;--tw-border-style:solid;--tw-shadow:0 0 #0000;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-alpha:100%;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-offset-width:0;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-outline-style:solid;--tw-content:\"\";--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0}}@layer theme{:host{--color-white:#fff;--spacing:.25rem;--container-5xl:64rem;--text-xs:.75rem;--text-xs--line-height:calc(1 / .75);--text-sm:.875rem;--text-sm--line-height:calc(1.25 / .875);--text-base:1rem;--text-base--line-height:calc(1.5 / 1);--text-xl:1.25rem;--text-xl--line-height:calc(1.75 / 1.25);--text-2xl:1.5rem;--text-2xl--line-height:calc(2 / 1.5);--text-3xl:1.875rem;--text-3xl--line-height:calc(2.25 / 1.875);--text-4xl:2.25rem;--text-4xl--line-height:calc(2.5 / 2.25);--font-weight-normal:400;--font-weight-medium:500;--font-weight-semibold:600;--leading-tight:1.25;--aspect-video:16 / 9;--default-transition-duration:.15s;--default-transition-timing-function:cubic-bezier(.4, 0, .2, 1);--default-font-family:\"Inter\", system-ui, sans-serif;--default-mono-font-family:\"JetBrains Mono\", ui-monospace, monospace;--color-border:var(--border)}}@layer base{*,:after,:before,::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}::file-selector-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;tab-size:4;line-height:1.5;font-family:var(--default-font-family,-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", \"Noto Sans\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-webkit-tap-highlight-color:transparent}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--default-mono-font-family,ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-variation-settings:var(--default-mono-font-variation-settings,normal);font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}:-moz-focusring:where(:not(iframe)){outline:auto}progress{vertical-align:baseline}summary{display:list-item}ol,ul,menu{list-style:none}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}button,input,select,optgroup,textarea{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::file-selector-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::placeholder{opacity:1}@supports (not ((-webkit-appearance:-apple-pay-button))) or (contain-intrinsic-size:1px){::placeholder{color:currentColor}@supports (color:color-mix(in lab, red, red)){::placeholder{color:color-mix(in oklab, currentcolor 50%, transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit{padding-block:0}::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-month-field{padding-block:0}::-webkit-datetime-edit-day-field{padding-block:0}::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field{padding-block:0}::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-millisecond-field{padding-block:0}::-webkit-datetime-edit-meridiem-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){appearance:button}::file-selector-button{appearance:button}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}}@layer components;@layer utilities{.\\@container\\/card-header{container:card-header/inline-size}.pointer-events-none{pointer-events:none}.sr-only{clip-path:inset(50%);white-space:nowrap;border-width:0;width:1px;height:1px;margin:-1px;padding:0;position:absolute;overflow:hidden}.relative{position:relative}.col-span-2{grid-column:span 2/span 2}.col-start-2{grid-column-start:2}.row-span-2{grid-row:span 2/span 2}.row-start-1{grid-row-start:1}.container{width:100%}@media (width>=40rem){.container{max-width:40rem}}@media (width>=48rem){.container{max-width:48rem}}@media (width>=64rem){.container{max-width:64rem}}@media (width>=80rem){.container{max-width:80rem}}@media (width>=96rem){.container{max-width:96rem}}.mx-auto{margin-inline:auto}.my-0\\.5{margin-block:calc(var(--spacing) * .5)}.mt-0\\.5{margin-top:calc(var(--spacing) * .5)}.mt-1{margin-top:var(--spacing)}.mt-2{margin-top:calc(var(--spacing) * 2)}.mt-3{margin-top:calc(var(--spacing) * 3)}.ml-2{margin-left:calc(var(--spacing) * 2)}.ml-6{margin-left:calc(var(--spacing) * 6)}.block{display:block}.flex{display:flex}.grid{display:grid}.inline{display:inline}.inline-flex{display:inline-flex}.aspect-auto{aspect-ratio:auto}.aspect-video{aspect-ratio:var(--aspect-video)}.size-3\\.5{width:calc(var(--spacing) * 3.5);height:calc(var(--spacing) * 3.5)}.size-4{width:calc(var(--spacing) * 4);height:calc(var(--spacing) * 4)}.size-5{width:calc(var(--spacing) * 5);height:calc(var(--spacing) * 5)}.size-6{width:calc(var(--spacing) * 6);height:calc(var(--spacing) * 6)}.size-8{width:calc(var(--spacing) * 8);height:calc(var(--spacing) * 8)}.size-9{width:calc(var(--spacing) * 9);height:calc(var(--spacing) * 9)}.size-10{width:calc(var(--spacing) * 10);height:calc(var(--spacing) * 10)}.h-2{height:calc(var(--spacing) * 2)}.h-2\\.5{height:calc(var(--spacing) * 2.5)}.h-6{height:calc(var(--spacing) * 6)}.h-7{height:calc(var(--spacing) * 7)}.h-8{height:calc(var(--spacing) * 8)}.h-9{height:calc(var(--spacing) * 9)}.h-10{height:calc(var(--spacing) * 10)}.h-52{height:calc(var(--spacing) * 52)}.h-\\[calc\\(100\\%-1px\\)\\]{height:calc(100% - 1px)}.max-h-64{max-height:calc(var(--spacing) * 64)}.w-0{width:0}.w-1{width:var(--spacing)}.w-2{width:calc(var(--spacing) * 2)}.w-2\\.5{width:calc(var(--spacing) * 2.5)}.w-fit{width:fit-content}.w-full{width:100%}.max-w-5xl{max-width:var(--container-5xl)}.min-w-0{min-width:0}.min-w-\\[8rem\\]{min-width:8rem}.flex-1{flex:1}.shrink-0{flex-shrink:0}.basis-full{flex-basis:100%}.cursor-pointer{cursor:pointer}.list-disc{list-style-type:disc}.auto-rows-min{grid-auto-rows:min-content}.grid-cols-\\[1fr_auto\\]{grid-template-columns:1fr auto}.grid-rows-\\[auto_auto\\]{grid-template-rows:auto auto}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.items-baseline{align-items:baseline}.items-center{align-items:center}.items-end{align-items:flex-end}.items-start{align-items:flex-start}.items-stretch{align-items:stretch}.justify-between{justify-content:space-between}.justify-center{justify-content:center}.gap-0\\.5{gap:calc(var(--spacing) * .5)}.gap-1{gap:var(--spacing)}.gap-1\\.5{gap:calc(var(--spacing) * 1.5)}.gap-2{gap:calc(var(--spacing) * 2)}.gap-3{gap:calc(var(--spacing) * 3)}.gap-4{gap:calc(var(--spacing) * 4)}.gap-6{gap:calc(var(--spacing) * 6)}.gap-8{gap:calc(var(--spacing) * 8)}.gap-x-3{column-gap:calc(var(--spacing) * 3)}.gap-x-4{column-gap:calc(var(--spacing) * 4)}.gap-y-1{row-gap:var(--spacing)}:where(.divide-y>:not(:last-child)){--tw-divide-y-reverse:0;border-bottom-style:var(--tw-border-style);border-top-style:var(--tw-border-style);border-top-width:calc(1px * var(--tw-divide-y-reverse));border-bottom-width:calc(1px * calc(1 - var(--tw-divide-y-reverse)))}.self-start{align-self:flex-start}.justify-self-end{justify-self:flex-end}.overflow-auto{overflow:auto}.overflow-hidden{overflow:hidden}.rounded-\\[2px\\]{border-radius:2px}.rounded-full{border-radius:2147483647px}.rounded-lg{border-radius:var(--radius)}.rounded-md{border-radius:calc(var(--radius) - 2px)}.rounded-sm{border-radius:calc(var(--radius) - 4px)}.rounded-xl{border-radius:calc(var(--radius) + 4px)}.border{border-style:var(--tw-border-style);border-width:1px}.border-\\[1\\.5px\\]{border-style:var(--tw-border-style);border-width:1.5px}.border-l-2{border-left-style:var(--tw-border-style);border-left-width:2px}.border-l-4{border-left-style:var(--tw-border-style);border-left-width:4px}.border-dashed{--tw-border-style:dashed;border-style:dashed}.border-\\(--color-border\\){border-color:var(--color-border)}.border-border,.border-border\\/50{border-color:var(--border)}@supports (color:color-mix(in lab, red, red)){.border-border\\/50{border-color:color-mix(in oklab, var(--border) 50%, transparent)}}.border-transparent{border-color:#0000}.bg-\\(--color-bg\\){background-color:var(--color-bg)}.bg-background{background-color:var(--background)}.bg-card{background-color:var(--card)}.bg-destructive{background-color:var(--destructive)}.bg-muted{background-color:var(--muted)}.bg-primary{background-color:var(--primary)}.bg-secondary{background-color:var(--secondary)}.bg-transparent{background-color:#0000}.p-3{padding:calc(var(--spacing) * 3)}.p-4{padding:calc(var(--spacing) * 4)}.p-\\[3px\\]{padding:3px}.px-2{padding-inline:calc(var(--spacing) * 2)}.px-2\\.5{padding-inline:calc(var(--spacing) * 2.5)}.px-3{padding-inline:calc(var(--spacing) * 3)}.px-4{padding-inline:calc(var(--spacing) * 4)}.px-6{padding-inline:calc(var(--spacing) * 6)}.py-0\\.5{padding-block:calc(var(--spacing) * .5)}.py-1{padding-block:var(--spacing)}.py-1\\.5{padding-block:calc(var(--spacing) * 1.5)}.py-2{padding-block:calc(var(--spacing) * 2)}.py-2\\.5{padding-block:calc(var(--spacing) * 2.5)}.py-3{padding-block:calc(var(--spacing) * 3)}.py-6{padding-block:calc(var(--spacing) * 6)}.pt-3{padding-top:calc(var(--spacing) * 3)}.pb-3{padding-bottom:calc(var(--spacing) * 3)}.pl-3{padding-left:calc(var(--spacing) * 3)}.pl-5{padding-left:calc(var(--spacing) * 5)}.font-display{font-family:Space Grotesk,system-ui,sans-serif}.font-mono{font-family:JetBrains Mono,ui-monospace,monospace}.text-2xl{font-size:var(--text-2xl);line-height:var(--tw-leading,var(--text-2xl--line-height))}.text-3xl{font-size:var(--text-3xl);line-height:var(--tw-leading,var(--text-3xl--line-height))}.text-base{font-size:var(--text-base);line-height:var(--tw-leading,var(--text-base--line-height))}.text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.text-xl{font-size:var(--text-xl);line-height:var(--tw-leading,var(--text-xl--line-height))}.text-xs{font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height))}.leading-none{--tw-leading:1;line-height:1}.leading-tight{--tw-leading:var(--leading-tight);line-height:var(--leading-tight)}.font-medium{--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium)}.font-normal{--tw-font-weight:var(--font-weight-normal);font-weight:var(--font-weight-normal)}.font-semibold{--tw-font-weight:var(--font-weight-semibold);font-weight:var(--font-weight-semibold)}.text-balance{text-wrap:balance}.whitespace-nowrap{white-space:nowrap}.text-card-foreground{color:var(--card-foreground)}.text-foreground,.text-foreground\\/60{color:var(--foreground)}@supports (color:color-mix(in lab, red, red)){.text-foreground\\/60{color:color-mix(in oklab, var(--foreground) 60%, transparent)}}.text-muted-foreground{color:var(--muted-foreground)}.text-primary{color:var(--primary)}.text-primary-foreground{color:var(--primary-foreground)}.text-secondary-foreground{color:var(--secondary-foreground)}.text-white{color:var(--color-white)}.tabular-nums{--tw-numeric-spacing:tabular-nums;font-variant-numeric:var(--tw-ordinal, ) var(--tw-slashed-zero, ) var(--tw-numeric-figure, ) var(--tw-numeric-spacing, ) var(--tw-numeric-fraction, )}.underline{text-decoration-line:underline}.underline-offset-2{text-underline-offset:2px}.underline-offset-4{text-underline-offset:4px}.shadow,.shadow-sm{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a), 0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.shadow-xl{--tw-shadow:0 20px 25px -5px var(--tw-shadow-color,#0000001a), 0 8px 10px -6px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.shadow-xs{--tw-shadow:0 1px 2px 0 var(--tw-shadow-color,#0000000d);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.ring{--tw-ring-shadow:var(--tw-ring-inset, ) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.ring-0{--tw-ring-shadow:var(--tw-ring-inset, ) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.outline{outline-style:var(--tw-outline-style);outline-width:1px}.transition-\\[color\\,box-shadow\\]{transition-property:color,box-shadow;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-all{transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-transform{transition-property:transform,translate,scale,rotate;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.outline-none{--tw-outline-style:none;outline-style:none}:is(:where(.group\\/tabs)[data-orientation=horizontal] .group-data-\\[orientation\\=horizontal\\]\\/tabs\\:h-9){height:calc(var(--spacing) * 9)}:is(:where(.group\\/tabs)[data-orientation=vertical] .group-data-\\[orientation\\=vertical\\]\\/tabs\\:h-fit){height:fit-content}:is(:where(.group\\/tabs)[data-orientation=vertical] .group-data-\\[orientation\\=vertical\\]\\/tabs\\:w-full){width:100%}:is(:where(.group\\/tabs)[data-orientation=vertical] .group-data-\\[orientation\\=vertical\\]\\/tabs\\:flex-col){flex-direction:column}:is(:where(.group\\/tabs)[data-orientation=vertical] .group-data-\\[orientation\\=vertical\\]\\/tabs\\:justify-start){justify-content:flex-start}:is(:where(.group\\/switch)[data-size=default] .group-data-\\[size\\=default\\]\\/switch\\:size-4){width:calc(var(--spacing) * 4);height:calc(var(--spacing) * 4)}:is(:where(.group\\/switch)[data-size=sm] .group-data-\\[size\\=sm\\]\\/switch\\:size-3){width:calc(var(--spacing) * 3);height:calc(var(--spacing) * 3)}:is(:where(.group\\/tabs-list)[data-variant=line] .group-data-\\[variant\\=line\\]\\/tabs-list\\:bg-transparent){background-color:#0000}.after\\:absolute:after{content:var(--tw-content);position:absolute}.after\\:bg-foreground:after{content:var(--tw-content);background-color:var(--foreground)}.after\\:opacity-0:after{content:var(--tw-content);opacity:0}.after\\:transition-opacity:after{content:var(--tw-content);transition-property:opacity;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}:is(:where(.group\\/tabs)[data-orientation=horizontal] .group-data-\\[orientation\\=horizontal\\]\\/tabs\\:after\\:inset-x-0):after{content:var(--tw-content);inset-inline:0}:is(:where(.group\\/tabs)[data-orientation=horizontal] .group-data-\\[orientation\\=horizontal\\]\\/tabs\\:after\\:bottom-\\[-5px\\]):after{content:var(--tw-content);bottom:-5px}:is(:where(.group\\/tabs)[data-orientation=horizontal] .group-data-\\[orientation\\=horizontal\\]\\/tabs\\:after\\:h-0\\.5):after{content:var(--tw-content);height:calc(var(--spacing) * .5)}:is(:where(.group\\/tabs)[data-orientation=vertical] .group-data-\\[orientation\\=vertical\\]\\/tabs\\:after\\:inset-y-0):after{content:var(--tw-content);inset-block:0}:is(:where(.group\\/tabs)[data-orientation=vertical] .group-data-\\[orientation\\=vertical\\]\\/tabs\\:after\\:-right-1):after{content:var(--tw-content);right:calc(var(--spacing) * -1)}:is(:where(.group\\/tabs)[data-orientation=vertical] .group-data-\\[orientation\\=vertical\\]\\/tabs\\:after\\:w-0\\.5):after{content:var(--tw-content);width:calc(var(--spacing) * .5)}.first\\:pt-0:first-child{padding-top:0}@media (hover:hover){.hover\\:bg-accent:hover{background-color:var(--accent)}.hover\\:bg-destructive\\/90:hover{background-color:var(--destructive)}@supports (color:color-mix(in lab, red, red)){.hover\\:bg-destructive\\/90:hover{background-color:color-mix(in oklab, var(--destructive) 90%, transparent)}}.hover\\:bg-primary\\/90:hover{background-color:var(--primary)}@supports (color:color-mix(in lab, red, red)){.hover\\:bg-primary\\/90:hover{background-color:color-mix(in oklab, var(--primary) 90%, transparent)}}.hover\\:bg-secondary\\/80:hover{background-color:var(--secondary)}@supports (color:color-mix(in lab, red, red)){.hover\\:bg-secondary\\/80:hover{background-color:color-mix(in oklab, var(--secondary) 80%, transparent)}}.hover\\:text-accent-foreground:hover{color:var(--accent-foreground)}.hover\\:text-foreground:hover{color:var(--foreground)}.hover\\:underline:hover{text-decoration-line:underline}}.focus-visible\\:border-ring:focus-visible{border-color:var(--ring)}.focus-visible\\:ring-2:focus-visible{--tw-ring-shadow:var(--tw-ring-inset, ) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.focus-visible\\:ring-\\[3px\\]:focus-visible{--tw-ring-shadow:var(--tw-ring-inset, ) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.focus-visible\\:ring-destructive\\/20:focus-visible{--tw-ring-color:var(--destructive)}@supports (color:color-mix(in lab, red, red)){.focus-visible\\:ring-destructive\\/20:focus-visible{--tw-ring-color:color-mix(in oklab, var(--destructive) 20%, transparent)}}.focus-visible\\:ring-ring:focus-visible,.focus-visible\\:ring-ring\\/50:focus-visible{--tw-ring-color:var(--ring)}@supports (color:color-mix(in lab, red, red)){.focus-visible\\:ring-ring\\/50:focus-visible{--tw-ring-color:color-mix(in oklab, var(--ring) 50%, transparent)}}.focus-visible\\:ring-offset-2:focus-visible{--tw-ring-offset-width:2px;--tw-ring-offset-shadow:var(--tw-ring-inset, ) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)}.focus-visible\\:ring-offset-background:focus-visible{--tw-ring-offset-color:var(--background)}.focus-visible\\:outline-1:focus-visible{outline-style:var(--tw-outline-style);outline-width:1px}.focus-visible\\:outline-ring:focus-visible{outline-color:var(--ring)}.focus-visible\\:outline-none:focus-visible{--tw-outline-style:none;outline-style:none}.disabled\\:pointer-events-none:disabled{pointer-events:none}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}.disabled\\:opacity-50:disabled{opacity:.5}.has-data-\\[slot\\=card-action\\]\\:grid-cols-\\[1fr_auto\\]:has([data-slot=card-action]){grid-template-columns:1fr auto}.has-\\[\\>svg\\]\\:px-1\\.5:has(>svg){padding-inline:calc(var(--spacing) * 1.5)}.has-\\[\\>svg\\]\\:px-2\\.5:has(>svg){padding-inline:calc(var(--spacing) * 2.5)}.has-\\[\\>svg\\]\\:px-3:has(>svg){padding-inline:calc(var(--spacing) * 3)}.has-\\[\\>svg\\]\\:px-4:has(>svg){padding-inline:calc(var(--spacing) * 4)}.aria-invalid\\:border-destructive[aria-invalid=true]{border-color:var(--destructive)}.aria-invalid\\:ring-destructive\\/20[aria-invalid=true]{--tw-ring-color:var(--destructive)}@supports (color:color-mix(in lab, red, red)){.aria-invalid\\:ring-destructive\\/20[aria-invalid=true]{--tw-ring-color:color-mix(in oklab, var(--destructive) 20%, transparent)}}.data-\\[orientation\\=horizontal\\]\\:flex-col[data-orientation=horizontal]{flex-direction:column}.data-\\[size\\=default\\]\\:h-\\[1\\.15rem\\][data-size=default]{height:1.15rem}.data-\\[size\\=default\\]\\:w-8[data-size=default]{width:calc(var(--spacing) * 8)}.data-\\[size\\=sm\\]\\:h-3\\.5[data-size=sm]{height:calc(var(--spacing) * 3.5)}.data-\\[size\\=sm\\]\\:w-6[data-size=sm]{width:calc(var(--spacing) * 6)}.data-\\[state\\=active\\]\\:bg-background[data-state=active]{background-color:var(--background)}.data-\\[state\\=active\\]\\:text-foreground[data-state=active]{color:var(--foreground)}:is(:where(.group\\/tabs-list)[data-variant=default] .group-data-\\[variant\\=default\\]\\/tabs-list\\:data-\\[state\\=active\\]\\:shadow-sm)[data-state=active]{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a), 0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}:is(:where(.group\\/tabs-list)[data-variant=line] .group-data-\\[variant\\=line\\]\\/tabs-list\\:data-\\[state\\=active\\]\\:bg-transparent)[data-state=active]{background-color:#0000}:is(:where(.group\\/tabs-list)[data-variant=line] .group-data-\\[variant\\=line\\]\\/tabs-list\\:data-\\[state\\=active\\]\\:shadow-none)[data-state=active]{--tw-shadow:0 0 #0000;box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}:is(:where(.group\\/tabs-list)[data-variant=line] .group-data-\\[variant\\=line\\]\\/tabs-list\\:data-\\[state\\=active\\]\\:after\\:opacity-100)[data-state=active]:after{content:var(--tw-content);opacity:1}.data-\\[state\\=checked\\]\\:translate-x-\\[calc\\(100\\%-2px\\)\\][data-state=checked]{--tw-translate-x:calc(100% - 2px);translate:var(--tw-translate-x) var(--tw-translate-y)}.data-\\[state\\=checked\\]\\:bg-primary[data-state=checked]{background-color:var(--primary)}.data-\\[state\\=unchecked\\]\\:translate-x-0[data-state=unchecked]{--tw-translate-x:0px;translate:var(--tw-translate-x) var(--tw-translate-y)}.data-\\[state\\=unchecked\\]\\:bg-input[data-state=unchecked]{background-color:var(--input)}.data-\\[variant\\=line\\]\\:rounded-none[data-variant=line]{border-radius:0}@media (width>=40rem){.sm\\:order-2{order:2}.sm\\:order-3{order:3}.sm\\:col-span-1{grid-column:span 1/span 1}.sm\\:ml-0{margin-left:0}.sm\\:size-10{width:calc(var(--spacing) * 10);height:calc(var(--spacing) * 10)}.sm\\:h-0{height:0}.sm\\:w-6{width:calc(var(--spacing) * 6)}.sm\\:min-w-0{min-width:0}.sm\\:flex-1{flex:1}.sm\\:basis-0{flex-basis:0}.sm\\:grid-cols-\\[9rem_1fr_4\\.5rem\\]{grid-template-columns:9rem 1fr 4.5rem}.sm\\:flex-row{flex-direction:row}.sm\\:items-stretch{align-items:stretch}.sm\\:self-center{align-self:center}.sm\\:border-t-2{border-top-style:var(--tw-border-style);border-top-width:2px}.sm\\:border-l-0{border-left-style:var(--tw-border-style);border-left-width:0}.sm\\:text-right{text-align:right}.sm\\:text-4xl{font-size:var(--text-4xl);line-height:var(--tw-leading,var(--text-4xl--line-height))}}@media (width>=48rem){.md\\:grid-cols-\\[3fr_2fr\\]{grid-template-columns:3fr 2fr}.md\\:p-8{padding:calc(var(--spacing) * 8)}}@media (width>=64rem){.lg\\:w-10{width:calc(var(--spacing) * 10)}}.dark\\:border-input:where(.dark,.dark *){border-color:var(--input)}.dark\\:bg-destructive\\/60:where(.dark,.dark *){background-color:var(--destructive)}@supports (color:color-mix(in lab, red, red)){.dark\\:bg-destructive\\/60:where(.dark,.dark *){background-color:color-mix(in oklab, var(--destructive) 60%, transparent)}}.dark\\:bg-input\\/30:where(.dark,.dark *){background-color:var(--input)}@supports (color:color-mix(in lab, red, red)){.dark\\:bg-input\\/30:where(.dark,.dark *){background-color:color-mix(in oklab, var(--input) 30%, transparent)}}.dark\\:text-muted-foreground:where(.dark,.dark *){color:var(--muted-foreground)}@media (hover:hover){.dark\\:hover\\:bg-accent\\/50:where(.dark,.dark *):hover{background-color:var(--accent)}@supports (color:color-mix(in lab, red, red)){.dark\\:hover\\:bg-accent\\/50:where(.dark,.dark *):hover{background-color:color-mix(in oklab, var(--accent) 50%, transparent)}}.dark\\:hover\\:bg-input\\/50:where(.dark,.dark *):hover{background-color:var(--input)}@supports (color:color-mix(in lab, red, red)){.dark\\:hover\\:bg-input\\/50:where(.dark,.dark *):hover{background-color:color-mix(in oklab, var(--input) 50%, transparent)}}.dark\\:hover\\:text-foreground:where(.dark,.dark *):hover{color:var(--foreground)}}.dark\\:focus-visible\\:ring-destructive\\/40:where(.dark,.dark *):focus-visible{--tw-ring-color:var(--destructive)}@supports (color:color-mix(in lab, red, red)){.dark\\:focus-visible\\:ring-destructive\\/40:where(.dark,.dark *):focus-visible{--tw-ring-color:color-mix(in oklab, var(--destructive) 40%, transparent)}}.dark\\:aria-invalid\\:ring-destructive\\/40:where(.dark,.dark *)[aria-invalid=true]{--tw-ring-color:var(--destructive)}@supports (color:color-mix(in lab, red, red)){.dark\\:aria-invalid\\:ring-destructive\\/40:where(.dark,.dark *)[aria-invalid=true]{--tw-ring-color:color-mix(in oklab, var(--destructive) 40%, transparent)}}.dark\\:data-\\[state\\=active\\]\\:border-input:where(.dark,.dark *)[data-state=active]{border-color:var(--input)}.dark\\:data-\\[state\\=active\\]\\:bg-input\\/30:where(.dark,.dark *)[data-state=active]{background-color:var(--input)}@supports (color:color-mix(in lab, red, red)){.dark\\:data-\\[state\\=active\\]\\:bg-input\\/30:where(.dark,.dark *)[data-state=active]{background-color:color-mix(in oklab, var(--input) 30%, transparent)}}.dark\\:data-\\[state\\=active\\]\\:text-foreground:where(.dark,.dark *)[data-state=active]{color:var(--foreground)}:is(:where(.group\\/tabs-list)[data-variant=line] .dark\\:group-data-\\[variant\\=line\\]\\/tabs-list\\:data-\\[state\\=active\\]\\:border-transparent:where(.dark,.dark *))[data-state=active]{border-color:#0000}:is(:where(.group\\/tabs-list)[data-variant=line] .dark\\:group-data-\\[variant\\=line\\]\\/tabs-list\\:data-\\[state\\=active\\]\\:bg-transparent:where(.dark,.dark *))[data-state=active]{background-color:#0000}.dark\\:data-\\[state\\=checked\\]\\:bg-primary-foreground:where(.dark,.dark *)[data-state=checked]{background-color:var(--primary-foreground)}.dark\\:data-\\[state\\=unchecked\\]\\:bg-foreground:where(.dark,.dark *)[data-state=unchecked]{background-color:var(--foreground)}.dark\\:data-\\[state\\=unchecked\\]\\:bg-input\\/80:where(.dark,.dark *)[data-state=unchecked]{background-color:var(--input)}@supports (color:color-mix(in lab, red, red)){.dark\\:data-\\[state\\=unchecked\\]\\:bg-input\\/80:where(.dark,.dark *)[data-state=unchecked]{background-color:color-mix(in oklab, var(--input) 80%, transparent)}}.\\[\\&_\\.recharts-cartesian-axis-tick_text\\]\\:fill-muted-foreground .recharts-cartesian-axis-tick text{fill:var(--muted-foreground)}.\\[\\&_\\.recharts-cartesian-grid_line\\[stroke\\=\\'\\#ccc\\'\\]\\]\\:stroke-border\\/50 .recharts-cartesian-grid line[stroke=\\#ccc]{stroke:var(--border)}@supports (color:color-mix(in lab, red, red)){.\\[\\&_\\.recharts-cartesian-grid_line\\[stroke\\=\\'\\#ccc\\'\\]\\]\\:stroke-border\\/50 .recharts-cartesian-grid line[stroke=\\#ccc]{stroke:color-mix(in oklab, var(--border) 50%, transparent)}}.\\[\\&_\\.recharts-curve\\.recharts-tooltip-cursor\\]\\:stroke-border .recharts-curve.recharts-tooltip-cursor{stroke:var(--border)}.\\[\\&_\\.recharts-dot\\[stroke\\=\\'\\#fff\\'\\]\\]\\:stroke-transparent .recharts-dot[stroke=\\#fff]{stroke:#0000}.\\[\\&_\\.recharts-layer\\]\\:outline-hidden .recharts-layer{--tw-outline-style:none;outline-style:none}@media (forced-colors:active){.\\[\\&_\\.recharts-layer\\]\\:outline-hidden .recharts-layer{outline-offset:2px;outline:2px solid #0000}}.\\[\\&_\\.recharts-polar-grid_\\[stroke\\=\\'\\#ccc\\'\\]\\]\\:stroke-border .recharts-polar-grid [stroke=\\#ccc]{stroke:var(--border)}.\\[\\&_\\.recharts-radial-bar-background-sector\\]\\:fill-muted .recharts-radial-bar-background-sector,.\\[\\&_\\.recharts-rectangle\\.recharts-tooltip-cursor\\]\\:fill-muted .recharts-rectangle.recharts-tooltip-cursor{fill:var(--muted)}.\\[\\&_\\.recharts-reference-line_\\[stroke\\=\\'\\#ccc\\'\\]\\]\\:stroke-border .recharts-reference-line [stroke=\\#ccc]{stroke:var(--border)}.\\[\\&_\\.recharts-sector\\]\\:outline-hidden .recharts-sector{--tw-outline-style:none;outline-style:none}@media (forced-colors:active){.\\[\\&_\\.recharts-sector\\]\\:outline-hidden .recharts-sector{outline-offset:2px;outline:2px solid #0000}}.\\[\\&_\\.recharts-sector\\[stroke\\=\\'\\#fff\\'\\]\\]\\:stroke-transparent .recharts-sector[stroke=\\#fff]{stroke:#0000}.\\[\\&_\\.recharts-surface\\]\\:outline-hidden .recharts-surface{--tw-outline-style:none;outline-style:none}@media (forced-colors:active){.\\[\\&_\\.recharts-surface\\]\\:outline-hidden .recharts-surface{outline-offset:2px;outline:2px solid #0000}}.\\[\\&_svg\\]\\:pointer-events-none svg{pointer-events:none}.\\[\\&_svg\\]\\:shrink-0 svg{flex-shrink:0}.\\[\\&_svg\\:not\\(\\[class\\*\\=\\'size-\\'\\]\\)\\]\\:size-3 svg:not([class*=size-]){width:calc(var(--spacing) * 3);height:calc(var(--spacing) * 3)}.\\[\\&_svg\\:not\\(\\[class\\*\\=\\'size-\\'\\]\\)\\]\\:size-4 svg:not([class*=size-]){width:calc(var(--spacing) * 4);height:calc(var(--spacing) * 4)}.\\[\\.border-b\\]\\:pb-6.border-b{padding-bottom:calc(var(--spacing) * 6)}.\\[\\.border-t\\]\\:pt-6.border-t{padding-top:calc(var(--spacing) * 6)}.\\[\\&\\>svg\\]\\:pointer-events-none>svg{pointer-events:none}.\\[\\&\\>svg\\]\\:size-3>svg{width:calc(var(--spacing) * 3);height:calc(var(--spacing) * 3)}.\\[\\&\\>svg\\]\\:h-2\\.5>svg{height:calc(var(--spacing) * 2.5)}.\\[\\&\\>svg\\]\\:h-3>svg{height:calc(var(--spacing) * 3)}.\\[\\&\\>svg\\]\\:w-2\\.5>svg{width:calc(var(--spacing) * 2.5)}.\\[\\&\\>svg\\]\\:w-3>svg{width:calc(var(--spacing) * 3)}.\\[\\&\\>svg\\]\\:text-muted-foreground>svg{color:var(--muted-foreground)}@media (hover:hover){a.\\[a\\&\\]\\:hover\\:bg-accent:hover{background-color:var(--accent)}a.\\[a\\&\\]\\:hover\\:bg-destructive\\/90:hover{background-color:var(--destructive)}@supports (color:color-mix(in lab, red, red)){a.\\[a\\&\\]\\:hover\\:bg-destructive\\/90:hover{background-color:color-mix(in oklab, var(--destructive) 90%, transparent)}}a.\\[a\\&\\]\\:hover\\:bg-primary\\/90:hover{background-color:var(--primary)}@supports (color:color-mix(in lab, red, red)){a.\\[a\\&\\]\\:hover\\:bg-primary\\/90:hover{background-color:color-mix(in oklab, var(--primary) 90%, transparent)}}a.\\[a\\&\\]\\:hover\\:bg-secondary\\/90:hover{background-color:var(--secondary)}@supports (color:color-mix(in lab, red, red)){a.\\[a\\&\\]\\:hover\\:bg-secondary\\/90:hover{background-color:color-mix(in oklab, var(--secondary) 90%, transparent)}}a.\\[a\\&\\]\\:hover\\:text-accent-foreground:hover{color:var(--accent-foreground)}a.\\[a\\&\\]\\:hover\\:underline:hover{text-decoration-line:underline}}}:host{--radius:.5rem;--background:var(--card-background-color,#fff);--foreground:var(--primary-text-color,#1b1f24);--card:var(--card-background-color,#fff);--card-foreground:var(--primary-text-color,#1b1f24);--muted:var(--secondary-background-color,#f2f4f7);--muted-foreground:var(--secondary-text-color,#5b6472);--border:var(--divider-color,#e0e3e8);--primary:#06b6d4;--primary-foreground:#0f172a;--ring:#0891b2;--secondary:var(--secondary-background-color,#f2f4f7);--secondary-foreground:var(--primary-text-color,#1b1f24);--accent:var(--secondary-background-color,#f2f4f7);--accent-foreground:var(--primary-text-color,#1b1f24);--input:var(--divider-color,#e0e3e8);--destructive:#c23b5a;--font-display:\"Space Grotesk\", system-ui, sans-serif;--font-mono:\"JetBrains Mono\", ui-monospace, monospace;font-variant-numeric:tabular-nums;color:var(--foreground);font-family:Inter,system-ui,sans-serif;display:block}@keyframes chain-in{0%{opacity:0}to{opacity:1}}.chain-in{animation:.25s ease-out chain-in}@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}", x = "@font-face{font-family:Space Grotesk;src:url(/alarmio_health_static/fonts/space-grotesk.woff2)format(\"woff2\");font-weight:300 700;font-display:swap}@font-face{font-family:Inter;src:url(/alarmio_health_static/fonts/inter.woff2)format(\"woff2\");font-weight:100 900;font-display:swap}@font-face{font-family:JetBrains Mono;src:url(/alarmio_health_static/fonts/jetbrains-mono.woff2)format(\"woff2\");font-weight:100 800;font-display:swap}", S = (e) => (e.match(/\d+[xX]\d+|[A-Z]?[a-z]+|[A-Z]|\d+/g) ?? []).join("-").toLowerCase();
// node_modules/lucide-react/dist/esm/shared/src/utils/toLucideIconData.mjs
function C(e, t, n = []) {
	if (t == null) throw Error("[lucide]: iconNode is required when icon name is used");
	return {
		name: S(e),
		size: 24,
		node: t,
		...n.length > 0 ? { aliases: n } : {}
	};
}
// node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs
var w = (e) => {
	let t = "", n = !1;
	for (let r of e) r === "-" || r === "_" || r <= " " ? n = t.length > 0 : (t.length === 0 ? t += r.toLowerCase() : t += n ? r.toUpperCase() : r, n = !1);
	return t;
}, T = (e) => {
	let t = w(e);
	return t.charAt(0).toUpperCase() + t.slice(1);
}, E = (...e) => {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) if (typeof n == "string") for (let e of n.split(/\s+/)) e && t.add(e);
	return [...t].join(" ");
}, D = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": 2,
	"stroke-linecap": "round",
	"stroke-linejoin": "round"
};
// node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconNode.mjs
function O(e) {
	return e != null;
}
function k(e, t = {}) {
	let n = t.attributeNames ?? {}, r = (e) => n[e] ?? e, i = e.size ?? e.width ?? D.width, a = e.size ?? e.height ?? D.height, o = e.aliases?.filter((e) => typeof e == "string" && e.trim() !== "").map((e) => `lucide-${e}`) ?? [], s = [...e.name ? [`lucide-${e.name}`] : [], ...o], c = t.className?.split(" ").filter(Boolean) ?? [], l = t.includeDefaultClasses === !1 ? E(...c) : E("lucide", ...s, ...c), u = t.strokeWidth ?? D["stroke-width"];
	if (t.absoluteStrokeWidth) {
		let n = Number(u) * Number(e.size ?? e.width ?? D.width) / Number(t.size ?? t.width ?? D.width);
		Number.isFinite(n) && (u = n);
	}
	return [
		"svg",
		{
			...Object.entries(D).reduce((e, [t, n]) => (e[r(t)] = n, e), {}),
			..."color" in t && t.color && { [r("stroke")]: t.color },
			..."size" in t && O(t.size) && {
				[r("width")]: t.size,
				[r("height")]: t.size
			},
			..."width" in t && O(t.width) && { [r("width")]: t.width },
			..."height" in t && O(t.height) && { [r("height")]: t.height },
			[r("stroke-width")]: u,
			...l && { [r("class")]: l },
			[r("viewBox")]: `0 0 ${i} ${a}`,
			...t.hasA11yProp === !1 ? { [r("aria-hidden")]: "true" } : {},
			..."attributes" in t && t.attributes
		},
		e.node.map((e) => {
			let [n, i, a] = e, o = t.nonScalingStroke ? {
				[r("vector-effect")]: "non-scaling-stroke",
				...i
			} : i;
			return a ? [
				n,
				o,
				a
			] : [n, o];
		})
	];
}
// node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconForReact.mjs
function ee(e, t = {}) {
	return k(e, {
		...t,
		attributeNames: {
			...t.attributeNames,
			class: "className",
			"stroke-width": "strokeWidth",
			"stroke-linecap": "strokeLinecap",
			"stroke-linejoin": "strokeLinejoin",
			"vector-effect": "vectorEffect"
		}
	});
}
// node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs
var te = (e) => {
	if (typeof e != "object" || !e) return !1;
	for (let t in e) if (Object.prototype.hasOwnProperty.call(e, t) && (t.startsWith("aria-") || t === "role" || t === "title") && e[t] != null) return !0;
	return !1;
}, A = (0, v.createContext)({}), j = () => (0, v.useContext)(A), ne = (0, v.forwardRef)(({ color: e, size: t, width: n, height: r, strokeWidth: i, absoluteStrokeWidth: a, nonScalingStroke: o, className: s = "", children: c, iconNode: l = [], icon: u = {
	node: l,
	aliases: [],
	size: 24
}, ...d }, f) => {
	let { size: p = 24, strokeWidth: m = 2, absoluteStrokeWidth: h = !1, nonScalingStroke: g = !1, color: _ = "currentColor", className: y = "" } = j() ?? {}, b = !!c || te(d), [x, S, C = []] = ee(u, {
		color: e ?? _,
		width: n ?? t ?? p,
		height: r ?? t ?? p,
		strokeWidth: i ?? m,
		absoluteStrokeWidth: a ?? h,
		nonScalingStroke: o ?? g,
		className: E(y, s),
		hasA11yProp: b,
		attributes: d
	});
	return (0, v.createElement)(x, {
		ref: f,
		...S
	}, [...C.map(([e, t]) => (0, v.createElement)(e, t)), ...Array.isArray(c) ? c : [c]]);
});
// node_modules/lucide-react/dist/esm/createLucideIcon.mjs
function re(e, t = [], n = []) {
	let r = typeof e == "string" ? C(e, t, n) : e, i = (0, v.forwardRef)(({ className: e, ...t }, n) => (0, v.createElement)(ne, {
		ref: n,
		icon: r,
		className: e,
		...t
	}));
	return r.name && (i.displayName = T(r.name)), i;
}
// node_modules/lucide-react/dist/esm/icons/circle-check.mjs
var M = {
	name: "circle-check",
	size: 24,
	node: [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["path", {
		d: "m16 9-5.5 5.5L8 12",
		key: "xofnsj"
	}]],
	aliases: ["check-circle-2"]
};
M.node;
var ie = re(M), ae = {
	name: "circle-question-mark",
	size: 24,
	node: [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["path", {
			d: "M9 9.5a3 2.5 0 016 0c0 2-2 2-3 3.5",
			key: "1awbb0"
		}],
		["path", {
			d: "M12 17h.01",
			key: "p32p05"
		}]
	],
	aliases: ["help-circle", "circle-help"]
};
ae.node;
var oe = re(ae), se = {
	name: "octagon-x",
	size: 24,
	node: [
		["path", {
			d: "m15 9-6 6",
			key: "1uzhvr"
		}],
		["path", {
			d: "M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z",
			key: "2d38gg"
		}],
		["path", {
			d: "m9 9 6 6",
			key: "z0biqf"
		}]
	],
	aliases: ["x-octagon"]
};
se.node;
var ce = re(se), le = {
	name: "triangle-exclamation-point",
	size: 24,
	node: [
		["path", {
			d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
			key: "wmoenq"
		}],
		["path", {
			d: "M12 9v4",
			key: "juzpu7"
		}],
		["path", {
			d: "M12 17h.01",
			key: "p32p05"
		}]
	],
	aliases: ["alert-triangle", "triangle-alert"]
};
le.node;
var ue = re(le), de = [
	"alarmio",
	"stream",
	"foxace",
	"ajax"
], fe = {
	alarmio: "Alarmio",
	stream: "Event stream",
	foxace: "foXaCe",
	ajax: "Ajax devices"
}, pe = (e) => fe[e] ?? e, me = {
	healthy: "Healthy",
	degraded: "Needs attention",
	down: "Down",
	unknown: "Unknown"
};
function he(e, t) {
	let n = new Date(t).getTime() - new Date(e).getTime();
	if (!Number.isFinite(n) || n < 0) return null;
	let r = Math.round(n / 6e4);
	if (r < 1) return "under 1 min";
	if (r < 60) return `${r} min`;
	let i = Math.floor(r / 60);
	if (i < 24) return r % 60 == 0 ? `${i} h` : `${i} h ${r % 60} min`;
	let a = Math.floor(i / 24);
	return i % 24 == 0 ? `${a} d` : `${a} d ${i % 24} h`;
}
function ge(e) {
	let t = new Date(e);
	return Number.isNaN(t.getTime()) ? "Unknown time" : t.toLocaleString(void 0, {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	});
}
function _e(e) {
	return e === null ? "–" : e >= 100 ? "100%" : `${(Math.floor(e * 10) / 10).toFixed(1)}%`;
}
var N = (e) => new Intl.DateTimeFormat(void 0, e);
function ve(e, t) {
	return t === "7d" ? N({
		weekday: "short",
		day: "numeric"
	}).format(e) : t === "30d" ? N({
		day: "numeric",
		month: "short"
	}).format(e) : N({
		hour: "2-digit",
		minute: "2-digit"
	}).format(e);
}
function ye(e) {
	return N({
		weekday: "short",
		day: "numeric",
		month: "short",
		hour: "2-digit",
		minute: "2-digit"
	}).format(e);
}
function be(e, t, n) {
	if (!Number.isFinite(e) || !Number.isFinite(t) || t <= e) return [];
	let r = [], i = new Date(e);
	if (n === "24h") {
		i.setMinutes(0, 0, 0), i.setHours(Math.ceil((i.getHours() + +(i.getTime() < e)) / 6) * 6);
		for (let e = i; e.getTime() <= t; e.setHours(e.getHours() + 6)) r.push(e.getTime());
	} else {
		let a = n === "7d" ? 2 : 7;
		i.setHours(0, 0, 0, 0), i.getTime() < e && i.setDate(i.getDate() + 1);
		for (let e = i; e.getTime() <= t; e.setDate(e.getDate() + a)) r.push(e.getTime());
	}
	return r;
}
// src/theme/tokens.ts
var xe = {
	healthy: "#1F8A7A",
	degraded: "#C98A1B",
	down: "#C23B5A",
	unknown: "#8A94A6"
}, P = {
	surface: "var(--card-background-color, #ffffff)",
	surfaceMuted: "var(--secondary-background-color, #f2f4f7)",
	page: "var(--primary-background-color, #fafafa)",
	text: "var(--primary-text-color, #1b1f24)",
	textMuted: "var(--secondary-text-color, #5b6472)",
	divider: "var(--divider-color, #e0e3e8)"
}, Se = {
	navy: "#0F172A",
	teal: "#06B6D4",
	tealLight: "#22D3EE",
	tealDark: "#0891B2"
}, Ce = Se.tealDark, we = {
	display: "\"Space Grotesk\", system-ui, sans-serif",
	body: "\"Inter\", system-ui, sans-serif",
	mono: "\"JetBrains Mono\", ui-monospace, monospace"
}, Te = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
	function r(e, n, r) {
		var i = null;
		if (r !== void 0 && (i = "" + r), n.key !== void 0 && (i = "" + n.key), "key" in n) for (var a in r = {}, n) a !== "key" && (r[a] = n[a]);
		else r = n;
		return n = r.ref, {
			$$typeof: t,
			type: e,
			key: i,
			ref: n === void 0 ? null : n,
			props: r
		};
	}
	e.Fragment = n, e.jsx = r, e.jsxs = r;
})), F = (/* @__PURE__ */ o(((e, t) => {
	t.exports = Te();
})))(), Ee = {
	healthy: ie,
	degraded: ue,
	down: ce,
	unknown: oe
}, De = {
	healthy: "circle-check",
	degraded: "triangle-alert",
	down: "octagon-x",
	unknown: "circle-question"
};
function Oe({ status: e, className: t = "size-5", label: n = !1 }) {
	let r = Ee[e];
	return /* @__PURE__ */ (0, F.jsxs)(F.Fragment, { children: [/* @__PURE__ */ (0, F.jsx)(r, {
		"aria-hidden": "true",
		className: `shrink-0 ${t}`,
		style: { color: xe[e] },
		"data-status": e,
		"data-status-icon": De[e]
	}), n ? /* @__PURE__ */ (0, F.jsxs)("span", {
		className: "sr-only",
		children: [me[e], ": "]
	}) : null] });
}
// node_modules/clsx/dist/clsx.mjs
function ke(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") {
		if (Array.isArray(e)) {
			var i = e.length;
			for (t = 0; t < i; t++) e[t] && (n = ke(e[t])) && (r && (r += " "), r += n);
		} else for (n in e) e[n] && (r && (r += " "), r += n);
	}
	return r;
}
function I() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = ke(e)) && (r && (r += " "), r += t);
	return r;
}
// node_modules/class-variance-authority/dist/index.mjs
var Ae = (e) => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e, je = I, Me = (e, t) => (n) => {
	if (t?.variants == null) return je(e, n?.class, n?.className);
	let { variants: r, defaultVariants: i } = t, a = Object.keys(r).map((e) => {
		let t = n?.[e], a = i?.[e];
		if (t === null) return null;
		let o = Ae(t) || Ae(a);
		return r[e][o];
	}), o = n && Object.entries(n).reduce((e, t) => {
		let [n, r] = t;
		return r === void 0 || (e[n] = r), e;
	}, {});
	return je(e, a, t?.compoundVariants?.reduce((e, t) => {
		let { class: n, className: r, ...a } = t;
		return Object.entries(a).every((e) => {
			let [t, n] = e;
			return Array.isArray(n) ? n.includes({
				...i,
				...o
			}[t]) : {
				...i,
				...o
			}[t] === n;
		}) ? [
			...e,
			n,
			r
		] : e;
	}, []), n?.class, n?.className);
}, Ne = (e, t) => {
	let n = Array(e.length + t.length);
	for (let t = 0; t < e.length; t++) n[t] = e[t];
	for (let r = 0; r < t.length; r++) n[e.length + r] = t[r];
	return n;
}, Pe = (e, t) => ({
	classGroupId: e,
	validator: t
}), Fe = (e = /* @__PURE__ */ new Map(), t = null, n) => ({
	nextPart: e,
	validators: t,
	classGroupId: n
}), Ie = "-", Le = [], Re = "arbitrary..", ze = (e) => {
	let t = He(e), { conflictingClassGroups: n, conflictingClassGroupModifiers: r } = e;
	return {
		getClassGroupId: (e) => {
			if (e.startsWith("[") && e.endsWith("]")) return Ve(e);
			let n = e.split(Ie);
			return Be(n, +(n[0] === "" && n.length > 1), t);
		},
		getConflictingClassGroupIds: (e, t) => {
			if (t) {
				let t = r[e], i = n[e];
				return t ? i ? Ne(i, t) : t : i || Le;
			}
			return n[e] || Le;
		}
	};
}, Be = (e, t, n) => {
	if (e.length - t === 0) return n.classGroupId;
	let r = e[t], i = n.nextPart.get(r);
	if (i) {
		let n = Be(e, t + 1, i);
		if (n) return n;
	}
	let a = n.validators;
	if (a === null) return;
	let o = t === 0 ? e.join(Ie) : e.slice(t).join(Ie), s = a.length;
	for (let e = 0; e < s; e++) {
		let t = a[e];
		if (t.validator(o)) return t.classGroupId;
	}
}, Ve = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
	let t = e.slice(1, -1), n = t.indexOf(":"), r = t.slice(0, n);
	return r ? Re + r : void 0;
})(), He = (e) => {
	let { theme: t, classGroups: n } = e;
	return Ue(n, t);
}, Ue = (e, t) => {
	let n = Fe();
	for (let r in e) We(e[r], n, r, t);
	return n;
}, We = (e, t, n, r) => {
	let i = e.length;
	for (let a = 0; a < i; a++) Ge(e[a], t, n, r);
}, Ge = (e, t, n, r) => {
	typeof e == "string" ? Ke(e, t, n) : typeof e == "function" ? qe(e, t, n, r) : Je(e, t, n, r);
}, Ke = (e, t, n) => {
	let r = e === "" ? t : Ye(t, e);
	r.classGroupId = n;
}, qe = (e, t, n, r) => {
	Xe(e) ? We(e(r), t, n, r) : (t.validators === null && (t.validators = []), t.validators.push(Pe(n, e)));
}, Je = (e, t, n, r) => {
	let i = Object.entries(e), a = i.length;
	for (let e = 0; e < a; e++) {
		let [a, o] = i[e];
		We(o, Ye(t, a), n, r);
	}
}, Ye = (e, t) => {
	let n = e, r = t.split(Ie), i = r.length;
	for (let e = 0; e < i; e++) {
		let t = r[e], i = n.nextPart.get(t);
		i || (i = Fe(), n.nextPart.set(t, i)), n = i;
	}
	return n;
}, Xe = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, Ze = (e) => {
	if (e < 1) return {
		get: () => void 0,
		set: () => {}
	};
	let t = 0, n = Object.create(null), r = Object.create(null), i = (i, a) => {
		n[i] = a, t++, t > e && (t = 0, r = n, n = Object.create(null));
	};
	return {
		get(e) {
			let t = n[e];
			if (t !== void 0) return t;
			if ((t = r[e]) !== void 0) return i(e, t), t;
		},
		set(e, t) {
			e in n ? n[e] = t : i(e, t);
		}
	};
}, Qe = "!", $e = ":", et = [], tt = (e, t, n, r, i) => ({
	modifiers: e,
	hasImportantModifier: t,
	baseClassName: n,
	maybePostfixModifierPosition: r,
	isExternal: i
}), nt = (e) => {
	let { prefix: t, experimentalParseClassName: n } = e, r = (e) => {
		let t = [], n = 0, r = 0, i = 0, a, o = e.length;
		for (let s = 0; s < o; s++) {
			let c = e[s];
			if (n === 0 && r === 0) {
				if (c === $e) {
					t.push(e.slice(i, s)), i = s + 1;
					continue;
				}
				if (c === "/") {
					a = s;
					continue;
				}
			}
			if (c === "[") n++;
			else if (c === "]") n--;
			else if (c === "(") r++;
			else if (c === ")") r--;
			else if (c === "\\") s++;
			else if (c === "\"" || c === "'") for (; ++s < o;) {
				let t = e[s];
				if (t === "\\") s++;
				else if (t === c) break;
			}
		}
		let s = t.length === 0 ? e : e.slice(i), c = s, l = !1;
		s.endsWith(Qe) ? (c = s.slice(0, -1), l = !0) : s.startsWith(Qe) && (c = s.slice(1), l = !0);
		let u = l && s.startsWith(Qe) ? 1 : 0, d = a && a > i ? a - i - u : void 0;
		return tt(t, l, c, d);
	};
	if (t) {
		let e = t + $e, n = r;
		r = (t) => t.startsWith(e) ? n(t.slice(e.length)) : tt(et, !1, t, void 0, !0);
	}
	if (n) {
		let e = r;
		r = (t) => n({
			className: t,
			parseClassName: e
		});
	}
	return r;
}, rt = (e) => {
	let t = /* @__PURE__ */ new Map();
	return e.orderSensitiveModifiers.forEach((e, n) => {
		t.set(e, 1e6 + n);
	}), (e) => {
		let n = [], r = [];
		for (let i = 0; i < e.length; i++) {
			let a = e[i], o = a[0] === "[", s = t.has(a);
			o || s ? (r.length > 0 && (r.sort(), n.push(...r), r = []), n.push(a)) : r.push(a);
		}
		return r.length > 0 && (r.sort(), n.push(...r)), n;
	};
}, it = (e) => ({
	cache: Ze(e.cacheSize),
	parseClassName: nt(e),
	sortModifiers: rt(e),
	postfixLookupClassGroupIds: at(e),
	...ze(e)
}), at = (e) => {
	let t = Object.create(null), n = e.postfixLookupClassGroups;
	if (n) for (let e = 0; e < n.length; e++) t[n[e]] = !0;
	return t;
}, ot = /\s+/, st = (e, t) => {
	let { parseClassName: n, getClassGroupId: r, getConflictingClassGroupIds: i, sortModifiers: a, postfixLookupClassGroupIds: o } = t, s = [], c = e.trim().split(ot), l = "";
	for (let e = c.length - 1; e >= 0; --e) {
		let t = c[e], { isExternal: u, modifiers: d, hasImportantModifier: f, baseClassName: p, maybePostfixModifierPosition: m } = n(t);
		if (u) {
			l = t + (l.length > 0 ? " " + l : l);
			continue;
		}
		let h = !!m, g;
		if (h) {
			g = r(p.substring(0, m));
			let e = g && o[g] ? r(p) : void 0;
			e && e !== g && (g = e, h = !1);
		} else g = r(p);
		if (!g) {
			if (!h || (g = r(p), !g)) {
				l = t + (l.length > 0 ? " " + l : l);
				continue;
			}
			h = !1;
		}
		let _ = d.length === 0 ? "" : d.length === 1 ? d[0] : a(d).join(":"), v = f ? _ + Qe : _, y = v + g;
		if (s.indexOf(y) > -1) continue;
		s.push(y);
		let b = i(g, h);
		for (let e = 0; e < b.length; ++e) {
			let t = b[e];
			s.push(v + t);
		}
		l = t + (l.length > 0 ? " " + l : l);
	}
	return l;
}, ct = (...e) => {
	let t = 0, n, r, i = "";
	for (; t < e.length;) (n = e[t++]) && (r = lt(n)) && (i && (i += " "), i += r);
	return i;
}, lt = (e) => {
	if (typeof e == "string") return e;
	let t, n = "";
	for (let r = 0; r < e.length; r++) e[r] && (t = lt(e[r])) && (n && (n += " "), n += t);
	return n;
}, ut = (e, ...t) => {
	let n, r, i, a, o = (o) => (n = it(t.reduce((e, t) => t(e), e())), r = n.cache.get, i = n.cache.set, a = s, s(o)), s = (e) => {
		let t = r(e);
		if (t) return t;
		let a = st(e, n);
		return i(e, a), a;
	};
	return a = o, (...e) => a(ct(...e));
}, dt = [], ft = (e) => {
	let t = (t) => t[e] || dt;
	return t.isThemeGetter = !0, t.themeKey = e, t;
}, pt = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, mt = /^\((?:(\w[\w-]*):)?(.+)\)$/i, ht = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, gt = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, _t = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|Q|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^--spacing\(.+\)|^0$/, vt = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix|color|light-dark|contrast-color|device-cmyk|--alpha)\(.+\)$/i, yt = /^(?:_*[+-]?(?:\d|\.\d)|[\w-]+\(|_*(?:inherit|initial|revert(?:-layer)?|unset)_*$)/i, bt = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, xt = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, St = (e) => ht.test(e), L = (e) => !!e && !Number.isNaN(Number(e)), Ct = (e) => !!e && Number.isInteger(Number(e)), wt = (e) => e.endsWith("%") && L(e.slice(0, -1)), Tt = (e) => gt.test(e), Et = () => !0, Dt = (e) => _t.test(e) && !vt.test(e), Ot = (e) => yt.test(e) && !vt.test(e), kt = () => !1, At = (e) => bt.test(e), jt = (e) => xt.test(e), Mt = (e) => !R(e) && !z(e), Nt = (e) => e.startsWith("@container") && (e[10] === "/" && e[11] !== void 0 || e[11] === "s" && e[16] !== void 0 && e.startsWith("-size/", 10) || e[11] === "n" && e[18] !== void 0 && e.startsWith("-normal/", 10)), Pt = (e) => Zt(e, tn, kt), R = (e) => pt.test(e), Ft = (e) => Zt(e, nn, Dt), It = (e) => Zt(e, rn, Ot), Lt = (e) => Zt(e, an, L), Rt = (e) => Zt(e, sn, Et), zt = (e) => Zt(e, on, kt), Bt = (e) => Zt(e, $t, kt), Vt = (e) => Zt(e, en, jt), Ht = (e) => Zt(e, cn, At), z = (e) => mt.test(e), Ut = (e) => Qt(e, nn), Wt = (e) => Qt(e, rn, !0), Gt = (e) => Qt(e, on), Kt = (e) => Qt(e, $t), qt = (e) => Qt(e, tn), Jt = (e) => Qt(e, en), Yt = (e) => Qt(e, cn, !0), Xt = (e) => Qt(e, sn, !0), Zt = (e, t, n) => {
	let r = pt.exec(e);
	return r ? r[1] ? t(r[1]) : n(r[2]) : !1;
}, Qt = (e, t, n = !1) => {
	let r = mt.exec(e);
	return r ? r[1] ? t(r[1]) : n : !1;
}, $t = (e) => e === "position" || e === "percentage", en = (e) => e === "image" || e === "url", tn = (e) => e === "length" || e === "size" || e === "bg-size", nn = (e) => e === "length", rn = (e) => e !== "color", an = (e) => e === "number", on = (e) => e === "family-name", sn = (e) => e === "number" || e === "weight", cn = (e) => e === "shadow", ln = /*#__PURE__*/ ut(() => {
	let e = ft("color"), t = ft("font"), n = ft("text"), r = ft("font-weight"), i = ft("tracking"), a = ft("leading"), o = ft("breakpoint"), s = ft("container"), c = ft("spacing"), l = ft("radius"), u = ft("shadow"), d = ft("inset-shadow"), f = ft("text-shadow"), p = ft("drop-shadow"), m = ft("blur"), h = ft("perspective"), g = ft("aspect"), _ = ft("ease"), v = ft("animate"), y = () => [
		"auto",
		"avoid",
		"all",
		"avoid-page",
		"page",
		"left",
		"right",
		"column"
	], b = () => [
		"center",
		"top",
		"bottom",
		"left",
		"right",
		"top-left",
		"left-top",
		"top-right",
		"right-top",
		"bottom-right",
		"right-bottom",
		"bottom-left",
		"left-bottom"
	], x = () => [
		...b(),
		z,
		R
	], S = () => [
		"auto",
		"hidden",
		"clip",
		"visible",
		"scroll"
	], C = () => [
		"auto",
		"contain",
		"none"
	], w = () => [
		z,
		R,
		c
	], T = () => [
		St,
		"full",
		"auto",
		...w()
	], E = () => [
		Ct,
		"none",
		"subgrid",
		z,
		R
	], D = () => [
		"auto",
		{ span: [
			"full",
			Ct,
			z,
			R
		] },
		Ct,
		z,
		R
	], O = () => [
		Ct,
		"auto",
		z,
		R
	], k = () => [
		"auto",
		"min",
		"max",
		"fr",
		z,
		R
	], ee = () => [
		"start",
		"end",
		"center",
		"between",
		"around",
		"evenly",
		"stretch",
		"baseline",
		"center-safe",
		"end-safe"
	], te = () => [
		"start",
		"end",
		"center",
		"stretch",
		"center-safe",
		"end-safe"
	], A = () => ["auto", ...w()], j = () => [
		St,
		"auto",
		"full",
		"dvw",
		"dvh",
		"lvw",
		"lvh",
		"svw",
		"svh",
		"min",
		"max",
		"fit",
		...w()
	], ne = () => [
		s,
		St,
		"screen",
		"full",
		"dvw",
		"lvw",
		"svw",
		"min",
		"max",
		"fit",
		...w()
	], re = () => [
		St,
		"screen",
		"full",
		"lh",
		"dvh",
		"lvh",
		"svh",
		"min",
		"max",
		"fit",
		...w()
	], M = () => [
		e,
		z,
		R
	], ie = () => [
		...b(),
		Kt,
		Bt,
		{ position: [z, R] }
	], ae = () => ["no-repeat", { repeat: [
		"",
		"x",
		"y",
		"space",
		"round"
	] }], oe = () => [
		"auto",
		"cover",
		"contain",
		qt,
		Pt,
		{ size: [z, R] }
	], se = () => [
		wt,
		Ut,
		Ft
	], ce = () => [
		"",
		"none",
		"full",
		l,
		z,
		R
	], le = () => [
		"",
		L,
		Ut,
		Ft
	], ue = () => [
		"solid",
		"dashed",
		"dotted",
		"double"
	], de = () => [
		"normal",
		"multiply",
		"screen",
		"overlay",
		"darken",
		"lighten",
		"color-dodge",
		"color-burn",
		"hard-light",
		"soft-light",
		"difference",
		"exclusion",
		"hue",
		"saturation",
		"color",
		"luminosity"
	], fe = () => [
		L,
		wt,
		Wt,
		It
	], pe = () => [
		"",
		"none",
		m,
		z,
		R
	], me = () => [
		"none",
		L,
		z,
		R
	], he = () => [
		"none",
		L,
		z,
		R
	], ge = () => [
		L,
		z,
		R
	], _e = () => [
		St,
		"full",
		...w()
	];
	return {
		cacheSize: 500,
		theme: {
			animate: [
				"spin",
				"ping",
				"pulse",
				"bounce"
			],
			aspect: ["video"],
			blur: [Tt],
			breakpoint: [Tt],
			color: [Et],
			container: [Tt],
			"drop-shadow": [Tt],
			ease: [
				"in",
				"out",
				"in-out"
			],
			font: [Mt],
			"font-weight": [
				"thin",
				"extralight",
				"light",
				"normal",
				"medium",
				"semibold",
				"bold",
				"extrabold",
				"black"
			],
			"inset-shadow": [Tt],
			leading: [
				"none",
				"tight",
				"snug",
				"normal",
				"relaxed",
				"loose"
			],
			perspective: [
				"dramatic",
				"near",
				"normal",
				"midrange",
				"distant",
				"none"
			],
			radius: [Tt],
			shadow: [Tt],
			spacing: ["px", L],
			text: [Tt],
			"text-shadow": [Tt],
			tracking: [
				"tighter",
				"tight",
				"normal",
				"wide",
				"wider",
				"widest"
			]
		},
		classGroups: {
			aspect: [{ aspect: [
				"auto",
				"square",
				St,
				R,
				z,
				g
			] }],
			container: ["container"],
			"container-type": [{ "@container": [
				"",
				"normal",
				"size",
				z,
				R
			] }],
			"container-named": [Nt],
			columns: [{ columns: [
				L,
				"auto",
				R,
				z,
				s
			] }],
			"break-after": [{ "break-after": y() }],
			"break-before": [{ "break-before": y() }],
			"break-inside": [{ "break-inside": [
				"auto",
				"avoid",
				"avoid-page",
				"avoid-column"
			] }],
			"box-decoration": [{ "box-decoration": ["slice", "clone"] }],
			box: [{ box: ["border", "content"] }],
			display: [
				"block",
				"inline-block",
				"inline",
				"flex",
				"inline-flex",
				"table",
				"inline-table",
				"table-caption",
				"table-cell",
				"table-column",
				"table-column-group",
				"table-footer-group",
				"table-header-group",
				"table-row-group",
				"table-row",
				"flow-root",
				"grid",
				"inline-grid",
				"contents",
				"list-item",
				"hidden"
			],
			sr: ["sr-only"],
			"not-sr": ["not-sr-only"],
			float: [{ float: [
				"right",
				"left",
				"none",
				"start",
				"end"
			] }],
			clear: [{ clear: [
				"left",
				"right",
				"both",
				"none",
				"start",
				"end"
			] }],
			isolation: ["isolate", "isolation-auto"],
			"object-fit": [{ object: [
				"contain",
				"cover",
				"fill",
				"none",
				"scale-down"
			] }],
			"object-position": [{ object: x() }],
			overflow: [{ overflow: S() }],
			"overflow-x": [{ "overflow-x": S() }],
			"overflow-y": [{ "overflow-y": S() }],
			overscroll: [{ overscroll: C() }],
			"overscroll-x": [{ "overscroll-x": C() }],
			"overscroll-y": [{ "overscroll-y": C() }],
			position: [
				"static",
				"fixed",
				"absolute",
				"relative",
				"sticky"
			],
			inset: [{ inset: T() }],
			"inset-x": [{ "inset-x": T() }],
			"inset-y": [{ "inset-y": T() }],
			start: [{
				"inset-s": T(),
				start: T()
			}],
			end: [{
				"inset-e": T(),
				end: T()
			}],
			"inset-bs": [{ "inset-bs": T() }],
			"inset-be": [{ "inset-be": T() }],
			top: [{ top: T() }],
			right: [{ right: T() }],
			bottom: [{ bottom: T() }],
			left: [{ left: T() }],
			visibility: [
				"visible",
				"invisible",
				"collapse"
			],
			z: [{ z: [
				Ct,
				"auto",
				z,
				R
			] }],
			basis: [{ basis: [
				St,
				"full",
				"auto",
				s,
				...w()
			] }],
			"flex-direction": [{ flex: [
				"row",
				"row-reverse",
				"col",
				"col-reverse"
			] }],
			"flex-wrap": [{ flex: [
				"nowrap",
				"wrap",
				"wrap-reverse"
			] }],
			flex: [{ flex: [
				L,
				St,
				"auto",
				"initial",
				"none",
				z,
				R
			] }],
			grow: [{ grow: [
				"",
				L,
				z,
				R
			] }],
			shrink: [{ shrink: [
				"",
				L,
				z,
				R
			] }],
			order: [{ order: [
				Ct,
				"first",
				"last",
				"none",
				z,
				R
			] }],
			"grid-cols": [{ "grid-cols": E() }],
			"col-start-end": [{ col: D() }],
			"col-start": [{ "col-start": O() }],
			"col-end": [{ "col-end": O() }],
			"grid-rows": [{ "grid-rows": E() }],
			"row-start-end": [{ row: D() }],
			"row-start": [{ "row-start": O() }],
			"row-end": [{ "row-end": O() }],
			"grid-flow": [{ "grid-flow": [
				"row",
				"col",
				"dense",
				"row-dense",
				"col-dense"
			] }],
			"auto-cols": [{ "auto-cols": k() }],
			"auto-rows": [{ "auto-rows": k() }],
			gap: [{ gap: w() }],
			"gap-x": [{ "gap-x": w() }],
			"gap-y": [{ "gap-y": w() }],
			"justify-content": [{ justify: [...ee(), "normal"] }],
			"justify-items": [{ "justify-items": [...te(), "normal"] }],
			"justify-self": [{ "justify-self": ["auto", ...te()] }],
			"align-content": [{ content: ["normal", ...ee()] }],
			"align-items": [{ items: [...te(), { baseline: ["", "last"] }] }],
			"align-self": [{ self: [
				"auto",
				...te(),
				{ baseline: ["", "last"] }
			] }],
			"place-content": [{ "place-content": ee() }],
			"place-items": [{ "place-items": [...te(), "baseline"] }],
			"place-self": [{ "place-self": ["auto", ...te()] }],
			p: [{ p: w() }],
			px: [{ px: w() }],
			py: [{ py: w() }],
			ps: [{ ps: w() }],
			pe: [{ pe: w() }],
			pbs: [{ pbs: w() }],
			pbe: [{ pbe: w() }],
			pt: [{ pt: w() }],
			pr: [{ pr: w() }],
			pb: [{ pb: w() }],
			pl: [{ pl: w() }],
			m: [{ m: A() }],
			mx: [{ mx: A() }],
			my: [{ my: A() }],
			ms: [{ ms: A() }],
			me: [{ me: A() }],
			mbs: [{ mbs: A() }],
			mbe: [{ mbe: A() }],
			mt: [{ mt: A() }],
			mr: [{ mr: A() }],
			mb: [{ mb: A() }],
			ml: [{ ml: A() }],
			"space-x": [{ "space-x": w() }],
			"space-x-reverse": ["space-x-reverse"],
			"space-y": [{ "space-y": w() }],
			"space-y-reverse": ["space-y-reverse"],
			size: [{ size: j() }],
			"inline-size": [{ inline: ["auto", ...ne()] }],
			"min-inline-size": [{ "min-inline": ["auto", ...ne()] }],
			"max-inline-size": [{ "max-inline": ["none", ...ne()] }],
			"block-size": [{ block: ["auto", ...re()] }],
			"min-block-size": [{ "min-block": ["auto", ...re()] }],
			"max-block-size": [{ "max-block": ["none", ...re()] }],
			w: [{ w: [
				s,
				"screen",
				...j()
			] }],
			"min-w": [{ "min-w": [
				s,
				"screen",
				"none",
				...j()
			] }],
			"max-w": [{ "max-w": [
				s,
				"screen",
				"none",
				"prose",
				{ screen: [o] },
				...j()
			] }],
			h: [{ h: [
				"screen",
				"lh",
				...j()
			] }],
			"min-h": [{ "min-h": [
				"screen",
				"lh",
				"none",
				...j()
			] }],
			"max-h": [{ "max-h": [
				"screen",
				"lh",
				"none",
				...j()
			] }],
			"font-size": [{ text: [
				"base",
				n,
				Ut,
				Ft
			] }],
			"font-smoothing": ["antialiased", "subpixel-antialiased"],
			"font-style": ["italic", "not-italic"],
			"font-weight": [{ font: [
				r,
				Xt,
				Rt
			] }],
			"font-stretch": [{ "font-stretch": [
				"ultra-condensed",
				"extra-condensed",
				"condensed",
				"semi-condensed",
				"normal",
				"semi-expanded",
				"expanded",
				"extra-expanded",
				"ultra-expanded",
				wt,
				R
			] }],
			"font-family": [{ font: [
				Gt,
				zt,
				t
			] }],
			"font-features": [{ "font-features": [R] }],
			"fvn-normal": ["normal-nums"],
			"fvn-ordinal": ["ordinal"],
			"fvn-slashed-zero": ["slashed-zero"],
			"fvn-figure": ["lining-nums", "oldstyle-nums"],
			"fvn-spacing": ["proportional-nums", "tabular-nums"],
			"fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
			tracking: [{ tracking: [
				i,
				z,
				R
			] }],
			"line-clamp": [{ "line-clamp": [
				L,
				"none",
				z,
				R
			] }],
			leading: [{ leading: [
				"none",
				a,
				...w()
			] }],
			"list-image": [{ "list-image": [
				"none",
				z,
				R
			] }],
			"list-style-position": [{ list: ["inside", "outside"] }],
			"list-style-type": [{ list: [
				"disc",
				"decimal",
				"none",
				z,
				R
			] }],
			"text-alignment": [{ text: [
				"left",
				"center",
				"right",
				"justify",
				"start",
				"end"
			] }],
			"placeholder-color": [{ placeholder: M() }],
			"text-color": [{ text: M() }],
			"text-decoration": [
				"underline",
				"overline",
				"line-through",
				"no-underline"
			],
			"text-decoration-style": [{ decoration: [...ue(), "wavy"] }],
			"text-decoration-thickness": [{ decoration: [
				L,
				"from-font",
				"auto",
				Ut,
				Kt,
				Ft
			] }],
			"text-decoration-color": [{ decoration: M() }],
			"underline-offset": [{ "underline-offset": [
				L,
				"auto",
				z,
				R
			] }],
			"text-transform": [
				"uppercase",
				"lowercase",
				"capitalize",
				"normal-case"
			],
			"text-overflow": [
				"truncate",
				"text-ellipsis",
				"text-clip"
			],
			"text-wrap": [{ text: [
				"wrap",
				"nowrap",
				"balance",
				"pretty"
			] }],
			indent: [{ indent: w() }],
			"tab-size": [{ tab: [
				Ct,
				z,
				R
			] }],
			"vertical-align": [{ align: [
				"baseline",
				"top",
				"middle",
				"bottom",
				"text-top",
				"text-bottom",
				"sub",
				"super",
				z,
				R
			] }],
			whitespace: [{ whitespace: [
				"normal",
				"nowrap",
				"pre",
				"pre-line",
				"pre-wrap",
				"break-spaces"
			] }],
			break: [{ break: [
				"normal",
				"words",
				"all",
				"keep"
			] }],
			wrap: [{ wrap: [
				"break-word",
				"anywhere",
				"normal"
			] }],
			hyphens: [{ hyphens: [
				"none",
				"manual",
				"auto"
			] }],
			content: [{ content: [
				"none",
				z,
				R
			] }],
			"bg-attachment": [{ bg: [
				"fixed",
				"local",
				"scroll"
			] }],
			"bg-clip": [{ "bg-clip": [
				"border",
				"padding",
				"content",
				"text"
			] }],
			"bg-origin": [{ "bg-origin": [
				"border",
				"padding",
				"content"
			] }],
			"bg-position": [{ bg: ie() }],
			"bg-repeat": [{ bg: ae() }],
			"bg-size": [{ bg: oe() }],
			"bg-image": [{ bg: [
				"none",
				{
					linear: [
						{ to: [
							"t",
							"tr",
							"r",
							"br",
							"b",
							"bl",
							"l",
							"tl"
						] },
						Ct,
						z,
						R
					],
					radial: [
						"",
						z,
						R
					],
					conic: [
						"",
						Ct,
						z,
						R
					]
				},
				Jt,
				Vt
			] }],
			"bg-color": [{ bg: M() }],
			"gradient-from-pos": [{ from: se() }],
			"gradient-via-pos": [{ via: se() }],
			"gradient-to-pos": [{ to: se() }],
			"gradient-from": [{ from: M() }],
			"gradient-via": [{ via: M() }],
			"gradient-to": [{ to: M() }],
			rounded: [{ rounded: ce() }],
			"rounded-s": [{ "rounded-s": ce() }],
			"rounded-e": [{ "rounded-e": ce() }],
			"rounded-t": [{ "rounded-t": ce() }],
			"rounded-r": [{ "rounded-r": ce() }],
			"rounded-b": [{ "rounded-b": ce() }],
			"rounded-l": [{ "rounded-l": ce() }],
			"rounded-ss": [{ "rounded-ss": ce() }],
			"rounded-se": [{ "rounded-se": ce() }],
			"rounded-ee": [{ "rounded-ee": ce() }],
			"rounded-es": [{ "rounded-es": ce() }],
			"rounded-tl": [{ "rounded-tl": ce() }],
			"rounded-tr": [{ "rounded-tr": ce() }],
			"rounded-br": [{ "rounded-br": ce() }],
			"rounded-bl": [{ "rounded-bl": ce() }],
			"border-w": [{ border: le() }],
			"border-w-x": [{ "border-x": le() }],
			"border-w-y": [{ "border-y": le() }],
			"border-w-s": [{ "border-s": le() }],
			"border-w-e": [{ "border-e": le() }],
			"border-w-bs": [{ "border-bs": le() }],
			"border-w-be": [{ "border-be": le() }],
			"border-w-t": [{ "border-t": le() }],
			"border-w-r": [{ "border-r": le() }],
			"border-w-b": [{ "border-b": le() }],
			"border-w-l": [{ "border-l": le() }],
			"divide-x": [{ "divide-x": le() }],
			"divide-x-reverse": ["divide-x-reverse"],
			"divide-y": [{ "divide-y": le() }],
			"divide-y-reverse": ["divide-y-reverse"],
			"border-style": [{ border: [
				...ue(),
				"hidden",
				"none"
			] }],
			"divide-style": [{ divide: [
				...ue(),
				"hidden",
				"none"
			] }],
			"border-color": [{ border: M() }],
			"border-color-x": [{ "border-x": M() }],
			"border-color-y": [{ "border-y": M() }],
			"border-color-s": [{ "border-s": M() }],
			"border-color-e": [{ "border-e": M() }],
			"border-color-bs": [{ "border-bs": M() }],
			"border-color-be": [{ "border-be": M() }],
			"border-color-t": [{ "border-t": M() }],
			"border-color-r": [{ "border-r": M() }],
			"border-color-b": [{ "border-b": M() }],
			"border-color-l": [{ "border-l": M() }],
			"divide-color": [{ divide: M() }],
			"outline-style": [{ outline: [
				...ue(),
				"none",
				"hidden"
			] }],
			"outline-offset": [{ "outline-offset": [
				L,
				z,
				R
			] }],
			"outline-w": [{ outline: [
				"",
				L,
				Ut,
				Ft
			] }],
			"outline-color": [{ outline: M() }],
			shadow: [{ shadow: [
				"",
				"inner",
				"none",
				u,
				Yt,
				Ht
			] }],
			"shadow-color": [{ shadow: M() }],
			"inset-shadow": [{ "inset-shadow": [
				"none",
				d,
				Yt,
				Ht
			] }],
			"inset-shadow-color": [{ "inset-shadow": M() }],
			"ring-w": [{ ring: le() }],
			"ring-w-inset": ["ring-inset"],
			"ring-color": [{ ring: M() }],
			"ring-offset-w": [{ "ring-offset": [L, Ft] }],
			"ring-offset-color": [{ "ring-offset": M() }],
			"inset-ring-w": [{ "inset-ring": le() }],
			"inset-ring-color": [{ "inset-ring": M() }],
			"text-shadow": [{ "text-shadow": [
				"none",
				f,
				Yt,
				Ht
			] }],
			"text-shadow-color": [{ "text-shadow": M() }],
			opacity: [{ opacity: [
				L,
				z,
				R
			] }],
			"mix-blend": [{ "mix-blend": [
				...de(),
				"plus-darker",
				"plus-lighter"
			] }],
			"bg-blend": [{ "bg-blend": de() }],
			"mask-clip": [{ "mask-clip": [
				"border",
				"padding",
				"content",
				"fill",
				"stroke",
				"view"
			] }, "mask-no-clip"],
			"mask-composite": [{ mask: [
				"add",
				"subtract",
				"intersect",
				"exclude"
			] }],
			"mask-image-linear-pos": [{ "mask-linear": [L] }],
			"mask-image-linear-from-pos": [{ "mask-linear-from": fe() }],
			"mask-image-linear-to-pos": [{ "mask-linear-to": fe() }],
			"mask-image-linear-from-color": [{ "mask-linear-from": M() }],
			"mask-image-linear-to-color": [{ "mask-linear-to": M() }],
			"mask-image-t-from-pos": [{ "mask-t-from": fe() }],
			"mask-image-t-to-pos": [{ "mask-t-to": fe() }],
			"mask-image-t-from-color": [{ "mask-t-from": M() }],
			"mask-image-t-to-color": [{ "mask-t-to": M() }],
			"mask-image-r-from-pos": [{ "mask-r-from": fe() }],
			"mask-image-r-to-pos": [{ "mask-r-to": fe() }],
			"mask-image-r-from-color": [{ "mask-r-from": M() }],
			"mask-image-r-to-color": [{ "mask-r-to": M() }],
			"mask-image-b-from-pos": [{ "mask-b-from": fe() }],
			"mask-image-b-to-pos": [{ "mask-b-to": fe() }],
			"mask-image-b-from-color": [{ "mask-b-from": M() }],
			"mask-image-b-to-color": [{ "mask-b-to": M() }],
			"mask-image-l-from-pos": [{ "mask-l-from": fe() }],
			"mask-image-l-to-pos": [{ "mask-l-to": fe() }],
			"mask-image-l-from-color": [{ "mask-l-from": M() }],
			"mask-image-l-to-color": [{ "mask-l-to": M() }],
			"mask-image-x-from-pos": [{ "mask-x-from": fe() }],
			"mask-image-x-to-pos": [{ "mask-x-to": fe() }],
			"mask-image-x-from-color": [{ "mask-x-from": M() }],
			"mask-image-x-to-color": [{ "mask-x-to": M() }],
			"mask-image-y-from-pos": [{ "mask-y-from": fe() }],
			"mask-image-y-to-pos": [{ "mask-y-to": fe() }],
			"mask-image-y-from-color": [{ "mask-y-from": M() }],
			"mask-image-y-to-color": [{ "mask-y-to": M() }],
			"mask-image-radial": [{ "mask-radial": [z, R] }],
			"mask-image-radial-from-pos": [{ "mask-radial-from": fe() }],
			"mask-image-radial-to-pos": [{ "mask-radial-to": fe() }],
			"mask-image-radial-from-color": [{ "mask-radial-from": M() }],
			"mask-image-radial-to-color": [{ "mask-radial-to": M() }],
			"mask-image-radial-shape": [{ mask: ["circle", "ellipse"] }],
			"mask-image-radial-size": [{ "mask-radial": [{
				closest: ["side", "corner"],
				farthest: ["side", "corner"]
			}] }],
			"mask-image-radial-pos": [{ "mask-radial-at": b() }],
			"mask-image-conic-pos": [{ "mask-conic": [L] }],
			"mask-image-conic-from-pos": [{ "mask-conic-from": fe() }],
			"mask-image-conic-to-pos": [{ "mask-conic-to": fe() }],
			"mask-image-conic-from-color": [{ "mask-conic-from": M() }],
			"mask-image-conic-to-color": [{ "mask-conic-to": M() }],
			"mask-mode": [{ mask: [
				"alpha",
				"luminance",
				"match"
			] }],
			"mask-origin": [{ "mask-origin": [
				"border",
				"padding",
				"content",
				"fill",
				"stroke",
				"view"
			] }],
			"mask-position": [{ mask: ie() }],
			"mask-repeat": [{ mask: ae() }],
			"mask-size": [{ mask: oe() }],
			"mask-type": [{ "mask-type": ["alpha", "luminance"] }],
			"mask-image": [{ mask: [
				"none",
				z,
				R
			] }],
			filter: [{ filter: [
				"",
				"none",
				z,
				R
			] }],
			blur: [{ blur: pe() }],
			brightness: [{ brightness: [
				L,
				z,
				R
			] }],
			contrast: [{ contrast: [
				L,
				z,
				R
			] }],
			"drop-shadow": [{ "drop-shadow": [
				"",
				"none",
				p,
				Yt,
				Ht
			] }],
			"drop-shadow-color": [{ "drop-shadow": M() }],
			grayscale: [{ grayscale: [
				"",
				L,
				z,
				R
			] }],
			"hue-rotate": [{ "hue-rotate": [
				L,
				z,
				R
			] }],
			invert: [{ invert: [
				"",
				L,
				z,
				R
			] }],
			saturate: [{ saturate: [
				L,
				z,
				R
			] }],
			sepia: [{ sepia: [
				"",
				L,
				z,
				R
			] }],
			"backdrop-filter": [{ "backdrop-filter": [
				"",
				"none",
				z,
				R
			] }],
			"backdrop-blur": [{ "backdrop-blur": pe() }],
			"backdrop-brightness": [{ "backdrop-brightness": [
				L,
				z,
				R
			] }],
			"backdrop-contrast": [{ "backdrop-contrast": [
				L,
				z,
				R
			] }],
			"backdrop-grayscale": [{ "backdrop-grayscale": [
				"",
				L,
				z,
				R
			] }],
			"backdrop-hue-rotate": [{ "backdrop-hue-rotate": [
				L,
				z,
				R
			] }],
			"backdrop-invert": [{ "backdrop-invert": [
				"",
				L,
				z,
				R
			] }],
			"backdrop-opacity": [{ "backdrop-opacity": [
				L,
				z,
				R
			] }],
			"backdrop-saturate": [{ "backdrop-saturate": [
				L,
				z,
				R
			] }],
			"backdrop-sepia": [{ "backdrop-sepia": [
				"",
				L,
				z,
				R
			] }],
			"border-collapse": [{ border: ["collapse", "separate"] }],
			"border-spacing": [{ "border-spacing": w() }],
			"border-spacing-x": [{ "border-spacing-x": w() }],
			"border-spacing-y": [{ "border-spacing-y": w() }],
			"table-layout": [{ table: ["auto", "fixed"] }],
			caption: [{ caption: ["top", "bottom"] }],
			transition: [{ transition: [
				"",
				"all",
				"colors",
				"opacity",
				"shadow",
				"transform",
				"none",
				z,
				R
			] }],
			"transition-behavior": [{ transition: ["normal", "discrete"] }],
			duration: [{ duration: [
				L,
				"initial",
				z,
				R
			] }],
			ease: [{ ease: [
				"linear",
				"initial",
				_,
				z,
				R
			] }],
			delay: [{ delay: [
				L,
				z,
				R
			] }],
			animate: [{ animate: [
				"none",
				v,
				z,
				R
			] }],
			backface: [{ backface: ["hidden", "visible"] }],
			perspective: [{ perspective: [
				h,
				z,
				R
			] }],
			"perspective-origin": [{ "perspective-origin": x() }],
			rotate: [{ rotate: me() }],
			"rotate-x": [{ "rotate-x": me() }],
			"rotate-y": [{ "rotate-y": me() }],
			"rotate-z": [{ "rotate-z": me() }],
			scale: [{ scale: he() }],
			"scale-x": [{ "scale-x": he() }],
			"scale-y": [{ "scale-y": he() }],
			"scale-z": [{ "scale-z": he() }],
			"scale-3d": ["scale-3d"],
			skew: [{ skew: ge() }],
			"skew-x": [{ "skew-x": ge() }],
			"skew-y": [{ "skew-y": ge() }],
			transform: [{ transform: [
				z,
				R,
				"",
				"none",
				"gpu",
				"cpu"
			] }],
			"transform-origin": [{ origin: x() }],
			"transform-style": [{ transform: ["3d", "flat"] }],
			translate: [{ translate: _e() }],
			"translate-x": [{ "translate-x": _e() }],
			"translate-y": [{ "translate-y": _e() }],
			"translate-z": [{ "translate-z": _e() }],
			"translate-none": ["translate-none"],
			zoom: [{ zoom: [
				Ct,
				z,
				R
			] }],
			accent: [{ accent: M() }],
			appearance: [{ appearance: ["none", "auto"] }],
			"caret-color": [{ caret: M() }],
			"color-scheme": [{ scheme: [
				"normal",
				"dark",
				"light",
				"light-dark",
				"only-dark",
				"only-light"
			] }],
			cursor: [{ cursor: [
				"auto",
				"default",
				"pointer",
				"wait",
				"text",
				"move",
				"help",
				"not-allowed",
				"none",
				"context-menu",
				"progress",
				"cell",
				"crosshair",
				"vertical-text",
				"alias",
				"copy",
				"no-drop",
				"grab",
				"grabbing",
				"all-scroll",
				"col-resize",
				"row-resize",
				"n-resize",
				"e-resize",
				"s-resize",
				"w-resize",
				"ne-resize",
				"nw-resize",
				"se-resize",
				"sw-resize",
				"ew-resize",
				"ns-resize",
				"nesw-resize",
				"nwse-resize",
				"zoom-in",
				"zoom-out",
				z,
				R
			] }],
			"field-sizing": [{ "field-sizing": ["fixed", "content"] }],
			"pointer-events": [{ "pointer-events": ["auto", "none"] }],
			resize: [{ resize: [
				"none",
				"",
				"y",
				"x"
			] }],
			"scroll-behavior": [{ scroll: ["auto", "smooth"] }],
			"scrollbar-thumb-color": [{ "scrollbar-thumb": M() }],
			"scrollbar-track-color": [{ "scrollbar-track": M() }],
			"scrollbar-gutter": [{ "scrollbar-gutter": [
				"auto",
				"stable",
				"both"
			] }],
			"scrollbar-w": [{ scrollbar: [
				"auto",
				"thin",
				"none"
			] }],
			"scroll-m": [{ "scroll-m": w() }],
			"scroll-mx": [{ "scroll-mx": w() }],
			"scroll-my": [{ "scroll-my": w() }],
			"scroll-ms": [{ "scroll-ms": w() }],
			"scroll-me": [{ "scroll-me": w() }],
			"scroll-mbs": [{ "scroll-mbs": w() }],
			"scroll-mbe": [{ "scroll-mbe": w() }],
			"scroll-mt": [{ "scroll-mt": w() }],
			"scroll-mr": [{ "scroll-mr": w() }],
			"scroll-mb": [{ "scroll-mb": w() }],
			"scroll-ml": [{ "scroll-ml": w() }],
			"scroll-p": [{ "scroll-p": w() }],
			"scroll-px": [{ "scroll-px": w() }],
			"scroll-py": [{ "scroll-py": w() }],
			"scroll-ps": [{ "scroll-ps": w() }],
			"scroll-pe": [{ "scroll-pe": w() }],
			"scroll-pbs": [{ "scroll-pbs": w() }],
			"scroll-pbe": [{ "scroll-pbe": w() }],
			"scroll-pt": [{ "scroll-pt": w() }],
			"scroll-pr": [{ "scroll-pr": w() }],
			"scroll-pb": [{ "scroll-pb": w() }],
			"scroll-pl": [{ "scroll-pl": w() }],
			"snap-align": [{ snap: [
				"start",
				"end",
				"center",
				"align-none"
			] }],
			"snap-stop": [{ snap: ["normal", "always"] }],
			"snap-type": [{ snap: [
				"none",
				"x",
				"y",
				"both"
			] }],
			"snap-strictness": [{ snap: ["mandatory", "proximity"] }],
			touch: [{ touch: [
				"auto",
				"none",
				"manipulation"
			] }],
			"touch-x": [{ "touch-pan": [
				"x",
				"left",
				"right"
			] }],
			"touch-y": [{ "touch-pan": [
				"y",
				"up",
				"down"
			] }],
			"touch-pz": ["touch-pinch-zoom"],
			select: [{ select: [
				"none",
				"text",
				"all",
				"auto"
			] }],
			"will-change": [{ "will-change": [
				"auto",
				"scroll",
				"contents",
				"transform",
				z,
				R
			] }],
			fill: [{ fill: ["none", ...M()] }],
			"stroke-w": [{ stroke: [
				L,
				Ut,
				Ft,
				Lt
			] }],
			stroke: [{ stroke: ["none", ...M()] }],
			"forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }]
		},
		conflictingClassGroups: {
			"container-named": ["container-type"],
			overflow: ["overflow-x", "overflow-y"],
			overscroll: ["overscroll-x", "overscroll-y"],
			inset: [
				"inset-x",
				"inset-y",
				"inset-bs",
				"inset-be",
				"start",
				"end",
				"top",
				"right",
				"bottom",
				"left"
			],
			"inset-x": [
				"start",
				"end",
				"right",
				"left"
			],
			"inset-y": [
				"inset-bs",
				"inset-be",
				"top",
				"bottom"
			],
			flex: [
				"basis",
				"grow",
				"shrink"
			],
			gap: ["gap-x", "gap-y"],
			"place-content": ["align-content", "justify-content"],
			"place-items": ["align-items", "justify-items"],
			"place-self": ["align-self", "justify-self"],
			p: [
				"px",
				"py",
				"ps",
				"pe",
				"pbs",
				"pbe",
				"pt",
				"pr",
				"pb",
				"pl"
			],
			px: [
				"ps",
				"pe",
				"pr",
				"pl"
			],
			py: [
				"pbs",
				"pbe",
				"pt",
				"pb"
			],
			m: [
				"mx",
				"my",
				"ms",
				"me",
				"mbs",
				"mbe",
				"mt",
				"mr",
				"mb",
				"ml"
			],
			mx: [
				"ms",
				"me",
				"mr",
				"ml"
			],
			my: [
				"mbs",
				"mbe",
				"mt",
				"mb"
			],
			size: ["w", "h"],
			"fvn-normal": [
				"fvn-ordinal",
				"fvn-slashed-zero",
				"fvn-figure",
				"fvn-spacing",
				"fvn-fraction"
			],
			"fvn-ordinal": ["fvn-normal"],
			"fvn-slashed-zero": ["fvn-normal"],
			"fvn-figure": ["fvn-normal"],
			"fvn-spacing": ["fvn-normal"],
			"fvn-fraction": ["fvn-normal"],
			"line-clamp": ["display", "overflow"],
			sr: /* @__PURE__ */ "not-sr.position.size.w.h.p.px.py.ps.pe.pbs.pbe.pt.pr.pb.pl.m.mx.my.ms.me.mbs.mbe.mt.mr.mb.ml.overflow.overflow-x.overflow-y.whitespace".split("."),
			"not-sr": ["sr"],
			rounded: [
				"rounded-s",
				"rounded-e",
				"rounded-t",
				"rounded-r",
				"rounded-b",
				"rounded-l",
				"rounded-ss",
				"rounded-se",
				"rounded-ee",
				"rounded-es",
				"rounded-tl",
				"rounded-tr",
				"rounded-br",
				"rounded-bl"
			],
			"rounded-s": ["rounded-ss", "rounded-es"],
			"rounded-e": ["rounded-se", "rounded-ee"],
			"rounded-t": ["rounded-tl", "rounded-tr"],
			"rounded-r": ["rounded-tr", "rounded-br"],
			"rounded-b": ["rounded-br", "rounded-bl"],
			"rounded-l": ["rounded-tl", "rounded-bl"],
			"border-spacing": ["border-spacing-x", "border-spacing-y"],
			"border-w": [
				"border-w-x",
				"border-w-y",
				"border-w-s",
				"border-w-e",
				"border-w-bs",
				"border-w-be",
				"border-w-t",
				"border-w-r",
				"border-w-b",
				"border-w-l"
			],
			"border-w-x": [
				"border-w-s",
				"border-w-e",
				"border-w-r",
				"border-w-l"
			],
			"border-w-y": [
				"border-w-bs",
				"border-w-be",
				"border-w-t",
				"border-w-b"
			],
			"border-color": [
				"border-color-x",
				"border-color-y",
				"border-color-s",
				"border-color-e",
				"border-color-bs",
				"border-color-be",
				"border-color-t",
				"border-color-r",
				"border-color-b",
				"border-color-l"
			],
			"border-color-x": [
				"border-color-s",
				"border-color-e",
				"border-color-r",
				"border-color-l"
			],
			"border-color-y": [
				"border-color-bs",
				"border-color-be",
				"border-color-t",
				"border-color-b"
			],
			"mask-image-x-from-pos": ["mask-image-r-from-pos", "mask-image-l-from-pos"],
			"mask-image-x-to-pos": ["mask-image-r-to-pos", "mask-image-l-to-pos"],
			"mask-image-x-from-color": ["mask-image-r-from-color", "mask-image-l-from-color"],
			"mask-image-x-to-color": ["mask-image-r-to-color", "mask-image-l-to-color"],
			"mask-image-y-from-pos": ["mask-image-t-from-pos", "mask-image-b-from-pos"],
			"mask-image-y-to-pos": ["mask-image-t-to-pos", "mask-image-b-to-pos"],
			"mask-image-y-from-color": ["mask-image-t-from-color", "mask-image-b-from-color"],
			"mask-image-y-to-color": ["mask-image-t-to-color", "mask-image-b-to-color"],
			translate: [
				"translate-x",
				"translate-y",
				"translate-none"
			],
			"translate-none": [
				"translate",
				"translate-x",
				"translate-y",
				"translate-z"
			],
			"scroll-m": [
				"scroll-mx",
				"scroll-my",
				"scroll-ms",
				"scroll-me",
				"scroll-mbs",
				"scroll-mbe",
				"scroll-mt",
				"scroll-mr",
				"scroll-mb",
				"scroll-ml"
			],
			"scroll-mx": [
				"scroll-ms",
				"scroll-me",
				"scroll-mr",
				"scroll-ml"
			],
			"scroll-my": [
				"scroll-mbs",
				"scroll-mbe",
				"scroll-mt",
				"scroll-mb"
			],
			"scroll-p": [
				"scroll-px",
				"scroll-py",
				"scroll-ps",
				"scroll-pe",
				"scroll-pbs",
				"scroll-pbe",
				"scroll-pt",
				"scroll-pr",
				"scroll-pb",
				"scroll-pl"
			],
			"scroll-px": [
				"scroll-ps",
				"scroll-pe",
				"scroll-pr",
				"scroll-pl"
			],
			"scroll-py": [
				"scroll-pbs",
				"scroll-pbe",
				"scroll-pt",
				"scroll-pb"
			],
			touch: [
				"touch-x",
				"touch-y",
				"touch-pz"
			],
			"touch-x": ["touch"],
			"touch-y": ["touch"],
			"touch-pz": ["touch"]
		},
		conflictingClassGroupModifiers: { "font-size": ["leading"] },
		postfixLookupClassGroups: ["container-type"],
		orderSensitiveModifiers: [
			"*",
			"**",
			"after",
			"backdrop",
			"before",
			"details-content",
			"file",
			"first-letter",
			"first-line",
			"marker",
			"placeholder",
			"selection"
		]
	};
});
// src/lib/utils.ts
function un(...e) {
	return ln(I(e));
}
// node_modules/@radix-ui/react-compose-refs/dist/index.mjs
var dn = Object.defineProperty, fn = (e, t) => dn(e, "name", {
	value: t,
	configurable: !0
});
function pn(e, t) {
	if (typeof e == "function") return e(t);
	e != null && (e.current = t);
}
fn(pn, "setRef");
function mn(...e) {
	return (t) => {
		let n = !1, r = e.map((e) => {
			let r = pn(e, t);
			return !n && typeof r == "function" && (n = !0), r;
		});
		if (n) return () => {
			for (let t = 0; t < r.length; t++) {
				let n = r[t];
				typeof n == "function" ? n() : pn(e[t], null);
			}
		};
	};
}
fn(mn, "composeRefs");
function hn(...e) {
	return v.useCallback(mn(...e), e);
}
fn(hn, "useComposedRefs");
// node_modules/@radix-ui/react-slot/dist/index.mjs
var gn = Object.defineProperty, _n = (e, t) => gn(e, "name", {
	value: t,
	configurable: !0
});
// @__NO_SIDE_EFFECTS__
function vn(e) {
	let t = v.forwardRef((t, n) => {
		let { children: r, ...i } = t, a = null, o = !1, s = [];
		r = kn(r), v.Children.forEach(r, (e) => {
			if (Tn(e)) {
				o = !0;
				let t = e, n = "child" in t.props ? t.props.child : t.props.children;
				for (; Dn(n) && typeof Nn == "function";) n = Nn(n._payload);
				a = Sn(t, n), s.push(a?.props?.children);
			} else s.push(e);
		}), a ? a = v.cloneElement(a, void 0, s) : !o && v.Children.count(r) === 1 && v.isValidElement(r) && (a = r);
		let c = a ? wn(a) : void 0, l = hn(n, c);
		if (!a) {
			if (r || r === 0) throw Error(o ? Mn(e) : jn(e));
			return r;
		}
		let u = Cn(i, a.props ?? {});
		return a.type !== v.Fragment && (u.ref = n ? l : c), v.cloneElement(a, u);
	});
	return t.displayName = `${e}.Slot`, t;
}
_n(vn, "createSlot");
var yn = /* @__PURE__ */ vn("Slot"), bn = Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function xn(e) {
	let t = /* @__PURE__ */ _n((e) => "child" in e ? e.children(e.child) : e.children, "Slottable");
	return t.displayName = `${e}.Slottable`, t.__radixId = bn, t;
}
_n(xn, "createSlottable");
var Sn = /* @__PURE__ */ _n((e, t) => "child" in e.props ? v.isValidElement(t) ? v.cloneElement(t, void 0, e.props.children(t.props.children)) : null : v.isValidElement(t) ? t : null, "getSlottableElementFromSlottable");
function Cn(e, t) {
	let n = { ...t };
	for (let r in t) {
		let i = e[r], a = t[r];
		/^on[A-Z]/.test(r) ? i && a ? n[r] = (...e) => {
			let t = a(...e);
			return i(...e), t;
		} : i && (n[r] = i) : r === "style" ? n[r] = {
			...i,
			...a
		} : r === "className" ? n[r] = [i, a].filter(Boolean).join(" ") : r === "aria-describedby" && (n[r] = An(a, i));
	}
	return {
		...e,
		...n
	};
}
_n(Cn, "mergeProps");
function wn(e) {
	let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, n = t && "isReactWarning" in t && t.isReactWarning;
	return n ? e.ref : (t = Object.getOwnPropertyDescriptor(e, "ref")?.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
_n(wn, "getElementRef");
function Tn(e) {
	return v.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === bn;
}
_n(Tn, "isSlottable");
var En = Symbol.for("react.lazy");
function Dn(e) {
	return typeof e == "object" && !!e && "$$typeof" in e && e.$$typeof === En && "_payload" in e && On(e._payload);
}
_n(Dn, "isLazyComponent");
function On(e) {
	return typeof e == "object" && !!e && "then" in e;
}
_n(On, "isPromiseLike");
function kn(e) {
	let t = e;
	for (; Dn(t) && typeof Nn == "function";) t = Nn(t._payload);
	return t;
}
_n(kn, "useUnwrappedLazy");
function An(...e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) if (typeof n == "string") for (let e of String(n).trim().split(/\s+/)) e && t.add(e);
	return t.size > 0 ? Array.from(t).join(" ") : void 0;
}
_n(An, "concatAriaDescribedby");
var jn = /* @__PURE__ */ _n((e) => `${e} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, "createSlotError"), Mn = /* @__PURE__ */ _n((e) => `${e} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, "createSlottableError"), Nn = v.use, Pn = /* @__PURE__ */ l(h(), 1), Fn = Object.defineProperty, In = (e, t) => Fn(e, "name", {
	value: t,
	configurable: !0
}), Ln = [
	"a",
	"button",
	"div",
	"form",
	"h2",
	"h3",
	"img",
	"input",
	"label",
	"li",
	"nav",
	"ol",
	"p",
	"select",
	"span",
	"svg",
	"ul"
].reduce((e, t) => {
	let n = /* @__PURE__ */ vn(`Primitive.${t}`), r = v.forwardRef((e, r) => {
		let { asChild: i, ...a } = e, o = i ? n : t;
		return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ (0, F.jsx)(o, {
			...a,
			ref: r
		});
	});
	return r.displayName = `Primitive.${t}`, {
		...e,
		[t]: r
	};
}, {});
function Rn(e, t) {
	e && Pn.flushSync(() => e.dispatchEvent(t));
}
In(Rn, "dispatchDiscreteCustomEvent");
// node_modules/@radix-ui/react-context/dist/index.mjs
var zn = Object.defineProperty, Bn = (e, t) => zn(e, "name", {
	value: t,
	configurable: !0
});
// @__NO_SIDE_EFFECTS__
function Vn(e, t) {
	let n = v.createContext(t);
	n.displayName = e + "Context";
	let r = /* @__PURE__ */ Bn((e) => {
		let { children: t, ...r } = e, i = v.useMemo(() => r, Object.values(r));
		return /* @__PURE__ */ (0, F.jsx)(n.Provider, {
			value: i,
			children: t
		});
	}, "Provider");
	r.displayName = e + "Provider";
	function i(r, i = {}) {
		let { optional: a = !1 } = i, o = v.useContext(n);
		if (o) return o;
		if (t !== void 0) return t;
		if (!a) throw Error(`\`${r}\` must be used within \`${e}\``);
	}
	return Bn(i, "useContext"), [r, i];
}
Bn(Vn, "createContext");
// @__NO_SIDE_EFFECTS__
function Hn(e, t = []) {
	let n = [];
	function r(t, r) {
		let i = v.createContext(r);
		i.displayName = t + "Context";
		let a = n.length;
		n = [...n, r];
		let o = /* @__PURE__ */ Bn((t) => {
			let { scope: n, children: r, ...o } = t, s = n?.[e]?.[a] || i, c = v.useMemo(() => o, Object.values(o));
			return /* @__PURE__ */ (0, F.jsx)(s.Provider, {
				value: c,
				children: r
			});
		}, "Provider");
		o.displayName = t + "Provider";
		function s(n, o, s = {}) {
			let { optional: c = !1 } = s, l = o?.[e]?.[a] || i, u = v.useContext(l);
			if (u) return u;
			if (r !== void 0) return r;
			if (!c) throw Error(`\`${n}\` must be used within \`${t}\``);
		}
		return Bn(s, "useContext"), [o, s];
	}
	Bn(r, "createContext");
	let i = /* @__PURE__ */ Bn(() => {
		let t = n.map((e) => v.createContext(e));
		return /* @__PURE__ */ Bn(function(n) {
			let r = n?.[e] || t;
			return v.useMemo(() => ({ [`__scope${e}`]: {
				...n,
				[e]: r
			} }), [n, r]);
		}, "useScope");
	}, "createScope");
	return i.scopeName = e, [r, Un(i, ...t)];
}
Bn(Hn, "createContextScope");
function Un(...e) {
	let t = e[0];
	if (e.length === 1) return t;
	let n = /* @__PURE__ */ Bn(() => {
		let n = e.map((e) => ({
			useScope: e(),
			scopeName: e.scopeName
		}));
		return /* @__PURE__ */ Bn(function(e) {
			let r = n.reduce((t, { useScope: n, scopeName: r }) => {
				let i = n(e)[`__scope${r}`];
				return {
					...t,
					...i
				};
			}, {});
			return v.useMemo(() => ({ [`__scope${t.scopeName}`]: r }), [r]);
		}, "useComposedScopes");
	}, "createScope");
	return n.scopeName = t.scopeName, n;
}
Bn(Un, "composeContextScopes");
// node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs
var Wn = globalThis?.document ? v.useLayoutEffect : () => {}, Gn = Object.defineProperty, Kn = (e, t) => Gn(e, "name", {
	value: t,
	configurable: !0
});
// @__NO_SIDE_EFFECTS__
function qn(e) {
	let t = e + "CollectionProvider", [n, r] = /* @__PURE__ */ Hn(t), [i, a] = n(t, {
		collectionRef: { current: null },
		itemMap: /* @__PURE__ */ new Map()
	}), o = /* @__PURE__ */ Kn((e) => {
		let { scope: t, children: n } = e, r = v.useRef(null), a = v.useRef(/* @__PURE__ */ new Map()).current;
		return /* @__PURE__ */ (0, F.jsx)(i, {
			scope: t,
			itemMap: a,
			collectionRef: r,
			children: n
		});
	}, "CollectionProvider");
	o.displayName = t;
	let s = e + "CollectionSlot", c = /* @__PURE__ */ vn(s), l = v.forwardRef((e, t) => {
		let { scope: n, children: r } = e, i = hn(t, a(s, n).collectionRef);
		return /* @__PURE__ */ (0, F.jsx)(c, {
			ref: i,
			children: r
		});
	});
	l.displayName = s;
	let u = e + "CollectionItemSlot", d = "data-radix-collection-item", f = /* @__PURE__ */ vn(u), p = v.forwardRef((e, t) => {
		let { scope: n, children: r, ...i } = e, o = v.useRef(null), s = hn(t, o), c = a(u, n);
		return v.useEffect(() => (c.itemMap.set(o, {
			ref: o,
			...i
		}), () => void c.itemMap.delete(o))), /* @__PURE__ */ (0, F.jsx)(f, {
			[d]: "",
			ref: s,
			children: r
		});
	});
	p.displayName = u;
	function m(t) {
		let n = a(e + "CollectionConsumer", t);
		return v.useCallback(() => {
			let e = n.collectionRef.current;
			if (!e) return [];
			let t = Array.from(e.querySelectorAll(`[${d}]`));
			return Array.from(n.itemMap.values()).sort((e, n) => t.indexOf(e.ref.current) - t.indexOf(n.ref.current));
		}, [n.collectionRef, n.itemMap]);
	}
	return Kn(m, "useCollection"), [
		{
			Provider: o,
			Slot: l,
			ItemSlot: p
		},
		m,
		r
	];
}
Kn(qn, "createCollection");
var Jn = /* @__PURE__ */ new WeakMap(), Yn = class e extends Map {
	static {
		Kn(this, "OrderedDict");
	}
	#e;
	constructor(e) {
		super(e), this.#e = [...super.keys()], Jn.set(this, !0);
	}
	set(e, t) {
		return Jn.get(this) && !this.has(e) && this.#e.push(e), super.set(e, t), this;
	}
	insert(e, t, n) {
		let r = this.has(t), i = r ? this.size : this.size + 1, a = Qn(e), o = a >= 0 ? Math.min(a, i - 1) : Math.max(i + a, 0);
		if (r ? this.#e.indexOf(t) === o : o === this.size) return this.set(t, n), this;
		let s = this.#e.filter((e) => e !== t);
		s.splice(o, 0, t);
		let c = s.map((e) => [e, e === t ? n : this.get(e)]);
		this.clear();
		for (let [e, t] of c) this.set(e, t);
		return this;
	}
	with(t, n, r) {
		let i = new e(this);
		return i.insert(t, n, r), i;
	}
	before(e) {
		let t = this.#e.indexOf(e) - 1;
		if (!(t < 0)) return this.entryAt(t);
	}
	setBefore(e, t, n) {
		let r = this.#e.indexOf(e);
		if (r === -1) return this;
		let i = this.#e.indexOf(t), a = i !== -1 && i < r ? r - 1 : r;
		return this.insert(a, t, n);
	}
	after(e) {
		let t = this.#e.indexOf(e);
		if (t = t === -1 || t === this.size - 1 ? -1 : t + 1, t !== -1) return this.entryAt(t);
	}
	setAfter(e, t, n) {
		let r = this.#e.indexOf(e);
		if (r === -1) return this;
		let i = this.#e.indexOf(t), a = i !== -1 && i <= r ? r : r + 1;
		return this.insert(a, t, n);
	}
	first() {
		return this.entryAt(0);
	}
	last() {
		return this.entryAt(-1);
	}
	clear() {
		return this.#e = [], super.clear();
	}
	delete(e) {
		let t = super.delete(e);
		return t && this.#e.splice(this.#e.indexOf(e), 1), t;
	}
	deleteAt(e) {
		let t = this.keyAt(e);
		return t !== void 0 && this.delete(t);
	}
	at(e) {
		let t = Xn(this.#e, e);
		if (t !== void 0) return this.get(t);
	}
	entryAt(e) {
		let t = Xn(this.#e, e);
		if (t !== void 0) return [t, this.get(t)];
	}
	indexOf(e) {
		return this.#e.indexOf(e);
	}
	keyAt(e) {
		return Xn(this.#e, e);
	}
	from(e, t) {
		let n = this.indexOf(e);
		if (n === -1) return;
		let r = n + t;
		return r < 0 && (r = 0), r >= this.size && (r = this.size - 1), this.at(r);
	}
	keyFrom(e, t) {
		let n = this.indexOf(e);
		if (n === -1) return;
		let r = n + t;
		return r < 0 && (r = 0), r >= this.size && (r = this.size - 1), this.keyAt(r);
	}
	find(e, t) {
		let n = 0;
		for (let r of this) {
			if (Reflect.apply(e, t, [
				r,
				n,
				this
			])) return r;
			n++;
		}
	}
	findIndex(e, t) {
		let n = 0;
		for (let r of this) {
			if (Reflect.apply(e, t, [
				r,
				n,
				this
			])) return n;
			n++;
		}
		return -1;
	}
	filter(t, n) {
		let r = [], i = 0;
		for (let e of this) Reflect.apply(t, n, [
			e,
			i,
			this
		]) && r.push(e), i++;
		return new e(r);
	}
	map(t, n) {
		let r = [], i = 0;
		for (let e of this) r.push([e[0], Reflect.apply(t, n, [
			e,
			i,
			this
		])]), i++;
		return new e(r);
	}
	reduce(...e) {
		let [t, n] = e, r = e.length > 1;
		if (!r && this.size === 0) throw TypeError("Reduce of empty OrderedDict with no initial value");
		let i = 0, a = n;
		for (let e of this) a = i === 0 && !r ? e : Reflect.apply(t, this, [
			a,
			e,
			i,
			this
		]), i++;
		return a;
	}
	reduceRight(...e) {
		let [t, n] = e, r = e.length > 1;
		if (!r && this.size === 0) throw TypeError("Reduce of empty OrderedDict with no initial value");
		let i = n;
		for (let e = this.size - 1; e >= 0; e--) {
			let n = this.entryAt(e);
			i = e === this.size - 1 && !r ? n : Reflect.apply(t, this, [
				i,
				n,
				e,
				this
			]);
		}
		return i;
	}
	sort(e) {
		if (typeof e != "function") throw TypeError("OrderedDict.sort requires a compare function");
		let t = [...this.entries()].sort(e);
		this.clear();
		for (let [e, n] of t) this.set(e, n);
		return this;
	}
	toSorted(t) {
		if (typeof t != "function") throw TypeError("OrderedDict.toSorted requires a compare function");
		let n = [...this.entries()].sort(t);
		return new e(n);
	}
	toReversed() {
		let t = new e();
		for (let e = this.size - 1; e >= 0; e--) {
			let n = this.keyAt(e), r = this.get(n);
			t.set(n, r);
		}
		return t;
	}
	toSpliced(...t) {
		let n = [...this.entries()];
		return n.splice(...t), new e(n);
	}
	slice(t, n) {
		let r = new e();
		for (let e of this.#e.slice(t, n)) r.set(e, this.get(e));
		return r;
	}
	every(e, t) {
		let n = 0;
		for (let r of this) {
			if (!Reflect.apply(e, t, [
				r,
				n,
				this
			])) return !1;
			n++;
		}
		return !0;
	}
	some(e, t) {
		let n = 0;
		for (let r of this) {
			if (Reflect.apply(e, t, [
				r,
				n,
				this
			])) return !0;
			n++;
		}
		return !1;
	}
};
function Xn(e, t) {
	if ("at" in Array.prototype) return Array.prototype.at.call(e, t);
	let n = Zn(e, t);
	return n === -1 ? void 0 : e[n];
}
Kn(Xn, "at");
function Zn(e, t) {
	let n = e.length, r = Qn(t), i = r >= 0 ? r : n + r;
	return i < 0 || i >= n ? -1 : i;
}
Kn(Zn, "toSafeIndex");
function Qn(e) {
	return e !== e || e === 0 ? 0 : Math.trunc(e);
}
Kn(Qn, "toSafeInteger");
// @__NO_SIDE_EFFECTS__
function $n(e) {
	let t = e + "CollectionProvider", [n, r] = /* @__PURE__ */ Hn(t), [i, a] = n(t);
	i.displayName = e + "CollectionStableContextProvider";
	let [o, s] = n(t);
	o.displayName = e + "CollectionStatefulContextProvider";
	let c = /* @__PURE__ */ Kn(({ state: e, ...t }) => e ? /* @__PURE__ */ (0, F.jsx)(u, {
		...t,
		state: e
	}) : /* @__PURE__ */ (0, F.jsx)(l, { ...t }), "CollectionProvider");
	c.displayName = t;
	let l = /* @__PURE__ */ Kn((e) => {
		let t = _();
		return /* @__PURE__ */ (0, F.jsx)(u, {
			...e,
			state: t
		});
	}, "CollectionInit");
	l.displayName = e + "CollectionInit";
	let u = /* @__PURE__ */ Kn((e) => {
		let { scope: t, children: n, state: r } = e, a = v.useRef(null), [s, c] = v.useState(null), l = hn(a, c), [u, d] = r, f = v.useRef(new Yn()), p = v.useCallback(() => {
			let e = f.current;
			return nr(e) || e.sort(rr), e;
		}, []);
		return v.useEffect(() => {
			if (!s) return;
			let e = ir(() => {
				d((e) => {
					let t = e.toSorted(rr);
					return t.some(([t], n) => e.keyAt(n) !== t) ? t : e;
				});
			});
			return e.observe(s, {
				childList: !0,
				subtree: !0
			}), () => {
				e.disconnect();
			};
		}, [s, d]), /* @__PURE__ */ (0, F.jsx)(i, {
			scope: t,
			collectionElementRef: l,
			collectionElementRefObject: a,
			getCollection: p,
			setCollection: d,
			registryRef: f,
			children: /* @__PURE__ */ (0, F.jsx)(o, {
				scope: t,
				collectionElement: s,
				collection: u,
				children: n
			})
		});
	}, "CollectionProviderImpl");
	u.displayName = e + "CollectionProviderImpl";
	let d = e + "CollectionSlot", f = /* @__PURE__ */ vn(d), p = v.forwardRef((e, t) => {
		let { scope: n, children: r } = e, i = hn(t, a(d, n).collectionElementRef);
		return /* @__PURE__ */ (0, F.jsx)(f, {
			ref: i,
			children: r
		});
	});
	p.displayName = d;
	let m = e + "CollectionItemSlot", h = /* @__PURE__ */ vn(m), g = v.forwardRef((e, t) => {
		let { scope: n, children: r, ...i } = e, o = v.useRef(null), { setCollection: s, registryRef: c } = a(m, n), l = v.useRef(i);
		er(l.current, i) || (l.current = i);
		let u = l.current, d = hn(t, v.useCallback((e) => {
			let t = c.current;
			e ? t.set(e, {
				...l.current,
				element: e
			}) : o.current && t.delete(o.current);
		}, [c]), o);
		Wn(() => {
			let e = o.current, t = c.current;
			e && t.has(e) && t.set(e, {
				...u,
				element: e
			});
		}, [u, c]);
		let f = v.useRef(null);
		return v.useEffect(() => {
			let e = o.current, t = f.current;
			((t?.element ?? null) !== e || e && t?.itemData !== u) && (f.current = e ? {
				element: e,
				itemData: u
			} : null, s((n) => {
				let r = new Yn(n);
				return t && t.element !== e && r.delete(t.element), e && r.set(e, {
					...u,
					element: e
				}), r.sort(rr);
			}));
		}), v.useEffect(() => () => {
			let e = f.current;
			f.current = null, e && s((t) => {
				if (!t.has(e.element)) return t;
				let n = new Yn(t);
				return n.delete(e.element), n;
			});
		}, [s]), /* @__PURE__ */ (0, F.jsx)(h, {
			"data-radix-collection-item": "",
			ref: d,
			children: r
		});
	});
	g.displayName = m;
	function _() {
		return v.useState(new Yn());
	}
	Kn(_, "useInitCollection");
	function y(t) {
		let { collection: n } = s(e + "CollectionConsumer", t);
		return n;
	}
	Kn(y, "useCollection");
	function b(t) {
		let { getCollection: n } = a(e + "CollectionConsumer", t);
		return n;
	}
	return Kn(b, "useGetCollection"), [{
		Provider: c,
		Slot: p,
		ItemSlot: g
	}, {
		createCollectionScope: r,
		useCollection: y,
		useGetCollection: b,
		useInitCollection: _
	}];
}
Kn($n, "createCollection");
function er(e, t) {
	if (e === t) return !0;
	if (typeof e != "object" || typeof t != "object" || e == null || t == null) return !1;
	let n = Object.keys(e), r = Object.keys(t);
	if (n.length !== r.length) return !1;
	for (let r of n) if (!Object.prototype.hasOwnProperty.call(t, r) || e[r] !== t[r]) return !1;
	return !0;
}
Kn(er, "shallowEqual");
function tr(e, t) {
	return !!(t.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_PRECEDING);
}
Kn(tr, "isElementPreceding");
function nr(e) {
	let t;
	for (let n of e.keys()) {
		if (t) {
			let e = t.compareDocumentPosition(n);
			if (!(e & Node.DOCUMENT_POSITION_DISCONNECTED) && e & Node.DOCUMENT_POSITION_PRECEDING) return !1;
		}
		t = n;
	}
	return !0;
}
Kn(nr, "isInDocumentOrder");
function rr(e, t) {
	return !e[1].element || !t[1].element ? 0 : tr(e[1].element, t[1].element) ? -1 : 1;
}
Kn(rr, "sortByDocumentPosition");
function ir(e) {
	return new MutationObserver((t) => {
		for (let n of t) if (n.type === "childList") {
			e();
			return;
		}
	});
}
Kn(ir, "getChildListObserver");
// node_modules/@radix-ui/primitive/dist/index.mjs
var ar = Object.defineProperty, or = (e, t) => ar(e, "name", {
	value: t,
	configurable: !0
}), sr = !!(typeof window < "u" && window.document && window.document.createElement);
function cr(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
	return /* @__PURE__ */ or(function(r) {
		if (e?.(r), n === !1 || !r || !r.defaultPrevented) return t?.(r);
	}, "handleEvent");
}
or(cr, "composeEventHandlers");
function lr(e) {
	if (!sr) throw Error("Cannot access window outside of the DOM");
	return e?.ownerDocument?.defaultView ?? window;
}
or(lr, "getOwnerWindow");
function ur(e) {
	if (!sr) throw Error("Cannot access document outside of the DOM");
	return e?.ownerDocument ?? document;
}
or(ur, "getOwnerDocument");
function dr(e, t = !1) {
	let { activeElement: n } = ur(e);
	if (!n?.nodeName) return null;
	if (fr(n) && n.contentDocument) return dr(n.contentDocument.body, t);
	if (t) {
		let e = n.getAttribute("aria-activedescendant");
		if (e) {
			let t = ur(n).getElementById(e);
			if (t) return t;
		}
	}
	return n;
}
or(dr, "getActiveElement");
function fr(e) {
	return e.tagName === "IFRAME";
}
or(fr, "isFrame");
// node_modules/@radix-ui/react-use-effect-event/dist/index.mjs
var pr = Object.defineProperty, mr = (e, t) => pr(e, "name", {
	value: t,
	configurable: !0
}), hr = v.useEffectEvent, gr = v.useInsertionEffect;
function _r(e) {
	if (typeof hr == "function") return hr(e);
	let t = v.useRef(() => {
		throw Error("Cannot call an event handler while rendering.");
	});
	return typeof gr == "function" ? gr(() => {
		t.current = e;
	}) : Wn(() => {
		t.current = e;
	}), v.useMemo(() => ((...e) => t.current?.(...e)), []);
}
mr(_r, "useEffectEvent");
// node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs
var vr = Object.defineProperty, yr = (e, t) => vr(e, "name", {
	value: t,
	configurable: !0
}), br = v.useInsertionEffect || Wn;
function xr({ prop: e, defaultProp: t, onChange: n = /* @__PURE__ */ yr(() => {}, "onChange"), caller: r }) {
	let [i, a, o] = Sr({
		defaultProp: t,
		onChange: n
	}), s = e !== void 0;
	return [s ? e : i, v.useCallback((t) => {
		if (s) {
			let n = Cr(t) ? t(e) : t;
			n !== e && o.current?.(n);
		} else a(t);
	}, [
		s,
		e,
		a,
		o
	])];
}
yr(xr, "useControllableState");
function Sr({ defaultProp: e, onChange: t }) {
	let [n, r] = v.useState(e), i = v.useRef(n), a = v.useRef(t);
	return br(() => {
		a.current = t;
	}, [t]), v.useEffect(() => {
		i.current !== n && (a.current?.(n), i.current = n);
	}, [n, i]), [
		n,
		r,
		a
	];
}
yr(Sr, "useUncontrolledState");
function Cr(e) {
	return typeof e == "function";
}
yr(Cr, "isFunction");
var wr = Symbol("RADIX:SYNC_STATE");
function Tr(e, t, n, r) {
	let { prop: i, defaultProp: a, onChange: o, caller: s } = t, c = i !== void 0, l = _r(o), u = [{
		...n,
		state: a
	}];
	r && u.push(r);
	let [d, f] = v.useReducer((t, n) => {
		if (n.type === wr) return {
			...t,
			state: n.state
		};
		let r = e(t, n);
		return c && !Object.is(r.state, t.state) && l(r.state), r;
	}, ...u), p = d.state, m = v.useRef(p);
	v.useEffect(() => {
		m.current !== p && (m.current = p, c || l(p));
	}, [
		p,
		m,
		c
	]);
	let h = v.useMemo(() => i === void 0 ? d : {
		...d,
		state: i
	}, [d, i]);
	return v.useEffect(() => {
		c && !Object.is(i, d.state) && f({
			type: wr,
			state: i
		});
	}, [
		i,
		d.state,
		c
	]), [h, f];
}
yr(Tr, "useControllableStateReducer");
// node_modules/@radix-ui/react-id/dist/index.mjs
var Er = Object.defineProperty, Dr = (e, t) => Er(e, "name", {
	value: t,
	configurable: !0
}), Or = v.useId || (() => void 0), kr = 0;
function Ar(e) {
	let [t, n] = v.useState(Or());
	return Wn(() => {
		e || n((e) => e ?? String(kr++));
	}, [e]), e || (t ? `radix-${t}` : "");
}
Dr(Ar, "useId");
// node_modules/@radix-ui/react-direction/dist/index.mjs
var jr = Object.defineProperty, Mr = (e, t) => jr(e, "name", {
	value: t,
	configurable: !0
}), Nr = {
	LTR: "ltr",
	RTL: "rtl"
}, Pr = v.createContext(void 0);
function Fr(e) {
	let t = v.useContext(Pr);
	return e || t || Nr.LTR;
}
Mr(Fr, "useDirection");
// node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs
var Ir = Object.defineProperty, Lr = (e, t) => Ir(e, "name", {
	value: t,
	configurable: !0
}), Rr = v.useInsertionEffect;
function zr(e) {
	let t = v.useRef(e);
	return typeof Rr == "function" ? Rr(() => {
		t.current = e;
	}) : Wn(() => {
		t.current = e;
	}), v.useMemo(() => ((...e) => t.current?.(...e)), []);
}
Lr(zr, "useCallbackRef");
// node_modules/@radix-ui/react-use-is-hydrated/dist/index.mjs
var Br = Object.defineProperty, Vr = (e, t) => Br(e, "name", {
	value: t,
	configurable: !0
}), Hr = !1;
function Ur() {
	let [e, t] = v.useState(Hr);
	return v.useEffect(() => {
		Hr || (Hr = !0, t(!0));
	}, []), e;
}
Vr(Ur, "useIsHydrated");
var Wr = v.useSyncExternalStore;
function Gr() {
	return () => {};
}
Vr(Gr, "subscribe");
function Kr() {
	return Wr(Gr, () => !0, () => !1);
}
Vr(Kr, "useIsHydratedModern");
var qr = typeof Wr == "function" ? Kr : Ur, Jr = Object.defineProperty, Yr = (e, t) => Jr(e, "name", {
	value: t,
	configurable: !0
}), Xr = "rovingFocusGroup.onEntryFocus", Zr = {
	bubbles: !1,
	cancelable: !0
}, Qr = "RovingFocusGroup", [$r, ei, ti] = /* @__PURE__ */ qn(Qr), [ni, ri] = /* @__PURE__ */ Hn(Qr, [ti]), ii = {
	Vertical: "vertical",
	Horizontal: "horizontal"
}, ai = {
	LTR: "ltr",
	RTL: "rtl"
}, [oi, si] = ni(Qr), ci = /* @__PURE__ */ v.forwardRef(/* @__PURE__ */ Yr(function(e, t) {
	return /* @__PURE__ */ (0, F.jsx)($r.Provider, {
		scope: e.__scopeRovingFocusGroup,
		children: /* @__PURE__ */ (0, F.jsx)($r.Slot, {
			scope: e.__scopeRovingFocusGroup,
			children: /* @__PURE__ */ (0, F.jsx)(li, {
				...e,
				ref: t
			})
		})
	});
}, "RovingFocusGroup")), li = /* @__PURE__ */ v.forwardRef(/* @__PURE__ */ Yr(function(e, t) {
	let { __scopeRovingFocusGroup: n, orientation: r, loop: i = !1, dir: a, currentTabStopId: o, defaultCurrentTabStopId: s, onCurrentTabStopIdChange: c, onEntryFocus: l, preventScrollOnEntryFocus: u = !1, ...d } = e, f = v.useRef(null), p = hn(t, f), m = Fr(a), [h, g] = xr({
		prop: o,
		defaultProp: s ?? null,
		onChange: c,
		caller: Qr
	}), [_, y] = v.useState(!1), b = zr(l), x = ei(n), S = v.useRef(!1), [C, w] = v.useState(0);
	return v.useEffect(() => {
		let e = f.current;
		if (e) return e.addEventListener(Xr, b), () => e.removeEventListener(Xr, b);
	}, [b]), /* @__PURE__ */ (0, F.jsx)(oi, {
		scope: n,
		orientation: r,
		dir: m,
		loop: i,
		currentTabStopId: h,
		onItemFocus: v.useCallback((e) => g(e), [g]),
		onItemShiftTab: v.useCallback(() => y(!0), []),
		onFocusableItemAdd: v.useCallback(() => w((e) => e + 1), []),
		onFocusableItemRemove: v.useCallback(() => w((e) => e - 1), []),
		children: /* @__PURE__ */ (0, F.jsx)(Ln.div, {
			tabIndex: _ || C === 0 ? -1 : 0,
			"data-orientation": r,
			...d,
			ref: p,
			style: {
				outline: "none",
				...e.style
			},
			onMouseDown: cr(e.onMouseDown, () => {
				S.current = !0;
			}),
			onFocus: cr(e.onFocus, (e) => {
				let t = !S.current;
				if (e.target === e.currentTarget && t && !_) {
					let t = new CustomEvent(Xr, Zr);
					if (e.currentTarget.dispatchEvent(t), !t.defaultPrevented) {
						let e = x().filter((e) => e.focusable);
						hi([
							e.find((e) => e.active),
							e.find((e) => e.id === h),
							...e
						].filter(Boolean).map((e) => e.ref.current), u);
					}
				}
				S.current = !1;
			}),
			onBlur: cr(e.onBlur, () => y(!1))
		})
	});
}, "RovingFocusGroupImpl")), ui = "RovingFocusGroupItem", di = /* @__PURE__ */ v.forwardRef(/* @__PURE__ */ Yr(function(e, t) {
	let { __scopeRovingFocusGroup: n, focusable: r = !0, active: i = !1, tabStopId: a, children: o, ...s } = e, c = Ar(), l = a || c, u = si(ui, n), d = u.currentTabStopId === l, f = ei(n), { onFocusableItemAdd: p, onFocusableItemRemove: m, currentTabStopId: h } = u, g = qr();
	return Wn(() => {
		if (g && r) return p(), () => m();
	}, [
		g,
		r,
		p,
		m
	]), v.useEffect(() => {
		if (!g && r) return p(), () => m();
	}, [
		g,
		r,
		p,
		m
	]), /* @__PURE__ */ (0, F.jsx)($r.ItemSlot, {
		scope: n,
		id: l,
		focusable: r,
		active: i,
		children: /* @__PURE__ */ (0, F.jsx)(Ln.span, {
			tabIndex: d ? 0 : -1,
			"data-orientation": u.orientation,
			...s,
			ref: t,
			onMouseDown: cr(e.onMouseDown, (e) => {
				r ? u.onItemFocus(l) : e.preventDefault();
			}),
			onFocus: cr(e.onFocus, () => u.onItemFocus(l)),
			onKeyDown: cr(e.onKeyDown, (e) => {
				if (e.key === "Tab" && e.shiftKey) {
					u.onItemShiftTab();
					return;
				}
				if (e.target !== e.currentTarget) return;
				let t = mi(e, u.orientation, u.dir);
				if (t !== void 0) {
					if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
					e.preventDefault();
					let n = f().filter((e) => e.focusable).map((e) => e.ref.current);
					if (t === "last") n.reverse();
					else if (t === "prev" || t === "next") {
						t === "prev" && n.reverse();
						let r = n.indexOf(e.currentTarget);
						n = u.loop ? gi(n, r + 1) : n.slice(r + 1);
					}
					setTimeout(() => hi(n));
				}
			}),
			children: typeof o == "function" ? o({
				isCurrentTabStop: d,
				hasTabStop: h != null
			}) : o
		})
	});
}, "RovingFocusGroupItem")), fi = {
	ArrowLeft: "prev",
	ArrowUp: "prev",
	ArrowRight: "next",
	ArrowDown: "next",
	PageUp: "first",
	Home: "first",
	PageDown: "last",
	End: "last"
};
function pi(e, t) {
	return t === ai.RTL ? e === "ArrowLeft" ? "ArrowRight" : e === "ArrowRight" ? "ArrowLeft" : e : e;
}
Yr(pi, "getDirectionAwareKey");
function mi(e, t, n) {
	let r = pi(e.key, n);
	if (!(t === ii.Vertical && ["ArrowLeft", "ArrowRight"].includes(r)) && !(t === ii.Horizontal && ["ArrowUp", "ArrowDown"].includes(r))) return fi[r];
}
Yr(mi, "getFocusIntent");
function hi(e, t = !1) {
	let n = document.activeElement;
	for (let r of e) if (r === n || (r.focus({ preventScroll: t }), document.activeElement !== n)) return;
}
Yr(hi, "focusFirst");
function gi(e, t) {
	return e.map((n, r) => e[(t + r) % e.length]);
}
Yr(gi, "wrapArray");
// node_modules/@radix-ui/react-tabs/dist/index.mjs
var _i = Object.defineProperty, vi = (e, t) => _i(e, "name", {
	value: t,
	configurable: !0
}), yi = {
	Automatic: "automatic",
	Manual: "manual"
}, bi = "Tabs", [xi, Si] = /* @__PURE__ */ Hn(bi, [ri]), Ci = ri(), [wi, Ti] = xi(bi), Ei = /* @__PURE__ */ v.forwardRef(/* @__PURE__ */ vi(function(e, t) {
	let { __scopeTabs: n, value: r, onValueChange: i, defaultValue: a, orientation: o = "horizontal", dir: s, activationMode: c = yi.Automatic, ...l } = e, u = Fr(s), [d, f] = xr({
		prop: r,
		onChange: i,
		defaultProp: a ?? "",
		caller: bi
	});
	return /* @__PURE__ */ (0, F.jsx)(wi, {
		scope: n,
		baseId: Ar(),
		value: d,
		onValueChange: f,
		orientation: o,
		dir: u,
		activationMode: c,
		children: /* @__PURE__ */ (0, F.jsx)(Ln.div, {
			dir: u,
			"data-orientation": o,
			...l,
			ref: t
		})
	});
}, "Tabs")), Di = "TabsList", Oi = /* @__PURE__ */ v.forwardRef(/* @__PURE__ */ vi(function(e, t) {
	let { __scopeTabs: n, loop: r = !0, ...i } = e, a = Ti(Di, n), o = Ci(n);
	return /* @__PURE__ */ (0, F.jsx)(ci, {
		asChild: !0,
		...o,
		orientation: a.orientation,
		dir: a.dir,
		loop: r,
		children: /* @__PURE__ */ (0, F.jsx)(Ln.div, {
			role: "tablist",
			"aria-orientation": a.orientation,
			...i,
			ref: t
		})
	});
}, "TabsList")), ki = "TabsTrigger", Ai = /* @__PURE__ */ v.forwardRef(/* @__PURE__ */ vi(function(e, t) {
	let { __scopeTabs: n, value: r, disabled: i = !1, ...a } = e, o = Ti(ki, n), s = Ci(n), c = ji(o.baseId, r), l = Mi(o.baseId, r), u = r === o.value;
	return /* @__PURE__ */ (0, F.jsx)(di, {
		asChild: !0,
		...s,
		focusable: !i,
		active: u,
		children: /* @__PURE__ */ (0, F.jsx)(Ln.button, {
			type: "button",
			role: "tab",
			"aria-selected": u,
			"aria-controls": l,
			"data-state": u ? "active" : "inactive",
			"data-disabled": i ? "" : void 0,
			disabled: i,
			id: c,
			...a,
			ref: t,
			onMouseDown: cr(e.onMouseDown, (e) => {
				!i && e.button === 0 && e.ctrlKey === !1 ? (e.currentTarget.focus(), o.onValueChange(r)) : e.preventDefault();
			}),
			onKeyDown: cr(e.onKeyDown, (e) => {
				i || e.target !== e.currentTarget || [" ", "Enter"].includes(e.key) && o.onValueChange(r);
			}),
			onFocus: cr(e.onFocus, () => {
				let e = o.activationMode !== yi.Manual;
				!u && !i && e && o.onValueChange(r);
			})
		})
	});
}, "TabsTrigger"));
function ji(e, t) {
	return `${e}-trigger-${t}`;
}
vi(ji, "makeTriggerId");
function Mi(e, t) {
	return `${e}-content-${t}`;
}
vi(Mi, "makeContentId");
// src/components/ui/button.tsx
var Ni = Me("inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
			outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2 has-[>svg]:px-3",
			xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
			sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
			lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
			icon: "size-9",
			"icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
			"icon-sm": "size-8",
			"icon-lg": "size-10"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Pi({ className: e, variant: t = "default", size: n = "default", asChild: r = !1, ...i }) {
	let a = r ? yn : "button";
	return /* @__PURE__ */ (0, F.jsx)(a, {
		"data-slot": "button",
		"data-variant": t,
		"data-size": n,
		className: un(Ni({
			variant: t,
			size: n,
			className: e
		})),
		...i
	});
}
// src/components/Controls.tsx
var Fi = (e, t) => `Showing the ${e} devices with the most urgent problems; ${t} more are not shown.`, Ii = "/config/integrations/integration/alarmio_health";
function Li({ sharing: e, preview: t, queued: n, onRunE2E: r }) {
	let [i, a] = (0, v.useState)({ phase: "idle" }), o = (0, v.useRef)(!0), s = (0, v.useRef)(null);
	(0, v.useEffect)(() => (o.current = !0, () => {
		o.current = !1;
	}), []), (0, v.useEffect)(() => {
		(i.phase === "done" || i.phase === "failed") && s.current?.focus();
	}, [i]);
	let c = async () => {
		a({ phase: "running" });
		try {
			let e = await r();
			o.current && a({
				phase: "done",
				result: e
			});
		} catch (e) {
			o.current && a({
				phase: "failed",
				message: (e instanceof Error ? e.message : "Unknown error").replace(/[.\s]+$/, "")
			});
		}
	}, l = i.phase === "running", u = t ? t.devices.length : 0, d = t?.devices_truncated ?? 0, f = e && t ? t.devices.map((e) => e.name) : [];
	return /* @__PURE__ */ (0, F.jsxs)("section", {
		"aria-labelledby": "controls-heading",
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, F.jsx)("h2", {
				id: "controls-heading",
				className: "font-display text-xl font-semibold",
				children: "Controls"
			}),
			/* @__PURE__ */ (0, F.jsxs)("div", {
				className: "flex flex-col items-start gap-3",
				children: [
					/* @__PURE__ */ (0, F.jsx)(Pi, {
						type: "button",
						onClick: () => void c(),
						disabled: l,
						children: l ? "Testing..." : "Run end-to-end test"
					}),
					/* @__PURE__ */ (0, F.jsx)("p", {
						className: "text-sm",
						style: { color: P.textMuted },
						children: "Asks foXaCe to fetch fresh state from Ajax through Alarmio now, and times it. It does not send an alarm event."
					}),
					/* @__PURE__ */ (0, F.jsxs)("div", {
						ref: s,
						tabIndex: -1,
						className: "outline-none",
						"data-testid": "e2e-result",
						children: [i.phase === "done" ? /* @__PURE__ */ (0, F.jsxs)("div", {
							className: "flex flex-col gap-1",
							children: [/* @__PURE__ */ (0, F.jsxs)("div", {
								className: "flex items-start gap-2",
								children: [/* @__PURE__ */ (0, F.jsx)(Oe, {
									status: i.result.status,
									label: !0
								}), /* @__PURE__ */ (0, F.jsxs)("span", { children: [i.result.detail || me[i.result.status], i.result.latency_ms === null ? null : /* @__PURE__ */ (0, F.jsxs)("span", {
									className: "ml-2 font-mono text-sm",
									children: [Math.round(i.result.latency_ms), " ms"]
								})] })]
							}), i.result.cached ? /* @__PURE__ */ (0, F.jsx)("p", {
								className: "text-sm",
								style: { color: P.textMuted },
								children: "Showing a result from the last 30 seconds."
							}) : null]
						}) : null, i.phase === "failed" ? /* @__PURE__ */ (0, F.jsxs)("div", {
							className: "flex items-start gap-2",
							children: [/* @__PURE__ */ (0, F.jsx)(Oe, {
								status: "unknown",
								label: !0
							}), /* @__PURE__ */ (0, F.jsxs)("span", { children: [
								"The test could not run: ",
								i.message,
								". Check that Home Assistant is connected, then try again."
							] })]
						}) : null]
					})
				]
			}),
			n > 0 ? /* @__PURE__ */ (0, F.jsxs)("p", {
				className: "flex items-start gap-2 border-l-4 py-1 pl-3",
				style: { borderColor: xe.degraded },
				"data-testid": "queued-notice",
				children: [/* @__PURE__ */ (0, F.jsx)(ue, {
					"aria-hidden": "true",
					className: "mt-0.5 size-5 shrink-0",
					style: { color: xe.degraded }
				}), /* @__PURE__ */ (0, F.jsxs)("span", { children: [
					"Not reporting to Alarmio. ",
					n,
					" updates waiting."
				] })]
			}) : null,
			/* @__PURE__ */ (0, F.jsxs)("p", {
				className: "text-sm",
				children: [
					"Sharing diagnostics is ",
					/* @__PURE__ */ (0, F.jsx)("strong", { children: e ? "on" : "off" }),
					".",
					" ",
					/* @__PURE__ */ (0, F.jsx)("a", {
						href: Ii,
						className: "underline underline-offset-2 focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:outline-none rounded-sm",
						style: { color: P.text },
						children: "Change this in Settings > Devices & services > Alarmio Health."
					})
				]
			}),
			/* @__PURE__ */ (0, F.jsxs)("details", {
				className: "rounded-lg border px-4 py-3",
				style: { borderColor: P.divider },
				children: [/* @__PURE__ */ (0, F.jsx)("summary", {
					className: "cursor-pointer rounded-sm font-medium focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:outline-none",
					children: "What is sent to Alarmio"
				}), /* @__PURE__ */ (0, F.jsxs)("div", {
					className: "mt-3 flex flex-col gap-3 text-sm",
					children: [
						/* @__PURE__ */ (0, F.jsx)("p", { children: "Always sent:" }),
						/* @__PURE__ */ (0, F.jsxs)("ul", {
							className: "list-disc pl-5",
							role: "list",
							children: [
								/* @__PURE__ */ (0, F.jsx)("li", { children: "the schema version and the time of the report" }),
								/* @__PURE__ */ (0, F.jsx)("li", { children: "the integration version" }),
								/* @__PURE__ */ (0, F.jsx)("li", { children: "for each check: its name, status, latency and a short failure reason" }),
								/* @__PURE__ */ (0, F.jsx)("li", { children: "failure reasons can include the foXaCe version and device counts, such as \"2 offline, 1 low battery\"" })
							]
						}),
						/* @__PURE__ */ (0, F.jsx)("p", { children: "Alarmio identifies you from your session token. The report itself carries no account identifier." }),
						e ? /* @__PURE__ */ (0, F.jsxs)(F.Fragment, { children: [
							/* @__PURE__ */ (0, F.jsx)("p", { children: "Also sent because sharing is on:" }),
							/* @__PURE__ */ (0, F.jsxs)("ul", {
								className: "list-disc pl-5",
								role: "list",
								children: [
									/* @__PURE__ */ (0, F.jsx)("li", { children: "the reconnect count" }),
									/* @__PURE__ */ (0, F.jsx)("li", { children: "the Home Assistant version and the foXaCe version" }),
									/* @__PURE__ */ (0, F.jsx)("li", { children: "whether proxy mode is used" }),
									/* @__PURE__ */ (0, F.jsx)("li", { children: "whether the alarm is armed. This reveals when the home is likely occupied." }),
									/* @__PURE__ */ (0, F.jsx)("li", { children: "device names, online state, malfunction count, battery and signal" })
								]
							}),
							d > 0 ? /* @__PURE__ */ (0, F.jsx)("p", { children: Fi(u, d) }) : null,
							/* @__PURE__ */ (0, F.jsx)("p", { children: "This is exactly what the next report contains:" }),
							f.length > 0 ? /* @__PURE__ */ (0, F.jsxs)("p", { children: [
								"Device names included: ",
								f.join(", "),
								"."
							] }) : null,
							/* @__PURE__ */ (0, F.jsx)("pre", {
								className: "max-h-64 overflow-auto rounded-md border p-3 font-mono text-xs",
								style: {
									borderColor: P.divider,
									background: P.surfaceMuted
								},
								tabIndex: 0,
								"aria-label": "Diagnostics that are sent",
								children: t ? JSON.stringify(t, null, 2) : "Nothing to show yet."
							})
						] }) : /* @__PURE__ */ (0, F.jsx)("p", { children: "Nothing else is sent. Device names, battery, signal and whether the alarm is armed stay in Home Assistant." })
					]
				})]
			})
		]
	});
}
// src/components/DeviceList.tsx
var Ri = 20, zi = (e) => e === null ? 1e400 : e;
function Bi(e) {
	return [...e].sort((e, t) => Number(e.online) - Number(t.online) || zi(e.battery) - zi(t.battery) || zi(e.signal) - zi(t.signal) || e.name.localeCompare(t.name));
}
function Vi(e) {
	return e.online ? e.malfunctions > 0 || e.battery !== null && e.battery <= Ri ? "degraded" : "healthy" : "down";
}
function Hi({ diagnostics: e, sharing: t }) {
	let n = t && e ? Bi(e.devices) : [];
	return /* @__PURE__ */ (0, F.jsxs)("section", {
		"aria-labelledby": "devices-heading",
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, F.jsx)("h2", {
				id: "devices-heading",
				className: "font-display text-xl font-semibold",
				children: "Devices"
			}),
			t ? n.length === 0 ? /* @__PURE__ */ (0, F.jsx)("p", {
				style: { color: P.textMuted },
				children: "No devices reported yet. They appear after the next check."
			}) : /* @__PURE__ */ (0, F.jsx)("ul", {
				role: "list",
				className: "flex flex-col divide-y",
				style: { borderColor: P.divider },
				children: n.map((e, t) => {
					let n = Vi(e);
					return /* @__PURE__ */ (0, F.jsxs)("li", {
						className: "flex flex-wrap items-center gap-x-4 gap-y-1 py-2.5 first:pt-0",
						style: { borderColor: P.divider },
						"data-device": e.name,
						children: [
							/* @__PURE__ */ (0, F.jsxs)("span", {
								"data-device-head": !0,
								className: "flex min-w-0 basis-full items-center gap-2 sm:basis-0 sm:flex-1",
								children: [/* @__PURE__ */ (0, F.jsx)(Oe, {
									status: n,
									label: !0
								}), /* @__PURE__ */ (0, F.jsx)("span", {
									"data-device-name": !0,
									className: "min-w-0 font-medium",
									children: e.name
								})]
							}),
							e.online ? null : /* @__PURE__ */ (0, F.jsx)("span", {
								className: "text-sm",
								children: "Offline"
							}),
							e.malfunctions > 0 ? /* @__PURE__ */ (0, F.jsx)("span", {
								className: "text-sm",
								children: e.malfunctions === 1 ? "1 malfunction" : `${e.malfunctions} malfunctions`
							}) : null,
							/* @__PURE__ */ (0, F.jsxs)("span", {
								className: "font-mono text-sm",
								style: { color: P.textMuted },
								children: ["Battery ", /* @__PURE__ */ (0, F.jsx)("span", {
									style: { color: P.text },
									children: e.battery === null ? "–" : `${e.battery}%`
								})]
							}),
							/* @__PURE__ */ (0, F.jsxs)("span", {
								className: "font-mono text-sm",
								style: { color: P.textMuted },
								children: ["Signal ", /* @__PURE__ */ (0, F.jsx)("span", {
									style: { color: P.text },
									children: e.signal === null ? "–" : e.signal
								})]
							})
						]
					}, `${t}-${e.name}`);
				})
			}) : /* @__PURE__ */ (0, F.jsx)("p", {
				style: { color: P.textMuted },
				children: "Turn on Share diagnostics to see device battery and signal here."
			}),
			t && n.length > 0 && (e?.devices_truncated ?? 0) > 0 ? /* @__PURE__ */ (0, F.jsx)("p", {
				className: "text-sm",
				style: { color: P.textMuted },
				children: Fi(n.length, e?.devices_truncated ?? 0)
			}) : null
		]
	});
}
// src/components/IncidentList.tsx
var Ui = 10;
function Wi({ incidents: e, error: t = null }) {
	let n = e.slice(0, Ui);
	return /* @__PURE__ */ (0, F.jsxs)("section", {
		"aria-labelledby": "incidents-heading",
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, F.jsx)("h2", {
				id: "incidents-heading",
				className: "font-display text-xl font-semibold",
				children: "Incidents"
			}),
			t ? /* @__PURE__ */ (0, F.jsx)("p", {
				style: { color: P.textMuted },
				children: t
			}) : null,
			e.length === 0 ? t ? null : /* @__PURE__ */ (0, F.jsx)("p", {
				style: { color: P.textMuted },
				children: "No incidents in the last 90 days."
			}) : /* @__PURE__ */ (0, F.jsxs)(F.Fragment, { children: [/* @__PURE__ */ (0, F.jsx)("ul", {
				role: "list",
				className: "flex flex-col divide-y",
				style: { borderColor: P.divider },
				children: n.map((e) => {
					let t = e.closed_at === null ? null : he(e.opened_at, e.closed_at);
					return /* @__PURE__ */ (0, F.jsxs)("li", {
						className: "flex flex-col gap-0.5 py-3 first:pt-0",
						style: { borderColor: P.divider },
						children: [
							/* @__PURE__ */ (0, F.jsxs)("div", {
								className: "flex flex-wrap items-baseline justify-between gap-x-3",
								children: [/* @__PURE__ */ (0, F.jsx)("span", {
									className: "font-medium",
									children: pe(e.probe)
								}), e.closed_at === null ? /* @__PURE__ */ (0, F.jsxs)("span", {
									className: "flex items-center gap-1 text-sm font-semibold",
									style: { color: xe.down },
									children: [/* @__PURE__ */ (0, F.jsx)(Oe, {
										status: "down",
										className: "size-4"
									}), "Ongoing"]
								}) : /* @__PURE__ */ (0, F.jsx)("span", {
									className: "font-mono text-sm",
									children: t ?? "Unknown length"
								})]
							}),
							/* @__PURE__ */ (0, F.jsx)("span", {
								className: "font-mono text-xs",
								style: { color: P.textMuted },
								children: ge(e.opened_at)
							}),
							e.detail ? /* @__PURE__ */ (0, F.jsx)("span", {
								className: "text-sm",
								children: e.detail
							}) : null
						]
					}, e.id);
				})
			}), e.length > Ui ? /* @__PURE__ */ (0, F.jsxs)("p", {
				className: "text-sm",
				style: { color: P.textMuted },
				children: [
					"Showing the latest ",
					Ui,
					" of ",
					e.length,
					"."
				]
			}) : null] })
		]
	});
}
// node_modules/recharts/es6/util/excludeEventProps.js
var Gi = /* @__PURE__ */ "dangerouslySetInnerHTML.onCopy.onCopyCapture.onCut.onCutCapture.onPaste.onPasteCapture.onCompositionEnd.onCompositionEndCapture.onCompositionStart.onCompositionStartCapture.onCompositionUpdate.onCompositionUpdateCapture.onFocus.onFocusCapture.onBlur.onBlurCapture.onChange.onChangeCapture.onBeforeInput.onBeforeInputCapture.onInput.onInputCapture.onReset.onResetCapture.onSubmit.onSubmitCapture.onInvalid.onInvalidCapture.onLoad.onLoadCapture.onError.onErrorCapture.onKeyDown.onKeyDownCapture.onKeyPress.onKeyPressCapture.onKeyUp.onKeyUpCapture.onAbort.onAbortCapture.onCanPlay.onCanPlayCapture.onCanPlayThrough.onCanPlayThroughCapture.onDurationChange.onDurationChangeCapture.onEmptied.onEmptiedCapture.onEncrypted.onEncryptedCapture.onEnded.onEndedCapture.onLoadedData.onLoadedDataCapture.onLoadedMetadata.onLoadedMetadataCapture.onLoadStart.onLoadStartCapture.onPause.onPauseCapture.onPlay.onPlayCapture.onPlaying.onPlayingCapture.onProgress.onProgressCapture.onRateChange.onRateChangeCapture.onSeeked.onSeekedCapture.onSeeking.onSeekingCapture.onStalled.onStalledCapture.onSuspend.onSuspendCapture.onTimeUpdate.onTimeUpdateCapture.onVolumeChange.onVolumeChangeCapture.onWaiting.onWaitingCapture.onAuxClick.onAuxClickCapture.onClick.onClickCapture.onContextMenu.onContextMenuCapture.onDoubleClick.onDoubleClickCapture.onDrag.onDragCapture.onDragEnd.onDragEndCapture.onDragEnter.onDragEnterCapture.onDragExit.onDragExitCapture.onDragLeave.onDragLeaveCapture.onDragOver.onDragOverCapture.onDragStart.onDragStartCapture.onDrop.onDropCapture.onMouseDown.onMouseDownCapture.onMouseEnter.onMouseLeave.onMouseMove.onMouseMoveCapture.onMouseOut.onMouseOutCapture.onMouseOver.onMouseOverCapture.onMouseUp.onMouseUpCapture.onSelect.onSelectCapture.onTouchCancel.onTouchCancelCapture.onTouchEnd.onTouchEndCapture.onTouchMove.onTouchMoveCapture.onTouchStart.onTouchStartCapture.onPointerDown.onPointerDownCapture.onPointerMove.onPointerMoveCapture.onPointerUp.onPointerUpCapture.onPointerCancel.onPointerCancelCapture.onPointerEnter.onPointerEnterCapture.onPointerLeave.onPointerLeaveCapture.onPointerOver.onPointerOverCapture.onPointerOut.onPointerOutCapture.onGotPointerCapture.onGotPointerCaptureCapture.onLostPointerCapture.onLostPointerCaptureCapture.onScroll.onScrollCapture.onWheel.onWheelCapture.onAnimationStart.onAnimationStartCapture.onAnimationEnd.onAnimationEndCapture.onAnimationIteration.onAnimationIterationCapture.onTransitionEnd.onTransitionEndCapture".split(".");
function Ki(e) {
	return typeof e == "string" && Gi.includes(e);
}
// node_modules/recharts/es6/util/svgPropertiesNoEvents.js
var qi = /* @__PURE__ */ new Set(/* @__PURE__ */ "aria-activedescendant.aria-atomic.aria-autocomplete.aria-busy.aria-checked.aria-colcount.aria-colindex.aria-colspan.aria-controls.aria-current.aria-describedby.aria-details.aria-disabled.aria-errormessage.aria-expanded.aria-flowto.aria-haspopup.aria-hidden.aria-invalid.aria-keyshortcuts.aria-label.aria-labelledby.aria-level.aria-live.aria-modal.aria-multiline.aria-multiselectable.aria-orientation.aria-owns.aria-placeholder.aria-posinset.aria-pressed.aria-readonly.aria-relevant.aria-required.aria-roledescription.aria-rowcount.aria-rowindex.aria-rowspan.aria-selected.aria-setsize.aria-sort.aria-valuemax.aria-valuemin.aria-valuenow.aria-valuetext.className.color.height.id.lang.max.media.method.min.name.style.target.width.role.tabIndex.accentHeight.accumulate.additive.alignmentBaseline.allowReorder.alphabetic.amplitude.arabicForm.ascent.attributeName.attributeType.autoReverse.azimuth.baseFrequency.baselineShift.baseProfile.bbox.begin.bias.by.calcMode.capHeight.clip.clipPath.clipPathUnits.clipRule.colorInterpolation.colorInterpolationFilters.colorProfile.colorRendering.contentScriptType.contentStyleType.cursor.cx.cy.d.decelerate.descent.diffuseConstant.direction.display.divisor.dominantBaseline.dur.dx.dy.edgeMode.elevation.enableBackground.end.exponent.externalResourcesRequired.fill.fillOpacity.fillRule.filter.filterRes.filterUnits.floodColor.floodOpacity.focusable.fontFamily.fontSize.fontSizeAdjust.fontStretch.fontStyle.fontVariant.fontWeight.format.from.fx.fy.g1.g2.glyphName.glyphOrientationHorizontal.glyphOrientationVertical.glyphRef.gradientTransform.gradientUnits.hanging.horizAdvX.horizOriginX.href.ideographic.imageRendering.in2.in.intercept.k1.k2.k3.k4.k.kernelMatrix.kernelUnitLength.kerning.keyPoints.keySplines.keyTimes.lengthAdjust.letterSpacing.lightingColor.limitingConeAngle.local.markerEnd.markerHeight.markerMid.markerStart.markerUnits.markerWidth.mask.maskContentUnits.maskUnits.mathematical.mode.numOctaves.offset.opacity.operator.order.orient.orientation.origin.overflow.overlinePosition.overlineThickness.paintOrder.panose1.pathLength.patternContentUnits.patternTransform.patternUnits.pointerEvents.pointsAtX.pointsAtY.pointsAtZ.preserveAlpha.preserveAspectRatio.primitiveUnits.r.radius.refX.refY.renderingIntent.repeatCount.repeatDur.requiredExtensions.requiredFeatures.restart.result.rotate.rx.ry.seed.shapeRendering.slope.spacing.specularConstant.specularExponent.speed.spreadMethod.startOffset.stdDeviation.stemh.stemv.stitchTiles.stopColor.stopOpacity.strikethroughPosition.strikethroughThickness.string.stroke.strokeDasharray.strokeDashoffset.strokeLinecap.strokeLinejoin.strokeMiterlimit.strokeOpacity.strokeWidth.surfaceScale.systemLanguage.tableValues.targetX.targetY.textAnchor.textDecoration.textLength.textRendering.to.transform.u1.u2.underlinePosition.underlineThickness.unicode.unicodeBidi.unicodeRange.unitsPerEm.vAlphabetic.values.vectorEffect.version.vertAdvY.vertOriginX.vertOriginY.vHanging.vIdeographic.viewTarget.visibility.vMathematical.widths.wordSpacing.writingMode.x1.x2.x.xChannelSelector.xHeight.xlinkActuate.xlinkArcrole.xlinkHref.xlinkRole.xlinkShow.xlinkTitle.xlinkType.xmlBase.xmlLang.xmlns.xmlnsXlink.xmlSpace.y1.y2.y.yChannelSelector.z.zoomAndPan.ref.key.angle".split("."));
function Ji(e) {
	return typeof e == "string" && qi.has(e);
}
function Yi(e) {
	return typeof e == "string" && e.startsWith("data-");
}
function Xi(e) {
	if (typeof e != "object" || !e) return {};
	var t = {};
	for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (Ji(n) || Yi(n)) && (t[n] = e[n]);
	return t;
}
function Zi(e) {
	return e == null ? null : /*#__PURE__*/ (0, v.isValidElement)(e) && typeof e.props == "object" && e.props !== null ? Xi(e.props) : typeof e == "object" && !Array.isArray(e) ? Xi(e) : null;
}
// node_modules/recharts/es6/util/svgPropertiesAndEvents.js
function Qi(e) {
	var t = {};
	for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (Ji(n) || Yi(n) || Ki(n)) && (t[n] = e[n]);
	return t;
}
function $i(e) {
	return e == null ? null : /*#__PURE__*/ (0, v.isValidElement)(e) ? Qi(e.props) : typeof e == "object" && !Array.isArray(e) ? Qi(e) : null;
}
// node_modules/recharts/es6/container/Surface.js
var ea = [
	"children",
	"width",
	"height",
	"viewBox",
	"className",
	"style",
	"title",
	"desc"
];
function ta() {
	return ta = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, ta.apply(null, arguments);
}
function na(e, t) {
	if (e == null) return {};
	var n, r, i = ra(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function ra(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var ia = /*#__PURE__*/ (0, v.forwardRef)((e, t) => {
	var { children: n, width: r, height: i, viewBox: a, className: o, style: s, title: c, desc: l } = e, u = na(e, ea), d = a || {
		width: r,
		height: i,
		x: 0,
		y: 0
	}, f = I("recharts-surface", o);
	return /*#__PURE__*/ v.createElement("svg", ta({}, Qi(u), {
		className: f,
		width: r,
		height: i,
		style: s,
		viewBox: `${d.x} ${d.y} ${d.width} ${d.height}`,
		ref: t
	}), /*#__PURE__*/ v.createElement("title", null, c), /*#__PURE__*/ v.createElement("desc", null, l), n);
}), B = ["children", "className"];
function aa() {
	return aa = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, aa.apply(null, arguments);
}
function oa(e, t) {
	if (e == null) return {};
	var n, r, i = sa(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function sa(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var ca = /*#__PURE__*/ v.forwardRef((e, t) => {
	var { children: n, className: r } = e, i = oa(e, B), a = I("recharts-layer", r);
	return /*#__PURE__*/ v.createElement("g", aa({ className: a }, Qi(i), { ref: t }), n);
}), la = /*#__PURE__*/ (0, v.createContext)(null), ua = Math.PI, da = 2 * ua, fa = 1e-6, pa = da - fa;
function ma(e) {
	this._ += e[0];
	for (let t = 1, n = e.length; t < n; ++t) this._ += arguments[t] + e[t];
}
function ha(e) {
	let t = Math.floor(e);
	if (!(t >= 0)) throw Error(`invalid digits: ${e}`);
	if (t > 15) return ma;
	let n = 10 ** t;
	return function(e) {
		this._ += e[0];
		for (let t = 1, r = e.length; t < r; ++t) this._ += Math.round(arguments[t] * n) / n + e[t];
	};
}
function ga(e, t, n, r) {
	return e === n && t === r;
}
function _a(e) {
	let t = Math.floor(e);
	if (!(t <= 15)) return ga;
	let n = 10 ** t, r = function(e) {
		return Math.round(e * n);
	};
	return function(e, t, n, i) {
		return r(e) === r(n) && r(t) === r(i);
	};
}
var va = class {
	constructor(e) {
		this._x0 = this._y0 = this._x1 = this._y1 = null, this._ = "", this._append = e == null ? ma : ha(e), this._equal = e == null ? ga : _a(e);
	}
	moveTo(e, t) {
		this._append`M${this._x0 = this._x1 = +e},${this._y0 = this._y1 = +t}`;
	}
	closePath() {
		this._x1 !== null && (this._x1 = this._x0, this._y1 = this._y0, this._append`Z`);
	}
	lineTo(e, t) {
		this._append`L${this._x1 = +e},${this._y1 = +t}`;
	}
	quadraticCurveTo(e, t, n, r) {
		this._append`Q${+e},${+t},${this._x1 = +n},${this._y1 = +r}`;
	}
	bezierCurveTo(e, t, n, r, i, a) {
		this._append`C${+e},${+t},${+n},${+r},${this._x1 = +i},${this._y1 = +a}`;
	}
	arcTo(e, t, n, r, i) {
		if (e = +e, t = +t, n = +n, r = +r, i = +i, i < 0) throw Error(`negative radius: ${i}`);
		let a = this._x1, o = this._y1, s = n - e, c = r - t, l = a - e, u = o - t, d = l * l + u * u;
		if (this._x1 === null) this._append`M${this._x1 = e},${this._y1 = t}`;
		else if (d > fa) {
			if (!(Math.abs(u * s - c * l) > fa) || !i) this._append`L${this._x1 = e},${this._y1 = t}`;
			else {
				let f = n - a, p = r - o, m = s * s + c * c, h = f * f + p * p, g = Math.sqrt(m), _ = Math.sqrt(d), v = i * Math.tan((ua - Math.acos((m + d - h) / (2 * g * _))) / 2), y = v / _, b = v / g;
				Math.abs(y - 1) > fa && this._append`L${e + y * l},${t + y * u}`, this._append`A${i},${i},0,0,${+(u * f > l * p)},${this._x1 = e + b * s},${this._y1 = t + b * c}`;
			}
		}
	}
	arc(e, t, n, r, i, a) {
		if (e = +e, t = +t, n = +n, a = !!a, n < 0) throw Error(`negative radius: ${n}`);
		let o = n * Math.cos(r), s = n * Math.sin(r), c = e + o, l = t + s, u = 1 ^ a, d = a ? r - i : i - r;
		if (this._x1 === null ? this._append`M${c},${l}` : (Math.abs(this._x1 - c) > fa || Math.abs(this._y1 - l) > fa) && this._append`L${c},${l}`, n) {
			if (d < 0 && (d = d % da + da), d > pa) this._append`A${n},${n},0,1,${u},${e - o},${t - s}A${n},${n},0,1,${u},${this._x1 = c},${this._y1 = l}`;
			else if (d > fa) {
				let a = e + n * Math.cos(i), o = t + n * Math.sin(i);
				if (d >= ua && this._equal(c, l, a, o)) {
					d /= 2;
					let i = r + d;
					this._append`A${n},${n},0,${+(d >= ua)},${u},${e + n * Math.cos(i)},${t + n * Math.sin(i)}`;
				}
				this._append`A${n},${n},0,${+(d >= ua)},${u},${this._x1 = a},${this._y1 = o}`;
			}
		}
	}
	rect(e, t, n, r) {
		this._append`M${this._x0 = this._x1 = +e},${this._y0 = this._y1 = +t}h${n = +n}v${+r}h${-n}Z`;
	}
	toString() {
		return this._;
	}
};
va.prototype;
// node_modules/d3-shape/dist/d3-shape.mjs
function V(e) {
	return function() {
		return e;
	};
}
var ya = Math.cos, ba = Math.sin, xa = Math.sqrt, Sa = 1e-12, Ca = Math.PI;
Ca / 2;
var wa = 2 * Ca;
function Ta(e) {
	let t = 3;
	return e.digits = function(n) {
		if (!arguments.length) return t;
		if (n == null) t = null;
		else {
			let e = Math.floor(n);
			if (!(e >= 0)) throw RangeError(`invalid digits: ${n}`);
			t = e;
		}
		return e;
	}, () => new va(t);
}
Array.prototype.slice;
function Ea(e) {
	return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function Da(e) {
	this._context = e;
}
Da.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._point = 0;
	},
	lineEnd: function() {
		(this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
				break;
			case 1: this._point = 2;
			default: this._context.lineTo(e, t);
		}
	}
};
function Oa(e) {
	return new Da(e);
}
function ka(e) {
	return e[0];
}
function Aa(e) {
	return e[1];
}
function ja(e, t) {
	var n = V(!0), r = null, i = Oa, a = null, o = Ta(s);
	e = typeof e == "function" ? e : e === void 0 ? ka : V(e), t = typeof t == "function" ? t : t === void 0 ? Aa : V(t);
	function s(s) {
		var c, l = (s = Ea(s)).length, u, d = !1, f;
		for (r ?? (a = i(f = o())), c = 0; c <= l; ++c) !(c < l && n(u = s[c], c, s)) === d && ((d = !d) ? a.lineStart() : a.lineEnd()), d && a.point(+e(u, c, s), +t(u, c, s));
		if (f) return a = null, f + "" || null;
	}
	return s.x = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : V(+t), s) : e;
	}, s.y = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : V(+e), s) : t;
	}, s.defined = function(e) {
		return arguments.length ? (n = typeof e == "function" ? e : V(!!e), s) : n;
	}, s.curve = function(e) {
		return arguments.length ? (i = e, r != null && (a = i(r)), s) : i;
	}, s.context = function(e) {
		return arguments.length ? (e == null ? r = a = null : a = i(r = e), s) : r;
	}, s;
}
function Ma(e, t, n) {
	var r = null, i = V(!0), a = null, o = Oa, s = null, c = Ta(l);
	e = typeof e == "function" ? e : e === void 0 ? ka : V(+e), t = typeof t == "function" ? t : V(t === void 0 ? 0 : +t), n = typeof n == "function" ? n : n === void 0 ? Aa : V(+n);
	function l(l) {
		var u, d, f, p = (l = Ea(l)).length, m, h = !1, g, _ = Array(p), v = Array(p);
		for (a ?? (s = o(g = c())), u = 0; u <= p; ++u) {
			if (!(u < p && i(m = l[u], u, l)) === h) {
				if (h = !h) d = u, s.areaStart(), s.lineStart();
				else {
					for (s.lineEnd(), s.lineStart(), f = u - 1; f >= d; --f) s.point(_[f], v[f]);
					s.lineEnd(), s.areaEnd();
				}
			}
			h && (_[u] = +e(m, u, l), v[u] = +t(m, u, l), s.point(r ? +r(m, u, l) : _[u], n ? +n(m, u, l) : v[u]));
		}
		if (g) return s = null, g + "" || null;
	}
	function u() {
		return ja().defined(i).curve(o).context(a);
	}
	return l.x = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : V(+t), r = null, l) : e;
	}, l.x0 = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : V(+t), l) : e;
	}, l.x1 = function(e) {
		return arguments.length ? (r = e == null ? null : typeof e == "function" ? e : V(+e), l) : r;
	}, l.y = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : V(+e), n = null, l) : t;
	}, l.y0 = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : V(+e), l) : t;
	}, l.y1 = function(e) {
		return arguments.length ? (n = e == null ? null : typeof e == "function" ? e : V(+e), l) : n;
	}, l.lineX0 = l.lineY0 = function() {
		return u().x(e).y(t);
	}, l.lineY1 = function() {
		return u().x(e).y(n);
	}, l.lineX1 = function() {
		return u().x(r).y(t);
	}, l.defined = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : V(!!e), l) : i;
	}, l.curve = function(e) {
		return arguments.length ? (o = e, a != null && (s = o(a)), l) : o;
	}, l.context = function(e) {
		return arguments.length ? (e == null ? a = s = null : s = o(a = e), l) : a;
	}, l;
}
Pa(Oa);
function Na(e) {
	this._curve = e;
}
Na.prototype = {
	areaStart: function() {
		this._curve.areaStart();
	},
	areaEnd: function() {
		this._curve.areaEnd();
	},
	lineStart: function() {
		this._curve.lineStart();
	},
	lineEnd: function() {
		this._curve.lineEnd();
	},
	point: function(e, t) {
		this._curve.point(t * Math.sin(e), t * -Math.cos(e));
	}
};
function Pa(e) {
	function t(t) {
		return new Na(e(t));
	}
	return t._curve = e, t;
}
var Fa = class {
	constructor(e, t) {
		this._context = e, this._x = t;
	}
	areaStart() {
		this._line = 0;
	}
	areaEnd() {
		this._line = NaN;
	}
	lineStart() {
		this._point = 0;
	}
	lineEnd() {
		(this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
	}
	point(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
				break;
			case 1: this._point = 2;
			default: this._x ? this._context.bezierCurveTo(this._x0 = (this._x0 + e) / 2, this._y0, this._x0, t, e, t) : this._context.bezierCurveTo(this._x0, this._y0 = (this._y0 + t) / 2, e, this._y0, e, t);
		}
		this._x0 = e, this._y0 = t;
	}
};
function Ia(e) {
	return new Fa(e, !0);
}
function La(e) {
	return new Fa(e, !1);
}
xa(3);
var Ra = { draw(e, t) {
	let n = xa(t / Ca);
	e.moveTo(n, 0), e.arc(0, 0, n, 0, wa);
} }, za = { draw(e, t) {
	let n = xa(t / 5) / 2;
	e.moveTo(-3 * n, -n), e.lineTo(-n, -n), e.lineTo(-n, -3 * n), e.lineTo(n, -3 * n), e.lineTo(n, -n), e.lineTo(3 * n, -n), e.lineTo(3 * n, n), e.lineTo(n, n), e.lineTo(n, 3 * n), e.lineTo(-n, 3 * n), e.lineTo(-n, n), e.lineTo(-3 * n, n), e.closePath();
} }, Ba = xa(1 / 3), Va = Ba * 2, Ha = { draw(e, t) {
	let n = xa(t / Va), r = n * Ba;
	e.moveTo(0, -n), e.lineTo(r, 0), e.lineTo(0, n), e.lineTo(-r, 0), e.closePath();
} }, Ua = { draw(e, t) {
	let n = xa(t), r = -n / 2;
	e.rect(r, r, n, n);
} }, Wa = .8908130915292852, Ga = ba(Ca / 10) / ba(7 * Ca / 10), Ka = ba(wa / 10) * Ga, qa = -ya(wa / 10) * Ga, Ja = { draw(e, t) {
	let n = xa(t * Wa), r = Ka * n, i = qa * n;
	e.moveTo(0, -n), e.lineTo(r, i);
	for (let t = 1; t < 5; ++t) {
		let a = wa * t / 5, o = ya(a), s = ba(a);
		e.lineTo(s * n, -o * n), e.lineTo(o * r - s * i, s * r + o * i);
	}
	e.closePath();
} }, Ya = xa(3), Xa = { draw(e, t) {
	let n = -xa(t / (Ya * 3));
	e.moveTo(0, n * 2), e.lineTo(-Ya * n, -n), e.lineTo(Ya * n, -n), e.closePath();
} };
xa(3);
var Za = -.5, Qa = xa(3) / 2, $a = 1 / xa(12), eo = ($a / 2 + 1) * 3, to = { draw(e, t) {
	let n = xa(t / eo), r = n / 2, i = n * $a, a = r, o = n * $a + n, s = -a, c = o;
	e.moveTo(r, i), e.lineTo(a, o), e.lineTo(s, c), e.lineTo(Za * r - Qa * i, Qa * r + Za * i), e.lineTo(Za * a - Qa * o, Qa * a + Za * o), e.lineTo(Za * s - Qa * c, Qa * s + Za * c), e.lineTo(Za * r + Qa * i, Za * i - Qa * r), e.lineTo(Za * a + Qa * o, Za * o - Qa * a), e.lineTo(Za * s + Qa * c, Za * c - Qa * s), e.closePath();
} };
function no(e, t) {
	let n = null, r = Ta(i);
	e = typeof e == "function" ? e : V(e || Ra), t = typeof t == "function" ? t : V(t === void 0 ? 64 : +t);
	function i() {
		let i;
		if (n ||= i = r(), e.apply(this, arguments).draw(n, +t.apply(this, arguments)), i) return n = null, i + "" || null;
	}
	return i.type = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : V(t), i) : e;
	}, i.size = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : V(+e), i) : t;
	}, i.context = function(e) {
		return arguments.length ? (n = e ?? null, i) : n;
	}, i;
}
function ro() {}
function io(e, t, n) {
	e._context.bezierCurveTo((2 * e._x0 + e._x1) / 3, (2 * e._y0 + e._y1) / 3, (e._x0 + 2 * e._x1) / 3, (e._y0 + 2 * e._y1) / 3, (e._x0 + 4 * e._x1 + t) / 6, (e._y0 + 4 * e._y1 + n) / 6);
}
function ao(e) {
	this._context = e;
}
ao.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x0 = this._x1 = this._y0 = this._y1 = NaN, this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 3: io(this, this._x1, this._y1);
			case 2: this._context.lineTo(this._x1, this._y1);
		}
		(this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
				break;
			case 1:
				this._point = 2;
				break;
			case 2: this._point = 3, this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6);
			default: io(this, e, t);
		}
		this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
	}
};
function oo(e) {
	return new ao(e);
}
function so(e) {
	this._context = e;
}
so.prototype = {
	areaStart: ro,
	areaEnd: ro,
	lineStart: function() {
		this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = NaN, this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 1:
				this._context.moveTo(this._x2, this._y2), this._context.closePath();
				break;
			case 2:
				this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3), this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3), this._context.closePath();
				break;
			case 3: this.point(this._x2, this._y2), this.point(this._x3, this._y3), this.point(this._x4, this._y4);
		}
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._x2 = e, this._y2 = t;
				break;
			case 1:
				this._point = 2, this._x3 = e, this._y3 = t;
				break;
			case 2:
				this._point = 3, this._x4 = e, this._y4 = t, this._context.moveTo((this._x0 + 4 * this._x1 + e) / 6, (this._y0 + 4 * this._y1 + t) / 6);
				break;
			default: io(this, e, t);
		}
		this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
	}
};
function co(e) {
	return new so(e);
}
function lo(e) {
	this._context = e;
}
lo.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x0 = this._x1 = this._y0 = this._y1 = NaN, this._point = 0;
	},
	lineEnd: function() {
		(this._line || this._line !== 0 && this._point === 3) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1;
				break;
			case 1:
				this._point = 2;
				break;
			case 2:
				this._point = 3;
				var n = (this._x0 + 4 * this._x1 + e) / 6, r = (this._y0 + 4 * this._y1 + t) / 6;
				this._line ? this._context.lineTo(n, r) : this._context.moveTo(n, r);
				break;
			case 3: this._point = 4;
			default: io(this, e, t);
		}
		this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
	}
};
function uo(e) {
	return new lo(e);
}
function fo(e, t) {
	this._basis = new ao(e), this._beta = t;
}
fo.prototype = {
	lineStart: function() {
		this._x = [], this._y = [], this._basis.lineStart();
	},
	lineEnd: function() {
		var e = this._x, t = this._y, n = e.length - 1;
		if (n > 0) for (var r = e[0], i = t[0], a = e[n] - r, o = t[n] - i, s = -1, c; ++s <= n;) c = s / n, this._basis.point(this._beta * e[s] + (1 - this._beta) * (r + c * a), this._beta * t[s] + (1 - this._beta) * (i + c * o));
		this._x = this._y = null, this._basis.lineEnd();
	},
	point: function(e, t) {
		this._x.push(+e), this._y.push(+t);
	}
}, (function e(t) {
	function n(e) {
		return t === 1 ? new ao(e) : new fo(e, t);
	}
	return n.beta = function(t) {
		return e(+t);
	}, n;
})(.85);
function po(e, t, n) {
	e._context.bezierCurveTo(e._x1 + e._k * (e._x2 - e._x0), e._y1 + e._k * (e._y2 - e._y0), e._x2 + e._k * (e._x1 - t), e._y2 + e._k * (e._y1 - n), e._x2, e._y2);
}
function mo(e, t) {
	this._context = e, this._k = (1 - t) / 6;
}
mo.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 2:
				this._context.lineTo(this._x2, this._y2);
				break;
			case 3: po(this, this._x1, this._y1);
		}
		(this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
				break;
			case 1:
				this._point = 2, this._x1 = e, this._y1 = t;
				break;
			case 2: this._point = 3;
			default: po(this, e, t);
		}
		this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
}, (function e(t) {
	function n(e) {
		return new mo(e, t);
	}
	return n.tension = function(t) {
		return e(+t);
	}, n;
})(0);
function ho(e, t) {
	this._context = e, this._k = (1 - t) / 6;
}
ho.prototype = {
	areaStart: ro,
	areaEnd: ro,
	lineStart: function() {
		this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN, this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 1:
				this._context.moveTo(this._x3, this._y3), this._context.closePath();
				break;
			case 2:
				this._context.lineTo(this._x3, this._y3), this._context.closePath();
				break;
			case 3: this.point(this._x3, this._y3), this.point(this._x4, this._y4), this.point(this._x5, this._y5);
		}
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._x3 = e, this._y3 = t;
				break;
			case 1:
				this._point = 2, this._context.moveTo(this._x4 = e, this._y4 = t);
				break;
			case 2:
				this._point = 3, this._x5 = e, this._y5 = t;
				break;
			default: po(this, e, t);
		}
		this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
}, (function e(t) {
	function n(e) {
		return new ho(e, t);
	}
	return n.tension = function(t) {
		return e(+t);
	}, n;
})(0);
function go(e, t) {
	this._context = e, this._k = (1 - t) / 6;
}
go.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._point = 0;
	},
	lineEnd: function() {
		(this._line || this._line !== 0 && this._point === 3) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1;
				break;
			case 1:
				this._point = 2;
				break;
			case 2:
				this._point = 3, this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);
				break;
			case 3: this._point = 4;
			default: po(this, e, t);
		}
		this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
}, (function e(t) {
	function n(e) {
		return new go(e, t);
	}
	return n.tension = function(t) {
		return e(+t);
	}, n;
})(0);
function _o(e, t, n) {
	var r = e._x1, i = e._y1, a = e._x2, o = e._y2;
	if (e._l01_a > Sa) {
		var s = 2 * e._l01_2a + 3 * e._l01_a * e._l12_a + e._l12_2a, c = 3 * e._l01_a * (e._l01_a + e._l12_a);
		r = (r * s - e._x0 * e._l12_2a + e._x2 * e._l01_2a) / c, i = (i * s - e._y0 * e._l12_2a + e._y2 * e._l01_2a) / c;
	}
	if (e._l23_a > Sa) {
		var l = 2 * e._l23_2a + 3 * e._l23_a * e._l12_a + e._l12_2a, u = 3 * e._l23_a * (e._l23_a + e._l12_a);
		a = (a * l + e._x1 * e._l23_2a - t * e._l12_2a) / u, o = (o * l + e._y1 * e._l23_2a - n * e._l12_2a) / u;
	}
	e._context.bezierCurveTo(r, i, a, o, e._x2, e._y2);
}
function vo(e, t) {
	this._context = e, this._alpha = t;
}
vo.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 2:
				this._context.lineTo(this._x2, this._y2);
				break;
			case 3: this.point(this._x2, this._y2);
		}
		(this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		if (e = +e, t = +t, this._point) {
			var n = this._x2 - e, r = this._y2 - t;
			this._l23_a = Math.sqrt(this._l23_2a = (n * n + r * r) ** +this._alpha);
		}
		switch (this._point) {
			case 0:
				this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
				break;
			case 1:
				this._point = 2;
				break;
			case 2: this._point = 3;
			default: _o(this, e, t);
		}
		this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
}, (function e(t) {
	function n(e) {
		return t ? new vo(e, t) : new mo(e, 0);
	}
	return n.alpha = function(t) {
		return e(+t);
	}, n;
})(.5);
function yo(e, t) {
	this._context = e, this._alpha = t;
}
yo.prototype = {
	areaStart: ro,
	areaEnd: ro,
	lineStart: function() {
		this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN, this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 1:
				this._context.moveTo(this._x3, this._y3), this._context.closePath();
				break;
			case 2:
				this._context.lineTo(this._x3, this._y3), this._context.closePath();
				break;
			case 3: this.point(this._x3, this._y3), this.point(this._x4, this._y4), this.point(this._x5, this._y5);
		}
	},
	point: function(e, t) {
		if (e = +e, t = +t, this._point) {
			var n = this._x2 - e, r = this._y2 - t;
			this._l23_a = Math.sqrt(this._l23_2a = (n * n + r * r) ** +this._alpha);
		}
		switch (this._point) {
			case 0:
				this._point = 1, this._x3 = e, this._y3 = t;
				break;
			case 1:
				this._point = 2, this._context.moveTo(this._x4 = e, this._y4 = t);
				break;
			case 2:
				this._point = 3, this._x5 = e, this._y5 = t;
				break;
			default: _o(this, e, t);
		}
		this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
}, (function e(t) {
	function n(e) {
		return t ? new yo(e, t) : new ho(e, 0);
	}
	return n.alpha = function(t) {
		return e(+t);
	}, n;
})(.5);
function bo(e, t) {
	this._context = e, this._alpha = t;
}
bo.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
	},
	lineEnd: function() {
		(this._line || this._line !== 0 && this._point === 3) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		if (e = +e, t = +t, this._point) {
			var n = this._x2 - e, r = this._y2 - t;
			this._l23_a = Math.sqrt(this._l23_2a = (n * n + r * r) ** +this._alpha);
		}
		switch (this._point) {
			case 0:
				this._point = 1;
				break;
			case 1:
				this._point = 2;
				break;
			case 2:
				this._point = 3, this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);
				break;
			case 3: this._point = 4;
			default: _o(this, e, t);
		}
		this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
}, (function e(t) {
	function n(e) {
		return t ? new bo(e, t) : new go(e, 0);
	}
	return n.alpha = function(t) {
		return e(+t);
	}, n;
})(.5);
function xo(e) {
	this._context = e;
}
xo.prototype = {
	areaStart: ro,
	areaEnd: ro,
	lineStart: function() {
		this._point = 0;
	},
	lineEnd: function() {
		this._point && this._context.closePath();
	},
	point: function(e, t) {
		e = +e, t = +t, this._point ? this._context.lineTo(e, t) : (this._point = 1, this._context.moveTo(e, t));
	}
};
function So(e) {
	return new xo(e);
}
function Co(e) {
	return e < 0 ? -1 : 1;
}
function wo(e, t, n) {
	var r = e._x1 - e._x0, i = t - e._x1, a = (e._y1 - e._y0) / (r || i < 0 && -0), o = (n - e._y1) / (i || r < 0 && -0), s = (a * i + o * r) / (r + i);
	return (Co(a) + Co(o)) * Math.min(Math.abs(a), Math.abs(o), .5 * Math.abs(s)) || 0;
}
function To(e, t) {
	var n = e._x1 - e._x0;
	return n ? (3 * (e._y1 - e._y0) / n - t) / 2 : t;
}
function Eo(e, t, n) {
	var r = e._x0, i = e._y0, a = e._x1, o = e._y1, s = (a - r) / 3;
	e._context.bezierCurveTo(r + s, i + s * t, a - s, o - s * n, a, o);
}
function Do(e) {
	this._context = e;
}
Do.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN, this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 2:
				this._context.lineTo(this._x1, this._y1);
				break;
			case 3: Eo(this, this._t0, To(this, this._t0));
		}
		(this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		var n = NaN;
		if (e = +e, t = +t, e !== this._x1 || t !== this._y1) {
			switch (this._point) {
				case 0:
					this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
					break;
				case 1:
					this._point = 2;
					break;
				case 2:
					this._point = 3, Eo(this, To(this, n = wo(this, e, t)), n);
					break;
				default: Eo(this, this._t0, n = wo(this, e, t));
			}
			this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t, this._t0 = n;
		}
	}
};
function Oo(e) {
	this._context = new ko(e);
}
(Oo.prototype = Object.create(Do.prototype)).point = function(e, t) {
	Do.prototype.point.call(this, t, e);
};
function ko(e) {
	this._context = e;
}
ko.prototype = {
	moveTo: function(e, t) {
		this._context.moveTo(t, e);
	},
	closePath: function() {
		this._context.closePath();
	},
	lineTo: function(e, t) {
		this._context.lineTo(t, e);
	},
	bezierCurveTo: function(e, t, n, r, i, a) {
		this._context.bezierCurveTo(t, e, r, n, a, i);
	}
};
function Ao(e) {
	return new Do(e);
}
function jo(e) {
	return new Oo(e);
}
function Mo(e) {
	this._context = e;
}
Mo.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x = [], this._y = [];
	},
	lineEnd: function() {
		var e = this._x, t = this._y, n = e.length;
		if (n) {
			if (this._line ? this._context.lineTo(e[0], t[0]) : this._context.moveTo(e[0], t[0]), n === 2) this._context.lineTo(e[1], t[1]);
			else for (var r = No(e), i = No(t), a = 0, o = 1; o < n; ++a, ++o) this._context.bezierCurveTo(r[0][a], i[0][a], r[1][a], i[1][a], e[o], t[o]);
		}
		(this._line || this._line !== 0 && n === 1) && this._context.closePath(), this._line = 1 - this._line, this._x = this._y = null;
	},
	point: function(e, t) {
		this._x.push(+e), this._y.push(+t);
	}
};
function No(e) {
	var t, n = e.length - 1, r, i = Array(n), a = Array(n), o = Array(n);
	for (i[0] = 0, a[0] = 2, o[0] = e[0] + 2 * e[1], t = 1; t < n - 1; ++t) i[t] = 1, a[t] = 4, o[t] = 4 * e[t] + 2 * e[t + 1];
	for (i[n - 1] = 2, a[n - 1] = 7, o[n - 1] = 8 * e[n - 1] + e[n], t = 1; t < n; ++t) r = i[t] / a[t - 1], a[t] -= r, o[t] -= r * o[t - 1];
	for (i[n - 1] = o[n - 1] / a[n - 1], t = n - 2; t >= 0; --t) i[t] = (o[t] - i[t + 1]) / a[t];
	for (a[n - 1] = (e[n] + i[n - 1]) / 2, t = 0; t < n - 1; ++t) a[t] = 2 * e[t + 1] - i[t + 1];
	return [i, a];
}
function Po(e) {
	return new Mo(e);
}
function Fo(e, t) {
	this._context = e, this._t = t;
}
Fo.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x = this._y = NaN, this._point = 0;
	},
	lineEnd: function() {
		0 < this._t && this._t < 1 && this._point === 2 && this._context.lineTo(this._x, this._y), (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line >= 0 && (this._t = 1 - this._t, this._line = 1 - this._line);
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
				break;
			case 1: this._point = 2;
			default: if (this._t <= 0) this._context.lineTo(this._x, t), this._context.lineTo(e, t);
			else {
				var n = this._x * (1 - this._t) + e * this._t;
				this._context.lineTo(n, this._y), this._context.lineTo(n, t);
			}
		}
		this._x = e, this._y = t;
	}
};
function Io(e) {
	return new Fo(e, .5);
}
function Lo(e) {
	return new Fo(e, 0);
}
function Ro(e) {
	return new Fo(e, 1);
}
function zo(e, t) {
	if ((o = e.length) > 1) for (var n = 1, r, i, a = e[t[0]], o, s = a.length; n < o; ++n) for (i = a, a = e[t[n]], r = 0; r < s; ++r) a[r][1] += a[r][0] = isNaN(i[r][1]) ? i[r][0] : i[r][1];
}
function Bo(e) {
	for (var t = e.length, n = Array(t); --t >= 0;) n[t] = t;
	return n;
}
function Vo(e, t) {
	return e[t];
}
function H(e) {
	let t = [];
	return t.key = e, t;
}
function Ho() {
	var e = V([]), t = Bo, n = zo, r = Vo;
	function i(i) {
		var a = Array.from(e.apply(this, arguments), H), o, s = a.length, c = -1, l;
		for (let e of i) for (o = 0, ++c; o < s; ++o) (a[o][c] = [0, +r(e, a[o].key, c, i)]).data = e;
		for (o = 0, l = Ea(t(a)); o < s; ++o) a[l[o]].index = o;
		return n(a, l), a;
	}
	return i.keys = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : V(Array.from(t)), i) : e;
	}, i.value = function(e) {
		return arguments.length ? (r = typeof e == "function" ? e : V(+e), i) : r;
	}, i.order = function(e) {
		return arguments.length ? (t = e == null ? Bo : typeof e == "function" ? e : V(Array.from(e)), i) : t;
	}, i.offset = function(e) {
		return arguments.length ? (n = e ?? zo, i) : n;
	}, i;
}
function Uo(e, t) {
	if ((r = e.length) > 0) {
		for (var n, r, i = 0, a = e[0].length, o; i < a; ++i) {
			for (o = n = 0; n < r; ++n) o += e[n][i][1] || 0;
			if (o) for (n = 0; n < r; ++n) e[n][i][1] /= o;
		}
		zo(e, t);
	}
}
function Wo(e, t) {
	if ((i = e.length) > 0) {
		for (var n = 0, r = e[t[0]], i, a = r.length; n < a; ++n) {
			for (var o = 0, s = 0; o < i; ++o) s += e[o][n][1] || 0;
			r[n][1] += r[n][0] = -s / 2;
		}
		zo(e, t);
	}
}
function Go(e, t) {
	if ((o = e.length) > 0 && (a = (i = e[t[0]]).length) > 0) {
		for (var n = 0, r = 1, i, a, o; r < a; ++r) {
			for (var s = 0, c = 0, l = 0; s < o; ++s) {
				for (var u = e[t[s]], d = u[r][1] || 0, f = (d - (u[r - 1][1] || 0)) / 2, p = 0; p < s; ++p) {
					var m = e[t[p]], h = m[r][1] || 0, g = m[r - 1][1] || 0;
					f += h - g;
				}
				c += d, l += f * d;
			}
			i[r - 1][1] += i[r - 1][0] = n, c && (n -= l / c);
		}
		i[r - 1][1] += i[r - 1][0] = n, zo(e, t);
	}
}
// node_modules/es-toolkit/dist/_internal/isUnsafeProperty.mjs
function Ko(e) {
	return e === "__proto__";
}
// node_modules/es-toolkit/dist/compat/_internal/hasOwn.mjs
var qo = Object.prototype.hasOwnProperty;
function Jo(e, t) {
	return qo.call(e, t);
}
// node_modules/es-toolkit/dist/compat/_internal/isDeepKey.mjs
var Yo = /\.|(\[(?:[^[\]]*|(["'])(?:(?!\2)[^\\]|\\.)*?\2)\])/;
function Xo(e) {
	switch (typeof e) {
		case "number":
		case "symbol": return !1;
		case "string": return e === "" || e.startsWith(".") || e.endsWith(".") ? !1 : Yo.test(e);
		default: return !1;
	}
}
// node_modules/es-toolkit/dist/compat/_internal/toKey.mjs
function Zo(e) {
	var t;
	return typeof e == "string" || typeof e == "symbol" ? e : Object.is(e == null || (t = e.valueOf) == null ? void 0 : t.call(e), -0) ? "-0" : String(e);
}
// node_modules/es-toolkit/dist/compat/predicate/isSymbol.mjs
function Qo(e) {
	return typeof e == "symbol" || e instanceof Symbol;
}
// node_modules/es-toolkit/dist/compat/_internal/baseToString.mjs
function $o(e) {
	if (typeof e == "string") return e;
	if (Array.isArray(e)) {
		let t = "";
		for (let n = 0; n < e.length; n++) n > 0 && (t += ","), t += $o(e[n]);
		return t;
	}
	if (Qo(e)) return e.toString();
	let t = e + "";
	return t === "0" && Object.is(Number(e), -0) ? "-0" : t;
}
// node_modules/es-toolkit/dist/compat/util/toString.mjs
function es(e) {
	return e == null ? "" : $o(e);
}
// node_modules/es-toolkit/dist/compat/util/toPath.mjs
function ts(e) {
	if (Array.isArray(e)) return e.map(Zo);
	if (typeof e == "symbol") return [e];
	e = es(e);
	let t = [], n = e.length;
	if (n === 0) return t;
	let r = 0, i = "", a = "", o = !1, s = !1, c = /^-?\d+(?:\.\d+)?$/;
	for (e.charCodeAt(0) === 46 && t.push(""); r < n;) {
		let l = e[r];
		if (a) l === "\\" && r + 1 < n ? (r++, i += e[r]) : l === a ? a = "" : i += l;
		else if (o) {
			if (l === "\"" || l === "'") a = l, s = !0;
			else if (l === "]") {
				if (o = !1, !s && i.includes(".") && !c.test(i)) {
					let e = i.split(".");
					for (let n = 0; n < e.length; n++) e[n] !== "" && t.push(e[n]);
				} else t.push(i);
				i = "";
			} else i += l;
		} else if (l === "[") o = !0, s = !1, i &&= (t.push(i), "");
		else if (l === ".") {
			i &&= (t.push(i), "");
			let n = e[r + 1];
			(n === void 0 || n === ".") && t.push("");
		} else i += l;
		r++;
	}
	return i && t.push(i), t;
}
// node_modules/es-toolkit/dist/compat/object/get.mjs
function ns(e, t, n) {
	if (e == null) return n;
	switch (typeof t) {
		case "string": {
			if (Ko(t)) return n;
			let r = e[t];
			return r === void 0 ? Xo(t) && !Jo(e, t) ? ns(e, ts(t), n) : n : r;
		}
		case "number":
		case "symbol": {
			typeof t == "number" && (t = Zo(t));
			let r = e[t];
			return r === void 0 ? n : r;
		}
		default: {
			if (Array.isArray(t)) return rs(e, t, n);
			if (t = Object.is(t?.valueOf(), -0) ? "-0" : String(t), Ko(t)) return n;
			let r = e[t];
			return r === void 0 ? n : r;
		}
	}
}
function rs(e, t, n) {
	if (t.length === 0) return n;
	let r = e;
	for (let e = 0; e < t.length; e++) {
		if (r == null || Ko(t[e])) return n;
		r = r[t[e]];
	}
	return r === void 0 ? n : r;
}
// node_modules/recharts/es6/util/round.js
var is = 4;
function as(e) {
	var t = 10 ** (arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : is), n = Math.round(e * t) / t;
	return Object.is(n, -0) ? 0 : n;
}
function U(e) {
	var t = [...arguments].slice(1);
	return e.reduce((e, n, r) => {
		var i = t[r - 1];
		return typeof i == "string" ? e + i + n : i === void 0 ? e + n : e + as(i) + n;
	}, "");
}
// node_modules/recharts/es6/util/DataUtils.js
var os = (e) => e === 0 ? 0 : e > 0 ? 1 : -1, ss = (e) => typeof e == "number" && e != +e, cs = (e) => typeof e == "string" && e.indexOf("%") === e.length - 1, W = (e) => (typeof e == "number" || e instanceof Number) && !ss(e), ls = (e) => W(e) || typeof e == "string", us = 0, ds = (e) => {
	var t = ++us;
	return `${e || ""}${t}`;
}, fs = function(e, t) {
	var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0, r = arguments.length > 3 && arguments[3] !== void 0 && arguments[3];
	if (!W(e) && typeof e != "string") return n;
	var i;
	if (cs(e)) {
		if (t == null) return n;
		var a = e.indexOf("%");
		i = t * parseFloat(e.slice(0, a)) / 100;
	} else i = +e;
	return ss(i) && (i = n), r && t != null && i > t && (i = t), i;
}, ps = (e) => {
	if (!Array.isArray(e)) return !1;
	for (var t = e.length, n = {}, r = 0; r < t; r++) if (!n[String(e[r])]) n[String(e[r])] = !0;
	else return !0;
	return !1;
};
function ms(e, t, n) {
	return W(e) && W(t) ? as(e + n * (t - e)) : t;
}
function hs(e, t, n) {
	if (e && e.length) return e.find((e) => e && (typeof t == "function" ? t(e) : ns(e, t)) === n);
}
var gs = (e) => e == null, _s = (e) => gs(e) ? e : `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
function vs(e) {
	return e != null;
}
function ys() {}
// node_modules/recharts/es6/shape/Symbols.js
var bs = [
	"type",
	"size",
	"sizeType"
];
function xs() {
	return xs = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, xs.apply(null, arguments);
}
function Ss(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Cs(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Ss(Object(n), !0).forEach(function(t) {
			ws(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Ss(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function ws(e, t, n) {
	return (t = Ts(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Ts(e) {
	var t = Es(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Es(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function Ds(e, t) {
	if (e == null) return {};
	var n, r, i = Os(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function Os(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var ks = {
	symbolCircle: Ra,
	symbolCross: za,
	symbolDiamond: Ha,
	symbolSquare: Ua,
	symbolStar: Ja,
	symbolTriangle: Xa,
	symbolWye: to
}, As = Math.PI / 180, js = (e) => ks[`symbol${_s(e)}`] || Ra, Ms = (e, t, n) => {
	if (t === "area") return e;
	switch (n) {
		case "cross": return 5 * e * e / 9;
		case "diamond": return .5 * e * e / Math.sqrt(3);
		case "square": return e * e;
		case "star":
			var r = 18 * As;
			return 1.25 * e * e * (Math.tan(r) - Math.tan(r * 2) * Math.tan(r) ** 2);
		case "triangle": return Math.sqrt(3) * e * e / 4;
		case "wye": return (21 - 10 * Math.sqrt(3)) * e * e / 8;
		default: return Math.PI * e * e / 4;
	}
}, Ns = (e, t) => {
	ks[`symbol${_s(e)}`] = t;
}, Ps = (e) => {
	var { type: t = "circle", size: n = 64, sizeType: r = "area" } = e, i = Cs(Cs({}, Ds(e, bs)), {}, {
		type: t,
		size: n,
		sizeType: r
	}), a = "circle";
	typeof t == "string" && (a = t);
	var o = () => {
		var e = js(a), t = no().type(e).size(Ms(n, r, a))();
		if (t !== null) return t;
	}, { className: s, cx: c, cy: l } = i, u = Qi(i);
	return W(c) && W(l) && W(n) ? /*#__PURE__*/ v.createElement("path", xs({}, u, {
		className: I("recharts-symbols", s),
		transform: `translate(${c}, ${l})`,
		d: o()
	})) : null;
};
Ps.registerSymbol = Ns;
// node_modules/recharts/es6/util/types.js
var Fs = (e) => "radius" in e && "startAngle" in e && "endAngle" in e, Is = (e, t) => {
	if (!e || typeof e == "function" || typeof e == "boolean") return null;
	var n = e;
	if (/*#__PURE__*/ (0, v.isValidElement)(e) && (n = e.props), typeof n != "object" && typeof n != "function") return null;
	var r = {};
	return Object.keys(n).forEach((e) => {
		Ki(e) && typeof n[e] == "function" && (r[e] = t || ((t) => n[e](n, t)));
	}), r;
}, Ls = (e, t, n) => (r) => (e(t, n, r), null), Rs = (e, t, n) => {
	if (e === null || typeof e != "object" && typeof e != "function") return null;
	var r = null;
	return Object.keys(e).forEach((i) => {
		var a = e[i];
		Ki(i) && typeof a == "function" && (r ||= {}, r[i] = Ls(a, t, n));
	}), r;
};
// node_modules/recharts/es6/util/resolveDefaultProps.js
function zs(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Bs(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? zs(Object(n), !0).forEach(function(t) {
			Vs(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : zs(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Vs(e, t, n) {
	return (t = Hs(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Hs(e) {
	var t = Us(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Us(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function Ws(e, t) {
	var n = Bs({}, e), r = t;
	return Object.keys(t).reduce((e, t) => (e[t] === void 0 && r[t] !== void 0 && (e[t] = r[t]), e), n);
}
// node_modules/es-toolkit/dist/array/uniqBy.mjs
function Gs(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r = 0; r < e.length; r++) {
		let i = e[r], a = t(i, r, e);
		n.has(a) || n.set(a, i);
	}
	return Array.from(n.values());
}
// node_modules/es-toolkit/dist/function/ary.mjs
function Ks(e, t) {
	return function(...n) {
		return e.apply(this, n.slice(0, t));
	};
}
// node_modules/es-toolkit/dist/function/identity.mjs
function qs(e) {
	return e;
}
// node_modules/es-toolkit/dist/predicate/isLength.mjs
function Js(e) {
	return Number.isSafeInteger(e) && e >= 0;
}
// node_modules/es-toolkit/dist/compat/predicate/isArrayLike.mjs
function Ys(e) {
	return e != null && typeof e != "function" && Js(e.length);
}
// node_modules/es-toolkit/dist/compat/object/property.mjs
function Xs(e) {
	return function(t) {
		return ns(t, e);
	};
}
// node_modules/es-toolkit/dist/predicate/isPrimitive.mjs
function Zs(e) {
	return e == null || typeof e != "object" && typeof e != "function";
}
// node_modules/es-toolkit/dist/compat/_internal/getTag.mjs
function Qs(e) {
	return e == null ? e === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(e);
}
// node_modules/es-toolkit/dist/compat/_internal/tags.mjs
var $s = "[object RegExp]", ec = "[object String]", tc = "[object Number]", nc = "[object Boolean]", rc = "[object Arguments]", ic = "[object Symbol]", ac = "[object Date]", oc = "[object Map]", sc = "[object Set]", cc = "[object Array]", lc = "[object ArrayBuffer]", uc = "[object Object]", dc = "[object DataView]", fc = "[object Uint8Array]", pc = "[object Uint8ClampedArray]", mc = "[object Uint16Array]", hc = "[object Uint32Array]", gc = "[object Int8Array]", _c = "[object Int16Array]", vc = "[object Int32Array]", yc = "[object Float32Array]", bc = "[object Float64Array]";
// node_modules/es-toolkit/dist/compat/util/eq.mjs
function xc(e, t) {
	return e === t || Number.isNaN(e) && Number.isNaN(t);
}
// node_modules/es-toolkit/dist/compat/predicate/isObject.mjs
function Sc(e) {
	return e !== null && (typeof e == "object" || typeof e == "function");
}
// node_modules/es-toolkit/dist/compat/predicate/isMatchWith.mjs
function Cc(e, t, n) {
	return typeof n == "function" ? wc(e, t, function e(t, r, i, a, o, s) {
		let c = n(t, r, i, a, o, s);
		return c === void 0 ? wc(t, r, e, s, !1) : !!c;
	}, /* @__PURE__ */ new Map(), !0) : Cc(e, t, () => void 0);
}
function wc(e, t, n, r, i = !1) {
	if (t === e) return !0;
	switch (typeof t) {
		case "object": return Tc(e, t, n, r, i);
		case "function": return Object.keys(t).length > 0 ? wc(e, Object.assign({}, t), n, r, i) : xc(e, t);
		default: return Sc(e) && i ? typeof t != "string" || t === "" : xc(e, t);
	}
}
function Tc(e, t, n, r, i = !1) {
	if (t == null) return !0;
	if (Array.isArray(t)) return Dc(e, t, n, r);
	if (t instanceof Map) return Ec(e, t, n, r);
	if (t instanceof Set) return Oc(e, t, n, r);
	let a = Object.keys(t);
	if (e == null) return i && a.length === 0;
	if (i) Zs(e) && (e = Object(e));
	else {
		if (Qs(t) === "[object Error]") return Qs(e) === "[object Error]" && e.name === t.name && e.message === t.message;
		let n = Qs(e);
		if (n !== "[object Object]" && n !== "[object Arguments]") return !1;
	}
	if (a.length === 0) return !0;
	if (r?.has(t)) return r.get(t) === e;
	r?.set(t, e);
	try {
		for (let i = 0; i < a.length; i++) {
			let o = a[i];
			if (!(o in e) || t[o] === void 0 && e[o] !== void 0 || t[o] === null && e[o] !== null || !n(e[o], t[o], o, e, t, r)) return !1;
		}
		return !0;
	} finally {
		r?.delete(t);
	}
}
function Ec(e, t, n, r) {
	if (t.size === 0) return !0;
	if (!(e instanceof Map)) return !1;
	for (let [i, a] of t.entries()) if (n(e.get(i), a, i, e, t, r) === !1) return !1;
	return !0;
}
function Dc(e, t, n, r) {
	if (t.length === 0) return !0;
	if (!Array.isArray(e)) return !1;
	let i = /* @__PURE__ */ new Set();
	for (let a = 0; a < t.length; a++) {
		let o = t[a], s = !1;
		for (let c = 0; c < e.length; c++) {
			if (i.has(c)) continue;
			let l = e[c], u = !1;
			if (n(l, o, a, e, t, r) && (u = !0), u) {
				i.add(c), s = !0;
				break;
			}
		}
		if (!s) return !1;
	}
	return !0;
}
function Oc(e, t, n, r) {
	return t.size === 0 || e instanceof Set && Dc([...e], [...t], n, r);
}
// node_modules/es-toolkit/dist/compat/predicate/isMatch.mjs
function kc(e, t) {
	return Cc(e, t, () => void 0);
}
// node_modules/es-toolkit/dist/compat/_internal/getSymbols.mjs
function Ac(e) {
	return Object.getOwnPropertySymbols(e).filter((t) => Object.prototype.propertyIsEnumerable.call(e, t));
}
// node_modules/es-toolkit/dist/_internal/globalThis.mjs
var jc = typeof globalThis == "object" && globalThis || typeof window == "object" && window || typeof self == "object" && self || typeof global == "object" && global || (function() {
	return this;
})();
// node_modules/es-toolkit/dist/predicate/isBuffer.mjs
function Mc(e) {
	return jc.Buffer !== void 0 && jc.Buffer.isBuffer(e);
}
// node_modules/es-toolkit/dist/compat/predicate/isBuffer.mjs
function Nc(e) {
	return Mc(e);
}
// node_modules/es-toolkit/dist/predicate/isTypedArray.mjs
function Pc(e) {
	return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
// node_modules/es-toolkit/dist/compat/predicate/isTypedArray.mjs
function Fc(e) {
	return Pc(e);
}
// node_modules/es-toolkit/dist/compat/object/cloneDeepWith.mjs
function Ic(e, t) {
	return Lc(e, void 0, e, /* @__PURE__ */ new Map(), t);
}
function Lc(e, t, n, r, i) {
	if (i != null) {
		let a = i(e, t, n, r);
		if (a !== void 0) return a;
	}
	if (Zs(e)) return e;
	if (r.has(e)) return r.get(e);
	if (Array.isArray(e)) {
		let t = Array(e.length);
		r.set(e, t);
		for (let a = 0; a < e.length; a++) t[a] = Lc(e[a], a, n, r, i);
		return Jo(e, "index") && (t.index = e.index), Jo(e, "input") && (t.input = e.input), t;
	}
	if (e instanceof Date) return new Date(e.getTime());
	if (e instanceof RegExp) {
		let t = new RegExp(e.source, e.flags);
		return t.lastIndex = e.lastIndex, t;
	}
	if (e instanceof Map) {
		let t = /* @__PURE__ */ new Map();
		return r.set(e, t), e.forEach((e, a) => {
			t.set(a, Lc(e, a, n, r, i));
		}), t;
	}
	if (e instanceof Set) {
		let t = /* @__PURE__ */ new Set();
		return r.set(e, t), e.forEach((e) => {
			t.add(Lc(e, void 0, n, r, i));
		}), t;
	}
	if (Nc(e)) return e.subarray();
	if (Fc(e)) {
		let t = new (Object.getPrototypeOf(e)).constructor(e.length);
		r.set(e, t);
		for (let a = 0; a < e.length; a++) t[a] = Lc(e[a], a, n, r, i);
		return t;
	}
	if (e instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && e instanceof SharedArrayBuffer) return e.slice(0);
	if (e instanceof DataView) {
		let t = new DataView(e.buffer.slice(0), e.byteOffset, e.byteLength);
		return r.set(e, t), Rc(t, e, n, r, i), t;
	}
	if (typeof File < "u" && e instanceof File) {
		let t = new File([e], e.name, { type: e.type });
		return r.set(e, t), Rc(t, e, n, r, i), t;
	}
	if (typeof Blob < "u" && e instanceof Blob) {
		let t = new Blob([e], { type: e.type });
		return r.set(e, t), Rc(t, e, n, r, i), t;
	}
	let a = Qs(e);
	if (a === "[object Error]") return e === n ? {} : e;
	switch (a) {
		case tc:
		case ec:
		case nc: {
			let t = new e.constructor(e.valueOf());
			return r.set(e, t), Rc(t, e, n, r, i), t;
		}
		case rc: {
			let t = {};
			return r.set(e, t), Rc(t, e, n, r, i), t.length = e.length, t[Symbol.iterator] = e[Symbol.iterator], t;
		}
	}
	if (typeof e == "object" && zc(a)) {
		let t = a === "[object Object]" && typeof e.constructor != "function" ? {} : Object.create(Object.getPrototypeOf(e));
		return r.set(e, t), Rc(t, e, n, r, i), t;
	}
	return e;
}
function Rc(e, t, n, r, i) {
	let a = [...Object.keys(t), ...Ac(t)];
	for (let o = 0; o < a.length; o++) {
		let s = a[o], c = Object.getOwnPropertyDescriptor(e, s);
		(c == null || c.writable) && (e[s] = Lc(t[s], s, n, r, i));
	}
}
function zc(e) {
	switch (e) {
		case rc:
		case cc:
		case lc:
		case dc:
		case nc:
		case ac:
		case yc:
		case bc:
		case gc:
		case _c:
		case vc:
		case oc:
		case tc:
		case uc:
		case $s:
		case sc:
		case ec:
		case ic:
		case fc:
		case pc:
		case mc:
		case hc: return !0;
		default: return !1;
	}
}
// node_modules/es-toolkit/dist/compat/object/cloneDeep.mjs
function Bc(e) {
	return Ic(e);
}
// node_modules/es-toolkit/dist/compat/predicate/matches.mjs
function Vc(e) {
	return e = Bc(e), (t) => kc(t, e);
}
// node_modules/es-toolkit/dist/compat/_internal/isIndex.mjs
var Hc = /^(?:0|[1-9]\d*)$/;
function Uc(e, t = 2 ** 53 - 1) {
	switch (typeof e) {
		case "number": return Number.isInteger(e) && e >= 0 && e < t;
		case "symbol": return !1;
		case "string": return Hc.test(e);
	}
}
// node_modules/es-toolkit/dist/compat/predicate/isArguments.mjs
function Wc(e) {
	return typeof e == "object" && !!e && Qs(e) === "[object Arguments]";
}
// node_modules/es-toolkit/dist/compat/object/has.mjs
function Gc(e, t) {
	let n;
	if (n = Array.isArray(t) ? t : typeof t == "string" && Xo(t) && !(t in Object(e)) ? ts(t) : [t], n.length === 0) return !1;
	let r = e;
	for (let e = 0; e < n.length; e++) {
		let t = Zo(n[e]);
		if ((r == null || !Jo(r, t)) && !((Array.isArray(r) || Wc(r)) && Uc(t) && Number(t) < r.length)) return !1;
		r = r[t];
	}
	return !0;
}
// node_modules/es-toolkit/dist/compat/predicate/matchesProperty.mjs
function Kc(e, t) {
	switch (typeof e) {
		case "object":
			Object.is(e?.valueOf(), -0) && (e = "-0");
			break;
		case "number": e = Zo(e);
	}
	return t = Bc(t), function(n) {
		let r = ns(n, e);
		return r === void 0 ? Gc(n, e) : t === void 0 ? r === void 0 : kc(r, t);
	};
}
// node_modules/es-toolkit/dist/compat/util/iteratee.mjs
function qc(e) {
	if (e == null) return qs;
	switch (typeof e) {
		case "function": return e;
		case "object": return Array.isArray(e) && e.length === 2 ? Kc(e[0], e[1]) : Vc(e);
		default: return Xs(e);
	}
}
// node_modules/es-toolkit/dist/compat/_internal/normalizeZero.mjs
function Jc(e) {
	return e === 0 ? 0 : e;
}
// node_modules/es-toolkit/dist/compat/array/uniqBy.mjs
function Yc(e, t = qs) {
	return Ys(e) ? Gs(Array.from(e), Ks(qc(t), 1)).map(Jc) : [];
}
// node_modules/recharts/es6/util/payload/getUniqPayload.js
function Xc(e, t, n) {
	return t === !0 ? Yc(e, n) : typeof t == "function" ? Yc(e, t) : e;
}
// node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.production.js
var Zc = /* @__PURE__ */ o(((e) => {
	var t = d();
	function n(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var r = typeof Object.is == "function" ? Object.is : n, i = t.useState, a = t.useEffect, o = t.useLayoutEffect, s = t.useDebugValue;
	function c(e, t) {
		var n = t(), r = i({ inst: {
			value: n,
			getSnapshot: t
		} }), c = r[0].inst, u = r[1];
		return o(function() {
			c.value = n, c.getSnapshot = t, l(c) && u({ inst: c });
		}, [
			e,
			n,
			t
		]), a(function() {
			return l(c) && u({ inst: c }), e(function() {
				l(c) && u({ inst: c });
			});
		}, [e]), s(n), n;
	}
	function l(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !r(e, n);
		} catch {
			return !0;
		}
	}
	function u(e, t) {
		return t();
	}
	var f = typeof window > "u" || window.document === void 0 || window.document.createElement === void 0 ? u : c;
	e.useSyncExternalStore = t.useSyncExternalStore === void 0 ? f : t.useSyncExternalStore;
})), Qc = /* @__PURE__ */ o(((e, t) => {
	t.exports = Zc();
})), $c = /* @__PURE__ */ o(((e) => {
	var t = d(), n = Qc();
	function r(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var i = typeof Object.is == "function" ? Object.is : r, a = n.useSyncExternalStore, o = t.useRef, s = t.useEffect, c = t.useMemo, l = t.useDebugValue;
	e.useSyncExternalStoreWithSelector = function(e, t, n, r, u) {
		var d = o(null);
		if (d.current === null) {
			var f = {
				hasValue: !1,
				value: null
			};
			d.current = f;
		} else f = d.current;
		d = c(function() {
			function e(e) {
				if (!a) {
					if (a = !0, o = e, e = r(e), u !== void 0 && f.hasValue) {
						var t = f.value;
						if (u(t, e)) return s = t;
					}
					return s = e;
				}
				if (t = s, i(o, e)) return t;
				var n = r(e);
				return u !== void 0 && u(t, n) ? (o = e, t) : (o = e, s = n);
			}
			var a = !1, o, s, c = n === void 0 ? null : n;
			return [function() {
				return e(t());
			}, c === null ? void 0 : function() {
				return e(c());
			}];
		}, [
			t,
			n,
			r,
			u
		]);
		var p = a(e, d[0], d[1]);
		return s(function() {
			f.hasValue = !0, f.value = p;
		}, [p]), l(p), p;
	};
})), el = /* @__PURE__ */ o(((e, t) => {
	t.exports = $c();
})), tl = /*#__PURE__*/ (0, v.createContext)(null), nl = el(), rl = (e) => e, il = () => {
	var e = (0, v.useContext)(tl);
	return e ? e.store.dispatch : rl;
}, al = () => {}, ol = () => al, sl = (e, t) => e === t;
function G(e) {
	var t = (0, v.useContext)(tl), n = (0, v.useMemo)(() => t ? (t) => {
		if (t != null) return e(t);
	} : al, [t, e]);
	return (0, nl.useSyncExternalStoreWithSelector)(t ? t.subscription.addNestedSub : ol, t ? t.store.getState : al, t ? t.store.getState : al, n, sl);
}
// node_modules/recharts/node_modules/reselect/dist/reselect.mjs
function cl(e, t = `expected a function, instead received ${typeof e}`) {
	if (typeof e != "function") throw TypeError(t);
}
function ll(e, t = `expected an object, instead received ${typeof e}`) {
	if (typeof e != "object") throw TypeError(t);
}
function ul(e, t = "expected all items to be functions, instead received the following types: ") {
	if (!e.every((e) => typeof e == "function")) {
		let n = e.map((e) => typeof e == "function" ? `function ${e.name || "unnamed"}()` : typeof e).join(", ");
		throw TypeError(`${t}[${n}]`);
	}
}
var dl = (e) => Array.isArray(e) ? e : [e];
function fl(e) {
	let t = Array.isArray(e[0]) ? e[0] : e;
	return ul(t, "createSelector expects all input-selectors to be functions, but received the following types: "), t;
}
function pl(e, t) {
	let n = [], { length: r } = e;
	for (let i = 0; i < r; i++) n.push(e[i].apply(null, t));
	return n;
}
var ml = class {
	constructor(e) {
		this.value = e;
	}
	deref() {
		return this.value;
	}
}, hl = typeof WeakRef < "u" ? WeakRef : ml, gl = 0, _l = 1;
function vl() {
	return {
		s: gl,
		v: void 0,
		o: null,
		p: null
	};
}
function yl(e, t = {}) {
	let n = vl(), { resultEqualityCheck: r } = t, i, a = 0;
	function o() {
		let t = n, { length: o } = arguments;
		for (let e = 0, n = o; e < n; e++) {
			let n = arguments[e];
			if (typeof n == "function" || typeof n == "object" && n) {
				let e = t.o;
				e === null && (t.o = e = /* @__PURE__ */ new WeakMap());
				let r = e.get(n);
				r === void 0 ? (t = vl(), e.set(n, t)) : t = r;
			} else {
				let e = t.p;
				e === null && (t.p = e = /* @__PURE__ */ new Map());
				let r = e.get(n);
				r === void 0 ? (t = vl(), e.set(n, t)) : t = r;
			}
		}
		let s = t, c;
		if (t.s === _l) c = t.v;
		else if (c = e.apply(null, arguments), a++, r) {
			let e = i?.deref?.() ?? i;
			e != null && r(e, c) && (c = e, a !== 0 && a--), i = typeof c == "object" && c || typeof c == "function" ? new hl(c) : c;
		}
		return s.s = _l, s.v = c, c;
	}
	return o.clearCache = () => {
		n = vl(), o.resetResultsCount();
	}, o.resultsCount = () => a, o.resetResultsCount = () => {
		a = 0;
	}, o;
}
function bl(e, ...t) {
	let n = typeof e == "function" ? {
		memoize: e,
		memoizeOptions: t
	} : e, r = (...e) => {
		let t = 0, r = 0, i, a = {}, o = e.pop();
		typeof o == "object" && (a = o, o = e.pop()), cl(o, `createSelector expects an output function after the inputs, but received: [${typeof o}]`);
		let { memoize: s, memoizeOptions: c = [], argsMemoize: l = yl, argsMemoizeOptions: u = [], devModeChecks: d = {} } = {
			...n,
			...a
		}, f = dl(c), p = dl(u), m = fl(e), h = s(function() {
			return t++, o.apply(null, arguments);
		}, ...f), g = l(function() {
			r++;
			let e = pl(m, arguments);
			return i = h.apply(null, e), i;
		}, ...p);
		return Object.assign(g, {
			resultFunc: o,
			memoizedResultFunc: h,
			dependencies: m,
			dependencyRecomputations: () => r,
			resetDependencyRecomputations: () => {
				r = 0;
			},
			lastResult: () => i,
			recomputations: () => t,
			resetRecomputations: () => {
				t = 0;
			},
			memoize: s,
			argsMemoize: l
		});
	};
	return Object.assign(r, { withTypes: () => r }), r;
}
var K = /* @__PURE__ */ bl(yl), xl = Object.assign((e, t = K) => {
	ll(e, `createStructuredSelector expects first argument to be an object where each property is a selector, instead received a ${typeof e}`);
	let n = Object.keys(e);
	return t(n.map((t) => e[t]), (...e) => e.reduce((e, t, r) => (e[n[r]] = t, e), {}));
}, { withTypes: () => xl });
// node_modules/es-toolkit/dist/array/flatten.mjs
function Sl(e, t = 1) {
	let n = [], r = Math.floor(t), i = (e, t) => {
		for (let a = 0; a < e.length; a++) {
			let o = e[a];
			Array.isArray(o) && t < r ? i(o, t + 1) : n.push(o);
		}
	};
	return i(e, 0), n;
}
// node_modules/es-toolkit/dist/compat/_internal/isIterateeCall.mjs
function Cl(e, t, n) {
	return Sc(n) && (typeof t == "number" && Ys(n) && Uc(t) && t < n.length || typeof t == "string" && t in n) ? xc(n[t], e) : !1;
}
// node_modules/es-toolkit/dist/compat/_internal/objectValues.mjs
function wl(e) {
	let t = Object.keys(e), n = Array(t.length);
	for (let r = 0; r < t.length; r++) n[r] = e[t[r]];
	return n;
}
// node_modules/es-toolkit/dist/compat/_internal/compareValues.mjs
function Tl(e) {
	return typeof e == "symbol" ? 1 : e === null ? 2 : e === void 0 ? 3 : e === e ? 0 : 4;
}
var El = (e, t, n) => {
	if (e !== t) {
		let r = Tl(e), i = Tl(t);
		if (r === i && r === 0) {
			if (e < t) return n === "desc" ? 1 : -1;
			if (e > t) return n === "desc" ? -1 : 1;
		}
		return n === "desc" ? i - r : r - i;
	}
	return 0;
}, Dl = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, Ol = /^\w*$/;
function kl(e, t) {
	return Array.isArray(e) ? !1 : typeof e == "number" || typeof e == "boolean" || e == null || Qo(e) ? !0 : typeof e == "string" && (Ol.test(e) || !Dl.test(e)) || t != null && Jo(t, e);
}
// node_modules/es-toolkit/dist/compat/array/orderBy.mjs
function Al(e, t, n, r) {
	if (e == null) return [];
	n = r ? void 0 : n, Array.isArray(e) || (e = Ys(e) ? Array.from(e) : wl(e)), Array.isArray(t) || (t = t == null ? [null] : [t]), t.length === 0 && (t = [null]), Array.isArray(n) || (n = n == null ? [] : [n]), n = n.map((e) => String(e));
	let i = (e, t) => {
		let n = e, r = 0;
		for (; r < t.length && n != null; ++r) n = n[t[r]];
		return r > 0 && r === t.length ? n : void 0;
	}, a = (e, t) => {
		if (e == null) return t;
		if (t != null) return typeof e == "object" && "key" in e ? Jo(t, e.key) ? t[e.key] : i(t, e.path) : typeof e == "function" ? e(t) : Array.isArray(e) ? i(t, e) : t[e];
	}, o = t.map((e) => (Array.isArray(e) && e.length === 1 && (e = e[0]), e == null || typeof e == "function" || Array.isArray(e) || kl(e) ? e : {
		key: e,
		path: ts(e)
	}));
	return e.map((e) => ({
		original: e,
		criteria: o.map((t) => a(t, e))
	})).slice().sort((e, t) => {
		for (let r = 0; r < o.length; r++) {
			let i = El(e.criteria[r], t.criteria[r], n[r]);
			if (i !== 0) return i;
		}
		return 0;
	}).map((e) => e.original);
}
// node_modules/es-toolkit/dist/compat/array/sortBy.mjs
function jl(e, ...t) {
	let n = t.length;
	return n > 1 && Cl(e, t[0], t[1]) ? t = [] : n > 2 && Cl(t[0], t[1], t[2]) && (t = [t[0]]), Al(e, Sl(t), ["asc"]);
}
// node_modules/recharts/es6/state/selectors/legendSelectors.js
var Ml = (e) => e.legend.settings, Nl = (e) => e.legend.size;
K([(e) => e.legend.payload, Ml], (e, t) => {
	var { itemSorter: n } = t, r = e.flat(1);
	return n ? jl(r, n) : r;
});
// node_modules/recharts/es6/util/useElementOffset.js
var Pl = 1;
function Fl() {
	var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], [t, n] = (0, v.useState)({
		height: 0,
		left: 0,
		top: 0,
		width: 0
	});
	return [t, (0, v.useCallback)((e) => {
		if (e != null) {
			var r = e.getBoundingClientRect(), i = {
				height: r.height,
				left: r.left,
				top: r.top,
				width: r.width
			};
			(Math.abs(i.height - t.height) > Pl || Math.abs(i.left - t.left) > Pl || Math.abs(i.top - t.top) > Pl || Math.abs(i.width - t.width) > Pl) && n({
				height: i.height,
				left: i.left,
				top: i.top,
				width: i.width
			});
		}
	}, [
		t.width,
		t.height,
		t.top,
		t.left,
		...e
	])];
}
// node_modules/redux/dist/redux.mjs
function Il(e) {
	return `Minified Redux error #${e}; visit https://redux.js.org/Errors?code=${e} for the full message or use the non-minified dev environment for full errors. `;
}
var Ll = typeof Symbol == "function" && Symbol.observable || "@@observable", Rl = () => Math.random().toString(36).substring(7).split("").join("."), zl = {
	INIT: `@@redux/INIT${/* @__PURE__ */ Rl()}`,
	REPLACE: `@@redux/REPLACE${/* @__PURE__ */ Rl()}`,
	PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${Rl()}`
};
function Bl(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	for (; Object.getPrototypeOf(t) !== null;) t = Object.getPrototypeOf(t);
	return Object.getPrototypeOf(e) === t || Object.getPrototypeOf(e) === null;
}
function Vl(e, t, n) {
	if (typeof e != "function") throw Error(Il(2));
	if (typeof t == "function" && typeof n == "function" || typeof n == "function" && typeof arguments[3] == "function") throw Error(Il(0));
	if (typeof t == "function" && n === void 0 && (n = t, t = void 0), n !== void 0) {
		if (typeof n != "function") throw Error(Il(1));
		return n(Vl)(e, t);
	}
	let r = e, i = t, a = /* @__PURE__ */ new Map(), o = a, s = 0, c = !1;
	function l() {
		o === a && (o = /* @__PURE__ */ new Map(), a.forEach((e, t) => {
			o.set(t, e);
		}));
	}
	function u() {
		if (c) throw Error(Il(3));
		return i;
	}
	function d(e) {
		if (typeof e != "function") throw Error(Il(4));
		if (c) throw Error(Il(5));
		let t = !0;
		l();
		let n = s++;
		return o.set(n, e), function() {
			if (t) {
				if (c) throw Error(Il(6));
				t = !1, l(), o.delete(n), a = null;
			}
		};
	}
	function f(e) {
		if (!Bl(e)) throw Error(Il(7));
		if (e.type === void 0) throw Error(Il(8));
		if (typeof e.type != "string") throw Error(Il(17));
		if (c) throw Error(Il(9));
		try {
			c = !0, i = r(i, e);
		} finally {
			c = !1;
		}
		return (a = o).forEach((e) => {
			e();
		}), e;
	}
	function p(e) {
		if (typeof e != "function") throw Error(Il(10));
		r = e, f({ type: zl.REPLACE });
	}
	function m() {
		let e = d;
		return {
			subscribe(t) {
				if (typeof t != "object" || !t) throw Error(Il(11));
				function n() {
					let e = t;
					e.next && e.next(u());
				}
				return n(), { unsubscribe: e(n) };
			},
			[Ll]() {
				return this;
			}
		};
	}
	return f({ type: zl.INIT }), {
		dispatch: f,
		subscribe: d,
		getState: u,
		replaceReducer: p,
		[Ll]: m
	};
}
function Hl(e) {
	Object.keys(e).forEach((t) => {
		let n = e[t];
		if (n(void 0, { type: zl.INIT }) === void 0) throw Error(Il(12));
		if (n(void 0, { type: zl.PROBE_UNKNOWN_ACTION() }) === void 0) throw Error(Il(13));
	});
}
function Ul(e) {
	let t = Object.keys(e), n = {};
	for (let r = 0; r < t.length; r++) {
		let i = t[r];
		typeof e[i] == "function" && (n[i] = e[i]);
	}
	let r = Object.keys(n), i;
	try {
		Hl(n);
	} catch (e) {
		i = e;
	}
	return function(e = {}, t) {
		if (i) throw i;
		let a = !1, o = {};
		for (let i = 0; i < r.length; i++) {
			let s = r[i], c = n[s], l = e[s], u = c(l, t);
			if (u === void 0) throw t && t.type, Error(Il(14));
			o[s] = u, a ||= u !== l;
		}
		return a ||= r.length !== Object.keys(e).length, a ? o : e;
	};
}
function Wl(...e) {
	return e.length === 0 ? (e) => e : e.length === 1 ? e[0] : e.reduce((e, t) => (...n) => e(t(...n)));
}
function Gl(...e) {
	return (t) => (n, r) => {
		let i = t(n, r), a = () => {
			throw Error(Il(15));
		}, o = {
			getState: i.getState,
			dispatch: (e, ...t) => a(e, ...t)
		};
		return a = Wl(...e.map((e) => e(o)))(i.dispatch), {
			...i,
			dispatch: a
		};
	};
}
function Kl(e) {
	return Bl(e) && "type" in e && typeof e.type == "string";
}
// node_modules/immer/dist/immer.mjs
var ql = Symbol.for("immer-nothing"), Jl = Symbol.for("immer-draftable"), Yl = Symbol.for("immer-state");
function Xl(e, ...t) {
	throw Error(`[Immer] minified error nr: ${e}. Full error at: https://bit.ly/3cXEKWf`);
}
var Zl = Object, Ql = Zl.getPrototypeOf, $l = "constructor", eu = "prototype", tu = "configurable", nu = "enumerable", ru = "writable", iu = "value", au = (e) => !!e && !!e[Yl];
function ou(e) {
	return e ? lu(e) || gu(e) || !!e[Jl] || !!e[$l]?.[Jl] || _u(e) || vu(e) : !1;
}
var su = Zl[eu][$l].toString(), cu = /* @__PURE__ */ new WeakMap();
function lu(e) {
	if (!e || !yu(e)) return !1;
	let t = Ql(e);
	if (t === null || t === Zl[eu]) return !0;
	let n = Zl.hasOwnProperty.call(t, $l) && t[$l];
	if (n === Object) return !0;
	if (!bu(n)) return !1;
	let r = cu.get(n);
	return r === void 0 && (r = Function.toString.call(n), cu.set(n, r)), r === su;
}
function uu(e, t, n = !0) {
	du(e) === 0 ? (n ? Reflect.ownKeys(e) : Zl.keys(e)).forEach((n) => {
		t(n, e[n], e);
	}) : e.forEach((n, r) => t(r, n, e));
}
function du(e) {
	let t = e[Yl];
	return t ? t.type_ : gu(e) ? 1 : _u(e) ? 2 : vu(e) ? 3 : 0;
}
var fu = (e, t, n = du(e)) => n === 2 ? e.has(t) : Zl[eu].hasOwnProperty.call(e, t), pu = (e, t, n = du(e)) => n === 2 ? e.get(t) : e[t], mu = (e, t, n, r = du(e)) => {
	r === 2 ? e.set(t, n) : r === 3 ? e.add(n) : e[t] = n;
};
function hu(e, t) {
	return e === t ? e !== 0 || 1 / e == 1 / t : e !== e && t !== t;
}
var gu = Array.isArray, _u = (e) => e instanceof Map, vu = (e) => e instanceof Set, yu = (e) => typeof e == "object", bu = (e) => typeof e == "function", xu = (e) => typeof e == "boolean";
function Su(e) {
	let t = +e;
	return Number.isInteger(t) && String(t) === e;
}
var Cu = (e) => e.copy_ || e.base_, wu = (e) => e.modified_ ? e.copy_ : e.base_;
function Tu(e, t) {
	if (_u(e)) return new Map(e);
	if (vu(e)) return new Set(e);
	if (gu(e)) return Array[eu].slice.call(e);
	let n = lu(e);
	if (t === !0 || t === "class_only" && !n) {
		let t = Zl.getOwnPropertyDescriptors(e);
		delete t[Yl];
		let n = Reflect.ownKeys(t);
		for (let r = 0; r < n.length; r++) {
			let i = n[r], a = t[i];
			a[ru] === !1 && (a[ru] = !0, a[tu] = !0), (a.get || a.set) && (t[i] = {
				[tu]: !0,
				[ru]: !0,
				[nu]: a[nu],
				[iu]: e[i]
			});
		}
		return Zl.create(Ql(e), t);
	}
	{
		let t = Ql(e);
		if (t !== null && n) return { ...e };
		let r = Zl.create(t);
		return Zl.assign(r, e);
	}
}
function Eu(e, t = !1) {
	return ku(e) || au(e) || !ou(e) || (du(e) > 1 && Zl.defineProperties(e, {
		set: Ou,
		add: Ou,
		clear: Ou,
		delete: Ou
	}), Zl.freeze(e), t && uu(e, (e, t) => {
		Eu(t, !0);
	}, !1)), e;
}
function Du() {
	Xl(2);
}
var Ou = { [iu]: Du };
function ku(e) {
	return e === null || !yu(e) || Zl.isFrozen(e);
}
var Au = "MapSet", ju = "Patches", Mu = "ArrayMethods", Nu = {};
function Pu(e) {
	let t = Nu[e];
	return t || Xl(0, e), t;
}
var Fu = (e) => !!Nu[e], Iu, Lu = () => Iu, Ru = (e, t) => ({
	drafts_: [],
	parent_: e,
	immer_: t,
	canAutoFreeze_: !0,
	unfinalizedDrafts_: 0,
	handledSet_: /* @__PURE__ */ new Set(),
	processedForPatches_: /* @__PURE__ */ new Set(),
	mapSetPlugin_: Fu(Au) ? Pu(Au) : void 0,
	arrayMethodsPlugin_: Fu(Mu) ? Pu(Mu) : void 0
});
function zu(e, t) {
	t && (e.patchPlugin_ = Pu(ju), e.patches_ = [], e.inversePatches_ = [], e.patchListener_ = t);
}
function Bu(e) {
	Vu(e), e.drafts_.forEach(Uu), e.drafts_ = null;
}
function Vu(e) {
	e === Iu && (Iu = e.parent_);
}
var Hu = (e) => Iu = Ru(Iu, e);
function Uu(e) {
	let t = e[Yl];
	t.type_ === 0 || t.type_ === 1 ? t.revoke_() : t.revoked_ = !0;
}
function Wu(e, t) {
	t.unfinalizedDrafts_ = t.drafts_.length;
	let n = t.drafts_[0];
	if (e !== void 0 && e !== n) {
		n[Yl].modified_ && (Bu(t), Xl(4)), ou(e) && (e = Gu(t, e));
		let { patchPlugin_: r } = t;
		r && r.generateReplacementPatches_(n[Yl].base_, e, t);
	} else e = Gu(t, n);
	return Ku(t, e, !0), Bu(t), t.patches_ && t.patchListener_(t.patches_, t.inversePatches_), e === ql ? void 0 : e;
}
function Gu(e, t) {
	if (ku(t)) return t;
	let n = t[Yl];
	if (!n) return ed(t, e.handledSet_, e);
	if (!Ju(n, e)) return t;
	if (!n.modified_) return n.base_;
	if (!n.finalized_) {
		let { callbacks_: t } = n;
		if (t) for (; t.length > 0;) t.pop()(e);
		Qu(n, e);
	}
	return n.copy_;
}
function Ku(e, t, n = !1) {
	!e.parent_ && e.immer_.autoFreeze_ && e.canAutoFreeze_ && Eu(t, n);
}
function qu(e) {
	e.finalized_ = !0, e.scope_.unfinalizedDrafts_--;
}
var Ju = (e, t) => e.scope_ === t, Yu = [];
function Xu(e, t, n, r) {
	let i = Cu(e), a = e.type_;
	if (r !== void 0 && pu(i, r, a) === t) {
		mu(i, r, n, a);
		return;
	}
	if (!e.draftLocations_) {
		let t = e.draftLocations_ = /* @__PURE__ */ new Map();
		uu(i, (e, n) => {
			if (au(n)) {
				let r = t.get(n) || [];
				r.push(e), t.set(n, r);
			}
		});
	}
	let o = e.draftLocations_.get(t) ?? Yu;
	for (let e of o) mu(i, e, n, a);
}
function Zu(e, t, n) {
	e.callbacks_.push(function(r) {
		let i = t;
		if (!i || !Ju(i, r)) return;
		r.mapSetPlugin_?.fixSetContents(i);
		let a = wu(i);
		Xu(e, i.draft_ ?? i, a, n), Qu(i, r);
	});
}
function Qu(e, t) {
	if (e.modified_ && !e.finalized_ && (e.type_ === 3 || e.type_ === 1 && e.allIndicesReassigned_ || (e.assigned_?.size ?? 0) > 0)) {
		let { patchPlugin_: n } = t;
		if (n) {
			let r = n.getPath(e);
			r && n.generatePatches_(e, r, t);
		}
		qu(e);
	}
}
function $u(e, t, n) {
	let { scope_: r } = e;
	if (au(n)) {
		let i = n[Yl];
		Ju(i, r) && i.callbacks_.push(function() {
			sd(e), Xu(e, n, wu(i), t);
		});
	} else ou(n) && e.callbacks_.push(function() {
		let i = Cu(e);
		e.type_ === 3 ? i.has(n) && ed(n, r.handledSet_, r) : pu(i, t, e.type_) === n && r.drafts_.length > 1 && (e.assigned_.get(t) ?? !1) === !0 && e.copy_ && ed(pu(e.copy_, t, e.type_), r.handledSet_, r);
	});
}
function ed(e, t, n) {
	return !n.immer_.autoFreeze_ && n.unfinalizedDrafts_ < 1 || au(e) || t.has(e) || !ou(e) || ku(e) || (t.add(e), uu(e, (r, i) => {
		if (au(i)) {
			let t = i[Yl];
			Ju(t, n) && (mu(e, r, wu(t), e.type_), qu(t));
		} else ou(i) && ed(i, t, n);
	})), e;
}
function q(e, t) {
	let n = gu(e), r = {
		type_: +!!n,
		scope_: t ? t.scope_ : Lu(),
		modified_: !1,
		finalized_: !1,
		assigned_: void 0,
		parent_: t,
		base_: e,
		draft_: null,
		copy_: null,
		revoke_: null,
		isManual_: !1,
		callbacks_: void 0
	}, i = r, a = J;
	n && (i = [r], a = td);
	let { revoke: o, proxy: s } = Proxy.revocable(i, a);
	return r.draft_ = s, r.revoke_ = o, [s, r];
}
var J = {
	get(e, t) {
		if (t === Yl) return e;
		let n = e.scope_.arrayMethodsPlugin_, r = e.type_ === 1 && typeof t == "string";
		if (r && n?.isArrayOperationMethod(t)) return n.createMethodInterceptor(e, t);
		let i = Cu(e);
		if (!fu(i, t, e.type_)) return id(e, i, t);
		let a = i[t];
		if (e.finalized_ || !ou(a) || r && e.operationMethod && n?.isMutatingArrayMethod(e.operationMethod) && Su(t)) return a;
		if (a === nd(e.base_, t) || rd(e, t, a)) {
			sd(e);
			let n = e.type_ === 1 ? +t : t, r = ld(e.scope_, a, e, n);
			return e.copy_[n] = r;
		}
		return a;
	},
	has(e, t) {
		return t in Cu(e);
	},
	ownKeys(e) {
		return Reflect.ownKeys(Cu(e));
	},
	set(e, t, n) {
		let r = ad(Cu(e), t);
		if (r?.set) return r.set.call(e.draft_, n), !0;
		if (!e.modified_) {
			let r = nd(Cu(e), t), i = r?.[Yl];
			if (i && i.base_ === n) return e.copy_[t] = n, e.assigned_.delete(t), !0;
			if (hu(n, r) && (n !== void 0 || fu(e.base_, t, e.type_))) return !0;
			sd(e), od(e);
		}
		return e.copy_[t] === n && (n !== void 0 || fu(e.copy_, t, e.type_)) || Number.isNaN(n) && Number.isNaN(e.copy_[t]) || (e.copy_[t] = n, e.assigned_.set(t, !0), $u(e, t, n)), !0;
	},
	deleteProperty(e, t) {
		return sd(e), nd(e.base_, t) !== void 0 || t in e.base_ ? (e.assigned_.set(t, !1), od(e)) : e.assigned_.delete(t), e.copy_ && delete e.copy_[t], !0;
	},
	getOwnPropertyDescriptor(e, t) {
		let n = Cu(e), r = Reflect.getOwnPropertyDescriptor(n, t);
		return r && {
			[ru]: !0,
			[tu]: e.type_ !== 1 || t !== "length",
			[nu]: r[nu],
			[iu]: n[t]
		};
	},
	defineProperty() {
		Xl(11);
	},
	getPrototypeOf(e) {
		return Ql(e.base_);
	},
	setPrototypeOf() {
		Xl(12);
	}
}, td = {};
for (let e in J) {
	let t = J[e];
	td[e] = function() {
		let e = arguments;
		return e[0] = e[0][0], t.apply(this, e);
	};
}
td.deleteProperty = function(e, t) {
	return td.set.call(this, e, t, void 0);
}, td.set = function(e, t, n) {
	return J.set.call(this, e[0], t, n, e[0]);
};
function nd(e, t) {
	let n = e[Yl];
	return (n ? Cu(n) : e)[t];
}
function rd(e, t, n) {
	return e.type_ !== 1 || !e.allIndicesReassigned_ || !ou(n) || n[Yl] ? !1 : e.baseRefs_.has(n);
}
function id(e, t, n) {
	let r = ad(t, n);
	return r ? iu in r ? r[iu] : r.get?.call(e.draft_) : void 0;
}
function ad(e, t) {
	if (!(t in e)) return;
	let n = Ql(e);
	for (; n;) {
		let e = Object.getOwnPropertyDescriptor(n, t);
		if (e) return e;
		n = Ql(n);
	}
}
function od(e) {
	e.modified_ || (e.modified_ = !0, e.parent_ && od(e.parent_));
}
function sd(e) {
	e.copy_ ||= (e.assigned_ = /* @__PURE__ */ new Map(), Tu(e.base_, e.scope_.immer_.useStrictShallowCopy_));
}
var cd = class {
	constructor(e) {
		this.autoFreeze_ = !0, this.useStrictShallowCopy_ = !1, this.useStrictIteration_ = !1, this.produce = (e, t, n) => {
			if (bu(e) && !bu(t)) {
				let n = t;
				t = e;
				let r = this;
				return function(e = n, ...i) {
					return r.produce(e, (e) => t.call(this, e, ...i));
				};
			}
			bu(t) || Xl(6), n !== void 0 && !bu(n) && Xl(7);
			let r;
			if (ou(e)) {
				let i = Hu(this), a = ld(i, e, void 0), o = !0;
				try {
					r = t(a), o = !1;
				} finally {
					o ? Bu(i) : Vu(i);
				}
				return zu(i, n), Wu(r, i);
			}
			if (!e || !yu(e)) {
				if (r = t(e), r === void 0 && (r = e), r === ql && (r = void 0), this.autoFreeze_ && Eu(r, !0), n) {
					let t = [], i = [];
					Pu(ju).generateReplacementPatches_(e, r, {
						patches_: t,
						inversePatches_: i
					}), n(t, i);
				}
				return r;
			}
			Xl(1, e);
		}, this.produceWithPatches = (e, t) => {
			if (bu(e)) return (t, ...n) => this.produceWithPatches(t, (t) => e(t, ...n));
			let n, r;
			return [
				this.produce(e, t, (e, t) => {
					n = e, r = t;
				}),
				n,
				r
			];
		}, xu(e?.autoFreeze) && this.setAutoFreeze(e.autoFreeze);
		let t = e?.useStrictShallowCopy;
		(xu(t) || t === "class_only") && this.setUseStrictShallowCopy(t), xu(e?.useStrictIteration) && this.setUseStrictIteration(e.useStrictIteration);
	}
	createDraft(e) {
		ou(e) || Xl(8), au(e) && (e = ud(e));
		let t = Hu(this), n = ld(t, e, void 0);
		return n[Yl].isManual_ = !0, Vu(t), n;
	}
	finishDraft(e, t) {
		let n = e && e[Yl];
		n && n.isManual_ || Xl(9);
		let { scope_: r } = n;
		return zu(r, t), Wu(void 0, r);
	}
	setAutoFreeze(e) {
		this.autoFreeze_ = e;
	}
	setUseStrictShallowCopy(e) {
		this.useStrictShallowCopy_ = e;
	}
	setUseStrictIteration(e) {
		this.useStrictIteration_ = e;
	}
	shouldUseStrictIteration() {
		return this.useStrictIteration_;
	}
	applyPatches(e, t) {
		let n;
		for (n = t.length - 1; n >= 0; n--) {
			let r = t[n];
			if (r.path.length === 0 && r.op === "replace") {
				e = r.value;
				break;
			}
		}
		n > -1 && (t = t.slice(n + 1));
		let r = Pu(ju).applyPatches_;
		return au(e) ? r(e, t) : this.produce(e, (e) => r(e, t));
	}
};
function ld(e, t, n, r) {
	let [i, a] = _u(t) ? Pu(Au).proxyMap_(t, n) : vu(t) ? Pu(Au).proxySet_(t, n) : q(t, n);
	return (n?.scope_ ?? Lu()).drafts_.push(i), a.callbacks_ = n?.callbacks_ ?? [], a.key_ = r, n && r !== void 0 ? Zu(n, a, r) : a.callbacks_.push(function(e) {
		e.mapSetPlugin_?.fixSetContents(a);
		let { patchPlugin_: t } = e;
		a.modified_ && t && t.generatePatches_(a, [], e);
	}), i;
}
function ud(e) {
	return au(e) || Xl(10, e), dd(e);
}
function dd(e) {
	if (!ou(e) || ku(e)) return e;
	let t = e[Yl], n, r = !0;
	if (t) {
		if (!t.modified_) return t.base_;
		t.finalized_ = !0, n = Tu(e, t.scope_.immer_.useStrictShallowCopy_), r = t.scope_.immer_.shouldUseStrictIteration();
	} else n = Tu(e, !0);
	let i = n;
	return vu(n) && (n = /* @__PURE__ */ new Set()), uu(i, (e, t) => {
		mu(n, e, dd(t));
	}, r), t && (t.finalized_ = !1), n;
}
globalThis.Iterator?.from;
var fd = new cd().produce;
// node_modules/redux-thunk/dist/redux-thunk.mjs
function pd(e) {
	return ({ dispatch: t, getState: n }) => (r) => (i) => typeof i == "function" ? i(t, n, e) : r(i);
}
var md = pd(), hd = pd, gd = typeof window < "u" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : function() {
	if (arguments.length !== 0) return typeof arguments[0] == "object" ? Wl : Wl.apply(null, arguments);
};
typeof window < "u" && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__;
function _d(e, t) {
	function n(...n) {
		if (t) {
			let r = t(...n);
			if (!r) throw Error(Ef(0));
			return {
				type: e,
				payload: r.payload,
				..."meta" in r && { meta: r.meta },
				..."error" in r && { error: r.error }
			};
		}
		return {
			type: e,
			payload: n[0]
		};
	}
	return n.toString = () => `${e}`, n.type = e, n.match = (t) => t != null && t.type === e && Kl(t), n;
}
var vd = class e extends Array {
	constructor(...t) {
		super(...t), Object.setPrototypeOf(this, e.prototype);
	}
	static get [Symbol.species]() {
		return e;
	}
	concat(...e) {
		return super.concat.apply(this, e);
	}
	prepend(...t) {
		return t.length === 1 && Array.isArray(t[0]) ? new e(...t[0].concat(this)) : new e(...t.concat(this));
	}
};
function yd(e) {
	return ou(e) ? fd(e, () => {}) : e;
}
function bd(e, t, n) {
	return e.has(t) ? e.get(t) : e.set(t, n(t)).get(t);
}
function xd(e) {
	return typeof e == "boolean";
}
var Sd = () => function(e) {
	let { thunk: t = !0, immutableCheck: n = !0, serializableCheck: r = !0, actionCreatorCheck: i = !0 } = e ?? {}, a = new vd();
	return t && (xd(t) ? a.push(md) : a.push(hd(t.extraArgument))), a;
}, Cd = "RTK_autoBatch", Y = () => (e) => ({
	payload: e,
	meta: { [Cd]: !0 }
}), wd = (e) => (t) => {
	setTimeout(t, e);
}, Td = (e, t, n) => (r) => {
	let i = !1, a, o, s = () => {
		i || (i = !0, t?.(a), clearTimeout(o), r());
	};
	a = e(s), o = setTimeout(s, n);
}, Ed = (e = { type: "raf" }) => (t) => (...n) => {
	let r = t(...n), i = !0, a = !1, o = !1, s = /* @__PURE__ */ new Set(), c = e.type === "tick" ? queueMicrotask : e.type === "raf" ? typeof window < "u" && window.requestAnimationFrame ? Td(window.requestAnimationFrame, window.cancelAnimationFrame, 100) : wd(10) : e.type === "callback" ? e.queueNotification : wd(e.timeout), l = () => {
		o = !1, a && (a = !1, s.forEach((e) => e()));
	};
	return Object.assign({}, r, {
		subscribe(e) {
			let t = r.subscribe(() => i && e());
			return s.add(e), () => {
				t(), s.delete(e);
			};
		},
		dispatch(e) {
			try {
				return i = !e?.meta?.[Cd], a = !i, a && (o || (o = !0, c(l))), r.dispatch(e);
			} finally {
				i = !0;
			}
		}
	});
}, Dd = (e) => function(t) {
	let { autoBatch: n = !0 } = t ?? {}, r = new vd(e);
	return n && r.push(Ed(typeof n == "object" ? n : void 0)), r;
};
function Od(e) {
	let t = Sd(), { reducer: n = void 0, middleware: r, devTools: i = !0, duplicateMiddlewareCheck: a = !0, preloadedState: o = void 0, enhancers: s = void 0 } = e || {}, c;
	if (typeof n == "function") c = n;
	else if (Bl(n)) c = Ul(n);
	else throw Error(Ef(1));
	let l;
	l = typeof r == "function" ? r(t) : t();
	let u = Wl;
	i && (u = gd({
		trace: !1,
		...typeof i == "object" && i
	}));
	let d = Dd(Gl(...l)), f = typeof s == "function" ? s(d) : d(), p = u(...f);
	return Vl(c, o, p);
}
function kd(e) {
	let t = {}, n = [], r, i = {
		addCase(e, n) {
			let r = typeof e == "string" ? e : e.type;
			if (!r) throw Error(Ef(28));
			if (r in t) throw Error(Ef(29));
			return t[r] = n, i;
		},
		addAsyncThunk(e, r) {
			return r.pending && (t[e.pending.type] = r.pending), r.rejected && (t[e.rejected.type] = r.rejected), r.fulfilled && (t[e.fulfilled.type] = r.fulfilled), r.settled && n.push({
				matcher: e.settled,
				reducer: r.settled
			}), i;
		},
		addMatcher(e, t) {
			return n.push({
				matcher: e,
				reducer: t
			}), i;
		},
		addDefaultCase(e) {
			return r = e, i;
		}
	};
	return e(i), [
		t,
		n,
		r
	];
}
function Ad(e) {
	return typeof e == "function";
}
function jd(e, t) {
	let [n, r, i] = kd(t), a;
	if (Ad(e)) a = () => yd(e());
	else {
		let t = yd(e);
		a = () => t;
	}
	function o(e, t, n) {
		if (au(e)) {
			let r = t(e, n);
			return r === void 0 ? e : r;
		}
		if (ou(e)) return fd(e, (e) => t(e, n));
		{
			let r = t(e, n);
			if (r === void 0) {
				if (e === null) return e;
				throw Error(Ef(9));
			}
			return r;
		}
	}
	function s(e = a(), t) {
		let s = n[t.type], c;
		for (let { matcher: e, reducer: n } of r) e(t) && n && (c ??= []).push(n);
		if (!s && !c) return i ? o(e, i, t) : e;
		if (s && (e = o(e, s, t)), c) for (let n of c) e = o(e, n, t);
		return e;
	}
	return s.getInitialState = a, s;
}
var Md = "ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW", Nd = (e = 21) => {
	let t = "", n = e;
	for (; n--;) t += Md[Math.random() * 64 | 0];
	return t;
}, Pd = /* @__PURE__ */ Symbol.for("rtk-slice-createasyncthunk");
function Fd(e, t) {
	return `${e}/${t}`;
}
function Id({ creators: e } = {}) {
	let t = e?.asyncThunk?.[Pd];
	return function(e) {
		let { name: n, reducerPath: r = n } = e;
		if (!n) throw Error(Ef(11));
		let i = (typeof e.reducers == "function" ? e.reducers(zd()) : e.reducers) || {}, a = Object.keys(i), o = {
			sliceCaseReducersByName: {},
			sliceCaseReducersByType: {},
			actionCreators: {},
			sliceMatchers: []
		}, s = {
			addCase(e, t) {
				let n = typeof e == "string" ? e : e.type;
				if (!n) throw Error(Ef(12));
				if (n in o.sliceCaseReducersByType) throw Error(Ef(13));
				return o.sliceCaseReducersByType[n] = t, s;
			},
			addMatcher(e, t) {
				return o.sliceMatchers.push({
					matcher: e,
					reducer: t
				}), s;
			},
			exposeAction(e, t) {
				return o.actionCreators[e] = t, s;
			},
			exposeCaseReducer(e, t) {
				return o.sliceCaseReducersByName[e] = t, s;
			}
		};
		a.forEach((r) => {
			let a = i[r], o = {
				reducerName: r,
				type: Fd(n, r),
				createNotation: typeof e.reducers == "function"
			};
			Vd(a) ? Ud(o, a, s, t) : Bd(o, a, s);
		});
		function c() {
			let [t = {}, n = [], r = void 0] = typeof e.extraReducers == "function" ? kd(e.extraReducers) : [e.extraReducers], i = {
				...t,
				...o.sliceCaseReducersByType
			};
			return jd(e.initialState, (e) => {
				for (let t in i) e.addCase(t, i[t]);
				for (let t of o.sliceMatchers) e.addMatcher(t.matcher, t.reducer);
				for (let t of n) e.addMatcher(t.matcher, t.reducer);
				r && e.addDefaultCase(r);
			});
		}
		let l = (e) => e, u = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new WeakMap(), f;
		function p(e, t) {
			return f ||= c(), f(e, t);
		}
		function m() {
			return f ||= c(), f.getInitialState();
		}
		function h(t, n = !1) {
			function r(e) {
				let i = e[t];
				return i === void 0 && n && (i = bd(d, r, m)), i;
			}
			function i(t = l) {
				return bd(bd(u, n, () => /* @__PURE__ */ new WeakMap()), t, () => {
					let r = {};
					for (let [i, a] of Object.entries(e.selectors ?? {})) r[i] = Ld(a, t, () => bd(d, t, m), n);
					return r;
				});
			}
			return {
				reducerPath: t,
				getSelectors: i,
				get selectors() {
					return i(r);
				},
				selectSlice: r
			};
		}
		let g = {
			name: n,
			reducer: p,
			actions: o.actionCreators,
			caseReducers: o.sliceCaseReducersByName,
			getInitialState: m,
			...h(r),
			injectInto(e, { reducerPath: t, ...n } = {}) {
				let i = t ?? r;
				return e.inject({
					reducerPath: i,
					reducer: p
				}, n), {
					...g,
					...h(i, !0)
				};
			}
		};
		return g;
	};
}
function Ld(e, t, n, r) {
	function i(i, ...a) {
		let o = t(i);
		return o === void 0 && r && (o = n()), e(o, ...a);
	}
	return i.unwrapped = e, i;
}
var Rd = /* @__PURE__ */ Id();
function zd() {
	function e(e, t) {
		return {
			_reducerDefinitionType: "asyncThunk",
			payloadCreator: e,
			...t
		};
	}
	return e.withTypes = () => e, {
		reducer(e) {
			return Object.assign({ [e.name](...t) {
				return e(...t);
			} }[e.name], { _reducerDefinitionType: "reducer" });
		},
		preparedReducer(e, t) {
			return {
				_reducerDefinitionType: "reducerWithPrepare",
				prepare: e,
				reducer: t
			};
		},
		asyncThunk: e
	};
}
function Bd({ type: e, reducerName: t, createNotation: n }, r, i) {
	let a, o;
	if ("reducer" in r) {
		if (n && !Hd(r)) throw Error(Ef(17));
		a = r.reducer, o = r.prepare;
	} else a = r;
	i.addCase(e, a).exposeCaseReducer(t, a).exposeAction(t, o ? _d(e, o) : _d(e));
}
function Vd(e) {
	return e._reducerDefinitionType === "asyncThunk";
}
function Hd(e) {
	return e._reducerDefinitionType === "reducerWithPrepare";
}
function Ud({ type: e, reducerName: t }, n, r, i) {
	if (!i) throw Error(Ef(18));
	let { payloadCreator: a, fulfilled: o, pending: s, rejected: c, settled: l, options: u } = n, d = i(e, a, u);
	r.exposeAction(t, d), o && r.addCase(d.fulfilled, o), s && r.addCase(d.pending, s), c && r.addCase(d.rejected, c), l && r.addMatcher(d.settled, l), r.exposeCaseReducer(t, {
		fulfilled: o || Wd,
		pending: s || Wd,
		rejected: c || Wd,
		settled: l || Wd
	});
}
function Wd() {}
var Gd = "task", Kd = "listener", qd = "completed", Jd = "cancelled", Yd = `task-${Jd}`, Xd = `task-${qd}`, Zd = `${Kd}-${Jd}`, Qd = `${Kd}-${qd}`, $d = class {
	code;
	name = "TaskAbortError";
	message;
	constructor(e) {
		this.code = e, this.message = `${Gd} ${Jd} (reason: ${e})`;
	}
}, ef = (e, t) => {
	if (typeof e != "function") throw TypeError(Ef(32));
}, tf = () => {}, nf = (e, t = tf) => (e.catch(t), e), rf = (e, t) => (e.addEventListener("abort", t, { once: !0 }), () => e.removeEventListener("abort", t)), af = (e) => {
	if (e.aborted) throw new $d(e.reason);
};
function of(e, t) {
	let n = tf;
	return new Promise((r, i) => {
		let a = () => i(new $d(e.reason));
		e.aborted ? a() : (n = rf(e, a), t.finally(() => n()).then(r, i));
	}).finally(() => {
		n = tf;
	});
}
var sf = async (e, t) => {
	try {
		return await Promise.resolve(), {
			status: "ok",
			value: await e()
		};
	} catch (e) {
		return {
			status: e instanceof $d ? "cancelled" : "rejected",
			error: e
		};
	} finally {
		t?.();
	}
}, cf = (e) => (t) => nf(of(e, t).then((t) => (af(e), t))), lf = (e) => {
	let t = cf(e);
	return (e) => {
		let n;
		return nf(t(new Promise((t) => {
			n = setTimeout(t, e);
		})).finally(() => clearTimeout(n)));
	};
}, { assign: uf } = Object, df = {}, ff = "listenerMiddleware", pf = async (e) => {
	for (; e.size;) await Promise.all(e);
}, mf = (e, t, n) => (r, i) => {
	ef(r, "taskExecutor");
	let a = new AbortController(), { signal: o } = a, s = rf(e, () => a.abort(e.reason)), c = sf(async () => {
		af(e), af(o);
		let t = /* @__PURE__ */ new Set(), i;
		try {
			i = await r({
				getState: n.getState,
				dispatch: n.dispatch,
				pause: cf(o),
				delay: lf(o),
				signal: o,
				fork: mf(o, t, n)
			});
		} finally {
			await pf(t);
		}
		return af(o), i;
	}, () => {
		s(), a.abort(Xd);
	});
	if (i?.autoJoin) {
		let e = c.then(() => {
			t.delete(e);
		});
		t.add(e);
	}
	return {
		result: cf(e)(c),
		cancel() {
			a.abort(Yd);
		}
	};
}, hf = (e, t) => {
	let n = async (n, r) => {
		af(t);
		let i = tf, a = [new Promise((t, r) => {
			let a = e({
				predicate: n,
				effect: (e, n) => {
					n.unsubscribe(), t([
						e,
						n.getState(),
						n.getOriginalState()
					]);
				}
			});
			i = () => {
				a(), r();
			};
		})], o;
		r != null && a.push(new Promise((e) => {
			o = setTimeout(e, r, null);
		}));
		try {
			let e = await of(t, Promise.race(a));
			return af(t), e;
		} finally {
			clearTimeout(o), i();
		}
	};
	return ((e, t) => nf(n(e, t)));
}, gf = (e) => {
	let { type: t, actionCreator: n, matcher: r, predicate: i, effect: a } = e;
	if (t) i = _d(t).match;
	else if (n) t = n.type, i = n.match;
	else if (r) i = r;
	else if (!i) throw Error(Ef(21));
	return ef(a, "options.listener"), {
		predicate: i,
		type: t,
		effect: a
	};
}, _f = /* @__PURE__ */ uf((e) => {
	let { type: t, predicate: n, effect: r } = gf(e);
	return {
		id: Nd(),
		effect: r,
		type: t,
		predicate: n,
		pending: /* @__PURE__ */ new Set(),
		unsubscribe: () => {
			throw Error(Ef(22));
		}
	};
}, { withTypes: () => _f }), vf = (e, t) => {
	let { type: n, effect: r, predicate: i } = gf(t);
	return Array.from(e.values()).find((e) => (typeof n == "string" ? e.type === n : e.predicate === i) && e.effect === r);
}, yf = (e, t) => {
	e.unsubscribe(), t?.cancelActive && e.pending.forEach((e) => {
		e.abort(Zd);
	});
}, bf = (e, t, n) => {
	try {
		e(t, n);
	} catch (e) {
		setTimeout(() => {
			throw e;
		}, 0);
	}
}, xf = /* @__PURE__ */ uf(/* @__PURE__ */ _d(`${ff}/add`), { withTypes: () => xf }), Sf = /* @__PURE__ */ _d(`${ff}/removeAll`), Cf = /* @__PURE__ */ uf(/* @__PURE__ */ _d(`${ff}/remove`), { withTypes: () => Cf }), wf = (...e) => {
	console.error(`${ff}/error`, ...e);
}, Tf = (e = {}) => {
	let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set(), { extra: r, onError: i = wf } = e;
	ef(i, "onError");
	let a, o = () => {
		if (!a) {
			let e = Array.from(t.values()), n = /* @__PURE__ */ new Set(), r = !1;
			for (let t of e) typeof t.type == "string" ? n.add(t.type) : r = !0;
			a = {
				entries: e,
				types: n,
				anyType: r
			};
		}
		return a;
	}, s = (e) => {
		t.has(e.id) || (t.set(e.id, e), a = void 0);
	}, c = (e) => (e.unsubscribe = () => {
		t.delete(e.id) && (a = void 0);
	}, s(e), (t) => yf(e, t)), l = ((e) => {
		let n = vf(t, e) ?? _f(e);
		return c(n);
	});
	uf(l, { withTypes: () => l });
	let u = (e) => {
		let n = vf(t, e);
		return n && yf(n, e), !!n;
	};
	uf(u, { withTypes: () => u });
	let d = async (e, t, a, o) => {
		let c = new AbortController(), { signal: u } = c, d = hf(l, u), f = /* @__PURE__ */ new Set();
		try {
			e.pending.add(c), n.add(c), await e.effect(t, uf({}, a, {
				getOriginalState: o,
				condition: (e, t) => d(e, t).then(Boolean),
				take: d,
				delay: lf(u),
				pause: cf(u),
				extra: r,
				signal: u,
				fork: mf(u, f, a),
				unsubscribe: e.unsubscribe,
				subscribe: () => {
					s(e);
				},
				cancelActiveListeners: () => {
					e.pending.forEach((e, t, n) => {
						e !== c && (e.abort(Zd), n.delete(e));
					});
				},
				cancel: () => {
					c.abort(Zd), e.pending.delete(c);
				},
				throwIfCancelled: () => {
					af(u);
				}
			}));
		} catch (e) {
			e instanceof $d || bf(i, e, { raisedBy: "effect" });
		} finally {
			await pf(f), c.abort(Qd), n.delete(c), e.pending.delete(c);
		}
	}, f = () => {
		n.forEach((e) => {
			e.abort(Zd);
		}), t.clear(), a = void 0;
	};
	return {
		middleware: (e) => (t) => (n) => {
			if (!Kl(n)) return t(n);
			if (xf.match(n)) return l(n.payload);
			if (Sf.match(n)) {
				f();
				return;
			}
			if (Cf.match(n)) return u(n.payload);
			let r = e.getState(), a = () => {
				if (r === df) throw Error(Ef(23));
				return r;
			}, s;
			try {
				s = t(n);
				let { entries: c, types: l, anyType: u } = o();
				if (u || l.has(n.type)) {
					let t = e.getState();
					for (let o of c) {
						if (typeof o.type == "string" && o.type !== n.type) continue;
						let s = !1;
						try {
							s = o.predicate(n, t, r);
						} catch (e) {
							bf(i, e, { raisedBy: "predicate" });
						}
						s && d(o, n, e, a);
					}
				}
			} finally {
				r = df;
			}
			return s;
		},
		startListening: l,
		stopListening: u,
		clearListeners: f
	};
};
function Ef(e) {
	return `Minified Redux Toolkit error #${e}; visit https://redux-toolkit.js.org/Errors?code=${e} for the full message or use the non-minified dev environment for full errors. `;
}
// node_modules/recharts/es6/state/layoutSlice.js
var Df = Rd({
	name: "chartLayout",
	initialState: {
		layoutType: "horizontal",
		width: 0,
		height: 0,
		margin: {
			top: 5,
			right: 5,
			bottom: 5,
			left: 5
		},
		scale: 1
	},
	reducers: {
		setLayout(e, t) {
			e.layoutType = t.payload;
		},
		setChartSize(e, t) {
			e.width = t.payload.width, e.height = t.payload.height;
		},
		setMargin(e, t) {
			e.margin.top = t.payload.top ?? 0, e.margin.right = t.payload.right ?? 0, e.margin.bottom = t.payload.bottom ?? 0, e.margin.left = t.payload.left ?? 0;
		},
		setScale(e, t) {
			e.scale = t.payload;
		}
	}
}), { setMargin: Of, setLayout: kf, setChartSize: Af, setScale: jf } = Df.actions, Mf = Df.reducer;
// node_modules/recharts/es6/util/getSliced.js
function Nf(e, t, n) {
	return Array.isArray(e) && e && t + n !== 0 ? e.slice(t, n + 1) : e;
}
// node_modules/recharts/es6/util/isWellBehavedNumber.js
function X(e) {
	return Number.isFinite(e);
}
function Pf(e) {
	return typeof e == "number" && e > 0 && Number.isFinite(e);
}
// node_modules/recharts/es6/util/ChartUtils.js
function Ff(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function If(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Ff(Object(n), !0).forEach(function(t) {
			Lf(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Ff(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Lf(e, t, n) {
	return (t = Rf(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Rf(e) {
	var t = zf(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function zf(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function Bf(e, t, n) {
	return gs(e) || gs(t) ? n : ls(t) ? ns(e, t, n) : typeof t == "function" ? t(e) : n;
}
var Vf = (e, t, n) => {
	if (t && n) {
		var { width: r, height: i } = n, { align: a, verticalAlign: o, layout: s } = t;
		if ((s === "vertical" || s === "horizontal" && o === "middle") && a !== "center" && W(e[a])) return If(If({}, e), {}, { [a]: e[a] + (r || 0) });
		if ((s === "horizontal" || s === "vertical" && a === "center") && o !== "middle" && W(e[o])) return If(If({}, e), {}, { [o]: e[o] + (i || 0) });
	}
	return e;
}, Hf = (e, t) => e === "horizontal" && t === "xAxis" || e === "vertical" && t === "yAxis" || e === "centric" && t === "angleAxis" || e === "radial" && t === "radiusAxis", Z = (e, t, n, r) => {
	if (r) return e.map((e) => e.coordinate);
	var i, a, o = e.map((e) => (e.coordinate === t && (i = !0), e.coordinate === n && (a = !0), e.coordinate));
	return i || o.push(t), a || o.push(n), o;
}, Uf = (e, t, n) => {
	if (!e) return null;
	var { duplicateDomain: r, type: i, range: a, scale: o, realScaleType: s, isCategorical: c, categoricalDomain: l, tickCount: u, ticks: d, niceTicks: f, axisType: p } = e;
	if (!o) return null;
	var m = s === "scaleBand" && o.bandwidth ? o.bandwidth() / 2 : 2, h = (t || n) && i === "category" && o.bandwidth ? o.bandwidth() / m : 0;
	return h = p === "angleAxis" && a && a.length >= 2 ? os(a[0] - a[1]) * 2 * h : h, t && (d || f) ? (d || f || []).map((e, t) => {
		var n = r ? r.indexOf(e) : e, i = o.map(n);
		return X(i) ? {
			coordinate: i + h,
			value: e,
			offset: h,
			index: t
		} : null;
	}).filter(vs) : c && l ? l.map((e, t) => {
		var n = o.map(e);
		return X(n) ? {
			coordinate: n + h,
			value: e,
			index: t,
			offset: h
		} : null;
	}).filter(vs) : o.ticks && !n && u != null ? o.ticks(u).map((e, t) => {
		var n = o.map(e);
		return X(n) ? {
			coordinate: n + h,
			value: e,
			index: t,
			offset: h
		} : null;
	}).filter(vs) : o.domain().map((e, t) => {
		var n = o.map(e);
		return X(n) ? {
			coordinate: n + h,
			value: r ? r[e] : e,
			index: t,
			offset: h
		} : null;
	}).filter(vs);
}, Wf = {
	sign: (e) => {
		var t = e.length;
		if (!(t <= 0)) {
			var n = e[0]?.length;
			if (!(n == null || n <= 0)) for (var r = 0; r < n; ++r) for (var i = 0, a = 0, o = 0; o < t; ++o) {
				var s = e[o]?.[r];
				if (s != null) {
					var c = s[1], l = s[0], u = ss(c) ? l : c;
					u >= 0 ? (s[0] = i, i += u, s[1] = i) : (s[0] = a, a += u, s[1] = a);
				}
			}
		}
	},
	expand: Uo,
	none: zo,
	silhouette: Wo,
	wiggle: Go,
	positive: (e) => {
		var t = e.length;
		if (!(t <= 0)) {
			var n = e[0]?.length;
			if (!(n == null || n <= 0)) for (var r = 0; r < n; ++r) for (var i = 0, a = 0; a < t; ++a) {
				var o = e[a]?.[r];
				if (o != null) {
					var s = ss(o[1]) ? o[0] : o[1];
					s >= 0 ? (o[0] = i, i += s, o[1] = i) : (o[0] = 0, o[1] = 0);
				}
			}
		}
	}
}, Gf = (e, t, n) => {
	var r = Wf[n] ?? zo, i = Ho().keys(t).value((e, t) => Number(Bf(e, t, 0))).order(Bo).offset(r)(e);
	return i.forEach((n, r) => {
		n.forEach((n, i) => {
			var a = Bf(e[i], t[r], 0);
			Array.isArray(a) && a.length === 2 && W(a[0]) && W(a[1]) && (n[0] = a[0], n[1] = a[1]);
		});
	}), i;
};
function Kf(e) {
	var { axis: t, ticks: n, bandSize: r, entry: i, index: a, dataKey: o } = e;
	if (t.type === "category") {
		if (!t.allowDuplicatedCategory && t.dataKey && !gs(i[t.dataKey])) {
			var s = hs(n, "value", i[t.dataKey]);
			if (s) return s.coordinate + r / 2;
		}
		return n != null && n[a] ? n[a].coordinate + r / 2 : null;
	}
	var c = Bf(i, gs(o) ? t.dataKey : o), l = t.scale.map(c);
	return W(l) ? l : null;
}
var qf = (e) => {
	var t = e.flat(2).filter(W);
	return [Math.min(...t), Math.max(...t)];
}, Jf = (e) => [e[0] === 1e400 ? 0 : e[0], e[1] === -1e400 ? 0 : e[1]], Yf = (e, t, n) => {
	if (e != null) return Jf(Object.keys(e).reduce((r, i) => {
		var a = e[i];
		if (!a) return r;
		var { stackedData: o } = a, s = o.reduce((e, r) => {
			var i = qf(Nf(r, t, n));
			return !X(i[0]) || !X(i[1]) ? e : [Math.min(e[0], i[0]), Math.max(e[1], i[1])];
		}, [1e400, -1e400]);
		return [Math.min(s[0], r[0]), Math.max(s[1], r[1])];
	}, [1e400, -1e400]));
}, Xf = /^dataMin[\s]*-[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/, Zf = /^dataMax[\s]*\+[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/, Qf = (e, t, n) => {
	if (e && e.scale && e.scale.bandwidth) {
		var r = e.scale.bandwidth();
		if (!n || r > 0) return r;
	}
	if (e && t && t.length >= 2) {
		for (var i = jl(t, (e) => e.coordinate), a = 1e400, o = 1, s = i.length; o < s; o++) {
			var c = i[o], l = i[o - 1];
			a = Math.min((c?.coordinate || 0) - (l?.coordinate || 0), a);
		}
		return a === 1e400 ? 0 : a;
	}
	return n ? void 0 : 0;
};
function $f(e) {
	var { tooltipEntrySettings: t, dataKey: n, payload: r, value: i, name: a } = e;
	return If(If({}, t), {}, {
		dataKey: n,
		payload: r,
		value: i,
		name: a
	});
}
function ep(e, t) {
	if (e) return String(e);
	if (typeof t == "string") return t;
}
var tp = (e, t) => {
	if (t === "horizontal") return e.relativeX;
	if (t === "vertical") return e.relativeY;
}, np = (e, t) => t === "centric" ? e.angle : e.radius, rp = (e) => e.layout.width, ip = (e) => e.layout.height, ap = (e) => e.layout.scale, op = (e) => e.layout.margin, sp = K((e) => e.cartesianAxis.xAxis, (e) => Object.values(e)), cp = K((e) => e.cartesianAxis.yAxis, (e) => Object.values(e)), lp = "data-recharts-item-index";
// node_modules/recharts/es6/state/selectors/selectChartOffsetInternal.js
function up(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function dp(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? up(Object(n), !0).forEach(function(t) {
			fp(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : up(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function fp(e, t, n) {
	return (t = pp(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function pp(e) {
	var t = mp(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function mp(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var hp = (e) => e.brush.height;
function gp(e) {
	return cp(e).reduce((e, t) => t.orientation === "left" && !t.mirror && !t.hide ? e + (typeof t.width == "number" ? t.width : 60) : e, 0);
}
function _p(e) {
	return cp(e).reduce((e, t) => t.orientation === "right" && !t.mirror && !t.hide ? e + (typeof t.width == "number" ? t.width : 60) : e, 0);
}
function vp(e) {
	return sp(e).reduce((e, t) => t.orientation === "top" && !t.mirror && !t.hide ? e + t.height : e, 0);
}
function yp(e) {
	return sp(e).reduce((e, t) => t.orientation === "bottom" && !t.mirror && !t.hide ? e + t.height : e, 0);
}
var bp = K([
	rp,
	ip,
	op,
	hp,
	gp,
	_p,
	vp,
	yp,
	Ml,
	Nl
], (e, t, n, r, i, a, o, s, c, l) => {
	var u = {
		left: (n.left || 0) + i,
		right: (n.right || 0) + a
	}, d = dp(dp({}, {
		top: (n.top || 0) + o,
		bottom: (n.bottom || 0) + s
	}), u), f = d.bottom;
	d.bottom += r, d = Vf(d, c, l);
	var p = e - d.left - d.right, m = t - d.top - d.bottom;
	return dp(dp({ brushBottom: f }, d), {}, {
		width: Math.max(p, 0),
		height: Math.max(m, 0)
	});
}), xp = K(bp, (e) => ({
	x: e.left,
	y: e.top,
	width: e.width,
	height: e.height
})), Sp = K(rp, ip, (e, t) => ({
	x: 0,
	y: 0,
	width: e,
	height: t
})), Cp = /*#__PURE__*/ (0, v.createContext)(null), wp = () => (0, v.useContext)(Cp) != null, Tp = (e) => e.brush, Ep = K([
	Tp,
	bp,
	op
], (e, t, n) => ({
	height: e.height,
	x: W(e.x) ? e.x : t.left,
	y: W(e.y) ? e.y : t.top + t.height + t.brushBottom - (n?.bottom || 0),
	width: W(e.width) ? e.width : t.width
}));
// node_modules/es-toolkit/dist/function/debounce.mjs
function Dp(e, t, { signal: n, edges: r } = {}) {
	let i, a = null, o = r != null && r.includes("leading"), s = r == null || r.includes("trailing"), c = () => {
		a !== null && (e.apply(i, a), i = void 0, a = null);
	}, l = () => {
		s && c(), p();
	}, u = null, d = () => {
		u != null && clearTimeout(u), u = setTimeout(() => {
			u = null, l();
		}, t);
	}, f = () => {
		u !== null && (clearTimeout(u), u = null);
	}, p = () => {
		f(), i = void 0, a = null;
	}, m = () => {
		c();
	}, h = function(...e) {
		if (n?.aborted) return;
		i = this, a = e;
		let t = u == null;
		d(), o && t && c();
	};
	return h.schedule = d, h.cancel = p, h.flush = m, n?.addEventListener("abort", p, { once: !0 }), h;
}
// node_modules/es-toolkit/dist/compat/function/debounce.mjs
function Op(e, t = 0, n = {}) {
	typeof n != "object" && (n = {});
	let { leading: r = !1, trailing: i = !0, maxWait: a } = n, o = [, ,];
	r && (o[0] = "leading"), i && (o[1] = "trailing");
	let s, c = null, l = Dp(function(...t) {
		s = e.apply(this, t), c = null;
	}, t, { edges: o }), u = function(...t) {
		return a != null && (c === null && (c = Date.now()), Date.now() - c >= a) ? ((r || i) && (s = e.apply(this, t)), c = Date.now(), l.cancel(), l.schedule(), s) : (l.apply(this, t), s);
	};
	return u.cancel = l.cancel, u.flush = () => (l.flush(), s), u;
}
// node_modules/es-toolkit/dist/compat/function/throttle.mjs
function kp(e, t = 0, n = {}) {
	let { leading: r = !0, trailing: i = !0 } = n;
	return Op(e, t, {
		leading: r,
		maxWait: t,
		trailing: i
	});
}
// node_modules/recharts/es6/util/LogUtils.js
var Ap = function(e, t) {
	var n = [...arguments].slice(2);
	if (typeof console < "u" && console.warn && (t === void 0 && console.warn("LogUtils requires an error message argument"), !e)) {
		if (t === void 0) console.warn("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");
		else {
			var r = 0;
			console.warn(t.replace(/%s/g, () => n[r++]));
		}
	}
}, jp = {
	width: "100%",
	height: "100%",
	debounce: 0,
	minWidth: 0,
	initialDimension: {
		width: -1,
		height: -1
	}
}, Mp = (e, t, n) => {
	var { width: r = jp.width, height: i = jp.height, aspect: a, maxHeight: o } = n, s = cs(r) ? e : Number(r), c = cs(i) ? t : Number(i);
	return a && a > 0 && (s ? c = s / a : c && (s = c * a), o && c != null && c > o && (c = o)), {
		calculatedWidth: s,
		calculatedHeight: c
	};
}, Np = {
	width: 0,
	height: 0,
	overflow: "visible"
}, Pp = {
	width: 0,
	overflowX: "visible"
}, Fp = {
	height: 0,
	overflowY: "visible"
}, Ip = {}, Lp = (e) => {
	var { width: t, height: n } = e, r = cs(t), i = cs(n);
	return r && i ? Np : r ? Pp : i ? Fp : Ip;
};
function Rp(e) {
	var { width: t, height: n, aspect: r } = e, i = t, a = n;
	return i === void 0 && a === void 0 ? (i = jp.width, a = jp.height) : i === void 0 ? i = r && r > 0 ? void 0 : jp.width : a === void 0 && (a = r && r > 0 ? void 0 : jp.height), {
		width: i,
		height: a
	};
}
// node_modules/recharts/es6/component/ResponsiveContainer.js
function zp() {
	return zp = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, zp.apply(null, arguments);
}
function Bp(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Vp(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Bp(Object(n), !0).forEach(function(t) {
			Hp(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Bp(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Hp(e, t, n) {
	return (t = Up(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Up(e) {
	var t = Wp(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Wp(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var Gp = /*#__PURE__*/ (0, v.createContext)(jp.initialDimension);
function Kp(e) {
	return Pf(e.width) && Pf(e.height);
}
function qp(e) {
	var { children: t, width: n, height: r } = e, i = (0, v.useMemo)(() => ({
		width: n,
		height: r
	}), [n, r]);
	return Kp(i) ? /*#__PURE__*/ v.createElement(Gp.Provider, { value: i }, t) : null;
}
var Jp = () => (0, v.useContext)(Gp), Yp = /*#__PURE__*/ (0, v.forwardRef)((e, t) => {
	var { aspect: n, initialDimension: r = jp.initialDimension, width: i, height: a, minWidth: o = jp.minWidth, minHeight: s, maxHeight: c, children: l, debounce: u = jp.debounce, id: d, className: f, onResize: p, style: m = {} } = e, h = (0, v.useRef)(null), g = (0, v.useRef)();
	g.current = p, (0, v.useImperativeHandle)(t, () => h.current);
	var [_, y] = (0, v.useState)({
		containerWidth: r.width,
		containerHeight: r.height
	}), b = (0, v.useCallback)((e, t) => {
		y((n) => {
			var r = Math.round(e), i = Math.round(t);
			return n.containerWidth === r && n.containerHeight === i ? n : {
				containerWidth: r,
				containerHeight: i
			};
		});
	}, []);
	(0, v.useEffect)(() => {
		if (h.current == null || typeof ResizeObserver > "u") return ys;
		var e = (e) => {
			var t, n = e[0];
			if (n != null) {
				var { width: r, height: i } = n.contentRect;
				b(r, i), (t = g.current) == null || t.call(g, r, i);
			}
		};
		u > 0 && (e = kp(e, u, {
			trailing: !0,
			leading: !1
		}));
		var t = new ResizeObserver(e), { width: n, height: r } = h.current.getBoundingClientRect();
		return b(n, r), t.observe(h.current), () => {
			t.disconnect();
		};
	}, [b, u]);
	var { containerWidth: x, containerHeight: S } = _;
	Ap(!n || n > 0, "The aspect(%s) must be greater than zero.", n);
	var { calculatedWidth: C, calculatedHeight: w } = Mp(x, S, {
		width: i,
		height: a,
		aspect: n,
		maxHeight: c
	});
	return Ap(C != null && C > 0 || w != null && w > 0, "The width(%s) and height(%s) of chart should be greater than 0,\n       please check the style of container, or the props width(%s) and height(%s),\n       or add a minWidth(%s) or minHeight(%s) or use aspect(%s) to control the\n       height and width.", C, w, i, a, o, s, n), /*#__PURE__*/ v.createElement("div", {
		id: d ? `${d}` : void 0,
		className: I("recharts-responsive-container", f),
		style: Vp(Vp({}, m), {}, {
			width: i,
			height: a,
			minWidth: o,
			minHeight: s,
			maxHeight: c
		}),
		ref: h
	}, /*#__PURE__*/ v.createElement("div", { style: Lp({
		width: i,
		height: a
	}) }, /*#__PURE__*/ v.createElement(qp, {
		width: C,
		height: w
	}, l)));
}), Xp = /*#__PURE__*/ (0, v.forwardRef)((e, t) => {
	var n = Jp();
	if (Pf(n.width) && Pf(n.height)) return e.children;
	var { width: r, height: i } = Rp({
		width: e.width,
		height: e.height,
		aspect: e.aspect
	}), { calculatedWidth: a, calculatedHeight: o } = Mp(void 0, void 0, {
		width: r,
		height: i,
		aspect: e.aspect,
		maxHeight: e.maxHeight
	});
	return W(a) && W(o) ? /*#__PURE__*/ v.createElement(qp, {
		width: a,
		height: o
	}, e.children) : /*#__PURE__*/ v.createElement(Yp, zp({}, e, {
		width: r,
		height: i,
		ref: t
	}));
});
// node_modules/recharts/es6/context/chartLayoutContext.js
function Zp(e) {
	if (e) return {
		x: e.x,
		y: e.y,
		upperWidth: "upperWidth" in e ? e.upperWidth : e.width,
		lowerWidth: "lowerWidth" in e ? e.lowerWidth : e.width,
		width: e.width,
		height: e.height
	};
}
var Qp = () => {
	var e = wp(), t = G(xp), n = G(Ep), r = G(Tp)?.padding;
	return !e || !n || !r ? t : {
		width: n.width - r.left - r.right,
		height: n.height - r.top - r.bottom,
		x: r.left,
		y: r.top
	};
}, $p = {
	top: 0,
	bottom: 0,
	left: 0,
	right: 0,
	width: 0,
	height: 0,
	brushBottom: 0
}, em = () => G(bp) ?? $p, tm = () => G(rp), nm = () => G(ip), rm = (e) => e.layout.layoutType, im = () => G(rm), am = () => {
	var e = im();
	if (e === "horizontal" || e === "vertical") return e;
}, om = (e) => {
	var t = e.layout.layoutType;
	if (t === "centric" || t === "radial") return t;
}, sm = () => im() !== void 0, cm = (e) => {
	var t = il(), n = wp(), { width: r, height: i } = e, a = Jp(), o = r, s = i;
	return a && (o = a.width > 0 ? a.width : r, s = a.height > 0 ? a.height : i), (0, v.useEffect)(() => {
		!n && Pf(o) && Pf(s) && t(Af({
			width: o,
			height: s
		}));
	}, [
		t,
		n,
		o,
		s
	]), null;
}, lm = Symbol.for("immer-nothing"), um = Symbol.for("immer-draftable"), dm = Symbol.for("immer-state");
function fm(e, ...t) {
	throw Error(`[Immer] minified error nr: ${e}. Full error at: https://bit.ly/3cXEKWf`);
}
var pm = Object.getPrototypeOf;
function mm(e) {
	return !!e && !!e[dm];
}
function hm(e) {
	return e ? vm(e) || Array.isArray(e) || !!e[um] || !!e.constructor?.[um] || wm(e) || Tm(e) : !1;
}
var gm = Object.prototype.constructor.toString(), _m = /* @__PURE__ */ new WeakMap();
function vm(e) {
	if (!e || typeof e != "object") return !1;
	let t = Object.getPrototypeOf(e);
	if (t === null || t === Object.prototype) return !0;
	let n = Object.hasOwnProperty.call(t, "constructor") && t.constructor;
	if (n === Object) return !0;
	if (typeof n != "function") return !1;
	let r = _m.get(n);
	return r === void 0 && (r = Function.toString.call(n), _m.set(n, r)), r === gm;
}
function ym(e, t, n = !0) {
	bm(e) === 0 ? (n ? Reflect.ownKeys(e) : Object.keys(e)).forEach((n) => {
		t(n, e[n], e);
	}) : e.forEach((n, r) => t(r, n, e));
}
function bm(e) {
	let t = e[dm];
	return t ? t.type_ : Array.isArray(e) ? 1 : wm(e) ? 2 : Tm(e) ? 3 : 0;
}
function xm(e, t) {
	return bm(e) === 2 ? e.has(t) : Object.prototype.hasOwnProperty.call(e, t);
}
function Sm(e, t, n) {
	let r = bm(e);
	r === 2 ? e.set(t, n) : r === 3 ? e.add(n) : e[t] = n;
}
function Cm(e, t) {
	return e === t ? e !== 0 || 1 / e == 1 / t : e !== e && t !== t;
}
function wm(e) {
	return e instanceof Map;
}
function Tm(e) {
	return e instanceof Set;
}
function Em(e) {
	return e.copy_ || e.base_;
}
function Dm(e, t) {
	if (wm(e)) return new Map(e);
	if (Tm(e)) return new Set(e);
	if (Array.isArray(e)) return Array.prototype.slice.call(e);
	let n = vm(e);
	if (t === !0 || t === "class_only" && !n) {
		let t = Object.getOwnPropertyDescriptors(e);
		delete t[dm];
		let n = Reflect.ownKeys(t);
		for (let r = 0; r < n.length; r++) {
			let i = n[r], a = t[i];
			a.writable === !1 && (a.writable = !0, a.configurable = !0), (a.get || a.set) && (t[i] = {
				configurable: !0,
				writable: !0,
				enumerable: a.enumerable,
				value: e[i]
			});
		}
		return Object.create(pm(e), t);
	}
	{
		let t = pm(e);
		if (t !== null && n) return { ...e };
		let r = Object.create(t);
		return Object.assign(r, e);
	}
}
function Om(e, t = !1) {
	return jm(e) || mm(e) || !hm(e) || (bm(e) > 1 && Object.defineProperties(e, {
		set: Am,
		add: Am,
		clear: Am,
		delete: Am
	}), Object.freeze(e), t && Object.values(e).forEach((e) => Om(e, !0))), e;
}
function km() {
	fm(2);
}
var Am = { value: km };
function jm(e) {
	return typeof e != "object" || !e || Object.isFrozen(e);
}
var Mm = {};
function Nm(e) {
	let t = Mm[e];
	return t || fm(0, e), t;
}
var Pm;
function Fm() {
	return Pm;
}
function Im(e, t) {
	return {
		drafts_: [],
		parent_: e,
		immer_: t,
		canAutoFreeze_: !0,
		unfinalizedDrafts_: 0
	};
}
function Lm(e, t) {
	t && (Nm("Patches"), e.patches_ = [], e.inversePatches_ = [], e.patchListener_ = t);
}
function Rm(e) {
	zm(e), e.drafts_.forEach(Vm), e.drafts_ = null;
}
function zm(e) {
	e === Pm && (Pm = e.parent_);
}
function Bm(e) {
	return Pm = Im(Pm, e);
}
function Vm(e) {
	let t = e[dm];
	t.type_ === 0 || t.type_ === 1 ? t.revoke_() : t.revoked_ = !0;
}
function Hm(e, t) {
	t.unfinalizedDrafts_ = t.drafts_.length;
	let n = t.drafts_[0];
	return e !== void 0 && e !== n ? (n[dm].modified_ && (Rm(t), fm(4)), hm(e) && (e = Um(t, e), t.parent_ || Gm(t, e)), t.patches_ && Nm("Patches").generateReplacementPatches_(n[dm].base_, e, t.patches_, t.inversePatches_)) : e = Um(t, n, []), Rm(t), t.patches_ && t.patchListener_(t.patches_, t.inversePatches_), e === lm ? void 0 : e;
}
function Um(e, t, n) {
	if (jm(t)) return t;
	let r = e.immer_.shouldUseStrictIteration(), i = t[dm];
	if (!i) return ym(t, (r, a) => Wm(e, i, t, r, a, n), r), t;
	if (i.scope_ !== e) return t;
	if (!i.modified_) return Gm(e, i.base_, !0), i.base_;
	if (!i.finalized_) {
		i.finalized_ = !0, i.scope_.unfinalizedDrafts_--;
		let t = i.copy_, a = t, o = !1;
		i.type_ === 3 && (a = new Set(t), t.clear(), o = !0), ym(a, (r, a) => Wm(e, i, t, r, a, n, o), r), Gm(e, t, !1), n && e.patches_ && Nm("Patches").generatePatches_(i, n, e.patches_, e.inversePatches_);
	}
	return i.copy_;
}
function Wm(e, t, n, r, i, a, o) {
	if (i == null || typeof i != "object" && !o) return;
	let s = jm(i);
	if (!s || o) {
		if (mm(i)) {
			let o = Um(e, i, a && t && t.type_ !== 3 && !xm(t.assigned_, r) ? a.concat(r) : void 0);
			if (Sm(n, r, o), mm(o)) e.canAutoFreeze_ = !1;
			else return;
		} else o && n.add(i);
		if (hm(i) && !s) {
			if (!e.immer_.autoFreeze_ && e.unfinalizedDrafts_ < 1 || t && t.base_ && t.base_[r] === i && s) return;
			Um(e, i), (!t || !t.scope_.parent_) && typeof r != "symbol" && (wm(n) ? n.has(r) : Object.prototype.propertyIsEnumerable.call(n, r)) && Gm(e, i);
		}
	}
}
function Gm(e, t, n = !1) {
	!e.parent_ && e.immer_.autoFreeze_ && e.canAutoFreeze_ && Om(t, n);
}
function Km(e, t) {
	let n = Array.isArray(e), r = {
		type_: +!!n,
		scope_: t ? t.scope_ : Fm(),
		modified_: !1,
		finalized_: !1,
		assigned_: {},
		parent_: t,
		base_: e,
		draft_: null,
		copy_: null,
		revoke_: null,
		isManual_: !1
	}, i = r, a = qm;
	n && (i = [r], a = Jm);
	let { revoke: o, proxy: s } = Proxy.revocable(i, a);
	return r.draft_ = s, r.revoke_ = o, s;
}
var qm = {
	get(e, t) {
		if (t === dm) return e;
		let n = Em(e);
		if (!xm(n, t)) return Xm(e, n, t);
		let r = n[t];
		return e.finalized_ || !hm(r) ? r : r === Ym(e.base_, t) ? ($m(e), e.copy_[t] = th(r, e)) : r;
	},
	has(e, t) {
		return t in Em(e);
	},
	ownKeys(e) {
		return Reflect.ownKeys(Em(e));
	},
	set(e, t, n) {
		let r = Zm(Em(e), t);
		if (r?.set) return r.set.call(e.draft_, n), !0;
		if (!e.modified_) {
			let r = Ym(Em(e), t), i = r?.[dm];
			if (i && i.base_ === n) return e.copy_[t] = n, e.assigned_[t] = !1, !0;
			if (Cm(n, r) && (n !== void 0 || xm(e.base_, t))) return !0;
			$m(e), Qm(e);
		}
		return e.copy_[t] === n && (n !== void 0 || t in e.copy_) || Number.isNaN(n) && Number.isNaN(e.copy_[t]) || (e.copy_[t] = n, e.assigned_[t] = !0), !0;
	},
	deleteProperty(e, t) {
		return Ym(e.base_, t) !== void 0 || t in e.base_ ? (e.assigned_[t] = !1, $m(e), Qm(e)) : delete e.assigned_[t], e.copy_ && delete e.copy_[t], !0;
	},
	getOwnPropertyDescriptor(e, t) {
		let n = Em(e), r = Reflect.getOwnPropertyDescriptor(n, t);
		return r && {
			writable: !0,
			configurable: e.type_ !== 1 || t !== "length",
			enumerable: r.enumerable,
			value: n[t]
		};
	},
	defineProperty() {
		fm(11);
	},
	getPrototypeOf(e) {
		return pm(e.base_);
	},
	setPrototypeOf() {
		fm(12);
	}
}, Jm = {};
ym(qm, (e, t) => {
	Jm[e] = function() {
		return arguments[0] = arguments[0][0], t.apply(this, arguments);
	};
}), Jm.deleteProperty = function(e, t) {
	return Jm.set.call(this, e, t, void 0);
}, Jm.set = function(e, t, n) {
	return qm.set.call(this, e[0], t, n, e[0]);
};
function Ym(e, t) {
	let n = e[dm];
	return (n ? Em(n) : e)[t];
}
function Xm(e, t, n) {
	let r = Zm(t, n);
	return r ? "value" in r ? r.value : r.get?.call(e.draft_) : void 0;
}
function Zm(e, t) {
	if (!(t in e)) return;
	let n = pm(e);
	for (; n;) {
		let e = Object.getOwnPropertyDescriptor(n, t);
		if (e) return e;
		n = pm(n);
	}
}
function Qm(e) {
	e.modified_ || (e.modified_ = !0, e.parent_ && Qm(e.parent_));
}
function $m(e) {
	e.copy_ ||= Dm(e.base_, e.scope_.immer_.useStrictShallowCopy_);
}
var eh = class {
	constructor(e) {
		this.autoFreeze_ = !0, this.useStrictShallowCopy_ = !1, this.useStrictIteration_ = !0, this.produce = (e, t, n) => {
			if (typeof e == "function" && typeof t != "function") {
				let n = t;
				t = e;
				let r = this;
				return function(e = n, ...i) {
					return r.produce(e, (e) => t.call(this, e, ...i));
				};
			}
			typeof t != "function" && fm(6), n !== void 0 && typeof n != "function" && fm(7);
			let r;
			if (hm(e)) {
				let i = Bm(this), a = th(e, void 0), o = !0;
				try {
					r = t(a), o = !1;
				} finally {
					o ? Rm(i) : zm(i);
				}
				return Lm(i, n), Hm(r, i);
			}
			if (!e || typeof e != "object") {
				if (r = t(e), r === void 0 && (r = e), r === lm && (r = void 0), this.autoFreeze_ && Om(r, !0), n) {
					let t = [], i = [];
					Nm("Patches").generateReplacementPatches_(e, r, t, i), n(t, i);
				}
				return r;
			}
			fm(1, e);
		}, this.produceWithPatches = (e, t) => {
			if (typeof e == "function") return (t, ...n) => this.produceWithPatches(t, (t) => e(t, ...n));
			let n, r;
			return [
				this.produce(e, t, (e, t) => {
					n = e, r = t;
				}),
				n,
				r
			];
		}, typeof e?.autoFreeze == "boolean" && this.setAutoFreeze(e.autoFreeze), typeof e?.useStrictShallowCopy == "boolean" && this.setUseStrictShallowCopy(e.useStrictShallowCopy), typeof e?.useStrictIteration == "boolean" && this.setUseStrictIteration(e.useStrictIteration);
	}
	createDraft(e) {
		hm(e) || fm(8), mm(e) && (e = nh(e));
		let t = Bm(this), n = th(e, void 0);
		return n[dm].isManual_ = !0, zm(t), n;
	}
	finishDraft(e, t) {
		let n = e && e[dm];
		n && n.isManual_ || fm(9);
		let { scope_: r } = n;
		return Lm(r, t), Hm(void 0, r);
	}
	setAutoFreeze(e) {
		this.autoFreeze_ = e;
	}
	setUseStrictShallowCopy(e) {
		this.useStrictShallowCopy_ = e;
	}
	setUseStrictIteration(e) {
		this.useStrictIteration_ = e;
	}
	shouldUseStrictIteration() {
		return this.useStrictIteration_;
	}
	applyPatches(e, t) {
		let n;
		for (n = t.length - 1; n >= 0; n--) {
			let r = t[n];
			if (r.path.length === 0 && r.op === "replace") {
				e = r.value;
				break;
			}
		}
		n > -1 && (t = t.slice(n + 1));
		let r = Nm("Patches").applyPatches_;
		return mm(e) ? r(e, t) : this.produce(e, (e) => r(e, t));
	}
};
function th(e, t) {
	let n = wm(e) ? Nm("MapSet").proxyMap_(e, t) : Tm(e) ? Nm("MapSet").proxySet_(e, t) : Km(e, t);
	return (t ? t.scope_ : Fm()).drafts_.push(n), n;
}
function nh(e) {
	return mm(e) || fm(10, e), rh(e);
}
function rh(e) {
	if (!hm(e) || jm(e)) return e;
	let t = e[dm], n, r = !0;
	if (t) {
		if (!t.modified_) return t.base_;
		t.finalized_ = !0, n = Dm(e, t.scope_.immer_.useStrictShallowCopy_), r = t.scope_.immer_.shouldUseStrictIteration();
	} else n = Dm(e, !0);
	return ym(n, (e, t) => {
		Sm(n, e, rh(t));
	}, r), t && (t.finalized_ = !1), n;
}
new eh().produce;
function Q(e) {
	return e;
}
// node_modules/recharts/es6/state/legendSlice.js
var ih = Rd({
	name: "legend",
	initialState: {
		settings: {
			layout: "horizontal",
			align: "center",
			verticalAlign: "middle",
			itemSorter: "value"
		},
		size: {
			width: 0,
			height: 0
		},
		payload: []
	},
	reducers: {
		setLegendSize(e, t) {
			e.size.width = t.payload.width, e.size.height = t.payload.height;
		},
		setLegendSettings(e, t) {
			e.settings.align = t.payload.align, e.settings.layout = t.payload.layout, e.settings.verticalAlign = t.payload.verticalAlign, e.settings.itemSorter = t.payload.itemSorter;
		},
		addLegendPayload: {
			reducer(e, t) {
				e.payload.push(Q(t.payload));
			},
			prepare: Y()
		},
		replaceLegendPayload: {
			reducer(e, t) {
				var { prev: n, next: r } = t.payload, i = ud(e).payload.indexOf(Q(n));
				i > -1 && (e.payload[i] = Q(r));
			},
			prepare: Y()
		},
		removeLegendPayload: {
			reducer(e, t) {
				var n = ud(e).payload.indexOf(Q(t.payload));
				n > -1 && e.payload.splice(n, 1);
			},
			prepare: Y()
		}
	}
}), { setLegendSize: ah, setLegendSettings: oh, addLegendPayload: sh, replaceLegendPayload: ch, removeLegendPayload: lh } = ih.actions, uh = ih.reducer, dh = /* @__PURE__ */ o(((e) => {
	var t = d();
	t.useSyncExternalStore, t.useRef, t.useEffect, t.useMemo, t.useDebugValue;
}));
(/* @__PURE__ */ o(((e, t) => {
	t.exports = dh();
})))();
function fh(e) {
	e();
}
function ph() {
	let e = null, t = null;
	return {
		clear() {
			e = null, t = null;
		},
		notify() {
			fh(() => {
				let t = e;
				for (; t;) t.callback(), t = t.next;
			});
		},
		get() {
			let t = [], n = e;
			for (; n;) t.push(n), n = n.next;
			return t;
		},
		subscribe(n) {
			let r = !0, i = t = {
				callback: n,
				next: null,
				prev: t
			};
			return i.prev ? i.prev.next = i : e = i, function() {
				r && e !== null && (r = !1, i.next ? i.next.prev = i.prev : t = i.prev, i.prev ? i.prev.next = i.next : e = i.next);
			};
		}
	};
}
var mh = {
	notify() {},
	get: () => []
};
function hh(e, t) {
	let n, r = mh, i = 0, a = !1;
	function o(e) {
		u();
		let t = r.subscribe(e), n = !1;
		return () => {
			n || (n = !0, t(), d());
		};
	}
	function s() {
		r.notify();
	}
	function c() {
		m.onStateChange && m.onStateChange();
	}
	function l() {
		return a;
	}
	function u() {
		i++, n || (n = t ? t.addNestedSub(c) : e.subscribe(c), r = ph());
	}
	function d() {
		i--, n && i === 0 && (n(), n = void 0, r.clear(), r = mh);
	}
	function f() {
		a || (a = !0, u());
	}
	function p() {
		a && (a = !1, d());
	}
	let m = {
		addNestedSub: o,
		notifyNestedSubs: s,
		handleChangeWrapper: c,
		isSubscribed: l,
		trySubscribe: f,
		tryUnsubscribe: p,
		getListeners: () => r
	};
	return m;
}
var gh = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, _h = typeof navigator < "u" && navigator.product === "ReactNative", vh = gh || _h ? v.useLayoutEffect : v.useEffect;
function yh(e, t) {
	return e === t ? e !== 0 || t !== 0 || 1 / e == 1 / t : e !== e && t !== t;
}
function bh(e, t) {
	if (yh(e, t)) return !0;
	if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
	let n = Object.keys(e), r = Object.keys(t);
	if (n.length !== r.length) return !1;
	for (let r = 0; r < n.length; r++) if (!Object.prototype.hasOwnProperty.call(t, n[r]) || !yh(e[n[r]], t[n[r]])) return !1;
	return !0;
}
var xh = /* @__PURE__ */ Symbol.for("react-redux-context"), Sh = typeof globalThis < "u" ? globalThis : {};
function Ch() {
	if (!v.createContext) return {};
	let e = Sh[xh] ??= /* @__PURE__ */ new Map(), t = e.get(v.createContext);
	return t || (t = v.createContext(null), e.set(v.createContext, t)), t;
}
var wh = /*#__PURE__*/ Ch();
function Th(e) {
	let { children: t, context: n, serverState: r, store: i } = e, a = v.useMemo(() => {
		let e = hh(i);
		return {
			store: i,
			subscription: e,
			getServerState: r == null ? void 0 : () => r
		};
	}, [i, r]), o = v.useMemo(() => i.getState(), [i]);
	vh(() => {
		let { subscription: e } = a;
		return e.onStateChange = e.notifyNestedSubs, e.trySubscribe(), o !== i.getState() && e.notifyNestedSubs(), () => {
			e.tryUnsubscribe(), e.onStateChange = void 0;
		};
	}, [a, o]);
	let s = n || wh;
	return /* @__PURE__ */ v.createElement(s.Provider, { value: a }, t);
}
// node_modules/recharts/es6/util/propsAreEqual.js
var Eh = /* @__PURE__ */ new Set([
	"axisLine",
	"tickLine",
	"activeBar",
	"activeDot",
	"activeLabel",
	"activeShape",
	"allowEscapeViewBox",
	"background",
	"cursor",
	"dot",
	"label",
	"line",
	"margin",
	"padding",
	"position",
	"shape",
	"style",
	"tick",
	"wrapperStyle",
	"radius",
	"throttledEvents"
]);
function Dh(e, t) {
	return e == null && t == null ? !0 : typeof e == "number" && typeof t == "number" ? e === t || e !== e && t !== t : e === t;
}
function Oh(e, t) {
	for (var n of /* @__PURE__ */ new Set([...Object.keys(e), ...Object.keys(t)])) if (Eh.has(n)) {
		if (e[n] == null && t[n] == null) continue;
		if (!bh(e[n], t[n])) return !1;
	} else if (!Dh(e[n], t[n])) return !1;
	return !0;
}
// node_modules/recharts/es6/component/DefaultTooltipContent.js
function kh() {
	return kh = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, kh.apply(null, arguments);
}
function Ah(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function jh(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Ah(Object(n), !0).forEach(function(t) {
			Mh(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Ah(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Mh(e, t, n) {
	return (t = Nh(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Nh(e) {
	var t = Ph(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Ph(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function Fh(e) {
	return Array.isArray(e) && ls(e[0]) && ls(e[1]) ? e.join(" ~ ") : e;
}
var Ih = {
	separator: " : ",
	contentStyle: {
		margin: 0,
		padding: 10,
		backgroundColor: "#fff",
		border: "1px solid #ccc",
		whiteSpace: "nowrap"
	},
	itemStyle: {
		display: "block",
		paddingTop: 4,
		paddingBottom: 4,
		color: "#000"
	},
	labelStyle: {},
	accessibilityLayer: !1
};
function Lh(e, t) {
	return t == null ? e : jl(e, t);
}
var Rh = (e) => {
	var { separator: t = Ih.separator, contentStyle: n, itemStyle: r, labelStyle: i = Ih.labelStyle, payload: a, formatter: o, itemSorter: s, wrapperClassName: c, labelClassName: l, label: u, labelFormatter: d, accessibilityLayer: f = Ih.accessibilityLayer } = e, p = () => {
		if (a && a.length) {
			var e = {
				padding: 0,
				margin: 0
			}, n = Lh(a, s).map((e, n) => {
				if (e.type === "none") return null;
				var i = e.formatter || o || Fh, { value: s, name: c } = e, l = s, u = c;
				if (i) {
					var d = i(s, c, e, n, a);
					if (Array.isArray(d)) [l, u] = d;
					else if (d != null) l = d;
					else return null;
				}
				var f = jh(jh({}, Ih.itemStyle), {}, { color: e.color || Ih.itemStyle.color }, r);
				return /*#__PURE__*/ v.createElement("li", {
					className: "recharts-tooltip-item",
					key: `tooltip-item-${n}`,
					style: f
				}, ls(u) ? /*#__PURE__*/ v.createElement("span", { className: "recharts-tooltip-item-name" }, u) : null, ls(u) ? /*#__PURE__*/ v.createElement("span", { className: "recharts-tooltip-item-separator" }, t) : null, /*#__PURE__*/ v.createElement("span", { className: "recharts-tooltip-item-value" }, l), /*#__PURE__*/ v.createElement("span", { className: "recharts-tooltip-item-unit" }, e.unit || ""));
			});
			return /*#__PURE__*/ v.createElement("ul", {
				className: "recharts-tooltip-item-list",
				style: e
			}, n);
		}
		return null;
	}, m = jh(jh({}, Ih.contentStyle), n), h = jh({ margin: 0 }, i), g = !gs(u), _ = g ? u : "", y = I("recharts-default-tooltip", c), b = I("recharts-tooltip-label", l);
	g && d && a != null && (_ = d(u, a));
	var x = f ? {
		role: "status",
		"aria-live": "assertive"
	} : {};
	return /*#__PURE__*/ v.createElement("div", kh({
		className: y,
		style: m
	}, x), /*#__PURE__*/ v.createElement("p", {
		className: b,
		style: h
	}, /*#__PURE__*/ v.isValidElement(_) ? _ : `${_}`), p());
}, zh = "recharts-tooltip-wrapper", Bh = { visibility: "hidden" };
function Vh(e) {
	var { coordinate: t, translateX: n, translateY: r } = e;
	return I(zh, {
		[`${zh}-right`]: W(n) && t && W(t.x) && n >= t.x,
		[`${zh}-left`]: W(n) && t && W(t.x) && n < t.x,
		[`${zh}-bottom`]: W(r) && t && W(t.y) && r >= t.y,
		[`${zh}-top`]: W(r) && t && W(t.y) && r < t.y
	});
}
function Hh(e) {
	var { allowEscapeViewBox: t, coordinate: n, key: r, offset: i, position: a, reverseDirection: o, tooltipDimension: s, viewBox: c, viewBoxDimension: l } = e;
	if (a && W(a[r])) return a[r];
	var u = n[r] - s - (i > 0 ? i : 0), d = n[r] + i;
	if (t[r]) return o[r] ? u : d;
	var f = c[r];
	return f == null ? 0 : o[r] ? Math.max(u < f ? d : u, f) : l == null ? 0 : d + s > f + l ? Math.max(u, f) : Math.max(d, f);
}
function Uh(e) {
	var { translateX: t, translateY: n, useTranslate3d: r } = e;
	return { transform: r ? `translate3d(${t}px, ${n}px, 0)` : `translate(${t}px, ${n}px)` };
}
function Wh(e) {
	var { allowEscapeViewBox: t, coordinate: n, offsetTop: r, offsetLeft: i, position: a, reverseDirection: o, tooltipBox: s, useTranslate3d: c, viewBox: l } = e, u, d, f;
	return s.height > 0 && s.width > 0 && n ? (d = Hh({
		allowEscapeViewBox: t,
		coordinate: n,
		key: "x",
		offset: i,
		position: a,
		reverseDirection: o,
		tooltipDimension: s.width,
		viewBox: l,
		viewBoxDimension: l.width
	}), f = Hh({
		allowEscapeViewBox: t,
		coordinate: n,
		key: "y",
		offset: r,
		position: a,
		reverseDirection: o,
		tooltipDimension: s.height,
		viewBox: l,
		viewBoxDimension: l.height
	}), u = Uh({
		translateX: d,
		translateY: f,
		useTranslate3d: c
	})) : u = Bh, {
		cssProperties: u,
		cssClasses: Vh({
			translateX: d,
			translateY: f,
			coordinate: n
		})
	};
}
var Gh = {
	devToolsEnabled: !0,
	isSsr: !(typeof window < "u" && window.document && window.document.createElement && window.setTimeout)
};
// node_modules/recharts/es6/util/usePrefersReducedMotion.js
function Kh() {
	var [e, t] = (0, v.useState)(() => Gh.isSsr || !window.matchMedia ? !1 : window.matchMedia("(prefers-reduced-motion: reduce)").matches);
	return (0, v.useEffect)(() => {
		if (window.matchMedia) {
			var e = window.matchMedia("(prefers-reduced-motion: reduce)"), n = () => {
				t(e.matches);
			};
			return e.addEventListener("change", n), () => {
				e.removeEventListener("change", n);
			};
		}
	}, []), e;
}
// node_modules/recharts/es6/component/TooltipBoundingBox.js
function qh(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Jh(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? qh(Object(n), !0).forEach(function(t) {
			Yh(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : qh(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Yh(e, t, n) {
	return (t = Xh(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Xh(e) {
	var t = Zh(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Zh(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function Qh(e) {
	if (!(e.prefersReducedMotion && e.isAnimationActive === "auto") && e.isAnimationActive && e.active) return `transform ${e.animationDuration}ms ${e.animationEasing}`;
}
function $h(e) {
	var t = Kh(), [n, r] = v.useState(() => ({
		dismissed: !1,
		dismissedAtCoordinate: {
			x: 0,
			y: 0
		}
	}));
	v.useEffect(() => {
		var t = (t) => {
			t.key === "Escape" && r({
				dismissed: !0,
				dismissedAtCoordinate: {
					x: e.coordinate?.x ?? 0,
					y: e.coordinate?.y ?? 0
				}
			});
		};
		return document.addEventListener("keydown", t), () => {
			document.removeEventListener("keydown", t);
		};
	}, [e.coordinate?.x, e.coordinate?.y]), n.dismissed && ((e.coordinate?.x ?? 0) !== n.dismissedAtCoordinate.x || (e.coordinate?.y ?? 0) !== n.dismissedAtCoordinate.y) && r(Jh(Jh({}, n), {}, { dismissed: !1 }));
	var { cssClasses: i, cssProperties: a } = Wh({
		allowEscapeViewBox: e.allowEscapeViewBox,
		coordinate: e.coordinate,
		offsetLeft: typeof e.offset == "number" ? e.offset : e.offset.x,
		offsetTop: typeof e.offset == "number" ? e.offset : e.offset.y,
		position: e.position,
		reverseDirection: e.reverseDirection,
		tooltipBox: {
			height: e.lastBoundingBox.height,
			width: e.lastBoundingBox.width
		},
		useTranslate3d: e.useTranslate3d,
		viewBox: e.viewBox
	}), o = Jh(Jh({}, e.hasPortalFromProps ? {} : Jh(Jh({ transition: Qh({
		prefersReducedMotion: t,
		isAnimationActive: e.isAnimationActive,
		active: e.active,
		animationDuration: e.animationDuration,
		animationEasing: e.animationEasing
	}) }, a), {}, {
		pointerEvents: "none",
		position: "absolute",
		top: 0,
		left: 0
	})), {}, { visibility: !n.dismissed && e.active && e.hasPayload ? "visible" : "hidden" }, e.wrapperStyle);
	return /*#__PURE__*/ v.createElement("div", {
		xmlns: "http://www.w3.org/1999/xhtml",
		tabIndex: -1,
		className: i,
		style: o,
		ref: e.innerRef
	}, e.children);
}
var eg = /*#__PURE__*/ v.memo($h), tg = () => G((e) => e.rootProps.accessibilityLayer) ?? !0;
// node_modules/recharts/es6/shape/Curve.js
function ng() {
	return ng = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, ng.apply(null, arguments);
}
function rg(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function ig(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? rg(Object(n), !0).forEach(function(t) {
			ag(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : rg(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function ag(e, t, n) {
	return (t = og(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function og(e) {
	var t = sg(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function sg(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var cg = {
	curveBasisClosed: co,
	curveBasisOpen: uo,
	curveBasis: oo,
	curveBumpX: Ia,
	curveBumpY: La,
	curveLinearClosed: So,
	curveLinear: Oa,
	curveMonotoneX: Ao,
	curveMonotoneY: jo,
	curveNatural: Po,
	curveStep: Io,
	curveStepAfter: Ro,
	curveStepBefore: Lo
}, lg = (e) => X(e.x) && X(e.y), ug = (e) => e.base != null && lg(e.base) && lg(e), dg = (e) => e.x, fg = (e) => e.y, pg = (e, t) => {
	if (typeof e == "function") return e;
	var n = `curve${_s(e)}`;
	if ((n === "curveMonotone" || n === "curveBump") && t) {
		var r = cg[`${n}${t === "vertical" ? "Y" : "X"}`];
		if (r) return r;
	}
	return cg[n] || Oa;
}, mg = {
	connectNulls: !1,
	type: "linear"
}, hg = (e) => {
	var { type: t = mg.type, points: n = [], baseLine: r, layout: i, connectNulls: a = mg.connectNulls } = e, o = pg(t, i), s = a ? n.filter(lg) : n;
	if (Array.isArray(r)) {
		var c, l = n.map((e, t) => ig(ig({}, e), {}, { base: r[t] }));
		return c = i === "vertical" ? Ma().y(fg).x1(dg).x0((e) => e.base.x) : Ma().x(dg).y1(fg).y0((e) => e.base.y), c.defined(ug).curve(o)(a ? l.filter(ug) : l);
	}
	return (i === "vertical" && W(r) ? Ma().y(fg).x1(dg).x0(r) : W(r) ? Ma().x(dg).y1(fg).y0(r) : ja().x(dg).y(fg)).defined(lg).curve(o)(s);
}, gg = (e) => {
	var { className: t, points: n, path: r, pathRef: i } = e, a = im();
	if ((!n || !n.length) && !r) return null;
	var o = {
		type: e.type,
		points: e.points,
		baseLine: e.baseLine,
		layout: e.layout || a,
		connectNulls: e.connectNulls
	}, s = n && n.length ? hg(o) : r;
	return /*#__PURE__*/ v.createElement("path", ng({}, Xi(e), Is(e), {
		className: I("recharts-curve", t),
		d: s === null ? void 0 : s,
		ref: i
	}));
}, _g = [
	"x",
	"y",
	"top",
	"left",
	"width",
	"height",
	"className"
];
function vg() {
	return vg = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, vg.apply(null, arguments);
}
function yg(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function bg(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? yg(Object(n), !0).forEach(function(t) {
			xg(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : yg(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function xg(e, t, n) {
	return (t = Sg(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Sg(e) {
	var t = Cg(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Cg(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function wg(e, t) {
	if (e == null) return {};
	var n, r, i = Tg(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function Tg(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var Eg = (e, t, n, r, i, a) => `M${e},${i}v${r}M${a},${t}h${n}`, Dg = (e) => {
	var { x: t = 0, y: n = 0, top: r = 0, left: i = 0, width: a = 0, height: o = 0, className: s } = e, c = wg(e, _g), l = bg({
		x: t,
		y: n,
		top: r,
		left: i,
		width: a,
		height: o
	}, c);
	return !W(t) || !W(n) || !W(a) || !W(o) || !W(r) || !W(i) ? null : /*#__PURE__*/ v.createElement("path", vg({}, Qi(l), {
		className: I("recharts-cross", s),
		d: Eg(t, n, a, o, r, i)
	}));
};
// node_modules/recharts/es6/util/cursor/getCursorRectangle.js
function Og(e, t, n, r) {
	var i = r / 2;
	return {
		stroke: "none",
		fill: "#ccc",
		x: e === "horizontal" ? t.x - i : n.left + .5,
		y: e === "horizontal" ? n.top + .5 : t.y - i,
		width: e === "horizontal" ? r : n.width - 1,
		height: e === "horizontal" ? n.height - 1 : r
	};
}
// node_modules/recharts/es6/animation/util.js
function kg(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Ag(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? kg(Object(n), !0).forEach(function(t) {
			jg(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : kg(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function jg(e, t, n) {
	return (t = Mg(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Mg(e) {
	var t = Ng(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Ng(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var Pg = (e) => e.replace(/([A-Z])/g, (e) => `-${e.toLowerCase()}`), Fg = (e, t, n) => e.map((e) => `${Pg(e)} ${t}ms ${n}`).join(","), Ig = (e, t) => [Object.keys(e), Object.keys(t)].reduce((e, t) => e.filter((e) => t.includes(e))), Lg = (e, t) => Object.keys(t).reduce((n, r) => Ag(Ag({}, n), {}, { [r]: e(r, t[r]) }), {});
// node_modules/recharts/es6/animation/configUpdate.js
function Rg(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function zg(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Rg(Object(n), !0).forEach(function(t) {
			Bg(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Rg(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Bg(e, t, n) {
	return (t = Vg(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Vg(e) {
	var t = Hg(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Hg(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var Ug = (e, t, n) => e + (t - e) * n, Wg = (e) => {
	var { from: t, to: n } = e;
	return t !== n;
}, Gg = (e, t, n) => {
	var r = Lg((t, n) => {
		if (Wg(n)) {
			var [r, i] = e(n.from, n.to, n.velocity);
			return zg(zg({}, n), {}, {
				from: r,
				velocity: i
			});
		}
		return n;
	}, t);
	return n < 1 ? Lg((e, t) => Wg(t) && r[e] != null ? zg(zg({}, t), {}, {
		velocity: Ug(t.velocity, r[e].velocity, n),
		from: Ug(t.from, r[e].from, n)
	}) : t, t) : Gg(e, r, n - 1);
};
function Kg(e, t, n, r, i, a) {
	var o, s = r.reduce((n, r) => zg(zg({}, n), {}, { [r]: {
		from: e[r],
		velocity: 0,
		to: t[r]
	} }), {}), c = () => Lg((e, t) => t.from, s), l = () => !Object.values(s).filter(Wg).length, u = null, d = (r) => {
		o ||= r;
		var f = (r - o) / n.dt;
		s = Gg(n, s, f), i(zg(zg(zg({}, e), t), c())), o = r, l() || (u = a.setTimeout(d));
	};
	return () => (u = a.setTimeout(d), () => {
		var e;
		(e = u) == null || e();
	});
}
function qg(e, t, n, r, i, a, o) {
	var s = null, c = i.reduce((n, r) => {
		var i = e[r], a = t[r];
		return i == null || a == null ? n : zg(zg({}, n), {}, { [r]: [i, a] });
	}, {}), l, u = (i) => {
		l ||= i;
		var d = (i - l) / r, f = Lg((e, t) => Ug(...t, n(d)), c);
		if (a(zg(zg(zg({}, e), t), f)), d < 1) s = o.setTimeout(u);
		else {
			var p = Lg((e, t) => Ug(...t, n(1)), c);
			a(zg(zg(zg({}, e), t), p));
		}
	};
	return () => (s = o.setTimeout(u), () => {
		var e;
		(e = s) == null || e();
	});
}
var Jg = (e, t, n, r, i, a) => {
	var o = Ig(e, t);
	return n == null ? () => (i(zg(zg({}, e), t)), () => {}) : n.isStepper === !0 ? Kg(e, t, n, o, i, a) : qg(e, t, n, r, o, i, a);
}, Yg = (e, t) => [
	0,
	3 * e,
	3 * t - 6 * e,
	3 * e - 3 * t + 1
], Xg = (e, t) => e.map((e, n) => e * t ** n).reduce((e, t) => e + t), Zg = (e, t) => (n) => Xg(Yg(e, t), n), Qg = (e, t) => (n) => Xg([...Yg(e, t).map((e, t) => e * t).slice(1), 0], n), $g = (e) => {
	var t, n = e.split("(");
	if (n.length !== 2 || n[0] !== "cubic-bezier") return null;
	var r = (t = n[1]) == null || (t = t.split(")")[0]) == null ? void 0 : t.split(",");
	if (r == null || r.length !== 4) return null;
	var i = r.map((e) => parseFloat(e));
	return [
		i[0],
		i[1],
		i[2],
		i[3]
	];
}, e_ = function() {
	var e = [...arguments];
	if (e.length === 1) switch (e[0]) {
		case "linear": return [
			0,
			0,
			1,
			1
		];
		case "ease": return [
			.25,
			.1,
			.25,
			1
		];
		case "ease-in": return [
			.42,
			0,
			1,
			1
		];
		case "ease-out": return [
			.42,
			0,
			.58,
			1
		];
		case "ease-in-out": return [
			0,
			0,
			.58,
			1
		];
		default:
			var t = $g(e[0]);
			if (t) return t;
	}
	return e.length === 4 ? e : [
		0,
		0,
		1,
		1
	];
}, t_ = (e, t, n, r) => {
	var i = Zg(e, n), a = Zg(t, r), o = Qg(e, n), s = (e) => e > 1 ? 1 : e < 0 ? 0 : e, c = (e) => {
		for (var t = e > 1 ? 1 : e, n = t, r = 0; r < 8; ++r) {
			var c = i(n) - t, l = o(n);
			if (Math.abs(c - t) < 1e-4 || l < 1e-4) return a(n);
			n = s(n - c / l);
		}
		return a(n);
	};
	return c.isStepper = !1, c;
}, n_ = function() {
	return t_(...e_(...arguments));
}, r_ = function() {
	var { stiff: e = 100, damping: t = 8, dt: n = 17 } = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = (r, i, a) => {
		var o = a + (-(r - i) * e - a * t) * n / 1e3, s = a * n / 1e3 + r;
		return Math.abs(s - i) < 1e-4 && Math.abs(o) < 1e-4 ? [i, 0] : [s, o];
	};
	return r.isStepper = !0, r.dt = n, r;
}, i_ = (e) => {
	if (typeof e == "string") switch (e) {
		case "ease":
		case "ease-in-out":
		case "ease-out":
		case "ease-in":
		case "linear": return n_(e);
		case "spring": return r_();
		default: if (e.split("(")[0] === "cubic-bezier") return n_(e);
	}
	return typeof e == "function" ? e : null;
};
// node_modules/recharts/es6/animation/AnimationManager.js
function a_(e) {
	var t, n = () => null, r = !1, i = null, a = (o) => {
		if (!r) {
			if (Array.isArray(o)) {
				if (!o.length) return;
				var [s, ...c] = o;
				if (typeof s == "number") {
					i = e.setTimeout(a.bind(null, c), s);
					return;
				}
				a(s), i = e.setTimeout(a.bind(null, c));
			} else typeof o == "string" && (t = o, n(t)), typeof o == "object" && (t = o, n(t)), typeof o == "function" && o();
		}
	};
	return {
		stop: () => {
			r = !0;
		},
		start: (e) => {
			r = !1, i &&= (i(), null), a(e);
		},
		subscribe: (e) => (n = e, () => {
			n = () => null;
		}),
		getTimeoutController: () => e
	};
}
// node_modules/recharts/es6/animation/timeoutController.js
var o_ = class {
	setTimeout(e) {
		var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, n = performance.now(), r = null, i = (a) => {
			a - n >= t ? e(a) : typeof requestAnimationFrame == "function" && (r = requestAnimationFrame(i));
		};
		return r = requestAnimationFrame(i), () => {
			r != null && cancelAnimationFrame(r);
		};
	}
};
// node_modules/recharts/es6/animation/createDefaultAnimationManager.js
function s_() {
	return a_(new o_());
}
// node_modules/recharts/es6/animation/useAnimationManager.js
var c_ = /*#__PURE__*/ (0, v.createContext)(s_);
function l_(e, t) {
	var n = (0, v.useContext)(c_);
	return (0, v.useMemo)(() => t ?? n(e), [
		e,
		t,
		n
	]);
}
// node_modules/recharts/es6/animation/JavascriptAnimate.js
var u_ = {
	begin: 0,
	duration: 1e3,
	easing: "ease",
	isActive: !0,
	canBegin: !0,
	onAnimationEnd: () => {},
	onAnimationStart: () => {}
}, d_ = { t: 0 }, f_ = { t: 1 };
function p_(e) {
	var t = Ws(e, u_), { isActive: n, canBegin: r, duration: i, easing: a, begin: o, onAnimationEnd: s, onAnimationStart: c, children: l } = t, u = Kh(), d = n === "auto" ? !Gh.isSsr && !u : n, f = l_(t.animationId, t.animationManager), [p, m] = (0, v.useState)(d ? d_ : f_), h = (0, v.useRef)(null);
	return (0, v.useEffect)(() => {
		d || m(f_);
	}, [d]), (0, v.useEffect)(() => {
		if (!d || !r) return ys;
		var e = Jg(d_, f_, i_(a), i, m, f.getTimeoutController());
		return f.start([
			c,
			o,
			() => {
				h.current = e();
			},
			i,
			s
		]), () => {
			f.stop(), h.current && h.current(), s();
		};
	}, [
		d,
		r,
		i,
		a,
		o,
		c,
		s,
		f
	]), l(p.t);
}
// node_modules/recharts/es6/util/useAnimationId.js
function m_(e) {
	var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "animation-", n = (0, v.useRef)(ds(t)), r = (0, v.useRef)(e);
	return r.current !== e && (n.current = ds(t), r.current = e), n.current;
}
// node_modules/recharts/es6/shape/Rectangle.js
var h_ = ["radius"], g_ = ["radius"], __, v_, y_, b_, x_, S_, C_, w_, T_, E_;
function D_(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function O_(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? D_(Object(n), !0).forEach(function(t) {
			k_(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : D_(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function k_(e, t, n) {
	return (t = A_(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function A_(e) {
	var t = j_(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function j_(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function M_() {
	return M_ = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, M_.apply(null, arguments);
}
function N_(e, t) {
	if (e == null) return {};
	var n, r, i = P_(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function P_(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function F_(e, t) {
	return t ||= e.slice(0), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }));
}
var I_ = (e, t, n, r, i) => {
	var a = as(n), o = as(r), s = Math.min(Math.abs(a) / 2, Math.abs(o) / 2), c = o >= 0 ? 1 : -1, l = a >= 0 ? 1 : -1, u = +(o >= 0 && a >= 0 || o < 0 && a < 0), d;
	if (s > 0 && Array.isArray(i)) {
		for (var f = [
			0,
			0,
			0,
			0
		], p = 0, m = 4; p < m; p++) {
			var h = i[p] ?? 0;
			f[p] = h > s ? s : h;
		}
		d = U(__ ||= F_([
			"M",
			",",
			""
		]), e, t + c * f[0]), f[0] > 0 && (d += U(v_ ||= F_([
			"A ",
			",",
			",0,0,",
			",",
			",",
			""
		]), f[0], f[0], u, e + l * f[0], t)), d += U(y_ ||= F_([
			"L ",
			",",
			""
		]), e + n - l * f[1], t), f[1] > 0 && (d += U(b_ ||= F_([
			"A ",
			",",
			",0,0,",
			",\n        ",
			",",
			""
		]), f[1], f[1], u, e + n, t + c * f[1])), d += U(x_ ||= F_([
			"L ",
			",",
			""
		]), e + n, t + r - c * f[2]), f[2] > 0 && (d += U(S_ ||= F_([
			"A ",
			",",
			",0,0,",
			",\n        ",
			",",
			""
		]), f[2], f[2], u, e + n - l * f[2], t + r)), d += U(C_ ||= F_([
			"L ",
			",",
			""
		]), e + l * f[3], t + r), f[3] > 0 && (d += U(w_ ||= F_([
			"A ",
			",",
			",0,0,",
			",\n        ",
			",",
			""
		]), f[3], f[3], u, e, t + r - c * f[3])), d += "Z";
	} else if (s > 0 && i === +i && i > 0) {
		var g = Math.min(s, i);
		d = U(T_ ||= F_(/* @__PURE__ */ "M .,.\n            A .,.,0,0,.,.,.\n            L .,.\n            A .,.,0,0,.,.,.\n            L .,.\n            A .,.,0,0,.,.,.\n            L .,.\n            A .,.,0,0,.,.,. Z".split(".")), e, t + c * g, g, g, u, e + l * g, t, e + n - l * g, t, g, g, u, e + n, t + c * g, e + n, t + r - c * g, g, g, u, e + n - l * g, t + r, e + l * g, t + r, g, g, u, e, t + r - c * g);
	} else d = U(E_ ||= F_([
		"M ",
		",",
		" h ",
		" v ",
		" h ",
		" Z"
	]), e, t, n, r, -n);
	return d;
}, L_ = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	radius: 0,
	isAnimationActive: !1,
	isUpdateAnimationActive: !1,
	animationBegin: 0,
	animationDuration: 1500,
	animationEasing: "ease"
}, R_ = (e) => {
	var t = Ws(e, L_), n = (0, v.useRef)(null), [r, i] = (0, v.useState)(-1);
	(0, v.useEffect)(() => {
		if (n.current && n.current.getTotalLength) try {
			var e = n.current.getTotalLength();
			e && i(e);
		} catch {}
	}, []);
	var { x: a, y: o, width: s, height: c, radius: l, className: u } = t, { animationEasing: d, animationDuration: f, animationBegin: p, isAnimationActive: m, isUpdateAnimationActive: h } = t, g = (0, v.useRef)(s), _ = (0, v.useRef)(c), y = (0, v.useRef)(a), b = (0, v.useRef)(o), x = m_((0, v.useMemo)(() => ({
		x: a,
		y: o,
		width: s,
		height: c,
		radius: l
	}), [
		a,
		o,
		s,
		c,
		l
	]), "rectangle-");
	if (a !== +a || o !== +o || s !== +s || c !== +c || s === 0 || c === 0) return null;
	var S = I("recharts-rectangle", u);
	if (!h) {
		var C = Qi(t), { radius: w } = C, T = N_(C, h_);
		return /*#__PURE__*/ v.createElement("path", M_({}, T, {
			x: as(a),
			y: as(o),
			width: as(s),
			height: as(c),
			radius: typeof l == "number" ? l : void 0,
			className: S,
			d: I_(a, o, s, c, l)
		}));
	}
	var E = g.current, D = _.current, O = y.current, k = b.current, ee = `0px ${r === -1 ? 1 : r}px`, te = `${r}px ${r}px`, A = Fg(["strokeDasharray"], f, typeof d == "string" ? d : L_.animationEasing);
	return /*#__PURE__*/ v.createElement(p_, {
		animationId: x,
		key: x,
		canBegin: r > 0,
		duration: f,
		easing: d,
		isActive: h,
		begin: p
	}, (e) => {
		var r = ms(E, s, e), i = ms(D, c, e), u = ms(O, a, e), d = ms(k, o, e);
		n.current && (g.current = r, _.current = i, y.current = u, b.current = d);
		var f = m ? e > 0 ? {
			transition: A,
			strokeDasharray: te
		} : { strokeDasharray: ee } : { strokeDasharray: te }, p = Qi(t), { radius: h } = p, x = N_(p, g_);
		return /*#__PURE__*/ v.createElement("path", M_({}, x, {
			radius: typeof l == "number" ? l : void 0,
			className: S,
			d: I_(u, d, r, i, l),
			ref: n,
			style: O_(O_({}, f), t.style)
		}));
	});
};
// node_modules/recharts/es6/util/PolarUtils.js
function z_(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function B_(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? z_(Object(n), !0).forEach(function(t) {
			V_(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : z_(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function V_(e, t, n) {
	return (t = H_(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function H_(e) {
	var t = U_(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function U_(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var W_ = Math.PI / 180, G_ = (e) => e * 180 / Math.PI, K_ = (e, t, n, r) => ({
	x: e + Math.cos(-W_ * r) * n,
	y: t + Math.sin(-W_ * r) * n
}), q_ = function(e, t) {
	var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		width: 0,
		height: 0,
		brushBottom: 0
	};
	return Math.min(Math.abs(e - (n.left || 0) - (n.right || 0)), Math.abs(t - (n.top || 0) - (n.bottom || 0))) / 2;
}, J_ = (e, t) => {
	var { x: n, y: r } = e, { x: i, y: a } = t;
	return Math.sqrt((n - i) ** 2 + (r - a) ** 2);
}, Y_ = (e, t) => {
	var { x: n, y: r } = e, { cx: i, cy: a } = t, o = J_({
		x: n,
		y: r
	}, {
		x: i,
		y: a
	});
	if (o <= 0) return {
		radius: o,
		angle: 0
	};
	var s = (n - i) / o, c = Math.acos(s);
	return r > a && (c = 2 * Math.PI - c), {
		radius: o,
		angle: G_(c),
		angleInRadian: c
	};
}, X_ = (e) => {
	var { startAngle: t, endAngle: n } = e, r = Math.floor(t / 360), i = Math.floor(n / 360), a = Math.min(r, i);
	return {
		startAngle: t - a * 360,
		endAngle: n - a * 360
	};
}, Z_ = (e, t) => {
	var { startAngle: n, endAngle: r } = t, i = Math.floor(n / 360), a = Math.floor(r / 360);
	return e + Math.min(i, a) * 360;
}, Q_ = (e, t) => {
	var { relativeX: n, relativeY: r } = e, { radius: i, angle: a } = Y_({
		x: n,
		y: r
	}, t), { innerRadius: o, outerRadius: s } = t;
	if (i < o || i > s || i === 0) return null;
	var { startAngle: c, endAngle: l } = X_(t), u = a, d;
	if (c <= l) {
		for (; u > l;) u -= 360;
		for (; u < c;) u += 360;
		d = u >= c && u <= l;
	} else {
		for (; u > c;) u -= 360;
		for (; u < l;) u += 360;
		d = u >= l && u <= c;
	}
	return d ? B_(B_({}, t), {}, {
		radius: i,
		angle: Z_(u, t)
	}) : null;
};
// node_modules/recharts/es6/util/cursor/getRadialCursorPoints.js
function $_(e) {
	var { cx: t, cy: n, radius: r, startAngle: i, endAngle: a } = e;
	return {
		points: [K_(t, n, r, i), K_(t, n, r, a)],
		cx: t,
		cy: n,
		radius: r,
		startAngle: i,
		endAngle: a
	};
}
// node_modules/recharts/es6/shape/Sector.js
var ev, tv, nv, rv, iv, av, ov;
function sv() {
	return sv = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, sv.apply(null, arguments);
}
function cv(e, t) {
	return t ||= e.slice(0), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }));
}
var lv = (e, t) => os(t - e) * Math.min(Math.abs(t - e), 359.999), uv = (e) => {
	var { cx: t, cy: n, radius: r, angle: i, sign: a, isExternal: o, cornerRadius: s, cornerIsExternal: c } = e, l = s * (o ? 1 : -1) + r, u = Math.asin(s / l) / W_, d = c ? i : i + a * u, f = K_(t, n, l, d), p = K_(t, n, r, d), m = c ? i - a * u : i;
	return {
		center: f,
		circleTangency: p,
		lineTangency: K_(t, n, l * Math.cos(u * W_), m),
		theta: u
	};
}, dv = (e) => {
	var { cx: t, cy: n, innerRadius: r, outerRadius: i, startAngle: a, endAngle: o } = e, s = lv(a, o), c = a + s, l = K_(t, n, i, a), u = K_(t, n, i, c), d = U(ev ||= cv([
		"M ",
		",",
		"\n    A ",
		",",
		",0,\n    ",
		",",
		",\n    ",
		",",
		"\n  "
	]), l.x, l.y, i, i, +(Math.abs(s) > 180), +(a > c), u.x, u.y);
	if (r > 0) {
		var f = K_(t, n, r, a), p = K_(t, n, r, c);
		d += U(tv ||= cv([
			"L ",
			",",
			"\n            A ",
			",",
			",0,\n            ",
			",",
			",\n            ",
			",",
			" Z"
		]), p.x, p.y, r, r, +(Math.abs(s) > 180), +(a <= c), f.x, f.y);
	} else d += U(nv ||= cv([
		"L ",
		",",
		" Z"
	]), t, n);
	return d;
}, fv = (e) => {
	var { cx: t, cy: n, innerRadius: r, outerRadius: i, cornerRadius: a, forceCornerRadius: o, cornerIsExternal: s, startAngle: c, endAngle: l } = e, u = os(l - c), { circleTangency: d, lineTangency: f, theta: p } = uv({
		cx: t,
		cy: n,
		radius: i,
		angle: c,
		sign: u,
		cornerRadius: a,
		cornerIsExternal: s
	}), { circleTangency: m, lineTangency: h, theta: g } = uv({
		cx: t,
		cy: n,
		radius: i,
		angle: l,
		sign: -u,
		cornerRadius: a,
		cornerIsExternal: s
	}), _ = s ? Math.abs(c - l) : Math.abs(c - l) - p - g;
	if (_ < 0) return o ? U(rv ||= cv([
		"M ",
		",",
		"\n        a",
		",",
		",0,0,1,",
		",0\n        a",
		",",
		",0,0,1,",
		",0\n      "
	]), f.x, f.y, a, a, a * 2, a, a, -a * 2) : dv({
		cx: t,
		cy: n,
		innerRadius: r,
		outerRadius: i,
		startAngle: c,
		endAngle: l
	});
	var v = U(iv ||= cv([
		"M ",
		",",
		"\n    A",
		",",
		",0,0,",
		",",
		",",
		"\n    A",
		",",
		",0,",
		",",
		",",
		",",
		"\n    A",
		",",
		",0,0,",
		",",
		",",
		"\n  "
	]), f.x, f.y, a, a, +(u < 0), d.x, d.y, i, i, +(_ > 180), +(u < 0), m.x, m.y, a, a, +(u < 0), h.x, h.y);
	if (r > 0) {
		var { circleTangency: y, lineTangency: b, theta: x } = uv({
			cx: t,
			cy: n,
			radius: r,
			angle: c,
			sign: u,
			isExternal: !0,
			cornerRadius: a,
			cornerIsExternal: s
		}), { circleTangency: S, lineTangency: C, theta: w } = uv({
			cx: t,
			cy: n,
			radius: r,
			angle: l,
			sign: -u,
			isExternal: !0,
			cornerRadius: a,
			cornerIsExternal: s
		}), T = s ? Math.abs(c - l) : Math.abs(c - l) - x - w;
		if (T < 0 && a === 0) return `${v}L${t},${n}Z`;
		v += U(av ||= cv([
			"L",
			",",
			"\n      A",
			",",
			",0,0,",
			",",
			",",
			"\n      A",
			",",
			",0,",
			",",
			",",
			",",
			"\n      A",
			",",
			",0,0,",
			",",
			",",
			"Z"
		]), C.x, C.y, a, a, +(u < 0), S.x, S.y, r, r, +(T > 180), +(u > 0), y.x, y.y, a, a, +(u < 0), b.x, b.y);
	} else v += U(ov ||= cv([
		"L",
		",",
		"Z"
	]), t, n);
	return v;
}, pv = {
	cx: 0,
	cy: 0,
	innerRadius: 0,
	outerRadius: 0,
	startAngle: 0,
	endAngle: 0,
	cornerRadius: 0,
	forceCornerRadius: !1,
	cornerIsExternal: !1
}, mv = (e) => {
	var t = Ws(e, pv), { cx: n, cy: r, innerRadius: i, outerRadius: a, cornerRadius: o, forceCornerRadius: s, cornerIsExternal: c, startAngle: l, endAngle: u, className: d } = t;
	if (a < i || l === u) return null;
	var f = I("recharts-sector", d), p = a - i, m = fs(o, p, 0, !0), h = m > 0 && Math.abs(l - u) < 360 ? fv({
		cx: n,
		cy: r,
		innerRadius: i,
		outerRadius: a,
		cornerRadius: Math.min(m, p / 2),
		forceCornerRadius: s,
		cornerIsExternal: c,
		startAngle: l,
		endAngle: u
	}) : dv({
		cx: n,
		cy: r,
		innerRadius: i,
		outerRadius: a,
		startAngle: l,
		endAngle: u
	});
	return /*#__PURE__*/ v.createElement("path", sv({}, Qi(t), {
		className: f,
		d: h
	}));
};
// node_modules/recharts/es6/util/cursor/getCursorPoints.js
function hv(e, t, n) {
	if (e === "horizontal") return [{
		x: t.x,
		y: n.top
	}, {
		x: t.x,
		y: n.top + n.height
	}];
	if (e === "vertical") return [{
		x: n.left,
		y: t.y
	}, {
		x: n.left + n.width,
		y: t.y
	}];
	if (Fs(t)) {
		if (e === "centric") {
			var { cx: r, cy: i, innerRadius: a, outerRadius: o, angle: s } = t, c = K_(r, i, a, s), l = K_(r, i, o, s);
			return [{
				x: c.x,
				y: c.y
			}, {
				x: l.x,
				y: l.y
			}];
		}
		return $_(t);
	}
}
// node_modules/es-toolkit/dist/compat/util/toNumber.mjs
function gv(e) {
	return Qo(e) ? NaN : Number(e);
}
// node_modules/es-toolkit/dist/compat/util/toFinite.mjs
function _v(e) {
	return e ? (e = gv(e), e === 1e400 || e === -1e400 ? (e < 0 ? -1 : 1) * Number.MAX_VALUE : e === e ? e : 0) : e === 0 ? e : 0;
}
// node_modules/es-toolkit/dist/compat/math/range.mjs
function vv(e, t, n) {
	n && typeof n != "number" && Cl(e, t, n) && (t = n = void 0), e = _v(e), t === void 0 ? (t = e, e = 0) : t = _v(t), n = n === void 0 ? e < t ? 1 : -1 : _v(n);
	let r = Math.max(Math.ceil((t - e) / (n || 1)), 0), i = Array(r);
	for (let t = 0; t < r; t++) i[t] = e, e += n;
	return i;
}
// node_modules/recharts/es6/state/selectors/dataSelectors.js
var yv = (e) => e.chartData, bv = K([yv], (e) => {
	var t = e.chartData == null ? 0 : e.chartData.length - 1;
	return {
		chartData: e.chartData,
		computedData: e.computedData,
		dataEndIndex: t,
		dataStartIndex: 0
	};
}), xv = (e, t, n, r) => r ? bv(e) : yv(e);
// node_modules/recharts/es6/util/isDomainSpecifiedByUser.js
function Sv(e) {
	if (Array.isArray(e) && e.length === 2) {
		var [t, n] = e;
		if (X(t) && X(n)) return !0;
	}
	return !1;
}
function Cv(e, t, n) {
	return n ? e : [Math.min(e[0], t[0]), Math.max(e[1], t[1])];
}
function wv(e, t) {
	if (t && typeof e != "function" && Array.isArray(e) && e.length === 2) {
		var [n, r] = e, i, a;
		if (X(n)) i = n;
		else if (typeof n == "function") return;
		if (X(r)) a = r;
		else if (typeof r == "function") return;
		var o = [i, a];
		if (Sv(o)) return o;
	}
}
function Tv(e, t, n) {
	if (n || t != null) {
		if (typeof e == "function" && t != null) try {
			var r = e(t, n);
			if (Sv(r)) return Cv(r, t, n);
		} catch {}
		if (Array.isArray(e) && e.length === 2) {
			var [i, a] = e, o, s;
			if (i === "auto") t != null && (o = Math.min(...t));
			else if (W(i)) o = i;
			else if (typeof i == "function") try {
				t != null && (o = i(t?.[0]));
			} catch {}
			else if (typeof i == "string" && Xf.test(i)) {
				var c = Xf.exec(i);
				if (c == null || c[1] == null || t == null) o = void 0;
				else {
					var l = +c[1];
					o = t[0] - l;
				}
			} else o = t?.[0];
			if (a === "auto") t != null && (s = Math.max(...t));
			else if (W(a)) s = a;
			else if (typeof a == "function") try {
				t != null && (s = a(t?.[1]));
			} catch {}
			else if (typeof a == "string" && Zf.test(a)) {
				var u = Zf.exec(a);
				if (u == null || u[1] == null || t == null) s = void 0;
				else {
					var d = +u[1];
					s = t[1] + d;
				}
			} else s = t?.[1];
			var f = [o, s];
			if (Sv(f)) return t == null ? f : Cv(f, t, n);
		}
	}
}
// node_modules/recharts/es6/util/scale/util/arithmetic.js
var $ = /* @__PURE__ */ l((/* @__PURE__ */ o(((e, t, n) => {
	var r;
	(function(e) {
		var n = 1e9, i = {
			precision: 20,
			rounding: 4,
			toExpNeg: -7,
			toExpPos: 21,
			LN10: "2.302585092994045684017991454684364207601101488628772976033327900967572609677352480235997205089598298341967784042286"
		}, a = !0, o = "[DecimalError] ", s = o + "Invalid argument: ", c = o + "Exponent out of range: ", l = Math.floor, u = Math.pow, d = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, f, p = 1e7, m = 7, h = 0x1fffffffffffff, g = l(h / m), _ = {};
		_.absoluteValue = _.abs = function() {
			var e = new this.constructor(this);
			return e.s &&= 1, e;
		}, _.comparedTo = _.cmp = function(e) {
			var t, n, r, i, a = this;
			if (e = new a.constructor(e), a.s !== e.s) return a.s || -e.s;
			if (a.e !== e.e) return a.e > e.e ^ a.s < 0 ? 1 : -1;
			for (r = a.d.length, i = e.d.length, t = 0, n = r < i ? r : i; t < n; ++t) if (a.d[t] !== e.d[t]) return a.d[t] > e.d[t] ^ a.s < 0 ? 1 : -1;
			return r === i ? 0 : r > i ^ a.s < 0 ? 1 : -1;
		}, _.decimalPlaces = _.dp = function() {
			var e = this, t = e.d.length - 1, n = (t - e.e) * m;
			if (t = e.d[t], t) for (; t % 10 == 0; t /= 10) n--;
			return n < 0 ? 0 : n;
		}, _.dividedBy = _.div = function(e) {
			return x(this, new this.constructor(e));
		}, _.dividedToIntegerBy = _.idiv = function(e) {
			var t = this, n = t.constructor;
			return O(x(t, new n(e), 0, 1), n.precision);
		}, _.equals = _.eq = function(e) {
			return !this.cmp(e);
		}, _.exponent = function() {
			return C(this);
		}, _.greaterThan = _.gt = function(e) {
			return this.cmp(e) > 0;
		}, _.greaterThanOrEqualTo = _.gte = function(e) {
			return this.cmp(e) >= 0;
		}, _.isInteger = _.isint = function() {
			return this.e > this.d.length - 2;
		}, _.isNegative = _.isneg = function() {
			return this.s < 0;
		}, _.isPositive = _.ispos = function() {
			return this.s > 0;
		}, _.isZero = function() {
			return this.s === 0;
		}, _.lessThan = _.lt = function(e) {
			return this.cmp(e) < 0;
		}, _.lessThanOrEqualTo = _.lte = function(e) {
			return this.cmp(e) < 1;
		}, _.logarithm = _.log = function(e) {
			var t, n = this, r = n.constructor, i = r.precision, s = i + 5;
			if (e === void 0) e = new r(10);
			else if (e = new r(e), e.s < 1 || e.eq(f)) throw Error(o + "NaN");
			if (n.s < 1) throw Error(o + (n.s ? "NaN" : "-Infinity"));
			return n.eq(f) ? new r(0) : (a = !1, t = x(E(n, s), E(e, s), s), a = !0, O(t, i));
		}, _.minus = _.sub = function(e) {
			var t = this;
			return e = new t.constructor(e), t.s == e.s ? k(t, e) : v(t, (e.s = -e.s, e));
		}, _.modulo = _.mod = function(e) {
			var t, n = this, r = n.constructor, i = r.precision;
			if (e = new r(e), !e.s) throw Error(o + "NaN");
			return n.s ? (a = !1, t = x(n, e, 0, 1).times(e), a = !0, n.minus(t)) : O(new r(n), i);
		}, _.naturalExponential = _.exp = function() {
			return S(this);
		}, _.naturalLogarithm = _.ln = function() {
			return E(this);
		}, _.negated = _.neg = function() {
			var e = new this.constructor(this);
			return e.s = -e.s || 0, e;
		}, _.plus = _.add = function(e) {
			var t = this;
			return e = new t.constructor(e), t.s == e.s ? v(t, e) : k(t, (e.s = -e.s, e));
		}, _.precision = _.sd = function(e) {
			var t, n, r, i = this;
			if (e !== void 0 && e !== !!e && e !== 1 && e !== 0) throw Error(s + e);
			if (t = C(i) + 1, r = i.d.length - 1, n = r * m + 1, r = i.d[r], r) {
				for (; r % 10 == 0; r /= 10) n--;
				for (r = i.d[0]; r >= 10; r /= 10) n++;
			}
			return e && t > n ? t : n;
		}, _.squareRoot = _.sqrt = function() {
			var e, t, n, r, i, s, c, u = this, d = u.constructor;
			if (u.s < 1) {
				if (!u.s) return new d(0);
				throw Error(o + "NaN");
			}
			for (e = C(u), a = !1, i = Math.sqrt(+u), i == 0 || i == 1 / 0 ? (t = b(u.d), (t.length + e) % 2 == 0 && (t += "0"), i = Math.sqrt(t), e = l((e + 1) / 2) - (e < 0 || e % 2), i == 1 / 0 ? t = "5e" + e : (t = i.toExponential(), t = t.slice(0, t.indexOf("e") + 1) + e), r = new d(t)) : r = new d(i.toString()), n = d.precision, i = c = n + 3;;) if (s = r, r = s.plus(x(u, s, c + 2)).times(.5), b(s.d).slice(0, c) === (t = b(r.d)).slice(0, c)) {
				if (t = t.slice(c - 3, c + 1), i == c && t == "4999") {
					if (O(s, n + 1, 0), s.times(s).eq(u)) {
						r = s;
						break;
					}
				} else if (t != "9999") break;
				c += 4;
			}
			return a = !0, O(r, n);
		}, _.times = _.mul = function(e) {
			var t, n, r, i, o, s, c, l, u, d = this, f = d.constructor, m = d.d, h = (e = new f(e)).d;
			if (!d.s || !e.s) return new f(0);
			for (e.s *= d.s, n = d.e + e.e, l = m.length, u = h.length, l < u && (o = m, m = h, h = o, s = l, l = u, u = s), o = [], s = l + u, r = s; r--;) o.push(0);
			for (r = u; --r >= 0;) {
				for (t = 0, i = l + r; i > r;) c = o[i] + h[r] * m[i - r - 1] + t, o[i--] = c % p | 0, t = c / p | 0;
				o[i] = (o[i] + t) % p | 0;
			}
			for (; !o[--s];) o.pop();
			return t ? ++n : o.shift(), e.d = o, e.e = n, a ? O(e, f.precision) : e;
		}, _.toDecimalPlaces = _.todp = function(e, t) {
			var r = this, i = r.constructor;
			return r = new i(r), e === void 0 ? r : (y(e, 0, n), t === void 0 ? t = i.rounding : y(t, 0, 8), O(r, e + C(r) + 1, t));
		}, _.toExponential = function(e, t) {
			var r, i = this, a = i.constructor;
			return e === void 0 ? r = ee(i, !0) : (y(e, 0, n), t === void 0 ? t = a.rounding : y(t, 0, 8), i = O(new a(i), e + 1, t), r = ee(i, !0, e + 1)), r;
		}, _.toFixed = function(e, t) {
			var r, i, a = this, o = a.constructor;
			return e === void 0 ? ee(a) : (y(e, 0, n), t === void 0 ? t = o.rounding : y(t, 0, 8), i = O(new o(a), e + C(a) + 1, t), r = ee(i.abs(), !1, e + C(i) + 1), a.isneg() && !a.isZero() ? "-" + r : r);
		}, _.toInteger = _.toint = function() {
			var e = this, t = e.constructor;
			return O(new t(e), C(e) + 1, t.rounding);
		}, _.toNumber = function() {
			return +this;
		}, _.toPower = _.pow = function(e) {
			var t, n, r, i, s, c, u = this, d = u.constructor, p = 12, g = +(e = new d(e));
			if (!e.s) return new d(f);
			if (u = new d(u), !u.s) {
				if (e.s < 1) throw Error(o + "Infinity");
				return u;
			}
			if (u.eq(f)) return u;
			if (r = d.precision, e.eq(f)) return O(u, r);
			if (t = e.e, n = e.d.length - 1, c = t >= n, s = u.s, !c) {
				if (s < 0) throw Error(o + "NaN");
			} else if ((n = g < 0 ? -g : g) <= h) {
				for (i = new d(f), t = Math.ceil(r / m + 4), a = !1; n % 2 && (i = i.times(u), te(i.d, t)), n = l(n / 2), n !== 0;) u = u.times(u), te(u.d, t);
				return a = !0, e.s < 0 ? new d(f).div(i) : O(i, r);
			}
			return s = s < 0 && e.d[Math.max(t, n)] & 1 ? -1 : 1, u.s = 1, a = !1, i = e.times(E(u, r + p)), a = !0, i = S(i), i.s = s, i;
		}, _.toPrecision = function(e, t) {
			var r, i, a = this, o = a.constructor;
			return e === void 0 ? (r = C(a), i = ee(a, r <= o.toExpNeg || r >= o.toExpPos)) : (y(e, 1, n), t === void 0 ? t = o.rounding : y(t, 0, 8), a = O(new o(a), e, t), r = C(a), i = ee(a, e <= r || r <= o.toExpNeg, e)), i;
		}, _.toSignificantDigits = _.tosd = function(e, t) {
			var r = this, i = r.constructor;
			return e === void 0 ? (e = i.precision, t = i.rounding) : (y(e, 1, n), t === void 0 ? t = i.rounding : y(t, 0, 8)), O(new i(r), e, t);
		}, _.toString = _.valueOf = _.val = _.toJSON = function() {
			var e = this, t = C(e), n = e.constructor;
			return ee(e, t <= n.toExpNeg || t >= n.toExpPos);
		};
		function v(e, t) {
			var n, r, i, o, s, c, l, u, d = e.constructor, f = d.precision;
			if (!e.s || !t.s) return t.s || (t = new d(e)), a ? O(t, f) : t;
			if (l = e.d, u = t.d, s = e.e, i = t.e, l = l.slice(), o = s - i, o) {
				for (o < 0 ? (r = l, o = -o, c = u.length) : (r = u, i = s, c = l.length), s = Math.ceil(f / m), c = s > c ? s + 1 : c + 1, o > c && (o = c, r.length = 1), r.reverse(); o--;) r.push(0);
				r.reverse();
			}
			for (c = l.length, o = u.length, c - o < 0 && (o = c, r = u, u = l, l = r), n = 0; o;) n = (l[--o] = l[o] + u[o] + n) / p | 0, l[o] %= p;
			for (n && (l.unshift(n), ++i), c = l.length; l[--c] == 0;) l.pop();
			return t.d = l, t.e = i, a ? O(t, f) : t;
		}
		function y(e, t, n) {
			if (e !== ~~e || e < t || e > n) throw Error(s + e);
		}
		function b(e) {
			var t, n, r, i = e.length - 1, a = "", o = e[0];
			if (i > 0) {
				for (a += o, t = 1; t < i; t++) r = e[t] + "", n = m - r.length, n && (a += T(n)), a += r;
				o = e[t], r = o + "", n = m - r.length, n && (a += T(n));
			} else if (o === 0) return "0";
			for (; o % 10 == 0;) o /= 10;
			return a + o;
		}
		var x = (function() {
			function e(e, t) {
				var n, r = 0, i = e.length;
				for (e = e.slice(); i--;) n = e[i] * t + r, e[i] = n % p | 0, r = n / p | 0;
				return r && e.unshift(r), e;
			}
			function t(e, t, n, r) {
				var i, a;
				if (n != r) a = n > r ? 1 : -1;
				else for (i = a = 0; i < n; i++) if (e[i] != t[i]) {
					a = e[i] > t[i] ? 1 : -1;
					break;
				}
				return a;
			}
			function n(e, t, n) {
				for (var r = 0; n--;) e[n] -= r, r = +(e[n] < t[n]), e[n] = r * p + e[n] - t[n];
				for (; !e[0] && e.length > 1;) e.shift();
			}
			return function(r, i, a, s) {
				var c, l, u, d, f, h, g, _, v, y, b, x, S, w, T, E, D, k, ee = r.constructor, te = r.s == i.s ? 1 : -1, A = r.d, j = i.d;
				if (!r.s) return new ee(r);
				if (!i.s) throw Error(o + "Division by zero");
				for (l = r.e - i.e, D = j.length, T = A.length, g = new ee(te), _ = g.d = [], u = 0; j[u] == (A[u] || 0);) ++u;
				if (j[u] > (A[u] || 0) && --l, x = a == null ? a = ee.precision : s ? a + (C(r) - C(i)) + 1 : a, x < 0) return new ee(0);
				if (x = x / m + 2 | 0, u = 0, D == 1) for (d = 0, j = j[0], x++; (u < T || d) && x--; u++) S = d * p + (A[u] || 0), _[u] = S / j | 0, d = S % j | 0;
				else {
					for (d = p / (j[0] + 1) | 0, d > 1 && (j = e(j, d), A = e(A, d), D = j.length, T = A.length), w = D, v = A.slice(0, D), y = v.length; y < D;) v[y++] = 0;
					k = j.slice(), k.unshift(0), E = j[0], j[1] >= p / 2 && ++E;
					do
						d = 0, c = t(j, v, D, y), c < 0 ? (b = v[0], D != y && (b = b * p + (v[1] || 0)), d = b / E | 0, d > 1 ? (d >= p && (d = p - 1), f = e(j, d), h = f.length, y = v.length, c = t(f, v, h, y), c == 1 && (d--, n(f, D < h ? k : j, h))) : (d == 0 && (c = d = 1), f = j.slice()), h = f.length, h < y && f.unshift(0), n(v, f, y), c == -1 && (y = v.length, c = t(j, v, D, y), c < 1 && (d++, n(v, D < y ? k : j, y))), y = v.length) : c === 0 && (d++, v = [0]), _[u++] = d, c && v[0] ? v[y++] = A[w] || 0 : (v = [A[w]], y = 1);
					while ((w++ < T || v[0] !== void 0) && x--);
				}
				return _[0] || _.shift(), g.e = l, O(g, s ? a + C(g) + 1 : a);
			};
		})();
		function S(e, t) {
			var n, r, i, o, s, l, d = 0, p = 0, m = e.constructor, h = m.precision;
			if (C(e) > 16) throw Error(c + C(e));
			if (!e.s) return new m(f);
			for (t == null ? (a = !1, l = h) : l = t, s = new m(.03125); e.abs().gte(.1);) e = e.times(s), p += 5;
			for (r = Math.log(u(2, p)) / Math.LN10 * 2 + 5 | 0, l += r, n = i = o = new m(f), m.precision = l;;) {
				if (i = O(i.times(e), l), n = n.times(++d), s = o.plus(x(i, n, l)), b(s.d).slice(0, l) === b(o.d).slice(0, l)) {
					for (; p--;) o = O(o.times(o), l);
					return m.precision = h, t == null ? (a = !0, O(o, h)) : o;
				}
				o = s;
			}
		}
		function C(e) {
			for (var t = e.e * m, n = e.d[0]; n >= 10; n /= 10) t++;
			return t;
		}
		function w(e, t, n) {
			if (t > e.LN10.sd()) throw a = !0, n && (e.precision = n), Error(o + "LN10 precision limit exceeded");
			return O(new e(e.LN10), t);
		}
		function T(e) {
			for (var t = ""; e--;) t += "0";
			return t;
		}
		function E(e, t) {
			var n, r, i, s, c, l, u, d, p, m = 1, h = 10, g = e, _ = g.d, v = g.constructor, y = v.precision;
			if (g.s < 1) throw Error(o + (g.s ? "NaN" : "-Infinity"));
			if (g.eq(f)) return new v(0);
			if (t == null ? (a = !1, d = y) : d = t, g.eq(10)) return t ?? (a = !0), w(v, d);
			if (d += h, v.precision = d, n = b(_), r = n.charAt(0), s = C(g), Math.abs(s) < 15e14) {
				for (; r < 7 && r != 1 || r == 1 && n.charAt(1) > 3;) g = g.times(e), n = b(g.d), r = n.charAt(0), m++;
				s = C(g), r > 1 ? (g = new v("0." + n), s++) : g = new v(r + "." + n.slice(1));
			} else return u = w(v, d + 2, y).times(s + ""), g = E(new v(r + "." + n.slice(1)), d - h).plus(u), v.precision = y, t == null ? (a = !0, O(g, y)) : g;
			for (l = c = g = x(g.minus(f), g.plus(f), d), p = O(g.times(g), d), i = 3;;) {
				if (c = O(c.times(p), d), u = l.plus(x(c, new v(i), d)), b(u.d).slice(0, d) === b(l.d).slice(0, d)) return l = l.times(2), s !== 0 && (l = l.plus(w(v, d + 2, y).times(s + ""))), l = x(l, new v(m), d), v.precision = y, t == null ? (a = !0, O(l, y)) : l;
				l = u, i += 2;
			}
		}
		function D(e, t) {
			var n, r, i;
			for ((n = t.indexOf(".")) > -1 && (t = t.replace(".", "")), (r = t.search(/e/i)) > 0 ? (n < 0 && (n = r), n += +t.slice(r + 1), t = t.substring(0, r)) : n < 0 && (n = t.length), r = 0; t.charCodeAt(r) === 48;) ++r;
			for (i = t.length; t.charCodeAt(i - 1) === 48;) --i;
			if (t = t.slice(r, i), t) {
				if (i -= r, n = n - r - 1, e.e = l(n / m), e.d = [], r = (n + 1) % m, n < 0 && (r += m), r < i) {
					for (r && e.d.push(+t.slice(0, r)), i -= m; r < i;) e.d.push(+t.slice(r, r += m));
					t = t.slice(r), r = m - t.length;
				} else r -= i;
				for (; r--;) t += "0";
				if (e.d.push(+t), a && (e.e > g || e.e < -g)) throw Error(c + n);
			} else e.s = 0, e.e = 0, e.d = [0];
			return e;
		}
		function O(e, t, n) {
			var r, i, o, s, d, f, h, _, v = e.d;
			for (s = 1, o = v[0]; o >= 10; o /= 10) s++;
			if (r = t - s, r < 0) r += m, i = t, h = v[_ = 0];
			else {
				if (_ = Math.ceil((r + 1) / m), o = v.length, _ >= o) return e;
				for (h = o = v[_], s = 1; o >= 10; o /= 10) s++;
				r %= m, i = r - m + s;
			}
			if (n !== void 0 && (o = u(10, s - i - 1), d = h / o % 10 | 0, f = t < 0 || v[_ + 1] !== void 0 || h % o, f = n < 4 ? (d || f) && (n == 0 || n == (e.s < 0 ? 3 : 2)) : d > 5 || d == 5 && (n == 4 || f || n == 6 && (r > 0 ? i > 0 ? h / u(10, s - i) : 0 : v[_ - 1]) % 10 & 1 || n == (e.s < 0 ? 8 : 7))), t < 1 || !v[0]) return f ? (o = C(e), v.length = 1, t = t - o - 1, v[0] = u(10, (m - t % m) % m), e.e = l(-t / m) || 0) : (v.length = 1, v[0] = e.e = e.s = 0), e;
			if (r == 0 ? (v.length = _, o = 1, _--) : (v.length = _ + 1, o = u(10, m - r), v[_] = i > 0 ? (h / u(10, s - i) % u(10, i) | 0) * o : 0), f) for (;;) if (_ == 0) {
				(v[0] += o) == p && (v[0] = 1, ++e.e);
				break;
			} else {
				if (v[_] += o, v[_] != p) break;
				v[_--] = 0, o = 1;
			}
			for (r = v.length; v[--r] === 0;) v.pop();
			if (a && (e.e > g || e.e < -g)) throw Error(c + C(e));
			return e;
		}
		function k(e, t) {
			var n, r, i, o, s, c, l, u, d, f, h = e.constructor, g = h.precision;
			if (!e.s || !t.s) return t.s ? t.s = -t.s : t = new h(e), a ? O(t, g) : t;
			if (l = e.d, f = t.d, r = t.e, u = e.e, l = l.slice(), s = u - r, s) {
				for (d = s < 0, d ? (n = l, s = -s, c = f.length) : (n = f, r = u, c = l.length), i = Math.max(Math.ceil(g / m), c) + 2, s > i && (s = i, n.length = 1), n.reverse(), i = s; i--;) n.push(0);
				n.reverse();
			} else {
				for (i = l.length, c = f.length, d = i < c, d && (c = i), i = 0; i < c; i++) if (l[i] != f[i]) {
					d = l[i] < f[i];
					break;
				}
				s = 0;
			}
			for (d && (n = l, l = f, f = n, t.s = -t.s), c = l.length, i = f.length - c; i > 0; --i) l[c++] = 0;
			for (i = f.length; i > s;) {
				if (l[--i] < f[i]) {
					for (o = i; o && l[--o] === 0;) l[o] = p - 1;
					--l[o], l[i] += p;
				}
				l[i] -= f[i];
			}
			for (; l[--c] === 0;) l.pop();
			for (; l[0] === 0; l.shift()) --r;
			return l[0] ? (t.d = l, t.e = r, a ? O(t, g) : t) : new h(0);
		}
		function ee(e, t, n) {
			var r, i = C(e), a = b(e.d), o = a.length;
			return t ? (n && (r = n - o) > 0 ? a = a.charAt(0) + "." + a.slice(1) + T(r) : o > 1 && (a = a.charAt(0) + "." + a.slice(1)), a = a + (i < 0 ? "e" : "e+") + i) : i < 0 ? (a = "0." + T(-i - 1) + a, n && (r = n - o) > 0 && (a += T(r))) : i >= o ? (a += T(i + 1 - o), n && (r = n - i - 1) > 0 && (a = a + "." + T(r))) : ((r = i + 1) < o && (a = a.slice(0, r) + "." + a.slice(r)), n && (r = n - o) > 0 && (i + 1 === o && (a += "."), a += T(r))), e.s < 0 ? "-" + a : a;
		}
		function te(e, t) {
			if (e.length > t) return e.length = t, !0;
		}
		function A(e) {
			var t, n, r;
			function i(e) {
				var t = this;
				if (!(t instanceof i)) return new i(e);
				if (t.constructor = i, e instanceof i) t.s = e.s, t.e = e.e, t.d = (e = e.d) ? e.slice() : e;
				else {
					if (typeof e == "number") {
						if (e * 0 != 0) throw Error(s + e);
						if (e > 0) t.s = 1;
						else if (e < 0) e = -e, t.s = -1;
						else {
							t.s = 0, t.e = 0, t.d = [0];
							return;
						}
						if (e === ~~e && e < 1e7) {
							t.e = 0, t.d = [e];
							return;
						}
						return D(t, e.toString());
					}
					if (typeof e != "string") throw Error(s + e);
					if (e.charCodeAt(0) === 45 ? (e = e.slice(1), t.s = -1) : t.s = 1, d.test(e)) D(t, e);
					else throw Error(s + e);
				}
			}
			if (i.prototype = _, i.ROUND_UP = 0, i.ROUND_DOWN = 1, i.ROUND_CEIL = 2, i.ROUND_FLOOR = 3, i.ROUND_HALF_UP = 4, i.ROUND_HALF_DOWN = 5, i.ROUND_HALF_EVEN = 6, i.ROUND_HALF_CEIL = 7, i.ROUND_HALF_FLOOR = 8, i.clone = A, i.config = i.set = j, e === void 0 && (e = {}), e) for (r = [
				"precision",
				"rounding",
				"toExpNeg",
				"toExpPos",
				"LN10"
			], t = 0; t < r.length;) e.hasOwnProperty(n = r[t++]) || (e[n] = this[n]);
			return i.config(e), i;
		}
		function j(e) {
			if (!e || typeof e != "object") throw Error(o + "Object expected");
			var t, r, i, a = [
				"precision",
				1,
				n,
				"rounding",
				0,
				8,
				"toExpNeg",
				-1 / 0,
				0,
				"toExpPos",
				0,
				1 / 0
			];
			for (t = 0; t < a.length; t += 3) if ((i = e[r = a[t]]) !== void 0) {
				if (l(i) === i && i >= a[t + 1] && i <= a[t + 2]) this[r] = i;
				else throw Error(s + r + ": " + i);
			}
			if ((i = e[r = "LN10"]) !== void 0) {
				if (i == Math.LN10) this[r] = new this(i);
				else throw Error(s + r + ": " + i);
			}
			return this;
		}
		i = A(i), i.default = i.Decimal = i, f = new i(1), typeof r == "function" && r.amd ? r(function() {
			return i;
		}) : t !== void 0 && t.exports ? t.exports = i : (e ||= typeof self < "u" && self && self.self == self ? self : Function("return this")(), e.Decimal = i);
	})(n);
})))());
function Ev(e) {
	return e === 0 ? 1 : Math.floor(new $.default(e).abs().log(10).toNumber()) + 1;
}
function Dv(e, t, n) {
	for (var r = new $.default(e), i = 0, a = []; r.lt(t) && i < 1e5;) a.push(r.toNumber()), r = r.add(n), i++;
	return a;
}
// node_modules/recharts/es6/util/scale/getNiceTickValues.js
var Ov = (e) => {
	var [t, n] = e, [r, i] = [t, n];
	return t > n && ([r, i] = [n, t]), [r, i];
}, kv = (e, t, n) => {
	if (e.lte(0)) return new $.default(0);
	var r = Ev(e.toNumber()), i = new $.default(10).pow(r), a = e.div(i), o = r === 1 ? .1 : .05, s = new $.default(Math.ceil(a.div(o).toNumber())).add(n).mul(o).mul(i);
	return t ? new $.default(s.toNumber()) : new $.default(Math.ceil(s.toNumber()));
}, Av = (e, t, n) => {
	if (e.lte(0)) return new $.default(0);
	var r = [
		1,
		2,
		2.5,
		5
	], i = e.toNumber(), a = Math.floor(new $.default(i).abs().log(10).toNumber()), o = new $.default(10).pow(a), s = e.div(o).toNumber(), c = r.findIndex((e) => e >= s - 1e-10);
	if (c === -1 && (o = o.mul(10), c = 0), c += n, c >= r.length) {
		var l = Math.floor(c / r.length);
		c %= r.length, o = o.mul(new $.default(10).pow(l));
	}
	var u = r[c] ?? 1, d = new $.default(u).mul(o);
	return t ? d : new $.default(Math.ceil(d.toNumber()));
}, jv = (e, t, n) => {
	var r = new $.default(1), i = new $.default(e);
	if (!i.isint() && n) {
		var a = Math.abs(e);
		a < 1 ? (r = new $.default(10).pow(Ev(e) - 1), i = new $.default(Math.floor(i.div(r).toNumber())).mul(r)) : a > 1 && (i = new $.default(Math.floor(e)));
	} else e === 0 ? i = new $.default(Math.floor((t - 1) / 2)) : n || (i = new $.default(Math.floor(e)));
	for (var o = Math.floor((t - 1) / 2), s = [], c = 0; c < t; c++) s.push(i.add(new $.default(c - o).mul(r)).toNumber());
	return s;
}, Mv = function(e, t, n, r) {
	var i = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : 0, a = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : kv;
	if (!Number.isFinite((t - e) / (n - 1))) return {
		step: new $.default(0),
		tickMin: new $.default(0),
		tickMax: new $.default(0)
	};
	var o = a(new $.default(t).sub(e).div(n - 1), r, i), s;
	e <= 0 && t >= 0 ? s = new $.default(0) : (s = new $.default(e).add(t).div(2), s = s.sub(new $.default(s).mod(o)));
	var c = Math.ceil(s.sub(e).div(o).toNumber()), l = Math.ceil(new $.default(t).sub(s).div(o).toNumber()), u = c + l + 1;
	return u > n ? Mv(e, t, n, r, i + 1, a) : (u < n && (l = t > 0 ? l + (n - u) : l, c = t > 0 ? c : c + (n - u)), {
		step: o,
		tickMin: s.sub(new $.default(c).mul(o)),
		tickMax: s.add(new $.default(l).mul(o))
	});
}, Nv = function(e) {
	var [t, n] = e, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 6, i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0, a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "auto", o = Math.max(r, 2), [s, c] = Ov([t, n]);
	if (s === -1e400 || c === 1e400) {
		var l = c === 1e400 ? [s, ...Array(r - 1).fill(1e400)] : [...Array(r - 1).fill(-1e400), c];
		return t > n ? l.reverse() : l;
	}
	if (s === c) return jv(s, r, i);
	var { step: u, tickMin: d, tickMax: f } = Mv(s, c, o, i, 0, a === "snap125" ? Av : kv), p = Dv(d, f.add(new $.default(.1).mul(u)), u);
	return t > n ? p.reverse() : p;
}, Pv = function(e, t) {
	var [n, r] = e, i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0, a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "auto", [o, s] = Ov([n, r]);
	if (o === -1e400 || s === 1e400) return [n, r];
	if (o === s) return [o];
	var c = a === "snap125" ? Av : kv, l = Math.max(t, 2), u = c(new $.default(s).sub(o).div(l - 1), i, 0), d = [...Dv(new $.default(o), new $.default(s), u), s];
	return i === !1 && (d = d.map((e) => Math.round(e))), n > r ? d.reverse() : d;
}, Fv = (e) => e.rootProps.barCategoryGap, Iv = (e) => e.rootProps.stackOffset, Lv = (e) => e.rootProps.reverseStackOrder, Rv = (e) => e.options.chartName, zv = (e) => e.rootProps.syncId, Bv = (e) => e.rootProps.syncMethod, Vv = (e) => e.options.eventEmitter, Hv = {
	grid: -100,
	barBackground: -50,
	area: 100,
	cursorRectangle: 200,
	bar: 300,
	line: 400,
	axis: 500,
	scatter: 600,
	activeBar: 1e3,
	cursorLine: 1100,
	activeDot: 1200,
	label: 2e3
}, Uv = {
	allowDecimals: !1,
	allowDuplicatedCategory: !0,
	allowDataOverflow: !1,
	angle: 0,
	angleAxisId: 0,
	axisLine: !0,
	axisLineType: "polygon",
	cx: 0,
	cy: 0,
	hide: !1,
	includeHidden: !1,
	label: !1,
	niceTicks: "auto",
	orientation: "outer",
	reversed: !1,
	scale: "auto",
	tick: !0,
	tickLine: !0,
	tickSize: 8,
	type: "auto",
	zIndex: Hv.axis
}, Wv = {
	allowDataOverflow: !1,
	allowDecimals: !1,
	allowDuplicatedCategory: !0,
	angle: 0,
	axisLine: !0,
	includeHidden: !1,
	hide: !1,
	niceTicks: "auto",
	label: !1,
	orientation: "right",
	radiusAxisId: 0,
	reversed: !1,
	scale: "auto",
	stroke: "#ccc",
	tick: !0,
	tickCount: 5,
	tickLine: !0,
	type: "auto",
	zIndex: Hv.axis
}, Gv = (e, t) => {
	if (e && t) return e != null && e.reversed ? [t[1], t[0]] : t;
};
// node_modules/recharts/es6/util/getAxisTypeBasedOnLayout.js
function Kv(e, t, n) {
	if (n !== "auto") return n;
	if (e != null) return Hf(e, t) ? "category" : "number";
}
// node_modules/recharts/es6/state/selectors/polarAxisSelectors.js
function qv(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Jv(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? qv(Object(n), !0).forEach(function(t) {
			Yv(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : qv(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Yv(e, t, n) {
	return (t = Xv(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Xv(e) {
	var t = Zv(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Zv(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var Qv = {
	allowDataOverflow: Uv.allowDataOverflow,
	allowDecimals: Uv.allowDecimals,
	allowDuplicatedCategory: !1,
	dataKey: void 0,
	domain: void 0,
	id: Uv.angleAxisId,
	includeHidden: !1,
	name: void 0,
	reversed: Uv.reversed,
	scale: Uv.scale,
	tick: Uv.tick,
	tickCount: void 0,
	ticks: void 0,
	type: Uv.type,
	unit: void 0,
	niceTicks: "auto"
}, $v = {
	allowDataOverflow: Wv.allowDataOverflow,
	allowDecimals: Wv.allowDecimals,
	allowDuplicatedCategory: Wv.allowDuplicatedCategory,
	dataKey: void 0,
	domain: void 0,
	id: Wv.radiusAxisId,
	includeHidden: Wv.includeHidden,
	name: void 0,
	reversed: Wv.reversed,
	scale: Wv.scale,
	tick: Wv.tick,
	tickCount: Wv.tickCount,
	ticks: void 0,
	type: Wv.type,
	unit: void 0,
	niceTicks: "auto"
}, ey = K([(e, t) => {
	if (t != null) return e.polarAxis.angleAxis[t];
}, om], (e, t) => {
	if (e != null) return e;
	var n = Kv(t, "angleAxis", Qv.type) ?? "category";
	return Jv(Jv({}, Qv), {}, { type: n });
}), ty = K([(e, t) => e.polarAxis.radiusAxis[t], om], (e, t) => {
	if (e != null) return e;
	var n = Kv(t, "radiusAxis", $v.type) ?? "category";
	return Jv(Jv({}, $v), {}, { type: n });
}), ny = (e) => e.polarOptions, ry = K([
	rp,
	ip,
	bp
], q_), iy = K([ny, ry], (e, t) => {
	if (e != null) return fs(e.innerRadius, t, 0);
}), ay = K([ny, ry], (e, t) => {
	if (e != null) return fs(e.outerRadius, t, t * .8);
}), oy = K([ny], (e) => {
	if (e == null) return [0, 0];
	var { startAngle: t, endAngle: n } = e;
	return [t, n];
});
K([ey, oy], Gv);
var sy = K([
	ry,
	iy,
	ay
], (e, t, n) => {
	if (e != null && t != null && n != null) return [t, n];
});
K([ty, sy], Gv);
var cy = K([
	rm,
	ny,
	iy,
	ay,
	rp,
	ip
], (e, t, n, r, i, a) => {
	if (!(e !== "centric" && e !== "radial" || t == null || n == null || r == null)) {
		var { cx: o, cy: s, startAngle: c, endAngle: l } = t;
		return {
			cx: fs(o, i, i / 2),
			cy: fs(s, a, a / 2),
			innerRadius: n,
			outerRadius: r,
			startAngle: c,
			endAngle: l,
			clockWise: !1
		};
	}
}), ly = (e, t) => t, uy = (e, t, n) => n;
// node_modules/recharts/es6/util/stacks/getStackSeriesIdentifier.js
function dy(e) {
	return e?.id;
}
// node_modules/recharts/es6/state/selectors/combiners/combineDisplayedStackedData.js
function fy(e, t, n) {
	var { chartData: r = [] } = t, { allowDuplicatedCategory: i, dataKey: a } = n, o = /* @__PURE__ */ new Map();
	return e.forEach((e) => {
		var t = e.data ?? r;
		if (t != null && t.length !== 0) {
			var n = dy(e);
			t.forEach((t, r) => {
				var s = a == null || i ? r : String(Bf(t, a, null)), c = Bf(t, e.dataKey, 0), l = o.has(s) ? o.get(s) : {};
				Object.assign(l, { [n]: c }), o.set(s, l);
			});
		}
	}), Array.from(o.values());
}
// node_modules/recharts/es6/state/types/StackedGraphicalItem.js
function py(e) {
	return "stackId" in e && e.stackId != null && e.dataKey != null;
}
// node_modules/recharts/es6/state/selectors/numberDomainEqualityCheck.js
var my = (e, t) => e === t ? !0 : e == null || t == null ? !1 : e[0] === t[0] && e[1] === t[1];
// node_modules/recharts/es6/state/selectors/arrayEqualityCheck.js
function hy(e, t) {
	return Array.isArray(e) && Array.isArray(t) && e.length === 0 && t.length === 0 ? !0 : e === t;
}
function gy(e, t) {
	if (e.length === t.length) {
		for (var n = 0; n < e.length; n++) if (e[n] !== t[n]) return !1;
		return !0;
	}
	return !1;
}
// node_modules/recharts/es6/state/selectors/selectTooltipAxisType.js
var _y = (e) => {
	var t = rm(e);
	return t === "horizontal" ? "xAxis" : t === "vertical" ? "yAxis" : t === "centric" ? "angleAxis" : "radiusAxis";
}, vy = (e) => e.tooltip.settings.axisId;
// node_modules/recharts/es6/util/scale/RechartsScale.js
function yy(e) {
	if (e != null) {
		var t = e.ticks, n = e.bandwidth, r = e.range(), i = [Math.min(...r), Math.max(...r)];
		return {
			domain: () => e.domain(),
			range: function(e) {
				function t() {
					return e.apply(this, arguments);
				}
				return t.toString = function() {
					return e.toString();
				}, t;
			}(() => i),
			rangeMin: () => i[0],
			rangeMax: () => i[1],
			isInRange(e) {
				var t = i[0], n = i[1];
				return t <= n ? e >= t && e <= n : e >= n && e <= t;
			},
			bandwidth: n ? () => n.call(e) : void 0,
			ticks: t ? (n) => t.call(e, n) : void 0,
			map: (t, n) => {
				var r = e(t);
				if (r != null) {
					if (e.bandwidth && n != null && n.position) {
						var i = e.bandwidth();
						switch (n.position) {
							case "middle":
								r += i / 2;
								break;
							case "end": r += i;
						}
					}
					return r;
				}
			}
		};
	}
}
// node_modules/recharts/es6/state/selectors/combiners/combineCheckedDomain.js
var by = (e, t) => {
	if (t != null) switch (e) {
		case "linear":
			if (!Sv(t)) {
				for (var n, r, i = 0; i < t.length; i++) {
					var a = t[i];
					X(a) && ((n === void 0 || a < n) && (n = a), (r === void 0 || a > r) && (r = a));
				}
				return n !== void 0 && r !== void 0 ? [n, r] : void 0;
			}
			return t;
		default: return t;
	}
};
// node_modules/d3-array/dist/d3-array.mjs
function xy(e, t) {
	return e == null || t == null ? NaN : e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function Sy(e, t) {
	return e == null || t == null ? NaN : t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function Cy(e) {
	let t, n, r;
	e.length === 2 ? (t = e === xy || e === Sy ? e : wy, n = e, r = e) : (t = xy, n = (t, n) => xy(e(t), n), r = (t, n) => e(t) - n);
	function i(e, r, i = 0, a = e.length) {
		if (i < a) {
			if (t(r, r) !== 0) return a;
			do {
				let t = i + a >>> 1;
				n(e[t], r) < 0 ? i = t + 1 : a = t;
			} while (i < a);
		}
		return i;
	}
	function a(e, r, i = 0, a = e.length) {
		if (i < a) {
			if (t(r, r) !== 0) return a;
			do {
				let t = i + a >>> 1;
				n(e[t], r) <= 0 ? i = t + 1 : a = t;
			} while (i < a);
		}
		return i;
	}
	function o(e, t, n = 0, a = e.length) {
		let o = i(e, t, n, a - 1);
		return o > n && r(e[o - 1], t) > -r(e[o], t) ? o - 1 : o;
	}
	return {
		left: i,
		center: o,
		right: a
	};
}
function wy() {
	return 0;
}
function Ty(e) {
	return e === null ? NaN : +e;
}
function* Ey(e, t) {
	if (t === void 0) for (let t of e) t != null && (t = +t) >= t && (yield t);
	else {
		let n = -1;
		for (let r of e) (r = t(r, ++n, e)) != null && (r = +r) >= r && (yield r);
	}
}
var Dy = Cy(xy), Oy = Dy.right;
Dy.left, Cy(Ty).center;
var ky = class extends Map {
	constructor(e, t = Ny) {
		if (super(), Object.defineProperties(this, {
			_intern: { value: /* @__PURE__ */ new Map() },
			_key: { value: t }
		}), e != null) for (let [t, n] of e) this.set(t, n);
	}
	get(e) {
		return super.get(Ay(this, e));
	}
	has(e) {
		return super.has(Ay(this, e));
	}
	set(e, t) {
		return super.set(jy(this, e), t);
	}
	delete(e) {
		return super.delete(My(this, e));
	}
};
function Ay({ _intern: e, _key: t }, n) {
	let r = t(n);
	return e.has(r) ? e.get(r) : n;
}
function jy({ _intern: e, _key: t }, n) {
	let r = t(n);
	return e.has(r) ? e.get(r) : (e.set(r, n), n);
}
function My({ _intern: e, _key: t }, n) {
	let r = t(n);
	return e.has(r) && (n = e.get(r), e.delete(r)), n;
}
function Ny(e) {
	return typeof e == "object" && e ? e.valueOf() : e;
}
function Py(e = xy) {
	if (e === xy) return Fy;
	if (typeof e != "function") throw TypeError("compare is not a function");
	return (t, n) => {
		let r = e(t, n);
		return r || r === 0 ? r : (e(n, n) === 0) - (e(t, t) === 0);
	};
}
function Fy(e, t) {
	return (e == null || !(e >= e)) - (t == null || !(t >= t)) || (e < t ? -1 : +(e > t));
}
Array.prototype.slice;
var Iy = Math.sqrt(50), Ly = Math.sqrt(10), Ry = Math.sqrt(2);
function zy(e, t, n) {
	let r = (t - e) / Math.max(0, n), i = Math.floor(Math.log10(r)), a = r / 10 ** i, o = a >= Iy ? 10 : a >= Ly ? 5 : a >= Ry ? 2 : 1, s, c, l;
	return i < 0 ? (l = 10 ** -i / o, s = Math.round(e * l), c = Math.round(t * l), s / l < e && ++s, c / l > t && --c, l = -l) : (l = 10 ** i * o, s = Math.round(e / l), c = Math.round(t / l), s * l < e && ++s, c * l > t && --c), c < s && .5 <= n && n < 2 ? zy(e, t, n * 2) : [
		s,
		c,
		l
	];
}
function By(e, t, n) {
	if (t = +t, e = +e, n = +n, !(n > 0)) return [];
	if (e === t) return [e];
	let r = t < e, [i, a, o] = r ? zy(t, e, n) : zy(e, t, n);
	if (!(a >= i)) return [];
	let s = a - i + 1, c = Array(s);
	if (r) {
		if (o < 0) for (let e = 0; e < s; ++e) c[e] = (a - e) / -o;
		else for (let e = 0; e < s; ++e) c[e] = (a - e) * o;
	} else if (o < 0) for (let e = 0; e < s; ++e) c[e] = (i + e) / -o;
	else for (let e = 0; e < s; ++e) c[e] = (i + e) * o;
	return c;
}
function Vy(e, t, n) {
	return t = +t, e = +e, n = +n, zy(e, t, n)[2];
}
function Hy(e, t, n) {
	t = +t, e = +e, n = +n;
	let r = t < e, i = r ? Vy(t, e, n) : Vy(e, t, n);
	return (r ? -1 : 1) * (i < 0 ? 1 / -i : i);
}
function Uy(e, t) {
	let n;
	if (t === void 0) for (let t of e) t != null && (n < t || n === void 0 && t >= t) && (n = t);
	else {
		let r = -1;
		for (let i of e) (i = t(i, ++r, e)) != null && (n < i || n === void 0 && i >= i) && (n = i);
	}
	return n;
}
function Wy(e, t) {
	let n;
	if (t === void 0) for (let t of e) t != null && (n > t || n === void 0 && t >= t) && (n = t);
	else {
		let r = -1;
		for (let i of e) (i = t(i, ++r, e)) != null && (n > i || n === void 0 && i >= i) && (n = i);
	}
	return n;
}
function Gy(e, t, n = 0, r = 1e400, i) {
	if (t = Math.floor(t), n = Math.floor(Math.max(0, n)), r = Math.floor(Math.min(e.length - 1, r)), !(n <= t && t <= r)) return e;
	for (i = i === void 0 ? Fy : Py(i); r > n;) {
		if (r - n > 600) {
			let a = r - n + 1, o = t - n + 1, s = Math.log(a), c = .5 * Math.exp(2 * s / 3), l = .5 * Math.sqrt(s * c * (a - c) / a) * (o - a / 2 < 0 ? -1 : 1), u = Math.max(n, Math.floor(t - o * c / a + l)), d = Math.min(r, Math.floor(t + (a - o) * c / a + l));
			Gy(e, t, u, d, i);
		}
		let a = e[t], o = n, s = r;
		for (Ky(e, n, t), i(e[r], a) > 0 && Ky(e, n, r); o < s;) {
			for (Ky(e, o, s), ++o, --s; i(e[o], a) < 0;) ++o;
			for (; i(e[s], a) > 0;) --s;
		}
		i(e[n], a) === 0 ? Ky(e, n, s) : (++s, Ky(e, s, r)), s <= t && (n = s + 1), t <= s && (r = s - 1);
	}
	return e;
}
function Ky(e, t, n) {
	let r = e[t];
	e[t] = e[n], e[n] = r;
}
function qy(e, t, n) {
	if (e = Float64Array.from(Ey(e, n)), (r = e.length) && !isNaN(t = +t)) {
		if (t <= 0 || r < 2) return Wy(e);
		if (t >= 1) return Uy(e);
		var r, i = (r - 1) * t, a = Math.floor(i), o = Uy(Gy(e, a).subarray(0, a + 1));
		return o + (Wy(e.subarray(a + 1)) - o) * (i - a);
	}
}
function Jy(e, t, n = Ty) {
	if ((r = e.length) && !isNaN(t = +t)) {
		if (t <= 0 || r < 2) return +n(e[0], 0, e);
		if (t >= 1) return +n(e[r - 1], r - 1, e);
		var r, i = (r - 1) * t, a = Math.floor(i), o = +n(e[a], a, e);
		return o + (+n(e[a + 1], a + 1, e) - o) * (i - a);
	}
}
function Yy(e, t, n) {
	e = +e, t = +t, n = (i = arguments.length) < 2 ? (t = e, e = 0, 1) : i < 3 ? 1 : +n;
	for (var r = -1, i = Math.max(0, Math.ceil((t - e) / n)) | 0, a = Array(i); ++r < i;) a[r] = e + r * n;
	return a;
}
// node_modules/d3-color/dist/d3-color.mjs
function Xy(e, t, n) {
	e.prototype = t.prototype = n, n.constructor = e;
}
function Zy(e, t) {
	var n = Object.create(e.prototype);
	for (var r in t) n[r] = t[r];
	return n;
}
function Qy() {}
var $y = .7, eb = 1 / $y, tb = "\\s*([+-]?\\d+)\\s*", nb = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", rb = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", ib = /^#([0-9a-f]{3,8})$/, ab = RegExp(`^rgb\\(${tb},${tb},${tb}\\)$`), ob = RegExp(`^rgb\\(${rb},${rb},${rb}\\)$`), sb = RegExp(`^rgba\\(${tb},${tb},${tb},${nb}\\)$`), cb = RegExp(`^rgba\\(${rb},${rb},${rb},${nb}\\)$`), lb = RegExp(`^hsl\\(${nb},${rb},${rb}\\)$`), ub = RegExp(`^hsla\\(${nb},${rb},${rb},${nb}\\)$`), db = {
	aliceblue: 0xf0f8ff,
	antiquewhite: 0xfaebd7,
	aqua: 65535,
	aquamarine: 8388564,
	azure: 0xf0ffff,
	beige: 0xf5f5dc,
	bisque: 0xffe4c4,
	black: 0,
	blanchedalmond: 0xffebcd,
	blue: 255,
	blueviolet: 9055202,
	brown: 0xa52a2a,
	burlywood: 0xdeb887,
	cadetblue: 6266528,
	chartreuse: 8388352,
	chocolate: 0xd2691e,
	coral: 0xff7f50,
	cornflowerblue: 6591981,
	cornsilk: 0xfff8dc,
	crimson: 0xdc143c,
	cyan: 65535,
	darkblue: 139,
	darkcyan: 35723,
	darkgoldenrod: 0xb8860b,
	darkgray: 0xa9a9a9,
	darkgreen: 25600,
	darkgrey: 0xa9a9a9,
	darkkhaki: 0xbdb76b,
	darkmagenta: 9109643,
	darkolivegreen: 5597999,
	darkorange: 0xff8c00,
	darkorchid: 0x9932cc,
	darkred: 9109504,
	darksalmon: 0xe9967a,
	darkseagreen: 9419919,
	darkslateblue: 4734347,
	darkslategray: 3100495,
	darkslategrey: 3100495,
	darkturquoise: 52945,
	darkviolet: 9699539,
	deeppink: 0xff1493,
	deepskyblue: 49151,
	dimgray: 6908265,
	dimgrey: 6908265,
	dodgerblue: 2003199,
	firebrick: 0xb22222,
	floralwhite: 0xfffaf0,
	forestgreen: 2263842,
	fuchsia: 0xff00ff,
	gainsboro: 0xdcdcdc,
	ghostwhite: 0xf8f8ff,
	gold: 0xffd700,
	goldenrod: 0xdaa520,
	gray: 8421504,
	green: 32768,
	greenyellow: 0xadff2f,
	grey: 8421504,
	honeydew: 0xf0fff0,
	hotpink: 0xff69b4,
	indianred: 0xcd5c5c,
	indigo: 4915330,
	ivory: 0xfffff0,
	khaki: 0xf0e68c,
	lavender: 0xe6e6fa,
	lavenderblush: 0xfff0f5,
	lawngreen: 8190976,
	lemonchiffon: 0xfffacd,
	lightblue: 0xadd8e6,
	lightcoral: 0xf08080,
	lightcyan: 0xe0ffff,
	lightgoldenrodyellow: 0xfafad2,
	lightgray: 0xd3d3d3,
	lightgreen: 9498256,
	lightgrey: 0xd3d3d3,
	lightpink: 0xffb6c1,
	lightsalmon: 0xffa07a,
	lightseagreen: 2142890,
	lightskyblue: 8900346,
	lightslategray: 7833753,
	lightslategrey: 7833753,
	lightsteelblue: 0xb0c4de,
	lightyellow: 0xffffe0,
	lime: 65280,
	limegreen: 3329330,
	linen: 0xfaf0e6,
	magenta: 0xff00ff,
	maroon: 8388608,
	mediumaquamarine: 6737322,
	mediumblue: 205,
	mediumorchid: 0xba55d3,
	mediumpurple: 9662683,
	mediumseagreen: 3978097,
	mediumslateblue: 8087790,
	mediumspringgreen: 64154,
	mediumturquoise: 4772300,
	mediumvioletred: 0xc71585,
	midnightblue: 1644912,
	mintcream: 0xf5fffa,
	mistyrose: 0xffe4e1,
	moccasin: 0xffe4b5,
	navajowhite: 0xffdead,
	navy: 128,
	oldlace: 0xfdf5e6,
	olive: 8421376,
	olivedrab: 7048739,
	orange: 0xffa500,
	orangered: 0xff4500,
	orchid: 0xda70d6,
	palegoldenrod: 0xeee8aa,
	palegreen: 0x98fb98,
	paleturquoise: 0xafeeee,
	palevioletred: 0xdb7093,
	papayawhip: 0xffefd5,
	peachpuff: 0xffdab9,
	peru: 0xcd853f,
	pink: 0xffc0cb,
	plum: 0xdda0dd,
	powderblue: 0xb0e0e6,
	purple: 8388736,
	rebeccapurple: 6697881,
	red: 0xff0000,
	rosybrown: 0xbc8f8f,
	royalblue: 4286945,
	saddlebrown: 9127187,
	salmon: 0xfa8072,
	sandybrown: 0xf4a460,
	seagreen: 3050327,
	seashell: 0xfff5ee,
	sienna: 0xa0522d,
	silver: 0xc0c0c0,
	skyblue: 8900331,
	slateblue: 6970061,
	slategray: 7372944,
	slategrey: 7372944,
	snow: 0xfffafa,
	springgreen: 65407,
	steelblue: 4620980,
	tan: 0xd2b48c,
	teal: 32896,
	thistle: 0xd8bfd8,
	tomato: 0xff6347,
	turquoise: 4251856,
	violet: 0xee82ee,
	wheat: 0xf5deb3,
	white: 0xffffff,
	whitesmoke: 0xf5f5f5,
	yellow: 0xffff00,
	yellowgreen: 0x9acd32
};
Xy(Qy, gb, {
	copy(e) {
		return Object.assign(new this.constructor(), this, e);
	},
	displayable() {
		return this.rgb().displayable();
	},
	hex: fb,
	formatHex: fb,
	formatHex8: pb,
	formatHsl: mb,
	formatRgb: hb,
	toString: hb
});
function fb() {
	return this.rgb().formatHex();
}
function pb() {
	return this.rgb().formatHex8();
}
function mb() {
	return kb(this).formatHsl();
}
function hb() {
	return this.rgb().formatRgb();
}
function gb(e) {
	var t, n;
	return e = (e + "").trim().toLowerCase(), (t = ib.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? _b(t) : n === 3 ? new xb(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? vb(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? vb(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = ab.exec(e)) ? new xb(t[1], t[2], t[3], 1) : (t = ob.exec(e)) ? new xb(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = sb.exec(e)) ? vb(t[1], t[2], t[3], t[4]) : (t = cb.exec(e)) ? vb(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = lb.exec(e)) ? Ob(t[1], t[2] / 100, t[3] / 100, 1) : (t = ub.exec(e)) ? Ob(t[1], t[2] / 100, t[3] / 100, t[4]) : db.hasOwnProperty(e) ? _b(db[e]) : e === "transparent" ? new xb(NaN, NaN, NaN, 0) : null;
}
function _b(e) {
	return new xb(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function vb(e, t, n, r) {
	return r <= 0 && (e = t = n = NaN), new xb(e, t, n, r);
}
function yb(e) {
	return e instanceof Qy || (e = gb(e)), e ? (e = e.rgb(), new xb(e.r, e.g, e.b, e.opacity)) : new xb();
}
function bb(e, t, n, r) {
	return arguments.length === 1 ? yb(e) : new xb(e, t, n, r ?? 1);
}
function xb(e, t, n, r) {
	this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
Xy(xb, bb, Zy(Qy, {
	brighter(e) {
		return e = e == null ? eb : eb ** +e, new xb(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? $y : $y ** +e, new xb(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	rgb() {
		return this;
	},
	clamp() {
		return new xb(Eb(this.r), Eb(this.g), Eb(this.b), Tb(this.opacity));
	},
	displayable() {
		return -.5 <= this.r && this.r < 255.5 && -.5 <= this.g && this.g < 255.5 && -.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
	},
	hex: Sb,
	formatHex: Sb,
	formatHex8: Cb,
	formatRgb: wb,
	toString: wb
}));
function Sb() {
	return `#${Db(this.r)}${Db(this.g)}${Db(this.b)}`;
}
function Cb() {
	return `#${Db(this.r)}${Db(this.g)}${Db(this.b)}${Db((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function wb() {
	let e = Tb(this.opacity);
	return `${e === 1 ? "rgb(" : "rgba("}${Eb(this.r)}, ${Eb(this.g)}, ${Eb(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function Tb(e) {
	return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function Eb(e) {
	return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function Db(e) {
	return e = Eb(e), (e < 16 ? "0" : "") + e.toString(16);
}
function Ob(e, t, n, r) {
	return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new jb(e, t, n, r);
}
function kb(e) {
	if (e instanceof jb) return new jb(e.h, e.s, e.l, e.opacity);
	if (e instanceof Qy || (e = gb(e)), !e) return new jb();
	if (e instanceof jb) return e;
	e = e.rgb();
	var t = e.r / 255, n = e.g / 255, r = e.b / 255, i = Math.min(t, n, r), a = Math.max(t, n, r), o = NaN, s = a - i, c = (a + i) / 2;
	return s ? (o = t === a ? (n - r) / s + (n < r) * 6 : n === a ? (r - t) / s + 2 : (t - n) / s + 4, s /= c < .5 ? a + i : 2 - a - i, o *= 60) : s = c > 0 && c < 1 ? 0 : o, new jb(o, s, c, e.opacity);
}
function Ab(e, t, n, r) {
	return arguments.length === 1 ? kb(e) : new jb(e, t, n, r ?? 1);
}
function jb(e, t, n, r) {
	this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
Xy(jb, Ab, Zy(Qy, {
	brighter(e) {
		return e = e == null ? eb : eb ** +e, new jb(this.h, this.s, this.l * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? $y : $y ** +e, new jb(this.h, this.s, this.l * e, this.opacity);
	},
	rgb() {
		var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < .5 ? n : 1 - n) * t, i = 2 * n - r;
		return new xb(Pb(e >= 240 ? e - 240 : e + 120, i, r), Pb(e, i, r), Pb(e < 120 ? e + 240 : e - 120, i, r), this.opacity);
	},
	clamp() {
		return new jb(Mb(this.h), Nb(this.s), Nb(this.l), Tb(this.opacity));
	},
	displayable() {
		return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
	},
	formatHsl() {
		let e = Tb(this.opacity);
		return `${e === 1 ? "hsl(" : "hsla("}${Mb(this.h)}, ${Nb(this.s) * 100}%, ${Nb(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
	}
}));
function Mb(e) {
	return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function Nb(e) {
	return Math.max(0, Math.min(1, e || 0));
}
function Pb(e, t, n) {
	return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
var Fb = Math.PI / 180, Ib = 180 / Math.PI, Lb = 18, Rb = .96422, zb = 1, Bb = .82521, Vb = 4 / 29, Hb = 6 / 29, Ub = 3 * Hb * Hb, Wb = Hb * Hb * Hb;
function Gb(e) {
	if (e instanceof qb) return new qb(e.l, e.a, e.b, e.opacity);
	if (e instanceof ex) return tx(e);
	e instanceof xb || (e = yb(e));
	var t = Zb(e.r), n = Zb(e.g), r = Zb(e.b), i = Jb((.2225045 * t + .7168786 * n + .0606169 * r) / zb), a, o;
	return t === n && n === r ? a = o = i : (a = Jb((.4360747 * t + .3850649 * n + .1430804 * r) / Rb), o = Jb((.0139322 * t + .0971045 * n + .7141733 * r) / Bb)), new qb(116 * i - 16, 500 * (a - i), 200 * (i - o), e.opacity);
}
function Kb(e, t, n, r) {
	return arguments.length === 1 ? Gb(e) : new qb(e, t, n, r ?? 1);
}
function qb(e, t, n, r) {
	this.l = +e, this.a = +t, this.b = +n, this.opacity = +r;
}
Xy(qb, Kb, Zy(Qy, {
	brighter(e) {
		return new qb(this.l + Lb * (e ?? 1), this.a, this.b, this.opacity);
	},
	darker(e) {
		return new qb(this.l - Lb * (e ?? 1), this.a, this.b, this.opacity);
	},
	rgb() {
		var e = (this.l + 16) / 116, t = isNaN(this.a) ? e : e + this.a / 500, n = isNaN(this.b) ? e : e - this.b / 200;
		return t = Rb * Yb(t), e = zb * Yb(e), n = Bb * Yb(n), new xb(Xb(3.1338561 * t - 1.6168667 * e - .4906146 * n), Xb(-.9787684 * t + 1.9161415 * e + .033454 * n), Xb(.0719453 * t - .2289914 * e + 1.4052427 * n), this.opacity);
	}
}));
function Jb(e) {
	return e > Wb ? e ** (1 / 3) : e / Ub + Vb;
}
function Yb(e) {
	return e > Hb ? e * e * e : Ub * (e - Vb);
}
function Xb(e) {
	return 255 * (e <= .0031308 ? 12.92 * e : 1.055 * e ** (1 / 2.4) - .055);
}
function Zb(e) {
	return (e /= 255) <= .04045 ? e / 12.92 : ((e + .055) / 1.055) ** 2.4;
}
function Qb(e) {
	if (e instanceof ex) return new ex(e.h, e.c, e.l, e.opacity);
	if (e instanceof qb || (e = Gb(e)), e.a === 0 && e.b === 0) return new ex(NaN, 0 < e.l && e.l < 100 ? 0 : NaN, e.l, e.opacity);
	var t = Math.atan2(e.b, e.a) * Ib;
	return new ex(t < 0 ? t + 360 : t, Math.sqrt(e.a * e.a + e.b * e.b), e.l, e.opacity);
}
function $b(e, t, n, r) {
	return arguments.length === 1 ? Qb(e) : new ex(e, t, n, r ?? 1);
}
function ex(e, t, n, r) {
	this.h = +e, this.c = +t, this.l = +n, this.opacity = +r;
}
function tx(e) {
	if (isNaN(e.h)) return new qb(e.l, 0, 0, e.opacity);
	var t = e.h * Fb;
	return new qb(e.l, Math.cos(t) * e.c, Math.sin(t) * e.c, e.opacity);
}
Xy(ex, $b, Zy(Qy, {
	brighter(e) {
		return new ex(this.h, this.c, this.l + Lb * (e ?? 1), this.opacity);
	},
	darker(e) {
		return new ex(this.h, this.c, this.l - Lb * (e ?? 1), this.opacity);
	},
	rgb() {
		return tx(this).rgb();
	}
}));
var nx = -.14861, rx = 1.78277, ix = -.29227, ax = -.90649, ox = 1.97294, sx = ox * ax, cx = ox * rx, lx = rx * ix - ax * nx;
function ux(e) {
	if (e instanceof fx) return new fx(e.h, e.s, e.l, e.opacity);
	e instanceof xb || (e = yb(e));
	var t = e.r / 255, n = e.g / 255, r = e.b / 255, i = (lx * r + sx * t - cx * n) / (lx + sx - cx), a = r - i, o = (ox * (n - i) - ix * a) / ax, s = Math.sqrt(o * o + a * a) / (ox * i * (1 - i)), c = s ? Math.atan2(o, a) * Ib - 120 : NaN;
	return new fx(c < 0 ? c + 360 : c, s, i, e.opacity);
}
function dx(e, t, n, r) {
	return arguments.length === 1 ? ux(e) : new fx(e, t, n, r ?? 1);
}
function fx(e, t, n, r) {
	this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
Xy(fx, dx, Zy(Qy, {
	brighter(e) {
		return e = e == null ? eb : eb ** +e, new fx(this.h, this.s, this.l * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? $y : $y ** +e, new fx(this.h, this.s, this.l * e, this.opacity);
	},
	rgb() {
		var e = isNaN(this.h) ? 0 : (this.h + 120) * Fb, t = +this.l, n = isNaN(this.s) ? 0 : this.s * t * (1 - t), r = Math.cos(e), i = Math.sin(e);
		return new xb(255 * (t + n * (nx * r + rx * i)), 255 * (t + n * (ix * r + ax * i)), 255 * (t + ox * r * n), this.opacity);
	}
}));
var px = (e) => () => e;
function mx(e, t) {
	return function(n) {
		return e + n * t;
	};
}
function hx(e, t, n) {
	return e **= +n, t = t ** +n - e, n = 1 / n, function(r) {
		return (e + r * t) ** +n;
	};
}
function gx(e, t) {
	var n = t - e;
	return n ? mx(e, n > 180 || n < -180 ? n - 360 * Math.round(n / 360) : n) : px(isNaN(e) ? t : e);
}
function _x(e) {
	return (e = +e) == 1 ? vx : function(t, n) {
		return n - t ? hx(t, n, e) : px(isNaN(t) ? n : t);
	};
}
function vx(e, t) {
	var n = t - e;
	return n ? mx(e, n) : px(isNaN(e) ? t : e);
}
var yx = (function e(t) {
	var n = _x(t);
	function r(e, t) {
		var r = n((e = bb(e)).r, (t = bb(t)).r), i = n(e.g, t.g), a = n(e.b, t.b), o = vx(e.opacity, t.opacity);
		return function(t) {
			return e.r = r(t), e.g = i(t), e.b = a(t), e.opacity = o(t), e + "";
		};
	}
	return r.gamma = e, r;
})(1);
function bx(e, t) {
	t ||= [];
	var n = e ? Math.min(t.length, e.length) : 0, r = t.slice(), i;
	return function(a) {
		for (i = 0; i < n; ++i) r[i] = e[i] * (1 - a) + t[i] * a;
		return r;
	};
}
function xx(e) {
	return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function Sx(e, t) {
	for (var n = t ? t.length : 0, r = e ? Math.min(n, e.length) : 0, i = Array(r), a = Array(n), o = 0; o < r; ++o) i[o] = jx(e[o], t[o]);
	for (; o < n; ++o) a[o] = t[o];
	return function(e) {
		for (o = 0; o < r; ++o) a[o] = i[o](e);
		return a;
	};
}
function Cx(e, t) {
	var n = /* @__PURE__ */ new Date();
	return e = +e, t = +t, function(r) {
		return n.setTime(e * (1 - r) + t * r), n;
	};
}
function wx(e, t) {
	return e = +e, t = +t, function(n) {
		return e * (1 - n) + t * n;
	};
}
function Tx(e, t) {
	var n = {}, r = {}, i;
	for (i in typeof e == "object" && e || (e = {}), typeof t == "object" && t || (t = {}), t) i in e ? n[i] = jx(e[i], t[i]) : r[i] = t[i];
	return function(e) {
		for (i in n) r[i] = n[i](e);
		return r;
	};
}
var Ex = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Dx = new RegExp(Ex.source, "g");
function Ox(e) {
	return function() {
		return e;
	};
}
function kx(e) {
	return function(t) {
		return e(t) + "";
	};
}
function Ax(e, t) {
	var n = Ex.lastIndex = Dx.lastIndex = 0, r, i, a, o = -1, s = [], c = [];
	for (e += "", t += ""; (r = Ex.exec(e)) && (i = Dx.exec(t));) (a = i.index) > n && (a = t.slice(n, a), s[o] ? s[o] += a : s[++o] = a), (r = r[0]) === (i = i[0]) ? s[o] ? s[o] += i : s[++o] = i : (s[++o] = null, c.push({
		i: o,
		x: wx(r, i)
	})), n = Dx.lastIndex;
	return n < t.length && (a = t.slice(n), s[o] ? s[o] += a : s[++o] = a), s.length < 2 ? c[0] ? kx(c[0].x) : Ox(t) : (t = c.length, function(e) {
		for (var n = 0, r; n < t; ++n) s[(r = c[n]).i] = r.x(e);
		return s.join("");
	});
}
function jx(e, t) {
	var n = typeof t, r;
	return t == null || n === "boolean" ? px(t) : (n === "number" ? wx : n === "string" ? (r = gb(t)) ? (t = r, yx) : Ax : t instanceof gb ? yx : t instanceof Date ? Cx : xx(t) ? bx : Array.isArray(t) ? Sx : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? Tx : wx)(e, t);
}
function Mx(e, t) {
	return e = +e, t = +t, function(n) {
		return Math.round(e * (1 - n) + t * n);
	};
}
var Nx = 1e-12;
function Px(e) {
	return ((e = Math.exp(e)) + 1 / e) / 2;
}
function Fx(e) {
	return ((e = Math.exp(e)) - 1 / e) / 2;
}
function Ix(e) {
	return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
(function e(t, n, r) {
	function i(e, i) {
		var a = e[0], o = e[1], s = e[2], c = i[0], l = i[1], u = i[2], d = c - a, f = l - o, p = d * d + f * f, m, h;
		if (p < Nx) h = Math.log(u / s) / t, m = function(e) {
			return [
				a + e * d,
				o + e * f,
				s * Math.exp(t * e * h)
			];
		};
		else {
			var g = Math.sqrt(p), _ = (u * u - s * s + r * p) / (2 * s * n * g), v = (u * u - s * s - r * p) / (2 * u * n * g), y = Math.log(Math.sqrt(_ * _ + 1) - _);
			h = (Math.log(Math.sqrt(v * v + 1) - v) - y) / t, m = function(e) {
				var r = e * h, i = Px(y), c = s / (n * g) * (i * Ix(t * r + y) - Fx(y));
				return [
					a + c * d,
					o + c * f,
					s * i / Px(t * r + y)
				];
			};
		}
		return m.duration = Math.abs(h) * 1e3 * t / Math.SQRT2, m;
	}
	return i.rho = function(t) {
		var n = Math.max(.001, +t), r = n * n;
		return e(n, r, r * r);
	}, i;
})(Math.SQRT2, 2, 4);
function Lx(e) {
	return (function t(n) {
		n = +n;
		function r(t, r) {
			var i = e((t = dx(t)).h, (r = dx(r)).h), a = vx(t.s, r.s), o = vx(t.l, r.l), s = vx(t.opacity, r.opacity);
			return function(e) {
				return t.h = i(e), t.s = a(e), t.l = o(e ** +n), t.opacity = s(e), t + "";
			};
		}
		return r.gamma = t, r;
	})(1);
}
Lx(gx), Lx(vx);
function Rx(e, t) {
	t === void 0 && (t = e, e = jx);
	for (var n = 0, r = t.length - 1, i = t[0], a = Array(r < 0 ? 0 : r); n < r;) a[n] = e(i, i = t[++n]);
	return function(e) {
		var t = Math.max(0, Math.min(r - 1, Math.floor(e *= r)));
		return a[t](e - t);
	};
}
// node_modules/d3-format/dist/d3-format.mjs
function zx(e) {
	return Math.abs(e = Math.round(e)) >= 1e21 ? e.toLocaleString("en").replace(/,/g, "") : e.toString(10);
}
function Bx(e, t) {
	if (!isFinite(e) || e === 0) return null;
	var n = (e = t ? e.toExponential(t - 1) : e.toExponential()).indexOf("e"), r = e.slice(0, n);
	return [r.length > 1 ? r[0] + r.slice(2) : r, +e.slice(n + 1)];
}
function Vx(e) {
	return e = Bx(Math.abs(e)), e ? e[1] : NaN;
}
function Hx(e, t) {
	return function(n, r) {
		for (var i = n.length, a = [], o = 0, s = e[0], c = 0; i > 0 && s > 0 && (c + s + 1 > r && (s = Math.max(1, r - c)), a.push(n.substring(i -= s, i + s)), !((c += s + 1) > r));) s = e[o = (o + 1) % e.length];
		return a.reverse().join(t);
	};
}
function Ux(e) {
	return function(t) {
		return t.replace(/[0-9]/g, function(t) {
			return e[+t];
		});
	};
}
var Wx = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function Gx(e) {
	if (!(t = Wx.exec(e))) throw Error("invalid format: " + e);
	var t;
	return new Kx({
		fill: t[1],
		align: t[2],
		sign: t[3],
		symbol: t[4],
		zero: t[5],
		width: t[6],
		comma: t[7],
		precision: t[8] && t[8].slice(1),
		trim: t[9],
		type: t[10]
	});
}
Gx.prototype = Kx.prototype;
function Kx(e) {
	this.fill = e.fill === void 0 ? " " : e.fill + "", this.align = e.align === void 0 ? ">" : e.align + "", this.sign = e.sign === void 0 ? "-" : e.sign + "", this.symbol = e.symbol === void 0 ? "" : e.symbol + "", this.zero = !!e.zero, this.width = e.width === void 0 ? void 0 : +e.width, this.comma = !!e.comma, this.precision = e.precision === void 0 ? void 0 : +e.precision, this.trim = !!e.trim, this.type = e.type === void 0 ? "" : e.type + "";
}
Kx.prototype.toString = function() {
	return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
function qx(e) {
	e: for (var t = e.length, n = 1, r = -1, i; n < t; ++n) switch (e[n]) {
		case ".":
			r = i = n;
			break;
		case "0":
			r === 0 && (r = n), i = n;
			break;
		default:
			if (!+e[n]) break e;
			r > 0 && (r = 0);
	}
	return r > 0 ? e.slice(0, r) + e.slice(i + 1) : e;
}
var Jx;
function Yx(e, t) {
	var n = Bx(e, t);
	if (!n) return Jx = void 0, e.toPrecision(t);
	var r = n[0], i = n[1], a = i - (Jx = Math.max(-8, Math.min(8, Math.floor(i / 3))) * 3) + 1, o = r.length;
	return a === o ? r : a > o ? r + Array(a - o + 1).join("0") : a > 0 ? r.slice(0, a) + "." + r.slice(a) : "0." + Array(1 - a).join("0") + Bx(e, Math.max(0, t + a - 1))[0];
}
function Xx(e, t) {
	var n = Bx(e, t);
	if (!n) return e + "";
	var r = n[0], i = n[1];
	return i < 0 ? "0." + Array(-i).join("0") + r : r.length > i + 1 ? r.slice(0, i + 1) + "." + r.slice(i + 1) : r + Array(i - r.length + 2).join("0");
}
var Zx = {
	"%": (e, t) => (e * 100).toFixed(t),
	b: (e) => Math.round(e).toString(2),
	c: (e) => e + "",
	d: zx,
	e: (e, t) => e.toExponential(t),
	f: (e, t) => e.toFixed(t),
	g: (e, t) => e.toPrecision(t),
	o: (e) => Math.round(e).toString(8),
	p: (e, t) => Xx(e * 100, t),
	r: Xx,
	s: Yx,
	X: (e) => Math.round(e).toString(16).toUpperCase(),
	x: (e) => Math.round(e).toString(16)
};
function Qx(e) {
	return e;
}
var $x = Array.prototype.map, eS = [
	"y",
	"z",
	"a",
	"f",
	"p",
	"n",
	"µ",
	"m",
	"",
	"k",
	"M",
	"G",
	"T",
	"P",
	"E",
	"Z",
	"Y"
];
function tS(e) {
	var t = e.grouping === void 0 || e.thousands === void 0 ? Qx : Hx($x.call(e.grouping, Number), e.thousands + ""), n = e.currency === void 0 ? "" : e.currency[0] + "", r = e.currency === void 0 ? "" : e.currency[1] + "", i = e.decimal === void 0 ? "." : e.decimal + "", a = e.numerals === void 0 ? Qx : Ux($x.call(e.numerals, String)), o = e.percent === void 0 ? "%" : e.percent + "", s = e.minus === void 0 ? "−" : e.minus + "", c = e.nan === void 0 ? "NaN" : e.nan + "";
	function l(e, l) {
		e = Gx(e);
		var u = e.fill, d = e.align, f = e.sign, p = e.symbol, m = e.zero, h = e.width, g = e.comma, _ = e.precision, v = e.trim, y = e.type;
		y === "n" ? (g = !0, y = "g") : Zx[y] || (_ === void 0 && (_ = 12), v = !0, y = "g"), (m || u === "0" && d === "=") && (m = !0, u = "0", d = "=");
		var b = (l && l.prefix !== void 0 ? l.prefix : "") + (p === "$" ? n : p === "#" && /[boxX]/.test(y) ? "0" + y.toLowerCase() : ""), x = (p === "$" ? r : /[%p]/.test(y) ? o : "") + (l && l.suffix !== void 0 ? l.suffix : ""), S = Zx[y], C = /[defgprs%]/.test(y);
		_ = _ === void 0 ? 6 : /[gprs]/.test(y) ? Math.max(1, Math.min(21, _)) : Math.max(0, Math.min(20, _));
		function w(e) {
			var n = b, r = x, o, l, p;
			if (y === "c") r = S(e) + r, e = "";
			else {
				e = +e;
				var w = e < 0 || 1 / e < 0;
				if (e = isNaN(e) ? c : S(Math.abs(e), _), v && (e = qx(e)), w && +e == 0 && f !== "+" && (w = !1), n = (w ? f === "(" ? f : s : f === "-" || f === "(" ? "" : f) + n, r = (y === "s" && !isNaN(e) && Jx !== void 0 ? eS[8 + Jx / 3] : "") + r + (w && f === "(" ? ")" : ""), C) {
					for (o = -1, l = e.length; ++o < l;) if (p = e.charCodeAt(o), 48 > p || p > 57) {
						r = (p === 46 ? i + e.slice(o + 1) : e.slice(o)) + r, e = e.slice(0, o);
						break;
					}
				}
			}
			g && !m && (e = t(e, 1e400));
			var T = n.length + e.length + r.length, E = T < h ? Array(h - T + 1).join(u) : "";
			switch (g && m && (e = t(E + e, E.length ? h - r.length : 1e400), E = ""), d) {
				case "<":
					e = n + e + r + E;
					break;
				case "=":
					e = n + E + e + r;
					break;
				case "^":
					e = E.slice(0, T = E.length >> 1) + n + e + r + E.slice(T);
					break;
				default: e = E + n + e + r;
			}
			return a(e);
		}
		return w.toString = function() {
			return e + "";
		}, w;
	}
	function u(e, t) {
		var n = Math.max(-8, Math.min(8, Math.floor(Vx(t) / 3))) * 3, r = 10 ** -n, i = l((e = Gx(e), e.type = "f", e), { suffix: eS[8 + n / 3] });
		return function(e) {
			return i(r * e);
		};
	}
	return {
		format: l,
		formatPrefix: u
	};
}
var nS, rS, iS;
aS({
	thousands: ",",
	grouping: [3],
	currency: ["$", ""]
});
function aS(e) {
	return nS = tS(e), rS = nS.format, iS = nS.formatPrefix, nS;
}
function oS(e) {
	return Math.max(0, -Vx(Math.abs(e)));
}
function sS(e, t) {
	return Math.max(0, Math.max(-8, Math.min(8, Math.floor(Vx(t) / 3))) * 3 - Vx(Math.abs(e)));
}
function cS(e, t) {
	return e = Math.abs(e), t = Math.abs(t) - e, Math.max(0, Vx(t) - Vx(e)) + 1;
}
// node_modules/d3-time/dist/d3-time.mjs
var lS = /* @__PURE__ */ new Date(), uS = /* @__PURE__ */ new Date();
function dS(e, t, n, r) {
	function i(t) {
		return e(t = arguments.length === 0 ? /* @__PURE__ */ new Date() : /* @__PURE__ */ new Date(+t)), t;
	}
	return i.floor = (t) => (e(t = /* @__PURE__ */ new Date(+t)), t), i.ceil = (n) => (e(n = /* @__PURE__ */ new Date(n - 1)), t(n, 1), e(n), n), i.round = (e) => {
		let t = i(e), n = i.ceil(e);
		return e - t < n - e ? t : n;
	}, i.offset = (e, n) => (t(e = /* @__PURE__ */ new Date(+e), n == null ? 1 : Math.floor(n)), e), i.range = (n, r, a) => {
		let o = [];
		if (n = i.ceil(n), a = a == null ? 1 : Math.floor(a), !(n < r) || !(a > 0)) return o;
		let s;
		do
			o.push(s = /* @__PURE__ */ new Date(+n)), t(n, a), e(n);
		while (s < n && n < r);
		return o;
	}, i.filter = (n) => dS((t) => {
		if (t >= t) for (; e(t), !n(t);) t.setTime(t - 1);
	}, (e, r) => {
		if (e >= e) {
			if (r < 0) for (; ++r <= 0;) for (; t(e, -1), !n(e););
			else for (; --r >= 0;) for (; t(e, 1), !n(e););
		}
	}), n && (i.count = (t, r) => (lS.setTime(+t), uS.setTime(+r), e(lS), e(uS), Math.floor(n(lS, uS))), i.every = (e) => (e = Math.floor(e), !isFinite(e) || !(e > 0) ? null : e > 1 ? i.filter(r ? (t) => r(t) % e === 0 : (t) => i.count(0, t) % e === 0) : i)), i;
}
var fS = dS(() => {}, (e, t) => {
	e.setTime(+e + t);
}, (e, t) => t - e);
fS.every = (e) => (e = Math.floor(e), !isFinite(e) || !(e > 0) ? null : e > 1 ? dS((t) => {
	t.setTime(Math.floor(t / e) * e);
}, (t, n) => {
	t.setTime(+t + n * e);
}, (t, n) => (n - t) / e) : fS), fS.range;
var pS = 1e3, mS = pS * 60, hS = mS * 60, gS = hS * 24, _S = gS * 7, vS = gS * 30, yS = gS * 365, bS = dS((e) => {
	e.setTime(e - e.getMilliseconds());
}, (e, t) => {
	e.setTime(+e + t * pS);
}, (e, t) => (t - e) / pS, (e) => e.getUTCSeconds());
bS.range;
var xS = dS((e) => {
	e.setTime(e - e.getMilliseconds() - e.getSeconds() * pS);
}, (e, t) => {
	e.setTime(+e + t * mS);
}, (e, t) => (t - e) / mS, (e) => e.getMinutes());
xS.range;
var SS = dS((e) => {
	e.setUTCSeconds(0, 0);
}, (e, t) => {
	e.setTime(+e + t * mS);
}, (e, t) => (t - e) / mS, (e) => e.getUTCMinutes());
SS.range;
var CS = dS((e) => {
	e.setTime(e - e.getMilliseconds() - e.getSeconds() * pS - e.getMinutes() * mS);
}, (e, t) => {
	e.setTime(+e + t * hS);
}, (e, t) => (t - e) / hS, (e) => e.getHours());
CS.range;
var wS = dS((e) => {
	e.setUTCMinutes(0, 0, 0);
}, (e, t) => {
	e.setTime(+e + t * hS);
}, (e, t) => (t - e) / hS, (e) => e.getUTCHours());
wS.range;
var TS = dS((e) => e.setHours(0, 0, 0, 0), (e, t) => e.setDate(e.getDate() + t), (e, t) => (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * mS) / gS, (e) => e.getDate() - 1);
TS.range;
var ES = dS((e) => {
	e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
	e.setUTCDate(e.getUTCDate() + t);
}, (e, t) => (t - e) / gS, (e) => e.getUTCDate() - 1);
ES.range;
var DS = dS((e) => {
	e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
	e.setUTCDate(e.getUTCDate() + t);
}, (e, t) => (t - e) / gS, (e) => Math.floor(e / gS));
DS.range;
function OS(e) {
	return dS((t) => {
		t.setDate(t.getDate() - (t.getDay() + 7 - e) % 7), t.setHours(0, 0, 0, 0);
	}, (e, t) => {
		e.setDate(e.getDate() + t * 7);
	}, (e, t) => (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * mS) / _S);
}
var kS = OS(0), AS = OS(1), jS = OS(2), MS = OS(3), NS = OS(4), PS = OS(5), FS = OS(6);
kS.range, AS.range, jS.range, MS.range, NS.range, PS.range, FS.range;
function IS(e) {
	return dS((t) => {
		t.setUTCDate(t.getUTCDate() - (t.getUTCDay() + 7 - e) % 7), t.setUTCHours(0, 0, 0, 0);
	}, (e, t) => {
		e.setUTCDate(e.getUTCDate() + t * 7);
	}, (e, t) => (t - e) / _S);
}
var LS = IS(0), RS = IS(1), zS = IS(2), BS = IS(3), VS = IS(4), HS = IS(5), US = IS(6);
LS.range, RS.range, zS.range, BS.range, VS.range, HS.range, US.range;
var WS = dS((e) => {
	e.setDate(1), e.setHours(0, 0, 0, 0);
}, (e, t) => {
	e.setMonth(e.getMonth() + t);
}, (e, t) => t.getMonth() - e.getMonth() + (t.getFullYear() - e.getFullYear()) * 12, (e) => e.getMonth());
WS.range;
var GS = dS((e) => {
	e.setUTCDate(1), e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
	e.setUTCMonth(e.getUTCMonth() + t);
}, (e, t) => t.getUTCMonth() - e.getUTCMonth() + (t.getUTCFullYear() - e.getUTCFullYear()) * 12, (e) => e.getUTCMonth());
GS.range;
var KS = dS((e) => {
	e.setMonth(0, 1), e.setHours(0, 0, 0, 0);
}, (e, t) => {
	e.setFullYear(e.getFullYear() + t);
}, (e, t) => t.getFullYear() - e.getFullYear(), (e) => e.getFullYear());
KS.every = (e) => !isFinite(e = Math.floor(e)) || !(e > 0) ? null : dS((t) => {
	t.setFullYear(Math.floor(t.getFullYear() / e) * e), t.setMonth(0, 1), t.setHours(0, 0, 0, 0);
}, (t, n) => {
	t.setFullYear(t.getFullYear() + n * e);
}), KS.range;
var qS = dS((e) => {
	e.setUTCMonth(0, 1), e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
	e.setUTCFullYear(e.getUTCFullYear() + t);
}, (e, t) => t.getUTCFullYear() - e.getUTCFullYear(), (e) => e.getUTCFullYear());
qS.every = (e) => !isFinite(e = Math.floor(e)) || !(e > 0) ? null : dS((t) => {
	t.setUTCFullYear(Math.floor(t.getUTCFullYear() / e) * e), t.setUTCMonth(0, 1), t.setUTCHours(0, 0, 0, 0);
}, (t, n) => {
	t.setUTCFullYear(t.getUTCFullYear() + n * e);
}), qS.range;
function JS(e, t, n, r, i, a) {
	let o = [
		[
			bS,
			1,
			pS
		],
		[
			bS,
			5,
			5 * pS
		],
		[
			bS,
			15,
			15 * pS
		],
		[
			bS,
			30,
			30 * pS
		],
		[
			a,
			1,
			mS
		],
		[
			a,
			5,
			5 * mS
		],
		[
			a,
			15,
			15 * mS
		],
		[
			a,
			30,
			30 * mS
		],
		[
			i,
			1,
			hS
		],
		[
			i,
			3,
			3 * hS
		],
		[
			i,
			6,
			6 * hS
		],
		[
			i,
			12,
			12 * hS
		],
		[
			r,
			1,
			gS
		],
		[
			r,
			2,
			2 * gS
		],
		[
			n,
			1,
			_S
		],
		[
			t,
			1,
			vS
		],
		[
			t,
			3,
			3 * vS
		],
		[
			e,
			1,
			yS
		]
	];
	function s(e, t, n) {
		let r = t < e;
		r && ([e, t] = [t, e]);
		let i = n && typeof n.range == "function" ? n : c(e, t, n), a = i ? i.range(e, +t + 1) : [];
		return r ? a.reverse() : a;
	}
	function c(t, n, r) {
		let i = Math.abs(n - t) / r, a = Cy(([, , e]) => e).right(o, i);
		if (a === o.length) return e.every(Hy(t / yS, n / yS, r));
		if (a === 0) return fS.every(Math.max(Hy(t, n, r), 1));
		let [s, c] = o[i / o[a - 1][2] < o[a][2] / i ? a - 1 : a];
		return s.every(c);
	}
	return [s, c];
}
var [YS, XS] = JS(qS, GS, LS, DS, wS, SS), [ZS, QS] = JS(KS, WS, kS, TS, CS, xS);
// node_modules/d3-time-format/dist/d3-time-format.mjs
function $S(e) {
	if (0 <= e.y && e.y < 100) {
		var t = new Date(-1, e.m, e.d, e.H, e.M, e.S, e.L);
		return t.setFullYear(e.y), t;
	}
	return new Date(e.y, e.m, e.d, e.H, e.M, e.S, e.L);
}
function eC(e) {
	if (0 <= e.y && e.y < 100) {
		var t = new Date(Date.UTC(-1, e.m, e.d, e.H, e.M, e.S, e.L));
		return t.setUTCFullYear(e.y), t;
	}
	return new Date(Date.UTC(e.y, e.m, e.d, e.H, e.M, e.S, e.L));
}
function tC(e, t, n) {
	return {
		y: e,
		m: t,
		d: n,
		H: 0,
		M: 0,
		S: 0,
		L: 0
	};
}
function nC(e) {
	var t = e.dateTime, n = e.date, r = e.time, i = e.periods, a = e.days, o = e.shortDays, s = e.months, c = e.shortMonths, l = lC(i), u = uC(i), d = lC(a), f = uC(a), p = lC(o), m = uC(o), h = lC(s), g = uC(s), _ = lC(c), v = uC(c), y = {
		a: j,
		A: ne,
		b: re,
		B: M,
		c: null,
		d: jC,
		e: jC,
		f: IC,
		g: qC,
		G: YC,
		H: MC,
		I: NC,
		j: PC,
		L: FC,
		m: LC,
		M: RC,
		p: ie,
		q: ae,
		Q: vw,
		s: yw,
		S: zC,
		u: BC,
		U: VC,
		V: UC,
		w: WC,
		W: GC,
		x: null,
		X: null,
		y: KC,
		Y: JC,
		Z: XC,
		"%": _w
	}, b = {
		a: oe,
		A: se,
		b: ce,
		B: le,
		c: null,
		d: ZC,
		e: ZC,
		f: nw,
		g: pw,
		G: hw,
		H: QC,
		I: $C,
		j: ew,
		L: tw,
		m: rw,
		M: iw,
		p: ue,
		q: de,
		Q: vw,
		s: yw,
		S: aw,
		u: ow,
		U: sw,
		V: lw,
		w: uw,
		W: dw,
		x: null,
		X: null,
		y: fw,
		Y: mw,
		Z: gw,
		"%": _w
	}, x = {
		a: E,
		A: D,
		b: O,
		B: k,
		c: ee,
		d: xC,
		e: xC,
		f: DC,
		g: _C,
		G: gC,
		H: CC,
		I: CC,
		j: SC,
		L: EC,
		m: bC,
		M: wC,
		p: T,
		q: yC,
		Q: kC,
		s: AC,
		S: TC,
		u: fC,
		U: pC,
		V: mC,
		w: dC,
		W: hC,
		x: te,
		X: A,
		y: _C,
		Y: gC,
		Z: vC,
		"%": OC
	};
	y.x = S(n, y), y.X = S(r, y), y.c = S(t, y), b.x = S(n, b), b.X = S(r, b), b.c = S(t, b);
	function S(e, t) {
		return function(n) {
			var r = [], i = -1, a = 0, o = e.length, s, c, l;
			for (n instanceof Date || (n = /* @__PURE__ */ new Date(+n)); ++i < o;) e.charCodeAt(i) === 37 && (r.push(e.slice(a, i)), (c = rC[s = e.charAt(++i)]) == null ? c = s === "e" ? " " : "0" : s = e.charAt(++i), (l = t[s]) && (s = l(n, c)), r.push(s), a = i + 1);
			return r.push(e.slice(a, i)), r.join("");
		};
	}
	function C(e, t) {
		return function(n) {
			var r = tC(1900, void 0, 1), i = w(r, e, n += "", 0), a, o;
			if (i != n.length) return null;
			if ("Q" in r) return new Date(r.Q);
			if ("s" in r) return new Date(r.s * 1e3 + ("L" in r ? r.L : 0));
			if (t && !("Z" in r) && (r.Z = 0), "p" in r && (r.H = r.H % 12 + r.p * 12), r.m === void 0 && (r.m = "q" in r ? r.q : 0), "V" in r) {
				if (r.V < 1 || r.V > 53) return null;
				"w" in r || (r.w = 1), "Z" in r ? (a = eC(tC(r.y, 0, 1)), o = a.getUTCDay(), a = o > 4 || o === 0 ? RS.ceil(a) : RS(a), a = ES.offset(a, (r.V - 1) * 7), r.y = a.getUTCFullYear(), r.m = a.getUTCMonth(), r.d = a.getUTCDate() + (r.w + 6) % 7) : (a = $S(tC(r.y, 0, 1)), o = a.getDay(), a = o > 4 || o === 0 ? AS.ceil(a) : AS(a), a = TS.offset(a, (r.V - 1) * 7), r.y = a.getFullYear(), r.m = a.getMonth(), r.d = a.getDate() + (r.w + 6) % 7);
			} else ("W" in r || "U" in r) && ("w" in r || (r.w = "u" in r ? r.u % 7 : +("W" in r)), o = "Z" in r ? eC(tC(r.y, 0, 1)).getUTCDay() : $S(tC(r.y, 0, 1)).getDay(), r.m = 0, r.d = "W" in r ? (r.w + 6) % 7 + r.W * 7 - (o + 5) % 7 : r.w + r.U * 7 - (o + 6) % 7);
			return "Z" in r ? (r.H += r.Z / 100 | 0, r.M += r.Z % 100, eC(r)) : $S(r);
		};
	}
	function w(e, t, n, r) {
		for (var i = 0, a = t.length, o = n.length, s, c; i < a;) {
			if (r >= o) return -1;
			if (s = t.charCodeAt(i++), s === 37) {
				if (s = t.charAt(i++), c = x[s in rC ? t.charAt(i++) : s], !c || (r = c(e, n, r)) < 0) return -1;
			} else if (s != n.charCodeAt(r++)) return -1;
		}
		return r;
	}
	function T(e, t, n) {
		var r = l.exec(t.slice(n));
		return r ? (e.p = u.get(r[0].toLowerCase()), n + r[0].length) : -1;
	}
	function E(e, t, n) {
		var r = p.exec(t.slice(n));
		return r ? (e.w = m.get(r[0].toLowerCase()), n + r[0].length) : -1;
	}
	function D(e, t, n) {
		var r = d.exec(t.slice(n));
		return r ? (e.w = f.get(r[0].toLowerCase()), n + r[0].length) : -1;
	}
	function O(e, t, n) {
		var r = _.exec(t.slice(n));
		return r ? (e.m = v.get(r[0].toLowerCase()), n + r[0].length) : -1;
	}
	function k(e, t, n) {
		var r = h.exec(t.slice(n));
		return r ? (e.m = g.get(r[0].toLowerCase()), n + r[0].length) : -1;
	}
	function ee(e, n, r) {
		return w(e, t, n, r);
	}
	function te(e, t, r) {
		return w(e, n, t, r);
	}
	function A(e, t, n) {
		return w(e, r, t, n);
	}
	function j(e) {
		return o[e.getDay()];
	}
	function ne(e) {
		return a[e.getDay()];
	}
	function re(e) {
		return c[e.getMonth()];
	}
	function M(e) {
		return s[e.getMonth()];
	}
	function ie(e) {
		return i[+(e.getHours() >= 12)];
	}
	function ae(e) {
		return 1 + ~~(e.getMonth() / 3);
	}
	function oe(e) {
		return o[e.getUTCDay()];
	}
	function se(e) {
		return a[e.getUTCDay()];
	}
	function ce(e) {
		return c[e.getUTCMonth()];
	}
	function le(e) {
		return s[e.getUTCMonth()];
	}
	function ue(e) {
		return i[+(e.getUTCHours() >= 12)];
	}
	function de(e) {
		return 1 + ~~(e.getUTCMonth() / 3);
	}
	return {
		format: function(e) {
			var t = S(e += "", y);
			return t.toString = function() {
				return e;
			}, t;
		},
		parse: function(e) {
			var t = C(e += "", !1);
			return t.toString = function() {
				return e;
			}, t;
		},
		utcFormat: function(e) {
			var t = S(e += "", b);
			return t.toString = function() {
				return e;
			}, t;
		},
		utcParse: function(e) {
			var t = C(e += "", !0);
			return t.toString = function() {
				return e;
			}, t;
		}
	};
}
var rC = {
	"-": "",
	_: " ",
	0: "0"
}, iC = /^\s*\d+/, aC = /^%/, oC = /[\\^$*+?|[\]().{}]/g;
function sC(e, t, n) {
	var r = e < 0 ? "-" : "", i = (r ? -e : e) + "", a = i.length;
	return r + (a < n ? Array(n - a + 1).join(t) + i : i);
}
function cC(e) {
	return e.replace(oC, "\\$&");
}
function lC(e) {
	return RegExp("^(?:" + e.map(cC).join("|") + ")", "i");
}
function uC(e) {
	return new Map(e.map((e, t) => [e.toLowerCase(), t]));
}
function dC(e, t, n) {
	var r = iC.exec(t.slice(n, n + 1));
	return r ? (e.w = +r[0], n + r[0].length) : -1;
}
function fC(e, t, n) {
	var r = iC.exec(t.slice(n, n + 1));
	return r ? (e.u = +r[0], n + r[0].length) : -1;
}
function pC(e, t, n) {
	var r = iC.exec(t.slice(n, n + 2));
	return r ? (e.U = +r[0], n + r[0].length) : -1;
}
function mC(e, t, n) {
	var r = iC.exec(t.slice(n, n + 2));
	return r ? (e.V = +r[0], n + r[0].length) : -1;
}
function hC(e, t, n) {
	var r = iC.exec(t.slice(n, n + 2));
	return r ? (e.W = +r[0], n + r[0].length) : -1;
}
function gC(e, t, n) {
	var r = iC.exec(t.slice(n, n + 4));
	return r ? (e.y = +r[0], n + r[0].length) : -1;
}
function _C(e, t, n) {
	var r = iC.exec(t.slice(n, n + 2));
	return r ? (e.y = +r[0] + (+r[0] > 68 ? 1900 : 2e3), n + r[0].length) : -1;
}
function vC(e, t, n) {
	var r = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(n, n + 6));
	return r ? (e.Z = r[1] ? 0 : -(r[2] + (r[3] || "00")), n + r[0].length) : -1;
}
function yC(e, t, n) {
	var r = iC.exec(t.slice(n, n + 1));
	return r ? (e.q = r[0] * 3 - 3, n + r[0].length) : -1;
}
function bC(e, t, n) {
	var r = iC.exec(t.slice(n, n + 2));
	return r ? (e.m = r[0] - 1, n + r[0].length) : -1;
}
function xC(e, t, n) {
	var r = iC.exec(t.slice(n, n + 2));
	return r ? (e.d = +r[0], n + r[0].length) : -1;
}
function SC(e, t, n) {
	var r = iC.exec(t.slice(n, n + 3));
	return r ? (e.m = 0, e.d = +r[0], n + r[0].length) : -1;
}
function CC(e, t, n) {
	var r = iC.exec(t.slice(n, n + 2));
	return r ? (e.H = +r[0], n + r[0].length) : -1;
}
function wC(e, t, n) {
	var r = iC.exec(t.slice(n, n + 2));
	return r ? (e.M = +r[0], n + r[0].length) : -1;
}
function TC(e, t, n) {
	var r = iC.exec(t.slice(n, n + 2));
	return r ? (e.S = +r[0], n + r[0].length) : -1;
}
function EC(e, t, n) {
	var r = iC.exec(t.slice(n, n + 3));
	return r ? (e.L = +r[0], n + r[0].length) : -1;
}
function DC(e, t, n) {
	var r = iC.exec(t.slice(n, n + 6));
	return r ? (e.L = Math.floor(r[0] / 1e3), n + r[0].length) : -1;
}
function OC(e, t, n) {
	var r = aC.exec(t.slice(n, n + 1));
	return r ? n + r[0].length : -1;
}
function kC(e, t, n) {
	var r = iC.exec(t.slice(n));
	return r ? (e.Q = +r[0], n + r[0].length) : -1;
}
function AC(e, t, n) {
	var r = iC.exec(t.slice(n));
	return r ? (e.s = +r[0], n + r[0].length) : -1;
}
function jC(e, t) {
	return sC(e.getDate(), t, 2);
}
function MC(e, t) {
	return sC(e.getHours(), t, 2);
}
function NC(e, t) {
	return sC(e.getHours() % 12 || 12, t, 2);
}
function PC(e, t) {
	return sC(1 + TS.count(KS(e), e), t, 3);
}
function FC(e, t) {
	return sC(e.getMilliseconds(), t, 3);
}
function IC(e, t) {
	return FC(e, t) + "000";
}
function LC(e, t) {
	return sC(e.getMonth() + 1, t, 2);
}
function RC(e, t) {
	return sC(e.getMinutes(), t, 2);
}
function zC(e, t) {
	return sC(e.getSeconds(), t, 2);
}
function BC(e) {
	var t = e.getDay();
	return t === 0 ? 7 : t;
}
function VC(e, t) {
	return sC(kS.count(KS(e) - 1, e), t, 2);
}
function HC(e) {
	var t = e.getDay();
	return t >= 4 || t === 0 ? NS(e) : NS.ceil(e);
}
function UC(e, t) {
	return e = HC(e), sC(NS.count(KS(e), e) + (KS(e).getDay() === 4), t, 2);
}
function WC(e) {
	return e.getDay();
}
function GC(e, t) {
	return sC(AS.count(KS(e) - 1, e), t, 2);
}
function KC(e, t) {
	return sC(e.getFullYear() % 100, t, 2);
}
function qC(e, t) {
	return e = HC(e), sC(e.getFullYear() % 100, t, 2);
}
function JC(e, t) {
	return sC(e.getFullYear() % 1e4, t, 4);
}
function YC(e, t) {
	var n = e.getDay();
	return e = n >= 4 || n === 0 ? NS(e) : NS.ceil(e), sC(e.getFullYear() % 1e4, t, 4);
}
function XC(e) {
	var t = e.getTimezoneOffset();
	return (t > 0 ? "-" : (t *= -1, "+")) + sC(t / 60 | 0, "0", 2) + sC(t % 60, "0", 2);
}
function ZC(e, t) {
	return sC(e.getUTCDate(), t, 2);
}
function QC(e, t) {
	return sC(e.getUTCHours(), t, 2);
}
function $C(e, t) {
	return sC(e.getUTCHours() % 12 || 12, t, 2);
}
function ew(e, t) {
	return sC(1 + ES.count(qS(e), e), t, 3);
}
function tw(e, t) {
	return sC(e.getUTCMilliseconds(), t, 3);
}
function nw(e, t) {
	return tw(e, t) + "000";
}
function rw(e, t) {
	return sC(e.getUTCMonth() + 1, t, 2);
}
function iw(e, t) {
	return sC(e.getUTCMinutes(), t, 2);
}
function aw(e, t) {
	return sC(e.getUTCSeconds(), t, 2);
}
function ow(e) {
	var t = e.getUTCDay();
	return t === 0 ? 7 : t;
}
function sw(e, t) {
	return sC(LS.count(qS(e) - 1, e), t, 2);
}
function cw(e) {
	var t = e.getUTCDay();
	return t >= 4 || t === 0 ? VS(e) : VS.ceil(e);
}
function lw(e, t) {
	return e = cw(e), sC(VS.count(qS(e), e) + (qS(e).getUTCDay() === 4), t, 2);
}
function uw(e) {
	return e.getUTCDay();
}
function dw(e, t) {
	return sC(RS.count(qS(e) - 1, e), t, 2);
}
function fw(e, t) {
	return sC(e.getUTCFullYear() % 100, t, 2);
}
function pw(e, t) {
	return e = cw(e), sC(e.getUTCFullYear() % 100, t, 2);
}
function mw(e, t) {
	return sC(e.getUTCFullYear() % 1e4, t, 4);
}
function hw(e, t) {
	var n = e.getUTCDay();
	return e = n >= 4 || n === 0 ? VS(e) : VS.ceil(e), sC(e.getUTCFullYear() % 1e4, t, 4);
}
function gw() {
	return "+0000";
}
function _w() {
	return "%";
}
function vw(e) {
	return +e;
}
function yw(e) {
	return Math.floor(e / 1e3);
}
var bw, xw, Sw, Cw;
ww({
	dateTime: "%x, %X",
	date: "%-m/%-d/%Y",
	time: "%-I:%M:%S %p",
	periods: ["AM", "PM"],
	days: [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday"
	],
	shortDays: [
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat"
	],
	months: [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	],
	shortMonths: [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	]
});
function ww(e) {
	return bw = nC(e), xw = bw.format, bw.parse, Sw = bw.utcFormat, Cw = bw.utcParse, bw;
}
var Tw = "%Y-%m-%dT%H:%M:%S.%LZ";
Date.prototype.toISOString || Sw(Tw), +/* @__PURE__ */ new Date("2000-01-01T00:00:00.000Z") || Cw(Tw);
// node_modules/d3-scale/dist/d3-scale.mjs
function Ew(e, t) {
	switch (arguments.length) {
		case 0: break;
		case 1:
			this.range(e);
			break;
		default: this.range(t).domain(e);
	}
	return this;
}
function Dw(e, t) {
	switch (arguments.length) {
		case 0: break;
		case 1:
			typeof e == "function" ? this.interpolator(e) : this.range(e);
			break;
		default: this.domain(e), typeof t == "function" ? this.interpolator(t) : this.range(t);
	}
	return this;
}
var Ow = Symbol("implicit");
function kw() {
	var e = new ky(), t = [], n = [], r = Ow;
	function i(i) {
		let a = e.get(i);
		if (a === void 0) {
			if (r !== Ow) return r;
			e.set(i, a = t.push(i) - 1);
		}
		return n[a % n.length];
	}
	return i.domain = function(n) {
		if (!arguments.length) return t.slice();
		t = [], e = new ky();
		for (let r of n) e.has(r) || e.set(r, t.push(r) - 1);
		return i;
	}, i.range = function(e) {
		return arguments.length ? (n = Array.from(e), i) : n.slice();
	}, i.unknown = function(e) {
		return arguments.length ? (r = e, i) : r;
	}, i.copy = function() {
		return kw(t, n).unknown(r);
	}, Ew.apply(i, arguments), i;
}
function Aw() {
	var e = kw().unknown(void 0), t = e.domain, n = e.range, r = 0, i = 1, a, o, s = !1, c = 0, l = 0, u = .5;
	delete e.unknown;
	function d() {
		var e = t().length, d = i < r, f = d ? i : r, p = d ? r : i;
		a = (p - f) / Math.max(1, e - c + l * 2), s && (a = Math.floor(a)), f += (p - f - a * (e - c)) * u, o = a * (1 - c), s && (f = Math.round(f), o = Math.round(o));
		var m = Yy(e).map(function(e) {
			return f + a * e;
		});
		return n(d ? m.reverse() : m);
	}
	return e.domain = function(e) {
		return arguments.length ? (t(e), d()) : t();
	}, e.range = function(e) {
		return arguments.length ? ([r, i] = e, r = +r, i = +i, d()) : [r, i];
	}, e.rangeRound = function(e) {
		return [r, i] = e, r = +r, i = +i, s = !0, d();
	}, e.bandwidth = function() {
		return o;
	}, e.step = function() {
		return a;
	}, e.round = function(e) {
		return arguments.length ? (s = !!e, d()) : s;
	}, e.padding = function(e) {
		return arguments.length ? (c = Math.min(1, l = +e), d()) : c;
	}, e.paddingInner = function(e) {
		return arguments.length ? (c = Math.min(1, e), d()) : c;
	}, e.paddingOuter = function(e) {
		return arguments.length ? (l = +e, d()) : l;
	}, e.align = function(e) {
		return arguments.length ? (u = Math.max(0, Math.min(1, e)), d()) : u;
	}, e.copy = function() {
		return Aw(t(), [r, i]).round(s).paddingInner(c).paddingOuter(l).align(u);
	}, Ew.apply(d(), arguments);
}
function jw(e) {
	var t = e.copy;
	return e.padding = e.paddingOuter, delete e.paddingInner, delete e.paddingOuter, e.copy = function() {
		return jw(t());
	}, e;
}
function Mw() {
	return jw(Aw.apply(null, arguments).paddingInner(1));
}
function Nw(e) {
	return function() {
		return e;
	};
}
function Pw(e) {
	return +e;
}
var Fw = [0, 1];
function Iw(e) {
	return e;
}
function Lw(e, t) {
	return (t -= e = +e) ? function(n) {
		return (n - e) / t;
	} : Nw(isNaN(t) ? NaN : .5);
}
function Rw(e, t) {
	var n;
	return e > t && (n = e, e = t, t = n), function(n) {
		return Math.max(e, Math.min(t, n));
	};
}
function zw(e, t, n) {
	var r = e[0], i = e[1], a = t[0], o = t[1];
	return i < r ? (r = Lw(i, r), a = n(o, a)) : (r = Lw(r, i), a = n(a, o)), function(e) {
		return a(r(e));
	};
}
function Bw(e, t, n) {
	var r = Math.min(e.length, t.length) - 1, i = Array(r), a = Array(r), o = -1;
	for (e[r] < e[0] && (e = e.slice().reverse(), t = t.slice().reverse()); ++o < r;) i[o] = Lw(e[o], e[o + 1]), a[o] = n(t[o], t[o + 1]);
	return function(t) {
		var n = Oy(e, t, 1, r) - 1;
		return a[n](i[n](t));
	};
}
function Vw(e, t) {
	return t.domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp()).unknown(e.unknown());
}
function Hw() {
	var e = Fw, t = Fw, n = jx, r, i, a, o = Iw, s, c, l;
	function u() {
		var n = Math.min(e.length, t.length);
		return o !== Iw && (o = Rw(e[0], e[n - 1])), s = n > 2 ? Bw : zw, c = l = null, d;
	}
	function d(i) {
		return i == null || isNaN(i = +i) ? a : (c ||= s(e.map(r), t, n))(r(o(i)));
	}
	return d.invert = function(n) {
		return o(i((l ||= s(t, e.map(r), wx))(n)));
	}, d.domain = function(t) {
		return arguments.length ? (e = Array.from(t, Pw), u()) : e.slice();
	}, d.range = function(e) {
		return arguments.length ? (t = Array.from(e), u()) : t.slice();
	}, d.rangeRound = function(e) {
		return t = Array.from(e), n = Mx, u();
	}, d.clamp = function(e) {
		return arguments.length ? (o = e ? !0 : Iw, u()) : o !== Iw;
	}, d.interpolate = function(e) {
		return arguments.length ? (n = e, u()) : n;
	}, d.unknown = function(e) {
		return arguments.length ? (a = e, d) : a;
	}, function(e, t) {
		return r = e, i = t, u();
	};
}
function Uw() {
	return Hw()(Iw, Iw);
}
function Ww(e, t, n, r) {
	var i = Hy(e, t, n), a;
	switch (r = Gx(r ?? ",f"), r.type) {
		case "s":
			var o = Math.max(Math.abs(e), Math.abs(t));
			return r.precision == null && !isNaN(a = sS(i, o)) && (r.precision = a), iS(r, o);
		case "":
		case "e":
		case "g":
		case "p":
		case "r":
			r.precision == null && !isNaN(a = cS(i, Math.max(Math.abs(e), Math.abs(t)))) && (r.precision = a - (r.type === "e"));
			break;
		case "f":
		case "%": r.precision == null && !isNaN(a = oS(i)) && (r.precision = a - (r.type === "%") * 2);
	}
	return rS(r);
}
function Gw(e) {
	var t = e.domain;
	return e.ticks = function(e) {
		var n = t();
		return By(n[0], n[n.length - 1], e ?? 10);
	}, e.tickFormat = function(e, n) {
		var r = t();
		return Ww(r[0], r[r.length - 1], e ?? 10, n);
	}, e.nice = function(n) {
		n ??= 10;
		var r = t(), i = 0, a = r.length - 1, o = r[i], s = r[a], c, l, u = 10;
		for (s < o && (l = o, o = s, s = l, l = i, i = a, a = l); u-- > 0;) {
			if (l = Vy(o, s, n), l === c) return r[i] = o, r[a] = s, t(r);
			if (l > 0) o = Math.floor(o / l) * l, s = Math.ceil(s / l) * l;
			else if (l < 0) o = Math.ceil(o * l) / l, s = Math.floor(s * l) / l;
			else break;
			c = l;
		}
		return e;
	}, e;
}
function Kw() {
	var e = Uw();
	return e.copy = function() {
		return Vw(e, Kw());
	}, Ew.apply(e, arguments), Gw(e);
}
function qw(e) {
	var t;
	function n(e) {
		return e == null || isNaN(e = +e) ? t : e;
	}
	return n.invert = n, n.domain = n.range = function(t) {
		return arguments.length ? (e = Array.from(t, Pw), n) : e.slice();
	}, n.unknown = function(e) {
		return arguments.length ? (t = e, n) : t;
	}, n.copy = function() {
		return qw(e).unknown(t);
	}, e = arguments.length ? Array.from(e, Pw) : [0, 1], Gw(n);
}
function Jw(e, t) {
	e = e.slice();
	var n = 0, r = e.length - 1, i = e[n], a = e[r], o;
	return a < i && (o = n, n = r, r = o, o = i, i = a, a = o), e[n] = t.floor(i), e[r] = t.ceil(a), e;
}
function Yw(e) {
	return Math.log(e);
}
function Xw(e) {
	return Math.exp(e);
}
function Zw(e) {
	return -Math.log(-e);
}
function Qw(e) {
	return -Math.exp(-e);
}
function $w(e) {
	return isFinite(e) ? +("1e" + e) : e < 0 ? 0 : e;
}
function eT(e) {
	return e === 10 ? $w : e === Math.E ? Math.exp : (t) => e ** +t;
}
function tT(e) {
	return e === Math.E ? Math.log : e === 10 && Math.log10 || e === 2 && Math.log2 || (e = Math.log(e), (t) => Math.log(t) / e);
}
function nT(e) {
	return (t, n) => -e(-t, n);
}
function rT(e) {
	let t = e(Yw, Xw), n = t.domain, r = 10, i, a;
	function o() {
		return i = tT(r), a = eT(r), n()[0] < 0 ? (i = nT(i), a = nT(a), e(Zw, Qw)) : e(Yw, Xw), t;
	}
	return t.base = function(e) {
		return arguments.length ? (r = +e, o()) : r;
	}, t.domain = function(e) {
		return arguments.length ? (n(e), o()) : n();
	}, t.ticks = (e) => {
		let t = n(), o = t[0], s = t[t.length - 1], c = s < o;
		c && ([o, s] = [s, o]);
		let l = i(o), u = i(s), d, f, p = e == null ? 10 : +e, m = [];
		if (!(r % 1) && u - l < p) {
			if (l = Math.floor(l), u = Math.ceil(u), o > 0) {
				for (; l <= u; ++l) for (d = 1; d < r; ++d) if (f = l < 0 ? d / a(-l) : d * a(l), !(f < o)) {
					if (f > s) break;
					m.push(f);
				}
			} else for (; l <= u; ++l) for (d = r - 1; d >= 1; --d) if (f = l > 0 ? d / a(-l) : d * a(l), !(f < o)) {
				if (f > s) break;
				m.push(f);
			}
			m.length * 2 < p && (m = By(o, s, p));
		} else m = By(l, u, Math.min(u - l, p)).map(a);
		return c ? m.reverse() : m;
	}, t.tickFormat = (e, n) => {
		if (e ??= 10, n ??= r === 10 ? "s" : ",", typeof n != "function" && (!(r % 1) && (n = Gx(n)).precision == null && (n.trim = !0), n = rS(n)), e === 1e400) return n;
		let o = Math.max(1, r * e / t.ticks().length);
		return (e) => {
			let t = e / a(Math.round(i(e)));
			return t * r < r - .5 && (t *= r), t <= o ? n(e) : "";
		};
	}, t.nice = () => n(Jw(n(), {
		floor: (e) => a(Math.floor(i(e))),
		ceil: (e) => a(Math.ceil(i(e)))
	})), t;
}
function iT() {
	let e = rT(Hw()).domain([1, 10]);
	return e.copy = () => Vw(e, iT()).base(e.base()), Ew.apply(e, arguments), e;
}
function aT(e) {
	return function(t) {
		return Math.sign(t) * Math.log1p(Math.abs(t / e));
	};
}
function oT(e) {
	return function(t) {
		return Math.sign(t) * Math.expm1(Math.abs(t)) * e;
	};
}
function sT(e) {
	var t = 1, n = e(aT(t), oT(t));
	return n.constant = function(n) {
		return arguments.length ? e(aT(t = +n), oT(t)) : t;
	}, Gw(n);
}
function cT() {
	var e = sT(Hw());
	return e.copy = function() {
		return Vw(e, cT()).constant(e.constant());
	}, Ew.apply(e, arguments);
}
function lT(e) {
	return function(t) {
		return t < 0 ? -((-t) ** +e) : t ** +e;
	};
}
function uT(e) {
	return e < 0 ? -Math.sqrt(-e) : Math.sqrt(e);
}
function dT(e) {
	return e < 0 ? -e * e : e * e;
}
function fT(e) {
	var t = e(Iw, Iw), n = 1;
	function r() {
		return n === 1 ? e(Iw, Iw) : n === .5 ? e(uT, dT) : e(lT(n), lT(1 / n));
	}
	return t.exponent = function(e) {
		return arguments.length ? (n = +e, r()) : n;
	}, Gw(t);
}
function pT() {
	var e = fT(Hw());
	return e.copy = function() {
		return Vw(e, pT()).exponent(e.exponent());
	}, Ew.apply(e, arguments), e;
}
function mT() {
	return pT.apply(null, arguments).exponent(.5);
}
function hT(e) {
	return Math.sign(e) * e * e;
}
function gT(e) {
	return Math.sign(e) * Math.sqrt(Math.abs(e));
}
function _T() {
	var e = Uw(), t = [0, 1], n = !1, r;
	function i(t) {
		var i = gT(e(t));
		return isNaN(i) ? r : n ? Math.round(i) : i;
	}
	return i.invert = function(t) {
		return e.invert(hT(t));
	}, i.domain = function(t) {
		return arguments.length ? (e.domain(t), i) : e.domain();
	}, i.range = function(n) {
		return arguments.length ? (e.range((t = Array.from(n, Pw)).map(hT)), i) : t.slice();
	}, i.rangeRound = function(e) {
		return i.range(e).round(!0);
	}, i.round = function(e) {
		return arguments.length ? (n = !!e, i) : n;
	}, i.clamp = function(t) {
		return arguments.length ? (e.clamp(t), i) : e.clamp();
	}, i.unknown = function(e) {
		return arguments.length ? (r = e, i) : r;
	}, i.copy = function() {
		return _T(e.domain(), t).round(n).clamp(e.clamp()).unknown(r);
	}, Ew.apply(i, arguments), Gw(i);
}
function vT() {
	var e = [], t = [], n = [], r;
	function i() {
		var r = 0, i = Math.max(1, t.length);
		for (n = Array(i - 1); ++r < i;) n[r - 1] = Jy(e, r / i);
		return a;
	}
	function a(e) {
		return e == null || isNaN(e = +e) ? r : t[Oy(n, e)];
	}
	return a.invertExtent = function(r) {
		var i = t.indexOf(r);
		return i < 0 ? [NaN, NaN] : [i > 0 ? n[i - 1] : e[0], i < n.length ? n[i] : e[e.length - 1]];
	}, a.domain = function(t) {
		if (!arguments.length) return e.slice();
		e = [];
		for (let n of t) n != null && !isNaN(n = +n) && e.push(n);
		return e.sort(xy), i();
	}, a.range = function(e) {
		return arguments.length ? (t = Array.from(e), i()) : t.slice();
	}, a.unknown = function(e) {
		return arguments.length ? (r = e, a) : r;
	}, a.quantiles = function() {
		return n.slice();
	}, a.copy = function() {
		return vT().domain(e).range(t).unknown(r);
	}, Ew.apply(a, arguments);
}
function yT() {
	var e = 0, t = 1, n = 1, r = [.5], i = [0, 1], a;
	function o(e) {
		return e != null && e <= e ? i[Oy(r, e, 0, n)] : a;
	}
	function s() {
		var i = -1;
		for (r = Array(n); ++i < n;) r[i] = ((i + 1) * t - (i - n) * e) / (n + 1);
		return o;
	}
	return o.domain = function(n) {
		return arguments.length ? ([e, t] = n, e = +e, t = +t, s()) : [e, t];
	}, o.range = function(e) {
		return arguments.length ? (n = (i = Array.from(e)).length - 1, s()) : i.slice();
	}, o.invertExtent = function(a) {
		var o = i.indexOf(a);
		return o < 0 ? [NaN, NaN] : o < 1 ? [e, r[0]] : o >= n ? [r[n - 1], t] : [r[o - 1], r[o]];
	}, o.unknown = function(e) {
		return arguments.length && (a = e), o;
	}, o.thresholds = function() {
		return r.slice();
	}, o.copy = function() {
		return yT().domain([e, t]).range(i).unknown(a);
	}, Ew.apply(Gw(o), arguments);
}
function bT() {
	var e = [.5], t = [0, 1], n, r = 1;
	function i(i) {
		return i != null && i <= i ? t[Oy(e, i, 0, r)] : n;
	}
	return i.domain = function(n) {
		return arguments.length ? (e = Array.from(n), r = Math.min(e.length, t.length - 1), i) : e.slice();
	}, i.range = function(n) {
		return arguments.length ? (t = Array.from(n), r = Math.min(e.length, t.length - 1), i) : t.slice();
	}, i.invertExtent = function(n) {
		var r = t.indexOf(n);
		return [e[r - 1], e[r]];
	}, i.unknown = function(e) {
		return arguments.length ? (n = e, i) : n;
	}, i.copy = function() {
		return bT().domain(e).range(t).unknown(n);
	}, Ew.apply(i, arguments);
}
function xT(e) {
	return new Date(e);
}
function ST(e) {
	return e instanceof Date ? +e : Math.round(e);
}
function CT(e, t, n, r, i, a, o, s, c, l) {
	var u = Uw(), d = u.invert, f = u.domain, p = l(".%L"), m = l(":%S"), h = l("%I:%M"), g = l("%I %p"), _ = l("%a %d"), v = l("%b %d"), y = l("%B"), b = l("%Y");
	function x(e) {
		return (c(e) < e ? p : s(e) < e ? m : o(e) < e ? h : a(e) < e ? g : r(e) < e ? i(e) < e ? _ : v : n(e) < e ? y : b)(e);
	}
	return u.invert = function(e) {
		return new Date(Math.round(d(e)));
	}, u.domain = function(e) {
		return arguments.length ? f(Array.from(e, ST)) : f().map(xT);
	}, u.ticks = function(t) {
		var n = f();
		return e(n[0], n[n.length - 1], t ?? 10);
	}, u.tickFormat = function(e, t) {
		return t == null ? x : l(t);
	}, u.nice = function(e) {
		var n = f();
		return e && typeof e.range == "function" || (e = t(n[0], n[n.length - 1], e ?? 10)), e ? f(Jw(n, e)) : u;
	}, u.copy = function() {
		return Vw(u, CT(e, t, n, r, i, a, o, s, c, l));
	}, u;
}
function wT() {
	return Ew.apply(CT(ZS, QS, KS, WS, kS, TS, CS, xS, bS, xw).domain([new Date(2e3, 0, 1), new Date(2e3, 0, 2)]), arguments);
}
function TT() {
	return Ew.apply(CT(YS, XS, qS, GS, LS, ES, wS, SS, bS, Sw).domain([Date.UTC(2e3, 0, 1), Date.UTC(2e3, 0, 2)]), arguments);
}
function ET() {
	var e = 0, t = 1, n, r, i, a, o = Iw, s = !1, c;
	function l(e) {
		return e == null || isNaN(e = +e) ? c : o(i === 0 ? .5 : (e = (a(e) - n) * i, s ? Math.max(0, Math.min(1, e)) : e));
	}
	l.domain = function(o) {
		return arguments.length ? ([e, t] = o, n = a(e = +e), r = a(t = +t), i = n === r ? 0 : 1 / (r - n), l) : [e, t];
	}, l.clamp = function(e) {
		return arguments.length ? (s = !!e, l) : s;
	}, l.interpolator = function(e) {
		return arguments.length ? (o = e, l) : o;
	};
	function u(e) {
		return function(t) {
			var n, r;
			return arguments.length ? ([n, r] = t, o = e(n, r), l) : [o(0), o(1)];
		};
	}
	return l.range = u(jx), l.rangeRound = u(Mx), l.unknown = function(e) {
		return arguments.length ? (c = e, l) : c;
	}, function(o) {
		return a = o, n = o(e), r = o(t), i = n === r ? 0 : 1 / (r - n), l;
	};
}
function DT(e, t) {
	return t.domain(e.domain()).interpolator(e.interpolator()).clamp(e.clamp()).unknown(e.unknown());
}
function OT() {
	var e = Gw(ET()(Iw));
	return e.copy = function() {
		return DT(e, OT());
	}, Dw.apply(e, arguments);
}
function kT() {
	var e = rT(ET()).domain([1, 10]);
	return e.copy = function() {
		return DT(e, kT()).base(e.base());
	}, Dw.apply(e, arguments);
}
function AT() {
	var e = sT(ET());
	return e.copy = function() {
		return DT(e, AT()).constant(e.constant());
	}, Dw.apply(e, arguments);
}
function jT() {
	var e = fT(ET());
	return e.copy = function() {
		return DT(e, jT()).exponent(e.exponent());
	}, Dw.apply(e, arguments);
}
function MT() {
	return jT.apply(null, arguments).exponent(.5);
}
function NT() {
	var e = [], t = Iw;
	function n(n) {
		if (n != null && !isNaN(n = +n)) return t((Oy(e, n, 1) - 1) / (e.length - 1));
	}
	return n.domain = function(t) {
		if (!arguments.length) return e.slice();
		e = [];
		for (let n of t) n != null && !isNaN(n = +n) && e.push(n);
		return e.sort(xy), n;
	}, n.interpolator = function(e) {
		return arguments.length ? (t = e, n) : t;
	}, n.range = function() {
		return e.map((n, r) => t(r / (e.length - 1)));
	}, n.quantiles = function(t) {
		return Array.from({ length: t + 1 }, (n, r) => qy(e, r / t));
	}, n.copy = function() {
		return NT(t).domain(e);
	}, Dw.apply(n, arguments);
}
function PT() {
	var e = 0, t = .5, n = 1, r = 1, i, a, o, s, c, l = Iw, u, d = !1, f;
	function p(e) {
		return e == null || isNaN(e = +e) ? f : (e = .5 + ((e = +u(e)) - a) * (r * e < r * a ? s : c), l(d ? Math.max(0, Math.min(1, e)) : e));
	}
	p.domain = function(l) {
		return arguments.length ? ([e, t, n] = l, i = u(e = +e), a = u(t = +t), o = u(n = +n), s = i === a ? 0 : .5 / (a - i), c = a === o ? 0 : .5 / (o - a), r = a < i ? -1 : 1, p) : [
			e,
			t,
			n
		];
	}, p.clamp = function(e) {
		return arguments.length ? (d = !!e, p) : d;
	}, p.interpolator = function(e) {
		return arguments.length ? (l = e, p) : l;
	};
	function m(e) {
		return function(t) {
			var n, r, i;
			return arguments.length ? ([n, r, i] = t, l = Rx(e, [
				n,
				r,
				i
			]), p) : [
				l(0),
				l(.5),
				l(1)
			];
		};
	}
	return p.range = m(jx), p.rangeRound = m(Mx), p.unknown = function(e) {
		return arguments.length ? (f = e, p) : f;
	}, function(l) {
		return u = l, i = l(e), a = l(t), o = l(n), s = i === a ? 0 : .5 / (a - i), c = a === o ? 0 : .5 / (o - a), r = a < i ? -1 : 1, p;
	};
}
function FT() {
	var e = Gw(PT()(Iw));
	return e.copy = function() {
		return DT(e, FT());
	}, Dw.apply(e, arguments);
}
function IT() {
	var e = rT(PT()).domain([
		.1,
		1,
		10
	]);
	return e.copy = function() {
		return DT(e, IT()).base(e.base());
	}, Dw.apply(e, arguments);
}
function LT() {
	var e = sT(PT());
	return e.copy = function() {
		return DT(e, LT()).constant(e.constant());
	}, Dw.apply(e, arguments);
}
function RT() {
	var e = fT(PT());
	return e.copy = function() {
		return DT(e, RT()).exponent(e.exponent());
	}, Dw.apply(e, arguments);
}
function zT() {
	return RT.apply(null, arguments).exponent(.5);
}
// node_modules/victory-vendor/es/d3-scale.js
var BT = /* @__PURE__ */ s({
	scaleBand: () => Aw,
	scaleDiverging: () => FT,
	scaleDivergingLog: () => IT,
	scaleDivergingPow: () => RT,
	scaleDivergingSqrt: () => zT,
	scaleDivergingSymlog: () => LT,
	scaleIdentity: () => qw,
	scaleImplicit: () => Ow,
	scaleLinear: () => Kw,
	scaleLog: () => iT,
	scaleOrdinal: () => kw,
	scalePoint: () => Mw,
	scalePow: () => pT,
	scaleQuantile: () => vT,
	scaleQuantize: () => yT,
	scaleRadial: () => _T,
	scaleSequential: () => OT,
	scaleSequentialLog: () => kT,
	scaleSequentialPow: () => jT,
	scaleSequentialQuantile: () => NT,
	scaleSequentialSqrt: () => MT,
	scaleSequentialSymlog: () => AT,
	scaleSqrt: () => mT,
	scaleSymlog: () => cT,
	scaleThreshold: () => bT,
	scaleTime: () => wT,
	scaleUtc: () => TT,
	tickFormat: () => Ww
});
// node_modules/recharts/es6/state/selectors/combiners/combineConfiguredScale.js
function VT(e) {
	if (e in BT) return BT[e]();
	var t = `scale${_s(e)}`;
	if (t in BT) return BT[t]();
}
function HT(e, t, n) {
	if (typeof e == "function") return e.copy().domain(t).range(n);
	if (e != null) {
		var r = VT(e);
		if (r != null) return r.domain(t).range(n), r;
	}
}
function UT(e, t, n, r) {
	if (n != null && r != null) return typeof e.scale == "function" ? HT(e.scale, n, r) : HT(t, n, r);
}
// node_modules/recharts/es6/state/selectors/combiners/combineRealScaleType.js
function WT(e) {
	return `scale${_s(e)}`;
}
function GT(e) {
	return WT(e) in BT;
}
var KT = (e, t, n) => {
	if (e != null) {
		var { scale: r, type: i } = e;
		if (r === "auto") return i === "category" && n && (n.indexOf("LineChart") >= 0 || n.indexOf("AreaChart") >= 0 || n.indexOf("ComposedChart") >= 0 && !t) ? "point" : i === "category" ? "band" : "linear";
		if (typeof r == "string") return GT(r) ? r : "point";
	}
};
// node_modules/recharts/es6/util/scale/createCategoricalInverse.js
function qT(e, t) {
	for (var n = 0, r = e.length, i = e[0] < e[e.length - 1]; n < r;) {
		var a = Math.floor((n + r) / 2);
		(i ? e[a] < t : e[a] > t) ? n = a + 1 : r = a;
	}
	return n;
}
function JT(e, t) {
	if (e) {
		var n = t ?? e.domain(), r = n.map((t) => e(t) ?? 0), i = e.range();
		if (!(n.length === 0 || i.length < 2)) return (e) => {
			var t = qT(r, e);
			if (t <= 0) return n[0];
			if (t >= n.length) return n[n.length - 1];
			var i = r[t - 1] ?? 0, a = r[t] ?? 0;
			return Math.abs(e - i) <= Math.abs(e - a) ? n[t - 1] : n[t];
		};
	}
}
// node_modules/recharts/es6/state/selectors/combiners/combineInverseScaleFunction.js
function YT(e) {
	if (e != null) return "invert" in e && typeof e.invert == "function" ? e.invert.bind(e) : JT(e, void 0);
}
// node_modules/recharts/es6/state/selectors/axisSelectors.js
function XT(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function ZT(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? XT(Object(n), !0).forEach(function(t) {
			QT(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : XT(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function QT(e, t, n) {
	return (t = $T(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function $T(e) {
	var t = eE(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function eE(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var tE = [0, "auto"], nE = {
	allowDataOverflow: !1,
	allowDecimals: !0,
	allowDuplicatedCategory: !0,
	angle: 0,
	dataKey: void 0,
	domain: void 0,
	height: 30,
	hide: !0,
	id: 0,
	includeHidden: !1,
	interval: "preserveEnd",
	minTickGap: 5,
	mirror: !1,
	name: void 0,
	orientation: "bottom",
	padding: {
		left: 0,
		right: 0
	},
	reversed: !1,
	scale: "auto",
	tick: !0,
	tickCount: 5,
	tickFormatter: void 0,
	ticks: void 0,
	type: "category",
	unit: void 0,
	niceTicks: "auto"
}, rE = (e, t) => e.cartesianAxis.xAxis[t], iE = (e, t) => rE(e, t) ?? nE, aE = {
	allowDataOverflow: !1,
	allowDecimals: !0,
	allowDuplicatedCategory: !0,
	angle: 0,
	dataKey: void 0,
	domain: tE,
	hide: !0,
	id: 0,
	includeHidden: !1,
	interval: "preserveEnd",
	minTickGap: 5,
	mirror: !1,
	name: void 0,
	orientation: "left",
	padding: {
		top: 0,
		bottom: 0
	},
	reversed: !1,
	scale: "auto",
	tick: !0,
	tickCount: 5,
	tickFormatter: void 0,
	ticks: void 0,
	type: "number",
	unit: void 0,
	niceTicks: "auto",
	width: 60
}, oE = (e, t) => e.cartesianAxis.yAxis[t], sE = (e, t) => oE(e, t) ?? aE, cE = {
	domain: [0, "auto"],
	includeHidden: !1,
	reversed: !1,
	allowDataOverflow: !1,
	allowDuplicatedCategory: !1,
	dataKey: void 0,
	id: 0,
	name: "",
	range: [64, 64],
	scale: "auto",
	type: "number",
	unit: ""
}, lE = (e, t) => e.cartesianAxis.zAxis[t] ?? cE, uE = (e, t, n) => {
	switch (t) {
		case "xAxis": return iE(e, n);
		case "yAxis": return sE(e, n);
		case "zAxis": return lE(e, n);
		case "angleAxis": return ey(e, n);
		case "radiusAxis": return ty(e, n);
		default: throw Error(`Unexpected axis type: ${t}`);
	}
}, dE = (e, t, n) => {
	switch (t) {
		case "xAxis": return iE(e, n);
		case "yAxis": return sE(e, n);
		default: throw Error(`Unexpected axis type: ${t}`);
	}
}, fE = (e, t, n) => {
	switch (t) {
		case "xAxis": return iE(e, n);
		case "yAxis": return sE(e, n);
		case "angleAxis": return ey(e, n);
		case "radiusAxis": return ty(e, n);
		default: throw Error(`Unexpected axis type: ${t}`);
	}
}, pE = (e) => e.graphicalItems.cartesianItems.some((e) => e.type === "bar") || e.graphicalItems.polarItems.some((e) => e.type === "radialBar");
function mE(e, t) {
	return (n) => {
		switch (e) {
			case "xAxis": return "xAxisId" in n && n.xAxisId === t;
			case "yAxis": return "yAxisId" in n && n.yAxisId === t;
			case "zAxis": return "zAxisId" in n && n.zAxisId === t;
			case "angleAxis": return "angleAxisId" in n && n.angleAxisId === t;
			case "radiusAxis": return "radiusAxisId" in n && n.radiusAxisId === t;
			default: return !1;
		}
	};
}
var hE = (e) => e.graphicalItems.cartesianItems, gE = K([ly, uy], mE), _E = (e, t, n) => e.filter(n).filter((e) => t?.includeHidden === !0 || !e.hide), vE = K([
	hE,
	uE,
	gE
], _E, { memoizeOptions: { resultEqualityCheck: hy } }), yE = K([vE], (e) => e.filter((e) => e.type === "area" || e.type === "bar").filter(py)), bE = (e) => e.filter((e) => !("stackId" in e) || e.stackId === void 0), xE = K([vE], bE), SE = (e) => e.map((e) => e.data).filter(Boolean).flat(1), CE = K([vE], SE, { memoizeOptions: { resultEqualityCheck: hy } }), wE = (e, t) => {
	var { chartData: n = [], dataStartIndex: r, dataEndIndex: i } = t;
	return e.length > 0 ? e : n.slice(r, i + 1);
}, TE = K([CE, xv], wE), EE = (e, t, n) => t?.dataKey == null ? n.length > 0 ? n.map((e) => e.dataKey).flatMap((t) => e.map((e) => ({ value: Bf(e, t) }))) : e.map((e) => ({ value: e })) : e.map((e) => ({ value: Bf(e, t.dataKey) })), DE = K([
	TE,
	uE,
	vE
], EE);
function OE(e) {
	if (ls(e) || e instanceof Date) {
		var t = Number(e);
		if (X(t)) return t;
	}
}
function kE(e) {
	if (Array.isArray(e)) {
		var t = [OE(e[0]), OE(e[1])];
		return Sv(t) ? t : void 0;
	}
	var n = OE(e);
	if (n != null) return [n, n];
}
function AE(e) {
	return e.map(OE).filter(vs);
}
function jE(e, t) {
	var n = OE(e), r = OE(t);
	return n == null && r == null ? 0 : n == null ? -1 : r == null ? 1 : n - r;
}
var ME = K([DE], (e) => e?.map((e) => e.value).sort(jE));
function NE(e, t) {
	switch (e) {
		case "xAxis": return t.direction === "x";
		case "yAxis": return t.direction === "y";
		default: return !1;
	}
}
function PE(e, t, n) {
	return !n || typeof t != "number" || ss(t) || !n.length ? [] : AE(n.flatMap((n) => {
		var r = Bf(e, n.dataKey), i, a;
		if (Array.isArray(r) ? [i, a] = r : i = a = r, X(i) && X(a)) return [t - i, t + a];
	}));
}
var FE = (e) => fE(e, _y(e), vy(e)), IE = K([FE], (e) => e?.dataKey), LE = K([
	yE,
	xv,
	FE
], fy), RE = (e, t, n, r) => {
	var i = t.reduce((e, t) => {
		if (t.stackId == null) return e;
		var n = e[t.stackId];
		return n ??= [], n.push(t), e[t.stackId] = n, e;
	}, {});
	return Object.fromEntries(Object.entries(i).map((t) => {
		var [i, a] = t, o = r ? [...a].reverse() : a;
		return [i, {
			stackedData: Gf(e, o.map(dy), n),
			graphicalItems: o
		}];
	}));
}, zE = K([
	LE,
	yE,
	Iv,
	Lv
], RE), BE = (e, t, n, r) => {
	var { dataStartIndex: i, dataEndIndex: a } = t;
	if (r == null && n !== "zAxis") {
		var o = Yf(e, i, a);
		if (o == null || o[0] !== 0 || o[1] !== 0) return o;
	}
}, VE = K([uE], (e) => e.allowDataOverflow), HE = (e) => {
	if (e == null || !("domain" in e)) return tE;
	if (e.domain != null) return e.domain;
	if ("ticks" in e && e.ticks != null) {
		if (e.type === "number") {
			var t = AE(e.ticks);
			return [Math.min(...t), Math.max(...t)];
		}
		if (e.type === "category") return e.ticks.map(String);
	}
	return e?.domain ?? tE;
}, UE = K([uE], HE), WE = K([UE, VE], wv), GE = K([
	zE,
	yv,
	ly,
	WE
], BE, { memoizeOptions: { resultEqualityCheck: my } }), KE = (e) => e.errorBars, qE = (e, t, n) => e.flatMap((e) => t[e.id]).filter(Boolean).filter((e) => NE(n, e)), JE = function() {
	var e = [...arguments].filter(Boolean);
	if (e.length !== 0) {
		var t = e.flat();
		return [Math.min(...t), Math.max(...t)];
	}
}, YE = (e, t, n, r, i) => {
	var a, o;
	if (n.length > 0 && e.forEach((e) => {
		n.forEach((n) => {
			var s = r[n.id]?.filter((e) => NE(i, e)), c = Bf(e, t.dataKey ?? n.dataKey), l = PE(e, c, s);
			if (l.length >= 2) {
				var u = Math.min(...l), d = Math.max(...l);
				(a == null || u < a) && (a = u), (o == null || d > o) && (o = d);
			}
			var f = kE(c);
			f != null && (a = a == null ? f[0] : Math.min(a, f[0]), o = o == null ? f[1] : Math.max(o, f[1]));
		});
	}), t?.dataKey != null && e.forEach((e) => {
		var n = kE(Bf(e, t.dataKey));
		n != null && (a = a == null ? n[0] : Math.min(a, n[0]), o = o == null ? n[1] : Math.max(o, n[1]));
	}), X(a) && X(o)) return [a, o];
}, XE = K([
	TE,
	uE,
	xE,
	KE,
	ly
], YE, { memoizeOptions: { resultEqualityCheck: my } });
function ZE(e) {
	var { value: t } = e;
	if (ls(t) || t instanceof Date) return t;
}
var QE = (e, t, n) => {
	var r = e.map(ZE).filter((e) => e != null);
	return n && (t.dataKey == null || t.allowDuplicatedCategory && ps(r)) ? vv(0, e.length) : t.allowDuplicatedCategory ? r : Array.from(new Set(r));
}, $E = (e) => e.referenceElements.dots, eD = (e, t, n) => e.filter((e) => e.ifOverflow === "extendDomain").filter((e) => t === "xAxis" ? e.xAxisId === n : e.yAxisId === n), tD = K([
	$E,
	ly,
	uy
], eD), nD = (e) => e.referenceElements.areas, rD = K([
	nD,
	ly,
	uy
], eD), iD = (e) => e.referenceElements.lines, aD = K([
	iD,
	ly,
	uy
], eD), oD = (e, t) => {
	if (e != null) {
		var n = AE(e.map((e) => t === "xAxis" ? e.x : e.y));
		if (n.length !== 0) return [Math.min(...n), Math.max(...n)];
	}
}, sD = K(tD, ly, oD), cD = (e, t) => {
	if (e != null) {
		var n = AE(e.flatMap((e) => [t === "xAxis" ? e.x1 : e.y1, t === "xAxis" ? e.x2 : e.y2]));
		if (n.length !== 0) return [Math.min(...n), Math.max(...n)];
	}
}, lD = K([rD, ly], cD);
function uD(e) {
	if (e.x != null) return AE([e.x]);
	var t = e.segment?.map((e) => e.x);
	return t == null || t.length === 0 ? [] : AE(t);
}
function dD(e) {
	if (e.y != null) return AE([e.y]);
	var t = e.segment?.map((e) => e.y);
	return t == null || t.length === 0 ? [] : AE(t);
}
var fD = (e, t) => {
	if (e != null) {
		var n = e.flatMap((e) => t === "xAxis" ? uD(e) : dD(e));
		if (n.length !== 0) return [Math.min(...n), Math.max(...n)];
	}
}, pD = K(sD, K([aD, ly], fD), lD, (e, t, n) => JE(e, n, t)), mD = (e, t, n, r, i, a, o, s) => n ?? Tv(t, o === "vertical" && s === "xAxis" || o === "horizontal" && s === "yAxis" ? JE(r, a, i) : JE(a, i), e.allowDataOverflow), hD = K([
	uE,
	UE,
	WE,
	GE,
	XE,
	pD,
	rm,
	ly
], mD, { memoizeOptions: { resultEqualityCheck: my } }), gD = [0, 1], _D = (e, t, n, r, i, a, o) => {
	if (e != null && n != null && n.length !== 0 || o !== void 0) {
		var { dataKey: s, type: c } = e, l = Hf(t, a);
		return l && s == null ? vv(0, n?.length ?? 0) : c === "category" ? QE(r, e, l) : i === "expand" ? gD : o;
	}
}, vD = K([
	uE,
	rm,
	TE,
	DE,
	Iv,
	ly,
	hD
], _D), yD = K([
	uE,
	pE,
	Rv
], KT), bD = (e, t, n) => {
	var { niceTicks: r } = t;
	if (r !== "none") {
		var i = HE(t), a = Array.isArray(i) && (i[0] === "auto" || i[1] === "auto");
		if ((r === "snap125" || r === "adaptive") && t != null && t.tickCount && Sv(e)) {
			if (a) return Nv(e, t.tickCount, t.allowDecimals, r);
			if (t.type === "number") return Pv(e, t.tickCount, t.allowDecimals, r);
		}
		if (r === "auto" && n === "linear" && t != null && t.tickCount) {
			if (a && Sv(e)) return Nv(e, t.tickCount, t.allowDecimals, "adaptive");
			if (t.type === "number" && Sv(e)) return Pv(e, t.tickCount, t.allowDecimals, "adaptive");
		}
	}
}, xD = K([
	vD,
	fE,
	yD
], bD), SD = (e, t, n, r) => {
	if (r !== "angleAxis" && e?.type === "number" && Sv(t) && Array.isArray(n) && n.length > 0) {
		var i = t[0], a = n[0] ?? 0, o = t[1], s = n[n.length - 1] ?? 0;
		return [Math.min(i, a), Math.max(o, s)];
	}
	return t;
}, CD = K([
	uE,
	vD,
	xD,
	ly
], SD), wD = K(K(DE, uE, (e, t) => {
	if (t && t.type === "number") {
		var n = 1e400, r = Array.from(AE(e.map((e) => e.value))).sort((e, t) => e - t), i = r[0], a = r[r.length - 1];
		if (i == null || a == null) return 1e400;
		var o = a - i;
		if (o === 0) return 1e400;
		for (var s = 0; s < r.length - 1; s++) {
			var c = r[s], l = r[s + 1];
			if (c != null && l != null) {
				var u = l - c;
				n = Math.min(n, u);
			}
		}
		return n / o;
	}
}), rm, Fv, bp, (e, t, n, r, i) => i, (e, t, n, r, i) => {
	if (!X(e)) return 0;
	var a = t === "vertical" ? r.height : r.width;
	if (i === "gap") return e * a / 2;
	if (i === "no-gap") {
		var o = fs(n, e * a), s = e * a / 2;
		return s - o - (s - o) / a * o;
	}
	return 0;
}), TD = (e, t, n) => {
	var r = iE(e, t);
	return r == null || typeof r.padding != "string" ? 0 : wD(e, "xAxis", t, n, r.padding);
}, ED = (e, t, n) => {
	var r = sE(e, t);
	return r == null || typeof r.padding != "string" ? 0 : wD(e, "yAxis", t, n, r.padding);
}, DD = K(iE, TD, (e, t) => {
	if (e == null) return {
		left: 0,
		right: 0
	};
	var { padding: n } = e;
	return typeof n == "string" ? {
		left: t,
		right: t
	} : {
		left: (n.left ?? 0) + t,
		right: (n.right ?? 0) + t
	};
}), OD = K(sE, ED, (e, t) => {
	if (e == null) return {
		top: 0,
		bottom: 0
	};
	var { padding: n } = e;
	return typeof n == "string" ? {
		top: t,
		bottom: t
	} : {
		top: (n.top ?? 0) + t,
		bottom: (n.bottom ?? 0) + t
	};
}), kD = K([
	bp,
	DD,
	Ep,
	Tp,
	(e, t, n) => n
], (e, t, n, r, i) => {
	var { padding: a } = r;
	return i ? [a.left, n.width - a.right] : [e.left + t.left, e.left + e.width - t.right];
}), AD = K([
	bp,
	rm,
	OD,
	Ep,
	Tp,
	(e, t, n) => n
], (e, t, n, r, i, a) => {
	var { padding: o } = i;
	return a ? [r.height - o.bottom, o.top] : t === "horizontal" ? [e.top + e.height - n.bottom, e.top + n.top] : [e.top + n.top, e.top + e.height - n.bottom];
}), jD = (e, t, n, r) => {
	switch (t) {
		case "xAxis": return kD(e, n, r);
		case "yAxis": return AD(e, n, r);
		case "zAxis": return lE(e, n)?.range;
		case "angleAxis": return oy(e);
		case "radiusAxis": return sy(e, n);
		default: return;
	}
}, MD = K([uE, jD], Gv), ND = K([
	uE,
	yD,
	K([yD, CD], by),
	MD
], UT), PD = (e, t, n, r) => {
	if (n != null && n.dataKey != null) {
		var { type: i, scale: a } = n;
		if (Hf(e, r) && (i === "number" || a !== "auto")) return t.map((e) => e.value);
	}
}, FD = K([
	rm,
	DE,
	fE,
	ly
], PD), ID = K([ND], yy);
K([ND], YT), K([ND, ME], JT), K([
	vE,
	KE,
	ly
], qE);
function LD(e, t) {
	return e.id < t.id ? -1 : +(e.id > t.id);
}
var RD = (e, t) => t, zD = (e, t, n) => n, BD = K(sp, RD, zD, (e, t, n) => e.filter((e) => e.orientation === t).filter((e) => e.mirror === n).sort(LD)), VD = K(cp, RD, zD, (e, t, n) => e.filter((e) => e.orientation === t).filter((e) => e.mirror === n).sort(LD)), HD = (e, t) => ({
	width: e.width,
	height: t.height
}), UD = (e, t) => ({
	width: typeof t.width == "number" ? t.width : 60,
	height: e.height
}), WD = K(bp, iE, HD), GD = (e, t, n) => {
	switch (t) {
		case "top": return e.top;
		case "bottom": return n - e.bottom;
		default: return 0;
	}
}, KD = (e, t, n) => {
	switch (t) {
		case "left": return e.left;
		case "right": return n - e.right;
		default: return 0;
	}
}, qD = K(ip, bp, BD, RD, zD, (e, t, n, r, i) => {
	var a = {}, o;
	return n.forEach((n) => {
		var s = HD(t, n);
		o ??= GD(t, r, e);
		var c = r === "top" && !i || r === "bottom" && i;
		a[n.id] = o - Number(c) * s.height, o += (c ? -1 : 1) * s.height;
	}), a;
}), JD = K(rp, bp, VD, RD, zD, (e, t, n, r, i) => {
	var a = {}, o;
	return n.forEach((n) => {
		var s = UD(t, n);
		o ??= KD(t, r, e);
		var c = r === "left" && !i || r === "right" && i;
		a[n.id] = o - Number(c) * s.width, o += (c ? -1 : 1) * s.width;
	}), a;
}), YD = K([
	bp,
	iE,
	(e, t) => {
		var n = iE(e, t);
		if (n != null) return qD(e, n.orientation, n.mirror);
	},
	(e, t) => t
], (e, t, n, r) => {
	if (t != null) {
		var i = n?.[r];
		return i == null ? {
			x: e.left,
			y: 0
		} : {
			x: e.left,
			y: i
		};
	}
}), XD = K([
	bp,
	sE,
	(e, t) => {
		var n = sE(e, t);
		if (n != null) return JD(e, n.orientation, n.mirror);
	},
	(e, t) => t
], (e, t, n, r) => {
	if (t != null) {
		var i = n?.[r];
		return i == null ? {
			x: 0,
			y: e.top
		} : {
			x: i,
			y: e.top
		};
	}
}), ZD = K(bp, sE, (e, t) => ({
	width: typeof t.width == "number" ? t.width : 60,
	height: e.height
})), QD = (e, t, n, r) => {
	if (n != null) {
		var { allowDuplicatedCategory: i, type: a, dataKey: o } = n, s = Hf(e, r), c = t.map((e) => e.value);
		if (o && s && a === "category" && i && ps(c)) return c;
	}
}, $D = K([
	rm,
	DE,
	uE,
	ly
], QD), eO = K([
	rm,
	dE,
	yD,
	ID,
	$D,
	FD,
	jD,
	xD,
	ly
], (e, t, n, r, i, a, o, s, c) => {
	if (t != null) {
		var l = Hf(e, c);
		return {
			angle: t.angle,
			interval: t.interval,
			minTickGap: t.minTickGap,
			orientation: t.orientation,
			tick: t.tick,
			tickCount: t.tickCount,
			tickFormatter: t.tickFormatter,
			ticks: t.ticks,
			type: t.type,
			unit: t.unit,
			axisType: c,
			categoricalDomain: a,
			duplicateDomain: i,
			isCategorical: l,
			niceTicks: s,
			range: o,
			realScaleType: n,
			scale: r
		};
	}
}), tO = K([
	rm,
	fE,
	yD,
	ID,
	xD,
	jD,
	$D,
	FD,
	ly
], (e, t, n, r, i, a, o, s, c) => {
	if (t != null && r != null) {
		var l = Hf(e, c), { type: u, ticks: d, tickCount: f } = t, p = n === "scaleBand" && typeof r.bandwidth == "function" ? r.bandwidth() / 2 : 2, m = u === "category" && r.bandwidth ? r.bandwidth() / p : 0;
		m = c === "angleAxis" && a != null && a.length >= 2 ? os(a[0] - a[1]) * 2 * m : m;
		var h = d || i;
		return h ? h.map((e, t) => {
			var n = o ? o.indexOf(e) : e, i = r.map(n);
			return X(i) ? {
				index: t,
				coordinate: i + m,
				value: e,
				offset: m
			} : null;
		}).filter(vs) : l && s ? s.map((e, t) => {
			var n = r.map(e);
			return X(n) ? {
				coordinate: n + m,
				value: e,
				index: t,
				offset: m
			} : null;
		}).filter(vs) : r.ticks ? r.ticks(f).map((e, t) => {
			var n = r.map(e);
			return X(n) ? {
				coordinate: n + m,
				value: e,
				index: t,
				offset: m
			} : null;
		}).filter(vs) : r.domain().map((e, t) => {
			var n = r.map(e);
			return X(n) ? {
				coordinate: n + m,
				value: o ? o[e] : e,
				index: t,
				offset: m
			} : null;
		}).filter(vs);
	}
}), nO = K([
	rm,
	fE,
	ID,
	jD,
	$D,
	FD,
	ly
], (e, t, n, r, i, a, o) => {
	if (t != null && n != null && r != null && r[0] !== r[1]) {
		var s = Hf(e, o), { tickCount: c } = t, l = 0;
		return l = o === "angleAxis" && r?.length >= 2 ? os(r[0] - r[1]) * 2 * l : l, s && a ? a.map((e, t) => {
			var r = n.map(e);
			return X(r) ? {
				coordinate: r + l,
				value: e,
				index: t,
				offset: l
			} : null;
		}).filter(vs) : n.ticks ? n.ticks(c).map((e, t) => {
			var r = n.map(e);
			return X(r) ? {
				coordinate: r + l,
				value: e,
				index: t,
				offset: l
			} : null;
		}).filter(vs) : n.domain().map((e, t) => {
			var r = n.map(e);
			return X(r) ? {
				coordinate: r + l,
				value: i ? i[e] : e,
				index: t,
				offset: l
			} : null;
		}).filter(vs);
	}
}), rO = K(uE, ID, (e, t) => {
	if (e != null && t != null) return ZT(ZT({}, e), {}, { scale: t });
});
K((e, t, n) => lE(e, n), K([K([
	uE,
	yD,
	vD,
	MD
], UT)], yy), (e, t) => {
	if (e != null && t != null) return ZT(ZT({}, e), {}, { scale: t });
});
var iO = K([
	rm,
	sp,
	cp
], (e, t, n) => {
	switch (e) {
		case "horizontal": return t.some((e) => e.reversed) ? "right-to-left" : "left-to-right";
		case "vertical": return n.some((e) => e.reversed) ? "bottom-to-top" : "top-to-bottom";
		case "centric":
		case "radial": return "left-to-right";
		default: return;
	}
});
K([(e, t, n) => e.renderedTicks[t]?.[n]], (e) => {
	if (e && e.length !== 0) return (t) => {
		var n = 1e400, r = e[0];
		for (var i of e) {
			var a = Math.abs(i.coordinate - t);
			a < n && (n = a, r = i);
		}
		return r?.value;
	};
});
// node_modules/recharts/es6/state/selectors/selectTooltipEventType.js
var aO = (e) => e.options.defaultTooltipEventType, oO = (e) => e.options.validateTooltipEventTypes;
function sO(e, t, n) {
	if (e == null) return t;
	var r = e ? "axis" : "item";
	return n == null ? t : n.includes(r) ? r : t;
}
function cO(e, t) {
	return sO(t, aO(e), oO(e));
}
function lO(e) {
	return G((t) => cO(t, e));
}
// node_modules/recharts/es6/state/selectors/combiners/combineActiveLabel.js
var uO = (e, t) => {
	var n, r = Number(t);
	if (!(ss(r) || t == null)) return r >= 0 ? e == null || (n = e[r]) == null ? void 0 : n.value : void 0;
}, dO = (e) => e.tooltip.settings, fO = {
	active: !1,
	index: null,
	dataKey: void 0,
	graphicalItemId: void 0,
	coordinate: void 0
}, pO = Rd({
	name: "tooltip",
	initialState: {
		itemInteraction: {
			click: fO,
			hover: fO
		},
		axisInteraction: {
			click: fO,
			hover: fO
		},
		keyboardInteraction: fO,
		syncInteraction: {
			active: !1,
			index: null,
			dataKey: void 0,
			label: void 0,
			coordinate: void 0,
			sourceViewBox: void 0,
			graphicalItemId: void 0
		},
		tooltipItemPayloads: [],
		settings: {
			shared: void 0,
			trigger: "hover",
			axisId: 0,
			active: !1,
			defaultIndex: void 0
		}
	},
	reducers: {
		addTooltipEntrySettings: {
			reducer(e, t) {
				e.tooltipItemPayloads.push(Q(t.payload));
			},
			prepare: Y()
		},
		replaceTooltipEntrySettings: {
			reducer(e, t) {
				var { prev: n, next: r } = t.payload, i = ud(e).tooltipItemPayloads.indexOf(Q(n));
				i > -1 && (e.tooltipItemPayloads[i] = Q(r));
			},
			prepare: Y()
		},
		removeTooltipEntrySettings: {
			reducer(e, t) {
				var n = ud(e).tooltipItemPayloads.indexOf(Q(t.payload));
				n > -1 && e.tooltipItemPayloads.splice(n, 1);
			},
			prepare: Y()
		},
		setTooltipSettingsState(e, t) {
			e.settings = t.payload;
		},
		setActiveMouseOverItemIndex(e, t) {
			e.syncInteraction.active = !1, e.keyboardInteraction.active = !1, e.itemInteraction.hover.active = !0, e.itemInteraction.hover.index = t.payload.activeIndex, e.itemInteraction.hover.dataKey = t.payload.activeDataKey, e.itemInteraction.hover.graphicalItemId = t.payload.activeGraphicalItemId, e.itemInteraction.hover.coordinate = t.payload.activeCoordinate;
		},
		mouseLeaveChart(e) {
			e.itemInteraction.hover.active = !1, e.axisInteraction.hover.active = !1;
		},
		mouseLeaveItem(e) {
			e.itemInteraction.hover.active = !1;
		},
		setActiveClickItemIndex(e, t) {
			e.syncInteraction.active = !1, e.itemInteraction.click.active = !0, e.keyboardInteraction.active = !1, e.itemInteraction.click.index = t.payload.activeIndex, e.itemInteraction.click.dataKey = t.payload.activeDataKey, e.itemInteraction.click.graphicalItemId = t.payload.activeGraphicalItemId, e.itemInteraction.click.coordinate = t.payload.activeCoordinate;
		},
		setMouseOverAxisIndex(e, t) {
			e.syncInteraction.active = !1, e.axisInteraction.hover.active = !0, e.keyboardInteraction.active = !1, e.axisInteraction.hover.index = t.payload.activeIndex, e.axisInteraction.hover.dataKey = t.payload.activeDataKey, e.axisInteraction.hover.coordinate = t.payload.activeCoordinate;
		},
		setMouseClickAxisIndex(e, t) {
			e.syncInteraction.active = !1, e.keyboardInteraction.active = !1, e.axisInteraction.click.active = !0, e.axisInteraction.click.index = t.payload.activeIndex, e.axisInteraction.click.dataKey = t.payload.activeDataKey, e.axisInteraction.click.coordinate = t.payload.activeCoordinate;
		},
		setSyncInteraction(e, t) {
			e.syncInteraction = t.payload;
		},
		setKeyboardInteraction(e, t) {
			e.keyboardInteraction.active = t.payload.active, e.keyboardInteraction.index = t.payload.activeIndex, e.keyboardInteraction.coordinate = t.payload.activeCoordinate;
		}
	}
}), { addTooltipEntrySettings: mO, replaceTooltipEntrySettings: hO, removeTooltipEntrySettings: gO, setTooltipSettingsState: _O, setActiveMouseOverItemIndex: vO, mouseLeaveItem: yO, mouseLeaveChart: bO, setActiveClickItemIndex: xO, setMouseOverAxisIndex: SO, setMouseClickAxisIndex: CO, setSyncInteraction: wO, setKeyboardInteraction: TO } = pO.actions, EO = pO.reducer;
// node_modules/recharts/es6/state/selectors/combiners/combineTooltipInteractionState.js
function DO(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function OO(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? DO(Object(n), !0).forEach(function(t) {
			kO(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : DO(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function kO(e, t, n) {
	return (t = AO(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function AO(e) {
	var t = jO(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function jO(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function MO(e, t, n) {
	return t === "axis" ? n === "click" ? e.axisInteraction.click : e.axisInteraction.hover : n === "click" ? e.itemInteraction.click : e.itemInteraction.hover;
}
function NO(e) {
	return e.index != null;
}
var PO = (e, t, n, r) => {
	if (t == null) return fO;
	var i = MO(e, t, n);
	if (i == null) return fO;
	if (i.active) return i;
	if (e.keyboardInteraction.active) return e.keyboardInteraction;
	if (e.syncInteraction.active && e.syncInteraction.index != null) return e.syncInteraction;
	var a = e.settings.active === !0;
	if (NO(i)) {
		if (a) return OO(OO({}, i), {}, { active: !0 });
	} else if (r != null) return {
		active: !0,
		coordinate: void 0,
		dataKey: void 0,
		index: r,
		graphicalItemId: void 0
	};
	return OO(OO({}, fO), {}, { coordinate: i.coordinate });
};
// node_modules/recharts/es6/state/selectors/combiners/combineActiveTooltipIndex.js
function FO(e) {
	if (typeof e == "number") return Number.isFinite(e) ? e : void 0;
	if (e instanceof Date) {
		var t = e.valueOf();
		return Number.isFinite(t) ? t : void 0;
	}
	var n = Number(e);
	return Number.isFinite(n) ? n : void 0;
}
function IO(e, t) {
	var n = FO(e), r = t[0], i = t[1];
	return n !== void 0 && n >= Math.min(r, i) && n <= Math.max(r, i);
}
function LO(e, t, n) {
	if (n == null || t == null) return !0;
	var r = Bf(e, t);
	return r == null || !Sv(n) || IO(r, n);
}
var RO = (e, t, n, r) => {
	var i = e?.index;
	if (i == null) return null;
	var a = Number(i);
	if (!X(a)) return i;
	var o = 0, s = 1e400;
	t.length > 0 && (s = t.length - 1);
	var c = Math.max(o, Math.min(a, s)), l = t[c];
	return l == null || LO(l, n, r) ? String(c) : null;
}, zO = (e, t, n, r, i, a, o) => {
	if (a != null) {
		var s = o[0]?.getPosition(a);
		if (s != null) return s;
		var c = i?.[Number(a)];
		if (c) switch (n) {
			case "horizontal": return {
				x: c.coordinate,
				y: (r.top + t) / 2
			};
			default: return {
				x: (r.left + e) / 2,
				y: c.coordinate
			};
		}
	}
}, BO = (e, t, n, r) => {
	if (t === "axis") return e.tooltipItemPayloads;
	if (e.tooltipItemPayloads.length === 0) return [];
	var i = n === "hover" ? e.itemInteraction.hover.graphicalItemId : e.itemInteraction.click.graphicalItemId;
	if (e.syncInteraction.active && i == null) return e.tooltipItemPayloads;
	if (i == null && r != null) {
		var a = e.tooltipItemPayloads[0];
		return a == null ? [] : [a];
	}
	return e.tooltipItemPayloads.filter((e) => e.settings?.graphicalItemId === i);
}, VO = (e) => e.options.tooltipPayloadSearcher, HO = (e) => e.tooltip;
// node_modules/recharts/es6/state/selectors/combiners/combineTooltipPayload.js
function UO(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function WO(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? UO(Object(n), !0).forEach(function(t) {
			GO(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : UO(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function GO(e, t, n) {
	return (t = KO(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function KO(e) {
	var t = qO(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function qO(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function JO(e) {
	if (typeof e == "string" || typeof e == "number") return e;
}
function YO(e) {
	if (typeof e == "string" || typeof e == "number" || typeof e == "boolean") return e;
}
function XO(e) {
	if (typeof e == "string" || typeof e == "number") return e;
	if (typeof e == "function") return (t) => e(t);
}
function ZO(e) {
	if (typeof e == "string") return e;
}
function QO(e) {
	if (typeof e == "object" && e) return {
		name: "name" in e ? JO(e.name) : void 0,
		unit: "unit" in e ? YO(e.unit) : void 0,
		dataKey: "dataKey" in e ? XO(e.dataKey) : void 0,
		payload: "payload" in e ? e.payload : void 0,
		color: "color" in e ? ZO(e.color) : void 0,
		fill: "fill" in e ? ZO(e.fill) : void 0
	};
}
function $O(e, t) {
	return e ?? t;
}
var ek = (e, t, n, r, i, a, o) => {
	if (t != null && a != null) {
		var { chartData: s, computedData: c, dataStartIndex: l, dataEndIndex: u } = n;
		return e.reduce((e, n) => {
			var { dataDefinedOnItem: d, settings: f } = n, p = $O(d, s), m = Array.isArray(p) ? Nf(p, l, u) : p, h = f?.dataKey ?? r, g = f?.nameKey, _ = r && Array.isArray(m) && !Array.isArray(m[0]) && o === "axis" ? hs(m, r, i) : a(m, t, c, g);
			return Array.isArray(_) ? _.forEach((t) => {
				var n = QO(t), r = n?.name, i = n?.dataKey, a = n?.payload, o = WO(WO({}, f), {}, {
					name: r,
					unit: n?.unit,
					color: n?.color ?? f?.color,
					fill: n?.fill ?? f?.fill
				});
				e.push($f({
					tooltipEntrySettings: o,
					dataKey: i,
					payload: a,
					value: Bf(a, i),
					name: r == null ? void 0 : String(r)
				}));
			}) : e.push($f({
				tooltipEntrySettings: f,
				dataKey: h,
				payload: _,
				value: Bf(_, h),
				name: Bf(_, g) ?? f?.name
			})), e;
		}, []);
	}
}, tk = K([
	FE,
	pE,
	Rv
], KT), nk = K([
	K([(e) => e.graphicalItems.cartesianItems, (e) => e.graphicalItems.polarItems], (e, t) => [...e, ...t]),
	FE,
	K([_y, vy], mE)
], _E, { memoizeOptions: { resultEqualityCheck: hy } }), rk = K([nk], (e) => e.filter(py)), ik = K([K([nk], SE, { memoizeOptions: { resultEqualityCheck: hy } }), yv], wE), ak = K([
	rk,
	yv,
	FE
], fy), ok = K([
	ik,
	FE,
	nk
], EE), sk = K([FE], HE), ck = K([sk, K([FE], (e) => e.allowDataOverflow)], wv), lk = K([
	K([
		ak,
		K([nk], (e) => e.filter(py)),
		Iv,
		Lv
	], RE),
	yv,
	_y,
	ck
], BE), uk = K([
	ik,
	FE,
	K([nk], bE),
	KE,
	_y
], YE, { memoizeOptions: { resultEqualityCheck: my } }), dk = K([K([
	$E,
	_y,
	vy
], eD), _y], oD), fk = K([K([
	nD,
	_y,
	vy
], eD), _y], cD), pk = K([
	FE,
	rm,
	ik,
	ok,
	Iv,
	_y,
	K([
		FE,
		sk,
		ck,
		lk,
		uk,
		K([
			dk,
			K([K([
				iD,
				_y,
				vy
			], eD), _y], fD),
			fk
		], JE),
		rm,
		_y
	], mD)
], _D), mk = K([
	FE,
	pk,
	K([
		pk,
		FE,
		tk
	], bD),
	_y
], SD), hk = (e) => jD(e, _y(e), vy(e), !1), gk = K([FE, hk], Gv), _k = K([K([
	FE,
	tk,
	mk,
	gk
], UT)], yy), vk = K([
	rm,
	FE,
	tk,
	_k,
	hk,
	K([
		rm,
		ok,
		FE,
		_y
	], QD),
	K([
		rm,
		ok,
		FE,
		_y
	], PD),
	_y
], (e, t, n, r, i, a, o, s) => {
	if (t) {
		var { type: c } = t, l = Hf(e, s);
		if (r) {
			var u = n === "scaleBand" && r.bandwidth ? r.bandwidth() / 2 : 2, d = c === "category" && r.bandwidth ? r.bandwidth() / u : 0;
			return d = s === "angleAxis" && i != null && i?.length >= 2 ? os(i[0] - i[1]) * 2 * d : d, l && o ? o.map((e, t) => {
				var n = r.map(e);
				return X(n) ? {
					coordinate: n + d,
					value: e,
					index: t,
					offset: d
				} : null;
			}).filter(vs) : r.domain().map((e, t) => {
				var n = r.map(e);
				return X(n) ? {
					coordinate: n + d,
					value: a ? a[e] : e,
					index: t,
					offset: d
				} : null;
			}).filter(vs);
		}
	}
}), yk = K([
	aO,
	oO,
	dO
], (e, t, n) => sO(n.shared, e, t)), bk = (e) => e.tooltip.settings.trigger, xk = (e) => e.tooltip.settings.defaultIndex, Sk = K([
	HO,
	yk,
	bk,
	xk
], PO), Ck = K([
	Sk,
	ik,
	IE,
	pk
], RO), wk = K([vk, Ck], uO), Tk = K([Sk], (e) => {
	if (e) return e.dataKey;
}), Ek = K([Sk], (e) => {
	if (e) return e.graphicalItemId;
}), Dk = K([
	HO,
	yk,
	bk,
	xk
], BO), Ok = K([Sk, K([
	rp,
	ip,
	rm,
	bp,
	vk,
	xk,
	Dk
], zO)], (e, t) => e != null && e.coordinate ? e.coordinate : t), kk = K([Sk], (e) => e?.active ?? !1), Ak = K([K([
	Dk,
	Ck,
	yv,
	IE,
	wk,
	VO,
	yk
], ek)], (e) => {
	if (e != null) {
		var t = e.map((e) => e.payload).filter((e) => e != null);
		return Array.from(new Set(t));
	}
});
// node_modules/recharts/es6/context/useTooltipAxis.js
function jk(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Mk(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? jk(Object(n), !0).forEach(function(t) {
			Nk(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : jk(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Nk(e, t, n) {
	return (t = Pk(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Pk(e) {
	var t = Fk(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Fk(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var Ik = () => G(FE), Lk = () => {
	var e = Ik(), t = G(vk), n = G(_k);
	return Qf(!e || !n ? void 0 : Mk(Mk({}, e), {}, { scale: n }), t);
};
// node_modules/recharts/es6/util/getActiveCoordinate.js
function Rk(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function zk(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Rk(Object(n), !0).forEach(function(t) {
			Bk(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Rk(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Bk(e, t, n) {
	return (t = Vk(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Vk(e) {
	var t = Hk(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Hk(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var Uk = (e, t, n, r) => {
	var i = t.find((e) => e && e.index === n);
	if (i) {
		if (e === "horizontal") return {
			x: i.coordinate,
			y: r.relativeY
		};
		if (e === "vertical") return {
			x: r.relativeX,
			y: i.coordinate
		};
	}
	return {
		x: 0,
		y: 0
	};
}, Wk = (e, t, n, r) => {
	var i = t.find((e) => e && e.index === n);
	if (i) {
		if (e === "centric") {
			var a = i.coordinate, { radius: o } = r;
			return zk(zk(zk({}, r), K_(r.cx, r.cy, o, a)), {}, {
				angle: a,
				radius: o
			});
		}
		var s = i.coordinate, { angle: c } = r;
		return zk(zk(zk({}, r), K_(r.cx, r.cy, s, c)), {}, {
			angle: c,
			radius: s
		});
	}
	return {
		angle: 0,
		clockWise: !1,
		cx: 0,
		cy: 0,
		endAngle: 0,
		innerRadius: 0,
		outerRadius: 0,
		radius: 0,
		startAngle: 0,
		x: 0,
		y: 0
	};
};
function Gk(e, t) {
	var { relativeX: n, relativeY: r } = e;
	return n >= t.left && n <= t.left + t.width && r >= t.top && r <= t.top + t.height;
}
var Kk = (e, t, n, r, i) => {
	var a = t?.length ?? 0;
	if (a <= 1 || e == null) return 0;
	if (r === "angleAxis" && i != null && Math.abs(Math.abs(i[1] - i[0]) - 360) <= 1e-6) for (var o = 0; o < a; o++) {
		var s = o > 0 ? n[o - 1]?.coordinate : n[a - 1]?.coordinate, c = n[o]?.coordinate, l = o >= a - 1 ? n[0]?.coordinate : n[o + 1]?.coordinate, u = void 0;
		if (s != null && c != null && l != null) {
			if (os(c - s) !== os(l - c)) {
				var d = [];
				if (os(l - c) === os(i[1] - i[0])) {
					u = l;
					var f = c + i[1] - i[0];
					d[0] = Math.min(f, (f + s) / 2), d[1] = Math.max(f, (f + s) / 2);
				} else {
					u = s;
					var p = l + i[1] - i[0];
					d[0] = Math.min(c, (p + c) / 2), d[1] = Math.max(c, (p + c) / 2);
				}
				var m = [Math.min(c, (u + c) / 2), Math.max(c, (u + c) / 2)];
				if (e > m[0] && e <= m[1] || e >= d[0] && e <= d[1]) return n[o]?.index;
			} else {
				var h = Math.min(s, l), g = Math.max(s, l);
				if (e > (h + c) / 2 && e <= (g + c) / 2) return n[o]?.index;
			}
		}
	}
	else if (t) for (var _ = 0; _ < a; _++) {
		var v = t[_];
		if (v != null) {
			var y = t[_ + 1], b = t[_ - 1];
			if (_ === 0 && y != null && e <= (v.coordinate + y.coordinate) / 2 || _ === a - 1 && b != null && e > (v.coordinate + b.coordinate) / 2 || _ > 0 && _ < a - 1 && b != null && y != null && e > (v.coordinate + b.coordinate) / 2 && e <= (v.coordinate + y.coordinate) / 2) return v.index;
		}
	}
	return -1;
}, qk = () => G(Rv), Jk = (e, t) => t, Yk = (e, t, n) => n, Xk = (e, t, n, r) => r, Zk = K(vk, (e) => jl(e, (e) => e.coordinate)), Qk = K([
	HO,
	Jk,
	Yk,
	Xk
], PO), $k = K([
	Qk,
	ik,
	IE,
	pk
], RO), eA = (e, t, n) => {
	if (t != null) {
		var r = HO(e);
		return t === "axis" ? n === "hover" ? r.axisInteraction.hover.dataKey : r.axisInteraction.click.dataKey : n === "hover" ? r.itemInteraction.hover.dataKey : r.itemInteraction.click.dataKey;
	}
}, tA = K([
	HO,
	Jk,
	Yk,
	Xk
], BO), nA = K([
	rp,
	ip,
	rm,
	bp,
	vk,
	Xk,
	tA
], zO), rA = K([Qk, nA], (e, t) => e.coordinate ?? t), iA = K([vk, $k], uO), aA = K([
	tA,
	$k,
	yv,
	IE,
	iA,
	VO,
	Jk
], ek), oA = K([Qk, $k], (e, t) => ({
	isActive: e.active && t != null,
	activeIndex: t
})), sA = (e, t, n, r, i, a, o) => {
	if (e && n && r && i && Gk(e, o)) {
		var s = Kk(tp(e, t), a, i, n, r), c = Uk(t, i, s, e);
		return {
			activeIndex: String(s),
			activeCoordinate: c
		};
	}
}, cA = (e, t, n, r, i, a, o) => {
	if (e && r && i && a && n) {
		var s = Q_(e, n);
		if (s) {
			var c = Kk(np(s, t), o, a, r, i), l = Wk(t, a, c, s);
			return {
				activeIndex: String(c),
				activeCoordinate: l
			};
		}
	}
}, lA = (e, t, n, r, i, a, o, s) => {
	if (e && t && r && i && a) return t === "horizontal" || t === "vertical" ? sA(e, t, r, i, a, o, s) : cA(e, t, n, r, i, a, o);
}, uA = K((e) => e.zIndex.zIndexMap, (e, t) => t, (e, t, n) => n, (e, t, n) => {
	if (t != null) {
		var r = e[t];
		if (r != null) return n ? r.panoramaElement : r.element;
	}
}), dA = K((e) => e.zIndex.zIndexMap, (e) => {
	var t = Object.keys(e).map((e) => parseInt(e, 10)).concat(Object.values(Hv));
	return Array.from(new Set(t)).sort((e, t) => e - t);
}, { memoizeOptions: { resultEqualityCheck: gy } });
// node_modules/recharts/es6/state/zIndexSlice.js
function fA(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function pA(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? fA(Object(n), !0).forEach(function(t) {
			mA(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : fA(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function mA(e, t, n) {
	return (t = hA(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function hA(e) {
	var t = gA(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function gA(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var _A = { zIndexMap: Object.values(Hv).reduce((e, t) => pA(pA({}, e), {}, { [t]: {
	element: void 0,
	panoramaElement: void 0,
	consumers: 0
} }), {}) }, vA = new Set(Object.values(Hv));
function yA(e) {
	return vA.has(e);
}
var bA = Rd({
	name: "zIndex",
	initialState: _A,
	reducers: {
		registerZIndexPortal: {
			reducer: (e, t) => {
				var { zIndex: n } = t.payload;
				e.zIndexMap[n] ? e.zIndexMap[n].consumers += 1 : e.zIndexMap[n] = {
					consumers: 1,
					element: void 0,
					panoramaElement: void 0
				};
			},
			prepare: Y()
		},
		unregisterZIndexPortal: {
			reducer: (e, t) => {
				var { zIndex: n } = t.payload;
				e.zIndexMap[n] && (--e.zIndexMap[n].consumers, e.zIndexMap[n].consumers <= 0 && !yA(n) && delete e.zIndexMap[n]);
			},
			prepare: Y()
		},
		registerZIndexPortalElement: {
			reducer: (e, t) => {
				var { zIndex: n, element: r, isPanorama: i } = t.payload;
				e.zIndexMap[n] ? i ? e.zIndexMap[n].panoramaElement = Q(r) : e.zIndexMap[n].element = Q(r) : e.zIndexMap[n] = {
					consumers: 0,
					element: i ? void 0 : Q(r),
					panoramaElement: i ? Q(r) : void 0
				};
			},
			prepare: Y()
		},
		unregisterZIndexPortalElement: {
			reducer: (e, t) => {
				var { zIndex: n } = t.payload;
				e.zIndexMap[n] && (t.payload.isPanorama ? e.zIndexMap[n].panoramaElement = void 0 : e.zIndexMap[n].element = void 0);
			},
			prepare: Y()
		}
	}
}), { registerZIndexPortal: xA, unregisterZIndexPortal: SA, registerZIndexPortalElement: CA, unregisterZIndexPortalElement: wA } = bA.actions, TA = bA.reducer;
// node_modules/recharts/es6/zIndex/ZIndexLayer.js
function EA(e) {
	var { zIndex: t, children: n } = e, r = sm() && t !== void 0 && t !== 0, i = wp(), a = il();
	(0, v.useLayoutEffect)(() => r ? (a(xA({ zIndex: t })), () => {
		a(SA({ zIndex: t }));
	}) : ys, [
		a,
		t,
		r
	]);
	var o = G((e) => uA(e, t, i));
	return r ? o ? /*#__PURE__*/ (0, Pn.createPortal)(n, o) : null : n;
}
// node_modules/recharts/es6/component/Cursor.js
function DA() {
	return DA = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, DA.apply(null, arguments);
}
function OA(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function kA(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? OA(Object(n), !0).forEach(function(t) {
			AA(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : OA(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function AA(e, t, n) {
	return (t = jA(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function jA(e) {
	var t = MA(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function MA(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function NA(e) {
	var { cursor: t, cursorComp: n, cursorProps: r } = e;
	return /*#__PURE__*/ (0, v.isValidElement)(t) ? /*#__PURE__*/ (0, v.cloneElement)(t, r) : /*#__PURE__*/ (0, v.createElement)(n, r);
}
function PA(e) {
	var { coordinate: t, payload: n, index: r, offset: i, tooltipAxisBandSize: a, layout: o, cursor: s, tooltipEventType: c, chartName: l } = e, u = t, d = n, f = r;
	if (!s || !u || l !== "ScatterChart" && c !== "axis") return null;
	var p, m, h;
	if (l === "ScatterChart") p = u, m = Dg, h = Hv.cursorLine;
	else if (l === "BarChart") p = Og(o, u, i, a), m = R_, h = Hv.cursorRectangle;
	else if (o === "radial" && Fs(u)) {
		var { cx: g, cy: _, radius: y, startAngle: b, endAngle: x } = $_(u);
		p = {
			cx: g,
			cy: _,
			startAngle: b,
			endAngle: x,
			innerRadius: y,
			outerRadius: y
		}, m = mv, h = Hv.cursorLine;
	} else p = { points: hv(o, u, i) }, m = gg, h = Hv.cursorLine;
	var S = typeof s == "object" && "className" in s ? s.className : void 0, C = kA(kA(kA(kA({
		stroke: "#ccc",
		pointerEvents: "none"
	}, i), p), Zi(s)), {}, {
		payload: d,
		payloadIndex: f,
		className: I("recharts-tooltip-cursor", S)
	});
	return /*#__PURE__*/ v.createElement(EA, { zIndex: e.zIndex ?? h }, /*#__PURE__*/ v.createElement(NA, {
		cursor: s,
		cursorComp: m,
		cursorProps: C
	}));
}
function FA(e) {
	var t = Lk(), n = em(), r = im(), i = qk();
	return t == null || n == null || r == null || i == null ? null : /*#__PURE__*/ v.createElement(PA, DA({}, e, {
		offset: n,
		layout: r,
		tooltipAxisBandSize: t,
		chartName: i
	}));
}
// node_modules/recharts/es6/context/tooltipPortalContext.js
var IA = /*#__PURE__*/ (0, v.createContext)(null), LA = () => (0, v.useContext)(IA), RA = new (/* @__PURE__ */ l((/* @__PURE__ */ o(((e, t) => {
	var n = Object.prototype.hasOwnProperty, r = "~";
	function i() {}
	Object.create && (i.prototype = Object.create(null), new i().__proto__ || (r = !1));
	function a(e, t, n) {
		this.fn = e, this.context = t, this.once = n || !1;
	}
	function o(e, t, n, i, o) {
		if (typeof n != "function") throw TypeError("The listener must be a function");
		var s = new a(n, i || e, o), c = r ? r + t : t;
		return e._events[c] ? e._events[c].fn ? e._events[c] = [e._events[c], s] : e._events[c].push(s) : (e._events[c] = s, e._eventsCount++), e;
	}
	function s(e, t) {
		--e._eventsCount === 0 ? e._events = new i() : delete e._events[t];
	}
	function c() {
		this._events = new i(), this._eventsCount = 0;
	}
	c.prototype.eventNames = function() {
		var e = [], t, i;
		if (this._eventsCount === 0) return e;
		for (i in t = this._events) n.call(t, i) && e.push(r ? i.slice(1) : i);
		return Object.getOwnPropertySymbols ? e.concat(Object.getOwnPropertySymbols(t)) : e;
	}, c.prototype.listeners = function(e) {
		var t = r ? r + e : e, n = this._events[t];
		if (!n) return [];
		if (n.fn) return [n.fn];
		for (var i = 0, a = n.length, o = Array(a); i < a; i++) o[i] = n[i].fn;
		return o;
	}, c.prototype.listenerCount = function(e) {
		var t = r ? r + e : e, n = this._events[t];
		return n ? n.fn ? 1 : n.length : 0;
	}, c.prototype.emit = function(e, t, n, i, a, o) {
		var s = r ? r + e : e;
		if (!this._events[s]) return !1;
		var c = this._events[s], l = arguments.length, u, d;
		if (c.fn) {
			switch (c.once && this.removeListener(e, c.fn, void 0, !0), l) {
				case 1: return c.fn.call(c.context), !0;
				case 2: return c.fn.call(c.context, t), !0;
				case 3: return c.fn.call(c.context, t, n), !0;
				case 4: return c.fn.call(c.context, t, n, i), !0;
				case 5: return c.fn.call(c.context, t, n, i, a), !0;
				case 6: return c.fn.call(c.context, t, n, i, a, o), !0;
			}
			for (d = 1, u = Array(l - 1); d < l; d++) u[d - 1] = arguments[d];
			c.fn.apply(c.context, u);
		} else {
			var f = c.length, p;
			for (d = 0; d < f; d++) switch (c[d].once && this.removeListener(e, c[d].fn, void 0, !0), l) {
				case 1:
					c[d].fn.call(c[d].context);
					break;
				case 2:
					c[d].fn.call(c[d].context, t);
					break;
				case 3:
					c[d].fn.call(c[d].context, t, n);
					break;
				case 4:
					c[d].fn.call(c[d].context, t, n, i);
					break;
				default:
					if (!u) for (p = 1, u = Array(l - 1); p < l; p++) u[p - 1] = arguments[p];
					c[d].fn.apply(c[d].context, u);
			}
		}
		return !0;
	}, c.prototype.on = function(e, t, n) {
		return o(this, e, t, n, !1);
	}, c.prototype.once = function(e, t, n) {
		return o(this, e, t, n, !0);
	}, c.prototype.removeListener = function(e, t, n, i) {
		var a = r ? r + e : e;
		if (!this._events[a]) return this;
		if (!t) return s(this, a), this;
		var o = this._events[a];
		if (o.fn) o.fn !== t || i && !o.once || n && o.context !== n || s(this, a);
		else {
			for (var c = 0, l = [], u = o.length; c < u; c++) (o[c].fn !== t || i && !o[c].once || n && o[c].context !== n) && l.push(o[c]);
			l.length ? this._events[a] = l.length === 1 ? l[0] : l : s(this, a);
		}
		return this;
	}, c.prototype.removeAllListeners = function(e) {
		var t;
		return e ? (t = r ? r + e : e, this._events[t] && s(this, t)) : (this._events = new i(), this._eventsCount = 0), this;
	}, c.prototype.off = c.prototype.removeListener, c.prototype.addListener = c.prototype.on, c.prefixed = r, c.EventEmitter = c, t !== void 0 && (t.exports = c);
})))(), 1)).default(), zA = "recharts.syncEvent.tooltip", BA = "recharts.syncEvent.brush", VA = (e, t) => {
	if (t && Array.isArray(e)) {
		var n = Number.parseInt(t, 10);
		if (!ss(n)) return e[n];
	}
}, HA = Rd({
	name: "options",
	initialState: {
		chartName: "",
		tooltipPayloadSearcher: () => void 0,
		eventEmitter: void 0,
		defaultTooltipEventType: "axis"
	},
	reducers: { createEventEmitter: (e) => {
		e.eventEmitter ??= Symbol("rechartsEventEmitter");
	} }
}), UA = HA.reducer, { createEventEmitter: WA } = HA.actions;
// node_modules/recharts/es6/synchronisation/syncSelectors.js
function GA(e) {
	return e.tooltip.syncInteraction;
}
var KA = Rd({
	name: "chartData",
	initialState: {
		chartData: void 0,
		computedData: void 0,
		dataStartIndex: 0,
		dataEndIndex: 0
	},
	reducers: {
		setChartData(e, t) {
			e.chartData = Q(t.payload), t.payload == null ? (e.dataStartIndex = 0, e.dataEndIndex = 0) : t.payload.length > 0 && e.dataEndIndex !== t.payload.length - 1 && (e.dataEndIndex = t.payload.length - 1);
		},
		setComputedData(e, t) {
			e.computedData = t.payload;
		},
		setDataStartEndIndexes(e, t) {
			var { startIndex: n, endIndex: r } = t.payload;
			n != null && (e.dataStartIndex = n), r != null && (e.dataEndIndex = r);
		}
	}
}), { setChartData: qA, setDataStartEndIndexes: JA, setComputedData: YA } = KA.actions, XA = KA.reducer, ZA = ["x", "y"];
function QA(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function $A(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? QA(Object(n), !0).forEach(function(t) {
			ej(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : QA(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function ej(e, t, n) {
	return (t = tj(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function tj(e) {
	var t = nj(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function nj(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function rj(e, t) {
	if (e == null) return {};
	var n, r, i = ij(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function ij(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function aj() {
	var e = G(zv), t = G(Vv), n = il(), r = G(Bv), i = G(vk), a = im(), o = Qp(), s = G((e) => e.rootProps.className);
	(0, v.useEffect)(() => {
		if (e == null) return ys;
		var s = (s, c, l) => {
			if (t !== l && e === s) {
				if (r === "index") {
					var u;
					if (o && c != null && (u = c.payload) != null && u.coordinate && c.payload.sourceViewBox) {
						var d = c.payload.coordinate, { x: f, y: p } = d, m = rj(d, ZA), { x: h, y: g, width: _, height: v } = c.payload.sourceViewBox, y = $A($A({}, m), {}, {
							x: o.x + (_ ? (f - h) / _ : 0) * o.width,
							y: o.y + (v ? (p - g) / v : 0) * o.height
						});
						n($A($A({}, c), {}, { payload: $A($A({}, c.payload), {}, { coordinate: y }) }));
					} else n(c);
				} else if (i != null) {
					var b;
					typeof r == "function" ? b = i[r(i, {
						activeTooltipIndex: c.payload.index == null ? void 0 : Number(c.payload.index),
						isTooltipActive: c.payload.active,
						activeIndex: c.payload.index == null ? void 0 : Number(c.payload.index),
						activeLabel: c.payload.label,
						activeDataKey: c.payload.dataKey,
						activeCoordinate: c.payload.coordinate
					})] : r === "value" && (b = i.find((e) => String(e.value) === c.payload.label));
					var { coordinate: x } = c.payload;
					if (b == null || c.payload.active === !1 || x == null || o == null) n(wO({
						active: !1,
						coordinate: void 0,
						dataKey: void 0,
						index: null,
						label: void 0,
						sourceViewBox: void 0,
						graphicalItemId: void 0
					}));
					else {
						var { x: S, y: C } = x, w = Math.min(S, o.x + o.width), T = Math.min(C, o.y + o.height), E = {
							x: a === "horizontal" ? b.coordinate : w,
							y: a === "horizontal" ? T : b.coordinate
						};
						n(wO({
							active: c.payload.active,
							coordinate: E,
							dataKey: c.payload.dataKey,
							index: String(b.index),
							label: c.payload.label,
							sourceViewBox: c.payload.sourceViewBox,
							graphicalItemId: c.payload.graphicalItemId
						}));
					}
				}
			}
		};
		return RA.on(zA, s), () => {
			RA.off(zA, s);
		};
	}, [
		s,
		n,
		t,
		e,
		r,
		i,
		a,
		o
	]);
}
function oj() {
	var e = G(zv), t = G(Vv), n = il();
	(0, v.useEffect)(() => {
		if (e == null) return ys;
		var r = (r, i, a) => {
			t !== a && e === r && n(JA(i));
		};
		return RA.on(BA, r), () => {
			RA.off(BA, r);
		};
	}, [
		n,
		t,
		e
	]);
}
function sj() {
	var e = il();
	(0, v.useEffect)(() => {
		e(WA());
	}, [e]), aj(), oj();
}
function cj(e, t, n, r, i, a) {
	var o = G((n) => eA(n, e, t)), s = G(Ek), c = G(Vv), l = G(zv), u = G(Bv), d = G(GA)?.active, f = Qp();
	(0, v.useEffect)(() => {
		if (!d && l != null && c != null) {
			var e = wO({
				active: a,
				coordinate: n,
				dataKey: o,
				index: i,
				label: typeof r == "number" ? String(r) : r,
				sourceViewBox: f,
				graphicalItemId: s
			});
			RA.emit(zA, l, e, c);
		}
	}, [
		d,
		n,
		o,
		s,
		i,
		r,
		c,
		l,
		u,
		a,
		f
	]);
}
// node_modules/recharts/es6/component/Tooltip.js
function lj(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function uj(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? lj(Object(n), !0).forEach(function(t) {
			dj(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : lj(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function dj(e, t, n) {
	return (t = fj(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function fj(e) {
	var t = pj(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function pj(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function mj(e) {
	return e.dataKey;
}
function hj(e, t) {
	return /*#__PURE__*/ v.isValidElement(e) ? /*#__PURE__*/ v.cloneElement(e, t) : typeof e == "function" ? /*#__PURE__*/ v.createElement(e, t) : /*#__PURE__*/ v.createElement(Rh, t);
}
var gj = [], _j = {
	allowEscapeViewBox: {
		x: !1,
		y: !1
	},
	animationDuration: 400,
	animationEasing: "ease",
	axisId: 0,
	contentStyle: {},
	cursor: !0,
	filterNull: !0,
	includeHidden: !1,
	isAnimationActive: "auto",
	itemSorter: "name",
	itemStyle: {},
	labelStyle: {},
	offset: 10,
	reverseDirection: {
		x: !1,
		y: !1
	},
	separator: " : ",
	trigger: "hover",
	useTranslate3d: !1,
	wrapperStyle: {}
};
function vj(e) {
	var t = Ws(e, _j), { active: n, allowEscapeViewBox: r, animationDuration: i, animationEasing: a, content: o, filterNull: s, isAnimationActive: c, offset: l, payloadUniqBy: u, position: d, reverseDirection: f, useTranslate3d: p, wrapperStyle: m, cursor: h, shared: g, trigger: _, defaultIndex: y, portal: b, axisId: x } = t, S = il(), C = typeof y == "number" ? String(y) : y;
	(0, v.useEffect)(() => {
		S(_O({
			shared: g,
			trigger: _,
			axisId: x,
			active: n,
			defaultIndex: C
		}));
	}, [
		S,
		g,
		_,
		x,
		n,
		C
	]);
	var w = Qp(), T = tg(), E = lO(g), { activeIndex: D, isActive: O } = G((e) => oA(e, E, _, C)) ?? {}, k = G((e) => aA(e, E, _, C)), ee = G((e) => iA(e, E, _, C)), te = G((e) => rA(e, E, _, C)), A = k, j = LA(), ne = n ?? O ?? !1, [re, M] = Fl([A, ne]), ie = E === "axis" ? ee : void 0;
	cj(E, _, te, ie, D, ne);
	var ae = b ?? j;
	if (ae == null || w == null || E == null) return null;
	var oe = A ?? gj;
	ne || (oe = gj), s && oe.length && (oe = Xc(oe.filter((e) => e.value != null && (e.hide !== !0 || t.includeHidden)), u, mj));
	var se = oe.length > 0, ce = uj(uj({}, t), {}, {
		payload: oe,
		label: ie,
		active: ne,
		activeIndex: D,
		coordinate: te,
		accessibilityLayer: T
	}), le = /*#__PURE__*/ v.createElement(eg, {
		allowEscapeViewBox: r,
		animationDuration: i,
		animationEasing: a,
		isAnimationActive: c,
		active: ne,
		coordinate: te,
		hasPayload: se,
		offset: l,
		position: d,
		reverseDirection: f,
		useTranslate3d: p,
		viewBox: w,
		wrapperStyle: m,
		lastBoundingBox: re,
		innerRef: M,
		hasPortalFromProps: !!b
	}, hj(o, ce));
	return /*#__PURE__*/ v.createElement(v.Fragment, null, /*#__PURE__*/ (0, Pn.createPortal)(le, ae), ne && /*#__PURE__*/ v.createElement(FA, {
		cursor: h,
		tooltipEventType: E,
		coordinate: te,
		payload: oe,
		index: D
	}));
}
// node_modules/recharts/es6/util/LRUCache.js
function yj(e, t, n) {
	return (t = bj(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function bj(e) {
	var t = xj(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function xj(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var Sj = class {
	constructor(e) {
		yj(this, "cache", /* @__PURE__ */ new Map()), this.maxSize = e;
	}
	get(e) {
		var t = this.cache.get(e);
		return t !== void 0 && (this.cache.delete(e), this.cache.set(e, t)), t;
	}
	set(e, t) {
		if (this.cache.has(e)) this.cache.delete(e);
		else if (this.cache.size >= this.maxSize) {
			var n = this.cache.keys().next().value;
			n != null && this.cache.delete(n);
		}
		this.cache.set(e, t);
	}
	clear() {
		this.cache.clear();
	}
	size() {
		return this.cache.size;
	}
};
// node_modules/recharts/es6/util/DOMUtils.js
function Cj(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function wj(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Cj(Object(n), !0).forEach(function(t) {
			Tj(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Cj(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Tj(e, t, n) {
	return (t = Ej(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Ej(e) {
	var t = Dj(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Dj(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var Oj = wj({}, {
	cacheSize: 2e3,
	enableCache: !0
}), kj = new Sj(Oj.cacheSize), Aj = {
	position: "absolute",
	top: "-20000px",
	left: 0,
	padding: 0,
	margin: 0,
	border: "none",
	whiteSpace: "pre"
}, jj = "recharts_measurement_span";
function Mj(e, t) {
	return `${e}|${t.fontSize || ""}|${t.fontFamily || ""}|${t.fontWeight || ""}|${t.fontStyle || ""}|${t.letterSpacing || ""}|${t.textTransform || ""}`;
}
var Nj = (e, t) => {
	try {
		var n = document.getElementById(jj);
		n || (n = document.createElement("span"), n.setAttribute("id", jj), n.setAttribute("aria-hidden", "true"), document.body.appendChild(n)), Object.assign(n.style, Aj, t), n.textContent = `${e}`;
		var r = n.getBoundingClientRect();
		return {
			width: r.width,
			height: r.height
		};
	} catch {
		return {
			width: 0,
			height: 0
		};
	}
}, Pj = function(e) {
	var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
	if (e == null || Gh.isSsr) return {
		width: 0,
		height: 0
	};
	if (!Oj.enableCache) return Nj(e, t);
	var n = Mj(e, t), r = kj.get(n);
	if (r) return r;
	var i = Nj(e, t);
	return kj.set(n, i), i;
}, Fj;
function Ij(e, t, n) {
	return (t = Lj(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Lj(e) {
	var t = Rj(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Rj(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var zj = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([*/])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/, Bj = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([+-])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/, Vj = /^(px|cm|vh|vw|em|rem|%|mm|in|pt|pc|ex|ch|vmin|vmax|Q)$/, Hj = /(-?\d+(?:\.\d+)?)([a-zA-Z%]+)?/, Uj = {
	cm: 96 / 2.54,
	mm: 96 / 25.4,
	pt: 96 / 72,
	pc: 16,
	in: 96,
	Q: 96 / 101.6,
	px: 1
}, Wj = [
	"cm",
	"mm",
	"pt",
	"pc",
	"in",
	"Q",
	"px"
];
function Gj(e) {
	return Wj.includes(e);
}
var Kj = "NaN";
function qj(e, t) {
	return e * Uj[t];
}
var Jj = class e {
	static parse(t) {
		var [, n, r] = Hj.exec(t) ?? [];
		return n == null ? e.NaN : new e(parseFloat(n), r ?? "");
	}
	constructor(e, t) {
		this.num = e, this.unit = t, this.num = e, this.unit = t, ss(e) && (this.unit = ""), t !== "" && !Vj.test(t) && (this.num = NaN, this.unit = ""), Gj(t) && (this.num = qj(e, t), this.unit = "px");
	}
	add(t) {
		return this.unit === t.unit ? new e(this.num + t.num, this.unit) : new e(NaN, "");
	}
	subtract(t) {
		return this.unit === t.unit ? new e(this.num - t.num, this.unit) : new e(NaN, "");
	}
	multiply(t) {
		return this.unit !== "" && t.unit !== "" && this.unit !== t.unit ? new e(NaN, "") : new e(this.num * t.num, this.unit || t.unit);
	}
	divide(t) {
		return this.unit !== "" && t.unit !== "" && this.unit !== t.unit ? new e(NaN, "") : new e(this.num / t.num, this.unit || t.unit);
	}
	toString() {
		return `${this.num}${this.unit}`;
	}
	isNaN() {
		return ss(this.num);
	}
};
Fj = Jj, Ij(Jj, "NaN", new Fj(NaN, ""));
function Yj(e) {
	if (e == null || e.includes(Kj)) return Kj;
	for (var t = e; t.includes("*") || t.includes("/");) {
		var [, n, r, i] = zj.exec(t) ?? [], a = Jj.parse(n ?? ""), o = Jj.parse(i ?? ""), s = r === "*" ? a.multiply(o) : a.divide(o);
		if (s.isNaN()) return Kj;
		t = t.replace(zj, s.toString());
	}
	for (; t.includes("+") || /.-\d+(?:\.\d+)?/.test(t);) {
		var [, c, l, u] = Bj.exec(t) ?? [], d = Jj.parse(c ?? ""), f = Jj.parse(u ?? ""), p = l === "+" ? d.add(f) : d.subtract(f);
		if (p.isNaN()) return Kj;
		t = t.replace(Bj, p.toString());
	}
	return t;
}
var Xj = /\(([^()]*)\)/;
function Zj(e) {
	for (var t = e, n; (n = Xj.exec(t)) != null;) {
		var [, r] = n;
		t = t.replace(Xj, Yj(r));
	}
	return t;
}
function Qj(e) {
	var t = e.replace(/\s+/g, "");
	return t = Zj(t), t = Yj(t), t;
}
function $j(e) {
	try {
		return Qj(e);
	} catch {
		return Kj;
	}
}
function eM(e) {
	var t = $j(e.slice(5, -1));
	return t === Kj ? "" : t;
}
// node_modules/recharts/es6/component/Text.js
var tM = [
	"x",
	"y",
	"lineHeight",
	"capHeight",
	"fill",
	"scaleToFit",
	"textAnchor",
	"verticalAnchor"
], nM = [
	"dx",
	"dy",
	"angle",
	"className",
	"breakAll"
];
function rM() {
	return rM = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, rM.apply(null, arguments);
}
function iM(e, t) {
	if (e == null) return {};
	var n, r, i = aM(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function aM(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var oM = /[ \f\n\r\t\v\u2028\u2029]+/, sM = (e) => {
	var { children: t, breakAll: n, style: r } = e;
	try {
		var i = [];
		return gs(t) || (i = n ? t.toString().split("") : t.toString().split(oM)), {
			wordsWithComputedWidth: i.map((e) => ({
				word: e,
				width: Pj(e, r).width
			})),
			spaceWidth: n ? 0 : Pj("\xA0", r).width
		};
	} catch {
		return null;
	}
};
function cM(e) {
	return e === "start" || e === "middle" || e === "end" || e === "inherit";
}
function lM(e) {
	return gs(e) || typeof e == "string" || typeof e == "number" || typeof e == "boolean";
}
var uM = (e, t, n, r) => e.reduce((e, i) => {
	var { word: a, width: o } = i, s = e[e.length - 1];
	if (s && o != null && (t == null || r || s.width + o + n < Number(t))) s.words.push(a), s.width += o + n;
	else {
		var c = {
			words: [a],
			width: o
		};
		e.push(c);
	}
	return e;
}, []), dM = (e) => e.reduce((e, t) => e.width > t.width ? e : t), fM = "…", pM = (e, t, n, r, i, a, o, s) => {
	var c = sM({
		breakAll: n,
		style: r,
		children: e.slice(0, t) + fM
	});
	if (!c) return [!1, []];
	var l = uM(c.wordsWithComputedWidth, a, o, s);
	return [l.length > i || dM(l).width > Number(a), l];
}, mM = (e, t, n, r, i) => {
	var { maxLines: a, children: o, style: s, breakAll: c } = e, l = W(a), u = String(o), d = uM(t, r, n, i);
	if (!l || i || !(d.length > a || dM(d).width > Number(r))) return d;
	for (var f = 0, p = u.length - 1, m = 0, h; f <= p && m <= u.length - 1;) {
		var g = Math.floor((f + p) / 2), [_, v] = pM(u, g - 1, c, s, a, r, n, i), [y] = pM(u, g, c, s, a, r, n, i);
		if (!_ && !y && (f = g + 1), _ && y && (p = g - 1), !_ && y) {
			h = v;
			break;
		}
		m++;
	}
	return h || d;
}, hM = (e) => [{
	words: gs(e) ? [] : e.toString().split(oM),
	width: void 0
}], gM = (e) => {
	var { width: t, scaleToFit: n, children: r, style: i, breakAll: a, maxLines: o } = e;
	if ((t || n) && !Gh.isSsr) {
		var s, c, l = sM({
			breakAll: a,
			children: r,
			style: i
		});
		if (l) {
			var { wordsWithComputedWidth: u, spaceWidth: d } = l;
			s = u, c = d;
		} else return hM(r);
		return mM({
			breakAll: a,
			children: r,
			maxLines: o,
			style: i
		}, s, c, t, !!n);
	}
	return hM(r);
}, _M = "#808080", vM = {
	angle: 0,
	breakAll: !1,
	capHeight: "0.71em",
	fill: _M,
	lineHeight: "1em",
	scaleToFit: !1,
	textAnchor: "start",
	verticalAnchor: "end",
	x: 0,
	y: 0
}, yM = /*#__PURE__*/ (0, v.forwardRef)((e, t) => {
	var n = Ws(e, vM), { x: r, y: i, lineHeight: a, capHeight: o, fill: s, scaleToFit: c, textAnchor: l, verticalAnchor: u } = n, d = iM(n, tM), f = (0, v.useMemo)(() => gM({
		breakAll: d.breakAll,
		children: d.children,
		maxLines: d.maxLines,
		scaleToFit: c,
		style: d.style,
		width: d.width
	}), [
		d.breakAll,
		d.children,
		d.maxLines,
		c,
		d.style,
		d.width
	]), { dx: p, dy: m, angle: h, className: g, breakAll: _ } = d, y = iM(d, nM);
	if (!ls(r) || !ls(i) || f.length === 0) return null;
	var b = Number(r) + (W(p) ? p : 0), x = Number(i) + (W(m) ? m : 0);
	if (!X(b) || !X(x)) return null;
	var S;
	switch (u) {
		case "start":
			S = eM(`calc(${o})`);
			break;
		case "middle":
			S = eM(`calc(${(f.length - 1) / 2} * -${a} + (${o} / 2))`);
			break;
		default: S = eM(`calc(${f.length - 1} * -${a})`);
	}
	var C = [], w = f[0];
	if (c && w != null) {
		var T = w.width, { width: E } = d;
		C.push(`scale(${W(E) && W(T) ? E / T : 1})`);
	}
	return h && C.push(`rotate(${h}, ${b}, ${x})`), C.length && (y.transform = C.join(" ")), /*#__PURE__*/ v.createElement("text", rM({}, Qi(y), {
		ref: t,
		x: b,
		y: x,
		className: I("recharts-text", g),
		textAnchor: l,
		fill: s.includes("url") ? _M : s
	}), f.map((e, t) => {
		var n = e.words.join(_ ? "" : " ");
		return /*#__PURE__*/ v.createElement("tspan", {
			x: b,
			dy: t === 0 ? S : a,
			key: `${n}-${t}`
		}, n);
	}));
});
yM.displayName = "Text";
// node_modules/recharts/es6/cartesian/getCartesianPosition.js
function bM(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function xM(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? bM(Object(n), !0).forEach(function(t) {
			SM(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : bM(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function SM(e, t, n) {
	return (t = CM(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function CM(e) {
	var t = wM(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function wM(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var TM = (e) => {
	var { viewBox: t, position: n, offset: r = 0, parentViewBox: i, clamp: a } = e, { x: o, y: s, height: c, upperWidth: l, lowerWidth: u } = Zp(t), d = o, f = o + (l - u) / 2, p = (d + f) / 2, m = (l + u) / 2, h = d + l / 2, g = c >= 0 ? 1 : -1, _ = g * r, v = g > 0 ? "end" : "start", y = g > 0 ? "start" : "end", b = l >= 0 ? 1 : -1, x = b * r, S = b > 0 ? "end" : "start", C = b > 0 ? "start" : "end", w = i;
	if (n === "top") {
		var T = {
			x: d + l / 2,
			y: s - _,
			horizontalAnchor: "middle",
			verticalAnchor: v
		};
		return a && w && (T.height = Math.max(s - w.y, 0), T.width = l), T;
	}
	if (n === "bottom") {
		var E = {
			x: f + u / 2,
			y: s + c + _,
			horizontalAnchor: "middle",
			verticalAnchor: y
		};
		return a && w && (E.height = Math.max(w.y + w.height - (s + c), 0), E.width = u), E;
	}
	if (n === "left") {
		var D = {
			x: p - x,
			y: s + c / 2,
			horizontalAnchor: S,
			verticalAnchor: "middle"
		};
		return a && w && (D.width = Math.max(D.x - w.x, 0), D.height = c), D;
	}
	if (n === "right") {
		var O = {
			x: p + m + x,
			y: s + c / 2,
			horizontalAnchor: C,
			verticalAnchor: "middle"
		};
		return a && w && (O.width = Math.max(w.x + w.width - O.x, 0), O.height = c), O;
	}
	var k = a && w ? {
		width: m,
		height: c
	} : {};
	return n === "insideLeft" ? xM({
		x: p + x,
		y: s + c / 2,
		horizontalAnchor: C,
		verticalAnchor: "middle"
	}, k) : n === "insideRight" ? xM({
		x: p + m - x,
		y: s + c / 2,
		horizontalAnchor: S,
		verticalAnchor: "middle"
	}, k) : n === "insideTop" ? xM({
		x: d + l / 2,
		y: s + _,
		horizontalAnchor: "middle",
		verticalAnchor: y
	}, k) : n === "insideBottom" ? xM({
		x: f + u / 2,
		y: s + c - _,
		horizontalAnchor: "middle",
		verticalAnchor: v
	}, k) : n === "insideTopLeft" ? xM({
		x: d + x,
		y: s + _,
		horizontalAnchor: C,
		verticalAnchor: y
	}, k) : n === "insideTopRight" ? xM({
		x: d + l - x,
		y: s + _,
		horizontalAnchor: S,
		verticalAnchor: y
	}, k) : n === "insideBottomLeft" ? xM({
		x: f + x,
		y: s + c - _,
		horizontalAnchor: C,
		verticalAnchor: v
	}, k) : n === "insideBottomRight" ? xM({
		x: f + u - x,
		y: s + c - _,
		horizontalAnchor: S,
		verticalAnchor: v
	}, k) : n && typeof n == "object" && (W(n.x) || cs(n.x)) && (W(n.y) || cs(n.y)) ? xM({
		x: o + fs(n.x, m),
		y: s + fs(n.y, c),
		horizontalAnchor: "end",
		verticalAnchor: "end"
	}, k) : xM({
		x: h,
		y: s + c / 2,
		horizontalAnchor: "middle",
		verticalAnchor: "middle"
	}, k);
}, EM = ["labelRef"], DM = ["content"];
function OM(e, t) {
	if (e == null) return {};
	var n, r, i = kM(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function kM(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function AM(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function jM(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? AM(Object(n), !0).forEach(function(t) {
			MM(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : AM(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function MM(e, t, n) {
	return (t = NM(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function NM(e) {
	var t = PM(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function PM(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function FM() {
	return FM = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, FM.apply(null, arguments);
}
var IM = /*#__PURE__*/ (0, v.createContext)(null), LM = (e) => {
	var { x: t, y: n, upperWidth: r, lowerWidth: i, width: a, height: o, children: s } = e, c = (0, v.useMemo)(() => ({
		x: t,
		y: n,
		upperWidth: r,
		lowerWidth: i,
		width: a,
		height: o
	}), [
		t,
		n,
		r,
		i,
		a,
		o
	]);
	return /*#__PURE__*/ v.createElement(IM.Provider, { value: c }, s);
}, RM = () => {
	var e = (0, v.useContext)(IM), t = Qp();
	return e || (t ? Zp(t) : void 0);
}, zM = /*#__PURE__*/ (0, v.createContext)(null), BM = () => {
	var e = (0, v.useContext)(zM), t = G(cy);
	return e || t;
}, VM = (e) => {
	var { value: t, formatter: n } = e, r = gs(e.children) ? t : e.children;
	return typeof n == "function" ? n(r) : r;
}, HM = (e) => e != null && typeof e == "function", UM = (e, t) => os(t - e) * Math.min(Math.abs(t - e), 360), WM = (e, t, n, r, i) => {
	var { offset: a, className: o } = e, { cx: s, cy: c, innerRadius: l, outerRadius: u, startAngle: d, endAngle: f, clockWise: p } = i, m = (l + u) / 2, h = UM(d, f), g = h >= 0 ? 1 : -1, _, y;
	switch (t) {
		case "insideStart":
			_ = d + g * a, y = p;
			break;
		case "insideEnd":
			_ = f - g * a, y = !p;
			break;
		case "end":
			_ = f + g * a, y = p;
			break;
		default: throw Error(`Unsupported position ${t}`);
	}
	y = h <= 0 ? y : !y;
	var b = K_(s, c, m, _), x = K_(s, c, m, _ + (y ? 1 : -1) * 359), S = `M${b.x},${b.y}
    A${m},${m},0,1,${+!y},
    ${x.x},${x.y}`, C = gs(e.id) ? ds("recharts-radial-line-") : e.id;
	return /*#__PURE__*/ v.createElement("text", FM({}, r, {
		dominantBaseline: "central",
		className: I("recharts-radial-bar-label", o)
	}), /*#__PURE__*/ v.createElement("defs", null, /*#__PURE__*/ v.createElement("path", {
		id: C,
		d: S
	})), /*#__PURE__*/ v.createElement("textPath", { xlinkHref: `#${C}` }, n));
}, GM = (e, t, n) => {
	var { cx: r, cy: i, innerRadius: a, outerRadius: o, startAngle: s, endAngle: c } = e, l = (s + c) / 2;
	if (n === "outside") {
		var { x: u, y: d } = K_(r, i, o + t, l);
		return {
			x: u,
			y: d,
			textAnchor: u >= r ? "start" : "end",
			verticalAnchor: "middle"
		};
	}
	if (n === "center") return {
		x: r,
		y: i,
		textAnchor: "middle",
		verticalAnchor: "middle"
	};
	if (n === "centerTop") return {
		x: r,
		y: i,
		textAnchor: "middle",
		verticalAnchor: "start"
	};
	if (n === "centerBottom") return {
		x: r,
		y: i,
		textAnchor: "middle",
		verticalAnchor: "end"
	};
	var { x: f, y: p } = K_(r, i, (a + o) / 2, l);
	return {
		x: f,
		y: p,
		textAnchor: "middle",
		verticalAnchor: "middle"
	};
}, KM = (e) => e != null && "cx" in e && W(e.cx), qM = {
	angle: 0,
	offset: 5,
	zIndex: Hv.label,
	position: "middle",
	textBreakAll: !1
};
function JM(e) {
	if (!KM(e)) return e;
	var { cx: t, cy: n, outerRadius: r } = e, i = r * 2;
	return {
		x: t - r,
		y: n - r,
		width: i,
		upperWidth: i,
		lowerWidth: i,
		height: i
	};
}
function YM(e) {
	var t = Ws(e, qM), { viewBox: n, parentViewBox: r, position: i, value: a, children: o, content: s, className: c = "", textBreakAll: l, labelRef: u } = t, d = BM(), f = RM(), p = n == null ? i === "center" ? f : d ?? f : KM(n) ? n : Zp(n), m, h, g = JM(p);
	if (!p || gs(a) && gs(o) && !/*#__PURE__*/ (0, v.isValidElement)(s) && typeof s != "function") return null;
	var _ = jM(jM({}, t), {}, { viewBox: p });
	if (/*#__PURE__*/ (0, v.isValidElement)(s)) {
		var { labelRef: y } = _, b = OM(_, EM);
		return /*#__PURE__*/ (0, v.cloneElement)(s, b);
	}
	if (typeof s == "function") {
		var { content: x } = _, S = OM(_, DM);
		if (m = /*#__PURE__*/ (0, v.createElement)(s, S), /*#__PURE__*/ (0, v.isValidElement)(m)) return m;
	} else m = VM(t);
	var C = Qi(t);
	if (KM(p)) {
		if (i === "insideStart" || i === "insideEnd" || i === "end") return WM(t, i, m, C, p);
		h = GM(p, t.offset, t.position);
	} else {
		if (!g) return null;
		var w = TM({
			viewBox: g,
			position: i,
			offset: t.offset,
			parentViewBox: KM(r) ? void 0 : r,
			clamp: !0
		});
		h = jM(jM({
			x: w.x,
			y: w.y,
			textAnchor: w.horizontalAnchor,
			verticalAnchor: w.verticalAnchor
		}, w.width === void 0 ? {} : { width: w.width }), w.height === void 0 ? {} : { height: w.height });
	}
	return /*#__PURE__*/ v.createElement(EA, { zIndex: t.zIndex }, /*#__PURE__*/ v.createElement(yM, FM({
		ref: u,
		className: I("recharts-label", c)
	}, C, h, {
		textAnchor: cM(C.textAnchor) ? C.textAnchor : h.textAnchor,
		breakAll: l
	}), m));
}
YM.displayName = "Label";
var XM = (e, t, n) => {
	if (!e) return null;
	var r = {
		viewBox: t,
		labelRef: n
	};
	return e === !0 ? /*#__PURE__*/ v.createElement(YM, FM({ key: "label-implicit" }, r)) : ls(e) ? /*#__PURE__*/ v.createElement(YM, FM({
		key: "label-implicit",
		value: e
	}, r)) : /*#__PURE__*/ (0, v.isValidElement)(e) ? e.type === YM ? /*#__PURE__*/ (0, v.cloneElement)(e, jM({ key: "label-implicit" }, r)) : /*#__PURE__*/ v.createElement(YM, FM({
		key: "label-implicit",
		content: e
	}, r)) : HM(e) ? /*#__PURE__*/ v.createElement(YM, FM({
		key: "label-implicit",
		content: e
	}, r)) : e && typeof e == "object" ? /*#__PURE__*/ v.createElement(YM, FM({}, e, { key: "label-implicit" }, r)) : null;
};
function ZM(e) {
	var { label: t, labelRef: n } = e;
	return XM(t, RM(), n) || null;
}
// node_modules/recharts/es6/component/LabelList.js
var QM = ["valueAccessor"], $M = [
	"dataKey",
	"clockWise",
	"id",
	"textBreakAll",
	"zIndex"
];
function eN() {
	return eN = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, eN.apply(null, arguments);
}
function tN(e, t) {
	if (e == null) return {};
	var n, r, i = nN(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function nN(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var rN = (e) => {
	var t = Array.isArray(e.value) ? e.value[e.value.length - 1] : e.value;
	if (lM(t)) return t;
}, iN = /*#__PURE__*/ (0, v.createContext)(void 0), aN = iN.Provider, oN = /*#__PURE__*/ (0, v.createContext)(void 0);
oN.Provider;
function sN() {
	return (0, v.useContext)(iN);
}
function cN() {
	return (0, v.useContext)(oN);
}
function lN(e) {
	var { valueAccessor: t = rN } = e, n = tN(e, QM), { dataKey: r, clockWise: i, id: a, textBreakAll: o, zIndex: s } = n, c = tN(n, $M), l = sN(), u = cN(), d = l || u;
	return !d || !d.length ? null : /*#__PURE__*/ v.createElement(EA, { zIndex: s ?? Hv.label }, /*#__PURE__*/ v.createElement(ca, { className: "recharts-label-list" }, d.map((e, i) => {
		var s = gs(r) ? t(e, i) : Bf(e.payload, r), l = gs(a) ? {} : { id: `${a}-${i}` };
		return /*#__PURE__*/ v.createElement(YM, eN({ key: `label-${i}` }, Qi(e), c, l, {
			fill: n.fill ?? e.fill,
			parentViewBox: e.parentViewBox,
			value: s,
			textBreakAll: o,
			viewBox: e.viewBox,
			index: i,
			zIndex: 0
		}));
	})));
}
lN.displayName = "LabelList";
function uN(e) {
	var { label: t } = e;
	return t ? t === !0 ? /*#__PURE__*/ v.createElement(lN, { key: "labelList-implicit" }) : /*#__PURE__*/ v.isValidElement(t) || HM(t) ? /*#__PURE__*/ v.createElement(lN, {
		key: "labelList-implicit",
		content: t
	}) : typeof t == "object" ? /*#__PURE__*/ v.createElement(lN, eN({ key: "labelList-implicit" }, t, { type: String(t.type) })) : null : null;
}
// node_modules/recharts/es6/shape/Dot.js
function dN() {
	return dN = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, dN.apply(null, arguments);
}
var fN = (e) => {
	var { cx: t, cy: n, r, className: i } = e, a = I("recharts-dot", i);
	return W(t) && W(n) && W(r) ? /*#__PURE__*/ v.createElement("circle", dN({}, Xi(e), Is(e), {
		className: a,
		cx: t,
		cy: n,
		r
	})) : null;
}, pN = Rd({
	name: "polarAxis",
	initialState: {
		radiusAxis: {},
		angleAxis: {}
	},
	reducers: {
		addRadiusAxis(e, t) {
			e.radiusAxis[t.payload.id] = Q(t.payload);
		},
		removeRadiusAxis(e, t) {
			delete e.radiusAxis[t.payload.id];
		},
		addAngleAxis(e, t) {
			e.angleAxis[t.payload.id] = Q(t.payload);
		},
		removeAngleAxis(e, t) {
			delete e.angleAxis[t.payload.id];
		}
	}
}), { addRadiusAxis: mN, removeRadiusAxis: hN, addAngleAxis: gN, removeAngleAxis: _N } = pN.actions, vN = pN.reducer;
// node_modules/recharts/es6/util/getClassNameFromUnknown.js
function yN(e) {
	return e && typeof e == "object" && "className" in e && typeof e.className == "string" ? e.className : "";
}
// node_modules/recharts/es6/util/ReactUtils.js
var bN = (e) => e && typeof e == "object" && "clipDot" in e ? !!e.clipDot : !0;
// node_modules/es-toolkit/dist/compat/predicate/isPlainObject.mjs
function xN(e) {
	if (typeof e != "object" || !e) return !1;
	if (Object.getPrototypeOf(e) === null) return !0;
	if (Object.prototype.toString.call(e) !== "[object Object]") {
		let t = e[Symbol.toStringTag];
		return t == null || !Object.getOwnPropertyDescriptor(e, Symbol.toStringTag)?.writable ? !1 : e.toString() === `[object ${t}]`;
	}
	let t = e;
	for (; Object.getPrototypeOf(t) !== null;) t = Object.getPrototypeOf(t);
	return Object.getPrototypeOf(e) === t;
}
// node_modules/recharts/es6/shape/Trapezoid.js
var SN, CN, wN, TN, EN;
function DN(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function ON(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? DN(Object(n), !0).forEach(function(t) {
			kN(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : DN(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function kN(e, t, n) {
	return (t = AN(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function AN(e) {
	var t = jN(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function jN(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function MN() {
	return MN = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, MN.apply(null, arguments);
}
function NN(e, t) {
	return t ||= e.slice(0), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }));
}
var PN = (e, t, n, r, i) => {
	var a = n - r, o = U(SN ||= NN([
		"M ",
		",",
		""
	]), e, t);
	return o += U(CN ||= NN([
		"L ",
		",",
		""
	]), e + n, t), o += U(wN ||= NN([
		"L ",
		",",
		""
	]), e + n - a / 2, t + i), o += U(TN ||= NN([
		"L ",
		",",
		""
	]), e + n - a / 2 - r, t + i), o += U(EN ||= NN([
		"L ",
		",",
		" Z"
	]), e, t), o;
}, FN = {
	x: 0,
	y: 0,
	upperWidth: 0,
	lowerWidth: 0,
	height: 0,
	isUpdateAnimationActive: !1,
	animationBegin: 0,
	animationDuration: 1500,
	animationEasing: "ease"
}, IN = (e) => {
	var t = Ws(e, FN), { x: n, y: r, upperWidth: i, lowerWidth: a, height: o, className: s } = t, { animationEasing: c, animationDuration: l, animationBegin: u, isUpdateAnimationActive: d } = t, f = (0, v.useRef)(null), [p, m] = (0, v.useState)(-1), h = (0, v.useRef)(i), g = (0, v.useRef)(a), _ = (0, v.useRef)(o), y = (0, v.useRef)(n), b = (0, v.useRef)(r), x = m_(e, "trapezoid-");
	if ((0, v.useEffect)(() => {
		if (f.current && f.current.getTotalLength) try {
			var e = f.current.getTotalLength();
			e && m(e);
		} catch {}
	}, []), n !== +n || r !== +r || i !== +i || a !== +a || o !== +o || i === 0 && a === 0 || o === 0) return null;
	var S = I("recharts-trapezoid", s);
	if (!d) return /*#__PURE__*/ v.createElement("g", null, /*#__PURE__*/ v.createElement("path", MN({}, Qi(t), {
		className: S,
		d: PN(n, r, i, a, o)
	})));
	var C = h.current, w = g.current, T = _.current, E = y.current, D = b.current, O = `0px ${p === -1 ? 1 : p}px`, k = `${p}px ${p}px`, ee = Fg(["strokeDasharray"], l, c);
	return /*#__PURE__*/ v.createElement(p_, {
		animationId: x,
		key: x,
		canBegin: p > 0,
		duration: l,
		easing: c,
		isActive: d,
		begin: u
	}, (e) => {
		var s = ms(C, i, e), c = ms(w, a, e), l = ms(T, o, e), u = ms(E, n, e), d = ms(D, r, e);
		f.current && (h.current = s, g.current = c, _.current = l, y.current = u, b.current = d);
		var p = e > 0 ? {
			transition: ee,
			strokeDasharray: k
		} : { strokeDasharray: O };
		return /*#__PURE__*/ v.createElement("path", MN({}, Qi(t), {
			className: S,
			d: PN(u, d, s, c, l),
			ref: f,
			style: ON(ON({}, p), t.style)
		}));
	});
}, LN = [
	"option",
	"shapeType",
	"activeClassName",
	"inActiveClassName"
];
function RN(e, t) {
	if (e == null) return {};
	var n, r, i = zN(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function zN(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function BN(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function VN(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? BN(Object(n), !0).forEach(function(t) {
			HN(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : BN(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function HN(e, t, n) {
	return (t = UN(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function UN(e) {
	var t = WN(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function WN(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function GN(e, t) {
	return VN(VN({}, t), e);
}
function KN(e, t) {
	return e === "symbols";
}
function qN(e) {
	var { shapeType: t, elementProps: n } = e;
	switch (t) {
		case "rectangle": return /*#__PURE__*/ v.createElement(R_, n);
		case "trapezoid": return /*#__PURE__*/ v.createElement(IN, n);
		case "sector": return /*#__PURE__*/ v.createElement(mv, n);
		case "symbols":
			if (KN(t, n)) return /*#__PURE__*/ v.createElement(Ps, n);
			break;
		case "curve": return /*#__PURE__*/ v.createElement(gg, n);
		default: return null;
	}
}
function JN(e) {
	return /*#__PURE__*/ (0, v.isValidElement)(e) ? e.props : e;
}
function YN(e) {
	var { option: t, shapeType: n, activeClassName: r = "recharts-active-shape", inActiveClassName: i = "recharts-shape" } = e, a = RN(e, LN), o;
	if (/*#__PURE__*/ (0, v.isValidElement)(t)) o = /*#__PURE__*/ (0, v.cloneElement)(t, VN(VN({}, a), JN(t)));
	else if (typeof t == "function") o = t(a, a.index);
	else if (xN(t) && typeof t != "boolean") {
		var s = GN(t, a);
		o = /*#__PURE__*/ v.createElement(qN, {
			shapeType: n,
			elementProps: s
		});
	} else {
		var c = a;
		o = /*#__PURE__*/ v.createElement(qN, {
			shapeType: n,
			elementProps: c
		});
	}
	return a.isActive ? /*#__PURE__*/ v.createElement(ca, { className: r }, o) : /*#__PURE__*/ v.createElement(ca, { className: i }, o);
}
// node_modules/recharts/es6/state/SetTooltipEntrySettings.js
function XN(e) {
	var { tooltipEntrySettings: t } = e, n = il(), r = wp(), i = (0, v.useRef)(null);
	return (0, v.useLayoutEffect)(() => {
		r || (i.current === null ? n(mO(t)) : i.current !== t && n(hO({
			prev: i.current,
			next: t
		})), i.current = t);
	}, [
		t,
		n,
		r
	]), (0, v.useLayoutEffect)(() => () => {
		i.current &&= (n(gO(i.current)), null);
	}, [n]), null;
}
// node_modules/recharts/es6/state/SetLegendPayload.js
function ZN(e) {
	var { legendPayload: t } = e, n = il(), r = wp(), i = (0, v.useRef)(null);
	return (0, v.useLayoutEffect)(() => {
		r || (i.current === null ? n(sh(t)) : i.current !== t && n(ch({
			prev: i.current,
			next: t
		})), i.current = t);
	}, [
		n,
		r,
		t
	]), (0, v.useLayoutEffect)(() => () => {
		i.current &&= (n(lh(i.current)), null);
	}, [n]), null;
}
// node_modules/recharts/es6/util/useId.js
var QN = v.useId ?? (() => {
	var [e] = v.useState(() => ds("uid-"));
	return e;
});
// node_modules/recharts/es6/util/useUniqueId.js
function $N(e, t) {
	var n = QN();
	return t || (e ? `${e}-${n}` : n);
}
// node_modules/recharts/es6/context/RegisterGraphicalItemId.js
var eP = /*#__PURE__*/ (0, v.createContext)(void 0), tP = (e) => {
	var { id: t, type: n, children: r } = e, i = $N(`recharts-${n}`, t);
	return /*#__PURE__*/ v.createElement(eP.Provider, { value: i }, r(i));
}, nP = Rd({
	name: "graphicalItems",
	initialState: {
		cartesianItems: [],
		polarItems: []
	},
	reducers: {
		addCartesianGraphicalItem: {
			reducer(e, t) {
				e.cartesianItems.push(Q(t.payload));
			},
			prepare: Y()
		},
		replaceCartesianGraphicalItem: {
			reducer(e, t) {
				var { prev: n, next: r } = t.payload, i = ud(e).cartesianItems.indexOf(Q(n));
				i > -1 && (e.cartesianItems[i] = Q(r));
			},
			prepare: Y()
		},
		removeCartesianGraphicalItem: {
			reducer(e, t) {
				var n = ud(e).cartesianItems.indexOf(Q(t.payload));
				n > -1 && e.cartesianItems.splice(n, 1);
			},
			prepare: Y()
		},
		addPolarGraphicalItem: {
			reducer(e, t) {
				e.polarItems.push(Q(t.payload));
			},
			prepare: Y()
		},
		removePolarGraphicalItem: {
			reducer(e, t) {
				var n = ud(e).polarItems.indexOf(Q(t.payload));
				n > -1 && e.polarItems.splice(n, 1);
			},
			prepare: Y()
		},
		replacePolarGraphicalItem: {
			reducer(e, t) {
				var { prev: n, next: r } = t.payload, i = ud(e).polarItems.indexOf(Q(n));
				i > -1 && (e.polarItems[i] = Q(r));
			},
			prepare: Y()
		}
	}
}), { addCartesianGraphicalItem: rP, replaceCartesianGraphicalItem: iP, removeCartesianGraphicalItem: aP, addPolarGraphicalItem: oP, removePolarGraphicalItem: sP, replacePolarGraphicalItem: cP } = nP.actions, lP = nP.reducer, uP = /*#__PURE__*/ (0, v.memo)((e) => {
	var t = il(), n = (0, v.useRef)(null);
	return (0, v.useLayoutEffect)(() => {
		n.current === null ? t(rP(e)) : n.current !== e && t(iP({
			prev: n.current,
			next: e
		})), n.current = e;
	}, [t, e]), (0, v.useLayoutEffect)(() => () => {
		n.current &&= (t(aP(n.current)), null);
	}, [t]), null;
}), dP = ["points"];
function fP(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function pP(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? fP(Object(n), !0).forEach(function(t) {
			mP(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : fP(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function mP(e, t, n) {
	return (t = hP(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function hP(e) {
	var t = gP(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function gP(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function _P() {
	return _P = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, _P.apply(null, arguments);
}
function vP(e, t) {
	if (e == null) return {};
	var n, r, i = yP(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function yP(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function bP(e) {
	var { option: t, dotProps: n, className: r } = e;
	if (/*#__PURE__*/ (0, v.isValidElement)(t)) return /*#__PURE__*/ (0, v.cloneElement)(t, n);
	if (typeof t == "function") return t(n);
	var i = I(r, typeof t == "boolean" ? "" : t.className), a = n ?? {}, { points: o } = a, s = vP(a, dP);
	return /*#__PURE__*/ v.createElement(fN, _P({}, s, { className: i }));
}
function xP(e, t) {
	return e == null ? !1 : t ? !0 : e.length === 1;
}
function SP(e) {
	var { points: t, dot: n, className: r, dotClassName: i, dataKey: a, baseProps: o, needClip: s, clipPathId: c, zIndex: l = Hv.scatter } = e;
	if (!xP(t, n)) return null;
	var u = bN(n), d = $i(n), f = t.map((e, r) => {
		var s = pP(pP(pP({ r: 3 }, o), d), {}, {
			index: r,
			cx: e.x ?? void 0,
			cy: e.y ?? void 0,
			dataKey: a,
			value: e.value,
			payload: e.payload,
			points: t
		});
		return /*#__PURE__*/ v.createElement(bP, {
			key: `dot-${r}`,
			option: n,
			dotProps: s,
			className: i
		});
	}), p = {};
	return s && c != null && (p.clipPath = `url(#clipPath-${u ? "" : "dots-"}${c})`), /*#__PURE__*/ v.createElement(EA, { zIndex: l }, /*#__PURE__*/ v.createElement(ca, _P({ className: r }, p), f));
}
// node_modules/recharts/es6/state/cartesianAxisSlice.js
function CP(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function wP(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? CP(Object(n), !0).forEach(function(t) {
			TP(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : CP(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function TP(e, t, n) {
	return (t = EP(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function EP(e) {
	var t = DP(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function DP(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var OP = Rd({
	name: "cartesianAxis",
	initialState: {
		xAxis: {},
		yAxis: {},
		zAxis: {}
	},
	reducers: {
		addXAxis: {
			reducer(e, t) {
				e.xAxis[t.payload.id] = Q(t.payload);
			},
			prepare: Y()
		},
		replaceXAxis: {
			reducer(e, t) {
				var { prev: n, next: r } = t.payload;
				e.xAxis[n.id] !== void 0 && (n.id !== r.id && delete e.xAxis[n.id], e.xAxis[r.id] = Q(r));
			},
			prepare: Y()
		},
		removeXAxis: {
			reducer(e, t) {
				delete e.xAxis[t.payload.id];
			},
			prepare: Y()
		},
		addYAxis: {
			reducer(e, t) {
				e.yAxis[t.payload.id] = Q(t.payload);
			},
			prepare: Y()
		},
		replaceYAxis: {
			reducer(e, t) {
				var { prev: n, next: r } = t.payload;
				e.yAxis[n.id] !== void 0 && (n.id !== r.id && delete e.yAxis[n.id], e.yAxis[r.id] = Q(r));
			},
			prepare: Y()
		},
		removeYAxis: {
			reducer(e, t) {
				delete e.yAxis[t.payload.id];
			},
			prepare: Y()
		},
		addZAxis: {
			reducer(e, t) {
				e.zAxis[t.payload.id] = Q(t.payload);
			},
			prepare: Y()
		},
		replaceZAxis: {
			reducer(e, t) {
				var { prev: n, next: r } = t.payload;
				e.zAxis[n.id] !== void 0 && (n.id !== r.id && delete e.zAxis[n.id], e.zAxis[r.id] = Q(r));
			},
			prepare: Y()
		},
		removeZAxis: {
			reducer(e, t) {
				delete e.zAxis[t.payload.id];
			},
			prepare: Y()
		},
		updateYAxisWidth(e, t) {
			var { id: n, width: r } = t.payload, i = e.yAxis[n];
			if (i) {
				var a = i.widthHistory || [];
				if (a.length === 3 && a[0] === a[2] && r === a[1] && r !== i.width && Math.abs(r - (a[0] ?? 0)) <= 1) return;
				var o = [...a, r].slice(-3);
				e.yAxis[n] = wP(wP({}, i), {}, {
					width: r,
					widthHistory: o
				});
			}
		}
	}
}), { addXAxis: kP, replaceXAxis: AP, removeXAxis: jP, addYAxis: MP, replaceYAxis: NP, removeYAxis: PP, addZAxis: FP, replaceZAxis: IP, removeZAxis: LP, updateYAxisWidth: RP } = OP.actions, zP = OP.reducer, BP = K([
	K([bp], (e) => ({
		top: e.top,
		bottom: e.bottom,
		left: e.left,
		right: e.right
	})),
	rp,
	ip
], (e, t, n) => {
	if (e && t != null && n != null) return {
		x: e.left,
		y: e.top,
		width: Math.max(0, t - e.left - e.right),
		height: Math.max(0, n - e.top - e.bottom)
	};
}), VP = () => G(BP), HP = () => G(Ak);
// node_modules/recharts/es6/component/ActivePoints.js
function UP(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function WP(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? UP(Object(n), !0).forEach(function(t) {
			GP(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : UP(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function GP(e, t, n) {
	return (t = KP(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function KP(e) {
	var t = qP(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function qP(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var JP = (e) => {
	var { point: t, childIndex: n, mainColor: r, activeDot: i, dataKey: a, clipPath: o } = e;
	if (i === !1 || t.x == null || t.y == null) return null;
	var s = WP(WP(WP({}, {
		index: n,
		dataKey: a,
		cx: t.x,
		cy: t.y,
		r: 4,
		fill: r ?? "none",
		strokeWidth: 2,
		stroke: "#fff",
		payload: t.payload,
		value: t.value
	}), Zi(i)), Is(i)), c = /*#__PURE__*/ (0, v.isValidElement)(i) ? /*#__PURE__*/ (0, v.cloneElement)(i, s) : typeof i == "function" ? i(s) : /*#__PURE__*/ v.createElement(fN, s);
	return /*#__PURE__*/ v.createElement(ca, {
		className: "recharts-active-dot",
		clipPath: o
	}, c);
};
function YP(e) {
	var { points: t, mainColor: n, activeDot: r, itemDataKey: i, clipPath: a, zIndex: o = Hv.activeDot } = e, s = G(Ck), c = HP();
	if (t == null || c == null) return null;
	var l = t.find((e) => c.includes(e.payload));
	return gs(l) ? null : /*#__PURE__*/ v.createElement(EA, { zIndex: o }, /*#__PURE__*/ v.createElement(JP, {
		point: l,
		childIndex: Number(s),
		mainColor: n,
		dataKey: i,
		activeDot: r,
		clipPath: a
	}));
}
// node_modules/recharts/es6/context/chartDataContext.js
var XP = (e) => {
	var { chartData: t } = e, n = il(), r = wp();
	return (0, v.useEffect)(() => r ? () => {} : (n(qA(t)), () => {
		n(qA(void 0));
	}), [
		t,
		n,
		r
	]), null;
}, ZP = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	padding: {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0
	}
}, QP = Rd({
	name: "brush",
	initialState: ZP,
	reducers: { setBrushSettings(e, t) {
		return t.payload == null ? ZP : t.payload;
	} }
}), { setBrushSettings: $P } = QP.actions, eF = QP.reducer, tF = (e, t) => {
	var { x: n, y: r } = e, { x: i, y: a } = t;
	return {
		x: Math.min(n, i),
		y: Math.min(r, a),
		width: Math.abs(i - n),
		height: Math.abs(a - r)
	};
}, nF = (e) => {
	var { x1: t, y1: n, x2: r, y2: i } = e;
	return tF({
		x: t,
		y: n
	}, {
		x: r,
		y: i
	});
};
function rF(e) {
	return (e % 180 + 180) % 180;
}
var iF = function(e) {
	var { width: t, height: n } = e, r = rF(arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0) * Math.PI / 180, i = Math.atan(n / t), a = r > i && r < Math.PI - i ? n / Math.sin(r) : t / Math.cos(r);
	return Math.abs(a);
}, aF = Rd({
	name: "referenceElements",
	initialState: {
		dots: [],
		areas: [],
		lines: []
	},
	reducers: {
		addDot: (e, t) => {
			e.dots.push(t.payload);
		},
		removeDot: (e, t) => {
			var n = ud(e).dots.findIndex((e) => e === t.payload);
			n !== -1 && e.dots.splice(n, 1);
		},
		addArea: (e, t) => {
			e.areas.push(t.payload);
		},
		removeArea: (e, t) => {
			var n = ud(e).areas.findIndex((e) => e === t.payload);
			n !== -1 && e.areas.splice(n, 1);
		},
		addLine: (e, t) => {
			e.lines.push(Q(t.payload));
		},
		removeLine: (e, t) => {
			var n = ud(e).lines.findIndex((e) => e === t.payload);
			n !== -1 && e.lines.splice(n, 1);
		}
	}
}), { addDot: oF, removeDot: sF, addArea: cF, removeArea: lF, addLine: uF, removeLine: dF } = aF.actions, fF = aF.reducer, pF = /*#__PURE__*/ (0, v.createContext)(void 0), mF = (e) => {
	var { children: t } = e, [n] = (0, v.useState)(`${ds("recharts")}-clip`), r = VP();
	if (r == null) return null;
	var { x: i, y: a, width: o, height: s } = r;
	return /*#__PURE__*/ v.createElement(pF.Provider, { value: n }, /*#__PURE__*/ v.createElement("defs", null, /*#__PURE__*/ v.createElement("clipPath", { id: n }, /*#__PURE__*/ v.createElement("rect", {
		x: i,
		y: a,
		height: s,
		width: o
	}))), t);
}, hF = () => (0, v.useContext)(pF), gF = class {
	constructor(e) {
		var { x: t, y: n } = e;
		this.xAxisScale = t, this.yAxisScale = n;
	}
	map(e, t) {
		var { position: n } = t;
		return {
			x: this.xAxisScale.map(e.x, { position: n }) ?? 0,
			y: this.yAxisScale.map(e.y, { position: n }) ?? 0
		};
	}
	mapWithFallback(e, t) {
		var { position: n, fallback: r } = t, i = r === "rangeMin" ? this.yAxisScale.rangeMin() : r === "rangeMax" ? this.yAxisScale.rangeMax() : 0, a = r === "rangeMin" ? this.xAxisScale.rangeMin() : r === "rangeMax" ? this.xAxisScale.rangeMax() : 0;
		return {
			x: this.xAxisScale.map(e.x, { position: n }) ?? a,
			y: this.yAxisScale.map(e.y, { position: n }) ?? i
		};
	}
	isInRange(e) {
		var { x: t, y: n } = e, r = t == null || this.xAxisScale.isInRange(t), i = n == null || this.yAxisScale.isInRange(n);
		return r && i;
	}
};
// node_modules/recharts/es6/cartesian/ReferenceLine.js
function _F(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function vF(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? _F(Object(n), !0).forEach(function(t) {
			yF(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : _F(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function yF(e, t, n) {
	return (t = bF(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function bF(e) {
	var t = xF(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function xF(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function SF() {
	return SF = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, SF.apply(null, arguments);
}
var CF = (e, t) => {
	var n;
	if (/*#__PURE__*/ v.isValidElement(e)) n = /*#__PURE__*/ v.cloneElement(e, t);
	else if (typeof e == "function") n = e(t);
	else {
		if (!X(t.x1) || !X(t.y1) || !X(t.x2) || !X(t.y2)) return null;
		n = /*#__PURE__*/ v.createElement("line", SF({}, t, { className: "recharts-reference-line-line" }));
	}
	return n;
}, wF = (e, t, n, r, i, a) => {
	var { x: o, width: s } = a, c = i.map(e, { position: n });
	if (!X(c) || t === "discard" && !i.isInRange(c)) return null;
	var l = [{
		x: o + s,
		y: c
	}, {
		x: o,
		y: c
	}];
	return r === "left" ? l.reverse() : l;
}, TF = (e, t, n, r, i, a) => {
	var { y: o, height: s } = a, c = i.map(e, { position: n });
	if (!X(c) || t === "discard" && !i.isInRange(c)) return null;
	var l = [{
		x: c,
		y: o + s
	}, {
		x: c,
		y: o
	}];
	return r === "top" ? l.reverse() : l;
}, EF = (e, t, n, r) => {
	var i = [r.mapWithFallback(e[0], {
		position: n,
		fallback: "rangeMin"
	}), r.mapWithFallback(e[1], {
		position: n,
		fallback: "rangeMax"
	})];
	return t === "discard" && i.some((e) => !r.isInRange(e)) ? null : i;
}, DF = (e, t, n, r, i, a, o) => {
	var { x: s, y: c, segment: l, ifOverflow: u } = o, d = ls(s);
	return ls(c) ? wF(c, u, r, a, t, n) : d ? TF(s, u, r, i, e, n) : l != null && l.length === 2 ? EF(l, u, r, new gF({
		x: e,
		y: t
	})) : null;
};
function OF(e) {
	var t = il();
	return (0, v.useEffect)(() => (t(uF(e)), () => {
		t(dF(e));
	})), null;
}
function kF(e) {
	var { xAxisId: t, yAxisId: n, shape: r, className: i, ifOverflow: a } = e, o = wp(), s = hF(), c = G((e) => iE(e, t)), l = G((e) => sE(e, n)), u = G((e) => ID(e, "xAxis", t, o)), d = G((e) => ID(e, "yAxis", n, o)), f = Qp();
	if (!s || !f || c == null || l == null || u == null || d == null) return null;
	var p = DF(u, d, f, e.position, c.orientation, l.orientation, e);
	if (!p) return null;
	var m = p[0], h = p[1];
	if (m == null || h == null) return null;
	var { x: g, y: _ } = m, { x: y, y: b } = h, x = vF(vF({ clipPath: a === "hidden" ? `url(#${s})` : void 0 }, Qi(e)), {}, {
		x1: g,
		y1: _,
		x2: y,
		y2: b
	}), S = nF({
		x1: g,
		y1: _,
		x2: y,
		y2: b
	});
	return /*#__PURE__*/ v.createElement(EA, { zIndex: e.zIndex }, /*#__PURE__*/ v.createElement(ca, { className: I("recharts-reference-line", i) }, CF(r, x), /*#__PURE__*/ v.createElement(LM, SF({}, S, {
		lowerWidth: S.width,
		upperWidth: S.width
	}), /*#__PURE__*/ v.createElement(ZM, { label: e.label }), e.children)));
}
var AF = {
	ifOverflow: "discard",
	xAxisId: 0,
	yAxisId: 0,
	fill: "none",
	label: !1,
	stroke: "#ccc",
	fillOpacity: 1,
	strokeWidth: 1,
	position: "middle",
	zIndex: Hv.line
};
function jF(e) {
	var t = Ws(e, AF);
	return /*#__PURE__*/ v.createElement(v.Fragment, null, /*#__PURE__*/ v.createElement(OF, {
		yAxisId: t.yAxisId,
		xAxisId: t.xAxisId,
		ifOverflow: t.ifOverflow,
		x: t.x,
		y: t.y,
		segment: t.segment
	}), /*#__PURE__*/ v.createElement(kF, t));
}
jF.displayName = "ReferenceLine";
// node_modules/recharts/es6/util/getEveryNth.js
function MF(e, t) {
	if (t < 1) return [];
	if (t === 1) return e;
	for (var n = [], r = 0; r < e.length; r += t) {
		var i = e[r];
		i !== void 0 && n.push(i);
	}
	return n;
}
// node_modules/recharts/es6/util/TickUtils.js
function NF(e, t, n) {
	return iF({
		width: e.width + t.width,
		height: e.height + t.height
	}, n);
}
function PF(e, t, n) {
	var r = n === "width", { x: i, y: a, width: o, height: s } = e;
	return t === 1 ? {
		start: r ? i : a,
		end: r ? i + o : a + s
	} : {
		start: r ? i + o : a + s,
		end: r ? i : a
	};
}
function FF(e, t, n, r, i) {
	if (e * t < e * r || e * t > e * i) return !1;
	var a = n();
	return e * (t - e * a / 2 - r) >= 0 && e * (t + e * a / 2 - i) <= 0;
}
function IF(e, t) {
	return MF(e, t + 1);
}
// node_modules/recharts/es6/cartesian/getEquidistantTicks.js
function LF(e, t, n, r, i) {
	for (var a = (r || []).slice(), { start: o, end: s } = t, c = 0, l = 1, u = o, d = function() {
		var t = r?.[c];
		if (t === void 0) return { v: MF(r, l) };
		var a = c, d, f = () => (d === void 0 && (d = n(t, a)), d), p = t.coordinate, m = c === 0 || FF(e, p, f, u, s);
		m || (c = 0, u = o, l += 1), m && (u = p + e * (f() / 2 + i), c += l);
	}, f; l <= a.length;) if (f = d(), f) return f.v;
	return [];
}
function RF(e, t, n, r, i) {
	var a = (r || []).slice().length;
	if (a === 0) return [];
	for (var { start: o, end: s } = t, c = 1; c <= a; c++) {
		for (var l = (a - 1) % c, u = o, d = !0, f = function() {
			var t = r[m];
			if (t == null) return 0;
			var a = m, o, c = () => (o === void 0 && (o = n(t, a)), o), f = t.coordinate, p = m === l || FF(e, f, c, u, s);
			if (!p) return d = !1, 1;
			p && (u = f + e * (c() / 2 + i));
		}, p, m = l; m < a && (p = f(), p === 0 || p !== 1); m += c);
		if (d) {
			for (var h = [], g = l; g < a; g += c) {
				var _ = r[g];
				_ != null && h.push(_);
			}
			return h;
		}
	}
	return [];
}
// node_modules/recharts/es6/cartesian/getTicks.js
function zF(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function BF(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? zF(Object(n), !0).forEach(function(t) {
			VF(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : zF(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function VF(e, t, n) {
	return (t = HF(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function HF(e) {
	var t = UF(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function UF(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function WF(e, t, n, r, i) {
	for (var a = (r || []).slice(), o = a.length, { start: s } = t, { end: c } = t, l = function(t) {
		var r = a[t];
		if (r == null) return 1;
		var l = r, u, d = () => (u === void 0 && (u = n(r, t)), u);
		if (t === o - 1) {
			var f = e * (l.coordinate + e * d() / 2 - c);
			a[t] = l = BF(BF({}, l), {}, { tickCoord: f > 0 ? l.coordinate - f * e : l.coordinate });
		} else a[t] = l = BF(BF({}, l), {}, { tickCoord: l.coordinate });
		l.tickCoord != null && FF(e, l.tickCoord, d, s, c) && (c = l.tickCoord - e * (d() / 2 + i), a[t] = BF(BF({}, l), {}, { isShow: !0 }));
	}, u = o - 1; u >= 0; u--) if (l(u)) continue;
	return a;
}
function GF(e, t, n, r, i, a) {
	var o = (r || []).slice(), s = o.length, { start: c, end: l } = t;
	if (a) {
		var u = r[s - 1];
		if (u != null) {
			var d = n(u, s - 1), f = e * (u.coordinate + e * d / 2 - l);
			o[s - 1] = u = BF(BF({}, u), {}, { tickCoord: f > 0 ? u.coordinate - f * e : u.coordinate }), u.tickCoord != null && FF(e, u.tickCoord, () => d, c, l) && (l = u.tickCoord - e * (d / 2 + i), o[s - 1] = BF(BF({}, u), {}, { isShow: !0 }));
		}
	}
	for (var p = a ? s - 1 : s, m = function(t) {
		var r = o[t];
		if (r == null) return 1;
		var a = r, s, u = () => (s === void 0 && (s = n(r, t)), s);
		if (t === 0) {
			var d = e * (a.coordinate - e * u() / 2 - c);
			o[t] = a = BF(BF({}, a), {}, { tickCoord: d < 0 ? a.coordinate - d * e : a.coordinate });
		} else o[t] = a = BF(BF({}, a), {}, { tickCoord: a.coordinate });
		a.tickCoord != null && FF(e, a.tickCoord, u, c, l) && (c = a.tickCoord + e * (u() / 2 + i), o[t] = BF(BF({}, a), {}, { isShow: !0 }));
	}, h = 0; h < p; h++) if (m(h)) continue;
	return o;
}
function KF(e, t, n) {
	var { tick: r, ticks: i, viewBox: a, minTickGap: o, orientation: s, interval: c, tickFormatter: l, unit: u, angle: d } = e;
	if (!i || !i.length || !r) return [];
	if (W(c) || Gh.isSsr) return IF(i, W(c) ? c : 0) ?? [];
	var f = [], p = s === "top" || s === "bottom" ? "width" : "height", m = u && p === "width" ? Pj(u, {
		fontSize: t,
		letterSpacing: n
	}) : {
		width: 0,
		height: 0
	}, h = (e, r) => {
		var i = typeof l == "function" ? l(e.value, r) : e.value;
		return p === "width" ? NF(Pj(i, {
			fontSize: t,
			letterSpacing: n
		}), m, d) : Pj(i, {
			fontSize: t,
			letterSpacing: n
		})[p];
	}, g = i[0], _ = i[1], v = i.length >= 2 && g != null && _ != null ? os(_.coordinate - g.coordinate) : 1, y = PF(a, v, p);
	return c === "equidistantPreserveStart" ? LF(v, y, h, i, o) : c === "equidistantPreserveEnd" ? RF(v, y, h, i, o) : (f = c === "preserveStart" || c === "preserveStartEnd" ? GF(v, y, h, i, o, c === "preserveStartEnd") : WF(v, y, h, i, o), f.filter((e) => e.isShow));
}
// node_modules/recharts/es6/util/YAxisUtils.js
var qF = (e) => {
	var { ticks: t, label: n, labelGapWithTick: r = 5, tickSize: i = 0, tickMargin: a = 0 } = e, o = 0;
	if (t) {
		Array.from(t).forEach((e) => {
			if (e) {
				var t = e.getBoundingClientRect();
				t.width > o && (o = t.width);
			}
		});
		var s = n ? n.getBoundingClientRect().width : 0, c = i + a, l = o + c + s + (n ? r : 0);
		return Math.round(l);
	}
	return 0;
}, JF = Rd({
	name: "renderedTicks",
	initialState: {
		xAxis: {},
		yAxis: {}
	},
	reducers: {
		setRenderedTicks: (e, t) => {
			var { axisType: n, axisId: r, ticks: i } = t.payload;
			e[n][r] = Q(i);
		},
		removeRenderedTicks: (e, t) => {
			var { axisType: n, axisId: r } = t.payload;
			delete e[n][r];
		}
	}
}), { setRenderedTicks: YF, removeRenderedTicks: XF } = JF.actions, ZF = JF.reducer, QF = [
	"axisLine",
	"width",
	"height",
	"className",
	"hide",
	"ticks",
	"axisType",
	"axisId"
];
function $F(e, t) {
	if (e == null) return {};
	var n, r, i = eI(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function eI(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function tI() {
	return tI = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, tI.apply(null, arguments);
}
function nI(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function rI(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? nI(Object(n), !0).forEach(function(t) {
			iI(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : nI(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function iI(e, t, n) {
	return (t = aI(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function aI(e) {
	var t = oI(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function oI(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var sI = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	viewBox: {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	},
	orientation: "bottom",
	ticks: [],
	stroke: "#666",
	tickLine: !0,
	axisLine: !0,
	tick: !0,
	mirror: !1,
	minTickGap: 5,
	tickSize: 6,
	tickMargin: 2,
	interval: "preserveEnd",
	zIndex: Hv.axis
};
function cI(e) {
	var { x: t, y: n, width: r, height: i, orientation: a, mirror: o, axisLine: s, otherSvgProps: c } = e;
	if (!s) return null;
	var l = rI(rI(rI({}, c), Xi(s)), {}, { fill: "none" });
	if (a === "top" || a === "bottom") {
		var u = +(a === "top" && !o || a === "bottom" && o);
		l = rI(rI({}, l), {}, {
			x1: t,
			y1: n + u * i,
			x2: t + r,
			y2: n + u * i
		});
	} else {
		var d = +(a === "left" && !o || a === "right" && o);
		l = rI(rI({}, l), {}, {
			x1: t + d * r,
			y1: n,
			x2: t + d * r,
			y2: n + i
		});
	}
	return /*#__PURE__*/ v.createElement("line", tI({}, l, { className: I("recharts-cartesian-axis-line", ns(s, "className")) }));
}
function lI(e, t, n, r, i, a, o, s, c) {
	var l, u, d, f, p, m, h = s ? -1 : 1, g = e.tickSize || o, _ = W(e.tickCoord) ? e.tickCoord : e.coordinate;
	switch (a) {
		case "top":
			l = u = e.coordinate, f = n + +!s * i, d = f - h * g, m = d - h * c, p = _;
			break;
		case "left":
			d = f = e.coordinate, u = t + +!s * r, l = u - h * g, p = l - h * c, m = _;
			break;
		case "right":
			d = f = e.coordinate, u = t + +s * r, l = u + h * g, p = l + h * c, m = _;
			break;
		default: l = u = e.coordinate, f = n + +s * i, d = f + h * g, m = d + h * c, p = _;
	}
	return {
		line: {
			x1: l,
			y1: d,
			x2: u,
			y2: f
		},
		tick: {
			x: p,
			y: m
		}
	};
}
function uI(e, t) {
	switch (e) {
		case "left": return t ? "start" : "end";
		case "right": return t ? "end" : "start";
		default: return "middle";
	}
}
function dI(e, t) {
	switch (e) {
		case "left":
		case "right": return "middle";
		case "top": return t ? "start" : "end";
		default: return t ? "end" : "start";
	}
}
function fI(e) {
	var { option: t, tickProps: n, value: r } = e, i, a = I(n.className, "recharts-cartesian-axis-tick-value");
	if (/*#__PURE__*/ v.isValidElement(t)) i = /*#__PURE__*/ v.cloneElement(t, rI(rI({}, n), {}, { className: a }));
	else if (typeof t == "function") i = t(rI(rI({}, n), {}, { className: a }));
	else {
		var o = "recharts-cartesian-axis-tick-value";
		typeof t != "boolean" && (o = I(o, yN(t))), i = /*#__PURE__*/ v.createElement(yM, tI({}, n, { className: o }), r);
	}
	return i;
}
function pI(e) {
	var { ticks: t, axisType: n, axisId: r } = e, i = il();
	return (0, v.useEffect)(() => r == null || n == null ? ys : (i(YF({
		ticks: t.map((e) => ({
			value: e.value,
			coordinate: e.coordinate,
			offset: e.offset,
			index: e.index
		})),
		axisId: r,
		axisType: n
	})), () => {
		i(XF({
			axisId: r,
			axisType: n
		}));
	}), [
		i,
		t,
		r,
		n
	]), null;
}
var mI = /*#__PURE__*/ (0, v.forwardRef)((e, t) => {
	var { ticks: n = [], tick: r, tickLine: i, stroke: a, tickFormatter: o, unit: s, padding: c, tickTextProps: l, orientation: u, mirror: d, x: f, y: p, width: m, height: h, tickSize: g, tickMargin: _, fontSize: y, letterSpacing: b, getTicksConfig: x, events: S, axisType: C, axisId: w } = e, T = KF(rI(rI({}, x), {}, { ticks: n }), y, b), E = Xi(x), D = Zi(r), O = cM(E.textAnchor) ? E.textAnchor : uI(u, d), k = dI(u, d), ee = {};
	typeof i == "object" && (ee = i);
	var te = rI(rI({}, E), {}, { fill: "none" }, ee), A = T.map((e) => rI({ entry: e }, lI(e, f, p, m, h, u, g, d, _))), j = A.map((e) => {
		var { entry: t, line: n } = e;
		return /*#__PURE__*/ v.createElement(ca, {
			className: "recharts-cartesian-axis-tick",
			key: `tick-${t.value}-${t.coordinate}-${t.tickCoord}`
		}, i && /*#__PURE__*/ v.createElement("line", tI({}, te, n, { className: I("recharts-cartesian-axis-tick-line", ns(i, "className")) })));
	}), ne = A.map((e, t) => {
		var { entry: n, tick: i } = e, u = rI(rI({}, rI(rI(rI(rI({ verticalAnchor: k }, E), {}, {
			textAnchor: O,
			stroke: "none",
			fill: a
		}, i), {}, {
			index: t,
			payload: n,
			visibleTicksCount: T.length,
			tickFormatter: o,
			padding: c
		}, l), {}, { angle: l?.angle ?? E.angle ?? 0 })), D);
		return /*#__PURE__*/ v.createElement(ca, tI({
			className: "recharts-cartesian-axis-tick-label",
			key: `tick-label-${n.value}-${n.coordinate}-${n.tickCoord}`
		}, Rs(S, n, t)), r && /*#__PURE__*/ v.createElement(fI, {
			option: r,
			tickProps: u,
			value: `${typeof o == "function" ? o(n.value, t) : n.value}${s || ""}`
		}));
	});
	return /*#__PURE__*/ v.createElement("g", { className: `recharts-cartesian-axis-ticks recharts-${C}-ticks` }, /*#__PURE__*/ v.createElement(pI, {
		ticks: T,
		axisId: w,
		axisType: C
	}), ne.length > 0 && /*#__PURE__*/ v.createElement(EA, { zIndex: Hv.label }, /*#__PURE__*/ v.createElement("g", {
		className: `recharts-cartesian-axis-tick-labels recharts-${C}-tick-labels`,
		ref: t
	}, ne)), j.length > 0 && /*#__PURE__*/ v.createElement("g", { className: `recharts-cartesian-axis-tick-lines recharts-${C}-tick-lines` }, j));
}), hI = /*#__PURE__*/ (0, v.forwardRef)((e, t) => {
	var { axisLine: n, width: r, height: i, className: a, hide: o, ticks: s, axisType: c, axisId: l } = e, u = $F(e, QF), [d, f] = (0, v.useState)(""), [p, m] = (0, v.useState)(""), h = (0, v.useRef)(null);
	(0, v.useImperativeHandle)(t, () => ({ getCalculatedWidth: () => qF({
		ticks: h.current,
		label: e.labelRef?.current,
		labelGapWithTick: 5,
		tickSize: e.tickSize,
		tickMargin: e.tickMargin
	}) }));
	var g = (0, v.useCallback)((e) => {
		if (e) {
			var t = e.getElementsByClassName("recharts-cartesian-axis-tick-value");
			h.current = t;
			var n = t[0];
			if (n) {
				var r = window.getComputedStyle(n), i = r.fontSize, a = r.letterSpacing;
				(i !== d || a !== p) && (f(i), m(a));
			}
		}
	}, [d, p]);
	return o || r != null && r <= 0 || i != null && i <= 0 ? null : /*#__PURE__*/ v.createElement(EA, { zIndex: e.zIndex }, /*#__PURE__*/ v.createElement(ca, { className: I("recharts-cartesian-axis", a) }, /*#__PURE__*/ v.createElement(cI, {
		x: e.x,
		y: e.y,
		width: r,
		height: i,
		orientation: e.orientation,
		mirror: e.mirror,
		axisLine: n,
		otherSvgProps: Xi(e)
	}), /*#__PURE__*/ v.createElement(mI, {
		ref: g,
		axisType: c,
		events: u,
		fontSize: d,
		getTicksConfig: e,
		height: e.height,
		letterSpacing: p,
		mirror: e.mirror,
		orientation: e.orientation,
		padding: e.padding,
		stroke: e.stroke,
		tick: e.tick,
		tickFormatter: e.tickFormatter,
		tickLine: e.tickLine,
		tickMargin: e.tickMargin,
		tickSize: e.tickSize,
		tickTextProps: e.tickTextProps,
		ticks: s,
		unit: e.unit,
		width: e.width,
		x: e.x,
		y: e.y,
		axisId: l
	}), /*#__PURE__*/ v.createElement(LM, {
		x: e.x,
		y: e.y,
		width: e.width,
		height: e.height,
		lowerWidth: e.width,
		upperWidth: e.width
	}, /*#__PURE__*/ v.createElement(ZM, {
		label: e.label,
		labelRef: e.labelRef
	}), e.children)));
}), gI = /*#__PURE__*/ v.forwardRef((e, t) => {
	var n = Ws(e, sI);
	return /*#__PURE__*/ v.createElement(hI, tI({}, n, { ref: t }));
});
gI.displayName = "CartesianAxis";
// node_modules/recharts/es6/cartesian/CartesianGrid.js
var _I = [
	"x1",
	"y1",
	"x2",
	"y2",
	"key"
], vI = ["offset"], yI = ["xAxisId", "yAxisId"], bI = ["xAxisId", "yAxisId"];
function xI(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function SI(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? xI(Object(n), !0).forEach(function(t) {
			CI(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : xI(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function CI(e, t, n) {
	return (t = wI(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function wI(e) {
	var t = TI(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function TI(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function EI() {
	return EI = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, EI.apply(null, arguments);
}
function DI(e, t) {
	if (e == null) return {};
	var n, r, i = OI(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function OI(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var kI = (e) => {
	var { fill: t } = e;
	if (!t || t === "none") return null;
	var { fillOpacity: n, x: r, y: i, width: a, height: o, ry: s } = e;
	return /*#__PURE__*/ v.createElement("rect", {
		x: r,
		y: i,
		ry: s,
		width: a,
		height: o,
		stroke: "none",
		fill: t,
		fillOpacity: n,
		className: "recharts-cartesian-grid-bg"
	});
};
function AI(e) {
	var { option: t, lineItemProps: n } = e, r;
	if (/*#__PURE__*/ v.isValidElement(t)) r = /*#__PURE__*/ v.cloneElement(t, n);
	else if (typeof t == "function") r = t(n);
	else {
		var { x1: i, y1: a, x2: o, y2: s, key: c } = n, l = Xi(DI(n, _I)) ?? {}, { offset: u } = l, d = DI(l, vI);
		r = /*#__PURE__*/ v.createElement("line", EI({}, d, {
			x1: i,
			y1: a,
			x2: o,
			y2: s,
			fill: "none",
			key: c
		}));
	}
	return r;
}
function jI(e) {
	var { x: t, width: n, horizontal: r = !0, horizontalPoints: i } = e;
	if (!r || !i || !i.length) return null;
	var { xAxisId: a, yAxisId: o } = e, s = DI(e, yI), c = i.map((e, i) => {
		var a = SI(SI({}, s), {}, {
			x1: t,
			y1: e,
			x2: t + n,
			y2: e,
			key: `line-${i}`,
			index: i
		});
		return /*#__PURE__*/ v.createElement(AI, {
			key: `line-${i}`,
			option: r,
			lineItemProps: a
		});
	});
	return /*#__PURE__*/ v.createElement("g", { className: "recharts-cartesian-grid-horizontal" }, c);
}
function MI(e) {
	var { y: t, height: n, vertical: r = !0, verticalPoints: i } = e;
	if (!r || !i || !i.length) return null;
	var { xAxisId: a, yAxisId: o } = e, s = DI(e, bI), c = i.map((e, i) => {
		var a = SI(SI({}, s), {}, {
			x1: e,
			y1: t,
			x2: e,
			y2: t + n,
			key: `line-${i}`,
			index: i
		});
		return /*#__PURE__*/ v.createElement(AI, {
			option: r,
			lineItemProps: a,
			key: `line-${i}`
		});
	});
	return /*#__PURE__*/ v.createElement("g", { className: "recharts-cartesian-grid-vertical" }, c);
}
function NI(e) {
	var { horizontalFill: t, fillOpacity: n, x: r, y: i, width: a, height: o, horizontalPoints: s, horizontal: c = !0 } = e;
	if (!c || !t || !t.length || s == null) return null;
	var l = s.map((e) => Math.round(e + i - i)).sort((e, t) => e - t);
	i !== l[0] && l.unshift(0);
	var u = l.map((e, s) => {
		var c = l[s + 1], u = c == null ? i + o - e : c - e;
		if (u <= 0) return null;
		var d = s % t.length;
		return /*#__PURE__*/ v.createElement("rect", {
			key: `react-${s}`,
			y: e,
			x: r,
			height: u,
			width: a,
			stroke: "none",
			fill: t[d],
			fillOpacity: n,
			className: "recharts-cartesian-grid-bg"
		});
	});
	return /*#__PURE__*/ v.createElement("g", { className: "recharts-cartesian-gridstripes-horizontal" }, u);
}
function PI(e) {
	var { vertical: t = !0, verticalFill: n, fillOpacity: r, x: i, y: a, width: o, height: s, verticalPoints: c } = e;
	if (!t || !n || !n.length) return null;
	var l = c.map((e) => Math.round(e + i - i)).sort((e, t) => e - t);
	i !== l[0] && l.unshift(0);
	var u = l.map((e, t) => {
		var c = l[t + 1], u = c == null ? i + o - e : c - e;
		if (u <= 0) return null;
		var d = t % n.length;
		return /*#__PURE__*/ v.createElement("rect", {
			key: `react-${t}`,
			x: e,
			y: a,
			width: u,
			height: s,
			stroke: "none",
			fill: n[d],
			fillOpacity: r,
			className: "recharts-cartesian-grid-bg"
		});
	});
	return /*#__PURE__*/ v.createElement("g", { className: "recharts-cartesian-gridstripes-vertical" }, u);
}
var FI = (e, t) => {
	var { xAxis: n, width: r, height: i, offset: a } = e;
	return Z(KF(SI(SI(SI({}, sI), n), {}, {
		ticks: Uf(n, !0),
		viewBox: {
			x: 0,
			y: 0,
			width: r,
			height: i
		}
	})), a.left, a.left + a.width, t);
}, II = (e, t) => {
	var { yAxis: n, width: r, height: i, offset: a } = e;
	return Z(KF(SI(SI(SI({}, sI), n), {}, {
		ticks: Uf(n, !0),
		viewBox: {
			x: 0,
			y: 0,
			width: r,
			height: i
		}
	})), a.top, a.top + a.height, t);
}, LI = {
	horizontal: !0,
	vertical: !0,
	horizontalPoints: [],
	verticalPoints: [],
	stroke: "#ccc",
	fill: "none",
	verticalFill: [],
	horizontalFill: [],
	xAxisId: 0,
	yAxisId: 0,
	syncWithTicks: !1,
	zIndex: Hv.grid
};
function RI(e) {
	var t = tm(), n = nm(), r = em(), i = SI(SI({}, Ws(e, LI)), {}, {
		x: W(e.x) ? e.x : r.left,
		y: W(e.y) ? e.y : r.top,
		width: W(e.width) ? e.width : r.width,
		height: W(e.height) ? e.height : r.height
	}), { xAxisId: a, yAxisId: o, x: s, y: c, width: l, height: u, syncWithTicks: d, horizontalValues: f, verticalValues: p } = i, m = wp(), h = G((e) => eO(e, "xAxis", a, m)), g = G((e) => eO(e, "yAxis", o, m));
	if (!Pf(l) || !Pf(u) || !W(s) || !W(c)) return null;
	var _ = i.verticalCoordinatesGenerator || FI, y = i.horizontalCoordinatesGenerator || II, { horizontalPoints: b, verticalPoints: x } = i;
	if ((!b || !b.length) && typeof y == "function") {
		var S = f && f.length, C = y({
			yAxis: g ? SI(SI({}, g), {}, { ticks: S ? f : g.ticks }) : void 0,
			width: t ?? l,
			height: n ?? u,
			offset: r
		}, S ? !0 : d);
		Ap(Array.isArray(C), `horizontalCoordinatesGenerator should return Array but instead it returned [${typeof C}]`), Array.isArray(C) && (b = C);
	}
	if ((!x || !x.length) && typeof _ == "function") {
		var w = p && p.length, T = _({
			xAxis: h ? SI(SI({}, h), {}, { ticks: w ? p : h.ticks }) : void 0,
			width: t ?? l,
			height: n ?? u,
			offset: r
		}, w ? !0 : d);
		Ap(Array.isArray(T), `verticalCoordinatesGenerator should return Array but instead it returned [${typeof T}]`), Array.isArray(T) && (x = T);
	}
	return /*#__PURE__*/ v.createElement(EA, { zIndex: i.zIndex }, /*#__PURE__*/ v.createElement("g", { className: "recharts-cartesian-grid" }, /*#__PURE__*/ v.createElement(kI, {
		fill: i.fill,
		fillOpacity: i.fillOpacity,
		x: i.x,
		y: i.y,
		width: i.width,
		height: i.height,
		ry: i.ry
	}), /*#__PURE__*/ v.createElement(NI, EI({}, i, { horizontalPoints: b })), /*#__PURE__*/ v.createElement(PI, EI({}, i, { verticalPoints: x })), /*#__PURE__*/ v.createElement(jI, EI({}, i, {
		offset: r,
		horizontalPoints: b,
		xAxis: h,
		yAxis: g
	})), /*#__PURE__*/ v.createElement(MI, EI({}, i, {
		offset: r,
		verticalPoints: x,
		xAxis: h,
		yAxis: g
	}))));
}
RI.displayName = "CartesianGrid";
// node_modules/recharts/es6/state/errorBarSlice.js
var zI = Rd({
	name: "errorBars",
	initialState: {},
	reducers: {
		addErrorBar: (e, t) => {
			var { itemId: n, errorBar: r } = t.payload;
			e[n] || (e[n] = []), e[n].push(r);
		},
		replaceErrorBar: (e, t) => {
			var { itemId: n, prev: r, next: i } = t.payload;
			e[n] && (e[n] = e[n].map((e) => e.dataKey === r.dataKey && e.direction === r.direction ? i : e));
		},
		removeErrorBar: (e, t) => {
			var { itemId: n, errorBar: r } = t.payload;
			e[n] && (e[n] = e[n].filter((e) => e.dataKey !== r.dataKey || e.direction !== r.direction));
		}
	}
}), { addErrorBar: BI, replaceErrorBar: VI, removeErrorBar: HI } = zI.actions, UI = zI.reducer, WI = ["children"];
function GI(e, t) {
	if (e == null) return {};
	var n, r, i = KI(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function KI(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var qI = /*#__PURE__*/ (0, v.createContext)({
	data: [],
	xAxisId: "xAxis-0",
	yAxisId: "yAxis-0",
	dataPointFormatter: () => ({
		x: 0,
		y: 0,
		value: 0
	}),
	errorBarOffset: 0
});
function JI(e) {
	var { children: t } = e, n = GI(e, WI);
	return /*#__PURE__*/ v.createElement(qI.Provider, { value: n }, t);
}
// node_modules/recharts/es6/cartesian/GraphicalItemClipPath.js
function YI(e, t) {
	var n = G((t) => iE(t, e)), r = G((e) => sE(e, t)), i = n?.allowDataOverflow ?? nE.allowDataOverflow, a = r?.allowDataOverflow ?? aE.allowDataOverflow;
	return {
		needClip: i || a,
		needClipX: i,
		needClipY: a
	};
}
function XI(e) {
	var { xAxisId: t, yAxisId: n, clipPathId: r } = e, i = VP(), { needClipX: a, needClipY: o, needClip: s } = YI(t, n);
	if (!s || !i) return null;
	var { x: c, y: l, width: u, height: d } = i;
	return /*#__PURE__*/ v.createElement("clipPath", { id: `clipPath-${r}` }, /*#__PURE__*/ v.createElement("rect", {
		x: a ? c : c - u / 2,
		y: o ? l : l - d / 2,
		width: a ? u : u * 2,
		height: o ? d : d * 2
	}));
}
// node_modules/recharts/es6/state/selectors/lineSelectors.js
var ZI = (e, t, n, r) => rO(e, "xAxis", t, r), QI = (e, t, n, r) => nO(e, "xAxis", t, r), $I = (e, t, n, r) => rO(e, "yAxis", n, r), eL = (e, t, n, r) => nO(e, "yAxis", n, r), tL = K([
	rm,
	ZI,
	$I,
	QI,
	eL
], (e, t, n, r, i) => Hf(e, "xAxis") ? Qf(t, r, !1) : Qf(n, i, !1)), nL = (e, t, n, r, i) => i;
function rL(e) {
	return e.type === "line";
}
var iL = K([
	rm,
	ZI,
	$I,
	QI,
	eL,
	K([hE, nL], (e, t) => e.filter(rL).find((e) => e.id === t)),
	tL,
	xv
], (e, t, n, r, i, a, o, s) => {
	var { chartData: c, dataStartIndex: l, dataEndIndex: u } = s;
	if (!(a == null || t == null || n == null || r == null || i == null || r.length === 0 || i.length === 0 || o == null || e !== "horizontal" && e !== "vertical")) {
		var { dataKey: d, data: f } = a, p = f != null && f.length > 0 ? f : c?.slice(l, u + 1);
		if (p != null) return ML({
			layout: e,
			xAxis: t,
			yAxis: n,
			xAxisTicks: r,
			yAxisTicks: i,
			dataKey: d,
			bandSize: o,
			displayedData: p
		});
	}
});
// node_modules/recharts/es6/util/getRadiusAndStrokeWidthFromDot.js
function aL(e) {
	var t = Zi(e), n = 3, r = 2;
	if (t != null) {
		var { r: i, strokeWidth: a } = t, o = Number(i), s = Number(a);
		return (Number.isNaN(o) || o < 0) && (o = n), (Number.isNaN(s) || s < 0) && (s = r), {
			r: o,
			strokeWidth: s
		};
	}
	return {
		r: n,
		strokeWidth: r
	};
}
// node_modules/recharts/es6/cartesian/Line.js
var oL = ["id"], sL = [
	"type",
	"layout",
	"connectNulls",
	"needClip",
	"shape"
], cL = [
	"activeDot",
	"animateNewValues",
	"animationBegin",
	"animationDuration",
	"animationEasing",
	"connectNulls",
	"dot",
	"hide",
	"isAnimationActive",
	"label",
	"legendType",
	"xAxisId",
	"yAxisId",
	"id"
];
function lL() {
	return lL = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, lL.apply(null, arguments);
}
function uL(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function dL(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? uL(Object(n), !0).forEach(function(t) {
			fL(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : uL(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function fL(e, t, n) {
	return (t = pL(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function pL(e) {
	var t = mL(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function mL(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function hL(e, t) {
	if (e == null) return {};
	var n, r, i = gL(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function gL(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var _L = (e) => {
	var { dataKey: t, name: n, stroke: r, legendType: i, hide: a } = e;
	return [{
		inactive: a,
		dataKey: t,
		type: i,
		color: r,
		value: ep(n, t),
		payload: e
	}];
}, vL = /*#__PURE__*/ v.memo((e) => {
	var { dataKey: t, data: n, stroke: r, strokeWidth: i, fill: a, name: o, hide: s, unit: c, tooltipType: l, id: u } = e, d = {
		dataDefinedOnItem: n,
		getPosition: ys,
		settings: {
			stroke: r,
			strokeWidth: i,
			fill: a,
			dataKey: t,
			nameKey: void 0,
			name: ep(o, t),
			hide: s,
			type: l,
			color: r,
			unit: c,
			graphicalItemId: u
		}
	};
	return /*#__PURE__*/ v.createElement(XN, { tooltipEntrySettings: d });
}), yL = (e, t) => `${t}px ${e}px`;
function bL(e, t) {
	for (var n = e.length % 2 == 0 ? e : [...e, 0], r = [], i = 0; i < t; ++i) r.push(...n);
	return r;
}
var xL = (e, t, n) => {
	var r = n.reduce((e, t) => e + t, 0);
	if (!r) return yL(t, e);
	for (var i = Math.floor(e / r), a = e % r, o = [], s = 0, c = 0; s < n.length; c += (l = n[s]) ?? 0, ++s) {
		var l, u = n[s];
		if (u != null && c + u > a) {
			o = [...n.slice(0, s), a - c];
			break;
		}
	}
	var d = o.length % 2 == 0 ? [0, t] : [t];
	return [
		...bL(n, i),
		...o,
		...d
	].map((e) => `${e}px`).join(", ");
};
function SL(e) {
	var { clipPathId: t, points: n, props: r } = e, { dot: i, dataKey: a, needClip: o } = r, { id: s } = r, c = Xi(hL(r, oL));
	return /*#__PURE__*/ v.createElement(SP, {
		points: n,
		dot: i,
		className: "recharts-line-dots",
		dotClassName: "recharts-line-dot",
		dataKey: a,
		baseProps: c,
		needClip: o,
		clipPathId: t
	});
}
function CL(e) {
	var { showLabels: t, children: n, points: r } = e, i = (0, v.useMemo)(() => r?.map((e) => {
		var t = {
			x: e.x ?? 0,
			y: e.y ?? 0,
			width: 0,
			lowerWidth: 0,
			upperWidth: 0,
			height: 0
		};
		return dL(dL({}, t), {}, {
			value: e.value,
			payload: e.payload,
			viewBox: t,
			parentViewBox: void 0,
			fill: void 0
		});
	}), [r]);
	return /*#__PURE__*/ v.createElement(aN, { value: t ? i : void 0 }, n);
}
function wL(e) {
	var { clipPathId: t, pathRef: n, points: r, strokeDasharray: i, props: a } = e, { type: o, layout: s, connectNulls: c, needClip: l, shape: u } = a, d = dL(dL({}, Qi(hL(a, sL))), {}, {
		fill: "none",
		className: "recharts-line-curve",
		clipPath: l ? `url(#clipPath-${t})` : void 0,
		points: r,
		type: o,
		layout: s,
		connectNulls: c,
		strokeDasharray: i ?? a.strokeDasharray
	});
	return /*#__PURE__*/ v.createElement(v.Fragment, null, r?.length > 1 && /*#__PURE__*/ v.createElement(YN, lL({
		shapeType: "curve",
		option: u
	}, d, { pathRef: n })), /*#__PURE__*/ v.createElement(SL, {
		points: r,
		clipPathId: t,
		props: a
	}));
}
function TL(e) {
	try {
		return e && e.getTotalLength && e.getTotalLength() || 0;
	} catch {
		return 0;
	}
}
function EL(e) {
	var { clipPathId: t, props: n, pathRef: r, previousPointsRef: i, longestAnimatedLengthRef: a } = e, { points: o, strokeDasharray: s, isAnimationActive: c, animationBegin: l, animationDuration: u, animationEasing: d, animateNewValues: f, width: p, height: m, onAnimationEnd: h, onAnimationStart: g } = n, _ = i.current, y = m_(o, "recharts-line-"), b = (0, v.useRef)(y), [x, S] = (0, v.useState)(!1), C = !x, w = (0, v.useCallback)(() => {
		typeof h == "function" && h(), S(!1);
	}, [h]), T = (0, v.useCallback)(() => {
		typeof g == "function" && g(), S(!0);
	}, [g]), E = TL(r.current), D = (0, v.useRef)(0);
	b.current !== y && (D.current = a.current, b.current = y);
	var O = D.current;
	return /*#__PURE__*/ v.createElement(CL, {
		points: o,
		showLabels: C
	}, n.children, /*#__PURE__*/ v.createElement(p_, {
		animationId: y,
		begin: l,
		duration: u,
		isActive: c,
		easing: d,
		onAnimationEnd: w,
		onAnimationStart: T,
		key: y
	}, (e) => {
		var l = ms(O, E + O, e), u = Math.min(l, E), d = c ? s ? xL(u, E, `${s}`.split(/[,\s]+/gim).map((e) => parseFloat(e))) : yL(E, u) : s == null ? void 0 : String(s);
		if (e > 0 && E > 0 && (i.current = o, a.current = Math.max(a.current, u)), _) {
			var h = _.length / o.length, g = e === 1 ? o : o.map((t, n) => {
				var r = Math.floor(n * h);
				if (_[r]) {
					var i = _[r];
					return dL(dL({}, t), {}, {
						x: ms(i.x, t.x, e),
						y: ms(i.y, t.y, e)
					});
				}
				return f ? dL(dL({}, t), {}, {
					x: ms(p * 2, t.x, e),
					y: ms(m / 2, t.y, e)
				}) : dL(dL({}, t), {}, {
					x: t.x,
					y: t.y
				});
			});
			return i.current = g, /*#__PURE__*/ v.createElement(wL, {
				props: n,
				points: g,
				clipPathId: t,
				pathRef: r,
				strokeDasharray: d
			});
		}
		return /*#__PURE__*/ v.createElement(wL, {
			props: n,
			points: o,
			clipPathId: t,
			pathRef: r,
			strokeDasharray: d
		});
	}), /*#__PURE__*/ v.createElement(uN, { label: n.label }));
}
function DL(e) {
	var { clipPathId: t, props: n } = e, r = (0, v.useRef)(null), i = (0, v.useRef)(0), a = (0, v.useRef)(null);
	return /*#__PURE__*/ v.createElement(EL, {
		props: n,
		clipPathId: t,
		previousPointsRef: r,
		longestAnimatedLengthRef: i,
		pathRef: a
	});
}
var OL = (e, t) => ({
	x: e.x ?? void 0,
	y: e.y ?? void 0,
	value: e.value,
	errorVal: Bf(e.payload, t)
}), kL = class extends v.Component {
	render() {
		var { hide: e, dot: t, points: n, className: r, xAxisId: i, yAxisId: a, top: o, left: s, width: c, height: l, id: u, needClip: d, zIndex: f } = this.props;
		if (e) return null;
		var p = I("recharts-line", r), m = u, { r: h, strokeWidth: g } = aL(t), _ = bN(t), y = h * 2 + g, b = d ? `url(#clipPath-${_ ? "" : "dots-"}${m})` : void 0;
		return /*#__PURE__*/ v.createElement(EA, { zIndex: f }, /*#__PURE__*/ v.createElement(ca, { className: p }, d && /*#__PURE__*/ v.createElement("defs", null, /*#__PURE__*/ v.createElement(XI, {
			clipPathId: m,
			xAxisId: i,
			yAxisId: a
		}), !_ && /*#__PURE__*/ v.createElement("clipPath", { id: `clipPath-dots-${m}` }, /*#__PURE__*/ v.createElement("rect", {
			x: s - y / 2,
			y: o - y / 2,
			width: c + y,
			height: l + y
		}))), /*#__PURE__*/ v.createElement(JI, {
			xAxisId: i,
			yAxisId: a,
			data: n,
			dataPointFormatter: OL,
			errorBarOffset: 0
		}, /*#__PURE__*/ v.createElement(DL, {
			props: this.props,
			clipPathId: m
		}))), /*#__PURE__*/ v.createElement(YP, {
			activeDot: this.props.activeDot,
			points: n,
			mainColor: this.props.stroke,
			itemDataKey: this.props.dataKey,
			clipPath: b
		}));
	}
}, AL = {
	activeDot: !0,
	animateNewValues: !0,
	animationBegin: 0,
	animationDuration: 1500,
	animationEasing: "ease",
	connectNulls: !1,
	dot: !0,
	fill: "#fff",
	hide: !1,
	isAnimationActive: "auto",
	label: !1,
	legendType: "line",
	stroke: "#3182bd",
	strokeWidth: 1,
	xAxisId: 0,
	yAxisId: 0,
	zIndex: Hv.line,
	type: "linear"
};
function jL(e) {
	var t = Ws(e, AL), { activeDot: n, animateNewValues: r, animationBegin: i, animationDuration: a, animationEasing: o, connectNulls: s, dot: c, hide: l, isAnimationActive: u, label: d, legendType: f, xAxisId: p, yAxisId: m, id: h } = t, g = hL(t, cL), { needClip: _ } = YI(p, m), y = VP(), b = im(), x = wp(), S = G((e) => iL(e, p, m, x, h));
	if (b !== "horizontal" && b !== "vertical" || S == null || y == null) return null;
	var { height: C, width: w, x: T, y: E } = y;
	return /*#__PURE__*/ v.createElement(kL, lL({}, g, {
		id: h,
		connectNulls: s,
		dot: c,
		activeDot: n,
		animateNewValues: r,
		animationBegin: i,
		animationDuration: a,
		animationEasing: o,
		isAnimationActive: u,
		hide: l,
		label: d,
		legendType: f,
		xAxisId: p,
		yAxisId: m,
		points: S,
		layout: b,
		height: C,
		width: w,
		left: T,
		top: E,
		needClip: _
	}));
}
function ML(e) {
	var { layout: t, xAxis: n, yAxis: r, xAxisTicks: i, yAxisTicks: a, dataKey: o, bandSize: s, displayedData: c } = e;
	return c.map((e, c) => {
		var l = Bf(e, o);
		if (t === "horizontal") return {
			x: Kf({
				axis: n,
				ticks: i,
				bandSize: s,
				entry: e,
				index: c
			}),
			y: (gs(l) ? null : r.scale.map(l)) ?? null,
			value: l,
			payload: e
		};
		var u = gs(l) ? null : n.scale.map(l), d = Kf({
			axis: r,
			ticks: a,
			bandSize: s,
			entry: e,
			index: c
		});
		return u == null || d == null ? null : {
			x: u,
			y: d,
			value: l,
			payload: e
		};
	}).filter(Boolean);
}
function NL(e) {
	var t = Ws(e, AL), n = wp();
	return /*#__PURE__*/ v.createElement(tP, {
		id: t.id,
		type: "line"
	}, (e) => /*#__PURE__*/ v.createElement(v.Fragment, null, /*#__PURE__*/ v.createElement(ZN, { legendPayload: _L(t) }), /*#__PURE__*/ v.createElement(vL, {
		dataKey: t.dataKey,
		data: t.data,
		stroke: t.stroke,
		strokeWidth: t.strokeWidth,
		fill: t.fill,
		name: t.name,
		hide: t.hide,
		unit: t.unit,
		tooltipType: t.tooltipType,
		id: e
	}), /*#__PURE__*/ v.createElement(uP, {
		type: "line",
		id: e,
		data: t.data,
		xAxisId: t.xAxisId,
		yAxisId: t.yAxisId,
		zAxisId: 0,
		dataKey: t.dataKey,
		hide: t.hide,
		isPanorama: n
	}), /*#__PURE__*/ v.createElement(jL, lL({}, t, { id: e }))));
}
var PL = /*#__PURE__*/ v.memo(NL, Oh);
PL.displayName = "Line";
// node_modules/recharts/es6/util/axisPropsAreEqual.js
var FL = ["domain", "range"], IL = ["domain", "range"];
function LL(e, t) {
	if (e == null) return {};
	var n, r, i = RL(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function RL(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function zL(e, t) {
	return e === t ? !0 : Array.isArray(e) && e.length === 2 && Array.isArray(t) && t.length === 2 ? e[0] === t[0] && e[1] === t[1] : !1;
}
function BL(e, t) {
	if (e === t) return !0;
	var { domain: n, range: r } = e, i = LL(e, FL), { domain: a, range: o } = t, s = LL(t, IL);
	return !zL(n, a) || !zL(r, o) ? !1 : Oh(i, s);
}
// node_modules/recharts/es6/cartesian/XAxis.js
var VL = ["type"], HL = [
	"dangerouslySetInnerHTML",
	"ticks",
	"scale"
], UL = ["id", "scale"];
function WL() {
	return WL = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, WL.apply(null, arguments);
}
function GL(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function KL(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? GL(Object(n), !0).forEach(function(t) {
			qL(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : GL(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function qL(e, t, n) {
	return (t = JL(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function JL(e) {
	var t = YL(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function YL(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function XL(e, t) {
	if (e == null) return {};
	var n, r, i = ZL(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function ZL(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function QL(e) {
	var t = il(), n = (0, v.useRef)(null), r = am(), { type: i } = e, a = XL(e, VL), o = Kv(r, "xAxis", i), s = (0, v.useMemo)(() => {
		if (o != null) return KL(KL({}, a), {}, { type: o });
	}, [a, o]);
	return (0, v.useLayoutEffect)(() => {
		s != null && (n.current === null ? t(kP(s)) : n.current !== s && t(AP({
			prev: n.current,
			next: s
		})), n.current = s);
	}, [s, t]), (0, v.useLayoutEffect)(() => () => {
		n.current &&= (t(jP(n.current)), null);
	}, [t]), null;
}
var $L = (e) => {
	var { xAxisId: t, className: n } = e, r = G(Sp), i = wp(), a = "xAxis", o = G((e) => tO(e, a, t, i)), s = G((e) => WD(e, t)), c = G((e) => YD(e, t)), l = G((e) => rE(e, t));
	if (s == null || c == null || l == null) return null;
	var { dangerouslySetInnerHTML: u, ticks: d, scale: f } = e, p = XL(e, HL), { id: m, scale: h } = l, g = XL(l, UL);
	return /*#__PURE__*/ v.createElement(gI, WL({}, p, g, {
		x: c.x,
		y: c.y,
		width: s.width,
		height: s.height,
		className: I(`recharts-${a} ${a}`, n),
		viewBox: r,
		ticks: o,
		axisType: a,
		axisId: t
	}));
}, eR = {
	allowDataOverflow: nE.allowDataOverflow,
	allowDecimals: nE.allowDecimals,
	allowDuplicatedCategory: nE.allowDuplicatedCategory,
	angle: nE.angle,
	axisLine: sI.axisLine,
	height: nE.height,
	hide: !1,
	includeHidden: nE.includeHidden,
	interval: nE.interval,
	label: !1,
	minTickGap: nE.minTickGap,
	mirror: nE.mirror,
	orientation: nE.orientation,
	padding: nE.padding,
	reversed: nE.reversed,
	scale: nE.scale,
	tick: nE.tick,
	tickCount: nE.tickCount,
	tickLine: sI.tickLine,
	tickSize: sI.tickSize,
	type: nE.type,
	niceTicks: nE.niceTicks,
	xAxisId: 0
}, tR = /*#__PURE__*/ v.memo((e) => {
	var t = Ws(e, eR);
	return /*#__PURE__*/ v.createElement(v.Fragment, null, /*#__PURE__*/ v.createElement(QL, {
		allowDataOverflow: t.allowDataOverflow,
		allowDecimals: t.allowDecimals,
		allowDuplicatedCategory: t.allowDuplicatedCategory,
		angle: t.angle,
		dataKey: t.dataKey,
		domain: t.domain,
		height: t.height,
		hide: t.hide,
		id: t.xAxisId,
		includeHidden: t.includeHidden,
		interval: t.interval,
		minTickGap: t.minTickGap,
		mirror: t.mirror,
		name: t.name,
		orientation: t.orientation,
		padding: t.padding,
		reversed: t.reversed,
		scale: t.scale,
		tick: t.tick,
		tickCount: t.tickCount,
		tickFormatter: t.tickFormatter,
		ticks: t.ticks,
		type: t.type,
		unit: t.unit,
		niceTicks: t.niceTicks
	}), /*#__PURE__*/ v.createElement($L, t));
}, BL);
tR.displayName = "XAxis";
// node_modules/recharts/es6/cartesian/YAxis.js
var nR = ["type"], rR = [
	"dangerouslySetInnerHTML",
	"ticks",
	"scale"
], iR = ["id", "scale"];
function aR() {
	return aR = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, aR.apply(null, arguments);
}
function oR(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function sR(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? oR(Object(n), !0).forEach(function(t) {
			cR(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : oR(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function cR(e, t, n) {
	return (t = lR(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function lR(e) {
	var t = uR(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function uR(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function dR(e, t) {
	if (e == null) return {};
	var n, r, i = fR(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function fR(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function pR(e) {
	var t = il(), n = (0, v.useRef)(null), r = am(), { type: i } = e, a = dR(e, nR), o = Kv(r, "yAxis", i), s = (0, v.useMemo)(() => {
		if (o != null) return sR(sR({}, a), {}, { type: o });
	}, [o, a]);
	return (0, v.useLayoutEffect)(() => {
		s != null && (n.current === null ? t(MP(s)) : n.current !== s && t(NP({
			prev: n.current,
			next: s
		})), n.current = s);
	}, [s, t]), (0, v.useLayoutEffect)(() => () => {
		n.current &&= (t(PP(n.current)), null);
	}, [t]), null;
}
function mR(e) {
	var { yAxisId: t, className: n, width: r, label: i } = e, a = (0, v.useRef)(null), o = (0, v.useRef)(null), s = G(Sp), c = wp(), l = il(), u = "yAxis", d = G((e) => ZD(e, t)), f = G((e) => XD(e, t)), p = G((e) => tO(e, u, t, c)), m = G((e) => oE(e, t));
	if ((0, v.useLayoutEffect)(() => {
		if (!(r !== "auto" || !d || HM(i) || /*#__PURE__*/ (0, v.isValidElement)(i) || m == null)) {
			var e = a.current;
			if (e) {
				var n = e.getCalculatedWidth();
				Math.round(d.width) !== Math.round(n) && l(RP({
					id: t,
					width: n
				}));
			}
		}
	}, [
		p,
		d,
		l,
		i,
		t,
		r,
		m
	]), d == null || f == null || m == null) return null;
	var { dangerouslySetInnerHTML: h, ticks: g, scale: _ } = e, y = dR(e, rR), { id: b, scale: x } = m, S = dR(m, iR);
	return /*#__PURE__*/ v.createElement(gI, aR({}, y, S, {
		ref: a,
		labelRef: o,
		x: f.x,
		y: f.y,
		tickTextProps: r === "auto" ? { width: void 0 } : { width: r },
		width: d.width,
		height: d.height,
		className: I(`recharts-${u} ${u}`, n),
		viewBox: s,
		ticks: p,
		axisType: u,
		axisId: t
	}));
}
var hR = {
	allowDataOverflow: aE.allowDataOverflow,
	allowDecimals: aE.allowDecimals,
	allowDuplicatedCategory: aE.allowDuplicatedCategory,
	angle: aE.angle,
	axisLine: sI.axisLine,
	hide: !1,
	includeHidden: aE.includeHidden,
	interval: aE.interval,
	label: !1,
	minTickGap: aE.minTickGap,
	mirror: aE.mirror,
	orientation: aE.orientation,
	padding: aE.padding,
	reversed: aE.reversed,
	scale: aE.scale,
	tick: aE.tick,
	tickCount: aE.tickCount,
	tickLine: sI.tickLine,
	tickSize: sI.tickSize,
	type: aE.type,
	niceTicks: aE.niceTicks,
	width: aE.width,
	yAxisId: 0
}, gR = /*#__PURE__*/ v.memo((e) => {
	var t = Ws(e, hR);
	return /*#__PURE__*/ v.createElement(v.Fragment, null, /*#__PURE__*/ v.createElement(pR, {
		interval: t.interval,
		id: t.yAxisId,
		scale: t.scale,
		type: t.type,
		domain: t.domain,
		allowDataOverflow: t.allowDataOverflow,
		dataKey: t.dataKey,
		allowDuplicatedCategory: t.allowDuplicatedCategory,
		allowDecimals: t.allowDecimals,
		tickCount: t.tickCount,
		padding: t.padding,
		includeHidden: t.includeHidden,
		reversed: t.reversed,
		ticks: t.ticks,
		width: t.width,
		orientation: t.orientation,
		mirror: t.mirror,
		hide: t.hide,
		unit: t.unit,
		name: t.name,
		angle: t.angle,
		minTickGap: t.minTickGap,
		tick: t.tick,
		tickFormatter: t.tickFormatter,
		niceTicks: t.niceTicks
	}), /*#__PURE__*/ v.createElement(mR, t));
}, BL);
gR.displayName = "YAxis";
var _R = K([
	(e, t) => t,
	rm,
	cy,
	_y,
	gk,
	vk,
	Zk,
	bp
], lA);
// node_modules/recharts/es6/util/getRelativeCoordinate.js
function vR(e) {
	return "getBBox" in e.currentTarget && typeof e.currentTarget.getBBox == "function";
}
function yR(e) {
	var t = e.currentTarget.getBoundingClientRect(), n, r;
	if (vR(e)) {
		var i = e.currentTarget.getBBox();
		n = i.width > 0 ? t.width / i.width : 1, r = i.height > 0 ? t.height / i.height : 1;
	} else {
		var a = e.currentTarget;
		n = a.offsetWidth > 0 ? t.width / a.offsetWidth : 1, r = a.offsetHeight > 0 ? t.height / a.offsetHeight : 1;
	}
	var o = (e, i) => ({
		relativeX: Math.round((e - t.left) / n),
		relativeY: Math.round((i - t.top) / r)
	});
	return "touches" in e ? Array.from(e.touches).map((e) => o(e.clientX, e.clientY)) : o(e.clientX, e.clientY);
}
// node_modules/recharts/es6/state/mouseEventsMiddleware.js
var bR = _d("mouseClick"), xR = Tf();
xR.startListening({
	actionCreator: bR,
	effect: (e, t) => {
		var n = e.payload, r = _R(t.getState(), yR(n));
		r?.activeIndex != null && t.dispatch(CO({
			activeIndex: r.activeIndex,
			activeDataKey: void 0,
			activeCoordinate: r.activeCoordinate
		}));
	}
});
var SR = _d("mouseMove"), CR = Tf(), wR = null, TR = null, ER = null;
CR.startListening({
	actionCreator: SR,
	effect: (e, t) => {
		var n = e.payload, { throttleDelay: r, throttledEvents: i } = t.getState().eventSettings, a = i === "all" || i?.includes("mousemove");
		wR !== null && (cancelAnimationFrame(wR), wR = null), TR === null || typeof r == "number" && a || (clearTimeout(TR), TR = null), ER = yR(n);
		var o = () => {
			var e = t.getState(), n = cO(e, e.tooltip.settings.shared);
			if (!ER) wR = null, TR = null;
			else {
				if (n === "axis") {
					var r = _R(e, ER);
					r?.activeIndex == null ? t.dispatch(bO()) : t.dispatch(SO({
						activeIndex: r.activeIndex,
						activeDataKey: void 0,
						activeCoordinate: r.activeCoordinate
					}));
				}
				wR = null, TR = null;
			}
		};
		a ? r === "raf" ? wR = requestAnimationFrame(o) : typeof r == "number" && TR === null && (TR = setTimeout(o, r)) : o();
	}
});
// node_modules/recharts/es6/state/reduxDevtoolsJsonStringifyReplacer.js
function DR(e, t) {
	return t instanceof HTMLElement ? `HTMLElement <${t.tagName} class="${t.className}">` : t === window ? "global.window" : e === "children" && typeof t == "object" && t ? "<<CHILDREN>>" : t;
}
// node_modules/recharts/es6/state/rootPropsSlice.js
var OR = {
	accessibilityLayer: !0,
	barCategoryGap: "10%",
	barGap: 4,
	barSize: void 0,
	className: void 0,
	maxBarSize: void 0,
	stackOffset: "none",
	syncId: void 0,
	syncMethod: "index",
	baseValue: void 0,
	reverseStackOrder: !1
}, kR = Rd({
	name: "rootProps",
	initialState: OR,
	reducers: { updateOptions: (e, t) => {
		e.accessibilityLayer = t.payload.accessibilityLayer, e.barCategoryGap = t.payload.barCategoryGap, e.barGap = t.payload.barGap ?? OR.barGap, e.barSize = t.payload.barSize, e.maxBarSize = t.payload.maxBarSize, e.stackOffset = t.payload.stackOffset, e.syncId = t.payload.syncId, e.syncMethod = t.payload.syncMethod, e.className = t.payload.className, e.baseValue = t.payload.baseValue, e.reverseStackOrder = t.payload.reverseStackOrder;
	} }
}), AR = kR.reducer, { updateOptions: jR } = kR.actions, MR = Rd({
	name: "polarOptions",
	initialState: null,
	reducers: { updatePolarOptions: (e, t) => e === null ? t.payload : (e.startAngle = t.payload.startAngle, e.endAngle = t.payload.endAngle, e.cx = t.payload.cx, e.cy = t.payload.cy, e.innerRadius = t.payload.innerRadius, e.outerRadius = t.payload.outerRadius, e) }
}), { updatePolarOptions: NR } = MR.actions, PR = MR.reducer, FR = _d("keyDown"), IR = _d("focus"), LR = _d("blur"), RR = Tf(), zR = null, BR = null, VR = null;
RR.startListening({
	actionCreator: FR,
	effect: (e, t) => {
		VR = e.payload, zR !== null && (cancelAnimationFrame(zR), zR = null);
		var { throttleDelay: n, throttledEvents: r } = t.getState().eventSettings, i = r === "all" || r.includes("keydown");
		BR === null || typeof n == "number" && i || (clearTimeout(BR), BR = null);
		var a = () => {
			try {
				var e = t.getState();
				if (e.rootProps.accessibilityLayer === !1) return;
				var { keyboardInteraction: n } = e.tooltip, r = VR;
				if (r !== "ArrowRight" && r !== "ArrowLeft" && r !== "Enter") return;
				var i = RO(n, ik(e), IE(e), pk(e)), a = i == null ? -1 : Number(i);
				if (!Number.isFinite(a) || a < 0) return;
				var o = vk(e);
				if (r === "Enter") {
					var s = nA(e, "axis", "hover", String(n.index));
					t.dispatch(TO({
						active: !n.active,
						activeIndex: n.index,
						activeCoordinate: s
					}));
					return;
				}
				var c = iO(e) === "left-to-right" ? 1 : -1, l = a + (r === "ArrowRight" ? 1 : -1) * c;
				if (o == null || l >= o.length || l < 0) return;
				var u = nA(e, "axis", "hover", String(l));
				t.dispatch(TO({
					active: !0,
					activeIndex: l.toString(),
					activeCoordinate: u
				}));
			} finally {
				zR = null, BR = null;
			}
		};
		i ? n === "raf" ? zR = requestAnimationFrame(a) : typeof n == "number" && BR === null && (a(), VR = null, BR = setTimeout(() => {
			VR ? a() : (BR = null, zR = null);
		}, n)) : a();
	}
}), RR.startListening({
	actionCreator: IR,
	effect: (e, t) => {
		var n = t.getState();
		if (n.rootProps.accessibilityLayer !== !1) {
			var { keyboardInteraction: r } = n.tooltip;
			if (!r.active && r.index == null) {
				var i = "0", a = nA(n, "axis", "hover", String(i));
				t.dispatch(TO({
					active: !0,
					activeIndex: i,
					activeCoordinate: a
				}));
			}
		}
	}
}), RR.startListening({
	actionCreator: LR,
	effect: (e, t) => {
		var n = t.getState();
		if (n.rootProps.accessibilityLayer !== !1) {
			var { keyboardInteraction: r } = n.tooltip;
			r.active && t.dispatch(TO({
				active: !1,
				activeIndex: r.index,
				activeCoordinate: r.coordinate
			}));
		}
	}
});
// node_modules/recharts/es6/util/createEventProxy.js
function HR(e) {
	e.persist();
	var { currentTarget: t } = e;
	return new Proxy(e, { get: (e, n) => {
		if (n === "currentTarget") return t;
		var r = Reflect.get(e, n);
		return typeof r == "function" ? r.bind(e) : r;
	} });
}
// node_modules/recharts/es6/state/externalEventsMiddleware.js
var UR = _d("externalEvent"), WR = Tf(), GR = /* @__PURE__ */ new Map(), KR = /* @__PURE__ */ new Map(), qR = /* @__PURE__ */ new Map();
WR.startListening({
	actionCreator: UR,
	effect: (e, t) => {
		var { handler: n, reactEvent: r } = e.payload;
		if (n != null) {
			var i = r.type, a = HR(r);
			qR.set(i, {
				handler: n,
				reactEvent: a
			});
			var o = GR.get(i);
			o !== void 0 && (cancelAnimationFrame(o), GR.delete(i));
			var { throttleDelay: s, throttledEvents: c } = t.getState().eventSettings, l = c, u = l === "all" || l?.includes(i), d = KR.get(i);
			d === void 0 || typeof s == "number" && u || (clearTimeout(d), KR.delete(i));
			var f = () => {
				var e = qR.get(i);
				try {
					if (!e) return;
					var { handler: n, reactEvent: r } = e, a = t.getState(), o = {
						activeCoordinate: Ok(a),
						activeDataKey: Tk(a),
						activeIndex: Ck(a),
						activeLabel: wk(a),
						activeTooltipIndex: Ck(a),
						isTooltipActive: kk(a)
					};
					n && n(o, r);
				} finally {
					GR.delete(i), KR.delete(i), qR.delete(i);
				}
			};
			if (!u) f();
			else if (s === "raf") {
				var p = requestAnimationFrame(f);
				GR.set(i, p);
			} else if (typeof s == "number") {
				if (!KR.has(i)) {
					f();
					var m = setTimeout(f, s);
					KR.set(i, m);
				}
			} else f();
		}
	}
});
var JR = K([
	K([HO], (e) => e.tooltipItemPayloads),
	(e, t) => t,
	(e, t, n) => n
], (e, t, n) => {
	if (t != null) {
		var r = e.find((e) => e.settings.graphicalItemId === n);
		if (r != null) {
			var { getPosition: i } = r;
			if (i != null) return i(t);
		}
	}
}), YR = _d("touchMove"), XR = Tf(), ZR = null, QR = null, $R = null, ez = null;
XR.startListening({
	actionCreator: YR,
	effect: (e, t) => {
		var n = e.payload;
		if (n.touches != null && n.touches.length !== 0) {
			ez = HR(n);
			var { throttleDelay: r, throttledEvents: i } = t.getState().eventSettings, a = i === "all" || i.includes("touchmove");
			ZR !== null && (cancelAnimationFrame(ZR), ZR = null), QR === null || typeof r == "number" && a || (clearTimeout(QR), QR = null), $R = Array.from(n.touches).map((e) => yR({
				clientX: e.clientX,
				clientY: e.clientY,
				currentTarget: n.currentTarget
			}));
			var o = () => {
				if (ez != null) {
					var e = t.getState(), n = cO(e, e.tooltip.settings.shared);
					if (n === "axis") {
						var r = $R?.[0];
						if (r == null) {
							ZR = null, QR = null;
							return;
						}
						var i = _R(e, r);
						i?.activeIndex != null && t.dispatch(SO({
							activeIndex: i.activeIndex,
							activeDataKey: void 0,
							activeCoordinate: i.activeCoordinate
						}));
					} else if (n === "item") {
						var a = ez.touches[0];
						if (document.elementFromPoint == null || a == null) return;
						var o = document.elementFromPoint(a.clientX, a.clientY);
						if (!o || !o.getAttribute) return;
						var s = o.getAttribute(lp), c = o.getAttribute("data-recharts-item-id") ?? void 0, l = nk(e).find((e) => e.id === c);
						if (s == null || l == null || c == null) return;
						var { dataKey: u } = l, d = JR(e, s, c);
						t.dispatch(vO({
							activeDataKey: u,
							activeIndex: s,
							activeCoordinate: d,
							activeGraphicalItemId: c
						}));
					}
					ZR = null, QR = null;
				}
			};
			a ? r === "raf" ? ZR = requestAnimationFrame(o) : typeof r == "number" && QR === null && (o(), ez = null, QR = setTimeout(() => {
				ez ? o() : (QR = null, ZR = null);
			}, r)) : o();
		}
	}
});
// node_modules/recharts/es6/state/eventSettingsSlice.js
var tz = {
	throttleDelay: "raf",
	throttledEvents: [
		"mousemove",
		"touchmove",
		"pointermove",
		"scroll",
		"wheel"
	]
}, nz = Rd({
	name: "eventSettings",
	initialState: tz,
	reducers: { setEventSettings: (e, t) => {
		t.payload.throttleDelay != null && (e.throttleDelay = t.payload.throttleDelay), t.payload.throttledEvents != null && (e.throttledEvents = Q(t.payload.throttledEvents));
	} }
}), { setEventSettings: rz } = nz.actions, iz = Ul({
	brush: eF,
	cartesianAxis: zP,
	chartData: XA,
	errorBars: UI,
	eventSettings: nz.reducer,
	graphicalItems: lP,
	layout: Mf,
	legend: uh,
	options: UA,
	polarAxis: vN,
	polarOptions: PR,
	referenceElements: fF,
	renderedTicks: ZF,
	rootProps: AR,
	tooltip: EO,
	zIndex: TA
}), az = function(e) {
	var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "Chart";
	return Od({
		reducer: iz,
		preloadedState: e,
		middleware: (e) => e({
			serializableCheck: !1,
			immutableCheck: ![
				"commonjs",
				"es6",
				"production"
			].includes("es6")
		}).concat([
			xR.middleware,
			CR.middleware,
			RR.middleware,
			WR.middleware,
			XR.middleware
		]),
		enhancers: (e) => {
			var t = e;
			return typeof e == "function" && (t = e()), t.concat(Ed({ type: "raf" }));
		},
		devTools: Gh.devToolsEnabled && {
			serialize: { replacer: DR },
			name: `recharts-${t}`
		}
	});
};
// node_modules/recharts/es6/state/RechartsStoreProvider.js
function oz(e) {
	var { preloadedState: t, children: n, reduxStoreName: r } = e, i = wp(), a = (0, v.useRef)(null);
	if (i) return n;
	a.current ??= az(t, r);
	var o = tl;
	return /*#__PURE__*/ v.createElement(Th, {
		context: o,
		store: a.current
	}, n);
}
// node_modules/recharts/es6/state/ReportMainChartProps.js
function sz(e) {
	var { layout: t, margin: n } = e, r = il(), i = wp();
	return (0, v.useEffect)(() => {
		i || (r(kf(t)), r(Of(n)));
	}, [
		r,
		i,
		t,
		n
	]), null;
}
var cz = /*#__PURE__*/ (0, v.memo)(sz, Oh);
// node_modules/recharts/es6/state/ReportChartProps.js
function lz(e) {
	var t = il();
	return (0, v.useEffect)(() => {
		t(jR(e));
	}, [t, e]), null;
}
var uz = /*#__PURE__*/ (0, v.memo)((e) => {
	var t = il();
	return (0, v.useEffect)(() => {
		t(rz(e));
	}, [t, e]), null;
}, Oh);
// node_modules/recharts/es6/zIndex/ZIndexPortal.js
function dz(e) {
	var { zIndex: t, isPanorama: n } = e, r = (0, v.useRef)(null), i = il();
	return (0, v.useLayoutEffect)(() => (r.current && i(CA({
		zIndex: t,
		element: r.current,
		isPanorama: n
	})), () => {
		i(wA({
			zIndex: t,
			isPanorama: n
		}));
	}), [
		i,
		t,
		n
	]), /*#__PURE__*/ v.createElement("g", {
		tabIndex: -1,
		ref: r,
		className: `recharts-zIndex-layer_${t}`
	});
}
function fz(e) {
	var { children: t, isPanorama: n } = e, r = G(dA);
	if (!r || r.length === 0) return t;
	var i = r.filter((e) => e < 0), a = r.filter((e) => e > 0);
	return /*#__PURE__*/ v.createElement(v.Fragment, null, i.map((e) => /*#__PURE__*/ v.createElement(dz, {
		key: e,
		zIndex: e,
		isPanorama: n
	})), t, a.map((e) => /*#__PURE__*/ v.createElement(dz, {
		key: e,
		zIndex: e,
		isPanorama: n
	})));
}
// node_modules/recharts/es6/container/RootSurface.js
var pz = ["children"];
function mz(e, t) {
	if (e == null) return {};
	var n, r, i = hz(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function hz(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function gz() {
	return gz = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, gz.apply(null, arguments);
}
var _z = {
	width: "100%",
	height: "100%",
	display: "block"
}, vz = /*#__PURE__*/ (0, v.forwardRef)((e, t) => {
	var n = tm(), r = nm(), i = tg();
	if (!Pf(n) || !Pf(r)) return null;
	var { children: a, otherAttributes: o, title: s, desc: c } = e, l, u;
	return o != null && (l = typeof o.tabIndex == "number" ? o.tabIndex : i ? 0 : void 0, u = typeof o.role == "string" ? o.role : i ? "application" : void 0), /*#__PURE__*/ v.createElement(ia, gz({}, o, {
		title: s,
		desc: c,
		role: u,
		tabIndex: l,
		width: n,
		height: r,
		style: _z,
		ref: t
	}), a);
}), yz = (e) => {
	var { children: t } = e, n = G(Ep);
	if (!n) return null;
	var { width: r, height: i, y: a, x: o } = n;
	return /*#__PURE__*/ v.createElement(ia, {
		width: r,
		height: i,
		x: o,
		y: a
	}, t);
}, bz = /*#__PURE__*/ (0, v.forwardRef)((e, t) => {
	var { children: n } = e, r = mz(e, pz);
	return wp() ? /*#__PURE__*/ v.createElement(yz, null, /*#__PURE__*/ v.createElement(fz, { isPanorama: !0 }, n)) : /*#__PURE__*/ v.createElement(vz, gz({ ref: t }, r), /*#__PURE__*/ v.createElement(fz, { isPanorama: !1 }, n));
});
// node_modules/recharts/es6/util/useReportScale.js
function xz() {
	var e = il(), [t, n] = (0, v.useState)(null), r = G(ap);
	return (0, v.useEffect)(() => {
		if (t != null) {
			var n = t.getBoundingClientRect().width / t.offsetWidth;
			X(n) && n !== r && e(jf(n));
		}
	}, [
		t,
		e,
		r
	]), n;
}
// node_modules/recharts/es6/chart/RechartsWrapper.js
function Sz(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Cz(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Sz(Object(n), !0).forEach(function(t) {
			wz(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Sz(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function wz(e, t, n) {
	return (t = Tz(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Tz(e) {
	var t = Ez(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Ez(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function Dz() {
	return Dz = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, Dz.apply(null, arguments);
}
var Oz = () => (sj(), null);
function kz(e) {
	if (typeof e == "number") return e;
	if (typeof e == "string") {
		var t = parseFloat(e);
		if (!Number.isNaN(t)) return t;
	}
	return 0;
}
var Az = /*#__PURE__*/ (0, v.forwardRef)((e, t) => {
	var n = (0, v.useRef)(null), [r, i] = (0, v.useState)({
		containerWidth: kz(e.style?.width),
		containerHeight: kz(e.style?.height)
	}), a = (0, v.useCallback)((e, t) => {
		i((n) => {
			var r = Math.round(e), i = Math.round(t);
			return n.containerWidth === r && n.containerHeight === i ? n : {
				containerWidth: r,
				containerHeight: i
			};
		});
	}, []), o = (0, v.useCallback)((e) => {
		if (typeof t == "function" && t(e), e != null && typeof ResizeObserver < "u") {
			var { width: r, height: i } = e.getBoundingClientRect();
			a(r, i);
			var o = new ResizeObserver((e) => {
				var t = e[0];
				if (t != null) {
					var { width: n, height: r } = t.contentRect;
					a(n, r);
				}
			});
			o.observe(e), n.current = o;
		}
	}, [t, a]);
	return (0, v.useEffect)(() => () => {
		n.current?.disconnect();
	}, [a]), /*#__PURE__*/ v.createElement(v.Fragment, null, /*#__PURE__*/ v.createElement(cm, {
		width: r.containerWidth,
		height: r.containerHeight
	}), /*#__PURE__*/ v.createElement("div", Dz({ ref: o }, e)));
}), jz = /*#__PURE__*/ (0, v.forwardRef)((e, t) => {
	var { width: n, height: r } = e, [i, a] = (0, v.useState)({
		containerWidth: kz(n),
		containerHeight: kz(r)
	}), o = (0, v.useCallback)((e, t) => {
		a((n) => {
			var r = Math.round(e), i = Math.round(t);
			return n.containerWidth === r && n.containerHeight === i ? n : {
				containerWidth: r,
				containerHeight: i
			};
		});
	}, []), s = (0, v.useCallback)((e) => {
		if (typeof t == "function" && t(e), e != null) {
			var { width: n, height: r } = e.getBoundingClientRect();
			o(n, r);
		}
	}, [t, o]);
	return /*#__PURE__*/ v.createElement(v.Fragment, null, /*#__PURE__*/ v.createElement(cm, {
		width: i.containerWidth,
		height: i.containerHeight
	}), /*#__PURE__*/ v.createElement("div", Dz({ ref: s }, e)));
}), Mz = /*#__PURE__*/ (0, v.forwardRef)((e, t) => {
	var { width: n, height: r } = e;
	return /*#__PURE__*/ v.createElement(v.Fragment, null, /*#__PURE__*/ v.createElement(cm, {
		width: n,
		height: r
	}), /*#__PURE__*/ v.createElement("div", Dz({ ref: t }, e)));
}), Nz = /*#__PURE__*/ (0, v.forwardRef)((e, t) => {
	var { width: n, height: r } = e;
	return typeof n == "string" || typeof r == "string" ? /*#__PURE__*/ v.createElement(jz, Dz({}, e, { ref: t })) : typeof n == "number" && typeof r == "number" ? /*#__PURE__*/ v.createElement(Mz, Dz({}, e, {
		width: n,
		height: r,
		ref: t
	})) : /*#__PURE__*/ v.createElement(v.Fragment, null, /*#__PURE__*/ v.createElement(cm, {
		width: n,
		height: r
	}), /*#__PURE__*/ v.createElement("div", Dz({ ref: t }, e)));
});
function Pz(e) {
	return e ? Az : Nz;
}
var Fz = /*#__PURE__*/ (0, v.forwardRef)((e, t) => {
	var { children: n, className: r, height: i, onClick: a, onContextMenu: o, onDoubleClick: s, onMouseDown: c, onMouseEnter: l, onMouseLeave: u, onMouseMove: d, onMouseUp: f, onTouchEnd: p, onTouchMove: m, onTouchStart: h, style: g, width: _, responsive: y, dispatchTouchEvents: b = !0 } = e, x = (0, v.useRef)(null), S = il(), [C, w] = (0, v.useState)(null), [T, E] = (0, v.useState)(null), D = xz(), O = Jp(), k = O?.width > 0 ? O.width : _, ee = O?.height > 0 ? O.height : i, te = (0, v.useCallback)((e) => {
		D(e), typeof t == "function" && t(e), w(e), E(e), e != null && (x.current = e);
	}, [
		D,
		t,
		w,
		E
	]), A = (0, v.useCallback)((e) => {
		S(bR(e)), S(UR({
			handler: a,
			reactEvent: e
		}));
	}, [S, a]), j = (0, v.useCallback)((e) => {
		S(SR(e)), S(UR({
			handler: l,
			reactEvent: e
		}));
	}, [S, l]), ne = (0, v.useCallback)((e) => {
		S(bO()), S(UR({
			handler: u,
			reactEvent: e
		}));
	}, [S, u]), re = (0, v.useCallback)((e) => {
		S(SR(e)), S(UR({
			handler: d,
			reactEvent: e
		}));
	}, [S, d]), M = (0, v.useCallback)(() => {
		S(IR());
	}, [S]), ie = (0, v.useCallback)(() => {
		S(LR());
	}, [S]), ae = (0, v.useCallback)((e) => {
		S(FR(e.key));
	}, [S]), oe = (0, v.useCallback)((e) => {
		S(UR({
			handler: o,
			reactEvent: e
		}));
	}, [S, o]), se = (0, v.useCallback)((e) => {
		S(UR({
			handler: s,
			reactEvent: e
		}));
	}, [S, s]), ce = (0, v.useCallback)((e) => {
		S(UR({
			handler: c,
			reactEvent: e
		}));
	}, [S, c]), le = (0, v.useCallback)((e) => {
		S(UR({
			handler: f,
			reactEvent: e
		}));
	}, [S, f]), ue = (0, v.useCallback)((e) => {
		S(UR({
			handler: h,
			reactEvent: e
		}));
	}, [S, h]), de = (0, v.useCallback)((e) => {
		b && S(YR(e)), S(UR({
			handler: m,
			reactEvent: e
		}));
	}, [
		S,
		b,
		m
	]), fe = (0, v.useCallback)((e) => {
		S(UR({
			handler: p,
			reactEvent: e
		}));
	}, [S, p]), pe = Pz(y);
	return /*#__PURE__*/ v.createElement(IA.Provider, { value: C }, /*#__PURE__*/ v.createElement(la.Provider, { value: T }, /*#__PURE__*/ v.createElement(pe, {
		width: k ?? g?.width,
		height: ee ?? g?.height,
		className: I("recharts-wrapper", r),
		style: Cz({
			position: "relative",
			cursor: "default",
			width: k,
			height: ee
		}, g),
		onClick: A,
		onContextMenu: oe,
		onDoubleClick: se,
		onFocus: M,
		onBlur: ie,
		onKeyDown: ae,
		onMouseDown: ce,
		onMouseEnter: j,
		onMouseLeave: ne,
		onMouseMove: re,
		onMouseUp: le,
		onTouchEnd: fe,
		onTouchMove: de,
		onTouchStart: ue,
		ref: te
	}, /*#__PURE__*/ v.createElement(Oz, null), n)));
}), Iz = [
	"width",
	"height",
	"responsive",
	"children",
	"className",
	"style",
	"compact",
	"title",
	"desc"
];
function Lz(e, t) {
	if (e == null) return {};
	var n, r, i = Rz(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function Rz(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var zz = /*#__PURE__*/ (0, v.forwardRef)((e, t) => {
	var { width: n, height: r, responsive: i, children: a, className: o, style: s, compact: c, title: l, desc: u } = e, d = Xi(Lz(e, Iz));
	return c ? /*#__PURE__*/ v.createElement(v.Fragment, null, /*#__PURE__*/ v.createElement(cm, {
		width: n,
		height: r
	}), /*#__PURE__*/ v.createElement(bz, {
		otherAttributes: d,
		title: l,
		desc: u
	}, a)) : /*#__PURE__*/ v.createElement(Fz, {
		className: o,
		style: s,
		width: n,
		height: r,
		responsive: i ?? !1,
		onClick: e.onClick,
		onMouseLeave: e.onMouseLeave,
		onMouseEnter: e.onMouseEnter,
		onMouseMove: e.onMouseMove,
		onMouseDown: e.onMouseDown,
		onMouseUp: e.onMouseUp,
		onContextMenu: e.onContextMenu,
		onDoubleClick: e.onDoubleClick,
		onTouchStart: e.onTouchStart,
		onTouchMove: e.onTouchMove,
		onTouchEnd: e.onTouchEnd
	}, /*#__PURE__*/ v.createElement(bz, {
		otherAttributes: d,
		title: l,
		desc: u,
		ref: t
	}, /*#__PURE__*/ v.createElement(mF, null, a)));
});
// node_modules/recharts/es6/chart/CartesianChart.js
function Bz() {
	return Bz = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, Bz.apply(null, arguments);
}
function Vz(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Hz(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Vz(Object(n), !0).forEach(function(t) {
			Uz(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Vz(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Uz(e, t, n) {
	return (t = Wz(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Wz(e) {
	var t = Gz(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Gz(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var Kz = Hz({
	accessibilityLayer: !0,
	barCategoryGap: "10%",
	barGap: 4,
	layout: "horizontal",
	margin: {
		top: 5,
		right: 5,
		bottom: 5,
		left: 5
	},
	responsive: !1,
	reverseStackOrder: !1,
	stackOffset: "none",
	syncMethod: "index"
}, tz), qz = /*#__PURE__*/ (0, v.forwardRef)(function(e, t) {
	var n = Ws(e.categoricalChartProps, Kz), { chartName: r, defaultTooltipEventType: i, validateTooltipEventTypes: a, tooltipPayloadSearcher: o, categoricalChartProps: s } = e, c = {
		chartName: r,
		defaultTooltipEventType: i,
		validateTooltipEventTypes: a,
		tooltipPayloadSearcher: o,
		eventEmitter: void 0
	};
	return /*#__PURE__*/ v.createElement(oz, {
		preloadedState: { options: c },
		reduxStoreName: s.id ?? r
	}, /*#__PURE__*/ v.createElement(XP, { chartData: s.data }), /*#__PURE__*/ v.createElement(cz, {
		layout: n.layout,
		margin: n.margin
	}), /*#__PURE__*/ v.createElement(uz, {
		throttleDelay: n.throttleDelay,
		throttledEvents: n.throttledEvents
	}), /*#__PURE__*/ v.createElement(lz, {
		baseValue: n.baseValue,
		accessibilityLayer: n.accessibilityLayer,
		barCategoryGap: n.barCategoryGap,
		maxBarSize: n.maxBarSize,
		stackOffset: n.stackOffset,
		barGap: n.barGap,
		barSize: n.barSize,
		syncId: n.syncId,
		syncMethod: n.syncMethod,
		className: n.className,
		reverseStackOrder: n.reverseStackOrder
	}), /*#__PURE__*/ v.createElement(zz, Bz({}, n, { ref: t })));
}), Jz = ["axis"], Yz = /*#__PURE__*/ (0, v.forwardRef)((e, t) => /*#__PURE__*/ v.createElement(qz, {
	chartName: "LineChart",
	defaultTooltipEventType: "axis",
	validateTooltipEventTypes: Jz,
	tooltipPayloadSearcher: VA,
	categoricalChartProps: e,
	ref: t
})), Xz = {
	light: "",
	dark: ".dark"
}, Zz = {
	width: 320,
	height: 200
}, Qz = v.createContext(null);
function $z() {
	let e = v.useContext(Qz);
	if (!e) throw Error("useChart must be used within a <ChartContainer />");
	return e;
}
function eB({ id: e, className: t, children: n, config: r, initialDimension: i = Zz, ...a }) {
	let o = v.useId(), s = `chart-${e ?? o.replace(/:/g, "")}`;
	return /* @__PURE__ */ (0, F.jsx)(Qz.Provider, {
		value: { config: r },
		children: /* @__PURE__ */ (0, F.jsxs)("div", {
			"data-slot": "chart",
			"data-chart": s,
			className: un("flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden", t),
			...a,
			children: [/* @__PURE__ */ (0, F.jsx)(tB, {
				id: s,
				config: r
			}), /* @__PURE__ */ (0, F.jsx)(Xp, {
				initialDimension: i,
				children: n
			})]
		})
	});
}
var tB = ({ id: e, config: t }) => {
	let n = Object.entries(t).filter(([, e]) => e.theme ?? e.color);
	return n.length ? /* @__PURE__ */ (0, F.jsx)("style", { dangerouslySetInnerHTML: { __html: Object.entries(Xz).map(([t, r]) => `
${r} [data-chart=${e}] {
${n.map(([e, n]) => {
		let r = n.theme?.[t] ?? n.color;
		return r ? `  --color-${e}: ${r};` : null;
	}).join("\n")}
}
`).join("\n") } }) : null;
}, nB = vj;
function rB({ active: e, payload: t, className: n, indicator: r = "dot", hideLabel: i = !1, hideIndicator: a = !1, label: o, labelFormatter: s, labelClassName: c, formatter: l, color: u, nameKey: d, labelKey: f }) {
	let { config: p } = $z(), m = v.useMemo(() => {
		if (i || !t?.length) return null;
		let [e] = t, n = `${f ?? e?.dataKey ?? e?.name ?? "value"}`, r = iB(p, e, n), a = !f && typeof o == "string" ? p[o]?.label ?? o : r?.label;
		return s ? /* @__PURE__ */ (0, F.jsx)("div", {
			className: un("font-medium", c),
			children: s(a, t)
		}) : a ? /* @__PURE__ */ (0, F.jsx)("div", {
			className: un("font-medium", c),
			children: a
		}) : null;
	}, [
		o,
		s,
		t,
		i,
		c,
		p,
		f
	]);
	if (!e || !t?.length) return null;
	let h = t.length === 1 && r !== "dot";
	return /* @__PURE__ */ (0, F.jsxs)("div", {
		className: un("grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl", n),
		children: [h ? null : m, /* @__PURE__ */ (0, F.jsx)("div", {
			className: "grid gap-1.5",
			children: t.filter((e) => e.type !== "none").map((e, t) => {
				let n = `${d ?? e.name ?? e.dataKey ?? "value"}`, i = iB(p, e, n), o = u ?? e.payload?.fill ?? e.color;
				return /* @__PURE__ */ (0, F.jsx)("div", {
					className: un("flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground", r === "dot" && "items-center"),
					children: l && e?.value !== void 0 && e.name ? l(e.value, e.name, e, t, e.payload) : /* @__PURE__ */ (0, F.jsxs)(F.Fragment, { children: [i?.icon ? /* @__PURE__ */ (0, F.jsx)(i.icon, {}) : !a && /* @__PURE__ */ (0, F.jsx)("div", {
						className: un("shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)", {
							"h-2.5 w-2.5": r === "dot",
							"w-1": r === "line",
							"w-0 border-[1.5px] border-dashed bg-transparent": r === "dashed",
							"my-0.5": h && r === "dashed"
						}),
						style: {
							"--color-bg": o,
							"--color-border": o
						}
					}), /* @__PURE__ */ (0, F.jsxs)("div", {
						className: un("flex flex-1 justify-between leading-none", h ? "items-end" : "items-center"),
						children: [/* @__PURE__ */ (0, F.jsxs)("div", {
							className: "grid gap-1.5",
							children: [h ? m : null, /* @__PURE__ */ (0, F.jsx)("span", {
								className: "text-muted-foreground",
								children: i?.label ?? e.name
							})]
						}), e.value != null && /* @__PURE__ */ (0, F.jsx)("span", {
							className: "font-mono font-medium text-foreground tabular-nums",
							children: typeof e.value == "number" ? e.value.toLocaleString() : String(e.value)
						})]
					})] })
				}, t);
			})
		})]
	});
}
function iB(e, t, n) {
	if (typeof t != "object" || !t) return;
	let r = "payload" in t && typeof t.payload == "object" && t.payload !== null ? t.payload : void 0, i = n;
	return n in t && typeof t[n] == "string" ? i = t[n] : r && n in r && typeof r[n] == "string" && (i = r[n]), i in e ? e[i] : e[n];
}
// src/components/LatencyChart.tsx
var aB = 1e3, oB = { ms: {
	label: "Latency (ms)",
	color: Ce
} };
function sB({ points: e, range: t = "24h", unavailable: n = !1, error: r = null, notice: i = null }) {
	let a = e.map((e) => ({
		t: new Date(e.t).getTime(),
		ms: e.ms
	})).filter((e) => Number.isFinite(e.t) && Number.isFinite(e.ms)).sort((e, t) => e.t - t.t), o = a.reduce((e, t) => Math.max(e, t.ms), 0), s = a[a.length - 1], c = be(a[0]?.t ?? 0, s?.t ?? 0, t), l = c.length >= 2 ? c : void 0;
	return /* @__PURE__ */ (0, F.jsxs)("section", {
		"aria-labelledby": "latency-heading",
		className: "flex flex-col gap-3",
		children: [/* @__PURE__ */ (0, F.jsxs)("h2", {
			id: "latency-heading",
			className: "font-display text-xl font-semibold",
			children: ["Alarmio latency ", /* @__PURE__ */ (0, F.jsx)("span", {
				className: "text-sm font-normal",
				style: { color: P.textMuted },
				children: "(ms)"
			})]
		}), n ? /* @__PURE__ */ (0, F.jsx)("p", {
			style: { color: P.textMuted },
			children: "History is not available yet. Home Assistant's recorder may be starting."
		}) : r ? /* @__PURE__ */ (0, F.jsx)("p", {
			style: { color: P.textMuted },
			children: r
		}) : a.length === 0 || !s ? /* @__PURE__ */ (0, F.jsx)("p", {
			style: { color: P.textMuted },
			children: "No latency readings yet. They appear after the first few checks."
		}) : /* @__PURE__ */ (0, F.jsxs)(F.Fragment, { children: [
			i ? /* @__PURE__ */ (0, F.jsx)("p", {
				className: "text-sm",
				style: { color: P.textMuted },
				children: i
			}) : null,
			/* @__PURE__ */ (0, F.jsx)(eB, {
				config: oB,
				className: "aspect-auto h-52 w-full",
				role: "img",
				"aria-label": `Alarmio latency over time. Latest ${Math.round(s.ms)} ms, highest ${Math.round(o)} ms.`,
				children: /* @__PURE__ */ (0, F.jsxs)(Yz, {
					data: a,
					margin: {
						top: 12,
						right: 12,
						bottom: 0,
						left: 0
					},
					children: [
						/* @__PURE__ */ (0, F.jsx)(RI, {
							vertical: !1,
							stroke: P.divider
						}),
						/* @__PURE__ */ (0, F.jsx)(tR, {
							dataKey: "t",
							type: "number",
							scale: "time",
							domain: ["dataMin", "dataMax"],
							ticks: l,
							interval: l ? 0 : "preserveStartEnd",
							tickFormatter: (e) => ve(e, t),
							tickLine: !1,
							axisLine: !1,
							tick: {
								fontFamily: we.mono,
								fontSize: 12
							}
						}),
						/* @__PURE__ */ (0, F.jsx)(gR, {
							width: 40,
							tickLine: !1,
							axisLine: !1,
							domain: [0, Math.max(1200, Math.ceil(o / 200) * 200)]
						}),
						/* @__PURE__ */ (0, F.jsx)(nB, { content: /* @__PURE__ */ (0, F.jsx)(rB, {
							hideIndicator: !0,
							labelFormatter: (e, t) => ye(Number(t[0]?.payload?.t))
						}) }),
						/* @__PURE__ */ (0, F.jsx)(jF, {
							y: aB,
							stroke: xe.degraded,
							strokeDasharray: "6 4",
							strokeWidth: 1.5
						}),
						/* @__PURE__ */ (0, F.jsx)(PL, {
							dataKey: "ms",
							type: "monotone",
							stroke: "var(--color-ms)",
							strokeWidth: 2,
							dot: !1,
							isAnimationActive: !1
						})
					]
				})
			}),
			/* @__PURE__ */ (0, F.jsxs)("p", {
				className: "flex items-center gap-2 text-sm",
				style: { color: P.textMuted },
				children: [
					/* @__PURE__ */ (0, F.jsx)("svg", {
						"aria-hidden": "true",
						width: "24",
						height: "4",
						className: "shrink-0",
						children: /* @__PURE__ */ (0, F.jsx)("line", {
							x1: "0",
							y1: "2",
							x2: "24",
							y2: "2",
							stroke: xe.degraded,
							strokeWidth: "2",
							strokeDasharray: "6 4"
						})
					}),
					"Slow above ",
					aB,
					" ms"
				]
			})
		] })]
	});
}
// src/components/SignalChain.tsx
function cB({ links: e }) {
	return /* @__PURE__ */ (0, F.jsx)("ol", {
		role: "list",
		"aria-label": "Alarm signal chain",
		className: "chain-in flex flex-col sm:flex-row sm:items-stretch",
		children: e.map((t, n) => {
			let r = t.status === "down", i = n === e.length - 1;
			return /* @__PURE__ */ (0, F.jsxs)("li", {
				className: "flex flex-col sm:min-w-0 sm:flex-1 sm:flex-row",
				"data-link": t.id,
				children: [/* @__PURE__ */ (0, F.jsxs)("div", {
					className: "rounded-lg border px-4 py-3 sm:flex-1",
					style: {
						borderColor: P.divider,
						background: P.surface
					},
					children: [
						/* @__PURE__ */ (0, F.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, F.jsx)(Oe, { status: t.status }), /* @__PURE__ */ (0, F.jsx)("span", {
								className: "font-display text-base font-semibold",
								children: t.label
							})]
						}),
						/* @__PURE__ */ (0, F.jsx)("p", {
							className: "mt-1 text-sm",
							style: { color: P.textMuted },
							children: me[t.status]
						}),
						t.latency_ms === null ? null : /* @__PURE__ */ (0, F.jsxs)("p", {
							className: "font-mono text-sm",
							children: [Math.round(t.latency_ms), " ms"]
						})
					]
				}), i ? null : /* @__PURE__ */ (0, F.jsx)("div", {
					"aria-hidden": "true",
					"data-connector": r ? "dashed" : "solid",
					className: "ml-6 h-6 w-0 border-l-2 sm:ml-0 sm:self-center sm:h-0 sm:w-6 sm:border-t-2 sm:border-l-0 lg:w-10",
					style: {
						borderStyle: r ? "dashed" : "solid",
						borderColor: r ? xe.down : P.divider
					}
				})]
			}, t.id);
		})
	});
}
// src/components/ui/tabs.tsx
function lB({ className: e, orientation: t = "horizontal", ...n }) {
	return /* @__PURE__ */ (0, F.jsx)(Ei, {
		"data-slot": "tabs",
		"data-orientation": t,
		orientation: t,
		className: un("group/tabs flex gap-2 data-[orientation=horizontal]:flex-col", e),
		...n
	});
}
var uB = Me("group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-[orientation=horizontal]/tabs:h-9 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col data-[variant=line]:rounded-none", {
	variants: { variant: {
		default: "bg-muted",
		line: "gap-1 bg-transparent"
	} },
	defaultVariants: { variant: "default" }
});
function dB({ className: e, variant: t = "default", ...n }) {
	return /* @__PURE__ */ (0, F.jsx)(Oi, {
		"data-slot": "tabs-list",
		"data-variant": t,
		className: un(uB({ variant: t }), e),
		...n
	});
}
function fB({ className: e, ...t }) {
	return /* @__PURE__ */ (0, F.jsx)(Ai, {
		"data-slot": "tabs-trigger",
		className: un("relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent", "data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground", "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100", e),
		...t
	});
}
// src/lib/strips.ts
var pB = {
	unknown: 0,
	healthy: 1,
	degraded: 2,
	down: 3
};
function mB(e) {
	return e === "healthy" || e === "degraded" || e === "down" || e === "unknown" ? e : "unknown";
}
function hB(e, t, n, r) {
	let i = t.getTime(), a = n.getTime();
	if (!Number.isFinite(r) || r <= 0 || !Number.isFinite(i) || !Number.isFinite(a) || i >= a) return [];
	let o = Math.floor(r), s = e.map((e) => ({
		time: new Date(e.t).getTime(),
		s: mB(e.s)
	})).filter((e) => Number.isFinite(e.time) && e.time < a).sort((e, t) => e.time - t.time), c = 0, l = "unknown";
	for (; c < s.length && (s[c]?.time ?? 1e400) < i;) l = s[c]?.s ?? l, c++;
	let u = a - i, d = [];
	for (let e = 0; e < o; e++) {
		let t = i + u * e / o, n = i + u * (e + 1) / o, r = s[c]?.time, a = r !== void 0 && r <= t ? "unknown" : l;
		for (let e = s[c]; e !== void 0 && e.time < n; e = s[c]) l = e.s, pB[l] > pB[a] && (a = l), c++;
		d.push(a);
	}
	return d;
}
function gB(e) {
	let t = e.map(mB).filter((e) => e !== "unknown");
	return t.length === 0 ? null : t.filter((e) => e !== "down").length / t.length * 100;
}
// src/components/UptimeStrips.tsx
var _B = {
	"24h": 864e5,
	"7d": 6048e5,
	"30d": 2592e6
}, vB = {
	"24h": "24 hours",
	"7d": "7 days",
	"30d": "30 days"
}, yB = [
	"24h",
	"7d",
	"30d"
], bB = 48, xB = 6, SB = 28, CB = {
	unknown: 8,
	healthy: 16,
	degraded: 22,
	down: SB
}, wB = [
	"healthy",
	"degraded",
	"down",
	"unknown"
];
function TB(e) {
	return e.reduce((t, n, r) => n === "down" && e[r - 1] !== "down" ? t + 1 : t, 0);
}
function EB(e, t, n, r) {
	if (t === null) return `${e}: no data in the last ${vB[r]}`;
	let i = TB(n), a = i === 0 ? "no outages" : i === 1 ? "1 outage" : `${i} outages`;
	return `${e}: ${_e(t)} up in the last ${vB[r]}, ${a}`;
}
function DB({ history: e, range: t, onRangeChange: n, dataRange: r, unavailable: i = !1, error: a = null, notice: o = null, now: s }) {
	let c = r ?? t, l = (0, v.useMemo)(() => s ?? /* @__PURE__ */ new Date(), [s, e]), u = (0, v.useMemo)(() => {
		let t = new Date(l.getTime() - _B[c]);
		return de.map((n) => {
			let r = hB(e.status[n] ?? [], t, l, bB);
			return {
				id: n,
				title: pe(n),
				strip: r,
				percent: gB(r)
			};
		});
	}, [
		e,
		c,
		l
	]);
	return /* @__PURE__ */ (0, F.jsxs)("section", {
		"aria-labelledby": "uptime-heading",
		className: "flex flex-col gap-4",
		children: [/* @__PURE__ */ (0, F.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, F.jsx)("h2", {
				id: "uptime-heading",
				className: "font-display text-xl font-semibold",
				children: "Uptime"
			}), /* @__PURE__ */ (0, F.jsx)(lB, {
				value: t,
				onValueChange: (e) => n(e),
				children: /* @__PURE__ */ (0, F.jsx)(dB, {
					"aria-label": "Time range",
					children: yB.map((e) => /* @__PURE__ */ (0, F.jsx)(fB, {
						value: e,
						"aria-controls": void 0,
						children: e
					}, e))
				})
			})]
		}), i ? /* @__PURE__ */ (0, F.jsx)("p", {
			style: { color: P.textMuted },
			children: "History is not available yet. Home Assistant's recorder may be starting."
		}) : a ? /* @__PURE__ */ (0, F.jsx)("p", {
			style: { color: P.textMuted },
			children: a
		}) : /* @__PURE__ */ (0, F.jsxs)(F.Fragment, { children: [
			o ? /* @__PURE__ */ (0, F.jsx)("p", {
				className: "text-sm",
				style: { color: P.textMuted },
				children: o
			}) : null,
			/* @__PURE__ */ (0, F.jsx)("ul", {
				role: "list",
				className: "flex flex-col gap-3",
				"aria-busy": c !== t,
				children: u.map((e) => /* @__PURE__ */ (0, F.jsxs)("li", {
					className: "grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 sm:grid-cols-[9rem_1fr_4.5rem]",
					"data-probe": e.id,
					children: [
						/* @__PURE__ */ (0, F.jsx)("span", {
							className: "text-sm font-medium",
							"aria-hidden": "true",
							children: e.title
						}),
						/* @__PURE__ */ (0, F.jsx)("span", {
							className: "font-mono text-sm sm:order-3 sm:text-right",
							"aria-hidden": "true",
							children: _e(e.percent)
						}),
						/* @__PURE__ */ (0, F.jsx)("span", {
							className: "sr-only",
							children: EB(e.title, e.percent, e.strip, c)
						}),
						/* @__PURE__ */ (0, F.jsx)("svg", {
							role: "img",
							"aria-label": `${e.title} status over the last ${vB[c]}`,
							viewBox: `0 0 382 ${SB}`,
							preserveAspectRatio: "none",
							className: "col-span-2 h-7 w-full sm:order-2 sm:col-span-1",
							children: e.strip.map((e, t) => /* @__PURE__ */ (0, F.jsx)("rect", {
								x: t * 8,
								y: SB - CB[e],
								width: xB,
								height: CB[e],
								rx: 2,
								fill: xe[e],
								"data-status": e
							}, t))
						})
					]
				}, e.id))
			}),
			/* @__PURE__ */ (0, F.jsx)("ul", {
				role: "list",
				className: "flex flex-wrap gap-x-4 gap-y-1 text-xs",
				style: { color: P.textMuted },
				"aria-label": "Legend",
				children: wB.map((e) => /* @__PURE__ */ (0, F.jsxs)("li", {
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ (0, F.jsx)(Oe, {
						status: e,
						className: "size-3.5"
					}), e === "unknown" ? "No data" : me[e]]
				}, e))
			})
		] })]
	});
}
// src/components/Verdict.tsx
function OB({ verdict: e, children: t }) {
	return /* @__PURE__ */ (0, F.jsx)("div", {
		role: "status",
		"aria-live": "polite",
		className: "flex items-start gap-3",
		children: e ? /* @__PURE__ */ (0, F.jsxs)(F.Fragment, { children: [/* @__PURE__ */ (0, F.jsx)(Oe, {
			status: e.tone,
			className: "mt-1 size-8 sm:size-10",
			label: !0
		}), /* @__PURE__ */ (0, F.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, F.jsx)("h1", {
				className: "font-display text-3xl leading-tight font-semibold text-balance sm:text-4xl",
				children: e.headline
			}), e.hint ? /* @__PURE__ */ (0, F.jsx)("p", {
				className: "mt-2 text-base",
				style: { color: P.textMuted },
				children: e.hint
			}) : null]
		})] }) : t
	});
}
// src/components/Wordmark.tsx
function kB() {
	return /* @__PURE__ */ (0, F.jsxs)("div", {
		className: "flex items-baseline gap-2",
		children: [/* @__PURE__ */ (0, F.jsxs)("span", {
			className: "text-2xl font-semibold",
			style: {
				fontFamily: we.display,
				letterSpacing: "-1px",
				color: P.text
			},
			children: ["Alarm", /* @__PURE__ */ (0, F.jsx)("span", {
				style: { color: Se.tealDark },
				children: "io"
			})]
		}), /* @__PURE__ */ (0, F.jsx)("span", {
			className: "text-sm",
			style: { color: P.textMuted },
			children: "Health"
		})]
	});
}
// src/components/AppHeader.tsx
function AB({ registerMenu: e }) {
	let t = (0, v.useCallback)((t) => (e(t), () => e(null)), [e]);
	return (0, v.createElement)("ha-menu-button", { ref: t });
}
function jB({ narrow: e, registerMenu: t }) {
	return e ? /* @__PURE__ */ (0, F.jsxs)("div", {
		className: "flex items-center gap-2",
		"data-testid": "narrow-header",
		children: [/* @__PURE__ */ (0, F.jsx)(AB, { registerMenu: t }), /* @__PURE__ */ (0, F.jsx)(kB, {})]
	}) : /* @__PURE__ */ (0, F.jsx)(kB, {});
}
// src/lib/verdict.ts
var MB = {
	tone: "unknown",
	headline: "Not enough data yet to tell",
	hint: "Checks run every minute."
};
function NB(e, t) {
	if (!e) return "";
	let n = new Date(e).getTime();
	if (Number.isNaN(n)) return "";
	let r = t.getTime() - n;
	if (r < 6e4) return " just now";
	let i = Math.round(r / 6e4);
	if (i < 60) return ` ${i} min ago`;
	let a = Math.floor(i / 60), o = i % 60;
	return o === 0 ? ` ${a} h ago` : ` ${a} h ${o} min ago`;
}
function PB(e, t, n) {
	let r = e.find((e) => e.status === "down");
	if (r) return {
		tone: "down",
		headline: `Events stopped at ${r.label}${NB(t, n)}`,
		hint: r.detail
	};
	let i = e.find((e) => e.status === "degraded"), a = e.find((e) => e.id !== "ha" && e.status === "unknown");
	if (i && a) return {
		tone: "degraded",
		headline: `${i.label} needs attention and ${a.label} cannot be checked`,
		hint: i.detail
	};
	if (i) return {
		tone: "degraded",
		headline: `Alarm events are reaching Home Assistant, but ${i.label} needs attention`,
		hint: i.detail
	};
	let o = e.filter((e) => e.id !== "ha");
	return o.length === 0 || o.some((e) => e.status !== "healthy") ? MB : {
		tone: "healthy",
		headline: "Alarm events are reaching Home Assistant",
		hint: ""
	};
}
// src/App.tsx
var FB = 3e4, IB = {
	status: {},
	latency: []
}, LB = 3e4;
function RB(e) {
	let t, n = new Promise((e, n) => {
		t = setTimeout(() => n(/* @__PURE__ */ Error("The request timed out.")), LB);
	});
	return Promise.race([e, n]).finally(() => clearTimeout(t));
}
var zB = (e) => e instanceof Error && e.message ? e.message : "Could not load health data.", BB = () => {};
function VB({ api: e, narrow: t = !1, registerMenu: n = BB }) {
	let [r, i] = (0, v.useState)(null), [a, o] = (0, v.useState)(IB), [s, c] = (0, v.useState)("24h"), [l, u] = (0, v.useState)([]), [d, f] = (0, v.useState)("24h"), [p, m] = (0, v.useState)(null), [h, g] = (0, v.useState)(!1), [_, y] = (0, v.useState)(null), [b, x] = (0, v.useState)(null), [S, C] = (0, v.useState)(0);
	(0, v.useEffect)(() => {
		let t = !0, n = !1, r = async () => {
			if (!n) {
				n = !0;
				try {
					let n = (e, n, r) => e.then((e) => {
						t && n(e);
					}, (e) => {
						t && r(zB(e));
					});
					await Promise.allSettled([
						n(RB(e.summary()), (e) => {
							i(e), m(null);
						}, m),
						n(RB(e.history(d)), (e) => {
							o(e), c(d), g(!0), y(null);
						}, y),
						n(RB(e.incidents()), (e) => {
							u(e), x(null);
						}, x)
					]);
				} finally {
					n = !1;
				}
			}
		};
		r();
		let a = setInterval(() => void r(), FB);
		return () => {
			t = !1, clearInterval(a);
		};
	}, [
		e,
		d,
		S
	]);
	let w = _ && !h, T = a.warning === "history_unavailable", E = r ? PB(r.links, r.down_since, /* @__PURE__ */ new Date()) : null, D = _ && h ? "History may be out of date." : null;
	return /* @__PURE__ */ (0, F.jsxs)("main", {
		className: "mx-auto flex max-w-5xl flex-col gap-8 p-4 md:p-8",
		"aria-busy": !r && !p,
		children: [
			/* @__PURE__ */ (0, F.jsx)(jB, {
				narrow: t,
				registerMenu: n
			}),
			r && p ? /* @__PURE__ */ (0, F.jsx)("p", {
				className: "rounded-md border px-3 py-2 text-sm",
				style: {
					borderColor: P.divider,
					color: P.textMuted
				},
				children: "Last update failed. Showing earlier data."
			}) : null,
			/* @__PURE__ */ (0, F.jsx)(OB, {
				verdict: E,
				children: p ? /* @__PURE__ */ (0, F.jsxs)("div", {
					className: "flex flex-col items-start gap-3",
					children: [
						/* @__PURE__ */ (0, F.jsx)("h1", {
							className: "font-display text-2xl font-semibold",
							children: "Could not load health data"
						}),
						/* @__PURE__ */ (0, F.jsxs)("p", { children: [p, " Reload the page, or check that the Alarmio Health integration is loaded in Settings > Devices & services. This page keeps retrying every 30 seconds."] }),
						/* @__PURE__ */ (0, F.jsx)(Pi, {
							type: "button",
							variant: "outline",
							onClick: () => C((e) => e + 1),
							children: "Try again"
						})
					]
				}) : /* @__PURE__ */ (0, F.jsx)("p", {
					style: { color: P.textMuted },
					children: "Loading health data..."
				})
			}),
			r ? /* @__PURE__ */ (0, F.jsxs)(F.Fragment, { children: [
				/* @__PURE__ */ (0, F.jsx)(cB, { links: r.links }),
				/* @__PURE__ */ (0, F.jsx)(DB, {
					history: a,
					range: d,
					dataRange: s,
					onRangeChange: f,
					unavailable: T,
					error: w && !T ? "Uptime history could not be loaded. It will retry on the next refresh." : null,
					notice: D
				}),
				/* @__PURE__ */ (0, F.jsxs)("div", {
					className: "grid gap-8 md:grid-cols-[3fr_2fr]",
					children: [/* @__PURE__ */ (0, F.jsx)(sB, {
						points: a.latency,
						range: s,
						unavailable: T,
						error: w && !T ? "Latency history could not be loaded. It will retry on the next refresh." : null,
						notice: D
					}), /* @__PURE__ */ (0, F.jsx)(Wi, {
						incidents: l,
						error: b ? "Incidents could not be loaded. They will retry on the next refresh." : null
					})]
				}),
				/* @__PURE__ */ (0, F.jsx)(Hi, {
					diagnostics: r.diagnostics_preview,
					sharing: r.share_diagnostics
				}),
				/* @__PURE__ */ (0, F.jsx)(Li, {
					sharing: r.share_diagnostics,
					preview: r.diagnostics_preview,
					queued: r.queued_heartbeats,
					onRunE2E: e.runE2E
				})
			] }) : null
		]
	});
}
// src/lib/api.ts
function HB(e) {
	return e instanceof Error ? e : typeof e == "object" && e && "message" in e && typeof e.message == "string" && e.message ? Error(e.message) : /* @__PURE__ */ Error("Could not reach Home Assistant. Reload the page and try again.");
}
function UB(e) {
	let t = async (t, n = {}) => {
		let r = e();
		if (!r) throw Error("Home Assistant is not connected. Reload the page.");
		try {
			return await r.callWS({
				type: `alarmio_health/${t}`,
				...n
			});
		} catch (e) {
			throw HB(e);
		}
	};
	return {
		call: t,
		summary: () => t("summary"),
		history: (e) => t("history", { range: e }),
		incidents: async () => (await t("incidents")).incidents,
		runE2E: () => t("run_e2e_test")
	};
}
// src/element.tsx
var WB = "alarmio-health-fonts";
function GB() {
	if (document.getElementById(WB)) return;
	let e = document.createElement("style");
	e.id = WB, e.textContent = x, document.head.appendChild(e);
}
var KB = class extends HTMLElement {
	root = null;
	_hass = null;
	api = UB(() => this._hass);
	_narrow = !1;
	menuButton = null;
	registerMenu = (e) => {
		this.menuButton = e, e && Object.assign(e, {
			hass: this._hass,
			narrow: !0
		});
	};
	set hass(e) {
		this._hass = e, this.menuButton && Object.assign(this.menuButton, { hass: e });
	}
	get hass() {
		return this._hass;
	}
	set narrow(e) {
		let t = e === !0;
		t !== this._narrow && (this._narrow = t, this.renderApp());
	}
	get narrow() {
		return this._narrow;
	}
	set panel(e) {}
	set route(e) {}
	connectedCallback() {
		GB();
		let e = this.shadowRoot ?? this.attachShadow({ mode: "open" });
		if (!e.querySelector("style")) {
			let t = document.createElement("style");
			t.textContent = b, e.appendChild(t);
		}
		let t = e.querySelector("div");
		t || (t = document.createElement("div"), e.appendChild(t)), this.root ??= (0, y.createRoot)(t), this.renderApp();
	}
	renderApp() {
		this.root?.render(/* @__PURE__ */ (0, F.jsx)(v.StrictMode, { children: /* @__PURE__ */ (0, F.jsx)(VB, {
			api: this.api,
			narrow: this._narrow,
			registerMenu: this.registerMenu
		}) }));
	}
	disconnectedCallback() {
		this.root?.unmount(), this.root = null, this.menuButton = null;
	}
};
customElements.get("alarmio-health-panel") || customElements.define("alarmio-health-panel", KB);
