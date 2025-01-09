import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import ChapterPage from './pages/ChapterPage';
import ManageChapters from './pages/ManageChapters';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f0f7f0;
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books/:id/chapters" element={<ManageChapters />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/chapter/:id" element={<ChapterPage />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
