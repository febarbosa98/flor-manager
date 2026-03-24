import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { app } from "./firebase"

const auth = getAuth(app)

export function login(email: string, senha: string) {
  return signInWithEmailAndPassword(auth, email, senha)
}

export function logout() {
  return signOut(auth)
}

export function getUser() {
  return auth.currentUser
}

export { auth }