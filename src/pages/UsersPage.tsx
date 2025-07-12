import { useState } from 'react';
import { Plus, Search, Edit, Trash2, User } from 'lucide-react';
import { User as UserType, Role } from '../types';
import Pagination from '../components/common/Pagination';
import ConfirmDialog from '../components/common/ConfirmDialog';
import AlertDialog from '../components/common/AlertDialog';
import { useApi } from '../hooks/useApi';
import api from '../services/api';
import { usePageHeader } from '../hooks/usePageHeader';

const ITEMS_PER_PAGE = 10;

interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: string;
  avatar?: string;
}

const UsersPage = () => {
  const { data: users = [], isLoading: isLoadingUsers, error: usersError, refetch: refetchUsers } = useApi(() => api.users.getAll());
  const { data: roles = [], isLoading: isLoadingRoles } = useApi(() => api.roles.getAll());
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  }>({ type: 'info', title: '', message: '' });

  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    role: '',
    avatar: '',
  });

  // Filter users based on search term
  const filteredUsers = users.filter((user: UserType) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const showAlert = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    setAlertConfig({ type, title, message });
    setShowAlertDialog(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: '',
      avatar: '',
    });
    setShowForm(true);
    setError(null);
  };

  const handleEditUser = (user: UserType) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Don't pre-fill password for security
      role: user.role,
      avatar: user.avatar || '',
    });
    setShowForm(true);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.role) {
      setError('Name, email, and role are required');
      return;
    }

    if (!editingUser && !formData.password) {
      setError('Password is required for new users');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const userData = {
        ...formData,
        // Only include password if it's provided (for updates) or if it's a new user
        ...(formData.password && { password: formData.password }),
      };

      if (editingUser) {
        await api.users.update(editingUser.id, userData);
        showAlert('success', 'Success', 'User updated successfully!');
      } else {
        await api.users.create(userData);
        showAlert('success', 'Success', 'User created successfully!');
      }
      
      await refetchUsers();
      setShowForm(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: '',
        avatar: '',
      });
      setEditingUser(null);
    } catch (error) {
      console.error('Failed to save user:', error);
      setError('Failed to save user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (user: UserType) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      await api.users.delete(userToDelete.id);
      await refetchUsers();
      showAlert('success', 'Success', 'User deleted successfully!');
    } catch (error) {
      console.error('Failed to delete user:', error);
      showAlert('error', 'Error', 'Failed to delete user. Please try again.');
    } finally {
      setShowDeleteDialog(false);
      setUserToDelete(null);
    }
  };

  usePageHeader({
    title: 'User Management',
    subtitle: 'Manage system users and their roles',
    actions: (
      <button
        onClick={handleAddUser}
        className="btn btn-primary flex items-center justify-center w-full sm:w-auto"
      >
        <Plus className="mr-1 h-4 w-4" />
        <span className="hidden sm:inline">Add New User</span>
        <span className="sm:hidden">Add User</span>
      </button>
    ),
  });

  if (isLoadingUsers || isLoadingRoles) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="spinner"></div>
        <p className="ml-3 text-lg text-neutral-500">Loading users...</p>
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-lg text-error-500">Error loading users: {usersError.message}</p>
      </div>
    );
  }

  return (
    <div className="slide-in">
      {/* <div className="mb-4 sm:mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">User Management</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Manage system users and their roles
          </p>
        </div>
        <button
          onClick={handleAddUser}
          className="btn btn-primary flex items-center justify-center w-full sm:w-auto"
        >
          <Plus className="mr-1 h-4 w-4" />
          <span className="hidden sm:inline">Add New User</span>
          <span className="sm:hidden">Add User</span>
        </button>
      </div> */}

      {/* Search */}
      <div className="mb-4 sm:mb-6">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            className="input pl-10 sm:pl-12 w-full text-sm sm:text-base"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-neutral-200 bg-white shadow-xl">
        {/* Mobile Card View */}
        <div className="block sm:hidden">
          {paginatedUsers.length > 0 ? (
            <div className="divide-y divide-neutral-200">
              {paginatedUsers.map((user: UserType) => (
                <div key={user.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="h-10 w-10 flex-shrink-0">
                        {user.avatar ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.avatar}
                            alt={user.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-neutral-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold mt-1 ${
                            user.role === 'admin'
                              ? 'bg-error-100 text-error-800'
                              : user.role === 'doctor'
                              ? 'bg-primary-100 text-primary-800'
                              : 'bg-secondary-100 text-secondary-800'
                          }`}
                        >
                          {user.roleEntity?.name || user.role}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="p-2 text-error-600 hover:text-error-700 hover:bg-error-50 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-neutral-500">
              No users found
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  User
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Email
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Role
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user: UserType) => (
                  <tr key={user.id} className="hover:bg-neutral-50 transition rounded-xl">
                    <td className="whitespace-nowrap px-4 lg:px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 lg:h-10 lg:w-10 flex-shrink-0">
                          {user.avatar ? (
                            <img
                              className="h-8 w-8 lg:h-10 lg:w-10 rounded-full object-cover"
                              src={user.avatar}
                              alt={user.name}
                            />
                          ) : (
                            <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-neutral-200 flex items-center justify-center">
                              <User className="h-4 w-4 lg:h-5 lg:w-5 text-neutral-500" />
                            </div>
                          )}
                        </div>
                        <div className="ml-3 lg:ml-4">
                          <div className="text-sm font-medium text-neutral-900">
                            {user.name}
                          </div>
                          <div className="text-xs lg:text-sm text-neutral-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 lg:px-6 py-4 text-sm text-neutral-900">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-4 lg:px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          user.role === 'admin'
                            ? 'bg-error-100 text-error-800'
                            : user.role === 'doctor'
                            ? 'bg-primary-100 text-primary-800'
                            : 'bg-secondary-100 text-secondary-800'
                        }`}
                      >
                        {user.roleEntity?.name || user.role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 lg:px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-primary-600 hover:text-primary-700 p-1 hover:bg-primary-50 rounded transition-colors"
                          title="Edit User"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="text-error-600 hover:text-error-700 p-1 hover:bg-error-50 rounded transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-neutral-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredUsers.length > 0 && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 border-t border-neutral-200">
            <div className="mb-2 sm:mb-0">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                showSummaryOnly
              />
            </div>
            <div className="flex justify-center sm:justify-end">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                showPagesOnly
              />
            </div>
          </div>
        )}
      </div>

      {/* User Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white/95 backdrop-blur-md p-6 sm:p-8 shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
            <h2 className="mb-6 text-lg sm:text-xl font-bold text-neutral-900">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                  Name*
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input w-full text-sm sm:text-base"
                  placeholder="Enter full name"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                  Email*
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="input w-full text-sm sm:text-base"
                  placeholder="Enter email address"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                  Password{!editingUser && '*'}
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="input w-full text-sm sm:text-base"
                  placeholder={editingUser ? "Leave blank to keep current password" : "Enter password"}
                  required={!editingUser}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-neutral-700 mb-2">
                  Role*
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="input w-full text-sm sm:text-base"
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Select Role</option>
                  {roles.map((role: Role) => (
                    <option key={role.id} value={role.name}>
                      {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="avatar" className="block text-sm font-medium text-neutral-700 mb-2">
                  Avatar URL
                </label>
                <input
                  type="url"
                  id="avatar"
                  value={formData.avatar}
                  onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                  className="input w-full text-sm sm:text-base"
                  placeholder="Enter avatar URL (optional)"
                  disabled={isSubmitting}
                />
              </div>
              {error && (
                <p className="text-sm text-error-500">{error}</p>
              )}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({
                      name: '',
                      email: '',
                      password: '',
                      role: '',
                      avatar: '',
                    });
                    setEditingUser(null);
                    setError(null);
                  }}
                  className="btn btn-outline w-full sm:w-auto order-2 sm:order-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary w-full sm:w-auto order-1 sm:order-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : editingUser ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteDialog(false);
          setUserToDelete(null);
        }}
      />

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={showAlertDialog}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setShowAlertDialog(false)}
      />
    </div>
  );
};

export default UsersPage;