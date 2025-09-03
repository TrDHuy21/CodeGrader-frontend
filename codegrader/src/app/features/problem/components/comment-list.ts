import { Component, computed, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from './comment';
import { SelectModule } from 'primeng/select';
import { FormGroup } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

type SortMode = 'relevant' | 'newest' | 'top';

interface CommentItem {
  id: number;
  user: string;
  avatar: string;
  role?: 'Author' | 'Top fan';
  text?: string;
  attachments?: { type: 'image'; url: string; w?: number; h?: number }[];
  likes: number;
  reactions?: string; // ví dụ: "😂😮👍"
  createdAt: Date;
  replies?: CommentItem[];
  // UI state
  showReply?: boolean;
  draft?: string;
  liked?: boolean;
}
interface ThreadItem {
  id: number;
  replies?: ThreadItem[];
}
@Component({
  selector: 'comment-list-component',
  imports: [CommonModule, CommentComponent, SelectModule, ButtonModule],
  standalone: true,
  template: `<!-- Sort bar -->
    <div class="flex items-center gap-2 my-3">
      <span class="text-gray-500">Sort:</span>
      <p-select
        [options]="[{ name: 'Most views' }, { name: 'Newest' }]"
        optionLabel="name"
        [showClear]="true"
        placeholder="Select a City"
        class="w-full md:w-56"
      />
    </div>
    <ul class="space-y-3">
      @for (it of items; track $index) {
      <li class="relative" [class.has-children]="it.replies?.length">
        <div class="pl-4 grid grid-cols-[3rem_3rem_1fr] gap-x-2 comment">
          <!-- Comment cấp 1 -->
          <div class="col-span-full relative comment">
            <comment-component></comment-component>
          </div>
          <!-- Replies: từ cột 2 đến cột cuối -->
          @if(it.replies?.length) {
          <div class="replies relative col-start-2 col-end-[4] pl-4">
            <ul class="space-y-3">
              @for(reps of it.replies; track $index) {
              <li class="relative reply">
                <comment-component></comment-component>
              </li>
              }
              <li class="relative reply">
                <form class="flex flex-col gap-4">
                  <div class="flex flex-col gap-1">
                    <textarea rows="5" cols="30" pTextarea formControlName="adress" -->
                    ></textarea
                    >
                  </div>
                  <button pButton severity="secondary" type="submit">
                    <span pButtonLabel>Submit</span>
                  </button>
                </form>
              </li>
            </ul>
          </div>
          }
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
  items: ThreadItem[] = [{ id: 1, replies: [{ id: 11 }, { id: 12 }] }, { id: 2 }];
  @Input() data: CommentItem[] = [];

  sort = signal<SortMode>('relevant');
  sorted = computed(() => {
    const list = [...this.data];
    if (this.sort() === 'newest') {
      return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    if (this.sort() === 'top') {
      return list.sort(
        (a, b) => b.likes - a.likes || b.createdAt.getTime() - a.createdAt.getTime()
      );
    }
    // relevant (giả lập)
    return list;
  });

  // actions
  toggleLike(c: CommentItem, $event?: Event) {
    $event?.stopPropagation();
    c.liked = !c.liked;
    c.likes = Math.max(0, c.likes + (c.liked ? 1 : -1));
  }

  startReply(c: CommentItem, $event?: Event) {
    $event?.stopPropagation();
    c.showReply = true;
  }

  cancelReply(c: CommentItem) {
    c.showReply = false;
  }

  submitReply(parent: CommentItem) {
    const text = (parent.draft ?? '').trim();
    if (!text) return;
    const reply: CommentItem = {
      id: Date.now(),
      user: 'You',
      avatar: 'https://i.pravatar.cc/40?u=me',
      text,
      likes: 0,
      createdAt: new Date(),
    };
    parent.replies = [...(parent.replies ?? []), reply];
    parent.draft = '';
    parent.showReply = false;
  }
}
