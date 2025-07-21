"use client"

export default function TestPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0A0A23', 
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: '20px',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
        ✅ Test Page
      </h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem', textAlign: 'center', opacity: 0.8 }}>
        Your Next.js application is working perfectly!
      </p>
      
      <div style={{ 
        backgroundColor: '#232336', 
        padding: '2rem', 
        borderRadius: '12px',
        maxWidth: '600px',
        width: '100%',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#8B5CF6' }}>
          🎉 Success!
        </h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
            <span style={{ color: '#10B981', marginRight: '0.5rem' }}>✓</span>
            Next.js 14 App Router
          </li>
          <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
            <span style={{ color: '#10B981', marginRight: '0.5rem' }}>✓</span>
            TypeScript Configuration
          </li>
          <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
            <span style={{ color: '#10B981', marginRight: '0.5rem' }}>✓</span>
            Development Server
          </li>
          <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
            <span style={{ color: '#10B981', marginRight: '0.5rem' }}>✓</span>
            Hot Reload
          </li>
          <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
            <span style={{ color: '#10B981', marginRight: '0.5rem' }}>✓</span>
            Production Ready
          </li>
        </ul>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <a 
          href="/" 
          style={{
            backgroundColor: '#8B5CF6',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
            transition: 'background-color 0.2s ease',
            cursor: 'pointer'
          }}
          className="hover:bg-purple-600"
        >
          ← Back to Home
        </a>
        <a 
          href="/auth" 
          style={{
            backgroundColor: '#232336',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
            transition: 'background-color 0.2s ease',
            cursor: 'pointer'
          }}
          className="hover:bg-gray-700"
        >
          Try Auth Page
        </a>
      </div>
    </div>
  );
} 