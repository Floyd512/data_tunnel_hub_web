import React, { useState } from 'react';
import styles from './Login.module.css';

const Login = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('登录信息：', { username, password });
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.formWrapper}>
        <h2 className={styles.title}>登录</h2>
        <div className={styles.inputGroup}>
          <label className={styles.label}>账号：</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>密码：</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        <button type="submit" className={styles.submitBtn}>登录</button>
      </form>
    </div>
  );
};

export default Login;