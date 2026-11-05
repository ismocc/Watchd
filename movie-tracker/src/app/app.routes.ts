import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth-guard';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Home } from './pages/home/home';
import { MovieDetail } from './pages/movie-detail/movie-detail';
import { Diary } from './pages/diary/diary';
import { Lists } from './pages/lists/lists';
import { ListDetail } from './pages/list-detail/list-detail';
import { Profile } from './pages/profile/profile';

export const routes: Routes = [
  { path: 'login', component: Login, canActivate: [guestGuard], title: 'Log in' },
  { path: 'register', component: Register, canActivate: [guestGuard], title: 'Sign up' },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', component: Home, title: 'Watchd' },
      { path: 'movie/:id', component: MovieDetail, title: 'Movie' },
      { path: 'diary', component: Diary, title: 'Diary' },
      { path: 'lists', component: Lists, title: 'Lists' },
      { path: 'lists/:id', component: ListDetail, title: 'List' },
      { path: 'profile', component: Profile, title: 'Profile' },
    ],
  },
  { path: '**', redirectTo: '' },
];
