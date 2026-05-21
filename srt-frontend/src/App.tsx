import { useState } from 'react';
import RequestList from './components/RequestList';
import SubmissionForm from './components/SubmissionForm';
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
          <SubmissionForm onSuccess={() => setActiveView('list')} />
        )}
      </main>
    </div>
  );
}

export default App;
