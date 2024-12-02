import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useUserStore } from "./user";
import { useCartStore } from "./cart";
import { useTicketStore } from "./ticket";

export const useAuthStore = defineStore("auth", () => {
  const storedUser = localStorage.getItem("user");
  const token = ref(localStorage.getItem("token"));
  // const token = storedUser ? JSON.parse(storedUser).token : null
  const user = ref(null);

  console.log("stored token:", token);

  const isAuthenticated = computed(() => {
    return Boolean(token.value);
  });

  function setToken(newToken) {
    token.value = newToken;
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
  }

  function clearToken() {
    token.value = null;
    localStorage.removeItem("token");
  }

  // 로그아웃 함수 추가
  function logout() {
    user.value = null;
    clearToken();

    // 다른 store들 초기화
    const userStore = useUserStore();
    const cartStore = useCartStore();
    const ticketStore = useTicketStore();

    userStore.$reset();
    cartStore.$reset();
    ticketStore.$reset();

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  return {
    token,
    user,
    isAuthenticated,
    setToken,
    clearToken,
    logout,
  };
});
