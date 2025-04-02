'use server';

import { authService, type UserCredentials, type UserRegistrationData, type UserInfo } from './auth.service';

// Actions serveur pour l'authentification

export async function getUser() {
    return await authService.getUser();
}

export async function signIn(credentials: UserCredentials) {
    return await authService.signIn(credentials);
}

export async function signInWithGithub() {
    return await authService.signInWithGithub();
}

export async function signInWithGoogle() {
    return await authService.signInWithGoogle();
}

export async function signOut() {
    return await authService.signOut();
}

export async function createUser(userData: UserRegistrationData) {
    return await authService.createUser(userData);
}

export async function isAuthenticated() {
    return await authService.isAuthenticated();
}