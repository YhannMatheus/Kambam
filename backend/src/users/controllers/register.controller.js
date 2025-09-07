import { CryptService } from "@/core/services/crypt.service.js";
import { userRepository } from "../domain/user.repository.js";
import { ValidatorsService } from "@/core/services/validators.service.js";
import { InvalidCredentialsError } from "@/core/errors/invalid-credentials-error.js";
import { UserAlreadyExistsError } from "@/core/errors/user-already-exists-error.js";
export async function register(data) {
    const { name, email, password, confirmPassword } = data;
    if (!ValidatorsService.isValidEmail(email)) {
        throw new InvalidCredentialsError();
    }
    if (!ValidatorsService.isValidPassword(password) || password !== confirmPassword) {
        throw new InvalidCredentialsError();
    }
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
        throw new UserAlreadyExistsError();
    }
    const hashedPassword = CryptService.hashPassword(password);
    const newUser = await userRepository.create({ name, email, password: hashedPassword });
    return newUser;
}
//# sourceMappingURL=register.controller.js.map