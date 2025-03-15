
const DashboardContent = () => {
  return (
    <section className="w-full h-full bg-lightBackground dark:bg-darkBackground rounded-md text-darkText dark:text-lightText">
     My dashboard!

    </section>
  )
}

export default DashboardContent




// import React, { useEffect, useState } from 'react';

// const DashboardContent = () => {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const token = sessionStorage.getItem("authToken"); 

//         const response = await fetch("http://127.0.0.1:8000/dashboard/users", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await response.json();

//         if (response.ok) {
//           setUsers(data);
//         } else {
//           console.error("Error fetching users:", data.message);
//         }
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };

//     fetchUsers();
//   }, []);

//   return (
//     <div>
//       <h2>All Users</h2>
//       <ul>
//         {users.length > 0 ? (
//           users.map((user) => (
//             <li key={user._id}>
//               {user.username} - {user.email}
//             </li>
//           ))
//         ) : (
//           <p>No users found.</p>
//         )}
//       </ul>
//     </div>
//   );
// };

// export default DashboardContent;
