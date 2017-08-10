import { Component, ViewChild, OnInit,OnChanges,SimpleChanges } from '@angular/core';
import {SettingsService} from "../../../core/settings/settings.service";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {AddAdminService} from "./add-admin.service";
import {AddorganService} from "../../organ/addorgan/addorgan.service";
import {AdminsService} from "../admins/admins.service";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {PatternService} from "../../../core/forms/pattern.service";
import {SysPlatformService} from "../sys-platform/sys-platform.service";
import {AdminsComponent} from "../admins/admins.component";
import {SelectComponent} from "ng2-select/index";
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';
import {CookieService} from "angular2-cookie/core";

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.scss'],
  providers: [AddAdminService, AddorganService, RzhtoolsService,PatternService,SysPlatformService]
})
export class AddAdminComponent implements OnInit,OnChanges {
  private pageTitle:string = '';
  private path:string;//当前路由
  private Admin:boolean = false;//添加/修改管理员
  private adminDetail:boolean = false;//查看详情
  private updatePwd:boolean = false;//修改密码
  private allotRoleOrGroup = false;//分配角色或角色组
  private systems:string;//系统列表
  private adr:string = '';//地址
  private newpwd:string;//新密码
  private sysCode:string = '';//系统编码
  private orgName:string;
  private admin = { };
  private userState:string;//用户状态
  private userOrgCode:string;//用户的机构编码
  @ViewChild('defaultRole') public mySelectRoles: SelectComponent;//设置默认选中的角色
  @ViewChild('defaultGroup') public mySelectGroup: SelectComponent;//设置默认选中的角色组


  constructor(public settings:SettingsService, private adminsService:AdminsService,
              private tools:RzhtoolsService,private router:Router,private cookieService:CookieService,
              private route:ActivatedRoute,  private systemService:SysPlatformService,
              private addOrgan:AddorganService,private patterns: PatternService,
              private adminsComponent:AdminsComponent,private addAdminService:AddAdminService) {
    this.settings.showRightPage("28%"); // 此方法必须调用！页面右侧显示，带滑动效果,可以自定义宽度：..%  或者 ..px
  }

  ngOnChanges(changes:SimpleChanges):void {
    console.log("█ changes ►►►", changes);
  }

  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;
  // ng2Select
  private Role: Array<object>;
  private Group: Array<object>;
  private selectedRoleStr:string;//已经有的角色的编码组成的字符串
  private selectedGroupStr:string;//已经有的角色组的编码组成的字符串

  private value:any = [];

  public refreshValueRole(value: any): void {
    this.selectedRoleStr = this.itemsToString(value);
    console.log("█ this.selectedRoleStr ►►►",  this.selectedRoleStr);
  }
  public refreshValueGroup(value: any): void {
    this.selectedGroupStr = this.itemsToString(value);
    console.log("█ this.selectedGroupStr ►►►",  this.selectedGroupStr);
  }
  public itemsToString(value:Array<any> = []):string {
    return value
      .map((item:any) => {
        return item.id;
      }).join(',');
  }


  fileChangeListener($event) {
    let image: any = new Image();
    let file: File = $event.target.files[0];
    let myReader: FileReader = new FileReader();
    let that = this;
    myReader.onloadend = function(loadEvent: any) {
      image.src = loadEvent.target.result;
      // that.admin['avatar'] = image.src;
      console.log(image.src)
      // that.cropper.setImage(image);
    };

    myReader.readAsDataURL(file);
  }

