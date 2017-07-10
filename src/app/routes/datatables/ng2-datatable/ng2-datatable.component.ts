import {Component, OnInit} from '@angular/core';
import {AjaxService} from "../../../core/services/ajax.service";
import {isNull} from "util";
import {Page} from "../../../core/page/page";
import * as _ from "lodash";
@Component({
  selector: 'app-ng2-datatable',
  templateUrl: './ng2-datatable.component.html',
  styleUrls: ['./ng2-datatable.component.scss']
})
export class Ng2DatatableComponent implements OnInit {
  private data: Page = new Page();
  private singleData: any;

  constructor(private ajax: AjaxService) {
  }

  ngOnInit() {
    let me = this;
    this.queryDatas(1);
    window.setTimeout(() => {
      me.singleData = _.slice(me.singleData, 1, 20);
      me.data.totalRow = 20
    }, 3000)
  }

  public queryDatas(event) {
    console.log("event", event);
    let me = this;
    this.ajax.get({
      url: "/elder/listcondition",
      data: {},
      success: (data) => {
        if (!isNull(data)) {
          Object.assign(me.data, data);
          me.singleData = data.voList;
          console.log("data", me.data);
        }
      },
      error: (data) => {
        console.log('data', data);
      }
    });
  }

}
