import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { _URL_API, _URL_SECTOR1, _URL_SECTOR1_ESTADO, _URL_SECTOR2, _URL_USERS, _URL_USERS_IN } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private readonly http = inject(HttpClient);
  public getUsers():Observable<any>{
    return this.http.get(_URL_USERS)
  }
  public getUsersId(id:any):Observable<any>{
    return this.http.get(_URL_USERS+"/"+id)
  }
  public getEstadoValvula(id:any):Observable<any>{
    return this.http.get(_URL_SECTOR1_ESTADO+id)
  }
  public postUsers(userData:any):Observable<any>{
    return this.http.post(_URL_USERS_IN,userData)
  }
  public putSector1(id: string, sector1Data: any): Observable<any> {
    return this.http.put(`${_URL_SECTOR1}${id}`, sector1Data);
  }
  public getSectorConfig(id: string): Observable<any> {
    return this.http.get(`${_URL_API}config1/${id}`);
  }
  
  public postSector2(sector2Data:any):Observable<any>{
    return this.http.post(_URL_SECTOR2,sector2Data)
  }

  public updateUser(id: string, userData: any): Observable<any> {
    return this.http.put(`${_URL_API}update_user/${id}`, userData);
  }
}
