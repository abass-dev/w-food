export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: {
      id: string;
      name: string;
    };
  }
  
  export interface Category {
    id: string;
    name: string;
  }
  
  