import { useQuery, UseQueryOptions} from '@tanstack/react-query';
import adminService from '../../../services/api/AdminService/adminUserService'; // Ensure this path is correct or create the missing file.
import type { IUser } from '../../../types/Auth'; // Adjusted path to match the correct structure

export interface UserFilters {
  firstName?: string;
  lastName?: string;
  email?: string;
  isAdmin?: boolean;
}


export function useAdminUsers(filters: UserFilters, enabled = true) {
    return useQuery({
      queryKey: ['admin-users', filters],
      queryFn: () => adminService.getAllUsers(filters),
      staleTime: 5 * 60 * 1000,
      enabled, // ← pour ne lancer la requête que si "enabled" est vrai
    });
  }