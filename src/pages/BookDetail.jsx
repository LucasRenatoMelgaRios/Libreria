import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #1a1a1a;
  min-height: 100vh;
  color: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const BookInfo = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 30px;
`;

const CoverImage = styled.div`
  width: 300px;
  height: 400px;
  background-image: url(${props => props.image || 'https://via.placeholder.com/300x400'});
  background-size: cover;
  background-position: center;
  border-radius: 12px;
`;

const Details = styled.div`
  flex: 1;
`;

const BookTitle = styled.h1`
  color: #4CAF50;
  margin-bottom: 16px;
`;

const ChapterList = styled.div`
  background: #2a2a2a;
  border-radius: 12px;
  padding: 24px;
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
  color: #4CAF50;
  text-decoration: none;
  flex: 1;
  
  &:hover {
    color: #66BB6A;
  }
`;

const Button = styled.button`
  background: #4CAF50;
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
  background: #2a2a2a;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: 1px solid #4CAF50;
  border-radius: 6px;
  background: #333;
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
  
  &:focus {
    outline: none;
    border-color: #66BB6A;
  }
`;

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newChapter, setNewChapter] = useState({ titulo: '', contenido: '' });

  useEffect(() => {
    fetchBookAndChapters();
  }, [id]);

  const fetchBookAndChapters = async () => {
    try {
      const bookResponse = await axios.get(`https://677f666e0476123f76a63e21.mockapi.io/books/${id}`);
      const chaptersResponse = await axios.get(`https://677f666e0476123f76a63e21.mockapi.io/chapters?libroId=${id}`);
      setBook(bookResponse.data);
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

  if (!book) return <div>Loading...</div>;

  return (
    <Container>
      <Header>
        <Link to="/" style={{ color: '#4CAF50', textDecoration: 'none' }}>
          ← Volver
        </Link>
        <Button onClick={() => setShowForm(true)}>
          Agregar Capítulo
        </Button>
      </Header>

      <BookInfo>
        <CoverImage image={book.imageUrl} />
        <Details>
          <BookTitle>{book.nombre}</BookTitle>
          <p>Capítulos: {chapters.length}</p>
        </Details>
      </BookInfo>

      <ChapterList>
        <h2 style={{ color: '#4CAF50', marginBottom: '20px' }}>Capítulos</h2>
        {chapters.map(chapter => (
          <ChapterItem key={chapter.id}>
            <ChapterLink to={`/chapter/${chapter.id}`}>
              {chapter.titulo}
            </ChapterLink>
            <div>
              <Button onClick={() => window.location.href = `/chapter/${chapter.id}`}>
                Edit
              </Button>
              <DeleteButton onClick={() => handleDeleteChapter(chapter.id)}>
                Delete
              </DeleteButton>
            </div>
          </ChapterItem>
        ))}
      </ChapterList>

      <Modal show={showForm}>
        <Form onSubmit={handleAddChapter}>
          <h2 style={{ color: '#4CAF50', marginBottom: '20px' }}>Nuevo Capítulo</h2>
          <Input
            placeholder="Título del capítulo"
            value={newChapter.titulo}
            onChange={(e) => setNewChapter({ ...newChapter, titulo: e.target.value })}
          />
          <TextArea
            placeholder="Contenido del capítulo"
            value={newChapter.contenido}
            onChange={(e) => setNewChapter({ ...newChapter, contenido: e.target.value })}
          />
          <Button type="submit">Guardar</Button>
          <Button type="button" onClick={() => setShowForm(false)} style={{ background: '#666' }}>
            Cancelar
          </Button>
        </Form>
      </Modal>
    </Container>
  );
};

export default BookDetail;