import React, { useState } from "react";

const UserContext = React.createContext();

const UserContextProvider = ({ children }) => {

  const [userContext, setUserContext] = useState({
    username: 'not signed in',
    name: 'No Name',
    age: 0,
    gender: 'male',
    phoneNumber: '0000000000',
    email: 'email@emailsite.com',
    hairDetails: {
      Natural: false,
      Relaxed: false,
      Straight: false,
      Wavy: false,
      Curly: false,
      DeepWave: false,
      LooseCurl: false,
      TightlyCoiled: false,
      Fine: false,
      Medium: false,
      Thick: false
    },
    allergies: '',
    concerns: '',
    business: {
      experience: '',
      specialty: '',
      additionalInfo: '',
      address: '',
      name: '',
      hairWorkedWithDetails: {
        Natural: false,
        Relaxed: false,
        Straight: false,
        Wavy: false,
        Curly: false,
        DeepWave: false,
        LooseCurl: false,
        TightlyCoiled: false,
        Fine: false,
        Medium: false,
        Thick: false
      }
    }
  });

  const updateUserContext = (newContext) => {
    setUserContext((prev) => ({ ...prev, ...newContext }));
  }

  return (
    <UserContext.Provider value={{ ...userContext, updateUserContext }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, UserContextProvider };
