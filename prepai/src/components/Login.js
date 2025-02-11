import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import AuthContainer from './AuthContainer';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
});

function Login() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      navigate('/create');
    } catch (error) {
      setError('Failed to login. Please check your credentials.');
    }
    setSubmitting(false);
  };

  return (
    <AuthContainer title="Welcome Back">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <Field
                name="email"
                type="email"
                placeholder="Email"
                className="w-full p-3 rounded-lg bg-gray-900/50 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
              {errors.email && touched.email && 
                <div className="text-red-400 text-sm mt-1">{errors.email}</div>}
            </div>
            <div>
              <Field
                name="password"
                type="password"
                placeholder="Password"
                className="w-full p-3 rounded-lg bg-gray-900/50 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
              {errors.password && touched.password && 
                <div className="text-red-400 text-sm mt-1">{errors.password}</div>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </Form>
        )}
      </Formik>
      <p className="mt-6 text-center text-gray-400">
        Don't have an account?{' '}
        <Link to="/signup" className="text-blue-400 hover:text-blue-300 transition-colors">
          Sign up
        </Link>
      </p>
    </AuthContainer>
  );
}

export default Login;