import {createRouter, createWebHistory} from 'vue-router';
import { jwtDecode } from "jwt-decode";

import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import SignUpView from '@/views/SignUpView.vue';
import Pricing from '@/views/Pricing.vue';
import CustomerProfile from '@/views/CustomerViews/CustomerProfile.vue';
import CustomerContracts from '@/views/CustomerViews/CustomerContracts.vue';
import Dashboard from '@/views/AdminViews/Dashboard.vue';
import CustomerNewOrder from '@/views/CustomerViews/CustomerNewOrder.vue';
import CustomerContract from '@/views/CustomerViews/CustomerContract.vue';
import CustomerConfirmOrder from '@/views/CustomerViews/CustomerConfirmOrder.vue';
import CustomerLog from '@/views/CustomerViews/CustomerLog.vue';
import CustomerUpdateContract from '@/views/CustomerViews/CustomerUpdateContract.vue';
import UserManagement from '@/views/AdminViews/UserManagement.vue';
import EditUser from '@/views/AdminViews/EditUser.vue';
import AdminContractView from '@/views/AdminViews/AdminContractView.vue';
import UpdateContractAsCustomer from '@/views/AdminViews/UpdateContractAsCustomer.vue';
import AdminCreateUser from '@/views/AdminViews/AdminCreateUser.vue';
import CustomerContractReport from '@/views/CustomerViews/CustomerContractReport.vue';
import TechHomeView from '@/views/TechnicianViews/TechHomeView.vue';
import TechMowersView from '@/views/TechnicianViews/TechMowersView.vue';
import TechReportsView from '@/views/TechnicianViews/TechReportsView.vue';
import EditMower from '@/views/TechnicianViews/EditMower.vue';
import TechHandleReportView from '@/views/TechnicianViews/TechHandleReportView.vue';
import AdminaddMowerView from '@/views/AdminViews/AdminaddMowerView.vue';
import AdminMowersView from '@/views/AdminViews/AdminMowerView.vue';
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // Generic Routes
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView,
        },
        {
            path: '/pricing',
            name: 'pricing',
            component: Pricing
        },
        {
            path: '/signup',
            name: 'signup',
            component: SignUpView
        },
        // -------------------------CUSTOMER ROUTES------------------------
        {
            path: '/customer/profile',
            name: 'customer_profile',
            component: CustomerProfile,
            // Require authentication based on the meta property, see the beforeach guard below
            meta: { requiresAuth: true, role: 'customer' }
        }, 
        {
            path: '/customer/contracts',
            name: 'customer_contracts',
            component: CustomerContracts,
            // Require authentication based on the meta property, see the beforeach guard below
            meta: { requiresAuth: true, role: ['customer'] },
        }, 
        {
            path: '/customer/contracts/orderContract',
            name: 'order_contract',
            component: CustomerNewOrder,
            meta: { requiresAuth: true, role: ['customer'] },
        },
        {
            path: '/customer/contracts/viewContract/:id',
            name: 'customer_contract_view',
            component: CustomerContract,
            meta: { requiresAuth: true, role: ['customer'] },
        },
        {
            path: '/customer/contracts/confirmOrder/',
            name: 'confirm_order',
            component: CustomerConfirmOrder,
            meta: { requiresAuth: true, role: ['customer'] }
        },
        {
            path: '/customer/contracts/viewContract/viewLog/:id',
            name: 'customer_Log_view',
            component: CustomerLog,
            meta: { requiresAuth: true, role: ['customer', 'admin'] },
        },
        {
            path: '/customer/contracts/updateContract/:id',
            name: 'customer_update_contract',
            component: CustomerUpdateContract,
            meta: { requiresAuth: true, role: ['customer'] }
        },
        {
            path: '/customer/contracts/reports/:id',
            name: 'customer_contract_report',
            component: CustomerContractReport,
            meta: { requiresAuth: true, role: ['customer', 'admin', 'technician'] }
        },
        // -------------------------ADMIN  ROUTES------------------------
        {
            path: '/admin/dashboard',
            name: 'admin_dashboard',
            component: Dashboard,
            // Require authentication based on the meta property, see the beforeach guard below
            meta: { requiresAuth: true, role: ['admin'] }
        },
        {
            path: '/admin/users',
            name: 'admin_users',
            component: UserManagement,
            meta: { requiresAuth: true, role: ['admin'] }
        },
        {
            path: '/admin/users/:customerId',
            name: 'admin_user_edit',
            component: EditUser,
            meta: { requiresAuth: true, role: ['admin'] }
        },
        {
            path: '/admin/users/:customerId/sla/:id',
            name: 'admin_user_sla',
            component: AdminContractView,
            meta: { requiresAuth: true, role: ['admin'] }
        },
        {
            path: '/admin/users/:customerId/sla/:id/updateAsCustomer',
            name: 'update_as_customer',
            component: UpdateContractAsCustomer,
            meta: { requiresAuth: true, role: ['admin'] }
        },
        {
            path: '/admin/users/createUser',
            name: 'admin_create_user',
            component: AdminCreateUser,
            meta: { requiresAuth: true, role: ['admin'] }
        },
        {
            path: '/admin/mowers',
            name: 'admin_mowers',
            component: AdminMowersView,
            meta: { requiresAuth: true, role: ['admin'] }

        },
        {
            path: '/admin/mowers/add_mower',
            name: 'admin_add_mower',
            component: AdminaddMowerView,
            meta: { requiresAuth: true, role: ['admin']}
        },

        // -------------------------Technician  ROUTES------------------------
        {
            path: '/technician/home',
            name: 'technician_home',
            component: TechHomeView,
            meta: { requiresAuth: true, role: ['technician'] }
        },
        {
            path: '/technician/mowers',
            name: 'technician_mowers',
            component: TechMowersView,
            meta: { requiresAuth: true, role: ['technician'] }
        },
        {
            path: '/technician/reports',
            name: 'technician_reports',
            component: TechReportsView,
            meta: { requiresAuth: true, role: ['technician', 'admin'] }
        },
        {
            path: '/technician/mower/:id',
            name: 'technician_mower_edit',
            component: EditMower,
            meta: { requiresAuth: true, role: ['technician', 'admin']}
        },
        {
            path: '/technician/report/:id',
            name: 'technician_report_view',
            component: TechHandleReportView,
            meta: { requiresAuth: true, role: ['technician']}
        },
        {
            path: '/:catchAll(.*)', // Catch-all route for any unmatched routes
            name: 'not_found',
            component: HomeView
        }
    ]
});


export const isAuthenticated = () => !!localStorage.getItem('accessToken');


// Global navigation guard
router.beforeEach((to, from, next) => {
    // Check if the route requires authentication
    if (to.meta.requiresAuth) {
        const token = localStorage.getItem('accessToken');
        if (!token) { // If the token is not present then the user is not authenticated
            // Redirect to the login page
            console.log('Redirecting to login');
            next({ name: 'login' });
        } else {
            try {
                const decodedToken = jwtDecode(token);
                // Check token expiration if needed
                if(to.meta.role.includes(decodedToken.user.role)) {
                    console.log("Access granted");
                    next();
                } else{
                    console.log("Access denied");
                    localStorage.removeItem('accessToken');
                    next({ name: 'home' });
                }
            } catch (error) {
                console.error('Token err:', error);
                localStorage.removeItem('accessToken');
                next({ name: 'login' });
            }
        }
    } else {
        next();
    }
});

export default router;