import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoLoginGuard implements CanActivate {
  constructor(private router : Router){}
  
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    try {
      let user = JSON.parse(localStorage.getItem('user'));
      let id = user.uid;
      this.router.navigate(['app'])
      return false
    }catch {
      return true
    }
  }
  
}
