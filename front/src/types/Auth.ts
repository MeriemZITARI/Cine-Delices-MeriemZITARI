export interface IUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    //role: 'USER' | 'ADMIN';
    isAdmin: boolean;
  }
  
  export interface ILoginCredentials {
    email: string;
    password: string;
  }
  
  export interface IRegisterCredentials {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }

