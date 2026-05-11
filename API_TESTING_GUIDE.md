/**
 * API Testing Guide
 * 
 * This file shows how to test the Account and User APIs
 * using the service functions directly.
 */

// ============================================================================
// QUICK TEST - RUN IN BROWSER CONSOLE
// ============================================================================

/*
// Test Login:
import { accountService } from './src/app/services/accountService';

const loginResult = await accountService.login({
  name: "test@example.com",
  password: "TestPassword123!",
  role: "user"
});

console.log('Login result:', loginResult);

// Test Get All Users:
import { userService } from './src/app/services/userService';

const users = await userService.getAllUsers();
console.log('All users:', users);

// Test Get User by ID:
const user = await userService.getUserById(1);
console.log('User:', user);

// Test Create User:
const newUser = await userService.createUser({
  FullName: "John Doe",
  Email: "john@example.com",
  Password: "SecurePass123!",
  Address: "123 Main Street, Springfield, IL 62701, USA"
});

console.log('Created user:', newUser);
*/

// ============================================================================
// UNIT TEST EXAMPLES (Jest/Vitest)
// ============================================================================

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { accountService } from './src/app/services/accountService';
import { userService } from './src/app/services/userService';

describe('Account Service', () => {
  describe('login', () => {
    it('should successfully login with correct credentials', async () => {
      const credentials = {
        name: 'test@example.com',
        password: 'TestPassword123!',
        role: 'user'
      };

      // Mock the fetch call
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            token: 'jwt_token_here',
            user: {
              userId: 1,
              email: 'test@example.com',
              fullName: 'Test User',
              role: 'user'
            }
          })
        })
      ) as any;

      const result = await accountService.login(credentials);

      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw error on failed login', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ message: 'Invalid credentials' })
        })
      ) as any;

      await expect(
        accountService.login({
          name: 'wrong@example.com',
          password: 'wrongpass'
        })
      ).rejects.toThrow();
    });
  });
});

describe('User Service', () => {
  describe('getAllUsers', () => {
    it('should fetch all users', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            {
              userId: 1,
              fullName: 'User 1',
              email: 'user1@example.com',
              address: '123 Main St',
              status: 'active',
              walletPoints: 100
            },
            {
              userId: 2,
              fullName: 'User 2',
              email: 'user2@example.com',
              address: '456 Oak Ave',
              status: 'active',
              walletPoints: 200
            }
          ])
        })
      ) as any;

      const users = await userService.getAllUsers();

      expect(users).toHaveLength(2);
      expect(users[0].fullName).toBe('User 1');
    });
  });

  describe('getUserById', () => {
    it('should fetch user by ID', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            userId: 1,
            fullName: 'User 1',
            email: 'user1@example.com',
            address: '123 Main St',
            status: 'active',
            walletPoints: 100
          })
        })
      ) as any;

      const user = await userService.getUserById(1);

      expect(user.userId).toBe(1);
      expect(user.fullName).toBe('User 1');
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            userId: 3,
            fullName: 'New User',
            email: 'newuser@example.com',
            address: '789 Pine St, Springfield, IL 62701, USA',
            status: 'active',
            walletPoints: 0
          })
        })
      ) as any;

      const newUser = await userService.createUser({
        FullName: 'New User',
        Email: 'newuser@example.com',
        Password: 'SecurePass123!',
        Address: '789 Pine St, Springfield, IL 62701, USA'
      });

      expect(newUser.userId).toBe(3);
      expect(newUser.fullName).toBe('New User');
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({})
        })
      ) as any;

      await expect(userService.deleteUser(1)).resolves.not.toThrow();
    });
  });
});

// ============================================================================
// INTEGRATION TEST EXAMPLES
// ============================================================================

describe('Full User Flow', () => {
  it('should create user, get user, and update user', async () => {
    // Mock all fetch calls
    global.fetch = vi.fn();

    // 1. Create user
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        userId: 1,
        fullName: 'Integration Test User',
        email: 'integration@test.com',
        address: '123 Test Street, Springfield, IL 62701, USA',
        status: 'active',
        walletPoints: 0
      })
    });

    const createdUser = await userService.createUser({
      FullName: 'Integration Test User',
      Email: 'integration@test.com',
      Password: 'TestPass123!',
      Address: '123 Test Street, Springfield, IL 62701, USA'
    });

    expect(createdUser.userId).toBe(1);

    // 2. Get user
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(createdUser)
    });

    const fetchedUser = await userService.getUserById(1);
    expect(fetchedUser.email).toBe('integration@test.com');

    // 3. Update user
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        ...createdUser,
        walletPoints: 50
      })
    });

    const updatedUser = await userService.updateUser({
      userId: 1,
      fullName: 'Integration Test User',
      email: 'integration@test.com',
      address: '123 Test Street, Springfield, IL 62701, USA',
      walletPoints: 50
    });

    expect(updatedUser.walletPoints).toBe(50);
  });
});

// ============================================================================
// E2E TEST EXAMPLES (Playwright/Cypress)
// ============================================================================

