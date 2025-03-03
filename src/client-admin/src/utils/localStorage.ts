export const loadAuthState = () => {
    try {
      const serializedState = localStorage.getItem("authState");
      if (!serializedState) return undefined;
      const state = JSON.parse(serializedState);
  
      const expirationTime = state.expiration;
      if (expirationTime && Date.now() > expirationTime) {
        localStorage.removeItem("authState");
        return undefined;
      }
  
      return state;
    } catch (e) {
      console.error("Could not load auth state:", e);
      return undefined;
    }
  };
  
  export const saveAuthState = (state: any) => {
    try {
      // Set an expiration time (e.g., 24 hours from now)
      const expiration = Date.now() + 24 * 60 * 60 * 1000;
      const stateToSave = { ...state, expiration };
      localStorage.setItem("authState", JSON.stringify(stateToSave));
    } catch (e) {
      console.error("Could not save auth state:", e);
    }
  };
  