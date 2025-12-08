import { useState } from 'react';
import { Card, Tab, Tabs } from 'react-bootstrap';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthTabs = () => {
  const [key, setKey] = useState('login');

  return (
    <Card className="auth-card">
      <Tabs
        id="auth-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k || 'login')}
        className="nav-fill auth-tabs"
      >
        <Tab eventKey="login" title="Login">
          <div className="tab-content">
            <LoginForm />
          </div>
        </Tab>
        <Tab eventKey="register" title="Register">
          <div className="tab-content">
            <RegisterForm />
          </div>
        </Tab>
      </Tabs>
    </Card>
  );
};

export default AuthTabs;