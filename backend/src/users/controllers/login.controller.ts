import { UserNotFoundError } from '@/core/errors/user-not-found-error.js';
import { userRepository } from '../domain/user.repository.js';
import { InvalidCredentialsError } from '@/core/errors/invalid-credentials-error.js';
import { AuthService } from '@/core/services/auth.service.js';
import { CryptService } from '@/core/services/crypt.service.js';

interface LoginData {
  email: string;
  password: string;
}

export async function login(data: LoginData) {
    const { email, password } = data;

    const user = await userRepository.findByEmail(email);

    if (!user) {
        throw new UserNotFoundError(email);
    }

    // Usar bcrypt para comparar senhas
    const isPasswordValid = CryptService.comparePasswords(password, user.password);
    
    if (!isPasswordValid) {
        throw new InvalidCredentialsError();
    }

    const payload = { userId: user.id, email: user.email };

    const token = await AuthService.generateToken(payload);

    return token ;
}