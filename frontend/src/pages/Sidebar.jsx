import { useAuth } from '../context/AuthContext';

const { logout } = useAuth();

<button onClick={logout} className="text-sm text-red-500">Logg ut</button>
