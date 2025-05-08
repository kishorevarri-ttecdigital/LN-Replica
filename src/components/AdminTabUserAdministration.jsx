import React, { useState, useEffect } from 'react';
import useRTDBFunctions from '../hooks/useRealtimeDatabaseFunction';
import './AdminTabUserAdministration.css'


function UserAdministration(){
    const { fetchListOfUsers, updateUserData } = useRTDBFunctions();
    const [userData,setUserData] = useState([])
    const [emails,setEmails] = useState([])
    const [selectedEmail, setSelectedEmail] = useState(emails.length > 0 ? emails[0] : '');
    const [selectedUserData, setSelectedUserData] = useState({});
    const [initialLoad,setInitialLoad] = useState(0)
    const [selectedRole,setSelectedRole]=useState(selectedUserData?.roleName || '')
    const [isButtonDisabled,setIsButtonDisabled] = useState(true);
    const [updateMessage, setUpdateMessage] = useState('');

    const handleUserDataFetch = async()=>{
        const userDataFetched = await fetchListOfUsers();
        if(userDataFetched){
            setUserData(userDataFetched);
            extractEmails(userDataFetched);            
        }
    }

    if(initialLoad===0){
        handleUserDataFetch();
        setInitialLoad(initialLoad+1);        
    }

    const handleChange = (event) => {
        const value = event.target.value;
        setSelectedEmail(value);
        getRoleByEmail(value,userData);
        setIsButtonDisabled(true);
        setUpdateMessage('');
 
      };

      const handleRoleChange = (event) => {
        const value = event.target.value;
        setSelectedRole(value);
        setIsButtonDisabled(false);

      }; 



    //HELPER FUNCTION
    function extractEmails(data) {
        const emails = [];
        for (const key in data) {
            if (data.hasOwnProperty(key) && data[key] && data[key].email) {
                emails.push(data[key].email);
            }
        }
        if(emails){
            setEmails(emails.sort());
            getRoleByEmail(emails.sort()[0],data);
        }
    }
    //HELPER FUNCTION
    function getRoleByEmail(email, userData) {
        for (const userId in userData) {
          // Ensure we are iterating over own properties, not inherited ones
          if (Object.prototype.hasOwnProperty.call(userData, userId)) {
            const user = userData[userId];
            if (user.email === email) {
                setSelectedUserData(
                    {   
                        userId: userId,
                        roleId: user.roleId,
                        roleName: user.roleName
                      }
                );
                setSelectedRole(user.roleName);

            }
          }
        }
      }

    const roleOptions = ["admin","user"]
    
    const handleRoleUpdate = async () =>{
        const userId = selectedUserData["userId"];
        const roleName = selectedRole;
        if(userId && roleName){
            const response = await updateUserData(userId,roleName);
            if(response && response==='OK'){
                setUpdateMessage("User Role has been updated successfully");
                setSelectedRole(roleName);
                handleUserDataFetch();
            }else{
                setUpdateMessage("Update Failed");
            }
        }
    }

    return(
        <>
            <div className='user-admin-container'>
                <label htmlFor="email-select">Select a User:    </label>
                    <select
                        id="email-select"
                        value={selectedEmail}
                        onChange={handleChange}
                    >
                        {emails.length === 0 ? (
                        <option value="" disabled>No emails available</option>
                        ) : (
                        emails.map((email) => (
                            <option key={email} value={email}>
                            {email}
                            </option>
                        ))
                        )}
                    </select>
                
                <label htmlFor="role-select">User Role:    </label>
                    <select
                        id="role-select"
                        value={selectedRole}
                        onChange={handleRoleChange}
                    >
                        {emails.length === 0 ? (
                        <option value="" disabled>None</option>
                        ) : (
                            roleOptions.map((role, roleIndex) => (
                            <option key={roleIndex} value={role}>
                            {role}
                            </option>
                        ))
                        )}
                    </select>
                
                <button disabled={isButtonDisabled} onClick={handleRoleUpdate}>Update</button>
        </div>
        {updateMessage && <div style={{marginTop:'30px'}}>{updateMessage}</div>}
    </>

    )
}

export default UserAdministration;