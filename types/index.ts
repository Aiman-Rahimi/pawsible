// types/index.ts

export type Role = "ADMIN" | "MODERATOR" | "ADOPTER";
export type PetStatus = "AVAILABLE" | "PENDING" | "ADOPTED";
export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
export type ActivityType =
  | "PROFILE_COMPLETE"
  | "FIRST_REQUEST"
  | "REQUEST_APPROVED"
  | "DAILY_VISIT"
  | "PET_FAVORITED"
  | "REVIEW_LEFT";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  points: number;
  avatarUrl?: string | null;
  bio?: string | null;
  phone?: string | null;
  address?: string | null;
  createdAt: string;
}

export interface Pet {
  id: string;
  name: string;
  breed: string;
  species: string;
  age: number;
  weight?: number | null;
  gender: string;
  color?: string | null;
  photoUrl?: string | null;
  photos: string[];
  status: PetStatus;
  description?: string | null;
  traits: string[];
  vaccinated: boolean;
  neutered: boolean;
  houseTrained: boolean;
  goodWithKids: boolean;
  goodWithPets: boolean;
  shelterId: string;
  shelter?: Pick<User, "id" | "name">;
  createdAt: string;
}

export interface AdoptionRequest {
  id: string;
  userId: string;
  petId: string;
  status: RequestStatus;
  message?: string | null;
  experience?: string | null;
  homeType?: string | null;
  hasYard?: boolean | null;
  reviewNote?: string | null;
  requestDate: string;
  user?: Pick<User, "id" | "name" | "email" | "avatarUrl">;
  pet?: Pick<Pet, "id" | "name" | "breed" | "photoUrl" | "status">;
}

export interface ActivityLog {
  id: string;
  userId: string;
  type: ActivityType;
  points: number;
  description: string;
  createdAt: string;
}

export interface PetPreference {
  id: string;
  userId: string;
  species: string[];
  sizeMin?: number | null;
  sizeMax?: number | null;
  ageMin?: number | null;
  ageMax?: number | null;
  traits: string[];
  goodWithKids?: boolean | null;
  goodWithPets?: boolean | null;
}

export interface DashboardStats {
  totalPets: number;
  availablePets: number;
  pendingPets: number;
  adoptedPets: number;
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  totalUsers: number;
  recentRequests: AdoptionRequest[];
  adoptionsByMonth: { month: string; count: number }[];
  speciesBreakdown: { species: string; count: number }[];
  statusBreakdown: { status: string; count: number }[];
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatarUrl?: string | null;
  points: number;
  rank: number;
  adoptionsApproved: number;
}

// API response wrappers
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter types
export interface PetFilters {
  species?: string;
  status?: PetStatus;
  ageMin?: number;
  ageMax?: number;
  goodWithKids?: boolean;
  goodWithPets?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}
