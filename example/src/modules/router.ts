import Vue from 'vue';
import Router from 'vue-router';
import Global from './Global';

Vue.use(Router);

const Main = [
    {
        path: '/',
        name: 'root',
        redirect: '/home',
        component: () => import('../views/Index.vue'),
        children: [
            {
                path: '/home',
                component: () => import('../views/Home.vue')
            }, {
                path: '/plug',
                component: () => import('../views/Plug.vue')
            }
        ]
    }, {
        path: '/about/:id',
        component: () => import('../views/About.vue')
    }, {
        path: '/page/:id',
        component: () => import('../views/Page.vue')
        // 分模块打包路由
        // component: () => import(/* webpackChunkName: "page" */'../views/About.vue')
    }
]

/** 路由模块 */
const router = new Router({
    // // 路由切换时回到顶部
    // scrollBehavior(to, from, savedPosition) {
    //     if (savedPosition) {
    //         return savedPosition
    //     } else {
    //         return {
    //             x: 0,
    //             y: 0
    //         }
    //     }
    // },
    linkActiveClass: 'link-active',
    routes: Main,
    mode: "history"
});

// // 监控分享路由链接（微信端用）
// router.beforeEach((to, from, next) => {
//     let url = window.location.href;
//     if (url.indexOf('?wxshare') > 0) {
//         url = url.slice(0, url.indexOf('='));
//         window.location.href = url.replace('?wxshare', '#');
//     } else {
//         next();
//     }
// });

// 监听浏览器按钮去触发定义的切换状态
window.addEventListener('popstate', function() {
    Global.routeBack = true;
});

export default router;