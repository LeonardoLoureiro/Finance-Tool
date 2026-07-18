# Bug Report Log

---

# Bug #001: CSV Import - Wrong Column Data Mapping

## Identification

| Field | Value |
|-------|-------|
| **Bug ID** | IMPORT-001 |
| **Date Found** | 18/07/26 |
| **Category** | Data Import / Column Mapping |
| **Severity** | **CRITICAL** |
| **Status** | ✅ RESOLVED |

---

## Description

### What happened

When importing CSV data with user-selected column mappings, data was being assigned to the wrong database fields. The system used the column where the user made the selection instead of finding the column that actually contained the requested data.

### Example

**CSV**

| Date | Payee | Amount |
|------|--------|--------|
| 2026-06-15 | Coffee Shop | -4.50 |

**User Mapping**

| CSV Column | Database Field |
|------------|----------------|
| Date | amount |
| Amount | date |

**Expected**

```json
{
  "amount": "-4.50",
  "date": "2026-06-15"
}
```

**Actual**

```json
{
  "amount": "2026-06-15",
  "date": "-4.50"
}
```

---

## Steps to Reproduce

1. Upload a CSV with columns:
   - Date
   - Payee
   - Amount
2. Map **Column 0** → `amount`
3. Map **Column 2** → `date`
4. Submit the import.
5. Observe that the **amount** and **date** fields are swapped.

---

## Root Cause

The import logic used the selected column index instead of locating the column that matched the selected field name.

### Buggy Code

```ts
const sourceColumnIndex = Number(key.replace("column_", ""));
const sourceHeader = originalHeaders[sourceColumnIndex];
mappedRow[value] = row[sourceHeader];

// If user selects "amount" on column 0,
// the Date value is stored in the amount field.
```

### Why it failed

1. User selected **amount** on **Column 0**.
2. Code used `originalHeaders[0]`.
3. `originalHeaders[0]` was `"Date"`.
4. The Date value was written into the **amount** field.

---

## Solution

Instead of using the selected column position, search for the column whose header matches the selected field.

### Fixed Code

```ts
const sourceColumnIndex = originalHeaders.findIndex(
  (header) => header.toLowerCase() === value.toLowerCase()
);

if (sourceColumnIndex === -1) return;

const sourceHeader = originalHeaders[sourceColumnIndex];
mappedRow[value] = row[sourceHeader];
```

### How it works

1. User selects **amount**.
2. Code searches for the header named **amount**.
3. Finds it at **Column 2**.
4. Reads data from Column 2.
5. Correct value is imported.

---

## Lessons Learned

1. Understand user intent.
2. Map by field names rather than column positions.
3. Trust the user's mapping instead of assuming positional intent.
4. Display logic and submission logic may require different implementations.

---

## Prevention Checklist

- ✅  Map using field names instead of column positions.
- ✅  Test imports with columns in different orders.
- ✅  Log mapped output before submission.
- ✅  Verify both preview and submission logic.

---

## Related Issues

- Date range filter defaults to 30 days and hides older transactions.
- Neon HTTP driver does not support transactions.

---

## Status History

| Date | Status | Notes |
|------|--------|-------|
| 18/07/26 | Found | Bug discovered |
| 18/07/26 | Investigating | Root cause identified |
| 18/07/26 | Fixed | Solution implemented |

---



# Blank Template (Copy for Future Bugs)

## Identification

| Field | Value |
|-------|-------|
| **Bug ID** | `[CATEGORY-###]` |
| **Date Found** | `[Date]` |
| **Category** | `[Category]` |
| **Severity** | `[CRITICAL / HIGH / MEDIUM / LOW]` |
| **Status** | `[OPEN / INVESTIGATING / FIXED / VERIFIED]` |

---

## Description

### What happened

> Brief description of the issue.

### Example

**Input**

```text
[Input example]
```

**Expected**

```text
[Expected result]
```

**Actual**

```text
[Actual result]
```

---

## Steps to Reproduce

1. Step one
2. Step two
3. Step three

---

## Root Cause

Describe why the issue occurred.

### Buggy Code

```ts
// Problematic code
```

### Why it failed

- Explanation
- Explanation
- Explanation

---

## Solution

Describe how the issue was fixed.

### Fixed Code

```ts
// Fixed implementation
```

### How it works

1. Step one
2. Step two
3. Step three

---

## Lessons Learned

1. Lesson one
2. Lesson two
3. Lesson three

---

## Prevention Checklist

- [ ] Check item 1
- [ ] Check item 2
- [ ] Check item 3

---

## Related Issues

- Related issue 1
- Related issue 2

---

## Status History

| Date | Status | Notes |
|------|--------|-------|
| [Date] | [Status] | [Note] |
| [Date] | [Status] | [Note] |