import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import 'dotenv/config';
import { AuthModule } from "./auth.module";

describe('auth', () => {
    let service: AuthService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AuthModule]
        }).compile();

        service = module.get<AuthService>(AuthService);
    });


    it('An user should be created', async() => {
        const user = await service.register({
            email: 'jessica@gmail.com',
            name: 'jess',
            password: '123456789'
        });

        expect(user.userId).toEqual(expect.any(Number));
        expect(user.message).toBe("User created sucessfully");
    });

    it('', async() => {
        const user = await service.login({
            email: 'jessica@gmail.com',
            password: '123456789'
        });

        expect(user).not.toBeNull();
    });
})