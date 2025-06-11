export interface IUser {
    id: string;
    email: string;
    username: string;
    role: 'USER' | 'ADMIN';
  }
  
  export interface ILoginCredentials {
    email: string;
    password: string;
  }
  
  export interface IRegisterCredentials {
    email: string;
    password: string;
    username: string;
  }
  