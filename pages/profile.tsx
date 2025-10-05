import { useAuthenticator } from '@aws-amplify/ui-react';
import { Authenticator } from '@aws-amplify/ui-react';

export default function Profile() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="container">
          <header className="header">
            <h1>Your Profile</h1>
            <p>Manage your TrickShare account ✨</p>
          </header>

          <div className="form">
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '10px' }}>Account Information</h3>
              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '10px', marginBottom: '10px' }}>
                <strong>Email:</strong> {user?.signInDetails?.loginId}
              </div>
              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '10px', marginBottom: '10px' }}>
                <strong>Name:</strong> {user?.signInDetails?.loginId?.split('@')[0]}
              </div>
              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '10px' }}>
                <strong>User ID:</strong> {user?.userId}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '10px' }}>Your Stats</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                <div style={{ background: 'linear-gradient(45deg, #667eea, #764ba2)', color: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>0</div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>Tricks Shared</div>
                </div>
                <div style={{ background: 'linear-gradient(45deg, #f093fb, #f5576c)', color: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>0</div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Kudos</div>
                </div>
                <div style={{ background: 'linear-gradient(45deg, #4facfe, #00f2fe)', color: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>0</div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>Kudos Given</div>
                </div>
              </div>
            </div>

            <button 
              onClick={signOut}
              style={{
                background: 'linear-gradient(45deg, #ff6b6b, #ee5a52)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                width: '100%'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 107, 107, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              🚪 Sign Out
            </button>
          </div>
        </div>
      )}
    </Authenticator>
  );
}
