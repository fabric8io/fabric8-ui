import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppListPageComponent } from "./list-page/list-page.app.component";

const routes: Routes = [
  {
    path: '',
    component: AppListPageComponent,
    // Can't use lazy loading here as we need to import in to another module, and that doesn't work yet
    children: [
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule {
}
