export interface BoardMember {
  userId: number; // ✅ match DB type
  role?: string;
}

export interface Board {
  members: BoardMember[];
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email?: string;
  };
}
