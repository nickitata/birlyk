# Birlyk Backend

## Requirements

- Java 17
- PostgreSQL running on `localhost:5432`
- A PostgreSQL database named `birlyk_db`

The database username and password are configured in `backend/src/main/resources/application.properties`.
Hibernate creates or updates the `profiles`, `events`, and `guests` tables when the API starts.

## Run from IntelliJ IDEA

Open the workspace root as a project and load the single root `pom.xml` in the Maven tool
window. Reload the Maven project, set the project SDK to Java 17, then select the shared
`BirlykBackendApplication` run configuration.

If controller or DTO files still appear unresolved after Maven has successfully built the
project, use **Reload All Maven Projects** from the Maven tool window and wait for indexing
to finish. The source root is `backend/src/main/java` and the package root is
`backend/src/main/java/kz/birlyk/backend`.

## Check the tables in pgAdmin

Connect pgAdmin to the same local PostgreSQL server on port `5432`, then expand
**Databases → birlyk_db → Schemas → public → Tables** and refresh **Tables**. Hibernate
creates the tables in this database when the application starts.

## Run from the workspace terminal

From the workspace root, run:

```powershell
.\mvnw.cmd spring-boot:run
```

The API listens on `http://localhost:8080`. Open that address or
`http://localhost:8080/api/health` to check that it is running.

## 🛡️ Cybersecurity Analysis & Improvements

### 1. Identified Security Risks
1. **Unrestricted Guest Data Access via Supabase RLS**
   * **Risk Description:** If Row Level Security (RLS) is improperly configured on the `guests` table, unauthorized users can issue a wildcard API query (`SELECT *`) to scrape sensitive guest details (full names, phone numbers, seating assignments).
   * **Impact:** Violation of user privacy and personal data leakage (PII).

2. **Client-Side Authorization Bypass**
   * **Risk Description:** Relying solely on React Router guards (`/_authenticated/dashboard`) without enforcing server-side JWT verification for API calls allows attackers to manipulate local state and attempt unauthorized backend operations.
   * **Impact:** Unauthorized access to event management and modification privileges.

### 2. Proposed Security Improvement
* **Enforce Strict Row-Level Security (RLS) Policies:** Configure database-level access controls in Supabase where read operations for unauthenticated visitors are restricted strictly to single-record matching during guest lookup, while data modifications require `auth.uid() == event.owner_id`.