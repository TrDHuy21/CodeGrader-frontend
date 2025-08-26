# Hướng dẫn chạy Angular Project bằng VS Code

## Yêu cầu
1. Cài [Node.js LTS](https://nodejs.org/) (khuyến nghị Node 20).
2. Cài Angular CLI (Dùng Command Prompt / PowerShell / Git Bash (ở ngoài VS Code))
   Chạy lệnh: npm install -g @angular/cli

Các bước chạy

1. Clone project từ GitHub

2. Mở project trong VS Code

3. Mở terminal trong VS Code
  - Vào menu Terminal → New Terminal
  - Cài dependencies: chạy lệnh: npm install (chỉ lần đầu)
  - Chạy ứng dụng: chạy lệnh: ng serve -o (-o sẽ tự mở trình duyệt tại http://localhost:4200)

* Lưu ý: Chạy hướng dẫn bên Backend trước, sau khi hoàn thành khởi động Docker sau đó mới chạy Frontend để đảm bảo có đủ các đầu API.
