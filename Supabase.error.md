# Supabase Error Codes & Fixes

Supabase errors come from different services like **PostgREST, Auth, Storage, Realtime, and Edge Functions**. Below is a categorized list of common errors and how to fix them.

---

## 1️⃣ PostgREST (Database) Errors

These errors occur when querying the database using `.select()`, `.insert()`, `.update()`, etc.

| **Error Code**  | **Description** |
|---------------|--------------|
| **PGRST116** | Payload too large (request exceeds size limit) |
| **PGRST103** | Invalid JSON input |
| **PGRST502** | Permission denied (unauthorized API call) |
| **PGRST518** | Resource not found (e.g., requesting a non-existent row) |
| **PGRST201** | Insert failed (e.g., constraint violations) |

**✅ Fix:** Check permissions, payload size, or correct request structure.

---

## 2️⃣ Auth Errors

These occur when using Supabase Auth (`signInWithPassword()`, `signUp()`, etc.).

| **Error Code** | **Description** |
|--------------|--------------|
| **AuthInvalidCredentialsError** | Wrong email/password |
| **AuthUserNotFound** | User does not exist |
| **AuthEmailAlreadyExists** | Email is already registered |
| **AuthSessionMissing** | No active session found |
| **AuthInvalidRefreshToken** | Expired or invalid refresh token |
| **AuthRateLimitExceeded** | Too many login attempts |

**✅ Fix:** Ensure correct credentials, check session state, and avoid too many requests.

---

## 3️⃣ Storage Errors

These happen when using Supabase Storage (`upload()`, `remove()`, etc.).

| **Error Code** | **Description** |
|--------------|--------------|
| **StorageBucketNotFound** | The specified storage bucket does not exist |
| **StorageFileNotFound** | Requested file does not exist |
| **StorageUnauthorized** | User does not have permission to access the file |
| **StorageFileTooLarge** | File exceeds the max upload size |
| **StorageInvalidPath** | The file path is invalid |

**✅ Fix:** Ensure correct bucket, file path, and user permissions.

---

## 4️⃣ Realtime Errors

These occur when using Supabase Realtime (`supabase.channel().on()`).

| **Error Code** | **Description** |
|--------------|--------------|
| **RealtimeConnectionError** | Cannot establish a WebSocket connection |
| **RealtimePermissionDenied** | User does not have permission to listen to a channel |
| **RealtimeTimeout** | Subscription request timed out |

**✅ Fix:** Check WebSocket connection, database permissions, and ensure the Realtime extension is enabled.

---

## 5️⃣ Edge Function Errors

These happen when calling Supabase Edge Functions (`supabase.functions.invoke()`).

| **Error Code** | **Description** |
|--------------|--------------|
| **FunctionNotFound** | The specified function does not exist |
| **FunctionExecutionError** | The function crashed or encountered an error |
| **FunctionUnauthorized** | User does not have permission to execute the function |
| **FunctionTimeout** | The function took too long to respond |

**✅ Fix:** Ensure the function exists, debug logs, and check permissions.

---

## 6️⃣ General HTTP/API Errors

These errors can appear in any Supabase request.

| **Error Code** | **Description** |
|--------------|--------------|
| **400 (Bad Request)** | The request is malformed |
| **401 (Unauthorized)** | User is not authenticated |
| **403 (Forbidden)** | User lacks permission |
| **404 (Not Found)** | Resource does not exist |
| **429 (Too Many Requests)** | Rate limit exceeded |
| **500 (Internal Server Error)** | Server-side issue |

**✅ Fix:** Check API documentation, request headers, and error messages.

