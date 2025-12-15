import { useParams } from "react-router-dom";

export default function BookDetails() {
  const { id } = useParams();

  return <h2>Detalhes do livro {id}</h2>;
}


/*
import React from "react";
import { Card, Spin, Button, message, Image } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/lib/api";

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  publication: number;
  resume: string;
  coverKey?: string;
}

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [book, setBook] = React.useState<Book | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!id) return;
    fetchBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchBook = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/books/${id}`);
      setBook(response.data);
    } catch (error) {
      message.error("Erro ao carregar detalhes do livro");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!book) {
    return (
      <div style={{ padding: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Voltar
        </Button>
        <p style={{ marginTop: 16 }}>Livro não encontrado.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <Button
        icon={<ArrowLeftOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => navigate(-1)}
      >
        Voltar
      </Button>

      <Card title={book.title}>
        <div style={{ display: "flex", gap: 24 }}>
          <div>
            {book.coverKey ? (
              <Image
                src={book.coverKey}
                width={160}
                height={240}
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: 160,
                  height: 240,
                  backgroundColor: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Sem capa
              </div>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <p><strong>Autor:</strong> {book.author}</p>
            <p><strong>Gênero:</strong> {book.genre}</p>
            <p><strong>Ano de publicação:</strong> {book.publication}</p>

            <p style={{ marginTop: 16 }}>
              <strong>Descrição:</strong><br />
              {book.resume}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
} */
