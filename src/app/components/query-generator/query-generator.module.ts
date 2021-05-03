import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { QueryGeneratorComponent } from './query-generator.component';
import { QueryGeneratorRoutingModule } from './query-generator-routing.module';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, QueryGeneratorRoutingModule],
  declarations: [QueryGeneratorComponent],
})
export class QueryGeneratorModule {}
