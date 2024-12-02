// stores/signup.js
import { defineStore } from 'pinia'

export const useSignupStore = defineStore('signup', {
  state: () => ({
    basicInfo: null
  }),
  
  actions: {
    setBasicInfo(info) {
      this.basicInfo = info;
    },
    
    getBasicInfo() {
      return this.basicInfo;
    },
    
    clearBasicInfo() {
      this.basicInfo = null;
    }
  }
})