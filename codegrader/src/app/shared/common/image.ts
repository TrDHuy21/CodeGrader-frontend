import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class ImageServices {
  converImgFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file); // -> data:image/png;base64,....
    });
  }
}
