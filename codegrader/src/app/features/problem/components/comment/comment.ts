import {
  Component,
  Output,
  EventEmitter,
  Input,
  signal,
  effect,
  computed,
  OnInit,
  inject,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommentModel } from '../../models/Comment/comment-model';
import { CommentService } from '../../services/comment-service';
import { ToastMessageOptions } from 'primeng/api';
import { AuthService } from '../../../../auth/auth.service';
import { ToastComponent } from '../../../../shared/components/toast';
import { UserProfileService } from '../../../user/services/user-profile-serive';
import { UserProfileModel } from '../../../user/models/user-profile';
import { CommonFunc } from '../../../../shared/common/common';

@Component({
  selector: 'comment-component',
  imports: [ButtonModule, ToastComponent],
  standalone: true,
  template: ` <toast-component [message]="this.message()"></toast-component>
    <div class="comment-item flex items-start gap-4 p-4 bg-white">
      <img
        src="{{ userCommentProfile()?.avatar }}"
        alt="User Avatar"
        class="h-8 w-8 rounded-full object-cover z-10"
      />

      <div
        class="flex-1 min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition"
      >
        <div class="flex items-center justify-between mb-1">
          <p class="font-semibold text-gray-800">{{ userCommentProfile()?.username }}</p>
          <p class="text-sm text-gray-400">{{ commonFunc.toDMY(comment.createdAt) }}</p>
        </div>

        <div class="text-gray-700 mb-3" [innerHTML]="comment.commentText">
          {{ comment.commentText }}
        </div>

        <div class="flex gap-3">
          <button
            pButton
            type="button"
            class="p-button-sm p-button-text"
            [icon]="icon()"
            (click)="toggleLike()"
          >
            {{ comment.like === 0 ? 'Like' : comment.like + ' Like' }}
          </button>
          <button
            pButton
            type="button"
            label="Reply"
            icon="pi pi-reply"
            class="p-button-sm p-button-text"
            (click)="onReply(comment.userId)"
          ></button>
        </div>
      </div>
    </div>`,
})
export class CommentComponent implements OnInit {
  @Input() comment!: CommentModel;
  @Input() rootId!: number; // id của comment gốc
  @Output() replyClicked = new EventEmitter<{ rootId: number; userId: number }>();
  @Output() liked = new EventEmitter<{ commentId: number; liked: boolean }>();
  commonFunc = inject(CommonFunc);
  onReply(userId: number) {
    this.replyClicked.emit({ rootId: this.rootId, userId: userId });
  }

  isLiked = signal(false);
  likeCount = signal(0);
  // Đồng bộ lại khi input thay đổi (sau reload/parent cập nhật)
  constructor(private authService: AuthService, private userService: UserProfileService) {
    effect(() => {
      const c = this.comment;
      this.likeCount.set(c.like ?? 0);
    });
  }
  userId: number = 0;
  userCommentProfile = signal<UserProfileModel | null>(null);
  ngOnInit(): void {
    this.userId = this.comment.userId;
    this.userService.getUserProfileById(this.userId).subscribe({
      next: (res) => {
        console.log(res);
        this.userCommentProfile.set(res.data ?? null);
        console.log(this.userCommentProfile());
      },
    });
  }

  icon = computed(() => (this.isLiked() ? 'pi pi-thumbs-up-fill' : 'pi pi-thumbs-up'));

  toggleLike() {
    if (!this.authService.isLoggedIn()) {
      this.showInfo('warn', 'Failed', 'You must loggin to use this function');
      return;
    }
    const next = !this.isLiked();
    this.isLiked.set(next);
    this.liked.emit({ commentId: this.comment.id, liked: next });
  }
  //api get user basic information: avatar + name base on id

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
}
