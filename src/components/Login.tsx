import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { RiFlowChart } from 'react-icons/ri';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorField, setErrorField] = useState<{username: boolean, password: boolean}>({username: false, password: false});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = {
      username: !username,
      password: !password
    };
    setErrorField(error);
    if (error.username || error.password) {
      return;
    }
    // 登录成功后跳转到主页面
    navigate('/dashboard');
  };

  return (
    <div>
      <div className={styles.bgFullScreen}></div>
      <div className={styles.loginWrapper}>
        <div className={styles.leftSection}>
          <div className={styles.titleSection}>
            <div className={styles.logoTitle}>
              <RiFlowChart className={styles.logoIcon} />
              <span>DataTunnel Hub</span>
            </div>
            <div className={styles.logoSubtitle}>
              数据导出管理平台
            </div>
          </div>
          <div className={styles.illustrationSection}>
            <img src="/login-bg-2.jpg" alt="DataTunnel Illustration" />
          </div>
        </div>
        <div className={styles.rightSection}>
          <form 
            onSubmit={handleSubmit} 
            className={styles.formWrapper}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={styles.title}>账号登录</h2>
            <div className={styles.inputGroup} style={{flexDirection: 'column', alignItems: 'flex-start'}}>
              <span className={styles.inputLabel}>邮箱</span>
              <div style={{width: '100%', display: 'flex', alignItems: 'center', position: 'relative'}}>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrorField(f => ({...f, username: false}));
                  }}
                  className={styles.input + (errorField.username ? ' ' + styles.inputError : '')}
                  placeholder="请输入邮箱"
                />
              </div>
            </div>
            <div className={styles.inputGroup} style={{flexDirection: 'column', alignItems: 'flex-start'}}>
              <span className={styles.inputLabel}>密码</span>
              <div 
                style={{width: '100%', display: 'flex', alignItems: 'center', position: 'relative'}}
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorField(f => ({...f, password: false}));
                  }}
                  className={styles.input + (errorField.password ? ' ' + styles.inputError : '')}
                  placeholder="请输入密码"
                />
                <button 
                  type="button"
                  className={styles.passwordToggle}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
              </div>
            </div>
            <button type="submit" className={styles.submitBtn}>登录</button>
            <div className={styles.formFooter}>
              <span className={styles.register}>注册账号</span>
              <span className={styles.forgot}>忘记密码</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;