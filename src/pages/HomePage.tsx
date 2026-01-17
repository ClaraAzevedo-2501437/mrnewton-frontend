import React from 'react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Mr Newton</h1>

      <section style={{ ...styles.section, borderLeft: '4px solid #a8d5ba' }}>
        <h2 style={styles.sectionTitle}>Student Use Cases</h2>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            <Link to="/quiz-instances" style={styles.link}>
              Take Quiz
            </Link>
          </li>
        </ul>
      </section>

      <section style={{ ...styles.section, borderLeft: '4px solid #a2c4e8' }}>
        <h2 style={styles.sectionTitle}>Teacher Use Cases</h2>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            <Link to="/config" style={styles.link}>
              Get Config Params
            </Link>
          </li>
          <li style={styles.listItem}>
            <Link to="/config" style={styles.link}>
              Create/Update Config Params
            </Link>
          </li>
          <li style={styles.listItem}>
            <Link to="/create-quiz" style={styles.link}>
              Create Quiz
            </Link>
          </li>
          <li style={styles.listItem}>
            <Link to="/deploy-quiz" style={styles.link}>
              Deploy Quiz
            </Link>
          </li>
          <li style={styles.listItem}>
            <Link to="/instance-details" style={styles.link}>
              Get Instance Details
            </Link>
          </li>
          <li style={styles.listItem}>
            <Link to="/view-instances" style={styles.link}>
              Get All Instances of an Activity
            </Link>
          </li>
          <li style={styles.listItem}>
            <Link to="/submissions" style={styles.link}>
              Get Submissions for an InstanceID
            </Link>
          </li>
          <li style={styles.listItem}>
            <Link to="/submissions" style={styles.link}>
              Get Student Submissions for an InstanceID
            </Link>
          </li>
          <li style={styles.listItem}>
            <Link to="/contract" style={styles.link}>
              Get/Update Analytics Contract
            </Link>
          </li>
          <li style={styles.listItem}>
            <Link to="/analytics" style={styles.link}>
              View Dashboard
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
};


const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fafafa',
    minHeight: '100vh'
  },
  header: {
    fontSize: '32px',
    fontWeight: 'bold' as const,
    marginBottom: '60px',
    color: '#2c3e50',
    padding: '20px',
    backgroundColor: '#e8f4f8',
    borderRadius: '8px',
    textAlign: 'center' as const
  },
  section: {
    marginBottom: '30px',
    backgroundColor: '#ffffff',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold' as const,
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: '2px solid #e0e0e0',
    color: '#2c3e50'
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  listItem: {
    padding: '10px 15px',
    fontSize: '16px',
    color: '#2c3e50',
    borderLeft: '3px solid transparent',
    transition: 'all 0.2s ease',
    cursor: 'default'
  },
  link: {
    color: '#5a9fd4',
    textDecoration: 'none',
    cursor: 'pointer',
    fontWeight: '500' as const
  }
};
