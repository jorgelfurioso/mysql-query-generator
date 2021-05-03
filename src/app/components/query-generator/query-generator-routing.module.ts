import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QueryGeneratorComponent } from './query-generator.component';

const routes: Routes = [
  {
    path: '',
    component: QueryGeneratorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QueryGeneratorRoutingModule {}
