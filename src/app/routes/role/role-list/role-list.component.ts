import {Component, OnInit, Output, ViewChild} from '@angular/core';
import {AjaxService} from "../../../core/services/ajax.service";
import {RolemanComponent} from "../roleman/roleman.component";
import {ActivatedRoute} from "@angular/router";
import {RoleService} from "../role/role.service";
@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {

  public sysList;
  public sysName="请先选择系统";
  public sysCode;
  private addButton;

  //获取子组件RolemanComponent的实例，才可以调用它的方法
  @ViewChild(RolemanComponent)
  rolemanComponent: RolemanComponent;

  public addrType;//获取地址的类型，为了加载不同的页面使用的,传递到神龙页面

  constructor(private ajax: AjaxService, private routeInfo: ActivatedRoute,private roleService: RoleService) {
  }

  ngOnInit() {
    //增加的按钮
    this.addButton = {
      type: "add",
      text: "新增角色",
      title: '新增角色'
    };
    //系统列表的接口，以及设置初始化的sysCode，然后根据sysCode调用初始化的角色列表

    let data=JSON.parse(localStorage.getItem('sysListData'));
    this.sysCode = data[0].sysCode;
    this.sysName = data[0].sysName;
    this.sysList = data;


    //获取到路由传递过来的类型，从而在神龙的提交的时候加载刷新不同的页面
    this.addrType = this.routeInfo.snapshot.data[0]["type"];
  }

  onSelectSys(sysCode,sysName): void {
    this.sysCode = sysCode;
    this.sysName = sysName;
  }
  /**
   * 刷新角色列表
   */
  refresh() {
    this.rolemanComponent.queryRoleListDatasBySyscode();
  }


}
