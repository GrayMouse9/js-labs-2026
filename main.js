import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import './style.css';
import { MainPage } from './pages/main/index.js';

const root = document.getElementById('root');

const mainPage = new MainPage(root);
mainPage.render();
 