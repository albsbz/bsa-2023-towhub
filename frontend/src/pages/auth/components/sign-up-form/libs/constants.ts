import { type UserSignUpRequestDto } from '~/packages/users/users.js';

const DEFAULT_SIGN_UP_PAYLOAD: UserSignUpRequestDto = {
  phone: '+380',
  password: '',
  email: '',
  firstName: '',
  lastName: '',
};

export { DEFAULT_SIGN_UP_PAYLOAD };
