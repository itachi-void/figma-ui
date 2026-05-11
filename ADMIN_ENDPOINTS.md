# SmartWaste Admin Endpoints - Complete Reference

## Overview
All administrative endpoints for managing recyclers, users, pickup requests, support tickets, waste categories, and hub staff.

**Base URL:** `https://smartwaste.runasp.net/api/admin`

---

## 📊 Analytics & Statistics Endpoints

### 1. Get Total Recyclers
```
GET /api/admin/total-recyclers
```
- **Description:** Gets the total number of recyclers
- **Auth:** Admin privileges required
- **Returns:** `number` (int32)
- **Response:** `{ value: 5 }`

### 2. Get Total Active Recyclers
```
GET /api/admin/total-recycling-active
```
- **Description:** Gets the total number of active recyclers
- **Auth:** Admin privileges required
- **Returns:** `number` (int32)
- **Response:** `{ value: 3 }`

### 3. Get Total Pickup Requests
```
GET /api/admin/total-pickup-requests
```
- **Description:** Gets the total number of pickup requests
- **Auth:** Admin privileges required
- **Returns:** `number` (int32)
- **Response:** `{ value: 150 }`

### 4. Get Total Earnings
```
GET /api/admin/Total-Earing
```
- **Description:** Gets the total earnings from pickup requests
- **Auth:** Admin privileges required
- **Returns:** `number` (double)
- **Response:** `{ value: 25500.50 }`

### 5. Get Total Users
```
GET /api/admin/total-users
```
- **Description:** Gets the total number of users
- **Auth:** Admin privileges required
- **Returns:** `number` (int32)
- **Response:** `{ value: 500 }`

### 6. Get Total Active Users
```
GET /api/admin/total-active-users
```
- **Description:** Gets the total number of active users
- **Auth:** Admin privileges required
- **Returns:** `number` (int32)
- **Response:** `{ value: 450 }`

### 7. Get Total Requesting Items
```
GET /api/admin/total-requesting-items
```
- **Description:** Gets the total number of requesting items
- **Auth:** Admin privileges required
- **Returns:** `number` (int32)
- **Response:** `{ value: 1200 }`

### 8. Get Total Wallet Points
```
GET /api/admin/total-wallet-points
```
- **Description:** Gets the total wallet points across all users
- **Auth:** Admin privileges required
- **Returns:** `number` (double)
- **Response:** `{ value: 150000.00 }`

---

## 👥 Recyclers Management Endpoints

### 9. Get Recycler Details
```
GET /api/admin/recycler-details
```
- **Description:** Gets detailed information about recyclers
- **Auth:** Admin privileges required
- **Returns:** Array of recycler objects
- **Fields:**
  - recyclerId: integer
  - fullName: string
  - phone: string
  - vehicleInfo: string
  - status: string
  - rating: number (0-5)
  - totalTripsCompleted: integer

**Example Response:**
```json
[
  {
    "recyclerId": 1,
    "fullName": "Ahmed Hassan",
    "phone": "01012345678",
    "vehicleInfo": "Toyota Hiace - Yellow",
    "status": "active",
    "rating": 4.5,
    "totalTripsCompleted": 120
  }
]
```

### 10. Get Recyclers with Total Trips
```
GET /api/admin/recycler-with-total-trip
```
- **Description:** Gets recyclers sorted by rating with total trips
- **Auth:** Admin privileges required
- **Returns:** Array of recycler objects
- **Fields:**
  - recyclerID: integer
  - fullName: string
  - totalTrips: integer
  - rating: number

**Example Response:**
```json
[
  {
    "recyclerID": 1,
    "fullName": "Ahmed Hassan",
    "totalTrips": 150,
    "rating": 4.8
  }
]
```

### 11. Create Recycler
```
POST /api/admin/create-recycler
```
- **Description:** Creates a new recycler
- **Auth:** Admin privileges required
- **Content-Type:** application/json
- **Request Body:**
  ```json
  {
    "fullName": "Ahmed Hassan",
    "phone": "01012345678",
    "passwordHash": "SecurePass123!"
  }
  ```
- **Validation:**
  - fullName: 5-50 characters, letters only
  - phone: Pattern `^01[0125]\d{8}$` (Egyptian phone)
  - passwordHash: Min 8 chars, uppercase, lowercase, digit, special char
- **Returns:** Created recycler object

### 12. Update Recycler Status
```
PUT /api/admin/update-recycler-status
```
- **Description:** Updates the status of a recycler
- **Auth:** Admin privileges required
- **Query Parameters:**
  - `recyclerId` (integer) - The recycler ID
  - `newStatus` (string) - New status (e.g., "active", "inactive", "suspended")
- **Example:** `/api/admin/update-recycler-status?recyclerId=1&newStatus=inactive`
- **Returns:** Updated recycler object

### 13. Delete Recycler
```
DELETE /api/admin/delete-recycler
```
- **Description:** Deletes a recycler
- **Auth:** Admin privileges required
- **Query Parameters:**
  - `recyclerId` (integer) - The recycler ID to delete
