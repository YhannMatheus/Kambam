import { userRepository } from "../domain/user.repository.js";
export async function profile(userId) {
    const user = await userRepository.findById(userId);
    if (!user)
        return null;
    const userWithTeams = await userRepository.findUserTeams(userId);
    return {
        userId: user.id,
        email: user.email,
        name: user.name,
        team: userWithTeams
    };
}
//# sourceMappingURL=profile.controller.js.map