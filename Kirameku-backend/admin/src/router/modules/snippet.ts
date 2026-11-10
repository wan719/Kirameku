import { snippet } from "@/router/enums";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/snippet",
  name: "Snippet",
  component: Layout,
  redirect: "/snippet/index",
  meta: {
    icon: "ri:sticky-note-line",
    title: "碎片管理",
    rank: snippet
  },
  children: [
    {
      path: "/snippet/index",
      name: "SnippetIndex",
      component: () => import("@/views/snippet/index.vue"),
      meta: { title: "碎片管理" }
    }
  ]
} satisfies RouteConfigsTable;