/*
// Playwright example:

import { test, expect } from '@playwright/test';

test.describe('Account Management Flow', () => {
  test('should login, navigate to profile, and update profile', async ({ page }) => {
    // Navigate to login page
    await page.goto('http://localhost:5173/login');

    // Fill login form
    await page.fill('input[name="name"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    
    // Submit
    await page.click('button[type="submit"]');

    // Verify redirect
    await page.waitForURL('**/dashboard');
    expect(page.url()).toContain('/dashboard');
  });

  test('should create new user account', async ({ page }) => {
    await page.goto('http://localhost:5173/register');

    // Fill registration form
    await page.fill('input[name="FullName"]', 'Jane Doe');
    await page.fill('input[name="Email"]', 'jane@example.com');
    await page.fill('input[name="Password"]', 'SecurePass123!');
    await page.fill('input[name="Address"]', '123 Main Street, Apartment 4B, Springfield, State 12345');

    // Submit
    await page.click('button[type="submit"]');

    // Verify success
    await page.waitForSelector('[role="alert"]');
    const alert = await page.locator('[role="alert"]');
    await expect(alert).toContainText('successfully');
  });

  test('should view and delete user from list', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:5173/login');
    await page.fill('input[name="name"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'AdminPass123!');
    await page.click('button[type="submit"]');

    // Navigate to users list
    await page.goto('http://localhost:5173/users');

    // Find and click delete button for first user
    await page.click('button:has-text("Delete")');
    
    // Confirm deletion
    page.on('dialog', dialog => dialog.accept());

    // Verify user is removed from list
    const rows = await page.locator('tbody tr');
    expect(rows).toHaveCount(0);
  });
});
*/

// ============================================================================
// MANUAL TEST CHECKLIST
// ============================================================================

/*
MANUAL TESTING CHECKLIST:

Login Form:
☐ Login with valid credentials
☐ Login with invalid credentials (should show error)
☐ Required fields validation
☐ Password field masks input
☐ Success redirects to dashboard
☐ Token is stored in localStorage

Registration Form:
☐ Create account with valid data
☐ Validation: Full name (5-50 chars, letters only)
☐ Validation: Email format
☐ Validation: Password strength (8+ chars, upper, lower, digit, special)
☐ Validation: Address (30+ chars)
☐ Profile picture upload and preview
☐ Success message displays
☐ Form clears after success
☐ User can login after registration

Users List:
☐ Displays all users in table
☐ Profile pictures display correctly
☐ Status badge shows correct color
☐ Edit button navigates to edit form
☐ Delete button shows confirmation
☐ Delete removes user from list
☐ Refresh button reloads list
☐ Empty state shows when no users

Edit Profile:
☐ Loads user data correctly
☐ All fields are pre-populated
☐ Can update each field
☐ Profile picture can be changed
☐ Success message displays
☐ Changes persist after reload

API Integration:
☐ Requests include correct headers
☐ FormData properly handles file uploads
☐ Errors are caught and displayed
☐ Loading states work correctly
☐ Network errors are handled gracefully
*/

// ============================================================================
// DEBUGGING HELPERS
// ============================================================================

/**
 * Enable API request logging
 */
export function enableAPILogging() {
  const originalFetch = window.fetch;
  
  window.fetch = async (...args: any[]) => {
    console.log('API Request:', args[0], args[1]);
    
    try {
      const response = await originalFetch(...args);
      const clone = response.clone();
      
      try {
        const data = await clone.json();
        console.log('API Response:', data);
      } catch {
        console.log('API Response (non-JSON):', response);
      }
      
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };
}

/**
 * Test form validation
 */
export function testValidation() {
  const validCases = [
    {
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'SecurePass123!',
      address: '123 Main Street, Apartment 4B, Springfield, State 12345'
    }
  ];

  const invalidCases = [
    {
      fullName: 'John123', // Numbers not allowed
      email: 'john@example.com',
      password: 'SecurePass123!',
      address: '123 Main Street, Apartment 4B, Springfield, State 12345'
    },
    {
      fullName: 'John Doe',
      email: 'invalid-email', // Invalid email
      password: 'SecurePass123!',
      address: '123 Main Street, Apartment 4B, Springfield, State 12345'
    },
    {
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'weak', // Weak password
      address: '123 Main Street, Apartment 4B, Springfield, State 12345'
    },
    {
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'SecurePass123!',
      address: 'Short' // Address too short
    }
  ];

  console.log('Valid cases:', validCases);
  console.log('Invalid cases:', invalidCases);
}

// ============================================================================
// API MOCK SERVER FOR DEVELOPMENT
// ============================================================================

/*
// Mock Service Worker (MSW) setup example:

import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

export const server = setupServer(
  // Login endpoint
  http.post('https://smartwaste.runasp.net/api/Account/Login', async ({ request }) => {
    const body = await request.json();
    
    if (body.name === 'test@example.com' && body.password === 'TestPassword123!') {
      return HttpResponse.json({
        token: 'mock_jwt_token',
        user: {
          userId: 1,
          email: body.name,
          fullName: 'Test User',
          role: body.role || 'user'
        }
      });
    }
    
    return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }),

  // Get all users
  http.get('https://smartwaste.runasp.net/api/User', () => {
    return HttpResponse.json([
      {
        userId: 1,
        fullName: 'User 1',
        email: 'user1@example.com',
        address: '123 Main St',
        status: 'active',
        walletPoints: 100
      }
    ]);
  }),

  // Create user
  http.post('https://smartwaste.runasp.net/api/User', async ({ request }) => {
    const formData = await request.formData();
    
    return HttpResponse.json({
      userId: Date.now(),
      fullName: formData.get('FullName'),
      email: formData.get('Email'),
      address: formData.get('Address'),
      status: 'active',
      walletPoints: 0
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
*/
