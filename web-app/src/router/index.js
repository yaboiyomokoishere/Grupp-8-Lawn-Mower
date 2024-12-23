import {createRouter, createWebHistory} from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import SignUpView from '@/views/SignUpView.vue';
import Dashboard from '@/views/CustomerViews/Dashboard.vue';
import {useToast} from "vue-toastification";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/signup',
            name: 'signup',
            component: SignUpView
        },
        // Customer Routes
        {
            path: '/Dashboard',
            name: 'dashboard',
            component: Dashboard,
            // Require authentication based on the meta property, see the beforeach guard below
            meta: { requiresAuth: true } 
        }, 
        {
            path: '/:catchAll(.*)', // Catch-all route for any unmatched routes
            name: 'not-found',
            component: HomeView
        }
    ]
});


export const isAuthenticated = () => !!localStorage.getItem('accessToken');

const toast = useToast();
// Global navigation guard
router.beforeEach((to, from, next) => {
    // Check if the route requires authentication
    if (to.meta.requiresAuth && !isAuthenticated()) {
        toast.error("You are not logged in. Please log in to access this page.");
        next('/login'); // Redirect to login page
    } else{
        next()
    }
});

export default router;