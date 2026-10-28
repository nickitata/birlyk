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
