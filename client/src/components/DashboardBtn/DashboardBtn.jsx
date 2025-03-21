import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield } from '@fortawesome/free-solid-svg-icons';
import { isAdmin } from '../../utils/isAdmin'
import { useNavigate } from 'react-router-dom';

//navigate to the admin dashboard (admins) 
const DashboardBtn = () => {
    const navigate = useNavigate();

    if (!isAdmin()) return null; 
  
    return (
        <button
          onClick={() => navigate('/dashboard')}
          className="text-darkText dark:text-lightText font-bold border-b border-darkBorder dark:border-lightBorder flex items-center justify-center gap-2"
        >
          <FontAwesomeIcon icon={faUserShield} />
          <span>Dashboard</span>
        </button>
      );
}

export default DashboardBtn