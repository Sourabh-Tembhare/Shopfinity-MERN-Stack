import { createSlice } from "@reduxjs/toolkit";


const initialState =  {
    productData: null,
}


export const productEditSlice = createSlice({
    name:"product",
    initialState,
    reducers:{
        setProductData:(state,value)=>{
            state.productData = value.payload;
       
        },
        removeProductData:(state)=>{
            state.productData = null;
        
        }
    }
})

export const  {setProductData,removeProductData} = productEditSlice.actions;
export default productEditSlice.reducer;