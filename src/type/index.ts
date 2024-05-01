interface Register {
  fullname: string;
  email: string;
  password: string;
}

interface Login {
  email: string;
  password: string;
}

interface UserProfileType {
  id: string;
  username: string;
  fullname: string;
  email: string;
  password: null;
  photo_profile: string;
  bio: string;
  created_at: string;
  updated_at: string;
  follower: FollowType[];
  followwing: FollowType[];
}

interface FollowType {
  id: string;
  follower: string;
  followwing: string;
}

interface SearchUserType {
  id: string;
  username: string;
  fullname: string;
  email: string;
  password: null;
  photo_profile: string;
  bio: string | null;
  created_at: string;
  updated_at: string;
}
