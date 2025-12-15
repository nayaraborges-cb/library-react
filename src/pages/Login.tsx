import React from 'react';
import { Card, Button, Input, Typography, message } from 'antd';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

const { Title } = Typography;

interface LoginFormValues {
  username: string;
  password: string;
}

const validationSchema = Yup.object({
  username: Yup.string().required('Informe o usuário'),
  password: Yup.string().required('Informe a senha'),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const initialValues: LoginFormValues = {
    username: '',
    password: '',
  };

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const response = await api.post('/auth/login', values);

      const { token, user } = response.data;

      login(token, user);
      message.success('Login realizado com sucesso');
      navigate('/books');
    } catch (error) {
      message.error('Usuário ou senha inválidos');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#cfedccff',
      }}
    >
      <Card style={{ width: 360 }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          Login
        </Title>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <Input
                name="username"
                placeholder="Usuário"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{ marginBottom: 16 }}
              />

              <Input.Password
                name="password"
                placeholder="Senha"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{ marginBottom: 24 }}
              />

              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                block
              >
                Entrar
              </Button>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
}
