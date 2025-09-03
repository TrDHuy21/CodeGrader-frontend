import { Component, Input } from '@angular/core';
import { ToastModule, Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ToastMessageOptions } from 'primeng/api';
@Component({
  selector: 'toast-component',
  standalone: true,
  imports: [ToastModule, Toast],
  template: `<p-toast
    [showTransitionOptions]="'250ms'"
    [showTransformOptions]="'translateX(100%)'"
    [hideTransitionOptions]="'150ms'"
    [hideTransformOptions]="'translateX(100%)'"
    position="top-right"
    key="tr"
  /> `,
  providers: [MessageService],
})
export class ToastComponent {
  constructor(private messageService: MessageService) {}
  @Input()
  set message(msg: ToastMessageOptions | ToastMessageOptions[] | null) {
    if (!msg) return;
    if (Array.isArray(msg)) this.messageService.addAll(msg);
    else this.messageService.add(msg);
  }
}
