import React from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  message,
  Space,
  Popconfirm,
  Image,
  InputNumber,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ClearOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Formik, Form as FormikForm, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
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

interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  year?: number;
}

const bookValidationSchema = Yup.object({
  title: Yup.string().required("Título é obrigatório"),
  author: Yup.string().required("Autor é obrigatório"),
  genre: Yup.string().required("Gênero é obrigatório"),
  publication: Yup.number()
    .required("Ano é obrigatório")
    .min(1000)
    .max(new Date().getFullYear()),
  resume: Yup.string().required("Descrição é obrigatória").min(10),
});

export default function BooksPage() {
  const navigate = useNavigate();

  const [books, setBooks] = React.useState<Book[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [editingBook, setEditingBook] = React.useState<Book | null>(null);

  const [searchText, setSearchText] = React.useState("");
  const [filterYear, setFilterYear] = React.useState<number | null>(null);
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  React.useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBooks = async (params: Partial<PaginationParams> = {}) => {
    setLoading(true);
    try {
      const response = await api.get("/books", {
        params: {
          page: params.page ?? pagination.current,
          limit: params.limit ?? pagination.pageSize,
          search: params.search,
          year: params.year,
        },
      });

      const data = response.data?.data ?? response.data;

      setBooks(Array.isArray(data) ? data : []);
      setPagination((prev) => ({
        ...prev,
        total: response.data?.total ?? data.length ?? 0,
      }));
    } catch {
      message.error("Erro ao buscar livros");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    fetchBooks({ page: 1, search: value, year: filterYear ?? undefined });
  };

  const handleFilterYear = (value: number | null) => {
    setFilterYear(value);
    fetchBooks({ page: 1, search: searchText, year: value ?? undefined });
  };

  const handleClearFilters = () => {
    setSearchText("");
    setFilterYear(null);
    fetchBooks({ page: 1 });
  };

  const handleDeleteBook = async (id: number) => {
    try {
      await api.delete(`/books/${id}`);
      message.success("Livro removido");
      fetchBooks();
    } catch {
      message.error("Erro ao deletar livro");
    }
  };

  const handleSubmitForm = async (values: any) => {
    try {
      if (editingBook) {
        await api.patch(`/books/${editingBook.id}`, values);
        message.success("Livro atualizado");
      } else {
        await api.post("/books", values);
        message.success("Livro criado");
      }
      setIsModalVisible(false);
      setEditingBook(null);
      fetchBooks();
    } catch {
      message.error("Erro ao salvar livro");
    }
  };

  const columns = [
    {
      title: "Capa",
      dataIndex: "coverKey",
      width: 80,
      render: (coverKey: string) =>
        coverKey ? (
          <Image src={coverKey} width={50} height={70} />
        ) : (
          <span>—</span>
        ),
    },
    { title: "Título", dataIndex: "title" },
    { title: "Autor", dataIndex: "author" },
    { title: "Gênero", dataIndex: "genre" },
    { title: "Ano", dataIndex: "publication" },
    {
      title: "Ações",
      render: (_: any, record: Book) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => navigate(`/books/${record.id}`)}
          >
            Detalhes
          </Button>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setEditingBook(record);
              setIsModalVisible(true);
            }}
          >
            Editar
          </Button>
          <Popconfirm
            title="Excluir livro?"
            onConfirm={() => handleDeleteBook(record.id)}
          >
            <Button danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Input
            placeholder="Buscar por título ou autor"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Col>
        <Col span={8}>
          <InputNumber
            placeholder="Ano"
            min={1000}
            max={new Date().getFullYear()}
            value={filterYear}
            onChange={handleFilterYear}
            style={{ width: "100%" }}
          />
        </Col>
        <Col span={8}>
          <Button icon={<ClearOutlined />} onClick={handleClearFilters}>
            Limpar
          </Button>
        </Col>
      </Row>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setEditingBook(null);
          setIsModalVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Novo Livro
      </Button>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={books}
        loading={loading}
        pagination={pagination}
        onChange={(p) =>
          fetchBooks({ page: p.current!, limit: p.pageSize! })
        }
      />

      <Modal
        title={editingBook ? "Editar Livro" : "Novo Livro"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Formik
          initialValues={{
            title: editingBook?.title ?? "",
            author: editingBook?.author ?? "",
            genre: editingBook?.genre ?? "",
            publication: editingBook?.publication ?? new Date().getFullYear(),
            resume: editingBook?.resume ?? "",
          }}
          validationSchema={bookValidationSchema}
          onSubmit={handleSubmitForm}
        >
          {({ isSubmitting }) => (
            <FormikForm>
              <Field as={Input} name="title" placeholder="Título" />
              <Field as={Input} name="author" placeholder="Autor" />
              <Field as={Input} name="genre" placeholder="Gênero" />
              <Field as={InputNumber} name="publication" style={{ width: "100%" }} />
              <Field as={Input.TextArea} name="resume" placeholder="Descrição" />

              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                style={{ marginTop: 16 }}
              >
                Salvar
              </Button>
            </FormikForm>
          )}
        </Formik>
      </Modal>
    </>
  );
}
