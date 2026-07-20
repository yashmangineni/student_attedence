import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthAlerts from './AuthAlerts';

const backendUrl = import.meta.env.VITE_API_BACKEND_URL || 'http://localhost:5124';
const loginApiBase = `${backendUrl}/Logincontroller`;
const studentLoginApiBase = `${backendUrl}/api/StudentLogin`;

const getApiUrl = (path) => `${loginApiBase}${path}`;
const getStudentLoginApiUrl = (path) => `${studentLoginApiBase}${path}`;

const readJsonResponse = async (response) => {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);

const IconMail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" ry="2" /><polyline points="22,6 12,13 2,6" /></svg>
);

const IconLock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
);

function TeacherLogin({ view: initialView }) {
  const navigate = useNavigate();
  const [view, setView] = useState(initialView || 'login');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loginUser, setLoginUser] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupCPassword, setSignupCPassword] = useState('');
  const [forgotUsername, setForgotUsername] = useState('');
  const [resetUsername, setResetUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newConfirmPassword, setNewConfirmPassword] = useState('');
  const [tempPassword, setTempPassword] = useState('');

  useEffect(() => {
    setView(initialView || 'login');
  }, [initialView]);

  useEffect(() => {
    const savedUser = localStorage.getItem('teacher_session');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user?.role === 'Student') {
          navigate('/student-dashboard');
        } else {
          navigate('/dashboard');
        }
      } catch {
        localStorage.removeItem('teacher_session');
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginUser|| !loginPassword) {
      setErrorMsg('Please enter both username/email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch(getApiUrl('/signin'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
    UserNameOrEmail: loginUser,
    Password: loginPassword
})
      });

      const data = await readJsonResponse(response);

      if (!response.ok) {
        throw new Error(data?.message || 'Login failed. Please check your credentials.');
      }

      const loggedUser = data.user;
      const sessionData = {
        ...loggedUser,
        role: data.role,
        firstLogin: data.firstLogin || false
      };
      localStorage.setItem('teacher_session', JSON.stringify(sessionData));
      localStorage.setItem('role', data.role);
      setSuccessMsg('Logged in successfully!');
      setLoginUser('');
      setLoginPassword('');
      if (data.role === 'Student') {
        navigate('/student-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotUsername) {
      setErrorMsg('Please enter your student username.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch(getStudentLoginApiUrl('/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: forgotUsername })
      });

      const data = await readJsonResponse(response);

      if (!response.ok) {
        throw new Error(data?.message || 'Password reset failed.');
      }

      setTempPassword(data.temporaryPassword || '');
      setResetUsername(forgotUsername);
      setForgotUsername('');
      setView('reset-password');
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred while resetting password.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetUsername || !newPassword || !newConfirmPassword) {
      setErrorMsg('All fields are required.');
      return;
    }

    if (newPassword !== newConfirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch(getStudentLoginApiUrl('/change-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: resetUsername, newPassword })
      });

      const data = await readJsonResponse(response);

      if (!response.ok) {
        throw new Error(data?.message || 'Password change failed.');
      }

      setSuccessMsg('Password changed successfully. Please sign in with your new password.');
      setResetUsername('');
      setNewPassword('');
      setNewConfirmPassword('');
      setTempPassword('');
      setView('login');
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred while changing the password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!signupName || !signupEmail || !signupPassword || !signupCPassword) {
      setErrorMsg('All fields are required.');
      return;
    }

    if (signupPassword !== signupCPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(getApiUrl('/signup'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: signupName, email: signupEmail, password: signupPassword, cpassword: signupCPassword })
      });

      const data = await readJsonResponse(response);

      if (!response.ok) {
        throw new Error(data?.message || 'Registration failed.');
      }

      setSuccessMsg('Registration successful! Please login.');
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
      setSignupCPassword('');
      setView('login');
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  if (view === 'forgot-password') {
    return (
      <div className="glass-container">
        <div className="glass-card">
          <div className="auth-header">
            <h2 className="auth-title">Forgot Password</h2>
            <p className="auth-subtitle">Enter your student username to reset your password</p>
          </div>

          <AuthAlerts errorMsg={errorMsg} successMsg={successMsg} />

          <form onSubmit={handleForgotPassword}>
            <div className="form-group">
              <label className="form-label">Student Username</label>
              <div className="glass-input-wrapper">
                <span className="glass-input-icon"><IconMail /></span>
                <input
                  type="text"
                  className="glass-input"
                  placeholder="Enter your student username"
                  value={forgotUsername}
                  onChange={(e) => setForgotUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Resetting...' : 'Send Temporary Password'}
            </button>
          </form>

          <div className="auth-footer">
            Remembered your password?
            <button type="button" className="auth-link" onClick={() => { setErrorMsg(''); setSuccessMsg(''); setView('login'); }}>
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'reset-password') {
    return (
      <div className="glass-container">
        <div className="glass-card">
          <div className="auth-header">
            <h2 className="auth-title">Create New Password</h2>
            <p className="auth-subtitle">Use the temporary password to set a new password</p>
          </div>

          <AuthAlerts errorMsg={errorMsg} successMsg={successMsg} />

          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label className="form-label">Student Username</label>
              <div className="glass-input-wrapper">
                <span className="glass-input-icon"><IconMail /></span>
                <input
                  type="text"
                  className="glass-input"
                  placeholder="Enter your student username"
                  value={resetUsername}
                  onChange={(e) => setResetUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Temporary Password</label>
              <div className="glass-input-wrapper">
                <span className="glass-input-icon"><IconLock /></span>
                <input
                  type="password"
                  className="glass-input"
                  placeholder="Temporary password"
                  value={tempPassword}
                  readOnly
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <div className="glass-input-wrapper">
                <span className="glass-input-icon"><IconLock /></span>
                <input
                  type="password"
                  className="glass-input"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="glass-input-wrapper">
                <span className="glass-input-icon"><IconLock /></span>
                <input
                  type="password"
                  className="glass-input"
                  placeholder="Confirm new password"
                  value={newConfirmPassword}
                  onChange={(e) => setNewConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Change Password'}
            </button>
          </form>

          <div className="auth-footer">
            Already have your password?
            <button type="button" className="auth-link" onClick={() => { setErrorMsg(''); setSuccessMsg(''); setView('login'); }}>
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'login') {
    return (
      <div className="glass-container">
        <div className="glass-card">
          <div className="auth-header">
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">Log in to manage your students</p>
          </div>

          <AuthAlerts errorMsg={errorMsg} successMsg={successMsg} />

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Username / Email</label>
              <div className="glass-input-wrapper">
                <span className="glass-input-icon"><IconMail /></span>
                <input
                  type="text"
                  className="glass-input"
                  placeholder="Enter username or   email"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="glass-input-wrapper">
                <span className="glass-input-icon"><IconLock /></span>
                <input
                  type="password"
                  className="glass-input"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Verifying...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            <button type="button" className="auth-link" onClick={() => { setErrorMsg(''); setSuccessMsg(''); setView('forgot-password'); }}>
              Forgot password?
            </button>
          </div>

          <div className="auth-footer">
            Don't have an account?
            <button type="button" className="auth-link" onClick={() => { setErrorMsg(''); setSuccessMsg(''); setView('signup'); }}>
              Create one
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-container">
      <div className="glass-card">
        <div className="auth-header">
          <h2 className="auth-title">Teacher Register</h2>
          <p className="auth-subtitle">Join the school portal dashboard</p>
        </div>

        <AuthAlerts errorMsg={errorMsg} successMsg={successMsg} />

        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="glass-input-wrapper">
              <span className="glass-input-icon"><IconUser /></span>
              <input
                type="text"
                className="glass-input"
                placeholder="Enter your full name"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="glass-input-wrapper">
              <span className="glass-input-icon"><IconMail /></span>
              <input
                type="email"
                className="glass-input"
                placeholder="Enter your email address"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="glass-input-wrapper">
              <span className="glass-input-icon"><IconLock /></span>
              <input
                type="password"
                className="glass-input"
                placeholder="Create a password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="glass-input-wrapper">
              <span className="glass-input-icon"><IconLock /></span>
              <input
                type="password"
                className="glass-input"
                placeholder="Verify password"
                value={signupCPassword}
                onChange={(e) => setSignupCPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?
          <button type="button" className="auth-link" onClick={() => { setErrorMsg(''); setSuccessMsg(''); setView('login'); }}>
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeacherLogin;
