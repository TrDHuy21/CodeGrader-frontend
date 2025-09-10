export interface UserProfileModel {
  id: number;
  fullName: string;
  username: string;
  birthday: Date;
  email: string;
  bio: string;
  githubLink: string;
  linkedinLink: string;
  createdAt: Date;
  avatar?: string;
}
export interface UserProfileDto {
  id: number;
  fullName: string;
  username: string;
  email: string;
  birthday: string; // "1999-08-21"
  bio: string | null;
  githubLink: string | null;
  linkedinLink: string | null;
  createdAt: string; // ISO date
  avatar?: string;
}
export interface UpadtePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export function mapUserProfile(dto: UserProfileDto): UserProfileModel {
  return {
    id: dto.id,
    fullName: dto.fullName,
    username: dto.username,
    birthday: new Date(dto.birthday),
    email: dto.email,
    bio: dto.bio ?? '',
    githubLink: dto.githubLink ?? '',
    linkedinLink: dto.linkedinLink ?? '',
    createdAt: new Date(dto.createdAt),
    avatar: dto.avatar,
  };
}