  ngOnInit() {
    let me = this;
    me.admin['orgCode'] = '';
    let userInfo = me.cookieService.getObject('loginInfo');
    // console.log(userInfo);
    me.userState = me.cookieService.getObject('loginInfo')['state'];
    me.userOrgCode = me.cookieService.getObject('loginInfo')['orgCode'];
    me.admin['orgCode'] = me.userOrgCode;
    //当前用户不是系统超管时(那就是机构超管或普通管理员)，机构编码为登录者的机构编码
    if(me.userOrgCode !== '#'){
      me.admin['orgCode'] = me.userOrgCode;
    }

    //获取当前路由
    me.route.url.subscribe(urls => {
      me.path = urls[0].path;
      //console.log("█ this.path ►►►", this.path);
      switch (me.path) {
        //新增管理员
        case "addAdmin":
          //console.log("█ \"新增管理员\" ►►►", "新增管理员");
          me.pageTitle = "新增管理员";
          me.Admin = true;
          break;

        //查看管理员信息
        case "adminDetail":
          //console.log("█ \"查看管理员信息\" ►►►", "查看管理员信息");
          me.adminDetail = true;//属于查看详情，需要隐藏可编辑表单
          me.pageTitle = "管理员信息";
          me.admin['mgrCode'] = me.getMgrCode();//获取管理员代码(路由参数)
          me.admin = me.addAdminService.getAdminDetail(me.admin['mgrCode'])//获取某个管理员详情
          break;

        //修改管理员信息
        case "updateAdmin":
          //console.log("█ \"修改管理员信息\" ►►►", "修改管理员信息");
          me.pageTitle = "修改管理员信息";
          me.Admin = true;
          me.admin['mgrCode'] = me.getMgrCode();//获取系统代码(路由参数)
          me.admin = me.addAdminService.getAdminDetail(me.admin['mgrCode'])//获取某个管理员详情
          me.admin['orgName'] = me.getOrgNameByCode(me.admin['orgCode']);//根据机构编码获取某个机构名字
          break;

        //修改管理员密码
        case "updatePwd":
          //console.log("█ \"修改管理员密码\" ►►►", "修改管理员密码");
          me.pageTitle = "修改密码";
          me.updatePwd = true;
          me.admin['mgrCode'] = me.getMgrCode();//获取管理员编码(路由参数)
          me.admin = me.addAdminService.getAdminDetail(me.admin['mgrCode'])//获取某个管理员详情
          break;

        //为管理员分配角色或角色组
        case "allotRole":
          //console.log("█ \"分配角色或角色组\" ►►►", "分配角色或角色组");
          me.pageTitle = "分配角色或角色组";
          me.allotRoleOrGroup = true;
          me.admin['mgrCode'] = me.getMgrCode();//获取管理员编码(路由参数)
          me.admin = me.addAdminService.getAdminDetail(me.admin['mgrCode'])//获取某个管理员详情
          me.systems = me.systemService.getSystemList();//系统列表
          break;
      }
    });

  }


  private selectedChange(){
    this.getRoleAndGroupList();//获取角色/角色组列表
    // this.getMyRoleAndGroupList();//获取已经分配的角色/角色组列表
  }

  /**
   * 获取已经分配的角色/角色组列表
   */
  private getMyRoleAndGroupList(){
    let myRolesAndGroup = this.addAdminService.getMyRoleAndGroupList(this.sysCode,this.admin['mgrCode'],this.admin['orgCode']).data;
    //console.log("█ myRolesAndGroup ►►►",  myRolesAndGroup);
    let oldRolesArray = myRolesAndGroup.roleList;
    let oldRoleGroupArray = myRolesAndGroup.roleGroupList;
    let newRolesArray = [],newRoleGroupArray = [], obj = {};
    //将所有角色组成一个新的数组
    for (var i=0; i<oldRolesArray.length; i++){
      obj = {
        id:oldRolesArray[i].roleCode,
        text:oldRolesArray[i].roleName
      };
      newRolesArray.push(obj);
    };
    //将所有角色组组成一个新的数组
    for (var i=0; i<oldRoleGroupArray.length; i++){
      obj = {
        id:oldRoleGroupArray[i].roleGroupCode,
        text:oldRoleGroupArray[i].roleGroupName
      };
      newRoleGroupArray.push(obj);
    }
    this.mySelectRoles.active = newRolesArray;
    this.mySelectGroup.active = newRoleGroupArray;

    this.selectedRoleStr = this.itemsToString(newRolesArray);//选择系统之后，已经选中的角色转成字符串,因为如果没有改变，这个值会是undefined
    this.selectedGroupStr = this.itemsToString(newRoleGroupArray);//选择系统之后，已经选中的角色组转成字符串
    //console.log("█ this.selectedRoleStr ►►►",  this.selectedRoleStr);
    //console.log("█ this.selectedGroupStr ►►►",  this.selectedGroupStr);
  }

