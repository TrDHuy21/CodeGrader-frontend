import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommentModel } from '../models/comment-model';
@Component({
  selector: 'comment-component',
  imports: [ButtonModule],
  standalone: true,
  template: `<div class="comment-item flex items-start gap-4 p-4 bg-white">
    <img
      src="https://i.pravatar.cc/40"
      alt="User Avatar"
      class="h-8 w-8 rounded-full object-cover z-10"
    />

    <div class="flex-1">
      <div class="flex items-center justify-between mb-1">
        <p class="font-semibold text-gray-800">{{ comment.author }}</p>
        <p class="text-sm text-gray-400">August 29, 2025</p>
      </div>

      <div class="text-gray-700 mb-3" [innerHTML]="comment.content">{{ comment.content }}</div>

      <div class="flex gap-3">
        <button
          pButton
          type="button"
          label="Like"
          icon="pi pi-thumbs-up"
          class="p-button-sm p-button-text"
        ></button>
        <button
          pButton
          type="button"
          label="Reply"
          icon="pi pi-reply"
          class="p-button-sm p-button-text"
          (click)="onReply()"
        ></button>
      </div>
    </div>
  </div>`,
})
export class CommentComponent {
  @Input() comment!: CommentModel;
  @Input() rootId!: number; // id của comment gốc
  @Output() replyClicked = new EventEmitter<{ rootId: number; username: string }>();

  onReply() {
    this.replyClicked.emit({ rootId: this.rootId, username: 'aaa' });
  }
}
