import { apiRequest } from "./api";

export interface CreateUserRequest {
  FullName: string;
  Email: string;
  Password: string;
  Address: string;
  ProfilePictureUrl: File;
}

/**
 * Creates a new user with admin privileges.
 * Uses multipart/form-data to support file upload.
 */
export async function createAdminUser(
  data: CreateUserRequest,
): Promise<string> {
  const formData = new FormData();
  formData.append("FullName", data.FullName);
  formData.append("Email", data.Email);
  formData.append("Password", data.Password);
  formData.append("Address", data.Address);
  formData.append("ProfilePictureUrl", data.ProfilePictureUrl);

  return apiRequest<string>("/api/admin/create-user", {
    method: "POST",
    body: formData,
  });
}

/**
 * Creates a new recycler.
 */
export async function createRecycler(data: CreateUserRequest): Promise<string> {
  const formData = new FormData();
  formData.append("FullName", data.FullName);
  formData.append("Email", data.Email);
  formData.append("Password", data.Password);
  formData.append("Address", data.Address);
  formData.append("ProfilePictureUrl", data.ProfilePictureUrl);

  return apiRequest<string>("/api/admin/create-recycler", {
    method: "POST",
    body: formData,
  });
}

/**
 * Creates a new hub staff member.
 */
export async function createHubStaff(data: CreateUserRequest): Promise<string> {
  const formData = new FormData();
  formData.append("FullName", data.FullName);
  formData.append("Email", data.Email);
  formData.append("Password", data.Password);
  formData.append("Address", data.Address);
  formData.append("ProfilePictureUrl", data.ProfilePictureUrl);

  return apiRequest<string>("/api/admin/create-hub-staff", {
    method: "POST",
    body: formData,
  });
}
