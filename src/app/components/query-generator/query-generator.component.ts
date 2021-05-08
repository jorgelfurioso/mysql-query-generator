import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-query-generator',
  templateUrl: './query-generator.component.html',
  styleUrls: ['./query-generator.component.scss'],
})
export class QueryGeneratorComponent implements OnInit {
  sentences: string[];
  joinTypes: string[];
  sentenceFormControl: FormControl;
  generatedQuery: FormControl;
  queryForm: FormGroup;
  joinForm: FormGroup;
  querySelects: FormGroup[];
  queryJoins: FormGroup[];
  optionalSections: any;

  constructor(private formBuilder: FormBuilder) {
    this.sentences = ['Select', 'Insert', 'Update', 'Delete'];
    this.joinTypes = ['Inner Join', 'Left Join', 'Right Join', 'Full Join'];
    this.sentenceFormControl = new FormControl(
      this.sentences[0],
      Validators.required
    );
    this.generatedQuery = new FormControl('');
    this.queryForm = this.formBuilder.group({
      columns: ['', Validators.required],
      table: ['', Validators.required],
    });
    this.joinForm = formBuilder.group({
      type: [this.joinTypes[0], Validators.required],
      table1: ['', Validators.required],
      onColumnTable1: ['', Validators.required],
      table2: ['', Validators.required],
      onColumnTable2: ['', Validators.required],
    });
    this.querySelects = [];
    this.queryJoins = [];
    this.optionalSections = {};
  }

  ngOnInit(): void {}

  onClickAddStatement() {
    if (this.queryForm.invalid) {
      this.queryForm.markAllAsTouched();
      return;
    }

    const newStatement = new FormGroup({
      [`columns-${this.querySelects.length}`]: new FormControl(
        this.queryFormControls.columns.value,
        [Validators.required]
      ),
      [`table-${this.querySelects.length}`]: new FormControl(
        this.queryFormControls.table.value,
        [Validators.required]
      ),
    });

    this.querySelects.push(newStatement);

    this.resetQueryForm();
  }

  onClickDeleteStatement(statementIndex: number) {
    this.querySelects.splice(statementIndex, 1);
  }

  onClickAddJoinClause() {
    this.optionalSections.Join = !this.optionalSections.Join;
  }

  onClickGenerateQuery() {
    let query = '';
    query += this.sentenceFormControl.value;

    this.querySelects.forEach((statement, index) => {
      if (
        this.querySelects.length >= 1 &&
        index < this.querySelects.length - 1
      ) {
        query += `${statement.value['columns-' + index]}, `;
      } else {
        query += `${statement.value['columns-' + index]}\n`;
      }
    });

    query += 'From ';
    this.querySelects.forEach((statement, index) => {
      if (
        this.querySelects.length >= 1 &&
        index < this.querySelects.length - 1
      ) {
        query += `${statement.value['table-' + index]} ,`;
      } else {
        query += `${statement.value['table-' + index]};`;
      }
    });
  }

  onClickAddJoin() {
    if (this.joinForm.invalid) {
      this.joinForm.markAllAsTouched();
      return;
    }

    const newJoin = new FormGroup({
      [`type-${this.queryJoins.length}`]: new FormControl(
        this.joinFormControls.type.value,
        [Validators.required]
      ),
      [`table1-${this.queryJoins.length}`]: new FormControl(
        this.joinFormControls.table1.value,
        [Validators.required]
      ),
      [`onColumnTable1-${this.queryJoins.length}`]: new FormControl(
        this.joinFormControls.onColumnTable1.value,
        [Validators.required]
      ),
      [`table2-${this.queryJoins.length}`]: new FormControl(
        this.joinFormControls.table2.value,
        [Validators.required]
      ),
      [`onColumnTable2-${this.queryJoins.length}`]: new FormControl(
        this.joinFormControls.onColumnTable2.value,
        [Validators.required]
      ),
    });

    this.queryJoins.push(newJoin);

    this.joinForm.reset();
  }

  get queryFormControls() {
    return this.queryForm.controls;
  }

  get joinFormControls() {
    return this.joinForm.controls;
  }

  resetQueryForm() {
    this.queryForm.reset({
      columns: '',
      table: '',
    });
  }

  availableTables() {
    return this.querySelects.map(
      (formGroup, index) => formGroup.controls[`table-${index}`].value
    );
  }

  columnsByTable() {}
}
