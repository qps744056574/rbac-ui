import { Injectable } from '@angular/core';
import {AjaxService} from "../../../core/services/ajax.service";
import {AppComponent} from "../../../app.component";

@Injectable()
export class TableService {

  constructor(private ajax: AjaxService) { }

  /**
   * 删除员工信息
   * @param url
   * @param data
   */
  delCode(url,data) {
    this.ajax.post({
      url:url,
      data: data,
      async:false,
      success: (data) => {
        let info=data.info;
        if(data.success){
          AppComponent.rzhAlt("success",info);
        }else{
          AppComponent.rzhAlt("error",info);
        }
      },
      error: () => {
        console.log('连接数据库失败');
      }
    });
  }
}
