import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f7f7f7;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ChapterTitle = styled.h1`
  color: #388e3c;
  font-size: 2rem;
  margin-bottom: 20px;
  text-align: center;
  text-transform: capitalize;
`;

const Content = styled.div`
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  line-height: 1.8;
  font-size: 1rem;
  color: #333;
  overflow-wrap: break-word;
  word-wrap: break-word;
  white-space: pre-wrap;
  margin-bottom: 20px;
`;

const EditButton = styled.button`
  background: #388e3c;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-right: 10px;

  &:hover {
    background: #2e7d32;
  }

  &:disabled {
    background: #a5d6a7;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 300px;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  line-height: 1.5;
  color: #333;
  resize: vertical;
  background-color: #f9f9f9;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);

  &:focus {
    outline: none;
    border-color: #388e3c;
    box-shadow: 0 0 3px rgba(56, 142, 60, 0.5);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  color: #333;
  background-color: #f9f9f9;

  &:focus {
    outline: none;
    border-color: #388e3c;
    box-shadow: 0 0 3px rgba(56, 142, 60, 0.5);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const ChapterPage = () => {
  const { id } = useParams();
  const [chapter, setChapter] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedChapter, setEditedChapter] = useState({ titulo: '', contenido: '' });

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const response = await axios.get(`https://677f666e0476123f76a63e21.mockapi.io/chapters/${id}`);
        setChapter(response.data);
        setEditedChapter(response.data);
      } catch (error) {
        console.error('Error fetching chapter:', error);
      }
    };

    fetchChapter();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await axios.put(`https://677f666e0476123f76a63e21.mockapi.io/chapters/${id}`, editedChapter);
      setChapter(editedChapter);
      setEditing(false);
    } catch (error) {
      console.error('Error updating chapter:', error);
    }
  };

  if (!chapter) return <div>Loading...</div>;

  return (
    <Container>
      {editing ? (
        <div>
          <Input
            type="text"
            value={editedChapter.titulo}
            onChange={(e) => setEditedChapter({ ...editedChapter, titulo: e.target.value })}
            placeholder="Título del capítulo"
          />
          <TextArea
            value={editedChapter.contenido}
            onChange={(e) => setEditedChapter({ ...editedChapter, contenido: e.target.value })}
            placeholder="Contenido del capítulo"
          />
          <ButtonGroup>
            <EditButton onClick={handleUpdate}>Save</EditButton>
            <EditButton onClick={() => setEditing(false)} style={{ background: '#f44336' }}>
              Cancel
            </EditButton>
          </ButtonGroup>
        </div>
      ) : (
        <>
          <ChapterTitle>{chapter.titulo}</ChapterTitle>
          <Content>{chapter.contenido}</Content>
          <ButtonGroup>
            <EditButton onClick={() => setEditing(true)}>Edit</EditButton>
          </ButtonGroup>
        </>
      )}
    </Container>
  );
};

export default ChapterPage;
