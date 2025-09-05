
export class ValidatorsService {
    static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    static isValidPassword(password: string): boolean {
        const minLength = 6;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/; // Pelo menos uma letra e um número
        return password.length >= minLength && passwordRegex.test(password);
    }
}