import { userRepository } from "../domain/user.repository.js";

interface ProfileData {
  userId: string;
  email: string;
  name: string;
  team: { id: string; name: string }[];
}

export async function profile(userId: string): Promise<ProfileData | null> {
  const user = await userRepository.findById(userId);
  
  if (!user) return null;
  
  const userWithTeams = await userRepository.findUserTeams(userId);
  
  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    team: userWithTeams
  };
}