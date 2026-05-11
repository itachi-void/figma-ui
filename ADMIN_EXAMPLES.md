/**
 * Admin API Quick Reference & Code Examples
 * 
 * This file contains practical examples of how to use all admin endpoints
 */

// ============================================================================
// IMPORT THE SERVICE
// ============================================================================

import { adminService, getDashboardStats } from './src/app/services/adminService';

// ============================================================================
// STATISTICS ENDPOINTS
// ============================================================================

/**
 * Get all dashboard statistics in one call
 */
async function loadDashboard() {
  try {
    const stats = await getDashboardStats();
    
    console.log('Dashboard Stats:', {
      totalRecyclers: stats.totalRecyclers,
      activeRecyclers: stats.activeRecyclers,
      totalUsers: stats.totalUsers,
      activeUsers: stats.activeUsers,
      totalPickupRequests: stats.totalPickupRequests,
      totalEarnings: stats.totalEarnings,
      totalWalletPoints: stats.totalWalletPoints,
    });
  } catch (error) {
    console.error('Failed to load dashboard:', error);
  }
}

/**
 * Get individual statistics
 */
async function getIndividualStats() {
  // Total recyclers count
  const totalRecyclers = await adminService.getTotalRecyclers();
  
  // Active recyclers count
  const activeRecyclers = await adminService.getTotalRecyclingActive();
  
  // Total pickup requests
  const pickupRequests = await adminService.getTotalPickupRequests();
  
  // Total earnings
  const totalEarnings = await adminService.getTotalEarning();
  
  // Total users
  const totalUsers = await adminService.getTotalUsers();
  
  // Active users
  const activeUsers = await adminService.getTotalActiveUsers();
  
  // Total requesting items
  const requestingItems = await adminService.getTotalRequestingItems();
  
  // Total wallet points
  const walletPoints = await adminService.getTotalWalletPoints();
  
  return {
    totalRecyclers,
    activeRecyclers,
    pickupRequests,
    totalEarnings,
    totalUsers,
    activeUsers,
    requestingItems,
    walletPoints,
  };
}

// ============================================================================
// RECYCLERS MANAGEMENT
// ============================================================================

/**
 * Get detailed information about all recyclers
 */
async function viewAllRecyclers() {
  try {
    const recyclers = await adminService.getRecyclerDetails();
    
    recyclers.forEach(recycler => {
      console.log(`${recycler.fullName}:
        - Phone: ${recycler.phone}
        - Vehicle: ${recycler.vehicleInfo}
        - Status: ${recycler.status}
        - Rating: ${recycler.rating}/5
        - Trips Completed: ${recycler.totalTripsCompleted}
      `);
    });
  } catch (error) {
    console.error('Failed to load recyclers:', error);
  }
}

/**
 * Get recyclers sorted by rating with trip count
 */
async function getTopRecyclers() {
  try {
    const recyclers = await adminService.getRecyclerWithTotalTrip();
    
    recyclers
      .sort((a, b) => b.rating - a.rating)
      .forEach(recycler => {
        console.log(`${recycler.fullName} - ⭐${recycler.rating} (${recycler.totalTrips} trips)`);
      });
  } catch (error) {
    console.error('Failed to load recyclers:', error);
  }
}

/**
 * Create a new recycler
 */
async function addNewRecycler() {
  try {
    const newRecycler = await adminService.createRecycler({
      fullName: "Ahmed Hassan",
      phone: "01012345678",
      passwordHash: "SecurePass123!"
    });
    
    console.log('Recycler created:', newRecycler);
  } catch (error) {
    console.error('Failed to create recycler:', error);
  }
}

/**
 * Update recycler status
 */
async function updateRecyclerStatus() {
  try {
    const updated = await adminService.updateRecyclerStatus(1, "inactive");
    console.log('Recycler status updated:', updated);
  } catch (error) {
    console.error('Failed to update status:', error);
  }
}

/**
 * Delete a recycler
 */
async function removeRecycler() {
  try {
    await adminService.deleteRecycler(1);
    console.log('Recycler deleted successfully');
  } catch (error) {
    console.error('Failed to delete recycler:', error);
  }
}

// ============================================================================
// USERS MANAGEMENT
// ============================================================================

/**
 * Get all users with optional filters
 */
async function viewAllUsers() {
  try {
    // Get all users
    const allUsers = await adminService.getUsersByFilter();
    
    // Or with filters
    const activeUsers = await adminService.getUsersByFilter("status", "active");
    
    allUsers.forEach(user => {
      console.log(`${user.name}:
        - Email: ${user.email}
        - Status: ${user.isActive}
        - Wallet Points: ${user.walletPoints}
        - Total Requests: ${user.totalRequests}
      `);
    });
  } catch (error) {
    console.error('Failed to load users:', error);
  }
}

/**
 * Create a new user as admin
 */
async function createNewUserAsAdmin() {
  try {
    const newUser = await adminService.createUser({
      FullName: "John Doe",
      Email: "john@example.com",
      Password: "SecurePass123!",
      Address: "123 Main Street, Apartment 4B, Springfield, State 12345",
      // ProfilePictureUrl: imageFile // optional
    });
    
    console.log('User created:', newUser);
  } catch (error) {
    console.error('Failed to create user:', error);
  }
}

/**
 * Delete a user
 */
async function removeUser() {
  try {
    await adminService.deleteUser(1);
    console.log('User deleted successfully');
  } catch (error) {
    console.error('Failed to delete user:', error);
  }
}

// ============================================================================
// HUB STAFF MANAGEMENT
// ============================================================================

