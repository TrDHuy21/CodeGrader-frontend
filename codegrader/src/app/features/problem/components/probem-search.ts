import { Component, DestroyRef, inject, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// import { SearchService } from './search.service';

// PrimeNG
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

//Service
import { SearchService } from '../services/search-service';
import { Interface } from 'readline';
import { Problem } from '../models/ProblemModel';

interface Level {
  id: number;
  name: string;
  value: number;
}
interface TagName {
  id: number;
  name: string;
}
export interface ProblemFilter {
  NameSearch?: string;
  Levels?: number[];
  Tagnames?: string[];
  PageNumber: number;
  PageSize: number;
  SortBy: string;
  IsDecending: boolean;
}
@Component({
  selector: 'advanced-search',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    MultiSelectModule,
    InputNumberModule,
    ButtonModule,
    TableModule,
    TagModule,
  ],
  template: `
    <form
      class="flex flex-wrap items-end gap-3 text-sm mb-3"
      [formGroup]="form"
      (submit)="handleSubmit($event)"
    >
      <!-- Search -->
      <div class="flex flex-col">
        <label class="mb-1 font-medium text-xs">Search</label>
        <input
          pInputText
          class="w-32 aspect-auto"
          autocomplete="off"
          [formControl]="form.controls.NameSearch"
        />
      </div>

      <!-- Levels -->
      <div class="flex flex-col">
        <label class="mb-1 font-medium text-xs">Levels</label>
        <p-multiselect
          [filter]="true"
          [options]="levels"
          optionLabel="name"
          optionValue="value"
          placeholder="Levels"
          [maxSelectedLabels]="2"
          class="w-32"
          [formControl]="form.controls.Levels"
        ></p-multiselect>
      </div>

      <!-- Tags -->
      <div class="flex flex-col">
        <label class="mb-1 font-medium text-xs">Tags</label>
        <p-multiselect
          [filter]="true"
          [options]="tagnames()"
          optionLabel="name"
          optionValue="name"
          placeholder="Tags"
          display="chip"
          [maxSelectedLabels]="2"
          class="w-32"
          [formControl]="form.controls.Tagnames"
        ></p-multiselect>
      </div>

      <!-- Buttons -->
      <div class="flex gap-2">
        <button
          pButton
          type="submit"
          label="Search"
          icon="pi pi-search"
          class="p-button-sm"
        ></button>
        <button
          pButton
          type="reset"
          label="Reset"
          icon="pi pi-refresh"
          class="p-button-sm p-button-secondary"
        ></button>
      </div>
    </form>

    <!-- <router-outlet></router-outlet> -->
  `,
})
export class SearchComponent implements OnInit {
  private fb = inject(FormBuilder);
  levels!: Level[];
  tagnames = signal<TagName[]>([]);
  filter = output<ProblemFilter>();
  constructor(private searchService: SearchService, private route: ActivatedRoute) {}

  form = this.fb.nonNullable.group({
    NameSearch: [''],
    Levels: [[] as number[]],
    Tagnames: [[] as string[]],
    PageNumber: [1, { validators: [Validators.min(1)] }],
    PageSize: [10, { validators: [Validators.min(1)] }],
    SortBy: ['name'],
    IsDecending: [false],
  });

  ngOnInit() {
    this.levels = [
      { id: 1, name: 'Easy', value: 1 },
      { id: 2, name: 'Medium', value: 2 },
      { id: 3, name: 'Hard', value: 3 },
    ];
    this.searchService.getTagname().subscribe({
      next: (res) => {
        this.tagnames.set(res?.data || []);
      },
      error: (err) => console.log(err),
    });
    // );
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    const payload: ProblemFilter = this.form.getRawValue();
    this.filter.emit(payload);
  }

  reset() {
    this.form.reset({
      NameSearch: '',
      Levels: [],
      Tagnames: [],
      PageNumber: 1,
      PageSize: 10,
      SortBy: 'name',
      IsDecending: false,
    });
    // this.filter.emit(this.form.getRawValue());
  }
}
