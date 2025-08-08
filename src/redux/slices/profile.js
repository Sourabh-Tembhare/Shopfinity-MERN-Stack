import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userProfile:localStorage.getItem("profile") ? JSON.parse(localStorage.getItem("profile")) : null,
}

export const profileSlice = createSlice({
    name:"profile",
    initialState,
    reducers:{
        setProfile:(state,value)=>{
            state.userProfile = value.payload;
            localStorage.setItem("profile",JSON.stringify(value.payload))
        },
        removeProfile:(state)=>{
            state.userProfile = null;
            localStorage.removeItem("profile");
        }
    }
})

export const {setProfile,removeProfile} = profileSlice.actions;
export default profileSlice.reducer;