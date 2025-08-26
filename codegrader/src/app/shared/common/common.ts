import { Inject, Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class CommonFunc {
  convertDateNowToISO(now: number): string {
    const d = new Date(now); // ms = milliseconds
    const pad = (n: number) => n.toString().padStart(2, '0');
    return (
      `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}` +
      `T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}Z`
    );
  }
  // Bóc ngày theo local rồi tạo ISO UTC đúng "YYYY-MM-DDT09:15:42Z"
  convertDateObjToISO(src: Date): string {
    const d = new Date(src);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

   public calculateStrength(password: string): number {
    let score = 0;
    if (!password) return score;

    if (password.length >= 8) score++;
    if (/[A-Za-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
  }

  public getPasswordStrengthText(strength: number): string {
    if (strength <= 1) return 'Weak';
    if (strength === 3 || strength === 2) return 'Medium';
    return 'Strong';
  }
}
