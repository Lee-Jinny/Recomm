import FirstView from "@/views/FirstView.vue";
import LoginView from "@/views/LoginView.vue";
import MovieView from "@/views/MovieView.vue";
import TicketView from "@/views/TicketView.vue";
import UserDetailView from "@/views/UserDetailView.vue";
import SignupBasic from "@/components/login/SignupBasic.vue";
import SignupProfile from "@/components/login/SignupProfile.vue";
import { createRouter, createWebHistory } from "vue-router";
import MovieList from "@/components/movie/MovieList.vue";
import MovieDetail from "@/components/movie/MovieDetail.vue";
import MovieSearch from "@/components/movie/MovieSearch.vue";
import MovieReview from "@/components/movie/MovieReview.vue";
import SharedTicket from "@/components/kakao/SharedTicket.vue";
import axios from "axios";
import KakaoShare from "@/components/kakao/KakaoShare.vue";
import LocalLogout from "@/components/login/LocalLogout.vue";
import UserAuthen from '@/components/user/UserAuthen.vue';
import UserAuthenUpdate from '@/components/user/UserAuthenUpdate.vue';
import UserAuthenDelete from '@/components/user/UserAuthenDelete.vue';
import UserAuthenFinish from '@/components/user/UserAuthenFinish.vue';
import FirstDescription from "@/components/first/FirstDescription.vue";
import UserSavedMovie from '@/components/user/UserSavedMovie.vue';
import UserTicket from '@/components/user/UserTicket.vue';
import { useLoginStore } from "@/stores/login";

// 영화 데이터 비동기 타이밍 처리 1
const checkMovieExists = async (movieId, token) => {
  try {
    const response = await axios.get(
      `http://localhost:8000/api/v1/movies/check-movie/${movieId}/`,
      {
        headers: {
          'Authorization': `Token ${token}`
        }
      }
    )
    return true
  } catch (err) {
    return false
  }
}

// 영화 데이터 db에 저장되는 거 확인하기
const waitForMovieSave = async (movieId, token) => {
  let attempts = 0
  const maxAttempts = 10

  while (attempts < maxAttempts) {
    const exists = await checkMovieExists(movieId, token)
    if (exists) {
      return true
    } 
    await new Promise(resolve => setTimeout(resolve, 1000))
    attempts++
  }
  return false
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: FirstView,
      name: "first",
    },
    {
      path:'/recomm',
      name:'firstDescription',
      component: FirstDescription,
    },
    {
      path: "/login",
      name: "LoginView",
      component: LoginView,
    },
    // 회원가입 라우트 추가
    {
      path: "/signup",
      name: "SignupBasic",
      component: SignupBasic,
    },
    {
      path: "/signup/profile",
      name: "SignupProfile",
      component: SignupProfile,
      beforeEnter: (to, from, next) => {
        if (from.name === "SignupBasic") {
          next();
        } else {
          next("/signup");
        }
      },
    },
    {
      path: "/movie",
      name: "MovieView",
      component: MovieView,
    },
    {
      path: "/tiket",
      name: "TicketView",
      component: TicketView,
    },
    {
      // 티켓 생성 라우트 추가
      path: "/ticket/create/:id",
      name: "ticket-create",
      component: TicketView,
    },
    {
      path: "/user",
      name: "UserDetailView",
      component: UserDetailView,
      beforeEnter: (to, from, next) => {
        const loginStore = useLoginStore(); // 로그인 상태 가져오기
        // 로그인 상태가 아니라면 로그인 페이지로 리다이렉트
        if (!loginStore.isLogin) {
          next({ name: 'LoginView' });
        } else {
          next(); // 로그인 상태라면 페이지 접근 허용
        }
      },
    },
    {
      path: "/movie/list/:keyword",
      name: "MovieList",
      component: MovieList,
      props: true
    },
    {
      path: "/movie/detail/:movie_id",
      name: "MovieDetail",
      component: MovieDetail,
    },
    {
      path: "/movie/search",
      name: "MovieSearch",
      component: MovieSearch,
    },
    {
      path: "/movie/review/:movieid",
      name: "MovieReview",
      component: MovieReview,
      beforeEnter: async (to, from, next) => {
        if (from.name === 'MovieDetail') {
          const token = localStorage.getItem('token')

          // 로딩 상태 표시
          const loadingEl = document.createElement('div')
          loadingEl.id = 'route-loading'
          loadingEl.innerHTML = `
            <div style="
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0,0,0,0.5);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 9999;
            ">
              <div style="
                background: white;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
              ">
                <p>영화 정보를 저장하는 중입니다...</p>
                <p>잠시만 기다려주세요.</p>
              </div>
            </div>
          `
          document.body.appendChild(loadingEl)

          try {
            const saved = await waitForMovieSave(to.params.movieid, token)
            document.body.removeChild(loadingEl)

            if (saved) {
              next()
            } else {
              alert('영화 정보 저장에 실패했습니다. 다시 시도해주세요.')
              next(false)
            }
          } catch (err) {
            document.body.removeChild(loadingEl)
            console.error('라우터 가드 에러:', err)
            next(false)
          }
        } else {
          next()
        }
      }
    },
    {
      path: "/shared-ticket/:id",
      name: "SharedTicket",
      component: SharedTicket
    },
    {
      path:'/kakao-ticket',
      name: 'KakaoShare',
      component:KakaoShare
    },
    {
      path: "/login",
      name: "Logout",
      component: LocalLogout,
    },

    // 유저
    {
      path: '/user/Authen',
      name: 'userAuthen',
      component: UserAuthen,
      beforeEnter: (to, from, next) => {
        // UserDetailView에서만 접근 가능
        if (from.name === 'UserDetailView') {
          next();
        } else {
          next('/user');
        }
      }
    },
    {
      path: '/user/update',
      name: 'UserAuthenUpdate',
      component: UserAuthenUpdate,
      beforeEnter: (to, from, next) => {
        // userAuthen에서만 접근 가능
        if (from.name === 'userAuthen') {
          next();
        } else {
          next('/user');
        }
      }
    },
    {
      path: '/user/delete',
      name: 'UserAuthenDelete',
      component: UserAuthenDelete,
      beforeEnter: (to, from, next) => {
        // userAuthen에서만 접근 가능
        if (from.name === 'userAuthen' || from.name === 'UserAuthenUpdate') {
          next();
        } else {
          next('/user');
        }
      }
    },
    {
      path: '/user/204',
      name: 'UserAuthenFinish',
      component: UserAuthenFinish,
      // beforeEnter: (to, from, next) => {
      //   // update나 delete에서만 접근 가능
      //   if (from.name === 'UserAuthenDelete') {
      //     next();
      //   } else {
      //     next('/user');
      //   }
      // }
    },
    {
      path: '/user/saved',
      name: 'UserSavedMovie',
      component: UserSavedMovie,
      beforeEnter: (to, from, next) => {
        // UserDetailView에서만 접근 가능
        if (from.name === 'UserDetailView') {
          next();
        } else {
          next('/user');
        }
      }
    },
    {
      path: '/user/tickets',
      name: 'UserTicket',
      component: UserTicket,
      beforeEnter: (to, from, next) => {
        // UserDetailView에서만 접근 가능
        if (from.name === 'UserDetailView') {
          next();
        } else {
          next('/user');
        }
      }
    }
    
  ],
});

export default router;
