# EventHub Backend — ENDPOINTS

Bu dosya her endpoint'i kısaca listeler: ne yaptığı, kim erişebilir, örnek istek/görünen yanıt.

NOT: Tüm endpoint'ler `http://localhost:3000` base path'inde çalışır.

---

## Auth

- POST `/auth/register` — Kayıt
  - Auth: none
  - Role: oluşturulan kullanıcı `STUDENT`
  - Body example:
    ```json
    { "email": "user@example.com", "password": "secret123", "name": "Alice" }
    ```
  - Response (201):
    ```json
    { "id": 10, "email": "user@example.com", "role": "STUDENT", "createdAt": "2025-12-14T..." }
    ```

- POST `/auth/login` — Giriş
  - Auth: none
  - Body example:
    ```json
    { "email": "admin@eventhub.local", "password": "Admin123!" }
    ```
  - Response (200):
    ```json
    { "access_token": "<JWT_TOKEN>" }
    ```

- GET `/auth/me` — Me
  - Auth: Bearer
  - Role: any authenticated
  - Response (200): user bilgisi (id, email, role, createdAt)

---

## Users

- GET `/users` — Liste (ADMIN)
  - Auth: Bearer
  - Role: ADMIN
  - Query: `page` (opsiyonel)
  - Response (200): `[ { id, email, role, createdAt }, ... ]`

- GET `/users/:id` — Tek kullanıcı (ADMIN)
  - Auth: Bearer
  - Role: ADMIN

- PATCH `/users/:id/role` — Rol güncelle (ADMIN)
  - Auth: Bearer
  - Role: ADMIN
  - Body example:
    ```json
    { "role": "ADMIN" }
    ```
  - Response (200): updated user (no passwordHash)

---

## Venues

- POST `/venues` — Create (ADMIN)
  - Auth: Bearer
  - Role: ADMIN
  - Body example:
    ```json
    { "name":"Main Hall","address":"123 Event St","capacity":200 }
    ```

- GET `/venues` — List (authenticated)
  - Auth: Bearer
  - Role: ADMIN or STUDENT

- GET `/venues/:id` — Get

- PATCH `/venues/:id` — Update (ADMIN)

- DELETE `/venues/:id` — Delete (ADMIN)
  - Fails 400 if events exist for venue.

---

## Categories

- POST `/categories` — Create (ADMIN)
  - Body example:
    ```json
    { "name": "Workshop" }
    ```
  - 409 Conflict if name already exists.

- GET `/categories` — List (authenticated)

- GET `/categories/:id` — Get

- PATCH `/categories/:id` — Update (ADMIN)

- DELETE `/categories/:id` — Delete (ADMIN)
  - Fails 400 if events reference the category.

---

## Events

- POST `/events` — Create (ADMIN)
  - Auth: Bearer ADMIN
  - Body example:
    ```json
    {
      "title":"Talk A",
      "description":"About X",
      "startAt":"2026-01-10T10:00:00.000Z",
      "endAt":"2026-01-10T12:00:00.000Z",
      "capacity":100,
      "venueId":1,
      "categoryId":1
    }
    ```

- GET `/events` — List (authenticated)
  - Query filters: `q`, `categoryId`, `venueId`, `from`, `to`, `page`

- GET `/events/:id` — Get (authenticated)
  - Response includes `venue` and `category` nested objects.

- PATCH `/events/:id` — Update (ADMIN)
- DELETE `/events/:id` — Delete (ADMIN)

---

## Registrations

Student actions:
- POST `/events/:eventId/register` — register current user
  - 409 Conflict if already registered
  - 400 Bad Request if event capacity reached

- DELETE `/events/:eventId/register` — unregister current user

- GET `/me/registrations` — list my registrations (includes event details)

Admin actions:
- GET `/events/:eventId/registrations` — list registrations for event (includes user info)
- DELETE `/events/:eventId/registrations/:registrationId` — remove a registration

---

Her endpoint için daha detaylı örnek istek/yanıt Swagger UI üzerinden görüntülenebilir: `http://localhost:3000/api`.
