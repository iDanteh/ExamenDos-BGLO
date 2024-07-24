import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { NgModule } from '@angular/core';
import { AddProductComponent } from './components/add-product/add-product.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'layout', component: LayoutComponent},
    {path: 'add-Product', component: AddProductComponent},
    {path: '', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
