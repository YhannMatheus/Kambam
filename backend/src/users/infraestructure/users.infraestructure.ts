import { Router } from 'express';
import { login } from '../controllers/login.controller.js';
import { register } from '../controllers/register.controller.js';
import { profile } from '../controllers/profile.controller.js';
import { authMiddleware } from '../../core/middleware/auth.js';
import { InvalidCredentialsError } from '@/core/errors/invalid-credentials-error.js';
import { UserNotFoundError } from '@/core/errors/user-not-found-error.js';
import { UserAlreadyExistsError } from '@/core/errors/user-already-exists-error.js';
import { AuthService } from '@/core/services/auth.service.js';

interface LoginRequestBody {
    email: string;
    password: string;
};

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface userProfile{
    id: string;
    email: string;
    name: string;
    team: { id: string; name: string }[];
}

const router = Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body as LoginRequestBody;
    
    try {

        const token = await login({ email, password });
        res.json({
            token
        });

    } catch (error : any) {
        if (error instanceof InvalidCredentialsError) {
            res.status(401).json({ error: 'Credenciais inválidas' });
        
        } else if (error instanceof UserNotFoundError) {
            res.status(404).json({ error: 'Usuário não encontrado' });
        
        } else {
            res.status(500).json({ error: 'Erro no servidor' });
        
        }
    }
});


router.post('/register', async (req, res) => {
    const { name, email, password } = req.body as RegisterData;
    try {
        const user = await register({ name, email, password });

        res.status(201).json({
            message: 'Usuário registrado com sucesso',
            userId: user.id
        });

    } catch (error: any) {
        if (error instanceof InvalidCredentialsError) {
            res.status(400).json({ error: 'Credenciais inválidas' });
        
        } else if (error instanceof UserAlreadyExistsError){
            res.status(409).json({ error: 'Usuário já existe' });
        
        } else {
            res.status(500).json({ error: 'Erro no servidor' });
        
        }
    }
});

router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const userId = req.user!.userId;
        
        const userProfile = await profile(userId);

        if (!userProfile) {
            res.status(404).json({ error: 'Usuário não encontrado' });
            return;
        }

        res.json(userProfile);

    } catch (error: any) {
        if (error instanceof UserNotFoundError) {
            res.status(404).json({ error: 'Usuário não encontrado' });
        } else {
            res.status(500).json({ error: 'Erro no servidor' });
        }
    }
});


export const UserRoutes = router;
