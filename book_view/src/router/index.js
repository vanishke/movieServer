import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
import Axios from 'axios'
import MovieDetail from '../pages/movieDetail.vue'
import NewDetail from '../pages/newDetail.vue'
import MovieList from '../components/movieList.vue'
import LoginPage from '../pages/loginPage.vue'
import UserInfo from '../pages/userInfo.vue'
import RegisterPage from '../pages/registerPage.vue'
import FindPasswordPage from '../pages/findPasswordPage.vue'
import SendEmail from '../pages/sendEmail.vue'
import AdminPage from '../pages/adminPage.vue'
// import Home from '../pages/index'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
Vue.use(Router)
Vue.use(VueResource)
Vue.use(Axios)
Vue.use(iView)
Vue.http.options.emulateJSON = true
const routes = [
  {
    path: '/',
    component: resolve => require(['../pages/index'], resolve),
    meta: {
      title: 'home'
    }
  },
  {
    path: '/movieDetail',
    component: MovieDetail
  },
  {
    path: '/newDetail',
    component: NewDetail
  },
  {
    path: '/movieList',
    component: MovieList
  },
  {
    path: '/loginPage',
    component: LoginPage
  },
  {
    path: '/userInfo',
    component: UserInfo
  },
  {
    path: '/register',
    component: RegisterPage
  },
  {
    path: '/findPassword',
    component: FindPasswordPage
  },
  {
    path: '/sendEmail',
    component: SendEmail
  },
  {
    path: '/admin',
    component: AdminPage
  }
]
const router = new Router({routes})
export default router
