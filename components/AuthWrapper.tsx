import { Authenticator } from '@aws-amplify/ui-react';

const formFields = {
  signUp: {
    username: {
      label: 'Email *',
      placeholder: 'Enter your email address',
      required: true,
      order: 1
    },
    given_name: {
      label: 'First Name *',
      placeholder: 'Enter your first name',
      required: true,
      order: 2
    },
    family_name: {
      label: 'Last Name',
      placeholder: 'Enter your last name',
      required: false,
      order: 3
    },
    password: {
      label: 'Password *',
      placeholder: 'Enter your password',
      required: true,
      order: 4
    },
    confirm_password: {
      label: 'Confirm Password *',
      placeholder: 'Confirm your password',
      required: true,
      order: 5
    }
  },
  signIn: {
    username: {
      label: 'Email',
      placeholder: 'Enter your email address'
    },
    password: {
      label: 'Password',
      placeholder: 'Enter your password'
    }
  }
};

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  return (
    <Authenticator
      formFields={formFields}
      signUpAttributes={['given_name', 'family_name']}
      loginMechanisms={['email']}
    >
      {children}
    </Authenticator>
  );
}
