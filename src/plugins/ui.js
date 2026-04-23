// plugins/ui.js
import { createApp, h } from 'vue';
import Loading from 'vue-loading-overlay';
// 修改 CSS 引入路径为 Vue 3 的正确路径
import 'vue-loading-overlay/dist/css/index.css';
import { toast } from 'vue-sonner';

// 默认 Loading 配置（与 shadcn 蓝色主题一致）
const defaultLoadingOptions = {
    fullPage: true,
    loader: 'spinner',
    color: '#3b82f6',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 9999,
};

/**
 * 创建一个独立的 Loading 实例
 * @param {string|object} textOrOptions - 提示文本 或 覆盖配置对象
 * @returns {object} 包含 close 方法的实例对象
 */
function createLoading(textOrOptions) {
    let options = { ...defaultLoadingOptions };
    if (typeof textOrOptions === 'string') {
        options.message = textOrOptions;
    } else if (typeof textOrOptions === 'object') {
        options = { ...options, ...textOrOptions };
    }

    const mountEl = document.createElement('div');
    document.body.appendChild(mountEl);

    const app = createApp({
        render() {
            return h(Loading, {
                ...options,
                active: true,
                onHide: () => {
                    app.unmount();
                    if (mountEl.parentNode) {
                        mountEl.parentNode.removeChild(mountEl);
                    }
                },
            });
        },
    });

    const instance = app.mount(mountEl);
    console.log(instance)
    return {
        close: () => {
            if (instance && instance.hide) {
                instance.hide();
            }
        },
    };
}

// 封装全局 Message 方法
const message = {
    info: (msg, options) => toast(msg, options),
    success: (msg, options) => toast.success(msg, options),
    error: (msg, options) => toast.error(msg, options),
    warning: (msg, options) => toast.warning(msg, options),
    loading: (msg, options) => toast.loading(msg, options),
    promise: (promise, msgs, options) => toast.promise(promise, msgs, options),
    dismiss: (toastId) => toast.dismiss(toastId),
};

// 定义插件
export default {
    install(app, options = {}) {
        if (options.loading) {
            Object.assign(defaultLoadingOptions, options.loading);
        }

        // 挂载全局属性（支持选项式 API）
        app.config.globalProperties.$loading = {
            service: createLoading,
        };
        app.config.globalProperties.$message = message;

        // 提供组合式 API 注入
        app.provide('globalLoading', { service: createLoading });
        app.provide('globalMessage', message);
    },
};