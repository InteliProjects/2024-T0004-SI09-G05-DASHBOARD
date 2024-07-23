import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { enviroment} from '../enviroment';
import { UnidadeResponse } from '../models/interfaces/Iunidade';
import { StibaAverageEngDTO } from '../DTOs/StibaAverageEngDTO';
import { GptwAverageEng } from '../DTOs/GptwAverageEng';
import { StibaAverageLocalDTO } from '../DTOs/StibaAverageLocalDTO';
import { CidMonthDTO } from '../DTOs/CidMonthDTO';
import { GptwAnswersDTO } from '../DTOs/GptwAnswersDTO';
import { EmpSegDTO } from '../DTOs/EmpSegDTO';
import { CidCausaDTO, CidDiretoriaDTO, CidDoencaMax } from '../DTOs/CidCausaDTO';

@Injectable({
 providedIn: 'root'
})
export class ApiconnectService {
  BASE_URL = enviroment.apiUrl;
 constructor(private http: HttpClient) { }
 getCid2023() {
  return this.http.get(`${this.BASE_URL}Cid`);
}
getCid2023EmployeesCertificate(): Observable<HttpResponse<UnidadeResponse>> {
  return this.http.get<UnidadeResponse>(`${this.BASE_URL}Cid/colaboradores-atestados-por-unidade`, { observe: 'response'});
 }
 getStibaGrade(): Observable<number> {
  return this.http.get<number>(`${this.BASE_URL}Stiba/media-nota`);
 }
 getStibaEng(): Observable<HttpResponse<StibaAverageEngDTO[]>> {
  return this.http.get<StibaAverageEngDTO[]>(`${this.BASE_URL}Stiba/engajamento-total`, { observe: 'response'});
 }
 getGptwEng(): Observable<HttpResponse<GptwAverageEng[]>>{
  return this.http.get<GptwAverageEng[]>(`${this.BASE_URL}Gptw/engajamento`, { observe: 'response'});
 }
 getStibaLocalGrade(): Observable<HttpResponse<StibaAverageLocalDTO[]>>{
  return this.http.get<StibaAverageLocalDTO[]>(`${this.BASE_URL}Stiba/media-local`, { observe: 'response'});
 }

 getCid2023Month(): Observable<CidMonthDTO[]> {
  return this.http.get<CidMonthDTO[]>(`${this.BASE_URL}Cid/certo-total`); // Certifique-se de ajustar a URL conforme necessário
 }

 getGptwAns(): Observable<GptwAnswersDTO[]> {
  return this.http.get<GptwAnswersDTO[]>(`${this.BASE_URL}Gptw/gptw-quantidaderespostas`); // Certifique-se de ajustar a URL conforme necessário
 }
 getEmpSeg(): Observable<EmpSegDTO[]> {
  return this.http.get<EmpSegDTO[]>(`${this.BASE_URL}Empregado/seg`); // Certifique-se de ajustar a URL conforme necessário
 }
 getDoencaMax(): Observable<HttpResponse<CidDoencaMax[]>> {
  return this.http.get<CidDoencaMax[]>(`${this.BASE_URL}Cid/certo-doenca`, {observe: 'response'}); // Certifique-se de ajustar a URL conforme necessário
 }
 getCausaRaiz(): Observable<HttpResponse<CidCausaDTO[]>> {
  return this.http.get<CidCausaDTO[]>(`${this.BASE_URL}Cid/causa`, {observe: 'response'}); // Certifique-se de ajustar a URL conforme necessário
 }
 getDiretoria(): Observable<CidDiretoriaDTO[]> {
  return this.http.get<CidDiretoriaDTO[]>(`${this.BASE_URL}Cid/diretoria-doenca`); // Certifique-se de ajustar a URL conforme necessário
 }
}