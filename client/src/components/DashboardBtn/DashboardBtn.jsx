import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield } from '@fortawesome/free-solid-svg-icons';
import { isAdmin } from '../../utils/isAdmin'
import { useNavigate } from 'react-router-dom';

const DashboardBtn = () => {
    const navigate = useNavigate();

    if (!isAdmin()) return null; 
  
    return (
        <button
          onClick={() => navigate('/dashboard')}
          className="text-darkText dark:text-lightText font-bold px-4 rounded-md border border-darkBorder dark:border-lightBorder flex items-center justify-center gap-2"
        >
          <FontAwesomeIcon icon={faUserShield} />
          <span>Dashboard</span>
        </button>
      );
}

export default DashboardBtn