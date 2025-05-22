import { useState, useRef, useEffect } from 'react';
import { MdDashboard, MdPeople, MdSettings, MdLogout, MdPerson, MdTrendingUp, MdMonitor, MdList, MdSecurity, MdBuild, MdMenu } from 'react-icons/md';
import { SiDatadog } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';
import styles from './MainLayout.module.css';

const menuData = [
  {
    title: '数据看板',
    icon: <MdDashboard />,
    children: [
      { title: '总览', icon: <MdDashboard /> },
      { title: '趋势分析', icon: <MdTrendingUp /> },
      { title: '实时监控', icon: <MdMonitor /> }
    ]
  },
  {
    title: '用户管理',
    icon: <MdPeople />,
    children: [
      { title: '用户列表', icon: <MdList /> },
      { title: '权限分配', icon: <MdSecurity /> }
    ]
  },
  {
    title: '系统设置',
    icon: <MdSettings />,
    children: [
      { title: '基础设置', icon: <MdBuild /> },
      { title: '安全设置', icon: <MdSecurity /> }
    ]
  }
];

const MainLayout = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selected, setSelected] = useState<string>('总览');
  const [subMenuHeights, setSubMenuHeights] = useState<{[key: number]: number}>({});
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const subMenuRefs = useRef<{[key: number]: HTMLDivElement | null}>({});
  const userMenuRef = useRef<HTMLDivElement>(null);
  const siderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    menuData.forEach((_, idx) => {
      if (subMenuRefs.current[idx]) {
        const height = subMenuRefs.current[idx]?.scrollHeight || 0;
        setSubMenuHeights(prev => ({...prev, [idx]: height}));
      }
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    navigate('/');
  };

  const setSubMenuRef = (idx: number) => (el: HTMLDivElement | null) => {
    subMenuRefs.current[idx] = el;
  };

  const handleMouseEnter = () => {
    if (isCollapsed) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (isCollapsed) {
      setIsHovered(false);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    setIsHovered(false);
  };

  return (
    <div className={styles.layout}>
      <aside 
        className={`${styles.sider} ${isCollapsed ? styles.collapsed : ''} ${isHovered ? styles.expanded : ''}`}
        ref={siderRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.logoSection}>
          <div className={styles.logoWrapper}>
            <SiDatadog className={styles.logoIcon} />
            <div className={styles.logoText}>
              <span>DataTunnel Hub</span>
            </div>
          </div>
        </div>
        <nav>
          {menuData.map((menu, idx) => (
            <div 
              key={menu.title} 
              className={`${styles.menuGroup} ${openIndex === idx ? styles.active : ''}`}
            >
              <div
                className={styles.menuTitle + (openIndex === idx ? ' ' + styles.active : '')}
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <div className={styles.menuTitleContent}>
                  <span className={styles.menuIcon}>{menu.icon}</span>
                  <span className={styles.menuText}>{menu.title}</span>
                </div>
                <span className={styles.arrow + (openIndex === idx ? ' ' + styles.arrowUp : '')}></span>
              </div>
              <div 
                className={styles.subMenuWrapper}
                style={{
                  height: openIndex === idx ? `${subMenuHeights[idx]}px` : '0',
                }}
              >
                <div 
                  ref={setSubMenuRef(idx)}
                  className={styles.subMenu}
                >
                  {menu.children.map(child => (
                    <div
                      key={child.title}
                      className={styles.menuItem + (selected === child.title ? ' ' + styles.selected : '')}
                      onClick={() => setSelected(child.title)}
                    >
                      <span className={styles.menuIcon}>{child.icon}</span>
                      <span className={styles.menuText}>{child.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>
        <button 
          className={styles.collapseBtn}
          onClick={toggleCollapse}
        >
          <MdMenu />
        </button>
      </aside>
      <div className={`${styles.mainContent} ${isCollapsed ? styles.expanded : ''}`}>
        <div className={styles.header}>
          <div className={styles.userSection} ref={userMenuRef}>
            <div 
              className={styles.userAvatar}
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="user avatar" />
            </div>
            {showUserMenu && (
              <div className={styles.userMenu}>
                <div className={styles.userMenuItem}>
                  <MdPerson />
                  <span>个人信息</span>
                </div>
                <div className={styles.userMenuItem} onClick={handleLogout}>
                  <MdLogout />
                  <span>退出登录</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <main className={styles.content}>
          <h2>{selected}</h2>
          <div style={{marginTop: '2rem'}}>
            {selected === '总览' && <div>这里是数据总览内容示例。</div>}
            {selected === '趋势分析' && <div>趋势分析图表区域。</div>}
            {selected === '实时监控' && <div>实时监控数据展示。</div>}
            {selected === '用户列表' && <div>用户列表内容。</div>}
            {selected === '权限分配' && <div>权限分配设置。</div>}
            {selected === '基础设置' && <div>系统基础设置内容。</div>}
            {selected === '安全设置' && <div>安全设置内容。</div>}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 