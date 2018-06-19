import Vue from 'vue';
import Router from 'vue-router';
import mainpage from '../components/mainpage.vue';
import admin from '../components/admin.vue';
import masters from '../components/masters.vue';
import clients from '../components/clients.vue';
import cities from '../components/cities.vue';
import reservations from '../components/reservations.vue';
import notFound from '../components/NotFound.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Main',
            component: mainpage
        },
        
        {
            path: '*',
            name: 'NotFound',
            component: notFound
        },
    
        {
            path: '/admin',
            name: 'Admin',
            component: admin,
            children: [
                {
                    path: 'masters',
                    component: masters
                },
        
                {
                    path: 'clients',
                    component: clients
                },
        
                {
                    path: 'cities',
                    component: cities
                },
        
                {
                    path: 'reservations',
                    component: reservations
                }
            ]
        }
    ]
});