import { Injectable } from '@angular/core';
import { CurrentUserService } from '.';
import { NgxPermissionsService } from 'ngx-permissions';
@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  constructor(
    private currentUserService: CurrentUserService,
    private permissionsService: NgxPermissionsService
  ) {}

  public setUserPermissions() {


    let _userType = this.currentUserService.getUserTypeId();

    let accessList = this.currentUserService.getPermissionsDetails();

    if(_userType == "0" && accessList){
      accessList.push("_superUser");
    }

    
    if (accessList) {
      this.permissionsService.loadPermissions(accessList);
    }
  }

  public removeUserPermissions() {
    this.permissionsService.flushPermissions();
  }

  public checkUserPermissions(sId: Number) {
    let accessList = this.currentUserService.getPermissionsDetails();
    let permission = sId.toString() + '_View';

    let hasPermission = accessList.includes(permission);
    return hasPermission;
  }
}
