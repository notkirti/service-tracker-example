using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using ServiceTrackerExample.Models;
using System.Text.Json;

namespace ServiceTrackerExample.DataServices
{
    public class AuditInterceptor : SaveChangesInterceptor
    {
        public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
        {
            AuditChanges(eventData.Context);
            return base.SavingChanges(eventData, result);
        }

        public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
            DbContextEventData eventData,
            InterceptionResult<int> result,
            CancellationToken cancellationToken = default)
        {
            AuditChanges(eventData.Context);
            return base.SavingChangesAsync(eventData, result, cancellationToken);
        }

        private void AuditChanges(DbContext? context)
        {
            if (context == null) return;

            var auditLogs = new List<AuditLog>();

            foreach (var entry in context.ChangeTracker.Entries())
            {
                // Skip audit log entries themselves to avoid recursion
                if (entry.Entity is AuditLog) continue;

                var entityName = entry.Entity.GetType().Name;
                var entityId = GetEntityId(entry);

                if (entry.State == EntityState.Added)
                {
                    auditLogs.Add(new AuditLog
                    {
                        EntityName = entityName,
                        EntityId = entityId,
                        Action = "Created",
                        Timestamp = DateTime.UtcNow,
                        NewValues = JsonSerializer.Serialize(entry.Entity),
                        Changes = "Entity created"
                    });
                }
                else if (entry.State == EntityState.Modified)
                {
                    var oldValues = new Dictionary<string, object?>();
                    var newValues = new Dictionary<string, object?>();
                    var changes = new List<string>();

                    foreach (var property in entry.Properties)
                    {
                        if (property.IsModified)
                        {
                            oldValues[property.Metadata.Name] = property.OriginalValue;
                            newValues[property.Metadata.Name] = property.CurrentValue;
                            changes.Add($"{property.Metadata.Name}: '{property.OriginalValue}' -> '{property.CurrentValue}'");
                        }
                    }

                    if (changes.Any())
                    {
                        auditLogs.Add(new AuditLog
                        {
                            EntityName = entityName,
                            EntityId = entityId,
                            Action = "Updated",
                            Timestamp = DateTime.UtcNow,
                            OldValues = JsonSerializer.Serialize(oldValues),
                            NewValues = JsonSerializer.Serialize(newValues),
                            Changes = string.Join("; ", changes)
                        });
                    }
                }
                else if (entry.State == EntityState.Deleted)
                {
                    auditLogs.Add(new AuditLog
                    {
                        EntityName = entityName,
                        EntityId = entityId,
                        Action = "Deleted",
                        Timestamp = DateTime.UtcNow,
                        OldValues = JsonSerializer.Serialize(entry.Entity),
                        Changes = "Entity deleted"
                    });
                }
            }

            // Add audit logs to context
            if (auditLogs.Any())
            {
                context.Set<AuditLog>().AddRange(auditLogs);
            }
        }

        private int GetEntityId(Microsoft.EntityFrameworkCore.ChangeTracking.EntityEntry entry)
        {
            var key = entry.Metadata.FindPrimaryKey();
            if (key != null && key.Properties.Count == 1)
            {
                var property = key.Properties[0];
                var value = entry.Property(property.Name).CurrentValue;
                return value != null ? Convert.ToInt32(value) : 0;
            }
            return 0;
        }
    }
}