  /**
   * 获取角色和角色组列表
   */
  private getRoleAndGroupList(){
    let roleAndGroupList = this.addAdminService.getRoleAndGroupList(this.sysCode,this.admin['mgrCode'],this.admin['orgCode']).data;
    console.log("█ roleAndGroupList ►►►", roleAndGroupList);
    let oldRolesArray = roleAndGroupList.roleList;
    let oldRoleGroupArray = roleAndGroupList.roleGroupList;
    let newRolesArray = [], myNewRolesArray = [],myNewRoleGroupArray = [], newRoleGroupArray = [], obj = {};
    for (var i=0; i<oldRolesArray.length; i++){
      obj = {
        id:oldRolesArray[i].roleCode,
        text:oldRolesArray[i].roleName
      };
      newRolesArray.push(obj);
      if (oldRolesArray[i].isHas == 'Y'){
        myNewRolesArray.push(obj)
      }
    }
    for (var i=0; i<oldRoleGroupArray.length; i++){
      obj = {
        id:oldRoleGroupArray[i].roleGroupCode,
        text:oldRoleGroupArray[i].roleGroupName
      };
      newRoleGroupArray.push(obj);
      if (oldRoleGroupArray[i].isHas == 'Y'){
        myNewRoleGroupArray.push(obj)
      }
    }
    console.log('myNewRolesArray',myNewRolesArray)
    console.log('myNewRoleGroupArray',myNewRoleGroupArray)
    this.mySelectRoles.active = myNewRolesArray;
    this.mySelectGroup.active = myNewRoleGroupArray;
    this.Role = newRolesArray;
    this.Group = newRoleGroupArray;
  }

  //获取系统代码(路由参数)
  private getMgrCode() {
    let mgrCode;
    this.route.params.subscribe(params => {
      mgrCode = params['mgrCode'];
    });
    return mgrCode;
  }

  /**
   * 根据机构编码获取机构名
   * @param orgCode
   * @returns {string|any}
   */
  private getOrgNameByCode(orgCode) {
    return this.addOrgan.getOrgDetailByCode(orgCode).orgName;
  }

  //从子组件获取区域数据
  getAreaData(area) {
    this.admin['areaCode'] = area.areaCode;
  }

  //从子组件获取所选机构数据
  getOrganCode(orgCode) {
    this.admin['orgCode'] = orgCode;
  }

  //从详情去修改
  private toUpdateAdmin() {
    this.settings.closeRightPage(); //关闭右侧滑动页面
    this.router.navigate(['/main/system/admins/updateAdmin', this.admin['mgrCode']], {replaceUrl: true});
  }


  //提交表单
  private submitAdminData() {
    let me = this;
    let submitUrl, submitData;
    submitUrl = '/sys/add';
    submitData = me.admin;

    switch (this.path) {
      //添加系统
      case "addAdmin":
        submitUrl = '/orgManager/add';
        break;
      case "updateAdmin":
        submitUrl = '/orgManager/update';
        break;
      case "updateState":
        submitData = {
          mgrCode: me.admin['mgrCode'],
          state: me.admin['state']
        };
        submitUrl = '/orgManager/updateState';
        break;
      case "updatePwd":
        submitData = {
          mgrCode: me.admin['mgrCode'],
          newpwd: me.admin['newpwd']
        };
        submitUrl = '/orgManager/updatePwdForSuper';
        break;
      case "allotRole":
        submitData = {
          mgrCode: me.admin['mgrCode'],
          orgCode: me.admin['orgCode'],
          sysCode: me.sysCode,
          roleCodes: me.selectedRoleStr,
          roleGroupCodes: me.selectedGroupStr
        };
        submitUrl = '/orgManager/addRolesRelation';
        break;
    }
    console.log("█ submitData ►►►", submitData);
    me.addAdminService.submitRightPageData(submitUrl, submitData);//所有表单提交用的都是AddAdminService里的submitRightPageData方法
    me.adminsComponent.queryDatas({event: "pageChange", activePage: 2, rowsOnPage: 2, dataLength: 4})//刷新父页面数据
  }

  // 取消
  private cancel() {
    this.settings.closeRightPageAndRouteBack(); //关闭右侧滑动页面
  }
}
