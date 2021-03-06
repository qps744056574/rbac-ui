import { Injectable } from '@angular/core';
import {AjaxService} from "../../../core/services/ajax.service";
import {isNull} from "util";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
const swal = require('sweetalert');

@Injectable()
export class AdminsService {

  constructor(private tools:RzhtoolsService,private ajax: AjaxService) { }

  /**
   * 请求管理员列表
   * @param requestParmas
   * @returns {any}
     */
  getAdminsList(requestParmas){
    let result;
    this.ajax.get({
      url: "/orgManager/listpage",
      async:false,
      data: requestParmas,
      success: (res) => {
        if (!isNull(res)) {
          result = res;
        }
      },
      error: (res) => {
        console.log('organs', res);
      }
    });
    return result;
  }

  /**
   * 修改管理员状态
   * @param state
   * @param mgrCode
     */
  changeOrgManagerState(state,mgrCode){
    let title = '成功' + this.tools.getEnumDataValByKey('1009',state);
    this.ajax.post({
      url: "/orgManager/updateState",
      async:false,
      data: {
        mgrCode:mgrCode,
        state: state,
      },
      success: (res) => {
        //console.log("█ res ►►►",  res);
        if (res.success) {
          swal({
            title: title,
            text: res.info,
            type: 'success',
            timer: 2000, //关闭时间，单位：毫秒
            showConfirmButton: false  //不显示按钮
          });
        }else{
          //let errorMsg = res.data.substring(res.data.indexOf('$$')+2,res.data.indexOf('@@'))
          swal(res.info, '', 'error');
        }
      },
      error: (res) => {
        console.log('changeOrgManagerState', res);
      }
    });
  }

}


