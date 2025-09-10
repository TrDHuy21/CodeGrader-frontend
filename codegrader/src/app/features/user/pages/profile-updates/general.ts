import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DatePipe } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { MeterGroupModule } from 'primeng/metergroup';

// For dynamic progressbar demo
import { ToastModule } from 'primeng/toast';
import { UserProgressService } from '../../services/user-progress-service';
import { UserSubmissionService } from '../../services/user-submission-service';
import { CommonFunc } from '../../../../shared/common/common';

// Kiểu độ khó
type Difficulty = 'Easy' | 'Medium' | 'Hard';

interface Progress {
  id: number;
  totalSubmisstion: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  rank: number;
}
interface Submission {
  id: number;
  userId: number;
  problemId: number;
  language: string;
  point: number;
  submisstionAt: string;
}
// Dữ liệu demo — thay bằng dữ liệu thật từ API của bạn
interface SolvedItem {
  id: number;
  name: string;
  difficulty: Difficulty;
  solvedAt: string; // ISO
}
interface BookmarkItem {
  problemId: number;
  problemName: string;
  level: Difficulty;
  createdAt: string; // ISO
}
@Component({
  selector: 'general',
  imports: [
    TagModule,
    TableModule,
    CardModule,
    DatePipe,
    ChartModule,
    ProgressBarModule,
    MeterGroupModule,
  ],
  template: `<div class="mx-auto max-w-[1200px] px-4 py-6 space-y-6">
    <header class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Tổng quan người dùng</h1>
    </header>

    <!-- KPI theo độ khó -->
    <!-- <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
      <p-card class="p-4">
        <ng-template pTemplate="header">Tổng đã giải</ng-template>
        <div class="text-3xl font-bold">{{ totalSolved }}/ 999</div>
        <p-progressbar [value]="50" />
      </p-card>
      <p-card>
        <ng-template pTemplate="header">Easy</ng-template>
        <div class="text-3xl font-bold text-emerald-600">{{ counts.Easy }}</div>
      </p-card>
      <p-card>
        <ng-template pTemplate="header">Medium</ng-template>
        <div class="text-3xl font-bold text-amber-600">{{ counts.Medium }}</div>
      </p-card>
      <p-card>
        <ng-template pTemplate="header">Hard</ng-template>
        <div class="text-3xl font-bold text-rose-600">{{ counts.Hard }}</div>
      </p-card>
    </div> -->

    <!-- Biểu đồ phân bố độ khó -->
    <p-card>
      <ng-template pTemplate="header">Phân bố theo độ khó</ng-template>
      <div class="flex items-center content-around gap-6">
        <p-chart type="pie" [data]="pieData()" [options]="chartOptions"></p-chart>
        <div class="flex flex-col min-w-[680px]">
          <div class="flex items-center justify-between">
            <span class="font-medium text-green-600">Easy ({{ easyCount() }})</span>
            <span class="text-sm opacity-70">{{ easyPct() }}%</span>
          </div>
          <p-progressbar [value]="easyPct" [showValue]="false" class=" mb-4" />

          <div class="flex items-center justify-between">
            <span class="font-medium text-amber-600">Medium ({{ mediumCount() }})</span>
            <span class="text-sm opacity-70">{{ mediumPct() }}%</span>
          </div>
          <p-progressbar [value]="mediumPct" [showValue]="false" class=" mb-4" color="#f59e0b" />

          <div class="flex items-center justify-between">
            <span class="font-medium text-rose-600">Hard ({{ hardCount() }})</span>
            <span class="text-sm opacity-70">{{ hardPct() }}%</span>
          </div>
          <p-progressbar
            [value]="hardPct"
            [showValue]="false"
            class=" mb-4"
            color="oklch(58.6% 0.253 17.585)
"
          />
        </div>
      </div>
    </p-card>

    <!-- Bảng bài đã làm gần đây -->
    <p-card>
      <ng-template pTemplate="header">Các bài đã làm gần đây</ng-template>
      @if (userSubmissionData()?.length !== 0) {

      <p-table
        [value]="userSubmissionData()"
        [paginator]="true"
        [rows]="10"
        [responsiveLayout]="'scroll'"
      >
        <ng-template pTemplate="header">
          <tr>
            <th style="width: 80px">ID</th>
            <th style="width: 120px">Problem</th>
            <th style="width: 100px">Ngôn ngữ</th>
            <th style="width: 80px">Điểm</th>
            <th style="width: 180px">Ngày nộp</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-row>
          <tr>
            <td>{{ row.id }}</td>
            <td>{{ row.problemId }}</td>
            <td>{{ row.language }}</td>
            <td>{{ row.point }}</td>
            <td>{{ row.submisstionAt | date : 'dd MMM yyyy' }}</td>
          </tr>
        </ng-template>
      </p-table>
      }
    </p-card>

    <!-- Bảng Bookmark -->
    <!-- <p-card>
      <ng-template pTemplate="header">Bookmark đã lưu</ng-template>
      <p-table [value]="bookmarks" [paginator]="true" [rows]="10" [responsiveLayout]="'scroll'">
        <ng-template pTemplate="header">
          <tr>
            <th style="width: 100px">Mã</th>
            <th>Tên</th>
            <th style="width: 140px">Độ khó</th>
            <th style="width: 180px">Ngày lưu</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-row>
          <tr>
            <td>{{ row.problemId }}</td>
            <td>{{ row.problemName }}</td>
            <td>
              <p-tag [value]="row.level" [severity]="tagSeverity(row.level)"></p-tag>
            </td>
            <td>{{ row.createdAt | date : 'short' }}</td>
          </tr>
        </ng-template>
      </p-table>
    </p-card> -->
  </div>`,
})
export class GeneralComponent implements OnInit {
  userProgressData = signal<Progress | null>(null);
  userSubmissionData = signal<Submission[]>([]);
  commonFunc = inject(CommonFunc);

