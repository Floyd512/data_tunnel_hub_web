import { useState, useRef, useEffect } from 'react';
import {  
  MdSettings, 
  MdLogout, 
  MdPerson, 
  MdMenu,
  MdPlayCircle,
  MdTune,
  MdNotifications,
  MdFullscreen,
  MdFullscreenExit,
  MdHelp,
  MdDarkMode,
  MdLightMode,
  MdChevronRight
} from 'react-icons/md';
import { RiFlowChart, RiDatabase2Line } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import styles from './MainLayout.module.css';
import TaskList from './TaskList';

const menuData = [
  {
    title: '同步任务管理',
    icon: <MdPlayCircle />,
    children: [
      { title: '同步任务列表', icon: null }
    ]
  },
  {
    title: '数据源管理',
    icon: <RiDatabase2Line />,
    children: [
      { title: '数据源列表', icon: null }
    ]
  },
  {
    title: '文件管理',
    icon: <MdTune />,
    children: [
      { title: '文件列表', icon: null }
    ]
  },
  {
    title: '系统管理',
    icon: <MdSettings />,
    children: [
      { title: '用户管理', icon: null },
      { title: '角色权限', icon: null },
      { title: '系统设置', icon: null },
      { title: '操作日志', icon: null }
    ]
  }
];

const MainLayout = () => {
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState<number[]>([0]);
  const [selected, setSelected] = useState<string>('总览');
  const [subMenuHeights, setSubMenuHeights] = useState<{[key: number]: number}>({});
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const subMenuRefs = useRef<{[key: number]: HTMLDivElement | null}>({});
  const userMenuRef = useRef<HTMLDivElement>(null);
  const siderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 当菜单展开状态改变时，重新计算高度
    const calculateHeights = () => {
      menuData.forEach((_, idx) => {
        if (subMenuRefs.current[idx]) {
          const height = subMenuRefs.current[idx]?.scrollHeight || 0;
          setSubMenuHeights(prev => ({...prev, [idx]: height}));
        }
      });
    };

    // 初始计算
    calculateHeights();

    // 监听窗口大小变化，重新计算高度
    window.addEventListener('resize', calculateHeights);
    return () => {
      window.removeEventListener('resize', calculateHeights);
    };
  }, [openMenus]);

  // 添加点击外部区域关闭用户菜单的功能
  useEffect(() => {
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

  const toggleMenu = (idx: number) => {
    setOpenMenus(prev => {
      const newOpenMenus = prev.includes(idx) 
        ? prev.filter(i => i !== idx)
        : [...prev, idx];
      
      // 在状态更新后，使用 setTimeout 确保 DOM 已更新
      setTimeout(() => {
        if (subMenuRefs.current[idx]) {
          const height = subMenuRefs.current[idx]?.scrollHeight || 0;
          setSubMenuHeights(prev => ({...prev, [idx]: height}));
        }
      }, 0);
      
      return newOpenMenus;
    });
  };

  const isMenuActive = (idx: number) => {
    // 检查该菜单组下的子菜单是否有被选中的
    const menuGroup = menuData[idx];
    return menuGroup.children.some(child => child.title === selected);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // 这里可以添加主题切换的具体逻辑
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
            <RiFlowChart className={styles.logoIcon} />
            <div className={styles.logoText}>
              <span>DataTunnel Hub</span>
            </div>
          </div>
        </div>
        <nav>
          {menuData.map((menu, idx) => (
            <div 
              key={menu.title} 
              className={`${styles.menuGroup} ${isMenuActive(idx) ? styles.active : ''}`}
            >
              <div
                className={styles.menuTitle + (isMenuActive(idx) ? ' ' + styles.active : '')}
                onClick={() => toggleMenu(idx)}
              >
                <div className={styles.menuTitleContent}>
                  <span className={styles.menuIcon}>{menu.icon}</span>
                  <span className={styles.menuText}>{menu.title}</span>
                </div>
                <span className={styles.arrow + (openMenus.includes(idx) ? ' ' + styles.arrowUp : '')}></span>
              </div>
              <div 
                className={styles.subMenuWrapper}
                style={{
                  height: openMenus.includes(idx) ? `${subMenuHeights[idx]}px` : '0',
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
                      <span className={styles.menuIcon} style={{visibility: 'hidden'}}>{child.icon}</span>
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
          <div className={styles.breadcrumb}>
            <span>同步任务管理</span>
            <MdChevronRight className={styles.breadcrumbIcon} />
            <span>同步任务列表</span>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.headerItem}>
              <MdNotifications className={styles.headerIcon} />
              <span className={styles.notificationBadge}>3</span>
            </div>
            <div className={styles.headerItem} onClick={toggleFullscreen}>
              {isFullscreen ? <MdFullscreenExit className={styles.headerIcon} /> : <MdFullscreen className={styles.headerIcon} />}
            </div>
            <div className={styles.headerItem} onClick={toggleTheme}>
              {isDarkMode ? <MdLightMode className={styles.headerIcon} /> : <MdDarkMode className={styles.headerIcon} />}
            </div>
            <div className={styles.headerItem}>
              <MdHelp className={styles.headerIcon} />
            </div>
            <div className={styles.divider}></div>
            <div className={styles.userSection} ref={userMenuRef}>
              <div className={styles.userInfo}>
                <div 
                  className={styles.userAvatar}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="user avatar" />
                </div>
                <span className={styles.userName}>Admin</span>
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
        </div>
        <main className={styles.content}>
          <div style={{marginTop: '2rem'}}>
            {selected === '同步任务列表' && <TaskList />}
            {selected === '数据源列表' && <div>数据源列表内容。</div>}
            {selected === '文件列表' && <div>文件列表内容。</div>}
            {selected === '用户管理' && <div>用户管理内容。</div>}
            {selected === '角色权限' && <div>角色权限设置。</div>}
            {selected === '系统设置' && <div>系统设置内容。</div>}
            {selected === '操作日志' && <div>操作日志内容。</div>}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 