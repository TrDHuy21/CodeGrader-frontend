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
    RouterOutlet,
  ],
  template: `<div class="p-4 space-y-4">
    <form class="flex gap-5" [formGroup]="form" (submit)="handleSubmit($event)">
      <div>
        <label class="block text-sm font-medium mb-2">Search</label>
        <input pInputText autocomplete="off" [formControl]="form.controls.NameSearch" />
      </div>

      <!-- Levels -->
      <div>
        <label class="block text-sm font-medium mb-2">Levels</label>
        <!-- <p-multiSelect
          [options]="levelsOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Select levels"
          display="chip"
          [formControl]="form.controls.Levels"
        >
        </p-multiSelect> -->
        <p-multiselect
          [filter]="true"
          optionLabel="name"
          [options]="levels"
          optionLabel="name"
          optionValue="value"
          placeholder="Select levels"
          [maxSelectedLabels]="3"
          class="w-50"
          [formControl]="form.controls.Levels"
        ></p-multiselect>
      </div>

      <!-- Tagnames -->
      <div>
        <label class="block text-sm font-medium mb-2">Tags</label>
        <p-multiselect
          [filter]="true"
          optionLabel="name"
          [options]="tagnames()"
          optionLabel="name"
          optionValue="name"
          placeholder="Select tags"
          display="chip"
          [maxSelectedLabels]="3"
          class="w-50"
          [formControl]="form.controls.Tagnames"
        />
      </div>

      <!-- Sort -->
      <!-- <div class="md:col-span-1">
        <label class="block text-sm font-medium mb-2">Sort By</label>
        <p-dropdown
          optionLabel="label"
          optionValue="value"
          [formControl]="form.controls.SortBy"
          (onChange)="applySort()"
          placeholder="Choose field"
        >
        </p-dropdown>

        <div class="flex items-center gap-2 mt-3">
          <p-inputSwitch
            [formControl]="form.controls.IsDecending"
            (onChange)="applySort()"
          ></p-inputSwitch>
          <span>Descending</span>
        </div>
      </div> -->
      <div class="flex gap-2">
        <button pButton type="submit" label="Search" icon="pi pi-search"></button>
        <button
          pButton
          type="reset"
          label="Reset"
          icon="pi pi-refresh"
          class="p-button-secondary"
        ></button>
      </div>
    </form>
    <!-- <router-outlet></router-outlet> -->
  </div> `,
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
    // console.log(
    this.searchService.getTagname().subscribe({
      next: (res) => {
        this.tagnames.set(res?.data || []);
        // console.log(this.tagnames());
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
