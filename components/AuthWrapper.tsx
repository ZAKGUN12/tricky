import { Authenticator } from '@aws-amplify/ui-react';

const formFields = {
  signUp: {
    given_name: {
      label: 'First Name *',
      placeholder: 'Enter your first name',
      required: true,
      order: 1
    },
    family_name: {
      label: 'Last Name',
      placeholder: 'Enter your last name',
      required: false,
      order: 2
    },
    email: {
      label: 'Email *',
      placeholder: 'Enter your email',
      required: true,
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
    >
      {children}
    </Authenticator>
  );
}
