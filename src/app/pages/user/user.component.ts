import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UserServiceService } from 'src/app/service/user-service.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(private userService: UserServiceService,
    private router: Router,
    private message: NzMessageService,
    private zone: NgZone,
    private _activeRoute: ActivatedRoute,
    private modal: NzModalService) { }

  username = '';
  listUser: any;
  loading = true;
  selectPermission = '';
  selectStatus: any;

  page = 0;
  count = 0;
  pageSize = 10;
  totalPages = 0;
  pageSizeOptions = [10, 20];
  confirmModal: any;


  ngOnInit(): void {
    this.zone.run(() => {
      this.retrieveData();
    })
  }

  getRequestParams(searchUsername: string, page: number, pageSize: number, permission: string, status: boolean): any {
    let params: any = {};

    if (searchUsername) {
      params['username'] = searchUsername;
    }

    if (page) {
      params['page'] = page;
    }

    if (pageSize) {
      params['size'] = pageSize;
    }

    if (permission) {
      params['permission'] = permission;
    }

    if (status != null) {
      params['status'] = status;
    }

    return params;
  }

  retrieveData(): void {
    const params = this.getRequestParams(this.username, this.page, this.pageSize, this.selectPermission, this.selectStatus);
    let urlParams = this.router.navigate(
      [],
      {
        relativeTo: this._activeRoute,
        queryParams: params,
        queryParamsHandling: 'merge',
        skipLocationChange: false
      }
    );

    this.userService.getAll(params).subscribe(
      response => {
        const { users, totalUsers, totalPages, currentPage, limit } = response;
        this.listUser = users;
        this.count = totalUsers;
        this.totalPages = totalPages;
        this.page = currentPage;
        this.pageSize = limit;
      },
      error => {
        console.log(error);
      }
    );
    this.loading = false;
  }

  pageIndexChange(event: number): void {
    this.page = event;
    this.retrieveData();
  }

  pageSizeChange(event: any) {
    this.pageSize = event;
    this.retrieveData();
  }

  keyDown(event: any) {
    if (event.keyCode == 13) {
      this.btnSearch();
    }
  }

  params: any;

  btnSearch(): void {
    this.page = 1;
    this.retrieveData();
  }

  btnAdd(): void {
    this.router.navigateByUrl('user/adduser');
  }

  Edit(id: any): void {
    this.router.navigateByUrl(`user/${id}`);
  }

  diableAccount = false;
  checkStatusSwitch(id: any, data: any) {
    this.userService.update(id, data).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log(error);
      }
    )
  }

  showConfirm(i: any, username: any): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: `B???n mu???n x??a ng?????i d??ng <b>${(username)}</b>?`,
      nzContent: 'C???nh b??o: D??? li???u kh??ng th??? kh??i ph???c !!!',
      nzOnOk: () =>
        new Promise((resolve, rejects) => {
          this.userService.delete(i).subscribe(
            response => {
              this.message.create('warning', `???? xo?? ng?????i d??ng <b>${username}</b>`);
              this.retrieveData();
            }
          )
          setTimeout(Math.random() > 0.5 ? resolve : rejects, 1000);
        }).catch(() => console.log("L???i !!!"))
    });
  }

}
