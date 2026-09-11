import MainHeader from '@/components/main-header/main-header';
import './globals.css';
import { verifyAuth } from '@/lib/auth';


export const metadata = {
  title: 'NextLevel Food',
  description: 'Delicious meals, shared by a food-loving community.',
};

export default async function RootLayout({ children }) {
  const {user} = await verifyAuth();
  return (
    <html lang="en">
      <body suppressHydrationWarning>

        <MainHeader user={user}/>
        {children}
      </body>
    </html>
  );
}
