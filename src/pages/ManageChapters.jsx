import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaBook } from 'react-icons/fa';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  color: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const ChapterList = styled.div`
  background: #00d3c8;
  border-radius: 12px;
  padding: 24px;

  h2 {
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
`;

const NoChaptersMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #ffffff;
  margin-top: 20px;
`;

const ChapterItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #333;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ChapterLink = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  flex: 1;
  
  &:hover {
    color: #66BB6A;
  }
`;

const Button = styled.button`
  background: #41ecd0;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  margin-left: 10px;
  
  &:hover {
    background: #388E3C;
  }
`;

const DeleteButton = styled(Button)`
  background: #f44336;
  
  &:hover {
    background: #d32f2f;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: ${props => props.show ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Form = styled.form`
  background: #e0e0e0;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: 1px solid #a5caa6;
  border-radius: 6px;
  background: #41ecd0;
  color: white;
  
  &:focus {
    outline: none;
    border-color: #66BB6A;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 12px;
  margin: 8px 0;
  border: 1px solid #4CAF50;
  border-radius: 6px;
  background: #333;
  color: white;
  resize: vertical;
  border: 1px solid #a5caa6;
  border-radius: 6px;
  background: #41ecd0;
  color: white;
  &:focus {
    outline: none;
    border-color: #66BB6A;
  }
`;

const ManageChapters = () => {
  const { id } = useParams();
  const [chapters, setChapters] = useState([]);
  const [book, setBook] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newChapter, setNewChapter] = useState({ titulo: '', contenido: '' });

  useEffect(() => {
    fetchBookAndChapters();
  }, [id]);

  const fetchBookAndChapters = async () => {
    try {
      // Fetch book details
      const bookResponse = await axios.get(`https://677f666e0476123f76a63e21.mockapi.io/books/${id}`);
      setBook(bookResponse.data);

      // Fetch chapters for the book
      const chaptersResponse = await axios.get(`https://677f666e0476123f76a63e21.mockapi.io/chapters?libroId=${id}`);
      setChapters(chaptersResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddChapter = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://677f666e0476123f76a63e21.mockapi.io/chapters', {
        ...newChapter,
        libroId: id
      });
      setNewChapter({ titulo: '', contenido: '' });
      setShowForm(false);
      fetchBookAndChapters();
    } catch (error) {
      console.error('Error creating chapter:', error);
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este capítulo?')) {
      try {
        await axios.delete(`https://677f666e0476123f76a63e21.mockapi.io/chapters/${chapterId}`);
        fetchBookAndChapters();
      } catch (error) {
        console.error('Error deleting chapter:', error);
      }
    }
  };

  return (
    <Container>
      <Header>
        <Link to="/" style={{ color: '#4CAF50', textDecoration: 'none' }}>
          ← Back
        </Link>
        <Button onClick={() => setShowForm(true)}>
          Add chapter
        </Button>
      </Header>

      <ChapterList>
        <h2>
          Chapters of {book?.nombre || 'Loading...'} <FaBook />
        </h2>
        {chapters.length > 0 ? (
          chapters.map(chapter => (
            <ChapterItem key={chapter.id}>
              <ChapterLink to={`/chapter/${chapter.id}`}>
                {chapter.titulo}
              </ChapterLink>
              <div>
                <DeleteButton onClick={() => handleDeleteChapter(chapter.id)}>
                  Eliminar
                </DeleteButton>
              </div>
            </ChapterItem>
          ))
        ) : (
          <NoChaptersMessage>No chapters yet, start writing something :)</NoChaptersMessage>
        )}
      </ChapterList>

      <Modal show={showForm}>
        <Form onSubmit={handleAddChapter}>
          <h2 style={{ color: '#4CAF50', marginBottom: '20px' }}>Add chapter</h2>
          <Input
            placeholder="Títle of the chapter"
            value={newChapter.titulo}
            onChange={(e) => setNewChapter({ ...newChapter, titulo: e.target.value })}
          />
          <TextArea
            placeholder="Content of the chapter, you can edit it later"
            value={newChapter.contenido}
            onChange={(e) => setNewChapter({ ...newChapter, contenido: e.target.value })}
          />
          <Button type="submit">Save</Button>
          <Button type="button" onClick={() => setShowForm(false)} style={{ background: '#666' }}>
            Cancel
          </Button>
        </Form>
      </Modal>
    </Container>
  );
};

export default ManageChapters;