- **Example:** `/api/admin/delete-recycler?recyclerId=1`
- **Returns:** Success message

---

## 👤 Users Management Endpoints

### 14. Get Users by Filter
```
GET /api/admin/users-by-filter
```
- **Description:** Gets users based on filter criteria
- **Auth:** Admin privileges required
- **Query Parameters:**
  - `KeyofFilter` (string) - Filter key (e.g., "name", "email", "phone")
  - `status` (string) - Filter status (e.g., "active", "inactive")
- **Example:** `/api/admin/users-by-filter?KeyofFilter=name&status=active`
- **Returns:** Array of user filter DTO objects
- **Fields:**
  - userId: integer
  - name: string
  - email: string
  - phoneNumber: string
  - address: string
  - isActive: string
  - walletPoints: number
  - totalRequests: integer

**Example Response:**
```json
[
  {
    "userId": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "01012345678",
    "address": "123 Main St, Cairo, Egypt",
    "isActive": "active",
    "walletPoints": 500.00,
    "totalRequests": 25
  }
]
```

### 15. Create User
```
POST /api/admin/create-user
```
- **Description:** Creates a new user
- **Auth:** Admin privileges required
- **Content-Type:** multipart/form-data
- **Request Fields:**
  - `FullName` (string, required) - 5-50 chars, letters/spaces only
  - `Email` (string, required) - Valid email format
  - `Password` (string, required) - Min 8 chars with uppercase, lowercase, digit, special char
  - `Address` (string, required) - Min 30 characters
  - `ProfilePictureUrl` (file, optional) - Image file
- **Returns:** Created user object
- **Example Request:**
  ```
  POST /api/admin/create-user
  Content-Type: multipart/form-data

  FullName: John Doe
  Email: john@example.com
  Password: SecurePass123!
  Address: 123 Main Street, Apartment 4B, Springfield, State 12345
  ProfilePictureUrl: [image file]
  ```

### 16. Delete User
```
DELETE /api/admin/delete-user
```
- **Description:** Deletes a user
- **Auth:** Admin privileges required
- **Query Parameters:**
  - `userId` (integer) - The user ID to delete
- **Example:** `/api/admin/delete-user?userId=1`
- **Returns:** Success message

---

## 🏭 Hub Staff Management Endpoints

### 17. Create Hub Staff
```
POST /api/admin/create-hub-staff
```
- **Description:** Creates a new hub staff member
- **Auth:** Admin privileges required
- **Content-Type:** application/json
- **Request Body:**
  ```json
  {
    "fullName": "Ali Mohammed",
    "passwordHash": "SecurePass123!"
  }
  ```
- **Validation:**
  - fullName: 5-30 characters, letters/spaces only
  - passwordHash: Min 8 chars, uppercase, lowercase, digit, special char
- **Returns:** Created hub staff object

### 18. Delete Hub Staff
```
DELETE /api/admin/delete-hub-staff
```
- **Description:** Deletes a hub staff member
- **Auth:** Admin privileges required
- **Query Parameters:**
  - `hubStaffId` (integer) - The hub staff ID to delete
- **Example:** `/api/admin/delete-hub-staff?hubStaffId=1`
- **Returns:** Success message

---

## 🏷️ Waste Category Management Endpoints

### 19. Create Waste Category
```
POST /api/admin/create-waste-category
```
- **Description:** Creates a new waste category
- **Auth:** Admin privileges required
- **Content-Type:** application/json
- **Request Body:**
  ```json
  {
    "categoryId": 0,
    "categoryName": "Plastic Bottles",
    "pointsPerUnit": 10.5,
    "unitType": "kg"
  }
  ```
- **Validation:**
  - categoryId: integer (0 for new)
  - categoryName: 0-100 characters
  - pointsPerUnit: positive number
  - unitType: min 1 character
- **Returns:** Created category object

**Example Response:**
```json
{
  "categoryId": 5,
  "categoryName": "Plastic Bottles",
  "pointsPerUnit": 10.5,
  "unitType": "kg"
}
```

### 20. Update Waste Category
```
PUT /api/admin/update-waste-category
```
- **Description:** Updates an existing waste category
- **Auth:** Admin privileges required
- **Content-Type:** application/json
- **Request Body:**
  ```json
  {
    "categoryId": 5,
    "categoryName": "Plastic Bottles (Updated)",
    "pointsPerUnit": 12.0,
    "unitType": "kg"
  }
  ```
- **Returns:** Updated category object

### 21. Delete Waste Category
```
DELETE /api/admin/delete-waste-category
```
- **Description:** Deletes a waste category
- **Auth:** Admin privileges required
- **Query Parameters:**
  - `wasteCategoryId` (integer) - The category ID to delete
- **Example:** `/api/admin/delete-waste-category?wasteCategoryId=5`
- **Returns:** Success message

---

## 🎫 Support Tickets Management Endpoints

### 22. Show Support Tickets
```
GET /api/admin/Show-Support-Ticket
```
- **Description:** Gets support tickets based on status and search criteria
- **Auth:** Admin privileges required
- **Query Parameters:**
  - `status` (string, optional) - Filter by status (e.g., "open", "closed", "pending")
  - `search` (string, optional) - Search by subject or citizen name
