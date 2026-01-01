import React from 'react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>MrNewton Frontend BFF API</h1>
        <p>Backend-for-Frontend layer for Activity Provider</p>
      </header>

      <nav style={styles.nav}>
        <a href="http://localhost:3001/api/activity/config/new" style={styles.navLink} target="_blank" rel="noopener noreferrer">
          Create New Activity
        </a>
        <Link to="/analytics" style={styles.navLink}>
          Analytics Dashboard
        </Link>
      </nav>

      <main style={styles.main}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Available API Endpoints</h2>
          <p style={styles.intro}>
            All requests go through the BFF server at <code style={styles.code}>http://localhost:3001</code>
          </p>

          {/* Configuration Endpoints */}
          <div style={styles.endpointGroup}>
            <h3 style={styles.groupTitle}>Configuration Management</h3>
            
            <div style={styles.endpoint}>
              <div style={styles.methodGet}>GET</div>
              <div style={styles.endpointInfo}>
                <div style={styles.path}>/api/activity/config/new</div>
                <div style={styles.description}>HTML form to create a new activity</div>
              </div>
            </div>

            <div style={styles.endpoint}>
              <div style={styles.methodGet}>GET</div>
              <div style={styles.endpointInfo}>
                <div style={styles.path}>/api/activity/config</div>
                <div style={styles.description}>Get all activity configurations</div>
              </div>
            </div>

            <div style={styles.endpoint}>
              <div style={styles.methodGet}>GET</div>
              <div style={styles.endpointInfo}>
                <div style={styles.path}>/api/activity/config/:activityId</div>
                <div style={styles.description}>Get specific activity configuration</div>
              </div>
            </div>

            <div style={styles.endpoint}>
              <div style={styles.methodGet}>GET</div>
              <div style={styles.endpointInfo}>
                <div style={styles.path}>/api/activity/config/params</div>
                <div style={styles.description}>Get configuration parameter schemas</div>
              </div>
            </div>

            <div style={styles.endpoint}>
              <div style={styles.methodPut}>PUT</div>
              <div style={styles.endpointInfo}>
                <div style={styles.path}>/api/activity/config/params</div>
                <div style={styles.description}>Update configuration parameter schemas</div>
              </div>
            </div>
          </div>

          {/* Deployment Endpoints */}
          <div style={styles.endpointGroup}>
            <h3 style={styles.groupTitle}>Deployment Management</h3>
            
            <div style={styles.endpoint}>
              <div style={styles.methodPost}>POST</div>
              <div style={styles.endpointInfo}>
                <div style={styles.path}>/api/activity/deploy</div>
                <div style={styles.description}>Deploy an activity (create instance)</div>
              </div>
            </div>

            <div style={styles.endpoint}>
              <div style={styles.methodGet}>GET</div>
              <div style={styles.endpointInfo}>
                <div style={styles.path}>/api/activity/deploy/:instanceId</div>
                <div style={styles.description}>Get deployment instance details</div>
              </div>
            </div>

            <div style={styles.endpoint}>
              <div style={styles.methodGet}>GET</div>
              <div style={styles.endpointInfo}>
                <div style={styles.path}>/api/activity/deploy/activity/:activityId</div>
                <div style={styles.description}>Get all instances for an activity</div>
              </div>
            </div>
          </div>

          {/* Submission Endpoints */}
          <div style={styles.endpointGroup}>
            <h3 style={styles.groupTitle}>Submission Management</h3>
            
            <div style={styles.endpoint}>
              <div style={styles.methodPost}>POST</div>
              <div style={styles.endpointInfo}>
                <div style={styles.path}>/api/activity/submissions</div>
                <div style={styles.description}>Record a student submission</div>
              </div>
            </div>

            <div style={styles.endpoint}>
              <div style={styles.methodGet}>GET</div>
              <div style={styles.endpointInfo}>
                <div style={styles.path}>/api/activity/submissions/instance/:instanceId</div>
                <div style={styles.description}>Get all submissions for an instance</div>
              </div>
            </div>

            <div style={styles.endpoint}>
              <div style={styles.methodGet}>GET</div>
              <div style={styles.endpointInfo}>
                <div style={styles.path}>/api/activity/submissions/instance/:instanceId/student/:studentId</div>
                <div style={styles.description}>Get submission for specific student</div>
              </div>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Architecture</h2>
          <div style={styles.architecture}>
            <div style={styles.archBox}>React UI<br/><small>localhost:3000</small></div>
            <div style={styles.arrow}>→</div>
            <div style={styles.archBox}>BFF Server<br/><small>localhost:3001</small></div>
            <div style={styles.arrow}>→</div>
            <div style={styles.archBox}>Activity Backend<br/><small>localhost:5000</small></div>
          </div>
          <p style={styles.archDescription}>
            All activity requests flow through the BFF (Backend-for-Frontend) layer,
            which proxies requests to the appropriate backend service.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Quick Start</h2>
          <div style={styles.codeBlock}>
            <pre>
{`# Start BFF Server
npm run server:dev

# Start React UI
npm run dev

# Or start both together
npm run start:all`}
            </pre>
          </div>
        </section>
      </main>

      <footer style={styles.footer}>
        <p>MrNewton Frontend BFF © 2026</p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: '#f5f5f5'
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '40px 20px',
    textAlign: 'center' as const
  },
  nav: {
    backgroundColor: 'white',
    padding: '15px',
    textAlign: 'center' as const,
    borderBottom: '1px solid #ddd',
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    flexWrap: 'wrap' as const
  },
  navLink: {
    padding: '10px 20px',
    backgroundColor: '#2196F3',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: 'bold' as const,
    display: 'inline-block'
  },
  main: {
    flex: 1,
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    padding: '40px 20px'
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  sectionTitle: {
    marginBottom: '20px',
    color: '#333',
    fontSize: '24px',
    borderBottom: '2px solid #2196F3',
    paddingBottom: '10px'
  },
  intro: {
    marginBottom: '30px',
    color: '#666',
    fontSize: '16px'
  },
  code: {
    backgroundColor: '#f5f5f5',
    padding: '3px 8px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '14px',
    color: '#d32f2f'
  },
  endpointGroup: {
    marginBottom: '30px'
  },
  groupTitle: {
    fontSize: '18px',
    color: '#2196F3',
    marginBottom: '15px',
    fontWeight: 'bold' as const
  },
  endpoint: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '15px',
    marginBottom: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e0e0e0'
  },
  methodGet: {
    padding: '5px 12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold' as const,
    marginRight: '15px',
    minWidth: '55px',
    textAlign: 'center' as const
  },
  methodPost: {
    padding: '5px 12px',
    backgroundColor: '#FF9800',
    color: 'white',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold' as const,
    marginRight: '15px',
    minWidth: '55px',
    textAlign: 'center' as const
  },
  methodPut: {
    padding: '5px 12px',
    backgroundColor: '#2196F3',
    color: 'white',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold' as const,
    marginRight: '15px',
    minWidth: '55px',
    textAlign: 'center' as const
  },
  endpointInfo: {
    flex: 1
  },
  path: {
    fontFamily: 'monospace',
    fontSize: '14px',
    color: '#333',
    fontWeight: 'bold' as const,
    marginBottom: '5px'
  },
  description: {
    fontSize: '14px',
    color: '#666'
  },
  architecture: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    padding: '30px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '20px',
    flexWrap: 'wrap' as const
  },
  archBox: {
    padding: '20px 30px',
    backgroundColor: 'white',
    border: '2px solid #2196F3',
    borderRadius: '8px',
    textAlign: 'center' as const,
    fontWeight: 'bold' as const,
    color: '#333'
  },
  arrow: {
    fontSize: '24px',
    color: '#2196F3',
    fontWeight: 'bold' as const
  },
  archDescription: {
    textAlign: 'center' as const,
    color: '#666',
    fontSize: '14px',
    lineHeight: '1.6'
  },
  codeBlock: {
    backgroundColor: '#1e1e1e',
    color: '#d4d4d4',
    padding: '20px',
    borderRadius: '8px',
    overflow: 'auto'
  },
  footer: {
    backgroundColor: '#333',
    color: 'white',
    padding: '20px',
    textAlign: 'center' as const,
    marginTop: 'auto'
  }
};
