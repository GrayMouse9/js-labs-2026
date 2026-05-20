import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import { MainPage } from './pages/main/index.js';

const root = document.getElementById('root');

const mainPage = new MainPage(root);
mainPage.render();
 