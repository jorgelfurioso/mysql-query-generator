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
  insertForm: FormGroup;
  updateForm: FormGroup;
  deleteForm: FormGroup;
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
    this.joinForm = this.formBuilder.group({
      type: [this.joinTypes[0], Validators.required],
      table1: ['', Validators.required],
      onColumnTable1: ['', Validators.required],
      table2: ['', Validators.required],
      onColumnTable2: ['', Validators.required],
    });
    this.insertForm = this.formBuilder.group({
      table: ['', Validators.required],
      columns: ['', Validators.required],
      values: ['', Validators.required],
    });
    this.updateForm = this.formBuilder.group({
      table: ['', Validators.required],
      columns: ['', Validators.required],
      values: ['', Validators.required],
    });
    this.deleteForm = formBuilder.group({
      table: ['', Validators.required],
      where: ['', Validators.required],
    });
    this.queryWheres = [];
    this.querySelects = [];
    this.queryJoins = [];
    this.optionalSections = {};
  }

  ngOnInit(): void {}

  onChangeSyntax() {
    this.whereFormControl.reset();
    this.queryForm.reset();
    this.joinForm.reset();
    this.insertForm.reset();
    this.updateForm.reset();
    this.deleteForm.reset();
    this.queryWheres = [];
    this.querySelects = [];
    this.queryJoins = [];
    this.optionalSections = {};
  }

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
    let query = '';

    switch (this.sentenceFormControl.value) {
      case 'SELECT': {
        query = this.generateSelectQuery;
        break;
      }
      case 'INSERT': {
        query = this.generateInsertQuery;
        break;
      }
      case 'UPDATE': {
        query = this.generateUpdateQuery;
        break;
      }
      case 'DELETE': {
        query = this.generateDeleteQuery;
        break;
      }
    }

    if (query) {
      this.generatedQuery.setValue(query);
      this.optionalSections.ResultQuery = true;
    }
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

  onClickDeleteWhere(index: number) {
    this.queryWheres.splice(index, 1);
  }

  get queryFormControls() {
    return this.queryForm.controls;
  }

  get joinFormControls() {
    return this.joinForm.controls;
  }

  get insertFormControls() {
    return this.insertForm.controls;
  }

  get updateFormControls() {
    return this.updateForm.controls;
  }

  get deleteFormControls() {
    return this.deleteForm.controls;
  }

  get generateSelectQuery() {
    if (this.querySelects.length === 0) return '';

    let tablesInJoin: string[] = [];
    let query = `${this.sentenceFormControl.value}\n`;

    this.querySelects.forEach((statement, index) => {
      query += `${statement.value[`columns-${index}`]}`;

      if (index < this.querySelects.length - 1) query += ', ';
    });

    query += '\nFROM\n';

    this.queryJoins.forEach((join, index) => {
      if (!tablesInJoin.some((x) => x === join.value[`table1-${index}`])) {
        if (index > 0) query += ', ';
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
        if (index > 0) query += ', ';

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

    return query;
  }

  get generateInsertQuery() {
    if (this.insertForm.invalid) return '';

    let query = `${this.sentenceFormControl.value} INTO ${this.insertFormControls.table.value}`;
    query += `(${this.insertFormControls.columns.value})`;
    query += `\nVALUES (${this.insertFormControls.values.value})`;

    return query;
  }

  get generateUpdateQuery() {
    if (this.updateForm.invalid) return '';

    let query = `${this.sentenceFormControl.value} ${this.updateFormControls.table.value} SET\n`;
    const columns = this.updateFormControls.columns.value.split(',');
    const values = this.updateFormControls.values.value.split(',');

    for (let index = 0; index < columns.length; index++) {
      query += `${columns[index]} = ${values[index]}`;

      if (index < columns.length - 1) query += ',\n';
    }

    return query;
  }

  get generateDeleteQuery() {
    if (this.deleteForm.invalid) return '';

    let query = `${this.sentenceFormControl.value} FROM ${this.deleteFormControls.table.value}\n`;
    query += `WHERE ${this.deleteFormControls.where.value}`;

    return query;
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
}
