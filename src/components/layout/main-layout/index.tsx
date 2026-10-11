import { Suspense, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Loader } from '@/components/common/loader';
import { Button } from '@/components/ui/button';
import { NAV_GROUPS } from '@/constants/navigation';
import { ROUTES } from '@/constants/paths';
import { useAuth } from '@/hooks/useAuth';
import { cx } from '@/utils/cx';
import styles from './style.module.scss';

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

export const MainLayout = () => {
  const { admin, logout, can } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={styles.root}>
      <aside className={cx(styles.sidebar, menuOpen && styles.sidebarOpen)}>
        <div className={styles.brand}>DRIGO</div>
        <nav className={styles.nav}>
          {NAV_GROUPS.map((group) => {
            const items = group.items.filter((item) => can(item.permission));
            if (items.length === 0) return null;
            return (
              <div key={group.title} className={styles.group}>
                <span className={styles.groupTitle}>{group.title}</span>
                {items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === ROUTES.DASHBOARD}
                    onClick={closeMenu}
                    className={({ isActive }) => cx(styles.navLink, isActive && styles.navLinkActive)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            );
          })}
        </nav>
        <Button variant="ghost" className={styles.logout} onClick={logout}>
          Logout
        </Button>
      </aside>
      {menuOpen && <div className={styles.backdrop} role="presentation" onClick={closeMenu} />}

      <div className={styles.main}>
        <header className={styles.header}>
          <Button size="sm" className={styles.menuButton} onClick={() => setMenuOpen((open) => !open)}>
            Menu
          </Button>
          <div className={styles.account}>
            <div className={styles.accountText}>
              <span className={styles.accountName}>{admin?.fullName}</span>
              <span className={styles.accountUsername}>{admin?.username}</span>
            </div>
            <span className={styles.avatar}>{getInitials(admin?.fullName)}</span>
          </div>
        </header>
        <main className={styles.content}>
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};
