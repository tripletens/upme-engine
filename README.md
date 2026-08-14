# Universal Project Monitoring Engine (UPME)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PHP](https://img.shields.io/badge/PHP-8.4-777BB4?logo=php)](https://www.php.net/)
[![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?logo=laravel)](https://laravel.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)

The **Universal Project Monitoring Engine (UPME)** is a domain-agnostic, multi-tenant B2B platform designed to monitor, track, analyze, and report project health, schedule variance, risks, issues, activity dependencies, and evidence-backed deliverable approvals across diverse industries (education, construction, software, government, NGOs).

---

## 🌟 Key Features

- 🏢 **Multi-Tenant Isolation**: Scoped organization middleware and Eloquent global scopes.
- 📐 **Domain-Agnostic Engine**: Supports customizable project templates (School Lab Rollout, Construction Site Prep, Software Releases).
- 🔗 **Dependency Engine (DAG)**: Automated downstream delay propagation calculation across Finish-to-Start (FS), Start-to-Start (SS), Finish-to-Finish (FF), and Start-to-Finish (SF) links.
- 📊 **Deterministic Health Scoring**: Algorithmic composite score $H \in [0, 100]$ evaluating Schedule Variance ($30\%$), Progress ($25\%$), Issue Severity ($20\%$), Risk ($15\%$), and Deliverable Approvals ($10\%$).
- 📄 **Evidence-Backed Deliverables**: Upload verification assets (inspection reports, photos, receipts) with multi-role sign-off workflows.
- ⚠️ **Risk $\rightarrow$ Issue Lifecycle**: Pre-materialization risk mitigation coupled with post-materialization issue management.
- 📜 **Audit Trail & Project Events**: Immutable record logging of all project activities (`PROJECT_CREATED`, `PROGRESS_UPDATED`, `DEPENDENCY_BLOCKAGE_DETECTED`, `EVIDENCE_APPROVED`).
- 🏫 **School Lab Implementation Seed Demo**: Fully populated initial scenario (*Computer Science Laboratory Implementation*) with deliberate procurement delays demonstrating downstream blockage and health score degradation.

---

## 📁 Repository Structure

```
├── backend/                 # Laravel 11 API Backend
│   ├── app/
│   │   ├── Http/Controllers/ # REST API Controllers & JSON Resources
│   │   ├── Models/           # Eloquent Models & Global Tenant Scopes
│   │   ├── Services/         # Dependency Engine & Health Calculation Domain Services
│   │   └── Policies/         # RBAC Authorization Policies
│   ├── database/
│   │   ├── migrations/       # MySQL/PostgreSQL DDL Migrations
│   │   └── seeders/          # School Lab Demo Seeders
│   └── tests/                # Automated PHPUnit / Pest Test Suite
│
├── frontend/                # React + TypeScript + Vite SPA Frontend
│   ├── src/
│   │   ├── components/       # MUI Components, Gantt Timelines, Health Badges
│   │   ├── features/         # Redux Slices & RTK Query API Services
│   │   ├── pages/            # Dashboard, Project Detail, Risk & Evidence Views
│   │   └── types/            # TypeScript Interfaces & API Types
│   └── public/
│
├── docs/                    # Architectural Specifications & Business Proposals
```

---

## 🚀 Quickstart Guide

### Prerequisites
- PHP 8.2+ with Composer
- Node.js 18+ with npm/yarn
- MySQL 8.0+ / PostgreSQL 14+ / SQLite

### 1. Backend Setup (Laravel API)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --port=8000
```

### 2. Frontend Setup (React SPA)
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser to view the **UPME Executive Dashboard**.

---

## 📄 Documentation & Artifacts

- 📋 [Implementation Plan & System Architecture](docs/implementation_plan.md)
- 💼 [Executive Business Proposal](docs/business_proposal.md)

---

## 🛡️ License

This project is open-source under the [MIT License](LICENSE).
