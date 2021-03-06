import {Injectable} from "@angular/core";
import {any} from "codelyzer/util/function";
import {isNullOrUndefined} from "util";
import {CookieService} from "angular2-cookie/core";

//后台菜单返回格式
interface menuVO{
  sysCode:string;
  menuCode:string;
  menuName:string;
  menuUrl:string;
  menuIcon?:string;
  preMenuCode?:string;
  subMenuList?:Array<any>;
  level?:number;
  ord?:number;
  remarks?:string;
  isUse:string;
}

class MenuItem {
  text:string;  //菜单文字
  heading:boolean;  //
  link:string;     // internal route links
  elink:string;    // used only for external links
  target:string;   // anchor target="_blank|_self|_parent|_top|framename"
  icon:string;  //图标
  alert:string; //
  submenu:Array<any>;
}

@Injectable()
export class MenuService {

  constructor(private cookie:CookieService) {
  }

  foreachPushMenu(items:Array<menuVO>) {
    let menuItems:Array<MenuItem> = [],menuItem:MenuItem;
    //console.log("█ items ►►►",  items);
    items.forEach((item) => {
      menuItem = new MenuItem();
      //设置菜单显示名称
      menuItem.text = item.menuName;
      //判断菜单是否有下级
      if (item.menuUrl == "#") {
        menuItem.alert = "child";
        menuItem.submenu = this.foreachPushMenu(item.subMenuList);
      }
      else menuItem.link = item.menuUrl;

      //判断菜单图标是否为空
      if (!isNullOrUndefined(item.menuIcon)) menuItem.icon = item.menuIcon;

      menuItems.push(menuItem);
    });
    return menuItems;
  }

  /**
   * 设置权限菜单信息
   * @param items
   */
  addMenu(items:Array<menuVO>) {
    let _this = this;
    let menuItems:Array<MenuItem> = [],menuItem:MenuItem;

    menuItems = this.foreachPushMenu(items);

    /*items.forEach((item) => {
      menuItem = new MenuItem();
      menuItem.text = item.menuName;
      //判断菜单是否有下级
      if (item.menuUrl == "#") {
        menuItem.alert = "child";
        console.log("█ item.subMenuList ►►►",  item.subMenuList);
      }
      else menuItem.link = item.menuUrl;

      //判断菜单图标是否为空
      if (!isNullOrUndefined(item.menuIcon)) menuItem.icon = item.menuIcon;

      menuItems.push(menuItem);
    });*/
    let menuItemsString = JSON.stringify(menuItems);
    localStorage.setItem('userMenu', menuItemsString); //保存menu信息至cookie
  }

  /**
   * 获取权限菜单
   * @returns {Array<any>}
   */
  getMenu() {
    let menus = JSON.parse(localStorage.getItem("userMenu"));
    return menus; //cookie中取出
  }

}