- **Example:** `/api/admin/Show-Support-Ticket?status=open&search=payment`
- **Returns:** Array of ticket objects
- **Fields:**
  - ticketID: integer
  - subject: string
  - description: string
  - status: string
  - priority: string (low, medium, high, urgent)
  - createdAt: datetime
  - citizenName: string
  - driverName: string
  - rating: integer (0-5)

**Example Response:**
```json
[
  {
    "ticketID": 1,
    "subject": "Payment Issue",
    "description": "Points not credited after pickup",
    "status": "open",
    "priority": "high",
    "createdAt": "2024-05-11T10:30:00Z",
    "citizenName": "John Doe",
    "driverName": "Ahmed Hassan",
    "rating": 4
  }
]
```

---

## 📋 Complete Admin Endpoints List

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | GET | `/api/admin/total-recyclers` | Total recyclers count |
| 2 | GET | `/api/admin/total-recycling-active` | Active recyclers count |
| 3 | GET | `/api/admin/total-pickup-requests` | Total pickup requests |
| 4 | GET | `/api/admin/Total-Earing` | Total earnings |
| 5 | GET | `/api/admin/total-users` | Total users count |
| 6 | GET | `/api/admin/total-active-users` | Active users count |
| 7 | GET | `/api/admin/total-requesting-items` | Total items requested |
| 8 | GET | `/api/admin/total-wallet-points` | Total wallet points |
| 9 | GET | `/api/admin/recycler-details` | Recycler details list |
| 10 | GET | `/api/admin/recycler-with-total-trip` | Recyclers with trip count |
| 11 | POST | `/api/admin/create-recycler` | Create new recycler |
| 12 | PUT | `/api/admin/update-recycler-status` | Update recycler status |
| 13 | DELETE | `/api/admin/delete-recycler` | Delete recycler |
| 14 | GET | `/api/admin/users-by-filter` | Get filtered users |
| 15 | POST | `/api/admin/create-user` | Create new user |
| 16 | DELETE | `/api/admin/delete-user` | Delete user |
| 17 | POST | `/api/admin/create-hub-staff` | Create hub staff |
| 18 | DELETE | `/api/admin/delete-hub-staff` | Delete hub staff |
| 19 | POST | `/api/admin/create-waste-category` | Create waste category |
| 20 | PUT | `/api/admin/update-waste-category` | Update waste category |
| 21 | DELETE | `/api/admin/delete-waste-category` | Delete waste category |
| 22 | GET | `/api/admin/Show-Support-Ticket` | Get support tickets |

---

## 🔐 Authentication & Authorization

All admin endpoints require:
- **Admin privileges** in user role
- **JWT Token** in Authorization header: `Bearer {token}`
- Request must come from authenticated admin user

**Example Header:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📊 Response Codes

- `200 OK` - Request successful
- `400 Bad Request` - Invalid parameters
- `401 Unauthorized` - Missing or invalid token / Admin privileges required
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## 🛠️ Common Error Responses

```json
{
  "status": 401,
  "message": "Unauthorized access - admin privileges required"
}
```

```json
{
  "status": 400,
  "message": "Invalid email format"
}
```

```json
{
  "status": 404,
  "message": "Recycler not found"
}
```

---

## 📝 Usage Examples

### Get Dashboard Stats
```typescript
const stats = {
  totalRecyclers: await fetch('/api/admin/total-recyclers').then(r => r.json()),
  activeRecyclers: await fetch('/api/admin/total-recycling-active').then(r => r.json()),
  totalUsers: await fetch('/api/admin/total-users').then(r => r.json()),
  totalEarnings: await fetch('/api/admin/Total-Earing').then(r => r.json()),
};
```

### Create Recycler
```typescript
const response = await fetch('/api/admin/create-recycler', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    fullName: "Ahmed Hassan",
    phone: "01012345678",
    passwordHash: "SecurePass123!"
  })
});
```

### Filter Users
```typescript
const activeUsers = await fetch(
  '/api/admin/users-by-filter?status=active&KeyofFilter=name',
  {
    headers: { 'Authorization': `Bearer ${token}` }
  }
).then(r => r.json());
```

### Get Support Tickets
```typescript
const tickets = await fetch(
  '/api/admin/Show-Support-Ticket?status=open',
  {
    headers: { 'Authorization': `Bearer ${token}` }
  }
).then(r => r.json());
```

---

## 🚀 Integration Notes

1. **Always include Authorization header** with admin JWT token
2. **Validate input** before sending (use regex patterns from validation rules)
3. **Handle errors** gracefully with user feedback
4. **Use pagination** for large datasets (if supported)
5. **Cache dashboard stats** to reduce API calls
6. **Implement rate limiting** client-side to prevent abuse

---

## 📚 Related Documentation

- Account Endpoints: See Account API guide
- User Endpoints: See User API guide
- Full Swagger API: https://smartwaste.runasp.net/swagger/index.html
