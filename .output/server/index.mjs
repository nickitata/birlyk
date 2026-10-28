globalThis.__nitro_main__ = import.meta.url;
import { i as HTTPError, n as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.png": {
		"type": "image/png",
		"etag": "\"957-afD+e7QQnwhD6lbrgobF2nR3rUo\"",
		"mtime": "2026-10-15T19:25:16.753Z",
		"size": 2391,
		"path": "../public/favicon.png"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"ae-hLVBrSrDdpIw3Xl0dJPRkupPepQ\"",
		"mtime": "2026-10-15T19:25:16.754Z",
		"size": 174,
		"path": "../public/robots.txt"
	},
	"/assets/auth-BhY38wPN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1865-Ac0ojDwKUFjTDcpeApky5MptJlc\"",
		"mtime": "2026-10-15T22:59:04.695Z",
		"size": 6245,
		"path": "../public/assets/auth-BhY38wPN.js"
	},
	"/assets/backend-api-Dvejx1OH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20c7-7Q+amtmnNP2iL3ohnG2BHLp4ryM\"",
		"mtime": "2026-10-15T22:59:04.712Z",
		"size": 8391,
		"path": "../public/assets/backend-api-Dvejx1OH.js"
	},
	"/assets/button-7O5-Qa1u.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"41a72-jHIXol//AmmoxI4ivXcdJKVBz4U\"",
		"mtime": "2026-10-15T22:59:04.726Z",
		"size": 268914,
		"path": "../public/assets/button-7O5-Qa1u.js"
	},
	"/assets/calendar-days-CxPKjpEN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e3-+QixjGiHcfzf/or5EQ10InXQA4s\"",
		"mtime": "2026-10-15T22:59:04.728Z",
		"size": 483,
		"path": "../public/assets/calendar-days-CxPKjpEN.js"
	},
	"/assets/camera-B1XvfDxt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"145-9H8owo4HJ0J+9ijZ40JZ1VBzD94\"",
		"mtime": "2026-10-15T22:59:04.730Z",
		"size": 325,
		"path": "../public/assets/camera-B1XvfDxt.js"
	},
	"/assets/dashboard-DEPxcUzb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f25-0JDufwW1IHqszW7KfXkO+2ejPzM\"",
		"mtime": "2026-10-15T22:59:04.732Z",
		"size": 3877,
		"path": "../public/assets/dashboard-DEPxcUzb.js"
	},
	"/assets/e._slug-DPzEN-5P.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4cc-uHtw7CL8pl0PHjqPBFR79GpYWyc\"",
		"mtime": "2026-10-15T22:59:04.744Z",
		"size": 1228,
		"path": "../public/assets/e._slug-DPzEN-5P.js"
	},
	"/assets/dist-X2xtCkc6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"91bf-AafQmRSCPZF8w52rwQ0pPdSxFLQ\"",
		"mtime": "2026-10-15T22:59:04.743Z",
		"size": 37311,
		"path": "../public/assets/dist-X2xtCkc6.js"
	},
	"/assets/events._id-CW0kDpDH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6141-Rv3pQTgzlwLQue77iG52DoYurVY\"",
		"mtime": "2026-10-15T22:59:04.745Z",
		"size": 24897,
		"path": "../public/assets/events._id-CW0kDpDH.js"
	},
	"/assets/GuestLookup-BA8BdfBA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fd8-zoMwaQCUlT1BiADaOg7eVfpKKhA\"",
		"mtime": "2026-10-15T22:59:04.663Z",
		"size": 4056,
		"path": "../public/assets/GuestLookup-BA8BdfBA.js"
	},
	"/assets/input-CwxgoU9c.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26c-SWFvZ7jYRVbb+7qXPOABfOJOnXk\"",
		"mtime": "2026-10-15T22:59:04.746Z",
		"size": 620,
		"path": "../public/assets/input-CwxgoU9c.js"
	},
	"/assets/index-DE5HBeym.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6a491-Ygeue0hrsIsTDErb38+l7wqA2J4\"",
		"mtime": "2026-10-15T22:59:04.649Z",
		"size": 435345,
		"path": "../public/assets/index-DE5HBeym.js"
	},
	"/assets/hero-hall-CcKpF8lE.jpg": {
		"type": "image/jpeg",
		"etag": "\"32fed-L4FShCziVAAHR2As1Rzz8/iCh7U\"",
		"mtime": "2026-10-15T22:59:05.028Z",
		"size": 208877,
		"path": "../public/assets/hero-hall-CcKpF8lE.jpg"
	},
	"/assets/label-Cp_o9J_Y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2ad-GYTyMpcWU2ZUf7k6MsS+7BjZpvw\"",
		"mtime": "2026-10-15T22:59:04.827Z",
		"size": 685,
		"path": "../public/assets/label-Cp_o9J_Y.js"
	},
	"/assets/not-found-DIgawKw1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"37-RTB6YH5iXRKeXz1Sn6ZQ+vS0lnc\"",
		"mtime": "2026-10-15T22:59:04.932Z",
		"size": 55,
		"path": "../public/assets/not-found-DIgawKw1.js"
	},
	"/assets/preload-helper-laPdRjKj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3983-wHIEFKItpF+eQgXVIvunrvyIKBU\"",
		"mtime": "2026-10-15T22:59:05.013Z",
		"size": 14723,
		"path": "../public/assets/preload-helper-laPdRjKj.js"
	},
	"/assets/route-5vFsVy1t.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8b-VjYHEPd1RRB1ZoRKcVp69t/R5yI\"",
		"mtime": "2026-10-15T22:59:05.015Z",
		"size": 139,
		"path": "../public/assets/route-5vFsVy1t.js"
	},
	"/assets/routes-C3-G1U7f.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a81-EBhebUXCE/VUG/1SlYBsvtk43i4\"",
		"mtime": "2026-10-15T22:59:05.016Z",
		"size": 2689,
		"path": "../public/assets/routes-C3-G1U7f.js"
	},
	"/assets/styles-tmNwQXGv.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"12bef-WrTMk4f4Eu8WxwydZo+72+pAVCU\"",
		"mtime": "2026-10-15T22:59:05.029Z",
		"size": 76783,
		"path": "../public/assets/styles-tmNwQXGv.css"
	},
	"/assets/useRouter-jReI_Skg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"229c-36sVB4uTGvSd1pXko2MAM7Rg04w\"",
		"mtime": "2026-10-15T22:59:05.025Z",
		"size": 8860,
		"path": "../public/assets/useRouter-jReI_Skg.js"
	},
	"/assets/useSelector-C9OL-8Mq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"888-i2iLmxsa5WFb8hL1TxYaCiYi/U8\"",
		"mtime": "2026-10-15T22:59:05.026Z",
		"size": 2184,
		"path": "../public/assets/useSelector-C9OL-8Mq.js"
	},
	"/assets/VenueMap-C5xZTVvX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1328-bGiLkmwwXfAm043qSUiRHVDC9xA\"",
		"mtime": "2026-10-15T22:59:04.693Z",
		"size": 4904,
		"path": "../public/assets/VenueMap-C5xZTVvX.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy__6SuAW = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy__6SuAW
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
