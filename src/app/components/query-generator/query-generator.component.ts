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
  whereFormControl: FormControl;
  generatedQuery: FormControl;
  queryForm: FormGroup;
  joinForm: FormGroup;
  querySelects: FormGroup[];
  queryJoins: FormGroup[];
  queryWheres: FormControl[];
  optionalSections: any;

  constructor(private formBuilder: FormBuilder) {
    this.sentences = ['SELECT', 'INSERT', 'UPDATE', 'DELETE'];
    this.joinTypes = ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN'];
    this.sentenceFormControl = new FormControl(
      this.sentences[0],
      Validators.required
    );
    this.whereFormControl = new FormControl('', Validators.required);
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
    this.queryWheres = [];
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

  onClickJoinClause() {
    this.optionalSections.Join = !this.optionalSections.Join;
  }

  onClickWhereClause() {
    this.optionalSections.Where = !this.optionalSections.Where;
  }

  onClickGenerateQuery() {
    let tablesInJoin: string[] = [];
    let query = `${this.sentenceFormControl.value}\n`;

    this.querySelects.forEach((statement, index) => {
      query += `${statement.value[`columns-${index}`]}`;

      if (index < this.querySelects.length - 1) query += ', ';
    });

    query += '\nFROM\n';

    this.queryJoins.forEach((join, index) => {
      if (!tablesInJoin.some((x) => x === join.value[`table1-${index}`])) {
        query += `${join.value[`table1-${index}`]}`;
        tablesInJoin.push(join.value[`table1-${index}`]);
      }

      query += ` ${join.value[`type-${index}`]} ${
        join.value[`table2-${index}`]
      } ON ${join.value[`onColumnTable1-${index}`]} = ${
        join.value[`onColumnTable2-${index}`]
      }`;

      if (!tablesInJoin.some((x) => x === join.value[`table2-${index}`])) {
        tablesInJoin.push(join.value[`table2-${index}`]);
      }
    });

    this.querySelects.forEach((statement, index) => {
      if (!tablesInJoin.some((x) => x === statement.value[`table-${index}`])) {
        query += `${statement.value[`table-${index}`]}`;
      }
    });

    if (this.queryWheres.length > 0) {
      query += `\nWHERE\n`;

      this.queryWheres.forEach((where, index) => {
        query += `${where.value}`;

        if (index !== this.queryWheres.length - 1) query += ' ';
      });
    }

    this.generatedQuery.setValue(query);
    this.optionalSections.ResultQuery = true;
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

  onClickDeleteJoin(index: number) {
    this.queryJoins.splice(index, 1);
  }

  onClickAddWhere() {
    const newWhere = new FormControl(
      this.whereFormControl.value,
      Validators.required
    );

    this.queryWheres.push(newWhere);

    this.whereFormControl.reset();
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

  checkIfTableInJoins(tableName: string) {
    for (let index = 0; index < this.queryJoins.length; index++) {
      let foo = this.queryJoins[index];

      if (foo.value[`table1-${index}`] === tableName) return index;
    }

    return -1;
  }
}
