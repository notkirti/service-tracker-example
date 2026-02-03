# Current SQL Schema

## Database: ServiceTrackerDb

### Table: Jobs

```sql
CREATE TABLE [Jobs] (
    [Id] int NOT NULL IDENTITY(1,1),
    [Title] nvarchar(max) NOT NULL,
    [ClientName] nvarchar(max) NOT NULL,
    [Status] nvarchar(max) NOT NULL,
    [CreatedDate] datetime2 NULL,
    CONSTRAINT [PK_Jobs] PRIMARY KEY ([Id])
);
```

**Columns:**
- `Id` (int, Primary Key, Identity) - Auto-incrementing primary key
- `Title` (nvarchar(max), NOT NULL) - Job title
- `ClientName` (nvarchar(max), NOT NULL) - Client name
- `Status` (nvarchar(max), NOT NULL) - Job status (default: "Pending")
- `CreatedDate` (datetime2, NULLABLE) - Creation timestamp

**Indexes:**
- Primary Key on `Id`

---

### Table: AuditLogs (New - for automatic audit logging)

```sql
CREATE TABLE [AuditLogs] (
    [Id] int NOT NULL IDENTITY(1,1),
    [EntityName] nvarchar(100) NOT NULL,
    [EntityId] int NOT NULL,
    [Action] nvarchar(20) NOT NULL,
    [Timestamp] datetime2 NOT NULL,
    [UserId] nvarchar(200) NULL,
    [OldValues] nvarchar(max) NULL,
    [NewValues] nvarchar(max) NULL,
    [Changes] nvarchar(500) NULL,
    CONSTRAINT [PK_AuditLogs] PRIMARY KEY ([Id])
);
```

**Columns:**
- `Id` (int, Primary Key, Identity) - Auto-incrementing primary key
- `EntityName` (nvarchar(100), NOT NULL) - Name of the entity being audited (e.g., "Job")
- `EntityId` (int, NOT NULL) - ID of the entity being audited
- `Action` (nvarchar(20), NOT NULL) - Action performed: "Created", "Updated", or "Deleted"
- `Timestamp` (datetime2, NOT NULL) - When the action occurred (UTC)
- `UserId` (nvarchar(200), NULLABLE) - Optional user identifier
- `OldValues` (nvarchar(max), NULLABLE) - JSON of old values (for updates/deletes)
- `NewValues` (nvarchar(max), NULLABLE) - JSON of new values (for creates/updates)
- `Changes` (nvarchar(500), NULLABLE) - Human-readable summary of changes

**Indexes:**
- Primary Key on `Id`
- Consider adding indexes on: `EntityName`, `EntityId`, `Timestamp` for query performance

---

## To Create the AuditLogs Table Migration

Run this command in the `ServiceTrackerExample` directory:

```bash
dotnet ef migrations add AddAuditLogging
dotnet ef database update
```
