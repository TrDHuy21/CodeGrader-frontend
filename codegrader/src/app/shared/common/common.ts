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
  //Mon Sep 08 2025 09:33:39 GMT+0700 (Indochina Time) to 08/09/2025
  toDMY(dateInput: string | Date): string {
    const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isNaN(d.getTime())) return ''; // invalid date
    const day = d.getDate(); // 1..31
    const month = d.getMonth() + 1; // 0-based -> +1
    const year = d.getFullYear();
    return `${day}/${month}/${year}`; // ví dụ: 8/9/2025
  }
  //const iso = "2025-09-09T20:22:04.396Z";

  //   formatted = new Date(iso).toLocaleDateString('en-GB', {
  //   day: '2-digit',
  //   month: 'short',
  //   year: 'numeric'
  // });
}
