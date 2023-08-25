import { type HashedPass } from '~/packages/auth/libs/types/hashed-pass.type';

interface IEncryptService {
  encrypt(password: string): Promise<HashedPass>;
  compare(password: string, hash: string): Promise<boolean>;
}

export { type IEncryptService };