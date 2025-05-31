import logo from './logo.svg';
import './App.css';
import { Chat } from 'ben-guryon-bot';


function App() {
  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <div className="logo">האתר שלי</div>
          <nav className="nav">
            <a href="/">בית</a>
            <a href="/about">אודות</a>
            <a href="/contact">פולה</a>
          </nav>
        </div>
      </header>
      <Chat></Chat>
    </div>
  );
}

export default App;
