import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { LocalStorageType, SystemEnvironments } from './../enums';
import { EnvService } from './../../env.service';
import { map } from 'rxjs/operators';

@Injectable()
export class CurrentUserService {
  private _baseUrl = '';

  constructor(
    private localStorageService: LocalStorageService,
    private env: EnvService,
    private http: HttpClient
  ) {
    this._baseUrl = env.baseApiUrl;
  }

  getAuthUser() {
    return this.http
      .get(this._baseUrl + '/UserManagement/Users/GetAuthUser')
      .pipe(
        map((response: any) => {
          console.log(response);

          return response;
        })
      );
  }

  getAccessModuleScreens(moduleid: any) {
    return this.http
      .get(this._baseUrl + '/UserManagement/Users/GetUserAccessScrrens/'+ moduleid)
      .pipe(
        map((response: any) => {
          console.log(response);

          return response;
        })
      );
  }

  setAuthenticationContext(authenticationContext: string) {
    let context = JSON.parse(JSON.stringify(authenticationContext || null));

    console.log("contextcontext",context);
    //this.localStorageService.setItem(String(LocalStorageType.AccessToken), context.accessToken);
    this.localStorageService.setItem(
      String(LocalStorageType.UserName),
      context.username
    );
    //this.localStorageService.setItem(String(LocalStorageType.RefreshToken), context.refreshToken);
    this.localStorageService.setItem(
      String(LocalStorageType.DefaultLocation),
      context.defaultLocation
    );
    this.localStorageService.setItem(
      String(LocalStorageType.ActivationKey),
      context.activationKey
    );
    /* Added by Ginuka -Medcube 2021-08-04 */
    this.localStorageService.setItem(
      String(LocalStorageType.AccessList),
      JSON.stringify(context.accessList)
    );
    this.localStorageService.setItem(
      String(LocalStorageType.Permissions),
      context.permissions
    );
    this.localStorageService.setItem(
      String(LocalStorageType.CompanyInformation),
      JSON.stringify(context.companyInformation)
    );
    
    // this.localStorageService.setItem(
    //   String(LocalStorageType.SystemEnvironment),
    //   context.companyInformation.systemEnvironment
    // );
    this.localStorageService.setItem(
      String(LocalStorageType.UserId),
      context.userId
    );
    /*UserLocations */
    this.localStorageService.setItem(
      String(LocalStorageType.UserLocations),
      JSON.stringify(context.locations)
    );
    this.localStorageService.setItem(
      String(LocalStorageType.ReportAccessToken),
      context.reportAPIToken
    );

    this.localStorageService.setItem(
      String(LocalStorageType.UserTypeId),
      context.typeId
    );

    this.localStorageService.setItem(
      String(LocalStorageType.ClientName),
      context.clientName
    );

    this.localStorageService.setItem(
      String(LocalStorageType.ClientId),
      context.clientId
    );

    this.localStorageService.setItem(
      String(LocalStorageType.UserEvents),
      JSON.stringify(context.userEventList)
    );


    // this.localStorageService.setItem(
    //   String(LocalStorageType.SendHealthQuestionnaireEmailTemplate),
    //   JSON.stringify(context.companyInformation.sendHealthQuestionnaireEmailTemplate)
    // );
  }

  setTokenContext(tokenContext: string) {
    let context = JSON.parse(JSON.stringify(tokenContext || null));

    this.localStorageService.setItem(
      String(LocalStorageType.AccessToken),
      context.access_token
    );
    this.localStorageService.setItem(
      String(LocalStorageType.RefreshToken),
      context.refresh_token
    );

    this.localStorageService.setItem(
      String(LocalStorageType.UserId),
      context.userId
    )
  }

  setAccessList(accessList : any){
    this.localStorageService.setItem(
      String(LocalStorageType.AccessList),
      JSON.stringify(accessList)
    );
  }

