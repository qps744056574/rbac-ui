import {LayoutComponent} from '../layout/layout.component';
import {LoginComponent} from './pages/login/login.component';
import {PagesComponent} from './pages/pages/pages.component';
import {ButtonDemoComponent} from "./buttons/buttonDemo/button-demo.component";
import {RouterGuardService} from "../core/routerGuard/router-guard.service";
import {OrganizationComponent} from "./organization/organization/organization.component";
// 设置路由指向
export const routes = [
  {
    path: 'main',
    component: LayoutComponent,
    children: [
      {path: '', redirectTo: '/main/home', pathMatch: 'full'},
      {path: 'home', loadChildren: './home/home.module#HomeModule'},
      {path: 'organ', loadChildren: './organ/organ.module#OrganModule'},
      {path: 'datatables', loadChildren: './datatables/datatables.module#DatatablesModule'},
      {path: 'system', loadChildren: './system/system.module#SystemModule'},
      {path: 'msg', loadChildren: './msg/msg.module#MsgModule'},
      {path: 'echarts', loadChildren: './echarts/echarts.module#EchartsModule'},
      {path: 'role', loadChildren: './role/role.module#RoleModule'},
      {path: 'limit', loadChildren: './limit/limit.module#LimitModule'},
      {path: 'operationpage', loadChildren: './operationpage/operationpage.module#OperationpageModule'},
      {path: 'navtree', loadChildren: './navtree/navtree.module#NavtreeModule'},
      {path: 'buttons', component: ButtonDemoComponent},
      {path: 'organization',  loadChildren: './organization/organization.module#OrganizationModule'}
    ]
  },
  {
    path: 'pages',
    component: PagesComponent,
    children: [
      {path: '', redirectTo: '/main/home', pathMatch: 'full'},
      {path: 'login', component: LoginComponent}
    ]
  },
  // 路由指向找不到时，指向这里
  {path: '**', redirectTo: '/main/home'}
];
