import { Component, computed, effect, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from './comment';
import { SelectModule } from 'primeng/select';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { ToastComponent } from '../../../../shared/components/toast';
import { ToastMessageOptions } from 'primeng/api';
import { EditorModule } from 'primeng/editor';
import { CommentService } from '../../services/comment-service';
import { ActivatedRoute } from '@angular/router';
import { CommentModel } from '../../models/Comment/comment-model';
import { AuthService } from '../../../../auth/auth.service';

type SortMode = 'relevant' | 'newest' | 'top';

export type RootWithFlat = CommentModel & { flatReplies?: CommentModel[] };

@Component({
  selector: 'comment-list-component',
  imports: [
    CommonModule,
    CommentComponent,
    SelectModule,
    ButtonModule,
    ReactiveFormsModule,
    TextareaModule,
    ToastComponent,
    EditorModule,
  ],

  standalone: true,
  template: `<!-- Sort bar -->
    <toast-component [message]="this.message()"></toast-component>
    <h3 class="text-lg font-semibold mb-4">Discussion</h3>
    <form (submit)="submitComment($event)" [formGroup]="commentFrom">
      <div class="flex flex-col gap-1">
        <p-editor formControlName="commentText" [style]="{ height: '320px' }" />
        <!-- @if (isInvalid('text')) {
            [invalid]="isInvalid('text')"
        <p-message severity="error" size="small" variant="simple">Content is required.</p-message>
        } -->
      </div>
      <button pButton severity="secondary" type="submit" class="w-full mt-4">
        <span pButtonLabel>Comment</span>
      </button>
    </form>
    <div class="flex items-center gap-2 my-3 ">
      <span class="text-gray-500">Sort:</span>
      <p-select
        [options]="sortOptions"
        optionLabel="label"
        optionValue="value"
        placeholder=""
        [placeholder]="selectedSort()"
        class="w-full md:w-56"
        (onChange)="selectedSort.set($event.value)"
      />
    </div>
    <ul class="space-y-3  shadow rounded-lg">
      @for (it of commentsSorted(); track it.id) {
      <li class="relative" [class.has-children]="(it.flatReplies?.length ?? 0) > 0">
        <!-- Root comment -->
        <comment-component
          [comment]="it"
          [rootId]="it.id"
          (replyClicked)="onReplyFromChild($event)"
          (liked)="like($event)"
        >
        </comment-component>
        @if (replyForId === it.id && isReply) {
        <div class="mt-3">
          <form class="ml-10 flex flex-col gap-4" (submit)="submit($event)" [formGroup]="formReply">
            <div class="flex flex-col gap-1">
              <textarea
                rows="5"
                cols="30"
                class="border rounded-lg bg-gray-200 ml-8"
                pTextarea
                formControlName="commentText"
              >
              </textarea>
            </div>
            <div class="flex gap-2">
              <button pButton severity="secondary" type="submit">
                <span pButtonLabel>Submit</span>
              </button>
              <button pButton severity="danger" type="button" (click)="cancel()">
                <span pButtonLabel>Cancel</span>
              </button>
            </div>
          </form>
        </div>
        }

        <!-- Nút View/Hide -->
        @if (isRepliesOpen(it.id)) {
        <span class="ml-17 text-green-600 cursor-pointer inline" (click)="toggleReplies(it.id)">
          Hide replies
        </span>
        <!-- Replies list -->
        <ul class="ml-17 space-y-3 mt-2">
          @for (reps of (it.flatReplies ?? []); track reps.id) {
          <li class="relative reply">
            <comment-component
              [comment]="reps"
              [rootId]="it.id"
              (replyClicked)="onReplyFromChild($event)"
              (liked)="like($event)"
            >
            </comment-component>
          </li>

          <!-- Form reply dưới một REPLY cụ thể -->
          @if (replyForId === reps.id && isReply) {
          <li class="relative reply">
            <form class="flex flex-col gap-4" (submit)="submit($event)" [formGroup]="formReply">
              <div class="flex flex-col gap-1">
                <textarea
                  rows="5"
                  cols="30"
                  class="border rounded-lg bg-gray-200"
                  pTextarea
                  formControlName="commentText"
                ></textarea>
              </div>
              <div class="flex gap-2">
                <button pButton severity="secondary" type="submit">
                  <span pButtonLabel>Submit</span>
                </button>
                <button pButton severity="danger" type="button" (click)="cancel()">
                  <span pButtonLabel>Cancel</span>
                </button>
              </div>
            </form>
          </li>
          } }
        </ul>
        } @else { @if ((it.flatReplies?.length ?? 0) > 0) {
        <span class="ml-17 text-green-600 cursor-pointer inline" (click)="toggleReplies(it.id)">
          View all {{ it.flatReplies?.length }} replies
        </span>
        } }
      </li>

      }
    </ul> `,
  styleUrl: './comment-list.css',
})
export class CommentListComponent implements OnInit {
  message = signal<ToastMessageOptions | ToastMessageOptions[] | null>(null);
  showInfo(severity: string, summary: string, detail: string) {
    this.message.set({
      severity: severity,
      summary: summary,
      detail: detail,
      key: 'tr',
      life: 3000,
    });
  }
  formReply: FormGroup;
  commentFrom: FormGroup;
  problemId = input.required<number>();
  comments = signal<CommentModel[]>([]);
  constructor(
    private fb: FormBuilder,
    private fbc: FormBuilder,
    private commentService: CommentService,
    private authService: AuthService
  ) {
    this.formReply = this.fb.group({
      problemId: [null as number | null],
      parentCommentId: [null as null | null],
      commentText: [''],
    });
    this.commentFrom = this.fbc.group({
      problemId: [null as number | null],
      parentCommentId: [null as null | null],
      commentText: [''],
    });
    effect(() => {
      const id = this.problemId(); // lúc này Angular đã gán input
      // set cho cả 2 form
      this.formReply.get('problemId')!.setValue(id);
      this.commentFrom.get('problemId')!.setValue(id);
    });
  }
  submitComment(event: Event) {
    event.preventDefault();

    const comment: CommentModel = this.commentFrom.getRawValue();
    this.commentService.add(comment).subscribe({
      next: (res) => {
        if (!res.isSuccess) {
          this.showInfo('warn', 'Failed', res.message ?? '');
          return;
        }
        this.showInfo('success', 'Success', res.message ?? '');
        this.commentFrom.reset();
      },
      error: (err) => this.showInfo('warn', 'Failed', 'You must loggin first to comment'),
      complete: () => this.loadComments(this.problemId()),
    });
  }
  ngOnInit(): void {
    const id = this.problemId();
    this.commentService.getPerProblem(id).subscribe({
      next: (res) => {
        this.comments.set(res.data ?? []);
      },
    });
    this.loadComments(id);
  }

  isReply = false;
  replyForId: number | null = null;
  onReplyFromChild(e: { userId: number; rootId: number }) {
    this.isReply = true;
    this.replyForId = e.rootId;
    const control = this.formReply.get('parentCommentId');
    const current = (control?.value as string) ?? '';
    const mention = `@${e.userId} `;

    // Nếu chưa có prefix mention, thêm vào đầu; nếu đã có, giữ nguyên
    const next = current.startsWith(mention) ? current : mention + current.replace(/^\s+/, '');
    this.formReply.patchValue({
      commentText: current?.toString().startsWith(mention) ? current : mention + current,
      parentCommentId: e.rootId,
      problemId: this.problemId(),
    });
  }
  like(e: { commentId: number; liked: boolean }) {
    const req$ = e.liked
      ? this.commentService.like(e.commentId)
      : this.commentService.unlike(e.commentId);

    req$.subscribe({
      next: () => this.loadComments(this.problemId()), // tải lại toàn bộ
      error: (err) => console.error(err),
    });
  }

  submit(event: Event) {
    event.preventDefault();
    event.preventDefault();
    const reply: CommentModel = this.formReply.getRawValue();
    this.commentService.add(reply).subscribe({
      next: (res) => {
        if (!res.isSuccess) {
          this.showInfo('warn', 'Failed', res.message ?? '');
          return;
        }
        this.showInfo('success', 'Success', res.message ?? '');
      },
      error: (err) => this.showInfo('warn', 'Failed', 'You must loggin first to comment'),
      complete: () => this.loadComments(this.problemId()),
    });
    this.formReply.reset(); // reset nội dung form
    this.isReply = false;
  }
  cancel() {
    this.formReply.reset();
    this.isReply = false;
  }
  // những root đang mở replies
  openReplies = signal<Set<number>>(new Set());

  // helper: đang mở hay không
  isRepliesOpen = (id: number) => this.openReplies().has(id);

  // toggle cho một root id
  toggleReplies(id: number) {
    this.openReplies.update((s) => {
      const ns = new Set(s);
      ns.has(id) ? ns.delete(id) : ns.add(id);
      return ns; // nhớ return Set mới để Signal detect thay đổi
    });
  }

  sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Most likes', value: 'likes' },
  ];

  selectedSort = signal<'newest' | 'likes'>('newest');

  commentsSorted = computed(() => {
    const mode = this.selectedSort() ?? 'likes';
    const list = this.commentsTemp(); // RootWithFlat[]

    const cmp =
      mode === 'likes'
        ? // sort theo like giảm dần, tie-break bằng createdAt mới nhất
          (a: RootWithFlat, b: RootWithFlat) =>
            b.like - a.like || b.createdAt.getTime() - a.createdAt.getTime()
        : // sort theo thời gian tạo mới nhất
          (a: RootWithFlat, b: RootWithFlat) =>
            b.createdAt.getTime() - a.createdAt.getTime() || b.like - a.like;

    // KHÔNG mutate signal: dùng toSorted nếu có, fallback sao chép + sort
    return (list as any).toSorted ? (list as any).toSorted(cmp) : [...list].sort(cmp);
  });

  commentsTemp = signal<RootWithFlat[]>([]);
  isLoading = signal(true);

  // Chuẩn hóa 1 node từ raw API -> CommentModel (đệ quy)
  normalizeComment = (raw: any): CommentModel => ({
    id: raw.id,
    userId: raw.userId,
    problemId: raw.problemId,
    commentText: raw.commentText,
    parentCommentId: raw.parentCommentId ?? undefined, // null -> undefined
    like: raw.like,
    createdAt: new Date(raw.createdAt),
    replies: Array.isArray(raw.replies) ? raw.replies.map(this.normalizeComment) : [],
  });

  normalizeComments = (raws: any[] | null | undefined): CommentModel[] =>
    (raws ?? []).map((r) => this.normalizeComment(r));

  flattenReplies = (nodes?: CommentModel[]): CommentModel[] => {
    if (!nodes?.length) return [];
    const out: CommentModel[] = [];
    const queue = [...nodes]; // BFS
    while (queue.length) {
      const n = queue.shift()!;
      out.push(n);
      if (n.replies?.length) queue.push(...n.replies);
    }
    // sort theo thời gian tạo tăng dần
    out.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return out;
  };

  // ------ Load ------
  loadComments(problemId: number) {
    this.isLoading.set(true);
    this.commentService.getPerProblem(problemId).subscribe({
      next: (res) => {
        const roots: CommentModel[] = this.normalizeComments(res?.data ?? []);
        const withFlat: RootWithFlat[] = roots.map((r) => ({
          ...r,
          flatReplies: this.flattenReplies(r.replies),
        }));
        this.commentsTemp.set(withFlat);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.commentsTemp.set([]);
        this.isLoading.set(false);
      },
    });
  }
}
