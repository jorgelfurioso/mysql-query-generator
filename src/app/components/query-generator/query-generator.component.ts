import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-query-generator',
  templateUrl: './query-generator.component.html',
  styleUrls: ['./query-generator.component.scss'],
})
export class QueryGeneratorComponent implements OnInit {
  queryForm: FormGroup;
  sentences: string[];

  constructor(private formBuilder: FormBuilder) {
    this.sentences = ['Select', 'Insert', 'Update', 'Delete'];
    this.queryForm = this.formBuilder.group({
      sentence: [this.sentences[0], Validators.required],
    });
  }

  ngOnInit(): void {}

  onSentenceChange() {}

  get queryFormControls() {
    return this.queryForm.controls;
  }
}
