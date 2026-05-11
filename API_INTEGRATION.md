# Account & User API Integration

This document explains the API integration for Account and User endpoints from the SmartWaste system.

## Overview

The API services provide functionality for user authentication and user management operations.

## Services

### 1. Account Service (`src/app/services/accountService.ts`)

Handles user authentication operations.

**Endpoints:**
- `POST /api/Account/Login` - Login with credentials

**Usage:**

```typescript
import { accountService } from './services/accountService';

// Login example
const response = await accountService.login({
  name: "username@email.com",
  password: "SecurePass123!",
  role: "user" // optional
});

// Returns:
// {
//   token: "jwt_token_here",
//   user: {
//     userId: 1,
//     email: "username@email.com",
//     fullName: "User Name",
//     role: "user"
//   }
// }
```

### 2. User Service (`src/app/services/userService.ts`)

Handles all user-related operations.

**Endpoints:**

#### Get All Users
```typescript
const users = await userService.getAllUsers();
// GET /api/User
```

#### Get User by ID
```typescript
const user = await userService.getUserById(1);
// GET /api/User/{id}
```

#### Get User by Email
```typescript
const user = await userService.getUserByEmail("user@example.com");
// GET /api/User/by-email/{email}
```

#### Get All Users as DTO
```typescript
const users = await userService.getAllUsersAsDto();
// GET /api/User/GetallbyDto
```

#### Create User (with FormData for file uploads)
```typescript
const formData = {
  FullName: "John Doe",
  Email: "john@example.com",
  Password: "SecurePass123!",
  Address: "123 Main Street, Apartment 4B, Springfield, State 12345",
  ProfilePictureUrl: file // optional File object
};

const user = await userService.createUser(formData);
// POST /api/User (multipart/form-data)
```

#### Update User
```typescript
const updatedUser = await userService.updateUser({
  userId: 1,
  fullName: "Jane Doe",
  email: "jane@example.com",
  address: "456 Oak Avenue, Springfield, State 12345",
  status: "active",
  walletPoints: 150
});
// PUT /api/User
```

#### Delete User
```typescript
await userService.deleteUser(1);
// DELETE /api/User/{id}
```

## Components

### 1. LoginForm (`src/app/components/LoginForm.tsx`)

Provides a complete login form with validation.

**Props:**
- `onSuccess?: (response: LoginResponse) => void` - Callback when login succeeds
- `onError?: (error: string) => void` - Callback when login fails

**Features:**
- Email/username input
- Password input
- Role selection (optional)
- Form validation
- Error and success messages
- Loading states

**Usage:**

```typescript
import { LoginForm } from './components/LoginForm';

<LoginForm
  onSuccess={(response) => {
    console.log("User logged in:", response);
    localStorage.setItem('authToken', response.token);
  }}
  onError={(error) => console.error(error)}
/>
```

### 2. UserForm (`src/app/components/UserForm.tsx`)

Provides a form for creating or editing users.

**Props:**
- `userId?: number` - User ID for edit mode
- `mode?: "create" | "edit"` - Form mode (default: "create")
- `onSuccess?: (data: UserData) => void` - Callback on success
- `onError?: (error: string) => void` - Callback on error

**Features:**
- Full name input with validation (letters only, 5-50 chars)
- Email input with validation
- Password input with strength requirements (8+ chars, uppercase, lowercase, digit, special char)
- Address input with minimum 30 characters
- Profile picture upload with preview
- Form-level validation
- Loading states
- Auto-loads user data in edit mode

**Usage:**

```typescript
import { UserForm } from './components/UserForm';

// Create mode
<UserForm
  mode="create"
  onSuccess={(user) => console.log("User created:", user)}
/>

// Edit mode
<UserForm
  userId={1}
  mode="edit"
  onSuccess={(user) => console.log("User updated:", user)}
/>
```

### 3. UsersList (`src/app/components/UsersList.tsx`)

Displays all users in a table with edit/delete functionality.

**Props:**
- `onEdit?: (userId: number) => void` - Callback when edit is clicked
- `onDelete?: (userId: number) => void` - Callback when delete completes

**Features:**
- Displays user table with all details
- Profile picture preview
- Status badge (active/inactive)
- Edit and Delete buttons
- Refresh functionality
- Loading states
- Delete confirmation

**Usage:**

```typescript
import { UsersList } from './components/UsersList';

<UsersList
  onEdit={(userId) => console.log("Edit user:", userId)}
  onDelete={(userId) => console.log("User deleted:", userId)}
/>
```

### 4. AccountPage (`src/app/pages/AccountPage.tsx`)

Complete account management page with all components integrated.

**Features:**
- Tabbed interface:
  - Login tab
  - Register tab
  - Edit Profile tab
  - All Users tab
- State management for tabs
- Automatic refresh of user list
- Seamless navigation between tabs

**Usage:**

```typescript
import { AccountPage } from './pages/AccountPage';

// In your routes
<Route path="/account" element={<AccountPage />} />
```

## Field Validation Rules

### Login Form
- **Username/Email**: Required, any format
- **Password**: Required
- **Role**: Optional

### User Registration/Update
- **Full Name**:
  - Required
  - 5-50 characters
  - Letters and spaces only
  - Pattern: `^[a-zA-Z\s]+$`

- **Email**:
  - Required
  - Valid email format
  - Pattern: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`

- **Password** (Create only):
  - Required
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one digit
  - At least one special character (@$!%*?&)
  - Pattern: `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$`

- **Address**:
  - Required
  - Minimum 30 characters
  - Maximum 100 characters

- **Profile Picture**:
  - Optional
  - File type: Image only
  - Sent as FormData in multipart/form-data request

## Error Handling

All services include error handling:

```typescript
try {
  const user = await userService.getUserById(1);
} catch (error) {
  if (error instanceof Error) {
    console.error("Error:", error.message);
  }
}
```

## Token Management

The LoginForm component automatically stores the JWT token:

```typescript
// Stored in localStorage as:
localStorage.setItem('authToken', token);
localStorage.setItem('user', JSON.stringify(user));
```

To use the token in subsequent requests:

```typescript
const token = localStorage.getItem('authToken');
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};
```

## Example Integration

Complete example page using all components:

```typescript
import React from 'react';
import { AccountPage } from './pages/AccountPage';

function App() {
  return (
    <div>
      <AccountPage />
    </div>
  );
}

export default App;
```

## API Base URL

The API base URL is set to: `https://smartwaste.runasp.net/api`

To change it, update the `API_BASE_URL` constant in the service files:

```typescript
const API_BASE_URL = "https://your-api-url/api";
```

## Best Practices

1. **Always validate input** - Forms include built-in validation
2. **Handle errors gracefully** - Use try-catch blocks
3. **Show loading states** - Provide user feedback
4. **Store tokens securely** - Use localStorage or secure cookies
5. **Implement auto-logout** - Check token expiration
6. **Refresh data** - Use refresh buttons when needed
7. **Use environment variables** - Store API URLs in `.env` files

## Troubleshooting

### Login fails with 401
- Verify credentials are correct
- Check if user account is active
- Verify API endpoint is accessible

### User creation fails
- Ensure all required fields are filled
- Verify field validation rules are met
- Check API server logs

### Profile picture not uploading
- Ensure file is a valid image
- Check file size limits
- Verify FormData is properly constructed

## Related Documentation

- API Swagger: https://smartwaste.runasp.net/swagger/index.html
- User Schema: See UserData interface
- API Responses: Check service return types
