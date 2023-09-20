import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';
import { redirectGuard } from '@guards/redirect.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [redirectGuard],
    loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'app',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/layout/layout.module').then((m) => m.LayoutModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
