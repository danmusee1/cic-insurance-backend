NestJS Project Overview
This backend project is built using NestJS and follows a modular architecture, designed for scalability, maintainability, and clean separation of concerns. The project uses Prisma ORM with a MySQL database for robust, type-safe data management.
Getting Started To run this project, refer to the README.md file located in the root directory.
Project Structure
All features are encapsulated in self-contained modules located under the src/ directory:

1. auth/ Module
Handles user authentication via JWT-based login and registration.

Includes route protection with custom guards to enforce access control.

2. google-auth/ Module
Implements Google OAuth strategy for seamless third-party authentication.

3. user/ Module
Manages user-related API endpoints through a dedicated controller.

Business logic is handled in users.service.ts.

4. message/ Module
Sends automated email notifications to newly registered users.

Uses email templates stored at the project root for consistent formatting.

5. shared/ Module
Contains common utilities and cross-cutting concerns:

HTTP Exception Filters – for consistent error responses

Interceptors – e.g., logging, transformation

Guards – to secure routes and enforce roles/permissions

Helper Functions

Shared Services reused across modules

Core Features
ORM: Uses Prisma with MySQL for database access and migrations.

Authentication & Authorization:

JWT-based auth

Google OAuth

Custom guards for role-based access control

Email Integration: Configurable mail service using HTML templates.

Swagger Documentation: Provides clear, interactive API docs.

Global CORS Setup: Enabled in main.ts to allow cross-origin requests from the frontend portal.

Entry Point - main.ts
Enables CORS

Configures Swagger for auto-generated API documentation

Defines custom port binding