/**
 * Create a new hub staff member
 */
async function addHubStaff() {
  try {
    const newStaff = await adminService.createHubStaff({
      fullName: "Ali Mohammed",
      passwordHash: "SecurePass123!"
    });
    
    console.log('Hub staff created:', newStaff);
  } catch (error) {
    console.error('Failed to create hub staff:', error);
  }
}

/**
 * Delete hub staff member
 */
async function removeHubStaff() {
  try {
    await adminService.deleteHubStaff(1);
    console.log('Hub staff deleted successfully');
  } catch (error) {
    console.error('Failed to delete hub staff:', error);
  }
}

// ============================================================================
// WASTE CATEGORY MANAGEMENT
// ============================================================================

/**
 * Create a new waste category
 */
async function createWasteCategory() {
  try {
    const newCategory = await adminService.createWasteCategory({
      categoryId: 0, // 0 for new
      categoryName: "Plastic Bottles",
      pointsPerUnit: 10.5,
      unitType: "kg"
    });
    
    console.log('Category created:', newCategory);
  } catch (error) {
    console.error('Failed to create category:', error);
  }
}

/**
 * Update an existing waste category
 */
async function updateWasteCategory() {
  try {
    const updated = await adminService.updateWasteCategory({
      categoryId: 1,
      categoryName: "Plastic Bottles (Updated)",
      pointsPerUnit: 12.0,
      unitType: "kg"
    });
    
    console.log('Category updated:', updated);
  } catch (error) {
    console.error('Failed to update category:', error);
  }
}

/**
 * Delete a waste category
 */
async function deleteWasteCategory() {
  try {
    await adminService.deleteWasteCategory(1);
    console.log('Category deleted successfully');
  } catch (error) {
    console.error('Failed to delete category:', error);
  }
}

// ============================================================================
// SUPPORT TICKETS MANAGEMENT
// ============================================================================

/**
 * Get all support tickets
 */
async function viewAllTickets() {
  try {
    const tickets = await adminService.getSupportTickets();
    
    tickets.forEach(ticket => {
      console.log(`[${ticket.priority}] ${ticket.subject}:
        - Status: ${ticket.status}
        - Citizen: ${ticket.citizenName}
        - Driver: ${ticket.driverName}
        - Rating: ${ticket.rating}
      `);
    });
  } catch (error) {
    console.error('Failed to load tickets:', error);
  }
}

/**
 * Get open tickets
 */
async function getOpenTickets() {
  try {
    const openTickets = await adminService.getSupportTickets("open");
    console.log(`Open tickets: ${openTickets.length}`);
  } catch (error) {
    console.error('Failed to load open tickets:', error);
  }
}

/**
 * Search for specific tickets
 */
async function searchTickets() {
  try {
    const results = await adminService.getSupportTickets(undefined, "payment");
    console.log(`Found ${results.length} tickets related to "payment"`);
  } catch (error) {
    console.error('Failed to search tickets:', error);
  }
}

// ============================================================================
// REACT COMPONENT EXAMPLES
// ============================================================================

/**
 * Example: Dashboard Component with Auto-refresh
 */
import React, { useEffect, useState } from 'react';

function AdminDashboardExample() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const dashboardStats = await getDashboardStats();
        setStats(dashboardStats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading stats');
      } finally {
        setLoading(false);
      }
    };

    loadStats();

    // Auto-refresh every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Recyclers: {stats?.totalRecyclers}</p>
      <p>Total Users: {stats?.totalUsers}</p>
      <p>Total Earnings: ${stats?.totalEarnings.toFixed(2)}</p>
    </div>
  );
}

/**
 * Example: Recyclers List Component
 */
function RecyclersListExample() {
  const [recyclers, setRecyclers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecyclers = async () => {
      try {
        const data = await adminService.getRecyclerDetails();
        setRecyclers(data);
      } finally {
        setLoading(false);
      }
    };

    loadRecyclers();
  }, []);

  if (loading) return <div>Loading recyclers...</div>;

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Phone</th>
          <th>Status</th>
          <th>Rating</th>
          <th>Trips</th>
        </tr>
      </thead>
      <tbody>
        {recyclers.map(recycler => (
          <tr key={recycler.recyclerID}>
            <td>{recycler.fullName}</td>
            <td>{recycler.phone}</td>
            <td>{recycler.status}</td>
            <td>⭐ {recycler.rating}</td>
            <td>{recycler.totalTripsCompleted}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * Example: Add Recycler Form Component
 */
function AddRecyclerFormExample() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    passwordHash: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      await adminService.createRecycler(formData);
      setSuccess(true);
      setFormData({ fullName: '', phone: '', passwordHash: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating recycler');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Full Name"
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        required
      />
      <input
        type="tel"
        placeholder="Phone (01012345678)"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.passwordHash}
        onChange={(e) => setFormData({ ...formData, passwordHash: e.target.value })}
        required
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Recycler created!</p>}
      <button type="submit">Create Recycler</button>
    </form>
  );
}

// ============================================================================
// EXPORT EXAMPLES
// ============================================================================

export {
  loadDashboard,
  viewAllRecyclers,
  getTopRecyclers,
  addNewRecycler,
  updateRecyclerStatus,
  removeRecycler,
  viewAllUsers,
  createNewUserAsAdmin,
  removeUser,
  addHubStaff,
  removeHubStaff,
  createWasteCategory,
  updateWasteCategory,
  deleteWasteCategory,
  viewAllTickets,
  getOpenTickets,
  searchTickets,
  AdminDashboardExample,
  RecyclersListExample,
  AddRecyclerFormExample,
};
