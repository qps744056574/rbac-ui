/**
 * 系统管理
 * @type {{text: string; link: string; icon: string; submenu: [{text: string; link: string},{text: string; link: string}]}}
 */
const system = {
  text: '系统管理',
  icon: 'fa fa-gears text-center',
  alert: 'child',
  submenu: [
    {
      text: '平台系统',
      link: '/system/v1'
    },
    {
      text: '管理员管理',
      link: '/account/v1'
    },
    {
      text: '密码修改',
      link: '/system/v2'
    }
  ]
};

/**
 * 机构管理
 * @type {{text: string; link: string; icon: string}}
 */
const organ = {
  text: '组织架构',
  link: '/organ',
  icon: 'fa fa-sitemap text-center'
};

/**
 * 权限管理
 * @type {{text: string; link: string; icon: string}}
 */
const limit = {
  text: '权限管理',
  link: '/limit',
  icon: 'fa fa-lock text-center'
};

/**
 * 角色管理
 * @type {{text: string; link: string; icon: string}}
 */
const role = {
  text: '角色管理',
  link: '/role',
  icon: 'fa fa-group text-center'
};

/**
 * 账户管理
 * @type {{text: string; link: string; icon: string}}
 */
/*const account = {
  text: '账户管理',
  icon: 'fa fa-user text-center',
  elink: 'http://www.baidu.com/',
  alert: 'child',
  submenu: [
    {
      text: '管理员管理',
      link: '/account/v1'
    },
    {
      text: '员工账户管理',
      link: '/account/v2'
    }
  ]
};*/
const SystemMain = {
  text: '测试菜单',
  heading: true
};
const datatables = {
  text: '列表',
  link: '/datatables',
  icon: 'icon-chart',
  submenu: [
    {
      text: 'datatables',
      link: '/datatables/datatable'
    },
    {
      text: 'ng2-datatable',
      link: '/datatables/ng2-datatable'
    }
  ]
};
const msg = {
  text: '弹框和消息通知',
  link: '/msg',
  icon: 'icon-volume-2'
};
const echarts = {
  text: 'echarts图表',
  link: '/echarts',
  icon: 'fa fa-bar-chart'
};
const operationpage = {
  text: '操作页面',
  link: '/operationpage',
  icon: 'icon-doc'
};
const navtree = {
  text: '树',
  link: '/navtree',
  icon: 'fa fa-code-fork'
};
const buttons = {
  text: '按钮',
  link: '/buttons',
  icon: 'fa fa-toggle-off'
};
/**
 * 菜单配置
 * @type {[{text: string; link: string; icon: string; submenu: {text: string; link: string}[]},{text: string; link: string; icon: string},{text: string; link: string; icon: string},{text: string; link: string; icon: string},{text: string; link: string; icon: string; submenu: {text: string; link: string}[]}]}
 */
export const menu = [
  organ,
  // account,
  role,
  limit,
  system,
  SystemMain,
  datatables,
  msg,
  echarts,
  operationpage,
  navtree,
  buttons
];
