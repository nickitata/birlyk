//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-C9-MeJfD.js
var manifest = { "512ffdc0feb6e3f1300c22b6e37bbbdcf4bb4f7b0ec960cb29975e3f3ac1c5f2": {
	functionName: "analyzeVenue_createServerFn_handler",
	importer: () => import("./_ssr/venue.functions-D7jdHY2F.mjs")
} };
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ??= await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
