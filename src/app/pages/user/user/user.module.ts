import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { NgZorroAntdModule } from 'src/app/ng-zorro-antd/ng-zorro-antd.module';
import { FormsModule } from '@angular/forms';
import { UserComponent } from '../user.component';


@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    NgZorroAntdModule,
    FormsModule
  ],
  exports: [UserComponent]
})
export class UserModule { }
