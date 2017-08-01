
import {Router} from '@angular/router';
import {Component,EventEmitter, Input, Output, OnInit} from '@angular/core';
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {SettingsService} from "../../../core/settings/settings.service";

@Component({
  selector: 'app-select-area',
  templateUrl: './select-area.component.html',
  styleUrls: ['./select-area.component.scss'],
  providers: [RzhtoolsService]
})
export class SelectAreaComponent implements OnInit {
  private show: boolean = false;
  private areas: any;
  private areaCode: string = '';
  private adr: string = '';

  @Input() private required:boolean;

  @Output() myData = new EventEmitter();


  constructor(private area: RzhtoolsService,public settings: SettingsService,private router:Router) { }

  ngOnInit() {
  }


  // 获取地区列表
  getArea(fullName,myAreaCode,isOld){
    let me = this;
    me.show = true;
    me.areas = me.area.getAreaByCode(myAreaCode,isOld).children;
    me.adr = fullName;
    me.areaCode = myAreaCode;
    if (me.areas == undefined){
      me.cityConfirm();
    }
    console.log(me.areas)
  }

  //显示城市选择器并获取省级列表
  showSelectArea(){
    let me = this;
    if(me.show) return;
    me.show = true;
    me.areas = me.area.getAreaByCode('');
  }

  //重置城市信息
  freshCitys(){
    this.areas = this.area.getAreaByCode('');
  }

  //确定选择城市
  cityConfirm(){
    this.show = false;
    if(this.adr == ''){
      this.areaCode = ''
    }
    this.myData.emit({
      areaCode:this.areaCode,
      adr:this.adr
    });
  }
}
