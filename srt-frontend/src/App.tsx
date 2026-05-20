import { useState } from 'react';
import RequestList from './components/RequestList';
import './App.css';

type ActiveView = 'form' | 'list';

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('list');

  return (
    <div>
      <nav>
        <button
          onClick={() => setActiveView('form')}
          disabled={activeView === 'form'}
        >
          Submit Request
        </button>
        <button
          onClick={() => setActiveView('list')}
          disabled={activeView === 'list'}
        >
          View Requests
        </button>
      </nav>

      <main>
        {activeView === 'list' && (
          <RequestList />
        )}
        {activeView === 'form' && (
          <div>
            <h2>Submit Request</h2>
            <p>Form coming in Phase 2.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
