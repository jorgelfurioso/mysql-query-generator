import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'query-generator',
    loadChildren: () =>
      import('./components/query-generator/query-generator.module').then(
        (m) => m.QueryGeneratorModule
      ),
  },
  {
    path: 'not-found',
    loadChildren: () =>
      import('./components/not-found/not-found.module').then(
        (m) => m.NotFoundModule
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'query-generator',
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
