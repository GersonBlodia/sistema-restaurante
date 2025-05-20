import {create} from 'zustand'

export interface StoreApp{
    isActive: boolean;   
    handleIsActive:()=>void;
}
export const useAppStore= create<StoreApp>()((set,get)=>({
    isActive:false,
    handleIsActive() {
            console.log(get().isActive);
            set((state)=>({isActive:!state.isActive}))
            console.log()
    },
}))