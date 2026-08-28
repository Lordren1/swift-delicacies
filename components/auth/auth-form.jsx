'use client';

import { useActionState } from "react";
import styles from './auth-form.module.css';


export default function AuthForm({ action, mode }) {
  const [state, formAction, pending] = useActionState(action, { errors: null });

  const isSignup = mode === 'signup';

  return (
    <>
      <div className={styles.wrapper}>
        <h1 className={styles.heading}>{isSignup ? 'Create an account' : 'Log in'}</h1>

        <form action={formAction} className={styles.form}>
          {isSignup && (
            <div className={styles.row}>
              <p className={styles.control}>
                <label htmlFor="firstName">
                  First name
                </label>
                <input type="text" id="firstName" name="firstName" />
              </p>

              <p className={styles.control}>
                <label htmlFor="lastName">
                  Last name
                </label>
                <input type="text" id="lastName" name="lastName" />
              </p>
            </div>
          )}

          <p className={styles.control}>
            <label htmlFor="username">
              Username
            </label>
            <input type="text" id="username" name="username" autoComplete="username" />
          </p>

          {isSignup && (
            <p className={styles.control}>
              <label htmlFor="email">
                Email
              </label>
              <input type="text" id="email" name="email" autoComplete="email" />
            </p>
          )}

          <p className={styles.control}>
            <label htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete={isSignup ? 'new-password' : 'current-password'}
            />
          </p>

          <button type="submit" className={styles.submit} disabled={pending}>
            {pending ? 'Please wait...' : isSignup ? 'Sign up' : 'Log in'}
          </button>

          {state.errors && (
            <ul className={styles.errors}>
              {state.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          )}
        </form>
      </div>
    </>
  );
}