  clearAuthenticationContext() {
    this.localStorageService.removeItem(String(LocalStorageType.AccessToken));
    this.localStorageService.removeItem(String(LocalStorageType.UserName));
    this.localStorageService.removeItem(String(LocalStorageType.RefreshToken));
    this.localStorageService.removeItem(
      String(LocalStorageType.DefaultLocation)
    );
    this.localStorageService.removeItem(String(LocalStorageType.ActivationKey));

    /* Added by Ginuka -Medcube 2021-08-04 */
    this.localStorageService.removeItem(String(LocalStorageType.AccessList));
    this.localStorageService.removeItem(String(LocalStorageType.Permissions));
    this.localStorageService.removeItem(
      String(LocalStorageType.CompanyInformation)
    );
    this.localStorageService.removeItem(
      String(LocalStorageType.SystemEnvironment)
    );
    this.localStorageService.removeItem(String(LocalStorageType.UserId));
    this.localStorageService.removeItem(
      String(LocalStorageType.RefreshTokenExpTime)
    );
    this.localStorageService.removeItem(String(LocalStorageType.UserLocations));

    this.localStorageService.removeItem(
      String(LocalStorageType.ReportAccessToken)
    );
    this.localStorageService.removeItem(
      String(LocalStorageType.UserTypeId)
    ); 
  }
 
  getCurrentUser() {
    let value = this.localStorageService.getItem(
      String(LocalStorageType.UserName)
    );
    return value;
  }

  getAccessToken() {
    let value = this.localStorageService.getItem(
      String(LocalStorageType.AccessToken)
    );
    return value;
  }

  //Set Access Token
  setAccessToken(accessToken: string) {
    this.localStorageService.setItem(
      String(LocalStorageType.AccessToken),
      accessToken
    );
  }

  getRefreshToken() {
    let value = this.localStorageService.getItem(
      String(LocalStorageType.RefreshToken)
    );
    return value;
  }

  //Set Refresh Token
  setRefreshToken(refreshToken: string) {
    this.localStorageService.setItem(
      String(LocalStorageType.RefreshToken),
      refreshToken
    );
  }

  getDefaultLocation() {
    let value = this.localStorageService.getItem(
      String(LocalStorageType.DefaultLocation)
    );
    return Number(value);
  }

  getActivationKey() {
    let value = this.localStorageService.getItem(
      String(LocalStorageType.ActivationKey)
    );
    return value;
  }

  getAccessDetails() {
    let value = this.localStorageService.getItem(
      String(LocalStorageType.AccessList)
    );
    return JSON.parse(value);
  }

  getCompanyInformation() {
    let value = this.localStorageService.getItem(
      String(LocalStorageType.CompanyInformation)
    );
    return JSON.parse(value);
  }

  getUserEvents() {
    let value = this.localStorageService.getItem(
      String(LocalStorageType.UserEvents)
    );
    return JSON.parse(value);
  }
  
  getClientName() {
    let value = this.localStorageService.getItem(
      String(LocalStorageType.ClientName)
    );
    return value;
  } 

  getClientId() {
    let value = this.localStorageService.getItem(
      String(LocalStorageType.ClientId)
    );
    return value;
  }
  
  getSystemEnvironment() {
    let value = this.localStorageService.getItem(
      String(LocalStorageType.SystemEnvironment)
    );
    return SystemEnvironments[value];
  }

  getUserId() {
    let value = this.localStorageService.getItem(
      String(LocalStorageType.UserId)
    );
    return value;
  }

  getRefreshTokenExpTime() {
    let value = this.localStorageService.getItem(
      String(LocalStorageType.RefreshTokenExpTime)
    );
    return value;
  }
  setRefreshTokenExpTime(value: any) {
    this.localStorageService.setItem(
      String(LocalStorageType.RefreshTokenExpTime),
      value
    );
  }

  getCurrentUserLocationDetails() {
    let value = this.localStorageService.getItem(
      String(LocalStorageType.UserLocations)
    );
    return JSON.parse(value);
  }

  getReportAccessToken() {
    let value = this.localStorageService.getItem(
      String(LocalStorageType.ReportAccessToken)
    );
    return value;
  }

  getPermissionsDetails() {
    let value = this.localStorageService.getItem(
      String(LocalStorageType.Permissions)
    );
    if (value) {
      return value.split(',');
    }
    return null;
  }

  getUserTypeId() {
    let value = this.localStorageService.getItem(
      String(LocalStorageType.UserTypeId)
    );
    if (value) {
      return value;
    }
    return null;
  }
}
