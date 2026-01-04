import React from 'react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>MrNewton Activity Provider</h1>
        <p>Frontend Interface for Quiz Execution and Analytics</p>
      </header>

      <nav style={styles.nav}>
        <Link to="/analytics" style={styles.navLink}>
          Analytics Dashboard
        </Link>
      </nav>

      <main style={styles.main}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Available API Endpoints</h2>
          <p style={styles.intro}>
            All requests go through Vite proxy to Activity Backend at <code style={styles.code}>http://localhost:5000</code>
          </p>

          {/* Configuration Endpoints */}
          <div style={styles.endpointGroup}>
            <h3 style={styles.groupTitle}>Configuration Management</h3>

            <div style={styles.endpoint}>
              <div style={styles.methodGet}>GET</div>
              <div style={styles.endpointInfo}>
                <div style={styles.path}>/api/config</div>
                <div style={styles.description}>Get all activity configurations</div>
              </div>
            </div>

            <div style={styles.endpoint}>
              <div style={styles.methodGet}>GET</div>
              <div style={styles.endpointInfo}>
                <div style={styles.path}>/api/config/:activityId</div>
                <div style={styles.description}>Get specific activity configuration</div>
              </div>
            </div>

            <div style={styles.endpoint}>
              <div style={styles.methodGet}>GET</div>
              <div style={styles.endpointInfo}>
                <div style={styles.path}>/api/config/params</div>
                <div style={styles.description}>Get configuration parameter schemas</div>
              </div>
            </div>

            <div style={styles.endpoint}>
              <div style={styles.methodPut}>PUT</div>
              <div style={styles.endpointInfo}>
                <div style={styles.path}>/api/config/params</div>
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
                <div style={styles.path}>/api/deploy</div>
                <div style={styles.description}>Deploy an activity (create instance)</div>
              </div>
            </div>

            <div style={styles.endpoint}>
              <div style={styles.methodGet}>GET</div>
              <div style={styles.endpointInfo}>
                <div style={styles.path}>/api/deploy/:instanceId</div>
                <div style={styles.description}>Get deployment instance details</div>
              </div>
            </div>

            <div style={styles.endpoint}>
              <div style={styles.methodGet}>GET</div>
              <div style={styles.endpointInfo}>
                <div style={styles.path}>/api/deploy/activity/:activityId</div>
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
                <div style={styles.path}>/api/submissions</div>
                <div style={styles.description}>Record a student submission</div>
              </div>
            </div>

            <div style={styles.endpoint}>
              <div style={styles.methodGet}>GET</div>
              <div style={styles.endpointInfo}>
                <div style={styles.path}>/api/submissions/instance/:instanceId</div>
                <div style={styles.description}>Get all submissions for an instance</div>
              </div>
            </div>

            <div style={styles.endpoint}>
              <div style={styles.methodGet}>GET</div>
              <div style={styles.endpointInfo}>
                <div style={styles.path}>/api/submissions/instance/:instanceId/student/:studentId</div>
                <div style={styles.description}>Get submission for specific student</div>
              </div>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Architecture</h2>
          <div style={styles.architecture}>
            <div style={styles.archBox}>React UI + Vite<br/><small>localhost:3000</small></div>
            <div style={styles.arrow}>→</div>
            <div style={styles.archBox}>Activity Backend<br/><small>localhost:5000</small></div>
          </div>
          <p style={styles.archDescription}>
            Vite proxy automatically rewrites /api to /api/v1 for backend compatibility.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Quick Start</h2>
          <div style={styles.codeBlock}>
            <pre>
{`# Install dependencies
npm install

# Start development server
npm run dev

# Access at http://localhost:3000`}
            </pre>
          </div>
        </section>
      </main>

      <footer style={styles.footer}>
        <p>MrNewton Activity Provider © 2026</p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: '#ffffff'
  },
  header: {
    backgroundColor: '#ffffff',
    color: '#000000',
    padding: '40px 20px',
    textAlign: 'center' as const,
    borderBottom: '1px solid #e0e0e0'
  },
  nav: {
    backgroundColor: '#ffffff',
    padding: '15px',
    textAlign: 'center' as const,
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    flexWrap: 'wrap' as const
  },
  navLink: {
    padding: '10px 20px',
    backgroundColor: '#000000',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '2px',
    fontWeight: 'normal' as const,
    display: 'inline-block',
    fontSize: '14px'
  },
  main: {
    flex: 1,
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    padding: '40px 20px'
  },
  section: {
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '2px',
    padding: '30px',
    marginBottom: '30px'
  },
  sectionTitle: {
    marginBottom: '20px',
    color: '#000000',
    fontSize: '20px',
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: '10px',
    fontWeight: 'normal' as const
  },
  intro: {
    marginBottom: '30px',
    color: '#666666',
    fontSize: '14px'
  },
  code: {
    backgroundColor: '#f5f5f5',
    padding: '3px 8px',
    borderRadius: '2px',
    fontFamily: 'monospace',
    fontSize: '13px',
    color: '#000000',
    border: '1px solid #e0e0e0'
  },
  endpointGroup: {
    marginBottom: '30px'
  },
  groupTitle: {
    fontSize: '16px',
    color: '#000000',
    marginBottom: '15px',
    fontWeight: 'normal' as const
  },
  endpoint: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '12px',
    marginBottom: '8px',
    backgroundColor: '#ffffff',
    borderRadius: '2px',
    border: '1px solid #e0e0e0'
  },
  methodGet: {
    padding: '4px 10px',
    backgroundColor: '#f5f5f5',
    color: '#000000',
    border: '1px solid #cccccc',
    borderRadius: '2px',
    fontSize: '11px',
    fontWeight: 'normal' as const,
    marginRight: '12px',
    minWidth: '50px',
    textAlign: 'center' as const
  },
  methodPost: {
    padding: '4px 10px',
    backgroundColor: '#000000',
    color: '#ffffff',
    borderRadius: '2px',
    fontSize: '11px',
    fontWeight: 'normal' as const,
    marginRight: '12px',
    minWidth: '50px',
    textAlign: 'center' as const
  },
  methodPut: {
    padding: '4px 10px',
    backgroundColor: '#666666',
    color: '#ffffff',
    borderRadius: '2px',
    fontSize: '11px',
    fontWeight: 'normal' as const,
    marginRight: '12px',
    minWidth: '50px',
    textAlign: 'center' as const
  },
  endpointInfo: {
    flex: 1
  },
  path: {
    fontFamily: 'monospace',
    fontSize: '13px',
    color: '#000000',
    fontWeight: 'normal' as const,
    marginBottom: '5px'
  },
  description: {
    fontSize: '13px',
    color: '#666666'
  },
  architecture: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    padding: '30px',
    backgroundColor: '#f9f9f9',
    border: '1px solid #e0e0e0',
    borderRadius: '2px',
    marginBottom: '20px',
    flexWrap: 'wrap' as const
  },
  archBox: {
    padding: '20px 30px',
    backgroundColor: '#ffffff',
    border: '1px solid #cccccc',
    borderRadius: '2px',
    textAlign: 'center' as const,
    fontWeight: 'normal' as const,
    color: '#000000',
    fontSize: '14px'
  },
  arrow: {
    fontSize: '20px',
    color: '#000000',
    fontWeight: 'normal' as const
  },
  archDescription: {
    textAlign: 'center' as const,
    color: '#666666',
    fontSize: '13px',
    lineHeight: '1.6'
  },
  codeBlock: {
    backgroundColor: '#f5f5f5',
    color: '#000000',
    padding: '20px',
    borderRadius: '2px',
    overflow: 'auto',
    border: '1px solid #e0e0e0',
    fontSize: '13px',
    fontFamily: 'monospace'
  },
  footer: {
    backgroundColor: '#f5f5f5',
    color: '#000000',
    padding: '20px',
    textAlign: 'center' as const,
    marginTop: 'auto',
    borderTop: '1px solid #e0e0e0',
    fontSize: '13px'
  }
};
