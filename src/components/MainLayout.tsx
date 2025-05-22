import { useState, useRef, useEffect } from 'react';
import { 
  MdPeople, 
  MdSettings, 
  MdLogout, 
  MdPerson, 
  MdList, 
  MdSecurity, 
  MdBuild,
  MdMenu,
  MdPlayCircle,
  MdStorage,
  MdTune,
  MdMonitor,
  MdHistory,
  MdDescription,
  MdCloudUpload,
  MdCloudDownload,
  MdAssessment
} from 'react-icons/md';
import { RiFlowChart } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import styles from './MainLayout.module.css';

const menuData = [
  {
    title: '任务管理',
    icon: <MdPlayCircle />,
    children: [
      { title: '任务列表', icon: <MdList /> },
      { title: '任务模板', icon: <MdDescription /> },
      { title: '任务历史', icon: <MdHistory /> }
    ]
  },
  {
    title: '数据源管理',
    icon: <MdStorage />,
    children: [
      { title: '源数据源', icon: <MdCloudUpload /> },
      { title: '目标数据源', icon: <MdCloudDownload /> },
      { title: '数据源测试', icon: <MdAssessment /> }
    ]
  },
  {
    title: '任务配置',
    icon: <MdTune />,
    children: [
      { title: '新建任务', icon: <MdPlayCircle /> },
      { title: '配置模板', icon: <MdDescription /> },
      { title: '参数管理', icon: <MdSettings /> }
    ]
  },
  {
    title: '任务监控',
    icon: <MdMonitor />,
    children: [
      { title: '实时监控', icon: <MdMonitor /> },
      { title: '执行日志', icon: <MdDescription /> },
      { title: '性能分析', icon: <MdAssessment /> }
    ]
  },
  {
    title: '系统管理',
    icon: <MdSettings />,
    children: [
      { title: '用户管理', icon: <MdPeople /> },
      { title: '角色权限', icon: <MdSecurity /> },
      { title: '系统设置', icon: <MdBuild /> }
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

  const toggleMenu = (idx: number) => {
    setOpenMenus(prev => 
      prev.includes(idx) 
        ? prev.filter(i => i !== idx)
        : [...prev, idx]
    );
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
              className={`${styles.menuGroup} ${openMenus.includes(idx) ? styles.active : ''}`}
            >
              <div
                className={styles.menuTitle + (openMenus.includes(idx) ? ' ' + styles.active : '')}
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