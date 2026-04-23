import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
	server: {
		hmr: true,
		proxy: {
			"/Dituiapi": {
				// 匹配请求路径，
				target: "https://dt.cft.100ppi.com/", // 代理的目标地址
				// 开发模式，默认的127.0.0.1,开启后代理服务会把origin修改为目标地址
				changeOrigin: true,
				// secure: true, // 是否https接口
				// ws: true, // 是否代理websockets

				// 路径重写，**** 如果你的后端有统一前缀(如:/api)，就不开启；没有就开启
				//简单来说，就是是否改路径 加某些东西
				// rewrite: (path) => path.replace(/^\/tqapi/, '')
			},
		},
	},
	plugins: [
		vue(),
		tailwindcss(),
		AutoImport({
			imports: ["vue"],
			resolvers: [ElementPlusResolver({importStyle: 'sass'})],
		}),
		Components({
			resolvers: [ElementPlusResolver({importStyle: 'sass'})],
			dirs: ["src/components"],
			dts: true,
		}),
	],
	css: {
		preprocessorOptions: {
			// 全局样式引入
			scss: {
				// 文件路径，注意最后需要添加 ';'
				additionalData: `@use "@/styles/element-override.scss" as *;`, 
			},
		},
	},
	envDir: "./src",
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		minify: "terser",
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
			},
		},
		rollupOptions: {
			output: {
				// 在这里修改静态资源路径
				chunkFileNames: `assets/js/[name]-[hash].js`,
				entryFileNames: `assets/js/[name]-[hash].js`,
				assetFileNames: `assets/[ext]/[name]-[hash].[ext]`,
			},
		},
	},
});
