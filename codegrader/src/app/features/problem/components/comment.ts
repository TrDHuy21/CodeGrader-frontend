import { Component, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
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
        <p class="font-semibold text-gray-800">User123</p>
        <p class="text-sm text-gray-400">August 29, 2025</p>
      </div>

      <p class="text-gray-700 mb-3">This is a sample comment on the problem. Great problem!</p>

      <div class="flex gap-3">
        <button
          pButton
          type="button"
          label="Like"
          icon="pi pi-thumbs-up"
          class="p-button-sm p-button-text"
        >
          <span>(3)</span>
        </button>
        <button
          pButton
          type="button"
          label="Reply"
          icon="pi pi-reply"
          class="p-button-sm p-button-text"
        ></button>
      </div>
    </div>
  </div>`,
})
export class CommentComponent {
  @Output() userReply: string = '';
}
