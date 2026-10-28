import { _ as createFileRoute, g as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/events._id-YzmR1ksP.js
var $$splitComponentImporter = () => import("./events._id-BDhGvjAB.mjs");
var Route = createFileRoute("/_authenticated/events/$id")({
	head: () => ({ meta: [{ title: "Manage event — Birlyk" }, {
		name: "description",
		content: "Edit event details, guests and the venue map."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
