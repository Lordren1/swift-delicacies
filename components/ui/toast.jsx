'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './toast.module.css';

const MESSAGES = {
  updated: 'Meal updated successfully.',
  deleted: 'Meal deleted successfully.',
  profileUpdated: 'Profile updated successfully.',
  passwordChanged: 'Password changed successfully.',
};

export default function Toast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const key = Object.keys(MESSAGES).find((k) => searchParams.get(k));

    if (!key) return;

    setMessage(MESSAGES[key]);
    // setVisible(true);

    // Strip the query param from the URL so refreshing the page
    // doesn't re-trigger the toast
    const params = new URLSearchParams(searchParams);
    params.delete(key);
    const newUrl = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname;
    router.replace(newUrl, { scroll: false });

    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!message) return null;

  return (
    <div className={styles.toast} role="status">
      {message}
    </div>
  );
}