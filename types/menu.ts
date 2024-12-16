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
  quantity?: number; // Add this line
}

export interface Category {
  id: string;
  name: string;
}

// Add a new interface for cart items
export interface CartItem extends MenuItem {
  quantity: number;
}

