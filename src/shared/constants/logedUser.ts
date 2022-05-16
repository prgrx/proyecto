import { User } from 'src/shared/interfaces/user'

const LogedUser = {
    uid: () => JSON.parse(localStorage.getItem('user'))
};
export { LogedUser }