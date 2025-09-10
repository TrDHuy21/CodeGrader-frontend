# CodeGrader Frontend

Frontend application for the CodeGrader system - an automated code grading platform for programming education built with Angular.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)

## 🎯 Overview

This is the frontend interface for the CodeGrader system, built with **Angular**. It provides a modern web application for students to submit code assignments.
For detailed system information, architecture, and backend setup, please refer to the [CodeGrader Backend Repository](https://github.com/TrDHuy21/CodeGrader-Backend).

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js LTS** (recommended: Node 20 or higher)
- **Angular CLI** globally installed
- **VS Code** (recommended IDE)
- **Git**

## 🚀 Installation & Setup

### 1. Install Node.js
Download and install Node.js LTS from [nodejs.org](https://nodejs.org/)

### 2. Install Angular CLI
Open Command Prompt / PowerShell / Git Bash and run:
```bash
npm install -g @angular/cli
```

### 3. Clone the Repository
```bash
git clone https://github.com/TrDHuy21/CodeGrader-frontend.git
cd CodeGrader-frontend
```

### 4. Open in VS Code
```bash
code .
```

## 🏃‍♂️ Running the Application

### Important: Start Backend First
⚠️ **Make sure to follow the backend setup instructions first!** 
1. Go to [CodeGrader Backend Repository](https://github.com/TrDHuy21/CodeGrader-Backend)
2. Complete the backend setup and start Docker
3. Ensure all API endpoints are available before running the frontend

### Start Frontend Development Server

1. **Open Terminal in VS Code**
   - Go to menu: `Terminal → New Terminal`

2. **Install Dependencies** (first time only)
   ```bash
   npm install
   ```

3. **Run the Application**
   ```bash
   ng serve -o
   ```
   
   The `-o` flag will automatically open your browser at `http://localhost:4200`
