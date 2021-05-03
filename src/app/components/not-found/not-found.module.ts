import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NotFoundComponent } from './not-found.component';
import { NotFoundRoutingModule } from './not-found-routing.module';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, NotFoundRoutingModule],
  declarations: [NotFoundComponent],
})
export class NotFoundModule {}
