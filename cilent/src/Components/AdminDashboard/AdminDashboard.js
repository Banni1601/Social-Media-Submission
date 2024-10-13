import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = (trigger) => {
  const [users, setUsers] = useState([]);
  const [Message, setMessage] = useState("");
  const [Message1, setMessage1] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://social-media-submission.vercel.app/api/usersdata");
        const userData = response.data;

        if (userData.length === 0) {
          setMessage("There is No User data in the Database");
        } else {
          setUsers(userData);
          setMessage("");
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setMessage("Failed to load user data.");
      } finally {
        // setMessage1(false); // Hide loading message after the request completes
      }
    };

    fetchUsers();
  }, [trigger]); // Re-run the effect when `trigger` changes

  return (
    <div className="admin-component">
      <h1>Admin Dashboard</h1>
      {Message1 ? <p>{Message}</p> : null}
      {users.length > 0 && (
        <ul>
          {users.slice().reverse().map((user, index) => ( // Reverse the array here
            <li key={index}>
              <h2><span style={{color:"black"}}>User Name:</span> {user.name}</h2>
              <p> <span style={{color:"black"}}>Social handle:</span>  {user.socialMediaHandle}</p>
              <p> <span style={{color:"black"}}>Images</span> </p>
              
              <div className="image-gallery">
                {user.images &&
                  user.images.map((image, i) => (
                    <a
                      key={i}
                      href={image}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={image}
                        alt={`User uploaded ${i}`}
                        className="thumbnail"
                      />
                    </a>
                  ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminDashboard;
