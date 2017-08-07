import { Component, OnInit } from '@angular/core';
import {SettingsService} from '../../../core/settings/settings.service';
import {ActivatedRoute,Router} from '@angular/router';
import {AjaxService} from "../../../core/services/ajax.service";
import { FileUploader } from 'ng2-file-upload';
import {LimitComponent} from "../limit/limit.component";
import {LimittabComponent} from "../limittab/limittab.component";
const swal = require('sweetalert');
const uploadUrl = "/limitFile/uploadLimitFile";  //图片上传路径(调取上传的接口)

@Component({
  selector: 'app-rightpage',
  templateUrl: './menuAdd.component.html',
  styleUrls: ['./menuAdd.component.scss'],
  providers: [SettingsService]
})

export class MenuAddComponent implements OnInit {
  public uploader:FileUploader = new FileUploader({
    url: uploadUrl,
    itemAlias:"limitFile",
    queueLimit: 1
  }); //初始化上传方法
  private queryId:number;//获取添加，修改的ID
  private uid;//声明保存获取到的暗码
  private limitForm = {
    sysCode: '',
    menuName: '',
    menuUrl: '',
    preMenuCode: '',
    menuIcon: '',
    level: '',
    remarks: '',
    ord: ''
  }

  /**
   * 构造 初始化
   * **/
  constructor(private ajax:AjaxService, public settings:SettingsService, private router:Router, private routeInfo:ActivatedRoute, private route:ActivatedRoute, private limitComponent:LimitComponent, private limittabComponent:LimittabComponent) {
    this.settings.showRightPage("30%"); // 此方法必须调用！页面右侧显示，带滑动效果,可以自定义宽度：..%  或者 ..px
  }


  ngOnInit() {
    let _this = this;
    //获取路由的参数
    _this.queryId = _this.routeInfo.snapshot.queryParams['id'];

    //获取菜单编码
    /*_this.route.params.subscribe(params => {
     console.log("█ params ►►►", params );
     _this.limitForm.sysCode = params['sysCode'];
     });*/

    _this.limitForm.sysCode = _this.routeInfo.snapshot.queryParams['sysCode'];


    /**
     * 获得暗码
     */
    _this.ajax.get({
      url: '/upload/basic/uid',
      data: {},
      success: (res) => {
        console.log("█ res ►►►", res);
        if (res.success) {
          _this.uid = res.data;//把获取的暗码赋值给uid
          console.log('获取的暗码成功！', _this.uid);
          //_this.outputvalue.emit(true);//提交成功后向父组件传值
        } else {
          let errorMsg = res.data.substring(res.data.indexOf('$$') + 2, res.data.indexOf('@@'))
          swal(res.info, errorMsg, 'error');
        }
      },
      error: (data) => {
        swal('提交失败');
      }
    });


  }

  /**
   * 关闭子页面（取消）
   */
  cancel() {
    let _this = this;
    _this.settings.closeRightPageAndRouteBack(); //关闭右侧滑动页面
  }

  /**
   * 添加（菜单、页面元素、功能操作、文件控制）
   * @param value 必填信息
   */
  addLimitList(value) {
    let _this = this;
    //添加页面元素列表
    if (_this.queryId == 2) {
      console.log(value);
      _this.ajax.post({
        url: '/limitPage/add',
        async: false,
        data: {
          'sysCode': _this.limitForm.sysCode,
          'pageName': value.pageName,
          'preCode': value.preCode,
          'icon': value.icon,
          'level': value.level,
          'remarks': value.remarks,
          'ord': value.ord
        },
        success: (res) => {
          console.log("█ res ►►►", res);
          if (res.success) {
            _this.router.navigate(['/main/limit'], {replaceUrl: true}); //路由跳转
            swal('提交成功！', '列表已自动更新');


            //_this.outputvalue.emit(true);//提交成功后向父组件传值
          } else {
            let errorMsg = res.data.substring(res.data.indexOf('$$') + 2, res.data.indexOf('@@'))
            swal(res.info, errorMsg, 'error');
          }
        },
        error: (data) => {
          swal('提交失败');
        }
      })
      _this.limittabComponent.pageMenus();
    }
    //添加功能操作列表
    else if (_this.queryId == 4) {
      _this.ajax.post({
        url: '/limitOpt/add',
        data: {
          'sysCode': _this.limitForm.sysCode,
          'optName': value.optName,
          'tacklUrl': value.tacklUrl,
          'preCode': value.preCode,
          'preType': value.preType,
          'ord': value.ord,
          'remarks': value.remarks
        },
        success: (res) => {
          console.log("█ res ►►►", res);
          if (res.success) {
            _this.router.navigate(['/main/limit'], {replaceUrl: true}); //路由跳转
            swal('提交成功！', '列表已自动更新');
            //_this.outputvalue.emit(true);//提交成功后向父组件传值
          } else {
            let errorMsg = res.data.substring(res.data.indexOf('$$') + 2, res.data.indexOf('@@'))
            swal(res.info, errorMsg, 'error');
          }
        },
        error: (data) => {
          swal('提交失败！');
        }
      });
    }
    //添加文件控制列表
    else if (_this.queryId == 6) {

      /**
       * 构建form时，传入自定义参数
       * @param item
       */
      _this.uploader.onBuildItemForm = function(fileItem, form){
        form.append('fileuuid', _this.uid);
      };

      /**
       * 上传成功处理
       * @param item 成功的文件列表
       * @param response 返回信息
       * @param status 状态码
       * @param headers 上传成功后服务器的返回的返回头
       */
      _this.uploader.onSuccessItem = function (item, response, status, headers) {
        let res = JSON.parse(response);
        if (res.success) {
          /**
           * 上传文件成功，保存数据库
           */
          _this.ajax.post({
            url: '/limitFile/add',
            data: {
              'sysCode': _this.limitForm.sysCode,
              'fileName': value.fileName,
              'fileuuid': _this.uid
            },
            success: (res) => {
              if (res.success) {
                _this.router.navigate(['/main/limit'], {replaceUrl: true}); //路由跳转
                swal('提交成功！', '列表已自动更新...', 'success');
                //_this.outputvalue.emit(true);//提交成功后向父组件传值
              } else {
                swal(res.info, "上传文件成功，但保存信息失败！", 'error');
              }
            },
            error: (data) => {
              swal(res.info, "上传文件成功，但保存信息失败！", 'error');
            }
          });
        } else {
          swal('上传失败', '文件上传失败！', 'error');
        }
      };
      /**
       * 上传失败处理
       * @param item 失败的文件列表
       * @param response 返回信息
       * @param status 状态码
       * @param headers 上传失败后服务器的返回的返回头
       */
      _this.uploader.onErrorItem = function (item, response, status, headers) {
        swal('上传失败', '文件上传失败！', 'error');
      };
      /**
       * 执行上传
       */
      _this.uploader.uploadAll();

    }
    //添加菜单
    else {
      let submitUrl = '/limitMenu/add';
      _this.ajax.post({
        url: submitUrl,
        async: false,
        data: _this.limitForm,
        success: (res) => {
          if (res.success) {
            _this.router.navigate(['/main/limit'], {replaceUrl: true}); //路由跳转
            swal('提交成功！', '列表已自动更新');
            //_this.outputvalue.emit(true);//提交成功后向父组件传值
          } else {
            let errorMsg = res.data.substring(res.data.indexOf('$$') + 2, res.data.indexOf('@@'))
            swal(res.info, errorMsg, 'error');
          }
        },
        error: (res) => {
          swal('提交失败！', '列表已自动更新');
        }
      })
      _this.limitComponent.queryDatas();
    }

  }
}
