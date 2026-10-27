# StudentHub Integration Test Report

**Date:** 2026-10-27

## 1. Frontend Test Results

| Test | Status | Evidence |
|---|---|---|
| Main page HTTP response | Passed | HTTP 200 |
| About page | Passed | Opened locally |
| Login page availability | Passed | Opened locally |
| Registration page availability | Passed | Opened locally |
| Dashboard page availability | Passed | Opened locally |
| Events page availability | Passed | Opened locally |
| Admin page availability | Passed | Opened locally |
| Browser console | Passed | Checked; no issues reported |
| Fetch API / JSON requests | Passed | Checked; no issues reported |
| Screenshots | Completed | Captured for submission |

## 2. Backend Tests — Practical 14

The separate Practical 14 application was tested locally using PHP and MySQL.

| Test | Status | Evidence |
|---|---|---|
| Admin login | Passed | Admin Dashboard opened |
| Student login | Passed | Student Dashboard opened |
| Role-based access | Passed | Student access to admin page tested |
| Audit Logs page | Passed | Opened while logged in as admin |
| Dashboard statistics | Passed | Statistics displayed |

**Backend limitation:** These tests were performed against the separate `wt14_admin` database. They do not establish that the Practical 14 PHP backend is integrated with the StudentHub repository.

## 3. StudentHub Database

The existing `studenthub_db` database was inspected without modifying its records.

| Table | Record count |
|---|---:|
| Users | 1 |
| Students | 5 |
| Events | 3 |
| Registrations | 4 |

Record counts confirm that data exists. End-to-end database CRUD through the StudentHub website has not been verified.

## 4. Local Deployment

The StudentHub static website is available locally through Apache:

`http://studenthub.local/`

The tested pages returned HTTP 200 during earlier checks. A successful HTTP response confirms page availability, not complete application functionality.

## 5. Remaining Limitations

- Responsive desktop/mobile layout requires complete verification.
- Registration and form validation require functional testing.
- PHP authentication and role-based access are not integrated into the StudentHub repository.
- StudentHub database CRUD, protected routes, and security checks remain unverified end-to-end.

## 6. Summary

The StudentHub repository contains the frontend, JSON data, and documentation. Main page availability has been checked, and browser console and JSON requests were reported as checked without issues. A separate Practical 14 PHP/MySQL application passed basic login, role-access, audit-page, and dashboard tests.

The two applications use different database schemas. Further integration and end-to-end testing are required before StudentHub can be described as a fully integrated, secure full-stack application.
 