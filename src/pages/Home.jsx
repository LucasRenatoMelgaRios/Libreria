import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import BookCard from '../components/BookCard';
import { useNavigate } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #4CAF50;
  font-size: 2rem;
`;

const StartWritingButton = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: background 0.3s;

  &:hover {
    background: #388E3C;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`;

const NoBooksMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #aaaaaa;
`;

const Footer = styled.footer`
  text-align: center;
  margin-top: 30px;
  padding: 20px;
  color: #000000;
  font-size: 1rem;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    color: #3cff46;
    margin-left: 5px;
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
  max-width: 500px;
  color: white;
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

const Button = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  cursor: pointer;
  margin: 8px 8px 8px 0;

  &:hover {
    background: #388E3C;
  }
`;

const CloseButton = styled(Button)`
  background: #666;

  &:hover {
    background: #555;
  }
`;

const Home = () => {
  const [books, setBooks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newBook, setNewBook] = useState({ 
    nombre: '', 
    capitulos: '0',
    imageUrl: '' 
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('https://677f666e0476123f76a63e21.mockapi.io/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (parseInt(newBook.capitulos) < 0) {
      alert('El número de capítulos no puede ser negativo.');
      return;
    }
    try {
      await axios.post('https://677f666e0476123f76a63e21.mockapi.io/books', newBook);
      setNewBook({ nombre: '', capitulos: '0', imageUrl: '' });
      setShowForm(false);
      fetchBooks();
    } catch (error) {
      console.error('Error creating book:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://677f666e0476123f76a63e21.mockapi.io/books/${id}`);
      setBooks(books.filter(book => book.id !== id));
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Library</Title>
        <StartWritingButton onClick={() => setShowForm(true)}>
          Start Writing
        </StartWritingButton>
      </Header>

      {books.length > 0 ? (
        <Grid>
          {books.map(book => (
            <BookCard 
              key={book.id} 
              book={book} 
              onDelete={() => handleDelete(book.id)}
              onManageChapters={() => navigate(`/books/${book.id}/chapters`)}
            />
          ))}
        </Grid>
      ) : (
        <NoBooksMessage>No books yet, start creating one!</NoBooksMessage>
      )}

      <Modal show={showForm}>
        <Form onSubmit={handleSubmit}>
          <h2 style={{ marginBottom: '20px', color: '#4CAF50' }}>New book</h2>
          <Input
            placeholder="Name"
            value={newBook.nombre}
            onChange={(e) => setNewBook({ ...newBook, nombre: e.target.value })}
          />
          <Input
            placeholder="URL image"
            value={newBook.imageUrl}
            onChange={(e) => setNewBook({ ...newBook, imageUrl: e.target.value })}
          />
          <Button type="submit">Create</Button>
          <CloseButton type="button" onClick={() => setShowForm(false)}>
            Cancel
          </CloseButton>
        </Form>
      </Modal>

      <Footer>
        Made with love to my bunso <FaHeart />
      </Footer>
    </Container>
  );
};

export default Home;
