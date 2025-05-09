import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from "./context/AuthContext";
import { ChatProvider } from './context/ChatContext';
import { SessionProvider } from './context/SessionContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <SessionProvider>
        <ChatProvider>
                <App />
        </ChatProvider>
      </SessionProvider>
    </AuthContextProvider>
  </StrictMode>,
    );

    