import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  _URL_SECTOR1,
  _URL_SECTOR1_ESTADO,
  _URL_SECTOR2,
  _URL_USERS,
  _URL_USERS_IN,
  _URL_USERS_UPDATE
} from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private readonly http = inject(HttpClient);

  public getUsers(): Observable<any> {
    return this.http.get(_URL_USERS);
  }

  public getUsersId(id: any): Observable<any> {
    return this.http.get(
      `${_URL_USERS}/${id}`
    );
  }

  public postUsers(userData: any): Observable<any> {
    return this.http.post(
      _URL_USERS_IN,
      userData
    );
  }

  // Actualizar usuario
  public putUser(
    id: string,
    userData: any
  ): Observable<any> {
    return this.http.put(
      `${_URL_USERS_UPDATE}${id}`,
      userData
    );
  }

  public getEstadoValvula(id: any): Observable<any> {
    return this.http.get(
      _URL_SECTOR1_ESTADO + id
    );
  }

  public putSector1(
    id: string,
    sector1Data: any
  ): Observable<any> {
    return this.http.put(
      `${_URL_SECTOR1}${id}`,
      sector1Data
    );
  }

  public postSector2(
    sector2Data: any
  ): Observable<any> {
    return this.http.post(
      _URL_SECTOR2,
      sector2Data
    );
  }
}