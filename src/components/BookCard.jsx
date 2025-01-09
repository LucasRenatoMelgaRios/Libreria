import styled from 'styled-components';
import { FaTrash, FaBook } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Card = styled.div`
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
  }
`;

const CoverImage = styled.img`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center;
`;

const Content = styled.div`
  padding: 16px;
`;

const Title = styled.h3`
  color: #4CAF50;
  margin: 0 0 8px 0;
  font-size: 1.2rem;
`;

const Info = styled.p`
  color: #aaa;
  margin: 0;
  font-size: 0.9rem;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  color: #FF5252;
  cursor: pointer;
  font-size: 1.5rem;

  &:hover {
    color: #FF1744;
  }
`;

const ManageChaptersButton = styled.button`
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background: #388E3C;
  }
`;

const BookCard = ({ book, onDelete, onManageChapters }) => {

    const navigate = useNavigate();

    return (
      <Card onClick={() => navigate(`/books/${book.id}/chapters`)}>
        <DeleteButton onClick={onDelete}>
          <FaTrash />
        </DeleteButton>
        <CoverImage src={book.imageUrl} />
        <Content>
          <Title>{book.nombre}</Title>
          <Info>Capítulos: {book.capitulos}</Info>
          <ManageChaptersButton onClick={onManageChapters}>
            <FaBook /> Manage book
          </ManageChaptersButton>
        </Content>
      </Card>
    );
  };
export default BookCard;
