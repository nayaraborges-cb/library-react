import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import BooksPage from "../pages/Books";
import BookDetails from "../pages/BooksDetails";
import UsersPage from "../pages/Users";
import { useAuth } from "../contexts/AuthContext";

export default function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />}>
        <Route path="users" element={<UsersPage />} />
        <Route path="books" element={<BooksPage />} />
        <Route path="books/:id" element={<BookDetails />} />
        <Route path="*" element={<Navigate to="/books" />} />
      </Route>
    </Routes>
  );
}



/*import React from 'react';
import {
  Table,
  Button,
  Modal,
  Input,
  message,
  Space,
  Popconfirm,
  Avatar,
  Select,
  Upload,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { Formik, Form as FormikForm, Field } from 'formik';
import * as Yup from 'yup';
import api from '@/lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatarKey?: string;
}

const userValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Nome é obrigatório')
    .min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: Yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  password: Yup.string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .when('isEditing', {
      is: false,
      then: (schema) => schema.required('Senha é obrigatória'),
      otherwise: (schema) => schema.notRequired(),
    }),
  role: Yup.string().required('Função é obrigatória'),
});

export default function UsersPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [uploadingAvatar, setUploadAvatar] = React.useState(false);
  const [previewAvatar, setPreviewAvatar] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error: any) {
      message.error('Erro ao buscar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalVisible(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setPreviewAvatar(user.avatarKey || null);
    setIsModalVisible(true);
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await api.delete(`/users/${id}`);
      message.success('Usuário deletado com sucesso');
      fetchUsers();
    } catch (error: any) {
      message.error('Erro ao deletar usuário');
    }
  };

   const handleUploadAvatar = async (file: File, userId?: number) => {
    if (!userId && !editingUser) {
      message.error('Usuário não encontrado');
      return;
    }

    const id = userId || editingUser?.id;
    const formData = new FormData();
    formData.append('file', file);

    setUploadAvatar(true);
    try {
      const response = await api.post(`/users/${id}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('Avatar enviado com sucesso');
      setPreviewAvatar(response.data.avatarKey);
      fetchUsers();
    } catch (error: any) {
      message.error('Erro ao enviar avatar');
    } finally {
      setUploadAvatar(false);
    }
  };

  const handleSubmitForm = async (values: any) => {
     try {
      const payload = { ...values };
      
      if (editingUser && !payload.password) {
        delete payload.password;
      }

      if (editingUser) {
        await api.patch(`/users/${editingUser.id}`, payload);
        message.success('Usuário atualizado com sucesso');
      } else {
        await api.post('/users', payload);
        message.success('Usuário criado com sucesso');
      }
      setIsModalVisible(false);
      setPreviewAvatar(null);
      fetchUsers();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao salvar usuário');
    }
  };

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatarKey',
      key: 'avatar',
      width: 80,
      render: (avatarKey: string) => (
        <Avatar icon={<span>👤</span>} src={avatarKey} size={40}/>
      ),
    },
    {
      title: 'Usuário',
      dataIndex: 'username',
      key: 'username',
      width: 150,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: 'Função',
      dataIndex: 'role',
      key: 'role',
      width: 200,
      render: (role: string) => (
        <span style={{
          padding: '4px 8px',
          borderRadius: '4px',
          backgroundColor: role === 'admin' ? '#f50' : '#2db7f5',
          color: '#fff',
          fontSize: '12px',
        }}>
          {role === 'admin' ? 'Administrador' : 'Usuário'}
        </span>
      )
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 150,
      render: (_: any, record: User) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
          >
            Editar
          </Button>
          <Popconfirm
            title="Deletar usuário?"
            description="Tem certeza que deseja deletar este usuário?"
            onConfirm={() => handleDeleteUser(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button type="primary" danger size="small" icon={<DeleteOutlined />}>
              Deletar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUser}>
          Novo Usuário
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{x: 800}}
      />

      <Modal
        title={editingUser ? 'Editar Usuário' : 'Novo Usuário'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setPreviewAvatar(null);
        }}
        footer={null}
        width={500}
      >
        <Formik
          initialValues={{
            name: editingUser?.name || '',
            email: editingUser?.email || '',
            password: '',
            role: editingUser?.role || 'user',
            isEditing: !! editingUser,
          }}
          validationSchema={userValidationSchema}
          onSubmit={handleSubmitForm}
        >
          {({ errors, touched, isSubmitting }) => (
            <FormikForm className="space-y-4">
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <Avatar
                  size={80}
                  icon={<span>👤</span>}
                  src={previewAvatar}
                  style={{ marginBottom: '10px' }}
                />
                <div>
                  <Upload
                    maxCount={1}
                    accept="image/*"
                    beforeUpload={(file) => {
                      const isImage = file.type.startsWith('image/');
                      if (!isImage) {
                        message.error('Apenas imagens são permitidas');
                      }
                      const isLt2M = file.size / 1024 / 1024 < 2;
                      if (!isLt2M) {
                        message.error('Imagem deve ser menor que 2MB');
                      }
                      return isImage && isLt2M ? false : Upload.LIST_IGNORE;
                    }}
                    customRequest={({ file }) => {
                      handleUploadAvatar(file as File, editingUser?.id);
                    }}
                  >
                    <Button
                      icon={<UploadOutlined />}
                      loading={uploadingAvatar}
                      disabled={uploadingAvatar}
                    >
                      {uploadingAvatar ? 'Enviando...' : 'Enviar Avatar'}
                    </Button>
                  </Upload>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome *
                </label>
                <Field
                  as={Input}
                  name="name"
                  placeholder="Digite o nome completo"
                  status={errors.name && touched.name ? 'error' : ''}
                />
                {errors.name && touched.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <Field
                  as={Input}
                  name="email"
                  type="email"
                  placeholder="Digite o email"
                  status={errors.email && touched.email ? 'error' : ''}
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Função *
                </label>
                <Field
                  as={Select}
                  name="role"
                  placeholder="Selecione a função"
                  options={[
                    { label: 'Usuário', value: 'user' },
                    { label: 'Administrador', value: 'admin' },
                  ]}
                  status={errors.role && touched.role ? 'error' : ''}
                />
                {errors.role && touched.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha {!editingUser ? '*' : '(deixe em branco para não alterar)'}
                </label>
                <Field
                  as={Input.Password}
                  name="password"
                  placeholder={editingUser ? 'Deixe em branco para não alterar' : 'Digite a senha'}
                  status={errors.password && touched.password ? 'error' : ''}
                />
                {errors.password && touched.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div style={{ marginTop: '24px', textAlign: 'right' }}>
                <Button
                  onClick={() => {
                    setIsModalVisible(false);
                    setPreviewAvatar(null);
                  }}
                  style={{ marginRight: '8px' }}
                >
                  Cancelar
                </Button>
                <Button type="primary" htmlType="submit" loading={isSubmitting}>
                  Salvar
                </Button>
              </div>
            </FormikForm>
          )}
        </Formik>
      </Modal>
    </div>
  );
}
*/