  constructor(
    private userProgressService: UserProgressService,
    private userSubmissionService: UserSubmissionService
  ) {}
  ngOnInit(): void {
    this.userProgressService.getProgress(1).subscribe({
      next: (res) => {
        this.userProgressData.set(res.data);
        console.log(this.userProgressData());
      },
    });
    this.userSubmissionService.getSubmissionByUserId().subscribe({
      next: (res) => {
        this.userSubmissionData.set(res.data ?? []);
        console.log(this.userSubmissionData());
      },
      error: (err) => console.log(err),
    });
  }

  easyCount = computed(() => this.userProgressData()?.easySolved ?? 0);
  mediumCount = computed(() => this.userProgressData()?.mediumSolved ?? 0);
  hardCount = computed(() => this.userProgressData()?.hardSolved ?? 0);

  // total
  total = computed(() => this.easyCount() + this.mediumCount() + this.hardCount());

  // percentages
  easyPct = computed(() =>
    this.total() > 0 ? Math.round((this.easyCount() / this.total()) * 100) : 0
  );
  mediumPct = computed(() =>
    this.total() > 0 ? Math.round((this.mediumCount() / this.total()) * 100) : 0
  );
  hardPct = computed(() =>
    this.total() > 0 ? Math.round((this.hardCount() / this.total()) * 100) : 0
  );

  bookmarks: BookmarkItem[] = [
    { problemId: 101, problemName: 'Two Sum', level: 'Easy', createdAt: new Date().toISOString() },
    {
      problemId: 102,
      problemName: 'Palindrome Number',
      level: 'Easy',
      createdAt: new Date().toISOString(),
    },
    {
      problemId: 103,
      problemName: 'Add Two Numbers',
      level: 'Medium',
      createdAt: new Date().toISOString(),
    },
    {
      problemId: 104,
      problemName: 'LRU Cache',
      level: 'Hard',
      createdAt: new Date().toISOString(),
    },
  ];

  // === Tính toán thống kê ===

  // === Biểu đồ ===
  pieData = computed(() => ({
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        data: [this.easyCount(), this.mediumCount(), this.hardCount()],
        backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
        hoverBackgroundColor: ['#16a34a', '#d97706', '#dc2626'],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  }));
  chartOptions: any = {
    plugins: { legend: { position: 'bottom' } },
    responsive: true,
    maintainAspectRatio: false,
  };

  tagSeverity(level: Difficulty): 'success' | 'warning' | 'danger' {
    switch (level) {
      case 'Easy':
        return 'success';
      case 'Medium':
        return 'warning';
      case 'Hard':
        return 'danger';
    }
  }
}
