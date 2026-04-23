
import { createAxiosByinterceptors } from '@/request/net' 
const axios = createAxiosByinterceptors({
    // baseURL: import.meta.env.VITE_BASE_URL,
    headers: { 
        'content-type': 'application/x-www-form-urlencoded',
        // 'usertest': import.meta.env.VITE_USERTEST,
        'appid': 10006,
        'appsecret': 'ed29lGkaoa/P3McCYgjEwT/DJvquhIcMKBcxsCo8VdAF0My46IAeQTk',
        'userid': localStorage.getItem('userid') || '',
    },
    timeout: 1 * 10 * 1000
})

export default axios