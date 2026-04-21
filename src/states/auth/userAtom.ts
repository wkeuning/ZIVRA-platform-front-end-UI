import { atom } from 'jotai';

interface UserProfile {
    firstName: string;
    lastName: string;
}

export const userRoleAtom = atom<null | string>(null);
export const userProfileAtom = atom<UserProfile | null>(null);