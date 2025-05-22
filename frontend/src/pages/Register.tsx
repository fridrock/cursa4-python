import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Link as MuiLink,
  Container,
  Card,
  CardContent,
} from '@mui/material';
import { authService } from '../services/api';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.register(formData);
      navigate('/login');
    } catch (err) {
      setError('Ошибка при регистрации. Возможно, email уже используется.');
    }
  };

  return (
    <Container 
      maxWidth={false} 
      disableGutters 
      sx={{ 
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        m: 0,
        p: 0
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'background.default',
        }}
      >
        <Card
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: '400px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mx: 2,
            bgcolor: 'background.paper',
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              align="center" 
              gutterBottom 
              sx={{ 
                color: '#ff9800',
                fontWeight: 500,
                mb: 3
              }}
            >
              Регистрация
            </Typography>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  fontSize: '1.1rem',
                  mb: 2,
                  '& .MuiAlert-icon': {
                    color: '#ff9800'
                  }
                }}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                label="Имя"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                margin="normal"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#ff9800',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff9800',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#000000',
                    '&.Mui-focused': {
                      color: '#ff9800',
                    },
                  },
                  mb: 2,
                }}
              />
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                fullWidth
                margin="normal"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#ff9800',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff9800',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#000000',
                    '&.Mui-focused': {
                      color: '#ff9800',
                    },
                  },
                  mb: 2,
                }}
              />
              <TextField
                label="Пароль"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                fullWidth
                margin="normal"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#ff9800',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff9800',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#000000',
                    '&.Mui-focused': {
                      color: '#ff9800',
                    },
                  },
                  mb: 2,
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{ 
                  mt: 2,
                  fontSize: '1.1rem',
                  py: 1.5,
                  bgcolor: '#ff9800',
                  '&:hover': {
                    bgcolor: '#ffc947',
                  },
                }}
              >
                Зарегистрироваться
              </Button>
            </form>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" sx={{ color: '#666666' }}>
                Уже есть аккаунт?{' '}
                <MuiLink 
                  component={Link} 
                  to="/login"
                  sx={{ 
                    color: '#ff9800',
                    textDecoration: 'none',
                    '&:hover': {
                      color: '#ffc947',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Войти
                </MuiLink>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Register; 