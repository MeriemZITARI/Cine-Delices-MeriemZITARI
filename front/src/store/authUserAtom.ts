import { atom } from "jotai";
import type { IUser } from "../types/Auth";

// Atome pour stocker l'utilisateur connecté
export const authUserAtom = atom<IUser | null>(null);
