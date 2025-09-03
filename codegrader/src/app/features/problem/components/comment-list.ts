import { Component, computed, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from './comment';
import { SelectModule } from 'primeng/select';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CommentModel } from '../models/comment-model';
import { TextareaModule } from 'primeng/textarea';
import { ToastComponent } from '../../../shared/components/toast';
import { ToastMessageOptions } from 'primeng/api';
import { EditorModule } from 'primeng/editor';
import { text } from 'stream/consumers';
type SortMode = 'relevant' | 'newest' | 'top';

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
    <h3 class="text-lg font-semibold mb-4">Discussion (3)</h3>
    <form (submit)="submitComment($event)" [formGroup]="commentFrom">
      <div class="flex flex-col gap-1">
        <p-editor formControlName="content" [style]="{ height: '320px' }" />
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
        [options]="[{ name: 'Most views' }, { name: 'Newest' }]"
        optionLabel="name"
        [showClear]="true"
        placeholder="Select a City"
        class="w-full md:w-56"
      />
    </div>
    <ul class="space-y-3  shadow rounded-lg">
      @for (it of items(); track $index) {
      <li class="relative" [class.has-children]="it.replies?.length">
        <div class="pl-4 grid grid-cols-[3rem_3rem_1fr] gap-x-2 comment">
          <!-- Comment cấp 1 -->
          <div class="col-span-full relative comment">
            <comment-component
              (replyClicked)="onReplyFromChild($event)"
              [comment]="it"
              [rootId]="it.id"
            ></comment-component>
          </div>
          <!-- Replies: từ cột 2 đến cột cuối -->

          <div class="replies relative col-start-2 col-end-[4] pl-4">
            <ul class="space-y-3">
              @for(reps of it.replies; track $index) {
              <li class="relative reply">
                <comment-component
                  [comment]="reps"
                  [rootId]="it.id"
                  (replyClicked)="onReplyFromChild($event)"
                ></comment-component>
              </li>
              } @if(replyForId === it.id && isReply) {
              <li class="relative reply">
                <form class="flex flex-col gap-4" (submit)="submit($event)" [formGroup]="form">
                  <div class="flex flex-col gap-1">
                    <textarea
                      rows="5"
                      cols="30"
                      class="border rounded-lg bg-gray-200 z-2"
                      formControlName="comment"
                      pTextarea
                    >
                    </textarea>
                  </div>
                  <div class="flex">
                    <button pButton severity="secondary" type="submit">
                      <span pButtonLabel>Submit</span>
                    </button>
                    <button pButton severity="danger" type="button" (click)="cancel()">
                      <span pButtonLabel>Cancel</span>
                    </button>
                  </div>
                </form>
              </li>
              }
            </ul>
          </div>
        </div>
      </li>
      }
    </ul> `,
  styles: [
    `
      :host {
        /* Biến tinh chỉnh nhanh cho rail + elbow */
        --line-color: #e5e7eb; /* gray-300 */
        --line-w: 3.5px;

        /* vị trí line dọc trên main comment */
        --rail-left: 3rem; /* lệch so với mép trái .comment */
        --rail-top: 3.5rem; /* bắt đầu vẽ dưới avatar 1 chút */

        /* elbow cho reply */
        --elbow-w: 110px;
        --elbow-h: 30px;
        --elbow-top: 12px;
        --elbow-radius: 20px;
      }

      /* Comment có replies → vẽ đường dọc (rail) từ dưới bubble xuống dưới */
      li.has-children > .comment {
        position: relative;
      }
      li.has-children > .comment::before {
        content: '';
        position: absolute;
        left: var(--rail-left);
        top: var(--rail-top);
        bottom: 0;
        width: var(--line-w);
        background: var(--line-color);
        z-index: 1000;
      }

      /* Progressive enhancement theo bài: dùng :has(ul) nếu hỗ trợ */
      @supports selector(li:has(ul)) {
        li:has(> .replies) > .comment {
          position: relative;
        }
        li:has(> .replies) > .comment::before {
          content: '';
          position: absolute;
          left: var(--rail-left);
          top: var(--rail-top);
          bottom: 0;
          width: var(--line-w);
          background: var(--line-color);
        }
      }

      /* Vẽ elbow + line cho từng reply trong .replies */
      .replies > ul > li {
        position: relative;
      }

      /* elbow (góc cong) nối từ rail sang bubble reply */
      .replies > ul > li::after {
        content: '';
        position: absolute;
        inset-inline-start: calc(var(--rail-left) - var(--elbow-w)); /* logic-friendly */
        top: var(--elbow-top);
        width: var(--elbow-w);
        height: var(--elbow-h);
        border-inline-start: var(--line-w) solid var(--line-color);
        border-bottom: var(--line-w) solid var(--line-color);
        border-end-start-radius: var(--elbow-radius);
        background: transparent;
        pointer-events: none;
        z-index: 1;
      }
    `,
  ],
})
export class CommentListComponent {
  message = signal<ToastMessageOptions | ToastMessageOptions[] | null>(null);
  showInfo() {
    this.message.set({
      severity: 'success',
      summary: 'Info Comment',
      detail: 'Reply success',
      key: 'tr',
      life: 3000,
    });
  }
  form: FormGroup;
  commentFrom: FormGroup;

  constructor(private fb: FormBuilder, private fbc: FormBuilder) {
    this.form = this.fb.group({
      comment: [''],
      replyToId: [null as number | null], // để submit biết đang reply ai
    });
    this.commentFrom = this.fbc.group({
      id: [1],
      author: ['User1'],
      content: [''],
      replies: [[] as CommentModel[]],
    });
  }
  submitComment(event: Event) {
    event.preventDefault();
    const newItem: CommentModel = this.commentFrom.getRawValue();
    this.items()?.push(newItem);
    this.showInfo();
  }

  isReply = false;
  replyForId: number | null = null;
  onReplyFromChild(e: { username: string; rootId: number }) {
    this.isReply = true;
    this.replyForId = e.rootId;
    const control = this.form.get('comment');
    const current = (control?.value as string) ?? '';
    const mention = `@${e.username} `;

    // Nếu chưa có prefix mention, thêm vào đầu; nếu đã có, giữ nguyên
    const next = current.startsWith(mention) ? current : mention + current.replace(/^\s+/, '');

    console.log(this.form.getRawValue());
    this.form.patchValue({
      comment: current?.toString().startsWith(mention) ? current : mention + current,
    });
  }

  items = signal<CommentModel[] | null>([
    {
      id: 1,
      author: 'Alice',
      content: 'Mọi người thấy bài viết này thế nào?',
      replies: [
        {
          id: 11,
          author: 'Bob',
          content: 'Theo mình thì khá hay đó!',
        },
        {
          id: 12,
          author: 'Charlie',
          content: 'Mình nghĩ có thể bổ sung thêm ví dụ.',
        },
      ],
    },
    {
      id: 2,
      author: 'David',
      content: 'Có ai biết deadline dự án là khi nào không?',
      replies: [
        {
          id: 21,
          author: 'Eva',
          content: 'Theo mình nhớ là cuối tuần này.',
        },
      ],
    },
    {
      id: 3,
      author: 'Frank',
      content: 'Mình mới tham gia nhóm, rất mong được học hỏi thêm!',
      // chưa có replies
    },
  ]);
  submit(event: Event) {
    event.preventDefault();
    this.showInfo();
    this.form.reset(); // reset nội dung form
    this.isReply = false;
  }
  cancel() {
    this.form.reset();
    this.isReply = false;
  }
}
