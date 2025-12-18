// vite.config.ts
import path from "path";
import { defineConfig, loadEnv } from "file:///C:/Users/pp%20solution/Downloads/syncflow/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/pp%20solution/Downloads/syncflow/node_modules/@vitejs/plugin-react/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\pp solution\\Downloads\\syncflow";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    server: {
      port: 3e3,
      host: "0.0.0.0"
    },
    plugins: [react()],
    define: {
      "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY),
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "."),
        "yjs": path.resolve(__vite_injected_original_dirname, "node_modules/yjs/dist/yjs.mjs")
      },
      dedupe: [
        "yjs",
        "y-protocols",
        "y-prosemirror",
        "@tiptap/extension-collaboration",
        "@tiptap/extension-collaboration-cursor",
        "prosemirror-model",
        "prosemirror-state",
        "prosemirror-view",
        "prosemirror-transform"
      ]
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxwcCBzb2x1dGlvblxcXFxEb3dubG9hZHNcXFxcc3luY2Zsb3dcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHBwIHNvbHV0aW9uXFxcXERvd25sb2Fkc1xcXFxzeW5jZmxvd1xcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvcHAlMjBzb2x1dGlvbi9Eb3dubG9hZHMvc3luY2Zsb3cvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XHJcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCAnLicsICcnKTtcclxuICByZXR1cm4ge1xyXG4gICAgc2VydmVyOiB7XHJcbiAgICAgIHBvcnQ6IDMwMDAsXHJcbiAgICAgIGhvc3Q6ICcwLjAuMC4wJyxcclxuICAgIH0sXHJcbiAgICBwbHVnaW5zOiBbcmVhY3QoKV0sXHJcbiAgICBkZWZpbmU6IHtcclxuICAgICAgJ3Byb2Nlc3MuZW52LkFQSV9LRVknOiBKU09OLnN0cmluZ2lmeShlbnYuR0VNSU5JX0FQSV9LRVkpLFxyXG4gICAgICAncHJvY2Vzcy5lbnYuR0VNSU5JX0FQSV9LRVknOiBKU09OLnN0cmluZ2lmeShlbnYuR0VNSU5JX0FQSV9LRVkpXHJcbiAgICB9LFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICBhbGlhczoge1xyXG4gICAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4nKSxcclxuICAgICAgICAneWpzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ25vZGVfbW9kdWxlcy95anMvZGlzdC95anMubWpzJyksXHJcbiAgICAgIH0sXHJcbiAgICAgIGRlZHVwZTogW1xyXG4gICAgICAgICd5anMnLFxyXG4gICAgICAgICd5LXByb3RvY29scycsXHJcbiAgICAgICAgJ3ktcHJvc2VtaXJyb3InLFxyXG4gICAgICAgICdAdGlwdGFwL2V4dGVuc2lvbi1jb2xsYWJvcmF0aW9uJyxcclxuICAgICAgICAnQHRpcHRhcC9leHRlbnNpb24tY29sbGFib3JhdGlvbi1jdXJzb3InLFxyXG4gICAgICAgICdwcm9zZW1pcnJvci1tb2RlbCcsXHJcbiAgICAgICAgJ3Byb3NlbWlycm9yLXN0YXRlJyxcclxuICAgICAgICAncHJvc2VtaXJyb3ItdmlldycsXHJcbiAgICAgICAgJ3Byb3NlbWlycm9yLXRyYW5zZm9ybScsXHJcbiAgICAgIF0sXHJcbiAgICB9LFxyXG4gIH07XHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW1ULE9BQU8sVUFBVTtBQUNwVSxTQUFTLGNBQWMsZUFBZTtBQUN0QyxPQUFPLFdBQVc7QUFGbEIsSUFBTSxtQ0FBbUM7QUFJekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDeEMsUUFBTSxNQUFNLFFBQVEsTUFBTSxLQUFLLEVBQUU7QUFDakMsU0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLElBQ1I7QUFBQSxJQUNBLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxJQUNqQixRQUFRO0FBQUEsTUFDTix1QkFBdUIsS0FBSyxVQUFVLElBQUksY0FBYztBQUFBLE1BQ3hELDhCQUE4QixLQUFLLFVBQVUsSUFBSSxjQUFjO0FBQUEsSUFDakU7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLEdBQUc7QUFBQSxRQUNoQyxPQUFPLEtBQUssUUFBUSxrQ0FBVywrQkFBK0I7QUFBQSxNQUNoRTtBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ047QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
